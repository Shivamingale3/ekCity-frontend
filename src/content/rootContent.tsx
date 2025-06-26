import { RiGlobalLine } from "react-icons/ri";
import type { HeroItem } from "../types/rootTypes";
import { IoPeopleOutline } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";

export const heroItems: HeroItem[] = [
  {
    icon: <RiGlobalLine className="text-accent-700 w-[50px] h-[50px]" />,
    title: "All of Nagpur in One Place",
    subtitle:
      "Stay updated with local news, announcements, businesses, and events from across Nagpur.",
  },
  {
    icon: <IoPeopleOutline className="text-accent-700 w-[50px] h-[50px]" />,
    title: "Created by Locals for Locals",
    subtitle:
      "A platform built by Nagpur citizens for Nagpur citizens, with full support for Marathi, Hindi, and English.",
  },
  {
    icon: <LuBuilding2 className="text-accent-700 w-[50px] h-[50px]" />,
    title: "Official Information",
    subtitle:
      "Verified government bodies and authorized entities share official updates and important notifications.",
  },
];
