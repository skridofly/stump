import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Brightness, ThemeSelect } from './controls'

export default function ThemeSheetContent() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View className="flex-1 gap-8 bg-background">
				<Brightness />

				<ThemeSelect />
			</View>
		</SafeAreaView>
	)
}
