import fs from "fs";
import path from "path";
import {sequelize, DataTypes} from "../app.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const basename = path.basename(__filemame);
const models = {};

fs.readdirSync(__dirname)
    .filter(file=>{
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.endsWith('.js'));
    })  
    .forEach(file=>{
        import(`./${file}`).then(module=>{
            const model = module.default(sequelize, DataTypes);
            models[model.name] = model;
        });
    });

export default models;
