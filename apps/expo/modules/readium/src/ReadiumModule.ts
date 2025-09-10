import { NativeModule, requireNativeModule } from 'expo'

import { ReadiumModuleEvents } from './Readium.types'

declare class ReadiumModule extends NativeModule<ReadiumModuleEvents> {
	extractArchive(url: string, destination: string): Promise<void>
	openPublication(bookId: string, url: string): Promise<void>
	getResource(bookId: string, href: string): Promise<string>
	getPositions(bookId: string): Promise<any[]>
	locateLink(bookId: string, href: string): Promise<any>
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReadiumModule>('Readium')
