describe('Edge Cases and Hazard Interactions', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.clearLocalStorage();

        // Use a mobile viewport to ensure mobile controls are visible and testable
        cy.viewport('iphone-xr');

        cy.get('lib-game-config', { timeout: 20000 }).should('be.visible');
        cy.get('input#player').clear();
        cy.get('input#player').type('Edge Case Hero');
        cy.get('.char-selector label').first().click();
        cy.get('button.start-game').click();
        cy.get('.story-container', { timeout: 15000 }).click();
        cy.get('.board', { timeout: 15000 }).should('be.visible');
    });

    it('should handle wall collisions and show correct message', () => {
        // Facing RIGHT at (0,0). Turn RIGHT 3 times to face UP.
        cy.get('[aria-label="Girar a la derecha"]').click(); // DOWN
        cy.get('[aria-label="Girar a la derecha"]').click(); // LEFT
        cy.get('[aria-label="Girar a la derecha"]').click(); // UP

        cy.get('[aria-label="Avanzar"]').click();

        cy.get('.game-message', { timeout: 10000 }).should('be.visible');
        cy.compareSnapshot('edge-case-wall-collision');
    });

    it('should show message when shooting with no arrows', () => {
        // Initial 1 arrow. Shoot it.
        cy.get('[aria-label="Disparar flecha"]').click();

        // Try to shoot again
        cy.get('[aria-label="Disparar flecha"]').click();

        cy.get('.game-message', { timeout: 10000 }).should('be.visible');
        cy.compareSnapshot('edge-case-no-arrows');
    });

    it('should survive a wumpus encounter with a shield', () => {
        cy.addItemToInventory({
            name: 'Escudo',
            icon: 'shield.svg',
            effect: 'shield'
        });

        // Place a wumpus at (0, 1)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cy.getGameStore().then((store: any) => {
            const board = JSON.parse(JSON.stringify(store.board()));
            board[0][1].content = {
                type: 'wumpus',
                image: 'chars/default/wumpus.svg',
                alt: 'wumpus',
                ariaLabel: 'wumpus',
            };
            store.updateGame({ board });
        });

        // Move to (0, 1) - Default facing RIGHT
        cy.get('[aria-label="Avanzar"]').click();

        // Verify alive and lives (easy mode has 8 lives)
        cy.getGameStore().then(store => {
            const hunter = store.hunter();
            expect(store.isAlive()).to.equal(true);
            expect(store.lives()).to.equal(8);
            expect(hunter.inventory).to.have.length(0);
        });

        cy.get('.game-message', { timeout: 10000 }).should('be.visible');
        cy.compareSnapshot('edge-case-shield-save');
    });

    it('should rewind position when falling into a pit with rewind item', () => {
        cy.addItemToInventory({
            name: 'Rebobinar',
            icon: 'rewind.svg',
            effect: 'rewind'
        });

        // Place a pit at (0, 1)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cy.getGameStore().then((store: any) => {
            const board = JSON.parse(JSON.stringify(store.board()));
            board[0][1].content = {
                type: 'pit',
                image: 'boardicons/pit.svg',
                alt: 'pit',
                ariaLabel: 'pit',
            };
            store.updateGame({ board });
        });

        // Move to (0, 1)
        cy.get('[aria-label="Avanzar"]').click();

        // Should be back at (0, 0)
        cy.getGameStore().then(store => {
            const hunter = store.hunter();
            expect(hunter.x).to.equal(0);
            expect(hunter.y).to.equal(0);
        });

        cy.get('.game-message', { timeout: 10000 }).should('be.visible');
        cy.compareSnapshot('edge-case-rewind-save');
    });
});
