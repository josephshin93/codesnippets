import {
  User,
  TeamMemberRoles,
  Teams,
  Subscription,
  Snippet,
} from '../types';

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

export const teams: Teams = {
  '0': {
      id: '0',
      name: 'Alpha Team',
      members: {
        '0': 'Joseph Shin',
      },
      roles: roles1,
      subscriptions: [
        subscriptions[0],
        subscriptions[1],
      ],
  },
  '1': {
      id: '1',
      name: 'Beta Team',
      members: {
        '0': 'Joseph Shin',
      },
      roles: roles1,
      subscriptions: [
        subscriptions[0],
        subscriptions[1],
      ],
  },
  '2': {
    id: '2',
    name: 'Avengers',
    members: {
      '1': 'Thor Odinson',
      '2': 'Tony Stark',
      '3': 'Steve Rogers',
    },
  roles: roles2,
    subscriptions: [
      subscriptions[0],
      subscriptions[1],
    ],
  },
};

export const snippets: Array<Snippet> = [
  {
    title: 'a',
    content: 'a',
    description: 'a',
    ownerID: '102961147317667963053',
    ownerName: 'Wan Ashraf Wan Ahmad Ezani',
    ownerPic: '',
    status: 'open',
    team: 'Personal',
    timeCreated: new Date(1573750166),
    totalComments: 0,
    totalLikes: 0,
  },
  {
    title: 'new test',
    content: 'new test',
    description: 'new test',
    ownerID: '104593608638718033745',
    ownerName: 'Marc Christopher Tibbs',
    ownerPic: '',
    status: 'open',
    team: 'new test',
    timeCreated: new Date(1573561736),
    totalComments: 0,
    totalLikes: 0,
  },
];
