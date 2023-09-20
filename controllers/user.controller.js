const bcrypt = require("bcrypt")
const { UserModel } = require('../db/sequelize')
const { UniqueConstraintError, ValidationError } = require("sequelize")
const { sendMailRegistration } = require("../utils/sendMail")
const jwt = require("jsonwebtoken")
const privateKey = require("../setting/privateKeyPassword")

/*********************************************************
POST (SEND MAIL : autorisation du changement du mot de passe)
- envoi d'un nouveau token par mail pour autoriser le 
  renouvellement du mot de passe (oublié)
*********************************************************/
exports.forgotPassword = (req, res) => {
    const email = req.body.email

    if(!email) {
        const msg = "Veuillez renseigner une adresse email."
        return res.status(400).json({ status: "ERR_REQUEST", message: msg })
    }

    UserModel
        .findOne({
            where: { email: email }
        })
        .then((element) => {
            if(!element) {
                const msg = `Aucun compte n'a été trouvé pour cette adresse email.`
                return res.status(404).json({ status: "ERR_NOT_FOUND", message: msg })
            }

            try {
                const token = jwt.sign(
                    { data: element.id }, // Génération du token avec encryptage de l'id user
                    privateKey,
                    { expiresIn: "300000" })

                const url = "http://localhost:3000/connect-mdp-confirm/" + token
                sendMailRegistration(element.email, "Mot de passe oublié - Site LudicZone", element.nick_name, url, "mailCheckPassword.html")
                    .then((info) => {
                        const  msg = `Un mail permettant de créer un nouveau mot de passe a été envoyé à l'adresse : '${info.accepted[0]}'.`
                        res.status(200).json({ status: "SUCCESS", message: msg })
                    })
                    .catch((error) => {
                        const msg = "Une erreur est survenue lors de l'envoi du mail."
                        res.status(400).json({ status: "ERR_REQUEST", message: `${msg} (${error.message})` })
                    })
            }
            catch(error) {
                const msg = "Une erreur est survenue lors de la génération d'un nouveau token."
                res.status(400).json({ status: "ERR_REQUEST", message: msg })
            }
        })
        .catch((error) => {
            res.status(500).json({ status: "ERR_SERVER", message: error.message })
        })
}

/*********************************************************
PUT (changement du mot de passe oublié)
*********************************************************/
exports.changeForgottenPassword = (req, res) => {
    const authorizationHeader = req.headers.authorization

    if(!authorizationHeader) {
        const msg = "Un token est nécessaire pour modifier le mot de passe. Veuillez effectuer une nouvelle demande."
        return res.status(400).json({ status: "ERR_REQUEST", message: msg })
    }

    try {
        const token = authorizationHeader.split(' ')[1]

        if(token === "null") {
            const msg = "Un token est nécessaire pour modifier le mot de passe. Veuillez effectuer une nouvelle demande."
            return res.status(400).json({ status: "ERR_REQUEST", message: msg })
        }

        const payload = jwt.verify(token, privateKey) // Vérification du token
        const id = payload.data // Décryptage de l'id user

        bcrypt
            .hash(req.body.password,10)
            .then((hash) => {
                UserModel
                    .update({ password: hash },{
                        where: {id: id}
                    })
                    .then(() => {
                        const msg = `Le mot de passe a bien été modifié.`
                        res.status(200).json({ status: "SUCCESS", message: msg })            
                    })
                    .catch(error => {
                        throw Error(error)   
                    })
            })
            .catch(error => {
                res.status(500).json({ status: "ERR_SERVER", message: error.message })    
            })
    }
    catch(error) {
        let msg = ""
        switch(error.name) {
            case "TokenExpiredError":
                msg = "Le lien permettant de modifier le mot de passe est expiré. Veuillez effectuer une nouvelle demande."
                break
            case "JsonWebTokenError":
                msg = "Le lien permettant de modifier le mot de passe est invalide. Veuillez effectuer une nouvelle demande."
                break
            default:
                msg = "Erreur de vérification du token. Veuillez effectuer une nouvelle demande."
        }
        res.status(401).json({ status: "ERR_AUTHENTICATION", message: msg })
    }
}
