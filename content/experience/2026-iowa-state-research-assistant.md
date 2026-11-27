---
role: Research Assistant
org: Iowa State University
location: Ames, IA
start: 2026-01
---

I started by building simulation software in Python, JavaScript, HTML, and CSS that lets non-technical researchers run a simulation in their browser and test several hypotheses from one adjustable app.

Now I'm building a reusable data-matching pipeline.
The professor uploads dataset schemas and chooses what should be linked to what.

The hard part is joining datasets on a shared company ID, like GVKEY in finance research, when every dataset spells company names differently.
The pipeline first narrows the candidates with fuzzy, lexical, and mathematical matching.
Then JEV, a decision model by Typesafe, makes the final call on each one, which gives a reliable key for joining two or more datasets.

The pipeline will live on this site.
Its output is a Python script that asks for the API keys it needs and runs the matching, building, or enrichment steps.

Each week my manager and I turn research questions into technical plans, and they review my code.
