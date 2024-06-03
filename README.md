
# Todo-List

Simple todo list app using Nextjs 14.3.2




## Tech Stack

**Client:** React Query, Tailwind CSS, Shadcn, Tiptap Editor

**Server:** NextJS

**DB & Orm:** Drizzle ORM, Neon db


## Run Locally

### Clone the project

```bash
  git clone https://github.com/kyhchn/todo-list
```

### Go to the project directory

```bash
  cd todo-list
```

### Install dependencies

```bash
  npm install
```
### Setup local env

To run this project, you will need to add the following environment variables to your .env.local file or just copy from .env.example

```bash
  cp .env.example .env.local
```

`NEON_DATABASE_URL`

`NEXTAUTH_SECRET` -> generate on your machine `$ openssl rand -base64 32`

Google Credential

`GOOGLE_CLIENT_ID`

`GOOGLE_CLIENT_SECRET`

Github Credential

`GITHUB_ID`

`GITHUB_SECRET`

YOUR LOCAL ADDRESS `http://localhost:xxxx`

`NEXTAUTH_URL`

`LOCAL_URL`

### Migrate the DB
make sure drizzle-kit already installed
```bash
  npx drizzle-kit push
```

### Start the server

```bash
  npm run dev
```


## Demo

https://todo-list-theta-navy.vercel.app/
