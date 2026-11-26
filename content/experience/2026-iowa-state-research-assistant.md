---
role: Research Assistant
org: Iowa State University
location: Ames, IA
start: 2026-01
---

I started by building simulation software in Python, JavaScript, HTML, and CSS that lets non-technical researchers run a simulation in their browser and test several hypotheses from one adjustable app.

Now I'm building a reusable data-matching pipeline.
The professor uploads dataset schemas and chooses what should be linked to what.
The hard part is joining datasets on a key like GVKEY when every dataset spells company names differently.
The pipeline first narrows the field with fuzzy, lexical, and mathematical matching, then JEV, a decision model by Typesafe, makes the final call on each candidate, which gives a reliable key to join two or more datasets for analysis.
The pipeline will live on this site, and its output is a Python script that asks for the API keys it needs and runs the matching, building, or enrichment steps.

I meet with my manager every week to turn research questions into technical plans and review my code.
