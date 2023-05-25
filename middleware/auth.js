require('dotenv').config();
const jwt = require("jsonwebtoken");
const config = process.env;
const User = require('../model/register_user');

const verifyToken = async (req, res, next) => {

  console.log('headers ', req.headers)
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const token = authorization.replace("Bearer ", "");
    console.log('token',token)

    console.log('process.env.SECRET_KEY ',process.env.SECRET_KEY)
   
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
      
      if (err) {
        console.log(' erros ',err);
        return res.status(404).json({ error: "Need to Log In" });
      }

      const { _id } = payload;
      User.findById(_id).then((data) => {
        req.user = data;
        next();
      });
    });

    next();

    return res.status(200).json(User);
  } 
  
  catch (err) {
    console.log('catch ',err)
    return res.status(401).send("Invalid Token");
  }

};

module.exports = verifyToken;



