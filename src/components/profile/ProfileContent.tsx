import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserPosts from "./UserPosts";

function ProfileContent() {
    return (
        <div className="w-full h-full flex flex-col">
            <Tabs defaultValue="posts" className="w-full h-full flex flex-col">
                {/* Tabs header - fixed at top */}
                <div className="flex-shrink-0 pb-4">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                        <TabsTrigger
                            value="posts"
                            className="text-sm font-medium"
                        >
                            My Posts
                        </TabsTrigger>
                        <TabsTrigger
                            value="media"
                            className="text-sm font-medium"
                        >
                            Media
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab content - takes remaining space */}
                <div className="flex-1 min-h-0">
                    <TabsContent
                        value="posts"
                        className="w-full h-full m-0 focus-visible:outline-none data-[state=active]:flex data-[state=active]:flex-col"
                    >
                        <UserPosts />
                    </TabsContent>

                    <TabsContent
                        value="media"
                        className="w-full h-full m-0 focus-visible:outline-none"
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-gray-400 text-2xl mb-2">🎬</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Media Gallery</h3>
                                <p className="text-sm text-gray-500">Your photos and videos will appear here.</p>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

export default ProfileContent;