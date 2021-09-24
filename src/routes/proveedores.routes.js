import express from 'express'
import { actualizarProveedor, contarProveedores, obtenerPedidosProveedor, 
         obtenerProveedor, obtenerProveedores, registrarProveedor } from '../controllers/proveedores.controller.js'

const router = express.Router()

router.get('/count', contarProveedores)
router.get('/', obtenerProveedores)
router.get('/:id', obtenerProveedor)
router.get('/:id/pedidos', obtenerPedidosProveedor)
router.post('', registrarProveedor)
router.put('/:id', actualizarProveedor)

export default router

