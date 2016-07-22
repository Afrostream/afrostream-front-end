import webshot from 'webshot'
import { slugify } from '../../../../src/js/lib/utils'
import Promise from 'bluebird'
import path from 'path'

export function snap (req, res) {

  const staticPath = path.resolve(__dirname, '../../../../static/press/screen/site/')

  const press = [
    {
      title: '#Afrostream : Ce Netflix qui propose la diffusion illimitée de séries et films afro-américains',
      src: 'http://www.maddyness.com/startup/2014/06/02/afrostream-netflix/',
      date: '02-06-2014',
      partner: 'Maddyness'
    },
    {
      title: 'L\'as de la video ethnique',
      src: 'http://www.latribune.fr/opinions/blogs/generation-peur-de-rien/tonje-bakang-l-as-de-la-video-ethnique-509757.html',
      date: '03-06-2014',
      partner: 'La Tribune'
    },
    {
      title: 'WHY BLACK FILMS CAN CHANGE THE WORLD And why I founded Afrostream.tv',
      src: 'https://medium.com/@tonjebakang/why-black-films-can-change-the-world-3f72bc2c6ec#.8u5j7j4i5',
      date: '03-06-2014',
      partner: 'Medium'
    },
    {
      title: 'Découverte : AfroStream, Le Netflix du contenu Afro',
      src: 'http://www.techofafrica.com/decouverte-afrostream-netflix-du-contenu-afro/',
      date: '03-06-2014',
      partner: 'Tech of Africa'
    },
    {
      title: 'Afrostream, le service de SVOD de la communauté Afro, arrive en France',
      src: 'http://www.usine-digitale.fr/editorial/afrostream-le-netflix-de-la-communaute-afro-debarque-en-france.N266186',
      date: '03-06-2014',
      partner: 'Usine Digitale'
    },
    {
      title: 'Afrostream TV: Building the Infrastructure for Black Power in the Global Film Industry',
      src: 'http://blogs.indiewire.com/shadowandact/afrostream-tv-building-the-infrastructure-for-black-power-in-the-global-film-industry',
      date: '18-06-2014',
      partner: 'Shadow and Act'
    },
    {
      title: 'Découvrez #AfroStream, le “Netflix Afro” à destination de l’Afrique et sa Diaspora !',
      src: 'http://techafrique.startupbrics.com/afrostream-netflix-afrique-diaspora/#.VpqyglIoTs1',
      date: '17-09-2014',
      partner: 'StartupBRICS'
    },
    {
      title: 'Bientôt un Netflix franco-africain',
      src: 'http://www.lepoint.fr/technologie/bientot-un-netflix-franco-africain-sur-nos-ecrans-23-09-2014-1865649_58.php',
      date: '24-09-2014',
      partner: 'Le Point'
    },
    {
      title: 'Netflix snobe l’Afrique ? Peu importe, Afrostream arrive',
      src: 'http://actualites.fr.softonic.com/netflix-snobe-afrique-afrostream-arrive',
      date: '25-09-2014',
      partner: 'Softonic'
    },
    {
      title: 'À la rencontre de TonJé BAKANG, créateur d’Afrostream',
      src: 'http://aminy.net/2014/10/la-rencontre-de-tonje-bakang-createur-dafrostream/',
      date: '06-10-2014',
      partner: 'Aminy'
    },
    {
      title: 'Afro-Afrique en VOD Entretien de Claire Diao avec Enrico Chiesa et Tonje Bakang',
      src: 'http://www.africultures.com/php/index.php?nav=article&no=12528',
      date: '07-11-2014',
      partner: 'Africultures'
    },
    {
      title: 'Tonjé Bakang (Afrostream) : Portrait d’un entrepreneur résolument pour la diversité',
      src: 'http://www.totem-world.com/tonje-bakang-entrepreneur-diversite.html',
      date: '28-01-2015',
      partner: 'Totem World'
    },
    {
      title: 'Afrostream, la diversité bientôt en accès illimité !',
      src: 'http://www.jeuneafrique.com/32806/societe/afrostream-la-diversit-bient-t-en-acc-s-illimit/',
      date: '13-02-2015',
      partner: 'Jeune Afrique'
    },
    {
      title: 'TF1 mise sur la cinema Afro',
      src: 'http://www.leparisien.fr/espace-premium/culture-loisirs/tf1-mise-sur-le-cinema-afro-22-02-2015-4551725.php',
      date: '22-02-2015',
      partner: 'Le Parisien'
    },
    {
      title: 'Afrostream se rêve en Netflix africain',
      src: 'http://www.lemonde.fr/afrique/article/2015/02/26/afrostream-se-reve-en-netflix-africain_4584215_3212.html',
      date: '26-02-2015',
      partner: 'Le Monde'
    },
    {
      title: 'The Best of Black Cinema Coming to Europe with an Exclusive New VOD Offering: Afrostream VOD',
      src: 'http://blogs.indiewire.com/shadowandact/the-best-of-black-cinema-coming-to-europe-with-an-exclusive-new-vod-offering-afrostream-vod-20150227',
      date: '27-02-2015',
      partner: 'Shadow and Act'
    },
    {
      title: 'Tonjé Bakang : « Avec AFROSTREAM, MYTF1VOD a envie de s’adresser à tous les publics »',
      src: 'http://www.spheremetisse.com/tonje-bakang-avec-afrostream-mytf1vod-a-envie-de-sadresser-a-tous-les-publics.html',
      date: '02-03-2015',
      partner: 'Sphere Metisse'
    },
    {
      title: 'TF1 Teams With Afrostream to Launch VOD Platform',
      src: 'http://variety.com/2015/film/global/tf1-teams-with-afrostream-to-launch-vod-platform-1201444201/',
      date: '02-03-2015',
      partner: 'Variety'
    },
    {
      title: 'VOD. Tonjé Bakang - Afrostream : le cinéma "afro" s\'invite à la maison',
      src: 'http://afrique.lepoint.fr/culture/vod-tonje-bakang-afrostream-le-cinema-afro-s-invite-a-la-maison-03-03-2015-1909711_2256.php',
      date: '03-03-2015',
      partner: 'Le Point'
    },
    {
      title: 'Young entrepreneur creates Afrostream, the African equivalent of Netflix',
      src: 'http://www.afropunk.com/profiles/blogs/feature-young-entrepreneur-creates-afrostream-the-african',
      date: '06-03-2015',
      partner: 'Afro Punk'
    },
    {
      title: 'Young entrepreneur creates Afrostream, the African equivalent of Netflix',
      src: 'http://blogywoodland.blogspot.fr/2015/03/afrostream-vod-tonje-bakang-veut-faire.html',
      date: '09-03-2015',
      partner: 'Blogywoodland'
    },
    {
      title: '« L’ère de la télé ghetto »',
      src: 'http://oeildafrique.com/lere-de-la-tele-ghetto-le-titre-de-stylist-france-qui-fait-scandale/',
      date: '13-03-2015',
      partner: 'Stylist'
    },
    {
      title: 'Afrostream: The African Netflix',
      src: 'http://www.ebony.com/entertainment-culture/afrostream-the-african-netflix',
      date: '18-03-2015',
      partner: 'Ebony'
    },
    {
      title: 'Tonjé Bakang AFROSTREAM, parcours d’un visionnaire afro-péen',
      src: 'http://www.diesemag.com/tonje-bakang-afrostream-parcours-dun-visionnaire-afro-peen/',
      date: '19-03-2015',
      partner: 'Dise Magazine'
    },
    {
      title: 'En France, il y a un marché pour les films avec des acteurs noirs',
      src: 'http://www.slate.fr/story/99577/films-noirs',
      date: '28-03-2015',
      partner: 'Slate'
    },
    {
      title: 'MR TONJE BAKANG',
      src: 'http://mrafropolitan.com/en/le-journal/the-portrait/mr-tonje-bakang-ceo-afrostream/5502/',
      date: '16-04-2015',
      partner: 'Mr Afropolitan'
    },
    {
      title: '« Donner une chance aux talents » : À la rencontre de Mr Afrostream par Samantha Etane',
      src: 'http://www.afrokanlife.com/donner-une-chance-aux-talents-a-la-rencontre-de-mr-afrostream-par-samantha-etane/?utm_campaign=coschedule&utm_source=twitter&utm_medium=KanLfstyle&utm_content=%22Donner%20une%20chance%20aux%20talents%22%20:%20%C3%80%20la%20rencontre%20de%20Mr%20Afrostream%20par%20Samantha%20Etane',
      date: '18-04-2015',
      partner: 'Afrokan Life'
    },
    {
      title: 'Le cinéma afro émerge sur le marché par le petit écran',
      src: 'http://electronlibre.info/abonnement/?_s2member_vars=post..level..1..post..38801..L2xlLWNpbmVtYS1hZnJvLWVtZXJnZS1zdXItbGUtbWFyY2hlLXBhci1sZS1wZXRpdC1lY3Jhbi8%3D&_s2member_sig=1452360116-d6411ccfa1c53388d2df03131175dc15',
      date: '21-04-2015',
      partner: 'Electronlibre'
    },
    {
      title: 'Afrostream, nouvel acteur sur le marché français de la SVOD',
      src: 'http://www.ladn.eu/actualites/afrostream-nouvel-acteur-sur-marche-francais-svod,article,27166.html',
      date: '01-07-2015',
      partner: 'L\'ADN'
    },
    {
      title: 'Global from the Get-Go : How European startups are leveraging global markets in the digital age',
      src: 'http://www.globalinnovationforum.com/reports/global-from-the-get-go-2015/',
      date: '12-07-2015',
      partner: 'Global Innovation Forum'
    },
    {
      title: 'Afrostream Is Netflix For African And African-American Movies',
      src: 'http://techcrunch.com/2015/07/17/afrostream-is-netflix-for-african-and-african-american-movies/',
      date: '17-07-2015',
      partner: 'Techcrunch'
    },
    {
      title: 'Afrostream (YC S15) Makes It Easy To Find And Watch African And African-American Movies',
      src: 'http://blog.ycombinator.com/afrostream-yc-s15-makes-it-easy-to-find-and-watch-african-and-african-american-movies',
      date: '17-07-2015',
      partner: 'YCombinator'
    },
    {
      title: '"Afrostream" pretende ser el Netflix afroamericano',
      src: 'http://www.ahoranoticias.cl/tecnologia/147334-afrostream-pretende-ser-el-netflix-afroamericano.html',
      date: '20-07-2015',
      partner: 'Ahora Noticias'
    },
    {
      title: 'AfroStream : Le Netflix des Africains et Afro-Américains',
      src: 'http://www.afrikatech.com/fr/2015/07/21/afrostream-le-netflix-des-africains-et-afro-americains/',
      date: '21-07-2015',
      partner: 'Afrika Tech'
    },
    {
      title: 'Afrostream, le Netflix africain, accélère',
      src: 'http://www.lesechos.fr/21/07/2015/lesechos.fr/021219626643_afrostream--le-netflix-africain--accelere.htm#xtor=CS1-33',
      date: '21-07-2015',
      partner: 'Les Echos'
    },
    {
      title: '#FrenchTech : Afrostream sélectionnée parmi 30 000 startups pour intégrer Y Combinator',
      src: 'http://www.maddyness.com/startup/2015/08/04/afrostream-y-combinator/',
      date: '04-08-2015',
      partner: 'Maddyness'
    },
    {
      title: 'TIRED OF NETFLIX? HERE’S THE NEW STREAMING SERVICE YOU DIDN’T KNOW YOU NEEDED.',
      src: 'http://blavity.com/tired-of-netflix-heres-the-new-streaming-service-you-didnt-know-you-needed/',
      date: '11-08-2015',
      partner: 'Blavity'
    },
    {
      title: 'Vidéo à la demande: l\'Afrique, terre de promesses, attend son Netflix',
      src: 'http://www.leparisien.fr/high-tech/video-a-la-demande-l-afrique-terre-de-promesses-attend-son-netflix-12-08-2015-5005827.php',
      date: '12-08-2015',
      partner: 'Le Parisien'
    },
    {
      title: 'VoD Afrique : Afrostream rejoint le célèbre incubateur américain Y Combinator',
      src: 'http://www.balancingact-africa.com/news/broadcast-fr/issue-no20/technologies-et-conv/vod-afrique-afrostre/bc_fr',
      date: '13-08-2015',
      partner: 'Balancing Acts Africa'
    },
    {
      title: 'New start-ups want to become the "African Netflix"',
      src: 'https://uk.finance.yahoo.com/news/start-ups-want-become-african-053024472.html',
      date: '19-08-2015',
      partner: 'Yahoo News'
    },
    {
      title: 'African Netflix',
      src: 'https://africa.mozilla.community/en/tag/afrostream/',
      date: '21-08-2015',
      partner: 'Mozilla'
    },
    {
      title: 'Afrostream, les meilleurs films et séries Afro en streaming',
      src: 'http://1001startups.fr/afrostream-les-meilleurs-films-et-series-afro-en-streaming/',
      date: '26-08-2015',
      partner: '1001startups'
    },
    {
      title: 'Tonjé Bakang une détermination à tous crins',
      src: 'http://www.forbesafrique.com/Tonje-Bakang-une-determination-a-tous-crins_a3412.html',
      date: '01-09-2015',
      partner: 'Forbes Afrique'
    },
    {
      title: 'Afrostream, la VOD consacrée aux films et séries afro-américaines et africaines',
      src: 'http://www.anousparis.fr/culture/tv/afrostream-la-vod-consacree-aux-films-et-series-afro-americaines-et-africaines',
      date: '10-09-2015',
      partner: 'A Nous Paris'
    },
    {
      title: 'AFROSTREAM, LA VOD CONSACRÉE AUX FILMS ET SÉRIES AFRO-AMÉRICAINES ET AFRICAINES',
      src: 'http://www.anousparis.fr/culture/tv/afrostream-la-vod-consacree-aux-films-et-series-afro-americaines-et-africaines',
      date: '14-09-2015',
      partner: 'A Nous Paris'
    },
    {
      title: 'Ludovic Bostral',
      src: 'http://www.satellimag.fr/satellimag-n-391278.html',
      date: '21-09-2015',
      partner: 'Satellimag'
    },
    {
      title: 'VOD: Orange investit dans Afrostream',
      src: 'http://www.lefigaro.fr/flash-eco/2015/10/05/97002-20151005FILWWW00419-vod-orange-investit-dans-afrostream.php',
      date: '05-10-2015',
      partner: 'Le Figaro'
    },
    {
      title: 'MIPCOM: Orange Invests In Afrostream’s Newly-Launched SVOD Service (EXCLUSIVE)',
      src: 'http://variety.com/2015/digital/markets-festivals/mipcom-orange-invests-in-afrostreams-newly-launched-svod-service-exclusive-1201610276/',
      date: '05-10-2015',
      partner: 'Variety'
    },
    {
      title: 'Orange investit dans Afrostream, le Netflix africain',
      src: 'http://www.lesechos.fr/05/10/2015/lesechos.fr/021379288094_orange-investit-dans-afrostream--le-netflix-africain.htm',
      date: '05-10-2015',
      partner: 'Les Echos'
    },
    {
      title: 'AfroStream Gets An Undisclosed Amount Of Funding From Orange, Cross Culture Ventures And More',
      src: 'http://techcabal.com/2015/10/06/afrostream-raises-undisclosed-funding-from-orange-cross-culture-ventures-and-more/',
      date: '06-10-2015',
      partner: 'Techcabal'
    },
    {
      title: 'Vidéo à la demande : Orange entre dans le capital d’Afrostream',
      src: 'http://www.jeuneafrique.com/269898/economie/video-a-la-demande-orange-entre-dans-le-capital-dafrostream/',
      date: '06-10-2015',
      partner: 'Jeune Afrique'
    },
    {
      title: 'Orange Digital Ventures investit dans Afrostream',
      src: 'http://www.orange.com/fr/Presse-et-medias/communiques-2016/communiques-2015/Orange-Digital-Ventures-investit-dans-Afrostream',
      date: '06-10-2015',
      partner: 'Orange'
    },
    {
      title: 'Tonjé Bakang, l\'as de la vidéo ethnique',
      src: 'http://www.latribune.fr/opinions/blogs/generation-peur-de-rien/tonje-bakang-l-as-de-la-video-ethnique-509757.html',
      date: '06-10-2015',
      partner: 'La Tribune'
    },
    {
      title: 'Afrostream plans to accelerate the development of its innovative streaming service across the globe',
      src: 'http://venturesafrica.com/afrostream-plans-to-accelerate-the-development-of-its-innovative-streaming-service-across-the-globe/',
      date: '07-10-2015',
      partner: 'Ventures Africa'
    },
    {
      title: 'Afrostream raises funding from Orange',
      src: 'http://disrupt-africa.com/2015/10/afrostream-raises-funding-from-orange/',
      date: '07-10-2015',
      partner: 'Disrupt Africa'
    },
    {
      title: 'Afrostream, le Netflix afro « né sur Facebook » veut conquérir le monde',
      src: 'http://rue89.nouvelobs.com/2015/10/07/afrostream-netflix-afro-facebook-veut-conquerir-monde-261538',
      date: '07-10-2015',
      partner: 'Rue89'
    },
    {
      title: 'Orange Digital Ventures invests in SVoD service Afrostream',
      src: 'http://www.digitaltveurope.net/440011/orange-digital-ventures-invests-in-svod-service-afrostream/',
      date: '08-10-2015',
      partner: 'Digital TV Europe'
    },
    {
      title: 'Karim Benzema, Afrostream, Fetty Wap...',
      src: 'http://www.mouv.fr/player/reecouter?play=228971#',
      date: '15-10-2015',
      partner: 'Mouv'
    },
    {
      title: 'La fac au régime sec, Afrostream et Christian Eckert',
      src: 'http://www.mouv.fr/diffusion-la-fac-au-regime-sec-afrostream-et-christian-eckert',
      date: '15-10-2015',
      partner: 'Mouv'
    },
    {
      title: 'Pitch Don\'t Kill My Vibe #15 - Tonjé Bakang, founder Afrostream',
      src: 'https://www.youtube.com/watch?v=oJGIxI1CQx4',
      date: '20-10-2015',
      partner: 'THEFAMILY'
    },
    {
      title: 'AFRO ON DEMAND',
      src: 'http://www.strategies.fr/actualites/medias/1025651W/afro-on-demand.html',
      date: '21-10-2015',
      partner: 'Strategies'
    },
    {
      title: 'Tonjé Bakang: founder of Afrostream, the Afro-Netflix',
      src: 'http://trueafrica.co/article/tonje-bakang-founder-of-afrostream-the-afro-netflix/',
      date: '26-10-2015',
      partner: 'True Africa'
    },
    {
      title: 'Afrostream signe un partenariat avec le géant Sony pour la distribution de films et séries "afro"',
      src: 'http://lentreprise.lexpress.fr/actualites/1/actualites/afrostream-signe-un-partenariat-avec-le-geant-sony-pour-la-distribution-de-films-et-series-afro_1729841.html',
      date: '27-10-2015',
      partner: 'L’Express Entreprise'
    },
    {
      title: 'Afrostream Signs Multi-Year Deal With Sony Pictures Television (EXCLUSIVE)',
      src: 'http://variety.com/2015/digital/markets-festivals/afrostream-signs-output-deal-with-sony-pictures-classics-exclusive-1201628227/',
      date: '27-10-2015',
      partner: 'Variety'
    },
    {
      title: 'Exclusive: Blossoming SVOD Platform Afrostream Inks Multi-Year Deal with Sony Pictures Television',
      src: 'http://blogs.indiewire.com/shadowandact/exclusive-blossoming-svod-platform-afrostream-inks-multi-year-deal-with-sony-pictures-television-20151027',
      date: '27-10-2015',
      partner: 'Shadow and Act'
    },
    {
      title: 'Viacom, Afrostream Ink Content Partnership',
      src: 'http://variety.com/2015/film/markets-festivals/viacom-afrostream-ink-content-partnership-1201629660/',
      date: '27-10-2015',
      partner: 'Variety'
    },
    {
      title: 'Ludovic Bostral : « Sur Afrostream, venez découvrir l\'Afrique qu\'on ne vous montre pas »',
      src: 'http://abfact.com/blog/ludovic-bostral-%C2%AB-sur-afrostream-venez-d%C3%A9couvrir-lafrique-quon-ne-vous-montre-pas-%C2%BB#.VlY2_XtMB-X',
      date: '03-11-2015',
      partner: 'Ab Fact'
    },
    {
      title: 'Viacom’s BET set for French SVoD launch via Afrostream',
      src: 'http://www.digitaltveurope.net/456142/viacoms-bet-set-for-french-svod-launch-via-afrostream/',
      date: '06-11-2015',
      partner: 'Digital TV Europe'
    },
    {
      title: 'BET teams with ‘Afro American Netflix’ in France',
      src: 'http://tbivision.com/news/2015/11/bet-teams-afro-american-netflix-france/506842/',
      date: '06-11-2015',
      partner: 'TBI Vision'
    },
    {
      title: 'INTERVIEW: "We need people to tell their own stories" - Afrostream CEO Tonjé Bakang\'s plan for better representation with streaming media',
      src: 'http://www.afropunk.com/profiles/blogs/interview-we-need-people-to-tell-their-own-stories-afrostream-ceo',
      date: '10-11-2015',
      partner: 'AfroPunk'
    },
    {
      title: 'How to Design a Better Pitch Deck',
      src: 'http://themacro.com/articles/2015/11/how-to-design-a-better-pitch-deck/',
      date: '19-11-2015',
      partner: 'The Macro'
    },
    {
      title: 'Most Influential Africans 2015',
      src: '',
      date: '24-11-2015',
      partner: 'New African Magazine'
    },
    {
      title: 'Numérique. Le Startup Palace booste l\'innovation à Nantes',
      src: 'http://www.entreprises.ouest-france.fr/article/numerique-startup-palace-booste-linnovation-nantes-24-11-2015-242309',
      date: '24-11-2015',
      partner: 'OUEST FRANCE'
    },
    {
      title: 'Afrostream’s ambition',
      src: 'http://media2.telecoms.com/e-books/DTVE/magazine/DTVE_MEAU_Dec15lo.pdf',
      date: '01-12-2015',
      partner: 'Digital TV Europe'
    },
    {
      title: '3 questions to Tonjé Bakang, CEO of Afrostream',
      src: 'http://pop.orange.com/en/a1131/tv-series-fan-bingewatching/3-questions-to-tonje-bakang-ceo-of-afrostream/',
      date: '09-12-2015',
      partner: 'Orange Pop'
    },
    {
      title: 'AFROSTREAM FOUNDER, TONJE BAKANG, TALKS ‘AFRO VIDEO-ON-DEMAND’ AND WHAT ACHIEVEMENT MEANS TO HIM',
      src: 'http://venturesafrica.com/138021/',
      date: '09-12-2015',
      partner: 'Ventures Africa'
    },
    {
      title: 'Afrostream, contenus exclusivement africains et afro-américain',
      src: 'http://www.servicesmobiles.fr/afrostream-contenus-exclusivement-africains-et-afro-americain-30090/',
      date: '09-12-2015',
      partner: 'ServicesMobiles'
    },
    {
      title: '3 questions à Tonjé Bakang, PDG d’Afrostream',
      src: 'http://www.popoutmag.com/fr/a1126/series-tv-fans-bingewatching/3-questions-a-tonje-bakang-pdg-dafrostream/',
      date: '09-12-2015',
      partner: 'Popout'
    },
    {
      title: 'Impressions d\'Afro',
      src: '',
      date: '11-12-2015',
      partner: 'Elle'
    },
    {
      title: 'Afrostream accélère son service de vidéo à la demande grâce aux transferts haute-vitesse d\'Aspera sur l\'IBM Cloud',
      src: 'http://www.zonebourse.com/actualite-bourse/Afrostream-accelere-son-service-de-video-a-la-demande-grace-aux-transferts-haute-vitesse-d-Aspera-su--21559153/',
      date: '15-12-2015',
      partner: 'Zone Bourse'
    },
    {
      title: 'Afrostream Boosts Video on Demand Service With High-Speed Transfers From Aspera on IBM Cloud',
      src: 'http://finance.yahoo.com/news/afrostream-boosts-video-demand-high-130000827.html',
      date: '15-12-2015',
      partner: 'Yahoo'
    },
    {
      title: 'Afrostream Boosts Video on Demand Service With High-Speed Transfers From Aspera on IBM Cloud',
      src: 'http://www.nasdaq.com/press-release/afrostream-boosts-video-on-demand-service-with-highspeed-transfers-from-aspera-on-ibm-cloud-20151215-00342',
      date: '15-12-2015',
      partner: 'Nasdaq'
    },
    {
      title: 'Afrostream Boosts Video on Demand Service With High-Speed Transfers From Aspera on IBM Cloud',
      src: 'http://asperasoft.com/company/news/view-news/afrostream-boosts-video-on-demand-service-with-high-speed-transfers-from-aspera-on-ibm-cloud/',
      date: '15-12-2015',
      partner: 'Aspera'
    },
    {
      title: 'Afrostream picks Aspera file transfer technology',
      src: 'http://www.telecompaper.com/news/afrostream-picks-aspera-file-transfer-technology--1119087',
      date: '16-12-2015',
      partner: 'Telecompaper'
    },
    {
      title: 'Afrostream taps Aspera for file transfers',
      src: 'http://www.digitaltveurope.net/474962/afrostream-taps-aspera-for-file-transfers/',
      date: '16-12-2015',
      partner: 'Digital TV Europe'
    },
    {
      title: 'Afrostream taps Aspera for cloud VOD platform',
      src: 'http://www.rapidtvnews.com/2015121641031/afrostream-taps-aspera-for-cloud-vod-platform.html',
      date: '16-12-2015',
      partner: 'Rapid tv news'
    },
    {
      title: 'Afrostream converts to Aspera on IBM Cloud',
      src: 'http://www.tvbeurope.com/afrostream-converts-to-aspera-on-ibm-cloud/',
      date: '17-12-2015',
      partner: 'TVB Europe'
    },
    {
      title: 'HERE ARE 20 AFRICANS THAT SHOULD INSPIRE YOUR 2016',
      src: 'http://thenerveafrica.com/2363/here-are-20-africans-that-should-inspire-your-2016/',
      date: '29-12-2015',
      partner: 'TheNerve Africa'
    },
    {
      title: 'Afrostream accélère son service de vidéo à la demande grâce aux transferts haute-vitesse d’Aspera sur l’IBM Cloud',
      src: 'http://www.mediakwest.com/broadcast/item/afrostream-accelere-son-service-de-video-a-la-demande-grace-aux-transferts-haute-vitesse-d-aspera-sur-l-ibm-cloud.html',
      date: '06-01-2016',
      partner: 'Mediakwest'
    },
    {
      title: 'Numérique Afrostream : le Netflix de la diaspora africaine s\'installe à Nantes',
      src: 'http://www.presseocean.fr/actualite/numerique-afrostream-le-netflix-de-la-diaspora-africaine-sinstalle-a-nantes-07-01-2016-180565',
      date: '07-01-2016',
      partner: 'Presse Ocean'
    },
    {
      title: 'IrokoTV , Netflix et Afrostream les plateformes de streaming légal',
      src: 'http://www.cotton-hairy-club.fr/2016/01/irokotv-netflix-afrostream-streaming-legal/',
      date: '16-01-2016',
      partner: 'Le Club des Cotonettes'
    },
    {
      title: 'Afrostream, plate-forme de vidéos à la demande spécialisée dans l\'afro',
      src: 'http://www.ouest-france.fr/pays-de-la-loire/nantes-44000/afrostream-plate-forme-de-videos-la-demande-specialisee-dans-lafro-3982372',
      date: '21-01-2016',
      partner: 'OUEST FRANCE'
    },
    {
      title: 'Lunch Show Du 21 Janvier 2016 Avec Tonje Bakang (AfroStream) ',
      src: 'http://www.mailmovement.com/MMRADIO/lunch-show-du-21-janvier-2016-avec-tonje-bakang-afrostream/',
      date: '21-01-2016',
      partner: 'Mail movement'
    },
    {
      title: 'C\'Midi de RTI 1 du 28 Janvier 2016 avec Caroline Dasylva partie 2 (MELIANE KUNY)',
      src: 'https://www.youtube.com/watch?v=iBgnwSl42GM',
      date: '28-01-2016',
      partner: 'RTI'
    },
    {
      title: 'Ludovic Bostral',
      src: 'http://www.euradionantes.eu/news/2016/2/2/ludovic-bostral',
      date: '02-02-2016',
      partner: 'Euradionantes.eu'
    },
    {
      title: 'TV interview, Guadeloupe 1Ere.',
      src: '',
      date: '21-02-2016',
      partner: 'Guadeloupe 1Ere'
    },
    {
      title: 'RADIO INTERVIEW',
      src: 'http://la1ere.francetvinfo.fr/guadeloupe/emissions/le-13h-en-direct-sur-internet',
      date: '21-02-2016',
      partner: 'Guadeloupe 1ère'
    },
    {
      title: 'RADIO INTERVIEW',
      src: '',
      date: '21-02-2016',
      partner: 'RADIO RCI-GUADELOUPE'
    },
    {
      title: 'Tv INTERVIEW',
      src: '',
      date: '21-02-2016',
      partner: 'Alizé TV'
    },
    {
      title: 'Les Héros du Web | Le Futur du Divertissement [Saison 3 - Episode 1]',
      src: 'https://www.youtube.com/watch?v=xQpzY0is_MM',
      date: '25-02-2016',
      partner: 'Les Héros du Web'
    },
    {
      title: 'Découvrez les coups de coeur de la rédaction parmi les startups françaises présentes au SXSW',
      src: 'https://www.maddyness.com/entrepreneurs/2016/03/18/sxsw-startups-francaises/',
      date: '18-03-2016',
      partner: 'Maddyness'
    },
    {
      title: 'Podcast Radio Interview (9. World Tour)',
      src: 'http://www.atelier.net/radio/2016/03/19/atelier-numerique-618_440810',
      date: '19-03-2016',
      partner: 'BFM Business'
    },
    {
      title: 'Tonje Bakang on Afrostream breaking into the American market',
      src: 'https://www.youtube.com/watch?v=E1fUMVWSiSo',
      date: '21-03-2016',
      partner: 'Comcast'
    },
    {
      title: 'Cloud opens black cinema to the globe',
      src: 'https://medium.com/@ibmcloud/cloud-opens-black-cinema-to-the-globe-105e362a5deb#.a1g8dy97f',
      date: '01-04-2016',
      partner: 'Medium'
    },
    {
      title: 'PowerFM Innovation Feature: AfroStream',
      src: 'https://soundcloud.com/powerfm987/innovation-afrostream-netflix-for-african-african-american-caribbean-content',
      date: '07-04-2016',
      partner: 'POWER FM'
    },
    {
      title: 'Afrostream à l’épreuve des abonnés et des financements',
      src: 'http://electronlibre.info/afrostream-a-lepreuve-abonnes-financements/',
      date: '12-04-2016',
      partner: 'Election Libre'
    },
    {
      title: '42 African Innovators to Watch',
      src: 'http://venturesafrica.com/innovators/#/tonje-bakang',
      date: '13-05-2016',
      partner: 'Ventures Africa'
    },
    {
      title: 'Forum Entreprendre dans la culture - Jour 1 (LUDOVIC BOSTRAL) ',
      src: 'https://gaite-lyrique.net/forum-entreprendre-dans-la-culture-jour-1',
      date: '13-05-2016',
      partner: 'Forum Entreprendre'
    },
    {
      title: 'Echo 2 - L’Afrique,c’est maintenant (en partenariat avec les Echos)',
      src: 'http://innogeneration.bpifrance.fr/Replay/Echo-2-L-Afrique.c-est-maintenant-en-partenariat-avec-les-Echos',
      date: '26-05-2016',
      partner: 'BPI France'
    },
    {
      title: 'Tonjé Bakang (Afrostream): « le salon Discop est incontournable sur l’audiovisuel en Afrique »',
      src: 'http://www.africa-salons.com/actualites/2016/06/02/tonje-bakang-afrostream-le-salon-discop-est-incontournable-sur-laudiovisuel-en-afrique/?platform=hootsuite',
      date: '02-06-2016',
      partner: 'Africa Salons'
    },
    {
      title: 'Tonjé Bakang (Afrostream Founder): “People don’t realize how much being an entrepreneur is tough”',
      src: 'http://www.leadersleague.com/en/news/tonje-bakang-afrostream-founder',
      date: '07-06-2016',
      partner: 'Leaders League'
    },
    {
      title: 'POUR TONJE BAKANG, ENTREPRENDRE C’EST « ÊTRE OPTIMISTE »',
      src: 'http://www.sinspirer.ci/interview-tonje-bakang-afrostream/',
      date: '08-06-2016',
      partner: 'Sinspirer'
    },
    {
      title: 'Afrostream pretende concorrer com o Netflix junto das comunidades africanas em todo o mundo',
      src: 'http://e-global.pt/noticia/vida/afrostream-pretende-concorrer-com-o-netflix-junto-das-comunidades-africanas-em-todo-o-mundo/',
      date: '23-06-2016',
      partner: 'E-GLOBAL'
    },
    {
      title: 'Interview - Télévision : où sont les jeunes ?',
      src: 'http://ecran-total.fr/interview-television-ou-sont-les-jeunes/',
      date: '28-06-2016',
      partner: 'Ecran Total'
    },
    {
      title: 'Le Netflix afro',
      src: 'http://teleobs.nouvelobs.com/actualites/20160621.OBS3101/le-netflix-afro.html',
      date: '29-06-2016',
      partner: 'Nouvelobs'
    },
    {
      title: 'De l\'Arbre à Palabres au streaming : la révolution culturelle Made in Africa',
      src: 'http://www.huffingtonpost.fr/tonje-bakang/de-larbre-a-palabres-au-s_b_10728864.html',
      date: '29-06-2016',
      partner: 'Huffington Post'
    },
    {
      title: 'VIVA Technology Session-The decline of mainstream media and the rise of digital niche media". ',
      src: '',
      date: '29-06-2016',
      partner: 'VIVA TECH'
    },
    {
      title: 'Session 24 - La culture est-elle une force de frappe économique ? #REAix2016',
      src: 'https://www.youtube.com/watch?v=x9BGezG2zsI',
      date: '03-07-2016',
      partner: 'Les Rencontres économiques d\'Aix-en-Provence'
    },
    {
      title: 'Entretenimiento, internet e identidad africana',
      src: 'http://elpais.com/elpais/2016/07/01/planeta_futuro/1467385305_958226.html',
      date: '04-07-2016',
      partner: 'Elpais'
    },
    {
      title: 'Le roi du Netflix africain vise cinq millions d’ abonnés',
      src: 'http://www.parismatch.com/Actu/Medias/Le-roi-du-Netflix-africain-vise-cinq-millions-d-abonnes-1012159',
      date: '05-07-2016',
      partner: 'Paris Match'
    },
    {
      title: 'The rise and fall (?) of African VoD startups',
      src: 'http://disrupt-africa.com/2016/07/the-rise-and-fall-of-african-vod-startups/',
      date: '07-07-2016',
      partner: 'Disrupt Africa'
    },
    {
      title: 'PITCH DEMO DAY 2015',
      src: '',
      date: '',
      partner: 'Y COMBINATOR'
    },
    {
      title: 'En direct sur tropic Fm à 21h',
      src: 'http://tropiquesfm.radio.fr',
      date: '',
      partner: 'TROPIC FM'
    },
    {
      title: 'Afrostream, la diversité en SVOD',
      src: 'http://www.respectmag.com/10824-afrostream-la-diversite-en-svod',
      date: '',
      partner: 'Respect Mag'
    },
  ]

  return Promise.each(press, function (item) {

    if (!item.src) {
      return item
    }

    const options = {
      screenSize: {
        width: 667
        , height: 375
      }
      ,
      shotSize: {
        width: 667
        , height: 375
      },
      defaultWhiteBackground: true,
      quality: 75,
      streamType: 'jpg',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
    }


    return new Promise(function (resolve, reject) {
      let pathName = path.join(staticPath, slugify(item.partner) + '.jpg')
      return webshot(item.src, pathName, options, (err)=> {
        if (err) {
          console.log('screenshot error', pathName)
          resolve(item)
        }
        console.log('screenshot now saved to', pathName)
        resolve(item)
      })
    })

    //return webshot(item.src, '../../../../static/press/screen/site/' + slugify(item.partner) + '.png', options)
    //  .then(()=> {
    //    console.log('screenshot now saved to', slugify(item.partner) + '.png')
    //  })
    // screenshot now saved to google.png
  }).then((data)=> {
    res.json({data: data})
  }).catch((err)=> {
    res.json({error: err.toString()})
  })
}
