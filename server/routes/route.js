const express = require('express');
const { handleLogin, handleRegister } = require('../controllers/userController');
const routes = express.Router();

routes.post("/login", handleLogin);
routes.post("/register", handleRegister);

module.exports = {
    routes
}