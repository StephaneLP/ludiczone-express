const { AreaTypeModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")

//////////////////////////////////////////////////////////////////////////
// GET
//////////////////////////////////////////////////////////////////////////

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

exports.findAreaTypeById = (req, res) => {
    const id = req.params.id
    let msg = ""

    AreaTypeModel.findByPk(id)
        .then((element) => {
            if(element === null) {
                msg = "Le type de loisir n'existe pas (Erreur 404)."
                res.status(404).json({ success: false, message: msg, data: element })                
            }
            else {
                msg = "Le type de loisir a bien été retourné."
                res.status(200).json({ success: true, message: msg, data: element })
            }
        })
        .catch((error) => {
            msg = "Impossible de charger le type de loisir (Erreur 500)."
            res.status(500).json({ success: false, message: msg, data: error })
        })  
}

//////////////////////////////////////////////////////////////////////////
// CREATE
//////////////////////////////////////////////////////////////////////////

exports.createAreaType = (req, res) => {
    const newAreaType = req.body;
    let msg = ""

    AreaTypeModel.create({
        name: newAreaType.name,
        description: newAreaType.description,
        picture: newAreaType.picture,
        // rank: newAreaType.rank,
        // is_active: newAreaType.is_active,
    })
    .then((element) => {
        msg = `Le type de loisir '${element.name}' a bien été ajouté.`
        res.status(200).json({ success: true, message: msg, data: element})
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError){
            res.status(400).json({ success: false, message: error.message, data: error })    
        }        
        else if(error instanceof ValidationError){
            msg = "Demande non valide : erreur de validation (Erreur 400)."
            res.status(400).json({ success: false, message: error.message, data: error })    
        }
        else {
            msg = "Impossible de créer le type de loisir (Erreur 500)."
            res.status(500).json({ success: false, message: error.message, data: error })    
        }
    })
}

//////////////////////////////////////////////////////////////////////////
// UPDATE
//////////////////////////////////////////////////////////////////////////

exports.updateAreaType = (req, res) => {
    const id = req.params.id
    let msg = ""

    AreaTypeModel.update(req.body,{
        where: {id: id}
    })
    .then((element) => {
        if(element[0] !== 0) {
            msg = `Le type de loisir '${req.body.name}' a bien été modifié.`
            res.status(200).json({ success: true, message: msg, data: {} })
        }
        else {
            msg = `Modification impossible : aucun élément ne correspond à l'id : ${id} (Erreur 404).`
            res.status(404).json({ success: false, message: msg, data: {} })
        }
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError){
            res.status(400).json({ success: false, message: error.message, data: error })    
        }        
        else if(error instanceof ValidationError){
            msg = "Demande non valide : erreur de validation (Erreur 400)."
            res.status(400).json({ success: false, message: error.message, data: error })    
        }
        else {
            msg = "Impossible de modifier le type de loisir (Erreur 500)."
            res.status(500).json({ success: false, message: error.message, data: error })    
        }
    })
}

//////////////////////////////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////////////////////////////

exports.deleteAreaType = (req, res) => {
    const id = req.params.id
    let msg = ""

    return AreaTypeModel.destroy({
        where: {id: id}
    })
    .then((element) => {
        if(element === 1) {
            msg = `L'élément id ${id} a bien été supprimé.`
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