import express from "express";
import routes from "./Routes/index.js";
import {sequelize, runSeeds} from "../schemas/index.js";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",  // Only allow requests from this origin
    credentials: true,  // Allow cookies and other credentials to be sent
    optionsSuccessStatus: 200  // Some browsers (like IE11) may use 204 as a fallback status code for preflight
};

app.use(cors(corsOptions));

// other middleware and routes

const port = process.env.DB_PORT || 8080;

sequelize.sync({force: true}).then(()=>{
    console.log("Database Synchronized");
    return runSeeds();
}) 
.then(()=>{
    console.log("Seeding completed")
})
.catch(err=>{
    console.error(`Error while syncing the database: ${err}`);
})


Object.values(routes).forEach((route)=>{
    app.use(route.path,route.router);
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
