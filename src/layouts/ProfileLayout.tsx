import ProfileContent from "@/components/profile/ProfileContent";
import ProfileHeader from "@/components/profile/ProfileHeader";

function ProfileLayout() {
    return (
        <div className="w-full h-full flex flex-col ">
            {/* Fixed header section */}
            <header className="flex-shrink-0">
                <div className="p-4 sm:p-6">
                    <ProfileHeader />
                </div>
            </header>

            {/* Main content area - takes remaining height */}
            <main className="flex-1 min-h-0 overflow-hidden">
                <div className="w-full h-full p-4 sm:p-6">
                    <ProfileContent />
                </div>
            </main>
        </div>
    );
}

export default ProfileLayout;