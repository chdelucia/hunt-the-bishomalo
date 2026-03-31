describe('Statistics Verification', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('unknown remote achievements')) {
        return false;
      }
      return true;
    });
    cy.visit('/');
    cy.clearLocalStorage();
    cy.get('lib-game-config', { timeout: 15000 }).should('be.visible');
  });

  it('should track steps and display them in the results page', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Stat Tester');
    cy.get('.char-selector label').first().click();
    cy.get('button.start-game').click();
    cy.get('.story-container', { timeout: 10000 }).click();

    // Verify game starts and we are at (0,0)
    cy.getGameStore().should((store) => {
      expect(store.hunter().x).to.equal(0);
      expect(store.hunter().y).to.equal(0);
    });

    // Move to generate steps
    // Step 1: (0,0) -> (0,1)
    cy.get('[aria-label="Avanzar"]').click();
    // Step 2: (0,1) -> (0,0) - need to turn around
    cy.get('[aria-label="Girar a la derecha"]').click();
    cy.get('[aria-label="Girar a la derecha"]').click();
    cy.get('[aria-label="Avanzar"]').click();

    // Trigger Game Over
    cy.getGameStore().then(store => {
      store.updateGame({ isAlive: false, lives: 0 });
    });

    cy.get('.game-message', { timeout: 15000 }).should('be.visible');
    cy.get('button.newgame').click();

    // Verify results page
    cy.url().should('include', '/resultados');
    cy.get('.stat-card').contains('Pasos Totales').parent().find('.stat-valor').then(($val) => {
      const steps = parseInt($val.text());
      expect(steps).to.be.at.least(2);
    });

    // Check levels completed
    cy.get('.stat-card').contains('Niveles Completados').parent().find('.stat-valor').should('not.have.text', '0');
  });
});
