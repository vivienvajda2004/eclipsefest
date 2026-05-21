import React, { useEffect, useRef, useState } from "react";
import {
	Alert,
	Animated,
	Dimensions,
	Easing,
	FlatList,
	Image,
	Linking,
	Modal,
	PanResponder,
	Platform,
	SafeAreaView,
	ScrollView,
	SectionList,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
// Removed expo-google-fonts
import Svg, {
	Circle,
	Defs,
	Ellipse,
	G,
	Line,
	LinearGradient,
	Path,
	Polygon,
	RadialGradient,
	Rect,
	Stop,
	Text as SvgText,
} from "react-native-svg";
import festivalData from "./assets/data/eclipsefest_data.json";
import { performerImages } from "./assets/data/imageMap";

const performerImages: Record<string, any> = {
	"1": require("./assets/performers/performer_1.jpg"),
	"2": require("./assets/performers/performer_2.jpg"),
	"3": require("./assets/performers/performer_3.jpg"),
	"4": require("./assets/performers/performer_4.jpg"),
	"5": require("./assets/performers/performer_5.jpg"),
	"6": require("./assets/performers/performer_6.jpg"),
	"7": require("./assets/performers/performer_7.jpg"),
	"8": require("./assets/performers/performer_8.jpg"),
	"9": require("./assets/performers/performer_9.jpg"),
	"10": require("./assets/performers/performer_10.jpg"),
	"11": require("./assets/performers/performer_11.jpg"),
	"12": require("./assets/performers/performer_12.jpg"),
	"13": require("./assets/performers/performer_13.jpg"),
	"14": require("./assets/performers/performer_14.jpg"),
	"15": require("./assets/performers/performer_15.jpg"),
	"16": require("./assets/performers/performer_16.jpg"),
	"17": require("./assets/performers/performer_17.jpg"),
	"18": require("./assets/performers/performer_18.jpg"),
	"19": require("./assets/performers/performer_19.jpg"),
	"20": require("./assets/performers/performer_20.jpg"),
	"21": require("./assets/performers/performer_21.jpg"),
	"22": require("./assets/performers/performer_22.jpg"),
	"23": require("./assets/performers/performer_23.jpg"),
	"24": require("./assets/performers/performer_24.jpg"),
	"25": require("./assets/performers/performer_25.jpg"),
	"26": require("./assets/performers/performer_26.jpg"),
	"27": require("./assets/performers/performer_27.jpg"),
	"28": require("./assets/performers/performer_28.jpg"),
	"29": require("./assets/performers/performer_29.jpg"),
	"30": require("./assets/performers/performer_30.jpg"),
	"31": require("./assets/performers/performer_31.jpg"),
	"32": require("./assets/performers/performer_32.jpg"),
	"33": require("./assets/performers/performer_33.jpg"),
	"34": require("./assets/performers/performer_34.jpg"),
	"35": require("./assets/performers/performer_35.jpg"),
	"36": require("./assets/performers/performer_36.jpg"),
	"37": require("./assets/performers/performer_37.jpg"),
	"38": require("./assets/performers/performer_38.jpg"),
	"39": require("./assets/performers/performer_39.jpg"),
	"40": require("./assets/performers/performer_40.jpg"),
	"41": require("./assets/performers/performer_41.jpg"),
	"42": require("./assets/performers/performer_42.jpg"),
	"43": require("./assets/performers/performer_43.jpg"),
	"44": require("./assets/performers/performer_44.jpg"),
	"45": require("./assets/performers/performer_45.jpg"),
	"46": require("./assets/performers/performer_46.jpg"),
	"47": require("./assets/performers/performer_47.jpg"),
	"48": require("./assets/performers/performer_48.jpg"),
	"49": require("./assets/performers/performer_49.jpg"),
	"50": require("./assets/performers/performer_50.jpg"),
	"51": require("./assets/performers/performer_51.jpg"),
	"52": require("./assets/performers/performer_52.jpg"),
	"53": require("./assets/performers/performer_53.jpg"),
	"54": require("./assets/performers/performer_54.jpg"),
	"55": require("./assets/performers/performer_55.jpg"),
	"56": require("./assets/performers/performer_56.jpg"),
	"57": require("./assets/performers/performer_57.jpg"),
	"58": require("./assets/performers/performer_58.jpg"),
	"59": require("./assets/performers/performer_59.jpg"),
	"60": require("./assets/performers/performer_60.jpg"),
	"61": require("./assets/performers/performer_61.jpg"),
	"62": require("./assets/performers/performer_62.jpg"),
	"63": require("./assets/performers/performer_63.jpg"),
	"64": require("./assets/performers/performer_64.jpg"),
	"65": require("./assets/performers/performer_65.jpg"),
	"66": require("./assets/performers/performer_66.jpg"),
	"67": require("./assets/performers/performer_67.jpg"),
	"68": require("./assets/performers/performer_68.jpg"),
	"69": require("./assets/performers/performer_69.jpg"),
	"70": require("./assets/performers/performer_70.jpg"),
	"71": require("./assets/performers/performer_71.jpg"),
	"72": require("./assets/performers/performer_72.jpg"),
	"73": require("./assets/performers/performer_73.jpg"),
	"74": require("./assets/performers/performer_74.jpg"),
	"75": require("./assets/performers/performer_75.jpg"),
	"76": require("./assets/performers/performer_76.jpg"),
	"77": require("./assets/performers/performer_77.jpg"),
	"78": require("./assets/performers/performer_78.jpg"),
	"79": require("./assets/performers/performer_79.jpg"),
	"80": require("./assets/performers/performer_80.jpg"),
	"81": require("./assets/performers/performer_81.jpg"),
	"82": require("./assets/performers/performer_82.jpg"),
	"83": require("./assets/performers/performer_83.jpg"),
	"84": require("./assets/performers/performer_84.jpg"),
	"85": require("./assets/performers/performer_85.jpg"),
	"86": require("./assets/performers/performer_86.jpg"),
	"87": require("./assets/performers/performer_87.jpg"),
	"88": require("./assets/performers/performer_88.jpg"),
	"89": require("./assets/performers/performer_89.jpg"),
	"90": require("./assets/performers/performer_90.jpg"),
	"91": require("./assets/performers/performer_91.jpg"),
	"92": require("./assets/performers/performer_92.jpg"),
	"93": require("./assets/performers/performer_93.jpg"),
	"94": require("./assets/performers/performer_94.jpg"),
	"95": require("./assets/performers/performer_95.jpg"),
	"96": require("./assets/performers/performer_96.jpg"),
	"97": require("./assets/performers/performer_97.jpg"),
	"98": require("./assets/performers/performer_98.jpg"),
	"99": require("./assets/performers/performer_99.jpg"),
	"100": require("./assets/performers/performer_100.jpg"),
};

function getPerformerImage(id: string | number) {
	return performerImages[String(id)] ?? performerImages["1"];
}

// Extra prémium / holdfényes event-app irány – mély fekete, lila glow, üveges kártyák
const THEME = {
	bg: "#0a0410",
	surface: "rgba(255, 255, 255, 0.08)",
	surface2: "rgba(168, 85, 247, 0.16)",
	border: "rgba(255, 255, 255, 0.12)",
	borderStrong: "rgba(192, 132, 252, 0.58)",
	text: "#ffffff",
	textMuted: "rgba(255, 255, 255, 0.75)",
	textSubtle: "rgba(255, 255, 255, 0.5)",
	accent: "#c084fc",
	accent2: "#8b5cf6",
	danger: "#ef4444",
	warn: "#f59e0b",
	navBg: "rgba(10, 4, 16, 0.85)",
};

const FONTS = {
	heading: Platform.select({ ios: "System", android: "sans-serif", default: "sans-serif" }),
	subheading: Platform.select({ ios: "System", android: "sans-serif-medium", default: "sans-serif-medium" }),
	body: Platform.select({ ios: "System", android: "sans-serif", default: "sans-serif" }),
	ui: Platform.select({ ios: "System", android: "sans-serif-medium", default: "sans-serif-medium" }),
};

function CosmicBackdrop() {
	return (
		<View pointerEvents="none" style={styles.cosmicBackdrop}>
			<Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none">
				<Defs>
					<RadialGradient id="bgGlowTop" cx="80%" cy="10%" r="60%">
						<Stop offset="0" stopColor="#7c3aed" stopOpacity="0.45" />
						<Stop offset="0.5" stopColor="#8b5cf6" stopOpacity="0.15" />
						<Stop offset="1" stopColor="#0a0410" stopOpacity="0" />
					</RadialGradient>
					<RadialGradient id="bgGlowBottom" cx="20%" cy="90%" r="65%">
						<Stop offset="0" stopColor="#c026d3" stopOpacity="0.3" />
						<Stop offset="0.6" stopColor="#8b5cf6" stopOpacity="0.08" />
						<Stop offset="1" stopColor="#0a0410" stopOpacity="0" />
					</RadialGradient>
				</Defs>
				<Rect width="100%" height="100%" fill={THEME.bg} />
				<Rect width="100%" height="100%" fill="url(#bgGlowTop)" />
				<Rect width="100%" height="100%" fill="url(#bgGlowBottom)" />
			</Svg>
		</View>
	);
}

// ─── Nyelvi szótár ────────────────────────────────────────────────────────────
const translations = {
	en: {
		home: "Home",
		schedule: "Schedule",
		map: "Map",
		tickets: "Tickets",
		sponsors: "Sponsors",
		sponsorsTitle: "OUR PROUD SPONSORS",
		festivalInfo: "FESTIVAL INFO",
		mapSelectedNotice: "Selected on map: ",
		conflictDesc: "These performances overlap in time, so they cannot be purchased together:",
		newPurchase: "New Purchase",
		qtyPerPerformance: "Quantity / performance",
		noFavOnDay: "No favorites on this day",
		orderReview: "Order Review",
		viewSchedule: "View Schedule",
		homeHeroDesc: "Three nights, four stages, premium festival atmosphere.",
		ticketsDesc: "Select the ticket type and performances, then check your cart. The total will separately show discounts and related fees.",
		cartTitle: "CART",
		homeHeroSubtitle: "LIVE MUSIC · NIGHT EXPERIENCE",
		quickAccess: "Quick access to other sections",
		ticketStep3: "3. Discount",
		discountLabel: "Discount",
		ticketCategoryDesc: "Entry category",
		gastro: "Gastro",
		more: "More",
		timeConflict: "Time Conflict",
		subtotal: "Subtotal",
		buyTickets: "Buy Tickets",
		conflictBadge: "conflict",
		orderLabel: "ORDER",
		refundPolicyTitle: "Cancellation & Refund",
		countdownTitle: "TIME UNTIL NEXT PERFORMANCE",
		feeDisclaimer: "Fees and discounts are demo logic. Handling fee is per item, service fee applies after discount.",
		gastroDesc: "Premium gastro experience between stages",
		mapDataNotAvailable: "Map data is not available.",
		purchaseSuccess: "Successful Purchase!",
		artistDetail: "ARTIST DETAIL",
		mySchedule: "My Schedule",
		scheduleLabel: "Schedule",
		selectedPerformances: "Selected Performances",
		jul: "JUL",
		gastroSubDesc: "Visual event-app style cards, larger typography, and clearer categories.",
		hours: "hours",
		festivalBrand: "ECLIPSEFEST · 2026",
		list: "List",
		mapDesc: "Select a location from the list below, and we will show you where to find it on the map.",
		handlingFee: "Handling Fee",
		threeNights: "3 NIGHTS",
		darknessFalls: "WHEN DARKNESS FALLS, MUSIC RISES",
		openDetails: "Open details",
		ticketStep2: "2. Performances",
		discountDesc: "Sziget-style discounts",
		totalPayable: "Total Payable with Fees",
		days: "days",
		serviceFee: "Service Fee",
		noFavoritesYet: "No favorites yet",
		refundRequested: "Refund requested",
		curatedDining: "CURATED FESTIVAL DINING",
		favDesc: "In the schedule view, you can favorite the artists you don't want to miss.",
		popular: "POPULAR",
		openInGoogleMaps: "Open in Google Maps",
		favEmptySubtitle: "Select another day or add new artists.",
		emailAddress: "Email Address",
		minutes: "minutes",
		checkout: "Checkout",
		resolveConflictFirst: "Resolve time conflict first.",
		eclipseFest: "EclipseFest",
		confirmationSentTo: "Confirmation sent to:",
		checkoutDisabledReason: "Select a ticket type and at least one performance to continue",
		recommendedItems: "RECOMMENDED ITEMS",
		ticketStep1: "1. Ticket Type",
		payable: "Total Payable",
		all: "All",
		stage: "Stage",
		foodDrink: "Food & Drink",
		food: "Food",
		stand: "Stand",
		service: "Service",
		serviceShort: "Serv.",
		entrance: "Entrance",
		camping: "Camping",
		requestRefund: "Request refund",
		refundExpired: "Refund deadline expired",
		noneSelected: "none selected",
		selected: "selected",
		multipleSelectable: "Multiple selectable",
		normalOnlinePrice: "Normal online price",
		noDiscount: "No discount",
		seasonalPromo: "Seasonal promo",
		studentDiscount: "Student discount",
		withIdAtEntry: "With ID at entry",
		multiShowBundle: "Multi-show bundle",
		whenChoosingPerformances: "fellépés választásakor",
	},
	hu: {
		home: "Kezdőlap",
		schedule: "Program",
		map: "Térkép",
		tickets: "Jegyek",
		sponsors: "Támogatók",
		sponsorsTitle: "BÜSZKE TÁMOGATÓINK",
		festivalInfo: "FESZTIVÁL INFÓ",
		mapSelectedNotice: "Kijelölve a térképen: ",
		conflictDesc: "Ezek a fellépések átfedik egymást, ezért együtt nem vásárolhatók meg:",
		newPurchase: "Új vásárlás",
		qtyPerPerformance: "Mennyiség / fellépés",
		noFavOnDay: "Ezen a napon nincs kedvenced",
		orderReview: "Rendelés áttekintése",
		viewSchedule: "Műsor megtekintése",
		homeHeroDesc: "Három este, négy színpad, prémium fesztiválhangulat.",
		ticketsDesc: "Válaszd ki a jegytípust és a fellépéseket, majd ellenőrizd a kosarat. A végösszegben külön látszanak a kedvezmények és a vásárláshoz kapcsolódó díjak.",
		cartTitle: "KOSÁR",
		homeHeroSubtitle: "LIVE MUSIC · NIGHT EXPERIENCE",
		quickAccess: "Gyors elérés a többi szekcióhoz",
		ticketStep3: "3. Kedvezmény",
		discountLabel: "Kedvezmény",
		ticketCategoryDesc: "Belépő kategória",
		gastro: "Gasztró",
		more: "Több",
		timeConflict: "Időpontütközés",
		subtotal: "Részösszeg",
		buyTickets: "Jegyvásárlás",
		conflictBadge: "ütközés",
		orderLabel: "RENDELÉS",
		refundPolicyTitle: "Visszamondás & visszatérítés",
		countdownTitle: "KÖVETKEZŐ FELLÉPÉSIG HÁTRA VAN",
		feeDisclaimer: "A díjak és kedvezmények demo logikák. A kezelési díj tételenként, a szolgáltatási díj a kedvezménnyel csökkentett összeg után számolódik.",
		gastroDesc: "Prémium gasztro élmény a színpadok között",
		mapDataNotAvailable: "A térkép adatai nem érhetők el.",
		purchaseSuccess: "Sikeres vásárlás!",
		artistDetail: "FELLÉPŐ ADATAI",
		mySchedule: "Saját menetrend",
		scheduleLabel: "Műsor",
		selectedPerformances: "Kiválasztott fellépések",
		jul: "JÚL",
		gastroSubDesc: "Képes, event-app jellegű kártyák, nagyobb tipográfia és átláthatóbb kategóriák.",
		hours: "óra",
		festivalBrand: "ECLIPSEFEST · 2026",
		list: "Lista",
		mapDesc: "Válassz egy helyszínt az alábbi listából, és a részletek mellett a térképen is megmutatjuk, hol találod.",
		handlingFee: "Kezelési díj",
		threeNights: "3 ÉJSZAKA",
		darknessFalls: "AMIKOR LESZÁLL AZ ÉJ, FELENDÜL A ZENE",
		openDetails: "Részletek megnyitása",
		ticketStep2: "2. Fellépések",
		discountDesc: "Sziget-szerű árkedvezmények",
		totalPayable: "Díjakkal együtt fizetendő",
		days: "nap",
		serviceFee: "Szolgáltatási díj",
		noFavoritesYet: "Még nincsenek kedvenceid",
		refundRequested: "Visszatérítési kérelem elküldve",
		curatedDining: "VÁLOGATOTT FESZTIVÁL GASZTRONÓMIA",
		favDesc: "A műsor nézetben szívecskével jelölheted az előadókat, akiket nem akarsz kihagyni.",
		popular: "NÉPSZERŰ",
		openInGoogleMaps: "Megnyitás Google Maps-ben",
		favEmptySubtitle: "Válassz másik napot vagy jelölj be új előadókat.",
		emailAddress: "E-mail cím",
		minutes: "perc",
		checkout: "Fizetés",
		resolveConflictFirst: "Előbb oldd fel az időpontütközést.",
		eclipseFest: "EclipseFest",
		confirmationSentTo: "A visszaigazolást elküldjük erre a címre:",
		checkoutDisabledReason: "Válassz jegytípust és legalább egy fellépést a folytatáshoz",
		recommendedItems: "AJÁNLOTT TÉTELEK",
		ticketStep1: "1. Jegytípus",
		payable: "Fizetendő",
		all: "Mind",
		stage: "Színpad",
		foodDrink: "Étel & ital",
		food: "Étel",
		stand: "Stand",
		service: "Szolgáltatás",
		serviceShort: "Szolg.",
		entrance: "Bejárat",
		camping: "Kemping",
		requestRefund: "Visszatérítés kérése",
		refundExpired: "A visszatérítési határidő lejárt",
		noneSelected: "nincs kiválasztva",
		selected: "kiválasztva",
		multipleSelectable: "Több is választható",
		normalOnlinePrice: "Normál online ár",
		noDiscount: "Nincs kedvezmény",
		seasonalPromo: "Időszakos promóció",
		studentDiscount: "Diák kedvezmény",
		withIdAtEntry: "Belépéskor igazolással",
		multiShowBundle: "Multi-show csomag",
		whenChoosingPerformances: "fellépés választásakor",
	},
};

const MAP_POINTS_TRANSLATIONS: Record<string, Record<"en" | "hu", { name: string; description: string }>> = {
	"main-stage": {
		en: { name: "Main Stage", description: "Main stage – headliners and big shows." },
		hu: { name: "Main Stage", description: "Főszínpad – headlinerek és nagy show-k." }
	},
	"electronic-stage": {
		en: { name: "Electronic Stage", description: "Electronic and house genres." },
		hu: { name: "Electronic Stage", description: "Elektronikus és house műfajok." }
	},
	"acoustic-stage": {
		en: { name: "Acoustic Stage", description: "Acoustic and intimate performances." },
		hu: { name: "Acoustic Stage", description: "Akusztikus és intim előadások." }
	},
	"sunrise-stage": {
		en: { name: "Sunrise Stage", description: "Afterparty section until dawn." },
		hu: { name: "Sunrise Stage", description: "Hajnalig tartó afterparty szekció." }
	},
	"entrance": {
		en: { name: "Main Entrance", description: "Entry with ticket and wristband." },
		hu: { name: "Főbejárat", description: "Belépés jeggyel és karszalaggal." }
	},
	"info-desk": {
		en: { name: "Info Point", description: "Map, lost and found, assistance." },
		hu: { name: "Infópont", description: "Térkép, elveszett tárgyak, segítség." }
	},
	"food-court": {
		en: { name: "Food Court", description: "Food and drink stands in the middle of the plaza." },
		hu: { name: "Food Court", description: "Étel- és italstandok a piactér közepén." }
	},
	"street-food": {
		en: { name: "Street Food Lane", description: "Fast food, burgers, tacos, desserts." },
		hu: { name: "Street Food sáv", description: "Gyors ételek, burger, taco, desszert." }
	},
	"bar-center": {
		en: { name: "Bar Center", description: "Cocktails, beer, and soft drinks." },
		hu: { name: "Bárközpont", description: "Koktélok, sör és üdítők." }
	},
	"merch-village": {
		en: { name: "Merch Village", description: "Official t-shirts, caps, souvenirs." },
		hu: { name: "Merch Village", description: "Hivatalos pólók, sapkák, emléktárgyak." }
	},
	"artist-merch": {
		en: { name: "Artist Stand", description: "Tour merch and limited editions." },
		hu: { name: "Előadói stand", description: "Turné merch és limitált kiadások." }
	},
	"photo-booth": {
		en: { name: "Photo Booth", description: "Festival photography and instant prints." },
		hu: { name: "Fotópont", description: "Fesztivál fotózás és azonnali nyomat." }
	}
};

const TICKET_TRANSLATIONS: Record<string, Record<"en" | "hu", { name: string; description: string; badge: string; features: string[] }>> = {
	"day-pass": {
		en: {
			name: "Day Pass",
			description: "Full entry for one day to all 4 stages.",
			badge: "1 day",
			features: ["All stages", "18:00 – 02:00", "Mobile app access"]
		},
		hu: {
			name: "Napijegy",
			description: "Egy nap teljes belépés mind a 4 színpadra.",
			badge: "1 nap",
			features: ["Minden színpad", "18:00 – 02:00", "Mobil app hozzáférés"]
		}
	},
	"weekend-pass": {
		en: {
			name: "Weekend Pass",
			description: "Full weekend: July 18–20, all stages.",
			badge: "3 days",
			features: ["3 days entry", "Priority entrance", "Exclusive merch 10%"]
		},
		hu: {
			name: "Bérlet",
			description: "Teljes hétvége: július 18–20., minden színpad.",
			badge: "3 nap",
			features: ["3 nap belépés", "Prioritásos bejárat", "Exkluzív merch 10%"]
		}
	},
	"vip-pass": {
		en: {
			name: "VIP Pass",
			description: "Premium experience for the entire duration of the festival.",
			badge: "VIP",
			features: ["VIP lounge", "Separate restroom & bar", "Meet & greet opportunity"]
		},
		hu: {
			name: "VIP Bérlet",
			description: "Prémium élmény a teljes fesztivál idejére.",
			badge: "VIP",
			features: ["VIP lounge", "Külön mosdó & bár", "Meet & greet lehetőség"]
		}
	},
	"camping-addon": {
		en: {
			name: "Camping Add-on",
			description: "Campsite on the festival grounds, 3 nights.",
			badge: "Add-on",
			features: ["Shower & WC", "24-hour security", "Pass required"]
		},
		hu: {
			name: "Kemping kiegészítő",
			description: "Sátorhely a fesztivál területén, 3 éjszaka.",
			badge: "Add-on",
			features: ["Zuhanyzó & WC", "24 órás biztonság", "Csak bérlettel"]
		}
	}
};

const GASTRO_STANDS_TRANSLATIONS: Record<string, Record<"en" | "hu", { description: string; offers: string[] }>> = {
	g1: {
		en: {
			description: "The Haus of Gaga's official cocktail bar. Bold flavors for brave souls.",
			offers: ["Poker Face Paloma – grapefruit-tequila cocktail with salted rim", "Bad Romance Rosé – raspberry champagne cocktail with devil horns decoration"]
		},
		hu: {
			description: "A Haus of Gaga hivatalos koktélbárja. Merész ízek bátor lelkeknek.",
			offers: ["Poker Face Paloma – grapefruit-tequila koktél sós peremmel", "Bad Romance Rosé – málnás pezsgőkoktél ördögszarv dísszel"]
		}
	},
	g2: {
		en: {
			description: "13 types of drinks, one for every era. Friendship bracelets with every sip.",
			offers: ["Red Lemonade – strawberry lemonade with gold glitter dust", "Midnights Mojito – blue butterfly pea flower patterned mojito"]
		},
		hu: {
			description: "13 féle ital, minden eráról egy. Friendship bracelets every sip.",
			offers: ["Red Lemonade – epres limonádé arany csillámpárával", "Midnights Mojito – kék pillangóvirágos mintás mojito"]
		}
	},
	g3: {
		en: {
			description: "Flame-grilled, heavily seasoned dishes. Are you a believer? Then stand the heat!",
			offers: ["Thunder Burger – double beef patty with smoky BBQ sauce", "Demons Wings – hellishly spicy chicken wings in 3 intensity levels"]
		},
		hu: {
			description: "Tűzön sült, erős fűszerezésű fogások. Believer vagy? Akkor bírd el!",
			offers: ["Thunder Burger – dupla marhahús smoky BBQ szósszal", "Demons Wings – pokoli csípős csirkeszárny 3 erősségben"]
		}
	},
	g4: {
		en: {
			description: "Dark, elegant, uncompromising. Personal Jesus level quality.",
			offers: ["Policy of Truth Wrap – smoked chicken wrap with tahini in a black tortilla", "Master & Servant Platter – vegan sandwich selection"]
		},
		hu: {
			description: "Sötét, elegáns, kompromisszummentes. Personal Jesus szintű minőség.",
			offers: ["Policy of Truth Wrap – policy of truth wrap (füstölt csirke tahinis wrap fekete tortillában)", "Master & Servant Platter – vegán szendvicsválogatás"]
		}
	},
	g5: {
		en: {
			description: "Local flavors in a festival atmosphere. Just like your mom's cooking, only louder.",
			offers: ["Eclipse Lángos – festival-sized flatbread with sour cream and cheese", "Benci's Chimney Cake – cinnamon flavored, freshly baked"]
		},
		hu: {
			description: "Hazai ízek fesztiválos hangulatban. Olyan mint anyukád főztje, csak hangosabb.",
			offers: ["Eclipse Lángos – tejfölös-sajtos, fesztiválméretű", "Benci's Kürtőskalács – fahéjas, frissen sütve"]
		}
	},
	g6: {
		en: {
			description: "Galactic ice creams and cold desserts. The sweet side of the solar eclipse.",
			offers: ["Eclipse Sundae – black coconut ice cream with gold glitter dust", "Meteor Waffle – fresh waffle with blueberry topping"]
		},
		hu: {
			description: "Galaktikus fagylaltok és hideg desszertek. A napfogyatkozás édes oldala.",
			offers: ["Eclipse Sundae – fekete kókuszfagyi arany csillámpárával", "Meteor Waffle – friss gofri áfonyás öntettel"]
		}
	},
	g7: {
		en: {
			description: "Official energy drink partner. Charge up for the next performance!",
			offers: ["Monster Ultra – sugar-free versions in 6 flavors", "Eclipse Mix – Monster + fruit juice combinations"]
		},
		hu: {
			description: "Hivatalos energiaital partner. Töltsd fel magad a következő fellépőre!",
			offers: ["Monster Ultra – cukormentes változatok 6 ízben", "Eclipse Mix – Monster + gyümölcslé kombók"]
		}
	},
	g8: {
		en: {
			description: "Late-night bites for those who don't want to miss anything.",
			offers: ["Midnight Ramen – miso broth with toasted garlic", "Eclipse Pad Thai – peanut-chili, vegan option available"]
		},
		hu: {
			description: "Északai falatkák azoknak akik nem akarnak kihagyni semmit.",
			offers: ["Midnight Ramen – miso alaplé pirított fokhagymával", "Eclipse Pad Thai – mogyorós-chilis, vegán opció is"]
		}
	}
};

type TabKey =
	| "Home"
	| "Schedule"
	| "Map"
	| "Favorites"
	| "Gastro"
	| "Tickets"
	| "Sponsors";

// ─── Adatmodell ───────────────────────────────────────────────────────────────
interface Performer {
	id: string;
	name: string;
	stage: string;
	startTime: string;
	endTime: string;
	day: number; // 18, 19, vagy 20
	description_en: string;
	description_hu: string;
	imageUrl: string;
}

interface Sponsor {
	id: string;
	name: string;
	logoUrl: string;
}

interface Ticket {
	id: string;
	name: string;
	price: number;
	currency: string;
	badge: string;
	description: string;
	features: string[];
	popular?: boolean;
}

type MapCategory =
	| "stage"
	| "food"
	| "merch"
	| "service"
	| "entrance"
	| "camping";

interface MapPoint {
	id: string;
	name: string;
	category: MapCategory;
	latitude: number;
	longitude: number;
	description: string;
}

interface MapRegion {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
}

interface FestivalMap {
	venueName: string;
	center: MapRegion;
	points: MapPoint[];
}

function openInGoogleMaps(point: MapPoint) {
	const url = `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`;
	Linking.openURL(url);
}

type MapFilter = "all" | MapCategory;

const MAP_CATEGORY_META: Record<
	MapCategory,
	{ label: string; icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
	stage: { label: "Színpad", icon: "musical-notes", color: "#a855f7" },
	food: { label: "Étel & ital", icon: "restaurant", color: "#f59e0b" },
	merch: { label: "Stand", icon: "storefront", color: "#ec4899" },
	service: { label: "Szolgáltatás", icon: "medkit", color: "#38bdf8" },
	entrance: { label: "Bejárat", icon: "log-in-outline", color: "#22c55e" },
	camping: { label: "Kemping", icon: "flame", color: "#2dd4bf" },
};

const MAP_FILTERS: { key: MapFilter; label: string }[] = [
	{ key: "all", label: "Mind" },
	{ key: "stage", label: "Színpad" },
	{ key: "food", label: "Étel" },
	{ key: "merch", label: "Stand" },
	{ key: "service", label: "Szolg." },
	{ key: "entrance", label: "Bejárat" },
	{ key: "camping", label: "Kemping" },
];

// Az illusztrált térképképhez tartozó vizuális marker pozíciók.
// x/y százalékban van megadva, így a jelölő reszponzívan együtt méreteződik a képpel.
const MAP_IMAGE_MARKERS: Record<string, { x: number; y: number }> = {
	"main-stage": { x: 58, y: 43 },
	"electronic-stage": { x: 50, y: 21 },
	"acoustic-stage": { x: 15, y: 42 },
	"sunrise-stage": { x: 72, y: 58 },
	"entrance": { x: 22, y: 78 },
	"info-desk": { x: 42, y: 40 },
	"food-court": { x: 49, y: 63 },
	"street-food": { x: 34, y: 51 },
	"bar-center": { x: 79, y: 50 },
	"merch-village": { x: 56, y: 53 },
	"artist-merch": { x: 61, y: 44 },
	"photo-booth": { x: 83, y: 67 },
	"vip-lounge": { x: 60, y: 36 },
	"camping": { x: 82, y: 25 },
	"wc-north": { x: 40, y: 32 },
	"wc-south": { x: 33, y: 61 },
	"first-aid": { x: 72, y: 42 },
};

const FESTIVAL_DAYS = [
	{ key: "all", label: "Mind" },
	{ key: 18, label: "Júl. 18" },
	{ key: 19, label: "Júl. 19" },
	{ key: 20, label: "Júl. 20" },
];

function formatPrice(amount: number, currency: string, lang: "en" | "hu" = "hu") {
	const locale = lang === "en" ? "en-US" : "hu-HU";
	return `${amount.toLocaleString(locale)} ${currency}`;
}

const FESTIVAL_YEAR = 2026;
const REFUND_DEADLINE_HOURS = 24;

function getPerformanceDate(performer: Performer) {
	const [hour, minute] = performer.startTime.split(":").map(Number);
	return new Date(FESTIVAL_YEAR, 6, performer.day, hour, minute, 0, 0);
}

function getRefundDeadline(performer: Performer) {
	return new Date(getPerformanceDate(performer).getTime() - REFUND_DEADLINE_HOURS * 60 * 60 * 1000);
}

function formatPerformanceDate(performer: Performer, lang: "en" | "hu" = "hu") {
	const month = lang === "en" ? "Jul." : "Júl.";
	const daySep = lang === "en" ? "" : ".";
	return `${month} ${performer.day}${daySep} · ${performer.startTime}–${performer.endTime}`;
}

function formatCountdown(target: Date, now: Date) {
	const diff = Math.max(0, target.getTime() - now.getTime());
	const totalMinutes = Math.floor(diff / 60000);
	const days = Math.floor(totalMinutes / (60 * 24));
	const hours = Math.floor((totalMinutes - days * 60 * 24) / 60);
	const minutes = totalMinutes % 60;
	return { days, hours, minutes, expired: diff <= 0 };
}

function formatRefundDeadline(performer: Performer, lang: "en" | "hu" = "hu") {
	const deadline = getRefundDeadline(performer);
	const month = lang === "en" ? "Jul." : "Júl.";
	const daySep = lang === "en" ? "" : ".";
	const timeLocale = lang === "en" ? "en-US" : "hu-HU";
	return `${month} ${deadline.getDate()}${daySep} ${deadline.toLocaleTimeString(timeLocale, { hour: "2-digit", minute: "2-digit", hour12: lang === "en" })}`;
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function parseTimeToMinutes(time: string) {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
}

function sortPerformersByTime(performers: Performer[]) {
	return [...performers].sort(
		(a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
	);
}

// Ütközés detektálás: két előadó időben átfedi egymást?
function hasTimeConflict(a: Performer, b: Performer): boolean {
	if (a.id === b.id) return false;
	const aStart = parseTimeToMinutes(a.startTime);
	const aEnd = parseTimeToMinutes(a.endTime);
	const bStart = parseTimeToMinutes(b.startTime);
	const bEnd = parseTimeToMinutes(b.endTime);
	return aStart < bEnd && bStart < aEnd;
}

function getConflictsForPerformer(
	performer: Performer,
	allFavorites: Performer[],
): Performer[] {
	return allFavorites.filter(
		(other) => other.id !== performer.id && hasTimeConflict(performer, other),
	);
}

// Fesztivál napjai
const FESTIVAL_START = new Date(2026, 6, 18); // július 18.
const FESTIVAL_END = new Date(2026, 6, 20, 23, 59, 59); // július 20. éjjel

function isFestivalNow(): boolean {
	const now = new Date();
	return now >= FESTIVAL_START && now <= FESTIVAL_END;
}

function getNowMinutes(): number {
	const now = new Date();
	return now.getHours() * 60 + now.getMinutes();
}

function getFestivalDay(): number {
	const now = new Date();
	return now.getDate(); // 18, 19, vagy 20
}

// Következő kedvenc meghatározása valós rendszeridő alapján
function getNextFavorite(favorites: Performer[]): Performer | null {
	if (!isFestivalNow()) return null;
	const nowMinutes = getNowMinutes();
	const todayDay = getFestivalDay();
	const upcoming = favorites
		.filter(
			(p) => p.day === todayDay && parseTimeToMinutes(p.startTime) > nowMinutes,
		)
		.sort(
			(a, b) =>
				parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
		);
	return upcoming[0] ?? null;
}

function minutesUntil(performer: Performer): number {
	return parseTimeToMinutes(performer.startTime) - getNowMinutes();
}

// ─── Csillag ─────────────────────────────────────────────────────────────────
function Star({ style }: { style: object }) {
	const opacity = useRef(new Animated.Value(Math.random())).current;
	useEffect(() => {
		const twinkle = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 0.05 + Math.random() * 0.2,
					duration: 1500 + Math.random() * 2500,
					easing: Easing.inOut(Easing.sin),
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0.4 + Math.random() * 0.6,
					duration: 1500 + Math.random() * 2500,
					easing: Easing.inOut(Easing.sin),
					useNativeDriver: true,
				}),
			]),
		);
		twinkle.start();
		return () => twinkle.stop();
	}, []);
	return <Animated.View style={[styles.star, style, { opacity }]} />;
}

