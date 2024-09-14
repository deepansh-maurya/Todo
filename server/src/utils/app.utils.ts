export function createUniqueNumberGenerator() {
  const usedNumbers = new Set<number>();

  function generate(): number {
    if (usedNumbers.size >= 9000) {
      throw new Error("No more unique 4-digit numbers available.");
    }

    let uniqueNumber: number;

    do {
      uniqueNumber = Math.floor(Math.random() * 9000) + 1000; // Generates a number between 1000 and 9999
    } while (usedNumbers.has(uniqueNumber));

    usedNumbers.add(uniqueNumber);

    return uniqueNumber;
  }

  return {
    generate,
  };
}
