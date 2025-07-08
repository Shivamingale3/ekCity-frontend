import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AuthFormSeparator from "./AuthFormSeparator";
import LoginForm from "./LoginForm";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import RegisterForm from "./RegisterForm";

function AuthForms() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-full max-h-[80vh] lg:max-h-full flex flex-col justify-between gap-4 sm:gap-5 items-center p-4 sm:p-6 lg:p-8 xl:p-10 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md overflow-y-auto custom-scrollbar">
      <Tabs
        defaultValue="login"
        onValueChange={(value) => setActiveTab(value as "login" | "register")}
        value={activeTab}
        className="w-full h-max"
      >
        <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4 h-10 sm:h-12 lg:h-14">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-black h-8 sm:h-10 lg:h-12 text-xs sm:text-sm"
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-black h-8 sm:h-10 lg:h-12 text-xs sm:text-sm"
          >
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm isLoading={isLoading} setIsLoading={setIsLoading} />
        </TabsContent>
      </Tabs>
      <AuthFormSeparator />
      <div className="w-full h-max">
        <SignInWithGoogleButton isLoading={isLoading} text={activeTab} />
      </div>
    </div>
  );
}

export default AuthForms;