// ─── Eclipse animáció ─────────────────────────────────────────────────────────
function EclipseAnimation() {
	const rotation = useRef(new Animated.Value(0)).current;
	const pulse1 = useRef(new Animated.Value(1)).current;
	const pulse2 = useRef(new Animated.Value(1)).current;
	const pulse3 = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		Animated.loop(
			Animated.timing(rotation, {
				toValue: 1,
				duration: 40000,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		).start();

		const makePulse = (anim: Animated.Value, delay: number) =>
			Animated.loop(
				Animated.sequence([
					Animated.delay(delay),
					Animated.timing(anim, {
						toValue: 1.08,
						duration: 2000 + delay * 0.1,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
					Animated.timing(anim, {
						toValue: 1,
						duration: 2000 + delay * 0.1,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
				]),
			);

		makePulse(pulse1, 0).start();
		makePulse(pulse2, 600).start();
		makePulse(pulse3, 1200).start();

		return () => {
			rotation.stopAnimation();
			pulse1.stopAnimation();
			pulse2.stopAnimation();
			pulse3.stopAnimation();
		};
	}, []);

	const spin = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	const spikes = Array.from({ length: 24 }, (_, i) => ({
		angle: i * 15,
		length: i % 3 === 0 ? 52 : i % 2 === 0 ? 38 : 28,
		opacity: i % 3 === 0 ? 0.55 : i % 2 === 0 ? 0.35 : 0.18,
		width: i % 3 === 0 ? 1.5 : 0.8,
	}));

	return (
		<View style={styles.eclipseContainer}>
			<Animated.View
				style={[
					styles.haloRing,
					styles.haloOuter,
					{ transform: [{ scale: pulse1 }] },
				]}
			/>
			<Animated.View
				style={[
					styles.haloRing,
					styles.haloMid,
					{ transform: [{ scale: pulse2 }] },
				]}
			/>
			<Animated.View
				style={[
					styles.haloRing,
					styles.haloInner,
					{ transform: [{ scale: pulse3 }] },
				]}
			/>
			<Animated.View
				style={[styles.coronaWrapper, { transform: [{ rotate: spin }] }]}
			>
				{spikes.map((spike, i) => (
					<View
						key={i}
						style={[
							styles.spikeContainer,
							{ transform: [{ rotate: `${spike.angle}deg` }] },
						]}
					>
						<View
							style={[
								styles.spike,
								{
									height: spike.length,
									width: spike.width,
									opacity: spike.opacity,
								},
							]}
						/>
					</View>
				))}
			</Animated.View>
			<View style={styles.planetDisk}>
				<Image
					source={require("./assets/EclipseFest_Logo.png")}
					style={styles.logoImage}
					resizeMode="cover"
				/>
			</View>
		</View>
	);
}

// ─── Jegy kártya ──────────────────────────────────────────────────────────────
function TicketCard({
	ticket,
	selected,
	onSelect,
}: {
	ticket: Ticket;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<TouchableOpacity
			style={[styles.ticketCard, selected && styles.ticketCardSelected]}
			onPress={onSelect}
			activeOpacity={0.85}
		>
			{ticket.popular && (
				<View style={styles.popularBadge}>
					<Text style={styles.popularBadgeText}>{lang === "en" ? "POPULAR" : "NÉPSZERŰ"}</Text>
				</View>
			)}
			<View
				style={[styles.cardAccent, selected && styles.ticketAccentSelected]}
			/>
			<View style={styles.ticketCardBody}>
				<View style={styles.ticketCardHeader}>
					<View style={styles.ticketTitleRow}>
						<Text style={styles.ticketName}>{localized.name}</Text>
						<View style={styles.ticketBadge}>
							<Text style={styles.ticketBadgeText}>{localized.badge}</Text>
						</View>
					</View>
					<Text style={styles.ticketPrice}>
						{formatPrice(ticket.price, ticket.currency)}
					</Text>
				</View>
				<Text style={styles.ticketDescription}>{localized.description}</Text>
				<View style={styles.ticketFeatures}>
					{localized.features.map((feature) => (
						<View key={feature} style={styles.ticketFeatureRow}>
							<Ionicons name="checkmark-circle" size={14} color="#a855f7" />
							<Text style={styles.ticketFeatureText}>{feature}</Text>
						</View>
					))}
				</View>
			</View>
			<View style={styles.ticketSelectIndicator}>
				<Ionicons
					name={selected ? "radio-button-on" : "radio-button-off"}
					size={22}
					color={selected ? "#a855f7" : "#555"}
				/>
			</View>
		</TouchableOpacity>
	);
}

// ─── Jegyvásárlás képernyő ────────────────────────────────────────────────────
function TicketsScreen({
	tickets,
	selectedId,
	quantity,
	email,
	orderComplete,
	onSelect,
	onChangeQuantity,
	onEmailChange,
	onPurchase,
	onReset,
}: {
	tickets: Ticket[];
	performers: Performer[];
	selectedId: string | null;
	selectedPerformanceIds: string[];
	quantity: number;
	email: string;
	orderComplete: boolean;
	refundRequested: boolean;
	onSelect: (id: string) => void;
	onTogglePerformance: (id: string) => void;
	onChangeQuantity: (delta: number) => void;
	onEmailChange: (value: string) => void;
	onPurchase: () => void;
	onReset: () => void;
	onRequestRefund: () => void;
	lang: "en" | "hu";
	t: typeof translations.en;
}) {
	const [now, setNow] = useState(() => new Date());
	const [selectedDiscount, setSelectedDiscount] = useState<DiscountKey>("early");
	const [expandedPerformanceDays, setExpandedPerformanceDays] = useState<Record<number, boolean>>({ 18: true, 19: false, 20: false });

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	const sortedPerformers = [...performers].sort((a, b) => getPerformanceDate(a).getTime() - getPerformanceDate(b).getTime());
	const performanceDays = [...new Set(sortedPerformers.map((p) => p.day))].sort((a, b) => a - b);
	const performancesByDay = performanceDays.map((day) => ({
		day,
		label: lang === "en" ? `Jul. ${day}` : `Júl. ${day}.`,
		items: sortedPerformers.filter((p) => p.day === day),
	}));
	const selected = tickets.find((t) => t.id === selectedId) ?? null;
	const selectedPerformances = sortedPerformers.filter((p) => selectedPerformanceIds.includes(p.id));
	const selectedPerformanceSet = new Set(selectedPerformanceIds);
	const conflictPairs = getPerformanceConflictPairs(selectedPerformances);
	const conflictedIds = new Set(conflictPairs.flatMap(({ a, b }) => [a.id, b.id]));
	const hasConflicts = conflictPairs.length > 0;
	const countdownTarget = getEarliestUpcomingPerformance(selectedPerformances, now);
	const countdown = countdownTarget ? formatCountdown(getPerformanceDate(countdownTarget), now) : null;
	const cartItems = selected ? selectedPerformances.map((performance) => ({
		performance,
		quantity,
		unitPrice: selected.price,
		lineTotal: selected.price * quantity,
	})) : [];
	const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
	const discountAmount = calculateDiscountAmount(selectedDiscount, subtotal, selectedPerformances.length);
	const amountAfterDiscount = Math.max(0, subtotal - discountAmount);
	const serviceFee = calculateServiceFee(amountAfterDiscount);
	const handlingFee = calculateHandlingFee(cartItems.length);
	const total = amountAfterDiscount + serviceFee + handlingFee;
	const selectedDiscountOption = getDiscountOption(selectedDiscount);
	const emailValid = isValidEmail(email);
	const showEmailError = email.length > 0 && !emailValid;
	const canCheckout = !!selected && selectedPerformances.length > 0 && emailValid && !hasConflicts;
	const earliestRefundDeadline = getEarliestRefundDeadline(selectedPerformances);
	const canRequestRefund = selectedPerformances.length > 0 && !!earliestRefundDeadline && now.getTime() <= earliestRefundDeadline.getTime() && !refundRequested;

	const togglePerformanceDay = (day: number) => {
		setExpandedPerformanceDays((prev) => ({ ...prev, [day]: !prev[day] }));
	};

	if (orderComplete && selected && selectedPerformances.length > 0 && countdownTarget && countdown) {
		return (
			<View style={styles.ticketsScreen}>
				<ScrollView contentContainerStyle={styles.orderSuccessScroll} showsVerticalScrollIndicator={false}>
					<View style={styles.orderSuccessIcon}>
						<Ionicons name="checkmark-circle" size={56} color="#22c55e" />
					</View>
					<Text style={styles.orderSuccessTitle}>{t.purchaseSuccess}</Text>
					<View style={styles.emailSentBadge}>
						<Ionicons name="mail" size={16} color="#22c55e" style={{ marginRight: 6 }} />
						<Text style={styles.emailSentText}>{lang === "en" ? "Confirmation email sent successfully!" : "Visszaigazoló e-mail sikeresen elküldve!"}</Text>
					</View>
					<Text style={styles.orderSuccessTitle}>Sikeres vásárlás!</Text>
					<Text style={styles.orderSuccessSub}>
						A visszaigazolást elküldjük erre a címre:
					</Text>
					<Text style={styles.orderSuccessEmail}>{email.trim()}</Text>

					<View style={styles.orderSummaryCard}>
						<Text style={styles.orderSummaryLabel}>{t.orderLabel}</Text>
						<Text style={styles.orderSummaryName}>{selected.name}</Text>
						<Text style={styles.orderSummaryDetail}>
							{quantity} db · {formatPrice(total, selected.currency)}
						</Text>
					</View>

					<View style={styles.countdownCard}>
						<Text style={styles.countdownLabel}>{t.countdownTitle}</Text>
						<Text style={styles.countdownTargetName}>{countdownTarget.name}</Text>
						<View style={styles.countdownGrid}>
							<View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdown.days}</Text><Text style={styles.countdownUnit}>{t.days}</Text></View>
							<View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdown.hours}</Text><Text style={styles.countdownUnit}>{t.hours}</Text></View>
							<View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdown.minutes}</Text><Text style={styles.countdownUnit}>{t.minutes}</Text></View>
						</View>
					</View>

					<View style={styles.refundPolicyCard}>
						<View style={styles.refundPolicyHeader}>
							<Ionicons name="shield-checkmark-outline" size={18} color={THEME.accent} />
							<Text style={styles.refundPolicyTitle}>{t.refundPolicyTitle}</Text>
						</View>
						<Text style={styles.refundPolicyText}>
							{lang === "en"
								? `Tickets are associated with the selected performances. Refund requests can be initiated at most ${REFUND_DEADLINE_HOURS} hours before the start of the performance. For multiple performances, the earliest deadline will be considered.`
								: `A jegyek a kiválasztott fellépésekhez vannak társítva. Visszatérítési kérelmet legkésőbb ${REFUND_DEADLINE_HOURS} órával az érintett fellépés kezdése előtt lehet indítani. Több fellépésnél a legkorábbi határidőt vesszük figyelembe.`}
						</Text>
						<Text style={styles.refundDeadlineText}>{lang === "en" ? "Earliest deadline" : "Legkorábbi határidő"}: {formatRefundDeadlineDate(earliestRefundDeadline, lang)}</Text>
						{refundRequested ? (
							<View style={styles.refundRequestedBadge}><Text style={styles.refundRequestedText}>{t.refundRequested}</Text></View>
						) : (
							<TouchableOpacity style={[styles.refundBtn, !canRequestRefund && styles.refundBtnDisabled]} onPress={onRequestRefund} disabled={!canRequestRefund}>
								<Ionicons name="return-up-back-outline" size={16} color={THEME.text} />
								<Text style={styles.refundBtnText}>{canRequestRefund ? t.requestRefund : t.refundExpired}</Text>
							</TouchableOpacity>
						)}
					</View>

					<TouchableOpacity style={styles.checkoutBtn} onPress={onReset}>
						<Text style={styles.checkoutBtnText}>{t.newPurchase}</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}

	return (
		<View style={styles.ticketsScreen}>
			<ScrollView
				contentContainerStyle={styles.ticketsScroll}
				showsVerticalScrollIndicator={false}
			>
				<Text style={styles.ticketsHeading}>Jegyvásárlás</Text>
				<Text style={styles.ticketsSubheading}>
					Válaszd ki a jegytípust, add meg a mennyiséget és az e-mail címed.
				</Text>
				{tickets.map((ticket) => (
					<TicketCard
						key={ticket.id}
						ticket={ticket}
						selected={selectedId === ticket.id}
						onSelect={() => onSelect(ticket.id)}
					/>
				))}

				<View style={styles.ticketSectionHeader}>
					<Text style={styles.ticketSectionTitle}>{t.ticketStep2}</Text>
					<Text style={styles.ticketSectionHint}>
						{selectedPerformances.length > 0 
							? (lang === "en" ? `${selectedPerformances.length} selected` : `${selectedPerformances.length} kiválasztva`) 
							: t.multipleSelectable}
					</Text>
				</View>
				<View style={styles.performanceAccordionList}>
					{performancesByDay.map(({ day, label, items }) => {
						const expanded = expandedPerformanceDays[day] ?? false;
						const selectedCountForDay = items.filter((p) => selectedPerformanceSet.has(p.id)).length;
						const hasConflictOnDay = items.some((p) => conflictedIds.has(p.id));
						return (
							<View key={day} style={[styles.performanceDayGroup, hasConflictOnDay && styles.performanceDayGroupWarning]}>
								<TouchableOpacity style={styles.performanceDayHeader} onPress={() => togglePerformanceDay(day)} activeOpacity={0.85}>
									<View style={styles.performanceDayHeaderLeft}>
										<View style={[styles.performanceDayIcon, expanded && styles.performanceDayIconActive]}>
											<Ionicons name="calendar-outline" size={18} color={expanded ? THEME.text : THEME.accent} />
										</View>
										<View>
											<Text style={styles.performanceDayTitle}>{label}</Text>
											<Text style={styles.performanceDaySubtitle}>
												{items.length} {lang === "en" ? (items.length === 1 ? "performance" : "performances") : "fellépés"} · {selectedCountForDay > 0 ? (lang === "en" ? `${selectedCountForDay} selected` : `${selectedCountForDay} kiválasztva`) : t.noneSelected}
											</Text>
										</View>
									</View>
									<View style={styles.performanceDayHeaderRight}>
										{hasConflictOnDay && <View style={styles.performanceDayWarningBadge}><Ionicons name="warning-outline" size={13} color="#fed7aa" /><Text style={styles.performanceDayWarningText}>{t.conflictBadge}</Text></View>}
										<Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={THEME.textMuted} />
									</View>
								</TouchableOpacity>
								{expanded && (
									<View style={styles.performanceDayBody}>
										{items.map((performer) => (
											<PerformanceTicketCard
												key={performer.id}
												performer={performer}
												selected={selectedPerformanceSet.has(performer.id)}
												conflicted={conflictedIds.has(performer.id)}
												onSelect={() => onTogglePerformance(performer.id)}
												lang={lang}
											/>
										))}
									</View>
								)}
							</View>
						);
					})}
				</View>

				{hasConflicts && (
					<View style={styles.performanceConflictPanel}>
						<View style={styles.performanceConflictHeader}>
							<Ionicons name="warning-outline" size={18} color="#fb923c" />
							<Text style={styles.performanceConflictTitle}>{t.timeConflict}</Text>
						</View>
						<Text style={styles.performanceConflictText}>{t.conflictDesc}</Text>
						{conflictPairs.map(({ a, b }) => (
							<Text key={`${a.id}-${b.id}`} style={styles.performanceConflictItem}>• {a.name} ({a.startTime}–{a.endTime}) {lang === "en" ? "and" : "és"} {b.name} ({b.startTime}–{b.endTime})</Text>
						))}
					</View>
				)}

				{selected && selectedPerformances.length > 0 && (
					<View style={styles.discountSection}>
						<View style={styles.ticketSectionHeader}>
							<Text style={styles.ticketSectionTitle}>{t.ticketStep3}</Text>
							<Text style={styles.ticketSectionHint}>{t.discountDesc}</Text>
						</View>
						<View style={styles.discountGrid}>
							{DISCOUNT_OPTIONS.map((option) => {
								const localizedOption = getLocalizedDiscountOption(option.key, lang);
								const active = selectedDiscount === option.key;
								const disabled = !isDiscountAvailable(option.key, selectedPerformances.length);
								return (
									<TouchableOpacity
										key={option.key}
										style={[styles.discountChip, active && styles.discountChipActive, disabled && styles.discountChipDisabled]}
										onPress={() => !disabled && setSelectedDiscount(option.key)}
										disabled={disabled}
									>
										<View style={styles.discountChipHeader}>
											<Text style={[styles.discountChipTitle, active && styles.discountChipTitleActive]}>{localizedOption.title}</Text>
											{option.percent > 0 && <Text style={styles.discountChipPercent}>-{option.percent}%</Text>}
										</View>
										<Text style={styles.discountChipDescription}>
											{disabled 
												? (lang === "en" ? `Requires at least ${option.minPerformances} performances` : `Legalább ${option.minPerformances} fellépés kell hozzá`) 
												: localizedOption.description}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>
				)}

				{selected && cartItems.length > 0 && (
					<View style={styles.cartCard}>
						<View style={styles.cartHeaderRow}>
							<View>
								<Text style={styles.cartEyebrow}>{t.cartTitle}</Text>
								<Text style={styles.cartTitle}>{t.orderReview}</Text>
							</View>
							<View style={styles.cartCountBadge}><Text style={styles.cartCountText}>{cartItems.length}</Text></View>
						</View>
						{cartItems.map(({ performance, lineTotal }) => (
							<View key={performance.id} style={styles.cartItemRow}>
								<View style={styles.cartItemInfo}>
									<Text style={styles.cartItemName}>{performance.name}</Text>
									<Text style={styles.cartItemMeta}>{selected.name} · {quantity} {lang === "en" ? "pcs" : "db"} · {formatPerformanceDate(performance, lang)}</Text>
								</View>
								<Text style={styles.cartItemPrice}>{formatPrice(lineTotal, selected.currency, lang)}</Text>
							</View>
						))}
						<View style={styles.cartTotals}>
							<View style={styles.cartTotalLine}><Text style={styles.cartTotalLabel}>{t.subtotal}</Text><Text style={styles.cartTotalValue}>{formatPrice(subtotal, selected.currency, lang)}</Text></View>
							<View style={styles.cartTotalLine}><Text style={styles.cartDiscountLabel}>{t.discountLabel} · {getLocalizedDiscountOption(selectedDiscount, lang).title}</Text><Text style={styles.cartDiscountValue}>− {formatPrice(discountAmount, selected.currency, lang)}</Text></View>
							<View style={styles.cartTotalLine}><Text style={styles.cartTotalLabel}>{t.handlingFee}</Text><Text style={styles.cartTotalValue}>{formatPrice(handlingFee, selected.currency, lang)}</Text></View>
							<View style={styles.cartTotalLine}><Text style={styles.cartTotalLabel}>{t.serviceFee} ({Math.round(SERVICE_FEE_RATE * 1000) / 10}%)</Text><Text style={styles.cartTotalValue}>{formatPrice(serviceFee, selected.currency, lang)}</Text></View>
							<View style={styles.cartGrandTotalLine}><Text style={styles.cartGrandTotalLabel}>{t.payable}</Text><Text style={styles.cartGrandTotalValue}>{formatPrice(total, selected.currency, lang)}</Text></View>
						</View>
						<Text style={styles.cartLegalNote}>{t.feeDisclaimer}</Text>
					</View>
				)}

				{selectedPerformances.length > 0 && countdownTarget && countdown && (
					<View style={styles.selectedPerformancePanel}>
						<Text style={styles.selectedPerformanceLabel}>{t.selectedPerformances}</Text>
						{selectedPerformances.map((performance) => (
							<View key={performance.id} style={styles.selectedPerformanceLine}>
								<Text style={styles.selectedPerformanceName}>{performance.name}</Text>
								<Text style={styles.selectedPerformanceMeta}>{performance.stage} · {formatPerformanceDate(performance, lang)}</Text>
							</View>
						))}
						<View style={styles.miniCountdownRow}>
							<Text style={styles.miniCountdownText}>
								{lang === "en"
									? `${countdownTarget.name}: ${countdown.days} days · ${countdown.hours} hours · ${countdown.minutes} minutes remaining`
									: `${countdownTarget.name}: ${countdown.days} nap · ${countdown.hours} óra · ${countdown.minutes} perc van hátra`}
							</Text>
						</View>
						<Text style={styles.selectedRefundInfo}>
							{lang === "en" ? "Earliest cancellation deadline: " : "Legkorábbi visszamondási határidő: "}{formatRefundDeadlineDate(earliestRefundDeadline, lang)}
						</Text>
					</View>
				)}
			</ScrollView>
			<View style={styles.checkoutBar}>
				{selected ? (
					<>
						<View style={styles.quantityRow}>
							<Text style={styles.quantityLabel}>{t.qtyPerPerformance}</Text>
							<View style={styles.quantityControls}>
								<TouchableOpacity
									style={[
										styles.quantityBtn,
										quantity <= 1 && styles.quantityBtnDisabled,
									]}
									onPress={() => onChangeQuantity(-1)}
									disabled={quantity <= 1}
								>
									<Ionicons name="remove" size={18} color="#e8d8ff" />
								</TouchableOpacity>
								<Text style={styles.quantityValue}>{quantity}</Text>
								<TouchableOpacity
									style={styles.quantityBtn}
									onPress={() => onChangeQuantity(1)}
								>
									<Ionicons name="add" size={18} color="#e8d8ff" />
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.emailField}>
							<Text style={styles.emailLabel}>{t.emailAddress}</Text>
							<TextInput
								style={[
									styles.emailInput,
									showEmailError && styles.emailInputError,
								]}
								value={email}
								onChangeText={onEmailChange}
								placeholder="pelda@email.com"
								placeholderTextColor="rgba(168,85,247,0.35)"
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								autoComplete="email"
							/>
							{showEmailError && (
								<Text style={styles.emailErrorText}>
									Érvényes e-mail címet adj meg
								</Text>
							)}
						</View>
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>Összesen</Text>
							<Text style={styles.totalValue}>
								{formatPrice(total, selected.currency)}
							</Text>
						</View>
					</>
				) : (
					<Text style={styles.checkoutHint}>
						Válassz egy jegytípust a folytatáshoz
					</Text>
				)}
				<TouchableOpacity
					style={[
						styles.checkoutBtn,
						!canCheckout && styles.checkoutBtnDisabled,
					]}
					onPress={onPurchase}
					disabled={!canCheckout}
				>
					<Ionicons name="card-outline" size={18} color="#f0e8ff" />
					<Text style={styles.checkoutBtnText}>{t.checkout}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}


// ─── Canvas térkép segédfüggvények ────────────────────────────────────────────

// GPS koordinátákat vászon pixelekre konvertál
// ─── GPS → SVG koordináta konverter ──────────────────────────────────────────
function gpsToXY(
	lat: number,
	lng: number,
	bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
	W: number,
	H: number,
): { x: number; y: number } {
	const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * W;
	const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * H;
	return { x, y };
}

// ─── Térkép képernyő ──────────────────────────────────────────────────────────
// react-native-svg alapú illusztrált fesztivál térkép

const SCREEN_W = Dimensions.get("window").width;
const MAP_W = 420;
const MAP_H = 520;

// ─── Térkép konstansok ────────────────────────────────────────────────────────
const COLORS = {
	grass: "#2d5a1b",
	grassLight: "#3a7023",
	grassDark: "#1e4012",
	path: "#c8b99a",
	pathDark: "#a89070",
	road: "#8b7355",
	fence: "#6b4c2a",
	stageMain: "#4a0080",
	stagePurple: "#6b21a8",
	stageBlue: "#1d4ed8",
	stageGold: "#b45309",
	water: "#1e40af",
	waterLight: "#3b82f6",
	campTeal: "#0d9488",
	campLight: "#14b8a6",
	food: "#d97706",
	foodLight: "#fbbf24",
	service: "#0891b2",
	merch: "#be185d",
	vip: "#7c3aed",
	entrance: "#16a34a",
	parking: "#475569",
	tree: "#166534",
	treeLight: "#15803d",
	treeShadow: "#14532d",
	text: "#f0e8ff",
	textDark: "#1a0a30",
	white: "#ffffff",
	shadow: "rgba(0,0,0,0.3)",
};

// ─── Segéd komponensek ────────────────────────────────────────────────────────

// Fa komponens
function MapTree({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
	return (
		<G>
			<Ellipse
				cx={x + 2}
				cy={y + r * 0.6}
				rx={r * 0.55}
				ry={r * 0.22}
				fill={COLORS.treeShadow}
				opacity={0.5}
			/>
			<Circle cx={x} cy={y} r={r} fill={COLORS.treeShadow} opacity={0.3} />
			<Circle cx={x} cy={y} r={r * 0.85} fill={COLORS.tree} />
			<Circle
				cx={x - r * 0.2}
				cy={y - r * 0.2}
				r={r * 0.7}
				fill={COLORS.treeLight}
			/>
			<Circle
				cx={x + r * 0.1}
				cy={y - r * 0.3}
				r={r * 0.45}
				fill="#22c55e"
				opacity={0.6}
			/>
		</G>
	);
}

// Bokor komponens
function MapBush({ x, y }: { x: number; y: number }) {
	return (
		<G>
			<Ellipse
				cx={x + 1}
				cy={y + 5}
				rx={9}
				ry={4}
				fill={COLORS.treeShadow}
				opacity={0.3}
			/>
			<Circle cx={x - 4} cy={y + 1} r={6} fill={COLORS.tree} />
			<Circle cx={x + 4} cy={y + 1} r={6} fill={COLORS.tree} />
			<Circle cx={x} cy={y - 2} r={7} fill={COLORS.treeLight} />
		</G>
	);
}

// Színpad épület komponens
function MapStage({
	x,
	y,
	w,
	h,
	color,
	label,
	sublabel,
	icon,
}: {
	x: number;
	y: number;
	w: number;
	h: number;
	color: string;
	label: string;
	sublabel?: string;
	icon: string;
}) {
	const depth = 8;
	const sideColor = color + "88";
	return (
		<G>
			{/* Árnyék */}
			<Rect
				x={x + 4}
				y={y + 4}
				width={w}
				height={h}
				rx={4}
				fill="rgba(0,0,0,0.4)"
			/>
			{/* Oldalsó 3D hatás */}
			<Polygon
				points={`${x + w},${y} ${x + w + depth},${y + depth} ${x + w + depth},${y + h + depth} ${x + w},${y + h}`}
				fill={sideColor}
			/>
			<Polygon
				points={`${x},${y + h} ${x + depth},${y + h + depth} ${x + w + depth},${y + h + depth} ${x + w},${y + h}`}
				fill={sideColor}
			/>
			{/* Fő felület */}
			<Rect x={x} y={y} width={w} height={h} rx={4} fill={color} />
			{/* Tető sáv */}
			<Rect
				x={x}
				y={y}
				width={w}
				height={h * 0.3}
				rx={4}
				fill="rgba(255,255,255,0.15)"
			/>
			{/* Ikon */}
			<SvgText
				x={x + w / 2}
				y={y + h * 0.45}
				fontSize={16}
				textAnchor="middle"
				fill={COLORS.white}
			>
				{icon}
			</SvgText>
			{/* Felirat */}
			<SvgText
				x={x + w / 2}
				y={y + h * 0.68}
				fontSize={8}
				fontWeight="bold"
				textAnchor="middle"
				fill={COLORS.white}
				letterSpacing={0.5}
			>
				{label}
			</SvgText>
			{sublabel && (
				<SvgText
					x={x + w / 2}
					y={y + h * 0.82}
					fontSize={6.5}
					textAnchor="middle"
					fill="rgba(255,255,255,0.8)"
				>
					{sublabel}
				</SvgText>
			)}
		</G>
	);
}

// POI jelölő
function MapPin({
	x,
	y,
	color,
	icon,
	label,
}: {
	x: number;
	y: number;
	color: string;
	icon: string;
	label: string;
}) {
	return (
		<G>
			<Ellipse cx={x + 1} cy={y + 18} rx={8} ry={3} fill="rgba(0,0,0,0.3)" />
			<Path
				d={`M${x},${y} C${x - 10},${y - 8} ${x - 10},${y - 22} ${x},${y - 26} C${x + 10},${y - 22} ${x + 10},${y - 8} ${x},${y}`}
				fill={color}
			/>
			<Circle cx={x} cy={y - 18} r={9} fill="rgba(255,255,255,0.2)" />
			<SvgText
				x={x}
				y={y - 14}
				fontSize={10}
				textAnchor="middle"
				fill={COLORS.white}
			>
				{icon}
			</SvgText>
			{/* Felirat buborék */}
			<Rect
				x={x - 20}
				y={y - 42}
				width={40}
				height={14}
				rx={7}
				fill="rgba(0,0,0,0.75)"
			/>
			<SvgText
				x={x}
				y={y - 32}
				fontSize={7}
				fontWeight="bold"
				textAnchor="middle"
				fill={COLORS.white}
			>
				{label}
			</SvgText>
		</G>
	);
}

// Kemping sátor
function MapTent({
	x,
	y,
	color = COLORS.campTeal,
}: {
	x: number;
	y: number;
	color?: string;
}) {
	return (
		<G>
			<Polygon
				points={`${x},${y - 12} ${x - 10},${y + 4} ${x + 10},${y + 4}`}
				fill={color}
			/>
			<Polygon
				points={`${x},${y - 12} ${x - 6},${y + 4} ${x + 6},${y + 4}`}
				fill="rgba(255,255,255,0.2)"
			/>
			<Rect
				x={x - 4}
				y={y - 2}
				width={8}
				height={6}
				rx={1}
				fill={COLORS.textDark}
				opacity={0.5}
			/>
		</G>
	);
}

// ─── Fő MapScreen ─────────────────────────────────────────────────────────────
function MapScreen({ map }: { map: FestivalMap }) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [mapView, setMapView] = useState<"map" | "list">("map");
	const [filter, setFilter] = useState<MapFilter>("all");

	// ÚJ: Az SOS panel állapota
	const [sosVisible, setSosVisible] = useState(false);
	const [sosSent, setSosSent] = useState(false);

	// Pan & Zoom state
	const scale = useRef(1);
	const translateX = useRef(0);
	const translateY = useRef(0);
	const lastScale = useRef(1);
	const lastTX = useRef(0);
	const lastTY = useRef(0);
	const [transform, setTransform] = useState({ scale: 1, tx: 0, ty: 0 });

	const handleSendSOS = () => {
		setSosSent(true);
		// Itt a valóságban elküldenénk a GPS adatokat a szervernek
		setTimeout(() => {
			setSosVisible(false);
			setSosSent(false);
		}, 3000); // 3 másodperc után bezárjuk a siker-üzenetet
	};

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				lastTX.current = translateX.current;
				lastTY.current = translateY.current;
				lastScale.current = scale.current;
			},
			onPanResponderMove: (_, gs) => {
				if (gs.numberActiveTouches === 1) {
					translateX.current = lastTX.current + gs.dx;
					translateY.current = lastTY.current + gs.dy;
					setTransform({
						scale: scale.current,
						tx: translateX.current,
						ty: translateY.current,
					});
				}
			},
			onPanResponderRelease: () => {},
		}),
	).current;

	const selected = map.points.find((p) => p.id === selectedId) ?? null;

	const renderDetailCard = (point: MapPoint) => (
		<View style={styles.mapDetailCard}>
			<View
				style={[
					styles.mapDetailAccent,
					{ backgroundColor: MAP_CATEGORY_META[point.category].color },
				]}
			/>
			<View style={styles.mapDetailBody}>
				<View style={styles.mapDetailHeader}>
					<Text style={styles.mapDetailName}>{point.name}</Text>
					<View style={styles.mapDetailBadge}>
						<Text style={styles.mapDetailBadgeText}>
							{MAP_CATEGORY_META[point.category].label}
						</Text>
					</View>
				</View>
				<Text style={styles.mapDetailDescription}>{point.description}</Text>
				{Platform.OS !== "web" && (
					<TouchableOpacity
						style={styles.mapOpenExternalBtn}
						onPress={() => openInGoogleMaps(point)}
					>
						<Ionicons name="open-outline" size={14} color="#c084fc" />
						<Text style={styles.mapOpenExternalText}>
							Megnyitás Google Maps-ben
						</Text>
					</TouchableOpacity>
				)}
			</View>
			<TouchableOpacity
				style={styles.mapDetailClose}
				onPress={() => setSelectedId(null)}
			>
				<Ionicons name="close" size={18} color="#888" />
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.mapScreen}>
			{/* Fejléc */}
			<View style={styles.mapHeader}>
				<Text style={styles.mapHeading}>Térkép</Text>
				<Text style={styles.mapVenue}>{map.venueName}</Text>
			</View>

			{/* Nézet váltó */}
			<View style={styles.mapViewToggle}>
				<TouchableOpacity
					style={[
						styles.mapViewToggleBtn,
						mapView === "map" && styles.mapViewToggleBtnActive,
					]}
					onPress={() => setMapView("map")}
				>
					<Ionicons
						name="map-outline"
						size={14}
						color={mapView === "map" ? "#a855f7" : "rgba(168,85,247,0.45)"}
					/>
					<Text
						style={[
							styles.mapViewToggleText,
							mapView === "map" && styles.mapViewToggleTextActive,
						]}
					>
						Térkép
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.mapViewToggleBtn,
						mapView === "list" && styles.mapViewToggleBtnActive,
					]}
					onPress={() => setMapView("list")}
				>
					<Ionicons
						name="list-outline"
						size={14}
						color={mapView === "list" ? "#a855f7" : "rgba(168,85,247,0.45)"}
					/>
					<Text
						style={[
							styles.mapViewToggleText,
							mapView === "list" && styles.mapViewToggleTextActive,
						]}
					>
						Lista
					</Text>
				</TouchableOpacity>
			</View>

			{/* SVG TÉRKÉP NÉZET */}
			{mapView === "map" && (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 24 }}
				>
					{/* Térkép konténer */}
					<View style={styles.svgMapContainer} {...panResponder.panHandlers}>
						<Svg
							width={SCREEN_W - 24}
							height={(SCREEN_W - 24) * (MAP_H / MAP_W)}
							viewBox={`0 0 ${MAP_W} ${MAP_H}`}
							style={{ borderRadius: 16 }}
						>
							<Defs>
								<LinearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
									<Stop offset="0" stopColor={COLORS.grassLight} />
									<Stop offset="1" stopColor={COLORS.grassDark} />
								</LinearGradient>
								<LinearGradient id="stageMainGrad" x1="0" y1="0" x2="0" y2="1">
									<Stop offset="0" stopColor="#7c3aed" />
									<Stop offset="1" stopColor="#4a0080" />
								</LinearGradient>
								<RadialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
									<Stop offset="0" stopColor="#a855f7" stopOpacity="0.4" />
									<Stop offset="1" stopColor="#a855f7" stopOpacity="0" />
								</RadialGradient>
							</Defs>

							{/* ═══ ALAP HÁTTÉR ═══ */}
							<Rect
								x={0}
								y={0}
								width={MAP_W}
								height={MAP_H}
								fill="url(#grassGrad)"
							/>

							{/* Textura rács */}
							{Array.from({ length: 20 }, (_, i) => (
								<Line
									key={`gh${i}`}
									x1={0}
									y1={i * 26}
									x2={MAP_W}
									y2={i * 26}
									stroke="rgba(0,0,0,0.06)"
									strokeWidth={0.5}
								/>
							))}
							{Array.from({ length: 16 }, (_, i) => (
								<Line
									key={`gv${i}`}
									x1={i * 26}
									y1={0}
									x2={i * 26}
									y2={MAP_H}
									stroke="rgba(0,0,0,0.06)"
									strokeWidth={0.5}
								/>
							))}

							{/* ═══ HELYSZÍN KERÍTÉS ═══ */}
							<Rect
								x={8}
								y={8}
								width={MAP_W - 16}
								height={MAP_H - 16}
								rx={12}
								fill="none"
								stroke={COLORS.fence}
								strokeWidth={3}
								strokeDasharray="8,4"
							/>
							<Rect
								x={12}
								y={12}
								width={MAP_W - 24}
								height={MAP_H - 24}
								rx={10}
								fill="none"
								stroke="rgba(107,76,42,0.4)"
								strokeWidth={1}
							/>

							{/* ═══ TAVACSKA / VÍZ ═══ */}
							<Ellipse
								cx={340}
								cy={80}
								rx={55}
								ry={35}
								fill={COLORS.water}
								opacity={0.85}
							/>
							<Ellipse
								cx={338}
								cy={77}
								rx={50}
								ry={29}
								fill={COLORS.waterLight}
								opacity={0.4}
							/>
							<SvgText
								x={340}
								y={82}
								fontSize={8}
								textAnchor="middle"
								fill="rgba(255,255,255,0.7)"
								fontStyle="italic"
							>
								tó
							</SvgText>

							{/* ═══ FŐ ÚTVONALAK ═══ */}
							{/* Középső főút - vízszintes */}
							<Rect
								x={20}
								y={268}
								width={MAP_W - 40}
								height={18}
								rx={3}
								fill={COLORS.path}
							/>
							<Rect
								x={20}
								y={272}
								width={MAP_W - 40}
								height={10}
								rx={2}
								fill={COLORS.pathDark}
								opacity={0.3}
							/>
							{/* Középső főút - függőleges */}
							<Rect
								x={192}
								y={20}
								width={18}
								height={MAP_H - 40}
								rx={3}
								fill={COLORS.path}
							/>
							<Rect
								x={196}
								y={20}
								width={10}
								height={MAP_H - 40}
								rx={2}
								fill={COLORS.pathDark}
								opacity={0.3}
							/>
							{/* Átlós sétány bal */}
							<Path
								d="M 20,180 Q 100,220 192,268"
								stroke={COLORS.path}
								strokeWidth={12}
								fill="none"
								strokeLinecap="round"
							/>
							<Path
								d="M 20,180 Q 100,220 192,268"
								stroke={COLORS.pathDark}
								strokeWidth={4}
								fill="none"
								strokeLinecap="round"
								opacity={0.3}
							/>
							{/* Átlós sétány jobb */}
							<Path
								d="M 210,268 Q 310,230 400,180"
								stroke={COLORS.path}
								strokeWidth={12}
								fill="none"
								strokeLinecap="round"
							/>
							{/* Kemping sétány */}
							<Path
								d="M 20,120 L 100,120 L 100,268"
								stroke={COLORS.path}
								strokeWidth={10}
								fill="none"
								strokeLinecap="round"
							/>
							{/* Déli sétány */}
							<Path
								d="M 100,380 Q 200,350 300,380"
								stroke={COLORS.path}
								strokeWidth={10}
								fill="none"
								strokeLinecap="round"
							/>

							{/* Útvonal jelölések (nyilak) */}
							<SvgText
								x={201}
								y={440}
								fontSize={7}
								fill="rgba(255,255,255,0.4)"
								textAnchor="middle"
							>
								↑↓
							</SvgText>
							<SvgText
								x={300}
								y={277}
								fontSize={7}
								fill="rgba(255,255,255,0.4)"
								textAnchor="middle"
							>
								→
							</SvgText>

							{/* ═══ KEMPING ZÓNA ═══ */}
							<Rect
								x={20}
								y={30}
								width={120}
								height={140}
								rx={8}
								fill={COLORS.campTeal}
								opacity={0.12}
								stroke={COLORS.campTeal}
								strokeWidth={1.5}
								strokeDasharray="6,3"
							/>
							<SvgText
								x={80}
								y={50}
								fontSize={8}
								fontWeight="bold"
								textAnchor="middle"
								fill={COLORS.campTeal}
								letterSpacing={1.5}
							>
								KEMPING ZÓNA
							</SvgText>
							{/* Sátrak */}
							<MapTent x={45} y={85} />
							<MapTent x={75} y={85} />
							<MapTent x={105} y={85} />
							<MapTent x={60} y={115} />
							<MapTent x={90} y={115} />
							<MapTent x={45} y={148} color="#0e7490" />
							<MapTent x={75} y={148} color="#0e7490" />
							<MapTent x={105} y={148} color="#0e7490" />

							{/* ═══ PARKOLÓ ═══ */}
							<Rect
								x={20}
								y={380}
								width={80}
								height={110}
								rx={6}
								fill={COLORS.parking}
								opacity={0.25}
								stroke={COLORS.parking}
								strokeWidth={1.5}
							/>
							<SvgText
								x={60}
								y={438}
								fontSize={28}
								fontWeight="900"
								textAnchor="middle"
								fill="rgba(148,163,184,0.8)"
							>
								P
							</SvgText>
							<SvgText
								x={60}
								y={455}
								fontSize={7}
								textAnchor="middle"
								fill="rgba(148,163,184,0.6)"
							>
								PARKOLÓ
							</SvgText>
							{/* Parkoló sorok */}
							{[0, 1, 2].map((i) => (
								<Line
									key={`ps${i}`}
									x1={28 + i * 24}
									y1={385}
									x2={28 + i * 24}
									y2={485}
									stroke="rgba(148,163,184,0.3)"
									strokeWidth={1}
									strokeDasharray="4,4"
								/>
							))}

							{/* ═══ MAIN STAGE – ÉSZAK-KÖZÉP ═══ */}
							<Circle cx={201} cy={100} r={45} fill="url(#stageGlow)" />
							<MapStage
								x={160}
								y={55}
								w={82}
								h={60}
								color="#5b21b6"
								label="MAIN STAGE"
								sublabel="EclipseFest"
								icon="🎤"
							/>

							{/* ═══ ELECTRONIC STAGE – NYUGAT ═══ */}
							<Circle cx={100} cy={220} r={30} fill="#1d4ed8" opacity={0.1} />
							<MapStage
								x={50}
								y={190}
								w={72}
								h={52}
								color="#1d4ed8"
								label="ELECTRONIC"
								sublabel="STAGE"
								icon="🎧"
							/>

							{/* ═══ ACOUSTIC STAGE – KELET ═══ */}
							<Circle cx={320} cy={210} r={30} fill="#b45309" opacity={0.1} />
							<MapStage
								x={278}
								y={178}
								w={72}
								h={52}
								color="#b45309"
								label="ACOUSTIC"
								sublabel="STAGE"
								icon="🎸"
							/>

							{/* ═══ SUNRISE STAGE – DÉL ═══ */}
							<Circle cx={201} cy={390} r={28} fill="#7c3aed" opacity={0.12} />
							<MapStage
								x={160}
								y={360}
								w={82}
								h={52}
								color="#6d28d9"
								label="SUNRISE"
								sublabel="STAGE"
								icon="🌅"
							/>

							{/* ═══ FOOD COURT – KÖZÉP-NYUGAT ═══ */}
							<Rect
								x={108}
								y={290}
								width={70}
								height={52}
								rx={8}
								fill="#92400e"
								opacity={0.3}
								stroke="#d97706"
								strokeWidth={1}
							/>
							<SvgText x={143} y={308} fontSize={16} textAnchor="middle">
								🍔
							</SvgText>
							<SvgText
								x={143}
								y={323}
								fontSize={7}
								fontWeight="bold"
								textAnchor="middle"
								fill="#fbbf24"
							>
								FOOD COURT
							</SvgText>
							<SvgText
								x={143}
								y={334}
								fontSize={6}
								textAnchor="middle"
								fill="rgba(251,191,36,0.7)"
							>
								étel & ital
							</SvgText>

							{/* ═══ STREET FOOD – NYUGAT ═══ */}
							<Rect
								x={22}
								y={290}
								width={60}
								height={48}
								rx={8}
								fill="#92400e"
								opacity={0.25}
								stroke="#d97706"
								strokeWidth={1}
							/>
							<SvgText x={52} y={308} fontSize={14} textAnchor="middle">
								🌮
							</SvgText>
							<SvgText
								x={52}
								y={322}
								fontSize={6.5}
								fontWeight="bold"
								textAnchor="middle"
								fill="#fbbf24"
							>
								STREET FOOD
							</SvgText>
							<SvgText
								x={52}
								y={332}
								fontSize={6}
								textAnchor="middle"
								fill="rgba(251,191,36,0.7)"
							>
								gyors falatkák
							</SvgText>

							{/* ═══ BÁRKÖZPONT – KELET ═══ */}
							<Rect
								x={248}
								y={290}
								width={62}
								height={48}
								rx={8}
								fill="#92400e"
								opacity={0.25}
								stroke="#d97706"
								strokeWidth={1}
							/>
							<SvgText x={279} y={308} fontSize={14} textAnchor="middle">
								🍺
							</SvgText>
							<SvgText
								x={279}
								y={322}
								fontSize={6.5}
								fontWeight="bold"
								textAnchor="middle"
								fill="#fbbf24"
							>
								BÁRKÖZPONT
							</SvgText>
							<SvgText
								x={279}
								y={332}
								fontSize={6}
								textAnchor="middle"
								fill="rgba(251,191,36,0.7)"
							>
								koktél & sör
							</SvgText>

							{/* ═══ MERCH VILLAGE ═══ */}
							<Rect
								x={228}
								y={160}
								width={44}
								height={38}
								rx={6}
								fill="#831843"
								opacity={0.35}
								stroke="#ec4899"
								strokeWidth={1}
							/>
							<SvgText x={250} y={178} fontSize={13} textAnchor="middle">
								👕
							</SvgText>
							<SvgText
								x={250}
								y={192}
								fontSize={6}
								fontWeight="bold"
								textAnchor="middle"
								fill="#f9a8d4"
							>
								MERCH
							</SvgText>

							{/* ═══ VIP LOUNGE – ÉSZAK-KELET ═══ */}
							<Rect
								x={318}
								y={130}
								width={80}
								height={40}
								rx={8}
								fill="#4c1d95"
								opacity={0.4}
								stroke="#7c3aed"
								strokeWidth={1.5}
							/>
							<SvgText x={358} y={147} fontSize={12} textAnchor="middle">
								⭐
							</SvgText>
							<SvgText
								x={358}
								y={161}
								fontSize={7}
								fontWeight="bold"
								textAnchor="middle"
								fill="#c4b5fd"
							>
								VIP LOUNGE
							</SvgText>

							{/* ═══ ARTIST MERCH ═══ */}
							<Rect
								x={318}
								y={178}
								width={80}
								height={36}
								rx={6}
								fill="#831843"
								opacity={0.3}
								stroke="#ec4899"
								strokeWidth={1}
							/>
							<SvgText x={358} y={193} fontSize={11} textAnchor="middle">
								🏷️
							</SvgText>
							<SvgText
								x={358}
								y={207}
								fontSize={6.5}
								fontWeight="bold"
								textAnchor="middle"
								fill="#f9a8d4"
							>
								ELŐADÓI STAND
							</SvgText>

							{/* ═══ FOTÓPONT ═══ */}
							<Rect
								x={318}
								y={222}
								width={80}
								height={36}
								rx={6}
								fill="#831843"
								opacity={0.25}
								stroke="#ec4899"
								strokeWidth={1}
							/>
							<SvgText x={358} y={237} fontSize={11} textAnchor="middle">
								📸
							</SvgText>
							<SvgText
								x={358}
								y={251}
								fontSize={6.5}
								fontWeight="bold"
								textAnchor="middle"
								fill="#f9a8d4"
							>
								FOTÓPONT
							</SvgText>

							{/* ═══ SZOLGÁLTATÁSOK – DÉLI SÁV ═══ */}
							{/* Elsősegély */}
							<Rect
								x={148}
								y={350}
								width={36}
								height={36}
								rx={6}
								fill="#7f1d1d"
								opacity={0.4}
								stroke="#ef4444"
								strokeWidth={1.5}
							/>
							<SvgText x={166} y={368} fontSize={14} textAnchor="middle">
								🏥
							</SvgText>
							<SvgText
								x={166}
								y={381}
								fontSize={6}
								textAnchor="middle"
								fill="#fca5a5"
							>
								SEGÉLY
							</SvgText>

							{/* Mosdó 1 – észak */}
							<Rect
								x={150}
								y={140}
								width={32}
								height={32}
								rx={5}
								fill="#164e63"
								opacity={0.5}
								stroke="#38bdf8"
								strokeWidth={1}
							/>
							<SvgText x={166} y={156} fontSize={13} textAnchor="middle">
								🚻
							</SvgText>
							<SvgText
								x={166}
								y={167}
								fontSize={6}
								textAnchor="middle"
								fill="#7dd3fc"
							>
								WC
							</SvgText>

							{/* Mosdó 2 – dél */}
							<Rect
								x={150}
								y={290}
								width={32}
								height={32}
								rx={5}
								fill="#164e63"
								opacity={0.5}
								stroke="#38bdf8"
								strokeWidth={1}
							/>
							<SvgText x={166} y={306} fontSize={13} textAnchor="middle">
								🚻
							</SvgText>
							<SvgText
								x={166}
								y={317}
								fontSize={6}
								textAnchor="middle"
								fill="#7dd3fc"
							>
								WC
							</SvgText>

							{/* Infópont */}
							<Rect
								x={238}
								y={350}
								width={36}
								height={36}
								rx={6}
								fill="#1e1b4b"
								opacity={0.5}
								stroke="#a855f7"
								strokeWidth={1.5}
							/>
							<SvgText x={256} y={368} fontSize={14} textAnchor="middle">
								ℹ️
							</SvgText>
							<SvgText
								x={256}
								y={381}
								fontSize={6}
								textAnchor="middle"
								fill="#c4b5fd"
							>
								INFÓ
							</SvgText>

							{/* ═══ FŐBEJÁRAT – DÉL KÖZÉP ═══ */}
							<Rect
								x={148}
								y={470}
								width={106}
								height={36}
								rx={8}
								fill={COLORS.entrance}
								opacity={0.9}
								stroke="#16a34a"
								strokeWidth={2}
							/>
							<SvgText x={201} y={487} fontSize={11} textAnchor="middle">
								🚪
							</SvgText>
							<SvgText
								x={201}
								y={500}
								fontSize={8}
								fontWeight="bold"
								textAnchor="middle"
								fill={COLORS.white}
								letterSpacing={1}
							>
								FŐBEJÁRAT
							</SvgText>

							{/* Bejárat nyilak */}
							<Line
								x1={201}
								y1={450}
								x2={201}
								y2={468}
								stroke="#22c55e"
								strokeWidth={2}
							/>
							<Polygon points="196,458 201,448 206,458" fill="#22c55e" />

							{/* ═══ FÁK ═══ */}
							{/* Északi fasor */}
							<MapTree x={150} y={28} r={16} />
							<MapTree x={220} y={22} r={14} />
							<MapTree x={265} y={28} r={15} />
							<MapTree x={308} y={25} r={13} />
							{/* Keleti fasor */}
							<MapTree x={395} y={120} r={14} />
							<MapTree x={400} y={160} r={12} />
							<MapTree x={398} y={200} r={15} />
							<MapTree x={397} y={260} r={13} />
							<MapTree x={395} y={320} r={12} />
							{/* Déli fasor */}
							<MapTree x={120} y={488} r={14} />
							<MapTree x={280} y={492} r={13} />
							<MapTree x={350} y={485} r={15} />
							<MapTree x={390} y={480} r={12} />
							{/* Nyugati fasor */}
							<MapTree x={18} y={320} r={13} />
							<MapTree x={20} y={360} r={14} />
							<MapTree x={18} y={400} r={12} />
							{/* Belsők */}
							<MapTree x={130} y={360} r={11} />
							<MapTree x={360} y={360} r={12} />
							<MapTree x={148} y={430} r={10} />
							<MapTree x={258} y={430} r={11} />

							{/* ═══ BOKROK ═══ */}
							<MapBush x={132} y={180} />
							<MapBush x={145} y={210} />
							<MapBush x={260} y={160} />
							<MapBush x={272} y={140} />
							<MapBush x={108} y={355} />
							<MapBush x={308} y={355} />
							<MapBush x={115} y={460} />
							<MapBush x={290} y={460} />
							<MapBush x={320} y={470} />
							<MapBush x={335} y={455} />
							<MapBush x={365} y={400} />
							<MapBush x={380} y={420} />

							{/* ═══ ÉSZAK IRÁNYTŰ ═══ */}
							<Circle
								cx={382}
								cy={32}
								r={16}
								fill="rgba(0,0,0,0.55)"
								stroke="rgba(168,85,247,0.6)"
								strokeWidth={1}
							/>
							<Polygon points="382,18 378,34 382,31 386,34" fill="#a855f7" />
							<Polygon
								points="382,46 378,30 382,33 386,30"
								fill="rgba(168,85,247,0.4)"
							/>
							<SvgText
								x={382}
								y={37}
								fontSize={7}
								fontWeight="bold"
								textAnchor="middle"
								fill="#f0e8ff"
							>
								N
							</SvgText>

							{/* ═══ SKÁLA ═══ */}
							<Rect
								x={20}
								y={500}
								width={60}
								height={6}
								rx={3}
								fill="rgba(255,255,255,0.3)"
							/>
							<Rect
								x={20}
								y={500}
								width={30}
								height={6}
								rx={3}
								fill="rgba(255,255,255,0.6)"
							/>
							<SvgText x={20} y={496} fontSize={6} fill="rgba(255,255,255,0.5)">
								0
							</SvgText>
							<SvgText x={75} y={496} fontSize={6} fill="rgba(255,255,255,0.5)">
								200m
							</SvgText>

							{/* ═══ CÍM / BRAND ═══ */}
							<Rect
								x={MAP_W - 120}
								y={MAP_H - 38}
								width={112}
								height={30}
								rx={6}
								fill="rgba(0,0,0,0.5)"
							/>
							<SvgText
								x={MAP_W - 64}
								y={MAP_H - 23}
								fontSize={9}
								fontWeight="bold"
								textAnchor="middle"
								fill="#a855f7"
								letterSpacing={1}
							>
								ECLIPSEFEST
							</SvgText>
							<SvgText
								x={MAP_W - 64}
								y={MAP_H - 12}
								fontSize={7}
								textAnchor="middle"
								fill="rgba(168,85,247,0.6)"
							>
								2026 · Budapest Park
							</SvgText>
						</Svg>
					</View>

					{/* Jelmagyarázat */}
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.mapLegend}
					>
						{(Object.keys(MAP_CATEGORY_META) as MapCategory[]).map((cat) => (
							<TouchableOpacity
								key={cat}
								style={styles.mapLegendItem}
								onPress={() => setFilter(filter === cat ? "all" : cat)}
							>
								<View
									style={[
										styles.mapLegendDot,
										{ backgroundColor: MAP_CATEGORY_META[cat].color },
									]}
								/>
								<Text
									style={[
										styles.mapLegendText,
										filter === cat && { color: MAP_CATEGORY_META[cat].color },
									]}
								>
									{MAP_CATEGORY_META[cat].label}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>

					{/* Kompakt lista a térkép alatt */}
					<View style={{ marginTop: 4 }}>
						{map.points
							.filter((p) => filter === "all" || p.category === filter)
							.map((item) => (
								<TouchableOpacity
									key={item.id}
									style={[
										styles.mapPointItem,
										selectedId === item.id && styles.mapPointItemSelected,
									]}
									onPress={() =>
										setSelectedId(selectedId === item.id ? null : item.id)
									}
								>
									<View
										style={[
											styles.mapPointIconWrap,
											{
												backgroundColor: `${MAP_CATEGORY_META[item.category].color}22`,
											},
										]}
									>
										<Ionicons
											name={
												MAP_CATEGORY_META[item.category]
													.icon as keyof typeof Ionicons.glyphMap
											}
											size={18}
											color={MAP_CATEGORY_META[item.category].color}
										/>
									</View>
									<View style={styles.mapPointItemText}>
										<Text style={styles.mapPointItemName}>{item.name}</Text>
										<Text style={styles.mapPointItemCategory}>
											{MAP_CATEGORY_META[item.category].label}
										</Text>
									</View>
									<Ionicons
										name={
											selectedId === item.id ? "chevron-up" : "chevron-down"
										}
										size={16}
										color="rgba(168,85,247,0.4)"
									/>
								</TouchableOpacity>
							))}
						{selected && renderDetailCard(selected)}
					</View>
				</ScrollView>
			)}

			{/* LISTA NÉZET */}
			{mapView === "list" && (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 32 }}
				>
					{/* Kategória szűrő */}
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.mapFilters}
					>
						{MAP_FILTERS.map((item) => {
							const active = filter === item.key;
							return (
								<TouchableOpacity
									key={item.key}
									style={[
										styles.mapFilterChip,
										active && styles.mapFilterChipActive,
									]}
									onPress={() => {
										setFilter(item.key);
										setSelectedId(null);
									}}
								>
									{item.key !== "all" && (
										<Ionicons
											name={
												MAP_CATEGORY_META[item.key as MapCategory]
													?.icon as keyof typeof Ionicons.glyphMap
											}
											size={11}
											color={
												active
													? MAP_CATEGORY_META[item.key as MapCategory]?.color
													: "rgba(168,85,247,0.45)"
											}
										/>
									)}
									<Text
										style={[
											styles.mapFilterChipText,
											active && styles.mapFilterChipTextActive,
										]}
									>
										{item.label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</ScrollView>
					{map.points
						.filter((p) => filter === "all" || p.category === filter)
						.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={[
									styles.mapPointItem,
									selectedId === item.id && styles.mapPointItemSelected,
								]}
								onPress={() =>
									setSelectedId(selectedId === item.id ? null : item.id)
								}
							>
								<View
									style={[
										styles.mapPointIconWrap,
										{
											backgroundColor: `${MAP_CATEGORY_META[item.category].color}22`,
										},
									]}
								>
									<Ionicons
										name={
											MAP_CATEGORY_META[item.category]
												.icon as keyof typeof Ionicons.glyphMap
										}
										size={18}
										color={MAP_CATEGORY_META[item.category].color}
									/>
								</View>
								<View style={styles.mapPointItemText}>
									<Text style={styles.mapPointItemName}>{item.name}</Text>
									<Text style={styles.mapPointItemCategory}>
										{MAP_CATEGORY_META[item.category].label}
									</Text>
								</View>
								<Ionicons
									name={selectedId === item.id ? "chevron-up" : "chevron-down"}
									size={16}
									color="rgba(168,85,247,0.4)"
								/>
							</TouchableOpacity>
						))}
					{selected && renderDetailCard(selected)}
				</ScrollView>
			)}

			{/* ─── SOS LEBEGŐ GOMB ─── */}
			<TouchableOpacity
				style={styles.sosFloatingBtn}
				onPress={() => setSosVisible(true)}
				activeOpacity={0.8}
			>
				<Ionicons name="medkit" size={28} color="#ffffff" />
			</TouchableOpacity>

			{/* ─── SOS FELUGRÓ ABLAK (MODAL) ─── */}
			<Modal
				visible={sosVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setSosVisible(false)}
			>
				<View style={styles.sosModalOverlay}>
					<View style={styles.sosModalContent}>
						{sosSent ? (
							<View style={styles.sosSuccessContainer}>
								<Ionicons name="checkmark-circle" size={64} color="#22c55e" />
								<Text style={styles.sosSuccessTitle}>HELP IS ON THE WAY</Text>
								<Text style={styles.sosSuccessText}>
									Medical staff has received your location (Main Stage area).
									Stay where you are.
								</Text>
							</View>
						) : (
							<>
								<View style={styles.sosHeader}>
									<Ionicons name="warning" size={32} color="#ef4444" />
									<Text style={styles.sosTitle}>EMERGENCY ASSISTANCE</Text>
								</View>

								<Text style={styles.sosSubtitle}>
									What kind of help do you need?
								</Text>

								{/* Hatalmas érintési felületek */}
								<TouchableOpacity
									style={styles.sosActionBtn}
									onPress={handleSendSOS}
								>
									<Ionicons name="person-outline" size={24} color="#ffffff" />
									<Text style={styles.sosActionText}>I NEED HELP</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.sosActionBtn}
									onPress={handleSendSOS}
								>
									<Ionicons name="people-outline" size={24} color="#ffffff" />
									<Text style={styles.sosActionText}>
										SOMEONE ELSE NEEDS HELP
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.sosCancelBtn}
									onPress={() => setSosVisible(false)}
								>
									<Text style={styles.sosCancelText}>Cancel</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</View>
			</Modal>
		</View>
	);
}

