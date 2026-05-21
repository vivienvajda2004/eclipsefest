const fs = require("fs");
const path = require("path");

// Több forrásból dolgozó képkereső függvény
async function getArtistImage(name) {
	// 1. FORRÁS: Deezer API (Előadó profilképe)
	try {
		const deezerRes = await fetch(
			`https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}`,
		);
		const deezerData = await deezerRes.json();
		if (
			deezerData &&
			deezerData.data &&
			deezerData.data.length > 0 &&
			deezerData.data[0].picture_big
		) {
			return deezerData.data[0].picture_big; // ~500x500 pixeles JPG
		}
	} catch (e) {
		// Ha hiba van, megyünk tovább a következőre
	}

	// 2. FORRÁS: Apple Music / iTunes API (Legnépszerűbb dal borítója)
	try {
		const itunesRes = await fetch(
			`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=song&limit=1`,
		);
		const itunesData = await itunesRes.json();
		if (
			itunesData &&
			itunesData.results &&
			itunesData.results.length > 0 &&
			itunesData.results[0].artworkUrl100
		) {
			// Az Apple alapból 100x100-as képet ad, de az URL átírásával lekérhetjük 400x400-ban is
			return itunesData.results[0].artworkUrl100.replace(
				"100x100bb",
				"400x400bb",
			);
		}
	} catch (e) {
		// Ha itt is hiba van, megyünk a tartalékra
	}

	// 3. FORRÁS: Tartalék valós fotó (Picsum)
	// A név alapján generálunk egy "seed"-et, így mindig ugyanazt a tartalék fotót kapja az adott előadó
	const seed = name.replace(/\s+/g, "").toLowerCase();
	return `https://picsum.photos/seed/${seed}/400/400.jpg`;
}

async function downloadAndMapImages() {
	const dataPath = "./assets/data/eclipsefest_data.json";

	// JSON beolvasása
	const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
	const imagesDir = "./assets/performers";

	// Mappa létrehozása, ha nincs
	if (!fs.existsSync(imagesDir)) {
		fs.mkdirSync(imagesDir, { recursive: true });
	}

	console.log(
		"Képek intelligens letöltése folyamatban (Deezer -> Apple Music -> Tartalék)...",
	);
	let mapCode = "export const performerImages: Record<string, any> = {\n";

	for (const performer of data.performers) {
		try {
			// Megkeressük a legjobb elérhető képet
			const imageUrl = await getArtistImage(performer.name);

			// Kép letöltése
			const res = await fetch(imageUrl);
			if (!res.ok) throw new Error(`HTTP hiba: ${res.status}`);

			const arrayBuffer = await res.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			// Kimentjük fixen .jpg formátumban
			const fileName = `performer_${performer.id}.jpg`;
			fs.writeFileSync(path.join(imagesDir, fileName), buffer);

			// Hozzáadjuk a TypeScript térképhez
			mapCode += `  "${performer.id}": require('../performers/${fileName}'),\n`;

			console.log(`[OK] ${performer.name} letöltve.`);

			// 300ms szünet, hogy az API-k (főleg az Apple) ne tiltsanak le a túl gyors kérések miatt
			await new Promise((resolve) => setTimeout(resolve, 300));
		} catch (err) {
			console.error(`[HIBA] ${performer.name} nem sikerült:`, err.message);
		}
	}

	mapCode += "};\n";

	// Export fájl mentése
	fs.writeFileSync("./assets/data/imageMap.ts", mapCode);
	console.log(
		"\nKész! Az összes kép sikeresen letöltve megfelelő formátumban.",
	);
}

downloadAndMapImages();
