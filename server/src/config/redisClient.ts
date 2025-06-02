import Redis from 'ioredis';
const redisClient = new Redis({
  port: 6379,
  host: 'redis',
});

redisClient.on('connect', () => {
  console.log('Connected to Redis!');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redisClient;
