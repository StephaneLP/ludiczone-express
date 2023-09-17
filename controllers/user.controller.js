const bcrypt = require("bcrypt")
const { UserModel } = require('../db/sequelize')
const { UniqueConstraintError, ValidationError } = require("sequelize")
const { sendMailRegistration } = require("../utils/sendMail")
const jwt = require("jsonwebtoken")
const privateKey = require("../setting/privateKey")

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

            if(element.verified_email) {
                const msg = `Cette adresse email a déjà été vérifiée. L'envoi d'un email de confirmation n'est donc pas nécessaire.`
                return res.status(400).json({ status: "ERR_REQUEST", message: msg })
            }

            try {
                const token = jwt.sign(
                    { data: element.id }, // Génération du token avec encryptage de l'id user
                    privateKey,
                    { expiresIn: "300000" })

                const url = "http://localhost:3000/inscription-confirm/" + token
                sendMailRegistration(element.email, "Inscription site LudicZone", element.nick_name, url)
                    .then((info) => {
                        const  msg = `Un mail de validation de la création du compte a été envoyé à l'adresse : '${info.accepted[0]}'.`
                        res.status(200).json({ status: "SUCCESS", message: msg })
                    })
                    .catch((error) => {
                        const msg = "Une erreur est survenue lors de l'envoi d'un nouveau mail de vérification."
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

