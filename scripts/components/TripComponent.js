'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var TripModel = require('../models/TripModel');
var SpotModel = require('../models/SpotModel');
var BreadCrumbsBarComponent = require('./BreadCrumbsBarComponent');
var InfoWindowComponent = require('./InfoWindowComponent');
var SpotsPortalComponent = require('./TripsNSpotsPortalComponent');


module.exports = React.createClass({
	getInitialState: function() {
		return {
			trip: null,
			spots: [],
			newSpot: null
		}
	},
	componentWillMount: function() {
		var query = new Parse.Query(TripModel);
		query.get(this.props.trip).then(
			(trip) => {
				this.setState({trip: trip});
			},
			(err) => {
				console.log(err);
			}
		)
		var spotQuery = new Parse.Query(SpotModel);
		spotQuery.equalTo('tripId', new TripModel({objectId: this.props.trip})).find().then(
			(spots) => {
				spots.forEach((spot) => {
					var myLatLng = {lat: spot.get('spotMarker').latitude, lng: spot.get('spotMarker').longitude};
					var infoContent = '<h4>'+spot.get('spotName')+'</h4><p>'+spot.get('address')+'<br>'+spot.get('spotDateStart').toDateString()+' - '+spot.get('spotDateEnd').toDateString()+'</p><a href=#spot/'+spot.id+'>Post to my Spot</a>';
					var marker = new google.maps.Marker({
    					position: myLatLng,
    					map: this.state.map,
    					title: spot.get('spotName')
  					});
  					var infowindow = new google.maps.InfoWindow({
    					content: infoContent
  					});
  					marker.addListener('click', () => {
    					infowindow.open(this.state.map, marker);
  					});
				})
				this.setState({spots: spots})
			},
			(err) => {
				console.log(err);
			}
		)
	},
	componentDidMount: function() {
		var self = this;
		var mapCenter = {lat: 25, lng: -30};

		var geocoder = new google.maps.Geocoder();
		this.map = new google.maps.Map(this.refs.map, {
			center: mapCenter,
			zoom: 2,
			disableDefaultUI: true,
			zoomControl: true
		});
		this.setState({map: this.map})
		document.getElementById('tripSearchButton').addEventListener('click', () => {
			geocodeAddress(geocoder, this.map);
		});
		function geocodeAddress(geocoder, resultsMap) {
			var address = document.getElementById('tripInput').value;
			document.getElementById('tripInput').value = '';
			geocoder.geocode({'address': address}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					resultsMap.setCenter(results[0].geometry.location);
					var infoWindow = new google.maps.InfoWindow({
						map: resultsMap,
						position: results[0].geometry.location
					});

					//important
					var infoWindowContainer = document.createElement('div');
					ReactDOM.render(<InfoWindowComponent address={results[0]} infoWindow={infoWindow} onLocationAdded={self.addNewLocation} />, infoWindowContainer);
					infoWindow.setContent(infoWindowContainer);
					//*********
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});
		}
	},
	render: function() {
		var myList = [];
		var newSpot = [];
		myList = this.state.spots.map(function(spot) {
			return(
				<a key={spot.id} href={'#spot/'+spot.id} className="list-group-item"><strong>{spot.get('spotName')}</strong><div>{spot.get('spotDateStart').toDateString()} thru {spot.get('spotDateEnd').toDateString()}</div></a>
			)
		})
		this.state.newSpot ? newSpot = (<a key={this.state.newSpot.id} href={'#spot/'+this.state.newSpot.id} className="list-group-item"><strong>{this.state.newSpot.get('spotName')}</strong><div>{this.state.newSpot.get('spotDateStart').toDateString()} thru {this.state.newSpot.get('spotDateEnd').toDateString()}</div></a>): newSpot = [];
		return (
			<div>
				<BreadCrumbsBarComponent>
					<li><a href="#profile">Profile</a></li>
					<li className="active">My Trip</li>
				</BreadCrumbsBarComponent>
				<h1 className="pageHeader">{this.state.trip ? this.state.trip.get('tripName') : ''}</h1>
				<h4 className="dateHeading">{this.state.trip ? this.state.trip.get('tripStart').toDateString() +' - '+ this.state.trip.get('tripEnd').toDateString() : ''}</h4>
				<SpotsPortalComponent myList={myList} newestListItem={newSpot} listTitle={'Trip Spots'}>
					<div ref="map"></div>
				</SpotsPortalComponent>
			</div>
		);
	},
	addNewLocation: function(address,tripTitle,startDate,endDate) {
		var newSpot = new SpotModel({
			tripId: new TripModel({objectId: this.state.trip.id}),
			spotName: tripTitle,
			spotDateStart: new Date (startDate),
			spotDateEnd: new Date (endDate),
			address: address.formatted_address,
			spotMarker: new Parse.GeoPoint(address.geometry.location.lat(),address.geometry.location.lng())
		})
		newSpot.save().then(
			(spot) => {
				var myLatLng = {lat: spot.get('spotMarker').latitude, lng: spot.get('spotMarker').longitude};
					var spotName = '<h4>'+spot.get('spotName')+'</h4><p>'+spot.get('address')+'<br>'+spot.get('spotDateStart').toDateString()+' thru '+spot.get('spotDateEnd').toDateString()+'</p><a href=#spot/'+spot.id+'>Add to Spot</a>';
					var marker = new google.maps.Marker({
    					position: myLatLng,
    					map: this.state.map,
    					title: spot.get('spotName')
  					});
  					var infowindow = new google.maps.InfoWindow({
    					content: spotName
  					});
  					marker.addListener('click', () => {
    					infowindow.open(this.state.map, marker);
  					});
  					this.setState({newSpot: spot});

			},
			(err) => {
				console.log(err);
			}
		);
	}
	
});