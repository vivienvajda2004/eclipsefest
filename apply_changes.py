import re
import json

app_path = "App.tsx"

with open(app_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Apply the image modifications
# Import performerImages
code = code.replace(
    'import festivalData from "./assets/data/eclipsefest_data.json";',
    'import festivalData from "./assets/data/eclipsefest_data.json";\nimport { performerImages } from "./assets/data/imageMap";'
)

# Timeline image
timeline_target = '''					<TouchableOpacity style={styles.timelineCard} activeOpacity={0.86} onPress={() => setSelectedPerformer(item)}>
						<View style={styles.timelineCardHeader}>
							<View style={styles.timelineCardInfo}>
								<Text style={styles.performerName}>{item.name}</Text>'''

timeline_replacement = '''					<TouchableOpacity style={styles.timelineCard} activeOpacity={0.86} onPress={() => setSelectedPerformer(item)}>
						<View style={styles.timelineCardHeader}>
							<Image source={performerImages[item.id]} style={styles.timelineImage} resizeMode="cover" />
							<View style={styles.timelineCardInfo}>
								<Text style={styles.performerName}>{item.name}</Text>'''

code = code.replace(timeline_target, timeline_replacement)

# PerformerCard image
performer_target = '''		<TouchableOpacity activeOpacity={0.86} onPress={onPress} style={[styles.card, conflictNames && conflictNames.length > 0 && styles.cardConflict]}>
			<View style={[styles.cardAccent, conflictNames && conflictNames.length > 0 && styles.cardAccentConflict]} />
			<View style={styles.cardInfo}>
				<Text style={styles.performerName}>{item.name}</Text>'''

performer_replacement = '''		<TouchableOpacity activeOpacity={0.86} onPress={onPress} style={[styles.card, conflictNames && conflictNames.length > 0 && styles.cardConflict]}>
			<View style={[styles.cardAccent, conflictNames && conflictNames.length > 0 && styles.cardAccentConflict]} />
			<Image source={performerImages[item.id]} style={styles.performerImage} resizeMode="cover" />
			<View style={styles.cardInfo}>
				<Text style={styles.performerName}>{item.name}</Text>'''

code = code.replace(performer_target, performer_replacement)

# Modal image
modal_target = '''					<View style={styles.performerModalHero}>
						<Svg width="100%" height="100%" viewBox="0 0 320 150">
							<Defs>
								<LinearGradient id="artistHero" x1="0" y1="0" x2="1" y2="1">
									<Stop offset="0" stopColor="#7c3aed" stopOpacity="0.95" />
									<Stop offset="0.55" stopColor="#26113f" stopOpacity="1" />
									<Stop offset="1" stopColor="#05020a" stopOpacity="1" />
								</LinearGradient>
								<RadialGradient id="artistGlow" cx="0.62" cy="0.34" r="0.55">
									<Stop offset="0" stopColor="#f0abfc" stopOpacity="0.8" />
									<Stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
								</RadialGradient>
							</Defs>
							<Rect width="320" height="150" rx="22" fill="url(#artistHero)" />
							<Rect width="320" height="150" rx="22" fill="url(#artistGlow)" />
							{Array.from({ length: 14 }).map((_, i) => (
								<Line key={`beam-${i}`} x1={18 + i * 22} y1="150" x2={40 + i * 18} y2={36 + (i % 4) * 12} stroke="#d8b4fe" strokeOpacity="0.16" strokeWidth="2" />
							))}
							{Array.from({ length: 16 }).map((_, i) => (
								<Circle key={`light-${i}`} cx={18 + i * 20} cy={36 + (i % 3) * 11} r={i % 4 === 0 ? 3 : 2} fill="#f5d0fe" opacity={0.28 + (i % 5) * 0.08} />
							))}
							<Path d="M0 120 C45 92 88 126 130 94 C174 62 218 104 258 72 C286 50 304 54 320 42 L320 150 L0 150 Z" fill="#06020f" opacity="0.72" />
							{Array.from({ length: 22 }).map((_, i) => (
								<Path key={`crowd-${i}`} d={`M${8 + i * 15} 150 L${12 + i * 15} ${126 + (i % 5) * 4} L${16 + i * 15} 150 Z`} fill="#030108" opacity="0.92" />
							))}
						</Svg>
					</View>'''

modal_replacement = '''					<View style={styles.performerModalHero}>
						<Image source={performerImages[performer.id]} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
						<Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
							<Defs>
								<LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
									<Stop offset="0.4" stopColor="#10091c" stopOpacity="0" />
									<Stop offset="1" stopColor="#10091c" stopOpacity="1" />
								</LinearGradient>
							</Defs>
							<Rect width="100%" height="100%" fill="url(#fade)" />
						</Svg>
					</View>'''

code = code.replace(modal_target, modal_replacement)

# Styles
styles_target = '''	gastroCategoryChipTextActive: { color: THEME.text },
	gastroIconBox: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1.2 },
});'''

styles_replacement = '''	gastroCategoryChipTextActive: { color: THEME.text },
	gastroIconBox: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1.2 },
	performerImage: { width: 64, height: 64, borderRadius: 10, marginLeft: 12, marginVertical: 12, backgroundColor: "rgba(120,60,200,0.1)" },
	timelineImage: { width: 52, height: 52, borderRadius: 8, margin: 12, marginRight: 0, backgroundColor: "rgba(120,60,200,0.1)" },
});'''

code = code.replace(styles_target, styles_replacement)

# 2. Translations mapping
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

let currentLang: "en" | "hu" = "hu";
function t(key: keyof typeof translations.en): string {{
    return translations[currentLang][key] || key;
}}
"""

code = re.sub(r'// ─── Nyelvi szótár ────────────────────────────────────────────────────────────.*?};', lambda m: translations_block, code, flags=re.DOTALL)

# Sync currentLang in App
app_injection = '''	const [lang, setLang] = useState<"en" | "hu">("en");
	currentLang = lang;'''
code = code.replace('	const [lang, setLang] = useState<"en" | "hu">("en");', app_injection)

# Substitute tags strictly only where we are sure they are literal text, not typescript types or conditional strings.
# For things like "Mind" or "Étel", replace them only in `<Text>` tags.
for hungarian_text, (key, hu_val, en_val) in sorted(trans_map.items(), key=lambda x: -len(x[0])):
    escaped = re.escape(hungarian_text)
    
    # Text literal within tags
    code = re.sub(rf'>\s*{escaped}\s*<', f'>{{t("{key}")}}<', code)

    # Do not blindly replace "Mind" inside quotes because it breaks types.
    # We will manually fix some template literal cases if needed.

# Specific safe replaces
code = code.replace('t("noneSelected")}', 't("noneSelected")}')
code = code.replace('t("selected")}', 't("selected")}')

code = re.sub(r'\{countdownTarget.name\}: \{countdown.days\} nap · \{countdown.hours\} óra · \{countdown.minutes\} perc van hátra', 
              r'{countdownTarget.name}: {countdown.days} {t("days")} · {countdown.hours} {t("hours")} · {countdown.minutes} {t("minutes")}', code)

code = re.sub(r'\{sorted.length\} előadás · válassz nézetet', r'{sorted.length} {currentLang === "en" ? "performances · choose view" : "előadás · válassz nézetet"}', code)

code = code.replace('Kedvezmény · {selectedDiscountOption.title}', '{t("discountLabel")} · {selectedDiscountOption.title}')

code = code.replace('{selectedPerformances.length || 0} fellépés · részösszeg', '{selectedPerformances.length || 0} {currentLang === "en" ? "performances · subtotal" : "fellépés · részösszeg"}')

# GastroScreen type fixes and label mappings
# We know GASTRO_CATEGORY_META uses `t("all")`, etc.
gastro_meta_target = '''	Mind: { label: "Mind", icon: "grid-outline" },
	Étel: { label: "Étel", icon: "restaurant-outline" },
	Ital: { label: "Ital", icon: "beer-outline" },
	Desszert: { label: "Desszert", icon: "ice-cream-outline" },'''
gastro_meta_replacement = '''	Mind: { label: t("all"), icon: "grid-outline" },
	Étel: { label: t("food"), icon: "restaurant-outline" },
	Ital: { label: "Ital", icon: "beer-outline" },
	Desszert: { label: "Desszert", icon: "ice-cream-outline" },'''
code = code.replace(gastro_meta_target, gastro_meta_replacement)

# Map category filters mappings
map_filters_target = '''const MAP_FILTERS: { key: MapFilter; label: string }[] = [
	{ key: "all", label: "Mind" },
	{ key: "stage", label: "Színpad" },
	{ key: "food", label: "Étel" },
	{ key: "merch", label: "Stand" },
	{ key: "service", label: "Szolg." },
	{ key: "entrance", label: "Bejárat" },
	{ key: "camping", label: "Kemping" },
];'''
map_filters_replacement = '''const MAP_FILTERS: { key: MapFilter; label: string }[] = [
	{ key: "all", label: t("all") },
	{ key: "stage", label: t("stage") },
	{ key: "food", label: t("food") },
	{ key: "merch", label: t("stand") },
	{ key: "service", label: t("serviceShort") },
	{ key: "entrance", label: t("entrance") },
	{ key: "camping", label: t("camping") },
];'''
code = code.replace(map_filters_target, map_filters_replacement)

map_meta_target = '''	stage: { label: "Színpad", icon: "musical-notes", color: "#a855f7" },
	food: { label: "Étel & ital", icon: "restaurant", color: "#f59e0b" },
	merch: { label: "Stand", icon: "storefront", color: "#ec4899" },
	service: { label: "Szolgáltatás", icon: "medkit", color: "#38bdf8" },
	entrance: { label: "Bejárat", icon: "log-in-outline", color: "#22c55e" },
	camping: { label: "Kemping", icon: "flame", color: "#2dd4bf" },'''
map_meta_replacement = '''	stage: { label: t("stage"), icon: "musical-notes", color: "#a855f7" },
	food: { label: t("foodDrink"), icon: "restaurant", color: "#f59e0b" },
	merch: { label: t("stand"), icon: "storefront", color: "#ec4899" },
	service: { label: t("service"), icon: "medkit", color: "#38bdf8" },
	entrance: { label: t("entrance"), icon: "log-in-outline", color: "#22c55e" },
	camping: { label: t("camping"), icon: "flame", color: "#2dd4bf" },'''
code = code.replace(map_meta_target, map_meta_replacement)

festival_days_target = '''const FESTIVAL_DAYS = [
	{ key: "all", label: "Mind" },
	{ key: 18, label: "Júl. 18" },
	{ key: 19, label: "Júl. 19" },
	{ key: 20, label: "Júl. 20" },
];'''
festival_days_replacement = '''const FESTIVAL_DAYS = [
	{ key: "all", label: t("all") },
	{ key: 18, label: t("jul") + " 18" },
	{ key: 19, label: t("jul") + " 19" },
	{ key: 20, label: t("jul") + " 20" },
];'''
code = code.replace(festival_days_target, festival_days_replacement)

discount_target = '''const DISCOUNT_OPTIONS: { key: DiscountKey; title: string; description: string; percent: number; minPerformances?: number }[] = [
	{ key: "none", title: "Nincs kedvezmény", description: "Normál online ár", percent: 0 },
	{ key: "early", title: "Early Bird", description: "Időszakos promóció · -10%", percent: 10 },
	{ key: "student", title: "Diák kedvezmény", description: "Belépéskor igazolással · -15%", percent: 15 },
	{ key: "bundle", title: "Multi-show csomag", description: "3+ fellépés választásakor · -8%", percent: 8, minPerformances: 3 },
];'''
discount_replacement = '''const DISCOUNT_OPTIONS: { key: DiscountKey; title: string; description: string; percent: number; minPerformances?: number }[] = [
	{ key: "none", title: t("noDiscount"), description: t("normalOnlinePrice"), percent: 0 },
	{ key: "early", title: "Early Bird", description: t("seasonalPromo") + " · -10%", percent: 10 },
	{ key: "student", title: t("studentDiscount"), description: t("withIdAtEntry") + " · -15%", percent: 15 },
	{ key: "bundle", title: t("multiShowBundle"), description: "3+ " + t("whenChoosingPerformances") + " · -8%", percent: 8, minPerformances: 3 },
];'''
code = code.replace(discount_target, discount_replacement)

# Additional replace to fix tabs
code = code.replace('label: t.home', 'label: t("home")')
code = code.replace('label: t.schedule', 'label: t("schedule")')
code = code.replace('label: t.map', 'label: t("map")')
code = code.replace('label: t.tickets', 'label: t("tickets")')
code = code.replace('label: t.sponsors', 'label: t("sponsors")')

with open(app_path, "w", encoding="utf-8") as f:
    f.write(code)
print("All tasks applied securely.")
