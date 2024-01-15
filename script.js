let movieList = document.getElementById("movieList");
let movieInfo = document.getElementById("movieInfo");
const searchMovieInput = document.getElementById("searchMovieInput");
const searchButton = document.getElementById("searchButton");
let watchlist = [];
const showWatchlistButton = document.getElementById("showWatchlistButton");
let watchlistTitles = [];

console.log("Hej");
fetch("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=88d6f906b386ac47c004701d8f545df8")
.then(res => res.json())
.then(data => {
    
    printMovieList(data.results);
    watchlistButtonFunction(data);
})

function printMovieList(movies) {
    // console.log("movie list", movies);
    movieList.innerHTML = "";
    movies.forEach(movie => {
        
        
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
    
    addMovieToList.innerText = "Add to Watchlist";
    let addMovieToList = document.createElement("button");
    
    addMovieToList.addEventListener("click", () => {
        watchlist.push(movie.id);
        console.log(watchlist);
        let watchlistStringify = JSON.stringify(watchlist);
        localStorage.setItem("Watchlist", watchlistStringify);
    })
    
    movieDiv.append(movieHeadline, addMovieToList, movieText, movieImg);
    movieInfo.appendChild(movieDiv);
}

searchButton.addEventListener("click", () => {
    
    search = searchMovieInput.value;
    //search = "Blade Runner" 
    fetch("https://api.themoviedb.org/3/search/movie?query="+ search +"&include_adult=false&language=en-US&page=1&api_key=88d6f906b386ac47c004701d8f545df8")
    .then(res => res.json())
    .then(data1 => {
        movieList.innerHTML = "";
        console.log(data1);
        printMovieList(data1);
    })
})


function watchlistButtonFunction(movies) {
    showWatchlistButton.addEventListener("click", () => {
        watchlist = JSON.parse(localStorage.getItem("Watchlist"));

        for(let i = 0; i < watchlist.length; i++) {
            fetch("https://api.themoviedb.org/3/movie/"+ watchlist[i] +"?language=en-US&api_key=88d6f906b386ac47c004701d8f545df8")
            .then(res => res.json())
            .then(data2 => {
                watchlistTitles.push(data2)
            })
        }
        printMovieList(watchlistTitles);
    })
}

