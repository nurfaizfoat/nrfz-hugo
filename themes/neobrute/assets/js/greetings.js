// Function to get the greeting based on the time of day
function getGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 12) {
        return "🌥 Good morning";
    } else if (hours >= 12 && hours < 18) {
        return "𖤓 Good afternoon";
    } else {
        return "⋆.˚ ☾ .⭒˚ Good evening";
    }
}

// Function to update the greeting text
function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    const greetingText = getGreeting();
    greetingElement.innerHTML = `${greetingText}. Thanks for dropping by. This website is designed and coded by yours truly. Open-sourced and forkable on my <a href="https://github.com/nurfaizfoat">GitHub</a> | 2024 <i class="fa-solid fa-scale-balanced"></i> MIT License.`;
}

// Call the updateGreeting function when the page loads
window.onload = updateGreeting;