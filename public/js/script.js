
var placeSearch, autocomplete, autocomplete2;
var lat;
var lon;

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});
  autocomplete2 = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete2')),
      {types: ['geocode']});
  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
  autocomplete2.addListener('place_changed', fillInAddress2);
}



// [START region_fillform]
function fillInAddress() {
  // Get the place details from the autocomplete object.
  var coords = autocomplete.getPlace().geometry.location;
  console.log(coords);
  lat = coords.J;
  lon = coords.M;
}
function fillInAddress2() {
  // Get the place details from the autocomplete object.
  var coords = autocomplete2.getPlace().geometry.location;
  console.log(coords);
  lat = coords.J;
  lon = coords.M;
}
// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
// [END region_geolocation]



$(document).ready(function(){

	// Get Listing info to send to server
	$("#submit-listing").click(function(){
		var name = $("#Name").val();
		var email = $("#Email").val();
		var width = $("#ex1").val();
		var length = $("#ex2").val();
		var height = $("#ex3").val();
		var startMonth = $("#StartMonth").val();
		var endMonth = $("#EndMonth").val();
		var phone = $("#Phone").val();
		var capitalOneID = $("#CapitalOne").val();
		var listing = {
			Name: name,
			Email: email,
			Width: parseInt(width),
			Length: parseInt(length),
			Height: height,
			Latitude: parseFloat(lat),
			Longitude: parseFloat(lon),
			StartMonth: startMonth,
			EndMonth: endMonth,
			Phone: phone,
			CapitalOneID: capitalOneID
		};
		console.log(listing);
		// Example listing
// CapitalOneID: "abcdefghijk"
// Email: "me@gmail.com"
// EndMonth: "2015-11"
// Height: "15"
// Latitude: 35.9118905
// Length: "10"
// Longitude: -79.05768269999999
// Name: "William Yang"
// Phone: "1234567890"
// StartMonth: "2015-10"
// Width: "5"

		// $.post("url",
		// 	listing,
		// function(data, status){

		// });
	});

	// Search request
	$('#search-button').click(function(){
		var spaceNeeded = parseInt($("#SpaceNeeded").val());
		var startMonth = $("#SearchStartMonth").val();
		var endMonth = $("#SearchEndMonth").val();
		console.log(spaceNeeded);
		console.log(lat);
		console.log(lon);
		// var url = "listings/Latitude=" + lat + "&Longitude=" + lon + "&SpaceNeeded=" + spaceNeeded + "&StartMonth=" + startMonth + "&EndMonth=" + endMonth;
		// console.log(url);
		// $.get(url,
		// function(data, status){
		//		var matches = filter(data, spaceNeeded, startMonth, endMonth, lat, lon);
		// });
	});


})


// Filter all listing to match search request
function filter (data, spaceNeeded, startMonth, endMonth, lat, lon) {
	var matches = [];
	for (var listing in data){
		if(inRange(lat, lon, listing.Latitude, listing.Longitude) && bigEnough(listing.Length, listing.Width, spaceNeeded) && timeMatch(startMonth, endMonth, listing.StartMonth, listing.EndMonth)){
			matches.push(listing);
		}
	}
	return matches;
}
// in range, time matches, big enough
function inRange (lat1, lon1, lat2, lon2){
	// Formula for distance between two sets of coordinates
	var R = 6371000; // metres
	var p1 = lat1.toRadians();
	var p2 = lat2.toRadians();
	var dp = (lat2-lat1).toRadians();
	var dl = (lon2-lon1).toRadians();

	var a = Math.sin(dp/2) * Math.sin(dp/2) +
        Math.cos(p1) * Math.cos(p2) *
        Math.sin(dl/2) * Math.sin(dl/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c; // distance in meters
	return (d < 30000);
}

function bigEnough (listingLength, listingWidth, desiredSize){
	return (desiredSize < (listingLength*listingWidth));
}

function timeMatch (searchStart, searchEnd, listingStart, listingEnd){
	var searchStartYear = parseInt(searchStart.substring(0,4));
	var searchStartMonth = parseInt(searchStart.substring(5, 7));
	var searchEndYear = parseInt(searchEnd.substring(0,4));
	var searchEndMonth = parseInt(searchEnd.substring(5, 7));	
	var listingStartYear = parseInt(listingStart.substring(0,4));
	var listingStartMonth = parseInt(listingStart.substring(5, 7));
	var listingEndYear = parseInt(listingEnd.substring(0,4));
	var listingEndMonth = parseInt(listingEnd.substring(5, 7));

	if(searchStartYear < listingStartYear){
		return false;
	}
	else if(searchStartYear == listingStartYear && searchStartMonth < listingStartMonth){
		return false;
	}
	else if(searchEndYear > listingEndYear){
		return false;
	}
	else if(searchEndYear == listingEndYear && searchEndMonth > listingEndMonth){
		return false;
	}
	return true;
}