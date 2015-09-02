window.addEventListener('keydown', function (e) { if (e.keyCode === 8) { if (e.target === document.body) e.preventDefault(); } }, true);
var prepinac = false;
    
    /*
    var clientWidth = window.innerWidth,
    clientHeight = window.innerHeight,
    leftP = clientWidth / 2 - 20,
    topP = clientHeight / 2 - 10,
    leftT = clientWidth / 2 - 200,
    topT = clientHeight / 2 + 80,
    perc = document.getElementById("splash-sc").children[1],
    text = document.getElementById("splash-sc").children[2];

    perc.style.left = leftP + 'px';
    text.style.left = leftT + 'px';

    perc.style.top = topP + 'px';
    text.style.top = topT + 'px';
    */

    var prepinacSet = 0,
        prepinacSave = 0,
        prepinacLoad = 0;

    document.addEventListener('pointerlockchange', lockChange, false);
    document.addEventListener('mozpointerlockchange', lockChange, false);
    document.addEventListener('webkitpointerlockchange', lockChange, false);

    function lockChange(){
        console.log('lock');
        SendMessage("FpsManager", "LockChange", "");
    }

String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

/*function getBrowser() {
    var browser;
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) browser = "firefox";
    if (navigator.userAgent.toLowerCase().indexOf('trident') > -1) browser = "ie";
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) browser = "chrome";
    if (navigator.userAgent.toLowerCase().indexOf('op') > -1) browser = "opera";
    if (navigator.userAgent.toLowerCase().indexOf('safari') > -1 && navigator.userAgent.indexOf('Chrome') == -1) browser = "safari";

    return browser;
}*/

// Connect to canvas
var Module = {
    doNotCaptureKeyboard: true,
    //keyboardListeningElement: document.getElementById('spa'),
    //WebGLInput.captureAllKeyboardInput = false,

    TOTAL_MEMORY: 536870912, //285212672, //838860800
    filePackagePrefixURL: "Release/",
    memoryInitializerPrefixURL: "Release/",
    preRun: [],
    postRun: [],
    print: (function () {
        return function (text) { console.log(text); };
    })(),
    printErr: function (text) { console.error(text); },
    canvas: document.getElementById('canvas'),
    progress: null,
    setStatus: function (text) {
        if (this.progress == null) {
            if (typeof UnityProgress != 'function') return;
            this.progress = new UnityProgress(canvas);
        }
        if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
        if (text === Module.setStatus.text) return;
        this.progress.SetMessage(text);
        var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
        if (m) this.progress.SetProgress(parseInt(m[2]) / parseInt(m[4]));
        if (text === "") this.progress.Clear()
    },
    totalDependencies: 0,
    monitorRunDependencies: function (left) {
        this.totalDependencies = Math.max(this.totalDependencies, left);
        Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
    }
};
Module.setStatus('Downloading (0.0/1)');
Module.canvas.requestPointerLock = Module.canvas.requestPointerLock || Module.canvas.mozRequestPointerLock || Module.canvas.webkitRequestPointerLock;