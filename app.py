from flask import Flask, render_template, request, jsonify, redirect, url_for
import random

app = Flask(__name__)

# Initialize user balance
user_balance = {"balance": 100}

# Good and bad game clips
good_game_clips = [
    "https://www.youtube.com/embed/ljGVlE9mjrE?autoplay=1",  # LeBron playing well
    "https://www.youtube.com/embed/bW2VukOHHtk?autoplay=1"   # LeBron playing well
]

bad_game_clips = [
    "https://www.youtube.com/embed/3PPci3nXFoQ?autoplay=1",  # LeBron playing bad
    "https://www.youtube.com/embed/S1XKUV-GYJk?autoplay=1"   # LeBron playing bad
]

# LeBron images for feedback
lebron_images = {
    "win": "lebron happy.jpg",  # Image for winning
    "lose": "lebron sad.jpg"    # Image for losing
}

@app.route('/')
def index():
    # Reset balance to 100 every time the index page is loaded
    user_balance["balance"] = 100
    return render_template('index.html', balance=user_balance["balance"])

@app.route('/parlay', methods=['POST'])
def parlay():
    data = request.json
    bet = int(data['bet'])
    guess = data['guess']  # "good" or "bad"

    # Check if the bet is valid
    if bet > user_balance["balance"] or bet <= 0:
        return jsonify({"error": "Invalid bet"})

    # Randomly determine if LeBron has a good or bad game
    outcome = "good" if random.random() < 0.5 else "bad"  # 50% chance for good or bad
    is_correct = (guess == outcome)

    # Calculate winnings
    if is_correct:
        winnings = bet * 3  # 3x if correct
    else:
        winnings = -bet  # Lose the bet if incorrect

    user_balance["balance"] += winnings

    # Select a random clip and image based on the outcome
    clip = random.choice(good_game_clips if outcome == "good" else bad_game_clips)
    image = lebron_images["win" if is_correct else "lose"]

    return jsonify({
        "outcome": outcome,
        "is_correct": is_correct,
        "balance": user_balance["balance"],
        "clip": clip,
        "image": image,
        "winnings": winnings
    })

@app.route('/plinko')
def plinko():
    return render_template('plinko.html')

@app.route('/restart')
def restart():
    # Reset balance to 100 when restarting
    user_balance["balance"] = 100
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)