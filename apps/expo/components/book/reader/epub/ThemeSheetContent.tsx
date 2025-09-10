import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Brightness, FontConfig, ThemeSelect } from './controls'

// TODO: https://docs.expo.dev/versions/latest/sdk/slider/
// TODO: https://docs.expo.dev/versions/latest/sdk/brightness/
export default function ThemeSheetContent() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View className="flex-1 gap-8 bg-background">
				<Brightness />

				<ThemeSelect />

				<FontConfig />
			</View>
		</SafeAreaView>
	)
}
