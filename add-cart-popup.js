define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'mage/translate',
    'jquery-ui-modules/widget'
], function (
    $,
    customerData,
    $t) {
    'use strict';

    $.widget('namespace.widgetName', {
        options: {
            freeShippingThreshold: 100,
            messageFreeShipping: 'Your order now have free shipping',
            modalOptions: {
                modalClass: 'add-to-cart-popup',
                title: $.mage.__("Popup Title"),
                buttons: [
                    {
                        text: 'Continue Shopping',
                        click: function () {
                            this.closeModal();
                        }
                    },
                    {
                        text: 'Proceed to Checkout',
                        click: function () {
                            window.location = window.checkout.checkoutUrl
                        }
                    }
                ]
            }
        },

        _init: function () {
            this.addHandlers();

            // $(document).on("ajax:addToCart",function(success){
            //     //popup modal code
            //     var popup = $('<div class="add-to-cart-modal-popup"/>')
            //         .html(
            //             //$('.page-title span').text()
            //             //+ '<span> has been added to cart.</span>'
            //             `
            //     <p>${$t('Hi, %1').replace('%1', customer.firstname)}
            //     ${$t('Items in cart: %1').replace('%1', cart.summary_count)}
            //     ${$t('Cart subtotal: %1').replace('%1', cart.subtotal)}</p>
            // `
            //     )
            //     .modal({
            //         modalClass: 'add-to-cart-popup',
            //         title: $.mage.__("Popup Title"),
            //         buttons: [
            //             {
            //                 text: 'Continue Shopping',
            //                 click: function () {
            //                     this.closeModal();
            //                 }
            //             },
            //             {
            //                 text: 'Proceed to Checkout',
            //                 click: function () {
            //                     window.location = window.checkout.checkoutUrl
            //                 }
            //             }
            //         ]
            //     });
            // popup.modal('openModal');
            // })
        },

        addHandlers() {
            this._on(document, {
                'ajax:addToCart': this.callPopup.bind(this)
            });
        },

        callPopup(){
            setTimeout(()=> {
                customerData.reload(['cart'], true);

                const customer = customerData.get('customer')();
                const cart = customerData.get('cart')();
                const formattedTotal = Number(cart.subtotalAmount).toFixed();
                const subtotalRemaining = this.options.freeShippingThreshold - cart.subtotalAmount;
                let popupWrapper = $('<div class="add-to-cart-modal-popup"/>');
                let popupContent;

                if (formattedTotal === '0' ) {
                    popupContent = `
                        <p>${$t('Hi, %1').replace('%1', customer.firstname)}</p>
                        <p>${$t('There are no products in the cart')}</p>
                    `;

                } else if (cart.subtotalAmount > 0 && cart.subtotalAmount < this.options.freeShippingThreshold) {
                  popupContent = `
                    <div class="progress-wrapper">
                        <div class="progress-bar">
                            <span class="progress-bar-fill" style="width: ${formattedTotal}%;">
                                <span class="percent-bar">${formattedTotal}%</span>
                            </span>
                        </div>
                    </div>
                    <p>${$t('Hi, %1').replace('%1', customer.firstname)}</p>
                    <p>You are ${subtotalRemaining}$ away from FREE shipping</p>
                    <p>${$t('Items in cart: %1').replace('%1', cart.summary_count)}</p>
                    <p>${$t('Cart subtotal: %1').replace('%1', cart.subtotal)}</p>
                  `;
                } else if (cart.subtotalAmount >= this.options.freeShippingThreshold) {
                    popupContent = `
                    <div class="progress-wrapper">
                        <div class="progress-bar">
                            <span class="progress-bar-fill" style="width: 100%;">
                                <span class="percent-bar">100%</span>
                            </span>
                        </div>
                    </div>
                    <p>${$t('Hi, %1').replace('%1', customer.firstname)}</p>
                    <p>${$t(this.options.messageFreeShipping)}</p>
                    <p>${$t('Items in cart: %1').replace('%1', cart.summary_count)}</p>
                    <p>${$t('Cart subtotal: %1').replace('%1', formattedTotal)}</p>
                    `;
                }

                popupWrapper.html(popupContent).modal(this.options.modalOptions).modal('openModal');
                //popupWrapper.;


                 // if (formattedTotal === '0' ) {
                    //     //popup modal code
                    //     let popup = $('<div class="add-to-cart-modal-popup"/>')
                    //         .html(
                    //             `
                    //                 <p>${$t('Hi, %1').replace('%1', customer.firstname)}</p>
                    //                 <p>${$t('Items in cart: %1').replace('%1', cart.summary_count)}</p>
                    //                 <p>${$t('Cart subtotal: %1').replace('%1', Number(cart.subtotalAmount).toFixed(0))}</p>
                    // `
                    //         )
                    //         .modal({
                    //             modalClass: 'add-to-cart-popup',
                    //             title: $.mage.__("Popup Title"),
                    //             buttons: [
                    //                 {
                    //                     text: 'Continue Shopping',
                    //                     click: function () {
                    //                         this.closeModal();
                    //                     }
                    //                 }
                    //             ]
                    //         });
                    //     popup.modal('openModal');
                    // }
                    // else if (cart.subtotalAmount > 0 && cart.subtotalAmount < this.options.freeShippingThreshold) {
                    //     const subtotalRemaining = this.options.freeShippingThreshold - cart.subtotalAmount;
                    //     let popupWithProgress = $('<div class="add-to-cart-modal-popup"/>')
                    //         .html(`
                    //             <div class="progress-wrapper">
                    //             <h2>Heyhey</h2>
                    //                 <div class="progress-bar">
                    //                     <span class="progress-bar-fill" style="width: ${formattedTotal}%;">
                    //                         <span class="percent-bar">${formattedTotal}%</span>
                    //                     </span>
                    //                 </div>
                    //             </div>
                    //             <p>${$t('Hi, %1').replace('%1', customer.firstname)}</p>
                    //             <p>You are ${subtotalRemaining}$ away from FREE shipping</p>
                    //             <p>${$t('Items in cart: %1').replace('%1', cart.summary_count)}</p>
                    //             <p>${$t('Cart subtotal: %1').replace('%1', cart.subtotal)}</p>
                    //             `
                    //         )
                    //         .modal({
                    //             modalClass: 'add-to-cart-popup',
                    //             title: $.mage.__("Popup Title"),
                    //             buttons: [
                    //                 {
                    //                     text: 'Continue Shopping',
                    //                     click: function () {
                    //                         this.closeModal();
                    //                     }
                    //                 },
                    //                 {
                    //                     text: 'Proceed to Checkout',
                    //                     click: function () {
                    //                         window.location = window.checkout.checkoutUrl
                    //                     }
                    //                 }
                    //             ]
                    //         });
                    //     popupWithProgress.modal('openModal');
                    // }


            }, 1800);
        },

    });

    return $.namespace.widgetName;
});