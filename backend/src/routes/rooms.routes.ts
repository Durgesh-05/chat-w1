import { Router, Request, Response } from 'express';
import { clerkMiddleware, getAuth, requireAuth } from '@clerk/express';
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

      const user = await prisma.user.findUnique({
        where: {
          email: sessionClaims.email as string,
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          status: 404,
          message: 'User not found',
        });
        return;
      }

      const rooms = await prisma.room.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
        include: {
          users: true,
          messages: true,
        },
      });

      res.status(200).json({
        success: true,
        status: 200,
        message: rooms.length ? 'Rooms found successfully' : 'No rooms found',
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

      const user = await prisma.user.findUnique({
        where: {
          email: sessionClaims.email as string,
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          status: 404,
          message: 'User not found',
        });
        return;
      }

      const room = await prisma.room.create({
        data: {
          users: {
            connect: [{ id: user.id }],
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

export default router;
