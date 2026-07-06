// Lanceur de preview : se place dans le dossier du projet avant de démarrer
// Next.js (sinon Tailwind ne trouve pas ses sources). Usage interne uniquement.
process.chdir(__dirname);
const port = process.env.PORT || "3000";
const nextBin = require.resolve("next/dist/bin/next");
process.argv = [process.argv[0], nextBin, "dev", "-p", String(port)];
require(nextBin);
