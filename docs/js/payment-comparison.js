/** @typedef {{ date: string, amount: number }} ScheduleRow */

/**
 * Parse YYYY-MM-DD as a UTC date (avoids timezone off-by-one issues).
 * @param {string} iso
 */
export function parseDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** @param {Date} start @param {Date} end @param {number} [dayCount] */
export function yearFraction(start, end, dayCount = 365) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return (end.getTime() - start.getTime()) / (dayCount * msPerDay);
}

/** @param {Date} a @param {Date} b */
function isBefore(a, b) {
  return a.getTime() < b.getTime();
}

/** @param {Date[]} paymentDates @param {Date} payNowDate */
export function validatePaymentDates(paymentDates, payNowDate) {
  if (!paymentDates.length) {
    throw new Error("At least one installment date is required.");
  }

  for (const [index, payDate] of paymentDates.entries()) {
    if (isBefore(payDate, payNowDate)) {
      const label = index === 0 ? "The first installment" : `Installment ${index + 1}`;
      throw new Error(
        `${label} cannot be before the pay-now date. The first installment may be on the same day.`
      );
    }
  }
}

/** @param {Date[]} flowDates @param {Date} payNowDate @param {string} label */
function validateFlowDates(flowDates, payNowDate, label) {
  for (const [index, flowDate] of flowDates.entries()) {
    if (isBefore(flowDate, payNowDate)) {
      throw new Error(
        `${label} date ${index + 1} cannot be before the pay-now date.`
      );
    }
  }
}

/** @param {number} amount @param {Date} flowDate @param {Date} valuationDate @param {number} annualRate */
export function pvCashFlow(amount, flowDate, valuationDate, annualRate) {
  if (isBefore(flowDate, valuationDate)) {
    throw new Error("Cash flow dates must be on or after the pay-now date.");
  }
  const t = yearFraction(valuationDate, flowDate);
  return amount / (1 + annualRate) ** t;
}

/** @param {number[]} amounts @param {Date[]} flowDates @param {Date} valuationDate @param {number} annualRate */
export function pvCashFlows(amounts, flowDates, valuationDate, annualRate) {
  if (amounts.length !== flowDates.length) {
    throw new Error("amounts and flow_dates must have the same length.");
  }
  return amounts.reduce(
    (total, amount, index) =>
      total + pvCashFlow(amount, flowDates[index], valuationDate, annualRate),
    0
  );
}

/** @param {number} principal @param {Date} payDate @param {Date} valuationDate @param {number} annualRate */
export function payNowPv(principal, payDate, valuationDate, annualRate) {
  return pvCashFlow(principal, payDate, valuationDate, annualRate);
}

/**
 * @param {number} principal
 * @param {Date[]} paymentDates
 * @param {number} annualInterestRate
 * @param {number} [setupFee]
 * @param {Date | null} [setupFeeDate]
 * @param {Date | null} [valuationDate]
 * @returns {{ amounts: number[], dates: Date[] }}
 */
export function buildPayLaterSchedule(
  principal,
  paymentDates,
  annualInterestRate,
  setupFee = 0,
  setupFeeDate = null,
  valuationDate = null
) {
  const valDate = valuationDate ?? paymentDates[0];
  validatePaymentDates(paymentDates, valDate);

  const sortedDates = [...paymentDates].sort((a, b) => a - b);
  const feeDate = setupFeeDate ?? valDate;
  if (setupFee && isBefore(feeDate, valDate)) {
    throw new Error("Setup fee date cannot be before the pay-now date.");
  }

  /** @type {number[]} */
  const amounts = [];
  /** @type {Date[]} */
  const dates = [];

  if (setupFee) {
    amounts.push(setupFee);
    dates.push(feeDate);
  }

  let remaining = principal;
  const principalPerPayment = principal / sortedDates.length;
  let prevDate = valDate;

  for (const payDate of sortedDates) {
    const interest =
      remaining * annualInterestRate * yearFraction(prevDate, payDate);
    amounts.push(interest + principalPerPayment);
    dates.push(payDate);
    remaining -= principalPerPayment;
    prevDate = payDate;
  }

  return { amounts, dates };
}

/**
 * @param {object} params
 * @param {number} params.principal
 * @param {Date[]} params.paymentDates
 * @param {Date} params.valuationDate
 * @param {number} params.discountRate
 * @param {number} params.annualInterestRate
 * @param {number} [params.setupFee]
 * @param {Date | null} [params.setupFeeDate]
 * @param {number[] | null} [params.amounts]
 * @param {Date[] | null} [params.flowDates]
 */
export function payLaterPv({
  principal,
  paymentDates,
  valuationDate,
  discountRate,
  annualInterestRate,
  setupFee = 0,
  setupFeeDate = null,
  amounts = null,
  flowDates = null,
}) {
  let scheduleAmounts = amounts;
  let scheduleDates = flowDates;

  if (scheduleAmounts === null || scheduleDates === null) {
    const built = buildPayLaterSchedule(
      principal,
      paymentDates,
      annualInterestRate,
      setupFee,
      setupFeeDate,
      valuationDate
    );
    scheduleAmounts = built.amounts;
    scheduleDates = built.dates;
  }

  return pvCashFlows(scheduleAmounts, scheduleDates, valuationDate, discountRate);
}

