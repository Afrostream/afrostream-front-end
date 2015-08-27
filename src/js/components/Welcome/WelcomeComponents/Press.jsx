import React from 'react';
import { connect } from 'react-redux';

if (process.env.BROWSER) {
	require('./Press.less');
}

var Press = React.createClass ({

	render: function() {
		const {
			props: {
				User
				}
			} = this;

		return (
			<section className="press">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<h2>Ils parlent de nous</h2>
						</div>
					</div>

					<div className="row">
						<div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
							<a href="http://www.lemonde.fr/afrique/article/2015/02/26/afrostream-se-reve-en-netflix-africain_4584215_3212.html" target="_blank">
								<img className="img-responsive img-thumbnail press-image" src="/images/thumb_lemonde.jpg" />
							</a>
						</div>
						<div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
							<a href="/articles/forbes_article.pdf" target="_blank">
								<img className="img-responsive img-thumbnail press-image" src="/images/thumb_forbes.jpg" />
							</a>
						</div>
						<div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
							<a href="http://www.ebony.com/entertainment-culture/afrostream-the-african-netflix#axzz3bmSywRgn" target="_blank">
								<img className="img-responsive img-thumbnail press-image" src="/images/thumb_ebony.jpg" />
							</a>
						</div>
						<div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
							<a href="http://techcrunch.com/2015/07/17/afrostream-is-netflix-for-african-and-african-american-movies/" target="_blank">
								<img className="img-responsive img-thumbnail press-image" src="/images/thumb_techcrunch.jpg" />
							</a>
						</div>
						<div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
							<a href="http://www.lesechos.fr/tech-medias/medias/021219626643-afrostream-le-netflix-africain-accelere-1138741.php" target="_blank">
								<img className="img-responsive img-thumbnail press-image" src="/images/lesechos.png" />
							</a>
						</div>
						<div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
							<a href="http://afrique.lepoint.fr/culture/vod-tonje-bakang-afrostream-le-cinema-afro-s-invite-a-la-maison-03-03-2015-1909711_2256.php" target="_blank">
								<img className="img-responsive img-thumbnail press-image" src="/images/thumb_lepoint.jpg" />
							</a>
						</div>
						<div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
							<a href="https://www.youtube.com/watch?v=L-rnHG2daSE&sns=em" target="_blank">
								<img className="img-responsive img-thumbnail press-image" src="/images/thumb_bfm.jpg" />
							</a>
						</div>
						<div className="col-xs-6 col-sm-3 col-md-3 col-lg-3">
							<a href="http://www.jeuneafrique.com/Article/JA2822p070.xml0/" target="_blank">
								<img className="img-responsive img-thumbnail press-image" src="/images/thumb_jeune_afrique.jpg" />
							</a>
						</div>
					</div>
				</div>
			</section>
		);
	}
});

module.exports = Press;