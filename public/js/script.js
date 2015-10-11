
var placeSearch, autocomplete, autocomplete2;
var lat;
var lon;
var matches;

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
	    "CapitalOneId": capitalOneID,
	    "Name": name,
	    "Email": email,
	    "Address": address,
	    "Price": price,
	    "Height": height,
	    "Width": width,
	    "Length": length,
	    "Phone": phone,
	    "Latitude": lat,
	    "Longitude": lon,
	    "StartMonth": startMonth,
	    "EndMonth": endMonth
	  	}),
	  	contentType: "application/json"
    });
	});

	// Search request
	$('#search-button').click(function(){
		var spaceNeeded = parseInt($("#SpaceNeeded").val());
		var startMonth = $("#SearchStartMonth").val();
		var endMonth = $("#SearchEndMonth").val();

		var url = "./listings/?Latitude=" + lat + "&Longitude=" + lon + "&SpaceNeeded=" + spaceNeeded + "&StartMonth=" + startMonth + "&EndMonth=" + endMonth;
		// var url = "./listings/?Latitude=35.9118905&Longitude=-79.05768269999999&StartMonth=2015-05&EndMonth=2015-08&SpaceNeeded=100";

		$.ajax({
			url: url,
		  data: {
	      format: 'json'
	    },
		  dataType: 'json',
		  error: function() {
        alert("Search Parameter(s) Are Missing, Please Try Again!");
      },
		  success: function(data) {
        matches = data;
        displayResults(data);
      },
	   	type: 'GET'
   	});
    
	});

	
//*********************Test*******************
// Submit POST request for Capital One money transfer
	$("#submit-purchase").click(function(){
    alert("Payment has been processed");
		
    var buyerCapitalOneID = $("#Buyer-CapitalOne").val();
    console.log(buyerCapitalOneID);

		var sellerCapitalOneID = matches[listingID].CapitalOneId;
    console.log(sellerCapitalOneID);


    var url= 'http://api.reimaginebanking.com/accounts/' + buyerCapitalOneID + '/transfers?key=ef0c1299de8c6e82cb65534aabeca2d4';
    var body = {
        "medium": "balance",
        "payee_id": sellerCapitalOneID,
        "amount": matches[listingID].Price,
        "transaction_date": new Date(),
        "status": "pending",
        "description": "Paying for shared rental storage space"
    };
    // $.post(url, body, function(data, status){
    // 	// Maybe do something?
    // 	alert("Payment processed");
    //   console.log(status);
    // });
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      success: function (data) {
        console.log(data);
      },
      error: function(e) {
        // alert("Oops! Something Went Wrong, Please Try Again!")
      },
      data: JSON.stringify(body),
      contentType: "application/json"
    });
	});
    
  $("#title").mouseover(function(){
    console.log("test title mouseover");
  });

})

var listingID;
function setUpBuy(){
  $(".proceed-to-buy").mouseover(function(e){
    event.preventDefault();
    // console.log("test click");
    // console.log(e);
    temp = parseInt(e.toElement.id.substring(8));
    if(!isNaN(temp)){
      listingID = temp;
    }
    // listingID = parseInt(e.toElement.id.substring(8));
    console.log(listingID);
  });
}
//**************************Test*****************

// Display Search Results
function displayResults(listings){
	$("#results-display").empty();
	if (listings.length > 0) {
		for(var i=0; i<listings.length; i=i+1){
			listing = listings[i];
			template = '<div class="row"><div class="col-md-3"><p><b>Price:</b></p></div><div class="col-md-3"><p>$' + listing.Price + '</p></div><div class="col-md-3"><p><b>Space Available:</b></p></div><div class="col-md-3"><p>' + listing.Width + 'ft &times; ' + listing.Length + 'ft &times; ' + listing.Height + 'ft high</p></div></div><div class="row"><div class="col-md-3"><p><b>Location:</b></p></div><div class="col-md-6"><p>' + listing.Address + '</p></div><div class="col-md-3"><button type="button" class="btn btn-success proceed-to-buy" id="listing-' + i + '" data-toggle="modal" data-target="#BuyModal"><b>Proceed</b></button></div></div><hr>';
			$('#results-display').append(template);
		}
    setUpBuy();
	} else {
		$('#results-display').append('<div class ="row"><h1>No Results Were Found</h1></div>');
	}
}
