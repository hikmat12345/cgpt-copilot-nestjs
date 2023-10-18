FROM node:v18.15.0
COPY . .
RUN npm install
EXPOSE 3000 
CMD ["npm", "run", "start:dev"]  