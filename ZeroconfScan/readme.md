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

# Testing
to simulate a device on the network run this command on the dev laptop to see it shown in the scan results list:
```bash
$ avahi-publish-service "Dev Laptop" _http._tcp. 80 v=10.2.0 platform=emoncms path=/emoncms
```
> you can change the above value for `path` to the "real" path (if different).

[Docs](https://linux.die.net/man/1/avahi-publish-service)

## avahi utils
if `avahi-publish-service` not installed run:
```bash
$ sudo apt install avahi-utils
```