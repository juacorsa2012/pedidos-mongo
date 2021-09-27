import { actualizarProveedor, obtenerPedidosProveedor, obtenerProveedor, obtenerProveedores, registrarProveedor } from '../../controllers/proveedores.controller.js'

describe("Test ProveedorController", () => {    
  it("debería existir una función llamada obtenerProveedor", () => {
    expect(typeof obtenerProveedor).toBe("function")
  })

  it("debería existir una función llamada obtenerProveedores", () => {
    expect(typeof obtenerProveedores).toBe("function")
  })

  it("debería existir una función llamada registrarProveedor", () => {
    expect(typeof registrarProveedor).toBe("function")
  })

  it("debería existir una función llamada actualizarProveedor", () => {
    expect(typeof actualizarProveedor).toBe("function")
  })

  it("debería existir una función llamada obtenerPedidosProveedor", () => {
    expect(typeof obtenerPedidosProveedor).toBe("function")
  })
})