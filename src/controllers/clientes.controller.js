import StatusCode from 'http-status-codes'
import * as Mensaje from '../config/mensajes.js'
import Cliente from '../models/cliente.model.js'
import asyncHandler from '../middlewares/async.js'
import ErrorResponse from '../utils/errorResponse.js'
import Features from '../utils/Features.js'

const obtenerClientes = asyncHandler(async (req, res) => {    
  const features = new Features(Cliente.find(), req.query)
    .filter()
    .sort()  
    .paginate()

  const clientes = await features.query
  
  res.status(StatusCode.OK).json({
    status : Mensaje.SUCCESS,
    results: clientes.length,
    data   : { clientes }
  })
})

const registrarCliente = asyncHandler(async (req, res, next) => {    
  const cliente = await Cliente.create(req.body)  
    
  res.status(StatusCode.CREATED).json({
    status : Mensaje.SUCCESS,
    message: Mensaje.CLIENTE_REGISTRADO,
    data   : { cliente }
  })        
})

const obtenerCliente = asyncHandler(async (req, res, next) => {  
  const cliente = await Cliente.findById(req.params.id)

  if (!cliente) {     
    return next(new ErrorResponse(Mensaje.CLIENTE_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }   
       
  res.status(StatusCode.OK).json({
    status: Mensaje.SUCCESS,
    data  : { cliente }
  })  
})

const actualizarCliente = asyncHandler(async (req, res, next) => {  
  const id = req.params.id   
  let cliente = await Cliente.findById(id)

  if (!cliente) {
    return next(new ErrorResponse(Mensaje.CLIENTE_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }
    
  cliente = await Cliente.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })  
          
  res.status(StatusCode.OK).json({
    status : Mensaje.SUCCESS,
    message: Mensaje.CLIENTE_ACTUALIZADO,
    data   : { cliente }
  })         
})

const contarClientes = asyncHandler(async (req, res, next) => {
  const count = await Cliente.countDocuments()

  res.status(StatusCode.OK).json({
    status: Mensaje.SUCCESS,
    data: { count }
  })           
})

export {
  registrarCliente,
  obtenerCliente,
  obtenerClientes,
  contarClientes,
  actualizarCliente
}