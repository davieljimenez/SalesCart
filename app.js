const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener("DOMContentLoaded", () => {
    fetchData()

    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        showCarrito()
    }
})
cards.addEventListener("click", e => {
    addCarrito(e)
})

items.addEventListener("click", e => {
    btnAccion(e)
})


const fetchData = async() => {
    try {

        const resp = await fetch("api.json")
        const data = await resp.json()
            // console.log(data)
        showCards(data)
    } catch (error) {
        console.log(error)

    }
}

const showCards = data => {
    data.forEach(product => {
        templateCard.querySelector("h5").textContent = product.title
        templateCard.querySelector("p").textContent = product.precio
        templateCard.querySelector("img").setAttribute("src", product.thumbnailUrl)
        templateCard.querySelector(".btn-success").dataset.id = product.id


        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)


}

const addCarrito = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains("btn-success"))
    if (e.target.classList.contains("btn-success")) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objecto => {
    // console.log(objecto);
    const product = {
        id: objecto.querySelector(".btn-success").dataset.id,
        title: objecto.querySelector("h5").textContent,
        precio: objecto.querySelector("p").textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(product.id)) {
        product.cantidad = carrito[product.id].cantidad + 1
    }

    carrito[product.id] = {...product }
    showCarrito()


}

const showCarrito = () => {
    // console.log(carrito)
    items.innerHTML = ""
    Object.values(carrito).forEach(product => {
        templateCarrito.querySelector("th").textContent = product.id
        templateCarrito.querySelectorAll("td")[0].textContent = product.title
        templateCarrito.querySelectorAll("td")[1].textContent = product.cantidad
        templateCarrito.querySelector(".btn-outline-success").dataset.id = product.id
        templateCarrito.querySelector(".btn-outline-danger").dataset.id = product.id
        templateCarrito.querySelector("span").textContent = product.cantidad * product.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)





    })
    items.appendChild(fragment)

    showFooter()

    localStorage.setItem("carrito", JSON.stringify(carrito))

}

const showFooter = () => {
    footer.innerHTML = ""
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelector("span").textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnClean = document.getElementById("vaciar-carrito")
    btnClean.addEventListener("click", () => {
        carrito = {}
        showCarrito()
    })


}

const btnAccion = e => {
    // console.log(e.target)
    //Aumentar boton
    if (e.target.classList.contains("btn-outline-success")) {

        // console.log(carrito[e.target.dataset.id])
        const product = carrito[e.target.dataset.id]
        product.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...product }
        showCarrito()
    }

    //Disminuir boton:
    if (e.target.classList.contains("btn-outline-danger")) {
        const product = carrito[e.target.dataset.id]
        product.cantidad--
            if (product.cantidad === 0) {
                delete carrito[e.target.dataset.id]
            }
        showCarrito()
    }

    e.stopPropagation()
}