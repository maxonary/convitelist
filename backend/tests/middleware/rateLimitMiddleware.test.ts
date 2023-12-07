import { describe, it, expect } from 'vitest';
import { limiter } from '../../src/middleware/rateLimitMiddleware';
import request from 'supertest';
import express from 'express';

describe('Rate Limiter', () => {
  it('should allow 50 requests per hour', async () => {
    const app = express();
    app.use(limiter);
    app.get('/test', (req, res) => res.status(200).send('OK'));

    for (let i = 0; i < 50; i++) {
      const response = await request(app).get('/test');
      expect(response.status).toBe(200);
    }

    const limitResponse = await request(app).get('/test');
    expect(limitResponse.status).toBe(429);
    expect(limitResponse.text).toBe('Rate limit exceeded. Please try again later.');
  });

  it('should throw error if more than 50 requests are sent', async () => {
    const app = express();
    app.use(limiter);
    app.get('/test', (req, res) => res.status(200).send('OK'));

    // Send 50 requests which should be allowed
    for (let i = 0; i < 50; i++) {
      await request(app).get('/test');
    }

    // Now send one more request which should be rejected
    const response = await request(app).get('/test');
    expect(response.status).toBe(429);
    expect(response.text).toBe('Rate limit exceeded. Please try again later.');
  });
});
