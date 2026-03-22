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
    cy.get('select#difficulty').select('Fácil');
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
    });

    cy.get('.board', { timeout: 15000 }).should('be.visible');
    cy.get('[aria-label="Avanzar"]', { timeout: 15000 }).should('be.visible').click();

    cy.hash().should('include', '/secret/secret');
    cy.contains('Contrata a Chris', { timeout: 30000 }).should('exist');
  });

  it('should reach and defeat the Boss', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Boss Slayer');
    cy.get('select#difficulty').select('Fácil');
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

      // Interact with boss grid
      cy.get('.grid .cell', { timeout: 10000 }).should('have.length', 25);

      // Click cells to simulate battle - avoiding detachment issues by using a loop that re-queries
      for(let i=0; i<25; i++) {
          cy.get('.grid .cell').eq(i).click({force: true});
      }

      // Instead of cy.wait(2000), wait for the game message or status bar to update
      cy.get('.game-message', { timeout: 10000 }).should('be.visible');
    });
  });
});
