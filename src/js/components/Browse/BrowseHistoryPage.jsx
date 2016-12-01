import React from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as UserActionCreators from '../../actions/user'
import UserMoviesList from '../Movies/UserMoviesList'
import MoviesSlider from '../Movies/MoviesSlider'
import Spinner from '../Spinner/Spinner'
import NoMatch from '../NoMatch'
import {
  intlShape,
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./BrowseHistoryPage.less')
}

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(UserActionCreators.getHistory())
  ])
})
@connect(({User}) => ({User}))
class BrowseHistoryPage extends React.Component {


  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="row-fluid browse-history_page">
        <UserMoviesList
          title="history.pageLabel"
          axis="y"
          rowHeight={300}
          {...this.props}
        />
      </div>
    )
  }

  //renderList () {
  //  const {
  //    props: {
  //      User,
  //    }
  //  } = this
  //
  //  const historyList = User.get('history')
  //
  //  if (!historyList) {
  //    return (<Spinner />)
  //  }
  //
  //  const dataList = historyList
  //  const label = 'history.pageLabel'
  //  const slug = 'history'
  //  const type = 'episode'
  //
  //  if (type === 'error') {
  //    return <NoMatch {...{label, poster}}/>
  //  }
  //
  //  return (<div className="browse-categorie_list">
  //
  //    <MoviesSlider axis="y"
  //                  {...this.props} {...{dataList, label, type}} />
  //  </div>)
  //}
  //
  //render () {
  //  return (
  //    <div className="row-fluid browse-genre_page">
  //      {this.renderList()}
  //    </div>
  //  )
  //}
}

BrowseHistoryPage.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(BrowseHistoryPage)
