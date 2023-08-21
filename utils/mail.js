const mailFrom = require("../setting/senderAddress")
const nodemailer = require("nodemailer");

const sendMail = (subject, nickName, address) => {
    const transport = {
        service : "hotmail",
        auth : {
            user : mailFrom.address,
            pass : mailFrom.password
        }
    }
    const options = {
        from : mailFrom.address, 
        to: address, 
        subject: subject, 
        html: formatMail(nickName)
    }
    const transporter = nodemailer.createTransport(transport)

    return transporter.sendMail(options)
}

const formatMail = (nickName) => {
    const html = "<h1>LudicZone"
    + "<h2>Inscription</h2>"
    + "<p>Bonjour " + nickName + ","
    + "<br>Vous venez de vous inscrire sur le site LudicZone."
    + "<br>Veuillez confirmer votre inscription en cliquant sur le lien suivant :"
    + "<br><br><a href='http://localhost:3000/'>Lien</a></p>"

    return html
}

module.exports = { sendMail }