'use strict';
var React = require('react');

module.exports = React.createClass({
	componentWillMount: function() {
		$('#myModal').on('shown.bs.modal', function () {
			$('#myInput').show()
		})
	},
	render: function() {
		return (
			<div key={this.props.picture.id}>
				<div className="col-xs-10 col-sm-10 col-md-10 col-lg-5">
					<a onClick={this.onFullPicShow}>
						<div className="thumbnail" style={{backgroundImage: 'url('+this.props.picture.get('picture').url()+')'}}>
							<div className="labelWrapper">
								<label><h3>{this.props.picture.get('title').toUpperCase()}</h3></label><br/>
							</div>
							<div className="labelWrapper captionWrapper">
								<label>{this.props.picture.get('caption')}</label>
							</div>
						</div>
					</a>
				</div>
				<div id={this.props.picture.id} className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
						
						<div className="modal-content pictureModal">
							<div className="pictureModal" style={{backgroundImage: 'url('+this.props.picture.get('picture').url()+')'}}>
							<div className="labelWrapper">
								<label><h3 className="modalTitle">{this.props.picture.get('title').toUpperCase()}</h3></label><br/>
							</div>
							<div className="labelWrapper captionWrapper">
								<label className="modalCap">{this.props.picture.get('caption')}</label>
							</div>
							<a onClick={this.closeModal} className="closeModalButton"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
							</div>
						</div>
					</div>
				
			</div>

		)
	},
	onFullPicShow: function() {
		$('#'+this.props.picture.id).modal('show');
	},
	closeModal: function() {
		console.log('#closed');
		$('#'+this.props.picture.id).modal('hide');
	}
})