import React, { useEffect, useRef, useState } from "react";
import {
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

const HOME_HERO_IMAGE = require("./assets/festival.png");

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
	},
	hu: {
		home: "Kezdőlap",
		schedule: "Program",
		map: "Térkép",
		tickets: "Jegyek",
		sponsors: "Támogatók",
		sponsorsTitle: "BÜSZKE TÁMOGATÓINK",
		festivalInfo: "FESZTIVÁL INFÓ",
	},
};

type TabKey = "Home" | "Schedule" | "Map" | "Favorites" | "Gastro" | "Tickets" | "Sponsors";

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

type MapCategory = "stage" | "food" | "merch" | "service" | "entrance" | "camping";

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

function formatPrice(amount: number, currency: string) {
	return `${amount.toLocaleString("hu-HU")} ${currency}`;
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

function formatPerformanceDate(performer: Performer) {
	return `Júl. ${performer.day}. · ${performer.startTime}–${performer.endTime}`;
}

function formatCountdown(target: Date, now: Date) {
	const diff = Math.max(0, target.getTime() - now.getTime());
	const totalMinutes = Math.floor(diff / 60000);
	const days = Math.floor(totalMinutes / (60 * 24));
	const hours = Math.floor((totalMinutes - days * 60 * 24) / 60);
	const minutes = totalMinutes % 60;
	return { days, hours, minutes, expired: diff <= 0 };
}

function formatRefundDeadline(performer: Performer) {
	const deadline = getRefundDeadline(performer);
	return `Júl. ${deadline.getDate()}. ${deadline.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}`;
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

function getConflictsForPerformer(performer: Performer, allFavorites: Performer[]): Performer[] {
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
		.filter((p) => p.day === todayDay && parseTimeToMinutes(p.startTime) > nowMinutes)
		.sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
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
					Animated.timing(anim, { toValue: 1.08, duration: 2000 + delay * 0.1, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
					Animated.timing(anim, { toValue: 1, duration: 2000 + delay * 0.1, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
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

	const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

	const spikes = Array.from({ length: 24 }, (_, i) => ({
		angle: i * 15,
		length: i % 3 === 0 ? 52 : i % 2 === 0 ? 38 : 28,
		opacity: i % 3 === 0 ? 0.55 : i % 2 === 0 ? 0.35 : 0.18,
		width: i % 3 === 0 ? 1.5 : 0.8,
	}));

	return (
		<View style={styles.eclipseContainer}>
			<Animated.View style={[styles.haloRing, styles.haloOuter, { transform: [{ scale: pulse1 }] }]} />
			<Animated.View style={[styles.haloRing, styles.haloMid, { transform: [{ scale: pulse2 }] }]} />
			<Animated.View style={[styles.haloRing, styles.haloInner, { transform: [{ scale: pulse3 }] }]} />
			<Animated.View style={[styles.coronaWrapper, { transform: [{ rotate: spin }] }]}>
				{spikes.map((spike, i) => (
					<View key={i} style={[styles.spikeContainer, { transform: [{ rotate: `${spike.angle}deg` }] }]}>
						<View style={[styles.spike, { height: spike.length, width: spike.width, opacity: spike.opacity }]} />
					</View>
				))}
			</Animated.View>
			<View style={styles.planetDisk}>
				<Image source={require("./assets/EclipseFest_Logo.png")} style={styles.logoImage} resizeMode="cover" />
			</View>
		</View>
	);
}

// ─── Jegy kártya ──────────────────────────────────────────────────────────────
function TicketCard({ ticket, selected, onSelect }: { ticket: Ticket; selected: boolean; onSelect: () => void }) {
	return (
		<TouchableOpacity style={[styles.ticketCard, selected && styles.ticketCardSelected]} onPress={onSelect} activeOpacity={0.85}>
			{ticket.popular && (
				<View style={styles.popularBadge}>
					<Text style={styles.popularBadgeText}>NÉPSZERŰ</Text>
				</View>
			)}
			<View style={[styles.cardAccent, selected && styles.ticketAccentSelected]} />
			<View style={styles.ticketCardBody}>
				<View style={styles.ticketCardHeader}>
					<View style={styles.ticketTitleRow}>
						<Text style={styles.ticketName}>{ticket.name}</Text>
						<View style={styles.ticketBadge}>
							<Text style={styles.ticketBadgeText}>{ticket.badge}</Text>
						</View>
					</View>
					<Text style={styles.ticketPrice}>{formatPrice(ticket.price, ticket.currency)}</Text>
				</View>
				<Text style={styles.ticketDescription}>{ticket.description}</Text>
				<View style={styles.ticketFeatures}>
					{ticket.features.map((feature) => (
						<View key={feature} style={styles.ticketFeatureRow}>
							<Ionicons name="checkmark-circle" size={14} color="#a855f7" />
							<Text style={styles.ticketFeatureText}>{feature}</Text>
						</View>
					))}
				</View>
			</View>
			<View style={styles.ticketSelectIndicator}>
				<Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={22} color={selected ? "#a855f7" : "#555"} />
			</View>
		</TouchableOpacity>
	);
}

// ─── Jegyvásárlás képernyő ────────────────────────────────────────────────────
function getPerformanceConflictPairs(selectedPerformances: Performer[]) {
	const pairs: { a: Performer; b: Performer }[] = [];
	for (let i = 0; i < selectedPerformances.length; i += 1) {
		for (let j = i + 1; j < selectedPerformances.length; j += 1) {
			if (selectedPerformances[i].day === selectedPerformances[j].day && hasTimeConflict(selectedPerformances[i], selectedPerformances[j])) {
				pairs.push({ a: selectedPerformances[i], b: selectedPerformances[j] });
			}
		}
	}
	return pairs;
}

function getEarliestUpcomingPerformance(selectedPerformances: Performer[], now: Date) {
	return [...selectedPerformances]
		.sort((a, b) => getPerformanceDate(a).getTime() - getPerformanceDate(b).getTime())
		.find((p) => getPerformanceDate(p).getTime() >= now.getTime()) ?? selectedPerformances[0] ?? null;
}

function getEarliestRefundDeadline(selectedPerformances: Performer[]) {
	if (selectedPerformances.length === 0) return null;
	return selectedPerformances
		.map(getRefundDeadline)
		.sort((a, b) => a.getTime() - b.getTime())[0];
}

function formatRefundDeadlineDate(deadline: Date | null) {
	if (!deadline) return "-";
	return `Júl. ${deadline.getDate()}. ${deadline.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}`;
}

type DiscountKey = "none" | "early" | "student" | "bundle";

const SERVICE_FEE_RATE = 0.055;
const HANDLING_FEE_PER_CART_ITEM = 590;

const DISCOUNT_OPTIONS: { key: DiscountKey; title: string; description: string; percent: number; minPerformances?: number }[] = [
	{ key: "none", title: "Nincs kedvezmény", description: "Normál online ár", percent: 0 },
	{ key: "early", title: "Early Bird", description: "Időszakos promóció · -10%", percent: 10 },
	{ key: "student", title: "Diák kedvezmény", description: "Belépéskor igazolással · -15%", percent: 15 },
	{ key: "bundle", title: "Multi-show csomag", description: "3+ fellépés választásakor · -8%", percent: 8, minPerformances: 3 },
];

const DISCOUNT_POLICY_INFO = [
	{ icon: "flash-outline" as const, title: "Early Bird", text: "A korai időszakban megvásárolt jegyekre jár. A promóció csak a meghirdetett készlet vagy határidő végéig él." },
	{ icon: "school-outline" as const, title: "Diák kedvezmény", text: "Érvényes diákigazolvánnyal használható. Az igazolást a belépéskor ellenőrizhetik." },
	{ icon: "albums-outline" as const, title: "Multi-show csomag", text: "Legalább 3 különböző, nem ütköző fellépés kiválasztása esetén aktiválódik automatikusan." },
];

function getDiscountOption(key: DiscountKey) {
	return DISCOUNT_OPTIONS.find((option) => option.key === key) ?? DISCOUNT_OPTIONS[0];
}

function isDiscountAvailable(key: DiscountKey, selectedPerformanceCount: number) {
	const option = getDiscountOption(key);
	return !option.minPerformances || selectedPerformanceCount >= option.minPerformances;
}

function calculateDiscountAmount(key: DiscountKey, subtotal: number, selectedPerformanceCount: number) {
	const option = getDiscountOption(key);
	if (!isDiscountAvailable(key, selectedPerformanceCount)) return 0;
	return Math.round(subtotal * (option.percent / 100));
}

function calculateServiceFee(amountAfterDiscount: number) {
	return Math.round(amountAfterDiscount * SERVICE_FEE_RATE);
}

function calculateHandlingFee(cartItemCount: number) {
	return cartItemCount > 0 ? cartItemCount * HANDLING_FEE_PER_CART_ITEM : 0;
}

function PerformanceTicketCard({ performer, selected, conflicted, onSelect }: { performer: Performer; selected: boolean; conflicted?: boolean; onSelect: () => void }) {
	return (
		<TouchableOpacity
			style={[
				styles.performanceTicketCard,
				selected && styles.performanceTicketCardSelected,
				conflicted && styles.performanceTicketCardConflicted,
			]}
			onPress={onSelect}
		>
			<View style={styles.performanceTicketVisual}>
				<Svg width="100%" height="100%" viewBox="0 0 90 70">
					<Defs>
						<RadialGradient id={`ticketGlow${performer.id}`} cx="50%" cy="35%" r="65%">
							<Stop offset="0" stopColor={conflicted ? "#f97316" : "#c084fc"} stopOpacity="0.9" />
							<Stop offset="1" stopColor="#0b041a" stopOpacity="1" />
						</RadialGradient>
					</Defs>
					<Rect x="0" y="0" width="90" height="70" rx="14" fill={`url(#ticketGlow${performer.id})`} />
					<Circle cx="45" cy="34" r="16" fill="rgba(34,18,58,0.35)" />
					<Circle cx="45" cy="34" r="9" fill="rgba(255,255,255,0.85)" />
					<Path d="M10 55 C25 42 35 49 45 38 C55 49 67 42 80 55" stroke="rgba(255,255,255,0.42)" strokeWidth="3" fill="none" />
					{[12, 24, 36, 54, 66, 78].map((x, i) => (
						<Rect key={i} x={x} y={58 - (i % 3) * 7} width="3" height={(i % 3) * 7 + 10} rx="1.5" fill="rgba(255,255,255,0.35)" />
					))}
				</Svg>
			</View>
			<View style={styles.performanceTicketInfo}>
				<Text style={styles.performanceTicketName}>{performer.name}</Text>
				<Text style={styles.performanceTicketMeta}>{performer.stage}</Text>
				<View style={styles.performanceTicketTimeRow}>
					<Ionicons name="calendar-outline" size={13} color={conflicted ? "#fb923c" : THEME.accent} />
					<Text style={[styles.performanceTicketTime, conflicted && styles.performanceTicketTimeConflicted]}>{formatPerformanceDate(performer)}</Text>
				</View>
			</View>
			<Ionicons
				name={selected ? (conflicted ? "warning" : "checkmark-circle") : "ellipse-outline"}
				size={22}
				color={selected ? (conflicted ? "#fb923c" : THEME.accent) : "rgba(255,255,255,0.35)"}
			/>
		</TouchableOpacity>
	);
}

function TicketsScreen({
	tickets,
	performers,
	selectedId,
	selectedPerformanceIds,
	quantity,
	email,
	orderComplete,
	refundRequested,
	onSelect,
	onTogglePerformance,
	onChangeQuantity,
	onEmailChange,
	onPurchase,
	onReset,
	onRequestRefund,
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
		label: `Júl. ${day}.`,
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
						<Ionicons name="checkmark-circle" size={56} color="#a855f7" />
					</View>
					<Text style={styles.orderSuccessTitle}>Sikeres vásárlás!</Text>
					<Text style={styles.orderSuccessSub}>A visszaigazolást elküldjük erre a címre:</Text>
					<Text style={styles.orderSuccessEmail}>{email.trim()}</Text>

					<View style={styles.orderSummaryCard}>
						<Text style={styles.orderSummaryLabel}>RENDELÉS</Text>
						<Text style={styles.orderSummaryName}>{selected.name}</Text>
						<Text style={styles.orderSummaryDetail}>{quantity} db / fellépés · {selectedPerformances.length} fellépés · végösszeg: {formatPrice(total, selected.currency)}</Text>
						<View style={styles.orderDivider} />
						{cartItems.map(({ performance, lineTotal }) => (
							<View key={performance.id} style={styles.orderPerformanceRow}>
								<Text style={styles.orderPerformerName}>{performance.name}</Text>
								<Text style={styles.orderPerformerMeta}>{performance.stage} · {formatPerformanceDate(performance)} · {formatPrice(lineTotal, selected.currency)}</Text>
							</View>
						))}
						<View style={styles.orderDivider} />
						<View style={styles.cartTotalsCompact}>
							<View style={styles.cartTotalLine}><Text style={styles.cartTotalLabel}>Részösszeg</Text><Text style={styles.cartTotalValue}>{formatPrice(subtotal, selected.currency)}</Text></View>
							<View style={styles.cartTotalLine}><Text style={styles.cartDiscountLabel}>Kedvezmény · {selectedDiscountOption.title}</Text><Text style={styles.cartDiscountValue}>− {formatPrice(discountAmount, selected.currency)}</Text></View>
							<View style={styles.cartTotalLine}><Text style={styles.cartTotalLabel}>Kezelési díj</Text><Text style={styles.cartTotalValue}>{formatPrice(handlingFee, selected.currency)}</Text></View>
							<View style={styles.cartTotalLine}><Text style={styles.cartTotalLabel}>Szolgáltatási díj</Text><Text style={styles.cartTotalValue}>{formatPrice(serviceFee, selected.currency)}</Text></View>
							<View style={styles.cartGrandTotalLine}><Text style={styles.cartGrandTotalLabel}>Fizetendő</Text><Text style={styles.cartGrandTotalValue}>{formatPrice(total, selected.currency)}</Text></View>
						</View>
					</View>

					<View style={styles.countdownCard}>
						<Text style={styles.countdownLabel}>KÖVETKEZŐ FELLÉPÉSIG HÁTRA VAN</Text>
						<Text style={styles.countdownTargetName}>{countdownTarget.name}</Text>
						<View style={styles.countdownGrid}>
							<View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdown.days}</Text><Text style={styles.countdownUnit}>nap</Text></View>
							<View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdown.hours}</Text><Text style={styles.countdownUnit}>óra</Text></View>
							<View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdown.minutes}</Text><Text style={styles.countdownUnit}>perc</Text></View>
						</View>
					</View>

					<View style={styles.refundPolicyCard}>
						<View style={styles.refundPolicyHeader}>
							<Ionicons name="shield-checkmark-outline" size={18} color={THEME.accent} />
							<Text style={styles.refundPolicyTitle}>Visszamondás & visszatérítés</Text>
						</View>
						<Text style={styles.refundPolicyText}>
							A jegyek a kiválasztott fellépésekhez vannak társítva. Visszatérítési kérelmet legkésőbb {REFUND_DEADLINE_HOURS} órával az érintett fellépés kezdése előtt lehet indítani. Több fellépésnél a legkorábbi határidőt vesszük figyelembe.
						</Text>
						<Text style={styles.refundDeadlineText}>Legkorábbi határidő: {formatRefundDeadlineDate(earliestRefundDeadline)}</Text>
						{refundRequested ? (
							<View style={styles.refundRequestedBadge}><Text style={styles.refundRequestedText}>Visszatérítési kérelem elküldve</Text></View>
						) : (
							<TouchableOpacity style={[styles.refundBtn, !canRequestRefund && styles.refundBtnDisabled]} onPress={onRequestRefund} disabled={!canRequestRefund}>
								<Ionicons name="return-up-back-outline" size={16} color={THEME.text} />
								<Text style={styles.refundBtnText}>{canRequestRefund ? "Visszatérítés kérése" : "A visszatérítési határidő lejárt"}</Text>
							</TouchableOpacity>
						)}
					</View>

					<TouchableOpacity style={styles.checkoutBtn} onPress={onReset}>
						<Text style={styles.checkoutBtnText}>Új vásárlás</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}

	return (
		<View style={styles.ticketsScreen}>
			<ScrollView contentContainerStyle={styles.ticketsScroll} showsVerticalScrollIndicator={false}>
				<Text style={styles.ticketsHeading}>Jegyvásárlás</Text>
				<Text style={styles.ticketsSubheading}>Válaszd ki a jegytípust és a fellépéseket, majd ellenőrizd a kosarat. A végösszegben külön látszanak a kedvezmények és a vásárláshoz kapcsolódó díjak.</Text>
				<View style={styles.ticketSectionHeader}>
					<Text style={styles.ticketSectionTitle}>1. Jegytípus</Text>
					<Text style={styles.ticketSectionHint}>Belépő kategória</Text>
				</View>
				{tickets.map((ticket) => (
					<TicketCard key={ticket.id} ticket={ticket} selected={selectedId === ticket.id} onSelect={() => onSelect(ticket.id)} />
				))}

				<View style={styles.ticketSectionHeader}>
					<Text style={styles.ticketSectionTitle}>2. Fellépések</Text>
					<Text style={styles.ticketSectionHint}>{selectedPerformances.length > 0 ? `${selectedPerformances.length} kiválasztva` : "Több is választható"}</Text>
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
											<Text style={styles.performanceDaySubtitle}>{items.length} fellépés · {selectedCountForDay > 0 ? `${selectedCountForDay} kiválasztva` : "nincs kiválasztva"}</Text>
										</View>
									</View>
									<View style={styles.performanceDayHeaderRight}>
										{hasConflictOnDay && <View style={styles.performanceDayWarningBadge}><Ionicons name="warning-outline" size={13} color="#fed7aa" /><Text style={styles.performanceDayWarningText}>ütközés</Text></View>}
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
							<Text style={styles.performanceConflictTitle}>Időpontütközés</Text>
						</View>
						<Text style={styles.performanceConflictText}>Ezek a fellépések átfedik egymást, ezért együtt nem vásárolhatók meg:</Text>
						{conflictPairs.map(({ a, b }) => (
							<Text key={`${a.id}-${b.id}`} style={styles.performanceConflictItem}>• {a.name} ({a.startTime}–{a.endTime}) és {b.name} ({b.startTime}–{b.endTime})</Text>
						))}
					</View>
				)}

				{selected && selectedPerformances.length > 0 && (
					<View style={styles.discountSection}>
						<View style={styles.ticketSectionHeader}>
							<Text style={styles.ticketSectionTitle}>3. Kedvezmény</Text>
							<Text style={styles.ticketSectionHint}>Mire jár kedvezmény?</Text>
						</View>
						<View style={styles.discountInfoPanel}>
							<View style={styles.discountInfoHeader}>
								<View style={styles.discountInfoIconWrap}>
									<Ionicons name="pricetag-outline" size={18} color="#86efac" />
								</View>
								<View style={{ flex: 1 }}>
									<Text style={styles.discountInfoTitle}>Kedvezmény tájékoztató</Text>
									<Text style={styles.discountInfoLead}>Válassz kedvezményt, majd a kosárban külön soron látod a levonást.</Text>
								</View>
							</View>
							{DISCOUNT_POLICY_INFO.map((item) => (
								<View key={item.title} style={styles.discountInfoRow}>
									<Ionicons name={item.icon} size={16} color="#86efac" />
									<View style={{ flex: 1 }}>
										<Text style={styles.discountInfoRowTitle}>{item.title}</Text>
										<Text style={styles.discountInfoRowText}>{item.text}</Text>
									</View>
								</View>
							))}
						</View>
						<View style={styles.discountGrid}>
							{DISCOUNT_OPTIONS.map((option) => {
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
											<Text style={[styles.discountChipTitle, active && styles.discountChipTitleActive]}>{option.title}</Text>
											{option.percent > 0 && <Text style={styles.discountChipPercent}>-{option.percent}%</Text>}
										</View>
										<Text style={styles.discountChipDescription}>{disabled ? `Legalább ${option.minPerformances} fellépés kell hozzá` : option.description}</Text>
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
								<Text style={styles.cartEyebrow}>KOSÁR</Text>
								<Text style={styles.cartTitle}>Rendelés áttekintése</Text>
							</View>
							<View style={styles.cartCountBadge}><Text style={styles.cartCountText}>{cartItems.length}</Text></View>
						</View>
						{cartItems.map(({ performance, lineTotal }) => (
							<View key={performance.id} style={styles.cartItemRow}>
								<View style={styles.cartItemInfo}>
									<Text style={styles.cartItemName}>{performance.name}</Text>
									<Text style={styles.cartItemMeta}>{selected.name} · {quantity} db · {formatPerformanceDate(performance)}</Text>
								</View>
								<Text style={styles.cartItemPrice}>{formatPrice(lineTotal, selected.currency)}</Text>
							</View>
						))}
						<View style={styles.cartTotals}>
							<View style={styles.cartTotalLine}><Text style={styles.cartTotalLabel}>Részösszeg</Text><Text style={styles.cartTotalValue}>{formatPrice(subtotal, selected.currency)}</Text></View>
							<View style={styles.cartTotalLine}><Text style={styles.cartDiscountLabel}>Kedvezmény · {selectedDiscountOption.title}</Text><Text style={styles.cartDiscountValue}>− {formatPrice(discountAmount, selected.currency)}</Text></View>
							<View style={styles.cartTotalLine}><Text style={styles.cartTotalLabel}>Kezelési díj</Text><Text style={styles.cartTotalValue}>{formatPrice(handlingFee, selected.currency)}</Text></View>
							<View style={styles.cartTotalLine}><Text style={styles.cartTotalLabel}>Szolgáltatási díj ({Math.round(SERVICE_FEE_RATE * 1000) / 10}%)</Text><Text style={styles.cartTotalValue}>{formatPrice(serviceFee, selected.currency)}</Text></View>
							<View style={styles.cartGrandTotalLine}><Text style={styles.cartGrandTotalLabel}>Fizetendő</Text><Text style={styles.cartGrandTotalValue}>{formatPrice(total, selected.currency)}</Text></View>
						</View>
						<Text style={styles.cartLegalNote}>A díjak és kedvezmények demo logikák. A kezelési díj tételenként, a szolgáltatási díj a kedvezménnyel csökkentett összeg után számolódik.</Text>
					</View>
				)}

				{selectedPerformances.length > 0 && countdownTarget && countdown && (
					<View style={styles.selectedPerformancePanel}>
						<Text style={styles.selectedPerformanceLabel}>Kiválasztott fellépések</Text>
						{selectedPerformances.map((performance) => (
							<View key={performance.id} style={styles.selectedPerformanceLine}>
								<Text style={styles.selectedPerformanceName}>{performance.name}</Text>
								<Text style={styles.selectedPerformanceMeta}>{performance.stage} · {formatPerformanceDate(performance)}</Text>
							</View>
						))}
						<View style={styles.miniCountdownRow}>
							<Text style={styles.miniCountdownText}>{countdownTarget.name}: {countdown.days} nap · {countdown.hours} óra · {countdown.minutes} perc van hátra</Text>
						</View>
						<Text style={styles.selectedRefundInfo}>Legkorábbi visszamondási határidő: {formatRefundDeadlineDate(earliestRefundDeadline)}</Text>
					</View>
				)}
			</ScrollView>
			<View style={styles.checkoutBar}>
				{selected ? (
					<>
						<View style={styles.quantityRow}>
							<Text style={styles.quantityLabel}>Mennyiség / fellépés</Text>
							<View style={styles.quantityControls}>
								<TouchableOpacity style={[styles.quantityBtn, quantity <= 1 && styles.quantityBtnDisabled]} onPress={() => onChangeQuantity(-1)} disabled={quantity <= 1}>
									<Ionicons name="remove" size={18} color="#e8d8ff" />
								</TouchableOpacity>
								<Text style={styles.quantityValue}>{quantity}</Text>
								<TouchableOpacity style={styles.quantityBtn} onPress={() => onChangeQuantity(1)}>
									<Ionicons name="add" size={18} color="#e8d8ff" />
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.emailField}>
							<Text style={styles.emailLabel}>E-mail cím</Text>
							<TextInput
								style={[styles.emailInput, showEmailError && styles.emailInputError]}
								value={email}
								onChangeText={onEmailChange}
								placeholder="pelda@email.com"
								placeholderTextColor="rgba(168,85,247,0.35)"
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								autoComplete="email"
							/>
							{showEmailError && <Text style={styles.emailErrorText}>Érvényes e-mail címet adj meg</Text>}
						</View>
						<View style={styles.checkoutCartMini}>
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>{selectedPerformances.length || 0} fellépés · részösszeg</Text>
								<Text style={styles.totalValueSmall}>{formatPrice(subtotal, selected.currency)}</Text>
							</View>
							{discountAmount > 0 && <View style={styles.totalRow}><Text style={styles.totalLabel}>Kedvezmény</Text><Text style={styles.totalDiscountValue}>− {formatPrice(discountAmount, selected.currency)}</Text></View>}
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>Díjakkal együtt fizetendő</Text>
								<Text style={styles.totalValue}>{formatPrice(total, selected.currency)}</Text>
							</View>
						</View>
					</>
				) : (
					<Text style={styles.checkoutHint}>Válassz jegytípust és legalább egy fellépést a folytatáshoz</Text>
				)}
				{hasConflicts && <Text style={styles.checkoutWarningText}>Előbb oldd fel az időpontütközést.</Text>}
				<TouchableOpacity style={[styles.checkoutBtn, !canCheckout && styles.checkoutBtnDisabled]} onPress={onPurchase} disabled={!canCheckout}>
					<Ionicons name="card-outline" size={18} color="#f0e8ff" />
					<Text style={styles.checkoutBtnText}>Fizetés</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}


// ─── Canvas térkép segédfüggvények ────────────────────────────────────────────

// GPS koordinátákat vászon pixelekre konvertál
// ─── GPS → SVG koordináta konverter ──────────────────────────────────────────
function gpsToXY(
	lat: number, lng: number,
	bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
	W: number, H: number
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
  grass:       "#070212",       // Deep obsidian background
  grassLight:  "#0b041a",       // Slightly lighter obsidian
  grassDark:   "#040108",       // Darkest obsidian
  path:        "rgba(168,85,247,0.12)",   // Glowing purple translucent path
  pathDark:    "rgba(168,85,247,0.25)",
  road:        "rgba(124,58,237,0.15)",
  fence:       "rgba(168,85,247,0.35)",  // Neon purple fence outline
  stageMain:   "#581c87",       // Glowing stage bases
  stagePurple: "#7c3aed",
  stageBlue:   "#1d4ed8",
  stageGold:   "#b45309",
  water:       "rgba(168,85,247,0.06)",   // Ethereal purple pond
  waterLight:  "rgba(168,85,247,0.15)",
  campTeal:    "rgba(13,148,136,0.25)",
  campLight:   "#14b8a6",
  food:        "#d97706",
  foodLight:   "#fbbf24",
  service:     "#0891b2",
  merch:       "#be185d",
  vip:         "#7c3aed",
  entrance:    "#a855f7",
  parking:     "rgba(71,85,105,0.2)",
  tree:        "rgba(168,85,247,0.2)",   // Glowing abstract neon trees
  treeLight:   "rgba(168,85,247,0.4)",
  treeShadow:  "rgba(168,85,247,0.05)",
  text:        "#f0e8ff",
  textDark:    "#06020f",
  white:       "#ffffff",
  shadow:      "rgba(34,18,58,0.55)",
};

// ─── Segéd komponensek ────────────────────────────────────────────────────────

// Fa komponens
function MapTree({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <G>
      {/* Outer ambient glow */}
      <Circle cx={x} cy={y} r={r * 1.3} fill="rgba(168,85,247,0.04)" />
      {/* Concentric rings */}
      <Circle cx={x} cy={y} r={r} fill="none" stroke="rgba(168,85,247,0.2)" strokeWidth={1} />
      <Circle cx={x} cy={y} r={r * 0.7} fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth={1} />
      <Circle cx={x} cy={y} r={r * 0.3} fill="#a855f7" opacity={0.6} />
    </G>
  );
}

// Bokor komponens
function MapBush({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Circle cx={x} cy={y} r={6} fill="none" stroke="rgba(192,132,252,0.35)" strokeWidth={0.8} />
      <Circle cx={x} cy={y} r={2.5} fill="#c084fc" opacity={0.7} />
    </G>
  );
}

// Színpad épület komponens
function MapStage({
  x, y, w, h, color, label, sublabel, icon,
}: { x: number; y: number; w: number; h: number; color: string; label: string; sublabel?: string; icon: string }) {
  return (
    <G>
      {/* Ambient Outer Glow */}
      <Rect x={x-3} y={y-3} width={w+6} height={h+6} rx={12} fill="none" stroke={`${color}22`} strokeWidth={3} />
      {/* Main Glassmorphic Panel */}
      <Rect x={x} y={y} width={w} height={h} rx={10} fill="rgba(15,7,32,0.85)" stroke={color} strokeWidth={1.5} />
      {/* Top Gloss Line */}
      <Rect x={x+2} y={y+2} width={w-4} height={4} rx={2} fill="rgba(255,255,255,0.1)" />
      {/* Icon */}
      <SvgText x={x+w/2} y={y+h*0.42} fontSize={14} textAnchor="middle" fill={COLORS.white}>{icon}</SvgText>
      {/* Text Labels */}
      <SvgText x={x+w/2} y={y+h*0.68} fontSize={8.5} fontWeight="bold" textAnchor="middle" fill="#f0e8ff" letterSpacing={0.8}>{label}</SvgText>
      {sublabel && <SvgText x={x+w/2} y={y+h*0.84} fontSize={7} textAnchor="middle" fill="rgba(216,180,254,0.65)">{sublabel}</SvgText>}
    </G>
  );
}

// POI jelölő
function MapPin({
  x, y, color, icon, label,
}: { x: number; y: number; color: string; icon: string; label: string }) {
  return (
    <G>
      <Ellipse cx={x+1} cy={y+18} rx={8} ry={3} fill="rgba(34,18,58,0.30)" />
      <Path d={`M${x},${y} C${x-10},${y-8} ${x-10},${y-22} ${x},${y-26} C${x+10},${y-22} ${x+10},${y-8} ${x},${y}`} fill={color} />
      <Circle cx={x} cy={y-18} r={9} fill="rgba(255,255,255,0.2)" />
      <SvgText x={x} y={y-14} fontSize={10} textAnchor="middle" fill={COLORS.white}>{icon}</SvgText>
      {/* Felirat buborék */}
      <Rect x={x-20} y={y-42} width={40} height={14} rx={7} fill="rgba(42,22,70,0.86)" />
      <SvgText x={x} y={y-32} fontSize={7} fontWeight="bold" textAnchor="middle" fill={COLORS.white}>{label}</SvgText>
    </G>
  );
}

// Kemping sátor
function MapTent({ x, y, color = COLORS.campTeal }: { x: number; y: number; color?: string }) {
  return (
    <G>
      {/* Outer subtle shape */}
      <Polygon points={`${x},${y-10} ${x-8},${y+4} ${x+8},${y+4}`} fill="none" stroke={color} strokeWidth={1} />
      {/* Inner cross vector line */}
      <Line x1={x} y1={y-10} x2={x} y2={y+4} stroke={color} strokeWidth={0.5} />
      <Polygon points={`${x},${y-4} ${x-4},${y+4} ${x+4},${y+4}`} fill={`${color}22`} />
    </G>
  );
}

// ─── Fő MapScreen ─────────────────────────────────────────────────────────────
function MapScreen({ map }: { map: FestivalMap }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapView, setMapView] = useState<"map" | "list">("map");
  const [filter, setFilter] = useState<MapFilter>("all");

  // Pan & Zoom state
  const scale = useRef(1);
  const translateX = useRef(0);
  const translateY = useRef(0);
  const lastScale = useRef(1);
  const lastTX = useRef(0);
  const lastTY = useRef(0);
  const [transform, setTransform] = useState({ scale: 1, tx: 0, ty: 0 });

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
          setTransform({ scale: scale.current, tx: translateX.current, ty: translateY.current });
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const selected = map.points.find((p) => p.id === selectedId) ?? null;
  const selectedMarker = selected ? MAP_IMAGE_MARKERS[selected.id] : null;

  const handleSelectMapPoint = (id: string) => {
    setSelectedId((current) => current === id ? null : id);
    setMapView("map");
  };

  const renderDetailCard = (point: MapPoint) => (
    <View style={styles.mapDetailCard}>
      <View style={[styles.mapDetailAccent, { backgroundColor: MAP_CATEGORY_META[point.category].color }]} />
      <View style={styles.mapDetailBody}>
        <View style={styles.mapDetailHeader}>
          <Text style={styles.mapDetailName}>{point.name}</Text>
          <View style={styles.mapDetailBadge}>
            <Text style={styles.mapDetailBadgeText}>{MAP_CATEGORY_META[point.category].label}</Text>
          </View>
        </View>
        <Text style={styles.mapDetailDescription}>{point.description}</Text>
        {Platform.OS !== "web" && (
          <TouchableOpacity style={styles.mapOpenExternalBtn} onPress={() => openInGoogleMaps(point)}>
            <Ionicons name="open-outline" size={14} color="#c084fc" />
            <Text style={styles.mapOpenExternalText}>Megnyitás Google Maps-ben</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.mapDetailClose} onPress={() => setSelectedId(null)}>
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
          style={[styles.mapViewToggleBtn, mapView === "map" && styles.mapViewToggleBtnActive]}
          onPress={() => setMapView("map")}
        >
          <Ionicons name="map-outline" size={14} color={mapView === "map" ? "#a855f7" : "rgba(168,85,247,0.45)"} />
          <Text style={[styles.mapViewToggleText, mapView === "map" && styles.mapViewToggleTextActive]}>Térkép</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mapViewToggleBtn, mapView === "list" && styles.mapViewToggleBtnActive]}
          onPress={() => setMapView("list")}
        >
          <Ionicons name="list-outline" size={14} color={mapView === "list" ? "#a855f7" : "rgba(168,85,247,0.45)"} />
          <Text style={[styles.mapViewToggleText, mapView === "list" && styles.mapViewToggleTextActive]}>Lista</Text>
        </TouchableOpacity>
      </View>

      {/* ILLUSZTRÁLT TÉRKÉP NÉZET */}
      {mapView === "map" && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.festivalMapImageCard}>
            <Image
              source={require("./assets/enhanced_ready.png")}
              style={styles.festivalMapImage}
              resizeMode="contain"
            />
            {selected && selectedMarker && (
              <View
                pointerEvents="none"
                style={[
                  styles.mapImageMarker,
                  {
                    left: `${selectedMarker.x}%`,
                    top: `${selectedMarker.y}%`,
                    borderColor: MAP_CATEGORY_META[selected.category].color,
                  },
                ]}
              >
                <View style={[styles.mapImageMarkerPulse, { borderColor: MAP_CATEGORY_META[selected.category].color }]} />
                <View style={[styles.mapImageMarkerPin, { backgroundColor: MAP_CATEGORY_META[selected.category].color }]}> 
                  <Ionicons name={MAP_CATEGORY_META[selected.category].icon as keyof typeof Ionicons.glyphMap} size={14} color="#fff" />
                </View>
                <View style={styles.mapImageMarkerLabel}>
                  <Text numberOfLines={1} style={styles.mapImageMarkerLabelText}>{selected.name}</Text>
                </View>
              </View>
            )}
          </View>

          {selected && (
            <View style={styles.mapSelectedNotice}>
              <Ionicons name="locate" size={15} color={MAP_CATEGORY_META[selected.category].color} />
              <Text style={styles.mapSelectedNoticeText}>
                Kijelölve a térképen: <Text style={styles.mapSelectedNoticeName}>{selected.name}</Text>
              </Text>
            </View>
          )}

          <Text style={styles.mapImageHint}>
            Válassz egy helyszínt az alábbi listából, és a részletek mellett a térképen is megmutatjuk, hol találod.
          </Text>

          {/* Jelmagyarázat */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mapLegend}>
            {(Object.keys(MAP_CATEGORY_META) as MapCategory[]).map((cat) => (
              <TouchableOpacity key={cat} style={styles.mapLegendItem}
                onPress={() => setFilter(filter === cat ? "all" : cat)}>
                <View style={[styles.mapLegendDot, { backgroundColor: MAP_CATEGORY_META[cat].color }]} />
                <Text style={[styles.mapLegendText, filter === cat && { color: MAP_CATEGORY_META[cat].color }]}>
                  {MAP_CATEGORY_META[cat].label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Kompakt lista a térkép alatt */}
          <View style={{ marginTop: 4 }}>
            {map.points
              .filter(p => filter === "all" || p.category === filter)
              .map((item) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={[styles.mapPointItem, selectedId === item.id && styles.mapPointItemSelected]}
                  onPress={() => handleSelectMapPoint(item.id)}
                >
                  <View style={[styles.mapPointIconWrap, { backgroundColor: `${MAP_CATEGORY_META[item.category].color}22` }]}>
                    <Ionicons name={MAP_CATEGORY_META[item.category].icon as keyof typeof Ionicons.glyphMap}
                      size={18} color={MAP_CATEGORY_META[item.category].color} />
                  </View>
                  <View style={styles.mapPointItemText}>
                    <Text style={styles.mapPointItemName}>{item.name}</Text>
                    <Text style={styles.mapPointItemCategory}>{MAP_CATEGORY_META[item.category].label}</Text>
                  </View>
                  <Ionicons name={selectedId === item.id ? "chevron-up" : "chevron-down"}
                    size={16} color="rgba(168,85,247,0.4)" />
                </TouchableOpacity>
                {selectedId === item.id && renderDetailCard(item)}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      )}

      {/* LISTA NÉZET */}
      {mapView === "list" && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Kategória szűrő */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mapFilters}>
            {MAP_FILTERS.map((item) => {
              const active = filter === item.key;
              return (
                <TouchableOpacity key={item.key}
                  style={[styles.mapFilterChip, active && styles.mapFilterChipActive]}
                  onPress={() => { setFilter(item.key); setSelectedId(null); }}>
                  {item.key !== "all" && (
                    <Ionicons name={MAP_CATEGORY_META[item.key as MapCategory]?.icon as keyof typeof Ionicons.glyphMap}
                      size={11} color={active ? MAP_CATEGORY_META[item.key as MapCategory]?.color : "rgba(168,85,247,0.45)"} />
                  )}
                  <Text style={[styles.mapFilterChipText, active && styles.mapFilterChipTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {map.points
            .filter(p => filter === "all" || p.category === filter)
            .map((item) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={[styles.mapPointItem, selectedId === item.id && styles.mapPointItemSelected]}
                onPress={() => handleSelectMapPoint(item.id)}>
                <View style={[styles.mapPointIconWrap, { backgroundColor: `${MAP_CATEGORY_META[item.category].color}22` }]}>
                  <Ionicons name={MAP_CATEGORY_META[item.category].icon as keyof typeof Ionicons.glyphMap}
                    size={18} color={MAP_CATEGORY_META[item.category].color} />
                </View>
                <View style={styles.mapPointItemText}>
                  <Text style={styles.mapPointItemName}>{item.name}</Text>
                  <Text style={styles.mapPointItemCategory}>{MAP_CATEGORY_META[item.category].label}</Text>
                </View>
                <Ionicons name={selectedId === item.id ? "chevron-up" : "chevron-down"}
                  size={16} color="rgba(168,85,247,0.4)" />
              </TouchableOpacity>
              {selectedId === item.id && renderDetailCard(item)}
            </React.Fragment>
          ))}
        </ScrollView>
      )}

    </View>
  );
}

// ─── Home képernyő ────────────────────────────────────────────────────────────
function HomeScreen({ onGoToTickets, onGoToFavorites, favoritePerformers }: {
	onGoToTickets: () => void;
	onGoToFavorites: () => void;
	favoritePerformers: Performer[];
}) {
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
			{stars.map((s) => (
				<Star key={s.id} style={{ top: s.top, left: s.left, width: s.size, height: s.size }} />
			))}
			<ScrollView
				contentContainerStyle={styles.homeScroll}
				showsVerticalScrollIndicator={false}
			>
				<EclipseAnimation />
				<View style={styles.titleZone}>
					<Text style={styles.festName}>EclipseFest</Text>
					<Text style={styles.tagline}>WHEN DARKNESS FALLS, MUSIC RISES</Text>
				</View>

				<View style={styles.homeHeroCard}>
					<Image source={HOME_HERO_IMAGE} style={styles.homeHeroImage} resizeMode="cover" />
					<View style={styles.homeHeroImageShade} />
					<View style={styles.homeHeroOverlay}>
						<Text style={styles.homeHeroEyebrow}>LIVE MUSIC · NIGHT EXPERIENCE</Text>
						<Text style={styles.homeHeroTitle}>Három este, négy színpad, prémium fesztiválhangulat.</Text>
					</View>
				</View>

				{/* Következő kedvenc chip */}
				{nextFav && minsUntil !== null && (
					<TouchableOpacity style={styles.nextFavChip} onPress={onGoToFavorites}>
						<Ionicons name="heart" size={14} color="#a855f7" />
						<Text style={styles.nextFavText}>
							Következő kedvenced: <Text style={styles.nextFavName}>{nextFav.name}</Text>
						</Text>
						<Text style={styles.nextFavTime}>
							{minsUntil < 60 ? `${minsUntil} perc múlva` : `${nextFav.startTime}`}
						</Text>
					</TouchableOpacity>
				)}

				<View style={styles.dateStrip}>
					<View style={styles.dateItem}>
						<Text style={styles.dateNum}>18</Text>
						<Text style={styles.dateSub}>JUL</Text>
					</View>
					<View style={styles.dateSep} />
					<View style={styles.dateItem}>
						<Text style={styles.dateNum}>19</Text>
						<Text style={styles.dateSub}>JUL</Text>
					</View>
					<View style={styles.dateSep} />
					<View style={styles.dateItem}>
						<Text style={styles.dateNum}>20</Text>
						<Text style={styles.dateSub}>JUL</Text>
					</View>
					<View style={{ flex: 1 }} />
					<View style={styles.dateRight}>
						<Text style={styles.dateYear}>2026</Text>
						<Text style={styles.dateSub}>3 NIGHTS</Text>
					</View>
				</View>

				<TouchableOpacity style={styles.ticketCta} onPress={onGoToTickets}>
					<Ionicons name="ticket" size={18} color="#f0e8ff" />
					<Text style={styles.ticketCtaText}>Jegyvásárlás</Text>
					<Ionicons name="chevron-forward" size={16} color="rgba(168,85,247,0.6)" />
				</TouchableOpacity>

				<View style={styles.infoRow}>
					{[
						{ label: "LOCATION", value: "Budapest" },
						{ label: "STAGES", value: "4 stages" },
						{ label: "ARTISTS", value: "60+" },
					].map((chip) => (
						<View key={chip.label} style={styles.infoChip}>
							<Text style={styles.chipLabel}>{chip.label}</Text>
							<Text style={styles.chipValue}>{chip.value}</Text>
						</View>
					))}
				</View>

				<View style={styles.homeSectionHeader}>
					<Text style={styles.homeSectionTitle}>Kiemelt fellépők</Text>
					<Text style={styles.homeSectionLink}>Festival highlights</Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
					{featuredLineup.map((artist, index) => {
						const accentColors = ["#c084fc", "#ec4899", "#38bdf8", "#f59e0b", "#8b5cf6"];
						const accent = accentColors[index % accentColors.length];
						return (
							<View key={artist.id} style={styles.featuredCard}>
								<Image source={getPerformerImage(artist.id)} style={styles.featuredCardImage} resizeMode="cover" />
								<View style={styles.featuredCardImageShade} />
								<View style={styles.featuredCardOverlay}>
									<View style={[styles.featuredStagePill, { borderColor: `${accent}99`, backgroundColor: `${accent}22` }]}>
										<Text style={[styles.featuredStagePillText, { color: accent }]}>{artist.stage}</Text>
									</View>
									<Text style={styles.featuredCardName}>{artist.name}</Text>
									<Text style={styles.featuredCardMeta}>{artist.startTime}–{artist.endTime} · {artist.day}. nap</Text>
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

const SCHEDULE_VIEWS: { key: ScheduleViewMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
	{ key: "list", label: "Lista", icon: "list" },
	{ key: "timeline", label: "Idővonal", icon: "time-outline" },
	{ key: "stage", label: "Színpad", icon: "layers-outline" },
	{ key: "grid", label: "Rács", icon: "grid-outline" },
];

// ─── Schedule képernyő ────────────────────────────────────────────────────────
function ScheduleScreen({ performers, favorites, onToggleFavorite, lang }: {
	performers: Performer[];
	favorites: string[];
	onToggleFavorite: (id: string) => void;
	lang: "en" | "hu";
}) {
	const [viewMode, setViewMode] = useState<ScheduleViewMode>("list");
	const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
	const sorted = sortPerformersByTime(performers);

	const stageSections = [...new Set(sorted.map((p) => p.stage))].sort().map((stage) => ({
		title: stage,
		data: sorted.filter((p) => p.stage === stage),
	}));

	const renderFavoriteBtn = (id: string, compact = false) => {
		const isFavorite = favorites.includes(id);
		return (
			<TouchableOpacity onPress={() => onToggleFavorite(id)} style={compact ? styles.gridFavoriteBtn : styles.favoriteBtn}>
				<Ionicons name={isFavorite ? "heart" : "heart-outline"} size={compact ? 18 : 22} color={isFavorite ? "#a855f7" : "#555"} />
			</TouchableOpacity>
		);
	};

	const renderViewSwitcher = () => (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={{ maxHeight: 58 }}
			contentContainerStyle={styles.scheduleViewSwitcher}
		>
			{SCHEDULE_VIEWS.map((view) => {
				const active = viewMode === view.key;
				return (
					<TouchableOpacity key={view.key} style={[styles.scheduleViewChip, active && styles.scheduleViewChipActive]} onPress={() => setViewMode(view.key)}>
						<Ionicons name={view.icon} size={13} color={active ? THEME.accent : "rgba(168,85,247,0.45)"} />
						<Text style={[styles.scheduleViewChipText, active && styles.scheduleViewChipTextActive]}>{view.label}</Text>
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
				<PerformerCard item={item} isFavorite={favorites.includes(item.id)} onToggle={() => onToggleFavorite(item.id)} onPress={() => setSelectedPerformer(item)} />
			)}
		/>
	);

	const renderTimelineView = () => (
		<ScrollView contentContainerStyle={styles.scheduleListContent} showsVerticalScrollIndicator={false}>
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
							<Image source={getPerformerImage(item.id)} style={styles.timelineImage} resizeMode="cover" />
							<View style={styles.timelineCardInfo}>
								<Text style={styles.performerName}>{item.name}</Text>
								<Text style={styles.performerDetails}>{item.stage}</Text>
								<Text style={styles.timelineDescription} numberOfLines={2}>
									{(lang === "en" ? item.description_en : item.description_hu) || item.description_hu || item.description_en || "Leírás nem érhető el."}
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
				<PerformerCard item={item} isFavorite={favorites.includes(item.id)} onToggle={() => onToggleFavorite(item.id)} onPress={() => setSelectedPerformer(item)} />
			)}
		/>
	);

	const renderGridView = () => (
		<ScrollView contentContainerStyle={styles.scheduleGridContent} showsVerticalScrollIndicator={false}>
			<View style={styles.scheduleGrid}>
				{sorted.map((item) => (
					<TouchableOpacity key={item.id} style={styles.gridCard} activeOpacity={0.86} onPress={() => setSelectedPerformer(item)}>
						<View style={styles.gridCardTop}>
							<Text style={styles.gridTime}>{item.startTime} – {item.endTime}</Text>
							{renderFavoriteBtn(item.id, true)}
						</View>
						<Text style={styles.gridName} numberOfLines={2}>{item.name}</Text>
						<Text style={styles.gridStage} numberOfLines={1}>{item.stage}</Text>
					</TouchableOpacity>
				))}
			</View>
		</ScrollView>
	);

	return (
		<View style={styles.scheduleScreen}>
			<View style={styles.scheduleHeader}>
				<Text style={styles.scheduleHeading}>Műsor</Text>
				<Text style={styles.scheduleSubheading}>{sorted.length} előadás · válassz nézetet</Text>
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
function PerformerDetailModal({ performer, lang, isFavorite, onClose, onToggleFavorite }: {
	performer: Performer | null;
	lang: "en" | "hu";
	isFavorite: boolean;
	onClose: () => void;
	onToggleFavorite: () => void;
}) {
	if (!performer) return null;
	const description = (lang === "en" ? performer.description_en : performer.description_hu) || performer.description_hu || performer.description_en || "Leírás nem érhető el ehhez az előadóhoz.";
	return (
		<Modal visible={!!performer} transparent animationType="fade" onRequestClose={onClose}>
			<View style={styles.performerModalBackdrop}>
				<TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={onClose} />
				<View style={styles.performerModalCard}>
					<Image source={getPerformerImage(performer.id)} style={styles.performerModalBackgroundImage} resizeMode="cover" />
					<View style={styles.performerModalBackgroundScrim} />
					<View style={styles.performerModalHero}>
						<Image source={getPerformerImage(performer.id)} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
						<Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
							<Defs>
								<LinearGradient id="artistImageFade" x1="0" y1="0" x2="0" y2="1">
									<Stop offset="0" stopColor="#10091c" stopOpacity="0.08" />
									<Stop offset="0.55" stopColor="#10091c" stopOpacity="0.08" />
									<Stop offset="1" stopColor="#10091c" stopOpacity="0.72" />
								</LinearGradient>
							</Defs>
							<Rect width="100%" height="100%" fill="url(#artistImageFade)" />
						</Svg>
					</View>
					<View style={styles.performerModalContent}>
						<View style={styles.performerModalTopRow}>
							<View style={{ flex: 1 }}>
								<Text style={styles.performerModalEyebrow}>ARTIST DETAIL</Text>
								<Text style={styles.performerModalName}>{performer.name}</Text>
							</View>
							<TouchableOpacity style={styles.performerModalCloseBtn} onPress={onClose}>
								<Ionicons name="close" size={20} color={THEME.text} />
							</TouchableOpacity>
						</View>

						<View style={styles.performerModalMetaRow}>
							<View style={styles.performerModalMetaChip}>
								<Ionicons name="location-outline" size={14} color={THEME.accent} />
								<Text style={styles.performerModalMetaText}>{performer.stage}</Text>
							</View>
							<View style={styles.performerModalMetaChip}>
								<Ionicons name="time-outline" size={14} color={THEME.accent} />
								<Text style={styles.performerModalMetaText}>{performer.startTime} – {performer.endTime}</Text>
							</View>
						</View>

						<Text style={styles.performerModalSectionTitle}>{lang === "en" ? "About the artist" : "Az előadóról"}</Text>
						<Text style={styles.performerModalDescription}>{description}</Text>

						<TouchableOpacity style={styles.performerModalFavBtn} onPress={onToggleFavorite}>
							<Ionicons name={isFavorite ? "heart" : "heart-outline"} size={18} color="#fff" />
							<Text style={styles.performerModalFavText}>{isFavorite ? "Kedvencekből törlés" : "Hozzáadás a kedvencekhez"}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}

// ─── Performer kártya ─────────────────────────────────────────────────────────
function PerformerCard({ item, isFavorite, onToggle, conflictNames, onPress }: {
	item: Performer;
	isFavorite: boolean;
	onToggle: () => void;
	conflictNames?: string[];
	onPress?: () => void;
}) {
	return (
		<TouchableOpacity activeOpacity={0.86} onPress={onPress} style={[styles.card, conflictNames && conflictNames.length > 0 && styles.cardConflict]}>
			<View style={[styles.cardAccent, conflictNames && conflictNames.length > 0 && styles.cardAccentConflict]} />
			<Image source={getPerformerImage(item.id)} style={styles.performerImage} resizeMode="cover" />
			<View style={styles.cardInfo}>
				<Text style={styles.performerName}>{item.name}</Text>
				<Text style={styles.performerDetails}>
					{item.stage}{"  ·  "}{item.startTime} – {item.endTime}
				</Text>
				<Text style={styles.performerCardHint}>Részletek megnyitása</Text>
				{conflictNames && conflictNames.length > 0 && (
					<View style={styles.conflictRow}>
						<Ionicons name="warning-outline" size={12} color="#f59e0b" />
						<Text style={styles.conflictText}>
							Ütközés: {conflictNames.join(", ")}
						</Text>
					</View>
				)}
			</View>
			<TouchableOpacity onPress={onToggle} style={styles.favoriteBtn}>
				<Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? "#a855f7" : "#555"} />
			</TouchableOpacity>
		</TouchableOpacity>
	);
}

// ─── Favorites képernyő ───────────────────────────────────────────────────────
function FavoritesScreen({ performers, favorites, onToggleFavorite, onGoToSchedule, onBack }: {
	performers: Performer[];
	favorites: string[];
	onToggleFavorite: (id: string) => void;
	onGoToSchedule: () => void;
	onBack: () => void;
}) {
	const [dayFilter, setDayFilter] = useState<"all" | 18 | 19 | 20>("all");

	const favoritePerformers = sortPerformersByTime(
		performers.filter((p) => favorites.includes(p.id))
	);

	const filtered = dayFilter === "all"
		? favoritePerformers
		: favoritePerformers.filter((p) => p.day === dayFilter);

	// Ütközések kiszámítása
	const getConflicts = (performer: Performer) =>
		getConflictsForPerformer(performer, favoritePerformers).map((c) => c.name);

	const conflictCount = favoritePerformers.filter(
		(p) => getConflictsForPerformer(p, favoritePerformers).length > 0
	).length;

	return (
		<View style={styles.favScreen}>

			{favoritePerformers.length === 0 ? (
				<View style={styles.favEmptyContainer}>
					<View style={styles.favEmptyIconWrap}>
						<Ionicons name="heart-outline" size={36} color="rgba(168,85,247,0.35)" />
					</View>
					<Text style={styles.favEmptyTitle}>Még nincsenek kedvenceid</Text>
					<Text style={styles.favEmptySubtitle}>
						A műsor nézetben szívecskével jelölheted az előadókat, akiket nem akarsz kihagyni.
					</Text>
					<TouchableOpacity style={styles.favEmptyBtn} onPress={onGoToSchedule}>
						<Ionicons name="calendar-outline" size={16} color="#f0e8ff" />
						<Text style={styles.favEmptyBtnText}>Műsor megtekintése</Text>
					</TouchableOpacity>
				</View>
			) : (
				<>
					<View style={styles.scheduleHeader}>
						<Text style={styles.scheduleHeading}>Saját menetrend</Text>
						<Text style={styles.scheduleSubheading}>
							{favoritePerformers.length} kedvenc előadó
							{conflictCount > 0 && (
								<Text style={styles.conflictBadgeText}>  ⚠ {conflictCount} ütközés</Text>
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
										{d.label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</ScrollView>

					{filtered.length === 0 ? (
						<View style={styles.favEmptyContainer}>
							<Ionicons name="calendar-outline" size={36} color="rgba(168,85,247,0.3)" />
							<Text style={styles.favEmptyTitle}>Ezen a napon nincs kedvenced</Text>
							<Text style={styles.favEmptySubtitle}>Válassz másik napot vagy jelölj be új előadókat.</Text>
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
type GastroCategory = typeof GASTRO_CATEGORIES[number];

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
		description: "A Haus of Gaga hivatalos koktélbárja. Merész ízek bátor lelkeknek.",
		offers: ["Poker Face Paloma – grapefruit-tequila koktél sós peremmel", "Bad Romance Rosé – málnás pezsgőkoktél ördögszarv dísszel"],
		color: "#ec4899",
	},
	{
		id: "g2",
		name: "Swiftie Sips",
		emoji: "🧣",
		category: "Ital",
		artist: "Taylor Swift",
		description: "13 féle ital, minden eráról egy. Friendship bracelets every sip.",
		offers: ["Red Lemonade – epres limonádé arany csillámpárával", "Midnights Mojito – kék pillangóvirágos mintás mojito"],
		color: "#60a5fa",
	},
	{
		id: "g3",
		name: "Dragon's Grill",
		emoji: "🐉",
		category: "Étel",
		artist: "Imagine Dragons",
		description: "Tűzön sült, erős fűszerezésű fogások. Believer vagy? Akkor bírd el!",
		offers: ["Thunder Burger – dupla marhahús smoky BBQ szósszal", "Demons Wings – pokoli csípős csirkeszárny 3 erősségben"],
		color: "#f97316",
	},
	{
		id: "g4",
		name: "Violator Street Food",
		emoji: "⚡",
		category: "Étel",
		artist: "Depeche Mode",
		description: "Sötét, elegáns, kompromisszummentes. Personal Jesus szintű minőség.",
		offers: ["Policy of Truth Wrap – füstölt csirke tahinis wrap fekete tortillában", "Master & Servant Platter – vegán szendvicsválogatás"],
		color: "#a855f7",
	},
	{
		id: "g5",
		name: "Gyuri's Bisztró",
		emoji: "🇭🇺",
		category: "Étel",
		artist: "Gyuris Bence",
		description: "Hazai ízek fesztiválos hangulatban. Olyan mint anyukád főztje, csak hangosabb.",
		offers: ["Eclipse Lángos – tejfölös-sajtos, fesztiválméretű", "Benci's Kürtőskalács – fahéjas, frissen sütve"],
		color: "#22c55e",
	},
	{
		id: "g6",
		name: "Cosmic Scoop",
		emoji: "🌌",
		category: "Desszert",
		artist: "EclipseFest",
		description: "Galaktikus fagylaltok és hideg desszertek. A napfogyatkozás édes oldala.",
		offers: ["Eclipse Sundae – fekete kókuszfagyi arany csillámpárával", "Meteor Waffle – friss gofri áfonyás öntettel"],
		color: "#38bdf8",
	},
	{
		id: "g7",
		name: "Monster Energy Zone",
		emoji: "⚡",
		category: "Ital",
		artist: "EclipseFest",
		description: "Hivatalos energiaital partner. Töltsd fel magad a következő fellépőre!",
		offers: ["Monster Ultra – cukormentes változatok 6 ízben", "Eclipse Mix – Monster + gyümölcslé kombók"],
		color: "#84cc16",
	},
	{
		id: "g8",
		name: "Nightcrawler Noodles",
		emoji: "🍜",
		category: "Étel",
		artist: "EclipseFest",
		description: "Éjszakai falatkák azoknak akik nem akarnak kihagyni semmit.",
		offers: ["Midnight Ramen – miso alaplé pirított fokhagymával", "Eclipse Pad Thai – mogyorós-chilis, vegán opció is"],
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
function GastroScreen({ onBack }: { onBack: () => void }) {
	const [activeCategory, setActiveCategory] = useState<GastroCategory | "Mind">("Mind");

	const filtered = activeCategory === "Mind"
		? GASTRO_STANDS
		: GASTRO_STANDS.filter((s) => s.category === activeCategory);

	const counts: Record<GastroCategory, number> = {
		Mind: GASTRO_STANDS.length,
		Étel: GASTRO_STANDS.filter((s) => s.category === "Étel").length,
		Ital: GASTRO_STANDS.filter((s) => s.category === "Ital").length,
		Desszert: GASTRO_STANDS.filter((s) => s.category === "Desszert").length,
	};

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
							<Text style={styles.scheduleHeading}>Gasztró</Text>
							<Text style={styles.scheduleSubheading}>
								{GASTRO_STANDS.length} stand · letisztult gasztro kínálat
							</Text>
						</View>

						<View style={styles.gastroHeroCard}>
							<EventVisual accent={THEME.accent} />
							<View style={styles.gastroHeroContent}>
								<Text style={styles.gastroHeroEyebrow}>CURATED FESTIVAL DINING</Text>
								<Text style={styles.gastroHeroTitle}>Prémium gasztro élmény a színpadok között</Text>
								<Text style={styles.gastroHeroText}>
									Képes, event-app jellegű kártyák, nagyobb tipográfia és átláthatóbb kategóriák.
								</Text>
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
												<Text style={[styles.gastroCategoryTileTitle, active && styles.gastroCategoryTileTitleActive]}>{meta.label}</Text>
												<Text style={[styles.gastroCategoryTileMeta, active && styles.gastroCategoryTileMetaActive]}>{counts[cat]} stand</Text>
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
						{GASTRO_IMAGE_ASSETS[item.id] ? (
							<View style={styles.gastroImageWrap}>
								<Image source={GASTRO_IMAGE_ASSETS[item.id]} style={styles.gastroCardImage} resizeMode="cover" />
								<View style={[styles.gastroImageTint, { backgroundColor: `${item.color}10` }]} />
							</View>
						) : (
							<EventVisual accent={item.color} compact />
						)}
						<View style={[styles.gastroCardAccent, { backgroundColor: item.color }]} />
						<View style={styles.gastroCardBody}>
							<View style={styles.gastroCardHeader}>
								<View style={[styles.gastroIconBox, { borderColor: `${item.color}55`, backgroundColor: `${item.color}14` }]}> 
									<Ionicons name={GASTRO_CATEGORY_META[item.category].icon} size={22} color={item.color} />
								</View>
								<View style={styles.gastroCardTitles}>
									<Text style={styles.gastroName}>{item.name}</Text>
									<View style={styles.gastroTagRow}>
										<View style={[styles.gastroCatBadge, { backgroundColor: `${item.color}18`, borderColor: `${item.color}40` }]}> 
											<Text style={[styles.gastroCatText, { color: item.color }]}>{item.category}</Text>
										</View>
										<Text style={styles.gastroArtist}>{item.artist}</Text>
									</View>
								</View>
							</View>

							<Text style={styles.gastroDescription}>{item.description}</Text>

							<View style={styles.gastroOffers}>
								<Text style={styles.gastroOffersLabel}>AJÁNLOTT TÉTELEK</Text>
								{item.offers.map((offer, i) => (
									<View key={i} style={styles.gastroOfferRow}>
										<View style={[styles.gastroOfferDot, { backgroundColor: item.color }]} />
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
			<Text style={[styles.sectionTitle, { textAlign: "center", marginTop: 8 }]}>{t.sponsorsTitle}</Text>
			<FlatList
				key={sponsorColumns}
				data={sponsors}
				keyExtractor={(item) => item.id}
				numColumns={sponsorColumns}
				contentContainerStyle={styles.sponsorListContent}
				columnWrapperStyle={sponsorColumns > 1 ? styles.sponsorColumnWrapper : undefined}
				renderItem={({ item }) => (
					<View style={[styles.sponsorCard, sponsorColumns === 1 && styles.sponsorCardSingle]}>
						<SponsorLogo sponsorId={item.id} name={item.name} logoUrl={item.logoUrl} />
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
}: {
	onGoToFavorites: () => void;
	onGoToGastro: () => void;
	onGoToSponsors: () => void;
	favoritesCount: number;
}) {
	const items: { key: string; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void; right?: string }[] = [
		{
			key: "favorites",
			title: "Kedvencek",
			subtitle: "Saját menetrend és ütközések",
			icon: "heart",
			onPress: onGoToFavorites,
			right: favoritesCount > 0 ? String(favoritesCount) : undefined,
		},
		{
			key: "gastro",
			title: "Gasztró",
			subtitle: "Standok, ajánlatok, kategóriák",
			icon: "restaurant",
			onPress: onGoToGastro,
		},
		{
			key: "sponsors",
			title: "Támogatók",
			subtitle: "Partnereink és logók",
			icon: "star",
			onPress: onGoToSponsors,
		},
	];

	return (
		<View style={styles.moreScreen}>
			<View style={styles.scheduleHeader}>
				<Text style={styles.scheduleHeading}>Több</Text>
				<Text style={styles.scheduleSubheading}>Gyors elérés a többi szekcióhoz</Text>
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
	const [lang, setLang] = useState<"en" | "hu">("en");
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

	const performers: Performer[] = (festivalData.performers as any[]).map((p, i) => ({
		...p,
		day: p.day ?? [18, 19, 20][i % 3],
	}));

	const favoritePerformers = performers.filter((p) => favorites.includes(p.id));

	const toggleFavorite = (id: string) => {
		setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
	};

	const handleSelectTicket = (id: string) => { setSelectedTicketId(id); setTicketQuantity(1); setOrderComplete(false); setRefundRequested(false); };
	const handleTogglePerformance = (id: string) => {
		setSelectedPerformanceIds((prev) => prev.includes(id) ? prev.filter((performanceId) => performanceId !== id) : [...prev, id]);
		setOrderComplete(false);
		setRefundRequested(false);
	};
	const handleChangeQuantity = (delta: number) => { setTicketQuantity((prev) => Math.max(1, Math.min(10, prev + delta))); };
	const handlePurchase = () => {
		const selectedPerformancesForCheckout = performers.filter((p) => selectedPerformanceIds.includes(p.id));
		const noTimeConflicts = getPerformanceConflictPairs(selectedPerformancesForCheckout).length === 0;
		if (selectedTicketId && selectedPerformanceIds.length > 0 && noTimeConflicts && isValidEmail(buyerEmail)) setOrderComplete(true);
	};
	const handleResetOrder = () => { setOrderComplete(false); setRefundRequested(false); setSelectedTicketId(null); setSelectedPerformanceIds([]); setTicketQuantity(1); setBuyerEmail(""); };
	const handleRequestRefund = () => { setRefundRequested(true); };

	const navTabs: { key: TabKey | "More"; icon: string; label: string }[] = [
		{ key: "Home", icon: "home", label: t.home },
		{ key: "Schedule", icon: "calendar", label: t.schedule },
		{ key: "Map", icon: "map", label: t.map },
		{ key: "Tickets", icon: "ticket", label: t.tickets },
		{ key: "More", icon: "grid", label: "Több" },
	];

	return (
		<SafeAreaView
			style={[
				styles.container,
				{ paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0 },
			]}
		>
			<StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
			<CosmicBackdrop />

			<View style={styles.header}>
				<TouchableOpacity
					style={[styles.headerBackBtn, activeTab === "Home" && styles.headerBackBtnHidden]}
					onPress={goBack}
					disabled={activeTab === "Home"}
					accessibilityLabel="Vissza az előző oldalra"
				>
					<Ionicons name="chevron-back" size={22} color={THEME.text} />
				</TouchableOpacity>
				<View style={styles.headerBrandWrap}>
					<View style={styles.headerMoonDot} />
					<Text style={styles.headerBadge}>ECLIPSEFEST · 2026</Text>
				</View>
				<TouchableOpacity style={styles.langSwitch} onPress={() => setLang(lang === "en" ? "hu" : "en")}>
					<Text style={styles.langSwitchText}>
						{lang === "en" ? "EN" : "HU"}
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.mainArea}>
				{activeTab === "Home" && (
					<HomeScreen
						onGoToTickets={() => navigateTo("Tickets")}
						onGoToFavorites={() => navigateTo("Favorites")}
						favoritePerformers={favoritePerformers}
					/>
				)}
				{activeTab === "Schedule" && (
					<ScheduleScreen performers={performers} favorites={favorites} onToggleFavorite={toggleFavorite} lang={lang} />
				)}
				{activeTab === "Map" && (
					festivalMap ? <MapScreen map={festivalMap} /> : (
						<View style={styles.mapScreen}>
							<Text style={styles.mapHeading}>Térkép</Text>
							<Text style={styles.mapVenue}>A térkép adatai nem érhetők el.</Text>
						</View>
					)
				)}
				{activeTab === "Favorites" && (
					<FavoritesScreen
						performers={performers}
						favorites={favorites}
						onToggleFavorite={toggleFavorite}
						onGoToSchedule={() => navigateTo("Schedule")}
					onBack={goBack}
					/>
				)}
				{activeTab === "Gastro" && <GastroScreen onBack={goBack} />}
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
					/>
				)}
				{activeTab === "Sponsors" && <SponsorsScreen t={t} onBack={goBack} />}
				{activeTab === "More" && (
					<MoreScreen
						onGoToFavorites={() => navigateTo("Favorites")}
						onGoToGastro={() => navigateTo("Gastro")}
						onGoToSponsors={() => navigateTo("Sponsors")}
						favoritesCount={favorites.length}
					/>
				)}
			</View>

			<View style={styles.navBar}>
				{navTabs.map((tab) => {
					const active = activeTab === tab.key;
					const showBadge = tab.key === "Favorites" && favorites.length > 0;
					return (
						<TouchableOpacity key={tab.key} style={styles.navItem} onPress={() => navigateTo(tab.key)}>
							<View style={[styles.navIconWrap, active && styles.navIconActive]}>
								<Ionicons
									name={active ? (tab.icon as keyof typeof Ionicons.glyphMap) : (`${tab.icon}-outline` as keyof typeof Ionicons.glyphMap)}
									size={20}
									color={active ? THEME.accent : "rgba(255,255,255,0.36)"}
								/>
								{showBadge && <View style={styles.navBadge}><Text style={styles.navBadgeText}>{favorites.length}</Text></View>}
							</View>
							<Text style={[styles.navText, active && styles.navTextActive]}>{tab.label}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</SafeAreaView>
	);
}

// ─── Stílusok ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: THEME.bg },
	cosmicBackdrop: { ...StyleSheet.absoluteFillObject },
	header: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: "rgba(10,3,26,0.84)", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "rgba(216,180,254,0.18)", shadowColor: THEME.accent, shadowOpacity: 0.30, shadowRadius: 24, elevation: 14 },
	headerBackBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(216,180,254,0.30)", shadowColor: THEME.accent, shadowOpacity: 0.25, shadowRadius: 14, elevation: 6 },
	headerBackBtnHidden: { opacity: 0 },
	headerBrandWrap: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
	headerMoonDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: THEME.accent, shadowColor: THEME.accent, shadowOpacity: 0.85, shadowRadius: 12, elevation: 8 },
	headerBadge: { textAlign: "center", fontSize: 12, letterSpacing: 1.0, color: THEME.text, fontWeight: "900", fontFamily: FONTS.ui, backgroundColor: "transparent", includeFontPadding: false },
	langSwitch: { minWidth: 44, height: 44, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.075)", borderRadius: 22, borderWidth: 1, borderColor: "rgba(216,180,254,0.30)", shadowColor: THEME.accent, shadowOpacity: 0.25, shadowRadius: 14, elevation: 6 },
	langSwitchText: { color: THEME.accent, fontWeight: "900", letterSpacing: 0.9, fontSize: 13 },
	mainArea: { flex: 1 },
	screenGlow: { position: "absolute", borderRadius: 999, opacity: 0.22 },
	screenGlowTop: { width: 220, height: 220, top: -70, right: -50, backgroundColor: "rgba(124,58,237,0.22)" },
	screenGlowBottom: { width: 260, height: 260, bottom: 70, left: -90, backgroundColor: "rgba(236,72,153,0.10)" },

	// Home
	homeScreen: { flex: 1, backgroundColor: "transparent", position: "relative", overflow: "hidden" },
	homeScroll: { alignItems: "center", paddingBottom: 32, paddingTop: 8 },
	homeHeroCard: { width: "100%", maxWidth: 430, height: 225, marginHorizontal: 20, marginTop: 18, borderRadius: 34, overflow: "hidden", borderWidth: 1, borderColor: "rgba(216,180,254,0.26)", backgroundColor: "rgba(255,255,255,0.07)", shadowColor: THEME.accent, shadowOpacity: 0.38, shadowRadius: 28, elevation: 12 },
	homeHeroImage: { width: "100%", height: "100%" },
	homeHeroImageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(92,36,150,0.10)" },
	homeHeroOverlay: { position: "absolute", left: 16, right: 16, bottom: 16, padding: 14, borderRadius: 22, backgroundColor: "rgba(92,36,150,0.18)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
	homeHeroEyebrow: { color: "rgba(245,208,254,0.92)", fontSize: 11, letterSpacing: 2.4, fontWeight: "900", fontFamily: FONTS.ui, marginBottom: 8 },
	homeHeroTitle: { color: "#fff", fontSize: 26, lineHeight: 31, fontWeight: "700", fontFamily: FONTS.heading },
	eventVisualFrame: { width: "100%", height: 210, overflow: "hidden", backgroundColor: "#111827" },
	eventVisualFrameCompact: { height: 138, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
	star: { position: "absolute", backgroundColor: "rgba(255,255,255,0.55)", borderRadius: 99 },

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
	eclipseContainer: { width: 240, height: 240, alignItems: "center", justifyContent: "center", marginTop: 8, position: "relative" },
	haloRing: { position: "absolute", borderRadius: 999 },
	haloOuter: { width: 176, height: 176, shadowColor: THEME.accent2, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.18, shadowRadius: 18, elevation: 0, borderWidth: 0, backgroundColor: "transparent" },
	haloMid: { width: 138, height: 138, shadowColor: THEME.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.14, shadowRadius: 14, elevation: 0, backgroundColor: "transparent" },
	haloInner: { width: 104, height: 104, shadowColor: "#fff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 0, backgroundColor: "transparent" },
	coronaWrapper: { position: "absolute", width: 196, height: 196, alignItems: "center", justifyContent: "center" },
	spikeContainer: { position: "absolute", alignItems: "center", justifyContent: "flex-start", width: 196, height: 196, top: 0, left: 0 },
	spike: { backgroundColor: "rgba(167,139,250,0.42)", borderRadius: 1, position: "absolute", top: 0 },
	planetDisk: { width: 92, height: 92, borderRadius: 46, overflow: "hidden", borderWidth: 1, borderColor: THEME.border },
	logoImage: { width: "100%", height: "100%" },

	titleZone: { alignItems: "center", marginTop: -4, paddingHorizontal: 24 },
	festName: { fontSize: 46, fontWeight: "700", color: THEME.text, fontFamily: FONTS.heading, letterSpacing: -0.5 },
	tagline: { fontSize: 11, letterSpacing: 0.0, color: "rgba(216,180,254,0.78)", marginTop: 6, textAlign: "center", fontFamily: FONTS.ui, fontWeight: "900" },

	dateStrip: { flexDirection: "row", alignItems: "center", marginHorizontal: 24, marginTop: 16, paddingVertical: 16, paddingHorizontal: 18, borderWidth: 1, borderColor: "rgba(216,180,254,0.24)", borderRadius: 28, backgroundColor: "rgba(255,255,255,0.08)", shadowColor: THEME.accent, shadowOpacity: 0.18, shadowRadius: 18, elevation: 6 },
	dateItem: { alignItems: "center", paddingHorizontal: 12 },
	dateNum: { fontSize: 30, fontWeight: "700", color: THEME.text, lineHeight: 32, fontFamily: FONTS.heading, letterSpacing: -0.5 },
	dateSub: { fontSize: 9, letterSpacing: 1.2, color: THEME.textSubtle, marginTop: 3 },
	dateSep: { width: 1, height: 36, backgroundColor: THEME.border },
	dateRight: { alignItems: "flex-end", paddingLeft: 12 },
	dateYear: { fontSize: 14, fontWeight: "600", color: THEME.textMuted },

	infoRow: { flexDirection: "row", gap: 8, marginHorizontal: 24, marginTop: 12 },
	infoChip: { flex: 1, padding: 14, borderWidth: 1, borderColor: "rgba(216,180,254,0.22)", borderRadius: 22, backgroundColor: "rgba(255,255,255,0.06)", alignItems: "center", shadowColor: THEME.accent, shadowOpacity: 0.10, shadowRadius: 10, elevation: 3 },
	chipLabel: { fontSize: 9, letterSpacing: 0.8, color: THEME.textSubtle, marginBottom: 5, fontWeight: "600" },
	chipValue: { fontSize: 13, fontWeight: "600", color: THEME.textMuted },
	homeSectionHeader: { width: "100%", maxWidth: 430, marginTop: 24, marginBottom: 12, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
	homeSectionTitle: { color: THEME.text, fontSize: 24, fontFamily: FONTS.heading, fontWeight: "700" },
	homeSectionLink: { color: THEME.textSubtle, fontSize: 12, letterSpacing: 1.2, fontFamily: FONTS.ui },
	featuredScroll: { paddingLeft: 24, paddingRight: 12, paddingBottom: 6, gap: 14 },
	featuredCard: { width: 220, height: 155, borderRadius: 28, overflow: "hidden", borderWidth: 1, borderColor: "rgba(216,180,254,0.22)", backgroundColor: "rgba(255,255,255,0.06)", shadowColor: THEME.accent, shadowOpacity: 0.18, shadowRadius: 18, elevation: 6 },
	featuredCardImage: { width: "100%", height: "100%" },
	featuredCardImageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(92,36,150,0.08)" },
	featuredCardOverlay: { position: "absolute", left: 12, right: 12, bottom: 12, padding: 12, borderRadius: 18, backgroundColor: "rgba(92,36,150,0.20)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
	featuredStagePill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, marginBottom: 8 },
	featuredStagePillText: { fontSize: 10.5, fontFamily: FONTS.ui, fontWeight: "900", letterSpacing: 0.6 },
	featuredCardName: { color: THEME.text, fontSize: 20, lineHeight: 22, fontFamily: FONTS.heading, fontWeight: "700" },
	featuredCardMeta: { color: THEME.textMuted, fontSize: 12, marginTop: 6, fontFamily: FONTS.body },

	ticketCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginHorizontal: 32, marginTop: 16, paddingVertical: 17, borderRadius: 999, backgroundColor: "rgba(168,85,247,0.30)", borderWidth: 1, borderColor: "rgba(245,208,254,0.52)", alignSelf: "center", width: "100%", maxWidth: 420, shadowColor: THEME.accent, shadowOpacity: 0.42, shadowRadius: 20, elevation: 10 },
	ticketCtaText: { fontSize: 15, fontWeight: "900", color: THEME.text, letterSpacing: 0.7, fontFamily: FONTS.ui },

	// Jegyvásárlás
	ticketsScreen: { flex: 1 },
	ticketsScroll: { padding: 16, paddingBottom: 120 },
	ticketsHeading: { fontSize: 36, fontWeight: "700", color: THEME.text, marginBottom: 8, fontFamily: FONTS.heading, letterSpacing: -0.5 },
	ticketsSubheading: { fontSize: 14, color: THEME.textMuted, marginBottom: 18, lineHeight: 22, fontFamily: FONTS.body },
	ticketCard: { flexDirection: "row", backgroundColor: "rgba(72,34,112,0.58)", borderWidth: 1, borderColor: "rgba(216,180,254,0.20)", borderRadius: 30, marginBottom: 16, overflow: "hidden", position: "relative", shadowColor: THEME.accent, shadowOpacity: 0.16, shadowRadius: 18, elevation: 6 },
	ticketCardSelected: { borderColor: "rgba(245,208,254,0.58)", backgroundColor: "rgba(168,85,247,0.18)", shadowOpacity: 0.26 },
	ticketAccentSelected: { backgroundColor: THEME.accent, opacity: 1 },
	popularBadge: { position: "absolute", top: 10, right: 44, zIndex: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: THEME.surface2, borderWidth: 1, borderColor: THEME.borderStrong },
	popularBadgeText: { fontSize: 10.5, letterSpacing: 1.2, color: THEME.accent, fontWeight: "800", fontFamily: FONTS.ui },
	ticketCardBody: { flex: 1, paddingVertical: 14, paddingHorizontal: 14, backgroundColor: "transparent" },
	ticketCardHeader: { marginBottom: 6 },
	ticketTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
	ticketName: { color: THEME.text, fontSize: 22, fontWeight: "700", fontFamily: FONTS.heading, letterSpacing: -0.5 },
	ticketBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, backgroundColor: THEME.surface2, borderWidth: 1, borderColor: THEME.border },
	ticketBadgeText: { fontSize: 11, letterSpacing: 0.6, color: THEME.textSubtle, fontWeight: "700", fontFamily: FONTS.ui },
	ticketPrice: { fontSize: 22, fontWeight: "900", color: THEME.accent, fontFamily: FONTS.ui },
	ticketDescription: { fontSize: 13, color: THEME.textMuted, lineHeight: 19, marginBottom: 10, fontFamily: FONTS.body },
	ticketFeatures: { gap: 5 },
	ticketFeatureRow: { flexDirection: "row", alignItems: "center", gap: 6 },
	ticketFeatureText: { fontSize: 12, color: THEME.textSubtle, fontWeight: "600", fontFamily: FONTS.ui },
	ticketSelectIndicator: { justifyContent: "center", paddingRight: 14 },
	checkoutBar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, borderTopWidth: 1, borderTopColor: "rgba(216,180,254,0.18)", backgroundColor: "rgba(17,6,30,0.96)", shadowColor: THEME.accent, shadowOpacity: 0.18, shadowRadius: 18, elevation: 10 },
	quantityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
	quantityLabel: { fontSize: 13, color: THEME.textMuted, fontWeight: "700" },
	quantityControls: { flexDirection: "row", alignItems: "center", gap: 12 },
	quantityBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border },
	quantityBtnDisabled: { opacity: 0.35 },
	quantityValue: { fontSize: 16, fontWeight: "900", color: THEME.text, minWidth: 24, textAlign: "center" },
	emailField: { marginBottom: 12 },
	emailLabel: { fontSize: 13, color: THEME.textMuted, marginBottom: 8, fontWeight: "700" },
	emailInput: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: THEME.border, backgroundColor: THEME.surface, color: THEME.text, fontSize: 15 },
	emailInputError: { borderColor: "rgba(239,68,68,0.7)" },
	emailErrorText: { fontSize: 11, color: "#f87171", marginTop: 6 },
	totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
	totalLabel: { fontSize: 12, letterSpacing: 0.9, color: THEME.textSubtle, fontWeight: "800" },
	totalValue: { fontSize: 20, fontWeight: "900", color: THEME.text },
	checkoutHint: { fontSize: 12, color: THEME.textSubtle, textAlign: "center", marginBottom: 12 },
	checkoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16, borderRadius: 999, backgroundColor: "rgba(168,85,247,0.32)", borderWidth: 1, borderColor: "rgba(245,208,254,0.52)", shadowColor: THEME.accent, shadowOpacity: 0.35, shadowRadius: 18, elevation: 8 },
	checkoutBtnDisabled: { opacity: 0.4 },
	checkoutBtnText: { fontSize: 18, fontWeight: "900", color: THEME.text, letterSpacing: 0.6, fontFamily: FONTS.ui },
	orderSuccess: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
	orderSuccessIcon: { marginBottom: 16 },
	orderSuccessTitle: { fontSize: 22, fontWeight: "900", color: THEME.text, marginBottom: 8 },
	orderSuccessSub: { fontSize: 13, color: THEME.textSubtle, textAlign: "center", lineHeight: 20, marginBottom: 8 },
	orderSuccessEmail: { fontSize: 15, fontWeight: "900", color: THEME.text, textAlign: "center", marginBottom: 24 },
	orderSummaryCard: { width: "100%", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: THEME.border, backgroundColor: THEME.surface, marginBottom: 24, alignItems: "center" },
	orderSummaryLabel: { fontSize: 9, letterSpacing: 1.2, color: THEME.textSubtle, marginBottom: 8, fontWeight: "800" },
	orderSummaryName: { fontSize: 18, fontWeight: "900", color: THEME.text, marginBottom: 4 },
	orderSummaryDetail: { fontSize: 14, color: THEME.accent, fontWeight: "800" },
	orderSuccessScroll: { padding: 20, paddingBottom: 120, alignItems: "center" },
	orderDivider: { width: "100%", height: 1, backgroundColor: THEME.border, marginVertical: 14 },
	orderPerformerName: { fontSize: 18, fontWeight: "900", color: THEME.text, textAlign: "center", marginBottom: 5 },
	orderPerformanceRow: { width: "100%", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)", alignItems: "center" },
	orderPerformerMeta: { fontSize: 12, color: THEME.textSubtle, textAlign: "center", fontWeight: "700" },
	ticketSectionHeader: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 4, marginBottom: 10 },
	ticketSectionTitle: { fontSize: 18, color: THEME.text, fontWeight: "700", fontFamily: FONTS.heading, letterSpacing: -0.5 },
	ticketSectionHint: { fontSize: 11, color: THEME.textSubtle, fontWeight: "700" },
	performanceList: { gap: 10, marginBottom: 18 },
	performanceAccordionList: { gap: 10, marginBottom: 18 },
	performanceDayGroup: { borderRadius: 24, borderWidth: 1, borderColor: "rgba(216,180,254,0.16)", backgroundColor: "rgba(255,255,255,0.055)", overflow: "hidden", shadowColor: THEME.accent, shadowOpacity: 0.10, shadowRadius: 14, elevation: 4 },
	performanceDayGroupWarning: { borderColor: "rgba(251,146,60,0.48)", backgroundColor: "rgba(249,115,22,0.07)" },
	performanceDayHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 14, borderRadius: 24, borderWidth: 1, borderColor: "rgba(216,180,254,0.16)", backgroundColor: "rgba(255,255,255,0.08)" },
	performanceDayHeaderLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 10 },
	performanceDayHeaderRight: { flexDirection: "row", alignItems: "center", gap: 8 },
	performanceDayIcon: { width: 44, height: 44, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(216,180,254,0.22)", backgroundColor: "rgba(168,85,247,0.10)" },
	performanceDayIconActive: { borderColor: THEME.borderStrong, backgroundColor: "rgba(168,85,247,0.22)" },
	performanceDayTitle: { fontSize: 19, color: THEME.text, fontWeight: "700", fontFamily: FONTS.heading, letterSpacing: -0.5 },
	performanceDaySubtitle: { fontSize: 12, color: THEME.textSubtle, fontWeight: "700", marginTop: 3 },
	performanceDayWarningBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 999, backgroundColor: "rgba(249,115,22,0.18)", borderWidth: 1, borderColor: "rgba(251,146,60,0.35)" },
	performanceDayWarningText: { fontSize: 10, color: "#fed7aa", fontWeight: "900" },
	performanceDayBody: { paddingHorizontal: 10, paddingBottom: 10, gap: 10 },
	performanceTicketCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 22, borderWidth: 1, borderColor: "rgba(216,180,254,0.14)", backgroundColor: "rgba(72,34,112,0.50)" },
	performanceTicketCardSelected: { borderColor: "rgba(245,208,254,0.52)", backgroundColor: "rgba(148,92,234,0.24)" },
	performanceTicketCardConflicted: { borderColor: "rgba(251,146,60,0.7)", backgroundColor: "rgba(249,115,22,0.10)" },
	performanceTicketVisual: { width: 78, height: 64, borderRadius: 24, overflow: "hidden", backgroundColor: "rgba(168,85,247,0.18)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
	performanceTicketInfo: { flex: 1 },
	performanceTicketName: { fontSize: 17, color: THEME.text, fontWeight: "700", marginBottom: 4, fontFamily: FONTS.heading, letterSpacing: -0.5 },
	performanceTicketMeta: { fontSize: 11, color: THEME.textSubtle, fontWeight: "700", marginBottom: 6 },
	performanceTicketTimeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
	performanceTicketTime: { fontSize: 11, color: THEME.textMuted, fontWeight: "700" },
	performanceTicketTimeConflicted: { color: "#fed7aa" },
	selectedPerformancePanel: { padding: 16, borderRadius: 24, borderWidth: 1, borderColor: THEME.borderStrong, backgroundColor: "rgba(168,85,247,0.10)", marginBottom: 110 },
	selectedPerformanceLabel: { fontSize: 10, color: THEME.accent, fontWeight: "900", letterSpacing: 1.3, marginBottom: 8 },
	selectedPerformanceName: { fontSize: 20, color: THEME.text, fontWeight: "900", marginBottom: 5 },
	selectedPerformanceMeta: { fontSize: 12, color: THEME.textMuted, fontWeight: "700", marginBottom: 12 },
	selectedPerformanceLine: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)" },
	performanceConflictPanel: { padding: 14, borderRadius: 24, borderWidth: 1, borderColor: "rgba(251,146,60,0.45)", backgroundColor: "rgba(249,115,22,0.10)", marginBottom: 14 },
	performanceConflictHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
	performanceConflictTitle: { fontSize: 14, color: "#fed7aa", fontWeight: "900" },
	performanceConflictText: { fontSize: 12, color: "rgba(255,237,213,0.88)", lineHeight: 18, marginBottom: 8 },
	performanceConflictItem: { fontSize: 12, color: "#fed7aa", lineHeight: 18, fontWeight: "700" },
	checkoutWarningText: { color: "#fed7aa", fontSize: 12, fontWeight: "800", textAlign: "center", marginBottom: 8 },
	miniCountdownRow: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "rgba(168,85,247,0.08)", borderWidth: 1, borderColor: THEME.border, marginBottom: 10 },
	miniCountdownText: { fontSize: 13, color: THEME.text, fontWeight: "900", textAlign: "center" },
	selectedRefundInfo: { fontSize: 11, color: THEME.textSubtle, fontWeight: "700", textAlign: "center" },
	countdownCard: { width: "100%", padding: 18, borderRadius: 24, borderWidth: 1, borderColor: THEME.borderStrong, backgroundColor: "rgba(168,85,247,0.12)", marginBottom: 14 },
	countdownLabel: { fontSize: 10, color: THEME.accent, fontWeight: "900", letterSpacing: 1.4, textAlign: "center", marginBottom: 8 },
	countdownTargetName: { fontSize: 16, color: THEME.text, fontWeight: "900", textAlign: "center", marginBottom: 12 },
	countdownGrid: { flexDirection: "row", gap: 10 },
	countdownBox: { flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(168,85,247,0.10)", alignItems: "center", borderWidth: 1, borderColor: THEME.border },
	countdownNumber: { fontSize: 24, color: THEME.text, fontWeight: "900" },
	countdownUnit: { fontSize: 10, color: THEME.textSubtle, fontWeight: "800", marginTop: 3 },
	refundPolicyCard: { width: "100%", padding: 16, borderRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.045)", marginBottom: 16 },
	refundPolicyHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
	refundPolicyTitle: { fontSize: 15, color: THEME.text, fontWeight: "900" },
	refundPolicyText: { fontSize: 12, color: THEME.textMuted, lineHeight: 18, marginBottom: 10 },
	refundDeadlineText: { fontSize: 12, color: THEME.accent, fontWeight: "900", marginBottom: 12 },
	refundBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(168,85,247,0.16)", borderWidth: 1, borderColor: THEME.borderStrong },
	refundBtnDisabled: { opacity: 0.45 },
	refundBtnText: { color: THEME.text, fontSize: 13, fontWeight: "900" },
	refundRequestedBadge: { paddingVertical: 12, borderRadius: 14, backgroundColor: "rgba(34,197,94,0.12)", borderWidth: 1, borderColor: "rgba(34,197,94,0.35)", alignItems: "center" },
	refundRequestedText: { color: "#86efac", fontSize: 13, fontWeight: "900" },
	discountSection: { marginBottom: 18 },
	discountInfoPanel: { padding: 15, borderRadius: 24, borderWidth: 1, borderColor: "rgba(134,239,172,0.22)", backgroundColor: "rgba(22,163,74,0.08)", marginBottom: 12, gap: 12 },
	discountInfoHeader: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
	discountInfoIconWrap: { width: 38, height: 38, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(134,239,172,0.12)", borderWidth: 1, borderColor: "rgba(134,239,172,0.26)" },
	discountInfoTitle: { fontSize: 15, color: THEME.text, fontWeight: "900", fontFamily: FONTS.ui, marginBottom: 3 },
	discountInfoLead: { fontSize: 12, color: THEME.textMuted, lineHeight: 17, fontWeight: "600", fontFamily: FONTS.body },
	discountInfoRow: { flexDirection: "row", gap: 10, alignItems: "flex-start", paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(134,239,172,0.12)" },
	discountInfoRowTitle: { fontSize: 12.5, color: "#bbf7d0", fontWeight: "900", fontFamily: FONTS.ui, marginBottom: 2 },
	discountInfoRowText: { fontSize: 12, color: THEME.textSubtle, lineHeight: 17, fontWeight: "700", fontFamily: FONTS.body },
	discountGrid: { gap: 10, marginBottom: 4 },
	discountChip: { padding: 16, borderRadius: 22, borderWidth: 1, borderColor: "rgba(216,180,254,0.14)", backgroundColor: "rgba(255,255,255,0.055)" },
	discountChipActive: { borderColor: "rgba(134,239,172,0.48)", backgroundColor: "rgba(22,163,74,0.10)" },
	discountChipDisabled: { opacity: 0.45 },
	discountChipHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 },
	discountChipTitle: { fontSize: 14, color: THEME.text, fontWeight: "900" },
	discountChipTitleActive: { color: "#ffffff" },
	discountChipPercent: { fontSize: 12, color: "#86efac", fontWeight: "900" },
	discountChipDescription: { fontSize: 12, color: THEME.textSubtle, lineHeight: 17, fontWeight: "700" },
	cartCard: { padding: 18, borderRadius: 28, borderWidth: 1, borderColor: "rgba(216,180,254,0.30)", backgroundColor: "rgba(168,85,247,0.12)", marginBottom: 18, shadowColor: THEME.accent, shadowOpacity: 0.18, shadowRadius: 18, elevation: 8 },
	cartHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
	cartEyebrow: { fontSize: 10, letterSpacing: 1.3, color: THEME.accent, fontWeight: "900", marginBottom: 3 },
	cartTitle: { fontSize: 22, color: THEME.text, fontWeight: "700", fontFamily: FONTS.heading, letterSpacing: -0.5 },
	cartCountBadge: { minWidth: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(168,85,247,0.20)", borderWidth: 1, borderColor: THEME.borderStrong },
	cartCountText: { color: THEME.text, fontSize: 13, fontWeight: "900" },
	cartItemRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" },
	cartItemInfo: { flex: 1 },
	cartItemName: { fontSize: 14, color: THEME.text, fontWeight: "900", marginBottom: 4 },
	cartItemMeta: { fontSize: 11, color: THEME.textSubtle, fontWeight: "700", lineHeight: 16 },
	cartItemPrice: { fontSize: 13, color: THEME.text, fontWeight: "900" },
	cartTotals: { paddingTop: 12, gap: 8 },
	cartTotalsCompact: { width: "100%", gap: 8 },
	cartTotalLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
	cartTotalLabel: { flex: 1, fontSize: 12, color: THEME.textSubtle, fontWeight: "700" },
	cartTotalValue: { fontSize: 12, color: THEME.textMuted, fontWeight: "800" },
	cartDiscountLabel: { flex: 1, fontSize: 12, color: "#86efac", fontWeight: "800" },
	cartDiscountValue: { fontSize: 12, color: "#86efac", fontWeight: "900" },
	cartGrandTotalLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 10, marginTop: 4, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.10)" },
	cartGrandTotalLabel: { fontSize: 14, color: THEME.text, fontWeight: "900" },
	cartGrandTotalValue: { fontSize: 24, color: THEME.text, fontWeight: "900", fontFamily: FONTS.ui },
	cartLegalNote: { fontSize: 10, color: THEME.textSubtle, lineHeight: 15, marginTop: 12, fontWeight: "600" },
	checkoutCartMini: { marginBottom: 10, paddingTop: 2 },
	totalValueSmall: { fontSize: 13, fontWeight: "800", color: THEME.textMuted },
	totalDiscountValue: { fontSize: 13, fontWeight: "900", color: "#86efac" },

	// Térkép
	mapScreen: { flex: 1, paddingTop: 8 },
	mapHeader: { paddingHorizontal: 16, marginBottom: 10 },
	mapHeading: { fontSize: 24, fontWeight: "900", color: THEME.text, letterSpacing: 0.2 },
	mapVenue: { fontSize: 12, color: THEME.textSubtle, marginTop: 4 },
	mapFilters: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
	mapFilterChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: THEME.border, backgroundColor: THEME.surface },
	mapFilterChipActive: { backgroundColor: THEME.surface2, borderColor: THEME.borderStrong },
	mapFilterChipText: { fontSize: 11, color: THEME.textSubtle, fontWeight: "700" },
	mapFilterChipTextActive: { color: "#e8d8ff" },
	mapViewWrap: { flex: 1, marginHorizontal: 16, marginBottom: 8, borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: THEME.border, position: "relative" },
	mapOpenExternalBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
	mapOpenExternalText: { fontSize: 12, color: THEME.accent, fontWeight: "800" },
	mapDetailCard: { flexDirection: "row", marginHorizontal: 16, marginTop: -4, marginBottom: 12, borderRadius: 14, borderWidth: 1, borderColor: THEME.borderStrong, backgroundColor: "rgba(92,36,150,0.18)", overflow: "hidden" },
	mapDetailAccent: { width: 3 },
	mapDetailBody: { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
	mapDetailHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
	mapDetailName: { fontSize: 15, fontWeight: "900", color: THEME.text, flex: 1 },
	mapDetailBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: THEME.surface2, borderWidth: 1, borderColor: THEME.border },
	mapDetailBadgeText: { fontSize: 9, color: THEME.textSubtle, fontWeight: "800" },
	mapDetailDescription: { fontSize: 12, color: THEME.textMuted, lineHeight: 17 },
	mapDetailClose: { padding: 12, justifyContent: "center" },
	mapPointsList: { flex: 1, backgroundColor: "transparent", borderTopWidth: 1, borderTopColor: THEME.border },
	mapPointItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 10, borderRadius: 22, borderWidth: 1, borderColor: "rgba(216,180,254,0.15)", backgroundColor: "rgba(255,255,255,0.05)", gap: 12, shadowColor: THEME.accent, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
	mapPointItemSelected: { backgroundColor: "rgba(168,85,247,0.12)", borderColor: THEME.borderStrong },
	mapPointIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
	mapPointItemText: { flex: 1 },
	mapPointItemName: { color: THEME.text, fontSize: 14, fontWeight: "900", marginBottom: 2 },
	mapPointItemCategory: { color: THEME.textSubtle, fontSize: 11, letterSpacing: 0.2, fontWeight: "700" },

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
		backgroundColor: "rgba(92,36,150,0.10)",
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
		backgroundColor: "rgba(92,36,150,0.42)",
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
	mapBgGrass: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#1e3d1e" },
	mapFence: { position: "absolute", top: 6, left: 6, right: 6, bottom: 6, borderRadius: 12, borderWidth: 1.5, borderColor: "rgba(168,85,247,0.5)" },
	mapRoad: { position: "absolute", backgroundColor: "#3d3060" },
	mapRoadDiag: { position: "absolute", height: 10, backgroundColor: "#3d3060", transformOrigin: "left center" },
	mapTree: { position: "absolute", alignItems: "center" },
	mapTreeTop: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#2d6a2d", borderWidth: 1, borderColor: "#3d8a3d" },
	mapTreeTrunk: { width: 3, height: 5, backgroundColor: "#5c3d1e", marginTop: -1 },
	mapBush: { position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: "#2a5a2a", borderWidth: 0.5, borderColor: "#3a7a3a" },
	mapCampZone: { position: "absolute", top: 60, left: 8, width: 90, height: 60, backgroundColor: "rgba(45,212,191,0.15)", borderWidth: 1, borderColor: "#2dd4bf", borderRadius: 8, alignItems: "center", justifyContent: "flex-end", paddingBottom: 4 },
	mapZoneLabel: { fontSize: 7, color: "#2dd4bf", letterSpacing: 1, fontWeight: "600" },
	mapTent: { position: "absolute", width: 16, height: 14, backgroundColor: "#2dd4bf", borderRadius: 2, borderTopLeftRadius: 8, borderTopRightRadius: 8, opacity: 0.8 },
	mapParkingZone: { position: "absolute", top: 268, left: 8, width: 36, height: 36, backgroundColor: "rgba(56,189,248,0.2)", borderWidth: 1, borderColor: "#38bdf8", borderRadius: 6, alignItems: "center", justifyContent: "center" },
	mapParkingLabel: { fontSize: 16, fontWeight: "900", color: "#38bdf8" },
	mapStage: { position: "absolute", borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(168,85,247,0.8)", padding: 2 },
	mapStageIcon: { fontSize: 12, lineHeight: 14 },
	mapStageLabel: { fontSize: 7, color: "#f0e8ff", fontWeight: "700", textAlign: "center", letterSpacing: 0.3 },
	mapPoi: { position: "absolute", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 8, borderWidth: 1, alignItems: "center", minWidth: 44 },
	mapPoiIcon: { fontSize: 12, lineHeight: 14 },
	mapPoiLabel: { fontSize: 6.5, fontWeight: "600", textAlign: "center", letterSpacing: 0.3 },
	mapEntrance: { position: "absolute", bottom: 10, left: "36%", width: 72, paddingVertical: 4, backgroundColor: "#22c55e", borderRadius: 8, borderWidth: 1.5, borderColor: "#16a34a", alignItems: "center" },
	mapEntranceIcon: { fontSize: 12, lineHeight: 14 },
	mapEntranceLabel: { fontSize: 7, color: "#fff", fontWeight: "800", letterSpacing: 1 },
	mapWc: { position: "absolute", width: 22, height: 22, backgroundColor: "rgba(56,189,248,0.25)", borderRadius: 4, borderWidth: 1, borderColor: "#38bdf8", alignItems: "center", justifyContent: "center" },
	mapWcIcon: { fontSize: 11 },
	mapFirstAid: { position: "absolute", width: 22, height: 22, backgroundColor: "rgba(239,68,68,0.25)", borderRadius: 4, borderWidth: 1, borderColor: "#ef4444", alignItems: "center", justifyContent: "center" },
	mapFirstAidIcon: { fontSize: 11 },
	mapInfo: { position: "absolute", width: 22, height: 22, backgroundColor: "rgba(168,85,247,0.25)", borderRadius: 4, borderWidth: 1, borderColor: "#a855f7", alignItems: "center", justifyContent: "center" },
	mapInfoIcon: { fontSize: 11 },
	mapNorth: { position: "absolute", top: 10, right: 10, width: 26, height: 26, backgroundColor: "rgba(34,18,58,0.55)", borderRadius: 13, borderWidth: 0.5, borderColor: "rgba(168,85,247,0.4)", alignItems: "center", justifyContent: "center" },
	mapNorthText: { fontSize: 7, color: "#a855f7", fontWeight: "800", lineHeight: 8 },
	mapNorthArrow: { fontSize: 7, color: "#a855f7", lineHeight: 8 },
	svgGridLine: { position: "absolute", height: 0.5, backgroundColor: "rgba(120,60,200,0.1)" },
	svgGridLineV: { position: "absolute", width: 0.5, backgroundColor: "rgba(120,60,200,0.1)" },
	svgVenueBorder: { position: "absolute", top: 12, left: 12, right: 12, bottom: 12, borderRadius: 12, borderWidth: 1, borderColor: "rgba(120,60,200,0.25)" },
	svgZoneLabel: { position: "absolute", fontSize: 8, letterSpacing: 0, color: "rgba(120,60,200,0.3)" },
	svgRouteLine: { position: "absolute", height: 1, backgroundColor: "rgba(168,85,247,0.15)", transformOrigin: "left center" },
	svgPoint: { position: "absolute", alignItems: "center", justifyContent: "center" },
	svgPointGlow: { position: "absolute", width: "200%", height: "200%", borderRadius: 999, borderWidth: 1.5, opacity: 0.3 },
	svgLabel: { position: "absolute", fontSize: 9, width: 72, textAlign: "center" },
	mapLegend: { paddingHorizontal: 12, paddingVertical: 8, gap: 12 },
	mapLegendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
	mapLegendDot: { width: 8, height: 8, borderRadius: 4 },
	mapLegendText: { fontSize: 10, color: "rgba(216,200,240,0.6)" },
	mapCanvasHint: { fontSize: 10, color: THEME.textSubtle, textAlign: "center", paddingVertical: 4 },
	mapViewToggle: { flexDirection: "row", marginHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: THEME.border, overflow: "hidden", backgroundColor: THEME.surface },
	mapViewToggleBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 9 },
	mapViewToggleBtnActive: { backgroundColor: THEME.surface2 },
	mapViewToggleText: { fontSize: 12, color: THEME.textSubtle, fontWeight: "800" },
	mapViewToggleTextActive: { color: THEME.text },


	// Schedule
	scheduleScreen: { flex: 1 },
	scheduleHeader: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 },
	scheduleHeading: { fontSize: 38, fontWeight: "700", color: THEME.text, fontFamily: FONTS.heading, letterSpacing: -0.5, backgroundColor: "transparent", includeFontPadding: false },
	scheduleSubheading: { fontSize: 13, color: THEME.textSubtle, marginTop: 8, fontFamily: FONTS.ui, letterSpacing: 0.3, backgroundColor: "transparent", includeFontPadding: false },
	scheduleViewSwitcher: { paddingHorizontal: 16, gap: 8, paddingVertical: 8, alignItems: "center" },
	scheduleViewChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: "rgba(216,180,254,0.16)", backgroundColor: "rgba(255,255,255,0.08)" },
	scheduleViewChipActive: { backgroundColor: "rgba(168,85,247,0.28)", borderColor: "rgba(245,208,254,0.42)" },
	scheduleViewChipText: { fontSize: 15, color: THEME.textSubtle, fontWeight: "700", fontFamily: FONTS.ui },
	scheduleViewChipTextActive: { color: THEME.text },
	scheduleBody: { flex: 1 },
	scheduleListContent: { paddingHorizontal: 16, paddingBottom: 120 },
	scheduleGridContent: { paddingHorizontal: 16, paddingBottom: 120 },
	scheduleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
	gridCard: { width: "48%", flexGrow: 1, minWidth: 150, padding: 12, borderRadius: 24, borderWidth: 1, borderColor: THEME.border, backgroundColor: "rgba(255,255,255,0.06)" },
	gridCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
	gridTime: { fontSize: 10, color: THEME.textSubtle, letterSpacing: 0.2, flex: 1, fontWeight: "700" },
	gridName: { fontSize: 15, fontWeight: "900", color: THEME.text, marginBottom: 4 },
	gridStage: { fontSize: 11, color: THEME.textSubtle, fontWeight: "700" },
	gridFavoriteBtn: { padding: 2, marginLeft: 4 },
	stageSectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 4, marginBottom: 4, backgroundColor: THEME.bg },
	stageSectionTitle: { fontSize: 13, fontWeight: "900", color: THEME.accent, letterSpacing: 0.2 },
	timelineRow: { flexDirection: "row", marginBottom: 4 },
	timelineTimeCol: { width: 48, paddingTop: 14 },
	timelineTime: { fontSize: 13, fontWeight: "900", color: THEME.text },
	timelineTimeEnd: { fontSize: 10, color: THEME.textSubtle, marginTop: 2, fontWeight: "700" },
	timelineTrack: { width: 20, alignItems: "center", paddingTop: 18 },
	timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: THEME.accent, borderWidth: 2, borderColor: "rgba(167,139,250,0.35)" },
	timelineLine: { flex: 1, width: 2, backgroundColor: THEME.border, marginTop: 4, marginBottom: -8 },
	timelineCard: { flex: 1, marginLeft: 8, marginBottom: 12, borderRadius: 22, borderWidth: 1, borderColor: THEME.border, backgroundColor: "rgba(72,34,112,0.50)", overflow: "hidden", shadowColor: THEME.accent, shadowOpacity: 0.12, shadowRadius: 14, elevation: 4 },
	timelineCardHeader: { flexDirection: "row", alignItems: "flex-start" },
	timelineCardInfo: { flex: 1, paddingVertical: 14, paddingHorizontal: 14, backgroundColor: "transparent" },
	timelineDescription: { fontSize: 11, color: THEME.textMuted, marginTop: 6, lineHeight: 16 },

	// Performer kártya
	listContent: { padding: 16, paddingBottom: 32 },
	card: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(64,28,104,0.58)", borderWidth: 1, borderColor: "rgba(216,180,254,0.24)", borderRadius: 28, marginBottom: 14, overflow: "hidden", shadowColor: THEME.accent, shadowOpacity: 0.14, shadowRadius: 16, elevation: 5 },
	cardConflict: { borderColor: "rgba(245,158,11,0.55)", backgroundColor: "rgba(245,158,11,0.07)" },
	cardAccent: { width: 3, alignSelf: "stretch", backgroundColor: THEME.accent2, opacity: 0.8 },
	cardAccentConflict: { backgroundColor: "#f59e0b", opacity: 1 },
	cardInfo: { flex: 1, paddingVertical: 16, paddingHorizontal: 16, backgroundColor: "transparent" },
	performerName: { color: THEME.text, fontSize: 22, fontWeight: "700", fontFamily: FONTS.heading, letterSpacing: -0.5, backgroundColor: "transparent", includeFontPadding: false },
	performerDetails: { color: THEME.textSubtle, fontSize: 14, marginTop: 6, letterSpacing: 0.2, fontWeight: "700", fontFamily: FONTS.ui, backgroundColor: "transparent", includeFontPadding: false },
	performerCardHint: { color: THEME.accent, fontSize: 15, marginTop: 8, fontWeight: "900", letterSpacing: 0.2, fontFamily: FONTS.ui, backgroundColor: "transparent", includeFontPadding: false },
	performerModalBackdrop: { flex: 1, backgroundColor: "rgba(3,1,8,0.78)", justifyContent: "center", paddingHorizontal: 18 },
	performerModalCard: { borderRadius: 28, overflow: "hidden", backgroundColor: "rgba(46,18,78,0.92)", borderWidth: 1, borderColor: THEME.borderStrong, shadowColor: THEME.accent, shadowOpacity: 0.22, shadowRadius: 26, elevation: 12, position: "relative" },
	performerModalBackgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.82 },
	performerModalBackgroundScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(92,36,150,0.16)" },
	performerModalHero: { height: 150, backgroundColor: "rgba(168,85,247,0.12)" },
	performerModalContent: { padding: 20 },
	performerModalTopRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
	performerModalEyebrow: { color: THEME.accent, fontSize: 10, fontWeight: "900", letterSpacing: 1.8, marginBottom: 6 },
	performerModalName: { color: THEME.text, fontSize: 26, fontWeight: "900", lineHeight: 31 },
	performerModalCloseBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: THEME.border },
	performerModalMetaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 },
	performerModalMetaChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(168,85,247,0.12)", borderWidth: 1, borderColor: "rgba(168,85,247,0.22)" },
	performerModalMetaText: { color: THEME.textMuted, fontSize: 12, fontWeight: "800" },
	performerModalSectionTitle: { color: THEME.text, fontSize: 15, fontWeight: "900", marginBottom: 8 },
	performerModalDescription: { color: THEME.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 18, fontWeight: "600" },
	performerModalFavBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 24, backgroundColor: THEME.accent2 },
	performerModalFavText: { color: "#fff", fontSize: 14, fontWeight: "900" },
	conflictRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 },
	conflictText: { fontSize: 11, color: "#f59e0b", flex: 1 },
	conflictBadgeText: { color: "#f59e0b", fontSize: 12 },
	favoriteBtn: { width: 56, alignItems: "center", justifyContent: "center", alignSelf: "stretch", backgroundColor: "transparent" },

	// Navigáció
	navBar: { flexDirection: "row", backgroundColor: "rgba(5,1,14,0.97)", paddingBottom: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(216,180,254,0.18)", shadowColor: THEME.accent, shadowOpacity: 0.24, shadowRadius: 22, elevation: 14 },
	navItem: { flex: 1, alignItems: "center", gap: 4 },
	navIconWrap: { width: 50, height: 42, borderRadius: 20, alignItems: "center", justifyContent: "center" },
	navIconActive: { backgroundColor: "rgba(168,85,247,0.28)", borderWidth: 1, borderColor: "rgba(245,208,254,0.52)", shadowColor: THEME.accent, shadowOpacity: 0.56, shadowRadius: 16, elevation: 9 },
	navText: { fontSize: 12.5, color: "rgba(255,255,255,0.42)", letterSpacing: 0.35, fontWeight: "800", fontFamily: FONTS.ui, backgroundColor: "transparent", includeFontPadding: false },
	navTextActive: { color: THEME.accent },
	navBadge: { position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: THEME.accent, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
	navBadgeText: { fontSize: 9, color: "#fff", fontWeight: "700" },

	// Info & Sponsors
	infoScreenContainer: { flex: 1, paddingTop: 16 },
	contactCard: { backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border, borderRadius: 14, padding: 20, marginHorizontal: 24, marginBottom: 10 },
	sectionTitle: { color: THEME.accent, fontSize: 16, fontWeight: "900", letterSpacing: 1.8, marginBottom: 14, fontFamily: FONTS.ui },
	infoText: { color: THEME.textMuted, fontSize: 14, marginBottom: 8, letterSpacing: 0.2, fontWeight: "600" },
	sponsorListContent: { paddingHorizontal: 16, paddingBottom: 120 },
	sponsorColumnWrapper: { justifyContent: "space-between", marginBottom: 16 },
	sponsorCard: { backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: THEME.borderStrong, borderRadius: 24, padding: 14, width: "48%", alignItems: "center", shadowColor: THEME.accent, shadowOpacity: 0.16, shadowRadius: 16, elevation: 6 },
	sponsorCardSingle: { width: "100%", marginBottom: 16 },
	sponsorLogoWrap: {
		width: "100%",
		height: 78,
		borderRadius: 24,
		backgroundColor: "rgba(255,255,255,0.96)",
		borderWidth: 1,
		borderColor: "rgba(255,255,255,0.75)",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 10,
		paddingVertical: 8,
		marginBottom: 12,
	},
	sponsorLogo: { width: "100%", height: "100%" },
	sponsorLogoFallback: { fontSize: 20, fontWeight: "900", letterSpacing: 0, color: THEME.accent },
	sponsorName: { color: THEME.text, fontSize: 14, fontWeight: "800", textAlign: "center", marginTop: 2, fontFamily: FONTS.ui },

	// More képernyő
	moreScreen: { flex: 1 },
	moreList: { paddingHorizontal: 16, paddingTop: 8 },
	moreRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderRadius: 24,
		borderWidth: 1,
		borderColor: "rgba(216,180,254,0.16)",
		backgroundColor: "rgba(255,255,255,0.06)",
		marginBottom: 12,
		shadowColor: THEME.accent,
		shadowOpacity: 0.10,
		shadowRadius: 14,
		elevation: 4,
	},
	moreRowIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "rgba(168,85,247,0.18)",
		borderWidth: 1,
		borderColor: "rgba(216,180,254,0.24)",
		alignItems: "center",
		justifyContent: "center",
	},
	moreRowText: { flex: 1 },
	moreRowTitle: { fontSize: 15, fontWeight: "900", color: THEME.text },
	moreRowSub: { fontSize: 12, color: THEME.textSubtle, marginTop: 4, fontWeight: "600" },
	moreRowBadge: {
		minWidth: 30,
		height: 26,
		paddingHorizontal: 8,
		borderRadius: 13,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: THEME.surface2,
		borderWidth: 1,
		borderColor: THEME.borderStrong,
	},
	moreRowBadgeText: { fontSize: 12, fontWeight: "900", color: THEME.text },

	// Favorites képernyő
	favScreen: { flex: 1 },
	favEmptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 12 },
	favEmptyIconWrap: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: THEME.border, backgroundColor: THEME.surface, alignItems: "center", justifyContent: "center", marginBottom: 8 },
	favEmptyTitle: { fontSize: 18, fontWeight: "900", color: THEME.text, textAlign: "center" },
	favEmptySubtitle: { fontSize: 13, color: THEME.textSubtle, textAlign: "center", lineHeight: 20, fontWeight: "600" },
	favEmptyBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8, paddingVertical: 12, paddingHorizontal: 22, borderRadius: 14, backgroundColor: THEME.surface2, borderWidth: 1, borderColor: THEME.borderStrong },
	favEmptyBtnText: { fontSize: 14, fontWeight: "900", color: THEME.text },

	// Nap szűrő
	dayFilterRow: { paddingHorizontal: 16, gap: 8, paddingVertical: 10 },
	dayFilterChip: {
		paddingHorizontal: 14,
		paddingVertical: 9,
		borderRadius: 20,
		borderWidth: 0.8,
		borderColor: THEME.border,
		backgroundColor: THEME.surface,
	},
	dayFilterChipActive: { backgroundColor: THEME.surface2, borderColor: THEME.borderStrong },
	dayFilterChipText: { fontSize: 12, color: THEME.textSubtle, fontWeight: "800" },
	dayFilterChipTextActive: { color: THEME.text },

	// Gasztró képernyő
	gastroScreen: { flex: 1 },
	gastroHeroCard: { marginHorizontal: 16, marginBottom: 18, borderRadius: 34, borderWidth: 1, borderColor: "rgba(216,180,254,0.22)", backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden", shadowColor: THEME.accent, shadowOpacity: 0.22, shadowRadius: 22, elevation: 8 },
	gastroHeroContent: { padding: 18 },
	gastroHeroEyebrow: { fontSize: 11, color: THEME.accent, letterSpacing: 1.8, marginBottom: 8, fontWeight: "900", fontFamily: FONTS.ui },
	gastroHeroTitle: { fontSize: 22, color: THEME.text, lineHeight: 28, marginBottom: 8, fontWeight: "700", fontFamily: FONTS.heading, letterSpacing: -0.5 },
	gastroHeroText: { fontSize: 13, lineHeight: 21, color: THEME.textMuted, fontFamily: FONTS.body },
	gastroCategoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginHorizontal: 16, marginBottom: 18 },
	gastroCategoryTile: { width: "48%", minHeight: 104, paddingHorizontal: 14, paddingVertical: 14, borderRadius: 24, borderWidth: 1, borderColor: "rgba(216,180,254,0.14)", backgroundColor: "rgba(255,255,255,0.055)", marginBottom: 12, justifyContent: "center", shadowColor: THEME.accent, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
	gastroCategoryTileActive: { backgroundColor: "rgba(168,85,247,0.20)", borderColor: "rgba(245,208,254,0.48)" },
	gastroCategoryTileTopRow: { flexDirection: "row", alignItems: "center" },
	gastroCategoryTextBlock: { flex: 1, paddingLeft: 12 },
	gastroCategoryTileTitle: { fontSize: 17, color: THEME.text, fontWeight: "700", fontFamily: FONTS.heading, letterSpacing: -0.5 },
	gastroCategoryTileTitleActive: { color: "#ffffff" },
	gastroCategoryTileMeta: { fontSize: 12, color: THEME.textSubtle, marginTop: 4, fontFamily: FONTS.ui },
	gastroCategoryTileMetaActive: { color: THEME.textMuted },
	gastroList: { paddingBottom: 32 },
	gastroCard: { backgroundColor: "rgba(255,255,255,0.055)", borderWidth: 1, borderColor: "rgba(216,180,254,0.14)", borderRadius: 30, marginHorizontal: 16, marginBottom: 18, overflow: "hidden", shadowColor: THEME.accent, shadowOpacity: 0.12, shadowRadius: 16, elevation: 5 },
	gastroImageWrap: { height: 178, width: "100%", position: "relative", backgroundColor: "rgba(255,255,255,0.04)" },
	gastroCardImage: { width: "100%", height: "100%" },
	gastroImageTint: { ...StyleSheet.absoluteFillObject, opacity: 0.08 },
	gastroCardAccent: { height: 4, width: "100%" },
	gastroCardBody: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 18, backgroundColor: "rgba(92,36,150,0.12)" },
	gastroCardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 8 },
	gastroEmoji: { fontSize: 20, lineHeight: 24 },
	gastroCardTitles: { flex: 1 },
	gastroName: { fontSize: 25, fontWeight: "700", color: THEME.text, marginBottom: 7, fontFamily: FONTS.heading, letterSpacing: -0.5 },
	gastroTagRow: { flexDirection: "row", alignItems: "center", gap: 6 },
	gastroCatBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, borderWidth: 1, backgroundColor: THEME.surface2, borderColor: THEME.border },
	gastroCatText: { fontSize: 11, fontWeight: "900", letterSpacing: 0, fontFamily: FONTS.ui },
	gastroArtist: { fontSize: 12, color: THEME.textSubtle, fontWeight: "700", fontFamily: FONTS.ui },
	gastroDescription: { fontSize: 15, color: THEME.textMuted, lineHeight: 24, marginBottom: 16, fontWeight: "500", fontFamily: FONTS.body },
	gastroOffers: { gap: 6 },
	gastroOffersLabel: { fontSize: 11, letterSpacing: 1.8, color: THEME.accent, marginBottom: 8, fontWeight: "900", fontFamily: FONTS.ui },
	gastroOfferRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
	gastroOfferDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
	gastroOfferText: { flex: 1, fontSize: 14, color: THEME.textMuted, lineHeight: 22, fontWeight: "500", fontFamily: FONTS.body },
	backBtnHeader: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 2 },
	backBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border },
	backBtnText: { color: THEME.text, fontSize: 12, fontWeight: "800" },
	gastroCategoryRow: {
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 18,
		gap: 14,
		alignItems: "stretch",
	},
	gastroCategoryChip: {
		width: 124,
		minHeight: 108,
		alignItems: "center",
		justifyContent: "flex-start",
		paddingHorizontal: 12,
		paddingTop: 16,
		paddingBottom: 14,
		borderRadius: 24,
		borderWidth: 1.2,
		borderColor: THEME.borderStrong,
		backgroundColor: "rgba(255,255,255,0.06)",
		shadowColor: THEME.accent,
		shadowOpacity: 0.10,
		shadowRadius: 12,
		elevation: 4,
	},
	gastroCategoryChipActive: {
		backgroundColor: "rgba(168,85,247,0.22)",
		borderColor: "rgba(216,180,254,0.45)",
	},
	gastroCategoryIconCircle: {
		width: 50,
		height: 50,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(168,85,247,0.08)",
		borderWidth: 1,
		borderColor: "rgba(168,85,247,0.22)",
	},
	gastroCategoryIconCircleActive: {
		backgroundColor: "rgba(168,85,247,0.32)",
		borderColor: "rgba(240,232,255,0.32)",
	},
	gastroCategoryChipText: {
		fontSize: 16,
		lineHeight: 20,
		color: THEME.textMuted,
		fontWeight: "900",
		letterSpacing: 0.2,
		textAlign: "center",
		includeFontPadding: false,
	},
	gastroCategoryChipTextActive: { color: THEME.text },
	gastroIconBox: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1.2 },
	performerImage: { width: 74, height: 74, borderRadius: 14, marginLeft: 14, marginVertical: 14, backgroundColor: "rgba(120,60,200,0.12)", borderWidth: 1, borderColor: "rgba(216,180,254,0.16)" },
	timelineImage: { width: 58, height: 58, borderRadius: 12, margin: 12, marginRight: 0, backgroundColor: "rgba(120,60,200,0.12)", borderWidth: 1, borderColor: "rgba(216,180,254,0.14)" },
});