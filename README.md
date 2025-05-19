<!-- ============================================== -->
<!--      B E A U T I F U L   R E A D M E          -->
<!-- ============================================== -->

<!-- Badges -->
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0-brightgreen.svg)](https://spring.io/projects/spring-boot)  
[![Angular](https://img.shields.io/badge/Angular-15-red.svg)](https://angular.io/)  
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  
[![Last commit](https://img.shields.io/github/last-commit/Reedsy2407/portal_laboral.svg)](https://github.com/Reedsy2407/portal_laboral/commits/main)  

---

# 📌 Portal Laboral (Job Portal)

**Una plataforma web de publicación y postulación de empleos**, con:

- **Back-end** en **Spring Boot 3.x**  
  - Seguridad con **Spring Security** y cookies JWT  
  - Persistencia con **Spring Data JPA / Hibernate**  
  - API REST documentada y probada con Postman  
- **Front-end** en **Angular 15+**  
  - Rutas protegidas con guardias  
  - Formularios de registro, login, CRUD de vacantes  
- **Base de datos** en **MySQL**  
  - Esquema generado a partir de entidades JPA  
  - Relaciones, constraints y datos de ejemplo  

---

## 📂 Estructura del proyecto

```text
/
├── .gitignore
├── README.md
├── LICENSE
├── portal-laboral.API/                   ← Spring Boot REST API
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   ├── com/portal_laboral/portal_laboral/    ← Código fuente Java
│       │   │   │   ├── config/               ← Configuración de seguridad, CORS, JWT…
│       │   │   │   ├── controller/           ← Controladores REST (auth, ofertas, postulaciones, usuarios…)
│       │   │   │   ├── entity/               ← Entidades JPA mapeadas a MySQL
│       │   │   │   ├── repository/           ← Interfaces Spring Data JPA
│       │   │   │   ├── service/              ← Lógica de negocio
│       │   │   │   └── security/             ← Clases de filtro JWT, configuraciones de Spring Security
│       │   └── resources/
│       │       ├── application.properties    ← Cadena de conexión, configuración de JWT, CORS…
│       │       └── data.sql                  ← Scripts de datos de ejemplo (opcional)
│       └── test/
│
└── portal-laboral.UI/                    ← Angular SPA
    ├── angular.json
    ├── package.json
    └── src/
        ├── app/
        │   ├── entidades/         ← Modelos TypeScript (interfaces) que representan entidades JPA
        │   ├── footer/           ← Componente de pie de página
        │   ├── inicio/           ← Componente de página principal (home)
        │   ├── interceptors/     ← JWT Interceptor y otros interceptores HTTP
        │   ├── login/            ← Componentes y servicios de autenticación
        │   ├── nav-bar/          ← Componente de la barra de navegación
        │   ├── ofertas/          ← Componentes para CRUD y listado de ofertas de empleo
        │   ├── perfil/           ← Componentes de perfil de usuario (postulante / reclutador)
        │   ├── postulaciones/    ← Componentes para ver y gestionar postulaciones
        │   ├── reclutamiento/    ← Componentes específicos para reclutadores (crear vacantes, ver estadísticas…)
        │   ├── register/         ← Componentes de registro de usuario
        │   ├── servicios/        ← Servicios compartidos (API clients, guardias de ruta, utilidades)
        │   └── usuarios/         ← Componentes para gestión de usuarios (detalle, permisos, listado)
        │
        ├── assets/               ← Imágenes, estilos CSS globales, fuentes, etc.
        ├── environments/         ← Variables de entorno (dev, prod)
        ├── index.html            ← Página de entrada de la SPA
        ├── main.ts               ← Punto de arranque de Angular
        └── styles.css            ← Estilos globales de la aplicación


⚙️ Requisitos previos
Java 17+ y Maven

Node.js 16+ y npm

MySQL 8+

Postman o Imsomnia para probar endpoints


🚀 Instrucciones de Configuración
📁 1. Inicializar la base de datos MySQL
Abre MySQL Workbench (u otro cliente).

Ejecuta este script para crear la base de datos:

CREATE DATABASE dbPortalLaboral;

⚙️ 2. Configurar la API (Back-end)
Abre la carpeta portal-laboral.API/ en tu IDE favorito (IntelliJ, Eclipse o VS Code).

En src/main/resources/application.properties, reemplaza la configuración de conexión:

spring.datasource.url=jdbc:mysql://localhost:3306/dbPortalLaboral
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA

# JWT y configuración adicional
jwt.secret=MiSecretoSuperSecreto
jwt.expiration=86400000

🧩 3. Configurar la UI (Front-end)
Abre una terminal y navega a la carpeta del frontend:

cd portal-laboral.UI
Instala las dependencias de Node:

npm install
(Opcional) Asegúrate de que el archivo src/environments/environment.ts apunte a tu API:

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
