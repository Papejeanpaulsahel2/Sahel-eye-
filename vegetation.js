const NASA_VEGETATION = "nasa_vegetation.json";

async function chargerVegetation() {
  const zone = document.getElementById("donnees-vegetation");

  try {
    const response = await fetch(NASA_VEGETATION + "?cache=" + Date.now());
    const data = await response.json();

    const param = data.properties.parameter.GWETROOT;
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
      "💧 NASA – Humidité zone racinaire<br>" +
      "Date : " + (date || "indisponible") + "<br>" +
      "Valeur : " + (date ? valeur : "Donnée indisponible");

  } catch (erreur) {
    zone.innerHTML = "❌ Erreur de chargement de l’humidité zone racinaire NASA";
    console.error(erreur);
  }
}

chargerVegetation();
