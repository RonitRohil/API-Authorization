const { registerUser } = require('../controller/auth.controller');
const { LoginUser } = require('../controller/auth.controller');
const { LogoutUser } = require('../controller/auth.controller');
const { WelcomeUser } = require('../controller/auth.controller');
const { Intro } = require('../controller/auth.controller');
const auth = require("../middleware/authrization");

const router = require('express').Router()

router.post('/auth/register', registerUser);
router.post('/auth/login', LoginUser);
router.post('/auth/logout', LogoutUser);
router.get('/auth/welcome', auth , WelcomeUser);
router.post('/auth', Intro);

module.exports = router