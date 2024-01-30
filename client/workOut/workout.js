// const { createWriteStream } = require("fs");
import * as crud from "./workoutCRUD.js";
renderWorkouts();

// Retrieve start workout buttons
const startWorkoutButtons = document.querySelectorAll(".start-workout");
const workoutStatus = document.getElementById("workout-status");

// Create the workout
async function createWorkout(workoutName) {
  const date = new Date().toISOString();
  const doc = {
    _id: workoutName + "-" + date,
    name: workoutName,
    date: date,
    completed: false,
  };
  try {
    await crud.createWorkoutFetch(doc)
  } catch (err) {
    console.log(err);
  }
}

// Update the workout
async function updateWorkout(workoutID) {
  try {
    const docArr = await crud.readWorkoutFetch(workoutID)
    const doc = docArr[0]

    const completionStatus = doc.completed;
    const completionString = completionStatus ? "yes" : "no";
    const userStatus = confirm(
      `Do you want to change the current workout completion status of ${completionString}?`
    );
    if (!userStatus) return;
    doc.completed = !completionStatus;
    if (doc.completed) {
      const startTime = new Date(doc.date);
      const endTime = new Date();
      const timeTaken = Math.floor((endTime - startTime) / 1000);
      doc.timeTaken = timeTaken;
    }
    await crud.updateWorkoutFetch(doc)

    await renderWorkouts();
    await renderWorkouts();
  } catch (err) {
    console.log(err);
  }
}

// Delete the workout
async function deleteWorkout(workoutID) {
  try {
    const docArr = await crud.readWorkoutFetch(workoutID)
    const doc = docArr[0]

    const confirmation = confirm(
      `Are you sure you want to permanently delete the ${doc.name} workout?`
    );
    if (!confirmation) return;
    await crud.deleteWorkoutFetch(doc._id)

    await renderWorkouts();
    await renderWorkouts();
  } catch (err) {
    console.log(err);
  }
}

async function renderWorkouts() {
  // Check db
  const workouts = await crud.readAllWorkoutsFetch()
  workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const workoutList = document.createElement("ul");
  // Render out each workout
  workouts.forEach((workout) => {
    // Create html elements variables
    const workoutItem = document.createElement("li");
    const workoutName = document.createElement("div");
    const workoutDate = document.createElement("div");
    const workoutCompleted = document.createElement("div");
    const workoutTimeTaken = document.createElement("div");
    const updateButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    updateButton.classList.add("update-button");
    deleteButton.classList.add("delete-button");
    // Modify contents of html elements
    workoutName.innerHTML = `<b>Workout name:</b> ${workout.name}`;
    workoutDate.innerHTML = `<b>Date:</b> ${new Date(
      workout.date
    ).toLocaleString()}`;
    workoutCompleted.innerHTML = `<b>Completed:</b> ${
      workout.completed ? "Yes" : "No"
    }`;
    if (workout.completed && workout.timeTaken < 60) {
      workoutTimeTaken.innerHTML = `<b>Time taken:</b> ${workout.timeTaken} seconds`;
    } else if (workout.completed && workout.timeTaken > 60) {
      const minutesTaken = Math.floor(workout.timeTaken / 60);
      const secondsTaken = workout.timeTaken % 60;
      const minuteString = minutesTaken === 1 ? "minute" : "minutes";
      workoutTimeTaken.innerHTML = `<b>Time taken:</b> ${minutesTaken} ${minuteString} and ${secondsTaken} seconds`;
    } else {
      workoutTimeTaken.innerHTML = "";
    }
    updateButton.innerText = "Update Workout";
    deleteButton.innerText = "Delete Workout";
    updateButton.addEventListener("click", () => updateWorkout(workout._id));
    deleteButton.addEventListener("click", () => deleteWorkout(workout._id));
    // Append html elements
    workoutItem.appendChild(workoutName);
    workoutItem.appendChild(workoutDate);
    workoutItem.appendChild(workoutCompleted);
    workoutItem.appendChild(workoutTimeTaken);
    workoutItem.appendChild(updateButton);
    workoutItem.appendChild(deleteButton);
    workoutList.appendChild(workoutItem);
  });
  // Render with new elements
  workoutStatus.innerHTML = "";
  workoutStatus.appendChild(workoutList);
}

startWorkoutButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const workoutName = button.getAttribute("workout-name");
    confirm(
      `The ${workoutName} workout has been added to the workout log at the bottom of the page. Now perform the workout and update its status when you are done. You got this!`
    );
    createWorkout(workoutName);
    await renderWorkouts();
    // Print db
    const allDocs = await db.allDocs({ include_docs: true });
    console.log(allDocs.rows.map((row) => row.doc));
    await renderWorkouts();
  });
});

// createWorkout("Push-Ups");
// createWorkout("Squats");