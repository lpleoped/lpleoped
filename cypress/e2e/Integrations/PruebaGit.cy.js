/// <reference types="cypress" />

require('cypress-plugin-tab');
require('cypress-xpath');

const tiempo = 2000;
const usuario = 'test@yopmail.com';
const pass = 'Aa123123'


describe('Order - Golden Arrow Flow E2E- Reto01', () => {

    it('Order - Golden Arrow Flow E2E - LOGIN + SEARCH - Éxito', () => {
        cy.visit('https://www.tiendamia.com.do/');
        cy.title().should('eq', 'Compra en USA y Recibe en República Dominicana');
        cy.wait(tiempo);
        cy.get('meta[name="title"]').should('be.not.visible');
        cy.wait(3000);
        cy.get('._show > .modal-inner-wrap > .modal-header > .action-close').should('be.visible').click();
        cy.xpath("//span[contains(text(),'Mi cuenta')]").click();
        cy.xpath("//a[contains(@class,'button-text-icon-large primary mt-2')]").click();
        cy.get('.login-title-customer').should('contain', 'Ingresar');
        cy.get('.login-container > .block.block-customer-login > .block-content > #login-form > .fieldset > .email > .control > #email').should('be.visible').type(usuario);
        cy.xpath('//body/div[4]/main[1]/div[2]/div[1]/div[2]/div[1]/div[4]/div[1]/form[1]/fieldset[1]/div[2]/div[2]/input[1]').should('be.visible').type(pass);
        // cy.get('#recaptcha-f979c2ff515d921c34af9bd2aee8ef076b719d03 > [style="width: 304px; height: 78px;"] > div > iframe').should('be.visible').check();
        cy.wait(tiempo);
        // cy.get(".g-recaptcha").should("not.be.checked");
        //cy.wait(tiempo);
        // cy.get(".g-recaptcha").click(5,5);
        // cy.get(".recaptcha-checkbox goog-inline-block recaptcha-checkbox-unchecked rc-anchor-checkbox recaptcha-checkbox-expired").should('exist');

        cy.wait(30000)
        cy.get('.fieldset > .actions-toolbar > div.primary > #send2').click();
        cy.xpath("//body/div[4]/main[1]/div[2]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/a[1]").should('be.visible');
        cy.xpath("//body/div[4]/main[1]/div[2]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/p[1]/a[1]").should('have.attr', 'href', 'https://www.tiendamia.com.do/product/amz/B07QHXWZ2M');
        cy.xpath("//body/div[4]/main[1]/div[2]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/p[1]/a[1]/span[2]").should('contain', '87,89');
        cy.xpath("//body/div[4]/main[1]/div[2]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/a[1]").click({ force: true });

    });
    it.only('Order - Golden Arrow Flow E2E - PDP + CART + CHECKOUT - Éxito', () => {
        var precioTotalCalculado = 0;
        var precioTotal = 0;
        cy.visit('https://www.tiendamia.com.do/product/amz/B07QHXWZ2M');
        cy.wait(tiempo);
        // Mando el producto al CART y accedo al cart
        cy.get('#product-checkout-button').should('be.visible').click();
        cy.wait(1000)
        cy.visit('https://www.tiendamia.com.do/product/amz/B097CNMZF5');
        cy.wait(tiempo);
        // Mando el producto al CART y accedo al cart
        cy.get('#product-checkout-button').should('be.visible').click();
        cy.wait(1000)
        //Tomo el subtotal del cart
        var precioTotalElemento = cy.get('.sub > .amount > .price');
        // Convierto en número el precio total del submmary y me lo llevo con el then para poder usarlo luego
        precioTotalElemento.invoke('text').then((texto) => {
            texto = texto.slice(3);
            precioTotal = parseFloat(texto);
            cy.log("Precio Subtotal hasta el momento:" + precioTotal);
        }).then(() => {
            // En esta variable ya tengo el valor del precio total del submarry
            cy.log(precioTotal);
            //Itero por cada elemento del CART
            cy.get('tbody.cart.item').each(($celda, i) => {
                cy.log("Iteración: " + i);
                cy.log("Estamos en celda: " + $celda);
                cy.get('.cart-price > .price').should('be.visible');
                //Busco el elemento de precio
                const precioCelda = $celda.find('.cart-price > .price');
                // Obtener el contenido de la celda de precio
                const precioText = precioCelda.text().slice(3).replace(',', '.');
                var precio = parseFloat(precioText);
                cy.log("Precio Item: " + precio);
                cy.wait(10000)
                const cantItemCelda = $celda.find('.col > .field > .control input');
                cy.log("Cantidad de productos: " + cantItemCelda);

                cy.get(cantItemCelda).invoke('val').then((valorOtroElemento) => {
                    // Realizar la multiplicación entre precio y el valor del otro elemento
                    // cy.log("Esto debería ser un 1: " + valorOtroElemento);
                    const resultadoMultiplicacion = precio * parseFloat(valorOtroElemento);
                    // cy.log("Resultado de la multiplicación: " + resultadoMultiplicacion);
                    // cy.log("El precio total calculado es: " + precioTotalCalculado);
                    precioTotalCalculado = precioTotalCalculado + resultadoMultiplicacion;
                    cy.log("Precio total calculado hasta ahora: " + precioTotalCalculado);
                })
            }).then(() => {
                cy.log(precioTotalCalculado);
                cy.wrap(precioTotal).should('eq', precioTotalCalculado);
            })

        })
    });

});
