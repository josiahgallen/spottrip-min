'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var SpotModel = require('../models/SpotModel');
var AddMediaComponent = require('./AddMediaComponent');
var BreadCrumbsBarComponent = require('./BreadCrumbsBarComponent');
var AddJournalEntryComponent = require('./AddJournalEntryComponent');
var PictureModel = require('../models/PictureModel');
var JournalEntryModel = require('../models/JournalEntryModel');
var Backbone = require('backbone');
var _ = require('backbone/node_modules/underscore/underscore-min');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			spot: null,
			newPic: null,
			journalEntries: []
		}
	},
	componentWillMount: function() {
		$('#myModal').on('shown.bs.modal', function () {
			$('#myInput').show();
		})
		this.dispatcher = {};
		_.extend(this.dispatcher, Backbone.Events);
		var query = new Parse.Query(SpotModel);
		query.get(this.props.spot).then(
			(spot) => {
				var popUp = {lat: spot.get('spotMarker').latitude, lng: spot.get('spotMarker').longitude};
				var mapCenter = {lat: spot.get('spotMarker').latitude, lng: spot.get('spotMarker').longitude};
		
				this.map = new google.maps.Map(this.refs.map, {
				center:  mapCenter,
				zoom: 8,
				disableDefaultUI: true,
				zoomControl: true
				});
				var marker = new google.maps.Marker({
						map: this.map,
						position: popUp,
						title: spot.get('spotName')
				});
				this.setState({map: this.map, spot: spot});
			},
			(err) => {
				console.log(err);
			}
		)
	},
	render: function() {
		return (
			<div>
				<h1 className="pageHeader">{this.state.spot ? this.state.spot.get('spotName') : ''}</h1>
				<BreadCrumbsBarComponent>
					<li><a href="#profile">Profile</a></li>
					<li><a href={this.state.spot ? '#trip/'+this.state.spot.get('tripId').id : '#trip'}>My Trip</a></li>
					<li className="active">My Spot</li>
				</BreadCrumbsBarComponent>
				<div className="row col-xs-offset-2">
					<div id="spotMap" ref="map" className="col-xs-9"></div>
					
				</div>
				<div className="addMediaButtonsWrapper navbar-fixed-bottom">
					<button onClick={this.onModalShow} title="Add Journal Entry" type="button" className="btn btn-primary hoverButton bottomButton" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>
					<button onClick={this.onPicModalShow} title="Add Photo" type="button" className="btn btn-primary hoverButton" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-camera" aria-hidden="true"></span></button>
				</div>
				<AddMediaComponent dispatcher={this.dispatcher} picture={this.state.newPic} onFullPicModalShow={this.onFullPicModalShow} onPicModalShow={this.onPicModalShow} onModalShow={this.onModalShow} spot={this.props.spot} />
				<AddJournalEntryComponent dispatcher={this.dispatcher} entry={this.state.newEntry} spot={this.props.spot}/>
				<div ref="myModal"id="myModal" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
					<div className="modal-dialog modal-lg">
						<div className="modal-content inputModal">
							<h1>Journal Entry</h1>
							<hr/>
							<form>
								<div className="form-group xs-col-6">
									<input type="text" ref="journalTitle" className="form-control" id="blogTitle" placeholder="Title"/>
								</div>
								<div className="form-group">
									<textarea ref="entry" className="form-control" rows="6" placeholder="Trip Memories Go Here!"></textarea>
								</div>
							</form>
							 <div className="modal-footer">
								<button type="button" className="btn btn-default cancel" data-dismiss="modal">Cancel</button>
								<button onClick={this.addJournalEntry} type="button" className="btn btn-primary">Add Entry</button>
							</div>
						</div>
					</div>
				</div>
				<div ref="picModal"id="myModal" className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog" ariaLabelledby="mySmallModalLabel">
					<div className="modal-dialog modal-sm">
						<div className="modal-content inputModal">
							<h1>Upload Photos</h1>
							<hr/>
							<form>
								<input type="text" maxLength="20" className="form-control" ref="title" placeholder="title"/>
								<textarea maxLength="50" className="form-control" rows="2" ref="caption" placeholder="caption(limit to 50 characters)"/>
								<input type="file" className="fileUpload" ref="addPicture"/>
							</form>
							<div className="modal-footer">
								<button onClick={this.addPicture} className="btn btn-primary">Upload Photo</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},
	onModalShow: function() {
		$(this.refs.myModal).modal('show');
	},
	onPicModalShow: function(e) {
		$(this.refs.picModal).modal('show');
	},
	onFullPicModalShow: function(e) {
		$(this.refs.picture.id)
	},
	addJournalEntry: function() {
		var newEntry = new JournalEntryModel({
			title: this.refs.journalTitle.value,
			entry: this.refs.entry.value,
			spotId: new SpotModel({objectId:this.props.spot})
		})
		newEntry.save().then(
			(entry) => {
				this.setState({newEntry: entry})
				this.dispatcher.trigger('entryAdded', entry);
			}
		);
		$(this.refs.myModal).modal('hide');
		this.refs.journalTitle.value = '';
		this.refs.entry.value = '';
	},
	addPicture: function() {
		var file = this.refs.addPicture.files[0];
		var picLabel;
		var formatTitle = this.refs.title.value.split(' ').join('');
		console.log(formatTitle)
		formatTitle.length > 0 ? picLabel = formatTitle : picLabel = 'picture';
		var parseFile = new Parse.File(picLabel+'.png',file);
		var pic = new PictureModel({
			spotId: new SpotModel({objectId:this.props.spot}),
			title: this.refs.title.value,
			caption: this.refs.caption.value
		});
		pic.set('picture', parseFile);
		pic.save().then((pic) => {
			console.log(pic);
			this.setState({newPic: pic});
			this.dispatcher.trigger('picAdded',pic);
		})
		$(this.refs.picModal).modal('hide');
		this.refs.addPicture.value = '';
		this.refs.caption.value = '';
		this.refs.title.value = '';
	}
});