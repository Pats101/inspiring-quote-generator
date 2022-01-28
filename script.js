 const quoteContainer = document.getElementById('quote-container');
 const quoteText = document.getElementById('quote');
 const authorText = document.getElementById('author');
 const twitterBtn = document.getElementById('twitter');
 const newQuoteBtn = document.getElementById('new-quote');
 const loader = document.getElementById('loader');
 const favouriteIcon = document.getElementById("favourite");
 const favouritesContainer = document.getElementById("favourites-container");

 //difference between const and let is that const is when the value is never changing
 let apiQuotes = []; 
 let quote = {};
 let favouriteQuotes = [];

 // Show Loading
 function showLoadingSymbol() {
     loader.hidden = false;
     quoteContainer.hidden = true;
 }

 // Remove Loading Symbol
 function removeLoadingSymbol() {
     quoteContainer.hidden = false;
     loader.hidden = true;
 }

 // Add Quote to Favourites 
 function addQuoteToFavourites() {
     saveToLocalFavourites(quote);
 }

 // Save Qoute to Local Storage
 function saveToLocalFavourites(favourite) {

    // loading favourite quotes from local storage
    let favouriteQuotesJsonString = localStorage.getItem("favouriteQuotes");
    if(favouriteQuotesJsonString != null) {
        favouriteQuotes = JSON.parse(favouriteQuotesJsonString);
    }

    // check if quote was already chosen as a favourite 
    const validateQuote = favouriteQuotes.find(q => q.text === favourite.text);

    // if it wasn't add to the list of favourites array and change the color of the favourite icon to red
    if(!validateQuote) {
        // Add the new favourite quote to the array
        favouriteQuotes.push(favourite);
        favouriteIcon.style.color ="red";
    }

    // If it's already a favourite then remove the quote from the favourite list and change the icon color to grey 
    else {
        removeQuoteFromFavourites(favourite);
        favouriteIcon.style.color = "grey";
    }

    // Save the new array back to local storage
    favouriteQuotesJsonString = JSON.stringify(favouriteQuotes);
    localStorage.setItem("favouriteQuotes", favouriteQuotesJsonString);
 }

 // Removing Quote from Favourite if it was already there and the heart was clicked again from red to grey
 function removeQuoteFromFavourites(favourite) {
     const indexToBeDeleted = favouriteQuotes.findIndex(q => q.text === favourite.text);
     favouriteQuotes.splice(indexToBeDeleted, 1);
     favouriteQuotesJsonString = JSON.stringify(favouriteQuotes);
     localStorage.setItem("favouriteQuotes", favouriteQuotesJsonString);
 }

 function showFavouriteQuotes() {

    // Get the favourite quotes from the local storage and save them to an array
    favouriteQuotes = JSON.parse(localStorage.getItem("favouriteQuotes"));
    for (let index = 0; index < favouriteQuotes.length; index++) {
        const quotePar = document.createElement("p");
        quotePar.className = "fav-q-par";
        quotePar.id = "fav" + index;
        favouritesContainer.appendChild(quotePar);

        // check if author field is null and replace it with "Unknown"
        if(!favouriteQuotes[index].author) {
            favouriteQuotes[index].author = "Unknown";
        }
        $(`#${quotePar.id}`).html(`<i class="fas fa-heart heart" title="remove from favourites" id="${index}"></i>&nbsp;${favouriteQuotes[index].text} (${favouriteQuotes[index].author})`);
    }
    // When clicking on the heart icon (before the favourite quote) - remove it from the favourite array and update the local storage 
    $('.heart').on("click", function () {
        const quoteToRemove = {};
        //take only the text part from the quote (without the author) and save it as a property in the quoteToRemove obj
        quoteToRemove.text = $(`#fav${this.id}`).text().split("(")[0].trim();
        $(`#fav${this.id}`).fadeOut(1000, 'linear');  // removes the quote from the display
        removeQuoteFromFavourites(quoteToRemove);   // remove the quote from the local storage
    });
 }

 $(function () {
    // when clicking on the "favourites" button - show the user's favourites 
    $('#show-favourites').on('click', function () {
        quoteContainer.hidden = true;
        favouritesContainer.hidden = false;
        $('#favourites-container').empty();
        $('#favourites-container').html('<h2>your favourite quotes</h2><h4>to remove a quote - click on the heart</4>');
        showFavouriteQuotes();
    });

    // when clicking on the "home" button - show the home page (call the getQuotes function to show again the random quote generator)
    $('#homeBtn').on('click', function () {
        favouritesContainer.hidden = true;
        quoteContainer.hidden = false;
        getQuotes();
    });
})


// Show New Quote
function newQuote() {
    removeLoadingSymbol();
    favouritesContainer.hidden = true;

    favouriteIcon.style.color = "grey";
    //Pick a random quote from apiQuotes array
    //use Math.floor to whole number
    //Multiply with length of the apiQuotes so that the number is never bigger than it
    quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
 
    //Check if Author field is blank and replace it with 'Unkown'
    if(!quote.author){
        // pasrse in author as 'Unknown'
        authorText.textContent = 'Unknown';
    } else {
        authorText.textContent = quote.author;
    }

    // Check Quote length to determine styling 
    if(quote.text.length > 120) {
        // Add CSS class which in this case is 'long-quote'
        quote.classList.add("long-quote");
    } else {
        quoteText.classList.remove("long-quote");
    }  
    // Set Quote, Hide Loader
    quoteText.textContent = quote.text;
    removeLoadingSymbol();
}

// Get Quotes From API
async function getQuotes() {
    showLoadingSymbol();
    const apiUrl = 'https://type.fit/api/quotes';
    try {
        const response = await fetch(apiUrl); //response will not be populated until quotes are fetched from the api
        apiQuotes = await response.json();
        newQuote();
    } catch(error) {
        // Catch Error Here 
    }
}

//On Load
getQuotes();


//-----------------------------------------------------------------------------------------------------------------------------------

// // Utilizing the Local Quotes
// function newQuote() {
//     // Pick a random quote from apiQuotes array
//     // use Math.floor to whole number
//     // Multiply with length of the apiQuotes so that the number is never bigger than it
//     const quote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
//     console.log(quote);
// }
// //On Load
// newQuote();

//-----------------------------------------------------------------------------------------------------------------------------------


// Tweet Quote
function tweetQuote() {
    // ? indicates that there will be parameter query
    // Reason for a template string is it allows us to parse a variable which will be converted into a string
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;

    // This allows us to open a window with our URl 
    // _blank - Allow twitter url to open in a new tab
    window.open(twitterUrl, '_blank');
}

// Event Listeners
// Goes at the botton after function that calls it
newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', tweetQuote);