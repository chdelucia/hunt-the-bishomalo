describe('Game Setup and Progression', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
  });


  it('should complete game configuration with different characters', () => {
    // Test character selection
    cy.get('.char-selector img').each(($img, index) => {
        cy.wrap($img).click();
        // cy.screenshot(`game-setup-char-${index}`);
    });

    cy.get('input#player').clear();
    cy.get('input#player').type('Cypress Hero');
    cy.get('button.start-game').click();

    // Verify Story Page
    cy.url().should('include', '/story');
    cy.get('.chapter', { timeout: 10000 }).should('be.visible');
    // cy.screenshot('game-story-page');
  });

  it('should play a level, win, and visit the shop', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Progression Test');
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

    cy.get('.board').should('be.visible');
    // cy.screenshot('game-play-start');

    // Win Level using custom command
    cy.winLevel();

    // Victory message
    cy.get('.game-message', { timeout: 15000 }).should('contain', 'ictoria');
    // cy.screenshot('game-play-picked-gold');
    // cy.screenshot('game-play-victory');

    // Go to Shop
    cy.get('button.newgame').click();
    cy.url().should('include', '/tienda');
    cy.get('.tienda-titulo', { timeout: 10000 }).should('be.visible');
    // cy.screenshot('game-shop-page');

    // Verify inventory display in shop
    cy.get('.inventario-container').should('exist');

    // Continue to next level
    cy.get('button.boton-siguiente').click();
    cy.url().should('include', '/story');
  });
});
