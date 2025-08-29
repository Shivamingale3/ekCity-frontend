import type { Dispatch, SetStateAction } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AnonymousFilter = ({
  isAnonymous,
  setIsAnonymous,
}: {
  isAnonymous: boolean;
  setIsAnonymous: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="anonymous">Anonymous</Label>
      <Switch
        id="anonymous"
        checked={isAnonymous}
        onCheckedChange={setIsAnonymous}
      />
    </div>
  );
};

export default AnonymousFilter;
