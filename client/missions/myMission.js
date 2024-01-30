import * as crud from "./missionCRUD.js";

// Retrieve the UI elements.
const missButton = document.getElementById("miss-button");
const idText = document.getElementById("id");
const missions = document.getElementById("missions");
const title = document.getElementById("title");
const des = document.getElementById("description");
const delButton = document.getElementById("del-button");
const change = document.getElementById("change");
const update = document.getElementById("up-button");
const Onedel = document.getElementById("onedel-button");

// Initialize the database when the page loads
//   and populate the output element with the database contents.
async function allMissions() {
  const allMiss = await crud.readAllMission();
  missions.innerHTML = JSON.stringify(allMiss);
}

missButton.addEventListener("click", async (e) => {
  const myId = idText.value;
  const myTitle = title.value;
  const myDes = des.value;
  const mission = await crud.createMission(myId, myTitle, myDes);
  missions.innerHTML = JSON.stringify(mission);
  await allMissions();
});

// readButton.addEventListener("click", async (e) => {
//   const id = idText.value;
//   const person = await crud.readPerson(id);
//   output.innerHTML = JSON.stringify(person);
//   await allPeople();
// });
update.addEventListener("click", async (e) => {
  let missionId = null;
  const options = await crud.readAllMission();
  const promptMessage =
    "Select ID of the mission to update:\n" +
    options.map((mission) => `${mission.id} - ${mission.title}`).join("\n");
  while (missionId === null) {
    const selectedIndex = prompt(promptMessage);
    if (selectedIndex === null) {
      return; // User cancelled
    }
    const selectedOption = options[selectedIndex];
    if (selectedOption) {
      missionId = selectedOption.id;
    } else {
      alert("Invalid selection. Please try again.");
    }
  }

  const updatedTitle = prompt("Enter the updated title:");
  const updatedDescription = prompt("Enter the updated description:");

  // Update the selected mission in the database
   const updatedMission = await crud.updateMission(missionId, updatedTitle, updatedDescription);

  // Update the inner HTML
  await allMissions();
});


delButton.addEventListener("click", async (e) => {
  // const myId = idText.value;
  // const myTitle = title.value;
  // const myDes = des.value;
  // const mission = await crud.delALLMission(myId, myTitle, myDes);
  // mission.innerHTML = JSON.stringify(mission);
  missions.innerHTML = ""; 
  // await allMissions();
});
Onedel.addEventListener("click", async (e) => {
  const myId = idText.value;
  const myTitle = title.value;
  const myDes = des.value;
  const mission = await crud.delONEMission(myId, myTitle, myDes);
  mission.innerHTML = JSON.stringify(mission);
  await allMissions();
});


allMissions();