import {
  User,
  TeamMemberRoles,
  Team,
  Subscription,
} from './types';

export const users: Array<User> = [
  {
    id: '0',
    email: 'shinjos@oregonstate.com',
    firstName: 'Joseph',
    googleId: '106427510631496405227',
    picture: 'https://lh6.googleusercontent.com/-dxzwbr3gpvE/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rf34XF2zoCZMTvbYYPJeCUC5VwBcw/photo.jpg',
    lastName: 'Shin',
  },
  {
    id: '1',
    email: 'thor@gmail.com',
    firstName: 'Thor',
    googleId: '206427510631496405227',
    picture: 'https://lh6.googleusercontent.com/-dxzwbr3gpvE/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rf34XF2zoCZMTvbYYPJeCUC5VwBcw/photo.jpg',
    lastName: 'Odinson',
  },
  {
    id: '2',
    email: 'ironman@gmail.com',
    firstName: 'Tony',
    googleId: '306427510631496405227',
    picture: 'https://lh6.googleusercontent.com/-dxzwbr3gpvE/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rf34XF2zoCZMTvbYYPJeCUC5VwBcw/photo.jpg',
    lastName: 'Stark',
  },
  {
    id: '3',
    email: 'captainamerica@gmail.com',
    firstName: 'Steve',
    googleId: '406427510631496405227',
    picture: 'https://lh6.googleusercontent.com/-dxzwbr3gpvE/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rf34XF2zoCZMTvbYYPJeCUC5VwBcw/photo.jpg',
    lastName: 'Rogers',
  },
];

export const subscriptions: Array<Subscription> = [
  {
    title: 'Reminder',
    issueTime: 1500,
    issueDay: 5,
    content: 'This is a reminder',
  },
  {
    title: 'Digest',
    issueTime: 700,
    issueDay: 1,
    content: 'This is a weekly digest',
  },
]

let roles1: TeamMemberRoles = {};
roles1[users[0].id] = 'admin';
let roles2: TeamMemberRoles = {};
roles2[users[1].id] = 'admin';
roles2[users[2].id] = 'admin';
roles2[users[3].id] = 'member';

export const teams: Array<Team> = [
  {
      id: '0',
      name: 'Alpha Team',
      members: [
        users[0],
      ],
      roles: roles1,
      subscriptions: [
        subscriptions[0],
        subscriptions[1],
      ],
  },
  {
      id: '1',
      name: 'Beta Team',
      members: [
        users[0],
      ],
      roles: roles1,
      subscriptions: [
        subscriptions[0],
        subscriptions[1],
      ],
  },
  {
    id: '2',
    name: 'Avengers',
    members: [
      users[1],
      users[2],
      users[3],
    ],
    roles: roles2,
    subscriptions: [
      subscriptions[0],
      subscriptions[1],
    ],
  },
];