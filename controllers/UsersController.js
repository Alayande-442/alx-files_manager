import sha1 from 'sha1';
import { ObjectID } from 'mongodb';
import Queue from 'bull';
import dbClient from '../utils/db.js';  // Corrected path with .js extension
import redisClient from '../utils/redis.js';  // Corrected path with .js extension

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  // POST method to create a new user
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      return;
    }

    const users = dbClient.db.collection('users');
    try {
      const user = await users.findOne({ email });
      if (user) {
        response.status(400).json({ error: 'Already exist' });
      } else {
        const hashedPassword = sha1(password);
        const result = await users.insertOne({ email, password: hashedPassword });
        response.status(201).json({ id: result.insertedId, email });
        userQueue.add({ userId: result.insertedId });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // GET method to retrieve logged-in user information
  static async getMe(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    try {
      const userId = await redisClient.get(key);
      if (userId) {
        const users = dbClient.db.collection('users');
        const idObject = new ObjectID(userId);
        const user = await users.findOne({ _id: idObject });
        if (user) {
          response.status(200).json({ id: userId, email: user.email });
        } else {
          response.status(401).json({ error: 'Unauthorized' });
        }
      } else {
        console.log('User not found!');
        response.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;

