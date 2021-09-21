import StatusCode from 'http-status-codes'
import * as Mensaje from '../config/mensajes.js'
import Proveedor from '../models/proveedor.model.js'
import asyncHandler from '../middlewares/async.js'
import ErrorResponse from '../utils/errorResponse.js'
import Features from '../utils/Features.js'

const obtenerProveedores = asyncHandler(async (req, res) => {    
  const features = new Features(Proveedor.find(), req.query)
    .filter()
    .sort()  
    .paginate()

  const proveedores = await features.query
  
  res.status(StatusCode.OK).json({
    status : Mensaje.SUCCESS,
    results: proveedores.length,
    data   : { proveedores }
  })
})

const registrarProveedor = asyncHandler(async (req, res, next) => {    
  const proveedor = await Proveedor.create(req.body)  
    
  res.status(StatusCode.CREATED).json({
    status : Mensaje.SUCCESS,
    message: Mensaje.PROVEEDOR_REGISTRADO,
    data   : { proveedor }
  })        
})

const obtenerProveedor = asyncHandler(async (req, res, next) => {  
  const proveedor = await Proveedor.findById(req.params.id)

  if (!proveedor) {     
    return next(new ErrorResponse(Mensaje.PROVEEDOR_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }   
       
  res.status(StatusCode.OK).json({
    status: Mensaje.SUCCESS,
    data  : { proveedor }
  })  
})

const actualizarProveedor = asyncHandler(async (req, res, next) => {  
  const id = req.params.id   
  let proveedor = await Proveedor.findById(id)

  if (!proveedor) {
    return next(new ErrorResponse(Mensaje.PROVEEDOR_NO_ENCONTRADO, StatusCode.NOT_FOUND))
  }
    
  proveedor = await Proveedor.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })  
          
  res.status(StatusCode.OK).json({
    status : Mensaje.SUCCESS,
    message: Mensaje.PROVEEDOR_ACTUALIZADO,
    data   : { proveedor }
  })         
})

const contarProveedores = asyncHandler(async (req, res, next) => {
  const count = await Proveedor.countDocuments()

  res.status(StatusCode.OK).json({
    status: Mensaje.SUCCESS,
    data: { count }
  })           
})

export {
  obtenerProveedor,
  obtenerProveedores,
  registrarProveedor,
  actualizarProveedor,
  contarProveedores
}