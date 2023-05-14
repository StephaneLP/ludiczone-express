const { AreaTypeModel } = require('../db/sequelize');
const { Op, UniqueConstraintError, ValidationError } = require("sequelize");
const sequelize = require('../db/sequelize')

exports.findAllAreaType = (req, res) => {
    const search = req.query.search || ""
    const sort = req.query.sort || "asc"
    let msg = ""

    AreaTypeModel.findAll({
        where: {
            [Op.and]: [
                {name: {[Op.like]: `%${search}%`}}
            ]
        },
        order: [['name',sort]]
        })
        .then((element) => {
            msg = "La liste des types de loisir a bien été retournée."
            res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            msg = "Impossible de charger la liste des types de loisir (Erreur 500)."
            res.status(500).json({ success: false, message: msg, data: error })
        })  
}

exports.deleteAreaType = (req, res) => {
    const id = req.params.id
    let msg = ""

    return AreaTypeModel.destroy({
        where: {id: id}
    })
    .then((element) => {
        if(element === 1) {
            msg = `L'élément id : ${id} a bien été supprimé.`
            res.status(200).json({ success: true, message: msg, data: {} })
        }
        else {
            msg = `Suppression impossible (aucun élément ne correspond à l'id : ${id}).`
            res.status(404).json({ success: false, message: msg, data: {} })
        }
    })
    .catch((error) => {
        msg = "Suppression impossible (Erreur 500)."
        res.status(500).json({ success: false, message: msg, data: error })
    })
}