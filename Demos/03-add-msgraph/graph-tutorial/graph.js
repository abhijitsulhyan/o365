var graph = require('@microsoft/microsoft-graph-client');
var fs = require('fs');

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
        for (var i = 0; i < 10; i++) {

            var fileName = 'test' + i + '.txt';
            var path = './' + fileName;

            var data = "O365 Testing " + i;

            var buffer = new Buffer(data + "some content\n");

            fs.open(path, 'w', function(err, fd) {
                if (err) {
                    throw 'error opening file: ' + err;
                }

                fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                    if (err) throw 'error writing file: ' + err;
                    fs.close(fd, function() {
                        console.log('file written');

                    })


                });
            });


            let stream = fs.createReadStream(path); //path to local file

            const events = await client
                .api('/me/drive/root:/jan18:/children/' + fileName +'/content')
                .putStream(stream, (err) => {
                console.log(err);
            })
            ;



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