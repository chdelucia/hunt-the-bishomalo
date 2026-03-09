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
      login(email: string, password: string): void;
      getGameStore(): Chainable<any>;
      winLevel(): void;
      loseLevel(): void;
    }
  }
}

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});

Cypress.Commands.add('getGameStore', () => {
  return cy.window().its('gameStore');
});

Cypress.Commands.add('winLevel', () => {
  cy.getGameStore().then((store: any) => {
    const board = JSON.parse(JSON.stringify(store.board()));
    board[0][1].content = {
      type: 'gold',
      image: 'boardicons/gold.svg',
      alt: 'gold coin',
      ariaLabel: 'gold',
    };
    store.updateGame({ board });

    cy.get('.board').should('be.visible');
    // Move to gold
    cy.get('[aria-label="Avanzar"]').click();
    // Turn back and return to start
    cy.get('[aria-label="Girar a la derecha"]').click();
    cy.get('[aria-label="Girar a la derecha"]').click();
    cy.get('[aria-label="Avanzar"]').click();
    // Victory message
    cy.get('.game-message', { timeout: 15000 }).should('contain', 'ictoria');
  });
});

Cypress.Commands.add('loseLevel', () => {
  cy.getGameStore().then((store: any) => {
    store.updateGame({ lives: 1 });
    const board = JSON.parse(JSON.stringify(store.board()));
    board[0][1].content = {
      type: 'wumpus',
      image: 'chars/default/wumpus.svg',
      alt: 'wumpus',
      ariaLabel: 'wumpus',
    };
    store.updateGame({ board });

    cy.get('[aria-label="Avanzar"]').click();
    cy.get('.game-message', { timeout: 15000 }).should('be.visible').should('contain', 'GAME OVER');
  });
});
