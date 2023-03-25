const { MongoClient } = require("mongodb");

const username = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!username)
{
    throw Error("Database not configured. Set environment variables");
}

const url = `mongodb+srv://${username}:${password}@${hostname}`;

const client = new MongoClient(url);
const scoreCollection = client.db("simon").collection("score");

function addScore(score)
{
    scoreCollection.insertOne(score);
}

function getHighScores()
{
    const query = { score: { $gt: 0 } };
    const options = 
    {
        sort: { score: -1 },
        limit: 10,
    };
    const cursor = scoreCollection.find(query, options);
    return cursor.toArray();
}

module.exports = { addScore, getHighScores };