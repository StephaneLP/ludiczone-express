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
    const username = req.body.username
    const password = req.body.password

    if(!username || !password) {
        const msg = "Veuillez renseigner un identifiant et un mot de passe."
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
            const msg = "L'identifiant ou le mot de passe est incorrect. Veuillez essayer à nouveau."
            return res.status(401).json({ success: false, message: msg, data: {} })
        }

        bcrypt.compare(password,element.password)
            .then(isValid => {
                if(!isValid) {
                    const msg = "L'identifiant ou le mot de passe est incorrect. Veuillez essayer à nouveau."
                    return res.status(401).json({ success: false, message: msg, data: {} })
                }

                // Json Web Token
                const token = jwt.sign({
                    data: element.id,
                }, privateKey, { expiresIn: "20s"})

                const msg = "L'utilisateur a été connecté avec succès."
                element.password = "Hidden"
                res.status(200).json({ success: true, message: msg, data: element, token: token })
            })
    })
    .catch((error) => {
        const msg = "Une erreur est survenue dans le processus de connexion."
        res.status(500).json({ success: false, message: msg, data: error })
    })
}

//////////////////////////////////////////////////////////////////////////
// GET ROLE BY TOKEN
//////////////////////////////////////////////////////////////////////////

exports.getRoleByToken = (req, res) => {
    const authorizationHeader = req.headers.authorization

    if(!authorizationHeader) {
        const msg = "Un jeton est nécessaire pour acceder au role du user."
        return res.status(401).json({ success: false, message: msg, data: "" })
    }
    
    try {
        const token = authorizationHeader.split(' ')[1]
        if(token === "null") {
            const msg = "Un jeton est nécessaire pour acceder au role du user."
            return res.status(401).json({ success: false, message: msg, data: "" })
        }
        const decoded = jwt.verify(token, privateKey)
        const id = decoded.data

        UserModel.findByPk(id)
            .then(user => {
                if(!user) {
                    const msg = "Le user n'a pas les droits requis."
                    return res.status(403).json({ success: false, message: msg, data: "" })
                }
                else {
                    const msg = `Le role a bien été retourné pour l'id : ${id}.`
                    return res.status(200).json({ success: true, message: msg, data: user.role })
                }
            })
            .catch(error => {
                res.status(500).json({ success: false, message: error.message, data: error })
            }) 
    }
    catch(error) {
        const msg = "Une erreur est survenue dans le processus d'autentification : le jeton n'est pas valide."
        return res.status(401).json({ success: false, message: msg, data: error })
    }
}

//////////////////////////////////////////////////////////////////////////
// PROTECT
//////////////////////////////////////////////////////////////////////////

exports.protect = (req, res, next) => {
    const authorizationHeader = req.headers.authorization

    if(!authorizationHeader) {
        const msg = "Un jeton est nécessaire pour acceder à la ressource."
        return res.status(401).json({ success: false, message: msg, data: {} })
    }
    
    try {
        const token = authorizationHeader.split(' ')[1]
        if(token === "null") {
            const msg = "Un jeton est nécessaire pour acceder à la ressource."
            return res.status(401).json({ success: false, message: msg, data: {} })
        }
        const decoded = jwt.verify(token, privateKey)
        req.userId = decoded.data
    }
    catch(error) {
        const  msg = "Le jeton n'est pas valide."
        return res.status(401).json({ success: false, message: msg, data: error })
    }
    return next()
}

//////////////////////////////////////////////////////////////////////////
// RESTRICT TO
//////////////////////////////////////////////////////////////////////////

exports.restrictTo = (roles) => {
    return (req, res, next) => {
        UserModel.findByPk(req.userId)
            .then(user => {
                if(!user || !roles.includes(user.role)) {
                    const msg = "Vos droits sont insuffisants."
                    return res.status(403).json({ success: false, message: msg, data: {} })
                }
                return next()
            })
            .catch(error => {
                res.status(500).json({ success: false, message: error.message, data: error })
            })
    }
}
