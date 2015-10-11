
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
		var width = $("#Width").val();
		var length = $("#Length").val();
		var height = $("#Height").val();
		var startMonth = $("#StartMonth").val();
		var endMonth = $("#EndMonth").val();
		var phone = $("#Phone").val();
		var capitalOneID = $("#CapitalOne").val();
		var price = $("#Asking-Price").val();
		var address = $("#autocomplete2").val();

	  $.ajax({
      url: './listings/',
      type: 'post',
      dataType: 'json',
      success: function (data) {
      	alert("Listing Successfully Updated")
      },
      error: function(e) {
		    alert("Oops! Something Went Wrong, Please Try Again!")
		  },
      data: JSON.stringify({
	    "CapitalOneId": "hallooooo",
	    "Name": "also perfect",
	    "Email": "me@gmail.com",
	    "Address": "323 abc road",
	    "Price": "10.52",
	    "Height": "15",
	    "Width": "5",
	    "Length": "100",
	    "Phone": "1234567890",
	    "Latitude": "35.9118905",
	    "Longitude": "-79.05768269999999",
	    "StartMonth": "2014-10",
	    "EndMonth": "2016-04"
	  	}),
	  	contentType: "application/json"
    });
	});

	// Search request
	$('#search-button').click(function(){
		var spaceNeeded = parseInt($("#SpaceNeeded").val());
		var startMonth = $("#SearchStartMonth").val();
		var endMonth = $("#SearchEndMonth").val();
		console.log(spaceNeeded);
		console.log(lat);
		console.log(lon);
        console.log("is anything working");
//TEST***************************************************


data = [{
CapitalOneID: "abcdefghijk",
Email: "me@gmail.com",
EndMonth: "2015-10",
Height: "15",
Latitude: 35.9118905,
Length: "100",
Longitude: -79.05768269999999,
Name: "perfect",
Phone: "1234567890",
StartMonth: "2015-03",
Width: "5",
Price: "10.50",
Address: "123 abc road"
},
{
CapitalOneID: "qwertyuiop",
Email: "me@gmail.com",
EndMonth: "2015-12",
Height: "15",
Latitude: 35.9118905,
Length: "10",
Longitude: -79.05768269999999,
Name: "too small",
Phone: "1234567890",
StartMonth: "2015-05",
Width: "5",
Price: "105.50",
Address: "123 ekdkd road"
},
{
CapitalOneID: "qwertyuiop",
Email: "me@gmail.com",
EndMonth: "2015-03",
Height: "15",
Latitude: 35.9118905,
Length: "100",
Longitude: -79.05768269999999,
Name: "wrong time",
Phone: "1234567890",
StartMonth: "2015-04",
Width: "5",
Price: "100.50",
Address: "123 abc street"
},
{
	CapitalOneID: "qwertyuiop",
	Email: "me@gmail.com",
	EndMonth: "2015-03",
	Height: "15",
	Latitude: 35.9118905,
	Length: "100",
	Longitude: -69.05768269999999,
	Name: "out of range",
	Phone: "1234567890",
	StartMonth: "2015-10",
	Width: "5",
	Price: "12.20",
	Address: "123 abasdf road"
},
{
	CapitalOneID: "qwertyuiop",
	Email: "me@gmail.com",
	EndMonth: "2016-04",
	Height: "15",
	Latitude: 35.9118905,
	Length: "100",
	Longitude: -79.05768269999999,
	Name: "also perfect",
	Phone: "1234567890",
	StartMonth: "2014-10",
	Width: "5",
	Price: "10.52",
	Address: "323 abc road"
}];

// Latitude: 35.9118905, Longitude: -79.05768269999999, space 100 date: may-aug 2015

displayResults(data);
//***************************************************
		// var url = "listings/Latitude=" + lat + "&Longitude=" + lon + "&SpaceNeeded=" + spaceNeeded + "&StartMonth=" + startMonth + "&EndMonth=" + endMonth;
		// console.log(url);
		// $.get(url,
		// function(data, status){
		//		matches = filter(data, spaceNeeded, startMonth, endMonth, lat, lon);
		//		displayResults(matches);
		// });
	});
	var matches;

// Submit POST request for Capital One money transfer
	$("#submit-purchase").click(function(){
        alert("Payment has been processed");
		var buyerCapitalOneID = $("#Buyer-CapitalOne").val();
		var sellerCapitalOneID = matches[listingID].CapitalOneID;

    var url= 'http://api.reimaginebanking.com/accounts/' + buyerCapitalOneID + '/transfers?key=ef0c1299de8c6e82cb65534aabeca2d4';
    var body = {
        "medium": "balance",
        "payee_id": sellerCapitalOneID,
        "amount": matches[listingID].Price,
        "transaction_date": new Date(),
        "status": "pending",
        "description": "Paying for shared rental storage space"
    };
    $.post(url, body, function(data, status){
    	// Maybe do something?
    	alert("Payment processed");
    });
	   });
    
    var listingID;
    $(".proceed-to-buy").click(function(e){
        console.log(e);
        listingID = parseInt(e.toElement.id.substring(8));
        console.log(listingID);
    });
})

// Display Search Results
function displayResults(listings){
	$("#results-display").empty();
	for(var i=0; i<listings.length; i=i+1){
		listing = listings[i];
		template = '<div class="row"><div class="col-md-3"><p><b>Price:</b></p></div><div class="col-md-3"><p>$' + listing.Price + '</p></div><div class="col-md-3"><p><b>Space Available:</b></p></div><div class="col-md-3"><p>' + listing.Width + 'ft &times; ' + listing.Length + 'ft &times; ' + listing.Height + 'ft high</p></div></div><div class="row"><div class="col-md-3"><p><b>Location:</b></p></div><div class="col-md-6"><p>' + listing.Address + '</p></div><div class="col-md-3"><button type="button" class="btn btn-success proceed-to-buy" id="listing-' + i + '" data-toggle="modal" data-target="#BuyModal"><b>Proceed</b></button></div></div><hr>';
		$('#results-display').append(template);
	}
}
