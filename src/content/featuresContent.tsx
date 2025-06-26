import { IoDocumentTextOutline } from "react-icons/io5";
import type { FeatureItem } from "../types/rootTypes";
import { MdOutlineNotificationsActive } from "react-icons/md";

export const featuresContent: FeatureItem[] = [
  {
    icon: (
      <IoDocumentTextOutline className="text-accent-700 w-[50px] h-[50px]" />
    ),
    title: "Find What You Need",
    subtitle:
      "From lost and found announcements to local events and services - everything about Nagpur in one place.",
  },
  {
    icon: (
      <MdOutlineNotificationsActive className="text-accent-700 w-[50px] h-[50px]" />
    ),
    title: "Real-time Updates",
    subtitle:
      "Get notifications about important announcements and updates that matter to you and your area.",
  },
];
