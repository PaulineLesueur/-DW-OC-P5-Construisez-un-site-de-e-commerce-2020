const cartItems = JSON.parse(localStorage.getItem('cameraCart')) || [];
const apiPost = "http://localhost:3000/api/cameras/order";
const prixFinal = document.getElementById('total-price');
const formulaire = document.getElementById("formulaire");

function recupCamera() {
    let titre = document.querySelector("#msg-js")
    let inputJS = document.getElementById("input-js")

    //si le panier ne contient pas de produit, on affiche que le panier est vide
    if (!cartItems.length) {
        titre.innerHTML = 
            `
                <h3><i class="fas fa-shopping-cart"></i> Panier</h3>
                <h4>Votre panier est vide !</h4>
            `;

        //on masque également toutes les informations relatives à la commande
        document.getElementById("total-price").style.visibility = "hidden";
        document.getElementById("formulaire").style.visibility = "hidden";
        document.querySelector(".clear").style.visibility = "hidden";
        document.querySelector(".user-infos").style.visibility = "hidden";
        document.querySelector(".user-infos").style.width = "0";
        document.getElementById("order-page").style.width = "100vw";
        document.getElementById("order-page").style.padding = "5vh 0 0 0";
        document.getElementById("recap-order").style.width = "100vw";

    } else { //si le panier contient des produits, on les affiche
        titre.innerHTML = 
            `
            <h3><i class="fas fa-shopping-cart"></i> Panier</h3>
            `;

        //pour chaque produit, on affiche ses informations
        cartItems.forEach(cartItem => {

            inputJS.innerHTML += 
                `
                <div class="order-product">
                    <img src="${cartItem.imageUrl}" alt="appareil ${cartItem.name}" />
                    <div class="infos-product-order">
                        <h4>${cartItem.name}</h4>
                        <p><span>Prix unitaire :</span> ${cartItem.price}€</p>
                        <p><span>Prix total :</span> <span class="orderTotalPrice">${cartItem.quantity * cartItem.price}</span>€</p>
                        <p><span>Objectif :</span> ${cartItem.lense}</p>
                        <p><span>Quantité :</span> ${cartItem.quantity}</p> 
                    </div>
                </div>
                `

            //addition des prix des différents produits pour afficher le prix total du panier
            let totalPrice = 0;
            const prixGlobal = [...document.getElementsByClassName("orderTotalPrice")]

            prixGlobal.forEach(prix => {
               let cameraPrice = parseInt(prix.innerHTML, 10)
               totalPrice += cameraPrice;
            })

            prixFinal.innerHTML = "Prix total : " + totalPrice + "€";
            
        });
    }
}

//on met une fonction permettant de vider le panier
function clearBasket() {
    localStorage.clear();
    setTimeout(function() {location.reload(); }, 500);
};

//on déclare les champs du formulaire de commande
function confirmerCommande() {
    let firstName = document.getElementById("firstName").value
    let lastName = document.getElementById("lastName").value
    let address = document.getElementById("address").value
    let city = document.getElementById("city").value
    let email = document.getElementById("email").value

    //on place les éléments requis dans un objet puis on déclare un tableau vide
    let contact = {
        firstName, lastName, address, city, email
    }

    const products = [];

    //pour chaque produit, on pousse son identifiant dans le tableau
    cartItems.forEach(item => {
        products.push(item.id)
    })

    //on converti le tout en format JSON
    const request = new Request(apiPost, {
        method : 'POST',
        body : JSON.stringify({contact, products}),
        headers : new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    });

    //mise en place d'une fonction d'envoie du formulaire
    fetch(request)
    .then(response => response.json())
    .then((response) => {
        //si le formulaire n'est pas valide, on affiche une alerte
        if (formulaire.checkValidity() === false) {
            swal("Oops, il manque quelque chose", "Vérifiez que tous les champs sont bien remplis", "error");

            //si le formulaire est valide, alors on envoie les informations au localstorage et on affiche un message de succès
        } else if(formulaire.checkValidity() === true) {
            let getOrderId = response.orderId
            let orderCost = prixFinal.innerHTML;
                
            localStorage.clear();
            let infoConf = {getOrderId, orderCost}
            localStorage.setItem('checkout', JSON.stringify(infoConf))
            swal("Votre commande a bien été validé, vous allez être redirigé", "", "success");
            setTimeout(function() {window.location = 'confirm.html'; }, 2000);
        }
    })
}

window.onload = () => { //force le lancement de la fonction recupCamera() au chargement de la page
    recupCamera();
}