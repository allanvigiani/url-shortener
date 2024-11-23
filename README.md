# Teste Técnico - Encurtador de URL![version](https://img.shields.io/badge/version-1.1-blue)

## Realizador do teste.

- Allan Vigiani - vigianiallan@gmail.com

### Tecnologias utilizadas.

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-6DA55F?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

### Modelagem do banco de dados.

![Modelagem](./extras/image.png)

## Collections.

* O projeto está disponível na AWS, tendo isso em vista, estarei disponibilizando a collection onde está as urls localhost e AWS.
[Collection JSON](./extras/collection.json)

## Como rodar o projeto.

Obs: É necessário ter o docker e o docker-compose instalado em sua máquina (Como instalar: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04-pt)

Clone o repositório:
```sh
git clone https://github.com/allanvigiani/url-shortener.git
```
Entre na pasta do projeto
```sh
cd url-shortener
```
Configure os .env do projeto e após isso inicialize o projeto utlizando o Docker Compose
```sh
sudo cp .env-example .env
sudo docker-compose build --no-cache
sudo docker-compose up
```

Recomendação a ser utilizada no .env
```sh
API_PORT_USERS=3000
API_PORT_URL=3001

AUTH_SECRET=710B311021A9D8434553DA4750C32C37AA63C122F749869023D25E3BE3F92EB1
AUTH_EXPIRES_IN=7d

POSTGRES_SSL='false'
POSTGRES_URL="postgresql://urlshortener_owner:zjSv0tBMJg5e@ep-dry-shape-a5albbrl.us-east-2.aws.neon.tech/urlshortener?sslmode=require"

BASE_URL=http://localhost:3001/url

ELASTIC_APM_SECRET_TOKEN='YOUR_TOKEN'
ELASTIC_APM_SERVER_URL='TOUR_URL'
ELASTIC_APM_ENVIRONMENT='development'
ELASTIC_APM_SERVICE_NAME='shortener_url'
```

## Como configurar o Elastic
- Criar uma conta em: https://www.elastic.co/pt/
- Criar um novo deployment
- Acessar o deployment criado
- Clicar no componente de Obersabilidade
- Criar um novo serviço APM, nesta etapa ele concederá todas as credencias necessárias para configurar no .env

## Pontos futuros para melhorias e novas funcionalidades.

- Validação para detecção de links maliciosos.
- Relatório de acessos de um determinado link para o criador.
- Cache utilizando REDIS para armazenamento de token e realização de login automãtico.
- Implementação de Logs utilizando New Relic para observabilidade.
- Utilização de filas de processamento, como o RabbitMQ, para tirar a sobrecarga da tabela URLS.
- Utilização também de filas de processamento para processar uma função de incrementação de clicks na URL encurtada.
- COntrução de uma pipeline de entrega contínua.

## Pontos futuros para melhorar a escalabilidade horizontal.

- Utilização de loadbalancers para a distribuição de acessos.
- Utilização de ferramentas para o monitoramento de desempenho como logs utilizando a New Relic ou Grafana e Prometheus para infraestrutura.


