import React from 'react';
import { connect } from 'react-redux';
import {dict} from '../../../../config';
import Thumb from '../../components/Movies/Thumb';
import * as RecoActionCreators from '../../actions/reco';

if (process.env.BROWSER) {
  require('./RecommendationList.less');
}

@connect(({ Reco }) => ({Reco}))
class RecommendationList extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      props: {dispatch, videoId}
      } = this;

    dispatch(RecoActionCreators.getRecommendations('player', videoId));
  }

  renderList(dataList) {
    if (!dataList) {
      return;
    }
    return dataList.map((data, i) => <Thumb favorite={false}
                                            key={`spot-home-${data.get('_id')}-${i}`} {...{data}}/>);
  }

  render() {
    const {
      props: {
        Reco,
        videoId
        }
      } = this;

    const recoList = Reco.get(`player/${videoId}`);

    let labelPage = dict.recommendation['labelPage'];

    return (
      <div className="recommendation-list">
        <div className="recommendation-list__content">
          <div className="recommendation-list__label">{labelPage}</div>
          <div className="recommendation-list__thumbs">
            { this.renderList(recoList) }
          </div>
        </div>
      </div>
    );
  }
}


RecommendationList.propTypes = {
  videoId: React.PropTypes.string
};

RecommendationList.defaultProps = {
  videoId: null
};


export default RecommendationList;
