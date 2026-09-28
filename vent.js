const NASA_VENT = "nasa_vent.json";

async function chargerVent() {
  const zone = document.getElementById("donnees-vent");

  try {
    const response = await fetch(NASA_VENT + "?cache=" + Date.now());
    const data = await response.json();

    const param = data.properties.parameter.WS2M;
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
      "🌪️ NASA – Vent<br>" +
      "Date : " + (date || "indisponible") + "<br>" +
      "Vitesse : " + (date ? valeur + " m/s" : "Donnée indisponible");

  } catch (erreur) {
    zone.innerHTML = "❌ Erreur de chargement du vent NASA";
    console.error(erreur);
  }
}

chargerVent();
