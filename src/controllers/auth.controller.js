import StatusCode from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import * as Mensaje from '../config/mensajes.js'
import asyncHandler from '../middlewares/async.js'
import ErrorResponse from '../utils/errorResponse.js'
import Usuario from '../models/usuario.model.js'
import * as config from '../config/config.js'

const crearToken = id => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: +config.JWT_EXPIRES_IN
    })
}

const registro = asyncHandler(async (req, res, next) => {
    const usuario = await Usuario.create(req.body)
    const token = crearToken(usuario._id)
    
    res.status(StatusCode.CREATED).json({ 
        status: Mensaje.SUCCESS,
        token 
    })
})

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {        
        return next(new ErrorResponse(Mensaje.CREDENCIALES_INCORRECTAS, StatusCode.BAD_REQUEST))
    }

    const usuario = await Usuario.findOne({ email }).select('+password')

    if (!usuario || !(await usuario.esPasswordCorrecto(password, usuario.password)))
    {        
        return next(new ErrorResponse(Mensaje.CREDENCIALES_INCORRECTAS, StatusCode.UNAUTHORIZED))
    }    
    
    const token = crearToken(usuario._id)

    res.status(StatusCode.OK).json({ 
        status: Mensaje.SUCCESS,
        token 
    })
})

const checkAuth = asyncHandler(async (req, res, next) => {    
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
  
    if (!token) {
      return next(new ErrorResponse(Mensaje.INICIAR_SESION, StatusCode.UNAUTHORIZED))
    }  
    
    const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET)
      
    const usuario = await Usuario.findById(decoded.id)

    if (!usuario) {
      return next(new ErrorResponse(Mensaje.USUARIO_REQUERIDO, StatusCode.UNAUTHORIZED))
    }  
    
    req.usuario = usuario
    next()
})

const checkRol = (...roles) => {
    return (req, res, next) => {      
      if (!roles.includes(req.usuario.rol)) {
        return next(new ErrorResponse(message.SIN_PERMISOS, statusCode.UNAUTHORIZED));
      }  
      next()
    }
}

export {
    registro,
    login,    
    checkAuth,
    checkRol
}