const checkout = JSON.parse(localStorage.getItem('checkout')) || [];
let inputJS = document.getElementById("input-js");

//on affiche un message de confirmation de commande avec son numéro et le prix total
inputJS.innerHTML += 
        `
            <h3>Récapitulatif</h3>
            <h4>Merci pour votre commande !</h4>
            <div class="container-confirm">
                <p>
                    <span>Numéro de commande :</span><br>
                    ${checkout.getOrderId}
                </p>
                <p>
                    <span>Prix total :</span><br>
                    ${checkout.orderCost}
                </p>
            </div>
            <h4>A bientôt sur Oriphotography !</h4>
        `