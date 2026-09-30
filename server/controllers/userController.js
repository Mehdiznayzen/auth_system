const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.json({ msg : 'Incorrect email or password !', status : false})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.json({ msg : 'Incorrect email or password !', status : false})
        }

        // Création du JWT
        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        });

        return res.json({ 
            status: true,
            msg: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

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

const handleProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                status: false,
                msg: "User not found",
            });
        }

        return res.status(200).json({
            status: true,
            user,
        });
    }catch(error) {
        console.error(error);

        return res.status(500).json({
            status: false,
            msg: "Server error"
        });
    }
}

const handleUpdateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                status: false,
                msg: "User not found",
            });
        }

        const updateData = {
            name,
            email,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updateUser = await User.updateOne(
            { _id: id },
            {
                $set: updateData,
            }
        );

        return res.status(200).json({
            status: true,
            msg: "Account updated successfully",
            updateUser,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: false,
            msg: "Server error",
        });
    }
};

module.exports = {
    handleLogin,
    handleRegister,
    handleProfile,
    handleUpdateUser
};