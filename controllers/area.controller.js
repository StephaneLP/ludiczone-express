const { AreaModel, AreaTypeModel, AreaZoneModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")

//////////////////////////////////////////////////////////////////////////
// GET
//////////////////////////////////////////////////////////////////////////

exports.findAllArea = (req, res) => {
    const search = req.query.search || ""
    const sort = req.query.sort || "asc"
    const typeId = req.query.typeId || ""
    const zoneId = req.query.zoneId || ""

    const tabWhere =  [{name: {[Op.like]: `%${search}%`}}]
    if(typeId !== "") {tabWhere.push({AreaTypeId: typeId})}
    if(zoneId !== "") {tabWhere.push({AreaZoneId: zoneId})}

    AreaModel.findAll({
        where:  {[Op.and]: tabWhere},
        order: [['name',sort]],
        include: [AreaTypeModel,
                AreaZoneModel]
        })
        .then((element) => {
            const msg = "La liste des salles a bien été retournée."
            res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

// exports.findAreaByFk = (req, res) => {
//     const search = req.query.search || ""
//     const sort = req.query.sort || "asc"
//     const id = req.query.id || 1
//     let msg = ""

//     AreaModel.findAll({
//         where: {
//             [Op.and]: [
//                 {name: {[Op.like]: `%${search}%`}},
//                 {AreaZoneId: id}
//             ]
//         },
//         order: [['name',sort]]
//         })
//         .then((element) => {
//             msg = "La liste des salles a bien été retournée."
//             res.status(200).json({ success: true, message: msg, data: element })
//         })
//         .catch((error) => {
//             msg = "Impossible de charger la liste des salles (Erreur 500)."
//             res.status(500).json({ success: false, message: msg, data: error })
//         })  
// }

//////////////////////////////////////////////////////////////////////////
// CREATE
//////////////////////////////////////////////////////////////////////////

exports.createArea = (req, res) => {
    const newArea = req.body;

    AreaModel.create({
        name: newArea.name,
        description_short: newArea.description_short,
        description_long: newArea.description_long,
        AreaTypeId: newArea.AreaTypeId,
        AreaZoneId: newArea.AreaZoneId,
    })
    .then((el) => {
        const msg = `La salle a bien été ajoutée.`
        res.json({ message: msg, data: newArea})
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(400).json({ message: error.message, data: error })    
        }
        else {
            const msg = "test"
            return res.status(500).json({ message: error.message, data: error })    
        }
    })
}