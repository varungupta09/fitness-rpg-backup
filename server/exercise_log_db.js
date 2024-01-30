// const MongoClient = require('mongodb').MongoClient;
import { MongoClient } from 'mongodb'
import { config } from 'dotenv';

config();
const uri = process.env.DB_URI;

export async function connectToCluster(){
    let mongoC;
    try {
        mongoC = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
       await mongoC.connect();
       console.log('Successfully connected to MongoDB Atlas!');

       return mongoC;
    } catch (error) {
       console.error('Connection to MongoDB Atlas failed!', error);
       process.exit();
    }
}

export async function saveGenInfo(date, bodyweight, sleep, calories, day){
    let mongoC;
    try {
        mongoC = await connectToCluster(uri);
        const db = mongoC.db('log-database');
        const collection = db.collection('logs');
        let id = await collection.countDocuments() + 1;
        const geninfo = {number: id, geninfo: {date, bodyweight, sleep, calories, day}, exercises:[]};
        await collection.insertOne(geninfo);
    } finally {
        mongoC.close();
        return 0;
    }
}


export async function saveLogExerciseInfo(id, exercise, weight, set1, set2, set3, set4){
    let mongoC;
    try {
        mongoC = await connectToCluster(uri);
        const db = mongoC.db('log-database');
        const collection = db.collection('logs');
        const data = {exercise, weight, set1, set2, set3, set4};
        console.log(id);
        let cur_exercises = (await _findLogById(collection, id)).exercises;
        cur_exercises.push(data);
        await collection.updateMany(
                    { number: id},
                    { $set: {exercises: cur_exercises} }
                );
        console.log('Succesfully added Exercise !');
    } catch(err){
        console.log(err);
    }
    finally {
        mongoC.close();
        return 0;
    }
}

 export async function _findLogById(collection, number) {
    let arr = await collection.find({number}).toArray();
    let obj = await arr.find((obj) => obj.number == number);
    return obj;
 }

 export async function findLogById(number) {
    let mongoC;
    try {
        mongoC = await connectToCluster(uri);
        const db = mongoC.db('log-database');
        const collection = db.collection('logs');
        console.log(number);
        let arr = await collection.find({number}).toArray();
        let obj = await arr.find((obj) => obj.number == number);
        mongoC.close();
        return obj;
    } catch (error) {
     console.log(error);
    } 
 }

 export async function returnAllLogs(){
    let mongoC;
    try {
        mongoC = await connectToCluster(uri);
        const db = mongoC.db('log-database');
        const collection = db.collection('logs');
        let allLogs = await collection.find().toArray();
        mongoC.close();
        return allLogs;
    } catch (error) {
     console.log(error);
    } 
 }
 
export async function numberOfLogs(){
    let mongoC;
    mongoC = await connectToCluster(uri);
    const db = mongoC.db('log-database');
    const collection = db.collection('logs');
    let count = await collection.countDocuments();
    console.log(count);
    mongoC.close();
    return count;
}


export async function updateLog(id, newFields){
    let mongoC;
    try {
        mongoC = await connectToCluster(uri);
        const db = mongoC.db('log-database');
        const collection = db.collection('logs');
        await collection.updateMany(
            { number: id},
            { $set: {geninfo: newFields} }
        );
        console.log('Succesfully updated Exercise !');
        mongoC.close();
        return 0;
    } catch(err){
        console.log(err);
    }
}

export async function deleteLog(number){
    let mongoC;
    try {
        mongoC = await connectToCluster(uri);
        const db = mongoC.db('log-database');
        const collection = db.collection('logs');
        await collection.deleteMany({number});
        mongoC.close();
        return 0;
    } catch (error) {
     console.log(error);
    } 
}

export async function deleteAllLogs(){
    let mongoC;
    try {
        mongoC = await connectToCluster(uri);
        const db = mongoC.db('log-database');
        const collection = db.collection('logs');
        await collection.deleteMany({});
        mongoC.close();
        return 0;
    } catch (error) {
     console.log(error);
    } 
}