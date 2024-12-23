FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache python3 make g++ 

RUN npm install

COPY . .

ENV PATH="./node_modules/.bin:$PATH"

EXPOSE 3000

CMD ["npm", "run", "dev"]
