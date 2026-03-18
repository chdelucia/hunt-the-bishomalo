describe('Hunt the Bishomalo Full App Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
    cy.viewport('iphone-xr'); // Use consistent viewport
    cy.get('lib-game-config', { timeout: 15000 }).should('be.visible');
  });


  it('should navigate through public routes via menu', () => {
    cy.compareSnapshot('initial-settings');
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Logros').click();
    cy.url().should('include', '/logros');
    cy.get('h2', { timeout: 10000 }).contains('Progreso de logros').should('be.visible');
    cy.compareSnapshot('achievements-page');

    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button', { timeout: 10000 }).contains('Instrucciones').click();
    cy.url().should('include', '/instrucciones');
    cy.get('h1', { timeout: 10000 }).contains('Instrucciones del Juego').should('be.visible');
    cy.compareSnapshot('instructions-page');

    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button', { timeout: 10000 }).contains('Creditos').click();
    cy.url().should('include', '/creditos');
    cy.get('h1', { timeout: 10000 }).contains('Créditos').should('be.visible');
    cy.compareSnapshot('credits-page');

    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button', { timeout: 10000 }).contains('Inicio').click();
    cy.url().should('include', '/settings');
  });

  it('should complete game configuration and start the game', () => {
    cy.get('input#player', { timeout: 10000 }).clear();
    cy.get('input#player').type('Cypress Player');
    cy.get('select#difficulty').select('easy');

    // Select second character if available
    cy.get('.char-selector label').eq(1).click();
    cy.compareSnapshot('game-config-selected-char');

    cy.get('button.start-game').click();

    cy.url().should('include', '/story');
    cy.get('.chapter', { timeout: 15000 }).should('contain', 'CAPÍTULO 1');
    cy.compareSnapshot('story-chapter-1');

    cy.get('.story-container').click();
    cy.url().should('include', '/home');
    cy.get('.board', { timeout: 15000 }).should('be.visible');
    cy.compareSnapshot('game-board-start');
  });

  it('should complete a full game loop: win level -> shop -> purchase -> next level -> results', () => {
    // 1. Setup and start game
    cy.get('input#player').clear();
    cy.get('input#player').type('Full Loop Player');
    // Select character
    cy.get('.char-selector label').first().click();
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

    // 2. Win Level
    cy.winLevel();
    cy.get('.game-message', { timeout: 15000 }).should('contain', 'ictoria');
    cy.compareSnapshot('victory-message');
    cy.get('button.newgame').click();

    // 3. Shop
    cy.url().should('include', '/tienda');
    cy.get('.tienda-titulo', { timeout: 10000 }).should('be.visible');
    cy.compareSnapshot('shop-page');

    // Ensure enough gold
    cy.getGameStore().then(store => {
        store.updateHunter({ gold: 500 });
    });

    cy.get('.producto-card').contains('Escudo').parents('.producto-card').find('button').click();

    // Verify item in inventory
    cy.get('.inventario-item').should('have.length', 1);
    cy.compareSnapshot('shop-after-purchase');

    // Continue to next level
    cy.get('button.boton-siguiente').click();
    cy.url().should('include', '/story');
    cy.get('.story-container', { timeout: 10000 }).click();

    // Verify item still in inventory in game
    cy.get('.inventory-container .item', { timeout: 10000 }).should('exist');

    // 4. Lose and Game Over
    cy.loseLevel();
    cy.get('.game-message', { timeout: 20000 }).should('contain', 'GAME OVER');
    cy.compareSnapshot('game-over-message');
    cy.get('button.newgame').click();

    // 5. Results
    cy.url().should('include', '/resultados');
    cy.get('h1', { timeout: 10000 }).contains('Resultados').should('be.visible');
    cy.compareSnapshot('results-page');
  });

  it('should navigate to secret Jedi route', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Jedi seeker');
    cy.get('.char-selector label').first().click();
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.getGameStore().then((store: any) => {
        store.updateGame({
            settings: { ...store.settings(), size: 8 }
        });

        const board = Array.from({ length: 8 }, (_, x) =>
            Array.from({ length: 8 }, (_, y) => ({ x, y, visited: true }))
        );
        store.updateGame({ board });
        store.updateHunter({ x: 7, y: 7, direction: 1 });

        cy.get('.board', { timeout: 15000 }).should('be.visible');
        cy.get('[aria-label="Avanzar"]', { timeout: 10000 }).should('be.visible').click();

        cy.url().should('include', '/secret');
        cy.get('.jedi-container', { timeout: 15000 }).should('exist');
        cy.compareSnapshot('jedi-secret-route-full-flow');
    });
  });
});
