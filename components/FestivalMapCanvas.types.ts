export type MapCategory =
	| "stage"
	| "food"
	| "merch"
	| "service"
	| "entrance"
	| "camping";

export interface MapPoint {
	id: string;
	name: string;
	category: MapCategory;
	latitude: number;
	longitude: number;
	description: string;
}

export interface MapRegion {
	latitude: number;
	longitude: number;
	latitudeDelta: number;
	longitudeDelta: number;
}

export interface MapCategoryMeta {
	label: string;
	icon: string;
	color: string;
}

export interface FestivalMapCanvasProps {
	center: MapRegion;
	visiblePoints: MapPoint[];
	selectedId: string | null;
	categoryMeta: Record<MapCategory, MapCategoryMeta>;
	onSelectPoint: (id: string) => void;
	onClearSelection: () => void;
}

export type FestivalMapCanvasRef = {
	animateToRegion: (region: MapRegion, duration?: number) => void;
};
