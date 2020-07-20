const apiCameras = "http://localhost:3000/api/cameras"
const inputJS = document.getElementById("input-js")

async function addContent() {
    let response = await fetch(apiCameras)
    let data = await response.json()
    .then((data) => {
        //pour chaque item, on déclare un objet contenant les informations de l'appareil
        data.forEach((item)  => {
            const { name, price, _id, description, imageUrl } = item;
            //puis on affiche ces informations sous forme HTML
            inputJS.innerHTML += 
                `
                <div class="product-list">
                        <div class="product-illu">
                        <img src="${imageUrl}" alt="appareil ${name}" />
                        </div>
                        <p>${name}<br>
                        <span>${price/100}€</span></p>
                        <div class="product-description">
                            <p>${description}</p>

                            <form>
                                <input type="button" onclick="window.location.href = 'product.html?id=${_id}';" value="Voir le produit"/>
                            </form>
                        </div>
                </div>
                ` 
            })
        })
        return data;
    }
    

window.onload = () => { // Force le lancement de la fonction addContent() au chargement de la page
    addContent();
}