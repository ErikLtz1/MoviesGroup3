let movieList = document.getElementById("movieList");
let movieInfo = document.getElementById("movieInfo");
const searchMovieInput = document.getElementById("searchMovieInput");
const searchButton = document.getElementById("searchButton");
let watchlist = [];
const showWatchlistButton = document.getElementById("showWatchlistButton");
let watchlistTitles = [];
let hideAddToList = 0;
const home = document.getElementById("home");
const showWatchlist = document.getElementById("showWatchlist");
const reviewsList = document.getElementById("reviewsList");
const recommendationsUl = document.getElementById("recommendations");
const recommendationsTitleDiv = document.getElementById("recommendationsTitleDiv");
const reviewsTitleDiv = document.getElementById("reviewsTitleDiv");
localStorage.setItem("Watchlist", "");


fetch("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=88d6f906b386ac47c004701d8f545df8")
.then(res => res.json())
.then(data => {
    
    printMovieList(data.results);
    watchlistButtonFunction(data);
    home.addEventListener("click", () => {
        printMovieList(data.results);
        showWatchlist.appendChild(showWatchlistButton);
        movieInfo.innerHTML = "";
        reviewsList.innerHTML = "";
    })
})

function printMovieList(movies) {
    // console.log("movie list", movies);
    movieList.innerHTML = "";
    movies.forEach(movie => {
        
        let li = document.createElement("li");
        li.innerText = movie.original_title;
        
        li.addEventListener("click", () => {
            // console.log("klick på knapp", movie.id)
            reviewsList.innerHTML = "";
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
    
    let addMovieToList = document.createElement("button");
    addMovieToList.innerText = "Add to Watchlist";
    
    addMovieToList.addEventListener("click", () => {

        if (!watchlist.includes(movie.id)) {
            watchlist.push(movie.id);
            let watchlistStringify = JSON.stringify(watchlist);
            localStorage.setItem("Watchlist", watchlistStringify);
            alert("This movie has been added to your watchlist!")
        } else {
            alert("This movie is already in your watchlist");
        }
        })

    let seeMovieReviews = document.createElement("button");
    seeMovieReviews.innerText = "See Reviews";
    seeMovieReviews.addEventListener("click", () => {
        reviewsList.innerHTML = "";
        reviewsTitleDiv.innerHTML = "";
        recommendationsTitleDiv.innerHTML = "";
        recommendationsUl.innerHTML = "";
        fetch("https://api.themoviedb.org/3/movie/" + movie.id + "/reviews?language=en-US&page=1&api_key=88d6f906b386ac47c004701d8f545df8")
        .then(res => res.json())
        .then(data3 => {
            let count = 0;
            let limit = 5;

            data3.results.forEach(review =>{
                
                if (count < limit) {
                    let tableRow = document.createElement("tr")
    
                    let authorLi = document.createElement("td");
                    authorLi.innerText = review.author;
    
                    let reviewText = document.createElement("td");
                    reviewText.innerText = review.content;
    
                    tableRow.append(authorLi, reviewText)
    
                    reviewsList.appendChild(tableRow);
                    count ++;
                }
            })
            let reviewsTitle = document.createElement("h3");
            reviewsTitle.innerText = "Reviews";
            reviewsTitleDiv.appendChild(reviewsTitle);

        })
    })

    let seeMovieRecommendations = document.createElement("button");
    seeMovieRecommendations.innerText = "See other recommendations";
    seeMovieRecommendations.addEventListener("click", () => {
        recommendationsTitleDiv.innerHTML = "";
        reviewsList.innerHTML = "";
        reviewsTitleDiv.innerHTML = "";
        recommendationsUl.innerHTML = "";
        console.log("click");
        fetch ("https://api.themoviedb.org/3/movie/" + movie.id + "/recommendations?language=en-US&page=1&api_key=88d6f906b386ac47c004701d8f545df8")
        .then(res => res.json())
        .then(data4 => {
            let count1 = 0;
            let limit1 = 10;
            console.log(data4.results);

            data4.results.forEach(recommendations =>{
                
                if (count1 < limit1) {
                    let recommendationLi = document.createElement("li")
                    recommendationLi.innerText = recommendations.original_title;
                    console.log(recommendations);
                    count1 ++;
                    recommendationsUl.append(recommendationLi);
                }
            })
            let recommendationsTitle = document.createElement("h3");
            recommendationsTitle.innerText = "Recommendations";
            recommendationsTitleDiv.appendChild(recommendationsTitle);

            if (recommendationsUl.innerHTML == "") {
                let noRecommendations = document.createElement("li");
                noRecommendations.innerText = "There are no recommendations for this movie";
                recommendationsUl.appendChild(noRecommendations);
            }
        })
   
    })
    
    if (hideAddToList == 0) {
        movieDiv.append(movieHeadline, addMovieToList, movieText, movieImg, seeMovieReviews, seeMovieRecommendations);
    } else {
        movieDiv.append(movieHeadline, movieText, movieImg, seeMovieReviews, seeMovieRecommendations);
        hideAddToList = 0;
    }
    movieInfo.appendChild(movieDiv);
}

searchButton.addEventListener("click", () => {
    
    search = searchMovieInput.value; 
    if (search != "") {
        fetch("https://api.themoviedb.org/3/search/movie?query="+ search +"&include_adult=false&language=en-US&page=1&api_key=88d6f906b386ac47c004701d8f545df8")
        .then(res => res.json())
        .then(data1 => {
            movieList.innerHTML = "";
            console.log(data1);
            printMovieList(data1.results);
        })
        searchMovieInput.value = "";
    }
})


function watchlistButtonFunction(movies) {
    hideAddToList = 1;
    showWatchlistButton.addEventListener("click", async () => {
        //movieList.innerHTML = "";
        movieInfo.innerHTML = "";
        try {
            watchlist = JSON.parse(localStorage.getItem("Watchlist"));
            watchlistTitles = [];
            for(let i = 0; i < watchlist.length; i++) {
                const response = await fetch("https://api.themoviedb.org/3/movie/"+ watchlist[i] +"?language=en-US&api_key=88d6f906b386ac47c004701d8f545df8")
                .then(res => res.json())
                .then(data2 => {
                    watchlistTitles.push(data2)
                    showWatchlist.innerHTML = "";
                })
            }
            printMovieList(watchlistTitles);

        } catch {
            alert("There are no films in the watchlist");
        }
        
    })


}
