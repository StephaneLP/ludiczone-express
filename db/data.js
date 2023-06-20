const { sequelize, AreaModel, AreaTypeModel, AreaZoneModel, UserModel } = require('./sequelize')
const bcrypt = require("bcrypt")

const dataAreaType = require("./data/area-type.json")
const dataAreaZone = require("./data/area-zone.json")
const dataArea = require("./data/area.json")
const dataUser = require("./data/user.json")

/*
Initialisation des tables :
- import des données dans les tables par paquets (promise.all)
- Trois options : sync() - sync({ force: true }) - sync({ alter: true })
*/
const initDb = () => {
    sequelize.sync({ force: true })
        .then(() => {
            Promise.all(setAreaType())
                .then(() => {
                    Promise.all(setAreaZone())
                    .then(() => {
                        Promise.all(setArea())
                        .then(() => {
                            Promise.all(setUser())
                            .then(() => {
                                console.log("Import des données terminé (initDB).");
                            })   
                        })
                    })
                })
        })
        .catch((error) => console.log(error))
}

/*
Initialisation du tableau contenant les promesses qui :
- inserent les types de loisir dans la table area_type
- à partir du fichier area-type.json
*/
const setAreaType = () => {
    const tabPromesses = []

    dataAreaType.forEach((element) => {
        const creer = AreaTypeModel.create({
            id: element.id,
            name: element.name,
            description: element.description,
            picture: element.picture,
            rank: element.rank,
            created_at: element.created_at,
        })
        tabPromesses.push(creer)
    })

    return tabPromesses
}

/*
Initialisation du tableau contenant les promesses qui :
- inserent les zones dans la table area_zone
- à partir du fichier area-zone.json
*/
const setAreaZone = () => {
    const tabPromesses = []

    dataAreaZone.forEach((element) => {
        const creer = AreaZoneModel.create({
            id: element.id,
            name: element.name,
            description: element.description,
            picture: element.picture,
            rank: element.rank,
            created_at: element.created_at,
        })
        tabPromesses.push(creer)
    })

    return tabPromesses
}

/*
Initialisation du tableau contenant les promesses qui :
- inserent les zones dans la table area
- à partir du fichier area.json
*/
const setArea = () => {
    const tabPromesses = []

    dataArea.forEach((element) => {
        const creer = AreaModel.create({
            name: element.name,
            description_short: element.description_short,
            description_long: element.description_long,
            picture: element.picture,
            AreaTypeId: element.AreaTypeId,
            AreaZoneId: element.AreaZoneId,
        })
        tabPromesses.push(creer)
    })

    return tabPromesses
}

/*
Initialisation du tableau contenant les promesses qui :
- inserent les zones dans la table user
- à partir du fichier user.json
*/
const setUser = () => {
    const tabPromesses = []

    dataUser.forEach((element) => {
        const creer = bcrypt.hash(element.password,10)
            .then((hash) => {
                return(
                    UserModel.create({
                        id: element.id,
                        first_name: element.first_name,
                        last_name: element.last_name,
                        nick_name: element.nick_name,
                        email: element.email,
                        password: hash,
                        role: element.role,
                    })                         
                )
            })
        tabPromesses.push(creer)
    })
    
    return tabPromesses
}

module.exports = { initDb }