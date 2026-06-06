"""
Optional local-only API. GitHub Pages cannot run this server.

For production hosting, use the static site in docs/ instead.
"""

from datetime import date

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, field_validator

from payment_comparison import compare_pay_now_vs_later

app = FastAPI(title="Nelnet Payment Comparison (local dev)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CompareRequest(BaseModel):
    principal: float = Field(gt=0, description="Total amount owed")
    valuation_date: date
    pay_now_date: date
    payment_dates: list[date] = Field(min_length=1)
    discount_rate: float = Field(
        ge=0, description="Opportunity-cost / risk-free rate as decimal (0.045 = 4.5%)"
    )
    annual_interest_rate: float = Field(
        ge=0, description="Pay-later plan interest as decimal (0.05 = 5%)"
    )
    setup_fee: float = Field(default=0.0, ge=0)
    setup_fee_date: date | None = None
    pay_later_amounts: list[float] | None = None
    pay_later_dates: list[date] | None = None

    @field_validator("payment_dates", "pay_later_dates", mode="before")
    @classmethod
    def parse_dates(cls, value):
        if value is None:
            return value
        return [date.fromisoformat(v) if isinstance(v, str) else v for v in value]

    @field_validator("pay_later_amounts")
    @classmethod
    def validate_provider_schedule(cls, amounts, info):
        provider_dates = info.data.get("pay_later_dates")
        if amounts is None and provider_dates is None:
            return amounts
        if amounts is None or provider_dates is None:
            raise ValueError(
                "Provide both pay_later_amounts and pay_later_dates, or neither."
            )
        if len(amounts) != len(provider_dates):
            raise ValueError("pay_later_amounts and pay_later_dates must match in length.")
        return amounts


@app.post("/api/compare")
def compare(body: CompareRequest):
    try:
        return compare_pay_now_vs_later(
            principal=body.principal,
            pay_now_date=body.pay_now_date,
            payment_dates=body.payment_dates,
            valuation_date=body.valuation_date,
            discount_rate=body.discount_rate,
            annual_interest_rate=body.annual_interest_rate,
            setup_fee=body.setup_fee,
            setup_fee_date=body.setup_fee_date,
            pay_later_amounts=body.pay_later_amounts,
            pay_later_dates=body.pay_later_dates,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


# Serves docs/ so local dev matches GitHub Pages behavior.
app.mount("/", StaticFiles(directory="docs", html=True), name="static")
