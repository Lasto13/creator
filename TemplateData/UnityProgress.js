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
        /*
        setTimeout(function () {
                _splashSc.style.display = 'none';
            }, 3000);
        */
        setTimeout(function () {
            /*for (var i = 0, iL = document.querySelectorAll('a').length; i < iL; i++)
                document.querySelectorAll('a')[i].addEventListener('click', btnClassRplc, false);
            */
            var sp = document.getElementById('sp-holder');
            var really = document.getElementById('really-holder');
            var spc = document.getElementById('sp-content');
            var npc = document.getElementById('really-content');

            sp.addEventListener('click', function () {SendMessage('FunctionsManager','SetInputEnabled','1'); this.style.display = "none"; this.style.opacity = 0; }, false);
            spc.addEventListener('click', function (e) { e.stopPropagation(); }, false);
            really.addEventListener('click', function () { SendMessage('FunctionsManager','SetInputEnabled','1'); this.style.display = "none"; this.style.opacity = 0;}, false);
            npc.addEventListener('click', function (e) { e.stopPropagation(); }, false);

            document.addEventListener('keyup', function (e) { 
                if(e.keyCode == 27){
                    $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
                    sp.style.display = "none";
                    sp.style.opacity = 0;
                    really.style.display = "none";
                    really.style.opacity = 0;
                    SendMessage('FunctionsManager','SetInputEnabled','1');
                    
                    $('#Settings').css({ top: -470 + 'px' });
                    $('#LoadProject').css({ top: -300 + 'px' });
/*
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
                        _btni3 = document.getElementById('BI7').className='Button btn-my radio-i';

                    document.getElementById('B31').className = 'Button btn btn-default';
                    document.getElementById('B32').className = 'Button btn btn-default';
                    //document.getElementById('B31').style.className = 'Button btn btn-default';
*/
                    e.preventDefault();
                }
            }, false);
            
            document.addEventListener('mouseup',function (e) {
                //document.getElementById('tlc').style.background = 'url(img/tut/lb.svg) no-repeat scroll 0% 0% / 100% auto';
                //document.getElementById('trc').style.background = 'url(img/tut/rb.svg) no-repeat scroll 0% 0% / 100% auto';
                if (!isFps){
                    if (e.target.id == 'B27' || e.target.id == 'B25' || e.target.id == 'Settings' || e.target.className == 'btn-group' || e.target.parentNode.id == 'Settings' || e.target.parentNode.parentNode.id == 'Settings'|| e.target.id == 'LoadProject' || e.target.parentNode.id == 'LoadProject' || e.target.parentNode.parentNode.id == 'LoadProject' || e.target.parentNode.className == 'imageOfSave'){
                        return
                    }  else {
                       $('#Settings').css({ top: -470 + 'px' }); $('#LoadProject').css({ top: -300 + 'px' });  
                        prepinacLoad = 0;
                        prepinacSet = 0;
                        prepinacSave = 0;
                    }
                }
            }, false);
            /*
            document.addEventListener('mousedown',function (e) {
                switch(e.which){
                    case 1: document.getElementById('tlc').style.background = 'url(img/tut/lg.svg) no-repeat scroll 0% 0% / 100% auto'; break;
                    case 3: document.getElementById('trc').style.background = 'url(img/tut/rg.svg) no-repeat scroll 0% 0% / 100% auto'; break;
                    default: break;
                }
            }, false);

            document.addEventListener('mousemove',function (e) {
                document.getElementById('tMouse').style.left = e.clientX + 23 +'px';
                document.getElementById('tMouse').style.top = e.clientY + 30 +'px';
            }, false);
            */
        }, 1);
    }
}