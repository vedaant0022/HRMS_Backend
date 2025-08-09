FROM node:20
RUN npm install -g nodemon
WORKDIR /app
COPY . .
RUN npm install -f
EXPOSE 3000
CMD ["npm","run","dev"]