// ─── Home képernyő ────────────────────────────────────────────────────────────
function HomeScreen({
	onGoToTickets,
	onGoToFavorites,
	favoritePerformers,
}: {
	onGoToTickets: () => void;
	onGoToFavorites: () => void;
	favoritePerformers: Performer[];
	lang: "en" | "hu";
	t: typeof translations.en;
}) {
	const player = useVideoPlayer(require("./assets/video/projektvideo.mp4"), (playerInstance) => {
		playerInstance.loop = true;
		playerInstance.muted = true;
		playerInstance.play();
	});

	const stars = useRef(
		Array.from({ length: 42 }, (_, i) => ({
			id: i,
			top: `${Math.random() * 100}%` as `${number}%`,
			left: `${Math.random() * 100}%` as `${number}%`,
			size: 0.5 + Math.random() * 1.8,
		})),
	).current;

	const nextFav = getNextFavorite(favoritePerformers);
	const minsUntil = nextFav ? minutesUntil(nextFav) : null;
	const featuredLineup = (((festivalData as any).performers ?? []) as Performer[]).slice(0, 5);

	return (
		<View style={styles.homeScreen}>
			<VideoView
				style={StyleSheet.absoluteFill}
				player={player}
				contentFit="cover"
				nativeControls={false}
				allowsFullscreen={false}
			/>
			<View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10, 4, 16, 0.72)" }]} />
			{stars.map((s) => (
				<Star
					key={s.id}
					style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
				/>
			))}
			<ScrollView
				contentContainerStyle={styles.homeScroll}
				showsVerticalScrollIndicator={false}
			>
				<EclipseAnimation />
				<View style={styles.titleZone}>
					<Text style={styles.festName}>EclipseFest</Text>
					<Text style={styles.tagline}>{t.darknessFalls}</Text>
				</View>

				<View style={styles.homeHeroCard}>
					<EventVisual accent={THEME.accent} />
					<View style={styles.homeHeroOverlay}>
						<Text style={styles.homeHeroEyebrow}>{t.homeHeroSubtitle}</Text>
						<Text style={styles.homeHeroTitle}>{t.homeHeroDesc}</Text>
					</View>
				</View>

				{/* Következő kedvenc chip */}
				{nextFav && minsUntil !== null && (
					<TouchableOpacity
						style={styles.nextFavChip}
						onPress={onGoToFavorites}
					>
						<Ionicons name="heart" size={14} color="#a855f7" />
						<Text style={styles.nextFavText}>
							Következő kedvenced:{" "}
							<Text style={styles.nextFavName}>{nextFav.name}</Text>
						</Text>
						<Text style={styles.nextFavTime}>
							{minsUntil < 60
								? `${minsUntil} perc múlva`
								: `${nextFav.startTime}`}
						</Text>
					</TouchableOpacity>
				)}

				<View style={styles.dateStrip}>
					<View style={styles.dateItem}>
						<Text style={styles.dateNum}>18</Text>
						<Text style={styles.dateSub}>{t.jul}</Text>
					</View>
					<View style={styles.dateSep} />
					<View style={styles.dateItem}>
						<Text style={styles.dateNum}>19</Text>
						<Text style={styles.dateSub}>{t.jul}</Text>
					</View>
					<View style={styles.dateSep} />
					<View style={styles.dateItem}>
						<Text style={styles.dateNum}>20</Text>
						<Text style={styles.dateSub}>{t.jul}</Text>
					</View>
					<View style={{ flex: 1 }} />
					<View style={styles.dateRight}>
						<Text style={styles.dateYear}>2026</Text>
						<Text style={styles.dateSub}>{t.threeNights}</Text>
					</View>
				</View>

				<TouchableOpacity style={styles.ticketCta} onPress={onGoToTickets}>
					<Ionicons name="ticket" size={18} color="#f0e8ff" />
					<Text style={styles.ticketCtaText}>Jegyvásárlás</Text>
					<Ionicons
						name="chevron-forward"
						size={16}
						color="rgba(168,85,247,0.6)"
					/>
				</TouchableOpacity>

				<View style={styles.infoRow}>
					{[
						{ label: lang === "en" ? "LOCATION" : "HELYSZÍN", value: "Budapest" },
						{ label: lang === "en" ? "STAGES" : "SZÍNPADOK", value: lang === "en" ? "4 stages" : "4 színpad" },
						{ label: lang === "en" ? "ARTISTS" : "FELLÉPŐK", value: "60+" },
					].map((chip) => (
						<View key={chip.label} style={styles.infoChip}>
							<Text style={styles.chipLabel}>{chip.label}</Text>
							<Text style={styles.chipValue}>{chip.value}</Text>
						</View>
					))}
				</View>

				<View style={styles.homeSectionHeader}>
					<Text style={styles.homeSectionTitle}>{lang === "en" ? "Featured Artists" : "Kiemelt fellépők"}</Text>
					<Text style={styles.homeSectionLink}>Festival highlights</Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
					{featuredLineup.map((artist, index) => {
						const accentColors = ["#c084fc", "#ec4899", "#38bdf8", "#f59e0b", "#8b5cf6"];
						const accent = accentColors[index % accentColors.length];
						return (
							<View key={artist.id} style={styles.featuredCard}>
								<EventVisual accent={accent} compact />
								<View style={styles.featuredCardOverlay}>
									<View style={[styles.featuredStagePill, { borderColor: `${accent}99`, backgroundColor: `${accent}22` }]}>
										<Text style={[styles.featuredStagePillText, { color: accent }]}>{artist.stage}</Text>
									</View>
									<Text style={styles.featuredCardName}>{artist.name}</Text>
									<Text style={styles.featuredCardMeta}>{artist.startTime}–{artist.endTime} · {lang === "en" ? `Day ${artist.day}` : `${artist.day}. nap`}</Text>
								</View>
							</View>
						);
					})}
				</ScrollView>
			</ScrollView>
		</View>
	);
}

