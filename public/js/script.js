
// var autocomplete;

// function initAutocomplete() {
//   // Create the autocomplete object, restricting the search to geographical
//   // location types.
//   autocomplete = new google.maps.places.Autocomplete(
//       * @type {!HTMLInputElement} (document.getElementById('autocomplete')),
//       {types: ['geocode']});

//   // When the user selects an address from the dropdown, populate the address
//   // fields in the form.
//   autocomplete.addListener('place_changed', fillInAddress);
// }



$(document).ready(function(){


	// Get Listing info to send to server
	$("#submit-listing").click(function(){
		var name = $("#Name").val();
		var email = $("#Email").val();
		var width = $("#ex1").val();
		var length = $("#ex2").val();
		var height = $("#ex3").val();
		var address = $("#Seller-Address").val();
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
			Address: address,
			StartMonth: startMonth,
			EndMonth: endMonth,
			Phone: phone,
			CapitalOneID: capitalOneID
		};
		// $.post("url",
		// 	listing,
		// function(data, status){

		// });
	});


})