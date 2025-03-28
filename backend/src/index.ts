import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '@clerk/express';
import prisma from './prisma';
import { Webhook } from 'svix';
import roomsRouter from './routes/rooms.routes';

const app = express();
const httpServer = createServer(app);
const port = 8000;
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(requireAuth());
// Webhook is public url so I cannot use require auth in all routes

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
  console.log('Disconnecting prisma db');
  await prisma.$disconnect();
  process.exit(0);
});

app.get('/', (req, res) => {
  res.status(200).json('Hello World!');
});

app.post('/api/webhooks', async (req, res) => {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env'
    );
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headers = req.headers;
  const payload = req.body;
  const svix_id = headers['svix-id'];
  const svix_timestamp = headers['svix-timestamp'];
  const svix_signature = headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    res.status(400).json({
      success: false,
      message: 'Error: Missing svix headers',
    });
    return;
  }

  let evt: any;
  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': svix_id as string,
      'svix-timestamp': svix_timestamp as string,
      'svix-signature': svix_signature as string,
    });
  } catch (err: any) {
    console.log('Error: Could not verify webhook:', err.message);
    return void res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (evt.type === 'user.created') {
    const { email_addresses, first_name, last_name, profile_image_url } =
      evt.data;
    console.log(
      'Webhook Recieved data: ',
      email_addresses[0].email_address,
      first_name,
      last_name,
      profile_image_url
    );

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email_addresses[0].email_address,
      },
    });

    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          profileImage: profile_image_url,
        },
      });

      console.log('User: ', user);
    }

    return void res.status(200).json({
      success: true,
      message: 'Webhook received',
    });
  }
});

app.use('/api/rooms', roomsRouter);

httpServer.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
