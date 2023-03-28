const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const DB = require("./database.js");

const authCookieName = "token";

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
app.use(cookieParser());
app.use(express.static("public"));

const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.post("/auth/create", async (request, response) => 
{
    if (await DB.getUser(request.body.email))
    {
        response.status(409).send({ msg: "Existing user" });
    }
    else
    {
        const user = await DB.createUser(request.body.email, request.body.password);

        setAuthCookie(response, user.token);

        response.send(
        {
            id: user._id
        });
    }
});

apiRouter.post("/auth/login", async (request, response) =>
{
    const user = await DB.getUser(request.body.email);
    if (user)
    {
        if (await bcrypt.compare(request.body.password, user.password))
        {
            setAuthCookie(response, user.token);
            response.send({ id: user._id });
        }
    }
    else
    {
        response.status(401).send({ msg: "Unauthorized" });
    }
});

apiRouter.delete("/auth/logout", (_request, response) =>
{
    response.clearCookie(authCookieName);
    response.status(204).end();
});

apiRouter.get("/user/:email", async (request, response) =>
{
    const user = await DB.getUser(request.params.email);
    if (user)
    {
        const token = request?.cookies.token;
        response.send({ email: user.email, authenticated: token === user.token });

    }
    else
    {
        response.status(404).send({ msg: "Unknown" });
    }
});

const secureApiRouter = express.Router();
app.use("/api", secureApiRouter);

// Underscore denotes unused/private variables
secureApiRouter.get("/scores", async (_request, response) =>
{
    const scores = await DB.getHighScores();
    response.send(scores);
});

secureApiRouter.post("/score", async (request, response) =>
{
    DB.addScore(request.body);
    const scores = await DB.getHighScores();
    response.send(scores);
});

app.use((_request, response) =>
{
    response.sendFile("index.html", { root: "public" });
});

function setAuthCookie(response, authToken)
{
    response.cookie(authCookieName, authToken,
    {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

app.listen(port, () =>
{
    // Send confirmation that server is listening
    console.log(`Listening on port ${port}`);
});
