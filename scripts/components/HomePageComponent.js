'use strict';
var React = require('react');
var BreadCrumbsBarComponent = require('./BreadCrumbsBarComponent');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
					//Indicators
					<ol className="carousel-indicators">
						<li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
						<li data-target="#carousel-example-generic" data-slide-to="1"></li>
						<li data-target="#carousel-example-generic" data-slide-to="2"></li>
						<li data-target="#carousel-example-generic" data-slide-to="3"></li>
						<li data-target="#carousel-example-generic" data-slide-to="4"></li>
					</ol>
					//Wrapper for slides
					<div className="carousel-inner" role="listbox">
					<div className="item active">
							<img className="carouselPic" src="../images/DSC_0286.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_0368.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_3050.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_3156.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
						<div className="item">
							<img className="carouselPic" src="../images/DSC_2712.jpg"/>
							<div className="carousel-caption">
								<div className="hoverScreen"><img src="../images/badgeWhite.png"/></div>
							</div>
						</div>
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
				<div className="container-fluid">
					<div className="row">
						<div className="well myWell well-md col-xs-8 col-xs-offset-2" id="pageLead">
							<p className="lead">
								Lucas ipsum dolor sit amet darth darth moff skywalker ewok 
								darth jabba gamorrean jawa darth. Sidious mace han sebulba. 
								Calamari ackbar calamari ventress solo ventress sith jawa c-3p0. 
								Mothma cade coruscant hutt darth yavin windu lars calamari. Greedo 
								vader fett jade palpatine. Owen organa calrissian ben han yoda. 
								Antilles obi-wan mustafar yoda. Naboo solo kit kenobi skywalker darth 
								kessel secura solo. Leia organa dantooine jawa hutt lars. Mandalore 
								moff jawa leia obi-wan secura amidala secura windu.
								Darth chewbacca darth wampa jawa binks maul ben gonk. Solo antilles 
								darth moff skywalker amidala skywalker ben alderaan. Cade skywalker 
								jinn fett moff cade gonk. Antilles darth antilles ponda. Hutt lando jar 
								jinn organa kenobi endor windu. Bespin wookiee darth padmé ventress. 
								Bothan coruscant moff solo antilles chewbacca cade jawa. Skywalker chewbacca 
								amidala. Wookiee kashyyyk dantooine solo tatooine amidala. Skywalker 
								luke gonk binks ventress vader fett. Coruscant darth qui-gonn moff watto alderaan.
							</p>
						</div>
					</div>
				</div>
			</div>

		);
	},
	addLocation: function(e) {
		e.preventDefault();
		this.props.infoWindow.close();
		this.props.onLocationAdded(this.props.address,this.refs.tripTitle.value,this.refs.startDate.value,this.refs.endDate.value);
	}
});