'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var SpotModel = require('../models/SpotModel');
var TripModel = require('../models/TripModel');
var StatsModel = require('../models/StatsModel');
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
			entries: [],
			pictures: [],
			editPic: [],
			editEntry: [],
			needChange: 0
		}
	},
	componentWillMount: function() {
		$('#myModal').on('shown.bs.modal', function () {
			$('#myInput').show();
		})
		
		this.dispatcher = {};
		_.extend(this.dispatcher, Backbone.Events);
		var query = new Parse.Query(SpotModel);
		query.include('tripId');
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
						title: spot.get('spotName'),
						animation: google.maps.Animation.DROP
				});
				this.setState({map: this.map, spot: spot, tripName: spot.get('tripId').get('tripName')});
			},
			(err) => {
				console.log(err);
			}
		)
	},
	render: function() {
		var pictureList = [];
		var entryList = [];
		var slides = [];
		var buttons = []
		slides = this.state.pictures.map(function(picture, index){
			var classNameString = 'item personalItem';
			if(index === 0) {
				classNameString += ' active';
			}
			return(
				<div className={classNameString} key={picture.id}>
					<img className="personalCarouselPic" src={picture.get('picture').url()}/>
					<div className="carousel-caption">
						<h3>{picture.get('title').toUpperCase()}</h3>
						<p>{picture.get('caption')}</p>
					</div>
				</div>
			)
		})
		if(this.state.spot) {
			if(Parse.User.current() && Parse.User.current().id === this.state.spot.get('tripId').get('userId').id) {
				buttons.push(
					<div key="origButtons">
						<button onClick={this.onModalShow} title="Add Journal Entry" type="button" className="btn btn-primary hoverButton bottomButton" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>
						<br/>
						<button onClick={this.onPicModalShow} title="Add Photo" type="button" className="btn btn-primary hoverButton" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-camera" aria-hidden="true"></span></button>
						<br/>
						<button onClick={this.editTrip} title="Edit Spot" type="button" className="btn btn-primary hoverButton bottomButton" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></button>
						<br/>
						<button onClick={this.deleteModal} title="Delete Spot" type="button" className="btn btn-primary hoverButton" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></button>
					</div>);

				if(slides.length > 0) {
					buttons.unshift(<div key="slideShowButton"><button onClick={this.onSlideShow} title="Launch Slide Show" type="button" className="btn btn-primary hoverButton bottomButton" dataToggle="modal" dataTarget=".bs-example-modal-lg"><span className="glyphicon glyphicon-blackboard" aria-hidden="true"></span></button>
					<br/></div>)
				}
			}
		}
		pictureList = this.state.pictures.map(function(picture){
			return(
				<option key={picture.id} value={picture.id}>{picture.get('title')}</option>
			)
		})
		entryList = this.state.entries.map(function(entry) {
			return(
				<option key={entry.id} value={entry.id}>{entry.get('title')}</option>
			)
		})
		this.dispatcher.on('picAdded', () => {
			this.state.needChange++;
			this.setState({needChange: this.state.needChange});
		})
		this.dispatcher.on('entryAdded', () => {
			this.state.needChange++;
			this.setState({needChange: this.state.needChange});
		})
		this.dispatcher.on('picDeleted', () => {
			this.state.needChange++;
			this.setState({needChange: this.state.needChange});
		})
		this.dispatcher.on('entryDeleted', () => {
			this.state.needChange++;
			this.setState({needChange: this.state.needChange});
		})
		this.dispatcher.on('changed', () => {
			this.state.needChange++;
			this.setState({needChange: this.state.needChange});
		})
		return (
			<div>
				<h1 className="pageHeader">{this.state.spot ? this.state.spot.get('spotName') : ''}</h1>
				<h4 className="dateHeading">{this.state.spot ? this.state.spot.get('spotDateStart').toDateString() +' - '+ this.state.spot.get('spotDateEnd').toDateString() : ''}</h4>
				<BreadCrumbsBarComponent>
					<li><a href="#profile">Profile</a></li>
					<li><a href={this.state.spot ? '#trip/'+this.state.spot.get('tripId').id : '#trip'}>My Trip</a></li>
					<li className="active">My Spot</li>
				</BreadCrumbsBarComponent>
				<div className="row">
					<div className="col-xs-offset-1">
						<div id="spotMap" ref="map" className="col-xs-11"></div>
					</div>
				</div>
				<div className="addMediaButtonsWrapper">
					{buttons}
				</div>

				<AddMediaComponent dispatcher={this.dispatcher} picture={this.state.newPic} spot={this.props.spot} onPictureQuery={this.onPictureQuery}/>
				<AddJournalEntryComponent dispatcher={this.dispatcher} entry={this.state.newEntry} spot={this.props.spot} onEntryQuery={this.onEntryQuery}/>

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
								<button onClick={this.clearInput} type="button" className="btn btn-default cancel" data-dismiss="modal">Cancel</button>
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
								<label>Feature Pic for My Trip?</label>
								<select ref="feature" className="form-control">
									<option>yes</option>
									<option>no</option>
								</select>
								
							</form>
							<div className="modal-footer">
								<button onClick={this.addPicture} className="btn btn-primary">Upload Photo</button>
							</div>
						</div>
					</div>
				</div>
				<div id="modaly" className="modal modaly fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
					<div className="modal-dialog modal-lg">
						<div className="modal-content inputModal">
							<h1>Edit</h1>
							<hr/>
							<form>
								<div className="form-group xs-col-6">
									<label>Change Spot Name</label>
									<input type="text" ref="editSpotTitle" className="form-control" id="blogTitle" />
								</div>
								<div className="form-group xs-col-6">
									<label>Spot Start </label>
									<input ref="startDate" type="date"/>
									<label> Spot End </label>
									<input ref="endDate" type="date"/>
								</div>
								<div className="form-group xs-col-6">
									<label>Edit Picture Info</label>
									<select ref="picList" className="form-control">
										{pictureList}
									</select>
									<button onClick={this.editPic} type="button" className="selectOption">Select</button><br/>
									{this.state.editPic}

									<label>Edit Journal Entry Info</label>
									<select ref="entryList" className="form-control">
										{entryList}
									</select>
									<button onClick={this.editEntry} type="button" className="selectOption">Select</button>
									{this.state.editEntry}
								</div>
							</form>
							 <div className="modal-footer">
								<button onClick={this.closeModal} type="button" className="btn btn-default cancel" data-dismiss="modal">Cancel</button>
								<button onClick={this.changeSpotInfo} type="button" className="btn btn-primary">Save</button>
							</div>
						</div>
					</div>
				</div>
				<div id="modelier" className="modal modaly fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
					<div className="modal-dialog modal-lg">
						<div className="modal-content inputModal">
							<h1 className="deleteHeader">Remove Spot</h1>
							<hr/>
							<div className="alert alert-danger" role="alert">
								<p>
									Warning all Pictures, and Journals associated with this Spot will be permanetly removed! (enter spot name to confirm)
								</p>
								<br/>
								<div className="form-group">
    								<label htmlFor="exampleInputEmail1">Spot Name</label>
    								<input type="text" ref="deleteConfirm" className="form-control" id="exampleInputEmail1"/>
  								</div>
							</div>
							<div className="modal-footer">
								<button onClick={this.closeOtherModal} type="button" className="btn btn-default cancel" data-dismiss="modal">Cancel</button>
								<button onClick={this.deleteTrip} className="btn btn-danger">Destroy Forever</button>
							</div>
						</div>
					</div>
				</div>
				<div id="slideShowModal" className="modal modaly fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
					<div className="modal-dialog modal-lg">
						<div className="modal-content inputModal slideShowModal">
							
							<div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
								
								<div className="carousel-inner" role="listbox">
									{slides}
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
						</div>
					</div>
				</div>
			</div>
		);
	},
	editPic: function() {
		this.found = this.state.pictures.find((element, index) => {
			if (element.id === this.refs.picList.value)
				return element;
		})
		this.state.editPic = [];
		this.state.editPic.push(
			<div key={this.found.id} className="form-group xs-col-6">
				<label>Picture Title</label>
				<input type="text" maxLength="20" className="form-control" defaultValue={this.found.get('title')} id="pictureTitleChange" />
				<textarea maxLength="50" className="form-control" rows="2" defaultValue={this.found.get('caption')} id="pictureCaptionChange"/>
				<button className="selectOption" onClick={this.savePicChanges}>Save Changes</button><button className="selectOption" onClick={this.deleteOnePicture}>Delete Picture</button>
			</div>
		);
		this.setState({editPic: this.state.editPic});
		this.dispatcher.trigger('changed');
	},
	savePicChanges: function() {
		this.found.save({
			title: document.getElementById('pictureTitleChange').value,
			caption: document.getElementById('pictureCaptionChange').value
		})
		$('#modaly').modal('hide');
		this.dispatcher.trigger('changed');
	},
	editEntry: function() {
		this.entryFound = this.state.entries.find((element, index) => {
			if (element.id === this.refs.entryList.value)
				return element;
		})
		this.state.editEntry = [];
		this.state.editEntry.push(
			<div key={this.entryFound.id} className="form-group xs-col-6">
				<label>Entry Title</label>
				<input type="text" className="form-control" defaultValue={this.entryFound.get('title')} id="entryTitleChange" />
				<textarea className="form-control" rows="4" defaultValue={this.entryFound.get('entry')} id="entryChange"/>
				<button className="selectOption" onClick={this.saveEntryChanges}>Save Changes</button><button className="selectOption" onClick={this.deleteOneEntry}>Delete Entry</button>
			</div>
		);
		this.setState({editEntry: this.state.editEntry});
		this.dispatcher.trigger('changed');
	},
	saveEntryChanges: function() {
		console.log('entryChange');
		this.entryFound.save({
			title: document.getElementById('entryTitleChange').value,
			entry: document.getElementById('entryChange').value
		})
		$('#modaly').modal('hide');
		this.dispatcher.trigger('changed');
	},
	deleteOnePicture: function() {
		var answer = confirm('This Picture Will be permanetly deleted!');
		if (answer) {
			this.found.destroy({
				success: (object) => {
					var filtered = 0;
					this.state.pictures.forEach((element, index) => {
						if (element.id === object.id) {
							filtered = index;
						}
					})
					filtered = this.state.pictures.splice(filtered,1);
					this.setState({pictures: this.state.pictures});
					var statQuery = new Parse.Query(StatsModel);
					statQuery.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
						(stats) => {
							stats.forEach((stat)=>{
								var pics = stat.get('pictures');
								stat.save({
									pictures: pics-1
								})
							})
						},
						(err) => {
							console.log(err);
						}
					)
					console.log(object, ' has been permanetly deleted');
					
				},
				error: (object) => {
					console.log('error deleting ', object)
				}
			})
			$('#modaly').modal('hide');
			this.dispatcher.trigger('picDeleted');
		}
	},
	deleteOneEntry: function() {
		var answer = confirm('This Journal Entry will be permanetly deleted!');
		if (answer) {
			this.entryFound.destroy({
				success: (object) => {
					var filtered = 0;
					this.state.entries.forEach((element, index) => {
						if (element.id === object.id) {
							filtered = index;
						}
					})
					filtered = this.state.entries.splice(filtered,1);
					this.setState({entries: this.state.entries});
					var statQuery = new Parse.Query(StatsModel);
					statQuery.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
						(stats) => {
							stats.forEach((stat)=>{
								var blogs = stat.get('blogs');
								stat.save({
									blogs: blogs-1
								})
							})
						},
						(err) => {
							console.log(err);
						}
					)
					console.log(object, 'has been permanetly deleted');
				},
				error: (object) => {
					console.log('error deleting ', object);
				}
			})
			$('#modaly').modal('hide');
			this.dispatcher.trigger('entryDeleted');
		}
	},
	onSlideShow: function() {
		$('#slideShowModal').modal('show');
	},
	onPictureQuery: function(pictures) {
		this.setState({pictures: pictures})
	},
	onEntryQuery: function(entries) {
		this.setState({entries: entries})
	},
	onModalShow: function() {
		$(this.refs.myModal).modal('show');
	},
	onPicModalShow: function() {
		$(this.refs.picModal).modal('show');
	},
	onFullPicModalShow: function() {
		$(this.refs.picture.id)
	},
	clearInput: function() {
		this.refs.journalTitle.value = '';
		this.refs.entry.value = '';
	},
	changeSpotInfo: function() {
		this.state.spot.save({
			spotName: this.refs.editSpotTitle.value === '' ? this.state.trip.get('tripName') : this.refs.editSpotTitle.value,
			spotDateStart: this.refs.startDate.value === '' ? new Date (this.state.spot.get('spotDateStart')) : new Date (this.refs.startDate.value),
			spotDateEnd: this.refs.endDate.value === '' ? new Date (this.state.spot.get('spotDateEnd')) : new Date (this.refs.endDate.value)
		})
		$('#modaly').modal('hide');
		this.dispatcher.trigger('changed');
	},
	addJournalEntry: function() {
		var newEntry = new JournalEntryModel({
			title: this.refs.journalTitle.value,
			entry: this.refs.entry.value,
			spotId: new SpotModel({objectId:this.props.spot}),
			tripId : new TripModel({objectId:this.state.spot.get('tripId').id})
		})
		newEntry.save().then(
			(entry) => {
				this.setState({newEntry: entry})
				var statQuery = new Parse.Query(StatsModel);
				statQuery.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
					(stats) => {
						stats.forEach((stat)=>{
							var blogs = stat.get('blogs');
							stat.save({
								blogs: blogs+1
							})
						})
					},
					(err) => {
						console.log(err);
					}
				)
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
		formatTitle.length > 0 ? picLabel = formatTitle : picLabel = 'picture';
		var parseFile = new Parse.File(picLabel+'.png',file);
		var pic = new PictureModel({
			spotId: new SpotModel({objectId:this.props.spot}),
			title: this.refs.title.value,
			caption: this.refs.caption.value,
			tripId : new TripModel({objectId:this.state.spot.get('tripId').id})
		});
		pic.set('picture', parseFile);
		pic.save().then((pic) => {
			console.log(pic);
			this.setState({newPic: pic});
			var statQuery = new Parse.Query(StatsModel);
			statQuery.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
				(stats) => {
					stats.forEach((stat)=>{
						var pics = stat.get('pictures');
						stat.save({
							pictures: pics+1
						})
					})
				},
				(err) => {
					console.log(err);
				}
			)
			if (this.refs.feature.value === 'yes') {
				this.state.spot.get('tripId').save({
					featurePic: pic
				})
			}
			this.dispatcher.trigger('picAdded',pic);
		})
		$(this.refs.picModal).modal('hide');
		this.refs.addPicture.value = '';
		this.refs.caption.value = '';
		this.refs.title.value = '';
	},
	editTrip: function() {
		$('#modaly').modal('show');
	},
	deleteModal: function() {
		$('#modelier').modal('show');
	},
	deleteTrip: function() {
		console.log('start delete');
		var answer = this.refs.deleteConfirm.value;
		if(answer === this.state.spot.get('spotName')) {
			var numPics = this.state.pictures.length;
			var numEntries = this.state.entries.length;
			Parse.Object.destroyAll(this.state.entries,{
				success: function(entry) {
					console.log('all journal entries destroyed')
				},
				error: function(err) {
					console.log(err);
				}
			});
			Parse.Object.destroyAll(this.state.pictures,{
				success: function(picture) {
					console.log('all pictures destroyed')
				},
				error: function(err) {
					console.log(err);
				}
			});
			this.state.spot.destroy({
				success: function(object) {
					console.log(object, ' has been permanetly deleted');
					var statQuery = new Parse.Query(StatsModel);
					statQuery.equalTo('userId', new Parse.User({objectId: Parse.User.current().id})).find().then(
						(stats) => {
							stats.forEach((stat) => {
								var pics = stat.get('pictures');
								var blogs = stat.get('blogs');
								var spots = stat.get('spots');
								console.log(pics, blogs, spots);
								spots = spots - 1;
								pics = pics -  numPics;
								blogs = blogs - numEntries;
								console.log(pics, blogs, spots);
								stat.save({
									pictures: pics,
									blogs: blogs,
									spots: spots
								})
							})
						},
						(err) => {
							console.log(err);
						}
					)
				},
				error: function(object) {
					console.log('error deleting ', object)
				}
			})
			$('#modelier').modal('hide');
			this.props.router.navigate('#profile', {trigger: true});
		}
	},
	closeModal: function() {
		$('#modaly').modal('hide');
	},
	closeOtherModal: function() {
		$('#modelier').modal('hide');	
	}
});