'use strict';
var React = require('react');
var TripModel = require('../models/TripModel');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			trips: []
		}
	},
	componentWillMount: function() {
		var query = new Parse.Query(TripModel);
		query.include('userId');
		query.include('featurePic');
		query.descending('createdAt').find().then (
			(trips) => {
				this.setState({trips: trips});
			},
			(err) => {
				console.log(err);
			}
		)
	},
	render: function() {
		var trips = [];
		trips = this.state.trips.map(function(trip) {
			return(
				<div key={trip.id} className="col-sm-6 col-md-4">
					<div className="entryWrapper frontPageTripTile" style={trip.get('featurePic')? {backgroundImage: 'url('+trip.get('featurePic').get('picture').url()+')'} : {backgroundImage: 'url(../images/mapPic.png)'}}>
						<div>
							<a href={'#trip/'+trip.id} className="caption">
								<h3>{trip.get('tripName').toUpperCase()}</h3>
								<p>{trip.get('tripStart').toDateString()+' - '+trip.get('tripEnd').toDateString()}</p>
								<p>Trip shared by SpotTraveler: {trip.get('userId').get('firstName')+' '+trip.get('userId').get('lastName').substr(0,1)}</p>
							</a>
						</div>
					</div>
				</div>
			)
		})
		return (
			<div>
				<h1 className="pageHeader">SpotTrip Community</h1>
				<div className="row">
						<div className="col-xs-offset-1 col-xs-10">
							{trips}
						</div>
				</div>
			</div>
		)
	}
})