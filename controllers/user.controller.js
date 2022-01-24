const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

module.exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        if(!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password: encryptedPassword });

        res.status(201).json({ user });
    } catch (error) {
        console.log(error);
    }   
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        if(!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const user = await User.findOne({ email });

        if(user && (await bcrypt.compare(password, user.password))) {
            const Token = jwt.sign(
                { user_id: user._id, email },
                config.TOKEN_KEY,
                { expiresIn: "1h" }
            );

            user.token = Token;
            req.user = user;

            user.save(err => {
                if(err) console.log(err)
            });

            return res.status(200).json({ "token": user.token })
        }

        return res.status(400).json("Неверный логин или пароль!");

    } catch (err) {
        console.log(err);
    }
}

module.exports.verify = async (req, res) => {
    if(!req.headers.authorization) return res.status(401).json({ "message": "Authorization error"});
    jwt.verify(req.headers.authorization.split(' ')[1], config.TOKEN_KEY, async (err, decoded) => {
        if(err) {
            console.log(err);
            return res.status(401).json({ "message": "Invalid token"});
        }
        
        const user = await User.findById({ _id: decoded.user_id })

        if(!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        if(user.token === req.headers.authorization.split(' ')[1]) {
            jwt.verify(user.token, config.TOKEN_KEY, (err, userDec) => {
                if(userDec.exp !== decoded.exp) {
                    return res.status(401).json({ "message": "Token already expired"});
                }

                if(userDec.user_id !== decoded.user_id) {
                    return res.status(401).json({ "message": "Invalid token"});
                }
            })
        } else {
            return res.status(401).json({ "message": "Invalid token"});
        }

        return res.status(200).json({ "message": "Token successfully" })
    })
}

module.exports.me = (req, res) => {
    return res.status(201).json({ "token": req.user });
}