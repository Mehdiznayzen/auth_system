const express = require('express');
const { 
    handleLogin, 
    handleRegister, 
    handleProfile, 
    handleUpdateUser, 
    handleForgotPassword,
    handleResetPassword
} = require('../controllers/userController');
const verifyToken = require('../middleware/auth.middleware');
const router = express.Router();

router.get("/profile", verifyToken, handleProfile);
router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/forgot-password", handleForgotPassword);
router.post("/reset-password/:token", handleResetPassword);
router.put("/update-user/:id", handleUpdateUser);

module.exports = {
    router
}