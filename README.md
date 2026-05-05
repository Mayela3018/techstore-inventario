<div align="center">

# 🛍️ TechStore
### Sistema de Gestión de Inventario

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

> Sistema web seguro para gestión de inventario con autenticación multifactor,
> control de acceso por roles y atributos, desplegado con Docker.

</div>

---

## 📋 Tabla de Contenidos
- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Seguridad](#seguridad)
- [Roles del Sistema](#roles-del-sistema)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## 📖 Descripción

**TechStore** es una aplicación web empresarial desarrollada para gestionar el inventario
de una cadena de tiendas de tecnología. Implementa controles de seguridad robustos
incluyendo autenticación multifactor, control de acceso basado en roles (RBAC)
y control de acceso basado en atributos (ABAC).

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 |
| Backend | Node.js + Express |
| Base de Datos | PostgreSQL 15 |
| Autenticación | JWT + Google Authenticator (TOTP) |
| Contenedores | Docker + Docker Compose |
| Seguridad | bcrypt, otplib, JWT |
| Servidor Web | Nginx |

---

## 🏗️ Arquitectura

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   React App     │────▶│  Node.js API    │────▶│  PostgreSQL DB  │
│   (Puerto 80)   │     │  (Puerto 3000)  │     │  (Puerto 5432)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
Frontend                 Backend               Base de Datos
Docker Container        Docker Container        Docker Container

---

## 🔐 Seguridad Implementada

### Autenticación
- ✅ **JWT** — Tokens seguros con expiración de 8 horas
- ✅ **MFA con Google Authenticator** — Código TOTP de 6 dígitos cada 30 segundos
- ✅ **bcrypt** — Hash de contraseñas con salt rounds 10
- ✅ **Bloqueo de cuenta** — Tras 5 intentos fallidos consecutivos
- ✅ **Validación de contraseña** — Mínimo 8 caracteres, mayúscula, número y carácter especial

### Flujo de Autenticación

Usuario ingresa email + contraseña
Sistema valida credenciales
Sistema solicita código MFA
Usuario ingresa código de Google Authenticator
Sistema verifica TOTP (máximo 3 intentos)
Acceso concedido + Token JWT generado ✅


### Autorización
- ✅ **RBAC** — Control de acceso basado en roles
- ✅ **ABAC** — Control de acceso basado en atributos (tienda, premium)
- ✅ **Middlewares** — Verificación en cada endpoint protegido

---

## 👥 Roles del Sistema

| Rol | Productos | Roles | Usuarios | Restricciones |
|-----|-----------|-------|----------|---------------|
| **Admin** | CRUD completo | CRUD completo | Ver + asignar roles | Ninguna |
| **Gerente** | CRUD de su tienda | Solo lectura | Solo lectura | No elimina productos premium |
| **Empleado** | Solo actualiza stock | Solo lectura | Solo lectura | No crea productos premium |
| **Auditor** | Solo lectura | Solo lectura | Solo lectura | Sin modificaciones |

### Reglas ABAC
SELECT  → Admin y Auditor ven todo | Gerente y Empleado solo su tienda
INSERT  → Admin cualquier tienda | Gerente su tienda | Empleado solo no-premium
UPDATE  → Admin todo | Gerente su tienda (sin categoría) | Empleado solo stock
DELETE  → Admin todo | Gerente no-premium de su tienda | Empleado y Auditor sin acceso

---

## 🚀 Instalación

### Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2) en tu celular

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/Mayela3018/techstore-inventario.git
cd techstore-inventario
```

**2. Levantar con Docker**
```bash
docker-compose up --build
```

**3. Abrir en el navegador**
http://localhost

---

## 💻 Uso

### Primer uso — Registro
1. Ir a `http://localhost`
2. Clic en **"Regístrate"**
3. Completar el formulario
4. Escanear el **código QR** con Google Authenticator
5. Clic en **"Ya escaneé el QR → Ir al Login"**

### Login
1. Ingresar email y contraseña
2. Abrir Google Authenticator
3. Ingresar el código de 6 dígitos
4. ✅ Acceso concedido

### Casos de Prueba

**Escenario 1 — Login con MFA**
Email: gerente@techstore.com
Contraseña correcta → Solicitar código MFA
Código correcto → Acceso concedido ✅

**Escenario 2 — RBAC (intento no autorizado)**
Usuario: empleado@techstore.com
Acción: Crear nuevo rol
Resultado: "Acceso denegado" ❌

**Escenario 3 — ABAC (Gerente modifica producto)**
Usuario: gerente_lima@techstore.com (Tienda Lima)
Producto: Laptop HP (Tienda Lima, Premium: true)
Acción: UPDATE precio → Permitido ✅

**Escenario 4 — ABAC (Empleado intenta eliminar)**
Usuario: empleado@techstore.com
Producto: Mouse Logitech (su tienda)
Acción: DELETE → Denegado ❌

---

## 📁 Estructura del Proyecto
techstore/
│
├── docker-compose.yml
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── db.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   └── rbac.middleware.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── roles.controller.js
│       │   ├── usuarios.controller.js
│       │   └── productos.controller.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── roles.routes.js
│       │   ├── usuarios.routes.js
│       │   └── productos.routes.js
│       └── utils/
│           ├── mfa.utils.js
│           └── policy-engine.js
│
└── frontend/
├── Dockerfile
├── nginx.conf
├── package.json
└── src/
├── App.js
├── index.css
├── api.js
└── pages/
├── Login.jsx
├── Dashboard.jsx
├── Roles.jsx
├── Usuarios.jsx
└── Productos.jsx

---

## 👨‍💻 Autor

**Mayela Ticona**
Desarrollo de Soluciones en la Nube 

---

<div align="center">
Desarrollado con ❤️ usando Docker, React, Node.js y PostgreSQL
</div>
