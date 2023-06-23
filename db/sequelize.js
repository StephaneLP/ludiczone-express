const { Sequelize, DataTypes } = require("sequelize")

/*********************************************************
Connexion à la BDD
*********************************************************/
const sequelize = new Sequelize("db_funarea", "root", "", {
    host: "localhost",
    dialect: "mariadb",
    logging: false,
    timezone: "Europe/Paris",
})

/*********************************************************
Import des models et des relations
*********************************************************/
const AreaTypeModel = require("../models/area-type.model")(sequelize, DataTypes)
const AreaZoneModel = require("../models/area-zone.model")(sequelize, DataTypes)
const AreaModel = require("../models/area.model")(sequelize, DataTypes)
const UserModel = require("../models/user.model")(sequelize, DataTypes)

AreaModel.belongsTo(AreaTypeModel, {
    foreignKey: {allowNull: false},
})
AreaTypeModel.hasMany(AreaModel)

AreaModel.belongsTo(AreaZoneModel, {
    foreignKey: {allowNull: false}
})
AreaZoneModel.hasMany(AreaModel)

/*********************************************************
Test de la connexion à la BDD
*********************************************************/
sequelize.authenticate()
    .then(() => console.log("La connexion à la BDD a bien été établie"))
    .catch(error => console.error(`Impossible de se connecter à la BDD ${error}`))

module.exports = { sequelize, AreaTypeModel, AreaZoneModel, AreaModel, UserModel }