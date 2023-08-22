const bcrypt = require("bcrypt")
const { UserModel } = require('../db/sequelize')
const { UniqueConstraintError, ValidationError } = require("sequelize")
const { sendMail } = require("../utils/sendMail")
const jwt = require("jsonwebtoken")
const privateKey = require("../setting/privateKey")

/*********************************************************
SIGNUP (inscription)
- crée et retourne un utilisateur
*********************************************************/
exports.signUp = (req, res) => {
    bcrypt.hash(req.body.password,10)
    .then((hash) => {
        req.body.password = hash
        UserModel.create(req.body)
            .then((element) => {
                const token = jwt.sign(
                    { id: element.id }, // Génération du token avec encryptage de l'id user
                    privateKey,
                    { expiresIn: "300000" })

                sendMail(element.email, "Inscription site LudicZone", req.body.nick_name, token)
                    .then((info) => {
                        const  msg = `Un mail de validation de la création du compte a été envoyé à l'adresse : '${info.accepted[0]}'.`

                        return res.status(200).json({ status: "SUCCESS", message: msg })
                    })
                    .catch((error) => {
                        throw Error(error);
                    })
            })
            .catch(error => {
                if(error instanceof UniqueConstraintError || error instanceof ValidationError){
                    return res.status(409).json({ status: "ERR_CONSTRAINT", message: error.message })    
                }        
                else {
                    return res.status(500).json({ status: "ERR_SERVER", message: error.message })    
                }
            })
    })
    .catch(error => {
        return res.status(500).json({ status: "ERR_SERVER", message: error.message })    
    })
}

