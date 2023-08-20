export const formatDate = (date) => {
  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timezone: "UTC",
  };
  console.log(typeof date);
  return new Date(date).toLocaleString("ru", options);
};
