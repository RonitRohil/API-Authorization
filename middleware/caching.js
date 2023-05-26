// Not required 



require('dotenv').config();
const redisClient = require("../middleware/redis.client");

const redis_post = async(req, res, next) => {
    console.log("redis get called");
    let user_data = await redisClient.get('userData');
    console.log(user_data);
    return res.status(500).send(JSON.parse(user_data));

    
    
    // await redisClient.get('userData',  async(err, data) => {
    //     console.log("function called");
    //     if (err) {
    //         console.log('Error after redisclient: ', err);
    //         res.status(500).send('Error retrieving data from Redis', err);
    //     } 

    //     else if (data !== null) {
    //         console.log(redis_data);
    //         res.send(JSON.parse(data));
    //     } 

    //     else {
    //         next();
    //     }
    // });
};

module.exports = redis_post;