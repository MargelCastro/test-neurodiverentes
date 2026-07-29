import assert from "node:assert/strict";
import test from "node:test";
import { createQuizRuntime } from "./helpers/quiz-runtime.mjs";

const quizCases = [
  {
    type: "adult",
    questions: 100,
    storageKey: "neurodivergentes:tdah-adultos:progress"
  },
  {
    type: "child",
    questions: 60,
    storageKey: "neurodivergentes:tdah-infantil:progress"
  }
];

function completeQuiz(runtime, questions, optionIndex) {
  runtime.closeGuardianNotice();

  for (let index = 0; index < questions; index += 1) {
    runtime.answerCurrent(optionIndex);
    if (index < questions - 1) {
      runtime.next();
    }
  }

  if (runtime.document.getElementById("viewResultsBtn")) {
    runtime.showChildResults();
  } else {
    runtime.next();
  }
}

for (const quiz of quizCases) {
  test(`${quiz.type}: flujo completo con puntaje mínimo`, () => {
    const runtime = createQuizRuntime({ type: quiz.type });
    completeQuiz(runtime, quiz.questions, 0);

    const result = runtime.document.getElementById("result");
    assert.ok(!result.classList.contains("hidden"));
    assert.match(result.innerHTML, />0\/100</);
    assert.match(result.innerHTML, /Indicadores bajos/i);
    assert.equal(
      runtime.consoleMessages.filter(([level]) => level === "error").length,
      0
    );
  });

  test(`${quiz.type}: flujo completo con puntaje máximo`, () => {
    const runtime = createQuizRuntime({ type: quiz.type });
    completeQuiz(runtime, quiz.questions, 4);

    const result = runtime.document.getElementById("result");
    assert.ok(!result.classList.contains("hidden"));
    assert.match(result.innerHTML, />100\/100</);
    assert.match(result.innerHTML, /Indicadores muy elevados relacionados con TDAH/i);

    const saved = JSON.parse(runtime.localStorage.getItem(quiz.storageKey));
    assert.equal(saved.completed, true);
    assert.equal(saved.answers.length, quiz.questions);
  });

  test(`${quiz.type}: límites de los cuatro rangos`, () => {
    const runtime = createQuizRuntime({ type: quiz.type });
    const resultBand = runtime.context.resultBand;

    assert.equal(resultBand(0).label, "Indicadores bajos");
    assert.equal(resultBand(35).label, "Indicadores bajos");
    assert.equal(resultBand(36).label, "Indicadores levemente elevados");
    assert.equal(resultBand(45).label, "Indicadores levemente elevados");
    assert.equal(
      resultBand(46).label,
      "Indicadores elevados relacionados con TDAH"
    );
    assert.equal(
      resultBand(60).label,
      "Indicadores elevados relacionados con TDAH"
    );
    assert.equal(
      resultBand(61).label,
      "Indicadores muy elevados relacionados con TDAH"
    );
    assert.equal(
      resultBand(100).label,
      "Indicadores muy elevados relacionados con TDAH"
    );
  });

  test(`${quiz.type}: guardado, recarga y recuperación`, () => {
    const firstRun = createQuizRuntime({ type: quiz.type });
    firstRun.closeGuardianNotice();
    firstRun.answerCurrent(3);
    firstRun.next();

    const saved = JSON.parse(firstRun.localStorage.getItem(quiz.storageKey));
    assert.deepEqual(
      Object.keys(saved).sort(),
      [
        "answers",
        "completed",
        "currentQuestion",
        "startedAt",
        "testId",
        "updatedAt",
        "version"
      ].sort()
    );
    assert.equal(saved.version, 1);
    assert.equal(saved.currentQuestion, 1);
    assert.equal(saved.answers[0], 3);
    assert.equal(saved.completed, false);

    const secondRun = createQuizRuntime({
      type: quiz.type,
      storageSeed: firstRun.localStorage.snapshot()
    });
    assert.equal(
      secondRun.document.getElementById("current").textContent,
      2
    );
    assert.equal(
      secondRun.document.getElementById("answeredCount").textContent,
      "1 respondidas"
    );
  });

  test(`${quiz.type}: ignora progreso con versión incompatible`, () => {
    const runtime = createQuizRuntime({
      type: quiz.type,
      storageSeed: {
        [quiz.storageKey]: JSON.stringify({
          version: 99,
          testId: quiz.type === "adult" ? "tdah-adultos" : "tdah-infantil",
          currentQuestion: 10,
          answers: Array(quiz.questions).fill(4),
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completed: false
        })
      }
    });

    assert.equal(runtime.document.getElementById("current").textContent, 1);
    assert.equal(runtime.localStorage.getItem(quiz.storageKey), null);
  });

  test(`${quiz.type}: reinicio elimina el progreso y vuelve a la primera pregunta`, () => {
    const runtime = createQuizRuntime({ type: quiz.type });
    runtime.closeGuardianNotice();
    runtime.answerCurrent(2);
    runtime.next();
    assert.notEqual(runtime.localStorage.getItem(quiz.storageKey), null);

    runtime.document.getElementById("restartQuizBtn").click();

    assert.equal(runtime.localStorage.getItem(quiz.storageKey), null);
    assert.equal(runtime.document.getElementById("current").textContent, 1);
    assert.equal(
      runtime.document.getElementById("answeredCount").textContent,
      "0 respondidas"
    );
    assert.ok(runtime.document.getElementById("result").classList.contains("hidden"));
  });

  test(`${quiz.type}: pausa guarda y reanudación recupera el cuestionario`, () => {
    const runtime = createQuizRuntime({ type: quiz.type });
    runtime.closeGuardianNotice();
    runtime.answerCurrent(1);

    runtime.document.getElementById("pauseBtn").click();
    assert.ok(
      !runtime.document.getElementById("pauseOverlay").classList.contains("hidden")
    );
    assert.match(
      runtime.document.getElementById("pauseSummary").textContent,
      new RegExp(`1 de ${quiz.questions}`)
    );
    assert.notEqual(runtime.localStorage.getItem(quiz.storageKey), null);

    runtime.document.getElementById("resumeBtn").click();
    assert.ok(
      runtime.document.getElementById("pauseOverlay").classList.contains("hidden")
    );
  });

  test(`${quiz.type}: comportamiento responsive del bloqueo de scroll`, () => {
    const mobile = createQuizRuntime({ type: quiz.type, desktop: false });
    const desktop = createQuizRuntime({ type: quiz.type, desktop: true });

    if (quiz.type === "child") {
      mobile.closeGuardianNotice();
      desktop.closeGuardianNotice();
    }

    assert.equal(mobile.document.body.classList.contains("quiz-lock-scroll"), false);
    assert.equal(desktop.document.body.classList.contains("quiz-lock-scroll"), true);
  });

  test(`${quiz.type}: navegación por teclado en opciones`, () => {
    const runtime = createQuizRuntime({ type: quiz.type });
    runtime.closeGuardianNotice();
    const options = runtime.document.getElementById("options");
    options.children[0].keydown("ArrowRight");

    const refreshedOptions = runtime.document.getElementById("options");
    assert.equal(
      refreshedOptions.children[1].getAttribute("aria-checked"),
      "true"
    );
    assert.equal(runtime.document.activeElement, refreshedOptions.children[1]);
  });
}

test("infantil: resultados bloqueados hasta completar todas las respuestas", () => {
  const runtime = createQuizRuntime({ type: "child" });
  runtime.closeGuardianNotice();
  const resultButton = runtime.document.getElementById("viewResultsBtn");

  assert.equal(resultButton.disabled, true);
  runtime.answerCurrent(2);
  runtime.showChildResults();
  assert.ok(runtime.document.getElementById("result").classList.contains("hidden"));
});
