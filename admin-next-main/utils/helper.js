export const idrNumber = (num) => {
  return Number(num).toLocaleString("id-ID");
};

export const randId = () => {
  return Math.random().toString(32).substring(2,9);
}