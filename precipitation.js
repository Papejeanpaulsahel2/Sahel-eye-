const NASA_FILE = "nasa_precipitation.json";

async function chargerPrecipitations() {
  const zone = document.getElementById("donnees-nasa");

  try {
    const response = await fetch(NASA_FILE + "?cache=" + Date.now());
    const data = await response.json();

    const param = data.properties.parameter.PRECTOTCORR;
    const dates = Object.keys(param);

    let date = null;
    let valeur = null;

    for (let i = dates.length - 1; i >= 0; i--) {
      if (param[dates[i]] !== -999.0) {
        date = dates[i];
        valeur = param[dates[i]];
        break;
      }
    }

    if (date === null) {
      zone.innerHTML =
        "🛰️ NASA – Précipitations<br>" +
        "Donnée indisponible";
      return;
    }

    zone.innerHTML =
      "🛰️ NASA – Précipitations<br>" +
      "Date : " + date + "<br>" +
      "Valeur : " + valeur + " mm";

  } catch (erreur) {
    zone.innerHTML = "❌ Erreur de chargement des données NASA";
    console.error(erreur);
  }
}

chargerPrecipitations();
