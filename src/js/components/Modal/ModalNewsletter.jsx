import React from 'react';
import ModalGeoWall from './ModalGeoWall';
import * as WaitingUsersActionCreators from '../../actions/waitingUsers';

class ModalNewsletter extends ModalGeoWall {


  state = {
    sended: false,
    email: ''
  };

  initState () {
    this.setState({
      sended: false,
      email: ''
    });
  }

  handleSubmit (e) {
    e.stopPropagation();
    e.preventDefault();
    const email = this.refs.email.value;
    this.props.dispatch(WaitingUsersActionCreators.create(email)).then(()=> {
      this.setState({
        sended: true,
        email: email
      });
      setTimeout(::this.initState, 10000);
    });
  }

  render () {
    if (!this.state.sended) {
      return super.render();
    }
    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default geoWall">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{this.props.header}</h1>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        <div className="instructions">
                          Merci, vous êtes désormais inscrits à nos newsletters
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

export default ModalNewsletter;
