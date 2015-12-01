import React from 'react';
import { prepareRoute } from '../../decorators';
import WelcomeHeader from './WelcomeComponents/WelcomeHeader';
import Devices from './WelcomeComponents/Devices';
import PricingTable from './WelcomeComponents/PricingTable';
import Spinner from '../Spinner/Spinner';
import * as EventActionCreators from '../../actions/event';

if (process.env.BROWSER) {
  require('./WelcomePage.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(false))
  ];
})
class WelcomePage extends React.Component {

  static propTypes = {
    spinner: React.PropTypes.bool,
    promoCode: React.PropTypes.string
  };

  static defaultProps = {
    spinner: false,
    promoCode: ''
  };


  state = {
    spinner: this.props.spinner
  };

  componentDidMount() {
    this.setState({
      spinner: this.props.spinner
    });
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
        <WelcomeHeader promoCode={this.props.promoCode}/>
        <Devices />
        <PricingTable />
      </div>
    );
  }
}

export default WelcomePage;
