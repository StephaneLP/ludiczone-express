const bcrypt = require("bcrypt")
const { UserModel } = require('../db/sequelize')
const { Op } = require("sequelize")
const jwt = require("jsonwebtoken")
const privateKey = require("../setting/privateKey")

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
        return res.status(400).json({ status: "ERR_REQUEST", message: msg })
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
            return res.status(401).json({ status: "ERR_AUTHENTICATION", message: msg })
        }

        bcrypt.compare(password,element.password) // Vérification du mot de passe
            .then(isValid => {
                if(!isValid) {
                    const msg = "L'identifiant ou le mot de passe est incorrect. Veuillez essayer à nouveau."
                    return res.status(401).json({ status: "ERR_AUTHENTICATION", message: msg })
                }

                const token = jwt.sign({ // Génération du token avec encryptage de l'id user
                    data: element.id,
                }, privateKey, { expiresIn: "48h"})
                
                const msg = "L'utilisateur a été connecté avec succès."
                return res.status(200).json({ status: "SUCCESS", message: msg, data: {token: token, nick_name: element.nick_name }})
            })
    })
    .catch((error) => {
        return res.status(500).json({ status: "ERR_SERVER", message: error.message })
    })
}

/*********************************************************
CHECK ROLES
- retourne un objet contenant un booléen pour chaque rôle
- paramètre : token
*********************************************************/
exports.checkRoles = (req, res) => {
    const authorizationHeader = req.headers.authorization
    const resRoles = {isUser: false, isAdmin: false}

    if(!authorizationHeader) {
        return res.json(resRoles)
    }
    
    try {
        const token = authorizationHeader.split(' ')[1]

        if(token === "null") {
            return res.json(resRoles)
        }

        const decoded = jwt.verify(token, privateKey) // Vérification du token
        const id = decoded.data // Décryptage de l'id user

        UserModel.findByPk(id) // Vérification du role du user
            .then((user) => {
                if(user) {
                    if(user.role === "user") {
                        resRoles.isUser = true
                    }
                    if(user.role === "admin") {
                        resRoles.isAdmin = true
                    }
                }
                return res.json(resRoles)
            })
            .catch(() => {
                return res.json(resRoles)
            }) 
    }
    catch(error) {
        return res.json(resRoles)
    }
}

/*********************************************************
CHECK IF USER ADMIN
- vérifie la validité du token
- vérifie si l'utilisateur est admin
- paramètres : token
*********************************************************/
exports.checkIfUserAdmin = (req, res) => {
    const authorizationHeader = req.headers.authorization

    if(!authorizationHeader) {
        const msg = "Un jeton est nécessaire pour accéder  à la ressource."
        return res.status(400).json({ status: "ERR_REQUEST", message: msg })
    }
    
    try {
        const token = authorizationHeader.split(' ')[1]

        if(token === "null") {
            const msg = "Un jeton est nécessaire pour accéder  à la ressource."
            return res.status(400).json({ status: "ERR_REQUEST", message: msg })
        }

        const decoded = jwt.verify(token, privateKey) // Vérification du token
        const id = decoded.data // Décryptage de l'id user

        UserModel.findByPk(id) // Vérification du role du user
            .then(user => {
                if(!user) {
                    return res.status(403).end()
                }
                if(user.role !== "admin") {
                    const msg = "Vos droits sont insuffisants."
                    return res.status(403).json({ status: "ERR_USER_RIGHTS", message: msg })
                }
                const msg = "L'utilisateur a été connecté avec succès."
                return res.status(200).json({ status: "SUCCESS", message: msg })
            })
            .catch(() => {
                return res.status(500).json({ status: "ERR_SERVER", message: error.message })
            }) 
    }
    catch(error) {
        const msg = "L'identifiant ou le mot de passe est incorrect. Veuillez essayer à nouveau."
        return res.status(401).json({ status: "ERR_AUTHENTICATION", message: msg })
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
        return res.status(400).json({ status: "ERR_REQUEST", message: msg })
    }

    try {
        const token = authorizationHeader.split(' ')[1]

        if(token === "null") {
            const msg = "Un jeton est nécessaire pour acceder à la ressource."
            return res.status(400).json({ status: "ERR_REQUEST", message: msg })
        }

        const decoded = jwt.verify(token, privateKey) // Vérification du token
        req.userId = decoded.data // Décryptage de l'id user
    }
    catch(error) {
        return res.status(401).json({ status: "ERR_AUTHENTICATION", message: error.message })
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
                    return res.status(403).json({ status: "ERR_USER_RIGHTS", message: msg })
                }

                return next()
            })
            .catch(error => {
                return res.status(500).json({ status: "ERR_SERVER", message: error.message })
            })
    }
}
