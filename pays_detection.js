fetch("sahel_pays.geojson")
  .then(response => response.json())
  .then(paysGeoJSON => {
    fetch("firms_data.csv")
      .then(response => response.text())
      .then(texte => {
        const lignes = texte.trim().split("\n").slice(1);

        lignes.forEach(ligne => {
          if (!ligne.trim()) return;

          const v = ligne.split(",");
          const lat = parseFloat(v[0]);
          const lon = parseFloat(v[1]);

          const point = turf.point([lon, lat]);

          let paysTrouve = "Inconnu";

          paysGeoJSON.features.forEach(pays => {
            if (turf.booleanPointInPolygon(point, pays)) {
              paysTrouve = pays.properties.name;
            }
          });

          console.log("🔥 FIRMS :", lat, lon, "→", paysTrouve);
        });
      });
  })
  .catch(erreur => console.error("Erreur localisation :", erreur));
