const bcrypt = require("bcrypt")
const { UserModel } = require('../db/sequelize');
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize");
const sequelize = require('../db/sequelize')
const jwt = require("jsonwebtoken")
const privateKey = require("../authorization/privateKey")

//////////////////////////////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////////////////////////////

exports.login = (req, res) => {
    console.log("login")
    const username = req.body.username
    const password = req.body.password
    let msg = ""

    if(!username || !password) {
        msg = "Veuillez renseigner un identifiant et un mot de passe."
        return res.status(400).json({ success: false, message: msg, data: {} })
    }

    UserModel.findOne({
        where: {
            [Op.or]: [
                {nick_name: username},
                {email: username}
            ]       
        }
    })
    .then((element) => {
        if(!element) {
            msg = `Le pseudo ou l'email est incorrect. Veuillez essayer à nouveau.`
            return res.status(404).json({ success: false, message: msg, data: {} })
        }

        bcrypt.compare(password,element.password)
            .then(isValid => {
                if(!isValid) {
                    msg = "Le mot de passe saisi est incorrect. Veuillez essayer à nouveau."
                    return res.status(400).json({ success: false, message: msg, data: {} })
                }

                // Json Web Token
                const token = jwt.sign({
                    data: element.id,
                }, privateKey, { expiresIn: "48h"})

                msg = "L'utilisateur a été connecté avec succès."
                element.password = "Hidden"
                res.status(200).json({ success: true, message: msg, data: element, token: token })
            })
    })
    .catch((error) => {
        msg = "L'utilisateur n'a pas pu se connecter (Erreur 500)."
        res.json({ success: false, message: msg, data: error })
    })
}

//////////////////////////////////////////////////////////////////////////
// PROTECT
//////////////////////////////////////////////////////////////////////////

exports.protect = (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    let msg = ""

    if(!authorizationHeader) {
        msg = "Un jeton est nécessaire pour acceder à la ressource (Erreur 401)."
        return res.status(401).json({ success: false, message: msg, data: {} })
    }
    
    try {
        const token = authorizationHeader.split(' ')[1]
        if(token === "null") {
            msg = "Un jeton est nécessaire pour acceder à la ressource (Erreur 401)."
            return res.status(401).json({ success: false, message: msg, data: {} })
        }
        const decoded = jwt.verify(token, privateKey)
        req.userId = decoded.data
    }
    catch(error) {
        msg = "Le jeton n'est pas valide (Erreur 401)."
        return res.status(401).json({ success: false, message: msg, data: error })
    }
    return next()
}

//////////////////////////////////////////////////////////////////////////
// RESTRICT TO
//////////////////////////////////////////////////////////////////////////

exports.restrictTo = (roles) => {
    let msg = ""

    return (req, res, next) => {
        UserModel.findByPk(req.userId)
            .then(user => {
                if(!user || !roles.includes(user.role)) {
                    msg = "Vos droits sont insuffisants (Erreur 403)."
                    return res.status(403).json({ success: false, message: msg, data: {} })
                }
                return next()
            })
            .catch(error => {
                msg = "Erreur survenue lors de la vérification du rôle (Erreur 500)."
                res.status(500).json({ success: false, message: msg, data: error })
            })
    }
}

//////////////////////////////////////////////////////////////////////////
// GET ROLE BY TOKEN
//////////////////////////////////////////////////////////////////////////

exports.getRoleByToken = (req, res) => {
    const authorizationHeader = req.headers.authorization
    let msg = ""
    if(!authorizationHeader) {
        msg = "Un jeton est nécessaire pour acceder au role du user (Erreur 401)."
        return res.status(401).json({ success: false, message: msg, data: "" })
    }
    
    try {
        const token = authorizationHeader.split(' ')[1]
        if(token === "null") {
            msg = "Un jeton est nécessaire pour acceder au role du user (Erreur 401)."
            return res.status(401).json({ success: false, message: msg, data: "" })
        }
        const decoded = jwt.verify(token, privateKey)
        const id = decoded.data

        UserModel.findByPk(id)
            .then(user => {
                if(!user) {
                    msg = `Aucun user n'a été retourné pour l'id : ${id} (Erreur 403).`
                    return res.status(403).json({ success: false, message: msg, data: "" })
                }
                else {
                    msg = `Le role a bien été retourné pour l'id : ${id}.`
                    return res.status(200).json({ success: true, message: msg, data: user.role })
                }
            })
            .catch(error => {
                const msg = "Erreur survenue lors de la vérification du rôle (Erreur 500)."
                res.status(500).json({ success: false, message: msg, data: error })
            }) 
    }
    catch(error) {
        msg = "Le jeton n'est pas valide (Erreur 401)."
        return res.status(401).json({ success: false, message: msg, data: error })
    }
}