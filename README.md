![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Radix UI](https://img.shields.io/badge/radix%20ui-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

![](/readme/demo.gif)

**Ikna** is an learning web application based on flashcards and [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition), akin to [Anki](https://apps.ankiweb.net/). It provides a modern web interface with a self-hosting server to create and review cards for learning languages, preparing for exams, or anything else that requires memorizing and long-term retention.

## Prerequisites

- [Node.js](https://nodejs.org/en/download) (v22.13.0 or later)
- [MySQL](https://dev.mysql.com/downloads/installer/) (v.8.0.41 or later)

# Installation

Copy the source code in a folder and make it your working directory. Then, set up the necessary packages in the client folder with `npm init` and run the app.

```sh
cd .\client\
npm init
npm run dev
```

In a separate terminal, innitizlize server packages, then run it.

```sh
cd .\server\
npm init
node app.mjs
```

Now you should be able to access the web interface by `http://localhost:5173/`.

## Configuration

> [!IMPORTANT]
> There are two `config.EXAMPLE.json` files in `/client` and `/server` folders accordingly. Make sure to rename both files to `config.json`.

### Client config

- `VITE_SERVER_BASE_URL` — URL of the server API. `http://127.0.0.1:3000/api` by default.

### Server config

- `DB_HOST` — domain name to access database. If the database is hosted on the same machine as the server, it should stay unchanged. `localhost` by default.
- `DB_PORT` — port to access database. `3306` by default.
- `DB_USER` — MySQL username to be used to access the app's database. `root` by default.
- `DB_PASSWORD` — MySQL password for the chosen user. Empty by default.
- `DB_NAME` — MySQL database name. `ikna` by default.
- `TABLE_CLEANUP` **(testing only)** — when set `true`, the database tables will be truncated on every run. `false` by default.
- `SECRET_KEY_SIZE` — the number of random bytes that will be used to sign authentification tokens. Those bytes are saved as `secret.key` on the first run. `128` by default.
- `JWT_EXPIRATION_TIME` - the time allowed for tokens to stay valid before expiring. `1d` by default.
