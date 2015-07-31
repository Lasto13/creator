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
            var sp = document.getElementById('sp-holder');
            var np = document.getElementById('np-holder');
            var spc = document.getElementById('sp-content');
            var npc = document.getElementById('np-content');

            sp.addEventListener('click', function () {SendMessage('FunctionsManager','SetInputEnabled','1'); this.style.display = "none"; this.style.opacity = 0; }, false);
            spc.addEventListener('click', function (e) { e.stopPropagation(); }, false);
            np.addEventListener('click', function () { SendMessage('FunctionsManager','SetInputEnabled','1'); this.style.display = "none"; this.style.opacity = 0;}, false);
            npc.addEventListener('click', function (e) { e.stopPropagation(); }, false);
            document.addEventListener('keyup', function (e) { 
                if(e.keyCode == 27){
                    //e.preventDefault();

                    sp.style.display = "none";
                    sp.style.opacity = 0;
                    np.style.display = "none";
                    np.style.opacity = 0;
                    SendMessage('FunctionsManager','SetInputEnabled','1');
                    
                    $('#Settings').css({ top: -470 + 'px' });
                    $('#LoadProject').css({ top: -300 + 'px' });

                    $('#').css({ top: -470 + 'px' });
                    $('#LoadProject').css({ top: -300 + 'px' });

                    var _bc1 = document.getElementById('B0').className='Button radio-picture btn-my2',
                        _bc2 = document.getElementById('B1').className='Button radio-picture btn-my',
                        _bc3 = document.getElementById('B2').className='Button radio-picture btn-my',
                        _bc4 = document.getElementById('B3').className='Button radio-picture btn-my',
                        _bc5 = document.getElementById('B4').className='Button radio-picture btn-my',
                        _bc6 = document.getElementById('B5').className='Button radio-picture btn-my',
                        _bc7 = document.getElementById('B8').className='Button radio-picture btn-my',
                        _bc8 = document.getElementById('B9').className='Button radio-picture btn-my';
                    
                    var _dwt1 = document.getElementById('BDW5').className='Button radio-dw btn-my btn-my2',
                        _dwt2 = document.getElementById('BDW6').className='Button radio-dw btn-my btn-my',
                        _dwt3 = document.getElementById('BDW7').className='Button radio-dw btn-my btn-my',
                        _dwt4 = document.getElementById('BDW9').className='Button radio-dw btn-my btn-my';

                    var _btni1 = document.getElementById('BI5').className='Button btn-my2 radio-i',
                        _btni2 = document.getElementById('BI6').className='Button btn-my radio-i',
                        _btni3 = document.getElementById('BI7').className='Button btn-my radio-i';

                    e.preventDefault();
                }
            }, false);
            
            /* 
            document.addEventListener('click',function (e) {
                var _target = $(e.target);
                console.log(e.target.id);
                if (e.target.id !== 'B27' && e.target.id !== 'B25' && _target.is('form') && _target.is('p') && e.target.id !== 'Settings' && e.target.className !== 'btn-group'){
                    console.log(e.target);
                   $('#Settings').css({ top: -470 + 'px' }); $('#LoadProject').css({ top: -300 + 'px' });  
                } }, false);
            */
            
            function btnClassRplc(a) {
                var _pR = a.target.parentNode, _pRa = _pR.querySelectorAll('a');
                if (_pR.id.indexOf('ButtonContainer') > -1 || _pR.id.indexOf('buttons') > -1 || _pR.id.indexOf('buttSwitch') > -1) {
                    console.log("par" + _pR);
                    for (var i = 0, iL = _pRa.length; i < iL; i++) _pRa[i].className = 'Button btn-my';
                    a.target.className = 'Button btn-my radio-view btn-my2';
                }
            }
        }, 1);
    }
}