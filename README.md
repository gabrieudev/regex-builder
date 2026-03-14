<h1 align="center" style="font-weight: bold;">Regex Builder</h1>

<div align="center">
    <img src="./apps/client/public/logo.png" width="200" style="padding: 16px;">
</div>

<p align="center">
  <img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white" alt="Spring">
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white" alt="Hibernate">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="NextJS">
  <img src="https://img.shields.io/badge/shadcn/ui-%23000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT">
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">
</p>

<p align="center">
 <a href="#estrutura">Estrutura do projeto</a> • 
 <a href="#inicio">Primeiros Passos</a> • 
 <a href="#interacao">Interação</a> •
 <a href="#contribuir">Contribuir</a>
</p>

<p align="center">
  <b>Regex Builder é uma aplicação que oferece um ambiente visual interativo para criar, testar e gerenciar expressões regulares. Com um runner integrado que exibe correspondências em tempo real, os usuários podem validar padrões contra textos de exemplo, visualizar grupos de captura e entender a lógica por trás de cada regex através de explicações automáticas. O projeto inclui um sistema completo de autenticação (cadastro, login, verificação de e-mail) e permite que cada usuário organize suas expressões favoritas em uma biblioteca pessoal. A interface é totalmente responsiva, com animações suaves e componentes acessíveis, proporcionando uma experiência fluida tanto para iniciantes quanto para desenvolvedores experientes que desejam dominar a arte das expressões regulares.
  </b>
</p>

<h2 id="estrutura">📂 Estrutura do projeto</h2>

```yaml
├── apps/
│   ├── docs/     # Documentação (Fumadocs + Next.js)
│   ├── client/   # Projeto web (TypeScript + Next.js)
│   └── server/   # Projeto backend (Java + Spring)
```

<h2 id="inicio">🚀 Primeiros Passos</h2>

<h3>Pré-requisitos</h3>

- [Git](https://git-scm.com/downloads)
- [JDK (Java Development Kit)](https://openjdk.org/install/)
- [Maven](https://maven.apache.org/download.cgi)
- [Node](https://nodejs.org/en/download?utm_source=chatgpt.com)
- [Python](https://www.python.org/downloads/)
- [Banco de dados PostgreSQL](https://www.postgresql.org/download/)

<h3>Clonando</h3>

```bash
git clone https://github.com/gabrieudev/regex-builder.git
```

<h3>Variáveis de Ambiente</h3>

Modifique os valores das variáveis no arquivo abaixo:

`/apps/server/src/main/resources/application.yml`

```bash
CLIENT_BASE_URL=<URL base do frontend>
SERVER_BASE_URL=<URL base do backend>
CORS_ORIGINS=<URLs base do backend e frontend, separados por vírgula>
DB_PASSWORD=<Senha do banco de dados>
DB_URL=<URL de conexão do banco de dados>
DB_USERNAME=<Username do banco de dados>
EMAIL_PASSWORD=<Código ou senha para envio de emails>
EMAIL_USERNAME=<Username ou email para envio de emails>
GITHUB_CLIENT_ID=<Client ID do GitHub para login social>
GITHUB_CLIENT_SECRET=<Client Secret do GitHub para login social>
GOOGLE_CLIENT_ID=<Client ID do Google para login social>
GOOGLE_CLIENT_SECRET=<Client ID do GitHub para login social>
JWT_EXPIRATION=<Tempo de validade do JWT (ms)>
JWT_SECRET=<String de segredo do JWT (base64)>
OAUTH2_REDIRECT_URIS=<Padrão: {URL base frontend}/oauth2/redirect>
```

Crie um arquivo `.env` em `/apps/web`

```bash
NEXT_PUBLIC_API_BASE_URL=<URL base do backend>
NEXT_PUBLIC_BASE_URL=<URL base do frontend>
NEXT_PUBLIC_OAUTH2_REDIRECT_URI=<Padrão: {URL base frontend}/oauth2/redirect>
```

<h3>Inicializando</h3>

Execute o seguinte comando na raiz do projeto:

```bash
npm run dev
```

<h2 id="interacao">🌐 Interação</h2>

Agora, você poderá interagir com a aplicação das seguintes formas:

- Interface: [http://localhost:3001](http://localhost:3001)
- Servidor: [http://localhost:3000](http://localhost:3000)
- Documentação: [http://localhost:4000](http://localhost:4000)

<h2 id="contribuir">📫 Contribuir</h2>

Contribuições são muito bem vindas! Caso queira contribuir, faça um fork do repositório e crie um pull request.

1. `git clone https://github.com/gabrieudev/regex-builder.git`
2. `git checkout -b feature/NOME`
3. Siga os padrões de commits.
4. Abra um Pull Request explicando o problema resolvido ou a funcionalidade desenvolvida. Se houver, anexe screenshots das modificações visuais e aguarde a revisão!