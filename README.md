# Paggo OCR Case Backend

Este repositório contém o backend do Paggo OCR Case, desenvolvido com **NestJS**, **Prisma** e **Docker**.

## Tecnologias Utilizadas

- **NestJS** - Framework para a construção de APIs eficientes e escaláveis.
- **Prisma** - ORM moderno para banco de dados.
- **Docker** - Para conteinerização do ambiente de desenvolvimento e produção.

---

## Como Rodar o Projeto

### 1. Rodando com Docker (Modo Desenvolvimento)

O projeto possui um `Dockerfile.dev` e um `docker-compose.yml` para facilitar a execução no ambiente de desenvolvimento.

#### Passo a Passo:

1. Certifique-se de que possui o **Docker** e **Docker Compose** instalados.
2. No diretório raiz do projeto, execute:
   ```sh
   docker-compose --profile dev up
   ```

Isso iniciará o container do backend (**paggo-ocr-app-dev**) e do banco de dados PostgreSQL, conforme definido no `docker-compose.yml`.

#### Para acessar o container:

Caso precise acessar o shell dentro do container:

```sh
docker exec -it paggo-ocr-app-dev sh
```

#### Aplicando Migrations do Prisma:

Caso precise rodar as migrations manualmente:

```sh
docker exec -it paggo-ocr-app-dev npx prisma migrate dev
```

#### Encerrando os Containers:

Para parar a execução dos containers:

```sh
docker-compose down
```

---

### 2. Rodando Localmente (Sem Docker)

Caso queira rodar o projeto sem Docker, siga os passos abaixo:

#### Passo a Passo:

1. Certifique-se de ter **Node.js** (versão 16 ou superior) e **PostgreSQL** instalados.
2. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/paggo-ocr-case-backend.git
   cd paggo-ocr-case-backend
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Configure as variáveis de ambiente:
   - Crie o arquivo:
     ```sh
     touch .env.development
     ```
   - Edite o arquivo `.env.development` e configure as credenciais do banco de dados.
5. Execute a criação do Prisma Cliente e as migrations do Prisma:
   ```sh
   npx prisma generate
   npx prisma migrate dev
   ```
6. Inicie o servidor:
   ```sh
   npm run start:dev
   ```

O backend estará rodando em `http://localhost:3000` por padrão.

---

## Endpoints da API

### Autenticação

- **POST /auth/login**

  - **Descrição**: Realiza login e retorna um token JWT.
  - **Payload**:
    ```json
    {
      "email": "usuario@example.com",
      "password": "senha123"
    }
    ```
  - **Resposta**:
    ```json
    {
      "accessToken": "jwt_token"
    }
    ```

- **POST /auth/register**
  - **Descrição**: Registra um usuário e retorna um token JWT.
  - **Payload**:
    ```json
    {
      "name": "John Doe",
      "email": "usuario@example.com",
      "password": "senha123"
    }
    ```
  - **Resposta**:
    ```json
    {
      "accessToken": "jwt_token"
    }
    ```

### Usuários (Rotas Restritas apenas para usuários com a role 2 (Admin))

- **GET /users**

  - **Descrição**: Retorna a lista de usuários cadastrados.
  - **Resposta**:
    ```json
    [
      {
        "id": 1,
        "name": "João Silva",
        "email": "joao@example.com",
        "password": "$2b!10$Khv7s0jsH1WqjB4CruytjOzBcr4oW/DtST88W2ik&R7VRAF4z9axi",
        "createdAt": "2025-03-13T05:23:29.328Z",
        "updatedAt": "2025-03-13T05:23:29.328Z",
        "role": 1
      }
    ]
    ```

- **GET /users/:userId**

  - **Descrição**: Retorna um usuário cadastrado.
  - **Resposta**:
    ```json
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "$2b!10$Khv7s0jsH1WqjB4CruytjOzBcr4oW/DtST88W2ik&R7VRAF4z9axi",
      "createdAt": "2025-03-13T05:23:29.328Z",
      "updatedAt": "2025-03-13T05:23:29.328Z",
      "role": 1
    }
    ```

