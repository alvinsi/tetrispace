
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
			Width: width,
			Length: length,
			Height: height,
			Latitude: lat,
			Longitude: lon,
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
		var spaceNeeded = $("#SpaceNeeded").val();
		var startMonth = $("#SearchStartMonth").val();
		var endMonth = $("#SearchEndMonth").val();

		var url = "listings/Latitude=" + lat + "&Longitude=" + lon + "&SpaceNeeded=" + spaceNeeded + "&StartMonth=" + startMonth + "&EndMonth=" + endMonth;
		console.log(url);
		// $.get(url,
		// function(data, status){

		// });
	});


})