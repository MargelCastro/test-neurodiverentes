window.SiteNavigation.init();

const questionGroups = [
  {
    id: "A",
    title: "Sección A - Déficit de Atención",
    meta: "Atención y concentración",
    items: [
      "¿Te cuesta mantener la atención en una tarea larga?",
      "¿Cometes errores por descuido en tareas importantes?",
      "¿Empiezas actividades pero no las terminas?",
      "¿Te distraes fácilmente con ruidos o pensamientos?",
      "¿Olvidas citas o compromisos?",
      "¿Pierdes objetos importantes como llaves, cartera o teléfono?",
      "¿Te cuesta organizar los pasos de una tarea?",
      "¿Evitas actividades que requieren mucha concentración?",
      "¿Necesitas releer varias veces para comprender?",
      "¿Saltas de una actividad a otra sin terminar ninguna?",
      "¿Pierdes el hilo de una conversación larga o una reunión?",
      "¿Te cuesta seguir instrucciones de varios pasos?",
      "¿Olvidas lo que ibas a hacer al cambiar de habitación o de tarea?",
      "¿Dejas correos, mensajes o llamadas sin responder por olvido?",
      "¿Te desconectas mentalmente aunque estés escuchando a alguien?",
      "¿Te cuesta sostener la atención en lecturas, videos o clases?",
      "¿Te distraes mientras trabajas, estudias o conduces?",
      "¿Descuidas detalles que luego te generan problemas?",
      "¿Olvidas dónde acabas de colocar algo hace pocos minutos?",
      "¿Te cuesta mantener la atención incluso en conversaciones tranquilas?"
    ]
  },
  {
    id: "B",
    title: "Sección B - Hiperactividad e Impulsividad",
    meta: "Inquietud, ritmo interno e impulsos",
    items: [
      "¿Sientes que debes estar haciendo algo constantemente?",
      "¿Mueves con frecuencia piernas, manos o pies?",
      "¿Te cuesta permanecer sentado durante mucho tiempo?",
      "¿Hablas más de lo que quisieras?",
      "¿Interrumpes conversaciones sin darte cuenta?",
      "¿Te cuesta relajarte cuando por fin tienes tiempo libre?",
      "¿Sientes una inquietud interna constante?",
      "¿Empiezas nuevos proyectos antes de terminar otros?",
      "¿Te cuesta esperar tu turno?",
      "¿Las personas dicen que eres impulsivo?",
      "¿Respondes antes de escuchar la pregunta completa?",
      "¿Cambias de tema de forma brusca al hablar?",
      "¿Necesitas levantarte o cambiar de postura repetidamente?",
      "¿Tomas decisiones rápidas que luego lamentas?",
      "¿Te cuesta bajar el ritmo mental o físico antes de dormir?",
      "¿Sientes urgencia por terminar las frases de otras personas?",
      "¿Aceptas compromisos sin pensarlo del todo?",
      "¿Revisas el móvil compulsivamente mientras esperas algo?",
      "¿Te desesperas en filas, tráfico o esperas cortas?",
      "¿Compras, envías mensajes o hablas por impulso?"
    ]
  },
  {
    id: "C",
    title: "Sección C - Funciones Ejecutivas",
    meta: "Organización, tiempo y autocontrol",
    items: [
      "¿Dejas tareas importantes para última hora?",
      "¿Subestimas el tiempo necesario para terminar algo?",
      "¿Olvidas pagos, fechas límite o trámites importantes?",
      "¿Te cuesta establecer prioridades?",
      "¿Empiezas muchas ideas y abandonas varias?",
      "¿Pierdes fácilmente la motivación al avanzar una tarea?",
      "¿Te cuesta controlar tus emociones cuando te frustras?",
      "¿Haces compras por impulso que luego reconsideras?",
      "¿Actúas antes de pensar en las consecuencias?",
      "¿Tus síntomas afectan tu trabajo, estudio o relaciones?",
      "¿El desorden de tu espacio te dificulta rendir?",
      "¿Empiezas el día sin un plan claro y luego improvisas todo?",
      "¿Pospones tareas sencillas aunque sabes que debes hacerlas?",
      "¿Se te acumulan gestiones administrativas o pendientes pequeños?",
      "¿Olvidas devolver llamadas o mensajes importantes?",
      "¿Te cuesta dividir una tarea grande en pasos pequeños?",
      "¿Te bloqueas al elegir por dónde empezar?",
      "¿Cambias de objetivo cuando aparece algo más interesante?",
      "¿Te cuesta mantener rutinas o hábitos durante semanas?",
      "¿Llegas tarde por mala gestión del tiempo?"
    ]
  },
  {
    id: "D",
    title: "Sección D - Síntomas Desde la Infancia",
    meta: "Recuerda tu niñez y adolescencia",
    items: [
      "Durante tu infancia, ¿te describían como distraído o despistado?",
      "¿Olvidabas tareas, cuadernos o materiales escolares con frecuencia?",
      "¿En clase soñabas despierto o te costaba seguir el ritmo?",
      "¿Te costaba permanecer sentado cuando debías hacerlo?",
      "¿Hablabas mucho o interrumpías a otros desde pequeño?",
      "¿Perdías útiles, juguetes u objetos personales con frecuencia?",
      "¿Necesitabas supervisión extra para terminar tareas?",
      "¿Te llamaban la atención por impulsividad, desorden o descuido?",
      "¿Cambiabas de juego o actividad muy rápido?",
      "¿Tus cuidadores notaban olvidos frecuentes en casa?",
      "¿Te costaba seguir rutinas de mañana, escuela o descanso?",
      "¿Postergabas deberes o estudios hasta el último momento?",
      "¿Te frustraban especialmente las tareas largas o repetitivas?",
      "¿Olvidabas instrucciones aunque te las acabaran de dar?",
      "¿Sentías inquietud física en momentos en que debías estar quieto?",
      "¿Te costaba esperar tu turno en juegos o actividades?",
      "¿Te decían que parecías no escuchar cuando te hablaban?",
      "¿Tu mochila, cuarto o pupitre solían estar muy desordenados?",
      "¿Tus familiares o maestros notaban que actuabas sin pensar?",
      "¿Estos rasgos ya eran visibles antes de los 12 años?"
    ]
  },
  {
    id: "E",
    title: "Sección E - Entornos, Deterioro y Descarte",
    meta: "Presencia en varios entornos y consistencia clínica",
    items: [
      "¿Estas dificultades aparecen también en tu casa?",
      "¿Estas dificultades aparecen en el trabajo, estudio o tareas formales?",
      "¿Estas dificultades afectan tus relaciones personales?",
      "¿Se notan también al hacer recados, pagos o gestiones diarias?",
      "¿Te ocurren incluso en actividades que disfrutas?",
      "¿Otras personas cercanas notan estos síntomas en ti?",
      "¿Tus dificultades aparecen en más de un entorno durante el mismo periodo?",
      "¿Tus síntomas te hacen perder tiempo valioso cada semana?",
      "¿Tus síntomas reducen tu rendimiento laboral o académico?",
      "¿Tus síntomas generan discusiones o malentendidos con otros?",
      "¿Tus olvidos o descuidos te traen consecuencias económicas o prácticas?",
      "¿Tus síntomas interfieren con tu autocuidado o salud diaria?",
      "¿Tus síntomas te hacen sentir sobrecargado con facilidad?",
      "¿Tus síntomas dificultan que cumplas metas personales?",
      "¿Tus síntomas persisten incluso cuando duermes bien?",
      "¿Tus síntomas aparecen incluso fuera de periodos de estrés intenso?",
      "¿Tus síntomas no se explican solo por ansiedad o tristeza pasajera?",
      "¿Tus síntomas no dependen únicamente de consumo de sustancias o medicamentos?",
      "¿Tus síntomas no parecen deberse solo a una enfermedad física conocida?",
      "¿Consideras que estas dificultades forman un patrón constante en tu vida?"
    ]
  }
];

