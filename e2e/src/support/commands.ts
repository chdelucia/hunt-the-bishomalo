/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getGameStore(): Chainable<any>;
      winLevel(): Chainable<void>;
      loseLevel(): Chainable<void>;
      addItemToInventory(item: { name: string; icon: string; effect: string }): Chainable<void>;
    }
  }
}

Cypress.Commands.add('getGameStore', () => {
  return cy.window().its('gameStore');
});

Cypress.Commands.add('winLevel', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.getGameStore().then((store: any) => {
    const board = JSON.parse(JSON.stringify(store.board()));
    // Place gold at (0, 1) and make it visited so it shows up
    board[0][1].visited = true;
    board[0][1].content = {
      type: 'gold',
      image: 'boardicons/gold.svg',
      alt: 'gold coin',
      ariaLabel: 'Oro',
    };
    store.updateGame({ board });

    // Verify gold is on the board - using alt because it's what's rendered in the img tag
    cy.get('[alt="gold coin"]', { timeout: 10000 }).should('be.visible');

    // Move to (0, 1) to pick up gold
    cy.get('[aria-label="Avanzar"]').click();

    // Assert hunter has gold
    cy.getGameStore().then(store => {
        expect(store.hunter().hasGold).to.equal(true);
    });

    // Turn around and move back to (0, 0)
    cy.get('[aria-label="Girar a la derecha"]').click();
    cy.get('[aria-label="Girar a la derecha"]').click();
    cy.get('[aria-label="Avanzar"]').click();

    // Assert hunter is back at (0, 0)
    cy.getGameStore().then(store => {
        expect(store.hunter().x).to.equal(0);
        expect(store.hunter().y).to.equal(0);
    });
  });
});

Cypress.Commands.add('loseLevel', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cy.getGameStore().then((store: any) => {
    store.updateGame({ lives: 1 });
    const board = JSON.parse(JSON.stringify(store.board()));
    board[0][1].visited = true;
    board[0][1].content = {
      type: 'wumpus',
      image: 'chars/default/wumpus.svg',
      alt: 'wumpus',
      ariaLabel: 'Wumpus',
    };
    store.updateGame({ board });
    cy.get('[aria-label="Avanzar"]').click();
  });
});

Cypress.Commands.add('addItemToInventory', (item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.getGameStore().then((store: any) => {
        const currentInventory = store.hunter().inventory || [];
        store.updateHunter({
            inventory: [...currentInventory, item]
        });
    });
});
