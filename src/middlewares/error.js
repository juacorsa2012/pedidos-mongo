import StatusCode  from 'http-status-codes'
import ErrorResponse from '../utils/errorResponse.js'
import * as Mensaje from '../config/mensajes.js'

const errorHandler = (err, req, res, next) => {
  let error = { ...err }  
  error.message = err.message     
  
  if (err.name === 'CastError') {
    const message = `${err.value} no es un objectId de Mongoose válido`
    error = new ErrorResponse(message, StatusCode.BAD_REQUEST)
  }
  
  if (err.name === 'ValidationError') {   
    const errors  = Object.values(err.errors).map(el => el.message)
    const message = `${errors.join('.')}`
    error = new ErrorResponse(message, StatusCode.BAD_REQUEST)
  }
  
  if (err.code === 11000) {  
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]    
    const message = `${value} ya existe en la base de datos`
    error = new ErrorResponse(message, StatusCode.BAD_REQUEST)
  }

  res.status(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error.message || Mensaje.INTERNAL_SERVER_ERROR
  })
}

export default errorHandler