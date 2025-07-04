import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import React, { useState } from "react"
import { createPortal } from "react-dom"
import { type PostMedia as PostMediaType, MediaType } from "../../../types/postTypes"

interface PostMediaProps {
  media: PostMediaType[]
}

export const PostMedia = ({ media }: PostMediaProps) => {
  const [fullscreenMedia, setFullscreenMedia] = useState<PostMediaType | null>(null)
  const validMedia = media.filter((item) => item.mediaUrl && item.mediaType)

  if (validMedia.length === 0) return null

  const openFullscreen = (mediaItem: PostMediaType) => {
    setFullscreenMedia(mediaItem)
  }

  const closeFullscreen = () => {
    setFullscreenMedia(null)
  }

  const renderMediaItem = (mediaItem: PostMediaType, index: number) => {
    const isImage = mediaItem.mediaType === MediaType.IMAGE

    return (
      <div className="relative group overflow-hidden cursor-pointer" key={mediaItem.id}>
        {isImage ? (
          <img
            src={mediaItem.mediaUrl || "/placeholder.svg"}
            alt={mediaItem.fileName || `Media ${index + 1}`}
            className="w-full h-auto object-cover max-h-[500px] transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onClick={() => openFullscreen(mediaItem)}
          />
        ) : (
          <video
            src={mediaItem.mediaUrl}
            controls
            className="w-full h-auto max-h-[500px] transition-transform duration-300 group-hover:scale-105"
            preload="metadata"
            onClick={() => openFullscreen(mediaItem)}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    )
  }

  // --- In-Post Media Grid Layout ---
  const renderMediaGrid = () => {
    const count = validMedia.length;
    if (count === 1) {
      return (
        <div className="w-full aspect-video rounded-xl overflow-hidden">
          {renderMediaItem(validMedia[0], 0)}
        </div>
      );
    }
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 aspect-video rounded-xl overflow-hidden">
          {validMedia.map((item, idx) => (
            <div key={item.id} className="w-full h-full">
              {renderMediaItem(item, idx)}
            </div>
          ))}
        </div>
      );
    }
    if (count === 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 aspect-video rounded-xl overflow-hidden">
          <div className="row-span-2 col-span-1 w-full h-full">
            {renderMediaItem(validMedia[0], 0)}
          </div>
          <div className="col-span-1 row-span-1 w-full h-full">
            {renderMediaItem(validMedia[1], 1)}
          </div>
          <div className="col-span-1 row-span-1 w-full h-full">
            {renderMediaItem(validMedia[2], 2)}
          </div>
        </div>
      );
    }
    // 4 or more: show first 4 in 2x2 grid
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 aspect-video rounded-xl overflow-hidden">
        {validMedia.slice(0, 4).map((item, idx) => (
          <div key={item.id} className="w-full h-full relative">
            {renderMediaItem(item, idx)}
            {idx === 3 && count > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
                +{count - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // --- Fullscreen Modal with Portal ---
  const FullscreenModal = ({ open, mediaList, initialIndex, onClose }: { open: boolean, mediaList: PostMediaType[], initialIndex: number, onClose: () => void }) => {
    const [current, setCurrent] = useState(initialIndex)

    // Prevent background scroll when modal is open
    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => { document.body.style.overflow = '' }
    }, [open])

    if (!open) return null

    const goNext = () => setCurrent((prev) => (prev + 1) % mediaList.length)
    const goPrev = () => setCurrent((prev) => (prev - 1 + mediaList.length) % mediaList.length)

    // Keyboard navigation
    React.useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') goNext()
        if (e.key === 'ArrowLeft') goPrev()
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    })

    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        {mediaList.length > 1 && (
          <>
            <Button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white hover:bg-black/60" size="icon">&#8592;</Button>
            <Button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white hover:bg-black/60" size="icon">&#8594;</Button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">{current + 1} / {mediaList.length}</div>
          </>
        )}
        <div className="max-w-full max-h-full flex items-center justify-center">
          {mediaList[current].mediaType === MediaType.IMAGE ? (
            <img
              src={mediaList[current].mediaUrl || "/placeholder.svg"}
              alt={mediaList[current].fileName}
              className="max-w-full max-h-[80vh] object-contain"
            />
          ) : (
            <video src={mediaList[current].mediaUrl} controls className="max-w-full max-h-[80vh] object-contain" autoPlay>
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>,
      document.body
    )
  }

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
        {renderMediaGrid()}
      </div>

      {/* Fullscreen Modal with navigation */}
      <FullscreenModal open={!!fullscreenMedia} mediaList={validMedia} initialIndex={fullscreenMedia ? validMedia.findIndex(m => m.id === fullscreenMedia.id) : 0} onClose={closeFullscreen} />
    </>
  )
}
