/**
* Filter all listing to match search request
*/
exports.filterAll = function filterAll(data, spaceNeeded, startMonth, endMonth, lat, lon) {
  var matches = [];
  for (var i=0; i<data.length; i++){
    var listing = data[i].dataValues;
    if(this.range(lat, lon, listing.Latitude, listing.Longitude) < 30000){
      if(this.bigEnough(listing.Length, listing.Width, spaceNeeded)){
        if(this.timeMatch(startMonth, endMonth, listing.StartMonth, listing.EndMonth)){
          matches.push(listing);
        }
      }
    }
  }
  return matches;
}

/**
* Checks the range of the listing
*/
exports.range = function range (lat1, lon1, lat2, lon2){
  var R = 6371000; // metres
  var p1 = lat1 * Math.PI / 180;
  var p2 = lat2 * Math.PI / 180;
  var dp = (lat2-lat1) * Math.PI / 180;
  var dl = (lon2-lon1) * Math.PI / 180;

  var a = Math.sin(dp/2) * Math.sin(dp/2) +
        Math.cos(p1) * Math.cos(p2) *
        Math.sin(dl/2) * Math.sin(dl/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = R * c;
  return d;
}

/**
* Checks if the space is big enough
*/
exports.bigEnough = function bigEnough (listingLength, listingWidth, desiredSize){
  return (desiredSize < (listingLength*listingWidth));
}

/**
* Checks if the time matches the query
*/
exports.timeMatch = function timeMatch (searchStart, searchEnd, listingStart, listingEnd){
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
