import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
class About extends React.Component {
  render () {
    return (
      <div id="react-blog">
        <section className="backstage-section bg-linear" id="founder">
          <div className="container-fluid no-padding">
            <div className="column-right">
              <h2 className="heading-2">Bios</h2>
              <div className="line-divider-block center-picture clearfix">
                <figure className="picture big-picture">
                  <img src="/press/screen/tonje.jpg"
                       width="100%"/>
                </figure>
                <div className="key-people-quote">
                  <p className="key-people-identity">
                    <span className="key-people-name">Tonjé Bakang</span>
                    <span className="key-people-function">FONDATEUR</span>
                  </p>
                </div>
                <div className="key-people-presentation">
                  <p>Tonjé Bakang est le fondateur et président d’Afrostream, le «Netflix du contenu afro-américain,
                    Africain et caribéen», un service de streaming destiné en priorité aux marchés européens et
                    africains. Afrostream est une plate-forme proposant du contenu afro produit par les majors
                    international mais aussi par des distributeurs indépendants qui cherchent une audience
                    internationale. Avant de fonder Afrostream, Tonjé a travaillé dans le milieu du divertissement
                    pendant près de 15 ans. D'abord dans l’industrie musicale en qualité de réalisateur de clips-vidéos,
                    puis en tant que producteur de spectacles de comédie pour le théâtre. Il a été le mentor de toute
                    une nouvelle génération de comédiens de ‘couleur’ et a lancé en France le « stand-up » inspiré par
                    le « Def Comedy Jam » diffusé sur la chaîne câblée américaine HBO. Sa passion pour l'écriture l'a
                    amené à développer un scénario pour une chaîne de TV française et il va utiliser cette expertise
                    pour produire du contenu original pour la plateforme Afrostream. Twitter : @Tonjebakang.</p>
                </div>
              </div>
              <div className="line-divider-block center-picture clearfix">
                <figure className="picture big-picture">
                  <img src="/press/screen/ludo.jpg"
                       width="100%"/>
                </figure>
                <div className="key-people-quote">
                  <p className="key-people-identity">
                    <span className="key-people-name">Ludovic Bostral</span>
                    <span className="key-people-function">CO-FONDATEUR CTO</span>
                  </p>
                </div>
                <div className="key-people-presentation">
                  <p>Ludovic Bostral est cofondateur et directeur technique d'Afrostream. Après un diplôme d’ingénieur
                    logiciel à Polytech’Nantes en 2000, il a acquis 16 ans d'expérience dans l'univers de la vidéo en
                    ligne travaillant pour Manreo, Netia, M6, et Digibos. En 2007, il rejoint M6 Web, où il a été le
                    leader technique de l'équipe en charge de la télévision de rattrapage en France, 6Play, l'un des
                    leaders du secteur. Il a piloté le lancement du service 6Play sur SFR, Free, Orange, Bouygues. Fin
                    2013 il fonde un cabinet de consultant spécialisé dans la vidéo en ligne. Début 2014, il crée
                    Afrostream, qui est passé par les programmes Orange Fab et Y Combinator après avoir rejoint The
                    Family en mars 2014.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default About
