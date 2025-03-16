document.addEventListener("DOMContentLoaded", function () {
    updateBalance();
});

function placeBet(guess) {
    let betAmount = document.getElementById("betAmount").value;

    if (!betAmount || betAmount <= 0) {
        alert("Enter a valid bet amount.");
        return;
    }

    fetch("/parlay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet: betAmount, guess: guess })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            document.getElementById("balance").innerText = data.balance;
            document.getElementById("resultSection").style.display = "block";

            if (data.is_correct) {
                document.getElementById("resultText").innerText = `You guessed correctly! LeBron played ${data.outcome}. You won $${data.winnings}.`;
                document.getElementById("plinkoButton").style.display = "block";
            } else {
                document.getElementById("resultText").innerText = `You guessed wrong! LeBron played ${data.outcome}. You lost $${-data.winnings}.`;
            }

            // Set the image source based on the outcome
            document.getElementById("lebronImage").src = `{{ url_for('static', filename='') }}${data.image}`;
            document.getElementById("lebronImage").style.display = "block";

            const iframe = document.getElementById("highlightClip");
            iframe.src = data.clip; // Set the video URL
            iframe.style.display = "block";
            document.getElementById("playVideoButton").style.display = "block"; // Show the "Play Video" button
        }
    });
}

function playVideo() {
    const iframe = document.getElementById("highlightClip");
    iframe.src += "?autoplay=1"; // Force autoplay
    document.getElementById("playVideoButton").style.display = "none"; // Hide the button after clicking
}

function updateBalance() {
    fetch("/")
    .then(response => response.text())
    .then(html => {
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        let balance = tempDiv.querySelector("#balance").innerText;
        document.getElementById("balance").innerText = balance;
    });
}