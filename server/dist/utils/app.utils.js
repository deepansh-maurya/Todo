"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUniqueNumberGenerator = createUniqueNumberGenerator;
function createUniqueNumberGenerator() {
    const usedNumbers = new Set();
    function generate() {
        if (usedNumbers.size >= 9000) {
            throw new Error("No more unique 4-digit numbers available.");
        }
        let uniqueNumber;
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
