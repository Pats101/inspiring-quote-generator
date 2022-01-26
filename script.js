 const quoteContainer = document.getElementById('quote-container');
 const quoteText = document.getElementById('quote');
 const authorText = document.getElementById('author');
 const twitterBtn = document.getElementById('twitter');
 const newQuoteBtn = document.getElementById('new-quote');
 const loader = document.getElementById('loader');

 
 let apiQuotes = [];         //difference between const and let is that const is when the value is never changing

 // Show Loading
 function loadingSymbol() {
     loader.hidden = false;
     quoteContainer.hidden = true;
 }


 // Hide loading Page
 function loadingComplete() {
     quoteContainer.hidden = false;
     loader.hidden = true;
 }

// Show New Quote
function newQuote() {
    loadingComplete();
    //Pick a random quote from apiQuotes array
    //use Math.floor to whole number
    //Multiply with length of the apiQuotes so that the number is never bigger than it
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];

    //Check if Author field is blank and replace it with 'Unkown'
    if(!quote.author){
        // pasrse in author as 'Unknown'
        authorText.textContent = 'Unknown';
    } else {
        authorText.textContent = quote.author;
    }

    // Chek Quote length to determine styling 
    if(quote.text.length > 120) {
        // Add CSS class which in this case is 'long-quote'
        quote.classList.add('long-quote');
    } else {
        quoteText.classList.remove('long-quote');
    }

    // Set Quote, Hide Loader
    quoteText.textContent = quote.text;
    loadingComplete();
}

// Get Quotes From API
async function getQuotes() {
    loadingSymbol();
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