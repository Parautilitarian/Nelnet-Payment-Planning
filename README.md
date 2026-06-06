# Nelnet Payment Planning

Compare paying a bill in full today vs using a pay-later installment plan.

## Project layout

| Path | Purpose |
|------|---------|
| `docs/` | **GitHub Pages site** — static HTML + browser JS |
| `payment_comparison.py` | Python logic (notebook / local scripts) |
| `api.py` | Optional local FastAPI server (not used on GitHub Pages) |
| `int_pmts_comparison.ipynb` | Jupyter exploration |

## GitHub Pages (recommended hosting)

GitHub Pages serves **static files only** — no Python server. All calculations run in the browser via `docs/js/payment-comparison.js`.

### Deploy steps

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **`main`** and folder **`/docs`**.
5. Save. After a minute or two, the site is live at:

   `https://<your-username>.github.io/<repo-name>/`

### What changed vs the FastAPI version

- Removed the `fetch("/api/compare")` call — the form calls JS directly.
- Moved the site into `docs/` (GitHub Pages convention).
- Used ES modules (`import` / `export`) with **relative paths** so it works under a repo subpath like `/Nelnet-Payment-Planning/`.
- Kept `payment_comparison.py` for the notebook; logic is mirrored in JS.

## Local development

**Static site (same as GitHub Pages):**

```bash
cd docs
python3 -m http.server 8080
# open http://localhost:8080
```

**Optional Python API (not for GitHub Pages):**

```bash
pip install -r requirements.txt
uvicorn api:app --reload
# open http://localhost:8000
```

## Notebook

Open `int_pmts_comparison.ipynb` and import from the shared module:

```python
from payment_comparison import compare_pay_now_vs_later
```
