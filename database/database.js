import pool from './supabase.js';
// script para crear la base de datos
function crearBaseDatos() {
    pool.query(`
        CREATE TABLE "usuarios"(
            "id" BIGSERIAL PRIMARY KEY,
            "nombre" VARCHAR(50) NOT NULL,
            "contrasena" VARCHAR(40) NOT NULL,
            "correo" VARCHAR(60) NOT NULL,
            "celular" VARCHAR(8) NOT NULL,
            "ciudad" VARCHAR(20) NOT NULL,
            "puntaje" BIGINT NOT NULL
        );

        CREATE TABLE "personajes"(
            "id" BIGSERIAL PRIMARY KEY,
            "nombre" VARCHAR(50) NOT NULL,
            "descripcion" TEXT NOT NULL,
            "imagen" TEXT NOT NULL,
            "puntaje" BIGINT NOT NULL
        );

        CREATE TABLE "personajePorUsuario"(
            "idUsuario" BIGINT NOT NULL,
            "idPersonaje" BIGINT NOT NULL,
            "adivinado" BOOLEAN NOT NULL
        );

        CREATE TABLE "cuestionario"(
            "id" BIGSERIAL PRIMARY KEY,
            "titulo" VARCHAR(50) NOT NULL,
            "descripcion" TEXT NOT NULL,
            "tipo" VARCHAR(50) NOT NULL,
            "puntaje" BIGINT NOT NULL
        );

        CREATE TABLE "cuest_preguntas"(
            "id" BIGSERIAL PRIMARY KEY,
            "idCuestionario" BIGINT NOT NULL,
            "pregunta" TEXT NOT NULL
        );

        CREATE TABLE "cuest_respuesta"(
            "id" BIGSERIAL PRIMARY KEY,
            "idPregunta" BIGINT NOT NULL,
            "respuesta" TEXT NOT NULL,
            "es_correcta" BOOLEAN NOT NULL
        );

        CREATE TABLE "cuestionarioPorUsuario"(
            "idUsuario" BIGINT NOT NULL,
            "idCuestionario" BIGINT NOT NULL,
            "cant_correcta" BIGINT NOT NULL
        );

        CREATE TABLE "copla"(
            "id" BIGSERIAL PRIMARY KEY,
            "link_video" TEXT NOT NULL
        );

        CREATE TABLE "copla_preguntas"(
            "id" BIGSERIAL PRIMARY KEY,
            "idCopla" BIGINT NOT NULL,
            "pregunta" TEXT NOT NULL
        );

        CREATE TABLE "copla_respuestas"(
            "id" BIGSERIAL PRIMARY KEY,
            "idPregunta" BIGINT NOT NULL,
            "texto_respuesta" TEXT NOT NULL,
            "es_correcta" BOOLEAN NOT NULL
        );

        CREATE TABLE "coplaPorUsuario"(
            "idUsuario" BIGINT NOT NULL,
            "idCopla" BIGINT NOT NULL,
            "completado" BOOLEAN NOT NULL,
            "puntaje" BIGINT NOT NULL
        );

        CREATE TABLE "post"(
            "id" BIGSERIAL PRIMARY KEY,
            "idUsuario" BIGINT NOT NULL,
            "descripcion" TEXT NOT NULL,
            "link_archivo" TEXT NOT NULL,
            "tipo" VARCHAR(5) NOT NULL,
            "fecha_creación" DATE NOT NULL
        );

        CREATE TABLE "reacciones"(
            "id" BIGSERIAL PRIMARY KEY,
            "idPost" BIGINT NOT NULL,
            "idUsuario" BIGINT NOT NULL,
            "fecha" DATE NOT NULL
        );

        CREATE TABLE "comentarios"(
            "id" BIGSERIAL PRIMARY KEY,
            "idUsuario" BIGINT NOT NULL,
            "idPost" BIGINT NOT NULL,
            "texto" TEXT NOT NULL,
            "fecha_creacion" DATE NOT NULL
        );

        CREATE TABLE "compartidos"(
            "id" BIGSERIAL PRIMARY KEY,
            "idPost" BIGINT NOT NULL,
            "idUsuario" BIGINT NOT NULL,
            "fecha" DATE NOT NULL
        );

        -- Claves foráneas
        ALTER TABLE "cuest_respuesta" ADD CONSTRAINT "cuest_respuesta_idpregunta_foreign" FOREIGN KEY("idPregunta") REFERENCES "cuest_preguntas"("id");
        ALTER TABLE "copla_respuestas" ADD CONSTRAINT "copla_respuestas_idpregunta_foreign" FOREIGN KEY("idPregunta") REFERENCES "copla_preguntas"("id");
        ALTER TABLE "copla_preguntas" ADD CONSTRAINT "copla_preguntas_idcopla_foreign" FOREIGN KEY("idCopla") REFERENCES "copla"("id");
        ALTER TABLE "coplaPorUsuario" ADD CONSTRAINT "coplaporusuario_idusuario_foreign" FOREIGN KEY("idUsuario") REFERENCES "usuarios"("id");
        ALTER TABLE "compartidos" ADD CONSTRAINT "compartidos_idusuario_foreign" FOREIGN KEY("idUsuario") REFERENCES "usuarios"("id");
        ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_idusuario_foreign" FOREIGN KEY("idUsuario") REFERENCES "usuarios"("id");
        ALTER TABLE "post" ADD CONSTRAINT "post_idusuario_foreign" FOREIGN KEY("idUsuario") REFERENCES "usuarios"("id");
        ALTER TABLE "coplaPorUsuario" ADD CONSTRAINT "coplaporusuario_idcopla_foreign" FOREIGN KEY("idCopla") REFERENCES "copla"("id");
        ALTER TABLE "cuestionarioPorUsuario" ADD CONSTRAINT "cuestionarioporusuario_idcuestionario_foreign" FOREIGN KEY("idCuestionario") REFERENCES "cuestionario"("id");
        ALTER TABLE "personajePorUsuario" ADD CONSTRAINT "personajeporusuario_idusuario_foreign" FOREIGN KEY("idUsuario") REFERENCES "usuarios"("id");
        ALTER TABLE "cuestionarioPorUsuario" ADD CONSTRAINT "cuestionarioporusuario_idusuario_foreign" FOREIGN KEY("idUsuario") REFERENCES "usuarios"("id");
        ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_idpost_foreign" FOREIGN KEY("idPost") REFERENCES "post"("id");
        ALTER TABLE "reacciones" ADD CONSTRAINT "reacciones_idpost_foreign" FOREIGN KEY("idPost") REFERENCES "post"("id");
        ALTER TABLE "compartidos" ADD CONSTRAINT "compartidos_idpost_foreign" FOREIGN KEY("idPost") REFERENCES "post"("id");
        ALTER TABLE "personajePorUsuario" ADD CONSTRAINT "personajeporusuario_idpersonaje_foreign" FOREIGN KEY("idPersonaje") REFERENCES "personajes"("id");
        ALTER TABLE "cuest_preguntas" ADD CONSTRAINT "cuest_preguntas_idcuestionario_foreign" FOREIGN KEY("idCuestionario") REFERENCES "cuestionario"("id");
    `)
    .then(() => {
        console.log('Base de datos y tablas creadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error al crear la base de datos y tablas:', error);
        process.exit(1);
    });
}

crearBaseDatos();
