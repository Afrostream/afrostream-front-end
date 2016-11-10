import React from 'react'
import { getI18n } from '../../../../config/i18n'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

class CountrySelect extends React.Component {

  constructor (props) {
    super(props);
    this.state = {value: getI18n().payment.country.defaultValue};
  }

  value () {
    return this.state.value
  }

  handleChange (event, index, value) {
    this.setState({value})
  }

  render () {

    return (
      <div className="col-md-6">
        <label className="form-label" htmlFor="country">{getI18n().payment.country.label}</label>
        <DropDownMenu className="card-country" ref="country" id="country" name="country" required
                      onChange={::this.handleChange}
                      autoWidth={false}
                      style={{width: '100%'}}
                      value={this.state.value}>
          <MenuItem value="AF" primaryText="Afghanistan"/>
          <MenuItem value="ZA" primaryText="Afrique du Sud"/>
          <MenuItem value="AL" primaryText="Albanie"/>
          <MenuItem value="DZ" primaryText="Algérie"/>
          <MenuItem value="DE" primaryText="Allemagne"/>
          <MenuItem value="AD" primaryText="Andorre"/>
          <MenuItem value="AO" primaryText="Angola"/>
          <MenuItem value="AI" primaryText="Anguilla"/>
          <MenuItem value="AG" primaryText="Antigua et Barbuda"/>
          <MenuItem value="AN" primaryText="Antilles néerlandaises"/>
          <MenuItem value="SA" primaryText="Arabie saoudite"/>
          <MenuItem value="AR" primaryText="Argentine"/>
          <MenuItem value="AM" primaryText="Arménie"/>
          <MenuItem value="AW" primaryText="Aruba"/>
          <MenuItem value="AU" primaryText="Australie"/>
          <MenuItem value="AT" primaryText="Autriche"/>
          <MenuItem value="AZ" primaryText="Azerbaïdjan"/>
          <MenuItem value="BS" primaryText="Bahamas"/>
          <MenuItem value="BH" primaryText="Bahreïn"/>
          <MenuItem value="BD" primaryText="Bangladesh"/>
          <MenuItem value="BB" primaryText="Barbade"/>
          <MenuItem value="BE" primaryText="Belgique"/>
          <MenuItem value="BM" primaryText="Bermudes"/>
          <MenuItem value="BT" primaryText="Bhoutan"/>
          <MenuItem value="BY" primaryText="Biélorussie"/>
          <MenuItem value="BO" primaryText="Bolivie"/>
          <MenuItem value="BA" primaryText="Bosnie et Herzégovine"/>
          <MenuItem value="BW" primaryText="Botswana"/>
          <MenuItem value="BN" primaryText="Brunei Darussalam"/>
          <MenuItem value="BR" primaryText="Brésil"/>
          <MenuItem value="BG" primaryText="Bulgarie"/>
          <MenuItem value="BF" primaryText="Burkina Faso"/>
          <MenuItem value="BI" primaryText="Burundi"/>
          <MenuItem value="BZ" primaryText="Bélize"/>
          <MenuItem value="BJ" primaryText="Bénin"/>
          <MenuItem value="KH" primaryText="Cambodge"/>
          <MenuItem value="CM" primaryText="Cameroun"/>
          <MenuItem value="CA" primaryText="Canada"/>
          <MenuItem value="CV" primaryText="Cap-Vert"/>
          <MenuItem value="CF" primaryText="Centrafrique"/>
          <MenuItem value="CL" primaryText="Chili"/>
          <MenuItem value="CN" primaryText="Chine"/>
          <MenuItem value="CY" primaryText="Chypre"/>
          <MenuItem value="CO" primaryText="Colombiae"/>
          <MenuItem value="KM" primaryText="Comores"/>
          <MenuItem value="CG" primaryText="Congo"/>
          <MenuItem value="KR" primaryText="Corée du Nord"/>
          <MenuItem value="KP" primaryText="Corée du Sud"/>
          <MenuItem value="CR" primaryText="Costa Rica"/>
          <MenuItem value="HR" primaryText="Croatie"/>
          <MenuItem value="CU" primaryText="Cuba"/>
          <MenuItem value="CI" primaryText="Côte d'Ivoire"/>
          <MenuItem value="DK" primaryText="Danemark"/>
          <MenuItem value="DJ" primaryText="Djibouti"/>
          <MenuItem value="DM" primaryText="Dominique"/>
          <MenuItem value="SV" primaryText="El Salvador"/>
          <MenuItem value="ES" primaryText="Espagne"/>
          <MenuItem value="EE" primaryText="Estonie"/>
          <MenuItem value="EG" primaryText="Égypte"/>
          <MenuItem value="AE" primaryText="Émirats arabes unis"/>
          <MenuItem value="EC" primaryText="Équateur"/>
          <MenuItem value="ER" primaryText="Érythrée"/>
          <MenuItem value="FM" primaryText="États fédérés de Micronésie"/>
          <MenuItem value="US" primaryText="États-Unis"/>
          <MenuItem value="ET" primaryText="Éthiopie"/>
          <MenuItem value="FJ" primaryText="Fidji"/>
          <MenuItem value="FI" primaryText="Finlande"/>
          <MenuItem value="FR" primaryText="France"/>
          <MenuItem value="GA" primaryText="Gabon"/>
          <MenuItem value="GM" primaryText="Gambie"/>
          <MenuItem value="GH" primaryText="Ghana"/>
          <MenuItem value="GI" primaryText="Gibraltar"/>
          <MenuItem value="GD" primaryText="Grenade"/>
          <MenuItem value="GL" primaryText="Groënland"/>
          <MenuItem value="GR" primaryText="Grèce"/>
          <MenuItem value="GP" primaryText="Guadeloupe"/>
          <MenuItem value="GU" primaryText="Guam"/>
          <MenuItem value="GT" primaryText="Guatemala"/>
          <MenuItem value="GN" primaryText="Guinée"/>
          <MenuItem value="GQ" primaryText="Guinée équatoriale"/>
          <MenuItem value="GW" primaryText="Guinée-Bissau"/>
          <MenuItem value="GY" primaryText="Guyane"/>
          <MenuItem value="GF" primaryText="Guyane française"/>
          <MenuItem value="GE" primaryText="Géorgie"/>
          <MenuItem value="HT" primaryText="Haïti"/>
          <MenuItem value="HN" primaryText="Honduras"/>
          <MenuItem value="HK" primaryText="Hong Kong"/>
          <MenuItem value="HU" primaryText="Hongrie"/>
          <MenuItem value="BV" primaryText="Ile Bouvet"/>
          <MenuItem value="CX" primaryText="Ile Christmas"/>
          <MenuItem value="HM" primaryText="Ile Heard et iles McDonald"/>
          <MenuItem value="MU" primaryText="Ile Maurice"/>
          <MenuItem value="NF" primaryText="Ile Norfolk"/>
          <MenuItem value="KY" primaryText="Iles Cayman"/>
          <MenuItem value="CC" primaryText="Iles Cocos (Keeling)"/>
          <MenuItem value="CK" primaryText="Iles Cook"/>
          <MenuItem value="FK" primaryText="Iles Falkland (Malouines)"/>
          <MenuItem value="FO" primaryText="Iles Faroe"/>
          <MenuItem value="MH" primaryText="Iles Marshall"/>
          <MenuItem value="MP" primaryText="Iles Northern Mariana"/>
          <MenuItem value="SB" primaryText="Iles Salomon"/>
          <MenuItem value="VG" primaryText="Iles Vierges, G.B."/>
          <MenuItem value="VI" primaryText="Iles Vierges, É.U."/>
          <MenuItem value="IN" primaryText="Inde"/>
          <MenuItem value="ID" primaryText="Indonésie"/>
          <MenuItem value="IQ" primaryText="Irak"/>
          <MenuItem value="IR" primaryText="Iran"/>
          <MenuItem value="IE" primaryText="Irlande"/>
          <MenuItem value="IS" primaryText="Islande"/>
          <MenuItem value="IL" primaryText="Israël"/>
          <MenuItem value="IT" primaryText="Italie"/>
          <MenuItem value="JM" primaryText="Jamaïque"/>
          <MenuItem value="JP" primaryText="Japon"/>
          <MenuItem value="JO" primaryText="Jordan"/>
          <MenuItem value="KZ" primaryText="Kazakhstan"/>
          <MenuItem value="KE" primaryText="Kenya"/>
          <MenuItem value="KG" primaryText="Kirghizstan"/>
          <MenuItem value="KI" primaryText="Kiribati"/>
          <MenuItem value="KW" primaryText="Koweït"/>
          <MenuItem value="LA" primaryText="Laos"/>
          <MenuItem value="LV" primaryText="Lettonie"/>
          <MenuItem value="LB" primaryText="Liban"/>
          <MenuItem value="LY" primaryText="Libye"/>
          <MenuItem value="LR" primaryText="Libéria"/>
          <MenuItem value="LI" primaryText="Liechtenstein"/>
          <MenuItem value="LT" primaryText="Lituanie"/>
          <MenuItem value="LU" primaryText="Luxembourg"/>
          <MenuItem value="LS" primaryText="Lésotho"/>
          <MenuItem value="MO" primaryText="Macao"/>
          <MenuItem value="MK" primaryText="Macédoine"/>
          <MenuItem value="MG" primaryText="Madagascar"/>
          <MenuItem value="MY" primaryText="Malaisie"/>
          <MenuItem value="MW" primaryText="Malawi"/>
          <MenuItem value="MV" primaryText="Maldives"/>
          <MenuItem value="ML" primaryText="Mali"/>
          <MenuItem value="MT" primaryText="Malte"/>
          <MenuItem value="MA" primaryText="Maroc"/>
          <MenuItem value="MQ" primaryText="Martinique"/>
          <MenuItem value="MR" primaryText="Mauritanie"/>
          <MenuItem value="YT" primaryText="Mayotte"/>
          <MenuItem value="MX" primaryText="Mexique"/>
          <MenuItem value="MD" primaryText="Moldavie"/>
          <MenuItem value="MC" primaryText="Monaco"/>
          <MenuItem value="MN" primaryText="Mongolie"/>
          <MenuItem value="MS" primaryText="Montserrat"/>
          <MenuItem value="MZ" primaryText="Mozambique"/>
          <MenuItem value="MM" primaryText="Myanmar (Birmanie)"/>
          <MenuItem value="NA" primaryText="Namibie"/>
          <MenuItem value="NR" primaryText="Nauru"/>
          <MenuItem value="NI" primaryText="Nicaragua"/>
          <MenuItem value="NE" primaryText="Niger"/>
          <MenuItem value="NG" primaryText="Nigéria"/>
          <MenuItem value="NU" primaryText="Niue"/>
          <MenuItem value="NO" primaryText="Norvège"/>
          <MenuItem value="NC" primaryText="Nouvelle Calédonie"/>
          <MenuItem value="NZ" primaryText="Nouvelle-Zélande"/>
          <MenuItem value="NP" primaryText="Népal"/>
          <MenuItem value="OM" primaryText="Oman"/>
          <MenuItem value="UG" primaryText="Ouganda"/>
          <MenuItem value="UZ" primaryText="Ouzbékistan"/>
          <MenuItem value="PK" primaryText="Pakistan"/>
          <MenuItem value="PW" primaryText="Palau"/>
          <MenuItem value="PS" primaryText="Palestine"/>
          <MenuItem value="PA" primaryText="Panama"/>
          <MenuItem value="PG" primaryText="Papouasie Nouvelle Guinée"/>
          <MenuItem value="PY" primaryText="Paraguay"/>
          <MenuItem value="NL" primaryText="Pays-Bas"/>
          <MenuItem value="PH" primaryText="Philippines"/>
          <MenuItem value="PN" primaryText="Pitcairn"/>
          <MenuItem value="PL" primaryText="Pologne"/>
          <MenuItem value="PF" primaryText="Polynésie française"/>
          <MenuItem value="PT" primaryText="Portugal"/>
          <MenuItem value="PR" primaryText="Puerto Rico"/>
          <MenuItem value="PE" primaryText="Pérou"/>
          <MenuItem value="QA" primaryText="Qatar"/>
          <MenuItem value="RO" primaryText="Roumanie"/>
          <MenuItem value="GB" primaryText="Royaume-Uni"/>
          <MenuItem value="RU" primaryText="Russie"/>
          <MenuItem value="RW" primaryText="Rwanda"/>
          <MenuItem value="CD" primaryText="République Démocratique du Congo"/>
          <MenuItem value="DO" primaryText="République dominicaine"/>
          <MenuItem value="CZ" primaryText="République tchèque"/>
          <MenuItem value="RE" primaryText="Réunion, île de la"/>
          <MenuItem value="EH" primaryText="Sahara Ouest"/>
          <MenuItem value="KN" primaryText="Saint-Kitts et Nevis"/>
          <MenuItem value="PM" primaryText="Saint-Pierre et Miquelon"/>
          <MenuItem value="VC" primaryText="Saint-Vincent et Les Grenadines"/>
          <MenuItem value="SH" primaryText="Sainte-Hélène"/>
          <MenuItem value="LC" primaryText="Sainte-Lucie"/>
          <MenuItem value="WS" primaryText="Samoa"/>
          <MenuItem value="AS" primaryText="Samoa américaine"/>
          <MenuItem value="SM" primaryText="San Marino"/>
          <MenuItem value="ST" primaryText="San Tomé et Principe"/>
          <MenuItem value="SC" primaryText="Seychelles"/>
          <MenuItem value="SL" primaryText="Sierra Leone"/>
          <MenuItem value="SG" primaryText="Singapour"/>
          <MenuItem value="SK" primaryText="Slovaquie"/>
          <MenuItem value="SI" primaryText="Slovénie"/>
          <MenuItem value="SO" primaryText="Somalie"/>
          <MenuItem value="SD" primaryText="Soudan"/>
          <MenuItem value="LK" primaryText="Sri Lanka"/>
          <MenuItem value="GS" primaryText="St-George et les iles Sandwich"/>
          <MenuItem value="CH" primaryText="Suisse"/>
          <MenuItem value="SR" primaryText="Surinam"/>
          <MenuItem value="SE" primaryText="Suède"/>
          <MenuItem value="SJ" primaryText="Svalbard et Jan Mayen"/>
          <MenuItem value="SZ" primaryText="Swaziland"/>
          <MenuItem value="SY" primaryText="Syrie"/>
          <MenuItem value="SN" primaryText="Sénégal"/>
          <MenuItem value="TJ" primaryText="Tadjikistan"/>
          <MenuItem value="TZ" primaryText="Tanzanie"/>
          <MenuItem value="TW" primaryText="Taïwan"/>
          <MenuItem value="TD" primaryText="Tchad"/>
          <MenuItem value="IO" primaryText="Territoire britannique de l'Océan Indien"/>
          <MenuItem value="TF" primaryText="Territoires français du Sud"/>
          <MenuItem value="TH" primaryText="Thaïlande"/>
          <MenuItem value="TP" primaryText="Timor Est"/>
          <MenuItem value="TG" primaryText="Togo"/>
          <MenuItem value="TK" primaryText="Tokelau"/>
          <MenuItem value="TO" primaryText="Tonga"/>
          <MenuItem value="TT" primaryText="Trinidad et Tobago"/>
          <MenuItem value="TN" primaryText="Tunisie"/>
          <MenuItem value="TM" primaryText="Turkmenistan"/>
          <MenuItem value="TC" primaryText="Turks et iles Caicos"/>
          <MenuItem value="TR" primaryText="Turquie"/>
          <MenuItem value="TV" primaryText="Tuvalu"/>
          <MenuItem value="UA" primaryText="Ukraine"/>
          <MenuItem value="UM" primaryText="United States Minor Outlying Islands"/>
          <MenuItem value="UY" primaryText="Uruguay"/>
          <MenuItem value="VU" primaryText="Vanuatu"/>
          <MenuItem value="VA" primaryText="Vatican, cité du"/>
          <MenuItem value="VN" primaryText="Vietnam"/>
          <MenuItem value="VE" primaryText="Vénézuela"/>
          <MenuItem value="WF" primaryText="Wallis et Futuna"/>
          <MenuItem value="YU" primaryText="Yougoslavie"/>
          <MenuItem value="YE" primaryText="Yémen"/>
          <MenuItem value="ZM" primaryText="Zambie"/>
          <MenuItem value="ZW" primaryText="Zimbabwé"/>
        </DropDownMenu>
      </div>
    )
  }
}


export default CountrySelect
