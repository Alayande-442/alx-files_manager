import redisClient from '../utils/redis.js'; // Redis client utility
import dbClient from '../utils/db.js'; // DB client utility

class AppController {
  // Endpoint to check if Redis and DB are alive
  static async getStatus(req, res) {
    try {
      const redisAlive = redisClient.isAlive();
      const dbAlive = dbClient.isAlive();
      res.status(200).json({ redis: redisAlive, db: dbAlive });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // Endpoint to get the stats (number of users and files in DB)
  static async getStats(req, res) {
    try {
      const nbUsers = await dbClient.nbUsers();
      const nbFiles = await dbClient.nbFiles();
      res.status(200).json({ users: nbUsers, files: nbFiles });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
}

export default AppController;

