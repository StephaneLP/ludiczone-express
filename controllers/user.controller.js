const bcrypt = require("bcrypt")
const { UserModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require("sequelize")
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
        const token = jwt.sign({ // Génération du token avec encryptage du pseudo : nickName
            nickName: element.id,
        }, privateKey, { expiresIn: "300000"})








        req.body.password = hash
        UserModel.create(req.body)
            .then((element) => {
                const  msg = `L'utilisateur '${element.nick_name}' a bien été ajouté.`

sendMail("ceodren@outlook.com", "Inscription site LudicZone", req.body.nick_name, "db56et4g6e4h6e4h6e54h68er54h")
    .then((info) => {
        console.log(info.accepted[0], info.response);
    })
    .catch((error) => {
        console.log(error);
    })


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



// const nodemailer = require("nodemailer");

// const sendMail = (subject, message, dest) => {
//     const transport = {
//         service : "hotmail",
//         auth : {
//             user : mailFrom.address,
//             pass : mailFrom.password
//         }
//     }
//     const options = {
//         from : mailFrom.address, 
//         to: dest, 
//         subject: subject, 
//         html: message
//     }
//     const transporter = nodemailer.createTransport(transport)

//     return transporter.sendMail(options)
    
    // transporter.sendMail(options)
    //     .then((info) => {
    //         console.log('Email sent: ' + info.response);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     })

    // transporter.sendMail(options, (error, info) => {
    //     if (error) {
    //     console.log(error);
    //     } else {
    //     console.log('Email sent: ' + info.response);
    //     }
    // })
// }


