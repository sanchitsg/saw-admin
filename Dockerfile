FROM node:20.15.0

COPY . /usr/src/saw-admin

WORKDIR /usr/src/saw-admin

RUN npm install

# Expose the port that the application listens on.
EXPOSE 8090

CMD ["npm", "run", "dev"]