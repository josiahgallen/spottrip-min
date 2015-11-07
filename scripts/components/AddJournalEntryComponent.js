'use strict';
var React = require('react');
var JournalEntryModel = require('../models/JournalEntryModel');
var EntryModalComponent = require('./EntryModalComponent');
var SpotModel = require('../models/SpotModel');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			journalEntries: []
		}
	},
	componentWillMount: function() {
		var journalQuery = new Parse.Query(JournalEntryModel);
		journalQuery.equalTo('spotId', new SpotModel({objectId: this.props.spot})).find().then(
			(entries) => {
				this.props.onEntryQuery(entries);
				this.setState({journalEntries: entries});
			},
			(err) => {
				console.log(err);
			}
		)
		this.props.dispatcher.on('entryAdded', (entry) => {
			this.state.journalEntries.push(entry);
			this.setState({journalEntries: this.state.journalEntries});
		})
	},
	render: function() {
		var entries = [];
		entries = this.state.journalEntries.map(function(entry) {
			return(
				<EntryModalComponent entry={entry} key={entry.id}/>
			)
		});
		return (
			<div className="row">
				<div className="col-xs-offset-1 col-md-offset-2">
						{entries}
					</div>
			</div>
		);
	}
});