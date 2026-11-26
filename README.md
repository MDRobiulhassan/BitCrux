# BitCrux

BitCrux is a coding practice platform for browsing programming problems, writing and running solutions, tracking submissions, and organizing problems into personal playlists.

## Live Demo

[Visit BitCrux](https://https://bitcrux.vercel.app/)

## Features

- Browse problems and view their descriptions, examples, constraints, and difficulty.
- Write code in the browser with the Monaco editor.
- Run code against a problem's test cases without saving a submission.
- Submit solutions to save results and track accepted problems.
- Create playlists and organize problems into personal collections.
- View profile progress, solved problems, submissions, and playlists.
- Manage problems with admin-only create, edit, and delete actions.
- Sign in with Clerk.

The editor supports C++, Python, and Java. Code execution is provided by Judge0.

## Technology

- Next.js App Router, React, and TypeScript
- PostgreSQL and Prisma
- Clerk authentication
- Monaco Editor
- Judge0
- Tailwind CSS and Radix UI

## Requirements

- Node.js 20.9 or later
- PostgreSQL
- A Clerk application
- A Judge0 API endpoint and API key

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file from `.env.example`, then set the values:

| Variable                            | Description                  |
| ----------------------------------- | ---------------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key        |
| `CLERK_SECRET_KEY`                  | Clerk secret key             |
| `JUDGE0_API_URL`                    | Judge0 API base URL          |
| `JUDGE0_API_KEY`                    | Judge0 API key               |

Apply the Prisma migrations to your database:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint                   |

For production, install dependencies, configure the environment variables, apply migrations with `npx prisma migrate deploy`, build with `npm run build`, and start with `npm run start`.

## Routes

| Route                   | Purpose                                   | Access                                               |
| ----------------------- | ----------------------------------------- | ---------------------------------------------------- |
| `/`                     | Home page                                 | Public                                               |
| `/about`                | About BitCrux                             | Public                                               |
| `/problems`             | Browse problems                           | Public                                               |
| `/problems/[slug]`      | View a problem and use the editor         | Public; running and submitting code requires sign-in |
| `/problems/create`      | Create a problem                          | Admin                                                |
| `/problems/[slug]/edit` | Edit a problem                            | Admin                                                |
| `/profile`              | View progress, submissions, and playlists | Signed-in user                                       |
| `/playlists`            | Browse personal playlists                 | Signed-in user                                       |
| `/playlists/[id]`       | View a playlist and its problems          | Playlist owner                                       |
| `/sign-in`              | Sign in                                   | Public                                               |
| `/sign-up`              | Create an account                         | Public                                               |

New users are assigned the `USER` role. Problem creation, editing, and deletion are limited to users with the `ADMIN` role.

## Project layout

```text
src/
  app/          Next.js routes and layouts
  components/   Shared UI and layout components
  features/     Auth, problems, submissions, playlists, and profile
  server/       Database, environment validation, and server services
  lib/          Shared utilities
prisma/
  schema.prisma Database schema
  migrations/   Database migrations
public/         Static assets
```
