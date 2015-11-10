'use strict';
var React = require('react');
var Backbone = require('backbone');

module.exports = React.createClass({
	render: function() {
		var dateLabel = 'Trip';
		var currentPage = Backbone.history.getFragment();
		currentPage !== 'profile' ? dateLabel = 'Spot' : '';
		return (
			<div>
				<form onSubmit={this.addLocation}><br/>
					<input className="infoWindowInput" ref="tripTitle" type="text" placeholder="Title"/>
					<label>{this.props.address.formatted_address}</label><br/>
					<input className="infoWindowInput" ref="startDate" type="date"/>
					<label>{dateLabel} Start </label><br/>
					<input className="infoWindowInput" ref="endDate" type="date"/>
					<label> {dateLabel} End </label><br/>
					<button className="infoWindowAddButton">Add</button>
				</form>
			</div>
		);
	},
	addLocation: function(e) {
		e.preventDefault();
		this.props.infoWindow.close();
		this.props.onLocationAdded(this.props.address,this.refs.tripTitle.value,this.refs.startDate.value,this.refs.endDate.value);
	}
});