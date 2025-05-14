# HuntTheBishomalo nunca

# 🚀 **Bienvenido al reto más épico de tu vida** 🚀

Te desafío a superar este juego **al 100%**. ¿Tienes lo que se necesita para encontrar al Jedi oculto?


[🔥 **Empezar el reto** 🔥](https://hunt-the-bishomalo.vercel.app/)



## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve hunt-the-bishomalo
```

To create a production bundle:

```sh
npx nx build hunt-the-bishomalo
```

To see all available targets to run for a project, run:

```sh
npx nx show project hunt-the-bishomalo
```

to run the unit test:

```sh
npx nx run test --code-coverage
```

to run docker:
```sh
docker build --no-cache -t hunt-the-bishomalo-app .
docker run -d -p 8080:80 --name huntbishomalo hunt-the-bishomalo-app
docker start huntbishomalo

```