type ScheduleViewMode = "list" | "timeline" | "stage" | "grid";

const SCHEDULE_VIEWS: {
	key: ScheduleViewMode;
	label: string;
	icon: keyof typeof Ionicons.glyphMap;
}[] = [
	{ key: "list", label: "Lista", icon: "list" },
	{ key: "timeline", label: "Idővonal", icon: "time-outline" },
	{ key: "stage", label: "Színpad", icon: "layers-outline" },
	{ key: "grid", label: "Rács", icon: "grid-outline" },
];

// ─── Schedule képernyő ────────────────────────────────────────────────────────
function ScheduleScreen({
	performers,
	favorites,
	onToggleFavorite,
	lang,
}: {
	performers: Performer[];
	favorites: string[];
	onToggleFavorite: (id: string) => void;
	lang: "en" | "hu";
}) {
	const [viewMode, setViewMode] = useState<ScheduleViewMode>("list");
	const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
	const sorted = sortPerformersByTime(performers);

	const stageSections = [...new Set(sorted.map((p) => p.stage))]
		.sort()
		.map((stage) => ({
			title: stage,
			data: sorted.filter((p) => p.stage === stage),
		}));

	const getScheduleViewLabel = (key: ScheduleViewMode) => {
		if (lang === "en") {
			switch (key) {
				case "list": return "List";
				case "timeline": return "Timeline";
				case "stage": return "Stage";
				case "grid": return "Grid";
			}
		}
		switch (key) {
			case "list": return "Lista";
			case "timeline": return "Idővonal";
			case "stage": return "Színpad";
			case "grid": return "Rács";
		}
	};

	const renderFavoriteBtn = (id: string, compact = false) => {
		const isFavorite = favorites.includes(id);
		return (
			<TouchableOpacity
				onPress={() => onToggleFavorite(id)}
				style={compact ? styles.gridFavoriteBtn : styles.favoriteBtn}
			>
				<Ionicons
					name={isFavorite ? "heart" : "heart-outline"}
					size={compact ? 18 : 22}
					color={isFavorite ? "#a855f7" : "#555"}
				/>
			</TouchableOpacity>
		);
	};

	const renderViewSwitcher = () => (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.scheduleViewSwitcher}
		>
			{SCHEDULE_VIEWS.map((view) => {
				const active = viewMode === view.key;
				return (
					<TouchableOpacity
						key={view.key}
						style={[
							styles.scheduleViewChip,
							active && styles.scheduleViewChipActive,
						]}
						onPress={() => setViewMode(view.key)}
					>
						<Ionicons
							name={view.icon}
							size={14}
							color={active ? "#a855f7" : "rgba(168,85,247,0.45)"}
						/>
						<Text
							style={[
								styles.scheduleViewChipText,
								active && styles.scheduleViewChipTextActive,
							]}
						>
							{view.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</ScrollView>
	);

	const renderListView = () => (
		<FlatList
			data={sorted}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.scheduleListContent}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => (
				<PerformerCard
					item={item}
					isFavorite={favorites.includes(item.id)}
					onToggle={() => onToggleFavorite(item.id)}
				/>
			)}
		/>
	);

	const renderTimelineView = () => (
		<ScrollView
			contentContainerStyle={styles.scheduleListContent}
			showsVerticalScrollIndicator={false}
		>
			{sorted.map((item, index) => (
				<View key={item.id} style={styles.timelineRow}>
					<View style={styles.timelineTimeCol}>
						<Text style={styles.timelineTime}>{item.startTime}</Text>
						<Text style={styles.timelineTimeEnd}>{item.endTime}</Text>
					</View>
					<View style={styles.timelineTrack}>
						<View style={styles.timelineDot} />
						{index < sorted.length - 1 && <View style={styles.timelineLine} />}
					</View>
					<TouchableOpacity style={styles.timelineCard} activeOpacity={0.86} onPress={() => setSelectedPerformer(item)}>
						<View style={styles.timelineCardHeader}>
							{/* --- ÚJ KÉP A TIMELINE-BAN --- */}
							<Image
								source={performerImages[item.id]}
								style={styles.timelineImage}
								resizeMode="cover"
							/>
							{/* ----------------------------- */}

							<View style={styles.timelineCardInfo}>
								<Text style={styles.performerName}>{item.name}</Text>
								<Text style={styles.performerDetails}>{item.stage}</Text>
								<Text style={styles.timelineDescription} numberOfLines={2}>
									{(lang === "en" ? item.description_en : item.description_hu) || item.description_hu || item.description_en || (lang === "en" ? "Description not available." : "Leírás nem érhető el.")}
								</Text>
							</View>
							{renderFavoriteBtn(item.id)}
						</View>
					</TouchableOpacity>
				</View>
			))}
		</ScrollView>
	);

	const renderStageView = () => (
		<SectionList
			sections={stageSections}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.scheduleListContent}
			showsVerticalScrollIndicator={false}
			stickySectionHeadersEnabled
			renderSectionHeader={({ section: { title } }) => (
				<View style={styles.stageSectionHeader}>
					<Ionicons name="musical-notes" size={14} color="#a855f7" />
					<Text style={styles.stageSectionTitle}>{title}</Text>
				</View>
			)}
			renderItem={({ item }) => (
				<PerformerCard
					item={item}
					isFavorite={favorites.includes(item.id)}
					onToggle={() => onToggleFavorite(item.id)}
				/>
			)}
		/>
	);

	const renderGridView = () => (
		<ScrollView
			contentContainerStyle={styles.scheduleGridContent}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.scheduleGrid}>
				{sorted.map((item) => (
					<TouchableOpacity key={item.id} style={styles.gridCard} activeOpacity={0.86} onPress={() => setSelectedPerformer(item)}>
						<View style={styles.gridCardTop}>
							<Text style={styles.gridTime}>
								{item.startTime} – {item.endTime}
							</Text>
							{renderFavoriteBtn(item.id, true)}
						</View>
						<Text style={styles.gridName} numberOfLines={2}>
							{item.name}
						</Text>
						<Text style={styles.gridStage} numberOfLines={1}>
							{item.stage}
						</Text>
					</View>
				))}
			</View>
		</ScrollView>
	);

	return (
		<View style={styles.scheduleScreen}>
			<View style={styles.scheduleHeader}>
				<Text style={styles.scheduleHeading}>Műsor</Text>
				<Text style={styles.scheduleSubheading}>
					{sorted.length} előadás · válassz nézetet
				</Text>
			</View>
			{renderViewSwitcher()}
			<View style={styles.scheduleBody}>
				{viewMode === "list" && renderListView()}
				{viewMode === "timeline" && renderTimelineView()}
				{viewMode === "stage" && renderStageView()}
				{viewMode === "grid" && renderGridView()}
			</View>

			<PerformerDetailModal
				performer={selectedPerformer}
				lang={lang}
				isFavorite={selectedPerformer ? favorites.includes(selectedPerformer.id) : false}
				onClose={() => setSelectedPerformer(null)}
				onToggleFavorite={() => {
					if (selectedPerformer) onToggleFavorite(selectedPerformer.id);
				}}
			/>
		</View>
	);
}

