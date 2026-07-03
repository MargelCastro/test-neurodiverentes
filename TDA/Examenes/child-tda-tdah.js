const questionGroups = [
  {
    id: "A",
    title: "Sección A - Inatención",
    meta: "Foco, escucha y seguimiento",
    items: [
      "¿Le cuesta mantener la atención en tareas escolares, juegos o explicaciones largas?",
      "¿Parece no escuchar cuando se le habla directamente?",
      "¿Se distrae con facilidad por ruidos, movimientos o estímulos alrededor?",
      "¿Comete errores por descuido en cuadernos, ejercicios o instrucciones?",
      "¿Empieza actividades pero las deja a medias sin terminarlas?",
      "¿Olvida instrucciones de varios pasos aunque se le hayan explicado bien?",
      "¿Pierde con frecuencia útiles, cuadernos, juguetes u otros objetos necesarios?",
      "¿Necesita recordatorios repetidos para terminar una tarea sencilla?",
      "¿Evita o rechaza tareas que requieren esfuerzo mental sostenido?",
      "¿Cambia de una actividad a otra sin cerrar la anterior?",
      "¿Olvida lo que iba a hacer al cambiar de habitación, clase o tarea?",
      "¿Le cuesta seguir el hilo de una historia, clase o conversación?"
    ]
  },
  {
    id: "B",
    title: "Sección B - Hiperactividad e Impulsividad",
    meta: "Movimiento, espera e impulsos",
    items: [
      "¿Mueve constantemente manos, pies o se balancea en el asiento?",
      "¿Se levanta cuando debería permanecer sentado?",
      "¿Corre, salta o trepa en momentos en que no corresponde?",
      "¿Le cuesta jugar, leer o hacer actividades tranquilas en silencio?",
      "¿Da la impresión de estar \"impulsado por un motor\" casi todo el tiempo?",
      "¿Habla más de lo esperado para su edad o interrumpe con frecuencia?",
      "¿Responde antes de que terminen de hacerle la pregunta?",
      "¿Interrumpe juegos, conversaciones o actividades de otros niños?",
      "¿Tiene mucha dificultad para esperar su turno?",
      "¿Toca cosas sin permiso o actúa antes de pedir autorización?",
      "¿Hace cosas sin pensar en la seguridad o en las consecuencias?",
      "¿Se desespera con facilidad en filas, cambios de actividad o esperas cortas?"
    ]
  },
  {
    id: "C",
    title: "Sección C - Escuela y Organización",
    meta: "Tareas, materiales y rendimiento",
    items: [
      "¿Olvida llevar o devolver tareas, cuadernos o materiales escolares?",
      "¿Mantiene mochila, escritorio o área de estudio muy desordenados?",
      "¿Subestima el tiempo necesario para terminar tareas o trabajos?",
      "¿Necesita supervisión constante para empezar los deberes?",
      "¿Se bloquea cuando debe organizar un proyecto o una tarea con varios pasos?",
      "¿Deja tareas para última hora aunque haya tenido tiempo suficiente?",
      "¿Le cuesta copiar instrucciones completas del pizarrón o cuaderno?",
      "¿Pasa de un ejercicio a otro sin terminar el primero?",
      "¿Pierde puntos por no leer bien las instrucciones completas?",
      "¿Su rendimiento baja por distracciones más que por falta de capacidad?",
      "¿Olvida entregar tareas aun cuando ya están hechas?",
      "¿Necesita ayuda extra para seguir la rutina de mañana o prepararse para la escuela?"
    ]
  },
  {
    id: "D",
    title: "Sección D - Autorregulación y Convivencia",
    meta: "Emociones, reglas y relaciones",
    items: [
      "¿Se frustra muy rápido ante correcciones o pequeños errores?",
      "¿Tiene cambios bruscos de humor cuando se le interrumpe o limita?",
      "¿Le cuesta detener una conducta aunque ya se le haya pedido varias veces?",
      "¿Invade el espacio personal de otros niños o adultos sin darse cuenta?",
      "¿Tiene dificultad para respetar reglas en juegos grupales?",
      "¿Discute o se mete en problemas por impaciencia o interrupciones?",
      "¿Olvida acuerdos o reglas de casa poco después de haberlos hablado?",
      "¿Dice o hace cosas sin pensar si pueden molestar a otros?",
      "¿Reacciona con intensidad excesiva ante frustraciones pequeñas?",
      "¿Tiene dificultad para hacer transiciones tranquilas entre juego, comida, estudio o sueño?",
      "¿Los adultos deben redirigirlo muchas veces al día para que retome lo que estaba haciendo?",
      "¿Sus amistades o su convivencia se ven afectadas por impulsividad, distracción o inquietud?"
    ]
  },
  {
    id: "E",
    title: "Sección E - Persistencia Clínica",
    meta: "Casa, escuela y consistencia del patrón",
    items: [
      "¿Estas dificultades aparecen de forma repetida en casa?",
      "¿Estas dificultades también aparecen en la escuela o colegio?",
      "¿Se observan también en actividades con familiares, visitas, deportes o grupos?",
      "¿Más de un adulto nota el mismo patrón de dificultades?",
      "¿Estas conductas llevan presentes 6 meses o más?",
      "¿Ya se notaban antes de los 12 años?",
      "¿Parecen más intensas que en otros niños de su misma edad?",
      "¿Afectan el aprendizaje, las calificaciones o el trabajo escolar?",
      "¿Afectan amistades, juegos en grupo o relaciones con compañeros?",
      "¿Complican las rutinas familiares diarias o el cumplimiento de reglas?",
      "¿Siguen apareciendo incluso cuando duerme bien y tiene una rutina estable?",
      "¿Forman un patrón constante y no solo episodios aislados?"
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

let currentIndex = 0;
let answers = Array(questions.length).fill(null);

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const currentEl = document.getElementById("current");
const totalQuestionsEl = document.getElementById("totalQuestions");
const progressEl = document.getElementById("progress");
const sectionNameEl = document.getElementById("sectionName");
const questionMetaEl = document.getElementById("questionMeta");
const answeredCountEl = document.getElementById("answeredCount");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const viewResultsBtn = document.getElementById("viewResultsBtn");
const resultEl = document.getElementById("result");
const quizCardEl = document.getElementById("quizCard");
const guardianDisclaimerEl = document.getElementById("guardianDisclaimer");
const closeGuardianDisclaimerBtn = document.getElementById("closeGuardianDisclaimer");
const desktopViewport = window.matchMedia("(min-width: 1024px)");

totalQuestionsEl.textContent = questions.length;

function countAnswered() {
  return answers.filter((answer) => answer !== null).length;
}

function isTestComplete() {
  return countAnswered() === questions.length;
}

function syncDesktopScroll() {
  const disclaimerVisible = Boolean(guardianDisclaimerEl && !guardianDisclaimerEl.classList.contains("hidden"));
  document.body.classList.toggle("disclaimer-open", disclaimerVisible);
  const shouldLockScroll = disclaimerVisible || (desktopViewport.matches && resultEl.classList.contains("hidden"));
  document.body.classList.toggle("quiz-lock-scroll", shouldLockScroll);
}

function closeGuardianDisclaimer() {
  if (!guardianDisclaimerEl) {
    return;
  }

  guardianDisclaimerEl.classList.add("hidden");
  syncDesktopScroll();
}

function scoreTone(score) {
  if (score <= 35) {
    return {
      shortLabel: "Normal",
      fillClass: "bg-blue-600",
      borderClass: "border-blue-400",
      surfaceClass: "border-blue-500/40 bg-blue-950/30",
      titleClass: "text-blue-100",
      metaClass: "text-blue-200/75",
      scoreClass: "text-blue-300",
      chipClass: "border-blue-400/30 bg-blue-500/10 text-blue-200"
    };
  }

  if (score <= 45) {
    return {
      shortLabel: "Ligero",
      fillClass: "bg-green-600",
      borderClass: "border-green-400",
      surfaceClass: "border-green-500/40 bg-green-950/25",
      titleClass: "text-green-100",
      metaClass: "text-green-200/75",
      scoreClass: "text-green-300",
      chipClass: "border-green-400/30 bg-green-500/10 text-green-200"
    };
  }

  if (score <= 60) {
    return {
      shortLabel: "Elevado",
      fillClass: "bg-orange-600",
      borderClass: "border-orange-400",
      surfaceClass: "border-orange-500/40 bg-orange-950/25",
      titleClass: "text-orange-100",
      metaClass: "text-orange-200/75",
      scoreClass: "text-orange-300",
      chipClass: "border-orange-400/30 bg-orange-500/10 text-orange-200"
    };
  }

  return {
    shortLabel: "Severo",
    fillClass: "bg-red-600",
    borderClass: "border-red-400",
    surfaceClass: "border-red-500/40 bg-red-950/25",
    titleClass: "text-red-100",
    metaClass: "text-red-200/75",
    scoreClass: "text-red-300",
    chipClass: "border-red-400/30 bg-red-500/10 text-red-200"
  };
}

function resultBand(score, subtype = "TDAH") {
  const tone = scoreTone(score);

  if (score <= 35) {
    return {
      label: "Normal (sin TDA o TDAH)",
      description: "El puntaje se mantiene en rango normal para este cribado infantil, sin señales marcadas de TDA o TDAH.",
      ...tone
    };
  }

  if (score <= 45) {
    return {
      label: `${subtype} ligero`,
      description: `El cribado cae en una franja ligera compatible con ${subtype} y conviene confirmarlo con una evaluacion profesional infantil.`,
      ...tone
    };
  }

  if (score <= 60) {
    return {
      label: subtype,
      description: `El cribado marca un diagnostico orientativo de ${subtype} y conviene una evaluacion profesional infantil para confirmarlo.`,
      ...tone
    };
  }

  return {
    label: `${subtype} severo`,
    description: `El puntaje sale muy alto para este cribado y marca un diagnostico orientativo severo de ${subtype}, por lo que amerita evaluacion profesional prioritaria.`,
    ...tone
  };
}

function inferSubtype(metrics) {
  const { attention, hyperactivity, school, regulation } = metrics;
  const attentionLead = attention - hyperactivity;

  if (attentionLead >= 10) {
    return "TDA";
  }

  if (attentionLead >= 6 && school >= regulation) {
    return "TDA";
  }

  return "TDAH";
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
  const school = sectionMap.C.normalized;
  const regulation = sectionMap.D.normalized;
  const contexts = sectionMap.E.normalized;
  const metrics = {
    attention,
    hyperactivity,
    school,
    regulation,
    contexts
  };
  const subtype = finalScore <= 35 ? null : inferSubtype(metrics);
  const attentionHigh = attention >= 46;
  const hyperactivityHigh = hyperactivity >= 46;
  const schoolHigh = school >= 46;
  const regulationHigh = regulation >= 46;
  const supportStrong = school >= 46 && contexts >= 46;
  const supportPartial = school >= 36 || contexts >= 36;
  const tone = scoreTone(Math.max(finalScore, attention, hyperactivity, school, regulation));
  let label = "Perfil orientativo sin subtipo claro";
  let description = "El resultado no separa con claridad un patrón predominantemente inatento o hiperactivo.";

  if (finalScore <= 35 && !attentionHigh && !hyperactivityHigh) {
    label = "Sin señales claras de TDA / TDAH infantil";
    description = "El cribado no muestra un patrón relevante de inatención ni de hiperactividad/impulsividad para la edad.";
  } else if (finalScore <= 45) {
    if (attention > hyperactivity + 8) {
      label = "Rasgos leves con predominio inatento";
      description = "Aparecen señales leves centradas más en atención, escucha y seguimiento que en inquietud motora.";
    } else if (hyperactivity > attention + 8) {
      label = "Rasgos leves con predominio hiperactivo";
      description = "Aparecen señales leves centradas más en hiperactividad, impulsividad y espera que en atención sostenida.";
    } else {
      label = "Rasgos leves mixtos";
      description = "Hay señales leves repartidas entre atención e impulsividad, todavía sin un patrón fuerte.";
    }
  } else if (attentionHigh && hyperactivityHigh) {
    label = "Perfil orientativo: TDAH combinado infantil";
    description = "Se elevan tanto la inatención como la hiperactividad/impulsividad en el cribado.";
  } else if (attentionHigh) {
    label = "Perfil orientativo: TDA infantil con predominio inatento";
    description = "Predominan las dificultades de atención, seguimiento y organización frente a la inquietud motora.";
  } else if (hyperactivityHigh) {
    label = "Perfil orientativo: TDAH infantil con predominio hiperactivo/impulsivo";
    description = "Predominan la inquietud, la impulsividad y la dificultad para esperar o frenarse.";
  } else if (schoolHigh) {
    label = "Rasgos relevantes con impacto escolar";
    description = "El impacto en tareas, materiales y rendimiento escolar sale especialmente elevado.";
  } else if (attention >= 36 || hyperactivity >= 36) {
    label = "Rasgos parciales sin predominio firme";
    description = "Hay elevación parcial en atención o hiperactividad, pero todavía sin un subtipo claro.";
  }

  let supportText = "La confirmación del patrón debe revisar casa, escuela y el impacto funcional para la edad.";

  if (supportStrong) {
    supportText = "Además, el impacto escolar y la presencia en varios entornos también salen elevadas, lo que refuerza la conveniencia de valoración pediátrica o psicológica.";
  } else if (supportPartial) {
    supportText = "El impacto escolar o la presencia en varios entornos muestran señales parciales, así que conviene contrastarlo con familia y escuela.";
  } else if (finalScore > 45) {
    supportText = "Aunque el puntaje general es alto, todavía hace falta confirmar que el patrón se sostenga en distintos entornos.";
  }

  if (regulationHigh) {
    supportText += " También aparecen dificultades de autorregulación y convivencia.";
  }

  return {
    label,
    description: `${description} ${supportText}`,
    tone,
    subtype,
    metrics
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
  const currentAnswered = answers[currentIndex] !== null;
  const complete = isTestComplete();

  questionEl.textContent = currentQuestion.text;
  currentEl.textContent = currentIndex + 1;
  sectionNameEl.textContent = currentQuestion.title;
  questionMetaEl.textContent = currentQuestion.meta;
  answeredCountEl.textContent = `${answered} respondidas`;
  progressEl.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

  optionsEl.innerHTML = "";

  options.forEach((option) => {
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

    button.setAttribute("aria-pressed", String(selected));
    button.innerHTML = `
      <span class="text-base font-semibold sm:text-lg">${option.label}</span>
    `;

    button.addEventListener("click", () => {
      answers[currentIndex] = option.value;
      hideResult();
      renderQuestion();
    });

    optionsEl.appendChild(button);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = !currentAnswered || currentIndex === questions.length - 1;
  nextBtn.textContent =
    currentIndex === questions.length - 1
      ? currentAnswered
        ? "Completado"
        : "Ultima pregunta"
      : "Siguiente";

  if (viewResultsBtn) {
    viewResultsBtn.disabled = !complete;
  }
}

function showResult() {
  if (!isTestComplete()) {
    return;
  }

  const totalRaw = answers.reduce((sum, value) => sum + value, 0);
  const maxRaw = questions.length * 4;
  const finalScore = Math.round((totalRaw / maxRaw) * 100);
  const sections = sectionScores();
  const profile = profileInterpretation(finalScore, sections);
  const band = resultBand(finalScore, profile.subtype || "TDAH");

  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `
    <h2 class="text-2xl font-bold sm:text-3xl">Resultado</h2>

    <div class="mt-5 rounded-3xl border ${band.borderClass} ${band.fillClass} p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.2em] text-white/80">Diagnostico</p>
          <p class="mt-2 text-2xl font-bold sm:text-3xl">${band.label}</p>
        </div>
        <div class="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-right">
          <p class="text-xs uppercase tracking-[0.18em] text-white/70">Puntaje final</p>
          <p class="mt-2 text-3xl font-bold sm:text-4xl">${finalScore}/100</p>
        </div>
      </div>
      <p class="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">${band.description}</p>
    </div>

    <div class="mt-4 rounded-3xl border ${profile.tone.surfaceClass} p-5">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-sm uppercase tracking-[0.2em] ${profile.tone.metaClass}">Perfil orientativo infantil</p>
          <p class="mt-2 text-xl font-bold ${profile.tone.titleClass}">${profile.label}</p>
        </div>
        <span class="rounded-full border px-3 py-1 text-xs font-semibold ${profile.tone.chipClass}">
          ${profile.tone.shortLabel}
        </span>
      </div>
      <p class="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">${profile.description}</p>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div class="rounded-2xl bg-slate-950/25 p-3">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Atención</p>
          <p class="mt-2 text-2xl font-bold ${sections[0].tone.scoreClass}">${profile.metrics.attention}/100</p>
        </div>
        <div class="rounded-2xl bg-slate-950/25 p-3">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Hiperactividad</p>
          <p class="mt-2 text-2xl font-bold ${sections[1].tone.scoreClass}">${profile.metrics.hyperactivity}/100</p>
        </div>
        <div class="rounded-2xl bg-slate-950/25 p-3">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Escuela</p>
          <p class="mt-2 text-2xl font-bold ${sections[2].tone.scoreClass}">${profile.metrics.school}/100</p>
        </div>
        <div class="rounded-2xl bg-slate-950/25 p-3">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Regulación</p>
          <p class="mt-2 text-2xl font-bold ${sections[3].tone.scoreClass}">${profile.metrics.regulation}/100</p>
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
          <span class="h-4 w-4 rounded-full bg-blue-500"></span>
          <p class="text-sm text-slate-200">0 a 35 puntos: Normal (sin TDA o TDAH)</p>
        </div>
        <div class="grid grid-cols-[auto,1fr] items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
          <span class="h-4 w-4 rounded-full bg-green-500"></span>
          <p class="text-sm text-slate-200">36 a 45 puntos: TDA o TDAH ligero</p>
        </div>
        <div class="grid grid-cols-[auto,1fr] items-center gap-3 border-b border-slate-800 bg-slate-800/60 px-4 py-3">
          <span class="h-4 w-4 rounded-full bg-orange-500"></span>
          <p class="text-sm text-slate-200">46 a 60 puntos: TDA o TDAH</p>
        </div>
        <div class="grid grid-cols-[auto,1fr] items-center gap-3 bg-slate-900 px-4 py-3">
          <span class="h-4 w-4 rounded-full bg-red-500"></span>
          <p class="text-sm text-slate-200">61 a 100 puntos: TDA o TDAH severo</p>
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
      Este cuestionario es un cribado observacional para niños y adolescentes menores de 15 años. No reemplaza una valoración pediátrica,
      psicológica o neuropsicológica. Un diagnóstico profesional debe confirmar duración, presencia en más de un entorno, impacto escolar y social,
      y descartar otras causas.
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-2">
      <button id="reviewBtn" type="button" class="touch-target rounded-2xl bg-slate-800 px-4 py-4 text-base font-semibold text-white">
        Revisar respuestas
      </button>
      <button id="restartBtn" type="button" class="touch-target rounded-2xl bg-white px-4 py-4 text-base font-bold text-slate-950">
        Repetir test
      </button>
    </div>
  `;

  const reviewBtn = document.getElementById("reviewBtn");
  const restartBtn = document.getElementById("restartBtn");

  syncDesktopScroll();

  reviewBtn.addEventListener("click", () => {
    quizCardEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  restartBtn.addEventListener("click", restartTest);
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function restartTest() {
  currentIndex = 0;
  answers = Array(questions.length).fill(null);
  hideResult();
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

prevBtn.addEventListener("click", () => {
  if (currentIndex === 0) {
    return;
  }

  currentIndex -= 1;
  hideResult();
  renderQuestion();
  quizCardEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

nextBtn.addEventListener("click", () => {
  if (answers[currentIndex] === null) {
    return;
  }

  if (currentIndex === questions.length - 1) {
    return;
  }

  currentIndex += 1;
  hideResult();
  renderQuestion();
  quizCardEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

if (viewResultsBtn) {
  viewResultsBtn.addEventListener("click", () => {
    if (!isTestComplete()) {
      return;
    }

    showResult();
  });
}

if (typeof desktopViewport.addEventListener === "function") {
  desktopViewport.addEventListener("change", syncDesktopScroll);
} else {
  desktopViewport.addListener(syncDesktopScroll);
}

if (closeGuardianDisclaimerBtn) {
  closeGuardianDisclaimerBtn.addEventListener("click", closeGuardianDisclaimer);
}

renderQuestion();
syncDesktopScroll();
