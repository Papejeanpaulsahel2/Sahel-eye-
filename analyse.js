console.log("✅ analyse.js chargé");
const PRECIPITATION_FILE = "nasa_precipitation.json";
const SOIL_FILE = "nasa_humidite.json";
const TEMPERATURE_FILE = "nasa_temperature.json";
const VEGETATION_FILE = "nasa_vegetation.json";
const VENT_FILE = "nasa_vent.json";
const INCENDIES_FILE = "firms_data.csv";

async function analyserRisques() {
  const zone = document.getElementById("analyse-risque");
  zone.innerHTML = "⏳ Analyse en cours...";
  console.log("🟢 analyserRisques démarre");

  try {
    const [
      precipResponse,
      soilResponse,
      vegetationResponse,
      ventResponse,
        temperatureResponse,
      incendiesResponse
    ] = await Promise.all([
      fetch(PRECIPITATION_FILE, {cache: "no-store"}),
      fetch(SOIL_FILE, {cache: "no-store"}),
      fetch(VEGETATION_FILE, {cache: "no-store"}),
      fetch(VENT_FILE, {cache: "no-store"}),
      fetch(TEMPERATURE_FILE, {cache: "no-store"}),
      fetch(INCENDIES_FILE, {cache: "no-store"})
    ]);

    const precipData = await precipResponse.json();
    const soilData = await soilResponse.json();
    const vegetationData = await vegetationResponse.json();
    const temperatureData = await temperatureResponse.json();
    const ventData = await ventResponse.json();
    const incendiesTexte = await incendiesResponse.text();

    const precipitations =
      precipData.properties.parameter.PRECTOTCORR;
    const humiditeSol =
      soilData.properties.parameter.GWETTOP;
    const vegetation =
      vegetationData.properties.parameter.GWETROOT;
    const temperature = temperatureData.properties.parameter.T2M;
    const vent =
      ventData.properties.parameter.WS2M;

    // Recherche de la dernière donnée disponible
    const trouverDerniereValeur = donnees => {
      const dates = Object.keys(donnees);

      for (let i = dates.length - 1; i >= 0; i--) {
        if (donnees[dates[i]] !== -999.0) {
          return donnees[dates[i]];
        }
      }

      return null;
    };

    const pluie = trouverDerniereValeur(precipitations);
    const temperatureActuelle = trouverDerniereValeur(temperature);
    const humidite = trouverDerniereValeur(humiditeSol);
    const humiditeRacinaireActuelle = trouverDerniereValeur(vegetation);
    const ventActuel = trouverDerniereValeur(vent);

    // Lecture des détections NASA FIRMS
    const lignes = incendiesTexte
      .trim()
      .split("\n")
      .filter(ligne => ligne.trim() !== "");

    const nombreDeFeux = Math.max(0, lignes.length - 1);

    const feuDetecte = nombreDeFeux > 0;

    // Règles simples de surveillance du prototype
    const risqueInondation =
      pluie !== null && pluie > 20;
    const risqueSecheresse =
      humiditeRacinaireActuelle !== null &&
      humidite !== null &&
      humiditeRacinaireActuelle < 0.30 &&
      humidite < 0.35;

    const risqueVent = ventActuel !== null && ventActuel > 10;
    const solSec = humidite !== null && humidite < 0.30;
    const racinesSeches = humiditeRacinaireActuelle !== null && humiditeRacinaireActuelle < 0.30;
    const pluieFaible = pluie !== null && pluie < 5;
    const scoreSecheresse = [solSec, racinesSeches, pluieFaible].filter(Boolean).length;
    const tendanceSecheresse = pluie !== null && humidite !== null && temperatureActuelle !== null && pluie < 5 && humidite < 0.45 && temperatureActuelle >= 30 ? "🟠 Tendance sécheresse en hausse" : "🟢 Tendance sécheresse stable";
    const lectureCroisement = scoreSecheresse === 3 ? "🌱 Croisement intelligent : pluie faible, sol sec et zone racinaire sèche convergent vers un risque élevé de sécheresse." : scoreSecheresse === 2 ? "🌱 Croisement intelligent : plusieurs indicateurs de sécheresse convergent. La situation mérite une surveillance renforcée." : "🌱 Croisement intelligent : les indicateurs de sécheresse ne convergent pas encore fortement."; 
    const lectureSecheresseVent = pluieFaible && ventActuel !== null && ventActuel > 10 ? "🌪️ Croisement sécheresse + vent : les faibles précipitations combinées à un vent élevé peuvent accentuer l’assèchement des sols." : "";
    const lecturePluieSol = pluieFaible && humidite !== null && humidite < 0.50 ? "💧 Croisement pluie + sol : les faibles précipitations associées à une humidité du sol réduite indiquent un assèchement à surveiller." : "";
const risques = [];

let situation = "🟢 Situation normale";
let message =
  "Les données actuellement disponibles ne signalent pas de risque important.";

if (feuDetecte) {
  risques.push("🔥 Incendie");
  situation = "🔴 Détection de feu";
  message =
    "NASA FIRMS signale " +
    nombreDeFeux +
    " détection(s) de feu dans la zone surveillée. " +
    "Une vérification sur le terrain peut être nécessaire.";
}

if (risqueInondation) {
  risques.push("🌧️ Inondation");
  situation = "🟠 Vigilance pluie";
  message =
    "Les précipitations sont importantes. " +
    "Certaines zones peuvent être plus exposées aux inondations.";
}

if (risqueSecheresse) {
  risques.push("🟡 Sécheresse");
  situation = "🟡 Vigilance sécheresse";
  message =
    "La végétation et l'humidité du sol sont faibles. " +
    "La zone mérite une surveillance renforcée.";
}

if (risqueVent) {
  risques.push("🌪️ Vent");
  situation = "🟠 Vigilance vent";
  message =
    "Le vent est actuellement élevé. " +
    "Une surveillance des conditions météorologiques est recommandée.";
}

let niveauGlobal = "🟢 Normal";
if (risques.includes("🔥 Incendie")) niveauGlobal = "🔴 Critique";
else if (risques.length >= 2) niveauGlobal = "🟠 Vigilance renforcée";
else if (risques.length === 1) niveauGlobal = "🟡 Vigilance";
    const texteSecheresse = "🌱 Score sécheresse : " + scoreSecheresse + "/3<br>" + (scoreSecheresse === 3 ? "🔴 Risque élevé" : scoreSecheresse === 2 ? "🟠 Vigilance" : scoreSecheresse === 1 ? "🟢 Surveillance" : "🟢 Normal");
    const zoneSecheresse = document.getElementById("secheresse-resultat");
const listeRisques =
  risques.length > 0
    ? risques.join(", ")
    : "Aucun risque détecté";
    zone.innerHTML =
      "🤖 Analyse SAHEL EYE<br><br>" +
      "⚠️ Risques détectés : " + listeRisques + "<br><br>" +
      texteSecheresse + "<br>" + lectureCroisement + (lectureSecheresseVent ? "<br>" + lectureSecheresseVent : "") + (lecturePluieSol ? "<br>" + lecturePluieSol : "") + "<br>" +
      message + "<br><br>" +
      "🔥 Feux détectés par NASA FIRMS : " + nombreDeFeux + "<br>" +
      "🌧️ Précipitations : " +
      (pluie ?? "indisponibles") + " mm<br>" +
      "🌱 Humidité du sol : " +
      (humidite ?? "indisponible") + "<br>" +
      "🌿 État de la végétation : " +
      (humiditeRacinaireActuelle ?? "indisponible") + "<br>" +
      "🌪️ Vitesse du vent : " +
      (ventActuel ?? "indisponible") + " m/s";
    if (zoneSecheresse) zoneSecheresse.innerHTML = texteSecheresse + "<br>" + lectureCroisement + "<br>" + tendanceSecheresse;

  } catch (erreur) {
    if (zoneSecheresse) zoneSecheresse.innerHTML = texteSecheresse + "<br>" + lectureCroisement;
    zone.innerHTML =
      "❌ ERREUR : " + erreur.message + "<br><br>" +
      "Certaines données environnementales ou NASA FIRMS " +
      "sont actuellement indisponibles.";

    console.error("Erreur pendant l’analyse SAHEL EYE :", erreur);
  }
}

window.analyserRisques = analyserRisques;
