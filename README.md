![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

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

> [!IMPORTANT] Example configs
> There are two `config.EXAMPLE.json` files in `/client` and `/server` folders accordingly. Make sure to rename both files to `config.json`.

### Client config

- `serverBaseUrl` — URL of the server API. `http://127.0.0.1:3000/api` by default.

### Server config

- `db.host` — domain name to access database. If the database is hosted on the same machine as the server, it should stay unchanged. `localhost` by default.
- `db.port` — port to access database. `3000` by default.
- `db.user` — MySQL username to be used to access the app's database. `root` by default.
- `db.password` — MySQL password for the chosen user. Empty by default.
- `db.name` — MySQL database name. `ikna` by default.
- `db.schemaLocation` — location of the file that contains the innitial database schema that will be applied on the first run. Changing this value is not recommended. `./schema.sql` by default.
- `db.alwaysNewDB` **(testing only)** — when set `true`, the database will be dropped and recreated on every run. `false` by default.
- `secretKeySize` — the number of random bytes that will be used to sign authentification tokens. Those bytes are saved as `secret.key` on the first run. `128` by default.
- `jwtExpirationTime` - the time allowed for tokens to stay valid before expiring. `1d` by default.
