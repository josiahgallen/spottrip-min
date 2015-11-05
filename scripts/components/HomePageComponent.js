'use strict';
var React = require('react');
var TripModel = require('../models/TripModel');
var PictureModel = require('../models/PictureModel');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			trips: []
		}
	},
	componentWillMount: function() {
		var query = new Parse.Query(TripModel);
		query.include('userId');
		query.descending('createdAt').limit(4).find().then (
			(trips) => {
				this.setState({trips: trips});
			},
			(err) => {
				console.log(err);
			}
		)
	},
	render: function() {
		//console.log(Parse.User.current().get('travelStats'));
		// var stats = [];
		// stats = Parse.User.current().get('totalTrips');
		// console.log(stats);

		
		var trips = [];
		trips = this.state.trips.map(function(trip) {
			return(
				<div key={trip.id} className="col-md-6">
					<div className="entryWrapper frontPageTripTile" style={{backgroundImage: 'url(../images/mapPic.png)'}}>
						<a href={'#trip/'+trip.id} className="caption">
							<h3>{trip.get('tripName').toUpperCase()}</h3>
							<p>{trip.get('tripStart').toDateString()+' - '+trip.get('tripEnd').toDateString()}</p>
							<p>Trip added by user: {trip.get('userId').get('firstName')+' '+trip.get('userId').get('lastName').substr(0,1)}</p>
						</a>
					</div>
				</div>
			)
		})
		return (
			<div>
				<div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
					//Indicators
					<ol className="carousel-indicators">
						<li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
						<li data-target="#carousel-example-generic" data-slide-to="1"></li>
						<li data-target="#carousel-example-generic" data-slide-to="2"></li>
						<li data-target="#carousel-example-generic" data-slide-to="3"></li>
						<li data-target="#carousel-example-generic" data-slide-to="4"></li>
					</ol>
					//Wrapper for slides
					<div className="carousel-inner" role="listbox">
					<div className="item active">
							<img className="carouselPic" src="../images/DSC_0286.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img className="logo" src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_0368.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img className="logo" src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_3050.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img className="logo" src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_3156.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img className="logo" src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_2712.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img className="logo" src="../images/badgeWhite.png"/></div>
							</div>
						</div>
					</div> 
					<a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
						<span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
						<span className="sr-only">Previous</span>
					</a>
					<a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
						<span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
						<span className="sr-only">Next</span>
					</a>
				</div>
				<div className="container-fluid">
					<div className="row">
						<div className="well myWell well-md col-xs-10 col-sm-8 col-xs-offset-1 col-sm-offset-2" id="pageLead">
							<h2>Welcome to SpotTrip</h2>
							<p>
								You love to travel, you love to take pictures of your trip, but afterwards, when you
								get back to the real world, what happens to those memories?  Most of us
								save them to a laptop somewhere and they are never looked at again.
								With <strong>SpotTrip</strong> you now have a fun and meaningful way to organize your trip!
							</p>
							<h3>Check out trips from other SpotTrip Travelers</h3>
							<div>
								{trips}
							</div>
						</div>
					</div>
					<div className="anchorWrapper">
						<a className="featureButton"href="#register">Get Started Here</a>
					</div>
				</div>
			</div>

		);
	},
	addLocation: function(e) {
		e.preventDefault();
		this.props.infoWindow.close();
		this.props.onLocationAdded(this.props.address,this.refs.tripTitle.value,this.refs.startDate.value,this.refs.endDate.value);
	}
});