const { AreaTypeModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")

/*
GET :
- retourne la liste des types de loisir
- paramètres : tri et filtre
*/
exports.findAllAreaType = (req, res) => {
    const search = req.query.search || ""
    const sort = req.query.sort || "asc"

    AreaTypeModel.findAll({
        where: {
            [Op.and]: [
                {name: {[Op.like]: `%${search}%`}}
            ]
        },
        // attributes: ['id', 'name', 'picture'],
        order: [['name',sort]]
        })
        .then((element) => {
            const msg = "La liste des types de loisir a bien été retournée."
            console.log(element)
            res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

/*
GET :
- retourne un type de loisir
- paramètre : clé primaire
*/
exports.findAreaTypeById = (req, res) => {
    const id = req.params.id

    AreaTypeModel.findByPk(id)
        .then((element) => {
            if(element === null) {
                const msg = "Le type de loisir n'existe pas."
                res.status(404).json({ success: false, message: msg, data: element })                
            }
            else {
                const msg = "Le type de loisir a bien été retourné."
                res.status(200).json({ success: true, message: msg, data: element })
            }
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

/* CREATE :
- crée un type de loisir
*/
exports.createAreaType = (req, res) => {
    const newAreaType = req.body;

    AreaTypeModel.create({
        name: newAreaType.name,
        description: newAreaType.description,
        picture: newAreaType.picture,
    })
    .then((element) => {
       const  msg = `Le type de loisir '${element.name}' a bien été ajouté.`
        res.status(200).json({ success: true, message: msg, data: element })
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError){
            res.status(409).json({ success: false, message: error.message, data: error })    
        }        
        else if(error instanceof ValidationError){
            res.status(409).json({ success: false, message: error.message, data: error })    
        }
        else {
            res.status(500).json({ success: false, message: error.message, data: error })    
        }
    })
}

//////////////////////////////////////////////////////////////////////////
// UPDATE
//////////////////////////////////////////////////////////////////////////

exports.updateAreaType = (req, res) => {
    const id = req.params.id

    AreaTypeModel.update(req.body,{
        where: {id: id}
    })
    .then((element) => {
        if(element[0] !== 0) {
            const msg = `Le type de loisir '${req.body.name}' a bien été modifié.`
            res.status(200).json({ success: true, message: msg, data: {} })
        }
        else {
            const msg = `Modification impossible : aucun élément ne correspond à l'id : ${id}.`
            res.status(404).json({ success: false, message: msg, data: {} })
        }
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError){
            res.status(409).json({ success: false, message: error.message, data: error })    
        }        
        else if(error instanceof ValidationError){
            res.status(409).json({ success: false, message: error.message, data: error })    
        }
        else {
            res.status(500).json({ success: false, message: error.message, data: error })    
        }
    })
}

//////////////////////////////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////////////////////////////

exports.deleteAreaType = (req, res) => {
    const id = req.params.id

    AreaTypeModel.destroy({
        where: {id: id}
    })
    .then((element) => {
        if(element === 1) {
            const msg = `L'élément id ${id} a bien été supprimé.`
            res.status(200).json({ success: true, message: msg, data: {} })
        }
        else {
            const msg = `Suppression impossible : aucun élément ne correspond à l'id : ${id}.`
            res.status(404).json({ success: false, message: msg, data: {} })
        }
    })
    .catch((error) => {
        if(error instanceof ForeignKeyConstraintError){
            const msg = `Suppression impossible : des enregistrements sont liés.`
            res.status(409).json({ success: false, message: msg, data: error })
        }
        else {
            res.status(500).json({ success: false, message: error.message, data: error })            
        }
    })
}