import { MongoClient } from 'mongodb';

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${HOST}:${PORT}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    this.client.connect()
      .then(() => {
        this.db = this.client.db(DATABASE);
        console.log('Connected to the database');
      })
      .catch((err) => {
        console.log('Database connection failed', err);
      });
  }

  isAlive() {
    return this.client.isConnected(); // This is MongoClient specific for older versions, but newer versions use 'client.isReady' or similar.
  }

  async nbUsers() {
    const users = this.db.collection('users');
    const usersNum = await users.countDocuments();
    return usersNum;
  }

  async nbFiles() {
    const files = this.db.collection('files');
    const filesNum = await files.countDocuments();
    return filesNum;
  }
}

// Export the instance
const dbClient = new DBClient();
export default dbClient;

