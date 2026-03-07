describe('End Game and Results', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
  });

  const getStore = () => cy.window().its('gameStore');

  it('should handle game over and display detailed results', () => {
    cy.get('input#player').clear().type('Test Player');
    cy.get('button.start-game').click();
    cy.get('.story-container').click();

    // Trigger Game Over
    getStore().then((store: any) => {
        store.updateGame({ lives: 1 });
        const board = JSON.parse(JSON.stringify(store.board()));
        board[0][1].content = {
            type: 'wumpus',
            image: 'chars/default/wumpus.svg',
            alt: 'wumpus',
            ariaLabel: 'wumpus',
        };
        store.updateGame({ board });
    });

    cy.get('[aria-label="Avanzar"]').click();
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
