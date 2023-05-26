const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redisClient = require("../middleware/redis.client");
const User = require("../model/auth.model");

const getUser = async (req, res) =>
{
    try {

        //catching
        const cache = await redisClient.get('userData')
        if (cache) {
            return res.json(JSON.parse(cache))
        }

        console.log('fetching data ....');
        const user = await User.find({});
        console.log("Request for user data sent to API")
        console.log(user);

        await redisClient.set('userData', JSON.stringify(user), 'EX', 5);
        console.log("setting userdata to redis");
        // redisClient.on("error", (error) => console.error(`Error : ${error}`));
        
        return res.send(user);
    } 

    catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
}

const registerUser = async(req, res) =>{
    try {
        
        const { first_name, last_name, email, password, phonenumber } = req.body;
        if (!(email && password && first_name && last_name && phonenumber)) {
            res.status(400).send("All input is required");
        }
        
        const oldUser = await User.findOne({email});
        if(oldUser)
        {
            return res.status(409).send("User already exists. Please Login");
        }

        // console.log(`The current password is ${password}`);
        encryptedPassword = await bcrypt.hash(password, 10);
        // console.log(`The current password is ${encryptedPassword}`);

        const registerUser = await User.create({
            first_name, last_name, email: email.toLowerCase(), password: encryptedPassword, phonenumber,
        });

        console.log("the success part" + registerUser);
        const registered_user = await registerUser.save();
        return res.status(201).json(registerUser);
    } 
    catch (error) {
        res.status(400).send(error)
    }
};

const LoginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        // console.log("email password both entered");
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email' });
        }

        // console.log(password);
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch);
        if(!isMatch)
        {
           return res.status(400).json({ message: 'Invalid Password' });
        }
              
        const token = jwt.sign({ userId: user._id,email: user.email, password: user.password }, process.env.SECRET_KEY);
        console.log('token ',token)
        user.token = token;

        return res.json({ message: 'User login successfully', data : user, token : token });
    } 
    catch (error) {
        return res.status(400).send("Invalid Credentials");
    }
};

const LogoutUser = (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'User Logged Out' });
}

const WelcomeUser = (req, res) => {
    return res.status(200).send("Welcome 🙌, Your authorization was successful....");
}

const Intro = (req, res) => {
    res.send("Hi");
}

module.exports = {registerUser, LoginUser, LogoutUser, WelcomeUser, Intro, getUser}