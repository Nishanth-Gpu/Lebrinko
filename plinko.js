function dropBall() {
    const ball = document.getElementById("ball");
    const plinkoResult = document.getElementById("plinkoResult");
    const resultMessage = document.getElementById("resultMessage");

    // Reset ball position
    ball.style.top = "0";
    ball.style.left = "50%";

    // Start the ball drop animation
    ball.style.animation = "dropBall 2s forwards";

    // Show the result after the animation ends
    setTimeout(() => {
        plinkoResult.style.display = "block";
        resultMessage.innerText = "I am really disappointed in you.";
    }, 2000);
}