'usestrict';
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
var StatsModel = require('../models/StatsModel');
require('bootstrap');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			trips: 0,
			spots: 0,
			entries: 0,
			pics: 0,
			rank: ''
		}
	},
	componentWillMount: function() {
		if(Parse.User.current()) {
		var statQuery = new Parse.Query(StatsModel);
		statQuery.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
			(stats) => {
				stats.forEach((stat) => {
					var spots = stat.get('spots');
					var trips = stat.get('trips');
					var pics = stat.get('pictures');
					var entries = stat.get('blogs');
					var rank = 'Beginner';
					var combined = [];
					combined.push(spots,trips,pics,entries);
						var reduced = combined.reduce(function(a,b){
							return a + b;
						})
						if (reduced >= 20) {
							rank = 'Journeyman'
						} else if (reduced < 20 && reduced >= 15) {
							rank = 'Well Traveled'
						} else if (reduced < 15 && reduced >= 10) {
							rank = 'Getting Around';
						} else if (reduced < 10 && reduced >= 5) {
							rank = 'Novice';
						} else if (reduced < 5) {
							rank = 'Beginner';
						}
						this.setState({
							trips: trips,
							spots: spots,
							pics: pics,
							entries: entries,
							rank: rank
						})
					})
				},
				(err) => {
					console.log(err);
				}
			)
		}
	},
	render: function() {
		var currentURL = Backbone.history.getFragment();
		var buttonTitle = 'Start a new Trip';
		currentURL.indexOf('trip') > -1 ? buttonTitle = 'Add a new Spot' : '';
		var statHeadings = ['Trips','Spots','BlogEntries','Picture Uploads'];

		if(!Parse.User.current()) {
			statHeadings.forEach(function(item,index,array) {
				array[index] = 'Stats Unavailable, Please Login';
			})
		}
		return(
			<div>
				<div className="panel panel-default col-xs-10 col-xs-offset-1 col-sm-offset-1 col-md-6">
					<div className="panel-heading ">
						<h3 className="panel-title">My Trips</h3>
					</div>
					<div className="panel-body">
						<div className="floating-panel">
							<input className="address" id="tripInput" type="textbox" defaultValue="Austin, TX"/>
							<input className="submit" id="tripSearchButton" type="button" value={buttonTitle}/>
						</div>
						{this.props.children}
					</div>
					<div className="panel-footer">
						<h5>Traveler Rank: {this.state.rank}</h5>
						<ul className="list-group">
							<li className="list-group-item">
							<span className="badge">{this.state.trips}</span>
								{statHeadings[0]}
							</li>
							<li className="list-group-item">
							<span className="badge">{this.state.spots}</span>
								{statHeadings[1]}
							</li>
							<li className="list-group-item">
							<span className="badge">{this.state.entries}</span>
								{statHeadings[2]}
							</li>
							<li className="list-group-item">
							<span className="badge">{this.state.pics}</span>
								{statHeadings[3]}
							</li>
						</ul>
					</div>
				</div>
				<div id="tripListWell" className="well well-lg col-xs-10 col-xs-offset-1 col-sm-offset-1 col-md-3">
					<h2>{this.props.listTitle}</h2>
					<div className="list-group">
						{this.props.myList}
						{this.props.newestListItem}
					</div>
				</div>
			</div>
		)
	}
})