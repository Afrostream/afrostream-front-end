import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import ModalComponent from './ModalComponent'
import { Link } from '../Utils'
import ReactImgix from '../Image/ReactImgix'

class ModalImage extends ModalComponent {

  constructor (props) {
    super(props)
  }

  closeModal () {
    const {props:{cb}} =this
    super.closeModal()
    if (cb) {
      cb()
    }
  }

  render () {
    const {props:{data}} =this

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    let panelClass = {
      'panel onestep active': true,
    }

    panelClass[this.props.className] = true

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className={classNames(panelClass)}>
                    {/*HEADER*/}
                    <div className="header top-header">
                      <a className={closeClass}  onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="modal-image-container">
                        <div className="content">
                          {/*<Link to={data.get('link')}>*/}
                          <ReactImgix className="modal-image" src={data.get('src')} bg={true}/>
                          {/*</Link>*/}
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
    )
  }
}

export default ModalImage
