const { AreaModel, AreaTypeModel, AreaZoneModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")

/*********************************************************
GET FOR SEARCH PAGE
- retourne la liste des salles
- champs : ...
- paramètres : tri et filtre
*********************************************************/
exports.findAllArea = (req, res) => {
    const name = req.query.name || ""
    const sort = req.query.sort || "asc"
    const typeId = req.query.typeId || ""
    const zoneId = req.query.zoneId || ""

    const clauseWhere = []
    if(name !== "") {clauseWhere.push({name: {[Op.like]: `%${name}%`}})}
    if(typeId !== "") {clauseWhere.push({AreaTypeId: typeId})}
    if(zoneId !== "") {clauseWhere.push({AreaZoneId: zoneId})}

    AreaModel.findAll({
        where:  {[Op.and]: clauseWhere}, // si clauseWhere = [], aucune clause n'est appliquée
        order: [['name',sort]],
        include: [AreaTypeModel,
                AreaZoneModel]
        })
        .then((element) => {
            const msg = "La liste des salles a bien été retournée."
            res.status(200).json({ status: "SUCCESS", message: msg, data: element })
        })
        .catch((error) => {
            res.status(500).json({ status: "ERR_SERVER", message: error.message })
        })  
}

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