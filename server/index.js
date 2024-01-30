import express from "express";
import logger from "morgan";
import path from "path";
import session from "express-session"
import passport from "passport-http-bearer"
import bodyParser from "body-parser";
import { MissionsDatabase } from "./missionDB.js";
// import { Strategy as LocalStrategy } from "passport-local";
// import { connectToCluster, getCredentials, addCredentials} from "./logindatabase.js";
import { findLogById, saveGenInfo, saveLogExerciseInfo, numberOfLogs, returnAllLogs, updateLog, deleteLog, deleteAllLogs} from "./exercise_log_db.js";
// import { executeWorkoutsCrudOperations, connectToCluster } from './workOutDB.js';
import * as workoutDBFunctions from "./workOutDB.js";

const app = express();

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(session({
  secret: "326-team25",
  resave: false,
  saveUninitialized: false
}));
// app.use(passport.initialize());
// app.use(passport.session());


// app.use('/client/connect', express.static('../client/connect'));
// app.use('/client/missions', express.static('../client/missions'));
// app.use('/client/workouts', express.static('../client/workouts'));

// connectToCluster(process.env.LOGIN_URI)
//   .then(() => {
//     // Start the server
//     const port = process.env.PORT || 3005;
//     app.listen(port, () => {
//       console.log(`Server started on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to connect to MongoDB cluster", error);
//   });

//   passport.use(new LocalStrategy(
//     async (username, password, done) => {
//       try {
//         const credentials = await getCredentials(username);
//         if (credentials && credentials.password === password) {
//           return done(null, credentials);
//         } else {
//           return done(null, false);
//         }
//       } catch (error) {
//         return done(error);
//       }
//     }
//   ));
  
//   passport.serializeUser((user, done) => {
//     done(null, user.username);
//   });
  
//   passport.deserializeUser(async (username, done) => {
//     try {
//       const credentials = await getCredentials(username);
//       done(null, credentials);
//     } catch (error) {
//       done(error);
//     }
//   });
  
//   // Routes
//   app.post("/login", passport.authenticate("local", {
//     successRedirect: "/index.html",
//     failureRedirect: "/login.html"
//   }));
  
//   app.get("/dashboard.html", ensureAuthenticated, (req, res) => {
//     res.sendFile(__dirname + "/index.html");
//   });
  
//   // Middleware to ensure user is authenticated
//   function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect("/login.html");
//   }

//   app.post("/signup", async (req, res, next) => {
//     const { username, password } = req.body;
  
//     try {
//       // Check if the user already exists
//       const existingUser = await getCredentials(username);
//       if (existingUser) {
//         return res.status(400).json({ message: "Username already exists" });
//       }
  
//       // Add the new user to the database
//       const newUser = await addCredentials(username, password);
  
//       // Redirect to index.html after successful signup
//       res.redirect("/index.html");
//     } catch (error) {
//       console.error("Failed to add user to the database", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });

