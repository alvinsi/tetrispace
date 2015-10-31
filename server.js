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

/**
* GET /listings/
*/
app.get('/listings', function(req, res) {
	var query = req.query;
	var where = {};
	var lat, lon, endMonth, startMonth;
	var matches = [];

	// if (query.hasOwnProperty('Latitude') && query.Latitude.length > 0 
	// 			&& query.hasOwnProperty('StartMonth') && query.StartMonth.length > 0
	// 			&& query.hasOwnProperty('Longitude') && query.Longitude.length > 0
	// 			&& query.hasOwnProperty('EndMonth') && query.EndMonth.length > 0) {
	// 	lat = query.Latitude;
	// 	lon = query.Longitude;
	// 	startMonth = query.StartMonth;
	// 	endMonth = query.StartMonth;
	// 	spaceNeeded = query.SpaceNeeded;
	// 	db.listing.findAll().then(function(listings){
	// 		matches = filterData.filterAll(listings, spaceNeeded, startMonth, endMonth, lat, lon);
	// 		res.json(matches);
	// 	})
	// } else {
	// 	res.status(500).send();
	// }

	db.listing.findAll().then(function(listings){
		if (listings) {
			res.json(listings);
		} else {
			res.status(500).send();
		}
	});
});

/**
* GET /listings/:id
*/
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

/**
* POST /listings
*/
app.post('/listings', function(req, res) {
	var body = _.pick(req.body, 'CapitalOneId', 'Name', 'Email', 'Address', 'Price', 'Height', 'Width', 'Length', 'Phone', 'Latitude', 'Longitude', 'StartMonth', 'EndMonth');

	db.listing.create(body).then(function (listing) {
		res.json(listing.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

/**
* DELETE /listings/:id
*/
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

/**
* PUT /listings/:id
*/
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

