export function firstTwoLetters(str: string): string {
  if (!str) return "";
  return str.slice(0, 2).toUpperCase();
}

export function createNameFromEmail(email: string): string {
  if (!email) return "";
  const [namePart] = email.split("@");
  const formattedName = namePart
    .replace(/[._-]/g, " ") // Replace dots, underscores, and hyphens with a space
    .split(" ") // Split the name by spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join the words back with spaces
  return formattedName;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