const questions = questionGroups.flatMap((group) =>
  group.items.map((text) => ({
    section: group.id,
    title: group.title,
    meta: group.meta,
    text
  }))
);

const options = [
  { label: "Nunca", value: 0 },
  { label: "Rara vez", value: 1 },
  { label: "Algunas veces", value: 2 },
  { label: "Frecuentemente", value: 3 },
  { label: "Casi siempre", value: 4 }
];

const TEST_ID = "tdah-adultos";
const DIRECTORY_URL = "../../test-psicologicos-gratis.html";
const testStorage = window.TestStorage.create({
  testId: TEST_ID,
  totalQuestions: questions.length,
  validAnswerValues: options.map((option) => option.value)
});

let currentIndex = 0;
let answers = Array(questions.length).fill(null);
let startedAt = new Date().toISOString();
let progressCompleted = false;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const currentEl = document.getElementById("current");
const totalQuestionsEl = document.getElementById("totalQuestions");
const progressEl = document.getElementById("progress");
const quizStatusEl = document.getElementById("quizStatus");
const sectionNameEl = document.getElementById("sectionName");
const questionMetaEl = document.getElementById("questionMeta");
const answeredCountEl = document.getElementById("answeredCount");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");
const quizCardEl = document.getElementById("quizCard");
const pauseOverlayEl = document.getElementById("pauseOverlay");
const pauseSummaryEl = document.getElementById("pauseSummary");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const pauseExitBtn = document.getElementById("pauseExitBtn");
const exitBtn = document.getElementById("exitBtn");
const restartQuizBtn = document.getElementById("restartQuizBtn");
const desktopViewport = window.matchMedia("(min-width: 1024px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const {
  focusElement,
  getScrollBehavior,
  handleDialogKeydown
} = window.TestAccessibility;
let dialogTrigger = null;

