let theatreNames = [];
let theatreIds = [];

// fetch & parse theatre areas (names & IDs) xml data from URL & save them in respective arrays
// call function fillTheatreDropdown with theatre Names & IDs
fetch('https://www.finnkino.fi/xml/TheatreAreas/')
    .then(response => {
        // error handling
        if (!response.ok) {
            throw new Error('Error when fetching data');
        }
        // if ok, returns text of the response
        return response.text();
    })
    .then(data => {
        const parser = new DOMParser(); // creates new parser element
        const xmlDoc = parser.parseFromString(data, "text/xml"); // parse xml

        // assign theatre names & IDs to the respective constants
        const theatres = xmlDoc.getElementsByTagName("Name");
        const ids = xmlDoc.getElementsByTagName("ID");
        
        // loops through theatre names & ids & populates respective arrays
        for (let i = 0; i < theatres.length; i++) {
            theatreNames.push(theatres[i].textContent.toLowerCase());
            theatreIds.push(ids[i].textContent);
        }

        fillTheatreDropdown(theatreNames, theatreIds);
    })
    // error handling
    // .catch(error => {
    //     console.error('Error when fetching data:', error);
    // });

function fillTheatreDropdown(names, ids) {
    const theatreDropdown = document.getElementById('theatreDropdown');
    theatreDropdown.innerHTML = ""; // clear the dropdown

    // forEach loop to populate the dropdown with theatre IDs & names
    names.forEach((name, index) => {
        const option = document.createElement('option');
        option.value = ids[index];
        option.textContent = name;
        theatreDropdown.appendChild(option);
    });
}

// triggers fetchMovies function on change event in theatre dropdown
const theatreDropdown = document.getElementById('theatreDropdown');
theatreDropdown.addEventListener('change', (event) => {
    const selectedTheatreId = event.target.value;
    document.getElementById('theatreSearch').value = ''; // clear theatreSearch value
    if (selectedTheatreId) {
        fetchMovies(selectedTheatreId);
    }
});

// function to fetch movies based on the theatre ID
function fetchMovies(theatreId) {
    
    // check if valid theatre ID
    if (theatreIds.includes(theatreId)) {
        document.getElementById('theatreSearch').style.borderColor = ''; // resetting the error style
        // create the URL with the selected ID
        const url = `https://www.finnkino.fi/xml/Schedule/?area=${theatreId}`;
        
        fetch(url)
            .then(response => {
                // error handling
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            //  parse & assign data ...
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");

                const movies = xmlDoc.getElementsByTagName("Title");
                const start = xmlDoc.getElementsByTagName("dttmShowStart");
                const images = xmlDoc.getElementsByTagName("EventSmallImagePortrait");
                const urls = xmlDoc.getElementsByTagName("EventURL");
                let movieTitles = [];
                let startTimes = [];
                let movieImages = [];
                let movieURLs = [];

                // loops through constants to populate respective arrays
                for (let i = 0; i < movies.length; i++) {
                    movieTitles.push(movies[i].textContent);
                    startTimes.push(start[i].textContent);
                    movieImages.push(images[i].textContent);
                    movieURLs.push(urls[i].textContent);
                }

                // displayMovies(movieTitles);
                // calls function to diplay movies info in table
                displayMovies_inTable(movieTitles, startTimes, movieImages, movieURLs)
            })
            
}   
    // if theatre ID not valid, clear the table & display message
    else{
        // console.log(theatreIds.includes(theatreId));
        document.getElementById('movieList').innerHTML = ''
        // mark with red if input not found
        document.getElementById('theatreSearch').style.borderColor = 'red'
        document.getElementById('movieList').innerText = 'Theatre not found. Type in a correct theatre or select from a dropdown above.';
        }
}

// function displayMovies(titles) {
//     const movieList = document.getElementById('movieList');
//     movieList.innerHTML = ''; // Clear previous movie titles

//     titles.forEach(title => {
//         const listItem = document.createElement('li');
//         listItem.textContent = title;
//         movieList.appendChild(listItem);
//     });
// }

function displayMovies_inTable(titles, sTimes, mImages, mURLs) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = ''; // Clear previous movie info

    // create table header
    let table = '<table border="1"><tr><th>Title</th><th>Start</th><th>Link</th><th>Poster</th></tr>';
				  
    // loop through & populate table with movies info

    for (let i = 0; i < titles.length; i++) {   
    
        table += `<tr>
                    <td>${titles[i]}</td>
                    <td>${sTimes[i]}</td>
                    <td><a href=${mURLs[i]} target="_blank">Click to learn more.</a></td>
                    
                    <td><img src="${mImages[i]}" style="width:100px;"></td>
                    </tr>`;
        };
    
    table += '</table>';
    // displays table
    document.getElementById('movieList').innerHTML = table;
}

// executes when search button clicked
function findTheatre() {
    const theatre = document.getElementById('theatreSearch').value;
    // assigns index of the searched theatre
    const theatreindex = theatreNames.indexOf(theatre.toLowerCase());
    // variable with the respective theatre ID
    const theatreID = theatreIds[theatreindex]
    fillTheatreDropdown(theatreNames, theatreIds);     
    fetchMovies(theatreID)
    
}
