const express = require('express')
const morgan = require('morgan')
const serveFavicon = require('serve-favicon')
const cors = require('cors')
const data = require('./db/data')
const AuthRouter = require('./routes/auth.routes')
const AreaTypeRouter = require('./routes/area-type.routes')
const AreaZoneRouter = require('./routes/area-zone.routes')
const AreaRouter = require('./routes/area.routes')
const app = express()
const port = 3001

app
    .use(morgan('dev'))    
    .use(serveFavicon(__dirname + '/favicon.png'))
    .use(express.json())
    .use(cors())
    .use('/api/auth', AuthRouter)
    .use('/api/areatype', AreaTypeRouter)
    .use('/api/areazone', AreaZoneRouter)
    .use('/api/area', AreaRouter)
    .listen(port, () => {
        console.log(`L'app sur le port ${port}`)
    }) 

data.initDb()