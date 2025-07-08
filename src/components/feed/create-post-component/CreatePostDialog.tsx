import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/redux/store";
import { createPost } from "@/redux/thunks/feedThunk";
import { UserRole, type User } from "@/types/authTypes";
import { PostCategory } from "@/types/postTypes";
import { getInitials } from "@/utils/universalFunctions";
import {
  AlertCircle,
  Hash,
  Image,
  Plus,
  Send,
  Users,
  Video,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { CollaboratorDialog } from "./AddCollaboratorDialog";
import { PostPreview } from "./PostPreviewModal";
import { useAuthStore } from "@/stores/authStore";

const CreatePostDialog = () => {
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollaboratorDialogOpen, setIsCollaboratorDialogOpen] =
    useState(false);
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState<PostCategory | "">("");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState<User[]>(
    []
  );
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{
    content: string | null;
    category: string | null;
    images: string | null;
    videos: string | null;
    submit: string | null;
    collaborators: string | null;
  }>({
    content: null,
    category: null,
    images: null,
    videos: null,
    submit: null,
    collaborators: null,
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: any) => {
    const files: File[] = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const isValid =
        file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024;
      if (!isValid) {
        setErrors((prev) => ({ ...prev, images: "Image must be under 2MB" }));
      }
      return isValid;
    });

    if (selectedImages.length + validFiles.length > 5) {
      setErrors((prev) => ({ ...prev, images: "Maximum 5 images allowed" }));
      return;
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
    setErrors((prev) => ({ ...prev, images: null }));
  };

  const handleVideoUpload = (event: any) => {
    const files: File[] = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const isValid =
        file.type.startsWith("video/") && file.size <= 20 * 1024 * 1024;
      if (!isValid) {
        setErrors((prev) => ({ ...prev, videos: "Video must be under 10MB" }));
      }
      return isValid;
    });

    if (selectedVideos.length + validFiles.length > 3) {
      setErrors((prev) => ({ ...prev, videos: "Maximum 3 videos allowed" }));
      return;
    }

    setSelectedVideos((prev) => [...prev, ...validFiles]);
    setErrors((prev) => ({ ...prev, videos: null }));
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const cleanTag = tagInput.trim().replace(/\s+/g, "");
    if (cleanTag && !postTags.includes(cleanTag)) {
      setPostTags((prev) => [...prev, cleanTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPostTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const removeCollaborator = (collaboratorId: string) => {
    setSelectedCollaborators((prev) =>
      prev.filter((c) => c?.id !== collaboratorId)
    );
  };



  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      setErrors((prev) => ({ ...prev, content: "Post content is required" }));
      return;
    }
    if (!postCategory) {
      setErrors((prev) => ({ ...prev, category: "Please select a category" }));
      return;
    }

    setIsCreating(true);
    setErrors({
      content: null,
      category: null,
      images: null,
      videos: null,
      submit: null,
      collaborators: null,
    });

    try {
      const formData = new FormData();
      formData.append("postContent", postContent);
      formData.append("postCategory", postCategory);
      formData.append("postTags", JSON.stringify(postTags));
      formData.append(
        "collaborators",
        JSON.stringify(selectedCollaborators.map((c) => c?.id))
      );

      selectedImages.forEach((image) => {
        formData.append("images", image); // Changed from `images` to images
      });

      selectedVideos.forEach((video) => {
        formData.append("videos", video); // Changed from `videos` to videos
      });
      await dispatch(createPost(formData));

      // Reset form
      setPostContent("");
      setPostCategory("");
      setPostTags([]);
      setSelectedImages([]);
      setSelectedVideos([]);
      setSelectedCollaborators([]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to create post. Please try again.",
      }));
    } finally {
      setIsCreating(false);
    }
  };

  const previewData = {
    author: user,
    postContent,
    postCategory: postCategory as PostCategory,
    postTags,
    postImageUrls: selectedImages.map((img) => URL.createObjectURL(img)),
    postVideoUrls: selectedVideos.map((vid) => URL.createObjectURL(vid)),
    collaborators: selectedCollaborators
      .filter((c): c is User => !!c && typeof c.id === "string")
      .map((c) => ({
        id: c?.id as string,
        email: c?.email ?? "",
        profilePicture: c?.profilePicture ?? null,
        fullName: c?.fullName ?? "",
        firstName: c?.firstName ?? "",
        lastName: c?.lastName ?? "",
        role: c?.role ?? UserRole.CITIZEN,
        mobile: c?.mobile ?? "",
        cityId: c?.cityId ?? "",
        isActive: c?.isActive ?? true,
        createdAt: c?.createdAt ?? "",
        updatedAt: c?.updatedAt ?? "",
      })),
    createdAt: new Date().toISOString(),
  };




  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4 z-50 bg-primary text-white flex items-center justify-center rounded-full w-14 h-14 overflow-hidden transition-all duration-300 group hover:w-44 hover:rounded-3xl">
            {" "}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:translate-x-0 group-hover:left-3.5">
              <Plus className="w-6 h-6 md:w-7 md:h-7" />
            </span>
            <span className="ml-0 max-w-0 opacity-0 group-hover:ml-2 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
              Create Post
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden ">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col lg:flex-row gap-6 overflow-hidden">
            {/* Form Section */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[70vh] pr-2">
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="What's happening?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                {errors.content && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.content}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={postCategory}
                  onValueChange={(value) =>
                    setPostCategory(value as PostCategory | "")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PostCategory.ALERT}>Alert</SelectItem>
                    <SelectItem value={PostCategory.NEWS}>News</SelectItem>
                    <SelectItem value={PostCategory.ANNOUNCEMENT}>
                      Announcement
                    </SelectItem>
                    <SelectItem value={PostCategory.DISCUSSION}>
                      Discussion
                    </SelectItem>
                    <SelectItem value={PostCategory.UPDATE}>Update</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tag (no spaces allowed)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
                {postTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {postTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        #{tag}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Media</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={selectedImages.length >= 5}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Images ({selectedImages.length}/5)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={selectedVideos.length >= 3}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Videos ({selectedVideos.length}/3)
                  </Button>
                </div>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="hidden"
                />

                {errors.images && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.images}
                  </p>
                )}
                {errors.videos && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.videos}
                  </p>
                )}

                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedVideos.length > 0 && (
                  <div className="space-y-2">
                    {selectedVideos.map((video, index) => (
                      <div key={index} className="relative">
                        <video
                          src={URL.createObjectURL(video)}
                          className="w-full h-32 object-cover rounded-md"
                          controls
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeVideo(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Collaborators</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCollaboratorDialogOpen(true)}
                  className="w-full"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Collaborators ({selectedCollaborators.length})
                </Button>

                {selectedCollaborators.length > 0 && (
                  <div className="space-y-2">
                    {selectedCollaborators.map((collaborator) => (
                      <div
                        key={collaborator?.id}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700  rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                            {getInitials(collaborator?.firstName ?? "User")}
                          </div>
                          <span className="text-sm font-medium">
                            {collaborator?.fullName}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            removeCollaborator(collaborator?.id ?? "")
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.submit && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.submit}
                </p>
              )}
            </div>

            {/* Preview Section */}
            <div className="flex-1 min-w-0">
              <div className="sticky top-0">
                <Label className="text-base font-semibold mb-3 block">
                  Preview
                </Label>
                <div className="border rounded-lg p-4  max-h-[70vh] overflow-y-auto">
                  {postContent ||
                    postCategory ||
                    postTags.length > 0 ||
                    selectedImages.length > 0 ||
                    selectedVideos.length > 0 ||
                    selectedCollaborators.length > 0 ? (
                    <PostPreview postData={previewData} />
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>Start typing to see your post preview...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost} disabled={isCreating}>
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CollaboratorDialog
        isOpen={isCollaboratorDialogOpen}
        onClose={() => setIsCollaboratorDialogOpen(false)}
        onSelect={setSelectedCollaborators}
        selectedCollaborators={selectedCollaborators}
      />
    </>
  );
};

export default CreatePostDialog;
