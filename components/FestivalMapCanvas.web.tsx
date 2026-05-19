import React, { forwardRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type {
	FestivalMapCanvasProps,
	FestivalMapCanvasRef,
	MapCategory,
} from "./FestivalMapCanvas.types";

const FestivalMapCanvas = forwardRef<FestivalMapCanvasRef, FestivalMapCanvasProps>(
	function FestivalMapCanvas({
		visiblePoints,
		selectedId,
		categoryMeta,
		onSelectPoint,
	}, _ref) {
		return (
			<View style={styles.wrap}>
				<Ionicons name="map" size={40} color="rgba(168,85,247,0.4)" />
				<Text style={styles.title}>Interaktív térkép</Text>
				<Text style={styles.sub}>
					A valódi térkép telefonon érhető el (Expo Go). Itt válaszd ki a
					helyszínt:
				</Text>
				<ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
					{visiblePoints.map((point) => {
						const meta = categoryMeta[point.category as MapCategory];
						const active = selectedId === point.id;
						return (
							<TouchableOpacity
								key={point.id}
								style={[styles.item, active && styles.itemActive]}
								onPress={() => onSelectPoint(point.id)}
							>
								<View style={[styles.dot, { backgroundColor: meta.color }]} />
								<View style={styles.info}>
									<Text style={styles.name}>{point.name}</Text>
									<Text style={styles.category}>{meta.label}</Text>
								</View>
								<Ionicons
									name="chevron-forward"
									size={16}
									color="rgba(168,85,247,0.5)"
								/>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>
		);
	},
);

export default FestivalMapCanvas;

const styles = StyleSheet.create({
	wrap: {
		flex: 1,
		padding: 16,
		alignItems: "center",
		backgroundColor: "rgba(18,8,35,0.95)",
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		color: "#e8d8ff",
		marginTop: 12,
	},
	sub: {
		fontSize: 12,
		color: "rgba(168,85,247,0.55)",
		textAlign: "center",
		lineHeight: 18,
		marginTop: 8,
		marginBottom: 12,
	},
	list: {
		flex: 1,
		width: "100%",
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderRadius: 12,
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.2)",
		backgroundColor: "rgba(120,60,200,0.06)",
		marginBottom: 8,
		gap: 10,
	},
	itemActive: {
		borderColor: "rgba(168,85,247,0.45)",
		backgroundColor: "rgba(124,58,237,0.15)",
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	info: {
		flex: 1,
	},
	name: {
		fontSize: 14,
		fontWeight: "600",
		color: "#e8d8ff",
	},
	category: {
		fontSize: 11,
		color: "rgba(168,85,247,0.55)",
		marginTop: 2,
	},
});
