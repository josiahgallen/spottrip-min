'use strict';
var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<form onSubmit={this.addLocation}>
					<input ref="tripTitle" type="text" placeholder="Title"/>
					<label>{this.props.address.formatted_address}</label><br/>
					<input ref="startDate" type="date"/>
					<label>Trip Start </label><br/>
					<input ref="endDate" type="date"/>
					<label> Trip End </label><br/>
					<button>Add</button>
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