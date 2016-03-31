import React from 'react';
import {prepareRoute} from '../../decorators';
import * as EventActionCreators from '../../actions/event';
@prepareRoute(async function ({store}) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(true))
  ];
})
class CGU extends React.Component {
  render() {
    return (
      <div className="row-fluid">
        <article>
          <section>
            <h1>Conditions d'utilisation de Afrostream</h1>
            <p>Bienvenue sur Afrostream&nbsp;! Nous sommes un service d'abonnement fournissant à nos
              utilisateurs
              l'accès à des films et séries TV diffusés en streaming par Internet sur certains téléviseurs,
              ordinateurs et autres appareils connectés («&nbsp;appareils compatibles avec Afrostream&nbsp;»).
            </p>
            <p>
              Le service Afrostream vous est proposé par Afrostream, Inc, une société à responsabilité limitée de droit
              américain.
              Les présentes Conditions d'utilisation régissent votre utilisation de notre service. Telles qu'utilisées
              dans les présentes,
              les expressions «&nbsp; service Afrostream &nbsp;», «&nbsp; notre service &nbsp;» ou «&nbsp; le
              service &nbsp;»
              désignent le service fourni par Afrostream permettant de rechercher et de regarder des films et des séries
              TV,
              comprenant l'ensemble des fonctionnalités, le site Web et les interfaces utilisateur, ainsi que tout le
              contenu
              et les logiciels associés à notre service.
            </p>
            <ol>
              <li><h3>Abonnement.</h3>
                <p>
                  Annuel (Formules «&nbsp; Ambassadeurs &nbsp;» et «&nbsp; Do the right Thing &nbsp;»)
                  Votre abonnement annuel à Afrostream est renouvelé automatiquement
                  chaque année jusqu'à sa résiliation. À moins que vous ne résiliiez
                  votre abonnement avant votre date de renouvellement annuel,
                  vous nous autorisez à vous facturer les frais d’abonnement
                  de l’année suivants selon votre Mode de paiement
                  (voir « Résiliation » cidessous).
                </p>
                <p>
                  Mensuel (Formule «&nbsp; Think Like a Man &nbsp;»)
                  Votre abonnement mensuel à Afrostream est renouvelé automatiquement
                  chaque mois jusqu'à sa résiliation. À moins que vous ne résiliiez votre abonnement
                  avant votre date de renouvellement mensuel, vous nous autorisez à vous facturer
                  les frais d’abonnement des mois suivants selon votre Mode de paiement
                  (voir «&nbsp; Résiliation &nbsp;» ci-dessous).
                </p>
                <p>
                  Pour utiliser le service Afrostream, vous devez avoir un accès à Internet
                  et un appareil compatible avec Afrostream, et vous devez nous fournir
                  un Mode de paiement à jour, valide et accepté que vous pourrez modifier à tout moment
                  («&nbsp; Mode de paiement &nbsp;»).
                </p>
                <p>
                  Vous trouverez les détails spécifiques de votre abonnement au service Afrostream
                  en consultant notre site Web et en cliquant sur le lien « Votre compte » disponible
                  sur les pages du site Web Afrostream.
                </p>
              </li>
              <li><h3>Essais offert</h3>
                Votre abonnement à Afrostream peut inclure un ou plusieurs mois offerts inclus.
                La période offerte inclus correspond au(x) dernier(s) mois de la période de l’abonnement
                annuelle.
              </li>
              <li><h3>Facturation</h3>
                Cycle de facturation. Les frais d'abonnement à notre service seront facturés chaque selon votre
                formule d’abonnement.
                <ul>
                  <li><span class="t-under">Formules annuelles «&nbsp; Ambassadeurs &nbsp;» et «&nbsp;
                    Do the right Thing &nbsp;
                    »</span>
                    Les frais d'abonnement à notre service seront facturés chaque année selon
                    votre Mode de paiement le jour calendaire correspondant au démarrage de votre abonnement
                    payant.
                    Dans certains cas, le calendrier de votre facturation peut changer, par exemple,
                    si votre Mode de paiement n'a pas fonctionné ou si votre abonnement payant a commencé un
                    jour
                    ne figurant pas dans un mois donné. Accédez à notre site Web et cliquez sur le lien
                    «&nbsp; Voir les détails de facturation » sur la page «&nbsp; Votre compte » pour connaître
                    la date
                    de votre prochaine facturation.
                  </li>
                  <li><span class="t-under">Formule mensuel «&nbsp; Think Like a Man &nbsp;»</span>
                    Les frais d'abonnement à notre service seront facturés chaque mois selon votre Mode de
                    paiement
                    le jour calendaire correspondant au démarrage de votre abonnement payant.
                    Dans certains cas, le calendrier de votre facturation peut changer, par exemple,
                    si votre Mode de paiement n'a pas fonctionné ou si votre abonnement payant a commencé
                    un jour ne figurant pas dans un mois donné. Accédez à notre site Web et
                    cliquez sur le lien «&nbsp; Voir les détails de facturation &nbsp;» sur la page «&nbsp;
                    Votre compte &nbsp;»
                    pour connaître la date de votre prochaine facturation.
                  </li>
                  <li><span class="t-under">Modes de paiement.</span> Vous pouvez modifier votre Mode de
                    paiement en accédant à notre site Web et en cliquant sur le lien «&nbsp;Votre
                    compte&nbsp;».
                    Si le règlement d'un paiement échoue en raison de l'expiration de la carte, de solde
                    insuffisant ou pour tout autre motif, et que vous ne modifiez pas votre Mode de
                    paiement
                    ou que vous ne résiliez pas votre compte, nous pouvons suspendre votre accès à notre
                    service jusqu’à l’obtention d’un Mode de paiement valide. Vous nous autorisez à
                    continuer à vous facturer ce ou ces montants via le Mode de paiement choisi, qui a
                    pu
                    être mis à jour, et vous êtes redevable de tout montant non prélevé. Une telle
                    situation
                    peut entraîner un changement dans vos dates de facturation. Pour certains Modes de
                    paiement, l'émetteur du Mode de paiement peut vous facturer des frais pour
                    opérations de
                    change ou d'autres frais. Adressez-vous à l'émetteur de votre Mode de paiement pour
                    obtenir plus d'informations.
                  </li>
                  <li><h3>Résiliation.</h3>
                    <p>
                      Formules annuelles « Ambassadeurs » et « Do the right Thing »
                      Vous pouvez résilier votre abonnement Afrostream à tout moment et vous continuerez
                      d'avoir accès au service jusqu'à la fin de votre période de facturation annuelle.
                    </p>
                    <p>
                      Formule mensuel « Think Like a Man »
                      Vous pouvez résilier votre abonnement Afrostream à tout moment et vous continuerez
                      d'avoir accès au service jusqu'à la fin de votre période de facturation mensuelle.
                    </p>
                    <p>
                      Nous n'accordons aucun remboursement ou crédit pour les périodes d'utilisation
                      partielle, ou pour tout film ou toute série TV non regardés. Pour résilier votre
                      abonnement, accédez à la page « Votre compte » et suivez les instructions. Si
                      vous résiliez votre abonnement, votre compte sera automatiquement fermé à
                      l'issue de votre période de facturation en cours. Pour savoir quand votre compte
                      sera fermé, cliquez sur « Voir les détails de facturation » sur la page « Votre
                      compte ». Si vous vous êtes inscrit à Afrostream en utilisant le compte que vous
                      détenez chez un tiers comme Mode de paiement et que vous souhaitez résilier
                      votre abonnement Afrostream à un moment donné, il se peut que vous deviez le
                      faire auprès de ce tiers, par exemple en consultant votre compte chez ce tiers
                      et en désactivant le renouvellement automatique ou en vous désabonnant du
                      service Afrostream par le biais de ce tiers. Vous pouvez également consulter les
                      informations de facturation rattachées à votre abonnement Afrostream en
                      consultant votre compte chez le tiers concerné.
                    </p>
                  </li>
                  <li><h3>Modifications du prix et de l’offre de service.</h3>
                    Nous pouvons modifier notre offre de service ainsi que le prix de notre service de temps à
                    autre. Toutefois, toutes modifications du prix de notre service ou de notre offre de
                    service ne vous seront applicables que dans un délai minimum de 30 jours après
                    réception d’un e-mail de notification de notre part.
                  </li>
                </ul>

              </li>
              <li><h3>Service Afrostream</h3>
                <ul>
                  <li>Vous devez être âgé de 18 ans, ou avoir atteint la majorité légale dans votre
                    province,
                    votre territoire ou votre pays, pour vous abonner au service Afrostream. Les
                    personnes
                    mineures peuvent utiliser le service uniquement sous la supervision d’un adulte.
                  </li>
                  <li>Le service Afrostream, ainsi que tout contenu regardé par le biais du service, est
                    réservé
                    à un usage uniquement personnel et non-commercial. Pendant la durée de votre
                    abonnement,
                    nous vous accordons une licence restreinte, non exclusive et non transférable vous
                    permettant d'accéder au service Afrostream et de regarder des films et des séries TV
                    uniquement en streaming. À l'exception de la licence restreinte susmentionnée, aucun
                    droit, titre ou intérêt ne vous est accordé. Vous acceptez de ne pas utiliser le
                    service
                    pour des représentations publiques.
                  </li>
                  <li>Vous pouvez regarder un film ou une série TV au moyen du service Afrostream dans le
                    pays
                    où
                    vous avez créé votre compte et uniquement dans les zones géographiques où nous
                    proposons
                    notre service et dans lesquelles nous détenons les licences correspondant à ces
                    films et
                    séries TV. Le contenu disponible peut varier selon la zone géographique et sera
                    modifié
                    de temps en temps. Le nombre d'appareils sur lesquels vous pouvez simultanément
                    regarder
                    du contenu dépend du type d'abonnement que vous avez choisi et est précisé sur la
                    page «&nbsp;Votre
                    compte&nbsp;».
                  </li>
                  <li>Nous mettons continuellement à jour le service Afrostream, y compris le contenu de
                    la
                    bibliothèque. De même, nous testons régulièrement différents aspects de notre
                    service,
                    notamment notre site Web, nos interfaces utilisateur, offres promotionnelles et la
                    disponibilité des films et des séries TV. Vous pouvez à tout moment désactiver ces
                    tests
                    en vous rendant sur la page «&nbsp;Votre compte&nbsp;» et en modifiant les
                    paramètres de
                    «&nbsp;Participation aux tests&nbsp;».
                  </li>
                  <li>Vous acceptez d'utiliser le service Afrostream, y compris l'ensemble des options
                    et
                    fonctionnalités associées, conformément aux lois, règles et réglementations en
                    vigueur,
                    ou aux restrictions relatives à l'utilisation du service ou du contenu proposé. Vous
                    vous engagez à ne pas archiver, télécharger, reproduire, distribuer, modifier,
                    afficher,
                    exécuter, publier, concéder, créer des œuvres dérivées, vendre ou utiliser (sauf
                    autorisation expresse mentionnée dans les présentes Conditions d'utilisation) le
                    contenu
                    et les informations du service Afrostream (ou obtenus par celui-ci). Vous vous
                    engagez
                    également à ne pas : contourner, retirer, modifier, désactiver, détruire ou faire
                    échouer les protections des contenus dans le cadre du service Afrostream ; utiliser
                    des
                    robots, des robots d'indexation, des outils de moissonnage du Web ou d'autres
                    méthodes
                    automatisées pour accéder au service Afrostream ; décompiler, faire de l'ingénierie
                    inverse
                    ou démonter tout logiciel, produit ou processus accessibles par le biais du service
                    Afrostream ; insérer tout code ou produit, ou manipuler le contenu du service
                    Afrostream
                    de
                    quelque façon que ce soit ; ou utiliser toute méthode d'exploration, de collecte ou
                    d'extraction de données. De même, vous vous engagez à ne pas charger, afficher,
                    envoyer
                    par e-mail ou envoyer ou transmettre de quelque façon que ce soit tout contenu
                    visant à
                    interrompre, détruire ou restreindre la fonctionnalité de tout logiciel ou
                    équipement
                    informatique ou de télécommunication associés au service Afrostream, y compris tout
                    virus
                    ou tout autre code, fichier ou programme informatiques. Nous pouvons résilier ou
                    restreindre votre utilisation de notre service si vous enfreignez les présentes
                    Conditions d'utilisation ou faites une utilisation illégale ou illégitime du
                    service.
                  </li>
                  <li>La qualité d'affichage des films et séries TV diffusés en streaming peut varier
                    d'un
                    ordinateur ou d'un appareil à l'autre, et peut être influencée par différents
                    facteurs,
                    dont votre emplacement, la bande passante disponible et la vitesse de votre
                    connexion
                    Internet. Pour obtenir une qualité SD, votre système doit disposer d’une vitesse
                    de
                    connexion de 0,5 Mbit/s minimum. Toutefois, nous recommandons une connexion plus
                    rapide
                    afin d'améliorer la qualité de la vidéo. La disponibilité de la HD
                    dépend de votre connexion Internet et des capacités de l'appareil. Tout le contenu
                    n'est
                    pas disponible en HD et tous les types d’abonnement ne permettent pas de
                    recevoir le contenu en HD. Une vitesse de téléchargement d'au moins 5
                    Mbit/s par flux est recommandée pour pouvoir regarder du contenu en HD, qui est
                    définie
                    comme 720p ou plus. Les frais de connexion à Internet sont à votre
                    charge.
                    Veuillez contacter votre fournisseur d'accès Internet pour en savoir plus sur les
                    éventuels frais d'utilisation des données Internet. Le délai qui s'écoule avant de
                    pouvoir regarder un film ou une série TV varie en fonction de plusieurs facteurs,
                    notamment votre emplacement, la bande passante disponible au moment où vous
                    regardez
                    le
                    titre, le film ou la série TV choisis et la configuration de votre appareil
                    compatible
                    avec Afrostream.
                  </li>
                  <li>Le logiciel de streaming de Afrostream est conçu par ou pour Afrostream et
                    permet la
                    diffusion
                    du contenu de Afrostream en streaming au moyen d'appareils compatibles avec
                    Afrostream.
                    Ce
                    logiciel peut varier selon l'appareil et le support utilisés ; les
                    fonctionnalités
                    peuvent également varier en fonction de l'appareil. En utilisant notre service,
                    vous
                    reconnaissez que celui-ci puisse nécessiter l’utilisation du logiciel d’un tiers
                    soumis
                    aux conditions de licences de ces tiers. Vous acceptez de recevoir
                    automatiquement
                    des
                    versions mises à jour du logiciel de Afrostream ou des logiciels tiers associés
                    au
                    service.
                    En cas de vente, de perte ou de vol de votre appareil compatible avec
                    Afrostream,
                    veuillez
                    le désactiver. Si vous ne vous déconnectez pas de Afrostream sur l'appareil ou
                    que
                    vous
                    ne
                    désactivez pas l'appareil, les prochains utilisateurs pourront accéder au
                    service
                    Afrostream en utilisant votre compte, ainsi qu'à certaines informations de votre
                    compte.
                    Pour désactiver un appareil, suivez les instructions correspondantes sur la page
                    «&nbsp;Votre
                    compte&nbsp;».
                  </li>
                </ul>
              </li>
              <li><h3>Mots de passe et accès au compte</h3>
                <ul>
                  <li>L'utilisateur ayant créé le compte Afrostream et se voyant facturer des frais
                    d'abonnement
                    selon le Mode de paiement choisi (le «&nbsp;Titulaire du compte&nbsp;») détient
                    l'accès
                    au compte Afrostream et a le contrôle sur ce dernier. Afin de garder le contrôle du
                    compte
                    et d’empêcher quiconque d’y accéder (et d’accéder aux informations sur la
                    consultation
                    de l’historique de ce dernier), le Titulaire du compte ne doit communiquer à
                    personne ni
                    son mot de passe, ni les détails relatifs au Mode de paiement associé au compte (par
                    exemple, les quatre derniers chiffres de sa carte de crédit ou de débit, ou encore
                    son
                    adresse e-mail s'il utilise PayPal). Vous êtes responsable de la mise à jour et du
                    maintien d'informations exactes concernant votre compte.
                  </li>
                  <li>Soyez prudents lorsque vous recevez des messages vous invitant à transmettre les
                    informations relatives à votre carte bancaire ou à votre compte. La transmission de
                    ces
                    informations en réponse à ces communications peut mener à une usurpation d'identité.
                    Accédez toujours à vos informations confidentielles en passant directement par le
                    site
                    Web de Afrostream, et non en suivant un lien hypertexte contenu dans un e-mail ou
                    dans
                    toute autre communication électronique, même si l'e-mail semble officiel. Nous
                    pouvons
                    résilier ou suspendre votre compte afin de vous protéger, ainsi que Afrostream ou
                    ses
                    partenaires, contre toute usurpation d’identité ou toute autre activité frauduleuse.
                  </li>
                </ul>

              </li>
              <li><h3>Loi applicable.</h3>
                Les présentes Conditions d'utilisation sont régies et interprétées conformément aux lois
                des États-Unis.
                Les présentes Conditions d'utilisation ne sauraient limiter les dispositions relatives à la
                protection des consommateurs
                dont vous pourriez bénéficier en vertu de la législation en vigueur dans votre pays de
                résidence.
              </li>
              <li><h3>Applications de tiers.</h3>
                Vous pouvez être amené à rencontrer des applications
                provenant
                de
                tiers (y compris, sans s'y limiter, des sites Web, des widgets, des logiciels ou autres
                utilitaires logiciels) (les «&nbsp;Applications&nbsp;») qui interagissent avec le service
                Afrostream. L’utilisation que vous faites de ces Applications peut être soumise aux
                conditions
                d’utilisation ou de licence de tiers.
              </li>
              <li><h3>Contenus spontanés.</h3>
                Afrostream n'accepte aucun contenu ou idée spontanés pour des films ou
                des séries TV, et se dégage de toute responsabilité quant aux similitudes entre son contenu ou
                sa programmation et les contenus ou les idées qui lui sont transmis.
              </li>
              <li><h3>Assistance clientèle.</h3>
                Pour obtenir plus d'informations sur notre service et ses fonctionnalités ou si vous
                avez besoin
                d'assistance avec votre compte, merci de nous contacter par email
                (support@afrostream.tv).
                Dans certains cas, le service clientèle pourra vous aider plus efficacement au moyen
                d'un outil
                d'assistance par accès à distance qui nous donnera un accès complet à votre ordinateur.
                Si vous ne souhaitez pas nous accorder cet accès, vous devez refuser l'assistance au
                moyen de l'outil
                d'accès à distance et nous vous assisterons alors par d'autres moyens. En cas de
                contradiction entre
                les présentes Conditions d'utilisation et les informations fournies par l'assistance
                clientèle ou proposées
                sur d'autres sections de notre site Web, les présentes Conditions prévaudront.
              </li>
              <li><h3>Divisibilité.</h3>
                Si une ou plusieurs dispositions des présentes Conditions
                d'utilisation
                devaient s'avérer non valides, illégales ou inexécutables, les dispositions restantes
                demeureront pleinement valides, légales et exécutables.
              </li>
              <li><h3>Modification des Conditions d’utilisation.</h3>
                Afrostream peut, de temps à
                autre,
                modifier
                les
                présentes Conditions d’utilisation. Nous vous informerons au moins 30&nbsp;jours
                avant que
                les
                nouvelles Conditions d’utilisation ne deviennent applicables.
              </li>
              <li><h3>Communications électroniques.</h3>
                Nous vous enverrons des informations
                relatives à votre
                compte (par exemple, les autorisations de paiement, les factures, les changements
                de mot de
                passe ou de Mode de paiement, les messages de confirmation, les notifications)
                uniquement
                par
                voie électronique, par exemple par e-mail envoyé à l’adresse électronique que vous
                avez
                fournie
                lors de votre inscription.
              </li>
            </ol>
          </section>
          <section id="last_updated">Dernière mise à
            jour&nbsp;: 16 Mars 2016
          </section>
        </article>
      </div >
    );
  }
}

export default CGU;
