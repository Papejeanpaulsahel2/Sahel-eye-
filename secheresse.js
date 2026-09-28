const PRECIPITATION_FILE = "nasa_precipitation.json";
const TEMPERATURE_FILE = "nasa_temperature.json";
const HUMIDITE_FILE = "nasa_humidite.json";
const VEGETATION_FILE = "nasa_vegetation.json";

async function lireJSON(fichier) {
  const response = await fetch(fichier);
  if (!response.ok) {
    throw new Error("Erreur : " + fichier);
  }
  return await response.json();
}

async function analyserSecheresse() {
  try {
    const [p, t, h, v] = await Promise.all([
      lireJSON(PRECIPITATION_FILE),
      lireJSON(TEMPERATURE_FILE),
      lireJSON(HUMIDITE_FILE),
      lireJSON(VEGETATION_FILE)
    ]);

    const pluie = p.properties.parameter.PRECTOTCORR;
    const temperature = t.properties.parameter.T2M;
    const sol = h.properties.parameter.GWETTOP;
    const racines = v.properties.parameter.GWETROOT;

    const dates = Object.keys(pluie)
      .filter(date => pluie[date] !== -999);

    const date = dates[dates.length - 1];

    const pluieJour = pluie[date];
    const temperatureJour = temperature[date];
    const solJour = sol[date];
    const racinesJour = racines[date];

    let niveau = "🟢 Situation normale";

    if (
      pluieJour < 2 &&
      temperatureJour > 30 &&
      solJour < 0.3 &&
      racinesJour < 0.3
    ) {
      niveau = "🔴 Risque élevé de sécheresse";
    } else if (
      pluieJour < 5 &&
      solJour < 0.5
    ) {
      niveau = "🟠 Risque de sécheresse";
    }

    document.getElementById("secheresse-resultat").innerHTML =
      "<strong>" + niveau + "</strong><br>" +
      "Date : " + date + "<br>" +
      "Précipitations : " + pluieJour + "<br>" +
      "Température : " + temperatureJour + " °C<br>" +
      "Humidité du sol : " + solJour + "<br>" +
      "Humidité racinaire : " + racinesJour;

  } catch (erreur) {
    document.getElementById("secheresse-resultat").innerHTML = "❌ " + erreur.message;
    console.error(erreur);
  }
}

analyserSecheresse();