/**
 * @param {object} params
 * @param {number} params.principal
 * @param {Date} params.payNowDate
 * @param {Date[]} params.paymentDates
 * @param {Date} params.valuationDate
 * @param {number} params.discountRate
 * @param {number} params.annualInterestRate
 * @param {number} [params.setupFee]
 * @param {Date | null} [params.setupFeeDate]
 * @param {number[] | null} [params.payLaterAmounts]
 * @param {Date[] | null} [params.payLaterDates]
 */
export function comparePayNowVsLater({
  principal,
  payNowDate,
  paymentDates,
  valuationDate,
  discountRate,
  annualInterestRate,
  setupFee = 0,
  setupFeeDate = null,
  payLaterAmounts = null,
  payLaterDates = null,
}) {
  const pvNow = payNowPv(principal, payNowDate, valuationDate, discountRate);
  const pvLater = payLaterPv({
    principal,
    paymentDates,
    valuationDate,
    discountRate,
    annualInterestRate,
    setupFee,
    setupFeeDate,
    amounts: payLaterAmounts,
    flowDates: payLaterDates,
  });

  const gainIfPayNow = pvLater - pvNow;
  const gainIfPayLater = pvNow - pvLater;

  let scheduleAmounts = payLaterAmounts;
  let scheduleDates = payLaterDates;
  if (scheduleAmounts === null || scheduleDates === null) {
    const built = buildPayLaterSchedule(
      principal,
      paymentDates,
      annualInterestRate,
      setupFee,
      setupFeeDate,
      valuationDate
    );
    scheduleAmounts = built.amounts;
    scheduleDates = built.dates;
  }

  return {
    valuation_date: formatDate(valuationDate),
    discount_rate: discountRate,
    pv_pay_now: pvNow,
    pv_pay_later: pvLater,
    gain_if_pay_now: gainIfPayNow,
    gain_if_pay_later: gainIfPayLater,
    better_option:
      gainIfPayNow > 0 ? "pay_now" : gainIfPayLater > 0 ? "pay_later" : "tie",
    pay_later_schedule: combineScheduleByDate(scheduleAmounts, scheduleDates),
  };
}

/** @param {Date} date */
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

/** @param {number[]} amounts @param {Date[]} dates @returns {ScheduleRow[]} */
function combineScheduleByDate(amounts, dates) {
  /** @type {Map<string, number>} */
  const byDate = new Map();

  for (let i = 0; i < amounts.length; i++) {
    const dateKey = formatDate(dates[i]);
    byDate.set(dateKey, (byDate.get(dateKey) ?? 0) + amounts[i]);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({
      date,
      amount: Math.round(amount * 100) / 100,
    }));
}

/**
 * Parse form-friendly inputs (ISO date strings) into comparePayNowVsLater args.
 * @param {object} input
 */
export function compareFromForm(input) {
  if (input.pay_later_amounts?.length || input.pay_later_dates?.length) {
    if (!input.pay_later_amounts?.length || !input.pay_later_dates?.length) {
      throw new Error(
        "Provide both pay_later_amounts and pay_later_dates, or neither."
      );
    }
    if (input.pay_later_amounts.length !== input.pay_later_dates.length) {
      throw new Error(
        "pay_later_amounts and pay_later_dates must match in length."
      );
    }
  }

  const scholarshipPct = input.scholarship_pct ?? 0;
  if (scholarshipPct < 0 || scholarshipPct > 100) {
    throw new Error("Scholarship must be between 0% and 100%.");
  }

  const scholarshipAmount = input.principal * (scholarshipPct / 100);
  const effectivePrincipal = input.principal - scholarshipAmount;
  if (effectivePrincipal <= 0) {
    throw new Error("Scholarship leaves no principal to compare.");
  }

  const payNowDate = parseDate(input.pay_now_date);
  const paymentDates = input.payment_dates.map(parseDate);
  validatePaymentDates(paymentDates, payNowDate);

  if (input.setup_fee_date) {
    const setupFeeDate = parseDate(input.setup_fee_date);
    if (isBefore(setupFeeDate, payNowDate)) {
      throw new Error("Setup fee date cannot be before the pay-now date.");
    }
  }

  if (input.pay_later_dates?.length) {
    validateFlowDates(
      input.pay_later_dates.map(parseDate),
      payNowDate,
      "Provider schedule"
    );
  }

  const result = comparePayNowVsLater({
    principal: effectivePrincipal,
    payNowDate,
    paymentDates,
    valuationDate: payNowDate,
    discountRate: input.discount_rate,
    annualInterestRate: input.annual_interest_rate,
    setupFee: input.setup_fee ?? 0,
    setupFeeDate: input.setup_fee_date ? parseDate(input.setup_fee_date) : null,
    payLaterAmounts: input.pay_later_amounts ?? null,
    payLaterDates: input.pay_later_dates?.map(parseDate) ?? null,
  });

  return {
    ...result,
    principal: input.principal,
    scholarship_pct: scholarshipPct,
    scholarship_amount: Math.round(scholarshipAmount * 100) / 100,
    effective_principal: Math.round(effectivePrincipal * 100) / 100,
    valuation_date: input.pay_now_date,
  };
}
