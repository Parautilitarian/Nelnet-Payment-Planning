export const LANG_STORAGE_KEY = "payment-comparison-lang";

export const languages = {
  en: "English",
  "zh-Hans": "简体中文",
  "zh-Hant": "繁體中文",
  es: "Español",
};

/** @type {Record<string, Record<string, string>>} */
export const strings = {
  en: {
    pageTitle: "Pay Now vs Pay Later",
    heading: "Pay Now vs Pay Later",
    subtitle: "Compare paying in full today vs a Nelnet-style installment plan.",
    languageLabel: "Language",
    principal: "Principal ($)",
    scholarship: "Scholarship (%)",
    scholarshipHint: "Percentage of principal deducted before calculations",
    payNowDate: "Pay-now date",
    installmentCount: "Number of installments",
    installmentDatesLegend: "Installment dates",
    installmentDatesHint: "First defaults to pay-now date; others are monthly. Amounts are principal only — plan interest is added to each payment.",
    installmentDate: "Date",
    installmentAmount: "Amount ($)",
    installmentAmountHint: "Principal portion per installment (plan interest is added on top)",
    discountRate: "Discount rate (%)",
    discountRateHint: "Your opportunity-cost / risk-free rate",
    planInterestRate: "Plan interest rate (%)",
    planInterestRateHint: "Pay-later plan rate",
    setupFee: "Setup fee ($)",
    setupFeeDate: "Setup fee date",
    setupFeeDateHint: "Leave blank to use pay-now date",
    compareButton: "Compare",
    installment: "Installment {n}",
    resultPayNowBetter: "Pay Now is the better option",
    resultPayLaterBetter: "Pay Later is the better option",
    resultEqual: "Both options are equal",
    resultHeader: "Result: {option}",
    principalResult: "Principal:",
    scholarshipResult: "Scholarship ({pct}%):",
    amountCompared: "Amount compared:",
    pvPayNow: "PV if pay now:",
    pvPayLater: "PV if pay later:",
    gainIfPayLater: "Gain if pay later:",
    lossIfPayLater: "Loss if pay later:",
    payLaterSchedule: "Pay-later schedule",
    tableDate: "Date",
    tableAmount: "Amount",
    providerScheduleLabel: "Provider schedule",
  },
  "zh-Hans": {
    pageTitle: "立即付款 vs 分期付款",
    heading: "立即付款 vs 分期付款",
    subtitle: "比较今日一次性付清学费与 Nelnet 式分期付款方案。",
    languageLabel: "语言",
    principal: "学费总额 ($)",
    scholarship: "奖学金 (%)",
    scholarshipHint: "从总额中扣除的奖学金比例",
    payNowDate: "一次性付款日期",
    installmentCount: "分期期数",
    installmentDatesLegend: "各期付款日期",
    installmentDatesHint: "第一期默认为一次性付款日期；其余按月递增。金额为每期本金，计划利息另计。",
    installmentDate: "日期",
    installmentAmount: "金额 ($)",
    installmentAmountHint: "每期本金（计划利息另计并加入该期付款）",
    discountRate: "贴现率 (%)",
    discountRateHint: "您的机会成本 / 无风险收益率",
    planInterestRate: "分期计划利率 (%)",
    planInterestRateHint: "分期付款计划的利率",
    setupFee: "设置费 ($)",
    setupFeeDate: "设置费日期",
    setupFeeDateHint: "留空则使用一次性付款日期",
    compareButton: "比较",
    installment: "第 {n} 期",
    resultPayNowBetter: "立即付款更划算",
    resultPayLaterBetter: "分期付款更划算",
    resultEqual: "两种方案相当",
    resultHeader: "结果：{option}",
    principalResult: "学费总额：",
    scholarshipResult: "奖学金 ({pct}%)：",
    amountCompared: "比较金额：",
    pvPayNow: "立即付款现值：",
    pvPayLater: "分期付款现值：",
    gainIfPayLater: "分期付款收益：",
    lossIfPayLater: "分期付款损失：",
    payLaterSchedule: "分期付款计划",
    tableDate: "日期",
    tableAmount: "金额",
    providerScheduleLabel: "提供商计划",
  },
  "zh-Hant": {
    pageTitle: "立即付款 vs 分期付款",
    heading: "立即付款 vs 分期付款",
    subtitle: "比較今日一次性付清學費與 Nelnet 式分期付款方案。",
    languageLabel: "語言",
    principal: "學費總額 ($)",
    scholarship: "獎學金 (%)",
    scholarshipHint: "從總額中扣除的獎學金比例",
    payNowDate: "一次性付款日期",
    installmentCount: "分期期數",
    installmentDatesLegend: "各期付款日期",
    installmentDatesHint: "第一期預設為一次性付款日期；其餘按月遞增。金額為每期本金，計劃利息另計。",
    installmentDate: "日期",
    installmentAmount: "金額 ($)",
    installmentAmountHint: "每期本金（計劃利息另計並加入該期付款）",
    discountRate: "貼現率 (%)",
    discountRateHint: "您的機會成本 / 無風險收益率",
    planInterestRate: "分期計劃利率 (%)",
    planInterestRateHint: "分期付款計劃的利率",
    setupFee: "設定費 ($)",
    setupFeeDate: "設定費日期",
    setupFeeDateHint: "留空則使用一次性付款日期",
    compareButton: "比較",
    installment: "第 {n} 期",
    resultPayNowBetter: "立即付款更划算",
    resultPayLaterBetter: "分期付款更划算",
    resultEqual: "兩種方案相當",
    resultHeader: "結果：{option}",
    principalResult: "學費總額：",
    scholarshipResult: "獎學金 ({pct}%)：",
    amountCompared: "比較金額：",
    pvPayNow: "立即付款現值：",
    pvPayLater: "分期付款現值：",
    gainIfPayLater: "分期付款收益：",
    lossIfPayLater: "分期付款損失：",
    payLaterSchedule: "分期付款計劃",
    tableDate: "日期",
    tableAmount: "金額",
    providerScheduleLabel: "提供商計劃",
  },
  es: {
    pageTitle: "Pagar ahora vs pagar después",
    heading: "Pagar ahora vs pagar después",
    subtitle:
      "Compare pagar la matrícula completa hoy vs un plan de pagos tipo Nelnet.",
    languageLabel: "Idioma",
    principal: "Principal ($)",
    scholarship: "Beca (%)",
    scholarshipHint: "Porcentaje del principal deducido antes de los cálculos",
    payNowDate: "Fecha de pago completo",
    installmentCount: "Número de cuotas",
    installmentDatesLegend: "Fechas de las cuotas",
    installmentDatesHint:
      "La primera coincide con la fecha de pago completo; las demás son mensuales. Los montos son solo principal; el interés del plan se suma a cada pago.",
    installmentDate: "Fecha",
    installmentAmount: "Monto ($)",
    installmentAmountHint: "Porción de principal por cuota (el interés del plan se suma al pago)",
    discountRate: "Tasa de descuento (%)",
    discountRateHint: "Su costo de oportunidad / tasa libre de riesgo",
    planInterestRate: "Tasa de interés del plan (%)",
    planInterestRateHint: "Tasa del plan de pagos diferidos",
    setupFee: "Tarifa de inscripción ($)",
    setupFeeDate: "Fecha de la tarifa de inscripción",
    setupFeeDateHint: "Dejar en blanco para usar la fecha de pago completo",
    compareButton: "Comparar",
    installment: "Cuota {n}",
    resultPayNowBetter: "Pagar ahora es la mejor opción",
    resultPayLaterBetter: "Pagar después es la mejor opción",
    resultEqual: "Ambas opciones son equivalentes",
    resultHeader: "Resultado: {option}",
    principalResult: "Principal:",
    scholarshipResult: "Beca ({pct}%):",
    amountCompared: "Monto comparado:",
    pvPayNow: "VP si paga ahora:",
    pvPayLater: "VP si paga después:",
    gainIfPayLater: "Ganancia si paga después:",
    lossIfPayLater: "Pérdida si paga después:",
    payLaterSchedule: "Calendario de pagos diferidos",
    tableDate: "Fecha",
    tableAmount: "Monto",
    providerScheduleLabel: "Calendario del proveedor",
  },
};

