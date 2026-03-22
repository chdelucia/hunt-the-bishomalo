describe('App Navigation and Public Routes', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
    cy.get('lib-game-config', { timeout: 15000 }).should('be.visible');
  });

  it('should display the settings page by default', () => {
    cy.get('lib-game-config').should('be.visible');
    // cy.compareSnapshot('navigation-settings-page');
  });

  it('should navigate to Achievements via menu', () => {
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Logros').click();
    cy.url().should('include', '/logros');
    // cy.compareSnapshot('navigation-achievements-page');
  });

  it('should navigate to Instructions via menu', () => {
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Instrucciones').click();
    cy.url().should('include', '/instrucciones');
    cy.get('h1', { timeout: 10000 }).contains('Instrucciones del Juego').should('be.visible');
    // cy.compareSnapshot('navigation-instructions-page');
  });

  it('should navigate to Credits via menu', () => {
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Creditos').click();
    cy.url().should('include', '/creditos');
    // cy.compareSnapshot('navigation-credits-page');
  });

  it('should navigate back to Settings from menu', () => {
    // First go somewhere else
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Logros').click();

    // Now go back to Inicio (Settings)
    cy.get('.menu-toggle').click();
    cy.get('.mobile-menu button').contains('Inicio').click();
    cy.url().should('include', '/settings');
    // cy.compareSnapshot('navigation-back-to-settings');
  });
});
