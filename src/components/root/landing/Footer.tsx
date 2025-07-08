import { Copyright } from "lucide-react";

const Footer = () => {
  return (
    <div className="w-full h-max border-t border-gray-300 dark:border-gray-800 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 p-2 sm:p-3">
      <div className="flex items-center gap-2">
        <Copyright
          className="text-light-text-primary dark:text-dark-text-primary"
          size={16}
        />
        <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs sm:text-sm font-medium text-center">
          2025 Ek City
        </p>
      </div>
      <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs font-medium text-center sm:hidden">
        Made by locals for the locals of Nagpur
      </p>
      <p className="text-light-text-tertiary dark:text-dark-text-tertiary text-xs font-medium text-center hidden sm:block">
        - Made by locals for the locals of Nagpur
      </p>
    </div>
  );
};

export default Footer;
