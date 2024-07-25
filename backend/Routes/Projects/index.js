import express from "express";
import queries from "./queries.js";
const router = express.Router();

router.use("/", queries);


export default router;