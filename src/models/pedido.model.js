import mongoose from 'mongoose'
import { PRODUCTO_REQUERIDO, UNIDADES_REQUERIDO, CLIENTE_REQUERIDO } from '../config/mensajes.js'
import { ESTADO_DEVUELTO, ESTADO_ENTREGADO, ESTADO_FACTURADO, 
         ESTADO_PEDIDO, ESTADO_PREPARADO } from '../config/constantes.js'

const pedidoSchema = new mongoose.Schema(
{
  producto: {
    type: String,
    required: [true, PRODUCTO_REQUERIDO],    
    trim: true            
  },
  unidades: {
    type: Number,
    required: [true, UNIDADES_REQUERIDO]
  },
  referencia: {
    type: String,    
    trim: true        
  },
  oferta: {
    type: String,    
    trim: true        
  },
  observaciones: {
    type: String,    
    trim: true        
  },
  parte: {
    type: String,    
    trim: true        
  },
  estado: {
    type: String,
    enum : [ESTADO_PEDIDO, ESTADO_PREPARADO, ESTADO_ENTREGADO, ESTADO_FACTURADO, ESTADO_DEVUELTO],
    default: ESTADO_PEDIDO
  },
  created_at: {
    type: Date,
    default: Date.now(),
    select: false
  },
  cliente: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cliente',
    required: [true, CLIENTE_REQUERIDO]
  },
  proveedor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Proveedor',
    required: [true, PRODUCTO_REQUERIDO]
  }
})

const Pedido = mongoose.model('Pedido', pedidoSchema, 'pedidos')

export default Pedido