export function calculateDistance({lat, lng, bizLat, bizLng}) {
  return (
    (
      (
        Math.acos(
          Math.sin((lat * Math.PI / 180))
          *
          Math.sin((bizLat * Math.PI / 180)) + Math.cos((lat * Math.PI / 180))
          *
          Math.cos((bizLat * Math.PI / 180)) * Math.cos(((lng - bizLng) * Math.PI / 180)))
      ) * 180 / Math.PI
    ) * 60 * 1.1515 * 1.609344
  );
}