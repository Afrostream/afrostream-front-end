import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames';
import Billboard from './Billboard'
import Spinner from '../Spinner/Spinner';
import config from '../../../../config';
import LoadVideo from '../LoadVideo';

import * as VideoActionCreators from '../../actions/video';
import * as EventActionCreators from '../../actions/event';
import * as MovieActionCreators from '../../actions/movie';

if (process.env.BROWSER) {
  require('./MovieInfo.less');
}

@connect(({ Movie,Season }) => ({Movie, Season}))
class MovieInfo extends LoadVideo {

  constructor(props) {
    super(props);
    this.state = {
      size: {
        height: 1920,
        width: 815
      }
    };
  }

  componentDidMount() {
    this.setState({
      size: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    });
  }

  static propTypes = {
    active: PropTypes.bool,
    showBtn: PropTypes.bool,
    load: PropTypes.bool,
    maxLength: PropTypes.number
  };

  static defaultProps = {
    maxLength: 450,
    showBtn: true,
    load: true,
    active: false
  };

  render() {

    let {
      props: { Movie, active, dataId, data,maxLength,load,showBtn}
      } = this;

    data = data || Movie.get(`movies/${dataId}`);

    if (!data) {
      return (<Spinner />);
    }

    const isSerie = data.get('type') === 'serie' || data.get('type') === 'error';
    const classes = classSet({
      'movie': true,
      'serie': isSerie,
      'movie--active': this.props.active,
      'movie--btn_play': showBtn === true || !isSerie
    });

    let poster = data.get('poster');
    let posterImg = poster ? poster.get('imgix') : '';
    let imageStyles = posterImg ? {backgroundImage: `url(${posterImg}?crop=faces&fit=clip&w=${this.state.size.width}&h=${this.state.size.height}&q=${config.images.quality}&fm=${config.images.type})`} : {};
    const link = this.getLink();
    return (
      <div ref="slContainer" className={classes}>
        <Link to={link}>
          <div ref="slBackground" className="movie-background" style={imageStyles}/>
          <div className="btn-play"/>
        </Link>
        {data ? <Billboard {...{active, data, dataId, maxLength, load}} /> : ''}
      </div>
    );
  }
}

export default MovieInfo;