// ─── Performer kártya ─────────────────────────────────────────────────────────
function PerformerCard({
	item,
	isFavorite,
	onToggle,
	conflictNames,
}: {
	item: Performer;
	isFavorite: boolean;
	onToggle: () => void;
	conflictNames?: string[];
	onPress?: () => void;
	lang?: "en" | "hu";
}) {
	return (
		<View
			style={[
				styles.card,
				conflictNames && conflictNames.length > 0 && styles.cardConflict,
			]}
		>
			<View
				style={[
					styles.cardAccent,
					conflictNames &&
						conflictNames.length > 0 &&
						styles.cardAccentConflict,
				]}
			/>

			{/* --- ÚJ KÉP KONTÉNER --- */}
			<Image
				source={performerImages[item.id]}
				style={styles.performerImage}
				resizeMode="cover"
			/>
			{/* ----------------------- */}

			<View style={styles.cardInfo}>
				<Text style={styles.performerName}>{item.name}</Text>
				<Text style={styles.performerDetails}>
					{item.stage}
					{"  ·  "}
					{item.startTime} – {item.endTime}
				</Text>
				<Text style={styles.performerCardHint}>{lang === "en" ? "Open details" : "Részletek megnyitása"}</Text>
				{conflictNames && conflictNames.length > 0 && (
					<View style={styles.conflictRow}>
						<Ionicons name="warning-outline" size={12} color="#f59e0b" />
						<Text style={styles.conflictText}>
							Conflict: {conflictNames.join(", ")}
						</Text>
					</View>
				)}
			</View>
			<TouchableOpacity onPress={onToggle} style={styles.favoriteBtn}>
				<Ionicons
					name={isFavorite ? "heart" : "heart-outline"}
					size={22}
					color={isFavorite ? "#a855f7" : "#555"}
				/>
			</TouchableOpacity>
		</TouchableOpacity>
	);
}

