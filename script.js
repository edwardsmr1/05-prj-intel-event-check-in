// Get form elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const maxCount = 50; // Set summit maximum capacity goal
const teams = ["water", "zero", "power"]; // Matches your HTML team values/IDs

// Track attendance & load persisted data from localStorage
let count = parseInt(localStorage.getItem("summit_count")) || 0;
let attendees = JSON.parse(localStorage.getItem("summit_attendees")) || [];

// Initialize UI on page load with saved state
window.addEventListener("DOMContentLoaded", () => {
  updateUI();

  // Trigger celebration if goal was already met
  if (count >= maxCount) {
    triggerCelebration();
  }
});

function updateUI() {
  // Update attendance count text & progress bar
  const attendeeCountEl = document.getElementById("attendeeCount");
  if (attendeeCountEl) attendeeCountEl.textContent = count;

  const percentageVal = Math.min(Math.round((count / maxCount) * 100), 100);
  const progressBar = document.getElementById("progressBar");
  if (progressBar) progressBar.style.width = percentageVal + "%";

  // Update team counters from localStorage
  teams.forEach((t) => {
    const teamTotal = parseInt(localStorage.getItem(`summit_${t}_count`)) || 0;
    const counter = document.getElementById(t + "Count");
    if (counter) counter.textContent = teamTotal;
  });

  // Populate saved attendee list
  const attendeeList = document.getElementById("attendeeList");
  if (attendeeList) {
    attendeeList.innerHTML = "";
    attendees.forEach((item) => {
      const li = document.createElement("li");
      li.style.padding = "8px 12px";
      li.style.borderBottom = "1px solid #e9ecef";
      li.textContent = `${item.name} — ${item.teamName}`;
      attendeeList.appendChild(li);
    });
  }
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment attendance count & save to localStorage
  count++;
  localStorage.setItem("summit_count", count);
  console.log("Total check-ins: ", count);

  // Update attendance count & progress bar
  const attendeeCountEl = document.getElementById("attendeeCount");
  if (attendeeCountEl) attendeeCountEl.textContent = count;

  const percentageVal = Math.min(Math.round((count / maxCount) * 100), 100);
  const percentage = percentageVal + "%";
  const progressBar = document.getElementById("progressBar");
  if (progressBar) progressBar.style.width = percentage;
  console.log("Progress: ", percentage);

  // Update team counter DOM & save to localStorage
  const teamCounter = document.getElementById(team + "Count");
  const current = parseInt(teamCounter.textContent);
  console.log("previous team count: ", current);

  const newTotal = current + 1;
  teamCounter.textContent = newTotal;
  localStorage.setItem(`summit_${team}_count`, newTotal);
  console.log("new team count: ", newTotal);

  // Save and render attendee list item
  attendees.push({ name, teamName });
  localStorage.setItem("summit_attendees", JSON.stringify(attendees));

  const attendeeList = document.getElementById("attendeeList");
  if (attendeeList) {
    const li = document.createElement("li");
    li.style.padding = "8px 12px";
    li.style.borderBottom = "1px solid #e9ecef";
    li.textContent = `${name} — ${teamName}`;
    attendeeList.prepend(li);
  }

  // Show welcome message in the greeting element
  const message = "Welcome " + name + " to the " + teamName + "!";
  console.log(message);

  const greetingEl = document.getElementById("greeting");
  if (greetingEl) {
    greetingEl.textContent = message;
    greetingEl.style.display = "block";
  }

  // Check if check-in goal is reached
  if (count >= maxCount) {
    triggerCelebration();
  }

  form.reset();
});

// Celebration feature highlighting the winning team's name
function triggerCelebration() {
  let winningTeam = "Team Water Wise";
  let maxTeamCount = -1;

  teams.forEach((t) => {
    const tCount = parseInt(localStorage.getItem(`summit_${t}_count`)) || 0;
    if (tCount > maxTeamCount) {
      maxTeamCount = tCount;
      const optionEl = document.querySelector(`option[value="${t}"]`);
      if (optionEl) winningTeam = optionEl.text;
    }
  });

  const celebrationMessage = document.getElementById("celebrationMessage");
  if (celebrationMessage) {
    celebrationMessage.textContent = `🎉 Goal Reached! Celebration time—congratulations to the winning team: ${winningTeam}! 🎉`;
    celebrationMessage.style.display = "block";
  }
}
