import React from 'react';
import { prepareRoute } from '../../decorators';
import WelcomeHeader from './WelcomeComponents/WelcomeHeader';
import Spots from './WelcomeComponents/Spots';
import Devices from './WelcomeComponents/Devices';
import PricingTable from './WelcomeComponents/PricingTable';
import Spinner from '../Spinner/Spinner';
import * as EventActionCreators from '../../actions/event';
import * as MovieActionCreators from '../../actions/movie';
import * as CategoryActionCreators from '../../actions/category';
import * as VideoActionCreators from '../../actions/video';

if (process.env.BROWSER) {
  require('./WelcomePage.less');
}

@prepareRoute(async function ({ store, params: { movieId,videoId } }) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(false))
    //store.dispatch(CategoryActionCreators.getAllSpots()),
    //store.dispatch(MovieActionCreators.getMovie(movieId)),
    //store.dispatch(VideoActionCreators.getVideo(videoId))
  ];
})
class WelcomePage extends React.Component {

  static propTypes = {
    spinner: React.PropTypes.bool
  };

  static defaultProps = {
    spinner: false
  };

  state = {
    spinner: this.props.spinner
  };

  componentDidMount() {
    this.setState({
      spinner: this.props.spinner
    });
  }

  componentDidUpdate(params) {
    if (params.spinner !== this.props.spinner) {
      this.setState({
        spinner: this.props.spinner
      });
    }
  }

  componentWillReceiveProps() {
    this.setState({
      spinner: this.props.spinner
    });
  }

  render() {
    return (
      <div className="welcome-page">
        {this.state.spinner ? <Spinner /> : ''}
        <WelcomeHeader {...this.props}/>
        <Devices />
        <PricingTable />
        <Spots />
      </div>
    );
  }
}

export default WelcomePage;
