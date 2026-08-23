// Prevent uncaught exceptions from third-party site scripts
// from failing tests that are otherwise passing
Cypress.on('uncaught:exception', () => {
    return false;
});
