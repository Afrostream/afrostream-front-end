import React, { PropTypes, Component } from 'react'
import Helmet from 'react-helmet'
import config from '../../../config'
import _ from 'lodash'
import qs from 'qs'
import { getI18n } from '../../../config/i18n'
import { extractImg } from '../lib/utils'

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

      getdata () {
        const {
          context: {store},
          props: {params, location}
        } = this

        let {lang} = params
        let {query} = location

        let slug = `${config.metadata.domain}${location.pathname !== '/' ? location.pathname : '' }`

        if (query) {
          slug = `${slug}?${qs.stringify(query)}`
        }

        let metas = {
          title: _.cloneDeep(config.metadata.title),
          description: _.cloneDeep(config.metadata.description),
          meta: _.cloneDeep(config.metadata.metas),
          type: 'website',
          link: [],
          slug
        }

        let seasonNumber = null
        let themes = ''
        let actors = ''
        let movieTitle = ''
        let episodeNumber = null

        let data

        switch (true) {
          case Boolean(~location.pathname.indexOf('/life')) :

            const themesList = store.getState().Life.get(`life/themes/`)
            if (params.pinId) {
              data = store.getState().Life.get(`life/pins/${params.pinId}`)
            }
            if (params.themeId) {
              data = store.getState().Life.get(`life/themes/${params.themeId}`)
            }

            if (themesList) {
              let themesFlat = themesList.map((theme)=> {
                return theme.get('label')
              })
              themes = _.join(themesFlat.toJS(), ' - ')
            }

            metas.title = getI18n(lang).life.metas.title
            metas.description = getI18n(lang).life.metas.description

            break

          case Boolean(~location.pathname.indexOf('/coupon')) :
            //META SPONSORSHIP
            let couponItem = store.getState().Billing.get('coupon')
            if (couponItem) {
              const coupon = couponItem.get('coupon')
              if (coupon) {
                const plan = coupon.get('internalPlan')
                if (plan) {
                  //TODO connect to plan name/description
                  //Replace global
                  //title = title.replace(/{planName}/g, plan.get('name'))
                  //synopsis = synopsis.replace(/{planDescription}/g, plan.get('description'))
                  metas.title = getI18n(lang).sponsors.metas.title
                  metas.description = getI18n(lang).sponsors.metas.description
                  data = plan
                }
              }
            }
            break

          default:
            //META MOVIE/SERIE/EPISODE/VIDEO
            if (params.movieId) {
              const movieData = store.getState().Movie.get(`movies/${params.movieId}`)
              if (movieData) {

                let seasonData
                let videoData
                let episodeData

                if (params.videoId) {
                  videoData = store.getState().Video.get(`videos/${params.videoId}`)
                }
                if (params.seasonId) {
                  seasonData = store.getState().Season.get(`seasons/${params.seasonId}`)
                }

                if (params.episodeId) {
                  if (videoData) {
                    episodeData = videoData.get('episode')
                  }
                  else {
                    episodeData = store.getState().Episode.get(`episodes/${params.episodeId}`)
                  }
                }

                let type = movieData.get('type')
                movieTitle = movieData.get('title')

                if (type === 'movie') {
                  metas.title = getI18n(lang).home.movie.title
                  metas.description = getI18n(lang).home.movie.description
                } else {
                  metas.title = getI18n(lang).home.serie.title
                  metas.description = getI18n(lang).home.serie.description
                }

                let actorsList = movieData.get('actors')
                if (actorsList) {
                  let actorsFlat = actorsList.map((actor)=> {
                    return `${actor.get('firstName')} ${actor.get('lastName')}`
                  })
                  actors = _.join(actorsFlat.toJS(), ',')
                }

                if (seasonData) {
                  metas.title = getI18n(lang).home.season.title
                  metas.description = getI18n(lang).home.season.description
                  seasonNumber = seasonData.get('seasonNumber')
                }

                if (episodeData) {
                  metas.title = getI18n(lang).home.episode.title
                  metas.description = getI18n(lang).home.episode.description
                  episodeNumber = episodeData.get('episodeNumber')
                }

                if (params.videoId) {
                  metas.type = episodeData ? 'video.episode' : 'video.other'
                }

                //si on a les données de l'episode alors, on remplace les infos affichées
                data = episodeData ? movieData.merge(episodeData) : movieData
              }
            }
            break
        }

        if (movieTitle) {
          metas.title = metas.title.replace(/{serieName}/g, movieTitle)
          metas.title = metas.title.replace(/{movieName}/g, movieTitle)
          metas.description = metas.description.replace(/{movieName}/g, movieTitle)
          metas.description = metas.description.replace(/{serieName}/g, movieTitle)
        }
        metas.title = metas.title.replace(/{episodeNumber}/g, episodeNumber)
        metas.title = metas.title.replace(/{seasonNumber}/g, seasonNumber)
        metas.title = metas.title.replace(/{themes}/g, themes)
        metas.description = metas.description.replace(/{episodeNumber}/g, episodeNumber)
        metas.description = metas.description.replace(/{seasonNumber}/g, seasonNumber)
        metas.description = metas.description.replace(/{actors}/g, actors)


        return {metas, data}
      }

      getMetadata () {

        const extractData = this.getdata()
        const data = extractData.data
        const metas = extractData.metas

        let image = extractImg({data, keys: ['poster', 'thumb', 'image'], width: 1120})

        metas.meta.push({
          property: 'og:title',
          content: metas.title,
          override: true
        })
        metas.meta.push({
          name: 'twitter:title',
          content: metas.title,
          override: true
        })

        if (metas.description) {
          metas.meta.push({
            name: 'description',
            content: metas.description,
            override: true
          })

          metas.meta.push({
            property: 'og:description',
            content: metas.description,
            override: true
          })
          metas.meta.push({
            name: 'twitter:description',
            content: metas.description,
            override: true
          })
        }

        metas.meta.push({
          property: 'og:type',
          content: metas.type,
          override: true
        })


        metas.meta.push({
          property: 'og:image',
          content: image,
          override: true
        })

        metas.meta.push({
          name: 'twitter:image:src',
          content: image,
          override: true
        })


        metas.link.push({
          rel: 'canonical',
          href: metas.slug,
          override: true
        })
        metas.meta.push({
          property: 'og:url',
          content: metas.slug,
          override: true
        })
        metas.meta.push({
          name: 'twitter:site',
          content: metas.slug,
          override: true
        })

        return metas
      }

    }
    return MetasDataDecorator
  }
}
