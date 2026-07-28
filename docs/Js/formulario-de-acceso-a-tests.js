"use strict";

const ADULT_AGE = 18;
const MAX_AGE = 120;
const DEFAULT_TEST_NAME = "TDAH";
const DEFAULT_ADULT_PATH = "./TDA/Examenes/test-gratuito-de-tdah-para-adultos.html";
const DEFAULT_CHILD_PATH = "./TDA/Examenes/test-gratuito-de-tdah-en-niños.html";

const form = document.querySelector("#access-form");
const nameInput = document.querySelector("#name");
const genderSelect = document.querySelector("#gender");
const daySelect = document.querySelector("#birth-day");
const monthSelect = document.querySelector("#birth-month");
const yearSelect = document.querySelector("#birth-year");
const guardianConfirmation = document.querySelector("#guardian-confirmation");
const guardianCheck = document.querySelector("#guardian-check");
const ageNotice = document.querySelector("#age-notice");
const formError = document.querySelector("#form-error");
const continueButton = document.querySelector("#continue-button");
const pageTitle = document.querySelector("#page-title");

const searchParams = new URLSearchParams(window.location.search);
const testName = cleanTestName(searchParams.get("test")) || DEFAULT_TEST_NAME;
const testAudience = cleanAudience(searchParams.get("tipo"));
const adultPath = safeRelativePath(searchParams.get("adulto")) || DEFAULT_ADULT_PATH;
const childPath = safeRelativePath(searchParams.get("infantil")) || DEFAULT_CHILD_PATH;

const audienceLabel =
  testAudience === "adulto" ? " para adultos" :
  testAudience === "infantil" ? " infantil" :
  "";
pageTitle.textContent = `Antes de comenzar el test de ${testName}${audienceLabel}`;

populateDateSelects();
form.addEventListener("input", updateFormState);
form.addEventListener("change", updateFormState);
form.addEventListener("submit", handleSubmit);
updateFormState();

function populateDateSelects() {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  for (let day = 1; day <= 31; day += 1) {
    daySelect.add(new Option(String(day), String(day)));
  }

  months.forEach((month, index) => {
    monthSelect.add(new Option(month, String(index + 1)));
  });

  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - MAX_AGE; year -= 1) {
    yearSelect.add(new Option(String(year), String(year)));
  }
}

function getBirthDate() {
  const day = Number(daySelect.value);
  const month = Number(monthSelect.value);
  const year = Number(yearSelect.value);

  if (!day || !month || !year) {
    return null;
  }

  const birthDate = new Date(year, month - 1, day);
  const isRealDate =
    birthDate.getFullYear() === year &&
    birthDate.getMonth() === month - 1 &&
    birthDate.getDate() === day;

  if (!isRealDate || birthDate > new Date()) {
    return null;
  }

  return birthDate;
}

function getAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!birthdayHasPassed) {
    age -= 1;
  }

  return age;
}

function hasValidName() {
  return nameInput.value.trim().length >= 2;
}

function getFormState() {
  const birthDate = getBirthDate();
  const age = birthDate ? getAge(birthDate) : null;
  const commonFieldsComplete =
    hasValidName() &&
    Boolean(genderSelect.value) &&
    Boolean(daySelect.value) &&
    Boolean(monthSelect.value) &&
    Boolean(yearSelect.value);
  const validAge = age !== null && age >= 0 && age <= MAX_AGE;
  const audienceValid = testAudience === "adulto" || testAudience === "infantil";
  const isAdult = testAudience === "adulto" && validAge && age >= ADULT_AGE;
  const isMinorInAdultTest = testAudience === "adulto" && validAge && age < ADULT_AGE;
  const isMinor = testAudience === "infantil" && validAge && age < ADULT_AGE;
  const isAdultInChildTest = testAudience === "infantil" && validAge && age >= ADULT_AGE;

  return {
    age,
    birthDate,
    commonFieldsComplete,
    validAge,
    audienceValid,
    isAdult,
    isMinorInAdultTest,
    isMinor,
    isAdultInChildTest,
    canContinue:
      commonFieldsComplete &&
      audienceValid &&
      (isAdult || (isMinor && guardianCheck.checked))
  };
}

function updateFormState() {
  const state = getFormState();
  const childSelected = testAudience === "infantil";

  guardianConfirmation.hidden = !childSelected;
  guardianCheck.required = childSelected;

  if (!childSelected) {
    guardianCheck.checked = false;
  }

  ageNotice.hidden = !state.isMinorInAdultTest;
  formError.hidden = true;
  formError.textContent = "";
  continueButton.disabled = !state.canContinue;

  if (!state.audienceValid) {
    formError.textContent = "Selecciona una evaluación desde la pantalla anterior.";
    formError.hidden = false;
    continueButton.textContent = "Selecciona una evaluación";
  } else if (state.isAdult) {
    continueButton.textContent = "Ir al test de adultos";
  } else if (state.isMinor) {
    continueButton.textContent = "Ir al test infantil";
  } else if (state.isAdultInChildTest) {
    continueButton.textContent = "Seleccionaste un test infantil";
  } else if (state.isMinorInAdultTest) {
    continueButton.textContent = "Seleccionaste un test para adultos";
  } else {
    continueButton.textContent = "Completa el formulario";
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const state = getFormState();

  if (!state.birthDate && daySelect.value && monthSelect.value && yearSelect.value) {
    showError("La fecha de nacimiento no es válida. Revísala antes de continuar.");
    return;
  }

  if (!state.audienceValid) {
    showError("Selecciona una evaluación desde la pantalla anterior.");
    return;
  }

  if (state.isMinorInAdultTest) {
    showError("La evaluación seleccionada es para adultos. Pide ayuda a tu padre, madre o tutor.");
    return;
  }

  if (state.isAdultInChildTest) {
    showError("La evaluación seleccionada es infantil. Regresa y selecciona el test para adultos.");
    return;
  }

  if (!state.canContinue) {
    showError("Completa todos los campos y las confirmaciones requeridas.");
    return;
  }

  window.location.assign(state.isAdult ? adultPath : childPath);
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
  formError.focus?.();
}

function cleanTestName(value) {
  if (!value) {
    return "";
  }

  return value.replace(/[<>]/g, "").trim().slice(0, 50);
}

function cleanAudience(value) {
  return value === "adulto" || value === "infantil" ? value : "";
}

function safeRelativePath(value) {
  if (!value) {
    return "";
  }

  const path = value.trim();
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(path);
  const isProtocolRelative = path.startsWith("//");

  return hasScheme || isProtocolRelative ? "" : path;
}
