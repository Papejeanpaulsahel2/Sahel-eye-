async function chargerIncendies() {
  const zone = document.getElementById("donnees-incendies");

  try {
    const response = await fetch("firms_data.csv");
    const texte = await response.text();

    const lignes = texte.trim().split("\n");

    // Aucune détection de feu
    if (lignes.length <= 1) {
      zone.innerHTML =
        "🔥 NASA FIRMS – Incendies<br><br>" +
        "🟢 Aucun feu détecté dans la zone surveillée.<br>" +
        "La situation est actuellement normale.";
      return;
    }

    // Une ou plusieurs détections
    const nombreFeux = lignes.length - 1;

    zone.innerHTML =
      "🔥 NASA FIRMS – Incendies<br><br>" +
      "⚠️ " + nombreFeux + " détection(s) de feu trouvée(s).<br>" +
      "Une surveillance plus attentive de la zone est recommandée.";

  } catch (erreur) {
    zone.innerHTML =
      "🔥 NASA FIRMS – Incendies<br><br>" +
      "ℹ️ Les données d’incendies sont momentanément indisponibles.<br>" +
      "SAHEL EYE pourra réessayer plus tard.";

    console.error("Erreur lors du chargement des données FIRMS :", erreur);
  }
}

chargerIncendies();
