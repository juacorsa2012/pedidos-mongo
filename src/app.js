import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import StatusCode from 'http-status-codes'
import { PORT, HOST, DB } from './config/config.js'
import conectarDB from './db/db.js'
import ErrorResponse from './utils/errorResponse.js'
import errorHandler from './middlewares/error.js'
import clienteRoutes from './routes/clientes.route.js'
import proveedorRoutes from './routes/proveedores.routes.js'
import usuarioRoutes from './routes/usuarios.routes.js'
import pedidoRoutes from './routes/pedidos.routes.js'
import { DEMASIADAS_PETICIONES } from './config/mensajes.js'

const PETICIONES = 100
const app = express()

app.use(express.json())

const limiter = rateLimit({
  max: PETICIONES,
  windowMs: 60 * 60 * 1000,
  message: DEMASIADAS_PETICIONES
})

app.use(morgan('dev'))
app.use(cors())
app.use('/api/v1/', limiter)
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())

app.set("port", PORT)
app.set("host", HOST)

conectarDB(DB)

app.use('/api/v1/clientes', clienteRoutes)
app.use('/api/v1/proveedores', proveedorRoutes)
app.use('/api/v1/usuarios', usuarioRoutes)
app.use('/api/v1/pedidos', pedidoRoutes)

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Imposible encontrar ${req.originalUrl} en este servidor!`, StatusCode.NOT_FOUND))
})

app.use(errorHandler)

export default app