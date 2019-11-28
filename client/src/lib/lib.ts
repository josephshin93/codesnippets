import {
  Team,
  FormTeam,
  TeamMember,
  TeamMemberRoles,
  FormTeamMember,
} from '../store/types';


export const isEmpty = (obj: Object): boolean => {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};

export const formToTeam = (team: FormTeam): Team => {
  let teamMembers: TeamMember = {};
  let teamRoles: TeamMemberRoles = {};
  team.members.forEach((member) => {
    teamMembers[member.userId] = member.memberName;
    teamRoles[member.userId] = member.role;
  });

  return {
    name: team.name,
    members: teamMembers,
    roles: teamRoles,
    subscriptions: team.subscriptions,
  };
};

export const teamToForm = (team: Team): FormTeam => {
  return {
    name: team.name,
    members: Object.keys(team.members).map((userId): FormTeamMember => {
      return {
        userId,
        memberName: team.members[userId],
        role: team.roles[userId],
      };
    }),
    subscriptions: team.subscriptions,
  };
};
