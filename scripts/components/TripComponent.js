'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var TripModel = require('../models/TripModel');
var SpotModel = require('../models/SpotModel');
var StatsModel = require('../models/StatsModel');
var PictureModel = require('../models/PictureModel');
var JournalEntryModel = require('../models/JournalEntryModel');
var PictureModalComponent = require('./PictureModalComponent');
var EntryModalComponent = require('./EntryModalComponent');
var BreadCrumbsBarComponent = require('./BreadCrumbsBarComponent');
var InfoWindowComponent = require('./InfoWindowComponent');
var SpotsPortalComponent = require('./TripsNSpotsPortalComponent');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			trip: null,
			spots: [],
			newSpot: null,
			pictures: [],
			entries: []
		}
	},
	componentWillMount: function() {
		$('#myModal').on('shown.bs.modal', function () {
			$('#myInput').show()
		})
		var query = new Parse.Query(TripModel);
		query.include('userId');
		query.get(this.props.trip).then(
			(trip) => {
				this.setState({trip: trip});
			},
			(err) => {
				console.log(err);
			}
		)
		var spotQuery = new Parse.Query(SpotModel);
		spotQuery.include('tripId');
		spotQuery.equalTo('tripId', new TripModel({objectId: this.props.trip})).find().then(
			(spots) => {
				spots.forEach((spot) => {
					var myLatLng = {lat: spot.get('spotMarker').latitude, lng: spot.get('spotMarker').longitude};
					var mapCenter = {lat: spot.get('tripId').get('marker').latitude, lng: spot.get('tripId').get('marker').longitude};
					var infoContent = '<h4>'+spot.get('spotName')+'</h4><p>'+spot.get('address')+'<br>'+spot.get('spotDateStart').toDateString()+' - '+spot.get('spotDateEnd').toDateString()+'</p><a href=#spot/'+spot.id+'>Post to my Spot</a>';
					var marker = new google.maps.Marker({
						position: myLatLng,
						map: this.state.map,
						title: spot.get('spotName'),
						animation: google.maps.Animation.DROP
					});
					var infowindow = new google.maps.InfoWindow({
						content: infoContent
					});
					marker.addListener('click', () => {
						infowindow.open(this.state.map, marker);
					});
				})
				this.setState({spots: spots});
			},
			(err) => {
				console.log(err);
			}
		)
		var pictureQuery = new Parse.Query(PictureModel);
		pictureQuery.matchesQuery('spotId', spotQuery).find().then(
			(pictures) => {
				this.setState({pictures: pictures});
			},
			(err) => {
				console.log(err);
			}
		)
		var journalQuery = new Parse.Query(JournalEntryModel);
		journalQuery.equalTo('tripId', new TripModel({objectId: this.props.trip})).find().then(
			(entries) => {
				this.setState({entries: entries});
			},
			(err) => {
				console.log(err);
			}
		)
	},
	componentDidMount: function() {
		var self = this;
		if(this.state.spots.length > 0) {
			tripPoint.lat = this.state.spots.get('tripId').get('marker').latitude;
			tripPoint.lng = this.state.spots.get('tripId').get('marker').longitude;
		}
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
		var pictures = [];
		var pictureList = [];
		var entries = [];
		var buttons = [];
		
		if(this.state.trip) {
			if(Parse.User.current() && Parse.User.current().id === this.state.trip.get('userId').id) {
				buttons.push(
					<div key="buttons">
						<button onClick={this.editTrip} title="Edit Trip" type="button" className="btn btn-primary hoverButton bottomButton" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></button>
						<br/>
						<button onClick={this.deleteModal} title="Delete Trip" type="button" className="btn btn-primary hoverButton" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></button>
					</div>
				)
			}
		}

		myList = this.state.spots.map(function(spot) {
			return(
				<a key={spot.id} href={'#spot/'+spot.id} className="list-group-item"><strong>{spot.get('spotName')}</strong><div>{spot.get('spotDateStart').toDateString()} thru {spot.get('spotDateEnd').toDateString()}</div></a>
			)
		})
		pictures = this.state.pictures.map(function(picture) {
			return(
				<PictureModalComponent picture={picture} key={picture.id}/>

			)
		})
		pictureList = this.state.pictures.map(function(picture){
			return(
				<option key={picture.id} value={picture.id}>{picture.get('title')}</option>
			)
		})
		entries = this.state.entries.map(function(entry) {
			return(
				<EntryModalComponent entry={entry} key={entry.id} />
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
				<SpotsPortalComponent router={this.props.router} myList={myList} newestListItem={newSpot} listTitle={'Trip Spots'}>
					<div ref="map"></div>
				</SpotsPortalComponent>
				<div className="row">
					{pictures}
				</div>
				<div className="row">
					<div className="col-xs-offset-1 col-md-offset-2">
						{entries}
					</div>
				</div>
				<div className="addMediaButtonsWrapper">
					{buttons}
				</div>
				<div id="modaly" className="modal modaly fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
					<div className="modal-dialog modal-lg">
						<div className="modal-content inputModal">
							<h1>Edit Trip</h1>
							<hr/>
							<form>
								<div className="form-group xs-col-6">
									<label>Change Trip Name</label>
									<input type="text" ref="editTripTitle" className="form-control" id="blogTitle" />
								</div>
								<div className="form-group xs-col-6">
									<label>Trip Start </label>
									<input ref="startDate" type="date"/>
									<label> Trip End </label>
									<input ref="endDate" type="date"/>
								</div>
								<div className="form-group xs-col-6">
									<label>Select Trip Feature Pic</label>
									<select ref="feature" className="form-control">
										{pictureList}
									</select>
								</div>
							</form>
							 <div className="modal-footer">
								<button onClick={this.closeModal} type="button" className="btn btn-default cancel" data-dismiss="modal">Cancel</button>
								<button onClick={this.changeTripInfo} type="button" className="btn btn-primary">Save</button>
							</div>
						</div>
					</div>
				</div>
				<div id="modelier" className="modal modaly fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
					<div className="modal-dialog modal-lg">
						<div className="modal-content inputModal">
							<h1>Remove Trip</h1>
							<hr/>
							<div className="alert alert-danger" role="alert">
								<p>
									Warning all Spots, Pictures, and Journals associated with this Trip will be permanetly removed! (enter trip name to confirm)
								</p>
								<br/>
								<div className="form-group">
    								<label htmlFor="exampleInputEmail1">Trip Name</label>
    								<input type="text" ref="deleteConfirm" className="form-control" id="exampleInputEmail1"/>
  								</div>
							</div>
							<div className="modal-footer">
								<button onClick={this.closeOtherModal} type="button" className="btn btn-default cancel" data-dismiss="modal">Cancel</button>
								<button onClick={this.deleteTrip} className="btn btn-primary">Destroy Forever</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},
	changeTripInfo: function() {
		console.log('changing');
		console.log(this.refs.feature.value);
		this.state.trip.save({
			tripName: this.refs.editTripTitle.value === '' ? this.state.trip.get('tripName') : this.refs.editTripTitle.value,
			tripStart: this.refs.startDate.value === '' ? new Date (this.state.trip.get('tripStart')) : new Date (this.refs.startDate.value),
			tripEnd: this.refs.endDate.value === '' ? new Date (this.state.trip.get('tripEnd')) : new Date (this.refs.endDate.value),
			featurePic: new PictureModel({objectId: this.refs.feature.value})
		})
		$('#modaly').modal('hide');
		this.forceUpdate();
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
					var statQuery = new Parse.Query(StatsModel);
					statQuery.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
						(stats) => {
							stats.forEach((stat)=>{
								var spots = stat.get('spots');
								stat.save({
									spots: spots+1
								})
							})
						},
						(err) => {
							console.log(err);
						}
					)
					this.props.router.navigate('#spot/'+spot.id, {trigger: true});
			},
			(err) => {
				console.log(err);
			}
		);
	},
	editTrip: function() {
		$('#modaly').modal('show');
	},
	deleteModal: function() {
		$('#modelier').modal('show');
	},
	deleteTrip: function() {
		console.log('start delete');
		var answer = this.refs.deleteConfirm.value;
		if(answer === this.state.trip.get('tripName')) {
			var numSpots = this.state.spots.length;
			var numPics = this.state.pictures.length;
			var numEntries = this.state.entries.length;
			Parse.Object.destroyAll(this.state.entries,{
				success: function(entry) {
					console.log('all journal entries destroyed')
				},
				error: function(err) {
					console.log(err);
				}
			});
			Parse.Object.destroyAll(this.state.pictures,{
				success: function(picture) {
					console.log('all pictures destroyed')
				},
				error: function(err) {
					console.log(err);
				}
			});
			Parse.Object.destroyAll(this.state.spots,{
				success: function(spot) {
					console.log('all spots destroyed')
				},
				error: function(err) {
					console.log(err);
				}
			});
			this.state.trip.destroy({
				success: function(object) {
					var statQuery = new Parse.Query(StatsModel);
					statQuery.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
						(stats) => {
							stats.forEach((stat)=>{
								var pics = stat.get('pictures');
								var blogs = stat.get('blogs');
								var spots = stat.get('spots');
								var trips = stat.get('trips');
								pics = pics - numPics;
								blogs = blogs - numEntries;
								spots = spots - numSpots;
								stat.save({
									pictures: pics,
									blogs: blogs,
									spots: spots,
									trips: trips - 1
								})
							})
						},
						(err) => {
							console.log(err);
						}
					)
					console.log(object, ' has been permanetly deleted');
				},
				error: function(object) {
					console.log('error deleting ', object)
				}
			})
			$('#modelier').modal('hide');
			this.props.router.navigate('#profile', {trigger: true});
		}
	},
	closeModal: function() {
		$('#modaly').modal('hide');
	},
	closeOtherModal: function() {
		$('#modelier').modal('hide');	
	}
	
});