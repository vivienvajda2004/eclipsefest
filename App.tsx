import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Easing,
	FlatList,
	Image,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import festivalData from "./assets/data/eclipsefest_data.json";

// ─── Adatmodell ───────────────────────────────────────────────────────────────
interface Performer {
	id: string;
	name: string;
	stage: string;
	startTime: string;
	endTime: string;
	description: string;
}

interface Sponsor {
	id: string;
	name: string;
	logoUrl: string;
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

// ─── Home képernyő ─────────────────────────────────────────────────────────────
function HomeScreen() {
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
function SponsorsScreen() {
	const sponsors = festivalData.sponsors as Sponsor[];

	return (
		<View style={styles.infoScreenContainer}>
			<Text
				style={[
					styles.sectionTitle,
					{ textAlign: "center", marginTop: 10, marginBottom: 20 },
				]}
			>
				OUR PROUD SPONSORS
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
	const [activeTab, setActiveTab] = useState<"Home" | "Schedule" | "Sponsors">(
		"Home",
	);
	const [favorites, setFavorites] = useState<string[]>([]);

	const toggleFavorite = (id: string) => {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
		);
	};

	const navTabs: {
		key: "Home" | "Schedule" | "Sponsors";
		icon: string;
		label: string;
	}[] = [
		{ key: "Home", icon: "home", label: "Home" },
		{ key: "Schedule", icon: "calendar", label: "Schedule" },
		{ key: "Sponsors", icon: "people", label: "Sponsors" },
	];

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#06020f" />

			{/* Fejléc */}
			<View style={styles.header}>
				<Text style={styles.headerBadge}>ECLIPSEFEST · 2026</Text>
			</View>

			{/* Tartalom */}
			<View style={styles.mainArea}>
				{activeTab === "Home" && <HomeScreen />}
				{activeTab === "Schedule" && (
					<FlatList
						data={festivalData.performers as Performer[]}
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.listContent}
						renderItem={({ item }) => (
							<PerformerCard
								item={item}
								isFavorite={favorites.includes(item.id)}
								onToggle={() => toggleFavorite(item.id)}
							/>
						)}
					/>
				)}
				{/* Itt már a SponsorsScreen-t hívjuk meg */}
				{activeTab === "Sponsors" && <SponsorsScreen />}
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

	// Schedule lista
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
});
