module.exports = function (message, team, snippets, content) {
    // TODO Remove after testing
    // snippets = [];
    return "\n    <html>\n        <body>\n            <div>\n                <p>Hi " + (team.charAt(0).toUpperCase() + team.slice(1)) + " Team,\n\n                " + (content !== null
        ? "<p>" + content + "</p>"
        : "") + "\n\n                " + (snippets === undefined || snippets.length === 0
        ? "<p>No snippets were made last week :(</p>"
        : "<p>Last week <b>" + snippets.length + "</b> snippets were made!</p>") + "\n                \n                <br>\n                " + (snippets === undefined || snippets.length === 0
        ? "<p>Visit our site to get a head start on next week :D</p>"
        : "<b style=\"font-size: 18px;\">Snippets</b>") + "\n                " + snippets.map(function (snippet) {
        return "<p><b>\n                                <span style=\"color:blue !important\">" + snippet.title + "</span> || \n                                " + snippet.desc + " || \n                                " + snippet.owner + "\n                            </b></p>";
    }).join('\n') + "\n                " + (snippets === undefined || snippets.length === 0
        ? ""
        : "<br><p>Keep up the good work!</p>") + "\n            </div>\n        </body>\n    </html>\n    ";
};
// <p>${message.body}</p> 
