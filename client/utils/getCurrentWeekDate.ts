const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((currentDay + 6) % 7)); // Set to the first day (Monday) of the current week
  endOfWeek.setDate(today.getDate() + (6 - currentDay)); // Set to the last day (Sunday) of the current week

  const startDateString = `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()}`;
  const endDateString = `${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`;

  return `${startDateString}-${endDateString}`;
};

export default getCurrentWeekDates;
