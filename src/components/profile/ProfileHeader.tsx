import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import type { Post } from "@/types/postTypes";
import { Edit, LogOut, ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { ThemeToggleDropdown } from "../root/ThemeToggle";
import { useNavigate } from "@tanstack/react-router";

function ProfileHeader() {
    const { user, logout } = useAuthStore();
    const [_userPosts, setUserPosts] = useState<Post[]>([])
    const [_userMedia, setUserMedia] = useState<any[]>([])
    const [_loading, setLoading] = useState(true)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editData, setEditData] = useState({
        name: user?.fullName || "",
        email: user?.email || "",
        mobile: user?.mobile || "",
        profilePicture: null as File | null,
    })

    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchUserPosts()
            fetchUserMedia()
        }
    }, [user])

    const fetchUserPosts = async () => {
        try {
            const response = await fetch(`/api/users/${user?.id}/posts`)
            if (response.ok) {
                const data = await response.json()
                setUserPosts(data.posts)
            }
        } catch (error) {
            console.error("Failed to fetch user posts:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserMedia = async () => {
        try {
            const response = await fetch(`/api/users/${user?.id}/media`)
            if (response.ok) {
                const data = await response.json()
                setUserMedia(data.media)
            }
        } catch (error) {
            console.error("Failed to fetch user media:", error)
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append("name", editData.name)
            formData.append("email", editData.email)
            formData.append("mobile", editData.mobile)
            if (editData.profilePicture) {
                formData.append("profilePicture", editData.profilePicture)
            }

            const response = await fetch("/api/users/profile", {
                method: "PUT",
                body: formData,
            })

            if (response.ok) {
                toast({ title: "Profile updated!", description: "Your profile has been updated successfully" })
                setEditDialogOpen(false)
                // Refresh page to get updated user data
                window.location.reload()
            } else {
                throw new Error("Failed to update profile")
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update profile", variant: "destructive" })
        }
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }
    return (
        <div className="w-full">
            <button
                className="mb-4 flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors bg-white/80 dark:bg-black/60 rounded-full px-3 py-1 shadow border"
                onClick={() => navigate({ to: "/feed" })}
            >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back</span>
            </button>
            <Card className="w-full h-full">
                <CardHeader className="p-5 m-0 w-full h-full  flex justify-center items-center">
                    <div className="flex flex-col sm:flex-col md:flex-row sm:w-full md:w-full items-center md:justify-between sm:justify-center gap-2">
                        <div className="flex gap-5 ">
                            <Avatar className="h-20 w-20 border-2 bg-black dark:bg-white">
                                <AvatarImage src={user?.profilePicture || ""} />
                                <AvatarFallback className="text-xl">{user?.firstName?.charAt(0)?.toUpperCase() ?? ""}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-start items-start gap-2">
                                <div className="flex flex-col justify-start items-start">
                                    <h1 className="text-lg font-bold">{user?.fullName}</h1>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>
                                <Badge variant="outline">{user?.role.replace("_", " ")}</Badge>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-col">
                            <div className="flex gap-2">
                                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Profile</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-name">Name</Label>
                                                <Input
                                                    id="edit-name"
                                                    value={editData.name}
                                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-email">Email</Label>
                                                <Input
                                                    id="edit-email"
                                                    type="email"
                                                    value={editData.email}
                                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-mobile">Mobile</Label>
                                                <Input
                                                    id="edit-mobile"
                                                    value={editData.mobile}
                                                    onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-picture">Profile Picture</Label>
                                                <Input
                                                    id="edit-picture"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setEditData({ ...editData, profilePicture: e.target.files?.[0] || null })}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full">
                                                Update Profile
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Button variant="outline" size="sm" onClick={logout}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                            <div>
                                <ThemeToggleDropdown />
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}

export default ProfileHeader