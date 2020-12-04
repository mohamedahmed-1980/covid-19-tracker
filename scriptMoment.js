// Moment script file used to display the date on the website
const m = moment();

$("#date").text(m.format("dddd, MMMM Do YYYY"));