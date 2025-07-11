describe('Flujo de Autenticación', () => {

  const generateUniqueUsername = () => `usuario`;
  
  it('Debería registrar un nuevo usuario', () => {
    cy.visit('/registrar');
    
    cy.get('ion-input[placeholder="Usuario (3-8 caracteres)"]').type('nuevo');
    cy.get('ion-input[placeholder="Nombre"]').type('Juan');
    cy.get('ion-input[placeholder="Apellido"]').type('Pérez');
    // cy.get('ion-input[placeholder="Seleccionar fecha"]').click();
    cy.get('ion-input[placeholder="Contraseña (4 dígitos)"]').type('1234');
    // Seleccionar fecha en el datepicker
    cy.get('ion-button').contains('Ingresar').click();
    
    cy.url().should('include', '/home');

    cy.get('ion-chip').click();

    cy.get('ion-button').contains('Cerrar sesión').click();
    
  });

  it('Debería iniciar sesión con credenciales válidas', () => {
    const username = generateUniqueUsername();
    
  
    cy.session([username, 'registro'], () => {
      cy.visit('/registrar');
      cy.get('ion-input[placeholder="Usuario (3-8 caracteres)"]').type(username);
      cy.get('ion-input[placeholder="Nombre"]').type('Juan');
      cy.get('ion-input[placeholder="Apellido"]').type('Pérez');
      cy.get('ion-input[placeholder="Contraseña (4 dígitos)"]').type('1234');
      cy.get('ion-button').contains('Ingresar').click();
      cy.url().should('include', '/home');
    });

    cy.visit('/login');
    cy.get('ion-input[placeholder="Usuario (3-8 caracteres)"]').type(username);
    cy.get('ion-input[placeholder="Contraseña (4 dígitos)"]').type('1234');
    cy.get('ion-button').contains('Ingresar').click();
    cy.url().should('include', '/home');

    cy.get('ion-chip').click();

    cy.get('ion-button').contains('Cerrar sesión').click();
  });

  it('Debería mostrar error con credenciales inválidas', () => {
   

    const username = generateUniqueUsername();

    cy.session([username, 'registro'], () => {
      cy.visit('/registrar');
      cy.get('ion-input[placeholder="Usuario (3-8 caracteres)"]').type(username);
      cy.get('ion-input[placeholder="Nombre"]').type('Juan');
      cy.get('ion-input[placeholder="Apellido"]').type('Pérez');
      cy.get('ion-input[placeholder="Contraseña (4 dígitos)"]').type('1234');
      cy.get('ion-button').contains('Ingresar').click();
      cy.url().should('include', '/home');
    });

     cy.visit('/login');
    
    cy.get('ion-input[placeholder="Usuario (3-8 caracteres)"]').type('falso');
    cy.get('ion-input[placeholder="Contraseña (4 dígitos)"]').type('4444');
    cy.get('ion-button').contains('Ingresar').click();
    
    cy.url().should('include', '/login');
  });
});