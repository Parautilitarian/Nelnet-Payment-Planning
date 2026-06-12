# Nelnet Payment Planning

A simple calculator to help **students** compare two ways to pay tuition:

- **Pay in full** on a single date, or
- **Spread payments** through a Nelnet-style installment plan

The tool runs entirely in your browser — no account, no server, no data is sent anywhere.

**Live site:** [parautilitarian.github.io/Nelnet-Payment-Planning](https://parautilitarian.github.io/Nelnet-Payment-Planning/)

Available in **English**, **简体中文**, **繁體中文**, and **Español** (toggle in the top-right corner; your choice is saved for next visit).

---

## Who is this for?

If your school lets you pay the whole balance upfront *or* sign up for a payment plan, this helps you see which option costs **less in today's dollars** — not just which has the smaller sticker total, but which is better once you account for timing, fees, plan interest, and what your money could earn elsewhere.

---

## How to use it

1. Open the site and fill in your numbers (see [What each field means](#what-each-field-means) below).
2. Enter **Number of installments** — date and amount fields appear for each payment.
3. Click **Compare**.
4. Read the result at the top — for example: **"Result: Pay Now is the better option."**
5. Review total interest accrued and the pay-later payment schedule below.

You can change any input and click **Compare** again to see how the answer shifts.

---

## What each field means


| Field                         | Plain English                                                                                                                                                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Principal**                 | Total tuition (or balance) before scholarship. Default: $34,940. Accepts comma formatting (e.g. `34,940`).                                                                                                                                                                 |
| **Scholarship (%)**           | Portion of tuition covered by aid. That amount is subtracted before comparing options.                                                                                                                                                                                     |
| **Pay-now date**              | The date you would pay in full if you chose that route. Also used as the "today" reference for all math. Default: August 1, 2026.                                                                                                                                          |
| **Number of installments**    | How many payments the Nelnet plan splits into (1–36). Enter a number to reveal the installment rows below.                                                                                                                                                                 |
| **Installment date / amount** | One row per payment. **Date** defaults to pay-now date for the first installment, then monthly. **Amount** is the **principal portion only** — plan interest is calculated and added on top (see below). Amounts default to an even split of the post-scholarship balance. |
| **Discount rate (%)**         | What you could earn if you kept the money invested instead of paying early — e.g. a high-yield savings rate. Default: 3.75%.                                                                                                                                               |
| **Plan interest rate (%)**    | Interest charged by the payment plan on your **outstanding balance** between installment dates. Paid together with each installment. Default: 0% (many school plans charge no interest).                                                                                   |
| **Setup fee ($)**             | One-time fee to enroll in the plan. Default: $40.                                                                                                                                                                                                                          |
| **Setup fee date**            | When the setup fee is charged. Leave blank to charge it on the pay-now date.                                                                                                                                                                                               |


The form is grouped into three sections separated by horizontal lines: basic info → installments → rates & fees.

---

## How to read the results


| Result                                               | Meaning                                                                                                                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Result: Pay Now / Pay Later is the better option** | The recommended choice based on present value (see below).                                                                                                          |
| **Principal / Scholarship / Amount compared**        | Your tuition, aid, and the balance actually being compared.                                                                                                         |
| **PV if pay now**                                    | What paying in full "costs" in today's dollars.                                                                                                                     |
| **PV if pay later**                                  | What the installment plan "costs" in today's dollars.                                                                                                               |
| **Gain if pay later**                                | How much you save (in today's dollars) by choosing the plan — shown when the plan wins.                                                                             |
| **Loss if pay later**                                | How much the plan costs you extra (in today's dollars) vs paying in full — shown when pay-now wins.                                                                 |
| **Total interest accrued**                           | Sum of all plan interest charged on the outstanding balance across installments (excludes setup fee).                                                               |
| **Pay-later schedule**                               | Each payment date and **total amount due** (principal + interest for that period). Same-day charges (e.g. setup fee + first installment) are combined into one row. |


### Why "lower PV" wins

**PV (present value)** converts future payments into what they're worth *right now*, using your discount rate.

- Money paid **later** is worth **less today** because you could invest it in the meantime.
- Money paid **sooner** (or extra fees / interest) hurts more.

So the option with the **lower PV** is the better deal economically — it's like asking: *"If I converted everything to one lump sum as of my pay-now date, which path costs less?"*

**Example:** Paying $34,940 today has PV = $34,940. A four-payment plan at 0% plan interest with a $40 setup fee might have PV ≈ $34,818 — the plan wins by about $122 in today's dollars. At 5% plan interest, total interest accrued might be ~$220 and pay-later PV rises accordingly.

---

## How plan interest works

For each installment, the calculator:

1. Accrues interest on the **remaining balance** since the previous payment date:
  `interest = outstanding balance × plan rate × (days ÷ 365)`
2. Adds that interest to the installment's **principal amount** for the payment due that day.
3. Reduces the outstanding balance by the principal portion only.

The **Amount ($)** fields you enter are principal only. The pay-later schedule and **Total interest accrued** show the interest on top.

---

## What the calculator assumes

All calculation logic lives in `[docs/js/payment-comparison.js](docs/js/payment-comparison.js)`:

1. **Scholarship** reduces the balance before any comparison.
2. **Pay in full** = one payment of the full (post-scholarship) balance on the pay-now date.
3. **Pay later** = setup fee (if any) + installment payments, where each payment = principal portion + accrued plan interest.
4. **First installment** may fall on the same day as the pay-now date (no interest accrues for zero elapsed time).
5. Installment principal amounts must sum to the amount compared (before interest).
6. Both options are compared using the same discount rate, as of the pay-now date.

UI text and error messages are translated via `[docs/js/i18n.js](docs/js/i18n.js)`.

This is a planning tool, not official financial advice. Always confirm amounts and dates with your school and Nelnet.

---

## Project layout


| Path                                                             | Purpose                                |
| ---------------------------------------------------------------- | -------------------------------------- |
| `[docs/index.html](docs/index.html)`                             | The web page students use              |
| `[docs/js/payment-comparison.js](docs/js/payment-comparison.js)` | Calculation logic                      |
| `[docs/js/i18n.js](docs/js/i18n.js)`                             | Translations (EN, 简体中文, 繁體中文, ES)      |
| `[static/index.html](static/index.html)`                         | Legacy redirect — not used for hosting |


---

## Run locally

```bash
cd docs
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

---

## Deploy on GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Choose branch `**main`** and folder `**/docs**`.
5. Save. The site will be live at:
  `https://<your-username>.github.io/<repo-name>/`

GitHub Pages serves static files only — the calculator runs entirely in the browser.