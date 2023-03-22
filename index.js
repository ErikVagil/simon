const express = require("express");
const app = express();

// Set port
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Use Express capabilities
app.use(express.json());
app.use(express.static("public"));

// Endpoint router
const router = express.Router();
app.use(`/api`, router);

// GET scores middleware
// "/scores" is where they're stored
router.get("/scores", (_request, response) =>
{
    response.send(scores);
});

// POST scores middleware
// "/score" is the score object to be added
router.post("/score", (request, response) =>
{
    scores = updateScores(request.body, scores);
    response.send(scores);
});

// Default case if can't get path
app.use((_request, response) =>
{
    response.sendFile("index.html", { root: "public" });
});

let scores = [];
function updateScores(newScore, scores)
{
    let found = false;
    for (const [i, prevScore] of scores.entries()) {
        if (newScore.score > prevScore.score) {
        scores.splice(i, 0, newScore);
        found = true;
        break;
        }
    }

    if (!found) {
        scores.push(newScore);
    }

    if (scores.length > 10) {
        scores.length = 10;
    }

    return scores;
}