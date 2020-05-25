/* global cy */
describe('Auth Page', () => {
  it('should able to login', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('bello.io');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
  });
  it('should redirect to / if logged in for visiting /login', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('bello.io');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
    cy.visit('/login');
    cy.location('pathname').should('eq', '/');
  });
  it('should able to prevent user from register', () => {
    cy.visit('/register');
    cy.get('input[name="username"]').type('bello.io');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.get('form').contains('User already exists. Please Log in.');
  });
});
