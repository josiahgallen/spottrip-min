'use strict';
var React = require('react');
var PictureModel = require('../models/PictureModel');
var PictureModalComponent = require('./PictureModalComponent');
var SpotModel = require('../models/SpotModel');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			pictures: []
		}
	},
	componentWillMount: function() {
		this.props.dispatcher.on('picAdded', (pic) => {
			this.state.pictures.push(pic);
			this.setState({pictures: this.state.pictures})
		})
		var picQuery = new Parse.Query(PictureModel);
		picQuery.equalTo('spotId', new SpotModel({objectId: this.props.spot})).find().then(
			(pictures) => {
				this.props.onPictureQuery(pictures);
				this.setState({pictures: pictures})
			},
			(err) => {
				console.log(err);
			}
		)
	},
	render: function() {
		var pictures = [];
		pictures = this.state.pictures.map(function(picture) {
			return(
				<PictureModalComponent picture={picture} key={picture.id}/>
			)
		});
		return (
			<div>
				<div className="row">
					{pictures}
				</div>
			</div>
		);
	}
});