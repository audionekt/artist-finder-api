# API Layer

the apollo graphql backend for this project. there is no definitive objective yet, the goal is to establish working relations between the various entities i plan to create as i buiid this app. a few packages i'm using are: `apollo-server-koa`, `type-graphql`, `typeorm`, `typeorm-seeding`, connected to postgres db + pg-admin instance spun up via `docker-compose.yml`. to get started:

you'll need to start up docker containers locally so you can have access to a postgres db and pgadmin (for a nice ui to manage it). 

open up docker desktop, and navigate to the 'api' folder of this project in you terminal.

run:

```bash
yarn docker:up
```

navigate to your [pg admin](http://localhost:5050) and right click on 'Servers'. you'll need to connect a server to your db using the credentials you've set in your `docker-compose.yml`.

(optional) once your db/server is setup, you can seed the db with fake data 😄:

```bash
yarn seed:run
```

next, lets tell the typescript compiler to watch for changes:

```bash
yarn watch
```

in another terminal in the api directory, run:

```bash
yarn start
```

pgadmin: [http://localhost:5050](http://localhost:5050)\
graphql playground: [http://localhost:4000/graphql](http://localhost:4000/graphql)

