# Procvičování z matematiky

Cílem je vyvinout jednouduchej systém na procvičování z matematiky. Obtížnost zhruba třetí třída ZŠ. Začneme s jedním typem úkolu a budeme nabalovat další.

## Cíle

Náhodně servírovat příklady nějakého druhu, dokud nemá dítě dost, pak klikne na "vyhodnotit" a ukážou se mu statistiky

Obsluha dotykovým ovládáním - používá se laptop s touch screenem rozlišení full hd (1080px).

Mezi druhy příkladů půjde přepnout a pak se klidně může vše promazat a začít znova (statistiky atd) 

## Technické parametry

- Systém by neměl mít žádné backend závislosti, čistý JS
- Na počátek není persistence dat, vše se bude odehrávat v paměti jednoho sezení (do reloadu stránky)
- Jednoduchý design
- React / Typescript / Tailwind, build systém pravděpodobně Vite ale nechám otevřené
- Deployment někde kde je zdarma hosting (Cloudflare Pages?)

## První typ příkladů: sčítání a odčítání pod čarou

- Dvě čísla které sčítáme / odečítáme pod sebou
- Maximálně tříciferné číslo a dvojciferné které odečítáme
- Výsledek dítě doplní samo, navrhni dotykové ovládání
- Klidně ať to zadává postupně zprava doleva po jednotlivých číslicích a ukazat mu feedback - je ta číslice správně nebo ne


