# 🛍️ TechStore - Sistema de Gestión de Inventario

## Tecnologías
- **Frontend:** React
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Contenedores:** Docker

## Seguridad implementada
- JWT Authentication
- MFA con Google Authenticator (TOTP)
- RBAC (Control por Roles)
- ABAC (Control por Atributos)
- Bloqueo tras 5 intentos fallidos
- bcrypt para hash de contraseñas

## Cómo ejecutar
```bash
docker-compose up --build
```
Abrir: http://localhost

## Roles del sistema
| Rol | Permisos |
|-----|---------|
| Admin | Acceso total |
| Gerente | Solo su tienda |
| Empleado | Solo actualiza stock |
| Auditor | Solo lectura |
