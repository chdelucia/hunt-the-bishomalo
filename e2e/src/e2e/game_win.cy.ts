describe('Game Win Condition', () => {
  it('should achieve the win condition and see a win state', () => {
    // 1. Setup - Start Game using the custom command with default options
    // For win conditions, 'easy' difficulty and a known map size might be preferable if the game is hard.
    cy.startGame({ mapSize: '10', difficulty: 'easy' });

    // The game board visibility is already asserted in cy.startGame()

    // 2. Identify Win-Inducing Elements/Actions & 3. Attempt to Win Game
    // Assumptions:
    // - Primary win condition: Clicking an 'exit' or 'goal' cell.
    //   Selectors: [data-cy="exit-cell"], .cell-exit, [data-cy="goal-cell"]
    // - Secondary (speculative): Collecting all treasure items if no exit cell is found.
    //   Selectors: [data-cy="treasure-cell"], .cell-treasure
    // - Defeating a Wumpus is considered too complex without more information.

    const exitCellSelectors = '[data-cy="exit-cell"], .cell-exit, [data-cy="goal-cell"]';
    const treasureCellSelectors = '[data-cy="treasure-cell"], .cell-treasure, [data-cy="gold-cell"], .cell-gold';

    cy.get('body').then(($body) => {
      if ($body.find(exitCellSelectors).length > 0) {
        cy.log('Exit cell found. Attempting to click it.');
        cy.get(exitCellSelectors).first().click();
      } else {
        cy.log('No exit cell found with common selectors. Attempting to look for treasure cells as a secondary strategy.');
        if ($body.find(treasureCellSelectors).length > 0) {
          cy.log('Treasure cells found. Attempting to click all visible ones.');
          // This is a simplified approach: click all currently visible treasure cells.
          // A more robust solution might need to loop until no more treasure cells are found.
          cy.get(treasureCellSelectors).each(($el, index, $list) => {
            cy.wrap($el).click().then(() => {
                cy.log(`Clicked treasure cell ${index + 1} of ${$list.length}`);
            });
          }).then(() => {
            cy.log('Finished clicking all currently visible treasure cells.');
            // After clicking treasures, the game might automatically transition to win,
            // or an exit might appear. We will proceed to check for win state.
          });
        } else {
          cy.log('No treasure cells found with common selectors either. Proceeding to check for win state, though it is unlikely to be achieved.');
          // This test will likely fail at the assertion stage if no win action was performed.
        }
      }
    });

    // 4. Assert Game Win State
    // Look for a "You Win!", "Congratulations!" message or a specific win screen element.
    cy.log('Checking for Game Win state.');
    cy.get(':contains("You Win"), :contains("Congratulations"), :contains("Victory"), [data-cy="win-message"], .win-screen', { timeout: 10000 })
      .should('be.visible')
      .log('Win message/screen is visible.');

    // Optional: Look for score elements or other indicators of a win.
    // cy.get('[data-cy="final-score"]').should('be.visible').and('not.be.empty');
    // cy.log('Final score is visible and not empty.');
  });
});
