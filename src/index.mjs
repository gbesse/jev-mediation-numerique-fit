// Objectif : implémenter la frontière de décision métier propre au dépôt.
import { readFile } from "node:fs/promises";
export const DECISIONS = Object.freeze({
  "autonomous_support": "appui_ponctuel",
  "accompanied_help": "accompagnement",
  "intensive_mediation": "médiation_renforcée",
  "out_of_scope": "hors_périmètre"
});
const CRITERIA = Object.freeze({
  "autonomous_support": "appui ponctuel",
  "accompanied_help": "accompagnement",
  "intensive_mediation": "médiation renforcée",
  "out_of_scope": "hors périmètre"
});
export function digitalCase(input) {
  if (!input?.id || !input?.text || !input?.source?.url || !input?.source?.date) throw new TypeError("Le dossier exige id, text, source.url et source.date");
  const date = new Date(input.source.date);
  if (Number.isNaN(date.valueOf())) throw new TypeError("source.date doit être une date ISO valide");
  return { ...input, id: String(input.id), text: String(input.text).trim(), source: { url: String(input.source.url), date: date.toISOString() } };
}
export async function matchDigitalMediation(input, provider) {
  const record = digitalCase(input);
  if (record.alreadyResolved === true) return { decision: "out_of_scope", label: DECISIONS["out_of_scope"], probability: 1, review: false, deterministic: true };
  const response = await provider.decide({
    state: record,
    questions: { decision: { type: "choice", instructions: "Analysez ce besoin de médiation numérique à partir des seuls éléments sourcés. Choisissez la catégorie la plus prudente. N’inventez ni fait, ni droit applicable, ni garantie.", criteria: CRITERIA } },
  });
  const answer = response.answers.decision;
  return { decision: answer.choice, label: DECISIONS[answer.choice], probability: answer.probabilities[answer.choice], confidence: answer.confidence, review: answer.confidence < 0.8, deterministic: false, usage: response.usage };
}
export async function runCli(argv, io = console) {
  if (argv.length !== 1) throw new Error("Usage : jev-mediation-numerique-fit <dossier.json>");
  const dossier = digitalCase(JSON.parse(await readFile(argv[0], "utf8")));
  io.log(JSON.stringify({ dossier, prochaineÉtape: "Transmettez ce dossier à matchDigitalMediation avec un fournisseur Jev configuré." }, null, 2));
}
