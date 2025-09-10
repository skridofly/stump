import { useMemo } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { COLORS } from '~/lib/constants'
import { useColorScheme } from '~/lib/useColorScheme'
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
	Light: {
		colors: {
			background: COLORS.light.background.DEFAULT,
			foreground: COLORS.light.foreground.DEFAULT,
		},
	},
	Dark: {
		colors: {
			background: COLORS.dark.background.DEFAULT,
			foreground: COLORS.dark.foreground.DEFAULT,
		},
	},
	Sepia: {
		colors: {
			background: '#F5E9D3',
			foreground: '#5B4636',
		},
	},
}

export type StoredConfig = Pick<EPUBReaderThemeConfig, 'colors'>

export type IEpubThemesStore = {
	selectedTheme?: string
	themes: Record<string, StoredConfig>
	addTheme: (name: string, config: StoredConfig) => void
	deleteTheme: (name: string) => void
	selectTheme: (name: string) => void
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
				selectTheme: (name) => set({ selectedTheme: name }),
				resetThemes: () => set({ themes: defaultThemes }),
			}) satisfies IEpubThemesStore,
		{
			name: 'stump-epub-themes-store',
			storage: createJSONStorage(() => ZustandMMKVStorage),
			version: 1,
		},
	),
)

export const resolveTheme = (
	themes: Record<string, StoredConfig>,
	themeName: string,
	colorScheme: 'light' | 'dark',
): StoredConfig => {
	const theme = themes[themeName]
	return theme ?? (colorScheme === 'dark' ? themes.Dark : themes.Light)
}

export const resolveThemeName = (
	themes: Record<string, StoredConfig>,
	themeName: string | undefined,
	colorScheme: 'light' | 'dark',
): string => {
	if (themeName && themes[themeName]) {
		return themeName
	}

	return colorScheme === 'dark' ? 'Dark' : 'Light'
}

export const useEpubTheme = () => {
	const { colorScheme } = useColorScheme()
	const { themes, selectedTheme } = useEpubThemesStore((store) => ({
		themes: store.themes,
		selectedTheme: store.selectedTheme,
	}))

	return useMemo(
		() => resolveTheme(themes, selectedTheme || '', colorScheme),
		[themes, selectedTheme, colorScheme],
	)
}
