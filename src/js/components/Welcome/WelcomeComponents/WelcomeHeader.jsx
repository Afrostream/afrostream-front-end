import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../../actions/user';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./WelcomeHeader.less');
}

if (canUseDOM) {
  var countdown = require('countdown');
}

@connect(({ User, Movie }) => ({User, Movie}))
class WelcomeHeader extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount () {
    if (canUseDOM) {
      debugger;
      //let xxx = countdown( new Date(2000, 0, 1) ).toString();

      //console.log('*** here is the countdown string ***');
      //console.log(xxx);
    }

  }

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.showSignupLock());
  }

  showGiftLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.showGiftLock());
  }

  render() {
    const {
      props: {
        Movie
        }
      } = this;
    let { movieId } = this.context.router.state.params;
    let movieData = null;
    let data = {
      title: 'Les meilleurs films et séries \n afro-américains et africains \n en illimité',
      poster: 'https://afrostream.imgix.net/production/poster/2015/10/e4a0a6220e8fa50a23af-hear-me-move-home.jpg'
    };
    let showCountDown = (typeof this.props.promoCode !== 'undefined') ? true : false;

    if (movieId) {
      movieData = Movie.get(`movies/${movieId}`);
      if (movieData) {
        let poster = movieData.get('poster');
        if (poster) {
          data.poster = poster.get('imgix');
        }
        data.movie = {
          title: movieData.get('title'),
          synopsis: movieData.get('synopsis')
        }
      }
    }

    let imageStyle = {backgroundImage: `url(${data.poster}?crop=faces&fit=clip&w=1920&h=815&q=65)`};

    let welcomeClassesSet = {
      'welcome-header': true
    };

    return (
      <section className={classSet(welcomeClassesSet)} style={imageStyle}>
        <div className="afrostream-movie">
          { data.movie ? <div className="afrostream-movie__info">
            <h1>{data.movie.title}</h1>
            <div className='detail-text'>{data.movie.synopsis}</div>
          </div> : ''}
          <div className="afrostream-movie__subscribe">
            <div className="afrostream-statement">{data.title.split('\n').map((statement, i) => {
              return (<span key={`statement-${i}`}>{statement}</span>)})}</div>
            <button className="subscribe-button" type=" button" onClick={::this.showLock}>S'ABONNER MAINTENANT</button>
            <button className="gift-button" type="button" onClick={::this.showGiftLock}>OFFRIR UN ABONNEMENT</button>
          </div>
        </div>
      </section>
    );
  }
}

export default WelcomeHeader;
