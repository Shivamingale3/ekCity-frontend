import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getBodiesToCollab } from "@/redux/thunks/feedThunk";
import { UserRole, type User } from "@/types/authTypes";
import { getInitials } from "@/utils/universalFunctions";
import { useEffect, useState, useMemo } from "react";

export const CollaboratorDialog = ({
  isOpen,
  onClose,
  onSelect,
  selectedCollaborators,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (collaborators: User[]) => void;
  selectedCollaborators: User[];
}) => {
  const [activeTab, setActiveTab] = useState("GOVERNMENT");
  const [tempSelected, setTempSelected] = useState([...selectedCollaborators]);
  const dispatch = useAppDispatch();
  const { loadingUsersToCollab, errorUsersToCollab, usersToCollab } =
    useAppSelector((state) => state.feed);

  // Sort and categorize users by role
  const categorizedUsers = useMemo(() => {
    if (!usersToCollab || usersToCollab.length === 0) {
      return { GOVERNMENT: [], PRIVATE: [] };
    }

    const government = usersToCollab
      .filter((user) => user.role === UserRole.GOVERNMENT)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));

    const privateBodies = usersToCollab
      .filter((user) => user.role === UserRole.PRIVATE)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));

    return {
      GOVERNMENT: government,
      PRIVATE: privateBodies,
    };
  }, [usersToCollab]);

  const handleCollaboratorChange = ({
    collaborator,
    checked,
  }: {
    collaborator: User;
    checked: boolean | string;
  }) => {
    if (checked) {
      setTempSelected((prev) => [...prev, collaborator]);
    } else {
      setTempSelected((prev) => prev.filter((c) => c?.id !== collaborator?.id));
    }
  };

  const handleConfirm = () => {
    onSelect(tempSelected);
    onClose();
  };

  useEffect(() => {
    dispatch(getBodiesToCollab(null));
  }, [dispatch]);

  // Reset temp selection when dialog opens/closes or selected collaborators change
  useEffect(() => {
    if (isOpen) {
      setTempSelected([...selectedCollaborators]);
    }
  }, [isOpen, selectedCollaborators]);

  const renderCollaboratorList = (collaborators: User[], roleType: "GOVERNMENT" | "PRIVATE") => {
    if (loadingUsersToCollab) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
        </div>
      );
    }

    if (errorUsersToCollab) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-red-500 mb-2">Error loading collaborators</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(getBodiesToCollab(null))}
          >
            Retry
          </Button>
        </div>
      );
    }

    if (collaborators.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No {roleType.toLowerCase()} collaborators available
          </p>
        </div>
      );
    }

    return collaborators.map((collaborator) => (
      <div
        key={collaborator?.id}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 "
      >
        <Checkbox
          checked={tempSelected.some((c) => c?.id === collaborator?.id)}
          onCheckedChange={(checked) =>
            handleCollaboratorChange({ collaborator, checked })
          }
        />
        <div className={`h-8 w-8 rounded-full ${roleType === "GOVERNMENT" ? "bg-blue-500" : "bg-amber-500"
          } flex items-center justify-center text-white text-xs font-medium`}>
          {getInitials(collaborator?.fullName ?? "")}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{collaborator?.fullName}</p>
          <p className="text-xs text-muted-foreground">
            {collaborator?.email}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Collaborators</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="GOVERNMENT">
              Government ({categorizedUsers.GOVERNMENT.length})
            </TabsTrigger>
            <TabsTrigger value="PRIVATE">
              Private ({categorizedUsers.PRIVATE.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="GOVERNMENT"
            className="space-y-3 max-h-60 overflow-y-auto"
          >
            {renderCollaboratorList(categorizedUsers.GOVERNMENT, "GOVERNMENT")}
          </TabsContent>

          <TabsContent
            value="PRIVATE"
            className="space-y-3 max-h-60 overflow-y-auto"
          >
            {renderCollaboratorList(categorizedUsers.PRIVATE, "PRIVATE")}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loadingUsersToCollab}
          >
            Add Selected ({tempSelected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};