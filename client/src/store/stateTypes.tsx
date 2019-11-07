

export interface User {
    email: string;
    firstName: string;
    googleId: string;
    picture: string;
    lastName: string;
}

export interface State {
    user: User | null;
}