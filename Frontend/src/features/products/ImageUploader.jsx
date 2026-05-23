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
    <div className="w-full animate-fade-in space-y-4">
      {preview ? (
        /* ─── PREVIEW STATE ─── */
        <div className="relative w-full h-56 sm:h-64 rounded-lg overflow-hidden border border-[#d9d4c8] group shadow-sm bg-white">
          
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          
          {/* Subtle dark gradient overlay on hover so buttons/text are always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#182321]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Remove/Clear Button */}
          <button
            type="button"
            onClick={clear}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white text-red-700 hover:bg-red-50 transition-all duration-200 border border-[#d9d4c8] shadow-sm"
            title="Remove image"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Staged File Info Bar (slides up on hover) */}
          {file && (
            <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between border-t border-[#d9d4c8] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <div className="flex flex-col min-w-0 pr-4">
                <span className="text-sm font-semibold text-[#182321] truncate">{file.name}</span>
                <span className="text-[10px] text-[#697773] uppercase tracking-wider flex items-center gap-1 mt-0.5 shrink-0">
                  <CheckCircle2 size={10} className="text-[#004643]" /> Ready to upload
                </span>
              </div>
              <span className="text-xs font-medium text-white bg-[#004643] border border-[#004643] px-2.5 py-1 rounded-full shrink-0">
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
            w-full h-56 sm:h-64 rounded-lg border-2 border-dashed
            flex flex-col items-center justify-center gap-4
            cursor-pointer transition-all duration-300 ease-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004643] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0EDE5]
            ${dragging
              ? 'border-[#004643] bg-[#e5f2f1] scale-[1.02]'
              : 'border-[#9bb7b2] bg-white hover:border-[#004643] hover:bg-[#f7f4ed]'
            }
          `}
        >
          {/* Animated Icon Circle */}
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
            ${dragging ? 'bg-white text-[#004643] scale-110' : 'bg-[#e5f2f1] text-[#004643]'}
          `}>
            {dragging ? <ImageIcon size={28} /> : <UploadCloud size={28} />}
          </div>
          
          {/* Text Instructions */}
          <div className="text-center px-4">
            <p className="text-base font-semibold transition-colors duration-300 text-[#182321]">
              {dragging ? 'Drop your image here' : 'Click or drag & drop to upload'}
            </p>
            <p className="text-xs text-[#697773] mt-1.5">
              Supports PNG, JPG, WebP up to <span className="font-semibold text-[#182321]">{MAX_SIZE_MB}MB</span>
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
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs animate-fade-in">
          <AlertCircle size={14} className="shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* ─── UPLOAD BUTTON ─── */}
      {file && (
        <div className="sticky bottom-0 z-10 -mx-5 sm:-mx-6 -mb-5 border-t border-[#d9d4c8] bg-[#faf8f2]/95 px-5 sm:px-6 py-4 backdrop-blur animate-slide-up">
          <Button
            type="button"
            variant="primary" // Ensure your generic Button handles this variant gracefully
            size="lg"
            fullWidth
            loading={uploading}
            onClick={handleUpload}
            icon={<UploadCloud size={18} />}
            className="text-base"
          >
            {uploading ? 'Uploading Image...' : 'Confirm & Upload Image'}
          </Button>
        </div>
      )}
    </div>
  )
}
