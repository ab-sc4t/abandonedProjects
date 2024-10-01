import express, { application } from "express";
import { models } from "../../../schemas/index.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from 'dotenv';
import speakeasy from "speakeasy";
import nodemailer from "nodemailer"

dotenv.config({ path: '../.env' });

const router = express.Router();
router.use(bodyParser.json());

router.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
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

//otp sending
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true,  
    logger: true  
});


function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error sending email:', error);  // Log the error if the email fails
        } else {
            console.log('Email sent: ' + info.response);  // Log success response
        }
    });
}


// Check session route
router.get('/check-session', (req, res) => {
    if (req.session.userID) {
        console.log("Logged In");
        res.status(200).json({ loggedIn: true, message: "LOGGED IN" });
    } else {
        console.log("NONONO");
        res.status(200).json({ loggedIn: false });
    }
});

router.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session Contents:', req.session);
    next();
});

// Get user info route
router.get('/user', async (req, res) => {
    if (req.session.userID) {
        try {
            const user = await models.Users.findByPk(req.session.userID);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving user' });
        }
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

//verify-otp
router.post('/verify-otp', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Unauthorized');
    }

    const { otp } = req.body;
    const verified = speakeasy.totp.verify({
        secret: process.env.OTP_SECRET,
        encoding: 'base32',
        token: otp
    });

    console.log(req.session.otp);
    console.log(otp);

    if (req.session.otp === otp) {
        console.log("OTP IS CORRECT");
        res.json({ redirect: '/' }); // Send redirect URL in JSON response
    } else {
        res.status(401).send('Invalid OTP. Please try again.');
    }
});



// router.post('/register', async (req, res) => {
//     try {
//         const { email, firstname, lastname, password } = req.body;
//         const existingUser = await models.Users.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already in use' });
//         }

//         bcrypt.hash(password, saltRounds, async (err, hash) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Error hashing password' });
//             }
//             try {
//                 const user = await models.Users.create({
//                     firstname,
//                     lastname,
//                     email,
//                     password: hash,
//                 });
//                 const userID = user.id;
//                 req.session.userID = userID;
//                 res.status(201).json({ userID });
//             } catch (error) {
//                 res.status(500).json({ error: 'Error creating user or user table' });
//             }
//         });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await models.Users.findOne({ where: { email } });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.status(401).json({ error: 'Invalid password' });
//         } else {
//             req.session.userID = user.id;
//             res.status(200).json({ message: 'Login successful', redirectUrl: '/' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
});


passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    userProfileURL: process.env.GOOGLE_PROFILEURL,
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        console.log(process.env.GOOGLE_CLIENT_ID);
        const email = profile._json.email;
        const firstname = profile._json.given_name || 'Unknown';
        const lastname = profile._json.family_name || 'Unknown';

        let user = await models.Users.findOne({ where: { email } });

        if (!user) {
            user = await models.Users.create({
                email,
                firstname,
                lastname,
                password: null
            });
        } else {
            await user.update({ firstname, lastname });
        }
        const otp = speakeasy.totp({
            secret: process.env.OTP_SECRET,
            encoding: 'base32'
        });
        cb(null, { user, otp });
    } catch (error) {
        console.error("Error handling Google login", error);
        cb(error, null);
    }
}));

router.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile'],
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}), (req, res) => {
    if (req.user) {
        req.session.userID = req.user.user.id;
        req.session.otp = req.user.otp; // Store OTP in session for later verification
        sendOTPEmail(req.user.user.email, req.user.otp);
        res.redirect('http://localhost:3000/verify-otp'); // Redirect to OTP verification page
    } else {
        res.redirect('/login');
    }
});

passport.serializeUser((user, done) => {
    // Only serialize the user ID, not the entire user object
    console.log('Serializing user ID:', user.user.id);  // user.user.id instead of user.id
    done(null, user.user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Fetch the user from the database using the ID
        const user = await models.Users.findByPk(id);
        console.log('Deserialized user:', user);
        done(null, user);  // Pass the user object
    } catch (err) {
        console.error('Error deserializing user:', err);
        done(err, null);
    }
});


export default router;
