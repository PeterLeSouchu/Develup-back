import Redis from 'ioredis';

// export const redis = new Redis(); // local

export const redis = new Redis({
  host: process.env.REDISHOST,
  port: process.env.REDISPORT,
  password: process.env.REDISPASSWORD,
  username: process.env.REDISUSER,
  tls: {}, // Activate SSL
});
