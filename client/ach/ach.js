// Define missions and their corresponding point values
const missions = {
  mission1: { name: "Walk 10,000 steps", points: 100 },
  mission2: { name: "Drink 8 glasses of water", points: 50 },
  mission3: { name: "Complete a 30-minute workout", points: 150 },
  mission4: { name: "Do 50 pushups", points: 250 },
  mission5: { name: "Do 50 squats", points: 300 },
  mission6: { name: "Run 5 kilometers", points: 400 },
  mission7: { name: "Burn 500 calories in a workout", points: 300 },
  mission8: { name: "Complete 10,000 steps in high heels", points: 600 },
};

// Add event listeners to mission checkboxes
const missionCheckboxes = document.querySelectorAll(
  "#missions input[type='checkbox']"
);
missionCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateTotalPoints();
  });
});

// Update the total points displayed on the page
function updateTotalPoints() {
  const totalPoints = Array.from(missionCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .reduce((total, checkbox) => {
      const mission = missions[checkbox.id];
      return total + mission.points;
    }, 0);
  document.querySelector("#total-points").textContent = totalPoints;
}
