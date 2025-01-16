import { MongoClient } from 'mongodb';

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${HOST}:${PORT}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    // Flag to check connection status
    this.connected = false;

    // Initialize connection
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(DATABASE);
      this.connected = true;
      console.log(`Connected to MongoDB database: ${DATABASE}`);
    } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
      this.connected = false;
    }
  }

  isAlive() {
    // Check connection status using the client
    return this.connected && this.client.topology.isConnected();
  }

  async nbUsers() {
    if (!this.db) {
      throw new Error('Database connection not established');
    }

    try {
      const usersCollection = this.db.collection('users');
      const count = await usersCollection.countDocuments();
      return count;
    } catch (err) {
      console.error('Error counting users:', err.message);
      return 0;
    }
  }

  async nbFiles() {
    if (!this.db) {
      throw new Error('Database connection not established');
    }

    try {
      const filesCollection = this.db.collection('files');
      const count = await filesCollection.countDocuments();
      return count;
    } catch (err) {
      console.error('Error counting files:', err.message);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;

