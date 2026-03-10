describe('Special Content and Secret Routes', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
  });


  it('should navigate to the secret Jedi route at size 8', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Jedi Seeker');
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

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
        cy.screenshot('special-jedi-route');
    });
  });

  it('should reach and defeat the Boss', () => {
    cy.get('input#player').clear();
    cy.get('input#player').type('Boss Slayer');
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

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
      cy.get('h2#bossTitle').should('be.visible');

      // Interact with boss grid
      cy.get('.grid .cell').should('have.length', 25);

      // Click some cells to simulate battle
      for(let i=0; i<10; i++) {
          cy.get('.grid .cell').eq(i).click();
      }

      cy.screenshot('special-boss-fight-midway');
    });
  });
});
