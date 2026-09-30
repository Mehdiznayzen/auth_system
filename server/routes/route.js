const express = require('express');
const { handleLogin, handleRegister, handleProfile, handleUpdateUser } = require('../controllers/userController');
const verifyToken = require('../middleware/auth.middleware');
const routes = express.Router();

routes.post("/login", handleLogin);
routes.post("/register", handleRegister);
routes.put("/update-user/:id", handleUpdateUser);
routes.get("/profile", verifyToken, handleProfile);

module.exports = {
    routes
}