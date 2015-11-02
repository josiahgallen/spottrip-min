'usestrict';
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
require('bootstrap');

module.exports = React.createClass({
	render: function() {
		var currentURL = Backbone.history.getFragment();
		var buttonTitle = 'Start a new Trip';
		currentURL.indexOf('trip') > -1 ? buttonTitle = 'Add a new Spot' : '';
		return(
			<div>
				<div className="panel panel-default col-sm-offset-1 col-sm-6">
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
						<h5>Traveler Rank: Beginner</h5>
						<ul className="list-group">
							<li className="list-group-item">
							<span className="badge">0</span>
								Trips
							</li>
							<li className="list-group-item">
							<span className="badge">0</span>
								Spots
							</li>
							<li className="list-group-item">
							<span className="badge">0</span>
								Blog Entries
							</li>
							<li className="list-group-item">
							<span className="badge">0</span>
								Picture Uploads
							</li>
						</ul>
					</div>
				</div>
				<div id="tripListWell" className="well well-lg col-sm-offset-1 col-sm-3">
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