import { Stack } from 'expo-router'
import { Platform } from 'react-native'
import ChevronBackLink from '~/components/ChevronBackLink'
import { usePreferencesStore } from '~/stores'

export default function Screen() {
	const animationEnabled = usePreferencesStore((state) => !state.reduceAnimations)

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: animationEnabled ? 'default' : 'none',
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: true,
					headerTitle: 'Books',
					headerLeft: Platform.OS === 'android' ? undefined : () => <ChevronBackLink />,
					headerTransparent: Platform.OS === 'ios',
					headerBlurEffect: 'regular',
					headerLargeTitle: false,
				}}
			/>
		</Stack>
	)
}
