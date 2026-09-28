const NASA_TEMPERATURE = "nasa_temperature.json?cache=" + Date.now();

async function chargerTemperature() {
  const zone = document.getElementById("donnees-temperature");

  try {
    const response = await fetch(NASA_TEMPERATURE);
    const data = await response.json();

    const param = data.properties.parameter.T2M;
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

    zone.innerHTML =
      "🌡️ NASA – Température<br>" +
      "Date : " + (date || "indisponible") + "<br>" +
      "Valeur : " + (date ? valeur + " °C" : "Donnée indisponible");

  } catch (erreur) {
    zone.innerHTML = "❌ Erreur de chargement de la température NASA";
    console.error(erreur);
  }
}

chargerTemperature();
