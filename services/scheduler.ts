export {}
const Emailer = require('../services/Emailer');
const digestTemplate = require('../services/templates/digestTemplate');
const reminderTemplate = require('../services/templates/reminderTemplate');
const cron = require('node-schedule');
import { Subscription, Team, TeamMember, Teams } from '../types';

const emailJobs = <any>{};

module.exports = async function(firebase: any, team: Team) {
  
  console.log("\n===\n[DEBUG START] scheduler.ts\n===\n");
  console.log("[DEBUG] Team => ", team);

  for (let subscription of team.subscriptions) {
    scheduleEmail(team, subscription, firebase);
  }

  console.log("\n===\n[DEBUG END] scheduler.ts\n===\n");
}

async function scheduleEmail(team: Team, subscription: Subscription, firebase: any) {
    
  var { title, issueTime, issueDay, type } = subscription;

  // Create identifier for scheduler
  var jobName = `${team.name}-${type}`;

  // If previous subscription exists, delete it so no duplicates are created
  if (emailJobs[jobName]) delete emailJobs[jobName];
    
  // Set scheduler details
  var rule = new cron.RecurrenceRule();
  rule.dayOfWeek = [issueDay];
  rule.hour = issueTime;

  // FOR TESTING
  var date = new Date;
  var seconds = date.getSeconds() + 1;
  var minutes = date.getMinutes();
  rule.minute = minutes;
  rule.second = seconds;    
  // REMOVE AFTER TESTING
  
  // Schedule Email
  emailJobs[jobName] = cron.scheduleJob(rule, async function() {
    
    //  TODO: If the team documents store their own ids I can search for the users easier
    var users = await getTeamMembers(firebase);

    // Parse team member emails into recipients
    var recipients = createRecipientList(team, users);
    
    var subject = (type == 'digest') ? `Team ${capitalize(team.name)}'s Weekly Snippet Digest` : `What snippets did you make this week?`;

    // Create email with subject line, title, body, recipients
    var email = {
      subject,
      body: "body", // TODO still need this?
      recipients: recipients.map(email => ({ email: email.trim() })),
      dateSent: new Date(),
    };

    // Collect team snippets for digest
    // TODO only get past week's snippets
    var snippets = (type == 'digest') ? await getTeamSnippets(firebase, team) : null;
    var teamSnippets = (type == 'digest') ? collectSnippets(snippets) : null;

    // Assign appropriate email template
    var template = (type == 'digest') ? digestTemplate(email, team.name, teamSnippets) : reminderTemplate(email);

    // Create Emailer
    var emailer = new Emailer(email, template);

    try {
      console.log(`[CRON DEBUG] \"${jobName}\" just ran. Will run again at: `, emailJobs[jobName].nextInvocation()._date._d);
      // await emailer.send();
    } catch (err) {
      console.log("[CRON DEBUG] ERROR sending emails: ",err);
    }
  });
}

async function getTeamSnippets(firebase: any, team: Team) {
  // TODO only get past week's snippets && needs to be in CRON
  var lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  try {
    return await firebase.collection('snippets').where('team', '==', team.name)
      .where('timeCreated', '>', lastWeek).orderBy('timeCreated', 'desc').get();
  } catch(err) {
    console.log("Error getting team snippets" , err);
  }
}

async function getTeamMembers(firebase: any) {
    //  TODO: If the team documents store their own ids I can search for the users easier
    try {
      return await firebase.collection('users').get();
    } catch(err) {
      console.log('Error getting documents', err);
    }
}

function createRecipientList(team: Team, users: any) {
  var recipients = new Array<any>();
  users.forEach((doc: any) => {
    if (doc.id in team.members) 
      recipients.push(doc.data().email);      
  });
  return recipients;
}

function collectSnippets(snippets: any) {
  var teamSnippets = new Array<any>();
  snippets.forEach((doc:any) => {
    var desc = (doc.data().description.length > 35) 
                ? doc.data().description.slice(0, 32) + '...' 
                : doc.data().description;
    teamSnippets.push({
      title: doc.data().title,
      desc, 
      owner: doc.data().ownerName,
    })
  });
  return teamSnippets;
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

