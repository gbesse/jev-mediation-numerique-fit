// Objectif : vérifier que les types publics sont importables.
import { digitalCase, matchDigitalMediation } from "../src/index.mjs";
const dossier = digitalCase({
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
});
void matchDigitalMediation(dossier, { decide: async () => ({}) });
