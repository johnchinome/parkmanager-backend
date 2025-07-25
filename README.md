README - ParkManager Backend

🚗 ParkManager – Backend

Sistema web para la gestión eficiente de parqueaderos comerciales, residenciales o públicos. Permite registrar vehículos, controlar entradas y salidas, gestionar tarifas, usuarios con diferentes roles, suscripciones, reportes, pagos en línea, y llevar una trazabilidad detallada mediante auditorías y logs.

🧰 Tecnologías utilizadas

- Node.js + Express
- PostgreSQL con Prisma ORM
- JWT para autenticación
- Bcrypt para hashing de contraseñas
- Dotenv para configuración segura
- Postman para pruebas de API
- Wompi (pagos electrónicos)
- Git + GitHub

⚙️ Funcionalidades principales

- Autenticación de usuarios con JWT
- Roles de usuario: ADMIN, OWNER, EMPLOYEE
- Gestión de parqueaderos y espacios (por tipo de vehículo)
- Registro de entradas y salidas de vehículos
- Tarifas diferenciadas por parqueadero y tipo de vehículo
- Cálculo automático del valor a pagar con aplicación de descuentos
- Gestión de suscripciones (mensual, trimestral, semestral, anual)
- Integración con Wompi para pagos en línea
- Reportes diarios, mensuales y por rango de fechas
- Historial por placa y auditoría por empleado
- Logs de errores y trazabilidad de acciones por usuario

📁 Estructura del proyecto

📦 backend/
├── controllers/
├── middlewares/
├── prisma/
│ ├── schema.prisma
│ └── client.js
├── routes/
├── services/
├── utils/
├── .env
├── .gitignore
└── index.js

🔐 Variables de entorno

Crear un archivo .env con los siguientes valores:

DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_bd
JWT_SECRET=clave-secreta
JWT_EXPIRATION=1d
WOMPI_PUBLIC_KEY=tu_llave_publica
WOMPI_PRIVATE_KEY=tu_llave_privada
WOMPI_URL=https://sandbox.wompi.co/v1

💻 Instalación y uso

# Clonar el repositorio

git clone https://github.com/tu_usuario/parkmanager-backend.git
cd parkmanager-backend

# Instalar dependencias

npm install

# Generar cliente de Prisma

npx prisma generate

# Crear la base de datos y aplicar migraciones

npx prisma migrate dev --name init

# Iniciar el servidor en desarrollo

npm run dev

🔍 Rutas principales
Ruta Método Descripción
/api/auth/login POST Iniciar sesión
/api/auth/register POST Registrar usuario
/api/users CRUD Gestión de usuarios
/api/parking-lots CRUD Parqueaderos
/api/vehicles CRUD Vehículos
/api/entries POST/PUT/GET Entradas y salidas
/api/subscriptions CRUD Suscripciones
/api/payments POST/GET Pagos con Wompi
/api/dashboard GET Reportes e indicadores
/api/audits GET Auditoría global (admin)
/api/audits/me GET Historial de acciones del usuario
/api/audits/errors GET Consultar errores registrados
🛡️ Seguridad y trazabilidad

- Todas las rutas están protegidas con autenticación JWT
- Validación de acceso a parqueaderos por parte de empleados (middleware personalizado)
- Registro detallado de todas las acciones POST, PUT, DELETE en tabla AuditLog
- Middleware global para registro de errores con detalle de ruta, método, stack y usuario

🧪 Pruebas recomendadas

1. Registrar un OWNER y un EMPLOYEE
2. Crear parqueadero, tarifas y espacios
3. Asignar empleados a parqueaderos
4. Registrar entradas/salidas de vehículos
5. Probar pagos de suscripción con Wompi (sandbox)
6. Consultar reportes y auditorías

📌 Consideraciones

- La validación de suscripción activa es automática al momento de usar funciones restringidas
- El sistema puede escalar a múltiples parqueaderos sin conflictos
- Las acciones son auditables por fecha, usuario y entidad
- El frontend puede integrarse fácilmente con este backend usando fetch o axios

👨‍💻 Autor
Proyecto desarrollado como resultado del diplomado de desarrollo web full stack.
