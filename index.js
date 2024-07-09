require('dotenv').config();
const fs = require('fs');
const { Sequelize } = require('sequelize');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	port: DB_PORT,
	dialect: 'mysql',
	logging: false,
});

function generarLetraAleatoria() {
	const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const indiceAleatorio = Math.floor(Math.random() * abecedario.length);
	const letraAleatoria = abecedario.charAt(indiceAleatorio);

	return letraAleatoria;
}

function obtenerNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function insertData(data, productId) {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

		// for (let item of data) {
		// 	const result = await sequelize.query(`
		// 		INSERT INTO wpq2_comments 
		// 		(comment_ID, comment_post_ID, comment_author, comment_author_email, comment_author_url, comment_author_IP, comment_date, comment_date_gmt, comment_content, comment_karma, comment_approved, comment_agent, comment_type, comment_parent, user_id) 
		// 		VALUES 
		// 		(NULL, '${productId}', '${item.nombre}', '', '', '', '2024-03-19 03:46:50', '2024-03-19 06:46:50', '${item.reseña}', '0', '1', '', 'review', '0', '0')
		// 	`);

		// 	await sequelize.query(`
		// 		INSERT INTO wpq2_commentmeta 
		// 		(meta_id, comment_id, meta_key, meta_value) 
		// 		VALUES 
		// 		(NULL, '${result[0]}', 'rating', '${item.calificacion}')
		// 	`);
		// }

		for (let item of data) {
			// Escapar comillas simples en la cadena de texto de la reseña
			const reseñaEscapada = item.reseña.replace(/'/g, "''");
		
			const result = await sequelize.query(`
				INSERT INTO wpq2_comments 
				(comment_ID, comment_post_ID, comment_author, comment_author_email, comment_author_url, comment_author_IP, comment_date, comment_date_gmt, comment_content, comment_karma, comment_approved, comment_agent, comment_type, comment_parent, user_id) 
				VALUES 
				(NULL, '${productId}', '${item.nombre}', '', '', '', '2024-03-19 03:46:50', '2024-03-19 06:46:50', '${reseñaEscapada}', '0', '1', '', 'review', '0', '0')
			`);
		
			await sequelize.query(`
				INSERT INTO wpq2_commentmeta 
				(meta_id, comment_id, meta_key, meta_value) 
				VALUES 
				(NULL, '${result[0]}', 'rating', '${item.calificacion}')
			`);
		}

        console.log('Data inserted successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

const productId = 22668;

fs.readFile('data.json', async (err, datosCrudos) => {
	if (err) throw err;
	const datos = JSON.parse(datosCrudos);

	await insertData(datos.reseñas, productId);
  
	console.log('Todos los datos han sido insertados correctamente.');
});
