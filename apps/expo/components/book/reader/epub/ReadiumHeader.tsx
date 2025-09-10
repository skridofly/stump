import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ChevronBackLink from '~/components/ChevronBackLink'
import { Text } from '~/components/ui'
import { useDisplay } from '~/lib/hooks'
import { useReaderStore } from '~/stores'
import { useEpubLocationStore } from '~/stores/epub'

export const HEADER_HEIGHT = 48

export default function ReadiumHeader() {
	const { height } = useDisplay()

	const visible = useReaderStore((state) => state.showControls)
	const chapterTitle = useEpubLocationStore((state) => state.currentChapter)

	const insets = useSafeAreaInsets()

	const translateY = useSharedValue(-400)
	useEffect(() => {
		translateY.value = withTiming(visible ? 0 : 400 * -1, {
			duration: 300,
		})
	}, [visible, translateY, height, insets.top])

	const animatedStyles = useAnimatedStyle(() => {
		return {
			top: insets.top + (Platform.OS === 'android' ? 12 : 0),
			left: insets.left,
			right: insets.right,
			transform: [{ translateY: translateY.value }],
		}
	})

	return (
		<Animated.View
			className="absolute z-20 h-12 flex-row items-center justify-between gap-2 px-2"
			style={animatedStyles}
		>
			<ChevronBackLink />

			<Text>{chapterTitle}</Text>

			{/* TODO: Menu items */}
			<View className="w-6" />
		</Animated.View>
	)
}
