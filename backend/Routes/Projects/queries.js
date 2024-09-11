import express from "express";
import { models } from "../../../schemas/index.js";
import bodyParser from "body-parser";
import { sequelize } from "../../../schemas/index.js";
import session from "express-session"
import passport from "passport";
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const router = express.Router();
router.use(bodyParser.json());

router.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}))

router.use(passport.initialize());
router.use(passport.session());

router.get("/", async (req, res) => {
    try {
        const activeProjects = await models.Projects.findAll();
        res.json(activeProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send("Internal server error");
    }
});

router.get("/:email", async (req, res) => {
    try {
        console.log(req.params.email);
        const projects = await models.Projects.findAll({
            where: {
                email: req.params.email,
            },
        });
        console.log("PROJECTS: " + projects);
        if (projects.length > 0) {
            res.json(projects);
        } else {
            res.status(404).send("No projects found for this email");
        }
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send("Internal server error");
    }
});


router.post("/add", async (req, res) => {
    try {
        const { name, owner, githubLink, email, typeProject } = req.body;
        const existingProject = await models.Projects.findOne({ where: { githubLink } });
        if (existingProject) {
            return res.status(400).json({ error: 'This project is already there' });
        }

        const project = await models.Projects.create({
            name,
            githubLink,
            owner,
            email,
            typeProject,
        });
        console.log("Success");
        return res.status(200).json({
            message: 'Project added successfully!',
            route: '/'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding the new project' });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const projectID = req.params.id;
    try {
        const project = await models.Projects.findByPk(projectID);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.destroy();
        res.status(200).json({ message: 'Project deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting the new project' });
    }
})

export default router;
