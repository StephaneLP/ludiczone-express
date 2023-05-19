const { AreaModel } = require('../db/sequelize')
const { Op, UniqueConstraintError, ValidationError } = require("sequelize")

//////////////////////////////////////////////////////////////////////////
// CREATE
//////////////////////////////////////////////////////////////////////////

exports.createArea = (req, res) => {
    const newArea = req.body;

    AreaModel.create({
        name: newArea.name,
        description_short: newArea.description_short,
        description_long: newArea.description_long,
        AreaTypeId: newArea.AreaTypeId,
        AreaZoneId: newArea.AreaZoneId,
    })
    .then((el) => {
        const msg = `La salle a bien été ajoutée.`
        res.json({ message: msg, data: newArea})
    })
    .catch(error => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(400).json({ message: error.message, data: error })    
        }
        else {
            const msg = "test"
            return res.status(500).json({ message: error.message, data: error })    
        }
    })
}