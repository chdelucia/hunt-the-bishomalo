# Reporte de Arquitectura: Reutilización y Escalabilidad del Tablero y Opciones

Este reporte analiza los errores de diseño arquitectónico actuales en el monorepo de **Hunt The Bishomalo** que impiden la reutilización y escalabilidad del tablero (grid/celdas) y de las opciones/configuración para otros juegos basados en cuadrículas dentro del mismo espacio de trabajo.

---

## 1. Errores en la Arquitectura del Tablero (Grid y Celdas)

### 1.1 Acoplamiento del Renderizado de la Celda a Elementos del Dominio (`GameCellComponent`)
- **Ubicación:** `libs/game/ui/src/lib/cell/game-cell.component.html` y `libs/game/ui/src/lib/cell/game-cell.component.ts`
- **Problema:** El componente de celda del tablero (`lib-game-cell`) importa y renderiza directamente componentes específicos de la lógica de Hunt the Bishomalo como `<lib-hunter>` y `<lib-cell-content>`. También tiene inputs acoplados como `hunterDirection`, `hunterArrows`, `selectedChar`, `hasLantern`, `hasShield`, etc.
- **Impacto en la Reutilización:** Si quisiéramos crear un juego como el Buscaminas (*Minesweeper*), Ajedrez, o Sokoban, no podríamos reutilizar el componente del tablero ni las celdas actuales. Intentar usarlos nos obligaría a importar toda la lógica del "Hunter" y de "Bishomalo", o bien agregar directivas `@if` condicionales adicionales dentro del HTML de la celda para cada juego nuevo, lo cual viola el principio Abierto/Cerrado (Open/Closed Principle) y hace que el componente crezca de forma incontrolable.

### 1.2 Modelos de Datos Contaminados con el Dominio en la Capa Compartida (`Cell` y `CellContentType`)
- **Ubicación:** `libs/shared/data/src/lib/cell.model.ts`
- **Problema:** La interfaz `Cell` y el tipo `CellContentType` están definidos en la biblioteca compartida `libs/shared/data`. Sin embargo, los tipos de contenido de las celdas (`wumpus`, `gold`, `pit`, `arrow`, `heart`, etc.) y sus recursos/imágenes estáticos (`CELL_CONTENTS`) están codificados estáticamente dentro de esta capa compartida.
- **Impacto en la Reutilización:** El paquete `shared/data` debería contener únicamente tipos primitivos e infraestructuras genéricas de datos. Al estar contaminado con entidades de Bishomalo, cualquier otro juego del monorepo que requiera un modelo de celda tendría que heredar un tipo contaminado con monstruos, flechas y monedas de Bishomalo. Si agregamos tipos específicos para un nuevo juego (por ejemplo, `'bomb'` o `'flag'` para Buscaminas), estaríamos mezclando dominios totalmente independientes en una sola biblioteca compartida, rompiendo la cohesión y la mantenibilidad.

### 1.3 Lógica de Generación del Tablero Acoplada (`BoardGeneratorService`)
- **Ubicación:** `libs/game/data-access/src/lib/board-generator.service.ts`
- **Problema:** El servicio `BoardGeneratorService` expone métodos específicos del dominio para colocar elementos del juego (`placeGold`, `placeWumpus`, `placePits`, `placeArrows`, `placeEvents`).
- **Impacto en la Reutilización:** Un generador de cuadrículas reutilizable debería limitarse a inicializar matrices bidimensionales y manejar coordenadas. Al mezclar la instanciación de la cuadrícula con la colocación de trampas y oro específicos de Bishomalo, se impide su uso como un generador base genérico.

---

## 2. Errores en la Arquitectura de Opciones/Configuración

### 2.1 Dependencia Inversa del Módulo de Configuración hacia el Dominio del Juego
- **Ubicación:** `libs/config/feature/src/lib/game-config.component.ts`
- **Problema:** El componente de configuración de juego (`GameConfigComponent`) inyecta directamente `GAME_STORE_TOKEN` de `@hunt-the-bishomalo/core/api` y `GAME_ENGINE_TOKEN` de `@hunt-the-bishomalo/game/api`. Además, invoca métodos concretos del juego (`this.gameEngine.initGame()`) y redirige directamente a rutas específicas de Bishomalo (`RouteTypes.STORY`).
- **Impacto en la Reutilización y Aislamiento:** Esto rompe por completo las directrices del diseño guiado por dominios (Domain-Driven Design) del repositorio, donde los dominios deben estar aislados y comunicarse solo a través de APIs abstractas o eventos. El dominio de configuración (`libs/config`) se encuentra acoplado en tiempo de compilación al juego de Bishomalo. Si creamos un segundo juego, no podríamos utilizar la biblioteca de configuración sin arrastrar consigo toda la lógica, dependencias y assets de Bishomalo, provocando fallos de compilación o empaquetados pesados innecesarios.

