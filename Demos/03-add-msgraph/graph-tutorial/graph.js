var graph = require('@microsoft/microsoft-graph-client');
var realFs = require('fs');
var sleep = require('sleep');
var https = require('https');
var http = require('http');
var fs = require('graceful-fs')
fs.gracefulify(realFs)

https.globalAgent.maxSockets = 500000;
http.globalAgent.maxSockets = 500000;

module.exports = {
    getUserDetails: async function(accessToken) {
        const client = getAuthenticatedClient(accessToken);

        const user = await
        client.api('/me').get();
        return user;
    },

    getEvents: async function(accessToken) {
        const client = getAuthenticatedClient(accessToken);

        const events = await
        client
            .api('/me/events')
            .select('subject,organizer,start,end')
            .orderby('createdDateTime DESC')
            .get();

        return events;
    },

        loadFiles: async function(accessToken, count) {
    const client = getAuthenticatedClient(accessToken);
        for (var i = 0; i < 10000; i++) {
            console.log("Writing = " + i);

            var fileName = 'test' + i + '.txt';
            var path = './' + fileName;

            var data = "O365 Testing " + i;

            var buffer = new Buffer(data + "some content\n");

            try {
                fs.writeFileSync(path, 'data ' + i, 'utf8');
            } catch(err) {
                // An error occurred
                console.error(err);
            }


            let stream = fs.createReadStream(path); //path to local file

            const events = await client
                .api('/me/drive/root:/jan21:/children/' + fileName +'/content')
                .putStream(stream, (err) => {
                console.log(err);
            });

        }

    }	



};

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

    return client;
}
