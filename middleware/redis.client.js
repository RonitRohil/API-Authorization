const redis = require("redis");

const REDIS_PORT = process.env.REDIS_PORT || 6379;

let redisClient;

(async () => {
    
    redisClient = redis.createClient(REDIS_PORT);
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    
    await redisClient.connect();
    console.log('Redis connected!')
})();

module.exports = redisClient;