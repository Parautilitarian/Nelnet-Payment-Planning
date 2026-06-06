from datetime import date


def year_fraction(start: date, end: date, day_count: int = 365) -> float:
    """Act/365 year fraction between two dates."""
    return (end - start).days / day_count


def pv_cash_flow(
    amount: float, flow_date: date, valuation_date: date, annual_rate: float
) -> float:
    """Present value of a single cash outflow (+) or inflow (-)."""
    if flow_date < valuation_date:
        raise ValueError("flow_date must be on or after valuation_date.")
    t = year_fraction(valuation_date, flow_date)
    return amount / ((1 + annual_rate) ** t)


def pv_cash_flows(
    amounts: list[float],
    flow_dates: list[date],
    valuation_date: date,
    annual_rate: float,
) -> float:
    """Present value of multiple cash flows."""
    if len(amounts) != len(flow_dates):
        raise ValueError("amounts and flow_dates must have the same length.")
    return sum(
        pv_cash_flow(a, d, valuation_date, annual_rate)
        for a, d in zip(amounts, flow_dates)
    )


def pay_now_pv(
    principal: float,
    pay_date: date,
    valuation_date: date,
    annual_rate: float,
) -> float:
    """PV cost of paying the full principal on pay_date instead of keeping it invested."""
    return pv_cash_flow(principal, pay_date, valuation_date, annual_rate)


def build_pay_later_schedule(
    principal: float,
    payment_dates: list[date],
    annual_interest_rate: float,
    setup_fee: float = 0.0,
    setup_fee_date: date | None = None,
    valuation_date: date | None = None,
) -> tuple[list[float], list[date]]:
    """
    Build pay-later outflows: setup fee + equal principal installments + interest on balance.
    """
    if not payment_dates:
        raise ValueError("payment_dates cannot be empty.")

    payment_dates = sorted(payment_dates)
    valuation_date = valuation_date or payment_dates[0]
    setup_fee_date = setup_fee_date or valuation_date

    if any(d <= valuation_date for d in payment_dates):
        raise ValueError("All payment dates must be after valuation_date.")

    amounts: list[float] = []
    dates: list[date] = []

    if setup_fee:
        amounts.append(setup_fee)
        dates.append(setup_fee_date)

    remaining = principal
    principal_per_payment = principal / len(payment_dates)
    prev_date = valuation_date

    for pay_date in payment_dates:
        interest = remaining * annual_interest_rate * year_fraction(prev_date, pay_date)
        payment = interest + principal_per_payment
        amounts.append(payment)
        dates.append(pay_date)
        remaining -= principal_per_payment
        prev_date = pay_date

    return amounts, dates


def pay_later_pv(
    principal: float,
    payment_dates: list[date],
    valuation_date: date,
    discount_rate: float,
    annual_interest_rate: float,
    setup_fee: float = 0.0,
    setup_fee_date: date | None = None,
    amounts: list[float] | None = None,
    flow_dates: list[date] | None = None,
) -> float:
    """PV cost of the pay-later plan."""
    if amounts is None or flow_dates is None:
        amounts, flow_dates = build_pay_later_schedule(
            principal=principal,
            payment_dates=payment_dates,
            annual_interest_rate=annual_interest_rate,
            setup_fee=setup_fee,
            setup_fee_date=setup_fee_date,
            valuation_date=valuation_date,
        )
    return pv_cash_flows(amounts, flow_dates, valuation_date, discount_rate)


def compare_pay_now_vs_later(
    principal: float,
    pay_now_date: date,
    payment_dates: list[date],
    valuation_date: date,
    discount_rate: float,
    annual_interest_rate: float,
    setup_fee: float = 0.0,
    setup_fee_date: date | None = None,
    pay_later_amounts: list[float] | None = None,
    pay_later_dates: list[date] | None = None,
) -> dict:
    """Compare paying principal in full vs using pay-later."""
    pv_now = pay_now_pv(principal, pay_now_date, valuation_date, discount_rate)
    pv_later = pay_later_pv(
        principal=principal,
        payment_dates=payment_dates,
        valuation_date=valuation_date,
        discount_rate=discount_rate,
        annual_interest_rate=annual_interest_rate,
        setup_fee=setup_fee,
        setup_fee_date=setup_fee_date,
        amounts=pay_later_amounts,
        flow_dates=pay_later_dates,
    )

    gain_if_pay_now = pv_later - pv_now
    gain_if_pay_later = pv_now - pv_later

    schedule_amounts = pay_later_amounts
    schedule_dates = pay_later_dates
    if schedule_amounts is None or schedule_dates is None:
        schedule_amounts, schedule_dates = build_pay_later_schedule(
            principal=principal,
            payment_dates=payment_dates,
            annual_interest_rate=annual_interest_rate,
            setup_fee=setup_fee,
            setup_fee_date=setup_fee_date,
            valuation_date=valuation_date,
        )

    return {
        "valuation_date": valuation_date.isoformat(),
        "discount_rate": discount_rate,
        "pv_pay_now": pv_now,
        "pv_pay_later": pv_later,
        "gain_if_pay_now": gain_if_pay_now,
        "gain_if_pay_later": gain_if_pay_later,
        "better_option": (
            "pay_now"
            if gain_if_pay_now > 0
            else ("pay_later" if gain_if_pay_later > 0 else "tie")
        ),
        "pay_later_schedule": [
            {"date": d.isoformat(), "amount": round(a, 2)}
            for a, d in zip(schedule_amounts, schedule_dates)
        ],
    }
