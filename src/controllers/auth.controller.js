import StatusCode from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { CREDENCIALES_INCORRECTAS, INICIAR_SESION, SIN_PERMISOS, 
         SUCCESS, USUARIO_REQUERIDO } from '../config/mensajes.js'
import asyncHandler from '../middlewares/async.js'
import ErrorResponse from '../utils/errorResponse.js'
import Usuario from '../models/usuario.model.js'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/config.js'

const crearToken = id => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: +JWT_EXPIRES_IN
    })
}

const registro = asyncHandler(async (req, res, next) => {
    const usuario = await Usuario.create(req.body)
    const token = crearToken(usuario._id)
    
    res.status(StatusCode.CREATED).json({ 
        status: SUCCESS,
        token 
    })
})

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {        
        return next(new ErrorResponse(CREDENCIALES_INCORRECTAS, StatusCode.BAD_REQUEST))
    }

    const usuario = await Usuario.findOne({ email }).select('+password')

    if (!usuario || !(await usuario.esPasswordCorrecto(password, usuario.password)))
    {        
        return next(new ErrorResponse(CREDENCIALES_INCORRECTAS, StatusCode.UNAUTHORIZED))
    }    
    
    const token = crearToken(usuario._id)

    res.status(StatusCode.OK).json({ 
        status: SUCCESS,
        token 
    })
})

const checkAuth = asyncHandler(async (req, res, next) => {    
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
  
    if (!token) {
      return next(new ErrorResponse(INICIAR_SESION, StatusCode.UNAUTHORIZED))
    }  
    
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET)
      
    const usuario = await Usuario.findById(decoded.id)

    if (!usuario) {
      return next(new ErrorResponse(USUARIO_REQUERIDO, StatusCode.UNAUTHORIZED))
    }  
    
    req.usuario = usuario
    next()
})

const checkRol = (...roles) => {
    return (req, res, next) => {      
      if (!roles.includes(req.usuario.rol)) {
        return next(new ErrorResponse(SIN_PERMISOS, StatusCode.UNAUTHORIZED));
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