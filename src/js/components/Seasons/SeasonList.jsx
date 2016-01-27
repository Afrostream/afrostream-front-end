import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import Spinner from '../Spinner/Spinner';
import SeasonTabButton from './SeasonTabButton';
import SeasonEpisodeThumb from './SeasonEpisodeThumb';
import * as SeasonActionCreators from '../../actions/season';
import ReactList from 'react-list';

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

  renderItem(index, key) {
    const {
      props: {
        Season,
        Movie,
        movieId
        }
      } = this;

    const movie = Movie.get(`movies/${movieId}`);
    const seasons = Movie.get(`movies/${movieId}/seasons`);
    let page = Season.get('selected') || 0;
    const selectedSeasonId = seasons.get(page).get('_id');
    const season = Season.get(`seasons/${selectedSeasonId}`);
    const episodesList = season.get('episodes');
    let episode = episodesList.get(index);
    return (
      <SeasonEpisodeThumb preload={true}
                          key={`season-thumb-${index}`} {...{movie, season, episode}} />
    );
  }

  render() {
    const {
      props: {
        Season,
        Movie,
        movieId
        }
      } = this;

    const seasons = Movie.get(`movies/${movieId}/seasons`);
    let page = Season.get('selected') || 0;

    if (seasons && seasons.size) {
      if ((seasons.size - 1) < page) {
        page = 0;
      }
      return (
        <div className="season-list">
          {this.parseSeasonTab(page, seasons)}
          {this.parseSeasonList(page, seasons)}
        </div>
      );

    } else {
      return (<div />)
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
          {...{season}} />).toJS() : ''}
      </div>
    );
  }

  parseSeasonList(page, seasons) {
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
      return (<div className="slider-container"><Spinner /></div>);
    }

    const episodesList = season.get('episodes');

    return (
      <Slider>
        <div ref="slContainer" className="slider-container">
          <ReactList
            axis="x"
            itemRenderer={::this.renderItem}
            length={episodesList.size}
            type='uniform'
          />
        </div>
      </Slider>
    );
  }
}

export default SeasonList;
