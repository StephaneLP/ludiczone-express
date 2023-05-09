const { Sequelize, DataTypes } = require("sequelize")
const dataAreaType = require("./data/area-type.json")

const sequelize = new Sequelize("db_funarea", "root", "", {
    host: "localhost",
    dialect: "mariadb",
    logging: false,
})

const AreaTypeModel = require("../models/area-type.model")(sequelize, DataTypes)
const AreaZoneModel = require("../models/area-zone.model")(sequelize, DataTypes)
const AreaModel = require("../models/area.model")(sequelize, DataTypes)

AreaTypeModel.hasMany(AreaModel, {
    foreignKey: {allowNull: false}
})
AreaModel.belongsTo(AreaTypeModel);

AreaZoneModel.hasMany(AreaModel, {
    foreignKey: {allowNull: false}
})
AreaModel.belongsTo(AreaZoneModel);

const initDb = () => {
    // Trois options : sync() - sync({ force: true }) - sync({ alter: true })
    sequelize.sync({ force: true })
        .then(() => {
            dataAreaType.forEach((element) => {
                AreaTypeModel.create({
                    name: element.name,
                    description: element.description,
                    picture: element.picture,
                    rank: element.rank,
                })
            });
        })
}

sequelize.authenticate()
    .then(() => console.log("La connexion à la BDD a bien été établie"))
    .catch(error => console.error(`Impossible de se connecter à la BDD ${error}`))

module.exports = { sequelize, AreaTypeModel, initDb }