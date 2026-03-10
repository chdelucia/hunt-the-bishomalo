describe('End Game and Results', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
  });


  it('should handle game over and display detailed results', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Test Player');
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

    // Trigger Game Over using custom command
    cy.loseLevel();

    cy.get('.game-message', { timeout: 15000 }).should('be.visible').should('contain', 'GAME OVER');
    cy.screenshot('end-game-game-over');

    // Click Results button (mapped to .newgame in GameMessageComponent)
    cy.get('button.newgame', { timeout: 15000 }).should('be.visible').click();

    cy.url().should('include', '/resultados');
    cy.get('h1.resultados-titulo').should('be.visible');

    // Test tab switching in results (using correct class .tab-button)
    cy.get('.tab-button').contains('General').should('be.visible').click();
    cy.screenshot('end-game-results-general');

    cy.get('.tab-button').contains('Niveles').should('be.visible').click();
    cy.screenshot('end-game-results-levels');

    // Go to Credits from Results (Next button is .next-btn)
    cy.get('button.next-btn').should('be.visible').click();

    cy.url().should('include', '/creditos');
    cy.get('h1').should('be.visible');
  });
});
