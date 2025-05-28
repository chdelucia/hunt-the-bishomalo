describe('Game Loss Condition', () => {
  it('should lose all lives and see a game over state', () => {
    // 1. Setup - Start Game using the custom command with default options
    cy.startGame(); // You can pass { mapSize: '5', difficulty: 'easy' } for specific test conditions

    // The game board visibility is already asserted in cy.startGame()

    // 2. Identify Loss-Inducing Elements/Actions & 3. Attempt to Lose Lives
    // Assumptions:
    // - Lives are represented by elements like [data-cy="life-icon"] or a counter [data-cy="lives-counter"].
    // - Hazardous cells on the board might be [data-cy="hazard-cell"] or .cell-hazard.
    // - Clicking a hazard cell reduces lives.
    // - We assume there are enough hazard cells to lose all lives.

    const lifeIconSelector = '[data-cy="life-icon"], .life-icon';
    const livesCounterSelector = '[data-cy="lives-counter"]';
    const hazardCellSelector = '[data-cy="hazard-cell"], .cell-hazard, .cell-bomb, .cell-wumpus, .cell-pit'; // Common names for hazards

    // Get initial number of lives (assuming at least 1 to start)
    // We'll try to click hazards up to a max of (e.g.) 5 times if we can't get an exact life count.
    const maxAttemptsToLoseLives = 5;
    let livesLost = 0;

    cy.get('body').then(($body) => {
      let initialLives = 0;
      if ($body.find(lifeIconSelector).length > 0) {
        initialLives = $body.find(lifeIconSelector).length;
        cy.log(`Found ${initialLives} life icons.`);
      } else if ($body.find(livesCounterSelector).length > 0) {
        cy.get(livesCounterSelector).invoke('text').then(text => {
          initialLives = parseInt(text, 10);
          cy.log(`Found lives counter with value: ${initialLives}.`);
        });
      } else {
        cy.log('Could not determine initial number of lives. Will attempt to click hazards up to ' + maxAttemptsToLoseLives + ' times.');
        initialLives = maxAttemptsToLoseLives; // Default attempts if no lives indicator found
      }

      if (initialLives === 0 && maxAttemptsToLoseLives === 5) { // if default was used and still 0, make it at least 1 for the loop
        initialLives = 1;
        cy.log('Setting initial attempts to 1 as no specific life count was found.');
      }


      for (let i = 0; i < initialLives; i++) {
        // Find any hazard cell. We click the first one we find.
        // This assumes that clicking a hazard cell makes it disappear or become non-hazardous,
        // or that there are multiple distinct hazard cells.
        cy.get(hazardCellSelector).first().then($hazard => {
          if ($hazard.length > 0) {
            cy.wrap($hazard).click();
            livesLost++;
            cy.log(`Clicked hazard cell. Attempt ${i + 1} of ${initialLives}. Lives lost so far: ${livesLost}`);
            // Optional: Add a short wait for UI to update if needed
            // cy.wait(500);

            // Check if game over state is already reached
            cy.get('body').then(($bodyAfterClick) => {
              if ($bodyAfterClick.find(':contains("Game Over"), [data-cy="game-over-message"]').length > 0) {
                cy.log('Game Over detected after click, breaking loop.');
                return false; // Breaks from the .each() or .then() in Cypress, effectively stopping the loop
              }
            });

          } else {
            cy.log('No more hazard cells found to click.');
            return false; // Stop if no hazards found
          }
        }).then((continueLoop) => {
            // if continueLoop is false, it means we should break the outer loop
            if (continueLoop === false) {
                 return false; // break "for" loop
            }
        });
      }
    });

    // 4. Assert Game Over State
    cy.log('Finished attempts to lose lives. Checking for Game Over state.');
    // Look for a "Game Over" message or a specific game over screen element
    cy.get(':contains("Game Over"), [data-cy="game-over-message"]', { timeout: 10000 }) // Increased timeout for game over message
      .should('be.visible')
      .log('Game Over message is visible.');

    // Assert that lives are gone or counter is zero
    cy.get('body').then(($body) => {
      if ($body.find(lifeIconSelector).length > 0) {
        cy.get(lifeIconSelector).should('not.exist').log('Life icons no longer exist.');
      } else if ($body.find(livesCounterSelector).length > 0) {
        cy.get(livesCounterSelector).invoke('text').then(text => {
          expect(parseInt(text.trim(), 10)).to.equal(0);
        }).log('Lives counter is 0.');
      } else {
        cy.log('No life icons or counter found to assert zero lives, relying on Game Over message.');
      }
    });
  });
});
