const { AreaZoneModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")

/*********************************************************
GET FOR HOME PAGE
- retourne la liste des zones
- champs : "id", "name", "picture"
- paramètres : sans
*********************************************************/
exports.findAreaZoneForHomePage = (req, res) => {
    AreaZoneModel.findAll({
        attributes: ["id", "name", "picture"],
        order: [["name","asc"]]
        })
        .then((element) => {
            const msg = "La liste des zones a bien été retournée."
            return res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            return res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

/*********************************************************
GET ALL
- retourne la liste des zones
- champs : tous
- paramètres : tri et filtre
*********************************************************/
exports.findAllAreaZone = (req, res) => {
    const sort = req.query.sort || "asc"
    const name = req.query.name || ""

    const clauseWhere = []
    if(name !== "") {clauseWhere.push({name: {[Op.like]: `%${objFilter.name}%`}})}

    AreaZoneModel.findAll({
        where: {[Op.and]: clauseWhere}, // si clauseWhere = [], aucune clause n'est appliquée
        order: [["name",sort]]
        })
        .then((element) => {
            const msg = "La liste des zones a bien été retournée."
            return res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            return res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

/*********************************************************
GET BY ID
- retourne une zone
- paramètre : clé primaire
*********************************************************/
exports.findAreaZoneById = (req, res) => {
    const id = req.params.id

    AreaZoneModel.findByPk(id)
        .then((element) => {
            if(element === null) {
                const msg = "La zone n'existe pas."
                return res.status(404).json({ success: false, message: msg, data: {} })                
            }
            
            const msg = "La zone a bien été retournée."
            return res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            return res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

/*********************************************************
CREATE
- crée et retourne une zone
*********************************************************/
exports.createAreaZone = (req, res) => {
    AreaZoneModel.create(req.body)
    .then((element) => {
        const  msg = `La zone '${element.name}' a bien été ajoutée.`
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
- modifie une zone
- paramètres : clé primaire et données
*********************************************************/
exports.updateAreaZone = (req, res) => {
    const id = req.params.id

    AreaZoneModel.update(req.body,{
        where: {id: id}
    })
    .then((element) => {
        if(element[0] === 0) { // element[0] indique le nombre d'éléments modifiés
            const msg = `Modification impossible : aucun élément ne correspond à l'id : ${id}.`
            return res.status(404).json({ success: false, message: msg, data: {} })
        }

        const msg = `La zone '${req.body.name}' a bien été modifiée.`
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
- supprime une zone
- paramètre : clé primaire
*********************************************************/
exports.deleteAreaZone = (req, res) => {
    const id = req.params.id

    AreaZoneModel.destroy({
        where: {id: id}
    })
    .then((element) => { // element indique le nombre d'éléments supprimés
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