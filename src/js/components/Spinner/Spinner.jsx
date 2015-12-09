import React from 'react/addons';

if (process.env.BROWSER) {
  require('./Spinner.less');
}

class Spinner extends React.Component {

  static propTypes = {};


  render() {
    return (
      <div className="spinner">
        <svg className="circular" viewBox="25 25 50 50">
          <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10"/>
        </svg>
      </div>
    );
  }
}

export default Spinner;
