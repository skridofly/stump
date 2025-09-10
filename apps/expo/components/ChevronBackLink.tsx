import React from 'react'
import { Icon } from './ui/icon'
import { ChevronLeft } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { cn } from '~/lib/utils'

type Props = {
	iconClassName?: string
}

export default function ChevronBackLink({ iconClassName }: Props) {
	const router = useRouter()
	return (
		<TouchableOpacity onPress={() => router.back()}>
			<Icon as={ChevronLeft} className={cn('h-6 w-6 text-foreground', iconClassName)} />
		</TouchableOpacity>
	)
}
