import { MongoClient } from "mongodb";


let mongoClient;
let db;
let collection;

export async function connectToCluster(uri) {
    try {
      mongoClient = new MongoClient(uri);
      console.log("Connecting to login MongoDB Atlas cluster...");
      await mongoClient.connect();
      console.log("Successfully connected to login MongoDB Atlas!");
  
      db = mongoClient.db("login");
      const collectionName = `login_${Date.now()}`;
      collection = db.collection(collectionName);
  
      return mongoClient;
    } catch (error) {
      console.error("Connection to login database failed", error);
      process.exit();
    }
  }
  
  export async function addCredentials(username, password) {
    try {
      const result = await collection.insertOne({ username, password });
      console.log("Credentials added:", result.ops[0]);
      return result.ops[0];
    } catch (error) {
      console.error("Failed to add credentials", error);
      throw error;
    }
  }
  
  export async function getCredentials(username) {
    try {
      const result = await collection.findOne({ username });
      console.log("Credentials retrieved:", result);
      return result;
    } catch (error) {
      console.error("Failed to get credentials", error);
      throw error;
    }
  }
  
  export async function updateCredentials(username, newPassword) {
    try {
      const result = await collection.updateOne(
        { username },
        { $set: { password: newPassword } }
      );
      console.log("Credentials updated:", result.modifiedCount);
      return result.modifiedCount;
    } catch (error) {
      console.error("Failed to update credentials", error);
      throw error;
    }
  }
  
  export async function deleteCredentials(username) {
    try {
      const result = await collection.deleteOne({ username });
      console.log("Credentials deleted:", result.deletedCount);
      return result.deletedCount;
    } catch (error) {
      console.error("Failed to delete credentials", error);
      throw error;
    }
  }

