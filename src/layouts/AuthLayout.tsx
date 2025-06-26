// src/layouts/AuthLayout.tsx
import AuthForms from "@/components/auth/AuthForms";
import Features from "../components/root/landing/FeaturesList";
import Footer from "../components/root/landing/Footer";
import Hero from "../components/root/landing/Hero";
// Remove the Navbar import since RootLayout already provides it

function AuthLayout() {
  return (
    <div className="min-h-screen w-screen scrollbar-hide flex flex-col justify-between overflow-hidden items-start bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* Remove the navbar section since RootLayout handles it */}

      <div className="flex flex-col lg:flex-row justify-center items-center w-full flex-1 overflow-hidden">
        {/** Hero and Features Section **/}
        <div className="w-full lg:w-[60%] h-full flex flex-col justify-around items-start gap-3 sm:gap-4 lg:gap-5 p-4 sm:p-6 lg:px-10 order-2 lg:order-1">
          <Hero />
          <Features />
        </div>

        {/** Auth Forms Section **/}
        <div className="w-full lg:w-[40%] h-full justify-center items-center overflow-hidden flex p-4 sm:p-6 lg:p-10 order-1 lg:order-2">
          <AuthForms />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AuthLayout;