// ─── Favorites képernyő ───────────────────────────────────────────────────────
function FavoritesScreen({
	performers,
	favorites,
	onToggleFavorite,
	onGoToSchedule,
}: {
	performers: Performer[];
	favorites: string[];
	onToggleFavorite: (id: string) => void;
	onGoToSchedule: () => void;
	onBack: () => void;
	lang: "en" | "hu";
	t: typeof translations.en;
}) {
	const [dayFilter, setDayFilter] = useState<"all" | 18 | 19 | 20>("all");

	const favoritePerformers = sortPerformersByTime(
		performers.filter((p) => favorites.includes(p.id)),
	);

	const filtered =
		dayFilter === "all"
			? favoritePerformers
			: favoritePerformers.filter((p) => p.day === dayFilter);

	// Ütközések kiszámítása
	const getConflicts = (performer: Performer) =>
		getConflictsForPerformer(performer, favoritePerformers).map((c) => c.name);

	const conflictCount = favoritePerformers.filter(
		(p) => getConflictsForPerformer(p, favoritePerformers).length > 0,
	).length;

	if (favoritePerformers.length === 0) {
		return (
			<View style={styles.favEmptyContainer}>
				<View style={styles.favEmptyIconWrap}>
					<Ionicons
						name="heart-outline"
						size={36}
						color="rgba(168,85,247,0.35)"
					/>
				</View>
				<Text style={styles.favEmptyTitle}>Még nincsenek kedvenceid</Text>
				<Text style={styles.favEmptySubtitle}>
					A műsor nézetben szívecskével jelölheted az előadókat, akiket nem
					akarsz kihagyni.
				</Text>
				<TouchableOpacity style={styles.favEmptyBtn} onPress={onGoToSchedule}>
					<Ionicons name="calendar-outline" size={16} color="#f0e8ff" />
					<Text style={styles.favEmptyBtnText}>Műsor megtekintése</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.favScreen}>
			<View style={styles.scheduleHeader}>
				<Text style={styles.scheduleHeading}>Saját menetrend</Text>
				<Text style={styles.scheduleSubheading}>
					{favoritePerformers.length} kedvenc előadó
					{conflictCount > 0 && (
						<Text style={styles.conflictBadgeText}>
							{" "}
							⚠ {conflictCount} ütközés
						</Text>
					)}
				</Text>
			</View>

			{/* Nap szerinti szűrő */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.dayFilterRow}
			>
				{FESTIVAL_DAYS.map((d) => {
					const active = dayFilter === d.key;
					return (
						<TouchableOpacity
							key={String(d.key)}
							style={[
								styles.dayFilterChip,
								active && styles.dayFilterChipActive,
							]}
							onPress={() => setDayFilter(d.key as "all" | 18 | 19 | 20)}
						>
							<Text
								style={[
									styles.dayFilterChipText,
									active && styles.dayFilterChipTextActive,
								]}
							>
								{d.label}
							</Text>
						</TouchableOpacity>
					);
				})}
			</ScrollView>

			{filtered.length === 0 ? (
				<View style={styles.favEmptyContainer}>
					<Ionicons
						name="calendar-outline"
						size={36}
						color="rgba(168,85,247,0.3)"
					/>
					<Text style={styles.favEmptyTitle}>Ezen a napon nincs kedvenced</Text>
					<Text style={styles.favEmptySubtitle}>
						Válassz másik napot vagy jelölj be új előadókat.
					</Text>
				</View>
			) : (
				<>
					<View style={styles.scheduleHeader}>
						<Text style={styles.scheduleHeading}>{t.mySchedule}</Text>
						<Text style={styles.scheduleSubheading}>
							{lang === "en"
								? `${favoritePerformers.length} favorite ${favoritePerformers.length === 1 ? "artist" : "artists"}`
								: `${favoritePerformers.length} kedvenc előadó`}
							{conflictCount > 0 && (
								<Text style={styles.conflictBadgeText}>
									{"  ⚠ "}{conflictCount}{" "}{lang === "en" ? (conflictCount === 1 ? "conflict" : "conflicts") : "ütközés"}
								</Text>
							)}
						</Text>
					</View>

					{/* Nap szerinti szűrő */}
					<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayFilterRow}>
						{FESTIVAL_DAYS.map((d) => {
							const active = dayFilter === d.key;
							return (
								<TouchableOpacity
									key={String(d.key)}
									style={[styles.dayFilterChip, active && styles.dayFilterChipActive]}
									onPress={() => setDayFilter(d.key as "all" | 18 | 19 | 20)}
								>
									<Text style={[styles.dayFilterChipText, active && styles.dayFilterChipTextActive]}>
										{getDayLabel(d.key)}
									</Text>
								</TouchableOpacity>
							);
						})}
					</ScrollView>

					{filtered.length === 0 ? (
						<View style={styles.favEmptyContainer}>
							<Ionicons name="calendar-outline" size={36} color="rgba(168,85,247,0.3)" />
							<Text style={styles.favEmptyTitle}>{t.noFavOnDay}</Text>
							<Text style={styles.favEmptySubtitle}>{t.favEmptySubtitle}</Text>
						</View>
					) : (
						<FlatList
							data={filtered}
							keyExtractor={(item) => item.id}
							contentContainerStyle={styles.scheduleListContent}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) => (
								<PerformerCard
									item={item}
									isFavorite={true}
									onToggle={() => onToggleFavorite(item.id)}
									conflictNames={getConflicts(item)}
									lang={lang}
								/>
							)}
						/>
					)}
				</>
			)}
		</View>
	);
}


// ─── Prémium event visual / pseudo-image komponens ─────────────────────────────
function EventVisual({ accent = THEME.accent, compact = false }: { accent?: string; compact?: boolean }) {
	const h = compact ? 138 : 210;
	return (
		<View style={[styles.eventVisualFrame, compact && styles.eventVisualFrameCompact]}>
			<Svg width="100%" height={h} viewBox={`0 0 360 ${h}`} preserveAspectRatio="xMidYMid slice">
				<Defs>
					<LinearGradient id="eventSky" x1="0" y1="0" x2="1" y2="1">
						<Stop offset="0" stopColor="#312e81" />
						<Stop offset="0.45" stopColor="#111827" />
						<Stop offset="1" stopColor="#05020d" />
					</LinearGradient>
					<RadialGradient id="eventGlow" cx="50%" cy="38%" r="55%">
						<Stop offset="0" stopColor={accent} stopOpacity="0.82" />
						<Stop offset="1" stopColor={accent} stopOpacity="0" />
					</RadialGradient>
					<LinearGradient id="stageFade" x1="0" y1="0" x2="0" y2="1">
						<Stop offset="0" stopColor="rgba(34,18,58,0)" />
						<Stop offset="1" stopColor="#05020d" />
					</LinearGradient>
				</Defs>
				<Rect width="360" height={h} fill="url(#eventSky)" />
				<Circle cx="180" cy={compact ? 52 : 76} r={compact ? 112 : 145} fill="url(#eventGlow)" />
				<Path d={`M26 ${h * 0.70} C92 ${h * 0.42} 126 ${h * 0.44} 186 ${h * 0.64} C240 ${h * 0.82} 286 ${h * 0.50} 342 ${h * 0.64}`} stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" />
				<Rect x="55" y={compact ? 54 : 76} width="250" height={compact ? 42 : 58} rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" />
				<Line x1="88" y1={compact ? 62 : 87} x2="42" y2={h - 26} stroke="rgba(255,255,255,0.20)" strokeWidth="3" />
				<Line x1="272" y1={compact ? 62 : 87} x2="320" y2={h - 26} stroke="rgba(255,255,255,0.20)" strokeWidth="3" />
				<Line x1="180" y1={compact ? 54 : 76} x2="180" y2={h - 32} stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
				{[0, 1, 2, 3, 4].map((i) => (
					<Circle key={`light-${i}`} cx={82 + i * 48} cy={compact ? 66 : 90} r={compact ? 8 : 11} fill={i % 2 === 0 ? accent : "#f0e8ff"} opacity={0.78} />
				))}
				<Path d={`M0 ${h - 48} C36 ${h - 72} 72 ${h - 50} 110 ${h - 68} C150 ${h - 88} 194 ${h - 50} 232 ${h - 70} C282 ${h - 96} 318 ${h - 58} 360 ${h - 78} L360 ${h} L0 ${h} Z`} fill="rgba(34,18,58,0.42)" />
				{[18, 44, 76, 108, 140, 172, 204, 236, 268, 300, 332].map((x, i) => (
					<G key={`crowd-${i}`}> 
						<Circle cx={x} cy={h - 36 - (i % 3) * 5} r={6 + (i % 2)} fill="rgba(4,2,8,0.96)" />
						<Rect x={x - 4} y={h - 31 - (i % 3) * 5} width="8" height="28" rx="4" fill="rgba(4,2,8,0.96)" />
					</G>
				))}
				<Path d={`M0 ${h - 54} L360 ${h - 54} L360 ${h} L0 ${h} Z`} fill="url(#stageFade)" />
			</Svg>
		</View>
	);
}

// ─── Gasztró adatok ───────────────────────────────────────────────────────────
const GASTRO_CATEGORIES = ["Mind", "Étel", "Ital", "Desszert"] as const;
type GastroCategory = (typeof GASTRO_CATEGORIES)[number];

interface GastroStand {
	id: string;
	name: string;
	emoji: string;
	category: GastroCategory;
	artist: string;
	description: string;
	offers: string[];
	color: string;
}

const GASTRO_STANDS: GastroStand[] = [
	{
		id: "g1",
		name: "Little Monster Bar",
		emoji: "🦇",
		category: "Ital",
		artist: "Lady Gaga",
		description:
			"A Haus of Gaga hivatalos koktélbárja. Merész ízek bátor lelkeknek.",
		offers: [
			"Poker Face Paloma – grapefruit-tequila koktél sós peremmel",
			"Bad Romance Rosé – málnás pezsgőkoktél ördögszarv dísszel",
		],
		color: "#ec4899",
	},
	{
		id: "g2",
		name: "Swiftie Sips",
		emoji: "🧣",
		category: "Ital",
		artist: "Taylor Swift",
		description:
			"13 féle ital, minden eráról egy. Friendship bracelets every sip.",
		offers: [
			"Red Lemonade – epres limonádé arany csillámpárával",
			"Midnights Mojito – kék pillangóvirágos mintás mojito",
		],
		color: "#60a5fa",
	},
	{
		id: "g3",
		name: "Dragon's Grill",
		emoji: "🐉",
		category: "Étel",
		artist: "Imagine Dragons",
		description:
			"Tűzön sült, erős fűszerezésű fogások. Believer vagy? Akkor bírd el!",
		offers: [
			"Thunder Burger – dupla marhahús smoky BBQ szósszal",
			"Demons Wings – pokoli csípős csirkeszárny 3 erősségben",
		],
		color: "#f97316",
	},
	{
		id: "g4",
		name: "Violator Street Food",
		emoji: "⚡",
		category: "Étel",
		artist: "Depeche Mode",
		description:
			"Sötét, elegáns, kompromisszummentes. Personal Jesus szintű minőség.",
		offers: [
			"Policy of Truth Wrap – füstölt csirke tahinis wrap fekete tortillában",
			"Master & Servant Platter – vegán szendvicsválogatás",
		],
		color: "#a855f7",
	},
	{
		id: "g5",
		name: "Gyuri's Bisztró",
		emoji: "🇭🇺",
		category: "Étel",
		artist: "Gyuris Bence",
		description:
			"Hazai ízek fesztiválos hangulatban. Olyan mint anyukád főztje, csak hangosabb.",
		offers: [
			"Eclipse Lángos – tejfölös-sajtos, fesztiválméretű",
			"Benci's Kürtőskalács – fahéjas, frissen sütve",
		],
		color: "#22c55e",
	},
	{
		id: "g6",
		name: "Cosmic Scoop",
		emoji: "🌌",
		category: "Desszert",
		artist: "EclipseFest",
		description:
			"Galaktikus fagylaltok és hideg desszertek. A napfogyatkozás édes oldala.",
		offers: [
			"Eclipse Sundae – fekete kókuszfagyi arany csillámpárával",
			"Meteor Waffle – friss gofri áfonyás öntettel",
		],
		color: "#38bdf8",
	},
	{
		id: "g7",
		name: "Monster Energy Zone",
		emoji: "⚡",
		category: "Ital",
		artist: "EclipseFest",
		description:
			"Hivatalos energiaital partner. Töltsd fel magad a következő fellépőre!",
		offers: [
			"Monster Ultra – cukormentes változatok 6 ízben",
			"Eclipse Mix – Monster + gyümölcslé kombók",
		],
		color: "#84cc16",
	},
	{
		id: "g8",
		name: "Nightcrawler Noodles",
		emoji: "🍜",
		category: "Étel",
		artist: "EclipseFest",
		description: "Éjszakai falatkák azoknak akik nem akarnak kihagyni semmit.",
		offers: [
			"Midnight Ramen – miso alaplé pirított fokhagymával",
			"Eclipse Pad Thai – mogyorós-chilis, vegán opció is",
		],
		color: "#f59e0b",
	},
];

const GASTRO_IMAGE_ASSETS: Record<string, any> = {
	g1: require("./assets/gastro_images/monsterbar_cosmopolitan_cocktail.png"),
	g2: require("./assets/gastro_images/swiftie_mojito.png"),
	g3: require("./assets/gastro_images/dragonsgrill_burger.png"),
	g4: require("./assets/gastro_images/violator_wraps.png"),
	g5: require("./assets/gastro_images/gyuri_langos.png"),
	g6: require("./assets/gastro_images/cosmic_icecream.png"),
	g7: require("./assets/gastro_images/monster_energyzone.png"),
	g8: require("./assets/gastro_images/nightcrawler_ramen.png"),
};

// ─── Gasztró kategória meta ──────────────────────────────────────────────────
const GASTRO_CATEGORY_META: Record<
	GastroCategory,
	{ label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
	Mind: { label: "Mind", icon: "grid-outline" },
	Étel: { label: "Étel", icon: "restaurant-outline" },
	Ital: { label: "Ital", icon: "beer-outline" },
	Desszert: { label: "Desszert", icon: "ice-cream-outline" },
};

// ─── Gasztró képernyő ─────────────────────────────────────────────────────────
function GastroScreen() {
	const [activeCategory, setActiveCategory] = useState<GastroCategory | "Mind">(
		"Mind",
	);

	const filtered =
		activeCategory === "Mind"
			? GASTRO_STANDS
			: GASTRO_STANDS.filter((s) => s.category === activeCategory);

	const getGastroCategoryLabel = (cat: GastroCategory, currentLang: "en" | "hu") => {
		if (currentLang === "en") {
			switch (cat) {
				case "Mind": return "All";
				case "Étel": return "Food";
				case "Ital": return "Drink";
				case "Desszert": return "Dessert";
			}
		}
		return cat;
	};

			{/* Kategória szűrő */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.dayFilterRow}
			>
				{GASTRO_CATEGORIES.map((cat) => {
					const active = activeCategory === cat;
					return (
						<TouchableOpacity
							key={cat}
							style={[
								styles.dayFilterChip,
								active && styles.dayFilterChipActive,
							]}
							onPress={() => setActiveCategory(cat)}
						>
							<Text
								style={[
									styles.dayFilterChipText,
									active && styles.dayFilterChipTextActive,
								]}
							>
								{cat}
							</Text>
						</TouchableOpacity>
					);
				})}
			</ScrollView>

	return (
		<View style={styles.gastroScreen}>
			<FlatList
				data={filtered}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.gastroList}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={(
					<>
						<View style={styles.scheduleHeader}>
							<Text style={styles.scheduleHeading}>{t.gastro}</Text>
							<Text style={styles.scheduleSubheading}>
								{lang === "en"
									? `${localizedStands.length} stands · premium dining selection`
									: `${localizedStands.length} stand · letisztult gasztro kínálat`}
							</Text>
						</View>

						<View style={styles.gastroHeroCard}>
							<EventVisual accent={THEME.accent} />
							<View style={styles.gastroHeroContent}>
								<Text style={styles.gastroHeroEyebrow}>{t.curatedDining}</Text>
								<Text style={styles.gastroHeroTitle}>{t.gastroDesc}</Text>
								<Text style={styles.gastroHeroText}>{t.gastroSubDesc}</Text>
							</View>
						</View>

						<View style={styles.gastroCategoryGrid}>
							{GASTRO_CATEGORIES.map((cat) => {
								const active = activeCategory === cat;
								const meta = GASTRO_CATEGORY_META[cat];
								return (
									<TouchableOpacity
										key={cat}
										style={[styles.gastroCategoryTile, active && styles.gastroCategoryTileActive]}
										onPress={() => setActiveCategory(cat)}
									>
										<View style={styles.gastroCategoryTileTopRow}>
											<View style={[styles.gastroCategoryIconCircle, active && styles.gastroCategoryIconCircleActive]}>
												<Ionicons
													name={meta.icon}
													size={24}
													color={active ? THEME.text : THEME.accent}
												/>
											</View>
											<View style={styles.gastroCategoryTextBlock}>
												<Text style={[styles.gastroCategoryTileTitle, active && styles.gastroCategoryTileTitleActive]}>
													{getGastroCategoryLabel(cat, lang)}
												</Text>
												<Text style={[styles.gastroCategoryTileMeta, active && styles.gastroCategoryTileMetaActive]}>
													{getStandCountLabel(counts[cat], lang)}
												</Text>
											</View>
										</View>
									</TouchableOpacity>
								);
							})}
						</View>
					</>
				)}
				renderItem={({ item }) => (
					<View style={styles.gastroCard}>
						<View
							style={[styles.gastroCardAccent, { backgroundColor: item.color }]}
						/>
						<View style={styles.gastroCardBody}>
							<View style={styles.gastroCardHeader}>
								<View style={[styles.gastroIconBox, { borderColor: `${item.color}55`, backgroundColor: `${item.color}14` }]}> 
									<Ionicons name={GASTRO_CATEGORY_META[item.category].icon} size={22} color={item.color} />
								</View>
								<View style={styles.gastroCardTitles}>
									<Text style={styles.gastroName}>{item.name}</Text>
									<View style={styles.gastroTagRow}>
										<View
											style={[
												styles.gastroCatBadge,
												{
													backgroundColor: `${item.color}22`,
													borderColor: `${item.color}55`,
												},
											]}
										>
											<Text
												style={[styles.gastroCatText, { color: item.color }]}
											>
												{item.category}
											</Text>
										</View>
										<Text style={styles.gastroArtist}>{item.artist}</Text>
									</View>
								</View>
							</View>

							<Text style={styles.gastroDescription}>{item.description}</Text>

							<View style={styles.gastroOffers}>
								<Text style={styles.gastroOffersLabel}>{t.recommendedItems}</Text>
								{item.offers.map((offer, i) => (
									<View key={i} style={styles.gastroOfferRow}>
										<View
											style={[
												styles.gastroOfferDot,
												{ backgroundColor: item.color },
											]}
										/>
										<Text style={styles.gastroOfferText}>{offer}</Text>
									</View>
								))}
							</View>
						</View>
					</View>
				)}
			/>
		</View>
	);
}

// ─── Sponsors képernyő ────────────────────────────────────────────────────────
function SponsorsScreen({ t, onBack }: { t: typeof translations.en; onBack: () => void }) {
	const sponsors = festivalData.sponsors as Sponsor[];
	const sponsorColumns = SCREEN_W < 430 ? 1 : 2;
	return (
		<View style={styles.infoScreenContainer}>
			<Text style={[styles.sectionTitle, { textAlign: "center" }]}>
				{t.sponsorsTitle}
			</Text>
			<FlatList
				key={sponsorColumns}
				data={sponsors}
				keyExtractor={(item) => item.id}
				numColumns={sponsorColumns}
				contentContainerStyle={styles.sponsorListContent}
				columnWrapperStyle={sponsorColumns > 1 ? styles.sponsorColumnWrapper : undefined}
				renderItem={({ item }) => (
					<View style={styles.sponsorCard}>
						<Image
							source={{ uri: item.logoUrl }}
							style={styles.sponsorLogo}
							resizeMode="contain"
						/>
						<Text style={styles.sponsorName}>{item.name}</Text>
					</View>
				)}
			/>
		</View>
	);
}

const SPONSOR_LOGOS: Record<string, any> = {
	s1: require("./assets/sponsors/nebula.png"),
	s2: require("./assets/sponsors/wavora.png"),
	s3: require("./assets/sponsors/lumen.png"),
	s4: require("./assets/sponsors/pulse.png"),
	s5: require("./assets/sponsors/vibes.png"),
	nebula: require("./assets/sponsors/nebula.png"),
	nebulaenergy: require("./assets/sponsors/nebula.png"),
	wavora: require("./assets/sponsors/wavora.png"),
	wavorawater: require("./assets/sponsors/wavora.png"),
	lumen: require("./assets/sponsors/lumen.png"),
	lumenlighting: require("./assets/sponsors/lumen.png"),
	pulse: require("./assets/sponsors/pulse.png"),
	pulsesound: require("./assets/sponsors/pulse.png"),
	vibes: require("./assets/sponsors/vibes.png"),
	vibestech: require("./assets/sponsors/vibes.png"),
};

function normalizeSponsorKey(value: string) {
	return value
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]/g, "");
}

function SponsorLogo({ sponsorId, name }: { sponsorId?: string; name: string; logoUrl?: string }) {
	const directKey = normalizeSponsorKey(sponsorId ?? "");
	const nameKey = normalizeSponsorKey(name);
	const localLogo = SPONSOR_LOGOS[directKey] ?? SPONSOR_LOGOS[nameKey];

	const initials = name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

	return (
		<View style={styles.sponsorLogoWrap}>
			{localLogo ? (
				<Image source={localLogo} style={styles.sponsorLogo} resizeMode="contain" />
			) : (
				<Text style={styles.sponsorLogoFallback}>{initials || "★"}</Text>
			)}
		</View>
	);
}

