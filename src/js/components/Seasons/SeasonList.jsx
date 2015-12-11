import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import Spinner from '../Spinner/Spinner';
import SeasonTabButton from './SeasonTabButton';
import SeasonEpisodeThumb from './SeasonEpisodeThumb';
import * as SeasonActionCreators from '../../actions/season';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

if (process.env.BROWSER) {
  require('./SeasonList.less');
}

@connect(({ Movie, Season }) => ({Movie, Season}))
class SeasonList extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    movieId: PropTypes.string.isRequired
  };

  render() {
    const {
      props: {
        Season,
        Movie,
        movieId
        }
      } = this;

    const movieData = Movie.get(`movies/${movieId}`);
    const seasons = Movie.get(`movies/${movieId}/seasons`);
    const page = Season.get('selected') || 0;

    if (seasons && seasons.size) {
      return (
        <div className="season-list">
          {this.parseSeasonTab(page, seasons)}
          {this.parseSeasonList(page, movieData, seasons)}
        </div>
      );

    } else {
      return (<div></div>)
    }
  }

  parseSeasonTab(page, seasons) {

    return (
      <div className="selection">
        {seasons ? seasons.map((season, i) => <SeasonTabButton
          key={`season-${season.get('_id')}-${i}`}
          active={page === i}
          index={i}
          seasonId={season.get('_id')}
          {...{season}}/>) : ''}
      </div>
    );
  }

  parseSeasonList(page, movie, seasons) {
    const {
      props: {
        dispatch,
        Season
        }
      } = this;

    const selectedSeasonId = seasons.get(page).get('_id');
    const season = Season.get(`seasons/${selectedSeasonId}`);

    if (!season && selectedSeasonId) {
      dispatch(SeasonActionCreators.getSeason(selectedSeasonId));
      return (<div className="slider-container"><Spinner/></div>);
    }
    const episodesList = season.get('episodes');
    return (
      <div className="season-list__container">
        <Slider>
          <div ref="slContainer" className="slider-container">
            {episodesList ? episodesList.map((episode, i) => <SeasonEpisodeThumb
              key={`episode-${episode.get('_id')}-${i}`} {...{movie, season, episode}}/>) : ''}
          </div>
        </Slider>
      </div>
    );
  }
}

export default SeasonList;
