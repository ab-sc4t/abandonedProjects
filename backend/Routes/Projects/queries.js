import express from "express";
import { models } from "../../../schemas/index.js";
import bodyParser from "body-parser";
import {sequelize} from "../../../schemas/index.js"
// import cors from "cors";
// import Users from "../../../schemas/models/Users.js";

const router = express.Router();
// router.use(cors());
router.use(bodyParser.json());

// Route to fetch all active Projects or by category if provided
router.get("/", async (req, res) => {
    const { category } = req.query;

    try {
        let filter = { status: "active" };

        if (category) {
            filter.category = category;
        }

        const activeProjects = await models.Projects.findAll({
            where: filter
        });

        res.json(activeProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send("Internal server error");
    }
});

// Route to fetch a product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await models.Projects.findByPk(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send("Project not found");
        }
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).send("Internal server error");
    }
});



export default router;
