const express = require('express')
const morgan = require('morgan')
const serveFavicon = require('serve-favicon')
const cors = require('cors')
const sequelize = require('./db/sequelize')
const AreaTypeRouter = require('./routes/area-type.routes')
const app = express()
const port = 3001

app
    .use(morgan('dev'))    
    .use(serveFavicon(__dirname + '/favicon.png'))
    .use(express.json())
    .use(cors())
    .use('/api/areatype', AreaTypeRouter)
    .listen(port, () => {
        console.log(`L'app sur le port ${port}`)
    }) 

sequelize.initDb()