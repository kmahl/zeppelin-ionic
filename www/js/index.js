var speedControl = document.getElementById("speedControl");
var directionControl = document.getElementById("directionControl");
var settings = document.getElementById("settings");
// joystick configuration
var base = document.getElementById("base");
var joystick = document.getElementById("joystick");
var baseRadius = 40;
var joystickRadius = 40;
/* joystick */
joystick.style.width = joystickRadius * 2 + "px";
joystick.style.height = joystickRadius * 2 + "px";
joystick.style.top = baseRadius * 2 - joystickRadius + "px";
joystick.style.left = baseRadius * 2 - joystickRadius + "px";
/* base */
base.style.width = baseRadius * 2 * 2 + "px";
base.style.height = baseRadius * 2 * 2 + "px";
var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;



var app = {
    macAddress: "3C:71:BF:FE:52:CA", // get your mac address from bluetoothSerial.list
    chars: "",
    baseSpeed: 50,
    baseDirection: 50,
    /*
        Application constructor
     */
    initialize: function() {
        this.bindEvents();
        console.log("Starting zeppelin app");
    },
    /*
        bind any events that are required on startup to listeners:
    */
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        connectButton.addEventListener('touchend', app.manageConnection, false);
        settings.addEventListener('touchend', app.showBluetoothSettings, false);

        speedControl.oninput = e => app.write(e.target.id);
        speedControl.ontouchend = e => app.returnControl(e.target.id);

        //  directionControl.oninput = e => app.write(e.target.id);
        //  directionControl.ontouchend = e => app.returnControl(e.target.id);

        /* bind joystick */
        joystick.ontouchstart = e => app.touchStart(e);
        document.getElementById("test").ontouchend = e => app.a(e);
    },
    a: (e) => {
        document.getElementById("test").innerText = "Tocado"
    },
    /*
        this runs when the device is ready for user interaction:
    */
    onDeviceReady: function() {
        // check to see if Bluetooth is turned on.
        // this function is called only
        //if isEnabled(), below, returns success:
        var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {
                    // app.display(JSON.stringify(results));
                },
                function(error) {
                    app.display(JSON.stringify(error));
                }
            );
        }

        // if isEnabled returns failure, this function is called:
        var notEnabled = function() {
            app.display("Bluetooth is not enabled.")
        }

        // check if Bluetooth is on:
        bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
        );
    },
    /*
        Connects if not connected, and disconnects if connected:
    */
    manageConnection: function() {

        // connect() will get called only if isConnected() (below)
        // returns failure. In other words, if not connected, then connect:
        var connect = function() {
            // if not connected, do this:
            // clear the screen and display an attempt to connect
            app.clear();
            app.display("Attempting to connect. ");
            // attempt to connect:
            bluetoothSerial.connect(
                app.macAddress, // device to connect to
                app.openPort, // start listening if you succeed
                app.showError // show the error if you fail
            );
        };

        // disconnect() will get called only if isConnected() (below)
        // returns success  In other words, if  connected, then disconnect:
        var disconnect = function() {
            app.display("attempting to disconnect");
            // if connected, do this:
            bluetoothSerial.disconnect(
                app.closePort, // stop listening to the port
                app.showError // show the error if you fail
            );
        };

        // here's the real action of the manageConnection function:
        bluetoothSerial.isConnected(disconnect, connect);
    },
    /*
        subscribes to a Bluetooth serial listener for newline
        and changes the button:
    */
    openPort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Connected to: " + app.macAddress);
        // change the button's name:
        connectButton.classList.add("on");

        //document.getElementById("message").classList.add("hide");
        // document.getElementById("controls").classList.remove("hide");
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        bluetoothSerial.subscribe('\n', function(data) {
            app.clear();
            app.display(data);
        });
    },

    /*
        unsubscribes from any Bluetooth serial listener and changes the button:
    */
    closePort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Disconnected from: " + app.macAddress);
        // change the button's name:
        connectButton.classList.remove("on");
        // unsubscribe from listening:
        bluetoothSerial.unsubscribe(
            function(data) {
                /*  app.clear();
                 app.display(data); */
            },
            app.showError
        );
    },
    /*
        appends @error to the message div:
    */
    showError: function(error) {
        app.display(error);
    },

    /*
        appends @message to the message div:
    */
    display: function(message) {
        app.clear();
        var display = document.getElementById("message"), // the message div    // a line break
            label = document.createTextNode(message); // create the label
        // add a line break
        display.appendChild(label); // add the message node
    },
    /*
        clears the message div:
    */
    clear: function() {
        var display = document.getElementById("message");
        display.innerHTML = "";
    },

    showBluetoothSettings: function() {
        bluetoothSerial.showBluetoothSettings();
    },

    write: (control) => {
        var value = document.getElementById(control).value
        var type = control === 'speedControl' ? 'S' : 'D';
        var base = control === 'speedControl' ? 'baseSpeed' : 'baseDirection';
        if (app[base] !== value) {
            app[base] = value
            bluetoothSerial.write(type + value, function(data) {

            });
        }
    },
    returnControl: function(control) {
        document.getElementById(control).value = 50;
        var type = control === 'speedControl' ? 'writeSpeed' : 'writeDirection';
        app.write(control);
    },
    touchStart: e => {
        document.getElementById("test").innerText = "click"
        e.preventDefault();

        // get the mouse cursor position at startup:
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        joystick.ontouchend = e => app.touchEnd(e);
        // call a function whenever the cursor moves:
        joystick.ontouchmove = e => app.touchMove(e);
    },
    touchMove: e => {
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.touches[0].clientX;
        pos2 = pos4 - e.touches[0].clientY;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        // set the element's new position:
        var newPosY = joystick.offsetTop - pos2
        var newPosX = joystick.offsetLeft - pos1
        var limit = Math.pow(newPosX - baseRadius, 2) + Math.pow(newPosY - baseRadius, 2)
        var powRadius = Math.pow(baseRadius, 2);
        if (Math.floor(limit) <= powRadius) {
            var x = Math.floor(newPosX);
            var y = Math.floor(newPosY)
            joystick.style.top = y + "px";
            joystick.style.left = newPosX + "px";
            document.getElementById("test").innerText = x + ',' + y;
        }
    },
    touchEnd: () => {
        document.getElementById("test").innerText = "release"
        joystick.style.top = baseRadius * 2 - joystickRadius + "px";
        joystick.style.left = baseRadius * 2 - joystickRadius + "px";
        joystick.ontouchend = null;
        joystick.ontouchmove = null;
    }
}; // end of app