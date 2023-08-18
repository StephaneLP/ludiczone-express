/*********************************************************
Dépendances
*********************************************************/
const express = require('express')
const morgan = require('morgan')
const serveFavicon = require('serve-favicon')
const cors = require('cors')
const app = express()

app
    .use(morgan('dev'))    
    .use(serveFavicon(__dirname + '/favicon.png'))
    .use(express.json())
    .use(cors())

/*********************************************************
Routes
*********************************************************/
const AreaTypeRouter = require('./routes/area-type.routes')
const AreaZoneRouter = require('./routes/area-zone.routes')
const AreaRouter = require('./routes/area.routes')
const AuthRouter = require('./routes/auth.routes')
const UserRouter = require('./routes/user.routes')

app 
    .use('/api/areatypes', AreaTypeRouter)
    .use('/api/areazones', AreaZoneRouter)
    .use('/api/areas', AreaRouter)
    .use('/api/auth', AuthRouter)
    .use('/api/user', UserRouter)

/*********************************************************
Ouverture du port
*********************************************************/
const port = 3001

app.listen(port, () => {console.log(`L'app sur le port ${port}`)})

/*********************************************************
BDD : import des données
*********************************************************/
const data = require('./db/data')

data.initDb()