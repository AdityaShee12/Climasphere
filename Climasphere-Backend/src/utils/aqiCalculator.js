export const getAQILabel = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
};

export const calculateAQIFromComponents = (components) => {
  const pm25 = components.pm2_5 || 0;
  const pm10 = components.pm10 || 0;
  const no2 = components.no2 || 0;
  const so2 = components.so2 || 0;
  const o3 = components.o3 || 0;
  const nh3 = components.nh3 || 0;

  const aqi = Math.round(
    Math.max(
      pm25 * 2,
      pm10 * 0.8,
      no2 * 1.2,
      so2 * 0.8,
      o3 * 0.6,
      nh3 * 0.5
    )
  );

  const finalAQI = Math.min(aqi, 500);

  return {
    aqi: finalAQI,
    label: getAQILabel(finalAQI),
  };
};