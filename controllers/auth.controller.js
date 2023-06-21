const bcrypt = require("bcrypt")
const { UserModel } = require('../db/sequelize')
const { Op } = require("sequelize")
const jwt = require("jsonwebtoken")
const privateKey = require("../authorization/privateKey")

/*********************************************************
LOGIN
- retourne un token
- paramètres : identifiant et mot de passe
*********************************************************/

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

        bcrypt.compare(password,element.password) // Vérification du mot de passe
            .then(isValid => {
                if(!isValid) {
                    const msg = "L'identifiant ou le mot de passe est incorrect. Veuillez essayer à nouveau."
                    return res.status(401).json({ success: false, message: msg, data: {} })
                }

                const token = jwt.sign({ // Génération du token avec encryptage de l'id user
                    data: element.id,
                }, privateKey, { expiresIn: "48h"})
                
                const msg = "L'utilisateur a été connecté avec succès."
                element.password = "Hidden"
                return res.status(200).json({ success: true, message: msg, data: element, token: token })
            })
    })
    .catch((error) => {
        const msg = "Une erreur est survenue dans le processus de connexion."
        return res.status(500).json({ success: false, message: msg, data: error })
    })
}

/*********************************************************
GET ROLE BY TOKEN
- retourne le role de l'utilsateur
- paramètre : token
*********************************************************/

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

        const decoded = jwt.verify(token, privateKey) // Vérification du token
        const id = decoded.data // Décryptage de l'id user

        UserModel.findByPk(id)
            .then(user => {
                if(!user) {
                    const msg = "Le user n'a pas les droits requis."
                    return res.status(403).json({ success: false, message: msg, data: "" })
                }

                const msg = `Le role a bien été retourné pour l'id : ${id}.`
                return res.status(200).json({ success: true, message: msg, data: user.role })
            })
            .catch(error => {
                return res.status(500).json({ success: false, message: error.message, data: error })
            }) 
    }
    catch(error) {
        const msg = "Une erreur est survenue dans le processus d'autentification : le jeton n'est pas valide."
        return res.status(401).json({ success: false, message: msg, data: error })
    }
}

/*********************************************************
PROTECT
- vérifie la validité du token
- paramètre : token
*********************************************************/

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

        const decoded = jwt.verify(token, privateKey) // Vérification du token
        req.userId = decoded.data // Décryptage de l'id user
    }
    catch(error) {
        const  msg = "Le jeton n'est pas valide."
        return res.status(401).json({ success: false, message: msg, data: error })
    }

    return next()
}

/*********************************************************
RESTRICT TO
- vérifie les droits de l'utilisateur
- paramètre : id de l'utilisateur
*********************************************************/

exports.restrictTo = (roles) => {
    return (req, res, next) => {
        UserModel.findByPk(req.userId)
            .then(user => {
                if(!user || !roles.includes(user.role)) { // La liste des rôles autorisés contient-elle le rôle du user ?
                    const msg = "Vos droits sont insuffisants."
                    return res.status(403).json({ success: false, message: msg, data: {} })
                }

                return next()
            })
            .catch(error => {
                return res.status(500).json({ success: false, message: error.message, data: error })
            })
    }
}
