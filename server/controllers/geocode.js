const getLatLonForPlace = async (req, res) => {
  const { place } = req.body;
  const geocodeUrl = `https://maps.google.com/maps/api/geocode/json?address=${place}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const geoCodeResponse = await axios.get(geocodeUrl);
    const geocodeData = geoCodeResponse.data;
    console.log(geocodeData);

    if (geocodeData.results.length > 0) {
      const { lat, lng } = geocodeData.results[0].geometry.location;
      res.json({ lat, lng });
    } else {
      res.status(404).json({ error: "Location not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getLatLonForPlace,
};
