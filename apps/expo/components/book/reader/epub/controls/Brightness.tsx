import { Sun, SunDim } from 'lucide-react-native'
import { View } from 'react-native'

import { Progress } from '~/components/ui'
import { Icon } from '~/components/ui/icon'

// TODO: Fancy and scale on focus/drag
export default function Brightness() {
	return (
		<View className="max-w-full flex-row items-center gap-3 px-4">
			<Icon as={SunDim} className="h-4 w-4 shrink-0 text-foreground-muted" />
			<View className="flex-1">
				<Progress className="h-2.5" value={0.5} />
			</View>
			<Icon as={Sun} className="h-4 w-4 shrink-0 text-foreground-muted" />
		</View>
	)
}
