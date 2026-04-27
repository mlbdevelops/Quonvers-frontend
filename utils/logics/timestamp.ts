export default function shouldShowTimestamp(current, previous) {
  if (!previous) return true;
  const currentTime = new Date(current.created_at);
  const prevTime = new Date(previous.created_at);
  const diff = currentTime - prevTime;
  const fiveMinutes = 5 * 60 * 1000;
  const differentDay = currentTime.toDateString() !== prevTime.toDateString();
  return diff > fiveMinutes || differentDay;
}