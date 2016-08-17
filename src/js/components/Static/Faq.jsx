import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
class Faq extends React.Component {
  render () {
    return (
      <div className="row-fluid">
        <article>
          <section>
            <h1>Nos réponses à vos questions</h1>

            <h4>1/ Est-ce disponible sur ma box ?</h4>

            <p>Afrostream n’est malheureusement pas encore disponible sur votre Box.
              Pour nous aider à accélérer les choses envoyer un tweet votre opérateur internet en cliquant sur
              les
              liens suivants:
            </p>
            <ul>
              <li>
                <a
                  href="http://twitter.com/share?url=http://bit.ly/AFROSTREAMTV&text=@free je veux @AFROSTREAM dans ma @freebox. Quand est ce que cela sera possible ?"
                  target="_blank">
                  Demander Afrostream chez Free</a>
              </li>
              <li>
                <a
                  href="http://twitter.com/share?url=http://bit.ly/AFROSTREAMTV&text=@sfr je veux @AFROSTREAM dans ma box. Quand est ce que cela sera possible ?"
                  target="_blank">
                  Demander Afrostream chez SFR</a>
              </li>
              <li>
                <a
                  href="http://twitter.com/share?url=http://bit.ly/AFROSTREAMTV&text=@Numericable je veux avoir @AFROSTREAM dans ma box. Quand est ce que cela sera possible ?"
                  target="_blank">
                  Demander Afrostream chez Numéricable</a>
              </li>
            </ul>

            <h4>2/ Quand serais- je prélevé ?</h4>

            <p>Le premier prélèvement a lieu au moment de la commande le l’abonnement.

              Pour l’abonnement « Ambassadeurs » et l’abonnement « Do the Right Think », il n’y a qu’un seul
              prélèvement pour toute l’année.
              Pour l’abonnement « Think Like A man » , les prochains prélèvements mensuels débuteront le 1
              novembre. Cet abonnement mensuel est sans engagement. Vous pouvez vous désabonner à tout
              moment.</p>

            <h4>3/ Pourquoi prélever maintenant alors que je n’ai pas encore accès au service ?</h4>

            <p>Nous sommes une startup composée de jeunes entrepreneurs. Les pré-abonnements renforcent nos
              capacités d’achat de séries et de films aux studios américains et africains.
              En commandant un abonnement annuel à l’avance vous soutenez le développement d’Afrostream.</p>

            <h4>4/ Comment accéder au service ?</h4>

            <p>Quelques jours avant la date de démarrage de votre abonnement à Afrostream, vous recevrez par
              email
              les informations nécessaires pour paramétrer votre profil et votre mot de passe.
              Les abonnements « Ambassadeurs » et « Do the Right Think » démarrent le 1er septembre.
              L’abonnement « Think Like a Man » démarre le 1 Octobre.</p>


            <h4>5/ Comment accéder aux films sur ma télé ?</h4>

            <p>Grâce à une petite clé multimédia ChromeCast.
              Elle se branche sur un port HDMI de votre téléviseur. Elle vous permet de diffuser facilement
              vos
              vidéos Afrostream directement sur votre TV depuis votre ordinateur, téléphone ou tablette.
              Chromecast est compatible avec les appareils Android, avec votre iPhone®, votre iPad®, votre
              ordinateur portable Mac® ou Windows®
              Acheter: <a href="https://www.google.fr/chrome/devices/chromecast/" target="_blank">https://www.google.fr/chrome/devices/chromecast/</a>
            </p>


            <h4>6/ Quel est le catalogue du service ?</h4>

            <p>Le catalogue d’Afrostream est composé des séries, films, documentaires et concerts
              afro-américains
              et africains. Il y a également des dessins animés pour les enfants.</p>

            <h4>7/ Puis je essayer le service avant de l’utiliser ?</h4>

            <p>Vous disposez d'une periode d'essai de 7 jours, vous permettant de tester le service</p>

            <h4>8/ Le service est-il disponible en Grande Bretagne/Allemagne/Canada ?</h4>

            <p>Pour le moment Afrostream est uniquement disponible en France, DOM-TOM, Belgique, Luxembourg,
              Suisse, Sénégal, Côte d’Ivoire.</p>

          </section>
        </article>
      </div>
    )
  }
}

export default Faq
