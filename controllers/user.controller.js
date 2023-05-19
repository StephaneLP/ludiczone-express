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
        return res.status(400).json({success: false, message: msg, data: {}})
    }

    UserModel.findOne({
        where: {nick_name: username}
    })
    .then((element) => {
        if(!element) {
            msg = "L'utilisateur n'existe pas (Erreur 404)"
            return res.status(404).json({success: false, message: msg, data: {}})
        }

        bcrypt.compare(password,element.password)
            .then(isValid => {
                if(!isValid) {
                    msg = "Le mot de passe est erroné !"
                    return res.status(400).json({message: msg})
                }

                // Json Web Token
                const token = jwt.sign({
                    data: element.id,
                    username: element.nick_name,
                }, privateKey, { expiresIn: "30000"})

                msg = "L'utilisateur a été connecté avec succès"
                element.password = "hidden"
                return res.json({success: true, message: msg, data: element, token: token})
            })
    })
    .catch((error) => {
        msg = "L'utilisateur n'a pas pu se connecter"
        res.json({ success: false, message: msg, data: error})
    })
}