const { AreaZoneModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")

/*********************************************************
GET FOR HOME PAGE
- retourne la liste des zones
- champs : "id", "name", "picture"
- paramètres : sans
*********************************************************/
exports.findAreaZone = (req, res) => {
    AreaZoneModel
        .findAll({
            attributes: ["id", "name", "picture"],
            order: [["name","asc"]]
        })
        .then((element) => {
            const msg = "La liste des zones a bien été retournée."
            res.status(200).json({ status: "SUCCESS", message: msg, data: element })
        })
        .catch((error) => {
            res.status(500).json({ status: "ERR_SERVER", message: error.message })
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
    if(name !== "") { clauseWhere.push({ name: { [Op.like]: `%${name}%` } }) }

    AreaZoneModel
        .findAll({
            where: {[Op.and]: clauseWhere}, // si clauseWhere = [], aucune clause n'est appliquée
            order: [["name",sort]]
        })
        .then((element) => {
            const msg = "La liste des zones a bien été retournée."
            res.status(200).json({ status: "SUCCESS", message: msg, data: element })
        })
        .catch((error) => {
            res.status(500).json({ status: "ERR_SERVER", message: error.message })
        })  
}

/*********************************************************
GET BY ID
- retourne une zone
- paramètre : clé primaire
*********************************************************/
exports.findAreaZoneById = (req, res) => {
    const id = req.params.id

    AreaZoneModel
        .findByPk(id)
        .then((element) => {
            if(!element) {
                const msg = "La zone n'existe pas."
                return res.status(404).json({ status: "ERR_NOT_FOUND", message: msg })                
            }
            
            const msg = "La zone a bien été retournée."
            res.status(200).json({ status: "SUCCESS", message: msg, data: element })
        })
        .catch((error) => {
            res.status(500).json({ status: "ERR_SERVER", message: error.message })
        })  
}

/*********************************************************
CREATE
- crée et retourne une zone
*********************************************************/
exports.createAreaZone = (req, res) => {
    AreaZoneModel
        .create(req.body)
        .then((element) => {
            const  msg = `La zone '${element.name}' a bien été ajoutée.`
            res.status(200).json({ status: "SUCCESS", message: msg })
        })
        .catch((error) => {
            if(error instanceof UniqueConstraintError || error instanceof ValidationError){
                return res.status(409).json({ status: "ERR_CONSTRAINT", message: error.message })    
            }        
            res.status(500).json({ status: "ERR_SERVER", message: error.message })    
        })
}

/*********************************************************
UPDATE
- modifie une zone
- paramètres : clé primaire et données
*********************************************************/
exports.updateAreaZone = (req, res) => {
    const id = req.params.id

    AreaZoneModel
        .findByPk(id)
        .then((element) => {
            if(!element) {
                const msg = `Modification impossible : aucun élément ne correspond à l'id : ${id}.`
                return res.status(404).json({ status: "ERR_NOT_FOUND", message: msg })
            }

            AreaZoneModel
                .update(req.body,{
                    where: {id: id}
                })
                .then(() => {
                    const msg = `La zone '${req.body.name}' a bien été modifiée.`
                    res.status(200).json({ status: "SUCCESS", message: msg })
                })
                .catch(error => {
                    if(error instanceof UniqueConstraintError || error instanceof ValidationError){
                        return res.status(409).json({ status: "ERR_CONSTRAINT", message: error.message })    
                    }
                    throw Error(error)   
                })
        })
        .catch((error) => {
            res.status(500).json({ status: "ERR_SERVER", message: error.message })
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
    .then((count) => {
        if(count === 0) { // element indique le nombre d'éléments supprimés
            const msg = `Suppression impossible : aucun élément ne correspond à l'id : ${id}.`
            return res.status(404).json({ status: "ERR_NOT_FOUND", message: msg })
        }

        const msg = `La zone a bien été supprimée.`
        res.status(200).json({ status: "SUCCESS", message: msg })
    })
    .catch((error) => {
        if(error instanceof ForeignKeyConstraintError){
            const msg = `Suppression impossible : des enregistrements sont liés.`
            return res.status(409).json({ status: "ERR_CONSTRAINT", message: msg })
        }
        res.status(500).json({ status: "ERR_SERVER", message: error.message })            
    })
}