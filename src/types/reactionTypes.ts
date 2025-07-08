export type GetReactionResponse = {
  status: string;
  message: string;
  data: PostReaction;
};

export type PostReaction = {
  id: string;
  userId: string;
  postId: string;
  commentId: string | null;
  reaction: boolean;
  createdAt: string;
  updatedAt: string;
};
