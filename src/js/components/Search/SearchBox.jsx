import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import classSet from 'classnames'
import { withRouter } from 'react-router'
import * as EventActionCreators from '../../actions/event'
import {
  intlShape,
  injectIntl
} from 'react-intl'
import { I18n } from '../Utils'

if (process.env.BROWSER) {
  require('./SearchBox.less')
}

@connect(({Search, Event}) => ({Search, Event}))
class SearchBox extends I18n {

  constructor (props) {
    super(props)
  }

  state = {
    hasFocus: this.props.defaultOpen
  }

  debounceSearch = _.debounce(::this.search, 400)

  handleFocus () {
    const {
      props: {}
    } = this

    this.setState({
      hasFocus: true
    })
  }

  handleBlur () {
    let self = this
    setTimeout(function () {
      let input = self.getInput()
      input.value = ''
      self.setState({
        hasFocus: self.props.defaultOpen
      })
    }, 200)
  }

  getInput () {
    return this.refs.inputSearchMini
  }

  goBack () {
    let input = this.getInput()
    input.value = ''
    let isInSearch = this.props.router.isActive('search')
    this.handleBlur()
    if (isInSearch) {
      this.props.router.push('/')
    }
  }

  componentDidMount () {
    let input = this.getInput()

    // Set input to last search
    if (this.props.lastSearch) {
      input.value = this.props.lastSearch
    }
  }

  search () {
    let input = this.getInput().value
    if (input.length < 3) {
      return
    }
    this.props.router.push({pathname: '/search', query: {search: input}})
  }

  render () {
    const {
      props: {Event}
    } = this

    let fielClass = {
      'search-box': true,
      'has-focus': this.props.router.isActive('search') || this.state.hasFocus
    }

    return (
      <div className={classSet(fielClass)}>
        <i className="zmdi zmdi-close" onClick={::this.goBack}/>
        <input
          placeholder={this.getTitle('search.placeHolder')}
          onChange={::this.debounceSearch}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          name="search-box"
          type="text"
          ref="inputSearchMini"
        />
      </div>
    )
  }
}

SearchBox.propTypes = {
  history: React.PropTypes.object,
  defaultOpen: React.PropTypes.bool
}

SearchBox.defaultProps = {
  defaultOpen: false
}

export default withRouter(injectIntl(SearchBox))
