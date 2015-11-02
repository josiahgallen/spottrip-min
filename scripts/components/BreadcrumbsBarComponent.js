'use strict';
var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<ol className="breadcrumb navbar-fixed-top">
				<li><a href="#">Home</a></li>
				{this.props.children}
			</ol>
		)
	}
})