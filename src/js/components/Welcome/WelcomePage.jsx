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
import * as EpisodeActionCreators from '../../actions/episode';

if (process.env.BROWSER) {
  require('./WelcomePage.less');
}

@prepareRoute(async function ({ store, params: { movieId ,episodeId} }) {
  await * [
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(CategoryActionCreators.getAllSpots())
  ];

  if (movieId && movieId !== 'undefined') {
    await store.dispatch(MovieActionCreators.getMovie(movieId));
  }

  if (episodeId && episodeId !== 'undefined') {
    await store.dispatch(EpisodeActionCreators.getEpisode(episodeId));
  }

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
        <Spots />
        <PricingTable />
      </div>
    );
  }
}

export default WelcomePage;
