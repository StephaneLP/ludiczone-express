const { AreaTypeModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")

/*********************************************************
GET ALL
- retourne la liste des types de loisir
- paramètres : tri et filtre
*********************************************************/

exports.findAllAreaType = (req, res) => {
    const sort = req.query.sort || "asc"
    const search = req.query.search || ""

    // Filtres (si clause = {} : aucune clause where n'est appliquée)
    let clauseWhere = {}
    const tabWhere = []
    if(search !== "") {tabWhere.push({name: {[Op.like]: `%${search}%`}})}
    if(tabWhere.length !== 0) {clauseWhere = {[Op.and]: tabWhere}}

    AreaTypeModel.findAll({
        where: clauseWhere,
        order: [["name",sort]]
        })
        .then((element) => {
            const msg = "La liste des types de loisir a bien été retournée."
            return res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            return res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

/*********************************************************
GET FOR HOME PAGE
- retourne la liste des types de loisir
- champs : "id", "name", "picture"
- paramètres : sans
*********************************************************/

exports.findAreaTypeForHomePage = (req, res) => {
    AreaTypeModel.findAll({
        attributes: ["id", "name", "picture"],
        order: [["name","asc"]]
        })
        .then((element) => {
            const msg = "La liste des types de loisir a bien été retournée."
            return res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            return res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

/*********************************************************
GET BY ID
- retourne un type de loisir
- paramètre : clé primaire
*********************************************************/

exports.findAreaTypeById = (req, res) => {
    const id = req.params.id

    AreaTypeModel.findByPk(id)
        .then((element) => {
            if(element === null) {
                const msg = "Le type de loisir n'existe pas."
                return res.status(404).json({ success: false, message: msg, data: {} })                
            }
            
            const msg = "Le type de loisir a bien été retourné."
            return res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            return res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

/*********************************************************
CREATE
- crée et retourne un type de loisir
*********************************************************/

exports.createAreaType = (req, res) => {
    AreaTypeModel.create(req.body)
    .then((element) => {
        const  msg = `Le type de loisir '${element.name}' a bien été ajouté.`
        return res.status(200).json({ success: true, message: msg, data: element })
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(409).json({ success: false, message: error.message, data: error })    
        }        
        else {
            return res.status(500).json({ success: false, message: error.message, data: error })    
        }
    })
}

/*********************************************************
UPDATE
- modifie un type de loisir
- paramètres : clé primaire et données
*********************************************************/

exports.updateAreaType = (req, res) => {
    const id = req.params.id
console.log("update",req.body)
    AreaTypeModel.update(req.body,{
        where: {id: id}
    })
    .then((element) => {
        if(element[0] === 0) {
            const msg = `Modification impossible : aucun élément ne correspond à l'id : ${id}.`
            return res.status(404).json({ success: false, message: msg, data: {} })
        }

        const msg = `Le type de loisir '${req.body.name}' a bien été modifié.`
        return res.status(200).json({ success: true, message: msg, data: {} })
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(409).json({ success: false, message: error.message, data: error })    
        }

        return res.status(500).json({ success: false, message: error.message, data: error })    
    })
}

/*********************************************************
DELETE
- supprime un type de loisir
- paramètre : clé primaire
*********************************************************/

exports.deleteAreaType = (req, res) => {
    const id = req.params.id

    AreaTypeModel.destroy({
        where: {id: id}
    })
    .then((element) => {
        console.log(element)
        if(element === 0) {
            const msg = `Suppression impossible : aucun élément ne correspond à l'id : ${id}.`
            return res.status(404).json({ success: false, message: msg, data: {} })
        }

        const msg = `L'élément id ${id} a bien été supprimé.`
        return res.status(200).json({ success: true, message: msg, data: {} })
    })
    .catch((error) => {
        if(error instanceof ForeignKeyConstraintError){
            const msg = `Suppression impossible : des enregistrements sont liés.`
            return res.status(409).json({ success: false, message: msg, data: error })
        }

        return res.status(500).json({ success: false, message: error.message, data: error })            
    })
}