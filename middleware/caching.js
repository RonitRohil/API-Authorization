require('dotenv').config();
let redisClient = require("../middleware/redis.client");

const redis_post = (req, res, next) => {
    redisClient.get('userData', (err, redis_data) => {
        if (err) {
            console.log('Error after redisclient: ', err);
            return res.status(500).send('Error retrieving data from Redis');
        } 
        
        else if (redis_data) {
            console.log(redis_data);
            return res.send(JSON.parse(redis_data));
        } 
        
        else {
            return next();
        }
    });
};
  

module.exports = redis_post;