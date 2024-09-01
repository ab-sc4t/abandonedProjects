import fs from 'fs';
import path from 'path';
import { models } from '../index.js'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const basename = path.basename(__filename);
const seeds = {};

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.endsWith('.js'));
    })
    .forEach(file => {
        const modelName = file.replace('.js', ''); 
        import(`./${file}`).then(module => {
            seeds[modelName] = module.default;
        });
    });

export default async () => {
    try {
        for (const modelName in seeds) {
            const Model = models[modelName];
            if (Model) {
                await Model.bulkCreate(seeds[modelName]);
                console.log(`${modelName} seeded successfully.`);
            } else {
                console.log(`No model found for ${modelName}`);
            }
        }
    } catch (error) {
        console.error('Seeding failed:', error);
    }
};