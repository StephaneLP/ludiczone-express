const { AreaZoneModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")

//////////////////////////////////////////////////////////////////////////
// GET
//////////////////////////////////////////////////////////////////////////

exports.findAllAreaZone = (req, res) => {
    const search = req.query.search || ""
    const sort = req.query.sort || "asc"

    AreaZoneModel.findAll({
        where: {
            [Op.and]: [
                {name: {[Op.like]: `%${search}%`}}
            ]
        },
        order: [['name',sort]]
        })
        .then((element) => {
            const msg = "La liste des zones a bien été retournée."
            res.status(200).json({ success: true, message: msg, data: element })
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

exports.findAreaZoneById = (req, res) => {
    const id = req.params.id

    AreaZoneModel.findByPk(id)
        .then((element) => {
            if(element === null) {
                const msg = "La zone n'existe pas."
                res.status(404).json({ success: false, message: msg, data: element })                
            }
            else {
                const msg = "La zone a bien été retournée."
                res.status(200).json({ success: true, message: msg, data: element })
            }
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: error.message, data: error })
        })  
}

//////////////////////////////////////////////////////////////////////////
// CREATE
//////////////////////////////////////////////////////////////////////////

exports.createAreaZone = (req, res) => {
    const newAreaType = req.body;

    AreaZoneModel.create({
        name: newAreaType.name,
        description: newAreaType.description,
        picture: newAreaType.picture,
    })
    .then((element) => {
       const  msg = `La zone '${element.name}' a bien été ajoutée.`
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

exports.updateAreaZone = (req, res) => {
    const id = req.params.id

    AreaZoneModel.update(req.body,{
        where: {id: id}
    })
    .then((element) => {
        if(element[0] !== 0) {
            const msg = `La zone '${req.body.name}' a bien été modifiée.`
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

exports.deleteAreaZone = (req, res) => {
    const id = req.params.id
    let msg = ""

    return AreaZoneModel.destroy({
        where: {id: id}
    })
    .then((element) => {
        if(element === 1) {
            msg = `L'élément id ${id} a bien été supprimée.`
            res.status(200).json({ success: true, message: msg, data: {} })
        }
        else {
            msg = `Suppression impossible : aucun élément ne correspond à l'id : ${id} (Erreur 404).`
            res.status(404).json({ success: false, message: msg, data: {} })
        }
    })
    .catch((error) => {
        if(error instanceof ForeignKeyConstraintError){
            msg = `Suppression impossible : des enregistrements sont liés (Erreur 409).`
            res.status(409).json({ success: false, message: msg, data: error })
        }
        else {
            msg = "Suppression impossible (Erreur 500)."
            res.status(500).json({ success: false, message: msg, data: error })            
        }
    })
}