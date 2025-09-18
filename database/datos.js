import pool from './supabase.js';

async function insertarUsuarios() {
    const query = `
        INSERT INTO "usuarios" (nombre, contrasena, correo, celular, ciudad, puntaje)
        VALUES 
        ('Juan Perez', '123', 'uno@example.com', '12345678', 'Managua', 100),
        ('Maria Gomez', '456', 'dos@example.com', '87654321', 'Masaya', 200),
        ('Carlos Ruiz', '789', 'tres@example.com', '34567890', 'Chinandega', 300),
        ('Luisa Ramirez', '321', 'cuatro@example.com', '98765432', 'Matagalpa', 400),
        ('Ana Torres', '654', 'cinco@example.com', '56789012', 'Rivas', 500),
        ('Pedro Flores', '987', 'seis@example.com', '01234567', 'Esteli', 600);
    `;
    await pool.query(query);
}

async function insertarPersonajes() {
    const query = `
        INSERT INTO "personajes" (nombre, descripcion, imagen, puntaje)
        VALUES 
        ('Ruben Darío', 'Poeta nicaragüense, máximo exponente del modernismo literario en lengua española.', 'https://i.pinimg.com/originals/b1/2a/4c/b12a4c127b5f689945387feb4d716f5c.jpg', 100),
        ('Augusto C. Sandino', 'Líder revolucionario nicaragüense que encabezó la resistencia contra la ocupación estadounidense en la década de 1930.', 'https://tse4.mm.bing.net/th/id/OIP.Ohi_QEVjp8hpSXEKHH0vYQHaKG?rs=1&pid=ImgDetMain&o=7&rm=3', 200),
        ('Violeta Barrios de Chamorro', 'Primera mujer presidenta de Nicaragua, gobernó de 1990 a 1997 y es conocida por su papel en la reconciliación nacional.', 'https://th.bing.com/th/id/R.fe5033a093acc4af25271b9a0fe0a7ff?rik=dBLKWp4v9IfQtw&riu=http%3a%2f%2fcentroamerica360.com%2fwp-content%2fuploads%2f2023%2f02%2fVioleta-Barrios3-1-1536x1024.jpg&ehk=Y0aQxjyBYz1Hfq280s6eA9OIU0Mg0ldt9agN803LRBk%3d&risl=&pid=ImgRaw&r=0', 300);
    `;
    await pool.query(query);
}

async function insertarCuestionarios() {
    const query = `
        INSERT INTO "cuestionario" (titulo, descripcion, tipo, puntaje)
        VALUES
        ('Historia de Nicaragua', 'Cuestionario sobre eventos y personajes históricos de Nicaragua.', 'Historia', 300),
        ('Geografía de Nicaragua', 'Cuestionario sobre la geografía física y política de Nicaragua.', 'Geografía', 300),
        ('Cultura Nicaragüense', 'Cuestionario sobre tradiciones, costumbres y cultura de Nicaragua.', 'Cultura', 300);
    `;
    await pool.query(query);
}

async function cuestionarioPreguntas() {
    const query = `
        INSERT INTO "cuest_preguntas" ("idCuestionario", "pregunta")
        VALUES
        -- Historia de Nicaragua
        (1, '¿Quién es conocido como el Príncipe de las Letras Castellanas en Nicaragua?'),
        (1, '¿En qué año se independizó Nicaragua de España?'),
        (1, '¿Quién fue el primer presidente de Nicaragua?'),
        (1, '¿Qué héroe nacional luchó contra la intervención estadounidense en 1927-1934?'),
        (1, '¿Qué país invadió Nicaragua en 1856 liderado por William Walker?'),
        (1, '¿Qué ocurrió el 23 de diciembre de 1972 en Managua?'),
        (1, '¿En qué año se fundó León, una de las primeras ciudades coloniales?'),
        (1, '¿Quién fue el líder de la resistencia indígena contra los españoles en Nicaragua?'),
        (1, '¿En qué año se abolió la esclavitud en Nicaragua?'),
        (1, '¿Qué tratado definió los límites entre Nicaragua y Costa Rica en 1858?'),

        -- Geografía de Nicaragua
        (2, '¿Cuál es la capital de Nicaragua?'),
        (2, '¿Cuál es el río más largo de Nicaragua?'),
        (2, '¿Cuál es el lago más grande de Nicaragua?'),
        (2, '¿Cómo se llama el único volcán activo en una isla de agua dulce en el mundo?'),
        (2, '¿Cuál es el punto más alto de Nicaragua?'),
        (2, '¿Qué océano se encuentra al oeste de Nicaragua?'),
        (2, '¿Qué país se encuentra al norte de Nicaragua?'),
        (2, '¿Cómo se llama la región autónoma ubicada en la costa caribe sur?'),
        (2, '¿Qué ciudad es conocida como la “Novia del Xolotlán”?'),
        (2, '¿Qué volcán forma parte de la ciudad de León y es famoso por deslizarse en tablas?'),

        -- Cultura Nicaragüense
        (3, '¿Cuál es la danza tradicional más conocida de Nicaragua?'),
        (3, '¿Qué festividad se celebra el 15 de septiembre en Nicaragua?'),
        (3, '¿Cuál es la comida nacional de Nicaragua?'),
        (3, '¿Cómo se llama la muñeca gigante que baila en León?'),
        (3, '¿Qué bebida típica se elabora a base de maíz y cacao?'),
        (3, '¿Qué poeta escribió “Azul”, una de las obras más famosas de la literatura nicaragüense?'),
        (3, '¿Qué instrumento musical es característico en el Palo de Mayo?'),
        (3, '¿Qué ciudad celebra la famosa Gritería el 7 de diciembre?'),
        (3, '¿Qué tipo de arte popular nicaragüense usa madera y colores brillantes para representar animales?'),
        (3, '¿Qué héroe popular es representado en el teatro de marionetas de la “Gigantona”?');
    `;
    await pool.query(query);
}

