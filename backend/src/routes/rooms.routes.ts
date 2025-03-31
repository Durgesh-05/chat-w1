import { Router, Request, Response } from 'express';
import {
  clerkMiddleware,
  getAuth,
  requireAuth,
  clerkClient,
} from '@clerk/express';
import prisma from '../prisma';

const router = Router();
router.use(requireAuth());

router
  .route('/')
  .get(async (req: Request, res: Response) => {
    try {
      const { sessionClaims } = getAuth(req);
      if (!sessionClaims?.email) {
        res.status(401).json({
          success: false,
          status: 401,
          message: 'Unauthorized',
        });
        return;
      }

      const userMetadata = await clerkClient.users.getUser(sessionClaims.sub);
      const userId: string = userMetadata.privateMetadata.userId as string;

      const rooms = await prisma.room.findMany({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          users: true,
          messages: true,
        },
      });
      const filteredRooms = rooms.filter((room) => room.users.length >= 2);

      res.status(200).json({
        success: true,
        status: 200,
        message:
          filteredRooms.length > 0
            ? 'Rooms found successfully'
            : 'No rooms found',
        rooms,
      });
      return;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  })
  .post(async (req: Request, res: Response) => {
    try {
      const { sessionClaims } = getAuth(req);
      if (!sessionClaims?.email) {
        res.status(401).json({
          success: false,
          status: 401,
          message: 'Unauthorized',
        });
        return;
      }

      const userMetadata = await clerkClient.users.getUser(sessionClaims.sub);
      const userId: string = userMetadata.privateMetadata.userId as string;

      // const user = await prisma.user.findUnique({
      //   where: {
      //     email: sessionClaims.email as string,
      //   },
      // });

      // if (!user) {
      //   res.status(404).json({
      //     success: false,
      //     status: 404,
      //     message: 'User not found',
      //   });
      //   return;
      // }

      const room = await prisma.room.create({
        data: {
          users: {
            connect: [{ id: userId }],
          },
        },
      });
      res.status(201).json({
        success: true,
        status: 201,
        message: 'Room created successfully',
        room,
      });
      return;
    } catch (error) {
      console.error('Error Creating rooms:', error);
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

router.post('/join', async (req: Request, res: Response) => {
  try {
    const { sessionClaims } = getAuth(req);
    if (!sessionClaims?.email) {
      res
        .status(401)
        .json({ success: false, status: 401, message: 'Unauthorized' });
      return;
    }

    const userMetadata = await clerkClient.users.getUser(sessionClaims.sub);
    const userId: string = userMetadata.privateMetadata.userId as string;

    // const user = await prisma.user.findUnique({
    //   where: { email: sessionClaims.email as string },
    // });

    // if (!user) {
    //   res
    //     .status(404)
    //     .json({ success: false, status: 404, message: 'User not found' });
    //   return;
    // }

    const { roomId } = req.body;
    if (!roomId) {
      res
        .status(400)
        .json({ success: false, status: 400, message: 'Room ID is required' });
      return;
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { users: true },
    });

    if (!room) {
      res
        .status(404)
        .json({ success: false, status: 404, message: 'Room not found' });
      return;
    }

    const isAlreadyInRoom = room.users.some((u) => u.id === userId);
    if (isAlreadyInRoom) {
      res.status(200).json({
        success: true,
        status: 200,
        message: 'Already in the room',
        room,
      });
      return;
    }

    await prisma.room.update({
      where: { id: roomId },
      data: { users: { connect: { id: userId } } },
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Joined room successfully',
      room,
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
