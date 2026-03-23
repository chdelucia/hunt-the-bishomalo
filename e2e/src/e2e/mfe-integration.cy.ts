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

    // Click on the Achievements link
    // This action triggers loadRemoteModule in the background
    cy.get('.mobile-menu button').contains('Logros').click();

    // Check for the achievements route in the URL
    // We use HashLocationStrategy
    cy.url().should('include', '#/logros');

    // Verify that the remote component from 'achievements-remote' is rendered
    // AchievementsComponent uses lib-achievements-list and lib-achievement-progress
    cy.get('lib-achievement-progress', { timeout: 15000 }).should('be.visible');

    // Verify that we have a list of achievements loaded from the remote
    cy.get('lib-achievements-list').should('be.visible');
    cy.get('lib-achievement-item').should('have.length.at.least', 1);

    // Check for specific achievement content to prove it's the real component
    cy.get('lib-achievement-item').first().within(() => {
      cy.get('.title').should('not.be.empty');
      cy.get('.description').should('not.be.empty');
    });
  });

  it('should maintain state consistency when navigating between shell and remote', () => {
    // Go to shop via menu (part of shell/other domain)
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Tienda').click();
    cy.url().should('include', '#/tienda');

    // Check initial gold (should be 0 or based on default game state)
    cy.get('[aria-label="Oro"]').should('contain', '0');

    // Navigate to Achievements (Remote)
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Logros').click();
    cy.get('lib-achievements-list').should('be.visible');

    // Go back to Home/Settings (Shell)
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Inicio').click();
    cy.get('lib-game-config').should('be.visible');

    // Verify Shell still functions correctly after loading a remote
    cy.get('button').contains('Nueva partida').should('be.visible');
  });
});
