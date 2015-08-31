import React from 'react/addons';

if (process.env.BROWSER) {
  require('./Spinner.less');
}

class Spinner extends React.Component {

  static propTypes = {};


  render() {
    return (
      <div className="spinner">
        <div className="spinner-container">
          <div className="double-bounce1"/>
          <div className="double-bounce2"/>
        </div>
      </div>
    );
  }
}

export default Spinner;
