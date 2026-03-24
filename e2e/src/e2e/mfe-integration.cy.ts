describe('Microfrontend Integration: Achievements Remote', () => {
  beforeEach(() => {
    // Visit the Shell application
    cy.visit('/');
    cy.clearLocalStorage();

    // Ensure the initial shell loads (using a core component)
    cy.get('lib-game-config', { timeout: 15000 }).should('be.visible');
  });

  it('should dynamically load the achievements remote and display its content', () => {
    // Open the navigation menu
    cy.get('.menu-toggle').click();

    // Click on the Achievements link (Spanish: Logros)
    cy.get('.mobile-menu button').contains('Logros').click();

    // Check for the achievements route in the URL
    cy.url().should('include', '#/logros');

    // Verify that the remote component from 'achievements-remote' is rendered
    cy.get('app-achievements', { timeout: 15000 }).should('be.visible');

    // Check for achievement progress component
    cy.get('app-achievement-progress').should('be.visible');

    // Verify that we have a list of achievements loaded from the remote
    cy.get('app-achievement-item').should('have.length.at.least', 1);
  });

  it('should maintain state consistency when navigating between shell and remote', () => {
    // Go to Credits via menu
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Creditos').click();
    cy.url().should('include', '#/creditos');

    // Check for credits content (selector is lib-end-credits)
    cy.get('lib-end-credits').should('be.visible');

    // Navigate to Achievements (Remote)
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Logros').click();
    cy.get('app-achievements').should('be.visible');

    // Go back to Home (Spanish: Inicio)
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Inicio').click();
    cy.get('lib-game-config').should('be.visible');

    // Verify Shell still functions correctly
    cy.get('.start-game').should('be.visible');
  });
});
