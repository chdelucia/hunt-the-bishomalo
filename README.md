# HuntTheBishomalo nunca

Una version del Hunt the wumpus con angular 19 [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/chdelucia/hunt-the-bishomalo)

# 🚀 **Bienvenido al reto más épico de tu vida** 🚀

Te desafío a superar este juego **al 100%**. ¿Tienes lo que se necesita para encontrar al Jedi oculto?


[🔥 **Empezar el reto** 🔥](https://hunt-the-bishomalo.vercel.app/)



## 📊 Calidad del Proyecto (SonarCloud)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=chdelucia_hunt-the-bishomalo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=chdelucia_hunt-the-bishomalo)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=chdelucia_hunt-the-bishomalo&metric=bugs)](https://sonarcloud.io/summary/new_code?id=chdelucia_hunt-the-bishomalo)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=chdelucia_hunt-the-bishomalo&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=chdelucia_hunt-the-bishomalo)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=chdelucia_hunt-the-bishomalo&metric=coverage)](https://sonarcloud.io/summary/new_code?id=chdelucia_hunt-the-bishomalo)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=chdelucia_hunt-the-bishomalo&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=chdelucia_hunt-the-bishomalo)

---

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
