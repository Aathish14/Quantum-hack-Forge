

const EmergencyMap = ({ location }) => {
  if (!location) return null;

  const mapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;

  return (
    <div>
      <h2>Emergency Location</h2>
      <iframe
        title="map"
        width="600"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapUrl}
      />
    </div>
  );
};

export default EmergencyMap;