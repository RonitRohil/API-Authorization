require('dotenv').config();
const express = require("express");
const app = express();
const conn = require("./config/auth.database");
const User = require('./model/auth.model');
const router = require("./routes/auth.route")
const redis = require("redis");

const port = process.env.PORT || 8080;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

let redisClient;

(async () => {
    
    redisClient = redis.createClient(REDIS_PORT);
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    
    await redisClient.connect();
})();

app.use(express.json());
app.use(express.urlencoded({extended:false}))

// console.log('hh',conn)
app.use("/auth",router)

app.get("/", (req, res) => {
    res.send("Hi");
})

const getUser = async (req, res) =>
{
    try {
        console.log('fetching data ....');
        const user = await User.find({});
        console.log("Request for user data sent to API")

        if(!user)
        {
            return res.send('No users of name exists')
        }
        
        console.log(user);

        redisClient.set('userData', JSON.stringify(user));
        redisClient.on("error", (error) => console.error(`Error : ${error}`));
        
        res.send(user);
    } 

    catch (err) {
        console.error(err);
        res.status(500).send(err);
    }

}

const redis_post = (req, res, next) => {
    redisClient.get('userData', (err, redis_data) => {
      if (err) {
        console.log('Error after redisclient: ', err);
        res.status(500).send('Error retrieving data from Redis');
      } else if (redis_data) {
        console.log(redis_data);
        res.send(JSON.parse(redis_data));
      } else {
        next();
      }
    });
  };
  

app.get("/user", redis_post ,getUser);


app.listen(port, async(req,res)=>{
    await conn;
    console.log(`server is running at port no ${port}`)
})

