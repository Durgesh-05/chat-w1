import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { requireAuth, verifyToken } from '@clerk/express';
import { prisma } from './prisma';

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 8000;
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requireAuth());

io.use(async (socket: Socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error('Authentication token missing');

    const clerkUser = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    socket.data.user = clerkUser;
    next();
  } catch (err) {
    next(new Error('Authentication failed on SocketIO'));
  }
});

io.on('connection', (socket: Socket) => {
  console.log('User Connected with ID: ' + socket.id);

  socket.on('disconnect', (reason) => {
    console.log(
      'User Disconnected with ID: ' + socket.id + ' Reason: ' + reason
    );
  });

  socket.on('error', (err: Error) => {
    console.error('Socket error:', err.message);
  });
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.get('/', (req, res) => {
  res.status(200).json('Hello World!');
});

httpServer.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
