(function () {
  "use strict";

  function create({
    testId,
    totalQuestions,
    validAnswerValues,
    version = 1,
    storage = window.localStorage
  }) {
    const storageKey = `neurodivergentes:${testId}:progress`;
    const allowedAnswers = new Set(validAnswerValues);

    function clear() {
      try {
        storage.removeItem(storageKey);
      } catch {
        // El test debe seguir funcionando aunque el navegador bloquee localStorage.
      }
    }

    function isValid(progress) {
      const validAnswers =
        Array.isArray(progress?.answers) &&
        progress.answers.length === totalQuestions &&
        progress.answers.every(
          (answer) => answer === null || allowedAnswers.has(answer)
        );
      const validQuestion =
        Number.isInteger(progress?.currentQuestion) &&
        progress.currentQuestion >= 0 &&
        progress.currentQuestion < totalQuestions;
      const validDates =
        typeof progress?.startedAt === "string" &&
        !Number.isNaN(Date.parse(progress.startedAt)) &&
        typeof progress?.updatedAt === "string" &&
        !Number.isNaN(Date.parse(progress.updatedAt));
      const validCompletion =
        typeof progress?.completed === "boolean" &&
        (!progress.completed ||
          (validAnswers &&
            progress.answers.every((answer) => answer !== null)));

      return (
        progress?.version === version &&
        progress?.testId === testId &&
        validAnswers &&
        validQuestion &&
        validDates &&
        validCompletion
      );
    }

    function load() {
      try {
        const storedProgress = storage.getItem(storageKey);

        if (!storedProgress) {
          return null;
        }

        const progress = JSON.parse(storedProgress);

        if (!isValid(progress)) {
          clear();
          return null;
        }

        return {
          ...progress,
          answers: [...progress.answers]
        };
      } catch {
        clear();
        return null;
      }
    }

    function save({ currentQuestion, answers, startedAt, completed }) {
      const progress = {
        version,
        testId,
        currentQuestion,
        answers: [...answers],
        startedAt,
        updatedAt: new Date().toISOString(),
        completed
      };

      try {
        storage.setItem(storageKey, JSON.stringify(progress));
      } catch {
        // El test debe seguir funcionando aunque el navegador bloquee localStorage.
      }
    }

    return Object.freeze({
      clear,
      load,
      save
    });
  }

  window.TestStorage = Object.freeze({ create });
})();
