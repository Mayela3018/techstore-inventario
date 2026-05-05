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
