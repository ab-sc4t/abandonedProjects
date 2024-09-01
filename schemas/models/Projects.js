export default (sequelize, DataTypes) => {
    const Projects = sequelize.define("Projects", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        githubLink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        typeProject: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timeStamps: true
    })
    return Projects;
}