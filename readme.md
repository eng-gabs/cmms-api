# Tractian Backend Challenge API

The purpose of this API is to fulfill Tractian's challenge demands. More information can be found on []

## Testing

### Production:

This project has been deployed for testing purposes on [] and can be tested by anyone.

### Postman:

If you use postman for testing you can download the [json file] in the root directory to test it faster.

### Integration Tests:

Also, every endpoint has an integration test written that can be found on src/routes/\__tests_\_ . If you want, you can clone the project, run 'npm install' and then 'npm run test' to see it in action.

## API Documentation

The endpoints are well documented using SwaggerUI available on [this link](https://cmms-api.herokuapp.com/docs/).

[ ] Detalhar todos os endpoints

## How the project is structured

This project has been organized trying to keep up with Clean Code best practices.
The src folder holds all project files. Configurations and readme are on root.
The 6 folders inside src and their responsability are listed below:

- routes: api endpoints
- controllers: presentation phase
- services: business logic
- db: data access layer (db connection and data access objects)
- models: entity models (mongoose schema)
- middlewares: contains only the error middleware which is responsible for handling errors globally for the api.

Also there is the index file inside src which initiate the server

Inside each folder there is a file for each entity of the model.

## Packages

### Dependencies

- cors: enabling cors config to express
- dotenv: configuring environment variables
- express: express server
- express-async-errors: library to enable async error handling globally with express
- mongoose: Database (mongoDB) ORM and connection

### Development dependencies

- chai: assertion testing library
- chai-http: chai plugin to enable http requests testing
- cross-env: environment selection
- mocha: testing library
- nodemon: enables hot-reload when saving project locally
- ts-node: enables typescript testing files
- typescript: project language

## Disclaimers

## Future Improvements

## Thanks

I want to thank Tractian's team for creating this challenge and giving this opportunity. I learned a lot! =)

# todo

[x] Melhorar testes de integração para eles testarem updates e deletes em cascata das relações
[x] Refatorar para passar nos testes com Cascade como exemplo:
Deletar empresa deve deletar todas as units e assets
Deletar unit deve deletar todos os assets

[ ] Tipagem dos body das requisições -> melhorar input do body e tipagem do controller (talvez fazer uma classe pro controller)
[x] Bubble up de erros -> assistir videos no youtube primeiro

Router + Controller - Apresentação (API)

UseCase - Regra de Negócio

Repository - Conexão com BD - ORM - cascades, updates, creates e reads
