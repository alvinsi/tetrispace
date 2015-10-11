var express = require('express');
var exphbs  = require('express3-handlebars');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var filterData = require('./filterData.js');

var app = express();
var PORT = process.env.PORT || 3000;

var listings = [];
var listingNextId = 1;

app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
  res.render('home');
});

app.use(express.static(__dirname + '/public'));

// GET /listings
app.get('/listings', function(req, res) {
	var query = req.query;
	var where = {};
	var lat, lon, endMonth, startMonth;
	var matches = [];
	var data = [];

	if (query.hasOwnProperty('Latitude') && query.Latitude.length > 0 
				&& query.hasOwnProperty('StartMonth') && query.StartMonth.length > 0
				&& query.hasOwnProperty('Longitude') && query.Longitude.length > 0
				&& query.hasOwnProperty('EndMonth') && query.EndMonth.length > 0) {
		lat = query.Latitude;
		lon = query.Longitude;
		startMonth = query.StartMonth;
		endMonth = query.StartMonth;
		spaceNeeded = query.SpaceNeeded;
		db.listing.findAll().then(function(listings){
			console.log("hi");
		})
		data = [
	  {
	    "id": 1,
	    "CapitalOneId": "abcdefghijk",
	    "Name": "William Yang",
	    "Email": "me@gmail.com",
	    "Address": "123 Main St., New York, NY",
	    "Price": 12,
	    "Height": 15,
	    "Width": 5,
	    "Length": 10,
	    "Phone": 1234567890,
	    "Latitude": 35.9118905,
	    "Longitude": -79.05768269999999,
	    "StartMonth": "2015-10",
	    "EndMonth": "2015-11",
	    "createdAt": "2015-10-11T06:00:55.376Z",
	    "updatedAt": "2015-10-11T06:00:55.376Z"
	  },
	  {
	    "id": 2,
	    "CapitalOneId": "abcdefghijk",
	    "Name": "perfect",
	    "Email": "me@gmail.com",
	    "Address": "123 abc road",
	    "Price": 10.5,
	    "Height": 15,
	    "Width": 5,
	    "Length": 100,
	    "Phone": 1234567890,
	    "Latitude": 35.9118905,
	    "Longitude": -79.05768269999999,
	    "StartMonth": "2015-03",
	    "EndMonth": "2015-10",
	    "createdAt": "2015-10-11T07:44:17.573Z",
	    "updatedAt": "2015-10-11T07:44:17.573Z"
	  },
	  {
	    "id": 3,
	    "CapitalOneId": "qwertyuiop",
	    "Name": "too small",
	    "Email": "me@gmail.com",
	    "Address": "123 ekdkd road",
	    "Price": 105.5,
	    "Height": 15,
	    "Width": 5,
	    "Length": 10,
	    "Phone": 1234567890,
	    "Latitude": 35.9118905,
	    "Longitude": -79.05768269999999,
	    "StartMonth": "2015-05",
	    "EndMonth": "2015-12",
	    "createdAt": "2015-10-11T07:49:22.719Z",
	    "updatedAt": "2015-10-11T07:49:22.719Z"
	  },
	  {
	    "id": 4,
	    "CapitalOneId": "qwertyuiop",
	    "Name": "wrong time",
	    "Email": "me@gmail.com",
	    "Address": "123 abc street",
	    "Price": 100.5,
	    "Height": 15,
	    "Width": 5,
	    "Length": 100,
	    "Phone": 1234567890,
	    "Latitude": 35.9118905,
	    "Longitude": -79.05768269999999,
	    "StartMonth": "2015-04",
	    "EndMonth": "2015-03",
	    "createdAt": "2015-10-11T07:50:42.980Z",
	    "updatedAt": "2015-10-11T07:50:42.980Z"
	  },
	  {
	    "id": 5,
	    "CapitalOneId": "qwertyuiop",
	    "Name": "out of range",
	    "Email": "me@gmail.com",
	    "Address": "123 abasdf road",
	    "Price": 12.2,
	    "Height": 15,
	    "Width": 5,
	    "Length": 100,
	    "Phone": 1234567890,
	    "Latitude": 35.9118905,
	    "Longitude": -69.05768269999999,
	    "StartMonth": "2015-10",
	    "EndMonth": "2015-03",
	    "createdAt": "2015-10-11T07:52:00.551Z",
	    "updatedAt": "2015-10-11T07:52:00.551Z"
	  },
	  {
	    "id": 6,
	    "CapitalOneId": "qwertyuiop",
	    "Name": "also perfect",
	    "Email": "me@gmail.com",
	    "Address": "323 abc road",
	    "Price": 10.52,
	    "Height": 15,
	    "Width": 5,
	    "Length": 100,
	    "Phone": 1234567890,
	    "Latitude": 35.9118905,
	    "Longitude": -79.05768269999999,
	    "StartMonth": "2014-10",
	    "EndMonth": "2016-04",
	    "createdAt": "2015-10-11T07:53:47.610Z",
	    "updatedAt": "2015-10-11T07:53:47.610Z"
	  }
	];
		
		matches = filterData.filterAll(data, spaceNeeded, startMonth, endMonth, lat, lon);
		res.json(matches);
	} else {
		db.listing.findAll().then(function(listings){
			res.json(listings);
		}, function(e) {
			res.status(500).send();
		});
	}
});

// GET /listings/:id
app.get('/listings/:id', function(req, res) {
	var listingId = parseInt(req.params.id, 10);
	
	db.listing.findById(listingId).then(function(listing) {
		if(!!listing) {
			res.json(listing.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});

// POST /listings
app.post('/listings', function(req, res) {
	var body = _.pick(req.body, 'CapitalOneId', 'Name', 'Email', 'Address', 'Price', 'Height', 'Width', 'Length', 'Phone', 'Latitude', 'Longitude', 'StartMonth', 'EndMonth');

	db.listing.create(body).then(function (listing) {
		res.json(listing.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

// DELETE /listings/:id
app.delete('/listings/:id', function(req, res) {
	var listingId = parseInt(req.params.id, 10);
	
	db.listing.destroy({
		where: {
			id: listingId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No listing with id'
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	});
});

// PUT /listings/:id
app.put('/listings/:id', function(req, res) {
	var listingId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.listing.findById(listingId).then(function(listing){
		if(listing) {
			listing.update(attributes).then (function(listing) {
				res.json(listing.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send()
	});
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port: ' + PORT);
	});
});

