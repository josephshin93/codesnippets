// interfaces

export interface UserTeam {
  teamId: string;
  teamName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  googleId: string;
  picture: string;
  lastName: string;
  // / FIX: Plan to use Cloud Functions to add Personal team field on new user, then replace with <[teams: number]: string>
  teams?: Array<UserTeam>;
}

export interface Users {
  [id: string]: User;
}

export interface Snippet {
  id: string;
  title: string;
  content: string;
  description: string;
  ownerID: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPicture: string;
  likes: Array<string>;
  status: string;
  team: UserTeam;
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
  type: string;
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
  name: string;
  members: TeamMember;
  roles: TeamMemberRoles;
  subscriptions: Array<Subscription>;
}

export interface FormTeamMember {
  userId: string;
  memberName: string;
  role: string;
}

export interface FormTeam {
  name: string;
  members: Array<FormTeamMember>;
  subscriptions: Array<Subscription>;
}

export interface Teams {
  [teamId: string]: Team;
}

export interface Comment {
  id: string;
  googleId: string;
  userPicture: string;
  userFirstName: string;
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
  selectedComment: string;
}

// actions
export const FETCH_USER = "fetch_user";
export const FETCH_USERS = "fetch_users";
export const FETCH_SNIPPETS = "fetch_snippets";
export const FETCH_SNIPPET = "fetch_snippet";
export const SEARCH_SNIPPETS = "search_snippets";
export const FETCH_COMMENTS = "fetch_comments";
export const LIKE_SNIPPET = "like_snippet";
export const DISLIKE_SNIPPET = "dislike_snippet";
export const ADD_COMMENT = "add_comment";
export const AUTHORIZE_USER = "authorize_user";
export const FETCH_TEAMS = "fetch_teams";
export const SELECT_TEAM = "select_team";
export const SELECT_WEEK = "select_week";
export const SELECT_COMMENT = "select_comment";
export const ADD_TEAM = "add_team";
export const EDIT_TEAM = "edit_team";
