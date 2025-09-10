import { useCallback, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useColors } from '~/lib/constants'
import { ReadiumLocator, ReadiumView } from '~/modules/readium'
import { useReaderStore } from '~/stores'
import { useDownload } from '~/stores/download'
import { useEpubLocationStore } from '~/stores/epub'
import { useBookPreferences } from '~/stores/reader'

import { EbookReaderBookRef } from '../image/context'
import ReadiumFooter, { FOOTER_HEIGHT } from './ReadiumFooter'
import ReadiumHeader, { HEADER_HEIGHT } from './ReadiumHeader'

type Props = {
	/**
	 * The book which is being read
	 */
	book: EbookReaderBookRef
	/**
	 * The initial CFI to start the reader on
	 */
	initialCfi?: string
	/**
	 * Whether the reader should be in incognito mode
	 */
	incognito?: boolean

	onEpubCfiChanged: (cfi: string, percentage: number) => void
}

// TODO: Figure out epubcfi handling, that will "unlock" the rest of these unused props
export default function ReadiumReader({ book, initialCfi, incognito, onEpubCfiChanged }: Props) {
	const { downloadBook } = useDownload()

	const [localUri, setLocalUri] = useState<string | null>(null)

	const controlsVisible = useReaderStore((state) => state.showControls)
	const setControlsVisible = useReaderStore((state) => state.setShowControls)

	const colors = useColors()
	const {
		preferences: { fontSize, fontFamily, lineHeight },
	} = useBookPreferences({ book })

	// TODO: Support actual themes here
	// TODO: Whenever this changes Readium will likely re-calculate totalPages etc, which means
	// we need to re-sync the location to the store somehow
	const config = useMemo(
		() => ({
			fontSize,
			fontFamily,
			lineHeight,
			colors: {
				background: colors.background.DEFAULT,
				foreground: colors.foreground.DEFAULT,
			},
		}),
		[fontSize, fontFamily, lineHeight, colors],
	)

	const store = useEpubLocationStore((store) => ({
		onBookLoad: store.onBookLoad,
		onLocationChange: store.onLocationChange,
		cleanup: store.onUnload,
	}))

	useEffect(() => {
		if (localUri) return

		async function download() {
			const result = await downloadBook(book)
			if (result) {
				setLocalUri(result)
			} else {
				console.error('Failed to download book')
			}
		}

		download()
	}, [localUri, book, downloadBook])

	useEffect(
		() => {
			return () => {
				store.cleanup()
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	)

	const handleMiddleTouch = useCallback(() => {
		setControlsVisible(!controlsVisible)
	}, [controlsVisible, setControlsVisible])

	const handleSelection = useCallback(
		(event: {
			nativeEvent: { cleared?: boolean; x?: number; y?: number; locator?: ReadiumLocator }
		}) => {
			console.log('Text selection:', event.nativeEvent)
		},
		[],
	)

	const insets = useSafeAreaInsets()

	if (!localUri) return null

	return (
		<View style={{ flex: 1 }}>
			<ReadiumHeader />

			<ReadiumView
				bookId={book.id}
				url={localUri}
				// TODO: This doesn't actually work lol
				onBookLoaded={({ nativeEvent }) => store.onBookLoad(nativeEvent.bookMetadata)}
				onLocatorChange={({ nativeEvent }) => store.onLocationChange(nativeEvent)}
				onMiddleTouch={handleMiddleTouch}
				onSelection={handleSelection}
				style={{
					flex: 1,
					marginTop: insets.top + HEADER_HEIGHT,
					marginBottom: insets.bottom + FOOTER_HEIGHT,
				}}
				{...config}
			/>

			<ReadiumFooter />
		</View>
	)
}
