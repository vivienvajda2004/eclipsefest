import re
import json

app_path = "App.tsx"

with open(app_path, "r", encoding="utf-8") as f:
    code = f.read()

# Define translations mapping
trans_map = {
    "Kijelölve a térképen: ": ("mapSelectedNotice", "Kijelölve a térképen: ", "Selected on map: "),
    "Ezek a fellépések átfedik egymást, ezért együtt nem vásárolhatók meg:": ("conflictDesc", "Ezek a fellépések átfedik egymást, ezért együtt nem vásárolhatók meg:", "These performances overlap in time, so they cannot be purchased together:"),
    "Új vásárlás": ("newPurchase", "Új vásárlás", "New Purchase"),
    "Mennyiség / fellépés": ("qtyPerPerformance", "Mennyiség / fellépés", "Quantity / performance"),
    "Ezen a napon nincs kedvenced": ("noFavOnDay", "Ezen a napon nincs kedvenced", "No favorites on this day"),
    "Rendelés áttekintése": ("orderReview", "Rendelés áttekintése", "Order Review"),
    "Műsor megtekintése": ("viewSchedule", "Műsor megtekintése", "View Schedule"),
    "Három este, négy színpad, prémium fesztiválhangulat.": ("homeHeroDesc", "Három este, négy színpad, prémium fesztiválhangulat.", "Three nights, four stages, premium festival atmosphere."),
    "Válaszd ki a jegytípust és a fellépéseket, majd ellenőrizd a kosarat. A végösszegben külön látszanak a kedvezmények és a vásárláshoz kapcsolódó díjak.": ("ticketsDesc", "Válaszd ki a jegytípust és a fellépéseket, majd ellenőrizd a kosarat. A végösszegben külön látszanak a kedvezmények és a vásárláshoz kapcsolódó díjak.", "Select the ticket type and performances, then check your cart. The total will separately show discounts and related fees."),
    "KOSÁR": ("cartTitle", "KOSÁR", "CART"),
    "LIVE MUSIC · NIGHT EXPERIENCE": ("homeHeroSubtitle", "LIVE MUSIC · NIGHT EXPERIENCE", "LIVE MUSIC · NIGHT EXPERIENCE"),
    "Gyors elérés a többi szekcióhoz": ("quickAccess", "Gyors elérés a többi szekcióhoz", "Quick access to other sections"),
    "3. Kedvezmény": ("ticketStep3", "3. Kedvezmény", "3. Discount"),
    "Kedvezmény": ("discountLabel", "Kedvezmény", "Discount"),
    "Belépő kategória": ("ticketCategoryDesc", "Belépő kategória", "Entry category"),
    "Gasztró": ("gastro", "Gasztró", "Gastro"),
    "Több": ("more", "Több", "More"),
    "Időpontütközés": ("timeConflict", "Időpontütközés", "Time Conflict"),
    "Részösszeg": ("subtotal", "Részösszeg", "Subtotal"),
    "Jegyvásárlás": ("buyTickets", "Jegyvásárlás", "Buy Tickets"),
    "ütközés": ("conflictBadge", "ütközés", "conflict"),
    "RENDELÉS": ("orderLabel", "RENDELÉS", "ORDER"),
    "Visszamondás & visszatérítés": ("refundPolicyTitle", "Visszamondás & visszatérítés", "Cancellation & Refund"),
    "KÖVETKEZŐ FELLÉPÉSIG HÁTRA VAN": ("countdownTitle", "KÖVETKEZŐ FELLÉPÉSIG HÁTRA VAN", "TIME UNTIL NEXT PERFORMANCE"),
    "A díjak és kedvezmények demo logikák. A kezelési díj tételenként, a szolgáltatási díj a kedvezménnyel csökkentett összeg után számolódik.": ("feeDisclaimer", "A díjak és kedvezmények demo logikák. A kezelési díj tételenként, a szolgáltatási díj a kedvezménnyel csökkentett összeg után számolódik.", "Fees and discounts are demo logic. Handling fee is per item, service fee applies after discount."),
    "Prémium gasztro élmény a színpadok között": ("gastroDesc", "Prémium gasztro élmény a színpadok között", "Premium gastro experience between stages"),
    "A térkép adatai nem érhetők el.": ("mapDataNotAvailable", "A térkép adatai nem érhetők el.", "Map data is not available."),
    "Sikeres vásárlás!": ("purchaseSuccess", "Sikeres vásárlás!", "Successful Purchase!"),
    "ARTIST DETAIL": ("artistDetail", "FELLÉPŐ ADATAI", "ARTIST DETAIL"),
    "Saját menetrend": ("mySchedule", "Saját menetrend", "My Schedule"),
    "Műsor": ("scheduleLabel", "Műsor", "Schedule"),
    "Kiválasztott fellépések": ("selectedPerformances", "Kiválasztott fellépések", "Selected Performances"),
    "JUL": ("jul", "JÚL", "JUL"),
    "Képes, event-app jellegű kártyák, nagyobb tipográfia és átláthatóbb kategóriák.": ("gastroSubDesc", "Képes, event-app jellegű kártyák, nagyobb tipográfia és átláthatóbb kategóriák.", "Visual event-app style cards, larger typography, and clearer categories."),
    "óra": ("hours", "óra", "hours"),
    "ECLIPSEFEST · 2026": ("festivalBrand", "ECLIPSEFEST · 2026", "ECLIPSEFEST · 2026"),
    "Lista": ("list", "Lista", "List"),
    "Válassz egy helyszínt az alábbi listából, és a részletek mellett a térképen is megmutatjuk, hol találod.": ("mapDesc", "Válassz egy helyszínt az alábbi listából, és a részletek mellett a térképen is megmutatjuk, hol találod.", "Select a location from the list below, and we will show you where to find it on the map."),
    "Kezelési díj": ("handlingFee", "Kezelési díj", "Handling Fee"),
    "3 NIGHTS": ("threeNights", "3 ÉJSZAKA", "3 NIGHTS"),
    "WHEN DARKNESS FALLS, MUSIC RISES": ("darknessFalls", "AMIKOR LESZÁLL AZ ÉJ, FELENDÜL A ZENE", "WHEN DARKNESS FALLS, MUSIC RISES"),
    "Részletek megnyitása": ("openDetails", "Részletek megnyitása", "Open details"),
    "2. Fellépések": ("ticketStep2", "2. Fellépések", "2. Performances"),
    "Sziget-szerű árkedvezmények": ("discountDesc", "Sziget-szerű árkedvezmények", "Sziget-style discounts"),
    "Díjakkal együtt fizetendő": ("totalPayable", "Díjakkal együtt fizetendő", "Total Payable with Fees"),
    "nap": ("days", "nap", "days"),
    "Szolgáltatási díj": ("serviceFee", "Szolgáltatási díj", "Service Fee"),
    "Térkép": ("map", "Térkép", "Map"),
    "Még nincsenek kedvenceid": ("noFavoritesYet", "Még nincsenek kedvenceid", "No favorites yet"),
    "Visszatérítési kérelem elküldve": ("refundRequested", "Visszatérítési kérelem elküldve", "Refund requested"),
    "CURATED FESTIVAL DINING": ("curatedDining", "VÁLOGATOTT FESZTIVÁL GASZTRONÓMIA", "CURATED FESTIVAL DINING"),
    "A műsor nézetben szívecskével jelölheted az előadókat, akiket nem akarsz kihagyni.": ("favDesc", "A műsor nézetben szívecskével jelölheted az előadókat, akiket nem akarsz kihagyni.", "In the schedule view, you can favorite the artists you don't want to miss."),
    "NÉPSZERŰ": ("popular", "NÉPSZERŰ", "POPULAR"),
    "Megnyitás Google Maps-ben": ("openInGoogleMaps", "Megnyitás Google Maps-ben", "Open in Google Maps"),
    "Válassz másik napot vagy jelölj be új előadókat.": ("favEmptySubtitle", "Válassz másik napot vagy jelölj be új előadókat.", "Select another day or add new artists."),
    "E-mail cím": ("emailAddress", "E-mail cím", "Email Address"),
    "perc": ("minutes", "perc", "minutes"),
    "Fizetés": ("checkout", "Fizetés", "Checkout"),
    "Előbb oldd fel az időpontütközést.": ("resolveConflictFirst", "Előbb oldd fel az időpontütközést.", "Resolve time conflict first."),
    "EclipseFest": ("eclipseFest", "EclipseFest", "EclipseFest"),
    "A visszaigazolást elküldjük erre a címre:": ("confirmationSentTo", "A visszaigazolást elküldjük erre a címre:", "Confirmation sent to:"),
    "Válassz jegytípust és legalább egy fellépést a folytatáshoz": ("checkoutDisabledReason", "Válassz jegytípust és legalább egy fellépést a folytatáshoz", "Select a ticket type and at least one performance to continue"),
    "AJÁNLOTT TÉTELEK": ("recommendedItems", "AJÁNLOTT TÉTELEK", "RECOMMENDED ITEMS"),
    "1. Jegytípus": ("ticketStep1", "1. Jegytípus", "1. Ticket Type"),
    "Fizetendő": ("payable", "Fizetendő", "Total Payable"),
    "Mind": ("all", "Mind", "All"),
    "Színpad": ("stage", "Színpad", "Stage"),
    "Étel & ital": ("foodDrink", "Étel & ital", "Food & Drink"),
    "Étel": ("food", "Étel", "Food"),
    "Stand": ("stand", "Stand", "Stand"),
    "Szolgáltatás": ("service", "Szolgáltatás", "Service"),
    "Szolg.": ("serviceShort", "Szolg.", "Serv."),
    "Bejárat": ("entrance", "Bejárat", "Entrance"),
    "Kemping": ("camping", "Kemping", "Camping"),
    "Visszatérítés kérése": ("requestRefund", "Visszatérítés kérése", "Request refund"),
    "A visszatérítési határidő lejárt": ("refundExpired", "A visszatérítési határidő lejárt", "Refund deadline expired"),
    "nincs kiválasztva": ("noneSelected", "nincs kiválasztva", "none selected"),
    "kiválasztva": ("selected", "kiválasztva", "selected"),
    "Több is választható": ("multipleSelectable", "Több is választható", "Multiple selectable"),
    "Normál online ár": ("normalOnlinePrice", "Normál online ár", "Normal online price"),
    "Nincs kedvezmény": ("noDiscount", "Nincs kedvezmény", "No discount"),
    "Időszakos promóció": ("seasonalPromo", "Időszakos promóció", "Seasonal promo"),
    "Diák kedvezmény": ("studentDiscount", "Diák kedvezmény", "Student discount"),
    "Belépéskor igazolással": ("withIdAtEntry", "Belépéskor igazolással", "With ID at entry"),
    "Multi-show csomag": ("multiShowBundle", "Multi-show csomag", "Multi-show bundle"),
    "fellépés választásakor": ("whenChoosingPerformances", "fellépés választásakor", "when choosing performances"),
}

