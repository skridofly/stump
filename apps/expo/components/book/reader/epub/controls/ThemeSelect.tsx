import { Cog } from 'lucide-react-native'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { Button, Text } from '~/components/ui'
import { Icon } from '~/components/ui/icon'
import { useColorScheme } from '~/lib/useColorScheme'
import { EPUBReaderThemeConfig } from '~/modules/readium'
import { useEpubThemesStore } from '~/stores/epub'

export default function ThemeSelect() {
	const { colorScheme } = useColorScheme()
	const { themes, selectedTheme } = useEpubThemesStore((store) => ({
		themes: store.themes,
		selectedTheme: store.selectedTheme,
	}))

	// TODO: Grid
	return (
		<View>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					padding: 16,
					gap: 12,
				}}
			>
				{Object.entries(themes).map(([name, config]) => (
					<View key={name} className="items-center">
						<ThemePreview name={name} config={config} />
						{selectedTheme === name && <View className="absolute inset-0 rounded-lg border-2" />}
					</View>
				))}
			</ScrollView>

			<View className="flex-row justify-center px-4">
				<Button size="sm" className="flex-row">
					<Icon as={Cog} className="mr-2 h-4 w-4" />
					<Text>Customize</Text>
				</Button>
			</View>
		</View>
	)
}

type Props = {
	name: string
	config: EPUBReaderThemeConfig
}

// TODO: Take in border?
const ThemePreview = ({ name, config }: Props) => {
	return (
		<View
			className="h-32 w-40 items-center justify-center rounded-lg shadow"
			style={{ backgroundColor: config.colors?.background }}
		>
			<Text
				style={{
					color: config.colors?.foreground,
				}}
				className="items-center justify-center text-2xl"
			>
				Aa
			</Text>
			<Text className="mt-1 text-center text-base" style={{ color: config.colors?.foreground }}>
				{name}
			</Text>
		</View>
	)
}