function MoreScreen({
	onGoToFavorites,
	onGoToGastro,
	onGoToSponsors,
	favoritesCount,
	lang,
	t,
}: {
	onGoToFavorites: () => void;
	onGoToGastro: () => void;
	onGoToSponsors: () => void;
	favoritesCount: number;
	lang: "en" | "hu";
	t: typeof translations.en;
}) {
	const items: { key: string; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void; right?: string }[] = [
		{
			key: "favorites",
			title: lang === "en" ? "Favorites" : "Kedvencek",
			subtitle: lang === "en" ? "My schedule and conflicts" : "Saját menetrend és ütközések",
			icon: "heart",
			onPress: onGoToFavorites,
			right: favoritesCount > 0 ? String(favoritesCount) : undefined,
		},
		{
			key: "gastro",
			title: lang === "en" ? "Gastro" : "Gasztró",
			subtitle: lang === "en" ? "Stands, offers, and categories" : "Standok, ajánlatok, kategóriák",
			icon: "restaurant",
			onPress: onGoToGastro,
		},
		{
			key: "sponsors",
			title: lang === "en" ? "Sponsors" : "Támogatók",
			subtitle: lang === "en" ? "Our partners and logos" : "Partnereink és logók",
			icon: "star",
			onPress: onGoToSponsors,
		},
	];

	return (
		<View style={styles.moreScreen}>
			<View style={styles.scheduleHeader}>
				<Text style={styles.scheduleHeading}>{t.more}</Text>
				<Text style={styles.scheduleSubheading}>{t.quickAccess}</Text>
			</View>

			<View style={styles.moreList}>
				{items.map((item) => (
					<TouchableOpacity key={item.key} style={styles.moreRow} onPress={item.onPress} activeOpacity={0.85}>
						<View style={styles.moreRowIcon}>
						<Ionicons name={item.icon} size={18} color={THEME.accent} />
						</View>
						<View style={styles.moreRowText}>
							<Text style={styles.moreRowTitle}>{item.title}</Text>
							<Text style={styles.moreRowSub}>{item.subtitle}</Text>
						</View>
						{item.right ? (
							<View style={styles.moreRowBadge}>
								<Text style={styles.moreRowBadgeText}>{item.right}</Text>
							</View>
						) : (
							<Ionicons name="chevron-forward" size={18} color={THEME.textSubtle} />
						)}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}

// ─── Fő App komponens ─────────────────────────────────────────────────────────
export default function App() {
	// Fonts are loaded natively or via system fonts

	const [activeTab, setActiveTab] = useState<TabKey | "More">("Home");
	const [favorites, setFavorites] = useState<string[]>([]);
	const [lang, setLang] = useState<"en" | "hu">("hu");
	const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
	const [selectedPerformanceIds, setSelectedPerformanceIds] = useState<string[]>([]);
	const [ticketQuantity, setTicketQuantity] = useState(1);
	const [buyerEmail, setBuyerEmail] = useState("");
	const [orderComplete, setOrderComplete] = useState(false);
	const [refundRequested, setRefundRequested] = useState(false);
	const [tabHistory, setTabHistory] = useState<(TabKey | "More")[]>([]);

	const navigateTo = (tab: TabKey | "More") => {
		if (tab === activeTab) return;
		setTabHistory((prev) => [...prev, activeTab]);
		setActiveTab(tab);
	};

	const goBack = () => {
		setTabHistory((prev) => {
			const next = [...prev];
			const previous = next.pop() ?? "Home";
			setActiveTab(previous);
			return next;
		});
	};

	// No font loading check needed

	const t = translations[lang];
	const tickets = festivalData.tickets as Ticket[];
	const festivalMap = festivalData.map as FestivalMap;

	// A JSON-ban lévő előadókhoz hozzárendeljük a napot (demo: round-robin 18/19/20)
	const performers: Performer[] = (festivalData.performers as any[]).map(
		(p, i) => ({
			...p,
			day: [18, 19, 20][i % 3],
		}),
	);

	const favoritePerformers = performers.filter((p) => favorites.includes(p.id));

	const toggleFavorite = (id: string) => {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
		);
	};

	const handleSelectTicket = (id: string) => {
		setSelectedTicketId(id);
		setTicketQuantity(1);
		setOrderComplete(false);
	};
	const handleChangeQuantity = (delta: number) => {
		setTicketQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
	};
	const handlePurchase = () => {
		if (selectedTicketId && isValidEmail(buyerEmail)) setOrderComplete(true);
	};
	const handleResetOrder = () => {
		setOrderComplete(false);
		setSelectedTicketId(null);
		setTicketQuantity(1);
		setBuyerEmail("");
	};

	const navTabs: { key: TabKey; icon: string; label: string }[] = [
		{ key: "Home", icon: "home", label: t.home },
		{ key: "Schedule", icon: "calendar", label: t.schedule },
		{ key: "Map", icon: "map", label: t.map },
		{ key: "Favorites", icon: "heart", label: "Kedvencek" },
		{ key: "Gastro", icon: "restaurant", label: "Gasztró" },
		{ key: "Tickets", icon: "ticket", label: t.tickets },
		{ key: "Sponsors", icon: "star", label: t.sponsors },
	];

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#06020f" />

			<View
				style={[
					styles.header,
					{ flexDirection: "row", justifyContent: "space-between" },
				]}
			>
				<Text style={styles.headerBadge}>ECLIPSEFEST · 2026</Text>
				<TouchableOpacity
					style={{
						padding: 5,
						backgroundColor: "rgba(124,58,237,0.2)",
						borderRadius: 8,
					}}
					onPress={() => setLang(lang === "en" ? "hu" : "en")}
				>
					<Ionicons name="chevron-back" size={22} color={THEME.text} />
				</TouchableOpacity>
				<View style={styles.headerBrandWrap}>
					<View style={styles.headerMoonDot} />
					<Text style={styles.headerBadge}>ECLIPSEFEST · 2026</Text>
				</View>
				<TouchableOpacity style={styles.langSwitch} onPress={() => setLang(lang === "en" ? "hu" : "en")}>
					<Text style={styles.langSwitchText}>
						{lang === "en" ? "HU" : "EN"}
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.mainArea}>
				{activeTab === "Home" && (
					<HomeScreen
						onGoToTickets={() => navigateTo("Tickets")}
						onGoToFavorites={() => navigateTo("Favorites")}
						favoritePerformers={favoritePerformers}
						lang={lang}
						t={t}
					/>
				)}
				{activeTab === "Schedule" && (
					<ScheduleScreen
						performers={performers}
						favorites={favorites}
						onToggleFavorite={toggleFavorite}
						lang={lang}
					/>
				)}
				{activeTab === "Map" &&
					(festivalMap ? (
						<MapScreen map={festivalMap} />
					) : (
						<View style={styles.mapScreen}>
							<Text style={styles.mapHeading}>Térkép</Text>
							<Text style={styles.mapVenue}>
								A térkép adatai nem érhetők el.
							</Text>
						</View>
					))}
				{activeTab === "Favorites" && (
					<FavoritesScreen
						performers={performers}
						favorites={favorites}
						onToggleFavorite={toggleFavorite}
						onGoToSchedule={() => navigateTo("Schedule")}
						onBack={goBack}
						lang={lang}
						t={t}
					/>
				)}
				{activeTab === "Gastro" && <GastroScreen onBack={goBack} lang={lang} t={t} />}
				{activeTab === "Tickets" && (
					<TicketsScreen
						tickets={tickets}
						performers={performers}
						selectedId={selectedTicketId}
						selectedPerformanceIds={selectedPerformanceIds}
						quantity={ticketQuantity}
						email={buyerEmail}
						orderComplete={orderComplete}
						refundRequested={refundRequested}
						onSelect={handleSelectTicket}
						onTogglePerformance={handleTogglePerformance}
						onChangeQuantity={handleChangeQuantity}
						onEmailChange={setBuyerEmail}
						onPurchase={handlePurchase}
						onReset={handleResetOrder}
						onRequestRefund={handleRequestRefund}
						lang={lang}
						t={t}
					/>
				)}
				{activeTab === "Sponsors" && <SponsorsScreen t={t} onBack={goBack} />}
				{activeTab === "More" && (
					<MoreScreen
						onGoToFavorites={() => navigateTo("Favorites")}
						onGoToGastro={() => navigateTo("Gastro")}
						onGoToSponsors={() => navigateTo("Sponsors")}
						favoritesCount={favorites.length}
						lang={lang}
						t={t}
					/>
				)}
			</View>

			<View style={styles.navBar}>
				{navTabs.map((tab) => {
					const active = activeTab === tab.key;
					const showBadge = tab.key === "Favorites" && favorites.length > 0;
					return (
						<TouchableOpacity
							key={tab.key}
							style={styles.navItem}
							onPress={() => setActiveTab(tab.key)}
						>
							<View
								style={[styles.navIconWrap, active && styles.navIconActive]}
							>
								<Ionicons
									name={
										active
											? (tab.icon as keyof typeof Ionicons.glyphMap)
											: (`${tab.icon}-outline` as keyof typeof Ionicons.glyphMap)
									}
									size={20}
									color={active ? THEME.accent : "rgba(255,255,255,0.36)"}
								/>
								{showBadge && (
									<View style={styles.navBadge}>
										<Text style={styles.navBadgeText}>{favorites.length}</Text>
									</View>
								)}
							</View>
							<Text style={[styles.navText, active && styles.navTextActive]}>
								{tab.label}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</SafeAreaView>
	);
}

// ─── Stílusok ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#06020f" },
	header: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		backgroundColor: "transparent",
		alignItems: "center",
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(120,60,200,0.2)",
	},
	headerBadge: {
		fontSize: 10,
		letterSpacing: 3,
		color: "rgba(168,85,247,0.55)",
		fontWeight: "400",
	},
	mainArea: { flex: 1 },
	screenGlow: { position: "absolute", borderRadius: 999, opacity: 0.22 },
	screenGlowTop: { width: 220, height: 220, top: -70, right: -50, backgroundColor: "rgba(124,58,237,0.22)" },
	screenGlowBottom: { width: 260, height: 260, bottom: 70, left: -90, backgroundColor: "rgba(236,72,153,0.10)" },

	// Home
	homeScreen: {
		flex: 1,
		backgroundColor: "#06020f",
		position: "relative",
		overflow: "hidden",
	},
	homeScroll: { alignItems: "center", paddingBottom: 32 },
	star: { position: "absolute", backgroundColor: "#ffffff", borderRadius: 99 },

	// Következő kedvenc chip
	nextFavChip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginHorizontal: 24,
		marginTop: 8,
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 14,
		backgroundColor: THEME.surface,
		borderWidth: 1,
		borderColor: THEME.borderStrong,
	},
	nextFavText: { flex: 1, fontSize: 12, color: THEME.textMuted },
	nextFavName: { color: THEME.text, fontWeight: "600" },
	nextFavTime: { fontSize: 11, color: THEME.accent, fontWeight: "600" },

	// Eclipse
	eclipseContainer: {
		width: 260,
		height: 260,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 12,
		position: "relative",
	},
	haloRing: { position: "absolute", borderRadius: 999 },
	haloOuter: {
		width: 200,
		height: 200,
		shadowColor: "#9333ea",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.45,
		shadowRadius: 35,
		elevation: 0,
		borderWidth: 0,
		backgroundColor: "transparent",
	},
	haloMid: {
		width: 155,
		height: 155,
		shadowColor: "#c084fc",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.35,
		shadowRadius: 25,
		elevation: 0,
		backgroundColor: "transparent",
	},
	haloInner: {
		width: 115,
		height: 115,
		shadowColor: "#e9d5ff",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 18,
		elevation: 0,
		backgroundColor: "transparent",
	},
	coronaWrapper: {
		position: "absolute",
		width: 220,
		height: 220,
		alignItems: "center",
		justifyContent: "center",
	},
	spikeContainer: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "flex-start",
		width: 220,
		height: 220,
		top: 0,
		left: 0,
	},
	spike: {
		backgroundColor: "rgba(192,132,252,0.65)",
		borderRadius: 1,
		position: "absolute",
		top: 0,
	},
	planetDisk: {
		width: 100,
		height: 100,
		borderRadius: 50,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "rgba(168,85,247,0.3)",
	},
	logoImage: { width: "100%", height: "100%" },

	titleZone: { alignItems: "center", marginTop: -4, paddingHorizontal: 24 },
	festName: {
		fontSize: 42,
		fontWeight: "700",
		color: "#f0e8ff",
		letterSpacing: 1,
	},
	tagline: {
		fontSize: 9,
		letterSpacing: 3,
		color: "rgba(168,85,247,0.5)",
		marginTop: 6,
		textAlign: "center",
	},

	dateStrip: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 24,
		marginTop: 12,
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.25)",
		borderRadius: 18,
		backgroundColor: "rgba(120,60,200,0.05)",
	},
	dateItem: { alignItems: "center", paddingHorizontal: 12 },
	dateNum: {
		fontSize: 26,
		fontWeight: "600",
		color: "#e8d8ff",
		lineHeight: 28,
	},
	dateSub: {
		fontSize: 9,
		letterSpacing: 2,
		color: "rgba(168,85,247,0.45)",
		marginTop: 3,
	},
	dateSep: { width: 0.5, height: 36, backgroundColor: "rgba(120,60,200,0.25)" },
	dateRight: { alignItems: "flex-end", paddingLeft: 12 },
	dateYear: { fontSize: 14, fontWeight: "600", color: THEME.textMuted },

	infoRow: {
		flexDirection: "row",
		gap: 8,
		marginHorizontal: 24,
		marginTop: 12,
	},
	infoChip: {
		flex: 1,
		padding: 12,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.2)",
		borderRadius: 14,
		backgroundColor: "rgba(120,60,200,0.04)",
		alignItems: "center",
	},
	chipLabel: {
		fontSize: 8,
		letterSpacing: 1.5,
		color: "rgba(168,85,247,0.45)",
		marginBottom: 5,
	},
	chipValue: { fontSize: 13, fontWeight: "500", color: "#d8c8f0" },

	ticketCta: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		marginHorizontal: 24,
		marginTop: 12,
		paddingVertical: 14,
		borderRadius: 16,
		backgroundColor: "rgba(124,58,237,0.25)",
		borderWidth: 0.5,
		borderColor: "rgba(168,85,247,0.45)",
	},
	ticketCtaText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#f0e8ff",
		letterSpacing: 0.5,
	},

	// Jegyvásárlás
	ticketsScreen: { flex: 1 },
	ticketsScroll: { padding: 16, paddingBottom: 24 },
	ticketsHeading: {
		fontSize: 24,
		fontWeight: "700",
		color: "#f0e8ff",
		marginBottom: 6,
	},
	ticketsSubheading: {
		fontSize: 13,
		color: "rgba(168,85,247,0.55)",
		marginBottom: 16,
		lineHeight: 18,
	},
	ticketCard: {
		flexDirection: "row",
		backgroundColor: "rgba(120,60,200,0.07)",
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.2)",
		borderRadius: 14,
		marginBottom: 12,
		overflow: "hidden",
		position: "relative",
	},
	ticketCardSelected: {
		borderColor: "rgba(168,85,247,0.55)",
		backgroundColor: "rgba(124,58,237,0.12)",
	},
	ticketAccentSelected: { backgroundColor: "#a855f7", opacity: 1 },
	popularBadge: {
		position: "absolute",
		top: 10,
		right: 44,
		zIndex: 1,
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		backgroundColor: "rgba(168,85,247,0.25)",
		borderWidth: 0.5,
		borderColor: "rgba(168,85,247,0.4)",
	},
	popularBadgeText: {
		fontSize: 8,
		letterSpacing: 1.5,
		color: "#c084fc",
		fontWeight: "600",
	},
	ticketCardBody: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
	ticketCardHeader: { marginBottom: 6 },
	ticketTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 4,
	},
	ticketName: { color: "#e8d8ff", fontSize: 17, fontWeight: "600" },
	ticketBadge: {
		paddingHorizontal: 7,
		paddingVertical: 2,
		borderRadius: 6,
		backgroundColor: "rgba(120,60,200,0.15)",
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.3)",
	},
	ticketBadgeText: {
		fontSize: 9,
		letterSpacing: 1,
		color: "rgba(168,85,247,0.7)",
		fontWeight: "500",
	},
	ticketPrice: { fontSize: 18, fontWeight: "700", color: "#c084fc" },
	ticketDescription: {
		fontSize: 12,
		color: "rgba(216,200,240,0.75)",
		lineHeight: 17,
		marginBottom: 10,
	},
	ticketFeatures: { gap: 5 },
	ticketFeatureRow: { flexDirection: "row", alignItems: "center", gap: 6 },
	ticketFeatureText: { fontSize: 12, color: THEME.textSubtle, fontWeight: "600", fontFamily: FONTS.ui },
	ticketSelectIndicator: { justifyContent: "center", paddingRight: 14 },
	checkoutBar: {
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 8,
		borderTopWidth: 0.5,
		borderTopColor: "rgba(120,60,200,0.25)",
		backgroundColor: "#0a0415",
	},
	quantityRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	quantityLabel: { fontSize: 13, color: "#d8c8f0" },
	quantityControls: { flexDirection: "row", alignItems: "center", gap: 12 },
	quantityBtn: {
		width: 36,
		height: 36,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(124,58,237,0.2)",
		borderWidth: 0.5,
		borderColor: "rgba(124,58,237,0.35)",
	},
	quantityBtnDisabled: { opacity: 0.35 },
	quantityValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#f0e8ff",
		minWidth: 24,
		textAlign: "center",
	},
	emailField: { marginBottom: 12 },
	emailLabel: { fontSize: 13, color: "#d8c8f0", marginBottom: 8 },
	emailInput: {
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderRadius: 12,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.3)",
		backgroundColor: "rgba(120,60,200,0.08)",
		color: "#f0e8ff",
		fontSize: 15,
	},
	emailInputError: { borderColor: "rgba(239,68,68,0.6)" },
	emailErrorText: { fontSize: 11, color: "#f87171", marginTop: 6 },
	totalRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	totalLabel: {
		fontSize: 12,
		letterSpacing: 1.5,
		color: "rgba(168,85,247,0.5)",
	},
	totalValue: { fontSize: 20, fontWeight: "700", color: "#e8d8ff" },
	checkoutHint: {
		fontSize: 12,
		color: "rgba(168,85,247,0.45)",
		textAlign: "center",
		marginBottom: 12,
	},
	checkoutBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		paddingVertical: 14,
		borderRadius: 14,
		backgroundColor: "#7c3aed",
		borderWidth: 0.5,
		borderColor: "rgba(168,85,247,0.5)",
	},
	checkoutBtnDisabled: { opacity: 0.4 },
	checkoutBtnText: { fontSize: 15, fontWeight: "600", color: "#f0e8ff" },
	orderSuccess: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 32,
	},
	orderSuccessIcon: { marginBottom: 16 },
	orderSuccessTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: "#f0e8ff",
		marginBottom: 8,
	},
	orderSuccessSub: {
		fontSize: 13,
		color: "rgba(168,85,247,0.55)",
		textAlign: "center",
		lineHeight: 20,
		marginBottom: 8,
	},
	orderSuccessEmail: {
		fontSize: 15,
		fontWeight: "600",
		color: "#e8d8ff",
		textAlign: "center",
		marginBottom: 24,
	},
	orderSummaryCard: {
		width: "100%",
		padding: 20,
		borderRadius: 16,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.25)",
		backgroundColor: "rgba(120,60,200,0.07)",
		marginBottom: 24,
		alignItems: "center",
	},
	orderSummaryLabel: {
		fontSize: 9,
		letterSpacing: 2,
		color: "rgba(168,85,247,0.45)",
		marginBottom: 8,
	},
	orderSummaryName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#e8d8ff",
		marginBottom: 4,
	},
	orderSummaryDetail: { fontSize: 14, color: "#c084fc" },

	// Térkép
	mapScreen: { flex: 1, paddingTop: 8 },
	mapHeader: { paddingHorizontal: 16, marginBottom: 10 },
	mapHeading: { fontSize: 24, fontWeight: "900", color: THEME.text, letterSpacing: 0.2 },
	mapVenue: { fontSize: 12, color: THEME.textSubtle, marginTop: 4 },
	mapFilters: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
	mapFilterChip: {
		paddingHorizontal: 12,
		paddingVertical: 7,
		borderRadius: 20,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.25)",
		backgroundColor: "rgba(120,60,200,0.06)",
	},
	mapFilterChipActive: {
		backgroundColor: "rgba(124,58,237,0.22)",
		borderColor: "rgba(168,85,247,0.45)",
	},
	mapFilterChipText: {
		fontSize: 11,
		color: "rgba(168,85,247,0.5)",
		fontWeight: "500",
	},
	mapFilterChipTextActive: { color: "#e8d8ff" },
	mapViewWrap: {
		flex: 1,
		marginHorizontal: 16,
		marginBottom: 8,
		borderRadius: 18,
		overflow: "hidden",
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.3)",
		position: "relative",
	},
	mapOpenExternalBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginTop: 10,
	},
	mapOpenExternalText: { fontSize: 12, color: "#c084fc", fontWeight: "500" },
	mapDetailCard: {
		flexDirection: "row",
		marginHorizontal: 16,
		marginBottom: 4,
		borderRadius: 14,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.25)",
		backgroundColor: "rgba(120,60,200,0.08)",
		overflow: "hidden",
	},
	mapDetailAccent: { width: 3 },
	mapDetailBody: { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
	mapDetailHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 4,
	},
	mapDetailName: { fontSize: 15, fontWeight: "600", color: "#e8d8ff", flex: 1 },
	mapDetailBadge: {
		paddingHorizontal: 7,
		paddingVertical: 2,
		borderRadius: 6,
		backgroundColor: "rgba(120,60,200,0.15)",
	},
	mapDetailBadgeText: { fontSize: 9, color: "rgba(168,85,247,0.7)" },
	mapDetailDescription: {
		fontSize: 12,
		color: "rgba(216,200,240,0.75)",
		lineHeight: 17,
	},
	mapDetailClose: { padding: 12, justifyContent: "center" },
	mapPointsList: {
		flex: 1,
		backgroundColor: "rgba(120,60,200,0.03)",
		borderTopWidth: 0.5,
		borderTopColor: "rgba(120,60,200,0.2)",
	},
	mapPointItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(120,60,200,0.1)",
		gap: 12,
	},
	mapPointItemSelected: { backgroundColor: "rgba(168,85,247,0.1)" },
	mapPointIconWrap: {
		width: 36,
		height: 36,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	mapPointItemText: { flex: 1 },
	mapPointItemName: {
		color: "#e8d8ff",
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 2,
	},
	mapPointItemCategory: {
		color: "rgba(168,85,247,0.55)",
		fontSize: 11,
		letterSpacing: 0.3,
	},

	// Illusztrált térkép stílusok
	mapCanvasWrap: { flex: 1 },
	svgMapContainer: {
		marginHorizontal: 12,
		borderRadius: 24,
		overflow: "hidden",
		borderWidth: 1.5,
		borderColor: "rgba(120,60,200,0.4)",
	},
	festivalMapImageCard: {
		marginHorizontal: 12,
		borderRadius: 24,
		overflow: "hidden",
		borderWidth: 1.5,
		borderColor: "rgba(216,180,254,0.28)",
		backgroundColor: "rgba(8,3,18,0.84)",
		shadowColor: THEME.accent,
		shadowOpacity: 0.18,
		shadowRadius: 18,
		elevation: 8,
		position: "relative",
	},
	festivalMapImage: {
		width: "100%",
		height: (SCREEN_W - 24) * 0.5625,
	},
	mapImageMarker: {
		position: "absolute",
		width: 46,
		height: 46,
		marginLeft: -23,
		marginTop: -40,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 20,
	},
	mapImageMarkerPulse: {
		position: "absolute",
		width: 42,
		height: 42,
		borderRadius: 21,
		borderWidth: 2,
		backgroundColor: "rgba(255,255,255,0.16)",
	},
	mapImageMarkerPin: {
		width: 30,
		height: 30,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#fff",
		shadowColor: "#000",
		shadowOpacity: 0.35,
		shadowRadius: 8,
		elevation: 8,
	},
	mapImageMarkerLabel: {
		position: "absolute",
		top: 36,
		minWidth: 86,
		maxWidth: 132,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 999,
		backgroundColor: "rgba(8,3,18,0.88)",
		borderWidth: 1,
		borderColor: "rgba(245,208,254,0.38)",
	},
	mapImageMarkerLabelText: {
		color: THEME.text,
		fontSize: 10,
		fontWeight: "900",
		textAlign: "center",
		fontFamily: FONTS.ui,
	},
	mapSelectedNotice: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginHorizontal: 16,
		marginTop: 10,
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 24,
		backgroundColor: "rgba(168,85,247,0.12)",
		borderWidth: 1,
		borderColor: "rgba(216,180,254,0.20)",
	},
	mapSelectedNoticeText: {
		flex: 1,
		fontSize: 12,
		lineHeight: 17,
		color: THEME.textMuted,
		fontFamily: FONTS.ui,
		fontWeight: "700",
	},
	mapSelectedNoticeName: { color: THEME.text, fontWeight: "900" },
	mapImageHint: {
		fontSize: 12,
		lineHeight: 18,
		color: THEME.textSubtle,
		fontWeight: "700",
		fontFamily: FONTS.ui,
		paddingHorizontal: 18,
		paddingTop: 10,
		paddingBottom: 4,
	},
	svgContainer: {
		marginHorizontal: 12,
		height: 340,
		backgroundColor: "#1e3d1e",
		borderRadius: 24,
		borderWidth: 1.5,
		borderColor: "rgba(120,60,200,0.5)",
		overflow: "hidden",
		position: "relative",
	},
	mapBgGrass: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "#1e3d1e",
	},
	mapFence: {
		position: "absolute",
		top: 6,
		left: 6,
		right: 6,
		bottom: 6,
		borderRadius: 12,
		borderWidth: 1.5,
		borderColor: "rgba(168,85,247,0.5)",
	},
	mapRoad: { position: "absolute", backgroundColor: "#3d3060" },
	mapRoadDiag: {
		position: "absolute",
		height: 10,
		backgroundColor: "#3d3060",
		transformOrigin: "left center",
	},
	mapTree: { position: "absolute", alignItems: "center" },
	mapTreeTop: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: "#2d6a2d",
		borderWidth: 1,
		borderColor: "#3d8a3d",
	},
	mapTreeTrunk: {
		width: 3,
		height: 5,
		backgroundColor: "#5c3d1e",
		marginTop: -1,
	},
	mapBush: {
		position: "absolute",
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#2a5a2a",
		borderWidth: 0.5,
		borderColor: "#3a7a3a",
	},
	mapCampZone: {
		position: "absolute",
		top: 60,
		left: 8,
		width: 90,
		height: 60,
		backgroundColor: "rgba(45,212,191,0.15)",
		borderWidth: 1,
		borderColor: "#2dd4bf",
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "flex-end",
		paddingBottom: 4,
	},
	mapZoneLabel: {
		fontSize: 7,
		color: "#2dd4bf",
		letterSpacing: 1,
		fontWeight: "600",
	},
	mapTent: {
		position: "absolute",
		width: 16,
		height: 14,
		backgroundColor: "#2dd4bf",
		borderRadius: 2,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		opacity: 0.8,
	},
	mapParkingZone: {
		position: "absolute",
		top: 268,
		left: 8,
		width: 36,
		height: 36,
		backgroundColor: "rgba(56,189,248,0.2)",
		borderWidth: 1,
		borderColor: "#38bdf8",
		borderRadius: 6,
		alignItems: "center",
		justifyContent: "center",
	},
	mapParkingLabel: { fontSize: 16, fontWeight: "900", color: "#38bdf8" },
	mapStage: {
		position: "absolute",
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1.5,
		borderColor: "rgba(168,85,247,0.8)",
		padding: 2,
	},
	mapStageIcon: { fontSize: 12, lineHeight: 14 },
	mapStageLabel: {
		fontSize: 7,
		color: "#f0e8ff",
		fontWeight: "700",
		textAlign: "center",
		letterSpacing: 0.3,
	},
	mapPoi: {
		position: "absolute",
		paddingHorizontal: 5,
		paddingVertical: 3,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: "center",
		minWidth: 44,
	},
	mapPoiIcon: { fontSize: 12, lineHeight: 14 },
	mapPoiLabel: {
		fontSize: 6.5,
		fontWeight: "600",
		textAlign: "center",
		letterSpacing: 0.3,
	},
	mapEntrance: {
		position: "absolute",
		bottom: 10,
		left: "36%",
		width: 72,
		paddingVertical: 4,
		backgroundColor: "#22c55e",
		borderRadius: 8,
		borderWidth: 1.5,
		borderColor: "#16a34a",
		alignItems: "center",
	},
	mapEntranceIcon: { fontSize: 12, lineHeight: 14 },
	mapEntranceLabel: {
		fontSize: 7,
		color: "#fff",
		fontWeight: "800",
		letterSpacing: 1,
	},
	mapWc: {
		position: "absolute",
		width: 22,
		height: 22,
		backgroundColor: "rgba(56,189,248,0.25)",
		borderRadius: 4,
		borderWidth: 1,
		borderColor: "#38bdf8",
		alignItems: "center",
		justifyContent: "center",
	},
	mapWcIcon: { fontSize: 11 },
	mapFirstAid: {
		position: "absolute",
		width: 22,
		height: 22,
		backgroundColor: "rgba(239,68,68,0.25)",
		borderRadius: 4,
		borderWidth: 1,
		borderColor: "#ef4444",
		alignItems: "center",
		justifyContent: "center",
	},
	mapFirstAidIcon: { fontSize: 11 },
	mapInfo: {
		position: "absolute",
		width: 22,
		height: 22,
		backgroundColor: "rgba(168,85,247,0.25)",
		borderRadius: 4,
		borderWidth: 1,
		borderColor: "#a855f7",
		alignItems: "center",
		justifyContent: "center",
	},
	mapInfoIcon: { fontSize: 11 },
	mapNorth: {
		position: "absolute",
		top: 10,
		right: 10,
		width: 26,
		height: 26,
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 13,
		borderWidth: 0.5,
		borderColor: "rgba(168,85,247,0.4)",
		alignItems: "center",
		justifyContent: "center",
	},
	mapNorthText: {
		fontSize: 7,
		color: "#a855f7",
		fontWeight: "800",
		lineHeight: 8,
	},
	mapNorthArrow: { fontSize: 7, color: "#a855f7", lineHeight: 8 },
	svgGridLine: {
		position: "absolute",
		height: 0.5,
		backgroundColor: "rgba(120,60,200,0.1)",
	},
	svgGridLineV: {
		position: "absolute",
		width: 0.5,
		backgroundColor: "rgba(120,60,200,0.1)",
	},
	svgVenueBorder: {
		position: "absolute",
		top: 12,
		left: 12,
		right: 12,
		bottom: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(120,60,200,0.25)",
	},
	svgZoneLabel: {
		position: "absolute",
		fontSize: 8,
		letterSpacing: 2,
		color: "rgba(120,60,200,0.3)",
	},
	svgRouteLine: {
		position: "absolute",
		height: 1,
		backgroundColor: "rgba(168,85,247,0.15)",
		transformOrigin: "left center",
	},
	svgPoint: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
	},
	svgPointGlow: {
		position: "absolute",
		width: "200%",
		height: "200%",
		borderRadius: 999,
		borderWidth: 1.5,
		opacity: 0.3,
	},
	svgLabel: {
		position: "absolute",
		fontSize: 9,
		width: 72,
		textAlign: "center",
	},
	mapLegend: { paddingHorizontal: 12, paddingVertical: 8, gap: 12 },
	mapLegendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
	mapLegendDot: { width: 8, height: 8, borderRadius: 4 },
	mapLegendText: { fontSize: 10, color: "rgba(216,200,240,0.6)" },
	mapCanvasHint: {
		fontSize: 10,
		color: "rgba(168,85,247,0.35)",
		textAlign: "center",
		paddingVertical: 4,
	},
	mapViewToggle: {
		flexDirection: "row",
		marginHorizontal: 16,
		marginBottom: 8,
		borderRadius: 12,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.25)",
		overflow: "hidden",
		backgroundColor: "rgba(120,60,200,0.05)",
	},
	mapViewToggleBtn: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
		paddingVertical: 9,
	},
	mapViewToggleBtnActive: { backgroundColor: "rgba(124,58,237,0.2)" },
	mapViewToggleText: {
		fontSize: 12,
		color: "rgba(168,85,247,0.45)",
		fontWeight: "500",
	},
	mapViewToggleTextActive: { color: "#e8d8ff" },

	// Schedule
	scheduleScreen: { flex: 1 },
	scheduleHeader: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
	scheduleHeading: { fontSize: 24, fontWeight: "700", color: "#f0e8ff" },
	scheduleSubheading: {
		fontSize: 12,
		color: "rgba(168,85,247,0.55)",
		marginTop: 4,
	},
	scheduleViewSwitcher: { paddingHorizontal: 16, gap: 8, paddingVertical: 10 },
	scheduleViewChip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.25)",
		backgroundColor: "rgba(120,60,200,0.06)",
	},
	scheduleViewChipActive: {
		backgroundColor: "rgba(124,58,237,0.22)",
		borderColor: "rgba(168,85,247,0.45)",
	},
	scheduleViewChipText: {
		fontSize: 11,
		color: "rgba(168,85,247,0.5)",
		fontWeight: "500",
	},
	scheduleViewChipTextActive: { color: "#e8d8ff" },
	scheduleBody: { flex: 1 },
	scheduleListContent: { paddingHorizontal: 16, paddingBottom: 120 },
	scheduleGridContent: { paddingHorizontal: 16, paddingBottom: 120 },
	scheduleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
	gridCard: {
		width: "48%",
		flexGrow: 1,
		minWidth: 150,
		padding: 12,
		borderRadius: 14,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.2)",
		backgroundColor: "rgba(120,60,200,0.07)",
	},
	gridCardTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	gridTime: {
		fontSize: 10,
		color: "rgba(168,85,247,0.55)",
		letterSpacing: 0.3,
		flex: 1,
	},
	gridName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#e8d8ff",
		marginBottom: 4,
	},
	gridStage: { fontSize: 11, color: "rgba(168,85,247,0.55)" },
	gridFavoriteBtn: { padding: 2, marginLeft: 4 },
	stageSectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingVertical: 10,
		paddingHorizontal: 4,
		marginBottom: 4,
		backgroundColor: "#06020f",
	},
	stageSectionTitle: {
		fontSize: 13,
		fontWeight: "600",
		color: "#c084fc",
		letterSpacing: 0.5,
	},
	timelineRow: { flexDirection: "row", marginBottom: 4 },
	timelineTimeCol: { width: 48, paddingTop: 14 },
	timelineTime: { fontSize: 13, fontWeight: "600", color: "#e8d8ff" },
	timelineTimeEnd: {
		fontSize: 10,
		color: "rgba(168,85,247,0.45)",
		marginTop: 2,
	},
	timelineTrack: { width: 20, alignItems: "center", paddingTop: 18 },
	timelineDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#a855f7",
		borderWidth: 2,
		borderColor: "rgba(168,85,247,0.35)",
	},
	timelineLine: {
		flex: 1,
		width: 2,
		backgroundColor: "rgba(120,60,200,0.25)",
		marginTop: 4,
		marginBottom: -8,
	},
	timelineCard: {
		flex: 1,
		marginLeft: 8,
		marginBottom: 12,
		borderRadius: 14,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.2)",
		backgroundColor: "rgba(120,60,200,0.07)",
		overflow: "hidden",
	},
	timelineCardHeader: { flexDirection: "row", alignItems: "flex-start" },
	timelineCardInfo: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
	timelineDescription: {
		fontSize: 11,
		color: "rgba(216,200,240,0.65)",
		marginTop: 6,
		lineHeight: 16,
	},

	// Performer kártya
	listContent: { padding: 16, paddingBottom: 32 },
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(120,60,200,0.07)",
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.2)",
		borderRadius: 14,
		marginBottom: 10,
		overflow: "hidden",
	},
	cardConflict: {
		borderColor: "rgba(245,158,11,0.45)",
		backgroundColor: "rgba(245,158,11,0.05)",
	},
	cardAccent: {
		width: 3,
		alignSelf: "stretch",
		backgroundColor: "#7c3aed",
		opacity: 0.8,
	},
	cardAccentConflict: { backgroundColor: "#f59e0b", opacity: 1 },
	cardInfo: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
	performerName: { color: "#e8d8ff", fontSize: 16, fontWeight: "600" },
	performerDetails: {
		color: "rgba(168,85,247,0.55)",
		fontSize: 12,
		marginTop: 4,
		letterSpacing: 0.3,
	},
	conflictRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		marginTop: 6,
	},
	conflictText: { fontSize: 11, color: "#f59e0b", flex: 1 },
	conflictBadgeText: { color: "#f59e0b", fontSize: 12 },
	favoriteBtn: { width: 56, alignItems: "center", justifyContent: "center", alignSelf: "stretch", backgroundColor: "rgba(84,44,130,0.16)" },

	// Navigáció
	navBar: {
		flexDirection: "row",
		backgroundColor: "#0a0415",
		paddingBottom: 24,
		paddingTop: 10,
		borderTopWidth: 0.5,
		borderTopColor: "rgba(120,60,200,0.2)",
	},
	navItem: { flex: 1, alignItems: "center", gap: 4 },
	navIconWrap: {
		width: 40,
		height: 36,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	navIconActive: {
		backgroundColor: "rgba(124,58,237,0.18)",
		borderWidth: 0.5,
		borderColor: "rgba(124,58,237,0.35)",
	},
	navText: { fontSize: 10, color: "#444", letterSpacing: 0.5 },
	navTextActive: { color: "#a855f7" },
	navBadge: {
		position: "absolute",
		top: -4,
		right: -4,
		minWidth: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: "#a855f7",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 3,
	},
	navBadgeText: { fontSize: 9, color: "#fff", fontWeight: "700" },

	// Info & Sponsors
	infoScreenContainer: { flex: 1, paddingTop: 16 },
	contactCard: {
		backgroundColor: "rgba(120,60,200,0.07)",
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.2)",
		borderRadius: 14,
		padding: 20,
		marginHorizontal: 24,
		marginBottom: 10,
	},
	sectionTitle: {
		color: "#a855f7",
		fontSize: 14,
		fontWeight: "600",
		letterSpacing: 2,
		marginBottom: 12,
	},
	infoText: {
		color: "#d8c8f0",
		fontSize: 14,
		marginBottom: 8,
		letterSpacing: 0.5,
	},
	sponsorListContent: { paddingHorizontal: 16, paddingBottom: 32 },
	sponsorColumnWrapper: { justifyContent: "space-between", marginBottom: 16 },
	sponsorCard: {
		backgroundColor: "#120a26",
		borderWidth: 0.5,
		borderColor: "rgba(168,85,247,0.15)",
		borderRadius: 12,
		padding: 16,
		width: "48%",
		alignItems: "center",
	},
	sponsorLogo: { width: 60, height: 40, marginBottom: 12 },
	sponsorName: {
		color: "rgba(232,216,255,0.8)",
		fontSize: 12,
		fontWeight: "500",
		textAlign: "center",
	},

	// Favorites képernyő
	favScreen: { flex: 1 },
	favEmptyContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 32,
		gap: 12,
	},
	favEmptyIconWrap: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.25)",
		backgroundColor: "rgba(120,60,200,0.07)",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	favEmptyTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#e8d8ff",
		textAlign: "center",
	},
	favEmptySubtitle: {
		fontSize: 13,
		color: "rgba(168,85,247,0.5)",
		textAlign: "center",
		lineHeight: 20,
	},
	favEmptyBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginTop: 8,
		paddingVertical: 12,
		paddingHorizontal: 22,
		borderRadius: 14,
		backgroundColor: "rgba(124,58,237,0.25)",
		borderWidth: 0.5,
		borderColor: "rgba(168,85,247,0.45)",
	},
	favEmptyBtnText: { fontSize: 14, fontWeight: "600", color: "#f0e8ff" },

	// Nap szűrő
	dayFilterRow: { paddingHorizontal: 16, gap: 8, paddingVertical: 10 },
	dayFilterChip: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.25)",
		backgroundColor: "rgba(120,60,200,0.06)",
	},
	dayFilterChipActive: {
		backgroundColor: "rgba(124,58,237,0.22)",
		borderColor: "rgba(168,85,247,0.45)",
	},
	dayFilterChipText: {
		fontSize: 12,
		color: "rgba(168,85,247,0.5)",
		fontWeight: "500",
	},
	dayFilterChipTextActive: { color: "#e8d8ff" },

	// Gasztró képernyő
	gastroScreen: { flex: 1 },
	gastroList: { paddingHorizontal: 16, paddingBottom: 32 },
	gastroCard: {
		flexDirection: "row",
		backgroundColor: "rgba(120,60,200,0.07)",
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.2)",
		borderRadius: 16,
		marginBottom: 12,
		overflow: "hidden",
	},
	gastroCardAccent: { width: 4 },
	gastroCardBody: { flex: 1, padding: 14 },
	gastroCardHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
		marginBottom: 8,
	},
	gastroEmoji: { fontSize: 32, lineHeight: 38 },
	gastroCardTitles: { flex: 1 },
	gastroName: {
		fontSize: 17,
		fontWeight: "700",
		color: "#f0e8ff",
		marginBottom: 4,
	},
	gastroTagRow: { flexDirection: "row", alignItems: "center", gap: 6 },
	gastroCatBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
		borderWidth: 0.5,
	},
	gastroCatText: { fontSize: 10, fontWeight: "600", letterSpacing: 0.5 },
	gastroArtist: { fontSize: 11, color: "rgba(168,85,247,0.55)" },
	gastroDescription: {
		fontSize: 13,
		color: "rgba(216,200,240,0.8)",
		lineHeight: 19,
		marginBottom: 12,
	},
	gastroOffers: { gap: 6 },
	gastroOffersLabel: {
		fontSize: 9,
		letterSpacing: 2,
		color: "rgba(168,85,247,0.45)",
		marginBottom: 4,
	},
	gastroOfferRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
	gastroOfferDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
	gastroOfferText: {
		flex: 1,
		fontSize: 12,
		color: "rgba(216,200,240,0.7)",
		lineHeight: 18,
	},
	// ─── SOS Funkció Stílusok ───
	sosFloatingBtn: {
		position: "absolute",
		bottom: 24,
		right: 20,
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "#ef4444", // Élénk piros
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#ef4444",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 8,
		borderWidth: 2,
		borderColor: "#fca5a5",
	},
	sosModalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.85)", // Sötét háttér a fókuszért
		justifyContent: "flex-end", // Alulra igazítja a panelt
	},
	sosModalContent: {
		backgroundColor: "#1a0b2e",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		paddingBottom: 40, // Kicsit több hely alul a swipe miatt
		borderTopWidth: 1,
		borderTopColor: "#ef4444",
	},
	sosHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 8,
	},
	sosTitle: {
		fontSize: 20,
		fontWeight: "800",
		color: "#ef4444",
		letterSpacing: 1,
	},
	sosSubtitle: {
		fontSize: 14,
		color: "#d8c8f0",
		marginBottom: 24,
	},
	sosActionBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		backgroundColor: "#ef4444",
		paddingVertical: 18,
		borderRadius: 16,
		marginBottom: 12,
	},
	sosActionText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	sosCancelBtn: {
		paddingVertical: 16,
		alignItems: "center",
		marginTop: 8,
	},
	sosCancelText: {
		color: "rgba(216,200,240,0.6)",
		fontSize: 16,
		fontWeight: "600",
	},
	sosSuccessContainer: {
		alignItems: "center",
		paddingVertical: 20,
	},
	sosSuccessTitle: {
		fontSize: 22,
		fontWeight: "800",
		color: "#22c55e",
		marginTop: 16,
		marginBottom: 8,
	},
	sosSuccessText: {
		fontSize: 15,
		color: "#d8c8f0",
		textAlign: "center",
		lineHeight: 22,
		paddingHorizontal: 20,
	},
	// Kép a sima listában
	performerImage: {
		width: 64,
		height: 64,
		borderRadius: 10,
		marginLeft: 12,
		marginVertical: 12,
		backgroundColor: "rgba(120,60,200,0.1)",
	},

	// Kép a timeline nézetben
	timelineImage: {
		width: 52,
		height: 52,
		borderRadius: 8,
		margin: 12,
		marginRight: 0,
		backgroundColor: "rgba(120,60,200,0.1)",
	},
});
