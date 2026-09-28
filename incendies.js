async function chargerIncendies() {
  const zone = document.getElementById("donnees-incendies");

  try {
    const response = await fetch("nasa_fires.csv");
    const texte = await response.text();

    const lignes = texte.trim().split("\n");

    if (lignes.length <= 1) {
      zone.innerHTML =
        "🔥 NASA FIRMS – Incendies<br>" +
        "Aucun feu détecté dans la zone de surveillance.";
      return;
    }

    zone.innerHTML =
      "🔥 NASA FIRMS – Incendies<br>" +
      "Détections : " + (lignes.length - 1);
  } catch (erreur) {
    zone.innerHTML =
      "❌ Erreur de chargement des données NASA FIRMS";
    console.error(erreur);
  }
}

chargerIncendies();
