import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserPosts from "./UserPosts";
import UserMedia from "./UserMedia";

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
                        <UserMedia />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

export default ProfileContent;