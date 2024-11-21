import usersApp from './users';
import urlApp from './url';
import dotenv from 'dotenv';

dotenv.config();

const PORT_USERS = process.env.API_PORT_USERS || 3000;
const PORT_URLS = process.env.API_PORT_URL || 3001;

usersApp.listen(PORT_USERS, () => {
	console.log(`Servidor de usuários rodando na porta ${PORT_USERS}`);
});

urlApp.listen(PORT_URLS, () => {
	console.log(`Servidor de URLs rodando na porta ${PORT_URLS}`);
});
