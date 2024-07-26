import express from "express";
import { models } from "../../../schemas/index.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import {sequelize} from "../../../schemas/index.js"
import session from "express-session"
import passport from "passport";

const router = express.Router();
router.use(bodyParser.json());

router.use(session({
    secret: "TESTINGSESSION",
    resave: false,
    saveUninitialized: true
}))

router.use(passport.initialize());
router.use(passport.session());

const saltRounds = 10;

router.get("/", async (req, res) => {
    try {
        const allUsers = await models.Users.findAll();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, mobile, firstname, lastname, password } = req.body;
        const existingUser = await models.Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password' });
            }

            try {
                const user = await models.Users.create({
                    username: username || email,
                    firstname,
                    lastname,
                    email,
                    password: hash,
                    mobile
                });
                res.status(201).json({ userID });
            } catch (error) {
                res.status(500).json({ error: 'Error creating user or user table' });
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let filter = { email: email }
        const user = await models.Users.findOne(
            { where: filter }
        )
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        else {
            res.status(200).json({ message: 'Login successful', redirectUrl: 'localhost:3000/' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;