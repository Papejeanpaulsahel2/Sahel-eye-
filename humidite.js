const NASA_HUMIDITE = "nasa_humidite.json";

async function chargerHumidite() {
  const zone = document.getElementById("donnees-humidite");

  try {
    const response = await fetch(NASA_HUMIDITE + "?cache=" + Date.now());
    const data = await response.json();

    const param = data.properties.parameter.GWETTOP;
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
      "🌱 NASA – Humidité du sol<br>" +
      "Date : " + (date || "indisponible") + "<br>" +
      "Indice : " + (date ? valeur : "Donnée indisponible");

  } catch (erreur) {
    zone.innerHTML = "❌ Erreur de chargement de l'humidité NASA";
    console.error(erreur);
  }
}

chargerHumidite();

