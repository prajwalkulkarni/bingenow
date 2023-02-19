export const getHumanizedTimeFromMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours == 0 ? `${mins}m` : mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
};