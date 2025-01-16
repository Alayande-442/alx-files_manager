import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    // Initialize Redis client
    this.client = createClient();

    // Handle connection events
    this.client.on('connect', () => {
      console.log('Redis client connected to server');
    });

    this.client.on('error', (error) => {
      console.error(`Redis client not connected to server: ${error.message}`);
    });

    // Promisify Redis commands
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Check if the Redis server is alive.
   * @returns {boolean} - Connection status.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Get the value of a key from Redis.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string|null>} - The value of the key or null if not found.
   */
  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error(`Error retrieving key "${key}": ${error.message}`);
      return null;
    }
  }

  /**
   * Set a key-value pair in Redis with an expiration time.
   * @param {string} key - The key to set.
   * @param {string} value - The value to set.
   * @param {number} time - Expiration time in seconds.
   */
  async set(key, value, time) {
    try {
      await this.setAsync(key, value);
      this.client.expire(key, time);
    } catch (error) {
      console.error(`Error setting key "${key}": ${error.message}`);
    }
  }

  /**
   * Delete a key-value pair from Redis.
   * @param {string} key - The key to delete.
   */
  async del(key) {
    try {
      await this.delAsync(key);
    } catch (error) {
      console.error(`Error deleting key "${key}": ${error.message}`);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;