- **POST /users**

  - **Descrição**: Cria um usuário e retorna esse usuário criado.
  - **Payload**:
    ```json
    {
      "name": "John Doe",
      "email": "usuario@example.com",
      "password": "senha123",
      "role": 1
    }
    ```
  - **Resposta**:
    ```json
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "$2b!10$Khv7s0jsH1WqjB4CruytjOzBcr4oW/DtST88W2ik&R7VRAF4z9axi",
      "createdAt": "2025-03-13T05:23:29.328Z",
      "updatedAt": "2025-03-13T05:23:29.328Z",
      "role": 1
    }
    ```

- **PUT /users/:userId**

  - **Descrição**: Edita TODOS os campos de um usuário e retorna esse usuário editado.
  - **Payload**:
    ```json
    {
      "name": "John Doe",
      "email": "usuario@example.com",
      "password": "senha123",
      "role": 1
    }
    ```
  - **Resposta**:
    ```json
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "$2b!10$Khv7s0jsH1WqjB4CruytjOzBcr4oW/DtST88W2ik&R7VRAF4z9axi",
      "createdAt": "2025-03-13T05:23:29.328Z",
      "updatedAt": "2025-03-13T05:23:29.328Z",
      "role": 1
    }
    ```

- **PATCH /users/:userId**

  - **Descrição**: Edita APENAS UM ou MAIS campos de um usuário e retorna esse usuário editado.
  - **Payload**:
    ```json
    {
      "name": "John Doe",
      "email": "usuario@example.com"
    }
    ```
  - **Resposta**:
    ```json
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "$2b!10$Khv7s0jsH1WqjB4CruytjOzBcr4oW/DtST88W2ik&R7VRAF4z9axi",
      "createdAt": "2025-03-13T05:23:29.328Z",
      "updatedAt": "2025-03-13T05:23:29.328Z",
      "role": 1
    }
    ```

- **DELETE /users/:userId**

  - **Descrição**: Deleta o usuário com o id especificado e retorna o usuário deletado.
  - **Resposta**:
    ```json
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "$2b!10$Khv7s0jsH1WqjB4CruytjOzBcr4oW/DtST88W2ik&R7VRAF4z9axi",
      "createdAt": "2025-03-13T05:23:29.328Z",
      "updatedAt": "2025-03-13T05:23:29.328Z",
      "role": 1
    }
    ```

### Arquivos (Rotas Principais)

- **POST /file/upload**

  - **Descrição**: Envia um arquivo e grava no banco de dados.
  - **Payload**: Arquivo enviado como form-data

- **GET /file**

  - **Descrição**: Exibe todos os arquivos que o usuário fez upload.
  - **Resposta**:

    ```json
    [
      {
        "id": 1,
        "userId": 1,
        "fileName": "user_1_1741843949943_R.png",
        "originalName": "R.png",
        "path": "/app/storage/photos/user_1_1741843949943_R.png",
        "extractedText": "East Repair Inc. oo\n1912 Harvest Lane\nNew York,\n",
        "createdAt": "2025-03-13T05:32:30.956Z",
        "updatedAt": "2025-03-13T05:32:30.956Z"
      }
    ]
    ```

- **GET /file/download/:fileId**

  - **Descrição**: Rota para download do arquivo com o texto OCR extraído e interações com a LLM.
  - **Resposta**: arquivo .pdf

### Interações LLM

- **POST /llm**

  - **Descrição**: Envia um prompt para a GEMINI e retorna a interação realizada.
  - **Payload**:
    ```json
    {
      "prompt": "Fale sobre esse invoice",
      "fileId": 1
    }
    ```
  - **Resposta**:
    ```json
    {
      "id": 1,
      "fileId": 1,
      "question": "Fale sobre esse invoice",
      "answer": "This is an invoice from East Repair Inc. to John Smith for repair\n",
      "createdAt": "2025-03-13T05:38:35.620Z",
      "updatedAt": "2025-03-13T05:38:35.620Z"
    }
    ```

