const bcrypt = require("bcrypt")
const { Sequelize, DataTypes } = require("sequelize")

const dataAreaType = require("./data/area-type.json")
const dataAreaZone = require("./data/area-zone.json")
const dataArea = require("./data/area.json")
const dataUser = require("./data/user.json")

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

const initDb = () => {
    // Trois options : sync() - sync({ force: true }) - sync({ alter: true })
    sequelize.sync({ force: true })
        .then(() => {
            dataAreaType.forEach((element) => {
                AreaTypeModel.create({
                    id: element.id,
                    name: element.name,
                    description: element.description,
                    picture: element.picture,
                    rank: element.rank,
                    created_at: element.created_at,
                })
            })
        })
        .then(() => {
            dataAreaZone.forEach((element) => {
                AreaZoneModel.create({
                    id: element.id,
                    name: element.name,
                    description: element.description,
                    picture: element.picture,
                    rank: element.rank,
                })
            })
        })
        .then(() => {
            dataArea.forEach((element) => {
                AreaModel.create({
                    name: element.name,
                    description_short: element.description_short,
                    description_long: element.description_long,
                    AreaTypeId: element.AreaTypeId,
                    AreaZoneId: element.AreaZoneId,
                })
            })             
        })
        .then(() => {
            dataUser.forEach((element) => {
                bcrypt.hash(element.password,10)
                .then((hash) => {
                    UserModel.create({
                        id: element.id,
                        first_name: element.first_name,
                        last_name: element.last_name,
                        nick_name: element.nick_name,
                        email: element.email,
                        password: hash,
                        role: element.role,
                    })
                })
            })  
        })
        .catch((error) => console.log(error))
}

sequelize.authenticate()
    .then(() => console.log("La connexion à la BDD a bien été établie"))
    .catch(error => console.error(`Impossible de se connecter à la BDD ${error}`))

module.exports = { sequelize, AreaTypeModel, AreaZoneModel, AreaModel, UserModel, initDb }