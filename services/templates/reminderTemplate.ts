module.exports = (message: any, team: string, content: string) => {
    return `
    <html>
        <body>
            <div>
                <p>Hi ${team.charAt(0).toUpperCase() + team.slice(1)} Team,</p>
                ${
                    content !== null
                    ? `<p>${content}</p><br>`
                    : `<b>Weekly Reminder</b><p>Here's a quick reminder to submit your snippets for this week!</p>`
                }
            </div>
        </body>
    </html>
    `;
};


// Add message body for reminders?
// <p>${message.body}</p>

// <b>So far this week you have created snippets</b>
// <p>Title || "Snippet text..."</p>
// <br>
// <p>More snippets online</p>
