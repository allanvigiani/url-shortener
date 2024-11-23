import usersApp from './users';
import urlApp from './url';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import { readFile } from 'fs/promises';
import { join } from 'path';
import { ApmService } from './observability/ApmService';

dotenv.config();

async function loadSwaggerDocs() {
	const filePath = join(__dirname, './swagger.json');
	const fileContent = await readFile(filePath, 'utf-8');
	return JSON.parse(fileContent);
}

async function startServer() {
	new ApmService().startElasticService();

	const swaggerJsonDocs = await loadSwaggerDocs();
	usersApp.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(swaggerJsonDocs));

	const PORT_USERS = process.env.API_PORT_USERS || 3000;
	const PORT_URLS = process.env.API_PORT_URL || 3001;

	usersApp.listen(PORT_USERS, () => {
		console.log(`Servidor de usuários rodando na porta ${PORT_USERS}`);
	});

	urlApp.listen(PORT_URLS, () => {
		console.log(`Servidor de URLs rodando na porta ${PORT_URLS}`);
	});
}

startServer();
