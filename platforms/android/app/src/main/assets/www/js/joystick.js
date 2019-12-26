dragElement();

function dragElement() {

    var base = document.getElementById("base");
    var joystick = document.getElementById("joystick");
    var baseRadius = 25;
    var joystickRadius = 25;
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

    joystick.touchstart = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.touchend = closeDragElement;
        // call a function whenever the cursor moves:
        document.touchmove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        var newPosY = joystick.offsetTop - pos2
        console.log(newPosY)
        var newPosX = joystick.offsetLeft - pos1
        var limit = Math.pow(newPosX - baseRadius, 2) + Math.pow(newPosY - baseRadius, 2)
        var powRadius = Math.pow(baseRadius, 2);
        document.getElementById("test").innerText = newPosX;
        if (Math.floor(limit) <= powRadius) {
            joystick.style.top = newPosY + "px";
            joystick.style.left = newPosX + "px";
        }
    }

    function closeDragElement() {
        joystick.style.top = baseRadius * 2 - joystickRadius + "px";
        joystick.style.left = baseRadius * 2 - joystickRadius + "px";
        document.touchend = null;
        document.touchmove = null;
    }
}