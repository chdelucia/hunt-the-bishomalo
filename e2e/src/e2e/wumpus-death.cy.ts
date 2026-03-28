describe('Wumpus Death flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
    cy.get('lib-game-config', { timeout: 15000 }).should('be.visible');
  });

  it('should handle hunter death by Wumpus', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Test Hunter');
    cy.get('.char-selector label').first().click();
    cy.get('button.start-game').click();
    cy.get('.story-container', { timeout: 10000 }).click();

    // Trigger Wumpus death
    cy.loseLevel();

    // Check for game message indicating death by Wumpus
    cy.get('lib-game-message', { timeout: 15000 }).should('exist');

    // Verify the attack animation is shown (it has a defer on timer 100ms)
    cy.get('lib-wumpus-attack-animation', { timeout: 5000 }).should('exist');
  });
});