async function cuestionarioRespuestas() {
    const query = `
        INSERT INTO "cuest_respuesta" ("idPregunta", respuesta, es_correcta)
        VALUES
        -- Historia de Nicaragua (idPregunta 1-10)
        (1, 'Rubén Darío', true),
        (1, 'José Martí', false),
        (1, 'Salomón de la Selva', false),
        (1, 'Pablo Neruda', false),

        (2, '1821', true),
        (2, '1810', false),
        (2, '1824', false),
        (2, '1838', false),

        (3, 'Fruto Chamorro', true),
        (3, 'José Santos Zelaya', false),
        (3, 'Tomás Martínez', false),
        (3, 'Anastasio Somoza García', false),

        (4, 'Augusto C. Sandino', true),
        (4, 'Benjamín Zeledón', false),
        (4, 'Andrés Castro', false),
        (4, 'José Dolores Estrada', false),

        (5, 'Estados Unidos', false),
        (5, 'Inglaterra', false),
        (5, 'Costa Rica', false),
        (5, 'Filibusteros liderados por William Walker', true),

        (6, 'Un huracán', false),
        (6, 'Un terremoto', true),
        (6, 'Una guerra civil', false),
        (6, 'Una epidemia', false),

        (7, '1524', true),
        (7, '1538', false),
        (7, '1545', false),
        (7, '1502', false),

        (8, 'Diriangén', true),
        (8, 'Nicarao', false),
        (8, 'Enrique', false),
        (8, 'Cuauhtémoc', false),

        (9, '1824', false),
        (9, '1830', true),
        (9, '1812', false),
        (9, '1858', false),

        (10, 'Tratado Jerez-Cañas', true),
        (10, 'Tratado Bryan-Chamorro', false),
        (10, 'Tratado Clayton-Bulwer', false),
        (10, 'Tratado de París', false),

        -- Geografía de Nicaragua (idPregunta 11-20)
        (11, 'Managua', true),
        (11, 'Granada', false),
        (11, 'León', false),
        (11, 'Masaya', false),

        (12, 'Río San Juan', true),
        (12, 'Río Coco', false),
        (12, 'Río Tipitapa', false),
        (12, 'Río Grande de Matagalpa', false),

        (13, 'Lago Cocibolca', true),
        (13, 'Lago Xolotlán', false),
        (13, 'Lago Apanás', false),
        (13, 'Laguna de Tiscapa', false),

        (14, 'Volcán Concepción', true),
        (14, 'Volcán Mombacho', false),
        (14, 'Volcán Masaya', false),
        (14, 'Volcán Telica', false),

        (15, 'Mogotón', true),
        (15, 'Cerro Negro', false),
        (15, 'Maderas', false),
        (15, 'El Hoyo', false),

        (16, 'Océano Atlántico', false),
        (16, 'Océano Pacífico', true),
        (16, 'Mar Caribe', false),
        (16, 'Océano Índico', false),

        (17, 'Costa Rica', false),
        (17, 'El Salvador', false),
        (17, 'Honduras', true),
        (17, 'Panamá', false),

        (18, 'RAAN', false),
        (18, 'RACCS', true),
        (18, 'Bluefields', false),
        (18, 'Bilwi', false),

        (19, 'Granada', false),
        (19, 'León', false),
        (19, 'Tipitapa', false),
        (19, 'Managua', true),

        (20, 'Cerro Negro', true),
        (20, 'San Cristóbal', false),
        (20, 'Telica', false),
        (20, 'Momotombo', false),

        -- Cultura Nicaragüense (idPregunta 21-30)
        (21, 'El Güegüense', true),
        (21, 'El Macho Ratón', false),
        (21, 'El Toro Huaco', false),
        (21, 'La Vaquita', false),

        (22, 'Independencia de Centroamérica', true),
        (22, 'La Purísima', false),
        (22, 'San Sebastián', false),
        (22, 'San Jerónimo', false),

        (23, 'Gallo pinto', true),
        (23, 'Vaho', false),
        (23, 'Nacatamal', false),
        (23, 'Indio viejo', false),

        (24, 'La Gigantona', true),
        (24, 'La Yegüita', false),
        (24, 'El Enano Cabezón', false),
        (24, 'El Viejo y la Vieja', false),

        (25, 'Pinolillo', true),
        (25, 'Chicha bruja', false),
        (25, 'Tiste', false),
        (25, 'Chicha de maíz', false),

        (26, 'Rubén Darío', true),
        (26, 'José Coronel Urtecho', false),
        (26, 'Pablo Antonio Cuadra', false),
        (26, 'Ernesto Cardenal', false),

        (27, 'Marimba de arco', true),
        (27, 'Guitarra', false),
        (27, 'Bongó', false),
        (27, 'Cajón', false),

        (28, 'Granada', false),
        (28, 'León', true),
        (28, 'Chinandega', false),
        (28, 'Matagalpa', false),

        (29, 'Arte primitivista', true),
        (29, 'Arte rupestre', false),
        (29, 'Arte colonial', false),
        (29, 'Arte barroco', false),

        (30, 'Pedro Urdemales', false),
        (30, 'Juan Calavera', true),
        (30, 'Juan Cabezón', false),
        (30, 'Pedro El Brujo', false);
    `;
    await pool.query(query);
}

