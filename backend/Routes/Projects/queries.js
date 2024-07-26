import express from "express";
import { models } from "../../../schemas/index.js";
import bodyParser from "body-parser";
import {sequelize} from "../../../schemas/index.js"

const router = express.Router();
router.use(bodyParser.json());

router.get("/", async (req, res) => {
    try {
        const activeProjects = await models.Projects.findAll();

        res.json(activeProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send("Internal server error");
    }
});

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

router.post ("/add", async (req,res)=>{
    try{
        const {name, owner, githubLink} = req.body;
        const existingProject = await models.Projects.findOne({where: {githubLink}});
        if (existingProject){
            return res.status(400).json({ error: 'This project is already there' });
        }
        const project = await models.Projects.create({
            name,
            githubLink,
            owner
        })
        console.log("Success");
        res.status(200);
    } catch (error){
        res.status(500).json({ error: 'Error adding the new project' });
    }
})

export default router;
