import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import * as UserActionCreators from '../../actions/user'
import classSet from 'classnames'
import Spinner from '../Spinner/Spinner'
import { I18n } from '../Utils'
import ReactTooltip from 'react-tooltip'
import {
  intlShape,
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./FavoritesAddButton.less')
}

@connect(({User}) => ({User}))
class FavoritesAddButton extends I18n {

  constructor (props) {
    super(props)
    this.state = {pendingFavorite: false}
  }


  componentDidUpdate () {
    ReactTooltip.rebuild()
  }


  static propTypes = {
    data: PropTypes.instanceOf(Immutable.Map),
    dataId: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  }

  static defaultProps = {
    data: null,
    dataId: null
  }

  getType () {
    const {
      props: {data}
    } = this

    return data.get('type')
  }

  setFavorite (active, dataId) {
    const {
      props: {
        dispatch
      }
    } = this
    let self = this

    self.setState({
      pendingFavorite: true
    })

    let type = this.getType() === 'episode' ? 'episodes' : 'movies'

    dispatch(UserActionCreators[`setFavorites`](type, active, dataId))
      .then(() => {
        self.setState({
          pendingFavorite: false
        })
      })
      .catch(() => {
        self.setState({
          pendingFavorite: false
        })
      })
  }

  render () {
    const {
      props: {
        User, dataId
      }
    } = this

    const type = this.getType()
    const favoritesData = User.get(`favorites/${type === 'episode' ? 'episode' : 'movie'}s`)
    let isFavorite = false
    if (favoritesData) {
      isFavorite = favoritesData.find((obj) => {
        return obj.get('_id') == dataId
      })
    }

    let favoriteClass = {
      'glyphicon': true,
      'glyphicon-plus': !isFavorite,
      'glyphicon-minus': isFavorite,
      'pending': this.state.pending
    }

    const inputAttributes = {
      onClick: event => ::this.setFavorite(!isFavorite, dataId)
    }

    const titleLabel = this.getTitle(`${!isFavorite ? 'favorites.add' : 'favorites.delete'}`)

    return (
      <button className="btn favorite-add_button" type="button" data-tip={titleLabel}
              data-for={`fav-${dataId}`} {...inputAttributes}>
        <i className={classSet(favoriteClass)}></i>
        {this.state.pendingFavorite ? <Spinner /> : ''}
        <ReactTooltip id={`fav-${dataId}`} class="fav-tooltip" place={this.props.direction} type="dark"
                      effect="solid"
                      getContent={[() => titleLabel, 100]}/>
      </button>
    )
  }
}

FavoritesAddButton.defaultProps = {
  direction: 'top'
}

export default injectIntl(FavoritesAddButton)
