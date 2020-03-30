/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        
        app.updateValue();
        // Update every 5s with setInterval
        setInterval(app.updateValue,10000);
        
    },
    
    updateValue: function() {
        // Make a HTTP request with Cordova Advanced HTTP Plugin
        cordova.plugin.http.get('https://emoncms.org/feed/value.json', {
            // Emoncms.org feed 166913 is a community hydro scheme near Llanberis North Wales
            id: '166913'
        }, { }, function(response) {
            // Update the heading with the live value
            document.getElementById("live").innerHTML = (response.data*0.001).toFixed(1)+" kW";
            // console.log(response.status);
        }, function(response) {
            // console.error(response.error);
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

app.initialize();
