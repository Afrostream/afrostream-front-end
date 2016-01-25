import React from 'react';

var FbLoginButton = React.createClass({

  handleFBLogin: function () {

  },
  render: function () {
    return (
      <button type="submit" className="fb-login__button" onClick={::this.handleFBLogin}>FB login</button>
    );
  }
});

module.exports = FbLoginButton;

