import express from 'express'
import StatusCode from 'http-status-codes'
import * as config from './config/config.js'
import conectarDB from './db/db.js'
import ErrorResponse from './utils/errorResponse.js'
import errorHandler from './middlewares/error.js'
import clienteRoutes from './routes/clientes.route.js'
import proveedorRoutes from './routes/proveedores.routes.js'

const app = express()

app.use(express.json())

app.set("port", config.PORT)
app.set("host", config.HOST)

conectarDB(config.DB)

app.use('/api/v1/clientes', clienteRoutes)
app.use('/api/v1/proveedores', proveedorRoutes)

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Imposible encontrar ${req.originalUrl} en este servidor!`, StatusCode.NOT_FOUND))
})

app.use(errorHandler)

export default app