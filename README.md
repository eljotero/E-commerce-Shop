# E-commerce Shop Project

## Description
This is a full-stack e-commerce application built with modern technologies. The backend is built with the NestJS framework, a Node.js framework for building efficient and scalable server-side applications. The frontend is built with React, a popular JavaScript library for building user interfaces.

## Backend
The backend is located in the `backend` directory. It uses NestJS along with other libraries such as TypeORM for database interaction, Passport and JWT for authentication, and Helmet for security.

To run the backend, navigate to the `backend` directory and run the following commands:
```
npm install
npm start
```
## Frontend
The frontend is located in the `frontend` directory. It uses React along with Redux for state management, React Router for routing, and Axios for HTTP requests.

To run the frontend, navigate to the `frontend` directory and run the following commands:
```
npm install
npm start
```

## Docker and PostgreSQL

This project uses Docker to run a PostgreSQL database. The configuration for the Docker container is located in the [docker/compose.yml](backend/docker/compose.yml) file.

To start the Docker container, you need to have Docker installed on your machine. Once Docker is installed, navigate to the `backend` directory and run the following command:

```
sh docker-compose up
```
This will start a PostgreSQL database with the name SweetTreatsDB, accessible on port 5432. The username and password for the database are postgres and admin, respectively. 

## Testing
This project uses a combination of unit and end-to-end tests to ensure the quality and reliability of the codebase. The backend tests are located in the `backend/test` directory. They are written using Jest, a JavaScript Testing Framework.

To run the backend tests, navigate to the backend directory and run the following command:
```
npm run test
```
This will run all the unit tests in the project. If you want to run end-to-end tests, you can use the following command:
```
npm run test:e2e
```
To generate a coverage report, you can use the following command:
```
npm run test:cov
```

## License
This project is unlicensed and is for demonstration purposes only.

## Authors
This project was created by Szymon Wydmuch and Aleksander Janicki.

This project showcases our ability to build a full-stack application with modern technologies and best practices. I hope you find it interesting, and we look forward to discussing it further.