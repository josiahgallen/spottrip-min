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
			<div key={this.props.entry.id} className="col-xs-11 col-md-5">
				<div className="entryWrapper blogThumbnail">
					<a onClick={this.onFullPicShow} className="caption">
						<h3>{this.props.entry.get('title').toUpperCase()}</h3>
						<p>{this.props.entry.get('entry').substring(0,139)+'...'}</p>
					</a>
				</div>
				<div ref="myModal"id={this.props.entry.id} className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" ariaLabelledby="myLargeModalLabel">
					<div className="modal-dialog modal-lg">
						<div className="modal-content inputModal entryModal">
							<h3 className="modalTitle">{this.props.entry.get('title').toUpperCase()}</h3>
							<p>{this.props.entry.get('entry')}</p>
						</div>
					</div>
				</div>
			</div>
		)
	},
	onFullPicShow: function() {
		$('#'+this.props.entry.id).modal('show');
	},
	closeModal: function() {
		console.log('#closed');
		$('#'+this.props.entry.id).modal('hide');
	}
})