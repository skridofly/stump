import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { COLORS } from '~/lib/constants'
import { BookMetadata, EPUBReaderThemeConfig, ReadiumLocator } from '~/modules/readium'

import { ZustandMMKVStorage } from './store'

export type IEpubLocationStore = {
	currentChapter: string
	position: number
	totalPages: number

	onBookLoad: (metadata?: BookMetadata) => void
	onLocationChange: (locator: ReadiumLocator) => void
	onUnload: () => void
}

export const useEpubLocationStore = create<IEpubLocationStore>((set) => ({
	currentChapter: '',
	position: 0,
	totalPages: 0,

	onBookLoad: (metadata) =>
		set({
			totalPages: metadata?.totalPages ?? 0,
		}),
	onLocationChange: (locator) =>
		set({ currentChapter: locator.chapterTitle, position: locator.locations?.position ?? 0 }),

	onUnload: () => set({ currentChapter: '', position: 0, totalPages: 0 }),
}))

const defaultThemes: Record<string, EPUBReaderThemeConfig> = {
	light: {
		colors: {
			background: COLORS.light.background.DEFAULT,
			foreground: COLORS.light.foreground.DEFAULT,
		},
	},
	dark: {
		colors: {
			background: COLORS.dark.background.DEFAULT,
			foreground: COLORS.dark.foreground.DEFAULT,
		},
	},
}

export type IEpubThemesStore = {
	selectedTheme?: string
	themes: Record<string, EPUBReaderThemeConfig>
	addTheme: (name: string, config: EPUBReaderThemeConfig) => void
	deleteTheme: (name: string) => void
	resetThemes: () => void
}

export const useEpubThemesStore = create<IEpubThemesStore>()(
	persist(
		(set) =>
			({
				selectedTheme: undefined,
				themes: defaultThemes,
				addTheme: (name, config) =>
					set((state) => ({
						themes: {
							...state.themes,
							[name]: config,
						},
					})),
				deleteTheme: (name) =>
					set((state) => {
						const newThemes = { ...state.themes }
						delete newThemes[name]
						return { themes: newThemes }
					}),
				resetThemes: () => set({ themes: defaultThemes }),
			}) satisfies IEpubThemesStore,
		{
			name: 'stump-epub-themes-store',
			storage: createJSONStorage(() => ZustandMMKVStorage),
			version: 1,
		},
	),
)
