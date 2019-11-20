// interfaces
export interface User {
  email: string;
  firstName: string;
  googleId: string;
  picture: string;
  lastName: string;
  teams?: Array<string>;
}

export interface Snippet {
  title: string;
  content: string;
  description: string;
  ownerID: string;
  ownerPic: string;
  status: string;
  team: string;
  timeCreated: Date;
  totalComments: number;
  totalLikes: number;
}

export interface State {
  user: User | null;
}

// actions
export const FETCH_USER = "fetch_user";
export const FETCH_SNIPPETS = "fetch_snippets";
export const AUTHORIZE_USER = "authorize_user";
