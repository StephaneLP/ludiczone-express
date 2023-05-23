const express = require('express')
const morgan = require('morgan')
const serveFavicon = require('serve-favicon')
const cors = require('cors')
const sequelize = require('./db/sequelize')
const AreaTypeRouter = require('./routes/area-type.routes')
const AreaZoneRouter = require('./routes/area-zone.routes')
const AreaRouter = require('./routes/area.routes')
const UserRouter = require('./routes/user.routes')
const app = express()
const port = 3001

app
    .use(morgan('dev'))    
    .use(serveFavicon(__dirname + '/favicon.png'))
    .use(express.json())
    .use(cors())
    .use('/api/areatype', AreaTypeRouter)
    .use('/api/areazone', AreaZoneRouter)
    .use('/api/area', AreaRouter)
    .use('/api/user', UserRouter)
    .listen(port, () => {
        console.log(`L'app sur le port ${port}`)
    }) 

sequelize.initDb()