import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db.js';  // Ensure correct path with .js extension
import redisClient from '../utils/redis.js';  // Ensure correct path with .js extension

class AuthController {
  static async getConnect(request, response) {
    const authData = request.header('Authorization');
    let userEmail = authData.split(' ')[1];
    const buff = Buffer.from(userEmail, 'base64');
    userEmail = buff.toString('ascii');
    const data = userEmail.split(':'); // contains email and password
    
    if (data.length !== 2) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const hashedPassword = sha1(data[1]);
    const users = dbClient.db.collection('users');
    try {
      const user = await users.findOne({ email: data[0], password: hashedPassword });
      if (user) {
        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 60 * 60 * 24);  // 1 day expiry
        response.status(200).json({ token });
      } else {
        response.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    try {
      const id = await redisClient.get(key);
      if (id) {
        await redisClient.del(key);
        response.status(204).json({});
      } else {
        response.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AuthController;  // Use export default for ES modules

