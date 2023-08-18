const bcrypt = require("bcrypt")
const { UserModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")

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
            const  msg = `L'utilisateur '${element.nick_name}' a bien été ajouté.`
            return res.status(200).json({ status: "SUCCESS", message: msg })
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