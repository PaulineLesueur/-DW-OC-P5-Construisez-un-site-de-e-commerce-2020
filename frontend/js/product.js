const apiCameras = "http://localhost:3000/api/cameras"
const inputJS = document.getElementById("input-js")
const cameraLenses = document.getElementById("camera-lenses")

async function addContent() {
    let response = await fetch(apiCameras)
    let data = await response.json()
    .then((data) => {
        //pour chaque item, on déclare un objet contenant les informations de l'appareil
        data.forEach((item)  => {
            const { name, price, lenses, _id, description, imageUrl } = item;
            let id = `${_id}`;  
            //en fonction de son identifiant, si un produit se trouve dans le tableau on affiche ses informations
            if (window.location.href.indexOf(id) > -1) {
                inputJS.innerHTML += 
                    `<h4>${name}</h4>
                    <div class="container-product">
                        <img src="${imageUrl}" alt="appareil ${name}" />
                        <div class="product-information">
                            <div class="product-description">
                                <p>${description}</p>
                            </div>
                            <div class="product-price-quantity">
                                <div class="product-price">
                                ${price/100}€
                                </div>
                                <div class="product-quantity">
                                    <label for="quantity-wanted">Quantité :</label>
                                    <input step="number" placeholder="quantité" id="quantity-wanted" class="nbr" type="number" min="1" max="99" value="1"></input>
                                </div>
                            </div>
                            <button id="add-item" type="button" onclick="">Ajouter au panier</button>
                        </div>
                    </div>
                    `;

                const cart = document.getElementById("add-item")
                //mise en place d'une boucle pour afficher les objectifs des appareils
                for (let i = 0; i < lenses.length; i++) {
                    cameraLenses.innerHTML +=
                        `<option value="${lenses[i]}" selected="selected">${lenses[i]}</option>`
                }

                //mise en place d'un événement au clic du bouton "ajouter au panier"                
                cart.addEventListener('click', function(e) {
                    //on déclare les valeurs de l'objectif & du nombre sélectionnés par l'utilisateur
                    let lense = document.querySelector('select').value;
                    let quantity = document.getElementById("quantity-wanted").value;

                    //si l'utilisateur n'a pas sélectionné au moins 1 appareil on renvoit un message d'erreur, sinon les informations de celui-ci sont stockées dans cartContent et on affiche un message de succès
                    if (quantity < 1) {
                        swal( "Aucun article trouvé", "Sélectionnez au moins 1 appareil !", "error");
                    } else { 
                        let cartContent = {
                            "id" : id,
                            "name" : name,
                            "price" : price/100,
                            "lense" : lense,
                            "imageUrl" : imageUrl,
                            "quantity" : quantity
                        };    
                        swal("L'article a bien été ajouté au panier !", "", "success");

                        const cartItems = JSON.parse(localStorage.getItem('cameraCart')) || [];
                        //si le localStorage est vide, alors on pousse l'item sélectionné dedans
                        if (cartItems == null) {
                            localStorage.setItem('cameraCart', JSON.stringify(cartContent));
                        } else {
                            let sameItem = false;
                            for (let i = 0; i < cartItems.length; i++) {
                                //si un objet a déjà été stocké dans le localStorage, alors on évite les doublons en additionnant les quantités sélectionnées par l'utilisateur
                                if (cartItems[i].name == cartContent.name && cartItems[i].lense == cartContent.lense) {
                                    let cartItemsQuantity = Number(cartItems[i].quantity);
                                    let cartContentQuantity = Number(cartContent.quantity);
                                    let totalQuantity = cartItemsQuantity + cartContentQuantity;
                                    
                                    cartItems[i].quantity = totalQuantity.toString();
                                    sameItem = true; 
                                }
                            } 

                            //s'il n'y a aucun doublon, alors on pousse l'item dans le localStorage
                            if(sameItem == false) {
                                cartItems.push(cartContent);
                            }
                        }
                        
                        localStorage.setItem('cameraCart', JSON.stringify(cartItems));
                    }
                });
            }
        })
    })
    return data;
}

window.onload = () => { // Force le lancement de la fonction addContent() au chargement de la page
    addContent();
}