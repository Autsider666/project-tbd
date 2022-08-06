export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

export const normalise = (value, MIN, MAX) => ((value - MIN) * 100) / (MAX - MIN);