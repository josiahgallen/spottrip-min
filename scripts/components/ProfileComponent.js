'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
var InfoWindowComponent = require('./InfoWindowComponent');
var BreadCrumbsBarComponent = require('./BreadCrumbsBarComponent');
var TripModel = require('../models/TripModel');
var StatsModel = require('../models/StatsModel');
var TripsPortalComponent = require('./TripsNSpotsPortalComponent');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			trips: [],
			map: [],
			newestTrip: null
		}
	},
	componentWillMount: function() {
		var query = new Parse.Query(TripModel);
		query.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
			(trips) => {
				trips.forEach((marker) => {
					var myLatLng = {lat: marker.get('marker').latitude, lng: marker.get('marker').longitude};
					var tripName = '<h4>'+marker.get('tripName')+'</h4><p>'+marker.get('address')+'<br>'+marker.get('tripStart').toDateString()+' - '+marker.get('tripEnd').toDateString()+'</p><a href=#trip/'+marker.id+'>Edit Trip</a>';
					var marker = new google.maps.Marker({
						position: myLatLng,
						map: this.state.map,
						title: marker.get('tripName'),
						animation: google.maps.Animation.DROP
					});
					var infowindow = new google.maps.InfoWindow({
						content: tripName
					});
					marker.addListener('click', () => {
						infowindow.open(this.state.map, marker);
					});
				})
				this.setState({trips: trips})
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
		var currentUser = Parse.User.current();
		var myList = [];
		var newTrip = [];

		
		myList = this.state.trips.map(function(listItem) {
			return(
				<a key={listItem.id} href={'#trip/'+listItem.id} className="list-group-item"><strong>{listItem.get('tripName')}</strong><div>{listItem.get('tripStart').toDateString()} thru {listItem.get('tripEnd').toDateString()}</div></a>
			)
		})
		if(this.state.newTrip) {
			newTrip = (<a key={this.state.newTrip.id} href={'#trip/'+this.state.newTrip.id} className="list-group-item"><strong>{this.state.newTrip.get('tripName')}</strong><div>{this.state.newTrip.get('tripStart').toDateString()} - {this.state.newTrip.get('tripEnd').toDateString()}</div></a>)
		}
		return(
			<div>
				<span><h1 className="pageHeader">Welcome Back {currentUser.get('firstName')}!</h1></span>
				<TripsPortalComponent myList={myList} newestListItem={newTrip} listTitle={'Trip List'}>
					<div ref="map"></div>
				</TripsPortalComponent>
				<BreadCrumbsBarComponent>
					<li className="active">Profile</li>
				</BreadCrumbsBarComponent>
			</div>
		)
	},
	addNewLocation: function(address,tripTitle,startDate,endDate) {
		var newTrip = new TripModel({
			userId: Parse.User.current(),
			tripName: tripTitle,
			tripStart: new Date (startDate),
			tripEnd: new Date (endDate),
			address: address.formatted_address,
			marker: new Parse.GeoPoint(address.geometry.location.lat(),address.geometry.location.lng())
		})
		newTrip.save().then(
			(trip) => {
				var myLatLng = {lat: trip.get('marker').latitude, lng: trip.get('marker').longitude};
				var tripName = '<h4>'+trip.get('tripName')+'</h4><p>'+trip.get('address')+'<br>'+trip.get('tripStart').toDateString()+' thru '+trip.get('tripEnd').toDateString()+'</p><a href=#trip/'+trip.id+'>Edit Trip</a>';
				var marker = new google.maps.Marker({
					position: myLatLng,
					map: this.state.map,
					title: trip.get('tripName')
				});
				var infowindow = new google.maps.InfoWindow({
					content: tripName
				});
				marker.addListener('click', () => {
					infowindow.open(this.state.map, marker);
				});
				this.setState({newTrip: trip});
				var statQuery = new Parse.Query(StatsModel);
				statQuery.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
					(stats) => {
						stats.forEach((stat)=>{
							var trips = stat.get('trips');
							stat.save({
								trips: trips+1
							})
						})
					},
					(err) => {
						console.log(err);
					}
				)
				this.props.router.navigate('#trip/'+trip.id, {trigger: true});

			},
			(err) => {
				console.log(err);
			}
		);
	}
});