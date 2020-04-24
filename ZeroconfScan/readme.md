#  local emoncms device scan

cordova app to scan local network for zeroconf devices of "_http." and "_workstation." type.

this approach doesn't require to access the individual api enpoints for every possible node in the subnet.

offers to re-scan after 6 seconds.

[<img src="screenshot.png?raw=true" width="350"/>](screenshot.png?raw=true)


# Quick run
- `$ git clone [this repo]`
- `$ cd [this repo]`
- `$ cordova run android`
- app should run on connected android device

# Cordova plugins:
- `$ cordova plugin add cordova-plugin-zeroconf`
  - >Enables the app to publish and browse zeroconf devices
  - [Docs](https://ionicframework.com/docs/native/zeroconf)
  - [Github](https://github.com/becvert/cordova-plugin-zeroconf)

# Problems
- zeroconf scan not always succesful. rescans sometimes required to see every device.
- some networks will have lots of different devices listed. Would be useful to filter on some known `txtRecord` value?..
- for more help setting up your system to test cordova apps follow [this readme](https://github.com/emrysr/wifiscan)

# Testing
to simulate a device on the network run this command on the dev laptop to see it shown in the scan results list:
```bash
$ avahi-publish-service "Dev Laptop" _http._tcp. 80 v=10.2.0 platform=emoncms path=/emoncms
```
> you can change the above value for `path` to the "real" path (if different).

[Docs](https://linux.die.net/man/1/avahi-publish-service)

# Testing in Emulator
If you're vs code to [live-preview your code in a browser][1], here are 6 different example responses from the `zeroconf.watch()` function you can use as an example api responses:-
```JSON
{"action":"added","service":{"domain":"local.","type":"_http._tcp.","name":"smartplug5339","port":0,"hostname":"smartplug5339._http._tcp.local.","ipv4Addresses":[],"ipv6Addresses":[],"txtRecord":{"smartplug5339._http._tcp.local.":"true"}}}
{"action":"resolved","service":{"domain":"local.","type":"_http._tcp.","name":"smartplug5339","port":80,"hostname":"","ipv4Addresses":["192.168.1.78"],"ipv6Addresses":[],"txtRecord":{}}}
{"action":"added","service":{"domain":"local.","type":"_http._tcp.","name":"openevse-8970","port":0,"hostname":"openevse-8970._http._tcp.local.","ipv4Addresses":[],"ipv6Addresses":[],"txtRecord":{"openevse-8970._http._tcp.local.":"true"}}}
{"action":"resolved","service":{"domain":"local.","type":"_http._tcp.","name":"openevse-8970","port":80,"hostname":"","ipv4Addresses":["192.168.1.81"],"ipv6Addresses":[],"txtRecord":{}}}
{"action":"resolved","service":{"domain":"local.","type":"_workstation._tcp.","name":"emonpi [b8:27:b8:27:b8:27]","port":9,"hostname":"","ipv4Addresses":["192.168.1.186"],"ipv6Addresses":["fe80::b03c:3354:7105:7555"],"txtRecord":{}}}
{"action":"added","service":{"domain":"local.","type":"_workstation._tcp.","name":"emonpi [b8:27:b8:27:b8:27]","port":0,"hostname":"emonpi [b8:27:b8:27:b8:27]._workstation._tcp.local.","ipv4Addresses":[],"ipv6Addresses":[],"txtRecord":{"emonpi [b8:27:b8:27:b8:27]._workstation._tcp.local.":"true"}}}
```
> you could use the `avahi-discover` terminal command to see your actual results and change the above examples to match

## avahi utils
if `avahi-publish-service` not installed run:
```bash
$ sudo apt install avahi-utils
```


[1]: <https://docs.microsoft.com/en-us/visualstudio/cross-platform/tools-for-cordova/run-your-app/simulate-in-browser?view=toolsforcordova-2017>