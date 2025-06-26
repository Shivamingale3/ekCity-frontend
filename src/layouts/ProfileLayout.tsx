import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function ProfileLayout() {
    return (
        <div className="w-full h-full ">
            <Tabs className="w-full h-full" defaultValue={"profile"}>
                <TabsList className="w-full">
                    <TabsTrigger
                        className="w-full"
                        value={"profile"}
                    >Profile
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-full"
                        value={"myPosts"}
                    >My Posts
                    </TabsTrigger>
                </TabsList>
                <TabsContent className="w-full h-full" value={"profile"} >
                    <div>Profile</div>
                </TabsContent>
                <TabsContent className="w-full h-full" value={"myPosts"} >
                    <div>My Posts</div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ProfileLayout