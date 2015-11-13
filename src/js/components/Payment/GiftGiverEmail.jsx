import React from 'react';

class GiftGiverEmail extends React.Component {

  render() {

    if (this.props.isVisible) {
      return (
        <div>
          <div className="row">
            <div className="form-group col-md-6">
              <label className="form-label" for="giver-mail">Votre Mail</label>
              <input
                className="form-control card-number"
                name="giver-email"
                id="giver_email"
                placeholder="votre-mail@courriel.com" required/>
            </div>
          </div>
        </div>
      );
    } else {
      return(<div></div>);
    }
  }
}

export default GiftGiverEmail;