/** @type {Record<string, string>} */
export const errorStrings = {
  "At least one installment date is required.": "error.installmentRequired",
  "The first installment cannot be before the pay-now date. The first installment may be on the same day.":
    "error.firstInstallmentBeforePayNow",
  "Cash flow dates must be on or after the pay-now date.":
    "error.cashFlowBeforePayNow",
  "Setup fee date cannot be before the pay-now date.":
    "error.setupFeeBeforePayNow",
  "Provide both pay_later_amounts and pay_later_dates, or neither.":
    "error.providerScheduleBoth",
  "pay_later_amounts and pay_later_dates must match in length.":
    "error.providerScheduleLength",
  "Scholarship must be between 0% and 100%.": "error.scholarshipRange",
  "Scholarship leaves no principal to compare.":
    "error.scholarshipZeroPrincipal",
  "Installment amounts and dates must match in length.":
    "error.installmentAmountLength",
  "Installment amounts must sum to the amount compared (before interest).":
    "error.installmentAmountSum",
};

/** @type {Record<string, Record<string, string>>} */
const errorMessages = {
  en: {
    "error.installmentRequired": "At least one installment date is required.",
    "error.firstInstallmentBeforePayNow":
      "The first installment cannot be before the pay-now date. The first installment may be on the same day.",
    "error.installmentBeforePayNow":
      "{label} cannot be before the pay-now date. The first installment may be on the same day.",
    "error.flowBeforePayNow":
      "{label} date {n} cannot be before the pay-now date.",
    "error.cashFlowBeforePayNow":
      "Cash flow dates must be on or after the pay-now date.",
    "error.setupFeeBeforePayNow":
      "Setup fee date cannot be before the pay-now date.",
    "error.providerScheduleBoth":
      "Provide both pay_later_amounts and pay_later_dates, or neither.",
    "error.providerScheduleLength":
      "pay_later_amounts and pay_later_dates must match in length.",
    "error.scholarshipRange": "Scholarship must be between 0% and 100%.",
    "error.scholarshipZeroPrincipal":
      "Scholarship leaves no principal to compare.",
    "error.installmentAmountLength":
      "Installment amounts and dates must match in length.",
    "error.installmentAmountSum":
      "Installment amounts must sum to the amount compared (before interest).",
  },
  "zh-Hans": {
    "error.installmentRequired": "至少需要一个分期付款日期。",
    "error.firstInstallmentBeforePayNow":
      "第一期不能早于一次性付款日期。第一期可以与一次性付款日期相同。",
    "error.installmentBeforePayNow":
      "{label}不能早于一次性付款日期。第一期可以与一次性付款日期相同。",
    "error.flowBeforePayNow":
      "{label}日期 {n} 不能早于一次性付款日期。",
    "error.cashFlowBeforePayNow":
      "现金流日期不能早于一次性付款日期。",
    "error.setupFeeBeforePayNow":
      "设置费日期不能早于一次性付款日期。",
    "error.providerScheduleBoth":
      "请同时提供提供商金额和日期，或两者都不填。",
    "error.providerScheduleLength":
      "提供商金额和日期的行数必须一致。",
    "error.scholarshipRange": "奖学金比例须在 0% 至 100% 之间。",
    "error.scholarshipZeroPrincipal": "奖学金扣除后没有可比较的金额。",
    "error.installmentAmountLength": "分期金额和日期的数量必须一致。",
    "error.installmentAmountSum": "分期金额之和须等于比较金额（不含利息）。",
  },
  "zh-Hant": {
    "error.installmentRequired": "至少需要一個分期付款日期。",
    "error.firstInstallmentBeforePayNow":
      "第一期不能早於一次性付款日期。第一期可以與一次性付款日期相同。",
    "error.installmentBeforePayNow":
      "{label}不能早於一次性付款日期。第一期可以與一次性付款日期相同。",
    "error.flowBeforePayNow":
      "{label}日期 {n} 不能早於一次性付款日期。",
    "error.cashFlowBeforePayNow":
      "現金流日期不能早於一次性付款日期。",
    "error.setupFeeBeforePayNow":
      "設定費日期不能早於一次性付款日期。",
    "error.providerScheduleBoth":
      "請同時提供提供商金額和日期，或兩者都不填。",
    "error.providerScheduleLength":
      "提供商金額和日期的行數必須一致。",
    "error.scholarshipRange": "獎學金比例須在 0% 至 100% 之間。",
    "error.scholarshipZeroPrincipal": "獎學金扣除後沒有可比較的金額。",
    "error.installmentAmountLength": "分期金額和日期的數量必須一致。",
    "error.installmentAmountSum": "分期金額之和須等於比較金額（不含利息）。",
  },
  es: {
    "error.installmentRequired": "Se requiere al menos una fecha de cuota.",
    "error.firstInstallmentBeforePayNow":
      "La primera cuota no puede ser anterior a la fecha de pago completo. La primera cuota puede ser el mismo día.",
    "error.installmentBeforePayNow":
      "{label} no puede ser anterior a la fecha de pago completo. La primera cuota puede ser el mismo día.",
    "error.flowBeforePayNow":
      "La fecha {n} de {label} no puede ser anterior a la fecha de pago completo.",
    "error.cashFlowBeforePayNow":
      "Las fechas de flujo de caja deben ser iguales o posteriores a la fecha de pago completo.",
    "error.setupFeeBeforePayNow":
      "La fecha de la tarifa de inscripción no puede ser anterior a la fecha de pago completo.",
    "error.providerScheduleBoth":
      "Proporcione montos y fechas del proveedor, o ninguno de los dos.",
    "error.providerScheduleLength":
      "Los montos y fechas del proveedor deben tener la misma cantidad de líneas.",
    "error.scholarshipRange": "La beca debe estar entre 0% y 100%.",
    "error.scholarshipZeroPrincipal":
      "La beca deja ningún principal para comparar.",
    "error.installmentAmountLength":
      "Los montos y fechas de las cuotas deben coincidir en cantidad.",
    "error.installmentAmountSum":
      "Los montos de las cuotas deben sumar el monto comparado (sin intereses).",
  },
};

