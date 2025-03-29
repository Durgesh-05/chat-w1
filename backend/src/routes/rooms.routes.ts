import { Router, Request, Response } from 'express';
import { clerkMiddleware, getAuth, requireAuth } from '@clerk/express';
import prisma from '../prisma';

const router = Router();
router.use(requireAuth());

router.route('/').get(async (req: Request, res: Response) => {
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

    const rooms = await prisma.room.findMany({
      where: {
        users: {
          some: {
            email: sessionClaims.email as string,
          },
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });

    if (rooms.length === 0) {
      res.status(200).json({
        success: true,
        status: 200,
        message: 'No rooms found',
        rooms: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Rooms found successfully',
      rooms,
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
