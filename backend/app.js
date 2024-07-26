import express from "express";
import routes from "./Routes/index.js";
import {sequelize, runSeeds} from "../schemas/index.js";
import cors from "cors";
import session from "express-session"

const app = express();
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
}
app.use(cors(corsOptions));
const port = 8080;


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
