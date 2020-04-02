var app = {
    /**
     * DATA
     */
    scan_retries: 0,
    max_retries: 4,
    scan_counter: 0,
    accessPoints: [],
    currentSSID: '',
    repeat_seconds: 20,
    isWifiEnabled: false,
    /**
     * wait for device to be ready
     */
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    
    /**
     * runs once cordova triggers the `deviceready` event
     */
    onDeviceReady: function() {
        app.info(new Error().stack.match(/at (.*?) /)[1].replace('Object.','')+'()');
        
        this.getWifiEnabled();
        this.getConnectedSSID();
        this.showIpAddress();
        this.getWifiScanResults();

        document.addEventListener('reload', this.reload);
        document.addEventListener('connect', this.connect);

        // handle all clicks on document
        document.addEventListener('click', function (event) {
            // app.log(event.target);
            if (event.target.classList.contains('reload-button')) {
                event.preventDefault();
                document.dispatchEvent(new CustomEvent('reload'));
            } else if (event.target.classList.contains('list_item')) {
                event.preventDefault();
                document.dispatchEvent(new CustomEvent('connect', {detail: event.target.hash}));
            } else {
                // no matches. carry on as normal..
            }
        }, false);
        
        // check which wifi network we're on every 10s
        setInterval(function(){
            app.getConnectedSSID().then(app.showWifiNetworks());
            app.getWifiEnabled();
            app.showWifiConnected();
        }, 5000);

    },
    getWifiEnabled: function() {
        var state = WifiWizard2.isWifiEnabled();
        app.isWifiEnabled = state;
        app.info(state ? "WiFi is enabled": "WiFi is not available")
        return state;
    },
    showWifiConnected: function() {
        document.body.classList.toggle('online', app.isWifiEnabled);
    },
    /**
     * get the list of access points
     * store results in `app.accessPoints`
     * on error retry after short delay
     */
    getWifiScanResults: function() {
        app.info(new Error().stack.match(/at (.*?) /)[1].replace('Object.','')+'()');
        
        app.hideReload();
        this.scan()
        .then(function() {
            app.showWifiNetworks();
            app.scan_counter++;
            // re-scan after delay
            WifiWizard2.timeout(app.repeat_seconds*1000).then(function(){
                app.info("Restarting scan " + app.scan_counter++)
                app.getWifiScanResults();
            });
        })
        .catch(function(reason){ 
            // error running scan. clear auto refresh, wait and retry
            app.error(app.scan_retries + ". " + reason);
            WifiWizard2.timeout(2000).then(function(){
                app.scan_retries++;
                if (app.scan_retries > app.max_retries) {
                    app.log("");
                    app.info("Failed to scan. ;(");
                    app.error("===================== END");
                    app.scan_retries = 0;
                    app.showReload();
                    return;
                } else {
                    app.info("Restarting scan " + app.scan_counter++)
                    app.getWifiScanResults();
                }
            });
        });
    },
    /**
     * display the list of networks to choose from
     * items in list are selectable to enable changing wifi connection
     */
    showWifiNetworks: function() {
        app.info(new Error().stack.match(/at (.*?) /)[1].replace('Object.','')+'()');

        const list = document.getElementById("list");
        app.scan_retries = 0;
        list.innerHTML = '';
        app.log("showing the list...");
        const list_item = document.createElement("a");
        
        // format data as list item for each entry
        app.accessPoints.forEach((ap, index) => {
            app.log(index + ": " + ap.SSID);
            var item = list_item.cloneNode();
            var wps = ap.capabilities.match('WPS') ? ' WPS': '';
            var strength = "Unusable";
            var rating = 1;
            if(ap.level > -81) {
                strength = "Not Good";
                rating = 2;
            }
            if(ap.level > -71) {
                strength = "Okay";
                rating = 3;
            }
            if(ap.level > -67) {
                strength = "Very Good";
                rating = 4;
            }
            if(ap.level > -30) {
                strength = "Amazing";
                rating = 5;
            }
            var title = ap.SSID === "" ? `<span class="text-muted">${ap.BSSID}</span>`: ap.SSID;
            if (ap.SSID !== "") item.href = "#" + ap.SSID;
            item.classList.add('list_item');
            item.classList.toggle('active', ap.SSID === app.currentSSID);
            
            item.innerHTML = `<span>${title}<small class="badge text-muted">${wps}</small></span>
                                <progress max="5" value="${rating}">
                                    ${ap.level}dBm
                                </progress>`;
            list.append(item);
        });
    },

    showIpAddress: function() {
        const container = document.getElementById("ip-address");
        WifiWizard2.getWifiIP()
        .then(function(ip) {
            app.info(`getWifiIP() response = ${ip}`);
            if(container) container.innerText = `Connected as ${ip}`;
        })
        .catch(function(reason) { 
            app.error(reason);
            if(container) container.innerText = "Not connected";
        });
    },

    getConnectedSSID: function() {
        app.info(new Error().stack.match(/at (.*?) /)[1].replace('Object.','')+'()');
        return WifiWizard2.getConnectedSSID()
        .then(function(ssid) {
            app.info("getConnectedSSID() response = " + ssid);
            app.currentSSID = ssid;
            return ssid;
        })
        .catch(function(reason){ 
            app.error(reason);
        });
    },
    /**
     * request a scan and return a promise
     * throw errors if issue
     */
    scan: function() {
        app.info(new Error().stack.match(/at (.*?) /)[1].replace('Object.','')+'()');
        app.log("Scanning...");
        app.startLoader('Searching');
        return WifiWizard2.scan()
        .then(function(data) {
            // app.log("JSON: " + JSON.stringify(data));
            if (data.length === 0) throw "Empty Results";
            app.log("Found: " + data.length);
            app.accessPoints = data;
            app.stopLoader();
        })
        .catch(function(reason){ 
            // error
            throw "Error getting list: " + reason;
        })
    },
    log: function(text) {
        const container = document.getElementById('output');
        if (typeof container === "undefined") return;
        // var isAtBottom = container.scrollTop === container.scrollHeight;
        if(container) {
            container.innerHTML += container.innerHTML.length === 0 ? text: "<br>" + text;
            container.scrollTop = container.scrollHeight;
        }
    },
    error: function(text) {
        app.log("<mark>ERROR: " + text + "</mark>");
    },
    info: function(text) {
        app.log("<strong>INFO: " + text + "</strong>");
    },
    startLoader: function(action) {
        app.updateLoader(action||'Loading');
    },
    stopLoader: function() {
        this.updateLoader('');
    },
    updateLoader: function(text){
        const loader = document.getElementById("loader");
        if(loader) loader.innerHTML = text;
    },
    showReload: function() {
        app.stopLoader();
        var button = document.querySelector(".reload-button");
        if(button) button.classList.remove("d-none");
    },
    hideReload: function() {
        var button = document.querySelector(".reload-button");
        if(button) button.classList.add("d-none");
    },
    reload: function() {
        app.log("Reload requested");
        app.getWifiScanResults();
    },
    connect: function(event) {
        var ssid = event.detail.replace('#',''),
        bindAll = true,
        password = prompt(`Password for ${ssid}?`),
        algorithm = 'WPA',
        isHiddenSSID = false;

        app.log("Connection requested: " + ssid);
        
        WifiWizard2.connect(ssid, bindAll, password, algorithm, isHiddenSSID)
        .then(function(){
            app.info(`Connected succesfully to ${ssid}`);
            app.getConnectedSSID();
            app.showWifiNetworks();
        })
        .catch(function(reason){
            app.error(reason);
        })
    }
};

app.initialize();


// Display alert if js error encountered
window.onerror = function(msg, source, lineno, colno, error) {
    app.stopLoader();

    if (msg.toLowerCase().indexOf("script error") > -1) {
        app.error("Script Error: See Browser Console for Detail");
    } else {
        var maskedSource = source;
        var messages = [
            "JS Error",
            '-------------',
            "Message: " + msg,
            "Line: " + lineno,
            "Column: " + colno,
            '-------------'
        ];
        if (Object.keys(error).length > 0) {
            messages.push("Error: " + JSON.stringify(error));
        }
        app.error(messages.join("<br>"));
    }
    return true; // true == prevents the firing of the default event handler.
}
