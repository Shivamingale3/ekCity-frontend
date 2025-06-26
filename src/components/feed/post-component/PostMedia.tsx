import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"
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

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
        {validMedia.length === 1 ? (
          renderMediaItem(validMedia[0], 0)
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {validMedia.map((mediaItem, index) => (
                <CarouselItem key={mediaItem.id}>{renderMediaItem(mediaItem, index)}</CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 h-9 w-9 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 shadow-lg border-0" />
            <CarouselNext className="right-3 h-9 w-9 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 shadow-lg border-0" />

            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-sm font-medium">
              1 / {validMedia.length}
            </div>
          </Carousel>
        )}
      </div>

      {/* Fullscreen Modal */}
      {fullscreenMedia && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={closeFullscreen}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="max-w-full max-h-full flex items-center justify-center">
            {fullscreenMedia.mediaType === MediaType.IMAGE ? (
              <img
                src={fullscreenMedia.mediaUrl || "/placeholder.svg"}
                alt={fullscreenMedia.fileName}
                className="max-w-full max-h-full object-contain"
                onClick={closeFullscreen}
              />
            ) : (
              <video src={fullscreenMedia.mediaUrl} controls className="max-w-full max-h-full object-contain" autoPlay>
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </>
  )
}
