const express = require("express");
const app = express();
const db = require("mongodb");

let port;
if (process.argv.length > 2)
{
    port = process.argv[2];
}
else
{
    port = 3000;
}

app.use(express.json());
app.use(express.static("public"));

const apiRouter = express.Router();
app.use("/api", apiRouter);

// Underscore denotes unused/private variables
apiRouter.get("/scores", async (_request, response) =>
{
    const scores = await db.getHighScores();
    response.send(scores);
});

apiRouter.post("/score", async (request, response) =>
{
    db.addScore(request.body);
    const scores = await db.getHighScores();
    response.send(scores);
});

app.use((_request, response) =>
{
    response.sendFile("index.html", { root: "public" });
});

app.listen(port, () =>
{
    // Send confirmation that server is listening
    console.log(`Listening on port ${port}`);
});