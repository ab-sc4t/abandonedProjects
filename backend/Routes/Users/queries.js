import express from "express";
import { models } from "../../../schemas/index.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { sequelize } from "../../../schemas/index.js";
import session from "express-session";
import passport from "passport";

const router = express.Router();
router.use(bodyParser.json());

router.use(session({
    secret: "TESTINGSESSION",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: false } // Set to true if using https
}));

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

router.get('/check-session', (req, res) => {
    if (req.session.userID) {
        res.status(200).json({ loggedIn: true, message: "LOGGED IN" });
    } else {
        res.status(200).json({ loggedIn: false });
    }
});


router.post('/register', async (req, res) => {
    try {
        const { email, firstname, lastname, password } = req.body;
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
                    firstname,
                    lastname,
                    email,
                    password: hash,
                });
                const userID = user.id;
                req.session.userID = userID;
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
        const { email, password } = req.body;
        const user = await models.Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid password' });
        } else {
            req.session.userID = user.id;
            res.status(200).json({ message: 'Login successful', redirectUrl: '/' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
