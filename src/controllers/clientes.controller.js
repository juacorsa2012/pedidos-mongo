import StatusCode from 'http-status-codes'
import mongoose from 'mongoose'
import { SUCCESS, CLIENTE_REGISTRADO, CLIENTE_NO_ENCONTRADO, CLIENTE_ACTUALIZADO } from '../config/mensajes.js'
import Cliente from '../models/cliente.model.js'
import Pedido from '../models/pedido.model.js'
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
    status : SUCCESS,
    results: clientes.length,
    data   : { clientes }
  })
})

const obtenerPedidosCliente = asyncHandler(async (req, res) => {  
  const { id } = req.params

  const features = new Features(Pedido.find({cliente: mongoose.Types.ObjectId(id)}).populate('proveedor cliente'), req.query)
    .filter()
    .sort()  
    .paginate()

  const pedidos = await features.query
  
  res.status(StatusCode.OK).json({
    status : SUCCESS,
    results: pedidos.length,
    data   : { pedidos }
  })
})

const registrarCliente = asyncHandler(async (req, res, next) => {    
  const cliente = await Cliente.create(req.body)  
    
  res.status(StatusCode.CREATED).json({
    status : SUCCESS,
    message: CLIENTE_REGISTRADO,
    data   : { cliente }
  })        
})

const obtenerCliente = asyncHandler(async (req, res, next) => {  
  const cliente = await Cliente.findById(req.params.id)

  if (!cliente) {     
    return next(new ErrorResponse(CLIENTE_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }   
       
  res.status(StatusCode.OK).json({
    status: SUCCESS,
    data  : { cliente }
  })  
})

const actualizarCliente = asyncHandler(async (req, res, next) => {  
  const id = req.params.id   
  let cliente = await Cliente.findById(id)

  if (!cliente) {
    return next(new ErrorResponse(CLIENTE_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }
    
  cliente = await Cliente.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })  
          
  res.status(StatusCode.OK).json({
    status : SUCCESS,
    message: CLIENTE_ACTUALIZADO,
    data   : { cliente }
  })         
})

const contarClientes = asyncHandler(async (req, res, next) => {
  const count = await Cliente.countDocuments()

  res.status(StatusCode.OK).json({
    status: SUCCESS,
    data: { count }
  })           
})

export {
  registrarCliente,
  obtenerCliente,
  obtenerClientes,
  obtenerPedidosCliente,
  contarClientes,
  actualizarCliente
}