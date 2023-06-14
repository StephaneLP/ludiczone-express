const { sequelize, AreaModel, AreaTypeModel, AreaZoneModel, UserModel } = require('./sequelize')
const bcrypt = require("bcrypt")

const dataAreaType = require("./data/area-type.json")
const dataAreaZone = require("./data/area-zone.json")
const dataArea = require("./data/area.json")
const dataUser = require("./data/user.json")

const initDb = () => {
    // Trois options : sync() - sync({ force: true }) - sync({ alter: true })
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
                                console.log("Import des données terminée.");
                            })   
                        })
                    })
                })
        })
        .catch((error) => console.log(error))
}

//////////////////////////////////////////////////////////////////////////
// INITIALISATION AREA TYPE
//////////////////////////////////////////////////////////////////////////

const setAreaType = () => {
    const tabPromesses = []

    dataAreaType.forEach((element) => {
        const creer = function() {
            return(
                AreaTypeModel.create({
                    id: element.id,
                    name: element.name,
                    description: element.description,
                    picture: element.picture,
                    rank: element.rank,
                    created_at: element.created_at,
                })
                .then((el) => { console.log("AREA_TYPE : " + el.id + " - " + el.name )}) 
            )          
        }
        tabPromesses.push(creer())
    })

    return tabPromesses
}

//////////////////////////////////////////////////////////////////////////
// INITIALISATION AREA ZONE
//////////////////////////////////////////////////////////////////////////

const setAreaZone = () => {
    const tabPromesses = []

    dataAreaZone.forEach((element) => {
        const creer = function() {
            return(
                AreaZoneModel.create({
                    id: element.id,
                    name: element.name,
                    description: element.description,
                    picture: element.picture,
                    rank: element.rank,
                    created_at: element.created_at,
                })
                .then((el) => { console.log("AREA_ZONE : " + el.id + " - " + el.name )})
            )          
        }
        tabPromesses.push(creer())
    })

    return tabPromesses
}

//////////////////////////////////////////////////////////////////////////
// INITIALISATION AREA
//////////////////////////////////////////////////////////////////////////

const setArea = () => {
    const tabPromesses = []

    dataArea.forEach((element) => {
        const creer = function() {
            return(
                AreaModel.create({
                    name: element.name,
                    description_short: element.description_short,
                    description_long: element.description_long,
                    picture: element.picture,
                    AreaTypeId: element.AreaTypeId,
                    AreaZoneId: element.AreaZoneId,
                })
                .then((el) => { console.log("AREA : " + el.id + " - " + el.name )})
            )          
        }
        tabPromesses.push(creer())
    })

    return tabPromesses
}

//////////////////////////////////////////////////////////////////////////
// INITIALISATION USER
//////////////////////////////////////////////////////////////////////////

const setUser = () => {
    const tabPromesses = []

    dataUser.forEach((element) => {
        bcrypt.hash(element.password,10)
            .then((hash) => {
                const creer = function() {
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
                        .then((el) => { console.log("USER : " + el.id + " - " + el.nick_name )})
                    )          
                }
                tabPromesses.push(creer())
            })
    })

    return tabPromesses
}

module.exports = { initDb }