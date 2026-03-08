describe('Game Setup and Progression', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
  });


  it('should complete game configuration with different characters', () => {
    // Test character selection
    cy.get('.char-selector img').each(($img, index) => {
        cy.wrap($img).click();
        cy.screenshot(`game-setup-char-${index}`);
    });

    cy.get('input#player').clear();
    cy.get('input#player').type('Cypress Hero');
    cy.get('button.start-game').click();

    // Verify Story Page
    cy.url().should('include', '/story');
    cy.get('.chapter', { timeout: 10000 }).should('be.visible');
    cy.screenshot('game-story-page');
  });

  it('should play a level, win, and visit the shop', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Progression Test');
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

    cy.window().its('gameStore').then((store: any) => {
        const board = JSON.parse(JSON.stringify(store.board()));
        board[0][1].content = {
            type: 'gold',
            image: 'boardicons/gold.svg',
            alt: 'gold coin',
            ariaLabel: 'gold',
        };
        store.updateGame({ board });

        cy.get('.board').should('be.visible');
        cy.screenshot('game-play-start');

        // Move to gold
        cy.get('[aria-label="Avanzar"]').click();
        cy.screenshot('game-play-picked-gold');

        // Turn back and return to start
        cy.get('[aria-label="Girar a la derecha"]').click();
        cy.get('[aria-label="Girar a la derecha"]').click();
        cy.get('[aria-label="Avanzar"]').click();

        // Victory message
        cy.get('.game-message', { timeout: 15000 }).should('contain', 'ictoria');
        cy.screenshot('game-play-victory');

        // Go to Shop
        cy.get('button.newgame').click();
        cy.url().should('include', '/tienda');
        cy.get('.tienda-titulo', { timeout: 10000 }).should('be.visible');
        cy.screenshot('game-shop-page');

        // Verify inventory display in shop
        cy.get('.inventario-container').should('exist');

        // Continue to next level
        cy.get('button.boton-siguiente').click();
        cy.url().should('include', '/story');
    });
  });
});
