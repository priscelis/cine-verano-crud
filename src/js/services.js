const URL_MOVIES = "http://localhost:3000/movies"

//CREATE - POST
async function createMovie() {
    let inputTitle = document.querySelector(".input-title")
    let inputDirector = document.querySelector(".input-director")
    let inputDescription = document.querySelector(".input-description")

    //Crea un objeto con los datos escritos en el formulario (Obtener los valores ingresados)
    const newMovie = {
        title: inputTitle.value,
        director: inputDirector.value,
        description: inputDescription.value
    }
    console.log(newMovie)
    // debugger;

    try {
        const response = await fetch(URL_MOVIES, {//petición get, envía los datos al servidor con fetch
            method: "POST",//para guardar los datos
            headers: {
                'Content-Type': 'application/json' //el contenido que maneja mi aplicación es de tipo json
            },
            body: JSON.stringify(newMovie)//convierte el objeto a texto json
        })//fin petición

        if (response.ok) {
            const data = await response.json()
            alert("Película guardada con éxito: " + data.title)
            formulario.reset() //limpiar formulario
            window.location.href = "../index.html"// redirigir al index
        }
    } catch (error) {
        console.error("Error de red:", error)
        alert("No se pudo conectar al servidor.")
    }
}

const formulario = document.getElementById("formulario")
function loadingPostService() {
    formulario.addEventListener("submit", async function (e) {
        e.preventDefault()//Evita que se recargue la página
        createMovie()
    })
}

if(formulario){//si existe, muéstrame la función
    loadingPostService()
}

//READ - GET
async function getMovies() {
    const response = await fetch(URL_MOVIES, {//petición get
        method: "GET",
        headers: {
            'Content-Type': 'application/json' //el contenido que maneja mi aplicación es de tipo json
        }
    })//fin petición
    const movieData = await response.json()
    console.log(movieData)
    return movieData
}
getMovies()

//PRINT 
let moviesContainer = document.getElementById("moviesContainer")//?

let divCards = document.querySelector(".cards")
console.log(divCards)
async function printMovies() {
    let listMovies = await getMovies();
    // console.log("Películas cargadas: ", listMovies)
    divCards.innerHTML = "" //limpiar antes de imprimir

    const printMovieList = listMovies.map(movie => {
        return divCards.innerHTML += `<div class="card-movie">
            <h3 class="title-movie">${movie.title}</h3>
            <p class="director-movie"><span>Director:</span> ${movie.director}</p>
            <p class="description-movie"><span>Descripción:</span> ${movie.description}</p>
            <div class="btn-delete-update">
            <a class="btns btn-delete" onclick="deleteMovie('${movie.id}')">Borrar</a>
            <a href="pages/update.html" class="btns btn-update" onclick="updateMovie('${movie.id}')">Editar</a>
            </div>
            </div>`
    }).join("")
    return printMovieList
    // divCards.innerHTML = printMovieList
}
// window.addEventListener("DOMContentLoaded", printMovies);

//UPDATE - PUT
const formularioUpdate = document.getElementById("formulario-update")
//recuperar el ID guardado desde localstorage
function setMovieToEdit(id){
    localStorage.setItem("movieId", id)
}

//cargar valores al formulario
async function loadMovieData(id){//no funciona
    try {
        const response = await fetch(`${URL_MOVIES}/${id}`)
        if(!response.ok) throw new Error("Película no encontrada")

        const movie = await response.json()

        document.querySelector(".input-title").value = movie.title
        document.querySelector(".input-director").value = movie.director
        document.querySelector(".input-description").value = movie.description
    } catch (error) {
        console.log("Error al cargar la película:", error)
        alert("No se pude cargar la información de la película.")
    }
}
//actualizar datos
async function updateMovie(id) {
    const newMovie = {
        title: document.querySelector(".input-title").value,
        director: document.querySelector(".input-director").value,
        description: document.querySelector(".input-description").value
    }

    //Crea un objeto con los datos escritos en el formulario (Obtener los valores ingresados)
    
    console.log(newMovie)
    // debugger;

    try {
        const response = await fetch(`${URL_MOVIES}/${id}`, {//petición get, envía los datos al servidor con fetch
            method: "PUT",//para guardar los datos
            headers: {
                'Content-Type': 'application/json' //el contenido que maneja mi aplicación es de tipo json
            },
            body: JSON.stringify(newMovie)//convierte el objeto a texto json
        })//fin petición

        if (response.ok) {
            const data = await response.json()
            alert("Película guardada con éxito: " + data.title)
            localStorage.removeItem("movieId")
            window.location.href = "../index.html"
            // formulario.reset() //limpiar formulario
        }else{
            alert("Error al actualizar la película")
        }

    } catch (error) {
        console.error("Error de red:", error)
        alert("No se pudo conectar al servidor.")
    }
}


if (formularioUpdate) {
    formularioUpdate.addEventListener("submit", async function (e) {
        e.preventDefault();
        const movieId = localStorage.getItem("movieId");
        if (movieId) {
            updateMovie(movieId);
        }
    });

    const movieId = localStorage.getItem("movieId");
    if (movieId) {
        loadMovieData(movieId);
    }
}

//DELETE - DELETE
async function deleteMovie(id) {
    //método pop
    const response = await fetch(`http://localhost:3000/movies/${id}`, {//petición get
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json' //el contenido que maneja mi aplicación es de tipo json
        }
    })//fin petición
    const reload = document.getElementsByClassName("btn-delete")
    if (response.ok) {
        const data = await response.json()
        alert("Película eliminada con éxito: " + data.title)
        reload.addEventListener("click", _ => {
            location.reload();
        })
        //formulario.reset() //limpiar formulario
        printMovies()
    } else {
        console.error("Error")
    }
}