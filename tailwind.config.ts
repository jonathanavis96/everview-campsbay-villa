import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "1.5rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				display: ["Fraunces Variable", "Georgia", "serif"],
				body: ["Archivo Variable", "system-ui", "sans-serif"],
				data: ["IBM Plex Mono", "ui-monospace", "monospace"],
			},
			colors: {
				ink: "#12191C",
				paper: "#F1F0EC",
				stone: "#8C857A",
				line: "#DAD8D2",
				sun: "#D98A3D",
				// The drawn sea. Ink with the blue left in it — the swells in
				// AtlanticBand are the only thing on the page that is not ink,
				// and at their opacities a saturated blue would read as a
				// graphic rather than a drawing.
				sea: "#27506B",
				// Literal --stone (#8C857A) only reaches 3.2:1 against --paper,
				// short of design-direction §10's 4.5:1 body-text floor. Used for
				// stone-coloured TEXT only — the ridgeline stroke and other
				// decorative uses stay on the literal `stone` token.
				"stone-text": "#67655E",
			},
			borderRadius: {
				none: "0px",
				sm: "2px",
			},
			maxWidth: {
				prose: "62ch",
			},
		},
	},
	plugins: [],
} satisfies Config;