### 2.2 Modelos de Configuración Rígidos (`GameSettings`)
- **Ubicación:** `libs/shared/data/src/lib/game-settings.model.ts`
- **Problema:** La interfaz `GameSettings` define campos rígidos y específicos como `pits`, `arrows`, `wumpus`, `selectedChar` y sub-estructuras de dificultad como `bossTries`.
- **Impacto en la Reutilización:** Para juegos diferentes, los parámetros de configuración serán completamente distintos (por ejemplo, número de minas para Buscaminas, o tiempo límite). El modelo de datos actual no es extensible ni parametrizable.

---

## 3. Propuesta de Refactorización y Plan de Acción

Para lograr que el tablero, las celdas y la configuración sean 100% reutilizables e independientes, se propone el siguiente plan de refactorización dividido en fases:

### Fase 1: Abstracción y Parametrización de Modelos de Datos (`shared-data`)
1. **Modelos Genéricos de Tablero:**
   Redefinir la interfaz `Cell` para que sea genérica y acepte un parámetro de tipo para su contenido:
   ```typescript
   export interface Cell<T = unknown> {
     x: number;
     y: number;
     visited?: boolean;
     content?: T;
   }
   ```
2. **Definiciones Específicas en el Dominio:**
   Mover el tipo `CellContentType` y el mapa `CELL_CONTENTS` fuera de `libs/shared/data` y colocarlos en la biblioteca de dominio correspondiente (`libs/game/api` o `libs/game/data-access`), manteniendo `shared-data` completamente libre de lógica de juego específica.

### Fase 2: Creación de un Tablero Genérico en la Capa Compartida (`shared-ui`)
1. **Componente de Cuadrícula Genérico:**
   Crear un componente de tablero genérico (por ejemplo, `GridBoardComponent`) en una nueva biblioteca compartida `libs/shared/ui/grid`.
2. **Uso de Content Projection y Content Templates:**
   En lugar de renderizar directamente componentes específicos, el tablero debe utilizar proyección de contenido de Angular (`<ng-content>`) o plantillas personalizadas (`@Input() cellTemplate: TemplateRef<unknown>`).

   *Ejemplo de implementación genérica de celda:*
   ```html
   <!-- libs/shared/ui/grid/cell.component.html -->
   <div class="cell" [class.visited]="cell.visited">
     <!-- Se proyecta el contenido específico del juego usando un TemplateRef inyectado o proporcionado -->
     <ng-container *ngTemplateOutlet="cellTemplate; context: { $implicit: cell }"></ng-container>
   </div>
   ```
   Esto permite que cualquier juego instancie el tablero y defina exactamente qué renderizar en cada celda (ya sea el "Hunter" de Bishomalo, una bandera del Buscaminas, o una pieza de ajedrez) sin modificar la estructura del tablero compartido.

### Fase 3: Desacoplamiento de la Configuración y Opciones
1. **Mover la Configuración Específica al Dominio del Juego:**
   Mover `GameConfigComponent` y su lógica de negocio asociada desde `libs/config/feature` hacia `libs/game/feature` (por ejemplo, bajo `libs/game/feature/src/lib/config/`). La configuración de un juego es intrínseca a sus reglas y estado; por ende, debe residir en su respectivo dominio de juego.
2. **Hacer de `libs/config` una Biblioteca de Infraestructura de Configuración Global:**
   Si se requiere una pantalla de configuración centralizada en el monorepo, esta debe actuar únicamente como un contenedor de rutas o un orquestador genérico. Cada juego registraría su propio componente de opciones mediante inyección de dependencias o configuración de rutas, manteniendo el acoplamiento a nivel de configuración dinámica y no estática.

### Fase 4: Desacoplamiento del Generador de Tableros (`BoardGenerator`)
1. **Crear un Generador Base Genérico:**
   Crear un `GridGeneratorService` dentro de `libs/shared/util` encargado de inicializar matrices de tamaño NxM y operaciones matemáticas con coordenadas.
2. **Delegar el Posicionamiento de Elementos a las Reglas del Juego:**
   Hacer que `BoardGeneratorService` en `libs/game/data-access` consuma el generador genérico de cuadrículas y se encargue únicamente de la colocación de los hazards/items específicos de Bishomalo.

---

## 4. Conclusión

El diseño actual cuenta con una base excelente de separación de lógica mediante un motor abstracto (`IGameRules`), pero sufre de un acoplamiento excesivo en la capa de interfaz de usuario (`GameCellComponent`) y en la biblioteca de configuración global (`GameConfigComponent`).

Implementar el plan de refactorización propuesto permitirá al monorepo escalar de forma limpia para soportar múltiples juegos basados en cuadrículas (por ejemplo, agregando un nuevo dominio `libs/minesweeper` sin tocar una sola línea de código de `libs/game`), minimizando los tiempos de compilación, previniendo la regresión de errores y facilitando la migración a microfrontends independientes.
