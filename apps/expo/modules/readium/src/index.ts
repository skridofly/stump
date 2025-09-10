import ReadiumModule from './ReadiumModule'
import ReadiumView from './ReadiumView'
import EPUBReader from './EPUBReader'

export { ReadiumView, EPUBReader }

// Native module functions
export async function extractArchive(url: string, destination: string): Promise<void> {
	return ReadiumModule.extractArchive(url, destination)
}

export async function openPublication(bookId: string, url: string): Promise<void> {
	return ReadiumModule.openPublication(bookId, url)
}

export async function getResource(bookId: string, href: string): Promise<string> {
	return ReadiumModule.getResource(bookId, href)
}

export async function getPositions(bookId: string): Promise<any[]> {
	return ReadiumModule.getPositions(bookId)
}

export async function locateLink(bookId: string, href: string): Promise<any> {
	return ReadiumModule.locateLink(bookId, href)
}

export * from './Readium.types'