const MissionRoutes = (app, db) => {
  app.use("/client/connect", express.static("../client/connect"));
  app.use("/client/missions", express.static("../client/missions"));
  app.use("/client/workouts", express.static("../client/workouts"));

  app.post("/missions/create", async (req, res) => {
    try {
      const { id, title, des } = req.body;
      const mission = await db.createMission(id, title, des);
      // res.send(JSON.stringify(mission));
      res.json(mission); // Send the response as JSON
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/missions/read", async (req, res) => {
    try {
      const { id } = req.query;
      const mission = await db.readMission(id);
      res.send(JSON.stringify(mission));
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post("/missions/update", async (req, res) => {
    try {
      const { id, title, des } = req.body;
      const mission = await db.updateMission(id, title, des);
      res.send(JSON.stringify(mission));
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete("/missions/delete", async (req, res) => {
    try {
      const { id } = req.query;
      const mission = await db.deleteMission(id);
      res.send(JSON.stringify(mission));
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/missions/all", async (req, res) => {
    try {
      const mission = await db.readAllMission();
      res.send(JSON.stringify(mission));
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });

  app.get("/missions", (req, res) => {
    res.redirect("/missions/all");
  });

  return app;
};

const WorkoutRoutes = (app, db) => {
  // Load client code
  app.use("/", express.static("./"));
  // Other stuff
  app.use(bodyParser.json());
  // app.use(logger("dev"));
  // app.use(express.json());

  app.post("/workouts/create", async (req, res) => {
    try {
      await workoutDBFunctions.createWorkoutDB(req.body);
      res.send(`Added "${req.body.name}" workout`);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/workouts/read", async (req, res) => {
    try {
      const _id = req.query.id;
      const workout = await workoutDBFunctions.readWorkoutDB(_id);
      res.send(JSON.stringify(workout));
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post("/workouts/update", async (req, res) => {
    try {
      // const _id = req.query.id;
      // const updatedWorkout = req.body
      await workoutDBFunctions.updateWorkoutDB(req.body);
      res.send(`Updated workout`);
      // res.send(`Updated "${workoutName}" workout`);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete("/workouts/delete", async (req, res) => {
    try {
      const _id = req.query.id;
      await workoutDBFunctions.deleteWorkoutDB(_id);
      res.send(`Deleted workout`);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get("/workouts/all", async (req, res) => {
    try {
      const workouts = await workoutDBFunctions.readAllWorkoutsDB();
      res.send(workouts);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  return app;
};

const ExerciseLogRoutes = (app, db) => {

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(logger('dev'));
app.use('/', express.static('client/exercise_log'));

app.post('/genInfo', async function(request, response){
    const query = request.query;
    console.log(query);
    if (query.date && query.bodyweight && query.sleep && query.calories && query.day){
        let value = await saveGenInfo(query.date, Number.parseInt(query.bodyweight), Number.parseInt(query.sleep), Number.parseInt(query.calories), query.day);
        console.log(value);
        if (value == 0){
            response.statusCode = 200;
            response.body = {"status": "success"};
            response.write(JSON.stringify(response.body));
            response.end();
        }else {
            response.statusCode = 400;
            response.write('Bad ID');
            response.end();
        }
    }else{
        response.statusCode = 400;
        response.write('Bad Request');
        response.end();
    }
});


app.post('/exerciseInfo', async function(request, response){
    const query = request.query;
    if (query.id && query.exercise && query.weight && query.set1 && query.set2 && query.set3 && query.set4){
        console.log(query);
        let value = await saveLogExerciseInfo(Number.parseInt(query.id), query.exercise, query.weight, query.set1, query.set2, query.set3, query.set4);
        if (value == 0){
            response.statusCode = 200;
            response.body = {"status": "success"};
            response.write(JSON.stringify(response.body));
            response.end();
        }else {
            response.statusCode = 400;
            response.write('Bad ID');
            response.end();
        }
    }else{
        response.statusCode = 400;
        response.write('Bad Request');
        response.end();
    }
});


app.get('/numLogs', async function(request,response){
    const count = await numberOfLogs();
    if (count !== undefined){
        response.statusCode = 200;
        response.body = JSON.stringify(count);
        response.write(JSON.stringify(response.body));
        response.end();
    }else{
        response.statusCode = 400;
        response.body = 'Error'
        response.write("Can't get number of logs");
        response.end();
    }
})

app.get('/logDisplay', async function(request, response){
    const query = request.query;
    const data = await findLogById(Number.parseInt(query.id));
    console.log(data);
    if (data) {
        response.statusCode = 200;
        response.body = JSON.stringify(data);
        response.write(response.body);
        response.end();
    }else {
        response.statusCode = 400;
        response.body = 'Error'
        response.write('No log is associated with this id');
        response.end();
    }
});

app.get('/logDisplayAll', async function(request, response){
    const query = request.query;
    const data = await returnAllLogs();
    console.log(data);
    response.statusCode = 200;
    response.body = JSON.stringify(data);
    response.write(response.body);
    response.end();
});

app.post('/updateInfo', async function(request, response){
    const query = request.query;
    const date = query.date;
    const bodyweight = query.bodyweight;
    const sleep = query.sleep;
    const calories = query.calories;
    const day = query.day;
    if (query.id && query.date && query.bodyweight && query.sleep && query.calories && query.day){
        const data = {date, bodyweight, sleep, calories, day};
        let value = await updateLog(Number.parseInt(query.id), data);
        if (value == 0){
            response.statusCode = 200;
            response.body = {"status": "success"};
            response.write(JSON.stringify(response.body));
            response.end();
        }else{
            response.statusCode = 400;
            response.write('Bad id');
            response.end();
        }
    }else{
        response.statusCode = 400;
        response.write('Bad Request');
        response.end();
    }
});

app.post('/deleteLog', async function(request, response){
    const query = request.query;
    if(query.id){
        let value = await deleteLog(Number.parseInt(query.id));
        console.log(value);
        if (value == 0){
            response.statusCode = 200;
            response.body = {"status": "success"};
            response.write(JSON.stringify(response.body));
            response.end();
        }else{
            response.statusCode = 400;
            response.write('Bad id');
            response.end();
        }
    }else{
        response.statusCode = 400;
        response.write('Bad Request');
        response.end();
    }
});

app.post('/deleteAllLogs', async function(request, response){
    const value = await deleteAllLogs();
    if (value == 0){
        response.statusCode = 200;
        response.body = {"status": "success"};
        response.write(JSON.stringify(response.body));
        response.end();
    }else{
        response.statusCode = 400;
        response.write('Bad id');
        response.end();
    }
});

app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

return app;
}

const start = async () => {
  // Start missions database
  try {
    const db = await MissionsDatabase(process.env.DATABASE_URL).connect();
    //await db.init();
    const app = MissionRoutes(express(), db);
    const port = process.env.PORT || 3002;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error("Connection to missions database failed", err);
  }

  // Start workouts database
  try {
    const uri = process.env.WORKOUTS_DATABASE_URI;
    const workoutsDB = await workoutDBFunctions.connectToCluster(uri);
    const workoutsApp = WorkoutRoutes(express(), workoutsDB);
    const port = process.env.PORT || 3003;

    workoutsApp.listen(port, () => {
      console.log(`Workouts server started on port ${port}`);
    });
  } catch (err) {
    console.error("Connection to workouts database failed", err);
  }

  try {
    const uri = process.env.DB_URI;
    const exerciseLogApp = ExerciseLogRoutes(express());
    const port = process.env.PORT || 3000;
    exerciseLogApp.listen(port, () => {
      console.log(`Exercise Log server started on port ${port}`);
    });
  } catch (error) {
    console.error("Connection to exercise log server failed");
  }

};

start();
