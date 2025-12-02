import Navigation from "../components/Navigation";
import React, { useState } from "react";

const Form = () => {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: 1,
      text: "Tu préfères passer ton temps à :",
      options: {
        A: "Créer et imaginer de nouvelles choses",
        B: "Analyser et comprendre",
        C: "Rencontrer et socialiser",
        D: "Organiser et planifier",
      },
    },
    {
      id: 2,
      text: "Comment abordes-tu un projet ?",
      options: {
        A: "Chercher des idées originales",
        B: "Étudier les données",
        C: "Discuter et collaborer",
        D: "Établir un plan clair",
      },
    },
    {
      id: 3,
      text: "Lorsque tu rencontres un problème, tu :",
      options: {
        A: "Trouves des solutions créatives",
        B: "Analyse la situation",
        C: "En parles avec d'autres",
        D: "Suis une méthode étape par étape",
      },
    },
    {
      id: 4,
      text: "Dans une activité de groupe, tu es plutôt :",
      options: {
        A: "Celui qui propose des idées nouvelles",
        B: "Celui qui vérifie les faits",
        C: "Celui qui maintient la cohésion",
        D: "Celui qui organise tout",
      },
    },
    {
      id: 5,
      text: "Quand tu planifies ton temps libre, tu :",
      options: {
        A: "Improvise et explore",
        B: "Fais des listes et plannings",
        C: "Cherches à passer du temps avec amis",
        D: "Suis un guide structuré",
      },
    },
    {
      id: 6,
      text: "Quand tu résous un problème complexe, tu préfères :",
      options: {
        A: "Explorer des solutions innovantes",
        B: "Décomposer le problème",
        C: "En discuter avec d’autres",
        D: "Suivre une méthode",
      },
    },
    {
      id: 7,
      text: "Comment organises-tu ton espace de travail ?",
      options: {
        A: "Notes et inspirations partout",
        B: "Graphiques et diagrammes",
        C: "Rappels collaboratifs",
        D: "Ordre strict et routine",
      },
    },
    {
      id: 8,
      text: "Lorsque tu dois apprendre quelque chose de nouveau, tu :",
      options: {
        A: "Testes directement",
        B: "Étudies les concepts",
        C: "Préfères discussions et échanges",
        D: "Suis un plan clair",
      },
    },
    {
      id: 9,
      text: "Dans un projet créatif, tu es celui qui :",
      options: {
        A: "Propose des idées originales",
        B: "Analyse la faisabilité",
        C: "Facilite la communication",
        D: "Crée un planning détaillé",
      },
    },
    {
      id: 10,
      text: "Quand tu dois prendre une décision importante :",
      options: {
        A: "Suis ton intuition",
        B: "Pèse les avantages et inconvénients",
        C: "Demande l’avis des autres",
        D: "Établis un plan clair",
      },
    },
    {
      id: 11,
      text: "Dans ton temps libre, tu préfères :",
      options: {
        A: "Créer, inventer",
        B: "Résoudre des énigmes",
        C: "Rencontrer des gens",
        D: "Planifier des activités",
      },
    },
    {
      id: 12,
      text: "Lorsque tu travailles sous pression, tu :",
      options: {
        A: "Cherches des solutions originales",
        B: "Analyse méthodiquement",
        C: "Communiques avec ton entourage",
        D: "Suis ton plan",
      },
    },
    {
      id: 13,
      text: "Face à un nouveau projet, tu commences par :",
      options: {
        A: "Imaginer toutes les possibilités",
        B: "Étudier les contraintes",
        C: "Discuter des idées",
        D: "Planifier les étapes",
      },
    },
    {
      id: 14,
      text: "Quand tu es confronté à un conflit dans un groupe :",
      options: {
        A: "Proposes des solutions originales",
        B: "Cherches une solution rationnelle",
        C: "Écoutes et encourages le dialogue",
        D: "Met en place des règles claires",
      },
    },
    {
      id: 15,
      text: "Ton but ultime dans un projet est :",
      options: {
        A: "Créer quelque chose d’unique",
        B: "Produit le résultat le plus efficace",
        C: "Maintenir de bonnes relations",
        D: "Terminer dans les temps",
      },
    },
  ];

  const calculateResult = () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    Object.values(answers).forEach((ans) => counts[ans]++);
    const max = Math.max(counts.A, counts.B, counts.C, counts.D);
    if (counts.A === max) return "Le Créatif";
    if (counts.B === max) return "L’Analytique";
    if (counts.C === max) return "Le Social";
    return "L’Organisé";
  };

  const submitName = (e) => {
    e.preventDefault();
    setStarted(true);
  };

  const submitTest = () => {
    const personality = calculateResult();
    setResult(personality);
  };

  const q = questions[currentQuestion];

  return (
    <div className="form">
      <Navigation />
      <div className="form-box">
        <h1>Test de personnalité</h1>
        <div className="formulaire">
          {!started && !result && (
            <form onSubmit={submitName}>
              <h2>Bienvenue !</h2>
              <p>Entre ton prénom ou pseudo pour commencer le test :</p>
              <input
                type="text"
                placeholder="Ton prénom..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <button className="buttonSubmit1" type="submit">
                Commencer
              </button>
            </form>
          )}

          {started && !result && (
            <div className="question-page">
              <h3>
                Question {currentQuestion + 1} / {questions.length}
              </h3>
              <p>
                <strong>{q.text}</strong>
              </p>

              <div className="options">
                {Object.entries(q.options).map(([key, value]) => (
                  <label key={key} className="option">
                    <input
                      type="radio"
                      name={`question${q.id}`}
                      value={key}
                      checked={answers[q.id] === key}
                      onChange={() => setAnswers({ ...answers, [q.id]: key })}
                    />
                    <span>{value}</span> {/* <-- important pour le CSS */}
                  </label>
                ))}
              </div>

              <div className="nav-buttons">
                {currentQuestion > 0 && (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  >
                    Précédent
                  </button>
                )}

                {currentQuestion < questions.length - 1 && (
                  <button
                    disabled={!answers[q.id]}
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  >
                    Suivant
                  </button>
                )}

                {currentQuestion === questions.length - 1 && (
                  <button disabled={!answers[q.id]} onClick={submitTest}>
                    Voir mon résultat
                  </button>
                )}
              </div>
            </div>
          )}

          {result && (
            <div className="result">
              <h2> {name}, ton profil est :</h2>
              <h1>{result}</h1>
              <button
                onClick={() => {
                  setName("");
                  setAnswers({});
                  setCurrentQuestion(0);
                  setResult(null);
                  setStarted(false);
                }}
              >
                Refaire le test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
