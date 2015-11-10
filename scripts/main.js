'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
window.$ = require('jquery');
window.jQuery = $;
require('bootstrap');

var NavComponent = require('./components/NavComponent');
var HomePageComponent = require('./components/HomePageComponent');
var LoginRegisterComponent = require('./components/LoginRegisterComponent');
var ProfileComponent = require('./components/ProfileComponent');
var TripsComponent = require('./components/TripComponent');
var SpotComponent = require('./components/SpotComponent');
var CommunityPageComponent = require('./components/CommunityPageComponent');
var _ = require('backbone/node_modules/underscore/underscore-min');

Parse.initialize('SReTPFlNUeFnSqrBx33yNVHKDqR0jrY6BB2l6E47','XGMgOrJcA5H1O3jc7OwPVyt0n9oo6BXiJsD7Gptm');

var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'login': 'login',
		'register': 'register',
		'profile': 'profile',
		'trip/:id': 'trip',
		'spot/:id': 'spot',
		'community': 'community'
	},
	home: function() {
		ReactDOM.render(<HomePageComponent router={r}/>,document.getElementById('app'));
	},
	login: function() {
		ReactDOM.render(<LoginRegisterComponent router={r}/>,document.getElementById('app'));
	},
	register: function() {
		ReactDOM.render(<LoginRegisterComponent router={r}/>,document.getElementById('app'));
	},
	profile: function() {
		ReactDOM.render(<ProfileComponent router={r}/>,document.getElementById('app'));
	},
	trip: function(id) {
		ReactDOM.render(<TripsComponent trip={id} router={r}/>,document.getElementById('app'));
	},
	spot: function(id) {
		ReactDOM.render(<SpotComponent spot={id} router={r}/>,document.getElementById('app'));
	},
	community: function() {
		ReactDOM.render(<CommunityPageComponent router={r}/>,document.getElementById('app'));
	}
})

var r = new Router();
Backbone.history.start();

ReactDOM.render(
		<NavComponent router={r}/>,
		document.getElementById('nav')
	);

