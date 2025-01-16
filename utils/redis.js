import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    // Handle connection errors
    this.client.on('error', (error) => {
      console.error(`Redis client error: ${error}`);
    });
  }

  /**
   * Check if the Redis client is connected and ready.
   * @returns {boolean} - True if the client is alive, false otherwise.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get the value of a key from Redis.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string | null>} - The value associated with the key or null if not found.
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  /**
   * Set a key-value pair in Redis with an expiration.
   * @param {string} key - The key to set.
   * @param {string | number} value - The value to set.
   * @param {number} duration - The expiration duration in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Delete a key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;

