// create variables to hold responses from ajax calls
var currentCountry = "";
var countryISO = "";

// create variables to hold HTML elements
var countryInput = $("#countryInput");
var searchBtn = $("#searchBtn");
var clearBtn = $("#clearBtn");
var countryText = $("#countryText");
var deathsEle = $("#deaths");
var deathRateEle = $("#deathRate");
var recovRateEle = $("#recovRate");
var infRateEle = $("#infRate");
var flagEle = $("#flag");
var countryInputEle = $("#countryInput");
var searchBtnEle = $("#searchBtn");
var buttonListEle = $("#buttonList");
var storageIndex = 0;
var sIndexEle = $("#sIndex");

// get user location from browser
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  // pass to function that uses ajax call and geolocater to find the users country
  reverseGeoCode(lat, lon);
}

// use passed coordinates to find location
function reverseGeoCode(lat, lon) {
  var locationIQ =
    "https://us1.locationiq.com/v1/reverse.php?key=pk.d153eede84e6d6d8954c160de6babc21&lat=" +
    lat +
    "&lon=" +
    lon +
    "&format=json";
  $.ajax({
    url: locationIQ,
    method: "GET",
  }).then(function (response) {
    // store the country of the user
    var userCountry = response.address.country;
    // create a button of the users country and bring the countries COVID statistics to the page
    countryMatch(userCountry);
  });
}

// get the users location on page load
getLocation();

// create function that looks for country match after this chage the flag
function countryMatch(searchTerm) {
  var allCountries = "https://api.covid19api.com/countries";
  var currentCountry = "";
  $.ajax({
    url: allCountries,
    method: "GET",
  }).then(function (response) {
    for (var i = 0; i < response.length; i++) {
      if (response[i].Country === searchTerm) {
        // add the name of the country to the country element
        countryText.text(" " + response[i].Country);
        // set the current country to the slug
        currentCountry = response[i].Slug;
        // grab the country's ISO2 abbreviation to find the flag
        countryISO = response[i].ISO2;
        i = response.length;
        formattedISO = countryISO.toLowerCase();
        var imageLocation = "./flagImages/" + formattedISO + ".jpg";
        // add the flag image to the flag element
        flagEle.attr("src", imageLocation);
        // pass the countries ISO2 code to get the ISO3 code
        threeLetterCode(countryISO);
        // if searchterm exsists in database then create a button out of it
        createButton(searchTerm);
      }
    }
    // check to see if there was a response from the country api
    if (currentCountry === "") {
      //create notification that tells user to change input
      var notificationColumn = $("<div>").addClass("column is-4 is-offset-4");
      var notificationEle = $("<div>").addClass("notification");
      var deleteButton = $("<button>").addClass("delete");
      notificationEle.append(deleteButton);
      var notificationText = $("<p>");
      notificationText.text(
        "Your search did not match a country. Please make sure your spelling and capitalization are correct."
      );
      notificationEle.append(notificationText);
      notificationColumn.append(notificationEle);
      $("body").append(notificationColumn);
    }
    // send the current country to be searched in the COVID api and to create a new button
    activeSearch(currentCountry);
  });
}

searchBtn.on("click", function (event) {
  // when the search button is pressed pull the text to be used to search the countries
  event.preventDefault();
  var newSearch = countryInputEle.val();
  // pass the user input to check if it is a useable search
  countryMatch(newSearch);
});

// Clears local history and buttons rendered from local storage
clearBtn.click(function () {
  localStorage.clear();
  location.reload();
});

// search for a country when it has its button clicked
$(document).on("click", ".is-primary", function (event) {
  event.stopPropagation();
  var countrySearch = $(this).attr("id");
  countryMatch(countrySearch);
});

// when the x is clicked on a notification box delete it
$(document).on("click", ".delete", function (event) {
  event.stopPropagation();
  $(this).parent().remove();
});

