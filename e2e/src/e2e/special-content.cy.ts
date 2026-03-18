describe('Special Content and Secret Routes', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
    cy.viewport('iphone-xr');
    cy.get('lib-game-config', { timeout: 15000 }).should('be.visible');
  });


  it('should navigate to the secret Jedi route at size 8', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Jedi Seeker');
    cy.get('select#difficulty').select('easy');
    // Must select a character
    cy.get('.char-selector label').first().click();
    cy.get('button.start-game').click();
    cy.get('.story-container', { timeout: 10000 }).click();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.getGameStore().then((store: any) => {
        store.updateGame({
            settings: { ...store.settings(), size: 8 }
        });
        const board = Array.from({ length: 8 }, (_, x) =>
            Array.from({ length: 8 }, (_, y) => ({ x, y, visited: true }))
        );
        store.updateGame({ board });
        store.updateHunter({ x: 7, y: 7, direction: 1 }); // Facing RIGHT

        cy.get('.board', { timeout: 15000 }).should('be.visible');
        cy.get('[aria-label="Avanzar"]', { timeout: 15000 }).should('be.visible').click();

        cy.url().should('include', '/secret');
        cy.get('.jedi-container', { timeout: 25000 }).should('exist');
        cy.get('.jedi').should('be.visible');
        cy.compareSnapshot('special-jedi-route');
    });
  });

  it('should reach and defeat the Boss', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Boss Slayer');
    cy.get('select#difficulty').select('easy');
    // Must select a character
    cy.get('.char-selector label').first().click();
    cy.get('button.start-game').click();
    cy.get('.story-container', { timeout: 10000 }).click();

    // Trigger Boss Fight via store manipulation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.getGameStore().then((store: any) => {
        store.updateGame({
            settings: { ...store.settings(), size: 13 },
            hasWon: true
        });
    }).then(() => {
      // UI navigation to Boss
      cy.get('button.newgame', { timeout: 25000 }).should('be.visible').click();

      cy.url().should('include', '/boss');
      cy.get('h2#bossTitle', { timeout: 10000 }).should('be.visible');
      cy.compareSnapshot('boss-fight-start');

      // Interact with boss grid
      cy.get('.grid .cell', { timeout: 10000 }).should('have.length', 25);

      // Click cells to simulate battle
      cy.get('.grid .cell').each(($el) => {
          cy.wrap($el).click({force: true});
      });

      // Instead of cy.wait(2000), wait for the game message or status bar to update
      cy.get('.game-message', { timeout: 10000 }).should('be.visible');

      cy.compareSnapshot('special-boss-fight-end');
    });
  });
});
