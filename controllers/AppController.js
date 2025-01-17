import redisClient from '../utils/redis.js'; // Make sure to use the `.js` extension
import dbClient from '../utils/db.js'; // Also ensure `.js` extension here

class AppController {
  static getStatus(request, response) {
    response.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  static async getStats(request, response) {
    const usersNum = await dbClient.nbUsers();
    const filesNum = await dbClient.nbFiles();
    response.status(200).json({ users: usersNum, files: filesNum });
  }
}

export default AppController;  // Use ES module export (not `module.exports`)

