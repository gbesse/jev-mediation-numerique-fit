// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { matchDigitalMediation } from "../src/index.mjs";
const client = createJevClient();
const résultat = await matchDigitalMediation({
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
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
