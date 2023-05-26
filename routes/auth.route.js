const { registerUser } = require('../controller/auth.controller');
const { LoginUser } = require('../controller/auth.controller');
const { LogoutUser } = require('../controller/auth.controller');
const { WelcomeUser } = require('../controller/auth.controller');
const { Intro } = require('../controller/auth.controller');
const { getUser } = require('../controller/auth.controller');
const auth = require("../middleware/authorization");
const redis_post = require("../middleware/caching");

const router = require('express').Router()

router.post('/auth/register', registerUser);
router.post('/auth/login', LoginUser);
router.post('/auth/logout', LogoutUser);
router.get('/auth/welcome', auth , WelcomeUser);
router.get('/auth', Intro);
router.get("/auth/user" , redis_post, getUser);

module.exports = router