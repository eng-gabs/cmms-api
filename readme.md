# Tractian Backend Challenge API.

The purpose of this API is to fulfill Tractian's challenge demands. More information can be found on []

## Testing

### Production:

This project has been deployed for testing purposes on [] and can be tested by anyone.

### Postman:

If you use postman for testing you can download the [json file] in the root directory to test it faster.

### Integration Tests:

Also, every endpoint has an integration test written that can be found on src/routes/\__tests_\_ . If you want, you can clone the project, run 'npm install' and then 'npm run test' to see it in action.

## API Documentation

[ ] Detalhar todos os endpoints

## How the project is structured

This project has been organized trying to keep up with Clean Code best practices.
The src folder holds all project files. Configurations and readme are on root.
There are 5 main folders: _routes_, _controllers_, _services_, _db_ and _models_. Each one is responsible, respectly for: routes, presentation phase, business logic, data access and models (schema).
Inside each folder there is a file for each entity of the model.

There is also a _middlewares_ folder that contains only the error middleware which is responsible for handling errors globally for the api.

## Disclaimers

## Future Improvements

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
