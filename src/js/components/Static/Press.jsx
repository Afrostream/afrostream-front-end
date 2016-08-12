import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as ModalActionCreators from '../../actions/modal'
import * as ConfigActionCreators from '../../actions/config'
import { connect } from 'react-redux'
import { slugify } from '../../lib/utils'

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(ConfigActionCreators.getConfig('press'))
  ])
})
@connect(({Config}) => ({Config}))
class Press extends React.Component {

  onIMGError (e) {
    e.target.setAttribute('src', require('../../../assets/images/default/333x184.jpg'))
  }

  loadVideo (video) {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(ModalActionCreators.open({target: 'player', data: video}))
  }

  renderVideos () {

    const {
      props: {
        Config
      }
    } = this


    const pressData = Config.get(`/config/press`)
    if (!pressData) {
      return
    }
    const videos = pressData.get('videos')

    return videos.map((video, key)=> {
      return <div key={`static-videos-${key}`} className="col col-md-4">
        <img onClick={event => ::this.loadVideo(video)}
             src={`http://img.youtube.com/vi/${video.get('videoId')}/mqdefault.jpg`}/>
        <p>{video.get('title')}</p>
      </div>
    }).toJS()
  }


  renderPress () {

    const {
      props: {
        Config
      }
    } = this


    const pressData = Config.get(`/config/press`)
    if (!pressData) {
      return
    }
    const articles = pressData.get('articles')

    let sortArticles = articles.sort((a, b) => {
      const aD = a.get('date')
      const bD = b.get('date')
      return (aD && aD.substring(6)) < (bD && bD.substring(6))
    })

    let groupedPress = sortArticles.groupBy((item) => {
      const date = item.get('date')
      return date && date.substring(6)
    })

    let sortGroupedPress = groupedPress.sort((a, b) => {
      const firstItem = a.get(0)
      const firstDate = firstItem.get('date')
      const secondItem = b.get(0)
      const secondDate = secondItem.get('date')

      return (firstDate && firstDate.substring(6)) < (secondDate && secondDate.substring(6))
    })

    return sortGroupedPress.map((group, groupKey)=> {
      const firstItem = group.get(0)
      const date = firstItem.get('date')
      return <div className="row-fluid" key={`static-press-group-${groupKey}`} id={`news-${date.substring(6)}`}>
        <h3>{date.substring(6)}</h3>
        <div className="items">
          {
            group.map((item, key)=> {
              let partner = item.get('partner')
              let source = item.get('src')
              return (<div key={`static-press-${groupKey}-${key}`} className="col item press-link effect">
                <a href={source} target="_blank">
                  <div className="wrapper">
                    {source && <img className="pointer"
                                    src={`/press/screen/site/${slugify(partner)}.jpg`}
                                    width="345" height="190" onError={this.onIMGError}/>}
                  </div>
                  <span>#{item.get('date')}</span>
                  <p>
                    {item.get('title')}
                  </p>
                </a>
              </div>)
            })
          }
        </div>
      </div>
    }).toArray()
  }

  render () {
    return (
      <div id="react-blog">
        <section className="backstage-section bg-linear" id="mediakit">
          <div className="container-fluid container-no-padding">
            <div className="column-right">
              <h2 className="heading-2">Kit média</h2>
              <div className="row mediakit-list">
                <div className="col col-md-6">
                  <img className="pointer"
                       src="/press/screen/screen-link.jpg"
                       width="345" height="190"/>
                  <p>Retrouvez nos logos, notre charte graphique.</p>
                  <span className="btn-download">
        <a role="button" href="/press/screen/Logos-2016-07-21.zip" className="btn btn-info"
           type="button">
        <span className="zmdi zmdi-download"></span>
        <span className="label">Télécharger</span>
        </a>
        </span>
                </div>
                <div className="col col-md-6">
                  <img className="pointer"
                       src="/press/screen/images-link.jpg"
                       width="345" height="190"/>
                  <p>Afrostream en images.</p>
                  <span className="btn-download">
        <a role="button" href="/press/screen/Screen_Images_and_Devices-2016-07-21.zip"
           className="btn btn-info"
           type="button">
        <span className="zmdi zmdi-download"></span>
        <span className="label">Télécharger</span>
        </a>
        </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="backstage-section bg-linear"
          id="videos">
          <div
            className="container-fluid container-no-padding">
            <div
              className="column-right">
              <h2 className="heading-2"> Vidéos</h2>
              <div className="row three-items-list video-list">
                {this.renderVideos()}
              </div>
            </div>
          </div>
        </section>
        <section className="backstage-section bg-linear" id="press">
          <div className="container-fluid container-no-padding">
            <div className="column-right">
              <h2 className="heading-2">Presse</h2>
              <div className="row mediakit-list">
                <div className="col col-md-6">
                  <img className="pointer"
                       src="/press/screen/press.jpg"
                       width="345" height="190"/>
                  <p>Retrouvez notre dossier de presse.</p>
                  <span className="btn-download">
        <a role="button" href="/press/screen/Press_Releases-2016-07-21.zip" className="btn btn-info"
           type="button">
        <span className="zmdi zmdi-download"></span>
        <span className="label">Télécharger</span>
        </a>
        </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="backstage-section bg-linear" id="news">
          <div className="container-fluid container-no-padding">
            <div className="column-right">
              <h2 className="heading-2">News</h2>
              {this.renderPress()}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Press
