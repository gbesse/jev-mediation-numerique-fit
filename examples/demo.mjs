// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { matchDigitalMediation } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "exemple-1",
  "text": "La personne sait utiliser un navigateur mais souhaite être accompagnée pour créer un compte et joindre un justificatif.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-09-25"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "accompanied_help", probabilities: {
  "autonomous_support": 0.06,
  "accompanied_help": 0.82,
  "intensive_mediation": 0.06,
  "out_of_scope": 0.06
}, confidence: 0.82 } }, usage: { input_tokens: 120, output_tokens: 0 } }));
const résultat = await matchDigitalMediation(dossier, provider);
assert.equal(résultat.decision, "accompanied_help");
assert.equal(résultat.review, false);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