// function that builds search for
function activeSearch(searchTerm) {
  // check to make sure that the search field is not empty
  if (searchTerm !== "") {
    var currentActive = "https://api.covid19api.com/live/country/" + searchTerm;
    $.ajax({
      url: currentActive,
      method: "GET",
      timeout: 0,
    }).then(function (response) {
      // reset the text elements that hold COVID numbers
      deathsEle.text("Number of Covid-19 deaths:");
      deathRateEle.text("Covid-19 death rate:");
      recovRateEle.text("Recovery rate:");
      var activeCases = 0;
      var confirmedCases = 0;
      var deathsTotal = 0;
      var recoveredTotal = 0;
      // create loop that checks all array values and counts active, confirmed, deaths, recovered
      for (var i = 0; i < response.length; i++) {
        if (response[i].Date === "2020-05-06T00:00:00Z") {
          activeCases = activeCases + response[i].Active;
          confirmedCases = confirmedCases + response[i].Confirmed;
          deathsTotal = deathsTotal + response[i].Deaths;
          recoveredTotal =
            recoveredTotal +
            (response[i].Confirmed - response[i].Active - response[i].Deaths);
        }
      }
      // add the COVID values to their respective elements
      deathsEle.append(" " + deathsTotal);
      var deathRate = (deathsTotal / confirmedCases) * 100;
      deathRateEle.append(" " + deathRate.toFixed(1) + "%");
      var recoveryRate = (recoveredTotal / confirmedCases) * 100;
      recovRateEle.append(" " + recoveryRate.toFixed(1) + "%");

      // giphy danger level
      // display a gif that shows how dangerous is it to travel to a country based on its death rate
      var apiKey = "?api_key=HT7rC7MrQFuW2AoLBTsE8CabD7yuhHXN";
      var gifDangerLow = "XbxZ41fWLeRECPsGIJ"; // little girl thumbs up
      var gifDangerMed = "LpkLWXTp0v0qy70xPp"; // Steve Irwin "Danger Danger"
      var gifDangerHigh = "lMm1GKkThcWM5dvI28"; // caution tape
      var gifID;

      if (deathRate <= 5) {
        gifID = gifDangerLow;
        $("html").removeClass("dangerLevelMax");
      } else if (deathRate <= 10 && deathRate > 5) {
        gifID = gifDangerMed;
        $("html").removeClass("dangerLevelMax");
      } else if (deathRate > 10) {
        gifID = gifDangerHigh;
        $("html").addClass("dangerLevelMax");
      }

      var queryURL = "https://api.giphy.com/v1/gifs/" + gifID + apiKey;

      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (gif) {
        //console.log(gif);

        var gifEl = $("#dangerGif");
        var gifSource = gif.data.images.original.url;
        //console.log(gifSource);
        gifEl.attr("src", "");
        gifEl.attr("src", gifSource);
        //console.log(gifEl);
      });
    });
  }
}

// create function that checks the government strictness related to COVID
function governmentAction(countryCode) {
  var govAction =
    "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/date-range/2020-04-29/2020-05-06";
  sIndexEle.text("Stringency Index: ");
  $.ajax({
    url: govAction,
    method: "GET",
  }).then(function (response) {
    // use 3 letter code to get country specific data
    var stringency = response.data["2020-05-06"][countryCode].stringency;
    sIndexEle.append(stringency);
  });
}

// create function to handle addition of buttons of past searches
function createButton(searchTerm) {
  // if search is not an empty string create and append the button
  if (searchTerm !== "") {
    // create button and append it to the button list
    var newButton = $("<button>");
    newButton
      .addClass("searchBtn")
      .addClass("button")
      .addClass("is-primary")
      .addClass("my-2")
      .addClass("px-1");
    newButton.attr("id", searchTerm);
    newButton.text(searchTerm);
    buttonListEle.append(newButton);
    buttonListEle.append("<br>");
    // send button to local storage
    localStorage.setItem(storageIndex, searchTerm);
    storageIndex++;
  }
}

// retrieve stored buttons from localStorage
function retrieveButtons() {
  if (localStorage !== null) {
    for (var i = 0; i < localStorage.length; i++) {
      var storedButton = localStorage.getItem(i);
      createButton(storedButton);
    }
  }
}

// retrieve stored buttons on page load
retrieveButtons();

// take country ISO2 codes and convert them to ISO3 codes
function threeLetterCode(countryISO) {
  $.ajax({
    url: "https://restcountries.eu/rest/v2/alpha?codes=" + countryISO,
    method: "GET",
  }).then(function (response) {
    // call govenment action function to pass in response of 3 letter code

    governmentAction(response[0].alpha3Code);
  });
}
