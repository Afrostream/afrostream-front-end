import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Slides from './Slides';
import Pagination from './Pagination';
import Controls from './Controls';

if (process.env.BROWSER) {
  require('./SlideShow.less');
}

class SlideShow extends React.Component {

  static propTypes = {
    slides: PropTypes.instanceOf(Immutable.List).isRequired,
    page: React.PropTypes.number.isRequired
  }

  render() {
    const {
      props: { slides,page }
      } = this;

    return (
      <div className="SlideShow">
        <Slides  {...{slides, page}}/>
        <Controls />
      </div>
    );
  }
}

export default SlideShow;
