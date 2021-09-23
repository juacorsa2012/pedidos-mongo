import StatusCode from 'http-status-codes'
import { SUCCESS, PEDIDO_NO_ENCONTRADO, PEDIDO_REGISTRADO, 
         PROVEEDOR_NO_ENCONTRADO, CLIENTE_NO_ENCONTRADO, 
         PEDIDO_ELIMINADO, PEDIDO_ACTUALIZADO } from '../config/mensajes.js'
import Pedido from '../models/pedido.model.js'
import asyncHandler from '../middlewares/async.js'
import ErrorResponse from '../utils/errorResponse.js'
import Features from '../utils/Features.js'

const obtenerPedidos = asyncHandler(async (req, res) => { 
  const page  = req.params.page  || null
  const limit = req.params.limit || null
  
  const features = new Features(Pedido.find().populate('cliente proveedor'), req.query)
    .filter()
    .sort()  
    .paginate()

  const pedidos = await features.query
  
  res.status(StatusCode.OK).json({
    status: SUCCESS,
    meta: {
      results: pedidos.length,
      page,
      limit
    },    
    data: { pedidos }
  })
})

const registrarPedido = asyncHandler(async (req, res, next) => {    
  const { cliente, proveedor } = req.body

  if (!proveedor) {
    return next(new ErrorResponse(PROVEEDOR_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }

  if (!cliente) {
    return next(new ErrorResponse(CLIENTE_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }
  
  const pedido = await Pedido.create(req.body)  
    
  res.status(StatusCode.CREATED).json({
    status : SUCCESS,
    message: PEDIDO_REGISTRADO,
    data   : { pedido }
  })        
})

const obtenerPedido = asyncHandler(async (req, res, next) => {  
  const pedido = await Pedido.findById(req.params.id).populate('cliente proveedor')

  if (!pedido) {     
    return next(new ErrorResponse(PEDIDO_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }   
       
  res.status(StatusCode.OK).json({
    status: SUCCESS,
    data  : { pedido }
  })  
})

const actualizarPedido = asyncHandler(async (req, res, next) => {  
  const id = req.params.id   
  let pedido = await Pedido.findById(id)

  if (!pedido) {
    return next(new ErrorResponse(PEDIDO_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }
    
  pedido = await Pedido.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })  
          
  res.status(StatusCode.OK).json({
    status : SUCCESS,
    message: PEDIDO_ACTUALIZADO,
    data   : { pedido }
  })         
})

const eliminarPedido = asyncHandler(async (req, res, next) => {  
  const id = req.params.id   
  let pedido = await Pedido.findById(id)

  if (!pedido) {
    return next(new ErrorResponse(PEDIDO_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }
    
  await Pedido.findByIdAndRemove(id)
            
  res.status(StatusCode.OK).json({
    status : SUCCESS,
    message: PEDIDO_ELIMINADO,
    data   : { pedido }
  })         
})

export {
  obtenerPedidos,
  obtenerPedido,
  registrarPedido,
  actualizarPedido,
  eliminarPedido
}