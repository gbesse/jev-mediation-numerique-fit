// Objectif : montrer qu’une décision incertaine est explicitement envoyée en revue humaine.
import assert from "node:assert/strict";
import { matchDigitalMediation } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "revue-1",
  "text": "La demande évoque plusieurs démarches bloquées et une forte appréhension, sans préciser les compétences déjà acquises.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-26"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "intensive_mediation", probabilities: {
  "autonomous_support": 0.16,
  "accompanied_help": 0.16,
  "intensive_mediation": 0.52,
  "out_of_scope": 0.16
}, confidence: 0.62 } }, usage: { input_tokens: 140, output_tokens: 0 } }));
const résultat = await matchDigitalMediation(dossier, provider);
assert.equal(résultat.decision, "intensive_mediation");
assert.equal(résultat.review, true);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · revue humaine : ${résultat.review} · confiance : ${résultat.confidence}`);
