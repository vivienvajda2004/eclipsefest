import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	Easing,
	FlatList,
	Image,
	Linking,
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

const FESTIVAL_DAYS = [
	{ key: "all", label: "Mind" },
	{ key: 18, label: "Júl. 18" },
	{ key: 19, label: "Júl. 19" },
	{ key: 20, label: "Júl. 20" },
];

function formatPrice(amount: number, currency: string) {
	return `${amount.toLocaleString("hu-HU")} ${currency}`;
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
					<Text style={styles.popularBadgeText}>NÉPSZERŰ</Text>
				</View>
			)}
			<View
				style={[styles.cardAccent, selected && styles.ticketAccentSelected]}
			/>
			<View style={styles.ticketCardBody}>
				<View style={styles.ticketCardHeader}>
					<View style={styles.ticketTitleRow}>
						<Text style={styles.ticketName}>{ticket.name}</Text>
						<View style={styles.ticketBadge}>
							<Text style={styles.ticketBadgeText}>{ticket.badge}</Text>
						</View>
					</View>
					<Text style={styles.ticketPrice}>
						{formatPrice(ticket.price, ticket.currency)}
					</Text>
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
	selectedId: string | null;
	quantity: number;
	email: string;
	orderComplete: boolean;
	onSelect: (id: string) => void;
	onChangeQuantity: (delta: number) => void;
	onEmailChange: (value: string) => void;
	onPurchase: () => void;
	onReset: () => void;
}) {
	const selected = tickets.find((t) => t.id === selectedId) ?? null;
	const total = selected ? selected.price * quantity : 0;
	const emailValid = isValidEmail(email);
	const showEmailError = email.length > 0 && !emailValid;
	const canCheckout = !!selected && emailValid;

	if (orderComplete && selected) {
		return (
			<View style={styles.ticketsScreen}>
				<View style={styles.orderSuccess}>
					<View style={styles.orderSuccessIcon}>
						<Ionicons name="checkmark-circle" size={56} color="#a855f7" />
					</View>
					<Text style={styles.orderSuccessTitle}>Sikeres vásárlás!</Text>
					<Text style={styles.orderSuccessSub}>
						A visszaigazolást elküldjük erre a címre:
					</Text>
					<Text style={styles.orderSuccessEmail}>{email.trim()}</Text>
					<View style={styles.orderSummaryCard}>
						<Text style={styles.orderSummaryLabel}>RENDELÉS</Text>
						<Text style={styles.orderSummaryName}>{selected.name}</Text>
						<Text style={styles.orderSummaryDetail}>
							{quantity} db · {formatPrice(total, selected.currency)}
						</Text>
					</View>
					<TouchableOpacity style={styles.checkoutBtn} onPress={onReset}>
						<Text style={styles.checkoutBtnText}>Új vásárlás</Text>
					</TouchableOpacity>
				</View>
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
			</ScrollView>
			<View style={styles.checkoutBar}>
				{selected ? (
					<>
						<View style={styles.quantityRow}>
							<Text style={styles.quantityLabel}>Mennyiség</Text>
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
							<Text style={styles.emailLabel}>E-mail cím</Text>
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
}) {
	const stars = useRef(
		Array.from({ length: 80 }, (_, i) => ({
			id: i,
			top: `${Math.random() * 100}%` as `${number}%`,
			left: `${Math.random() * 100}%` as `${number}%`,
			size: 0.5 + Math.random() * 1.8,
		})),
	).current;

	const nextFav = getNextFavorite(favoritePerformers);
	const minsUntil = nextFav ? minutesUntil(nextFav) : null;

	return (
		<View style={styles.homeScreen}>
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
					<Text style={styles.tagline}>WHEN DARKNESS FALLS, MUSIC RISES</Text>
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
					<Ionicons
						name="chevron-forward"
						size={16}
						color="rgba(168,85,247,0.6)"
					/>
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
	const sorted = sortPerformersByTime(performers);

	const stageSections = [...new Set(sorted.map((p) => p.stage))]
		.sort()
		.map((stage) => ({
			title: stage,
			data: sorted.filter((p) => p.stage === stage),
		}));

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
					<View style={styles.timelineCard}>
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
									{lang === "en" ? item.description_en : item.description_hu}
								</Text>
							</View>
							{renderFavoriteBtn(item.id)}
						</View>
					</View>
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
					<View key={item.id} style={styles.gridCard}>
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
		</View>
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

// ─── Gasztró képernyő ─────────────────────────────────────────────────────────
function GastroScreen() {
	const [activeCategory, setActiveCategory] = useState<GastroCategory | "Mind">(
		"Mind",
	);

	const filtered =
		activeCategory === "Mind"
			? GASTRO_STANDS
			: GASTRO_STANDS.filter((s) => s.category === activeCategory);

	return (
		<View style={styles.gastroScreen}>
			<View style={styles.scheduleHeader}>
				<Text style={styles.scheduleHeading}>Gasztró</Text>
				<Text style={styles.scheduleSubheading}>
					{GASTRO_STANDS.length} stand · fesztiválos ízek
				</Text>
			</View>

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

			<FlatList
				data={filtered}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.gastroList}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<View style={styles.gastroCard}>
						<View
							style={[styles.gastroCardAccent, { backgroundColor: item.color }]}
						/>
						<View style={styles.gastroCardBody}>
							{/* Fejléc */}
							<View style={styles.gastroCardHeader}>
								<Text style={styles.gastroEmoji}>{item.emoji}</Text>
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
										<Text style={styles.gastroArtist}>· {item.artist}</Text>
									</View>
								</View>
							</View>

							{/* Leírás */}
							<Text style={styles.gastroDescription}>{item.description}</Text>

							{/* Ajánlatok */}
							<View style={styles.gastroOffers}>
								<Text style={styles.gastroOffersLabel}>KIEMELT AJÁNLAT</Text>
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
function SponsorsScreen({ t }: { t: typeof translations.en }) {
	const sponsors = festivalData.sponsors as Sponsor[];
	return (
		<View style={styles.infoScreenContainer}>
			<Text style={[styles.sectionTitle, { textAlign: "center" }]}>
				{t.sponsorsTitle}
			</Text>
			<FlatList
				data={sponsors}
				keyExtractor={(item) => item.id}
				numColumns={2}
				contentContainerStyle={styles.sponsorListContent}
				columnWrapperStyle={styles.sponsorColumnWrapper}
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

// ─── Fő App komponens ─────────────────────────────────────────────────────────
export default function App() {
	const [activeTab, setActiveTab] = useState<TabKey>("Home");
	const [favorites, setFavorites] = useState<string[]>([]);
	const [lang, setLang] = useState<"en" | "hu">("en");
	const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
	const [ticketQuantity, setTicketQuantity] = useState(1);
	const [buyerEmail, setBuyerEmail] = useState("");
	const [orderComplete, setOrderComplete] = useState(false);

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
					<Text style={{ color: "#a855f7", fontWeight: "bold" }}>
						{lang === "en" ? "EN 🔄" : "HU 🔄"}
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.mainArea}>
				{activeTab === "Home" && (
					<HomeScreen
						onGoToTickets={() => setActiveTab("Tickets")}
						onGoToFavorites={() => setActiveTab("Favorites")}
						favoritePerformers={favoritePerformers}
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
						onGoToSchedule={() => setActiveTab("Schedule")}
					/>
				)}
				{activeTab === "Gastro" && <GastroScreen />}
				{activeTab === "Tickets" && (
					<TicketsScreen
						tickets={tickets}
						selectedId={selectedTicketId}
						quantity={ticketQuantity}
						email={buyerEmail}
						orderComplete={orderComplete}
						onSelect={handleSelectTicket}
						onChangeQuantity={handleChangeQuantity}
						onEmailChange={setBuyerEmail}
						onPurchase={handlePurchase}
						onReset={handleResetOrder}
					/>
				)}
				{activeTab === "Sponsors" && <SponsorsScreen t={t} />}
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
									color={active ? "#a855f7" : "#444"}
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
		backgroundColor: "rgba(168,85,247,0.1)",
		borderWidth: 0.5,
		borderColor: "rgba(168,85,247,0.35)",
	},
	nextFavText: { flex: 1, fontSize: 12, color: "rgba(216,200,240,0.75)" },
	nextFavName: { color: "#e8d8ff", fontWeight: "600" },
	nextFavTime: { fontSize: 11, color: "#a855f7", fontWeight: "600" },

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
	dateYear: { fontSize: 14, fontWeight: "500", color: "#d8c8f0" },

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
	ticketFeatureText: { fontSize: 11, color: "rgba(168,85,247,0.65)" },
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
	mapHeading: { fontSize: 24, fontWeight: "700", color: "#f0e8ff" },
	mapVenue: { fontSize: 12, color: "rgba(168,85,247,0.55)", marginTop: 4 },
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
		borderRadius: 16,
		overflow: "hidden",
		borderWidth: 1.5,
		borderColor: "rgba(120,60,200,0.4)",
	},
	svgContainer: {
		marginHorizontal: 12,
		height: 340,
		backgroundColor: "#1e3d1e",
		borderRadius: 16,
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
	scheduleListContent: { paddingHorizontal: 16, paddingBottom: 32 },
	scheduleGridContent: { paddingHorizontal: 16, paddingBottom: 32 },
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
	favoriteBtn: { padding: 16 },

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
