import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Easing,
	FlatList,
	Image,
	Linking,
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
import festivalData from "./assets/data/eclipsefest_data.json";

// ─── Nyelvi szótár (i18n) ─────────────────────────────────────────────────────
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

type TabKey = "Home" | "Schedule" | "Map" | "Tickets" | "Sponsors";

// ─── Adatmodell ───────────────────────────────────────────────────────────────
interface Performer {
	id: string;
	name: string;
	stage: string;
	startTime: string;
	endTime: string;
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

function formatPrice(amount: number, currency: string) {
	return `${amount.toLocaleString("hu-HU")} ${currency}`;
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Animált csillag komponens ────────────────────────────────────────────────
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

// ─── Eclipse / Corona animáció ────────────────────────────────────────────────
function EclipseAnimation() {
	// Lassan forgó külső gyűrű
	const rotation = useRef(new Animated.Value(0)).current;
	// Lüktető halo gyűrűk
	const pulse1 = useRef(new Animated.Value(1)).current;
	const pulse2 = useRef(new Animated.Value(1)).current;
	const pulse3 = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		// Folyamatos forgás
		Animated.loop(
			Animated.timing(rotation, {
				toValue: 1,
				duration: 40000,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		).start();

		// Lüktető gyűrűk eltolt fázissal
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

	// Corona spike-ok: 24 vonal különböző hosszal és opacitással
	const spikes = Array.from({ length: 24 }, (_, i) => ({
		angle: i * 15,
		length: i % 3 === 0 ? 52 : i % 2 === 0 ? 38 : 28,
		opacity: i % 3 === 0 ? 0.55 : i % 2 === 0 ? 0.35 : 0.18,
		width: i % 3 === 0 ? 1.5 : 0.8,
	}));

	return (
		<View style={styles.eclipseContainer}>
			{/* Külső lüktető halo gyűrűk */}
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

			{/* Forgó corona spike-ok */}
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

			{/* Bolygó / logó */}
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

// ─── Jegy kártya ───────────────────────────────────────────────────────────────
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

// ─── Jegyvásárlás képernyő ─────────────────────────────────────────────────────
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

// ─── Térkép képernyő ─────────────────────────────────────────────────────────────
function MapScreen({ map }: { map: FestivalMap }) {
	const [filter, setFilter] = useState<MapFilter>("all");
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const visiblePoints =
		filter === "all"
			? map.points
			: map.points.filter((p) => p.category === filter);

	const selected = map.points.find((p) => p.id === selectedId) ?? null;

	const selectPoint = (id: string) => {
		setSelectedId(id);
	};

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
			<View style={styles.mapHeader}>
				<Text style={styles.mapHeading}>Térkép</Text>
				<Text style={styles.mapVenue}>{map.venueName}</Text>
			</View>

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

			<View style={styles.mapPointsList}>
				<FlatList
					data={visiblePoints}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={[
								styles.mapPointItem,
								selectedId === item.id && styles.mapPointItemSelected,
							]}
							onPress={() => selectPoint(item.id)}
						>
							<Ionicons
								name={
									MAP_CATEGORY_META[item.category]
										.icon as keyof typeof Ionicons.glyphMap
								}
								size={20}
								color={MAP_CATEGORY_META[item.category].color}
							/>
							<View style={styles.mapPointItemText}>
								<Text style={styles.mapPointItemName}>{item.name}</Text>
								<Text style={styles.mapPointItemCategory}>
									{MAP_CATEGORY_META[item.category].label}
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>

			{selected && renderDetailCard(selected)}
		</View>
	);
}

// ─── Home képernyő ─────────────────────────────────────────────────────────────
function HomeScreen({ onGoToTickets }: { onGoToTickets: () => void }) {
	// Véletlenszerű csillagok generálása (egyszer, komponens mountolásakor)
	const stars = useRef(
		Array.from({ length: 80 }, (_, i) => ({
			id: i,
			top: `${Math.random() * 100}%` as `${number}%`,
			left: `${Math.random() * 100}%` as `${number}%`,
			size: 0.5 + Math.random() * 1.8,
		})),
	).current;

	return (
		<View style={styles.homeScreen}>
			{/* Csillagmező */}
			{stars.map((s) => (
				<Star
					key={s.id}
					style={{
						top: s.top,
						left: s.left,
						width: s.size,
						height: s.size,
					}}
				/>
			))}

			{/* Eclipse animáció */}
			<EclipseAnimation />

			{/* Fesztivál neve */}
			<View style={styles.titleZone}>
				<Text style={styles.festName}>EclipseFest</Text>
				<Text style={styles.tagline}>WHEN DARKNESS FALLS, MUSIC RISES</Text>
			</View>

			{/* Dátum sáv */}
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

			{/* Info chipek */}
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

function parseTimeToMinutes(time: string) {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
}

function sortPerformersByTime(performers: Performer[]) {
	return [...performers].sort(
		(a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
	);
}

// ─── Schedule képernyő ─────────────────────────────────────────────────────────
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
}: {
	item: Performer;
	isFavorite: boolean;
	onToggle: () => void;
}) {
	return (
		<View style={styles.card}>
			<View style={styles.cardAccent} />
			<View style={styles.cardInfo}>
				<Text style={styles.performerName}>{item.name}</Text>
				<Text style={styles.performerDetails}>
					{item.stage}
					{"  ·  "}
					{item.startTime} – {item.endTime}
				</Text>
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

// ─── Sponsors képernyő ────────────────────────────────────────────────
function SponsorsScreen({ t }: { t: typeof translations.en }) {
	const sponsors = festivalData.sponsors as Sponsor[];

	return (
		<View style={styles.infoScreenContainer}>
			<Text style={[styles.sectionTitle, { textAlign: "center" }]}>
				{t.sponsorsTitle}
			</Text>

			{/* Szponzorok Grid */}
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

	const t = translations[lang];
	const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
	const [ticketQuantity, setTicketQuantity] = useState(1);
	const [buyerEmail, setBuyerEmail] = useState("");
	const [orderComplete, setOrderComplete] = useState(false);

	const tickets = festivalData.tickets as Ticket[];
	const festivalMap = festivalData.map as FestivalMap;

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
		{ key: "Tickets", icon: "ticket", label: t.tickets },
		{ key: "Sponsors", icon: "star", label: t.sponsors },
	];

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#06020f" />

			{/* Fejléc */}
			<View
				style={[
					styles.header,
					{ flexDirection: "row", justifyContent: "space-between" },
				]}
			>
				<Text style={styles.headerBadge}>ECLIPSEFEST · 2026</Text>

				{/* Egyedi nyelvválasztó "legördülő" / gomb */}
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

			{/* Tartalom */}
			<View style={styles.mainArea}>
				{activeTab === "Home" && (
					<HomeScreen onGoToTickets={() => setActiveTab("Tickets")} />
				)}
				{activeTab === "Schedule" && (
					<ScheduleScreen
						performers={festivalData.performers as Performer[]}
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

			{/* Alsó navigáció */}
			<View style={styles.navBar}>
				{navTabs.map((tab) => {
					const active = activeTab === tab.key;
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
	// Alap layout
	container: {
		flex: 1,
		backgroundColor: "#06020f",
	},
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
	mainArea: {
		flex: 1,
	},

	// Home képernyő
	homeScreen: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#06020f",
		position: "relative",
		overflow: "hidden",
	},
	star: {
		position: "absolute",
		backgroundColor: "#ffffff",
		borderRadius: 99,
	},

	// Eclipse animáció
	eclipseContainer: {
		width: 260,
		height: 260,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 12,
		position: "relative",
	},
	haloRing: {
		position: "absolute",
		borderRadius: 999,
	},
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
	logoImage: {
		width: "100%",
		height: "100%",
	},

	// Cím
	titleZone: {
		alignItems: "center",
		marginTop: -4,
		paddingHorizontal: 24,
	},
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

	// Dátum sáv
	dateStrip: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 24,
		marginTop: 20,
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.25)",
		borderRadius: 18,
		backgroundColor: "rgba(120,60,200,0.05)",
	},
	dateItem: {
		alignItems: "center",
		paddingHorizontal: 12,
	},
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
	dateSep: {
		width: 0.5,
		height: 36,
		backgroundColor: "rgba(120,60,200,0.25)",
	},
	dateRight: {
		alignItems: "flex-end",
		paddingLeft: 12,
	},
	dateYear: {
		fontSize: 14,
		fontWeight: "500",
		color: "#d8c8f0",
	},

	// Info chipek
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
	chipValue: {
		fontSize: 13,
		fontWeight: "500",
		color: "#d8c8f0",
	},
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
	ticketsScreen: {
		flex: 1,
	},
	ticketsScroll: {
		padding: 16,
		paddingBottom: 24,
	},
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
	ticketAccentSelected: {
		backgroundColor: "#a855f7",
		opacity: 1,
	},
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
	ticketCardBody: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 14,
	},
	ticketCardHeader: {
		marginBottom: 6,
	},
	ticketTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 4,
	},
	ticketName: {
		color: "#e8d8ff",
		fontSize: 17,
		fontWeight: "600",
	},
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
	ticketPrice: {
		fontSize: 18,
		fontWeight: "700",
		color: "#c084fc",
	},
	ticketDescription: {
		fontSize: 12,
		color: "rgba(216,200,240,0.75)",
		lineHeight: 17,
		marginBottom: 10,
	},
	ticketFeatures: {
		gap: 5,
	},
	ticketFeatureRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	ticketFeatureText: {
		fontSize: 11,
		color: "rgba(168,85,247,0.65)",
	},
	ticketSelectIndicator: {
		justifyContent: "center",
		paddingRight: 14,
	},
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
	quantityLabel: {
		fontSize: 13,
		color: "#d8c8f0",
	},
	quantityControls: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
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
	quantityBtnDisabled: {
		opacity: 0.35,
	},
	quantityValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#f0e8ff",
		minWidth: 24,
		textAlign: "center",
	},
	emailField: {
		marginBottom: 12,
	},
	emailLabel: {
		fontSize: 13,
		color: "#d8c8f0",
		marginBottom: 8,
	},
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
	emailInputError: {
		borderColor: "rgba(239,68,68,0.6)",
	},
	emailErrorText: {
		fontSize: 11,
		color: "#f87171",
		marginTop: 6,
	},
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
	totalValue: {
		fontSize: 20,
		fontWeight: "700",
		color: "#e8d8ff",
	},
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
	checkoutBtnDisabled: {
		opacity: 0.4,
	},
	checkoutBtnText: {
		fontSize: 15,
		fontWeight: "600",
		color: "#f0e8ff",
	},
	orderSuccess: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 32,
	},
	orderSuccessIcon: {
		marginBottom: 16,
	},
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
	orderSummaryDetail: {
		fontSize: 14,
		color: "#c084fc",
	},

	// Térkép
	mapScreen: {
		flex: 1,
		paddingTop: 8,
	},
	mapHeader: {
		paddingHorizontal: 16,
		marginBottom: 10,
	},
	mapHeading: {
		fontSize: 24,
		fontWeight: "700",
		color: "#f0e8ff",
	},
	mapVenue: {
		fontSize: 12,
		color: "rgba(168,85,247,0.55)",
		marginTop: 4,
	},
	mapFilters: {
		paddingHorizontal: 16,
		gap: 8,
		paddingBottom: 12,
	},
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
	mapFilterChipTextActive: {
		color: "#e8d8ff",
	},
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
	mapOpenExternalText: {
		fontSize: 12,
		color: "#c084fc",
		fontWeight: "500",
	},
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
	mapDetailAccent: {
		width: 3,
	},
	mapDetailBody: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
	mapDetailHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 4,
	},
	mapDetailName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#e8d8ff",
		flex: 1,
	},
	mapDetailBadge: {
		paddingHorizontal: 7,
		paddingVertical: 2,
		borderRadius: 6,
		backgroundColor: "rgba(120,60,200,0.15)",
	},
	mapDetailBadgeText: {
		fontSize: 9,
		color: "rgba(168,85,247,0.7)",
	},
	mapDetailDescription: {
		fontSize: 12,
		color: "rgba(216,200,240,0.75)",
		lineHeight: 17,
	},
	mapDetailClose: {
		padding: 12,
		justifyContent: "center",
	},

	// Schedule
	scheduleScreen: {
		flex: 1,
	},
	scheduleHeader: {
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 4,
	},
	scheduleHeading: {
		fontSize: 24,
		fontWeight: "700",
		color: "#f0e8ff",
	},
	scheduleSubheading: {
		fontSize: 12,
		color: "rgba(168,85,247,0.55)",
		marginTop: 4,
	},
	scheduleViewSwitcher: {
		paddingHorizontal: 16,
		gap: 8,
		paddingVertical: 10,
	},
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
	scheduleViewChipTextActive: {
		color: "#e8d8ff",
	},
	scheduleBody: {
		flex: 1,
	},
	scheduleListContent: {
		paddingHorizontal: 16,
		paddingBottom: 32,
	},
	scheduleGridContent: {
		paddingHorizontal: 16,
		paddingBottom: 32,
	},
	scheduleGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
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
	gridStage: {
		fontSize: 11,
		color: "rgba(168,85,247,0.55)",
	},
	gridFavoriteBtn: {
		padding: 2,
		marginLeft: 4,
	},
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
	timelineRow: {
		flexDirection: "row",
		marginBottom: 4,
	},
	timelineTimeCol: {
		width: 48,
		paddingTop: 14,
	},
	timelineTime: {
		fontSize: 13,
		fontWeight: "600",
		color: "#e8d8ff",
	},
	timelineTimeEnd: {
		fontSize: 10,
		color: "rgba(168,85,247,0.45)",
		marginTop: 2,
	},
	timelineTrack: {
		width: 20,
		alignItems: "center",
		paddingTop: 18,
	},
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
	timelineCardHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	timelineCardInfo: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 14,
	},
	timelineDescription: {
		fontSize: 11,
		color: "rgba(216,200,240,0.65)",
		marginTop: 6,
		lineHeight: 16,
	},

	// Schedule lista (kártyák)
	listContent: {
		padding: 16,
		paddingBottom: 32,
	},
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
	cardAccent: {
		width: 3,
		alignSelf: "stretch",
		backgroundColor: "#7c3aed",
		opacity: 0.8,
	},
	cardInfo: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 14,
	},
	performerName: {
		color: "#e8d8ff",
		fontSize: 16,
		fontWeight: "600",
	},
	performerDetails: {
		color: "rgba(168,85,247,0.55)",
		fontSize: 12,
		marginTop: 4,
		letterSpacing: 0.3,
	},
	favoriteBtn: {
		padding: 16,
	},

	// Navigáció
	navBar: {
		flexDirection: "row",
		backgroundColor: "#0a0415",
		paddingBottom: 24,
		paddingTop: 10,
		borderTopWidth: 0.5,
		borderTopColor: "rgba(120,60,200,0.2)",
	},
	navItem: {
		flex: 1,
		alignItems: "center",
		gap: 4,
	},
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
	navText: {
		fontSize: 10,
		color: "#444",
		letterSpacing: 0.5,
	},
	navTextActive: {
		color: "#a855f7",
	},
	// Info & Sponsors képernyő stílusok
	infoScreenContainer: {
		flex: 1,
		paddingTop: 16,
	},
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
	sponsorListContent: {
		paddingHorizontal: 16,
		paddingBottom: 32,
	},
	sponsorColumnWrapper: {
		justifyContent: "space-between",
		marginBottom: 16,
	},
	sponsorCard: {
		backgroundColor: "#120a26", // Kicsit sötétebb, hogy a logók kiugorjanak
		borderWidth: 0.5,
		borderColor: "rgba(168,85,247,0.15)",
		borderRadius: 12,
		padding: 16,
		width: "48%", // Hogy kettő elférjen egymás mellett
		alignItems: "center",
	},
	sponsorLogo: {
		width: 60,
		height: 40,
		marginBottom: 12,
	},
	sponsorName: {
		color: "rgba(232,216,255,0.8)",
		fontSize: 12,
		fontWeight: "500",
		textAlign: "center",
	},
	// Map képernyő
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
	mapPointItemSelected: {
		backgroundColor: "rgba(168,85,247,0.1)",
	},
	mapPointItemText: {
		flex: 1,
	},
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
});
