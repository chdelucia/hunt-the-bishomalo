describe('Game Configuration and Start', () => {
  it('should configure and start the game with specific options', () => {
    // Use the custom command to start the game with specific configurations
    cy.startGame({ mapSize: '12', difficulty: 'medium' });

    // The cy.startGame() command already includes an assertion for game board visibility.
    // If additional, specific assertions are needed for the config test, they can be added here.
    // For example, checking if the game UI reflects the chosen map size or difficulty, if possible.
    cy.log('Game started with specific configurations. Test focuses on this setup.');
    // Example: cy.get('[data-cy="current-map-size-display"]').should('contain.text', '12');
    // Example: cy.get('[data-cy="current-difficulty-display"]').should('contain.text', 'Medium');
  });

  it('should start the game with default options if none are provided', () => {
    // Use the custom command to start the game with default configurations
    cy.startGame();

    // Assertions for default start are already in cy.startGame()
    cy.log('Game started with default configurations.');
  });
});
