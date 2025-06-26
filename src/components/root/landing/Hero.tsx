import { heroItems } from "@/content/rootContent";
import HeroItemTile from "./HeroItemTile";

function Hero() {
  return (
    <div className="w-full h-max flex flex-col justify-start items-start gap-4 sm:gap-6 lg:gap-10">
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-light-text-primary dark:text-dark-text-primary leading-tight">
        Welcome to Ek City
      </p>
      <p className="text-sm sm:text-base lg:text-lg font-medium text-light-text-tertiary dark:text-dark-text-tertiary leading-relaxed">
        Connect with your city like never before. Get the latest updates,
        announcements, and information from trusted sources in Nagpur.
      </p>
      <div className="w-full h-max flex flex-col justify-start items-start gap-3 sm:gap-4 lg:gap-5">
        {heroItems.map((item) => (
          <HeroItemTile key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Hero;
