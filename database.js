const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const username = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!username)
{
    throw Error("Database not configured. Set environment variables");
}

const url = `mongodb+srv://${username}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db("simon").collection("user");
const scoreCollection = client.db("simon").collection("score");

function getUser(email)
{
    return userCollection.findOne({ email: email });
}

function getUserByToken(token)
{
    return userCollection.findOne({ token: token });
}

async function createUser(email, password)
{
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user object to send
    const user =
    {
        email: email,
        password: passwordHash,
        token: uuid.v4()
    };
    await userCollection.insertOne(user);

    return user;
}

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

module.exports = 
{ 
    addScore, 
    getHighScores,
    getUser,
    getUserByToken,
    createUser
};