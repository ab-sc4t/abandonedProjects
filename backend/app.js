import express from "express";
import routes from "./Routes/index.js";
import {sequelize, runSeeds} from "../schemas/index.js";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
}
app.use(cors(corsOptions));
const port = process.env.DB_PORT;


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
