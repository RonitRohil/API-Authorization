require('dotenv').config();
const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const conn = require("./config/database");
const jwt = require("jsonwebtoken");
const User = require('./model/register_user');
const auth = require("./middleware/auth");
const redis = require("redis");

const port = process.env.PORT || 8080;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.get("/", (req, res) => {
    res.send("Hi");
})

app.post("/register", async (req, res) =>{
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

        console.log(`The current password is ${password}`);

        encryptedPassword = await bcrypt.hash(password, 10);

        console.log(`The current password is ${encryptedPassword}`);

        const registerUser = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
            phonenumber,
        });

        console.log("the success part" + registerUser);

        const registered_user = await registerUser.save();
        res.status(201).json(registerUser);

    } 
    
    catch (error) {
        res.status(400).send(error)
    }
});

app.post("/login", async (req, res) =>{
    try {
        const { email, password } = req.body;

        console.log(email, password);

        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        console.log("email password both entered");

        const user = await User.findOne({ email });

        console.log(user);

        if (!user) {
            return res.status(400).json({ message: 'Invalid Email' });
        }

        console.log(password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log(isMatch);

        if(!isMatch)
        {
           return res.status(400).json({ message: 'Invalid Password' });
        }
        
        console.log('process.env.SECRET_KEY ',process.env.SECRET_KEY)

        const token = jwt.sign({ userId: user._id,email: user.email, password: user.password }, process.env.SECRET_KEY);

        console.log('token ',token)
        user.token = token;

        res.json({ message: 'User login successfully', data : user, token : token });

        // res.status(201).json(user);

    } catch (error) {
        res.status(400).send("Invalid Credentials");
    }
});

app.post('/logout', (req, res) => {
    // Clear the token from the client-side
    res.clearCookie('token');
    res.json({ message: 'User Logged Out' });
  });

app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

app.listen(port, async(req,res)=>{
    await conn;
    console.log(`server is running at port no ${port}`)
})

