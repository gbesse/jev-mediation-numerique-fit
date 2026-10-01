// Objectif : vérifier la normalisation, la règle déterministe et les décisions sémantiques.
import test from "node:test";
import assert from "node:assert/strict";
import { digitalCase, matchDigitalMediation } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const casLimite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-27"
  },
  "alreadyResolved": true
};
const casPrincipal = {
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
const casÀRevoir = {
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
test("exige une source", () => assert.throws(() => digitalCase({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => {
  const provider = createFakeProvider(() => { throw new Error("appel interdit"); });
  assert.equal((await matchDigitalMediation(casLimite, provider)).decision, "out_of_scope");
  assert.equal(provider.calls, 0);
});
test("classe un dossier sourcé avec une confiance suffisante", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "accompanied_help", probabilities: {
  "autonomous_support": 0.06,
  "accompanied_help": 0.82,
  "intensive_mediation": 0.06,
  "out_of_scope": 0.06
}, confidence: 0.82 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await matchDigitalMediation(casPrincipal, provider);
  assert.equal(résultat.decision, "accompanied_help");
  assert.equal(résultat.review, false);
  assert.equal(provider.calls, 1);
});
test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "intensive_mediation", probabilities: {
  "autonomous_support": 0.16,
  "accompanied_help": 0.16,
  "intensive_mediation": 0.52,
  "out_of_scope": 0.16
}, confidence: 0.62 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await matchDigitalMediation(casÀRevoir, provider);
  assert.equal(résultat.decision, "intensive_mediation");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
