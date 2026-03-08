describe('Hunt the Bishomalo Full App Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
  });


  it('should navigate through public routes via menu', () => {
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Logros').click();
    cy.url().should('include', '/logros');
    cy.get('h2', { timeout: 10000 }).contains('Progreso de logros').should('be.visible');

    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Instrucciones').click();
    cy.url().should('include', '/instrucciones');
    cy.get('h1', { timeout: 10000 }).contains('Instrucciones del Juego').should('be.visible');

    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Creditos').click();
    cy.url().should('include', '/creditos');
    cy.get('h1', { timeout: 10000 }).contains('Créditos').should('be.visible');

    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Inicio').click();
    cy.url().should('include', '/settings');
  });

  it('should complete game configuration and start the game', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Cypress Player');
    cy.get('select#difficulty').select('easy');
    cy.get('.char-selector img').first().click();

    cy.get('button.start-game').click();

    cy.url().should('include', '/story');
    cy.get('.chapter', { timeout: 10000 }).should('contain', 'CAPÍTULO 1');

    cy.get('.story-container').click();
    cy.url().should('include', '/home');
  });

  it('should complete a full game loop: win level -> shop -> lose -> results', () => {
    // 1. Setup and start game
    cy.get('input#player').clear();
    cy.get('input#player').type('Full Loop Player');
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

    // 2. Win Level
    cy.window().its('gameStore').then((store: any) => {
        const board = JSON.parse(JSON.stringify(store.board()));
        board[0][1].content = {
            type: 'gold',
            image: 'boardicons/gold.svg',
            alt: 'gold coin',
            ariaLabel: 'gold',
        };
        store.updateGame({ board });

        cy.get('[aria-label="Avanzar"]', { timeout: 10000 }).should('be.visible').click();
        cy.get('[aria-label="Girar a la derecha"]').click();
        cy.get('[aria-label="Girar a la derecha"]').click();
        cy.get('[aria-label="Avanzar"]').click();

        cy.get('.game-message', { timeout: 15000 }).should('contain', 'ictoria');
        cy.get('button.newgame').click();
    });

    // 3. Shop
    cy.url().should('include', '/tienda');
    cy.get('.tienda-titulo', { timeout: 10000 }).should('be.visible');

    // Continue to next level
    cy.get('button.boton-siguiente').click();
    cy.get('.story-container', { timeout: 10000 }).click();

    // 4. Lose and Game Over
    cy.window().its('gameStore').then((store: any) => {
        store.updateGame({ lives: 1 });
        const board = JSON.parse(JSON.stringify(store.board()));
        board[0][1].content = {
            type: 'wumpus',
            image: 'chars/default/wumpus.svg',
            alt: 'wumpus',
            ariaLabel: 'wumpus',
        };
        store.updateGame({ board });

        cy.get('[aria-label="Avanzar"]', { timeout: 10000 }).should('be.visible').click();
        cy.get('.game-message', { timeout: 20000 }).should('contain', 'GAME OVER');
        cy.get('button.newgame').click();
    });

    // 5. Results
    cy.url().should('include', '/resultados');
    cy.get('h1', { timeout: 10000 }).contains('Resultados').should('be.visible');
  });

  it('should navigate to secret Jedi route', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Jedi seeker');
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

    cy.window().its('gameStore').then((store: any) => {
        store.updateGame({
            settings: { ...store.settings(), size: 8 }
        });

        const board = Array.from({ length: 8 }, (_, x) =>
            Array.from({ length: 8 }, (_, y) => ({ x, y, visited: true }))
        );
        store.updateGame({ board });
        store.updateHunter({ x: 7, y: 7, direction: 1 });

        cy.get('.board', { timeout: 10000 }).should('be.visible');
        cy.get('[aria-label="Avanzar"]', { timeout: 10000 }).should('be.visible').click();

        cy.url().should('include', '/secret');
        cy.get('.jedi-container', { timeout: 15000 }).should('exist');
    });
  });
});
