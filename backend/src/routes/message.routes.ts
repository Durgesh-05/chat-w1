import { Router, Request, Response } from 'express';
import { getAuth, requireAuth, clerkClient } from '@clerk/express';
import prisma from '../prisma';
import { redis } from '../services/redis';

const router = Router();
router.use(requireAuth());

router.post('/', async (req: Request, res: Response) => {
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

    const {
      roomId,
      text,
      senderId,
    }: { roomId: string; text: string; senderId: string } = req.body;
    const userMetadata = await clerkClient.users.getUser(senderId);
    const userId: string = userMetadata.privateMetadata.userId as string;

    await prisma.message.create({
      data: {
        content: text,
        senderId: userId,
        roomId: roomId,
      },
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Message Saved Successfully',
    });
    return;
  } catch (error) {
    console.error('Error Saving messages:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/:roomId', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    // caching messages before querying into db
    const cachedMessages = await redis.lrange(`messages:${roomId}`, 0, 99);

    if (cachedMessages && cachedMessages.length > 0) {
      const parsedMessages = cachedMessages.map((msg) => JSON.parse(msg));

      const sortedMessages = parsedMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      console.log(
        `Retrieved ${sortedMessages.length} messages from cache for room ${roomId}`
      );

      res.status(200).json({
        success: true,
        status: 200,
        message: 'Messages retrieved from cache',
        messages: sortedMessages,
        source: 'cache',
      });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        roomId: roomId,
      },
      include: {
        sender: true,
        room: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (messages.length > 0) {
      const pipeline = redis.pipeline();

      pipeline.del(`messages:${roomId}`);

      // Adding messages to cache
      messages.forEach((msg) => {
        pipeline.lpush(`messages:${roomId}`, JSON.stringify(msg));
      });

      // Executing pipeline
      await pipeline.exec();
      console.log(`Cached ${messages.length} messages for room ${roomId}`);
    }

    res.status(200).json({
      success: true,
      status: 200,
      message:
        messages?.length > 0
          ? 'Message found successfully'
          : 'No Message found',
      messages,
    });
    return;
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
