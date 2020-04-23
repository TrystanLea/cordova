var app = {
    results: [],
    button: document.querySelector("#button") || document.createElement('div'),
    container: document.querySelector("#results") || document.createElement('div'),
    status: document.querySelector("#status") || document.createElement('div'),
    scanTimeout: 8000,

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        app.zeroconfScan()
            .then(app.displayResults)
            .catch(app.displayError)
            .finally(app.finishScan);

        document.addEventListener('click', function (event) {
            if (event.target.matches('#button')) {
                event.preventDefault();
                app.zeroconfScan()
                    .then(app.displayResults)
                    .catch(app.displayError)
                    .finally(app.finishScan);
            }
        }, false);

        this.container.addEventListener('click', function(event) {
            event.preventDefault();
            if(event.target.tagName==='A') {
                url = event.target.href;
                window.open(url,'_blank', 'location=yes');
            }
        })
    },
    displayError: function(error) {
        app.status.style.display = "inline";
        app.status.style.innerText = "Error";
        console.error(error);
    },
    finishScan: function() {
        // show re-scan button
        app.button.style.display = 'inline-block';
        app.status.style.display = 'none';
    },
    onDeviceFound: function(device) {
        app.results.push(device);
        app.displayResults(app.results);
    },
    zeroconfScan: function() {
        var zeroconf = cordova.plugins.zeroconf;
        app.results = [];
        return new Promise((resolve, reject) => {
            zeroconf.reInit(function() {
                zeroconf.registerAddressFamily = 'ipv4';
                zeroconf.watchAddressFamily = 'ipv4';
                app.button.style.display = 'none';
                app.status.style.display = 'inline';
    
                zeroconf.watch('_workstation._tcp.', 'local.', app.readResults);
                zeroconf.watch('_http._tcp.', 'local.', app.readResults);
    
                setTimeout(function() {
                    if(app.results.length > 0) {
                        zeroconf.close(
                            ()=>resolve(app.results),
                            ()=>reject("Unable to close zeroconf browser")
                        );
                    } else {
                        reject("No devices found");
                    }
                }, app.scanTimeout);
            });
        });
    },
    readResults: function(result) {
        var action = result.action;
        var service = result.service;
        if (action == 'resolved') {
            var ip = service.ipv4Addresses[0];
            var name = service.name.match(/(.*) \[.*\]*/) || [];
            var protocol = service.txtRecord.https ? 'https://': 'http://';
            var platform = service.txtRecord.platform || '';
            var version = service.txtRecord.v || '';
            var path = service.txtRecord.path || '';
            var url = protocol + ip + path;
            var device = {
                name: name[1] || service.name,
                ip: ip,
                platform: platform,
                version: version,
                path: path,
                url: url
            }
            if(ip) app.onDeviceFound(device);
        }
    },
    displayResults: function(results){
        app.status.style.display = 'none';
        app.container.innerHTML = "";
        results.forEach(result => {
            var item = document.createElement('a');
            item.innerText = result.name;
            if(result.ip) item.innerText += ` (${result.ip})`;
            item.href = result.url;
            app.container.append(item);
        });
    }
};

app.initialize();
