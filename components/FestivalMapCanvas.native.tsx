import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import type {
	FestivalMapCanvasProps,
	FestivalMapCanvasRef,
	MapCategory,
} from "./FestivalMapCanvas.types";

const FestivalMapCanvas = forwardRef<FestivalMapCanvasRef, FestivalMapCanvasProps>(
	function FestivalMapCanvas(
		{
			center,
			visiblePoints,
			selectedId,
			categoryMeta,
			onSelectPoint,
			onClearSelection,
		},
		ref,
	) {
		const mapRef = useRef<MapView>(null);

		useImperativeHandle(ref, () => ({
			animateToRegion: (region, duration = 450) => {
				mapRef.current?.animateToRegion(region, duration);
			},
		}));

		return (
			<>
				<MapView
					ref={mapRef}
					style={styles.mapView}
					initialRegion={center}
					provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
					showsUserLocation
					showsMyLocationButton={Platform.OS === "android"}
					showsCompass
					showsBuildings
					mapType="standard"
					onPress={onClearSelection}
				>
					{visiblePoints.map((point) => {
						const meta = categoryMeta[point.category as MapCategory];
						const active = selectedId === point.id;
						return (
							<Marker
								key={point.id}
								coordinate={{
									latitude: point.latitude,
									longitude: point.longitude,
								}}
								title={point.name}
								description={point.description}
								onPress={(e) => {
									e.stopPropagation();
									onSelectPoint(point.id);
								}}
								tracksViewChanges={false}
							>
								<View
									style={[
										styles.marker,
										{
											borderColor: meta.color,
											backgroundColor: `${meta.color}22`,
										},
										active && styles.markerActive,
									]}
								>
									<Ionicons
										name={meta.icon as keyof typeof Ionicons.glyphMap}
										size={18}
										color={meta.color}
									/>
								</View>
							</Marker>
						);
					})}
				</MapView>

				<TouchableOpacity
					style={styles.resetBtn}
					onPress={() => {
						onClearSelection();
						mapRef.current?.animateToRegion(center, 450);
					}}
				>
					<Ionicons name="scan-outline" size={18} color="#e8d8ff" />
				</TouchableOpacity>
			</>
		);
	},
);

export default FestivalMapCanvas;

const styles = StyleSheet.create({
	mapView: {
		...StyleSheet.absoluteFillObject,
	},
	marker: {
		width: 38,
		height: 38,
		borderRadius: 19,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
	},
	markerActive: {
		transform: [{ scale: 1.12 }],
	},
	resetBtn: {
		position: "absolute",
		top: 12,
		right: 12,
		width: 40,
		height: 40,
		borderRadius: 12,
		backgroundColor: "rgba(10,4,21,0.88)",
		borderWidth: 0.5,
		borderColor: "rgba(120,60,200,0.35)",
		alignItems: "center",
		justifyContent: "center",
	},
});
