import dotenv from 'dotenv';
dotenv.config();
import Redis from 'ioredis';

export const pub = new Redis(process.env.REDIS_URI || '');
export const sub = new Redis(process.env.REDIS_URI || '');

pub.on('error', (err) => {
  console.error('Redis Publisher Error:', err);
});

sub.on('error', (err) => {
  console.error('Redis Subscriber Error:', err);
});

pub.on('connect', () => {
  console.log('Redis Publisher connected successfully');
});

sub.on('connect', () => {
  console.log('Redis Subscriber connected successfully');
  sub.subscribe('MESSAGES', (err) => {
    if (err) {
      console.error('Failed to subscribe to MESSAGES channel:', err);
    } else {
      console.log('Subscribed to MESSAGES channel');
    }
  });
});
