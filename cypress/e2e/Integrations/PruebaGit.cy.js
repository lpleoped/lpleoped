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
    
    
    const PRODUCT_URL_1 = 'https://www.tiendamia.com.do/product/amz/B07QHXWZ2M';
    const PRODUCT_URL_2 = 'https://www.tiendamia.com.do/product/amz/B097CNMZF5';
    const CHECKOUT_BUTTON_SELECTOR = '#product-checkout-button';
    const CART_PRICE_SELECTOR = '.cart-price > .price';
    const CART_ITEM_SELECTOR = 'tbody.cart.item';
    
    const addProductToCart = (productURL) => {
        cy.visit(productURL);
        cy.get(CHECKOUT_BUTTON_SELECTOR).should('be.visible').click();
    };
    
    it.only('Order - Golden Arrow Flow E2E - PDP + CART + CHECKOUT - Éxito', (PRODUCT_URL_1, PRODUCT_URL_2,CART_PRICE_SELECTOR, CART_PRICE_SELECTOR) => {
        let precioTotalCalculado = 0;
        let precioTotal = 0;
    
        addProductToCart(PRODUCT_URL_1);
        addProductToCart(PRODUCT_URL_2);
    
        cy.get('.sub > .amount > .price').invoke('text').then((texto) => {
            precioTotal = parseFloat(texto.slice(3).replace(',', '.'));
            cy.log("Precio Subtotal hasta el momento:" + precioTotal);
        }).then(() => {
            cy.get(CART_ITEM_SELECTOR).each(($celda) => {
                const precioCeldaText = $celda.find(CART_PRICE_SELECTOR).text();
                const precio = parseFloat(precioCeldaText.slice(3).replace(',', '.'));
                const cantItemCelda = $celda.find('.col > .field > .control input');
    
                cy.wrap(cantItemCelda).invoke('val').then((valorOtroElemento) => {
                    precioTotalCalculado += precio * parseFloat(valorOtroElemento);
                });
            }).then(() => {
                cy.log("Precio total calculado: " + precioTotalCalculado);
                expect(precioTotal).to.eq(precioTotalCalculado);
            });
        });
    });

});
