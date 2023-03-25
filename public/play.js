// List of description objects with sound file path and button hue
const buttonAssets = [
    {soundfile: "assets/sound1.mp3", hue: 120},
    {soundfile: "assets/sound2.mp3", hue: 0},
    {soundfile: "assets/sound3.mp3", hue: 60},
    {soundfile: "assets/sound4.mp3", hue: 240}
];

class Button
{
    constructor(assetPair, element)
    {
        // Initialize object members
        this.element = element;
        this.soundfile = new Audio(assetPair.soundfile);
        this.hue = assetPair.hue;

        // Set button color
        this.paint(25);
    }

    // Change brightness value of button
    // 0.0 <= percentage <= 1.0
    paint(percentage)
    {
        // Set button brightness to percentage
        const color = `hsl(${this.hue}, 100%, ${percentage}%)`;

        // Set button style
        this.element.style.backgroundColor = color;
    }

    // Visual and audio effect on click
    async pressEffects(volume = 1.0)
    {
        this.paint(50);
        await this.play(volume);
        this.paint(25);
    }

    // Create sound
    async play(volume = 1.0)
    {
        this.soundfile.volume = volume;

        // Promise meant to work around Safari needing permission for sound
        await new Promise((resolve) => 
        {
            this.soundfile.onended = resolve;
            this.soundfile.play();
        });
    }
}

class Game
{
    constructor()
    {
        // Initialize object members
        this.buttons = new Map();
        this.playerInputEnabled = false;
        this.correctSequence = [];
        this.playerSequenceIndex = 0;
        this.errorSound = new Audio("assets/error.mp3");
        
        // Set this.buttons to all Simon buttons
        this.getAllButtonsFromClass();

        this.updatePlayerNameElement();
    }

    // -----------------------------
    // -- DISPLAY/SCORE FUNCTIONS --
    // -----------------------------

    updatePlayerNameElement()
    {
        const playerNameElement = document.querySelector(".player-username");

        // Set player display element to stored name or "Guest" for no name
        playerNameElement.textContent = (localStorage.getItem("inputtedUserName") ?? "Guest");
    }

    updateScoreDisplayElement(value)
    {
        const scoreDisplayElement = document.querySelector(".score");
        scoreDisplayElement.textContent = value;
    }

    async saveScoreToCookies(scoreToUpdate)
    {
        const playerName = (localStorage.getItem("inputtedUserName") ?? "Guest");
        const dateWon = new Date().toLocaleDateString();
        const newScore = { name: playerName, score: scoreToUpdate, date: dateWon}
        
        try
        {
            const response = await fetch("/api/score",
            {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(newScore)
            });

            const scores = await response.json();
            localStorage.setItem('scores', JSON.stringify(scores));
        }
        catch
        {
            this.updateScoreboardLocal(newScore);
        }
    }

    updateScoreboardLocal(scoreToUpdate)
    {
        let scores = [];

        // Load scores from storage in JSON format
        const scoresJSON = localStorage.getItem("scores");
        if (scoresJSON)
        {
            scores = JSON.parse(scoresJSON);
        }

        // Try to find where the new score should go
        let foundPosition = false;
        for (const [i, previousScore] of scores.entries())
        {
            if (scoreToUpdate > previousScore.score)
            {
                foundPosition = true;
                scores.splice(i, 0, scoreToUpdate);
                break;
            }
        }

        // Put new score in last place
        if (!foundPosition)
        {
            scores.push(scoreToUpdate);
        }

        // Cutoff scoreboard at 10 entries
        if (scores.length > 10)
        {
            scores.length = 10;
        }

        localStorage.setItem('scores', JSON.stringify(scores));
    }

    // ------------------------
    // -- GAMEPLAY FUNCTIONS --
    // ------------------------

    getAllButtonsFromClass()
    {
        // forEach - Apply function to each item in a list. This function adds
        //           each button in .game-button to the Game class' buttons map
        document.querySelectorAll(".game-button").forEach((element, i) => 
        {
            if (i < buttonAssets.length)
            {
                this.buttons.set(element.id, new Button(buttonAssets[i], element));
            }
        });
    }

    // Gameplay logic of pressing a button - not the same as pressEffects()
    async pressButton(button)
    {
        let score = this.correctSequence.length - 1;

        if (this.playerInputEnabled)
        {
            this.playerInputEnabled = false;
            await this.buttons.get(button.id).pressEffects();

            // Check if correct button in sequence was pressed
            if (this.correctSequence[this.playerSequenceIndex].element.id === button.id)
            {
                this.playerSequenceIndex++;

                // Check if last button in sequence was pressed
                if (this.playerSequenceIndex === this.correctSequence.length)
                {
                    // Move to next round
                    this.playerSequenceIndex = 0;
                    this.addButtonToSequence();
                    this.updateScoreDisplayElement(score);
                    await this.playNextSequence();
                }

                // Allow player input after setting up next round
                this.playerInputEnabled = true;
            }
            else
            {
                // If the player pressed the wrong button
                this.saveScoreToCookies(score);
                this.errorSound.play();
                await this.playButtonDance(2);
            }
        }
    }

    async reset()
    {
        this.playerInputEnabled = false;

        this.playerSequenceIndex = 0;
        this.correctSequence = [];
        this.updateScoreDisplayElement("---");

        await this.playButtonDance();

        this.addButtonToSequence();
        await this.playNextSequence();

        this.playerInputEnabled = true;
    }

    addButtonToSequence()
    {
        const button = this.getRandomButton();
        this.correctSequence.push(button);
    }

    getRandomButton()
    {
        // Convert map values into a list
        let buttons = Array.from(this.buttons.values());
        return buttons[Math.floor(Math.random() * this.buttons.size)];
    }

    // ------------------------------
    // -- BUTTON VISUALS FUNCTIONS --
    // ------------------------------

    // Light up buttons in order of next sequence
    async playNextSequence()
    {
        // Wait 500ms
        await new Promise((resolve) =>
        {
            setTimeout(() =>
            {
                resolve(true);
            }, 500);
        });

        for (const button of this.correctSequence)
        {
            await button.pressEffects(1.0);

            // Wait 100ms
            await new Promise((resolve) =>
            {
                setTimeout(() =>
                {
                    resolve(true);
                }, 100);
            });
        }
    }

    // Light up buttons numLaps times without sound
    async playButtonDance(numLaps = 1)
    {
        for (let i = 0; i < numLaps; i++)
        {
            for (const button of this.buttons.values())
            {
                await button.pressEffects(0.0);
            }
        }
    }
}

const game = new Game();