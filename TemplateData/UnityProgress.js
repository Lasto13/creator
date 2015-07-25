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
    }
}