# 1. Expand translations object
en_obj = []
hu_obj = []

for hungarian_text, (key, hu_val, en_val) in trans_map.items():
    en_obj.append(f'		{key}: {json.dumps(en_val, ensure_ascii=False)},')
    hu_obj.append(f'		{key}: {json.dumps(hu_val, ensure_ascii=False)},')

translations_block = f"""// ─── Nyelvi szótár ────────────────────────────────────────────────────────────
const translations = {{
	en: {{
		home: "Home",
		schedule: "Schedule",
		map: "Map",
		tickets: "Tickets",
		sponsors: "Sponsors",
		sponsorsTitle: "OUR PROUD SPONSORS",
		festivalInfo: "FESTIVAL INFO",
{chr(10).join(en_obj)}
	}},
	hu: {{
		home: "Kezdőlap",
		schedule: "Program",
		map: "Térkép",
		tickets: "Jegyek",
		sponsors: "Támogatók",
		sponsorsTitle: "BÜSZKE TÁMOGATÓINK",
		festivalInfo: "FESZTIVÁL INFÓ",
{chr(10).join(hu_obj)}
	}},
}};

import React from 'react';
const TranslationContext = React.createContext<typeof translations.en>(translations.en);
function useTranslation() {{ return React.useContext(TranslationContext); }}
"""

