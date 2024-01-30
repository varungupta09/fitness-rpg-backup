export async function createWorkoutFetch(workout) {
  try {
    await fetch("/workouts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function readWorkoutFetch(_id) {
  try {
    const response = await fetch(`/workouts/read?id=${_id}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateWorkoutFetch(workout) {
  try {
    await fetch(`/workouts/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteWorkoutFetch(_id) {
  try {
    await fetch(`/workouts/delete?id=${_id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.log(err);
  }
}

export async function readAllWorkoutsFetch() {
  try {
    const response = await fetch(`/workouts/all`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}