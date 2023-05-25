const { registerUser } = require('../controller/auth.controller');
const { LoginUser } = require('../controller/auth.controller');
const { LogoutUser } = require('../controller/auth.controller');
const { WelcomeUser } = require('../controller/auth.controller');
const auth = require("../middleware/authrization");

const router = require('express').Router()

router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/logout', LogoutUser);
router.get('/welcome', auth , WelcomeUser);

module.exports = router