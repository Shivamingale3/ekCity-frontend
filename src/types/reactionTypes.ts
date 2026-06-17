export type GetReactionResponse = {
  status: string;
  message: string;
  data: {
    reaction: boolean;
  } | null;
};

export type PostReaction = {
  reaction: boolean;
};
