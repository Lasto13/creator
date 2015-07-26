function UnityProgress (dom) {
    this.progress = 0.0;
    this.message = "";
    this.dom = dom;

    
    var _talker = document.body.querySelector('.talk-to p'),
        _loadProgress = document.body.querySelector('.loader-count'),
        _splashSc = document.getElementById('splash-sc');

    this.SetProgress = function (progress) {
        if (this.progress < progress) this.progress = progress;

        var _perc = Math.round((this.progress * 100)); // / 2
        if (_perc <= 100) _loadProgress.innerHTML = _perc + ' %';
    }

    this.SetMessage = function (message) { _talker.innerHTML = message; }

    this.Clear = function () {
        _splashSc.className = 'hide';
        setTimeout(function () {
            document.getElementById('B0').addEventListener('click', btnClassRplc, false);
            document.getElementById('B1').addEventListener('click', btnClassRplc, false);
            document.getElementById('B2').addEventListener('click', btnClassRplc, false);
            document.getElementById('B3').addEventListener('click', btnClassRplc, false);
            document.getElementById('B4').addEventListener('click', btnClassRplc, false);
            document.getElementById('B5').addEventListener('click', btnClassRplc, false);
            document.getElementById('B8').addEventListener('click', btnClassRplc, false);
            document.getElementById('B9').addEventListener('click', btnClassRplc, false);
            document.getElementById('B13').addEventListener('click', btnClassRplc, false);
            document.getElementById('B12').addEventListener('click', btnClassRplc, false);
            document.getElementById('B24').addEventListener('click', function () { console.log("Funkcia novy projekt"); }, false);
            document.getElementById('B25').addEventListener('click', function () { console.log("Nacitat projekt"); }, false);
            document.getElementById('B26').addEventListener('click', function () { console.log("Ulozit projekt"); }, false);
            document.getElementById('B27').addEventListener('click', function () { console.log("Nastavenia"); }, false);
            //Chlapi zatial nechapem zmysel tejto funkcie a podobnych je viacero
            //document.querySelector('input:radio[name=view]').addEventListener('click', function (e) { var _id = this.value; }, false);
            //\\
            //document.getElementById('lot').addEventListener('click', function () { var _brw = getBrowser(); SendMessage("CameraObject", "setBrowser", browseris); }, false);
            document.getElementById('sp-holder').addEventListener('click', function () { this.style.display = "none"; }, false);
            document.getElementById('sp-content').addEventListener('click', function (e) { e.stopPropagation(); }, false);

            function btnClassRplc(a) {
                var _pR = a.target.parentNode, _pRa = _pR.querySelectorAll('a');

                for (var i = 0, iL = _pRa.length; i < iL; i++) _pRa[i].className = 'Button btn-my';
                a.target.className = 'Button btn-my radio-view btn-my2';
            }
        }, 1);
    }
}