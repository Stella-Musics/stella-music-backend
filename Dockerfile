FROM node:20.13.1
COPY . .
RUN rm -rf package-lock.json
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]