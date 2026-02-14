export function getRandomLetter() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

