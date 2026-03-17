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

## Denní cíl

- Použít lokální cookie nebo lépe local storage pro uložení průběhu
- U každého typu příkladu sledovat počet správných řešení za den - ideálně zobrazit někde nahoře v navigaci
- Nastavme denní cíl 10 příkladů
- Po dosažení cíle zobrazit gratulaci a možnost pokračovat dál, zároveň ukázat statistiky.

## Navigační lišta

- Vlevo nahoře: typ příkladu, po kliku přehodí na homepage s výběrem typu příkladu
- Vpravo nahoře: počet správných řešení za den a button pro vyhodnocení (jen ikona)

## Homepage 

- Výchozí obrazovka a dostanu se na ni klikem na levý horní název typu příkladu
- Zobrazí se mi seznam typů příkladů, které můžu procvičovat, na velkých dlaždicích
- Jednotlivé typy by si měly pamatovat dosavadní průběh a statistiky dokud nedám "reset" ve vyhodnocení

## První typ příkladů: sčítání a odčítání pod čarou

- Dvě čísla které sčítáme / odečítáme pod sebou
- Maximálně tříciferné číslo a dvojciferné které odečítáme
- Výsledek dítě doplní samo, navrhni dotykové ovládání
- Klidně ať to zadává postupně zprava doleva po jednotlivých číslicích a ukazat mu feedback - je ta číslice správně nebo ne

