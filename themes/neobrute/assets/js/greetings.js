// Function to get the greeting based on the time of day
function getGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 12) {
        return "🌄 Good morning";
    } else if (hours >= 12 && hours < 18) {
        return "⛅ Good afternoon";
    } else {
        return "🌃 Good evening";
    }
}

// Function to update the greeting text
function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;
    const greetingText = greetingElement.querySelector('[data-greeting-text]');
    const greetingYear = greetingElement.querySelector('[data-greeting-year]');
    if (greetingText) greetingText.textContent = getGreeting();
    if (greetingYear) greetingYear.textContent = new Date().getFullYear();
}

// Call the updateGreeting function when the page loads
window.onload = updateGreeting;
