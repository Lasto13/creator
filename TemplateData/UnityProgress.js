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
        if (_perc === 100) setTimeout(function () { _talker.innerHTML = 'Please wait...'; }, 1000);
    }

    this.SetMessage = function (message) { _talker.innerHTML = message; }

    this.Clear = function () {
        _splashSc.className = 'hide';
        setTimeout(function () {
            for (var i = 0, iL = document.querySelectorAll('a').length; i < iL; i++)
                document.querySelectorAll('a')[i].addEventListener('click', btnClassRplc, false);

            document.getElementById('sp-holder').addEventListener('click', function () { this.style.display = "none"; }, false);
            document.getElementById('sp-content').addEventListener('click', function (e) { e.stopPropagation(); }, false);

            function btnClassRplc(a) {
                var _pR = a.target.parentNode, _pRa = _pR.querySelectorAll('a');
                if (_pR.id.indexOf('ButtonContainer') > -1 || _pR.id.indexOf('buttons') > -1) {
                    for (var i = 0, iL = _pRa.length; i < iL; i++) _pRa[i].className = 'Button btn-my';
                    a.target.className = 'Button btn-my radio-view btn-my2';
                }
            }
        }, 1);
    }
}