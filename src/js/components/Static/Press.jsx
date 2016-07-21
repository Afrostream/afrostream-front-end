import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as ModalActionCreators from '../../actions/modal'
import _ from 'lodash'
import { connect } from 'react-redux'

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
@connect(({}) => ({}))
class Press extends React.Component {

  loadVideo (video) {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(ModalActionCreators.open({target: 'player', data: video}))
  }

  renderVideos () {

    const videos = [
      {
        title: 'Bande annonce Afrostream - Plus de fun',
        type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=JrrZEsqsdbk',
        videoId: 'JrrZEsqsdbk'
      },
      {
        title: 'Bande annonce Afrostream - Plus de passion',
        type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=V1fl4UrumoA',
        videoId: 'V1fl4UrumoA'
      },
      {
        title: 'Bande annonce Afrostream - Plus d\'action',
        type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=d9RLaeULG7k',
        videoId: 'd9RLaeULG7k',
      },
      {
        title: 'Être couple avec Afrostream: Jaymax et Salomé Je t\'aime​', type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=2oCSXE-ToFE',
        videoId: '2oCSXE-ToFE'
      },
      {
        title: 'Jaymax et les films afro !​', type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=fJ1tKclvY8M',
        videoId: 'fJ1tKclvY8M',
      },
      {
        title: 'Salomé Je t\'aime et Waly Dia parodient les films d\'auteur français', type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=QBS2wWI02qs',
        videoId: 'QBS2wWI02qs'
      },
      {
        title: 'Dycosh - Accro aux films afro', type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=S61YIE9e-CI',
        videoId: 'S61YIE9e-CI'
      },
      {
        title: 'Avant-première du film Black organisé pour les abonnés d\'AFROSTREAM', type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=xyRXwzKy_rk',
        videoId: 'xyRXwzKy_rk'
      },
      {
        title: 'Screening: The Perfect Guy (Un Homme Parfait) / Afrostream in Paris', type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=7JJ65PHDbaU',
        videoId: '7JJ65PHDbaU'
      },
      {
        title: 'Comment s\'abonner à Afrostream sans carte bancaire ?', type: 'video/youtube',
        src: 'https://www.youtube.com/watch?v=gx5p0ZD88EM',
        videoId: 'gx5p0ZD88EM'
      }
    ]

    return _.map(videos, (video, key)=> {
      return <li key={`static-videos-${key}`}>
        <img onClick={event => ::this.loadVideo(video)}
             src={`http://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}/>
        <p>{video.title}</p>
      </li>
    })
  }


  renderPress () {
    const press = [
      {
        title: '#Afrostream : Ce Netflix qui propose la diffusion illimitée de séries et films afro-américains',
        src: 'http://www.maddyness.com/startup/2014/06/02/afrostream-netflix/',
        partner: 'Maddyness'
      },
      {
        title: 'L\'as de la video ethnique',
        src: 'http://www.latribune.fr/opinions/blogs/generation-peur-de-rien/tonje-bakang-l-as-de-la-video-ethnique-509757.html',
        partner: 'La Tribune'
      },
      {
        title: 'WHY BLACK FILMS CAN CHANGE THE WORLD And why I founded Afrostream.tv',
        src: 'https://medium.com/@tonjebakang/why-black-films-can-change-the-world-3f72bc2c6ec#.8u5j7j4i5',
        partner: 'Medium'
      },
      {
        title: 'Découverte : AfroStream, Le Netflix du contenu Afro',
        src: 'http://www.techofafrica.com/decouverte-afrostream-netflix-du-contenu-afro/',
        partner: 'Tech of Africa'
      },
      {
        title: 'Afrostream, le service de SVOD de la communauté Afro, arrive en France',
        src: 'http://www.usine-digitale.fr/editorial/afrostream-le-netflix-de-la-communaute-afro-debarque-en-france.N266186',
        partner: 'Usine Digitale'
      },
      {
        title: 'Afrostream TV: Building the Infrastructure for Black Power in the Global Film Industry',
        src: 'http://blogs.indiewire.com/shadowandact/afrostream-tv-building-the-infrastructure-for-black-power-in-the-global-film-industry',
        partner: 'Shadow and Act'
      },
      {
        title: 'Découvrez #AfroStream, le “Netflix Afro” à destination de l’Afrique et sa Diaspora !',
        src: 'http://techafrique.startupbrics.com/afrostream-netflix-afrique-diaspora/#.VpqyglIoTs1',
        partner: 'StartupBRICS'
      },
      {
        title: 'Bientôt un Netflix franco-africain',
        src: 'http://www.lepoint.fr/technologie/bientot-un-netflix-franco-africain-sur-nos-ecrans-23-09-2014-1865649_58.php',
        partner: 'Le Point'
      },
      {
        title: 'Netflix snobe l’Afrique ? Peu importe, Afrostream arrive',
        src: 'http://actualites.fr.softonic.com/netflix-snobe-afrique-afrostream-arrive',
        partner: 'Softonic'
      },
      {
        title: 'À la rencontre de TonJé BAKANG, créateur d’Afrostream',
        src: 'http://aminy.net/2014/10/la-rencontre-de-tonje-bakang-createur-dafrostream/',
        partner: 'Aminy'
      },
      {
        title: 'Afro-Afrique en VOD Entretien de Claire Diao avec Enrico Chiesa et Tonje Bakang',
        src: 'http://www.africultures.com/php/index.php?nav=article&no=12528',
        partner: 'Africultures'
      },
      {
        title: 'Tonjé Bakang (Afrostream) : Portrait d’un entrepreneur résolument pour la diversité',
        src: 'http://www.totem-world.com/tonje-bakang-entrepreneur-diversite.html',
        partner: 'Totem World'
      },
      {
        title: 'Afrostream, la diversité bientôt en accès illimité !',
        src: 'http://www.jeuneafrique.com/32806/societe/afrostream-la-diversit-bient-t-en-acc-s-illimit/',
        partner: 'Jeune Afrique'
      },
      {
        title: 'TF1 mise sur la cinema Afro',
        src: 'http://www.leparisien.fr/espace-premium/culture-loisirs/tf1-mise-sur-le-cinema-afro-22-02-2015-4551725.php',
        partner: 'Le Parisien'
      },
      {
        title: 'Afrostream se rêve en Netflix africain',
        src: 'http://www.lemonde.fr/afrique/article/2015/02/26/afrostream-se-reve-en-netflix-africain_4584215_3212.html',
        partner: 'Le Monde'
      },
      {
        title: 'The Best of Black Cinema Coming to Europe with an Exclusive New VOD Offering: Afrostream VOD',
        src: 'http://blogs.indiewire.com/shadowandact/the-best-of-black-cinema-coming-to-europe-with-an-exclusive-new-vod-offering-afrostream-vod-20150227',
        partner: 'Shadow and Act'
      },
      {
        title: 'Tonjé Bakang : « Avec AFROSTREAM, MYTF1VOD a envie de s’adresser à tous les publics »',
        src: 'http://www.spheremetisse.com/tonje-bakang-avec-afrostream-mytf1vod-a-envie-de-sadresser-a-tous-les-publics.html',
        partner: 'Sphere Metisse'
      },
      {
        title: 'TF1 Teams With Afrostream to Launch VOD Platform',
        src: 'http://variety.com/2015/film/global/tf1-teams-with-afrostream-to-launch-vod-platform-1201444201/',
        partner: 'Variety'
      },
    ]

    return _.map(press, (video, key)=> (
      <li key={`static-link-${key}`}>
        <a className="press-link" href={video.src} target="_blank">{video.title}</a>
      </li>
    ))
  }

  render () {
    return (
      <div id="react-blog">
        <section className="backstage-section bg-linear" id="mediakit">
          <div className="container-fluid container-no-padding">
            <div className="column-right">
              <h2 className="heading-2">Kit média</h2>
              <ul className="mediakit-list">
                <li>
                  <img className="pointer"
                       src="/press/srceen/srceen-link.jpg"
                       width="345" height="190"/>
                  <p>Retrouvez nos logos, notre charte graphique.</p>
                  <span className="btn-download">
    <a role="button" href="/press/srceen/Logos-2016-07-21.zip" className="btn btn-info"
       type="button">
    <span className="zmdi zmdi-download"></span>
    <span className="label">Télécharger</span>
    </a>
    </span>
                </li>
                <li>
                  <img className="pointer"
                       src="/press/srceen/images-link.jpg"
                       width="345" height="190"/>
                  <p>Afrostream en images.</p>
                  <span className="btn-download">
    <a role="button" href="/press/srceen/Screen_Images_and_Devices-2016-07-21.zip" className="btn btn-info"
       type="button">
    <span className="zmdi zmdi-download"></span>
    <span className="label">Télécharger</span>
    </a>
    </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="backstage-section bg-linear" id="videos">
          <div className="container-fluid container-no-padding">
            <div className="column-right">
              <h2 className="heading-2">Vidéos</h2>
              <ul className="three-items-list video-list">
                {this.renderVideos()}
              </ul>
            </div>
          </div>
        </section>
        <section className="backstage-section bg-linear" id="press">
          <div className="container-fluid container-no-padding">
            <div className="column-right">
              <h2 className="heading-2">Presse</h2>
              <ul className="mediakit-list">
                <li>
                  <img className="pointer"
                       src="/press/srceen/press.jpg"
                       width="345" height="190"/>
                  <p>Retrouvez notre dossier de presse.</p>
                  <span className="btn-download">
    <a role="button" href="/press/srceen/Press_Releases-2016-07-21.zip" className="btn btn-info"
       type="button">
    <span className="zmdi zmdi-download"></span>
    <span className="label">Télécharger</span>
    </a>
    </span>
                </li>
              </ul>
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
