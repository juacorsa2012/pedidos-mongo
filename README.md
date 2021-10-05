# REST API de pedidos con Node.js y MongoDB

A continuación se detallan las características principales de la aplicación.

* Stack tecnológico usado: NodeJs + Express + MongoDB.
* La aplicación se estructura en capas (models, routes, controllers, config, utils y test).
* La configuración de la aplicación está definida en la carpeta config con 2 entornos
* El servidor está definido en server.js
* Se han definido tantas modelos como entidades a gestionar. 
* Los modelos incluyen validaciones de mongoose y referencias entre los mismos.
* El modelo usuario incluye un hook "pre" para hashear la contraseña.
* Para evitar el try catch en los controladores se ha creado el middleware asynnHandler.js (utils).
* La conexión con la base de datos está en db/db.js.
* Para usar las variables de entorno se usa dotenv.
* Los controladores se pueden proteger por autentificación y por roles (auth.controller.js).
* Existe un error.controller.js que controla los distintos tipos de error que se puedan dar.
* En la carpeta seed existen distintos ficheros para rellenar la base de datos.
* Se ha usado los paquetes helmet, xss-clean, hpp y express-mongo-sanitize para la seguridad.
* Se ha limitado el número de peticiones que pueden atenderse usando express-rate-limit.
* Se han desarrollado tests unitarios y de integración.
* Los tests están implementados en Jest.