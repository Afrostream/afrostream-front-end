import React from 'react'

class GiftDetails extends React.Component {

  value() {
    return {
      subOpts: {
        gift: {
          firstName: this.refs.giftFirstName.value,
          lastName: this.refs.giftLastName.value,
          email: this.refs.giftEmail.value
        }
      }
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="card-details">
            COORDONNEES DU BENEFICIAIRE DU CADEAU
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <label className="form-label" htmlFor="first_name">Son Prénom</label>
            <input
              type="text"
              className="form-control first-name"
              ref="giftFirstName"
              id="gift_first_name"
              name="first-name"
              placeholder="Son prénom" required/>
          </div>
          <div className="form-group col-md-6">
            <label className="form-label" htmlFor="last_name">Son Nom</label>
            <input
              type="text"
              className="form-control last-name"
              ref="giftLastName"
              id="gift_last_name"
              name="last-name"
              placeholder="Son nom" required/>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <label className="form-label" htmlFor="gift-mail">Son Mail</label>
            <input
              className="form-control card-number"
              name="gift-email"
              ref="giftEmail"
              id="gift_email"
              placeholder="le-mail-du-destinataire@courriel.com" required/>
          </div>
        </div>
      </div>
    )
  }
}


export default GiftDetails
