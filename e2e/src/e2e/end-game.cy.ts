describe('End Game and Results', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
    cy.get('lib-game-config', { timeout: 15000 }).should('be.visible');
  });


  it('should handle game over and display detailed results', () => {
    cy.get('input#player').clear().type('Test Player');
    // Select a character to enable the start button
    cy.get('.char-selector label').first().click();
    cy.get('button.start-game').click();
    cy.get('.story-container', { timeout: 10000 }).click();

    // Trigger Game Over using custom command
    cy.loseLevel();

    cy.get('.game-message', { timeout: 15000 }).should('be.visible');
    // Ensure lives are 0 to show results button
    cy.getGameStore().then(store => store.updateGame({ lives: 0 }));

    cy.get('.game-message').should('contain', 'GAME OVER');
    cy.compareSnapshot('end-game-game-over');

    // Click Results button
    cy.get('button.newgame', { timeout: 15000 }).should('be.visible').click();

    cy.url().should('include', '/resultados');
    cy.get('h1.resultados-titulo', { timeout: 10000 }).should('be.visible');

    // Test tab switching in results
    cy.get('.tab-button').contains('General').should('be.visible').click();
    cy.compareSnapshot('end-game-results-general');

    cy.get('.tab-button').contains('Niveles').should('be.visible').click();
    cy.compareSnapshot('end-game-results-levels');

    // Go to Credits from Results
    cy.get('button.next-btn').should('be.visible').click();

    cy.url().should('include', '/creditos');
    cy.get('h1', { timeout: 10000 }).should('be.visible');
    cy.compareSnapshot('end-game-credits-from-results');
  });
});
