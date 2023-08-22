const mailFrom = require("../setting/senderAddress")
const nodemailer = require("nodemailer")
const fs = require("fs")

const sendMail = (address, subject, nickName, token) => {
    let data = fs.readFileSync("./templates/mailCheckAddress.html", { encoding: 'utf8' })

    data = data.replace("$pseudo", nickName)
    data = data.replace("$token", token)

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
        html: data
    }
    const transporter = nodemailer.createTransport(transport)

    return transporter.sendMail(options)
}

module.exports = { sendMail }