totalQuestionsEl.textContent = questions.length;

function scrollBehavior() {
  return getScrollBehavior(reducedMotion);
}

function focusQuestion() {
  focusElement(questionEl);
}

function clearSavedProgress() {
  testStorage.clear();
}

function loadSavedProgress() {
  const progress = testStorage.load();

  if (!progress) {
    return false;
  }

  currentIndex = progress.currentQuestion;
  answers = progress.answers;
  startedAt = progress.startedAt;
  progressCompleted = progress.completed;
  return true;
}

function saveProgress(completed = progressCompleted) {
  progressCompleted = completed;
  testStorage.save({
    currentQuestion: currentIndex,
    answers,
    startedAt,
    completed: progressCompleted
  });
}

function countAnswered() {
  return answers.filter((answer) => answer !== null).length;
}

function syncDesktopScroll() {
  const pauseVisible = !pauseOverlayEl.classList.contains("hidden");
  document.body.classList.toggle("pause-open", pauseVisible);
  const shouldLockScroll =
    pauseVisible || (desktopViewport.matches && resultEl.classList.contains("hidden"));
  document.body.classList.toggle("quiz-lock-scroll", shouldLockScroll);
}

function pauseTest() {
  saveProgress(progressCompleted);
  pauseSummaryEl.textContent = `Llevas ${countAnswered()} de ${questions.length} preguntas respondidas.`;
  dialogTrigger = document.activeElement;
  pauseOverlayEl.classList.remove("hidden");
  pauseOverlayEl.setAttribute("aria-hidden", "false");
  syncDesktopScroll();
  requestAnimationFrame(() => resumeBtn.focus());
}

function resumeTest() {
  pauseOverlayEl.classList.add("hidden");
  pauseOverlayEl.setAttribute("aria-hidden", "true");
  syncDesktopScroll();

  if (dialogTrigger instanceof HTMLElement) {
    dialogTrigger.focus();
  }
}

function exitToDirectory() {
  saveProgress(progressCompleted);
  window.location.href = DIRECTORY_URL;
}

function requestRestart() {
  const hasProgress = countAnswered() > 0 || progressCompleted;

  if (
    hasProgress &&
    !window.confirm("¿Deseas reiniciar el test? Se eliminarán todas las respuestas guardadas.")
  ) {
    return;
  }

  restartTest();
}