export function getLang() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return stored && stored in strings ? stored : "en";
}

/** @param {string} lang */
export function setLang(lang) {
  if (lang in strings) {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }
}

/**
 * @param {string} lang
 * @param {string} key
 * @param {Record<string, string | number>} [vars]
 */
export function t(lang, key, vars = {}) {
  const table = strings[lang] ?? strings.en;
  let text = table[key] ?? strings.en[key] ?? key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replace(`{${name}}`, String(value));
  }
  return text;
}

/** @param {string} lang @param {string} message */
export function translateError(lang, message) {
  const key = errorStrings[message];
  if (key) {
    return errorMessages[lang]?.[key] ?? errorMessages.en[key] ?? message;
  }

  if (
    message ===
    "The first installment cannot be before the pay-now date. The first installment may be on the same day."
  ) {
    return (
      errorMessages[lang]?.["error.firstInstallmentBeforePayNow"] ??
      errorMessages.en["error.firstInstallmentBeforePayNow"]
    );
  }

  const installmentMatch = message.match(
    /^Installment (\d+) cannot be before the pay-now date\. The first installment may be on the same day\.$/
  );
  if (installmentMatch) {
    const template =
      errorMessages[lang]?.["error.installmentBeforePayNow"] ??
      errorMessages.en["error.installmentBeforePayNow"];
    return template.replace(
      "{label}",
      t(lang, "installment", { n: installmentMatch[1] })
    );
  }

  const flowMatch = message.match(
    /^(.+) date (\d+) cannot be before the pay-now date\.$/
  );
  if (flowMatch) {
    const template =
      errorMessages[lang]?.["error.flowBeforePayNow"] ??
      errorMessages.en["error.flowBeforePayNow"];
    const label =
      flowMatch[1] === "Provider schedule"
        ? t(lang, "providerScheduleLabel")
        : flowMatch[1];
    return template.replace("{label}", label).replace("{n}", flowMatch[2]);
  }

  return message;
}

/** @param {string} lang */
export function applyPageLanguage(lang) {
  document.documentElement.lang = lang;
  document.title = t(lang, "pageTitle");

  for (const el of document.querySelectorAll("[data-i18n]")) {
    const key = el.getAttribute("data-i18n");
    if (key) {
      el.textContent = t(lang, key);
    }
  }
}
