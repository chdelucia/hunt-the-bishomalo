/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      // Removed login command
      // login(email: string, password: string): void;
      startGame(configOptions?: { mapSize?: string | number; difficulty?: string }): void;
    }
  }
}

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => {
//   console.log('Custom command example: Login', email, password);
// });

Cypress.Commands.add('startGame', (configOptions) => {
  cy.visit('/');

  // Default options
  const options = {
    mapSize: '10', // Default map size if not provided
    difficulty: 'easy', // Default difficulty if not provided
    ...configOptions, // Override defaults with provided options
  };

  // Attempt to interact with a map size input
  cy.get('input[name="map_size"], [data-cy="map-size-input"]').then(($input) => {
    if ($input.length > 0) {
      if (options.mapSize) {
        cy.wrap($input).clear().type(String(options.mapSize));
        cy.log(`Set map size to: ${options.mapSize}`);
      }
    } else {
      cy.log('Map size configuration element not found, proceeding with default or no change.');
    }
  });

  // Attempt to interact with a difficulty selection
  cy.get('select[name="difficulty"], [data-cy="difficulty-select"]').then(($select) => {
    if ($select.length > 0) {
      if (options.difficulty) {
        cy.wrap($select).select(options.difficulty);
        cy.log(`Set difficulty to: ${options.difficulty}`);
      }
    } else {
      cy.log('Difficulty configuration element not found, proceeding with default or no change.');
    }
  });

  // Identify and click the start button
  cy.contains('button', 'Start Game', { matchCase: false }).click();
  cy.log('Clicked "Start Game" button.');

  // Assert that the game has started
  const gameBoardSelector = '[data-cy="game-board"], .game-container, #gameCanvas';
  cy.get(gameBoardSelector, { timeout: 10000 }).should('be.visible'); // Added timeout for stability
  cy.log('Game board/interface is visible.');
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
