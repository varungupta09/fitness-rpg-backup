import { MongoClient } from "mongodb";

let mongoClient;
let db;
let collection;

// Connect to MongoDB
export async function connectToCluster(uri) {
  try {
    mongoClient = new MongoClient(uri);
    console.log("Connecting to workouts MongoDB Atlas cluster...");
    await mongoClient.connect();
    console.log("Successfully connected to workouts MongoDB Atlas!");

    db = mongoClient.db("workouts");
    const collectionName = `workout_${Date.now()}`;
    collection = db.collection(collectionName);

    return mongoClient;
  } catch (error) {
    console.error("Connection to workouts database failed", error);
    process.exit();
  }
}

export async function createWorkoutDB(workout) {
  await collection.insertOne(workout);
}

export async function readWorkoutDB(_id) {
  return collection.find({ _id }).toArray();
}


export async function updateWorkoutDB(workout) {
  const workoutID = { _id: workout._id };
  await collection.replaceOne(workoutID, workout);
}

export async function deleteWorkoutDB(_id) {
  await collection.deleteOne({ _id });
}

export async function readAllWorkoutsDB() {
  const workouts = await collection.find()
  return workouts.toArray()
}