function scoreTone(score) {
  if (score <= 35) {
    return {
      shortLabel: "Indicadores bajos",
      fillClass: "bg-emerald-800",
      borderClass: "border-emerald-400",
      surfaceClass: "border-emerald-500/40 bg-emerald-950/30",
      titleClass: "text-emerald-100",
      metaClass: "text-emerald-200/75",
      scoreClass: "text-emerald-300",
      chipClass: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
    };
  }

  if (score <= 45) {
    return {
      shortLabel: "Indicadores levemente elevados",
      fillClass: "bg-amber-800",
      borderClass: "border-amber-300",
      surfaceClass: "border-amber-500/40 bg-amber-950/25",
      titleClass: "text-amber-100",
      metaClass: "text-amber-200/75",
      scoreClass: "text-amber-300",
      chipClass: "border-amber-400/30 bg-amber-500/10 text-amber-200"
    };
  }

  if (score <= 60) {
    return {
      shortLabel: "Indicadores elevados",
      fillClass: "bg-orange-800",
      borderClass: "border-orange-400",
      surfaceClass: "border-orange-500/40 bg-orange-950/25",
      titleClass: "text-orange-100",
      metaClass: "text-orange-200/75",
      scoreClass: "text-orange-300",
      chipClass: "border-orange-400/30 bg-orange-500/10 text-orange-200"
    };
  }

  return {
    shortLabel: "Indicadores muy elevados",
    fillClass: "bg-red-800",
    borderClass: "border-red-400",
    surfaceClass: "border-red-500/40 bg-red-950/25",
    titleClass: "text-red-100",
    metaClass: "text-red-200/75",
    scoreClass: "text-red-300",
    chipClass: "border-red-400/30 bg-red-500/10 text-red-200"
  };
}

function resultBand(score) {
  const tone = scoreTone(score);

  if (score <= 35) {
    return {
      label: "Indicadores bajos",
      description: "Las respuestas muestran una presencia baja de indicadores relacionados con atención, hiperactividad e impulsividad.",
      ...tone
    };
  }

  if (score <= 45) {
    return {
      label: "Indicadores levemente elevados",
      description: "Las respuestas muestran algunos indicadores levemente elevados que conviene observar en su contexto cotidiano.",
      ...tone
    };
  }

  if (score <= 60) {
    return {
      label: "Indicadores elevados relacionados con TDAH",
      description: "Las respuestas muestran indicadores elevados relacionados con TDAH. Conviene comentarlos con un profesional cualificado.",
      ...tone
    };
  }

  return {
    label: "Indicadores muy elevados relacionados con TDAH",
    description: "Las respuestas muestran indicadores muy elevados relacionados con TDAH. Se recomienda solicitar una evaluación profesional.",
    ...tone
  };
}

function sectionScores() {
  let offset = 0;

  return questionGroups.map((group) => {
    const start = offset;
    const end = start + group.items.length;
    offset = end;
    const raw = answers.slice(start, end).reduce((sum, value) => sum + value, 0);
    const normalized = Math.round((raw / (group.items.length * 4)) * 100);

    return {
      id: group.id,
      title: group.title,
      meta: group.meta,
      normalized,
      tone: scoreTone(normalized)
    };
  });
}

function profileInterpretation(finalScore, sections) {
  const sectionMap = Object.fromEntries(sections.map((section) => [section.id, section]));
  const attention = sectionMap.A.normalized;
  const hyperactivity = sectionMap.B.normalized;
  const childhood = sectionMap.D.normalized;
  const contexts = sectionMap.E.normalized;
  const attentionHigh = attention >= 46;
  const hyperactivityHigh = hyperactivity >= 46;
  const supportStrong = childhood >= 46 && contexts >= 46;
  const supportPartial = childhood >= 36 || contexts >= 36;
  const tone = scoreTone(Math.max(finalScore, attention, hyperactivity));
  let label = "Patrón de respuestas sin predominio claro";
  let description = "Las respuestas no muestran un predominio claro entre indicadores de inatención e hiperactividad/impulsividad.";

  if (finalScore <= 35 && !attentionHigh && !hyperactivityHigh) {
    label = "Indicadores bajos en las áreas principales";
    description = "Las respuestas muestran indicadores bajos de inatención e hiperactividad/impulsividad.";
  } else if (finalScore <= 45) {
    if (attention > hyperactivity + 8) {
      label = "Indicadores leves con mayor presencia inatenta";
      description = "Los indicadores leves aparecen con mayor frecuencia en el área de atención.";
    } else if (hyperactivity > attention + 8) {
      label = "Indicadores leves con mayor presencia hiperactiva";
      description = "Los indicadores leves aparecen con mayor frecuencia en hiperactividad e impulsividad.";
    } else {
      label = "Indicadores leves mixtos";
      description = "Los indicadores leves se distribuyen entre atención, hiperactividad e impulsividad.";
    }
  } else if (attentionHigh && hyperactivityHigh) {
    label = "Indicadores elevados en atención e hiperactividad";
    description = "Las áreas de atención e hiperactividad/impulsividad presentan elevación al mismo tiempo.";
  } else if (attentionHigh) {
    label = "Indicadores elevados con mayor presencia inatenta";
    description = "Los indicadores de inatención tienen mayor presencia que los de hiperactividad e impulsividad.";
  } else if (hyperactivityHigh) {
    label = "Indicadores elevados con mayor presencia hiperactiva/impulsiva";
    description = "Los indicadores de hiperactividad e impulsividad tienen mayor presencia que los de inatención.";
  } else if (attention >= 36 || hyperactivity >= 36) {
    label = "Indicadores parciales sin predominio claro";
    description = "Existe elevación parcial en atención o hiperactividad, sin un predominio definido.";
  }

  let supportText = "Las secciones de infancia y presencia en varios entornos ayudan a contextualizar el resultado.";

  if (supportStrong) {
    supportText = "Además, la infancia y la presencia en varios entornos también salen elevadas, lo que refuerza el patrón observado.";
  } else if (supportPartial) {
    supportText = "Infancia o varios entornos muestran señales parciales, así que conviene confirmar el patrón con evaluación clínica.";
  } else if (finalScore > 45) {
    supportText = "Aunque el puntaje general es alto, infancia o varios entornos no salen tan elevados, así que hace falta revisión clínica cuidadosa.";
  }

  return {
    label,
    description: `${description} ${supportText}`,
    tone,
    metrics: {
      attention,
      hyperactivity,
      childhood,
      contexts
    }
  };
}

