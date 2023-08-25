const bcrypt = require("bcrypt")
const { UserModel } = require('../db/sequelize')
const { UniqueConstraintError, ValidationError } = require("sequelize")
const { sendMailRegistration } = require("../utils/sendMail")
const jwt = require("jsonwebtoken")
const privateKey = require("../setting/privateKey")

/*********************************************************
CREATE (SIGNUP : inscription)
- crée et retourne un utilisateur
*********************************************************/
exports.signUp = (req, res) => {
    bcrypt
        .hash(req.body.password,10)
        .then((hash) => {
            req.body.password = hash
            UserModel
                .create(req.body)
                .then((element) => {
                    try {
                        const token = jwt.sign(
                            { data: element.id }, // Génération du token avec encryptage de l'id user
                            privateKey,
                            { expiresIn: "300000" })

                        const url = "http://localhost:3000/inscription-confirm/" + token
                        sendMailRegistration(element.email, "Inscription site LudicZone", req.body.nick_name, url)
                            .then((info) => {
                                const  msg = `Un mail de validation de la création du compte a été envoyé à l'adresse : '${info.accepted[0]}'.`
                                res.status(200).json({ status: "SUCCESS", message: msg })
                            })
                            .catch((error) => {
                                throw Error(error);
                            })
                    }
                    catch(error) {
                        const msg = "Attention! Le compte a bien été créé, mais une erreur est survenue lors de la génération du lien permettant de confirmer l'adresse email."
                        res.status(401).json({ status: "ERR_AUTHENTICATION", message: `${msg} (${error.message})` })
                    }
                })
                .catch(error => {
                    if(error instanceof UniqueConstraintError || error instanceof ValidationError){
                        return res.status(409).json({ status: "ERR_CONSTRAINT", message: error.message })    
                    }
                    res.status(500).json({ status: "ERR_SERVER", message: error.message })    
                })
        })
        .catch(error => {
            res.status(500).json({ status: "ERR_SERVER", message: error.message })    
        })
}

/*********************************************************
UPDATE (SIGNUP : confirmation de l'asresse email)
- met à jour l'utilisateur
*********************************************************/
exports.signUpConfirm = (req, res) => {
    try {
        const token = req.params.token
        const payload = jwt.verify(token, privateKey) // Vérification du token
        const id = payload.data // Décryptage de l'id user

        UserModel
            .findByPk(id)
            .then((element) => {
                if(!element) {
                    const msg = "Confirmation impossible : aucun utilisateur ne correspond au lien de confirmation utilisé."
                    return res.status(404).json({ status: "ERR_NOT_FOUND", message: msg })
                }

                element
                    .update({ verified_email: true },{
                        where: {id: id}
                    })
                    .then((element) => {
                        const msg = `L'adresse '${element.email}' a bien été confirmée.`
                        res.status(200).json({ status: "SUCCESS", message: msg })            
                    })
                    .catch(error => {
                        throw Error(error)   
                    })
            })
            .catch((error) => {
                res.status(500).json({ status: "ERR_SERVER", message: error.message })
            })
    }
    catch(error) {
        let msg = ""
        switch(error.name) {
            case "TokenExpiredError":
                msg = "Le lien de validation de l'adresse email est expiré."
                break
            case "JsonWebTokenError":
                msg = "Le lien de validation de l'adresse email est invalide."
                break
            default:
                msg = "Erreur de vérification  de l'adresse email."
        }
        res.status(401).json({ status: "ERR_AUTHENTICATION", message: msg })
    }
}
