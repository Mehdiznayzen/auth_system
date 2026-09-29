const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const checkUserEmail = await User.findOne({ email });
        if(!checkUserEmail){
            return res.json({ msg : 'Incorrect email or password !', status : false})
        }

        const isPasswordValid = await bcrypt.compare(password, checkUserEmail.password);
        if(!isPasswordValid){
            return res.json({ msg : 'Incorrect email or password !', status : false})
        }

        return res.json({ 
            status: true,
            checkUserEmail
        })

    } catch (error) {
        next(error)
    }
}

const handleRegister = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                msg: "All fields are required",
            });
        }

        // Vérifier si l'email existe déjà
        const checkEmailExists = await User.findOne({ email });
        if (checkEmailExists) {
            return res.status(409).json({
                status: false,
                msg: "Email is already used!",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
        });

        return res.status(201).json({
            status: true,
            msg: "Account created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt,
            },
        });

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            status: false,
            msg: "Server error",
        });
    }
};

module.exports = {
    handleLogin,
    handleRegister
};