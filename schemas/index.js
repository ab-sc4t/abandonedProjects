import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import runSeeds from "./seedData/index.js"
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
        paranoid: true,
        timestamps: true
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDir = path.join(__dirname, 'models');
const models = {};

async function loadModels(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (file !== 'index.js' && file.endsWith('.js')) {
            const filePath = `file://${path.join(directory, file)}`;
            const modelDefiner = await import(filePath);
            const model = modelDefiner.default(sequelize, Sequelize.DataTypes);
            models[model.name] = model;
        }
    }

    Object.keys(models).forEach(modelName => {
        if (models[modelName].associate) {
            models[modelName].associate(models);
        }
    });
}

await loadModels(modelsDir);

export { sequelize, models, runSeeds };
