import React from 'react';
import { prepareRoute } from '../../decorators';
import * as EventActionCreators from '../../actions/event';
@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(true))
  ];
})
class Legals extends React.Component {
  render() {
    return (
      <div className="row-fluid">
        <article>
          <section>
            <h3>DONNÉES PERSONNELLES : </h3>

            <p>
              Les informations vous concernant sont destinées à Afrostream Inc.
              Vous disposez d"un droit d"accès, de modification, de rectification et de suppression des
              données qui vous
              concernent (art. 34 de la loi "Informatique et Libertés"). Pour l"exercer, adressez-vous à
              Afrostream Inc C/
              Orrick Law firm 1000 Marsh Road, CA Menlo Park 94025, Etats-Unis ou
              support@afrostream.tv
            </p>
          </section>

          <section>
            <h3>Informations de l"éditeur:</h3>

            <p>Afrostream<br />
              Afrostream Inc C/ Orrick Law firm 1000 Marsh Road, CA Menlo Park 94025, Etats-Unis<br />
              Tel (FR): +33 (0)9 82 20 30 30<br />
              adresse électronique : <a
                href="mailto:support@afrostream.tv">support@afrostream.tv</a>
            </p>
          </section>
          <section>
            <h3>Informations de l"hébergeur :</h3>

            <p>OVH
              SAS au capital de 10 059 500 €<br />
              RCS Lille Métropole 424 761 419 00045<br />
              Code APE 6202A<br />
              N° TVA : FR 22 424 761 419<br />
              Siège social : 2 rue Kellermann - 59100 Roubaix - France.<br />
              Directeur de la publication : Octave KLABA
            </p>

          </section>
          <section>
            <h3>Informations de l"hébergeur :</h3>
            OVH
            SAS au capital de 10 059 500 €<br />
            RCS Lille Métropole 424 761 419 00045<br />
            Code APE 6202A<br />
            N° TVA : FR 22 424 761 419<br />
            Siège social : 2 rue Kellermann - 59100 Roubaix - France.<br/>
            Directeur de la publication : Octave KLABA

            <p>
              L'utilisateur du site afrostream.tv reconnaît disposer de la compétence et des
              moyens nécessaires pour accéder et utiliser ce site. Il reconnaît également
              avoir vérifié que la configuration informatique utilisée ne contient aucun
              virus et qu'elle est en parfait état de fonctionnement.
              Enfin, l'utilisateur reconnaît également avoir pris connaissance de la
              présente notice légale et s'engage à la respecter.
            </p>


            <p>
              L'utilisateur du site afrostream.tv reconnaît disposer de la compétence et des
              moyens nécessaires pour accéder et utiliser ce site. Il reconnaît également
              avoir vérifié que la configuration informatique utilisée ne contient aucun
              virus et qu'elle est en parfait état de fonctionnement.
              Enfin, l'utilisateur reconnaît également avoir pris connaissance de la
              présente notice légale et s'engage à la respecter.
            </p>

            <p>
              L'utilisateur est informé que lors de ses visites sur le site, un cookie
              peut s'installer automatiquement sur son logiciel de navigation.
              Un cookie est un élément qui ne permet pas d'identifier l'utilisateur mais
              sert à enregistrer des informations relatives à la navigation de celui-ci
              sur le site Internet. Le paramétrage de votre logiciel de navigation permet
              d'informer de la présence de cookies et éventuellement de la refuser selon
              la procédure décrite à l'adresse suivante : www.cnil.fr .
            </p>

            <p>
              Ce site utilise Google Analytics, un service d'analyse de site Internet
              fourni par Google Inc. (« Google »). Google Analytics utilise des cookies,
              qui sont des fichiers texte placés sur votre ordinateur, pour aider le site
              internet à analyser l'utilisation du site par ses utilisateurs. Les données
              générées par les cookies concernant votre utilisation du site
              (y compris votre adresse IP) seront transmises et stockées par Google sur des
              serveurs situés aux Etats-Unis. Google utilisera cette information dans le
              but d'évaluer votre utilisation du site, de compiler des rapports sur
              l'activité du site à destination de son éditeur et de fournir d'autres
              services relatifs à l'activité du site et à l'utilisation d'Internet.
              Google est susceptible de communiquer ces données à des tiers en cas
              d'obligation légale ou lorsque ces tiers traitent ces données pour le compte
              de Google, y compris notamment l'éditeur de ce site. Google ne recoupera
              pas votre adresse IP avec toute autre donnée détenue par Google. Vous pouvez
              désactiver l'utilisation de cookies en sélectionnant les paramètres
              appropriés de votre navigateur. Cependant, une telle désactivation
              pourrait empêcher l'utilisation de certaines fonctionnalités de ce site.
              En utilisant ce site Internet, vous consentez expressément au traitement
              de vos données nominatives par Google dans les conditions et pour les
              finalités décrites ci-dessus.
            </p>
          </section>
        </article>
      </div>
    );
  }
}

export default Legals;
