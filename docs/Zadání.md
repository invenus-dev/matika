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

## Automatický refresh na novou verzi

- Po nasazení nové verze by se měl automaticky obnovit pro všechny uživatele, kteří mají otevřenou starou verzi, aby měli vždy tu nejnovější.

## Denní cíl

- Použít lokální cookie nebo lépe local storage pro uložení průběhu
- U každého typu příkladu sledovat počet správných řešení za den - ideálně zobrazit někde nahoře v navigaci
- Nastavme denní cíl 10 příkladů ale jednotlivé příklady mohou být jinak
- Po dosažení cíle zobrazit gratulaci a možnost pokračovat dál, zároveň ukázat statistiky.

## Navigační lišta

- Vlevo nahoře: typ příkladu, po kliku přehodí na homepage s výběrem typu příkladu
- Vpravo nahoře: počet správných řešení za den a button pro vyhodnocení (jen ikona)

## Homepage 

- Výchozí obrazovka a dostanu se na ni klikem na levý horní název typu příkladu
- Zobrazí se mi seznam typů příkladů, které můžu procvičovat, na velkých dlaždicích
- Jednotlivé typy by si měly pamatovat dosavadní průběh a statistiky dokud nedám "reset" ve vyhodnocení

## Typy příkladů

### Sčítání a odčítání pod čarou

- Dvě čísla které sčítáme / odečítáme pod sebou
- Maximálně tříciferné číslo a dvojciferné které odečítáme
- Výsledek dítě doplní samo, navrhni dotykové ovládání
- Klidně ať to zadává postupně zprava doleva po jednotlivých číslicích a ukazat mu feedback - je ta číslice správně nebo ne

### Převody jednotek

- Jednoduché převody mezi jednotkami m, kg a l. 
- Vždy stejné jednotky, mění se řády. Neuvažujeme desetinná čísla, proto takové příklady negenerujeme.
- Příklad: 1000 m = ? km, 1000 g = ? kg, 1000 ml = ? l
- Používané řády: deci, centi, mili, kilo. 
- Ovládání: klávesy + a - pro přidání / ubrání řádu, tlačítko pro potvrzení odpovědi, vyhodnocení správnosti
- 1 pokus na opravu.

### Násobení a dělení, jednociferné členy

- Jednoduché příklady na násobení a dělení, kde násobitelé jsou jednociferná čísla a výsledky jsou do 100. Například: 7 x 8 = ?, 56 : 7 = ?
- Ovládání: dotykové zadávání výsledku, po zadání se zobrazí feedback o správnosti.
- Denní cíl je vyšší, 20 příkladů, protože jsou jednodušší.
- Layout: příklad vedle sebe (například: 7 x 8 nebo 56 : 7), pod ním pole pro zadání výsledku, pod ním dotyková klávesnice s čísly 0-9 a tlačítkem pro potvrzení odpovědi. 
- Schválně nechat počet číslic výsledku potencionálně až 2, nedělat okamžitou zpětnou vazbu, ale až po potvrzení odpovědi.
- Možnost opravy 1x.