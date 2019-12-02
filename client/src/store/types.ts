// interfaces
export interface User {
  email: string;
  firstName: string;
  googleId: string;
  picture: string;
  lastName: string;
  // / FIX: Plan to use Cloud Functions to add Personal team field on new user, then replace with <[teams: number]: string>
  teams?: Array<string>;
}

export interface Users {
  [id: string]: User;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  description: string;
  ownerId: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPicture: string;
  status: string;
  team: string;
  week: string;
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

export interface TeamMemberRoles {
  [key: string]: string;
}

export interface TeamMember {
  [userId: string]: string;
}

export interface Team {
  id: string;
  name: string;
  // FIXME: how do we mark admins?
  members: TeamMember;
  roles: TeamMemberRoles;
  subscriptions: Array<Subscription>;
}

export interface Teams {
  [teamId: string]: Team;
}

export interface Comment {
  id: string;
  googleId: string;
  userPicture: string;
  comment: string;
  snippetId: string;
  timeCreated: Date;
}

export interface State {
  user: User | null;
  users: Array<User> | null;
  snippets: Array<Snippet> | null;
  snippet: Snippet | null;
  comments: Array<Comment> | null;
  teams: Teams | null;
  selectedTeam: string;
  selectedWeek: any;
}

// actions
export const FETCH_USER = "fetch_user";
export const FETCH_USERS = "fetch_users";
export const FETCH_SNIPPETS = "fetch_snippets";
export const FETCH_SNIPPET = "fetch_snippet";
export const FETCH_COMMENTS = "fetch_comments";
export const AUTHORIZE_USER = "authorize_user";
export const FETCH_TEAMS = "fetch_teams";
export const SELECT_TEAM = "select_team";
export const SELECT_WEEK = "select_week";
