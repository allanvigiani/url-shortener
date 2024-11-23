import ElasticApmNode from 'elastic-apm-node';
import dotenv from 'dotenv';

dotenv.config();

export class ApmService{
    startElasticService() {
        try {
            ElasticApmNode.start({
                serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
                serverUrl: process.env.ELASTIC_APM_SERVER_URL,
                secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
                environment: process.env.ELASTIC_APM_ENVIRONMENT,
            });
        } catch (error: unknown) {
            const errorMessage = (error as Error).message;
            console.log(`Não foi possível inciar o serviço de APM: ${errorMessage}`);
        }
    }
}