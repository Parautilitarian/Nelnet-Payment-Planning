# Nelnet Payment Planning

A simple calculator to help **students** compare two ways to pay tuition:

- **Pay in full** on a single date, or  
- **Spread payments** through a Nelnet-style installment plan

The tool runs entirely in your browser — no account, no server, no data is sent anywhere.

**Live site:** [parautilitarian.github.io/Nelnet-Payment-Planning](https://parautilitarian.github.io/Nelnet-Payment-Planning/)

---

## Who is this for?

If your school lets you pay the whole balance upfront *or* sign up for a payment plan, this helps you see which option costs **less in today’s dollars** — not just which has the smaller sticker total, but which is better once you account for timing, fees, and what your money could earn elsewhere.

---

## How to use it

1. Open the site and fill in your numbers (see [What each field means](#what-each-field-means) below).
2. Click **Compare**.
3. Read the result at the top — for example: **“Result: Pay Now is the better option.”**
4. Review the payment schedule and dollar amounts below.

You can change any input and click **Compare** again to see how the answer shifts.

---

## What each field means


| Field                      | Plain English                                                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Principal**              | Total tuition (or balance) before scholarship.                                                                                                                 |
| **Scholarship (%)**        | Portion of tuition covered by aid. That amount is subtracted before comparing options.                                                                         |
| **Pay-now date**           | The date you would pay in full if you chose that route. Also used as the “today” reference for all math.                                                       |
| **Number of installments** | How many payments the Nelnet plan splits into.                                                                                                                 |
| **Installment dates**      | When each payment is due. The first defaults to the pay-now date; later ones are one month apart (you can edit them).                                          |
| **Discount rate (%)**      | What you could earn if you kept the money invested instead of paying early — e.g. a high-yield savings rate or conservative investment return. Default: 3.75%. |
| **Plan interest rate (%)** | Extra interest charged by the payment plan itself. Many school plans are 0%; check your Nelnet terms.                                                          |
| **Setup fee ($)**          | One-time fee to enroll in the plan (often around $40).                                                                                                         |
| **Setup fee date**         | When the setup fee is charged. Leave blank to charge it on the pay-now date.                                                                                   |


**Optional — provider schedule:** If Nelnet gave you an exact schedule (specific amounts on specific dates), you can paste those in instead of letting the tool estimate equal installments.

---

## How to read the results


| Result                                               | Meaning                                                                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Result: Pay Now / Pay Later is the better option** | The recommended choice based on present value (see below).                                                     |
| **Principal / Scholarship / Amount compared**        | Your tuition, aid, and the balance actually being compared.                                                    |
| **PV if pay now**                                    | What paying in full “costs” in today’s dollars.                                                                |
| **PV if pay later**                                  | What the installment plan “costs” in today’s dollars.                                                          |
| **Gain if pay later**                                | How much you save (in today’s dollars) by choosing the plan — only shown when the plan wins.                   |
| **Loss if pay later**                                | How much the plan costs you extra (in today’s dollars) vs paying in full — shown when pay-now wins.            |
| **Pay-later schedule**                               | Each payment date and amount. Same-day charges (e.g. setup fee + first installment) are combined into one row. |


### Why “lower PV” wins

**PV (present value)** converts future payments into what they’re worth *right now*, using your discount rate.

- Money paid **later** is worth **less today** because you could invest it in the meantime.
- Money paid **sooner** (or extra fees) hurts more.

So the option with the **lower PV** is the better deal economically — it’s like asking: *“If I converted everything to one lump sum as of my pay-now date, which path costs less?”*

**Example:** Paying $34,940 today might have PV = $34,940. A four-payment plan might *look* like the same total, but after discounting future installments and adding a $40 setup fee, its PV might be $34,818 — so the plan wins by about $122 in today’s dollars.

---

## What the calculator assumes

All logic lives in `[docs/js/payment-comparison.js](docs/js/payment-comparison.js)`:

1. **Scholarship** reduces the balance before any comparison.
2. **Pay in full** = one payment of the full (post-scholarship) balance on the pay-now date.
3. **Pay later** = setup fee (if any) + equal principal split across installments, plus plan interest accrued between payment dates.
4. **First installment** may fall on the same day as the pay-now date (common when a plan starts immediately).
5. Both options are compared using the same discount rate, as of the pay-now date.

This is a planning tool, not official financial advice. Always confirm amounts and dates with your school and Nelnet.

---

## Project layout


| Path                                                             | Purpose                                |
| ---------------------------------------------------------------- | -------------------------------------- |
| `[docs/index.html](docs/index.html)`                             | The web page students use              |
| `[docs/js/payment-comparison.js](docs/js/payment-comparison.js)` | All calculation logic                  |
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