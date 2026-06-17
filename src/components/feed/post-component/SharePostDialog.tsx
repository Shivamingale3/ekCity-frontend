import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface SharePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
}

export function SharePostDialog({ open, onOpenChange, postId }: SharePostDialogProps) {
  const postUrl = `${window.location.origin}/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Share Post
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2 pt-2">
          <Input
            value={postUrl}
            readOnly
            className="flex-1 text-sm"
          />
          <Button onClick={handleCopyLink} size="sm" className="gap-1">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
