import { Check, X } from 'lucide-react'

function LegacyDataModal({ count, onConfirm, onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Import Existing Tasks?</h2>
        <p className="text-white/80 mb-6">
          We found {count} task{count !== 1 ? 's' : ''} from a previous version.
          <br /><br />
          Would you like to import them to your account? They will be synced to the cloud.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium text-white transition-all"
          >
            Skip
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Import {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LegacyDataModal
