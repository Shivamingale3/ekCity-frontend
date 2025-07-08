import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getUserMedia } from "@/redux/thunks/userThunk";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import React from "react";

function UserMedia() {
    const dispatch = useAppDispatch();
    const { userMedia, userMediaLoading, userMediaError } = useAppSelector((state) => state.user);

    // Fullscreen modal state
    const [fullscreen, setFullscreen] = useState<{
        urls: string[];
        type: "image" | "video";
        index: number;
    } | null>(null);

    const openFullscreen = (urls: string[], type: "image" | "video", index: number) => {
        setFullscreen({ urls, type, index });
    };
    const closeFullscreen = () => setFullscreen(null);

    // Fullscreen Modal for media
    const FullscreenModal = ({ open, urls, type, initialIndex, onClose }: { open: boolean, urls: string[], type: "image" | "video", initialIndex: number, onClose: () => void }) => {
        const [current, setCurrent] = useState(initialIndex);
        React.useEffect(() => {
            if (open) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            return () => { document.body.style.overflow = '' }
        }, [open]);
        if (!open) return null;
        const goNext = () => setCurrent((prev) => (prev + 1) % urls.length);
        const goPrev = () => setCurrent((prev) => (prev - 1 + urls.length) % urls.length);
        React.useEffect(() => {
            const handler = (e: KeyboardEvent) => {
                if (e.key === 'ArrowRight') goNext();
                if (e.key === 'ArrowLeft') goPrev();
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handler);
            return () => window.removeEventListener('keydown', handler);
        });
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
                {urls.length > 1 && (
                    <>
                        <Button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white hover:bg-black/60" size="icon">&#8592;</Button>
                        <Button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white hover:bg-black/60" size="icon">&#8594;</Button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">{current + 1} / {urls.length}</div>
                    </>
                )}
                <div className="max-w-full max-h-full flex items-center justify-center">
                    {type === "image" ? (
                        <img
                            src={urls[current]}
                            alt={`Media ${current + 1}`}
                            className="max-w-full max-h-[80vh] object-contain"
                        />
                    ) : (
                        <video src={urls[current]} controls className="max-w-full max-h-[80vh] object-contain" autoPlay>
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            </div>,
            document.body
        );
    };

    useEffect(() => {
        if (!userMedia && !userMediaLoading) {
            dispatch(getUserMedia());
        }
    }, [dispatch, userMedia, userMediaLoading]);

    if (userMediaLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px] w-full">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-sm text-gray-500">Loading media...</p>
                </div>
            </div>
        );
    }

    if (userMediaError) {
        return (
            <div className="flex items-center justify-center min-h-[300px] w-full">
                <div className="text-center text-red-500">{userMediaError}</div>
            </div>
        );
    }

    if (!userMedia) {
        return null;
    }

    const { profilePictures, postMedia } = userMedia;
    const { images, videos } = postMedia;

    return (
        <Tabs defaultValue="profilePictures" className="w-full h-full flex flex-col">
            <div className="flex-shrink-0 pb-4">
                <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                    <TabsTrigger value="profilePictures" className="text-sm font-medium">Profile Pictures</TabsTrigger>
                    <TabsTrigger value="images" className="text-sm font-medium">Images</TabsTrigger>
                    <TabsTrigger value="videos" className="text-sm font-medium">Videos</TabsTrigger>
                </TabsList>
            </div>
            <div className="flex-1 min-h-0">
                <TabsContent value="profilePictures" className="w-full h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                    {profilePictures.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[200px] w-full text-gray-400">No profile pictures found.</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-2">
                            {profilePictures.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Profile ${idx + 1}`}
                                    className="rounded-lg w-full aspect-square object-cover border cursor-pointer"
                                    loading="lazy"
                                    onClick={() => openFullscreen(profilePictures, "image", idx)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="images" className="w-full h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                    {images.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[200px] w-full text-gray-400">No images found.</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-2">
                            {images.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Image ${idx + 1}`}
                                    className="rounded-lg w-full aspect-square object-cover border cursor-pointer"
                                    loading="lazy"
                                    onClick={() => openFullscreen(images, "image", idx)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="videos" className="w-full h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                    {videos.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[200px] w-full text-gray-400">No videos found.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
                            {videos.map((url, idx) => (
                                <video
                                    key={idx}
                                    src={url}
                                    controls
                                    className="rounded-lg w-full aspect-video object-cover border cursor-pointer"
                                    preload="metadata"
                                    onClick={() => openFullscreen(videos, "video", idx)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </div>
            {/* Fullscreen Modal for media */}
            <FullscreenModal open={!!fullscreen} urls={fullscreen?.urls || []} type={fullscreen?.type || "image"} initialIndex={fullscreen?.index || 0} onClose={closeFullscreen} />
        </Tabs>
    );
}

export default UserMedia; 