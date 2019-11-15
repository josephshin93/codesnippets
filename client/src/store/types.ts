// interfaces
export interface User {
  email: string;
  firstName: string;
  googleId: string;
  picture: string;
  lastName: string;
  // / FIX: Plan to use Cloud Functions to add Personal team field on new user, then replace with <[teams: number]: string>
  teams?: any;
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

export interface Subscription {
  title: string;
  // FIXME: is there a better way to type issue time and day?
  issueTime: number;
  issueDay: number;
  // FIXME: content to just refers to the message, what about digest info?
  content?: string;
}

export interface Team {
  // FIXME: not sure if this is how firebase ids objects
  id: number;
  name: string;
  // FIXME: how do we mark admins?
  members: Array<User>;
  subscriptions: Array<Subscription>;  
}

export interface State {
  user: User | null;
  snippets: Array<Snippet> | null;
  teams: Array<Team> | null;
  selectedTeam: number;
}

// actions
export const FETCH_USER = 'fetch_user';
export const FETCH_SNIPPETS = 'fetch_snippets';
export const AUTHORIZE_USER = 'authorize_user';
export const FETCH_TEAMS = 'fetch_teams'
