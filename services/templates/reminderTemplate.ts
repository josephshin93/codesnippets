module.exports = (message: any) => {
    return `
    <html>
        <body>
            <div>
                <b>Weekly Reminder</b>
                <p>Here's a quick reminder to submit your snippets for this week!</p>     
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
