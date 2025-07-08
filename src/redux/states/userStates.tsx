import type { UserInitialStates } from "@/types/userTypes";

export const userInitialStates: UserInitialStates = {
    error: null,
    userPostsLoading: false,
    userPosts: [],
    userPostPagination: null,
    userMedia: null,
    userMediaLoading: false,
    userMediaError: null,
    updateUserLoading: false,
    updateUserError: null,
    updateUserSuccess: false
}