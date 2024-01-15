let movieList = document.getElementById("movieList");
let movieInfo = document.getElementById("movieInfo");

console.log("Hej");
fetch("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=88d6f906b386ac47c004701d8f545df8")
.then(res => res.json())
.then(data => {
    
    printMovieList(data);
})

function printMovieList(movies) {
    // console.log("movie list", movies);

    movies.results.forEach(movie => {
        
     
        let li = document.createElement("li");
        li.innerText = movie.original_title;

        li.addEventListener("click", () => {
            // console.log("klick på knapp", movie.id)
            printMovieInfo(movie);
        })

        movieList.appendChild(li);
    });
}

function printMovieInfo(movie) {
    movieInfo.innerHTML = "";

    console.log("Movie Info", movie);

    let movieDiv = document.createElement("div");
    let movieHeadline = document.createElement("h2");
    movieHeadline.innerText = movie.original_title;

    let movieText = document.createElement("p");
    movieText.innerText = movie.overview;

    let movieImg = document.createElement("img");
    movieImg.width = 350;
    movieImg.src = "http://image.tmdb.org/t/p/original/" + movie.poster_path;
    

    movieDiv.append(movieHeadline, movieText, movieImg);
    movieInfo.appendChild(movieDiv);
}