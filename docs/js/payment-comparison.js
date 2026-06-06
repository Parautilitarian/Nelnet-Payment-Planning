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

/** @param {number} amount @param {Date} flowDate @param {Date} valuationDate @param {number} annualRate */
export function pvCashFlow(amount, flowDate, valuationDate, annualRate) {
  if (flowDate < valuationDate) {
    throw new Error("flow_date must be on or after valuation_date.");
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
  if (!paymentDates.length) {
    throw new Error("payment_dates cannot be empty.");
  }

  const sortedDates = [...paymentDates].sort((a, b) => a - b);
  const valDate = valuationDate ?? sortedDates[0];
  const feeDate = setupFeeDate ?? valDate;

  if (sortedDates.some((d) => d <= valDate)) {
    throw new Error("All payment dates must be after valuation_date.");
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
    pay_later_schedule: scheduleAmounts.map((amount, index) => ({
      date: formatDate(scheduleDates[index]),
      amount: Math.round(amount * 100) / 100,
    })),
  };
}

/** @param {Date} date */
function formatDate(date) {
  return date.toISOString().slice(0, 10);
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

  return comparePayNowVsLater({
    principal: input.principal,
    payNowDate: parseDate(input.pay_now_date),
    paymentDates: input.payment_dates.map(parseDate),
    valuationDate: parseDate(input.valuation_date),
    discountRate: input.discount_rate,
    annualInterestRate: input.annual_interest_rate,
    setupFee: input.setup_fee ?? 0,
    setupFeeDate: input.setup_fee_date ? parseDate(input.setup_fee_date) : null,
    payLaterAmounts: input.pay_later_amounts ?? null,
    payLaterDates: input.pay_later_dates?.map(parseDate) ?? null,
  });
}
