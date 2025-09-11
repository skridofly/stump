import { useSDK } from '@stump/client'
import { View } from 'react-native'
import PagerView from 'react-native-pager-view'

import { FasterImage } from '~/components/Image'
import { Text } from '~/components/ui'
import { useColors } from '~/lib/constants'
import { useEpubLocationStore } from '~/stores/epub'

export default function LocationsSheetContent() {
	const { sdk } = useSDK()

	const book = useEpubLocationStore((store) => store.book)
	const colors = useColors()

	if (!book) return

	return (
		<View className="flex-1">
			<View className="flex-row items-center justify-around px-4 py-6">
				<Text>Overview</Text>
				<Text>Contents</Text>
				<Text>Annotations</Text>
			</View>

			<PagerView style={{ flex: 1 }} initialPage={0}>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}
					key="1"
				>
					<View className="flex items-center gap-4">
						<View className="aspect-[2/3] self-center">
							<FasterImage
								source={{
									url: book?.thumbnail.url,
									headers: {
										Authorization: sdk.authorizationHeader || '',
									},
									resizeMode: 'fill',
									borderRadius: 8,
								}}
								style={{
									height: 350,
									width: 'auto',
									shadowColor: '#000',
									shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.2,
									shadowRadius: 5,
									borderRadius: 8,
									borderWidth: 0.2,
									borderColor: colors.edge.DEFAULT,
								}}
							/>
						</View>
					</View>
				</View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}
					key="2"
				>
					<Text>Second page</Text>
				</View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
					}}
					key="3"
				>
					<Text>Third page</Text>
				</View>
			</PagerView>
		</View>
	)
}
