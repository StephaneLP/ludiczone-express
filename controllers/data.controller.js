exports.checkAreaType = (req, res, next) => {
    const newAreaType = req.body;

    console.log(newAreaType)

    return next()
}