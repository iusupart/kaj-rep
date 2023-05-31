'use strict'

const bcrypt = require('bcrypt');
const saltRounds = 10;
const connection = require('../settings/db');
const jwt = require('jsonwebtoken');

class UserController {
    static async registerUser(email, password) {
        try {
            const collection = await connection.db("dayplanner").collection("users");
            const existingUser = await collection.findOne({ email });

            if (existingUser) {
                return { success: false, message: 'Username already exists' };
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await collection.insertOne({ email: email, password: hashedPassword });
            return { success: true, message: 'User was successfully registered' }
        } catch (err) {
            console.error(err);
            return { success: false, message: err };
        }
    }

    static async loginUser(email, password) {
        try {
            const collection = await connection.db("dayplanner").collection("users");
            const user = await collection.findOne({ email });

            if (user) {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (isPasswordValid) {
                    const token = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: '2h' }); 
                    return { success: true, message: 'User was successfully auth', token: token }
                } else {
                    return { success: false, message: 'Invalid username or password' };
                }
            } else {
                return { success: false, message: 'Invalid username or password' };
            }
        } catch (err) {
            console.error(err);
            return { success: false, message: err };
        }
    }
}

module.exports = UserController;
