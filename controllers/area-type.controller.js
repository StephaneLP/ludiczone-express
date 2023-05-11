const { AreaTypeModel } = require('../db/sequelize');
const sequelize = require('../db/sequelize')

exports.findAllAreaType = (req, res) => {
    AreaTypeModel.findAll()
        .then((element) => {
            const msg = "La liste des types de loisir a bien été retournée."
            res.json({ message: msg, data: element })
        })
        .catch(error => {console.error(`Erreur fonction findAllAreaType (AreaTypeModel) : ${error}`)})  
}