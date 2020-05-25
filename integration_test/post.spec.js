/* global cy */
describe('Post Page', () => {
  it('should redirect to /login if not logged in', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
  });
  it('should able to create Post without media', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('bello.io');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    const now = Date.now();
    cy.get('textarea[name="description"]').type(String(now));
    cy.get('[data-testid="create-post-form"] button[type="submit"]').click();
    cy.get('ul[data-testid="post-list"] li:first-child').contains(String(now));
  });
});
