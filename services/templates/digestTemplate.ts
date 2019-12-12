module.exports = (message: string, team: string, snippets: any, content: string) => {
    // TODO Remove after testing
    // snippets = [];
    return `
    <html>
        <body>
            <div>
                <p>Hi ${team.charAt(0).toUpperCase() + team.slice(1)} Team,

                ${
                    content !== null
                    ? `<p>${content}</p>`
                    : ``
                }

                ${
                    snippets === undefined || snippets.length === 0 
                    ? `<p>No snippets were made last week :(</p>`
                    : `<p>Last week <b>${snippets.length}</b> snippets were made!</p>`
                }
                
                <br>
                ${  // 
                    snippets === undefined || snippets.length === 0 
                    ? `<p>Visit our site to get a head start on next week :D</p>`
                    : `<b style="font-size: 18px;">Snippets</b>`
                }
                ${  // Map out the snippets if any were made
                    snippets.map( (snippet: any) => {
                        return `<p><b>
                                <span style="color:blue !important">${snippet.title}</span> || 
                                ${snippet.desc} || 
                                ${snippet.owner}
                            </b></p>`
                    }).join('\n')
                }
                ${  // 
                    snippets === undefined || snippets.length === 0 
                    ? ``
                    : `<br><p>Keep up the good work!</p>`
                }
            </div>
        </body>
    </html>
    `;
};

// <p>${message.body}</p> 