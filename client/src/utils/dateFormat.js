export const formatDate = (date) => {
  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timezone: "UTC",
  };
  return new Date(date).toLocaleString("ru", options);
};
