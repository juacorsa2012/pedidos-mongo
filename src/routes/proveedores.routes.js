import express from 'express'
import * as controller from '../controllers/proveedores.controller.js'

const router = express.Router()

router.get('/count', controller.contarProveedores)
router.get('/', controller.obtenerProveedores)
router.get('/:id', controller.obtenerProveedor)
router.get('/:id/pedidos', controller.obtenerPedidosProveedor)
router.post('', controller.registrarProveedor)
router.put('/:id', controller.actualizarProveedor)

export default router

