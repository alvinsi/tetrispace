var placeSearch, autocompleteQuery, autocompletePost, lat, lon, matches, listingID;

/**
* Initialize Google Autocomplete Service
*/
function initAutocomplete() {
  autocompleteQuery = new google.maps.places.Autocomplete((document.getElementById('autocompleteQuery')),{
    types: ['geocode']
  });
  autocompletePost = new google.maps.places.Autocomplete((document.getElementById('autocompletePost')),{
    types: ['geocode']
  });
  autocompleteQuery.addListener('place_changed', fillInAddressQuery);
  autocompletePost.addListener('place_changed', fillInAddressPost);
}

/**
* Fill in Address For Search Tab
*/
function fillInAddressQuery() {
  var coords = autocompleteQuery.getPlace().geometry.location;
  lat = coords.lat();
  lon = coords.lng();
}

/**
* Fill in Address For Post Tab
*/
function fillInAddressPost() {
  var coords = autocompletePost.getPlace().geometry.location;
  lat = coords.lat();
  lon = coords.lng();
}

/**
* Execute when the page is loaded
*/
$(document).ready(function() {
  $('.background-image').on('webkitAnimationEnd', function(e) {
    $(this).addClass('visible');
  });

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
		var address = $("#autocompletePost").val();

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

	$('#search-button').click(function(){
		var spaceNeeded = parseInt($("#SpaceNeeded").val());
		var startMonth = $("#SearchStartMonth").val();
		var endMonth = $("#SearchEndMonth").val();

		var url = "./listings/?Latitude=" + lat + "&Longitude=" + lon + "&SpaceNeeded=" + spaceNeeded + "&StartMonth=" + startMonth + "&EndMonth=" + endMonth;
		console.log(url);
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

	$("#submit-purchase").click(function(){
    var buyerCapitalOneID = $("#Buyer-CapitalOne").val();
		var sellerCapitalOneID = matches[listingID].CapitalOneId;
    var url= 'https://api.reimaginebanking.com/accounts/' + buyerCapitalOneID + '/transfers?key=4b45a24ea0a6bf25c77574c0cb55bcfe';
    var body = {
        "medium": "balance",
        "payee_id": sellerCapitalOneID,
        "amount": matches[listingID].Price,
        "transaction_date": new Date(),
        "status": "pending",
        "description": "Paying for shared rental storage space"
    };

    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      success: function (data) {
        alert("Payment has been processed\n" + data.message);
      },
      error: function(e) {
        alert("Oops! Something Went Wrong, Please Try Again!\n");
      },
      data: JSON.stringify(body),
      contentType: "application/json"
    });
	});
});

/**
* Set Up Purchase Button
*/
function setUpBuy(){
  $(".proceed-to-buy").mouseover(function(e){
    event.preventDefault();
    temp = parseInt(e.toElement.id.substring(8));
    if(!isNaN(temp)){
      listingID = temp;
    }
  });
}

/**
* Display the Results of Listings
*/
function displayResults(listings){
	$("#results-display").empty();
	if (listings.length > 0) {
    template = '<div class="row"><div class="col-md-12"><h2><b>Search Results:</b></h2></div></div><br>';
		for(var i=0; i<listings.length; i++){
			listing = listings[i];
			template += '<div class="row"><div class="col-md-3"><p><b>Price:</b></p></div><div class="col-md-3"><p>$' + listing.Price + '</p></div><div class="col-md-3"><p><b>Space Available:</b></p></div><div class="col-md-3"><p>' + listing.Width + 'ft &times; ' + listing.Length + 'ft &times; ' + listing.Height + 'ft high</p></div></div><div class="row"><div class="col-md-3"><p><b>Location:</b></p></div><div class="col-md-6"><p>' + listing.Address + '</p></div><div class="col-md-3"><button type="button" class="btn btn-success proceed-to-buy" id="listing-' + i + '" data-toggle="modal" data-target="#BuyModal"><b>Proceed</b></button></div></div><hr>';	
		}
    $('#results-display').append(template);
    setUpBuy();
	} else {
		$('#results-display').append('<div class ="row"><h1>No Results Were Found</h1></div>');
	}
}