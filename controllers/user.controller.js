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
                    // username: element.nick_name,
                }, privateKey, { expiresIn: "30000"})

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
        msg = "Un jeton est nécessaire pour acceder à la ressource"
        return res.status(403).json({ success: false, message: msg, data: {} })
    }
    
    try {
        const token = authorizationHeader.split(' ')[1]
        if(token === "null") {
            msg = "Un jeton est nécessaire pour acceder à la ressource"
            console.log(msg)
            return res.status(403).json({ success: false, message: msg, data: {} })
        }
        const decoded = jwt.verify(token, privateKey)
        req.userId = decoded.data
    }
    catch(error) {
        msg = "Le jeton n'est pas valide"
        return res.status(403).json({ success: false, message: msg, data: error })
    }

    return next()
}