# replace translations
code = re.sub(r'// ─── Nyelvi szótár ────────────────────────────────────────────────────────────.*?};', lambda m: translations_block, code, flags=re.DOTALL)

# Inject context provider in App function
# Find: <SafeAreaView
# Replace with: <TranslationContext.Provider value={t}><SafeAreaView
code = re.sub(r'(<SafeAreaView[^>]*>)', r'<TranslationContext.Provider value={t}>\n\t\t\t\t\1', code, count=1)

# Find ending </SafeAreaView> in App and replace with </SafeAreaView></TranslationContext.Provider>
# We can just match the end of App component:
code = code.replace("</SafeAreaView>\n\t);", "</SafeAreaView>\n\t\t\t</TranslationContext.Provider>\n\t);")

# Remove `lang` being passed to ScheduleScreen, PerformerDetailModal, etc. since we now have useTranslation
# Actually, it's safer to just inject `const t = useTranslation();` into every component and let `lang` stay if it's there.
# Let's inject `const t = useTranslation();` at the top of major components:

components_to_inject = [
    "ScheduleScreen", "PerformerDetailModal", "HomeScreen", "TicketsScreen", 
    "MapScreen", "GastroScreen", "FavoritesScreen", "TicketCard", "PerformanceTicketCard",
    "PerformerCard"
]

