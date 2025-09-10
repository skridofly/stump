import { create } from 'zustand'
import { ReadiumLocator, BookMetadata } from '~/modules/readium'

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
