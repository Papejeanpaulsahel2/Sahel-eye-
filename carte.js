const carte = L.map("carte-sahel").setView([16, -1], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(carte);

const pays = [
  ["🇲🇷 Mauritanie", 20.5, -10.9],
  ["🇲🇱 Mali", 17.0, -3.5],
  ["🇳🇪 Niger", 17.5, 9.5],
  ["🇧🇫 Burkina Faso", 12.3, -1.6],
  ["🇹🇩 Tchad", 15.0, 18.7]
];

pays.forEach(([nom, lat, lon]) => {
  L.marker([lat, lon], {title: "🔥 Détection NASA FIRMS"})
    .addTo(carte)
    .bindPopup("<b>" + nom + "</b><br>Zone surveillée par SAHEL EYE");
});

fetch("sahel_pays.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "#333",
        weight: 2,
        fillOpacity: 0.08
      },
      onEachFeature: (feature, layer) => {
        const nom = feature.properties.name;
        layer.bindPopup("<b>" + nom + "</b><br>Zone surveillée par SAHEL EYE");
      }
    }).addTo(carte);
  })
  .catch(erreur => console.error("Erreur frontières :", erreur));

fetch("firms_data.csv")
  .then(response => response.text())
  .then(texte => {
    const lignes = texte.trim().split("\n");
    const entetes = lignes[0].split(",");

    lignes.slice(1).forEach(ligne => {
      if (!ligne.trim()) return;

      const valeurs = ligne.split(",");
      const lat = parseFloat(valeurs[0]);
      const lon = parseFloat(valeurs[1]);
      const frp = valeurs[12];
      const date = valeurs[5];
      const heure = valeurs[6];

      if (!isNaN(lat) && !isNaN(lon)) {
        L.marker([lat, lon], {title: "🔥 Détection NASA FIRMS"})
          .addTo(carte)
          .bindPopup(
            "<b>🔥 Détection NASA FIRMS</b><br>" +
            "📍 Latitude : " + lat + "<br>" +
            "📍 Longitude : " + lon + "<br>" +
            "📅 Date : " + date + "<br>" +
            "🕐 Heure : " + heure + "<br>" +
            "🔥 FRP : " + frp
          );
      }
    });
  })
  .catch(erreur => console.error("Erreur FIRMS :", erreur));
