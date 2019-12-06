"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Emailer = require('../services/Emailer');
var digestTemplate = require('../services/templates/digestTemplate');
var reminderTemplate = require('../services/templates/reminderTemplate');
var cron = require('node-schedule');
var emailJobs = {};
module.exports = {
    scheduleSubscriptions: function (firebase, team) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, scheduleSubscriptions(firebase, team)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    scheduleAllOnStart: function (firebase) {
        return __awaiter(this, void 0, void 0, function () {
            var teams, name;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, firebase.collection('teams').get()];
                    case 1:
                        teams = _a.sent();
                        teams.forEach(function (doc) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // console.log(doc.data().name + " =>", doc.data());
                                        return [4 /*yield*/, scheduleSubscriptions(firebase, doc.data())];
                                        case 1:
                                            // console.log(doc.data().name + " =>", doc.data());
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        console.log("The following emails were scheduled on server start: ");
                        for (name in emailJobs)
                            console.log(name);
                        return [2 /*return*/];
                }
            });
        });
    }
};
function scheduleSubscriptions(firebase, team) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, subscription;
        return __generator(this, function (_b) {
            // console.log("\n===\n[DEBUG START] scheduler.ts scheduleSubscriptions\n===\n");
            // console.log("[DEBUG] Team => ", team.name);
            for (_i = 0, _a = team.subscriptions; _i < _a.length; _i++) {
                subscription = _a[_i];
                scheduleEmail(team, subscription, firebase);
            }
            return [2 /*return*/];
        });
    });
}
function scheduleEmail(team, subscription, firebase) {
    return __awaiter(this, void 0, void 0, function () {
        var title, issueTime, issueDay, type, content, jobName, rule, date, seconds, minutes, week;
        return __generator(this, function (_a) {
            title = subscription.title, issueTime = subscription.issueTime, issueDay = subscription.issueDay, type = subscription.type, content = subscription.content;
            if (type == null || issueDay == null || issueDay == null) {
                console.error("[ERROR] The following subscription for team " + team.name + " is malformed =>", subscription, "\n");
                return [2 /*return*/];
            }
            jobName = team.name + "-" + type;
            // If previous subscription exists, delete it so no duplicates are created
            if (emailJobs[jobName])
                delete emailJobs[jobName];
            rule = new cron.RecurrenceRule();
            rule.dayOfWeek = [parseInt(issueDay)];
            rule.hour = parseInt(issueTime.toString().slice(0, -2));
            date = new Date;
            seconds = date.getSeconds() + 5;
            minutes = date.getMinutes();
            rule.minute = minutes;
            rule.second = seconds;
            // REMOVE AFTER TESTING
            console.log(rule);
            // Schedule Email
            emailJobs[jobName] = cron.scheduleJob(rule, function () {
                return __awaiter(this, void 0, void 0, function () {
                    var users, recipients, subject, email, snippets, _a, teamSnippets, template, emailer, err_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTeamMembers(firebase)];
                            case 1:
                                users = _b.sent();
                                recipients = createRecipientList(team, users);
                                subject = (type == 'digest') ? "Team " + capitalize(team.name) + "'s Weekly Snippet Digest" : "What snippets did you make this week?";
                                email = {
                                    subject: title,
                                    body: "body",
                                    recipients: recipients.map(function (email) { return ({ email: email.trim() }); }),
                                    dateSent: new Date(),
                                };
                                if (!(type == 'digest')) return [3 /*break*/, 3];
                                return [4 /*yield*/, getTeamSnippets(firebase, team)];
                            case 2:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = null;
                                _b.label = 4;
                            case 4:
                                snippets = _a;
                                teamSnippets = (type == 'digest') ? collectSnippets(snippets) : null;
                                template = (type == 'digest') ? digestTemplate(email, team.name, teamSnippets, content) : reminderTemplate(email, team.name, content);
                                emailer = new Emailer(email, template);
                                _b.label = 5;
                            case 5:
                                _b.trys.push([5, 7, , 8]);
                                console.log("[CRON DEBUG] \"" + jobName + "\" just ran. Will run again at: ", emailJobs[jobName].nextInvocation()._date._d);
                                return [4 /*yield*/, emailer.send()];
                            case 6:
                                _b.sent();
                                return [3 /*break*/, 8];
                            case 7:
                                err_1 = _b.sent();
                                console.log("[CRON DEBUG] ERROR sending emails => ", err_1.response.body.errors);
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                });
            });
            week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            console.log("Scheduled " + jobName + " at " + issueTime + " on " + week[parseInt(issueDay)]);
            return [2 /*return*/];
        });
    });
}
function getTeamSnippets(firebase, team) {
    return __awaiter(this, void 0, void 0, function () {
        var lastWeek, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastWeek = new Date();
                    lastWeek.setDate(lastWeek.getDate() - 7);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firebase.collection('snippets').where('team', '==', team.name)
                            .where('timeCreated', '>', lastWeek).orderBy('timeCreated', 'desc').get()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_2 = _a.sent();
                    console.log("Error getting team snippets", err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getTeamMembers(firebase) {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, firebase.collection('users').get()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_3 = _a.sent();
                    console.log('Error getting documents', err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createRecipientList(team, users) {
    var recipients = new Array();
    users.forEach(function (doc) {
        if (doc.id in team.members)
            recipients.push(doc.data().email);
    });
    return recipients;
}
function collectSnippets(snippets) {
    var teamSnippets = new Array();
    snippets.forEach(function (doc) {
        var desc = (doc.data().description.length > 35)
            ? doc.data().description.slice(0, 32) + '...'
            : doc.data().description;
        teamSnippets.push({
            title: doc.data().title,
            desc: "",
            owner: doc.data().ownerName,
        });
    });
    return teamSnippets;
}
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