function hideResult() {
  resultEl.classList.add("hidden");
  resultEl.innerHTML = "";
  syncDesktopScroll();
}

function renderQuestion() {
  const currentQuestion = questions[currentIndex];
  const answered = countAnswered();

  questionEl.textContent = currentQuestion.text;
  currentEl.textContent = currentIndex + 1;
  sectionNameEl.textContent = currentQuestion.title;
  questionMetaEl.textContent = currentQuestion.meta;
  answeredCountEl.textContent = `${answered} respondidas`;
  const progressValue = Math.round(((currentIndex + 1) / questions.length) * 100);
  progressEl.style.width = `${progressValue}%`;
  progressEl.setAttribute("aria-valuenow", String(progressValue));
  progressEl.setAttribute(
    "aria-valuetext",
    `Pregunta ${currentIndex + 1} de ${questions.length}`
  );
  quizStatusEl.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}. ${answered} respondidas. ${currentQuestion.title}.`;

  optionsEl.innerHTML = "";

  options.forEach((option, optionIndex) => {
    const selected = answers[currentIndex] === option.value;
    const button = document.createElement("button");

    button.type = "button";
    button.className = [
      "touch-target flex w-full items-center justify-center rounded-2xl border p-4 text-center transition",
      "sm:p-5",
      selected
        ? "border-blue-400 bg-blue-600 shadow-lg shadow-blue-950/40"
        : "border-slate-700 bg-slate-800 hover:bg-slate-700"
    ].join(" ");

    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(selected));
    button.tabIndex = selected || (answers[currentIndex] === null && optionIndex === 0) ? 0 : -1;
    button.innerHTML = `
      <span class="text-base font-semibold sm:text-lg">${option.label}</span>
    `;

    button.addEventListener("click", () => {
      answers[currentIndex] = option.value;
      saveProgress(false);
      hideResult();
      renderQuestion();
      optionsEl.querySelector('[aria-checked="true"]')?.focus({ preventScroll: true });
    });

    button.addEventListener("keydown", (event) => {
      const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
      const backward = event.key === "ArrowUp" || event.key === "ArrowLeft";

      if (!forward && !backward && event.key !== "Home" && event.key !== "End") {
        return;
      }

      event.preventDefault();
      let targetIndex = optionIndex;

      if (forward) {
        targetIndex = (optionIndex + 1) % options.length;
      } else if (backward) {
        targetIndex = (optionIndex - 1 + options.length) % options.length;
      } else if (event.key === "Home") {
        targetIndex = 0;
      } else {
        targetIndex = options.length - 1;
      }

      optionsEl.querySelectorAll('[role="radio"]')[targetIndex].click();
    });

    optionsEl.appendChild(button);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = answers[currentIndex] === null;
  nextBtn.textContent = currentIndex === questions.length - 1 ? "Ver resultado" : "Siguiente";
}

function showResult({ persist = true } = {}) {
  const totalRaw = answers.reduce((sum, value) => sum + value, 0);
  const maxRaw = questions.length * 4;
  const finalScore = Math.round((totalRaw / maxRaw) * 100);
  const band = resultBand(finalScore);
  const sections = sectionScores();
  const profile = profileInterpretation(finalScore, sections);

  if (persist) {
    saveProgress(true);
  }

  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `
    <h2 class="text-2xl font-bold sm:text-3xl">Resultado</h2>

    <div class="mt-5 rounded-3xl border ${band.borderClass} ${band.fillClass} p-5">
      <p class="text-sm uppercase tracking-[0.2em] text-white/80">Puntaje final</p>
      <p class="mt-2 text-5xl font-bold">${finalScore}/100</p>
      <p class="mt-3 text-lg font-semibold">${band.label}</p>
      <p class="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">${band.description}</p>
    </div>

    <div class="mt-4 rounded-3xl border ${profile.tone.surfaceClass} p-5">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-sm uppercase tracking-[0.2em] ${profile.tone.metaClass}">Perfil orientativo</p>
          <p class="mt-2 text-xl font-bold ${profile.tone.titleClass}">${profile.label}</p>
        </div>
        <span class="rounded-full border px-3 py-1 text-xs font-semibold ${profile.tone.chipClass}">
          ${profile.tone.shortLabel}
        </span>
      </div>
      <p class="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">${profile.description}</p>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-2xl bg-slate-950/25 p-3">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Atención</p>
          <p class="mt-2 text-2xl font-bold ${sections[0].tone.scoreClass}">${profile.metrics.attention}/100</p>
        </div>
        <div class="rounded-2xl bg-slate-950/25 p-3">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Hiperactividad</p>
          <p class="mt-2 text-2xl font-bold ${sections[1].tone.scoreClass}">${profile.metrics.hyperactivity}/100</p>
        </div>
        <div class="rounded-2xl bg-slate-950/25 p-3">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Infancia</p>
          <p class="mt-2 text-2xl font-bold ${sections[3].tone.scoreClass}">${profile.metrics.childhood}/100</p>
        </div>
        <div class="rounded-2xl bg-slate-950/25 p-3">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Entornos</p>
          <p class="mt-2 text-2xl font-bold ${sections[4].tone.scoreClass}">${profile.metrics.contexts}/100</p>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h3 class="text-lg font-semibold">Escala de colores</h3>
      <div class="mt-3 overflow-hidden rounded-2xl border border-slate-800">
        <div class="grid grid-cols-[auto,1fr] items-center gap-3 border-b border-slate-800 bg-slate-800/60 px-4 py-3">
          <span class="h-4 w-4 rounded-full bg-emerald-500"></span>
          <p class="text-sm text-slate-200">0 a 35 puntos: indicadores bajos</p>
        </div>
        <div class="grid grid-cols-[auto,1fr] items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
          <span class="h-4 w-4 rounded-full bg-amber-400"></span>
          <p class="text-sm text-slate-200">36 a 45 puntos: indicadores levemente elevados</p>
        </div>
        <div class="grid grid-cols-[auto,1fr] items-center gap-3 border-b border-slate-800 bg-slate-800/60 px-4 py-3">
          <span class="h-4 w-4 rounded-full bg-orange-500"></span>
          <p class="text-sm text-slate-200">46 a 60 puntos: indicadores elevados relacionados con TDAH</p>
        </div>
        <div class="grid grid-cols-[auto,1fr] items-center gap-3 bg-slate-900 px-4 py-3">
          <span class="h-4 w-4 rounded-full bg-red-500"></span>
          <p class="text-sm text-slate-200">61 a 100 puntos: indicadores muy elevados relacionados con TDAH</p>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h3 class="text-lg font-semibold">Resumen por áreas</h3>
      <div class="mt-3 grid gap-3 md:grid-cols-2">
        ${sections
          .map(
            (section) => `
              <div class="rounded-2xl border ${section.tone.surfaceClass} p-4">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold ${section.tone.titleClass}">${section.title}</p>
                    <p class="mt-1 text-xs uppercase tracking-[0.18em] ${section.tone.metaClass}">${section.meta}</p>
                  </div>
                  <span class="rounded-full border px-3 py-1 text-xs font-semibold ${section.tone.chipClass}">
                    ${section.tone.shortLabel}
                  </span>
                </div>
                <p class="mt-3 text-3xl font-bold ${section.tone.scoreClass}">${section.normalized}/100</p>
              </div>
            `
          )
          .join("")}
      </div>
    </div>

    <div class="mt-6 rounded-2xl bg-slate-800 p-4 text-sm leading-relaxed text-slate-300">
      <p class="font-semibold text-white">Una orientación inicial para buscar claridad profesional</p>
      <p class="mt-2">
        Este resultado funciona como una evaluación de cribado que puede ayudarte a decidir si conviene iniciar un
        proceso diagnóstico profesional. Se basa en indicadores de inatención, hiperactividad e impulsividad descritos
        en fuentes clínicas y sanitarias de referencia sobre TDAH.
      </p>
      <p class="mt-2">
        Si estos indicadores afectan tus estudios, trabajo, relaciones o vida diaria, buscar ayuda es un paso razonable
        y útil. Un profesional podrá valorar tu historia desde la infancia, el impacto en distintos entornos y otras
        causas que pueden producir síntomas similares, para confirmar o descartar TDAH. Este cuestionario por sí solo
        no constituye un diagnóstico médico o psicológico.
      </p>
      <p class="mt-3 text-xs text-slate-400">
        Fuentes de referencia:
        <a class="underline hover:text-white" href="https://www.cdc.gov/adhd/diagnosis/index.html" target="_blank" rel="noreferrer">CDC — Diagnóstico del TDAH</a>
        ·
        <a class="underline hover:text-white" href="https://www.nimh.nih.gov/health/publications/attention-deficit-hyperactivity-disorder-what-you-need-to-know" target="_blank" rel="noreferrer">NIMH — Información sobre TDAH</a>
      </p>
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-3">
      <button id="reviewBtn" type="button" class="touch-target rounded-2xl bg-slate-800 px-4 py-4 text-base font-semibold text-white">
        Revisar respuestas
      </button>
      <button id="restartBtn" type="button" class="touch-target rounded-2xl bg-white px-4 py-4 text-base font-bold text-slate-950">
        Repetir test
      </button>
      <a href="${DIRECTORY_URL}" class="touch-target flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-center text-base font-semibold text-white">
        Volver a Evaluaciones
      </a>
    </div>
  `;

  const reviewBtn = document.getElementById("reviewBtn");
  const restartBtn = document.getElementById("restartBtn");

  syncDesktopScroll();

  reviewBtn.addEventListener("click", () => {
    quizCardEl.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    focusQuestion();
  });

  restartBtn.addEventListener("click", requestRestart);
  resultEl.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  resultEl.focus({ preventScroll: true });
}

function restartTest() {
  currentIndex = 0;
  answers = Array(questions.length).fill(null);
  startedAt = new Date().toISOString();
  progressCompleted = false;
  clearSavedProgress();
  hideResult();
  renderQuestion();
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
  focusQuestion();
}

prevBtn.addEventListener("click", () => {
  if (currentIndex === 0) {
    return;
  }

  currentIndex -= 1;
  saveProgress(false);
  hideResult();
  renderQuestion();
  quizCardEl.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  focusQuestion();
});

nextBtn.addEventListener("click", () => {
  if (answers[currentIndex] === null) {
    return;
  }

  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    saveProgress(false);
    hideResult();
    renderQuestion();
    quizCardEl.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    focusQuestion();
    return;
  }

  showResult();
});

pauseBtn.addEventListener("click", pauseTest);
resumeBtn.addEventListener("click", resumeTest);
pauseOverlayEl.addEventListener("keydown", (event) => {
  handleDialogKeydown(event, pauseOverlayEl, resumeTest);
});
pauseExitBtn.addEventListener("click", exitToDirectory);
exitBtn.addEventListener("click", exitToDirectory);
restartQuizBtn.addEventListener("click", requestRestart);

if (typeof desktopViewport.addEventListener === "function") {
  desktopViewport.addEventListener("change", syncDesktopScroll);
} else {
  desktopViewport.addListener(syncDesktopScroll);
}

const progressRestored = loadSavedProgress();

renderQuestion();

if (progressRestored && progressCompleted) {
  showResult({ persist: false });
}

syncDesktopScroll();