- **GET /llm/file/:fileId**

  - **Descrição**: Retorna todas as interações realizadas com a LLM.
  - **Resposta**:
    ```json
    [
      {
        "id": 1,
        "fileId": 1,
        "question": "Fale sobre esse invoice",
        "answer": "This is an invoice from East Repair Inc. to John Smith for repair\n",
        "createdAt": "2025-03-13T05:38:35.620Z",
        "updatedAt": "2025-03-13T05:38:35.620Z"
      }
    ]
    ```

---

## Possíveis Melhorias

Aqui estão algumas melhorias que podem ser implementadas no projeto:

1. **Cache de Respostas** - Implementar cache com Redis para melhorar a performance e reduzir chamadas repetitivas ao banco de dados.
2. **Testes Automatizados** - Criar uma suíte completa de testes unitários e de integração usando Jest e Supertest.
3. **Documentação da API** - Integrar Swagger para gerar documentação interativa da API.
4. **Monitoramento e Logging** - Adicionar integração com ferramentas como Winston para logging estruturado e Sentry para monitoramento de erros.
5. **Escalabilidade** - Melhorar a escalabilidade do backend, utilizando Kubernetes para orquestração dos containers.
6. **Melhoria no OCR** - Utilizar modelos de Machine Learning mais avançados para melhorar a precisão do reconhecimento de texto.

---

## Configuração do Arquivo `.env.development`

Para rodar o projeto corretamente, configure as seguintes variáveis no arquivo `.env.development`:

```env
# Configuração do Banco de Dados
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=paggo
DATABASE_URL=postgresql://postgres:admin@db:5432/paggo?schema=public

# Configuração de Segurança
JWT_SECRET=sua_chave_secreta
GEMINI_API_KEY=sua_chave_gemini

# Configuração de Email (Ethereal)
ETHEREAL_USER=seu_email@exemplo.com
ETHEREAL_PASSWORD=sua_senha_email
ETHEREAL_HOST=smtp.ethereal.email
ETHEREAL_PORT=587
ETHEREAL_PASS=sua_senha_email
```

---

## Estrutura do Projeto

```bash
paggo-ocr-case-backend/
│-- build/                  # Diretório de build
│-- dist/                   # Código transpilado do TypeScript
│-- node_modules/           # Dependências do projeto
│-- prisma/                 # Configuração do Prisma ORM
│-- src/                    # Código-fonte principal
│   ├── auth/               # Módulo de autenticação
│   ├── decorators/         # Decoradores reutilizáveis
│   ├── enums/              # Definição de enums
│   ├── file/               # Manipulação de arquivos
│   ├── guards/             # Guardas de rota
│   ├── llm/                # Integração com modelos de linguagem
│   ├── ocr/                # Processamento OCR
│   ├── prisma/             # Configuração adicional do Prisma
│   ├── templates/          # Templates para emails e respostas
│   ├── user/               # Módulo de usuários
│   ├── app.controller.ts   # Controlador principal
│   ├── app.module.ts       # Módulo raiz
│   ├── app.service.ts      # Serviço principal
│   ├── main.ts             # Arquivo de inicialização
│-- storage/                # Diretório de armazenamento
│-- .dockerignore           # Arquivos ignorados pelo Docker
│-- .env.development        # Configuração específica para ambiente de desenvolvimento
│-- .env.production         # Configuração específica para produção
│-- .gitignore              # Arquivos ignorados pelo Git
│-- .prettierrc             # Configuração do Prettier
│-- docker-compose.yml      # Docker Compose para ambiente dev
│-- Dockerfile.dev          # Dockerfile para desenvolvimento
│-- Dockerfile.prod         # Dockerfile para produção
│-- eng.traineddata         # Modelo treinado para OCR (inglês)
│-- por.traineddata         # Modelo treinado para OCR (português)
│-- eslint.config.mjs       # Configuração do ESLint
│-- package.json            # Dependências e scripts npm
│-- package-lock.json       # Lockfile do npm
│-- README.md               # Documentação do projeto
```

---

## Contato

Caso tenha dúvidas ou sugestões, entre em contato pelo email [guisilveira.cout@gmail.com](mailto:guisilveira.cout@gmail.com) ou via GitHub Issues.

---

Projeto desenvolvido por Guilherme Silveira.
