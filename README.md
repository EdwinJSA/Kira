# 🇳🇮 Proyecto Kira

**Proyecto Kira** es una aplicación web dedicada a la **cultura nicaragüense**, cuyo propósito es rescatar y difundir las costumbres y tradiciones que nos representan.  

La plataforma contará con una modalidad **interactiva** en la que, a medida que los usuarios participen y completen actividades, acumularán puntos que reflejarán su progreso y aprendizaje.  

Además, incluirá un sistema de **aula digital** que permitirá a los profesores asignar módulos como tareas, fomentando así el uso educativo de la plataforma.

--- 

## ✨ Características principales

- Difusión de la cultura nicaragüense.  
- Modalidad interactiva con sistema de puntos.  
- Plataforma educativa con módulos asignados por profesores.  
- Experiencia gamificada para estudiantes y usuarios.  

---

## 🛠️ Tecnologías utilizadas

- **Frontend**:  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML" width="40" height="40"/>  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="TailwindCSS" width="40" height="40"/>  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="40" height="40"/>  

- **Backend**:  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="40" height="40"/>  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express.js" width="40" height="40"/>  

- **Base de datos**:  
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="40" height="40"/>  


---

## 📋 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:  

- [Node.js](https://nodejs.org/) (v14 o superior)  
- [npm](https://www.npmjs.com/) (incluido con Node.js)  
- [PostgreSQL](https://www.postgresql.org/)  

---

## ⚙️ Instalación

1. Clona este repositorio:  
   ```bash
   git clone https://github.com/tu-usuario/proyecto-kira.git
   cd proyecto-kira
   ```

2. Instala las independencias:
    ```bash
    npm install
    ```

3. Configura la base de datos en PostgreSQL y agrega tus credenciales en un archivo .env:
    ```bash
    DB_HOST=localhost
    DB_USER=tu_usuario
    DB_PASSWORD=tu_password
    DB_NAME=kira_db
    DB_PORT=5432
    ```

4. Para ejecutar en modo desarrollo:
    ```
    npm run dev
    ```

    **La aplicacion correra en 👉 http://localhost:3000**

## 📂 Estructura del proyecto
```bash 
    proyecto-kira/ 
    │ 
    ├── public/
    ├── src/ 
    │ ├── routes/
    │ ├── controllers/
    │ ├── models/
    │ └── app.js
    │ 
    ├── package.json
    ├── .env 
    └── README.md
```



