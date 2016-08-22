import React, { PropTypes, Component } from 'react'
import Helmet from 'react-helmet'
import config from '../../../config'
import _ from 'lodash'
import { getI18n } from '../../../config/i18n'

export default () => {

  return (MetasDataComponent) => {
    class MetasDataDecorator extends Component {

      static contextTypes = {
        store: PropTypes.object.isRequired
      }

      static propsTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      }

      static defaultProps = {}

      state = {
        title: config.metadata.title,
        meta: config.metadata.metas,
        link: []
      }

      render () {
        const {props: {children}} = this
        let metas = this.getMetadata()
        return (
          <MetasDataComponent {...this.props} >
            <Helmet {...metas} />
            {children}
          </MetasDataComponent>
        )
      }

      getMetadata () {

        const {
          context: {store},
          props: {params, location}
        } = this

        let {lang} = params

        let metas = {
          title: _.cloneDeep(config.metadata.title),
          meta: _.cloneDeep(config.metadata.metas),
          link: []
        }

        const movieData = store.getState().Movie.get(`movies/${params.movieId}`)
        let seasonData
        let episodeData
        let episodesList
        //if (params.videoId) {
        //  videoData = store.getState().Video.get(`videos/${params.videoId}`)
        //}
        if (params.seasonId) {
          seasonData = store.getState().Season.get(`seasons/${params.seasonId}`)
        }

        if (params.episodeId) {
          if (seasonData) {
            // episodeData = videoData.get('episode')
            episodesList = seasonData.get('episodes')
            if (episodesList) {
              episodeData = episodesList.find(function (obj) {
                return obj.get('_id') == params.episodeId
              })
            }
          }
          else {
            episodeData = store.getState().Episode.get(`episodes/${params.episodeId}`)
          }
        }
        //si on a les données de l'episode alors, on remplace les infos affichées
        const data = episodeData ? movieData.merge(episodeData) : movieData


        let title = _.cloneDeep(config.metadata.title)
        let ogTitle = title
        let slug = location.pathname !== '/' ? location.pathname : ''
        let synopsis = _.cloneDeep(config.metadata.description)
        let ogDescription = synopsis
        let imageStyle = config.metadata.shareImage
        let seasonNumber = null
        let poster = null
        let episodeNumber = null

        if (data) {

          let type = movieData.get('type')

          if (type === 'movie') {
            title = getI18n(lang).home.movie.title
            synopsis = getI18n(lang).home.movie.description
          } else {
            title = getI18n(lang).home.serie.title
            synopsis = getI18n(lang).home.serie.description
          }

          let actors = movieData.get('actors')
          if (actors) {
            let actorsFlat = actors.map((actor)=> {
              return `${actor.get('firstName')} ${actor.get('lastName')}`
            })
            actorsFlat = _.join(actorsFlat.toJS(), ',')
            synopsis = synopsis.replace(/{actors}/g, actorsFlat)
          }

          if (seasonData) {
            title = getI18n(lang).home.season.title
            synopsis = getI18n(lang).home.season.description

            seasonNumber = seasonData.get('seasonNumber')
            title = title.replace(/{seasonNumber}/g, seasonNumber)
            synopsis = synopsis.replace(/{seasonNumber}/g, seasonNumber)
            if (episodesList && episodesList.size) {
              synopsis = synopsis.replace(/{episodesNumber}/g, episodesList.size)
            }
          }

          if (episodeData) {
            title = getI18n(lang).home.episode.title
            synopsis = getI18n(lang).home.episode.description

            episodeNumber = episodeData.get('episodeNumber')
            title = title.replace(/{episodeNumber}/g, episodeNumber)
            synopsis = synopsis.replace(/{episodeNumber}/g, episodeNumber)
          }

          //Replace global
          title = title.replace(/{serieName}/g, movieData.get('title'))
          title = title.replace(/{movieName}/g, movieData.get('title'))

          synopsis = synopsis.replace(/{serieName}/g, movieData.get('title'))
          synopsis = synopsis.replace(/{movieName}/g, movieData.get('title'))

          ogTitle = title
          ogDescription = synopsis
          poster = data.get('poster')
        }


        if (poster) {
          let posterImg = poster.get('imgix')
          if (posterImg) {
            imageStyle = posterImg
          }
        }

        let ogImage = `${imageStyle}?crop=faces&fit=clip&w=1120&h=630&q=${config.images.quality}&fm=${config.images.type}`

        if (title) {
          metas.title = title
        }

        if (synopsis) {
          metas.meta.push({
            name: 'description',
            content: synopsis
          })
        }

        if (ogTitle) {
          metas.meta.push({
            property: 'og:title',
            content: ogTitle
          })
          metas.meta.push({
            name: 'twitter:title',
            content: ogTitle
          })
        }

        if (ogDescription) {
          metas.meta.push({
            property: 'og:description',
            content: ogDescription
          })
          metas.meta.push({
            name: 'twitter:description',
            content: ogDescription
          })
        }

        if (ogImage) {
          metas.meta.push({
            property: 'og:image',
            content: ogImage
          })
          metas.meta.push({
            name: 'twitter:image:src',
            content: ogImage
          })
        }

        if (slug) {
          metas.link.push({
            rel: 'canonical',
            href: `${config.metadata.domain}${slug}`
          })
          metas.meta.push({
            property: 'og:url',
            content: `${config.metadata.domain}${slug}`
          })
          metas.meta.push({
            name: 'twitter:site',
            content: `${config.metadata.domain}${slug}`
          })
        }

        return metas
      }

    }
    return MetasDataDecorator
  }
}
