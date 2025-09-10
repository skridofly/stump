import ExpoModulesCore
import R2Shared
import R2Navigator
import Foundation

public class ReadiumModule: Module {
    public func definition() -> ModuleDefinition {
        Name("Readium")

        AsyncFunction("extractArchive") { (archiveUrl: URL, extractedUrl: URL) in
            try BookService.instance.extractArchive(archiveUrl: archiveUrl, extractedUrl: extractedUrl)
        }

        AsyncFunction("openPublication") { (bookId: String, publicationUri: URL) -> String in
            let pub = try await BookService.instance.openPublication(for: bookId, at: publicationUri)
            return pub.jsonManifest ?? "{}"
        }

        AsyncFunction("getResource") { (bookId: String, linkJson: [String : Any]) -> String in
            let link = try Link(json: linkJson)
            let resource = try BookService.instance.getResource(for: bookId, link: link)
            if link.type?.starts(with: "image/") == true {
                let data = try resource.read().get()
                return data.base64EncodedString()
            }
            return try resource.readAsString().get()
        }

        AsyncFunction("getPositions") { (bookId: String) -> [[String : Any]] in
            let positions = try BookService.instance.getPositions(for: bookId)
            return positions.map { $0.json }
        }

        AsyncFunction("locateLink") { (bookId: String, linkJson: [String : Any]) -> [String : Any]? in
            let link = try Link(json: linkJson)
            let locator = BookService.instance.locateLink(for: bookId, link: link)
            return locator?.json
        }

        // TODO: This was my original impl but don't think I need
        AsyncFunction("loadEPUB") { (url: String) -> Bool in
            let bookId = "default"
            guard let epubUrl = URL(string: url) else {
                return false
            }
            
            do {
                _ = try await BookService.instance.openPublication(for: bookId, at: epubUrl)
                return true
            } catch {
                print("Error loading EPUB: \(error)")
                return false
            }
        }

        AsyncFunction("goToNextPage") { () -> Bool in
            // TODO: Determine if needed, probably yes for programmatic navigation
            return true
        }
        
        AsyncFunction("goToPreviousPage") { () -> Bool in
            // TODO: Determine if needed, probably yes for programmatic navigation
            return true
        }
        
        AsyncFunction("goToPage") { (pageNumber: Int) -> Bool in
            // TODO: Determine if needed, probably yes for programmatic navigation
            return true
        }
        
        AsyncFunction("getCurrentPage") { () -> Int in
            // TODO: Determine if needed, probably yes for programmatic navigation
            return 1
        }
        
        AsyncFunction("getTotalPages") { () -> Int in
            // TODO: Determine if needed, probably yes for programmatic navigation
            return 100
        }
        
        AsyncFunction("updateReaderConfig") { (config: [String: Any]) in
            // TODO: Determine if needed, probably yes for programmatic navigation
            print("Received reader config: \(config)")
        }

        View(EPUBView.self) {
            Events("onLocatorChange", "onPageChange", "onBookLoaded", "onMiddleTouch", "onSelection", "onDoubleTouch", "onError")

            Prop("bookId") { (view: EPUBView, prop: String) in
                view.pendingProps.bookId = prop
            }

            Prop("locator") { (view: EPUBView, prop: [String : Any]) in
                guard let locator = try? Locator(json: prop) else {
                    return
                }
                view.pendingProps.locator = locator
            }

            Prop("initialLocator") { (view: EPUBView, prop: [String : Any]) in
                guard let locator = try? Locator(json: prop) else {
                    return
                }
                view.pendingProps.initialLocator = locator
            }

            Prop("url") { (view: EPUBView, prop: String) in
                view.pendingProps.url = prop
            }

            Prop("colors") { (view: EPUBView, prop: [String: String]) in
                if let background = prop["background"] {
                    view.pendingProps.background = Color(hex: background)
                }
                if let foreground = prop["foreground"] {
                    view.pendingProps.foreground = Color(hex: foreground)
                }
            }

            Prop("fontSize") { (view: EPUBView, prop: Double) in
                view.pendingProps.fontSize = prop / 16.0 // Normalize to scale
            }

            Prop("lineHeight") { (view: EPUBView, prop: Double) in
                view.pendingProps.lineHeight = prop
            }

            Prop("fontFamily") { (view: EPUBView, prop: String) in
                view.pendingProps.fontFamily = FontFamily(rawValue: prop)
            }

            Prop("readingDirection") { (view: EPUBView, prop: String) in
                let textAlign = prop == "rtl" ? TextAlignment.right : TextAlignment.left
                view.pendingProps.textAlign = textAlign
            }

            OnViewDidUpdateProps { (view: EPUBView) in
                view.finalizeProps()
            }
        }
    }
}
