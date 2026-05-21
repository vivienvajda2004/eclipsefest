import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update navContainer
nav_old = """	navContainer: {
		flexDirection: "row",
		height: 72,
		backgroundColor: THEME.navBg,
		paddingHorizontal: 16,
		paddingBottom: Platform.OS === "ios" ? 20 : 0,
		alignItems: "center",
		justifyContent: "space-between",
		borderTopWidth: 1,
		borderTopColor: THEME.border,
		shadowColor: THEME.accent,
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 10,
	},"""
nav_new = """	navContainer: {
		flexDirection: "row",
		height: 68,
		backgroundColor: THEME.navBg,
		paddingHorizontal: 12,
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderColor: THEME.border,
		shadowColor: THEME.accent,
		shadowOpacity: 0.25,
		shadowRadius: 25,
		elevation: 15,
		position: "absolute",
		bottom: Platform.OS === "ios" ? 35 : 20,
		left: 20,
		right: 20,
		borderRadius: 999,
	},"""

# Use exact string replacement for navContainer
content = content.replace(nav_old, nav_new)

# 2. Typography
content = content.replace('letterSpacing: 2', 'letterSpacing: 0.5')
content = content.replace('letterSpacing: 3', 'letterSpacing: 1')
content = content.replace('letterSpacing: 0.5', 'letterSpacing: 0')
content = content.replace('fontFamily: FONTS.heading', 'fontFamily: FONTS.heading, letterSpacing: -0.5')
# Clean up duplicate letterSpacing if any
content = re.sub(r'letterSpacing: [^,]+, fontFamily: FONTS\.heading, letterSpacing: -0\.5', r'fontFamily: FONTS.heading, letterSpacing: -0.5', content)

# 3. Pill radiuses
pill_classes = ['navBtn', 'actionBtn', 'ticketBadge', 'gastroCatBadge', 'performerGenreBadge', 'filterChip', 'scheduleViewChip', 'langBtn']
for cls in pill_classes:
    content = re.sub(rf'({cls}: {{[^}}]+borderRadius: )\d+', r'\g<1>999', content)

content = content.replace('borderRadius: 16', 'borderRadius: 24')
content = content.replace('borderRadius: 18', 'borderRadius: 24')
content = content.replace('borderRadius: 26', 'borderRadius: 32')
content = content.replace('borderRadius: 30', 'borderRadius: 32')

# 4. Colors
content = content.replace('backgroundColor: "rgba(72,34,112,0.54)"', 'backgroundColor: "rgba(255,255,255,0.06)"')
content = content.replace('backgroundColor: "rgba(84,44,130,0.18)"', 'backgroundColor: "rgba(0,0,0,0.15)"')
content = content.replace('backgroundColor: "rgba(76,37,121,0.36)"', 'backgroundColor: "rgba(255,255,255,0.08)"')
content = content.replace('backgroundColor: "rgba(72,34,112,0.48)"', 'backgroundColor: "rgba(255,255,255,0.06)"')
content = content.replace('backgroundColor: "rgba(216,180,254,0.1)"', 'backgroundColor: THEME.surface2')

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Styles updated successfully.")
