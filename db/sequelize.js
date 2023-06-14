const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize("db_funarea", "root", "", {
    host: "localhost",
    dialect: "mariadb",
    logging: false,
    timezone: "Europe/Paris",
})

const AreaTypeModel = require("../models/area-type.model")(sequelize, DataTypes)
const AreaZoneModel = require("../models/area-zone.model")(sequelize, DataTypes)
const AreaModel = require("../models/area.model")(sequelize, DataTypes)
const UserModel = require("../models/user.model")(sequelize, DataTypes)

// AreaTypeModel.hasMany(AreaModel, {
//     foreignKey: {allowNull: false}
// })
AreaModel.belongsTo(AreaTypeModel, {
        foreignKey: {allowNull: false}
    });

// AreaZoneModel.hasMany(AreaModel, {
//     foreignKey: {allowNull: false}
// })
AreaModel.belongsTo(AreaZoneModel, {
    foreignKey: {allowNull: false}
});

sequelize.authenticate()
    .then(() => console.log("La connexion à la BDD a bien été établie"))
    .catch(error => console.error(`Impossible de se connecter à la BDD ${error}`))

module.exports = { sequelize, AreaTypeModel, AreaZoneModel, AreaModel, UserModel }