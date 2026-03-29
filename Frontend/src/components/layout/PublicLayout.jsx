import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen relative">
      {/* Liquid glass background blobs */}
      <div className="liquid-bg" aria-hidden="true">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
      </div>
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  )
}