async function insertarCoplas() {
    const query = `
        INSERT INTO "copla" ("link_video")
        VALUES
        ('https://www.youtube.com/watch?v=il38Z6y6Qro&list=RDil38Z6y6Qro&start_radio=1');
    `;
    await pool.query(query);
}

async function coplasPreguntas() {
    const query = `
        INSERT INTO "copla_preguntas" ("idCopla", "pregunta")
        VALUES
        (1, 'Un viejito se orinó a la orilla de un barranco y del chorro que pegó le arrancó la vieja--'),
        (1, 'El amor de la soltera es como el arbol frutal que cuando da la cosecha papito arrima a todo animal'),
        (1, 'Dicen que van a echar juntas todas las suegras al mar, ¡Que barbaridad!, y la bandida de mi suegra ya esta aprendiendo...'),
        (1, 'Una vieja se orinó en el tronco de un papayo y un sapo se estaba riendo al ver a...'),
        (1, 'Una vieja se comió 20 pesos de aguacate, toda la noche pasó, sopla que sopla...'),
        (1, 'Cuando vayas a la mar no te metas a lo hondo, porque los pescados buscan donde esta lo...'),
        (1, 'Las ramas del tamarindo se juntan con las del coco, a mi no me gusta ese gringo, y a mi...'),
        (1, 'Mi no conozca tamarindo, mi no conozca coco, hartase una poco de mierda, y su mamá...'),
        (1, 'En el fondo de un estero suspiraba un lagarto, en su suspiro decía del mismo cuero salen...'),
        (1, 'En aquel cerro estaba un perro, le quitamos el cerro a la mierda...'),
        (1, 'Gallinita, gallinita que cuidas a tus polluelos, como no vas a cuidarlos, si cada hijo te costó...');
    `;
    await pool.query(query);
}

async function coplasRespuestas() {
    const query = `
        INSERT INTO "copla_respuestas" ("idPregunta", "texto_respuesta", "es_correcta")
        VALUES
        (1, 'un chancho', true),
        (2, 'todo animal', true),
        (3, 'a nadar', true),
        (4, 'su tocayo', true),
        (5, 'el petate', true),
        (6, 'más hediondo', true),
        (7, 'mi mamá', true),
        (8, 'un sompopo', true),
        (9, 'las coyundas', true),
        (10, 'el perro', true),
        (11, 'un huevo', true);
    `;
    await pool.query(query);
}

// Función principal para insertar todo en orden
async function insertarTodo() {
    try {
        await insertarUsuarios();
        await insertarPersonajes();
        await insertarCuestionarios();
        await cuestionarioPreguntas();
        await cuestionarioRespuestas();
        await insertarCoplas();
        await coplasPreguntas();
        await coplasRespuestas();
        console.log('Datos insertados correctamente');
    } catch (error) {
        console.error('Error al insertar datos:', error);
    } finally {
        pool.end();
    }
}

insertarTodo();
