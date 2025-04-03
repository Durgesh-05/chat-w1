import dotenv from 'dotenv';
dotenv.config();
import Redis from 'ioredis';

export const pub = new Redis(process.env.REDIS_URI || '');
export const sub = new Redis(process.env.REDIS_URI || '');
export const redis = new Redis(process.env.REDIS_URI || '');

const subscribeToChannel = async () => {
  try {
    await sub.subscribe('MESSAGES');
    console.log('Subscribed to MESSAGES channel');
  } catch (err) {
    console.error('Failed to subscribe to MESSAGES channel:', err);
  }
};

pub.on('error', (err) => {
  console.error('Redis Publisher Error:', err);
});

sub.on('error', (err) => {
  console.error('Redis Subscriber Error:', err);
});

redis.on('error', (err) => {
  console.error('Redis Caching Error:', err);
});

pub.on('connect', () => {
  console.log('Redis Publisher connected successfully');
});

sub.on('connect', () => {
  console.log('Redis Subscriber connected successfully');
  subscribeToChannel();
});

redis.on('connect', () => {
  console.log('Redis caching connected successfully');
});

sub.on('reconnecting', () => {
  console.log(`Redis Subscriber reconnecting...`);
});
