import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
class FAQ extends React.Component {
  render () {
    return (
      <div className="column-right">
        <div className="post-text"><h2 className="heading-2 company-subtitle">
          DEEZER LANCE LA VERSION FINALISÉE DE SON APPLICATION POUR WINDOWS 10</h2>
          <p>
            Communiqué de Presse. Paris, le 21 juillet 2016. La nouvelle mise à jour Windows présente des options de
            recherche plus personnalisées, les paroles des titres et l’incontournable Flow Après avoir annoncé la
            ver...</p>
          <p><a className="link-primary link-animated"
                href="http://www.deezer-blog.com/press/deezer-lance-la-version-finalisee-de-son-application-pour-windows-10/"
                target="_blank" data-reactid=".0.1.$0.2.0">Lire plus</a></p></div>
        <div className="post-text" data-reactid=".0.1.$1"><h2 className="heading-2 company-subtitle"
                                                              data-reactid=".0.1.$1.0">
          DEEZER DÉPLOIE SON OFFRE «&nbsp;DEEZER FAMILLE&nbsp;» À TOUS SES UTILISATEURS</h2><p
          data-reactid=".0.1.$1.1">Communiqué de Presse. Paris, le 19 juillet 2016. ' ' En novembre dernier, Deezer
          annonçait le lancement de Deezer Famille en avant-première avec son partenaire Orange. Aujourd’hui, le
          leader du streaming en Fra...</p><p data-reactid=".0.1.$1.2"><a className="link-primary link-animated"
                                                                          href="http://www.deezer-blog.com/press/deezer-deploie-son-offre-deezer-famille-a-tous-ses-utilisateurs/"
                                                                          target="_blank" data-reactid=".0.1.$1.2.0">Lire
          plus</a></p></div>
        <div className="post-text" data-reactid=".0.1.$2"><h2 className="heading-2 company-subtitle"
                                                              data-reactid=".0.1.$2.0">
          DEEZER LAUNCHES DIRECT TO CONSUMERS IN U.S. WITH THE MOST PERSONALIZED MUSIC DISCOVERY PLATFORM</h2><p
          data-reactid=".0.1.$2.1">Following Success of Home Audio and Mobile Subscriptions, Deezer is Made Available
          to All Music Lovers NEW YORK (July 19, 2016)&nbsp;–&nbsp;Deezer, one of the world’s leading, on-demand
          digital music streaming services,...</p><p data-reactid=".0.1.$2.2"><a className="link-primary link-animated"
                                                                                 href="http://www.deezer-blog.com/press/deezer-launches-direct-to-consumers-in-u-s-with-the-most-personalized-music-discovery-platform/"
                                                                                 target="_blank"
                                                                                 data-reactid=".0.1.$2.2.0">Lire
          plus</a></p></div>
      </div>
    )
  }
}

export default FAQ
