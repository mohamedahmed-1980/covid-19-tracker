# COVIDTracker

A Covid-19 information dashboard that allows the user to lookup a specific country's covid statistics. The user will see the country's flag along with other important data points like covid deaths, death rate, and recovery rate. Users will also see a gif animation displaying how dangerous it is to travel to that country based on its death rate.

# Requires:

- JQuery
- Moment.js
- Bulma CSS Framework
- APIs:
  - Oxford COVID-19 Response Tracker
  - Giphy
  - LocationIQ
  - COVID19
  - REST Countries

# List of methods

- activeSearch(searchTerm)

  - function that builds search

- getLocation()

  - retrieve user location from browser

- reverseGeoCode(lat, lon)
  - use passed coordinates to find user country
- countryMatch(searchTerm)
  - function that looks for country match to determine correct flag to display from image file
- createButton(searchTerm)
- retrieveButtons()
  - retrieve stored buttons from localStorage

# List of listeners

- searchBtn.on("click", function(event)

  - searches when button is clicked

- clearBtn.click(function ()
  - clears local history and buttons rendered from local storage
- $(document).on("click"
  - starts search when user accepts locations tracking

## Visual:

![Demo Image](./bgImage/Demo.JPG)

[Github pages Link](https://github.com/mohamedahmed-1980/covid-19-tracker.git)
[app link](https://mohamedahmed-1980.github.io/covid-19-tracker/)

## Authors:

Simon Ziccardi, Mohamed Ahmed, and Jordan Stuckman
