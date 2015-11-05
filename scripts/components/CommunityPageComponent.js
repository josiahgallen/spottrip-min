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
				<div key={trip.id} className="communityTile" style={{backgroundImage: 'url(../images/mapPic.png)'}}>
					<a href={'#trip/'+trip.id} className="caption">
						<h3>{trip.get('tripName').toUpperCase()}</h3>
						<p>{trip.get('tripStart').toDateString()+' - '+trip.get('tripEnd').toDateString()}</p>
						<p>Trip added by user: {trip.get('userId').get('firstName')+' '+trip.get('userId').get('lastName').substr(0,1)}</p>
					</a>
				</div>
			)
		})
		return (
			<div>
				<h1 className="pageHeader">Community Page</h1>
				<div className="row">
						<div className="col-xs-offset-1 col-xs-10">
							{trips}
						</div>
				</div>
			</div>
		)
	}
})