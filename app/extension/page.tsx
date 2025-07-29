import ChromeExtensionPopup from "@/components/chrome-extension-popup"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ExtensionPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Chrome Extension Preview</h1>
            <p className="text-slate-600 dark:text-slate-400">
              This is how the ColdReach extension will appear when you visit LinkedIn profiles
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex justify-center">
          <div className="shadow-2xl rounded-lg overflow-hidden">
            <ChromeExtensionPopup />
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Extension popup is designed to be under 600px wide for optimal user experience
          </p>
        </div>
      </div>
    </div>
  )
}
