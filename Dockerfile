FROM node:16-alpine
WORKDIR /melbeez-admintool
ENV PATH="/melbeez-admintool/node_modules/.bin:$PATH"
COPY  package.json ./
COPY  package-lock.json ./
RUN npm install
COPY  .env ./
COPY . .
EXPOSE 3005
CMD ["npm", "run", "start"]