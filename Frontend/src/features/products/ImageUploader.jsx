import { useRef, useState } from 'react'
import { UploadCloud, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react'
import Button from '../../components/ui/Button'

const MAX_SIZE_MB  = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

function formatBytes(bytes) {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ImageUploader({ onUpload, currentUrl = null }) {
  const inputRef                = useRef(null)
  const [preview,   setPreview] = useState(currentUrl)
  const [file,      setFile]    = useState(null)
  const [dragging,  setDragging]= useState(false)
  const [error,     setError]   = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = (f) => {
    setError(null)
    if (!f) return

    if (!f.type.startsWith('image/')) {
      setError('Invalid file type. Only images are allowed.')
      return
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`)
      return
    }

    setFile(f)
    // Revoke previous object URL to avoid memory leaks
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const clear = () => {
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleUpload = async () => {
    if (!file || !onUpload) return
    setUploading(true)
    try {
      await onUpload(file)
      setFile(null) // Keep preview but clear pending file state
    } catch {
      setError('Upload failed. Please try again or check your connection.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full animate-fade-in">
      {preview ? (
        /* ─── PREVIEW STATE ─── */
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#84BABF]/30 group shadow-lg shadow-[#06363D]/50 bg-[#06363D]/50">
          
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          
          {/* Subtle dark gradient overlay on hover so buttons/text are always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06363D]/90 via-[#06363D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Remove/Clear Button */}
          <button
            type="button"
            onClick={clear}
            className="absolute top-3 right-3 p-2 rounded-full bg-[#06363D]/60 backdrop-blur-md text-[#E0EDE9] hover:bg-red-500 hover:text-white hover:scale-110 hover:rotate-90 transition-all duration-300 border border-[#84BABF]/20 shadow-lg"
            title="Remove image"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Staged File Info Bar (slides up on hover) */}
          {file && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#06363D]/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-t border-[#84BABF]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-sm font-semibold text-[#E0EDE9] truncate">{file.name}</span>
                <span className="text-[10px] text-[#84BABF] uppercase tracking-wider flex items-center gap-1 mt-0.5 shrink-0">
                  <CheckCircle2 size={10} className="text-[#006F73]" /> Ready to upload
                </span>
              </div>
              <span className="text-xs font-medium text-[#E0EDE9] bg-[#006F73]/60 border border-[#006F73] px-2.5 py-1 rounded-full shrink-0 shadow-inner">
                {formatBytes(file.size)}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* ─── DROPZONE STATE ─── */
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          className={`
            w-full h-48 sm:h-56 rounded-2xl border-2 border-dashed
            flex flex-col items-center justify-center gap-4
            cursor-pointer transition-all duration-300 ease-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84BABF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06363D]
            ${dragging
              ? 'border-[#E0EDE9] bg-[#006F73]/20 scale-[1.02] shadow-[0_0_30px_rgba(0,111,115,0.3)]'
              : 'border-[#84BABF]/40 bg-gradient-to-b from-[#085558]/10 to-[#085558]/30 hover:border-[#84BABF]/80 hover:from-[#085558]/20 hover:to-[#085558]/40'
            }
          `}
        >
          {/* Animated Icon Circle */}
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
            ${dragging ? 'bg-[#E0EDE9]/20 text-[#E0EDE9] scale-110' : 'bg-[#006F73]/40 text-[#84BABF]'}
          `}>
            {dragging ? <ImageIcon size={28} /> : <UploadCloud size={28} />}
          </div>
          
          {/* Text Instructions */}
          <div className="text-center px-4">
            <p className={`text-base font-semibold transition-colors duration-300 ${dragging ? 'text-[#E0EDE9]' : 'text-[#E0EDE9]'}`}>
              {dragging ? 'Drop your image here' : 'Click or drag & drop to upload'}
            </p>
            <p className="text-xs text-[#84BABF] mt-1.5">
              Supports PNG, JPG, WebP up to <span className="font-semibold text-[#E0EDE9]">{MAX_SIZE_MB}MB</span>
            </p>
          </div>
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {/* ─── ERROR STATE ─── */}
      {error && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-fade-in shadow-inner">
          <AlertCircle size={14} className="shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* ─── UPLOAD BUTTON ─── */}
      {file && (
        <div className="mt-4 animate-slide-up">
          <Button
            type="button"
            variant="primary" // Ensure your generic Button handles this variant gracefully
            size="lg"
            fullWidth
            loading={uploading}
            onClick={handleUpload}
            icon={<UploadCloud size={18} />}
            className="shadow-lg shadow-[#006F73]/20 border border-[#84BABF]/20 text-base"
          >
            {uploading ? 'Uploading Image...' : 'Confirm & Upload Image'}
          </Button>
        </div>
      )}
    </div>
  )
}