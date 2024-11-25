import Redis from 'ioredis';

// export const redis = new Redis(); // local

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USER,
  tls: {}, // Activate SSL
});