for comp in components_to_inject:
    pattern = r'(function ' + comp + r'\([^)]*\)\s*\{)'
    replacement = r'\1\n\tconst t = useTranslation();'
    code = re.sub(pattern, replacement, code)
    # also arrow function if any
    pattern2 = r'(const ' + comp + r'\s*=\s*\([^)]*\)\s*=>\s*\{)'
    replacement2 = r'\1\n\tconst t = useTranslation();'
    code = re.sub(pattern2, replacement2, code)

# Replace literal texts
for hungarian_text, (key, hu_val, en_val) in sorted(trans_map.items(), key=lambda x: -len(x[0])):
    # we use regex to replace >hungarian_text< with >{t.key}<
    # we also need to escape regex characters in hungarian_text
    escaped = re.escape(hungarian_text)
    
    # Text literal within tags
    code = re.sub(rf'>\s*{escaped}\s*<', f'>{{t.{key}}}<', code)

    # Some texts might be used in template literals or conditional renders:
    # e.g., label="Mind"
    code = re.sub(rf'"{escaped}"', f't.{key}', code)
    code = re.sub(rf"'{escaped}'", f't.{key}', code)

# Also fix some dynamic texts manually:
code = code.replace('t.noneSelected}', 't.noneSelected}')
code = code.replace('t.selected}', 't.selected}')

# For strings with curly braces in texts.json, we didn't map them cleanly, let's fix them:
# countdown string: {countdownTarget.name}: {countdown.days} nap · {countdown.hours} óra · {countdown.minutes} perc van hátra
code = re.sub(r'\{countdownTarget.name\}: \{countdown.days\} nap · \{countdown.hours\} óra · \{countdown.minutes\} perc van hátra', 
              r'{countdownTarget.name}: {countdown.days} {t.days} · {countdown.hours} {t.hours} · {countdown.minutes} {t.minutes}', code)

# {sorted.length} előadás · válassz nézetet
code = re.sub(r'\{sorted.length\} előadás · válassz nézetet', r'{sorted.length} {t.scheduleSubheading ?? "előadás · válassz nézetet"}', code)
# add it to translation map in string directly:
# well, let's just do it simple:
code = code.replace('{sorted.length} előadás · válassz nézetet', '{sorted.length} {t.home === "Home" ? "performances · choose view" : "előadás · válassz nézetet"}')

# fix <Text>Kedvezmény · {selectedDiscountOption.title}</Text>
code = code.replace('Kedvezmény · {selectedDiscountOption.title}', '{t.discountLabel} · {selectedDiscountOption.title}')

# fix {selectedPerformances.length || 0} fellépés · részösszeg
code = code.replace('{selectedPerformances.length || 0} fellépés · részösszeg', '{selectedPerformances.length || 0} {t.performancesSubtotal ?? (t.home === "Home" ? "performances · subtotal" : "fellépés · részösszeg")}')

# Write the modified code back
with open(app_path, "w", encoding="utf-8") as f:
    f.write(code)
print("Transformation complete")
