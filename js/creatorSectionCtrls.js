//'use strict';
app.controller('mainCtrl', ['$scope', '$http', '$window', '$timeout', function ($scope, $http, $window, $timeout) {
    console.logError = console.log;

    var myStorage;
    $scope.activeMenu = {};
    $scope.activeMenu.first = true;

    $scope.activateMenu = function (n) {
        $scope.activeMenu = {};
        switch (n) {
            case 1: $scope.activeMenu.first = true; isFps = false; chMin(); break;
            case 2: $scope.activeMenu.second = true; isFps = false; chMin(); break;
            case 3: $scope.activeMenu.third = true; isFps = false; chMin(); break;
            case 4: $scope.activeMenu.fourth = true; isFps = true; chFull(); break;
            default: $scope.activeMenu = {};
        }
    }
    
    login();
    function login() {
        var email = "plastovecky@enli.sk",
            password = "enliportal";

        var request = $http.post('http://dev.enli.sk/api/tokens', { username: email, password: password });
        request.then(function (response) { saveDataToStorage(response.data); },
        function (err) { console.log('Server Error'); console.dir(err); });
    }

    function saveDataToStorage(data) {
        if ($window.Storage) {
            //myStorage = $window.sessionStorage;
            myStorage = $window.localStorage;
            myStorage.setItem('token', JSON.stringify(data.token.value));
            myStorage.setItem('user', JSON.stringify(data.user));
            getSave();
        } else console.log('Storage is not suported');
    };

    var getSave = function () {
        var placeID = "55802cadd2aa3c3d6240679f";

        var promise = $http({
            method: 'GET',
            url: 'http://dev.enli.sk/api/places/' + placeID + '/save',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + JSON.parse(myStorage.getItem('token')) }
        });
        promise.success(function (data, status, headers, conf) {
            $scope.LoadSave = data;
            return data;
        });
    };

    $scope.isSettingOpened = false;

    $scope.SetSettings = function () {
        if (prepinacSet == 0) {
            $('#Settings').css({ top: 110 + 'px' });
            $('#LoadProject').css({ top: -300 + 'px' });
            prepinacSave = 0;
            prepinacLoad = 0;
            prepinacSet = 1;
        }
        else if (prepinacSet == 1) {
            $('#Settings').css({ top: -470 + 'px' });
            prepinacSet = 0;
        }
    }

    $scope.SetSave = function () {
        if (prepinacSave == 0) {
            $('#SaveProject').css({ top: 110 + 'px' });
            $('#Settings').css({ top: -470 + 'px' });
            $('#LoadProject').css({ top: -300 + 'px' });
            prepinacSave = 1;
            prepinacLoad = 0;
            prepinacSet = 0;
        }
        else if (prepinacSave == 1) {
            $('#SaveProject').css({ top: -50 + 'px' });
            prepinacSave = 0;
        }
    }

    $scope.SetLoad = function () {
        if (prepinacLoad == 0) {
            $('#LoadProject').css({ top: 110 + 'px' });
            $('#Settings').css({ top: -470 + 'px' });
            prepinacLoad = 1;
            prepinacSet = 0;
            prepinacSave = 0;
        }
        else if (prepinacLoad == 1) {
            $('#LoadProject').css({ top: -350 + 'px' });
            prepinacLoad = 0;
        }
    }

    $scope.selectedTemplate = {};
    $scope.selectedTemplate.path = "partials/podorys.tpl.html";

    setActiveSection = function (n) {
        console.log(n);
        $scope.activeMenu = {};
        switch (n) {
            case "0": $scope.activeMenu.first = true; isFps=false; chMin(); break;
            case "2": $scope.activeMenu.second = true; isFps=false; chMin(); break;
            case "5": $scope.activeMenu.third = true; isFps=false; chMin(); break;
            case "6": $scope.activeMenu.fourth = true; isFps=true; chFull(); break;
            default: $scope.activeMenu = {};
        }
        if (!$scope.$$phase) $scope.$apply();

    }

    var chFull = function(){
        var canvasH = document.getElementById('canvasHolder');
        canvasH.style.left = 0 + 'px';
        canvasH.style.top = 0 + 'px';
        canvasH.style.width = window.innerWidth + 'px';
        canvasH.style.height = window.innerHeight + 'px';
    }

    var chMin = function(){
        var canvasH = document.getElementById('canvasHolder');
        c_width = window.innerWidth - 250,
        c_height = window.innerHeight - 180;

        canvasH.style.left = 250 + 'px';
        canvasH.style.top = 180 + 'px';

        canvasH.style.width = c_width +'px';
        canvasH.style.height = c_height +'px';
    }

    getErrorText = function (string) {
        $scope.message = "iny message";
        $scope.message = string;

        if (!$scope.$$phase) $scope.$apply();

        document.getElementById('errMsg').style.opacity = 1;
        setTimeout(function () { document.getElementById('errMsg').style.opacity = 0; }, 3000);
    };

    $scope.set_view = function ($inputid) { $("input#" + $inputid).click(); };

    $scope.Podorys = function () {
        var _pR = document.getElementById('B0').parentNode,
            _pRi = _pR.querySelectorAll('input'),
            _pRa = _pR.querySelectorAll('a');
        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        for (var j = 0, jL = _pRa.length; j < jL; j++) _pRa[j].className = 'Button radio-picture btn-my';
        document.getElementById('category_1').checked = true;
        document.getElementById('B0').className = 'Button radio-picture btn-my2';
        SendMessage("CanvasEditor", "changeArea", 0);
        browserDimensions();
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
    };
    $scope.DW = function () {
        var _pR = document.getElementById('BDW5').parentNode,
            _pRIe = _pR.querySelectorAll('input');

        SendMessage("CanvasEditor", "changeArea", 2);

        document.getElementById('BDW5').className = 'Button radio-dw btn-my btn-my2';
        document.getElementById('BDW6').className = 'Button radio-dw btn-my';
        document.getElementById('BDW7').className = 'Button radio-dw btn-my';
        document.getElementById('BDW9').className = 'Button radio-dw btn-my';
        for (var i = 0, iL = _pRIe.length; i < iL; i++) _pRIe[i].checked = false;
        document.getElementById('dwcategory_1').checked = true;
        browserDimensions();
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
    };
    $scope.Interier = function () {
        var _pR = document.getElementById('BI5').parentNode,
            _pRi = _pR.querySelectorAll('input');

        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        document.getElementById('icategory_1').checked = true;
        SendMessage("CanvasEditor", "changeArea", 5);
        browserDimensions();
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
    };
    $scope.D2D = function () {
        defActionClass();
        var _pR = document.getElementById('B0').parentNode,
            _pRi = _pR.querySelector('input');
        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        document.getElementById('category_1').checked = true;
        document.getElementById('B0').className = 'Button radio-picture btn-my btn-my2';
        SendMessage("CanvasEditor", "SetView2D");
    };
    $scope.D3D = function () {
        SendMessage("CanvasEditor", "SetView3D");
        if ($scope.activeMenu.first == true) {
            var _pR = document.getElementById('B0').parentNode,
            _pRi = _pR.querySelector('input');
            for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
            document.getElementById('category_1').checked = true;
            defActionClass();
        }
    };

    var defActionClass = function(){
        $('#ButtonContainer .btn-my2').removeClass('btn-my2');
        $('#B0').addClass('btn-my2');
    }

    $scope.Center = function () { SendMessage("Main Camera", "ResetPosition"); };
    $scope.Undo = function () { SendMessage("UndoRedo", "Undo"); defActionClass();};
    $scope.Redo = function () { SendMessage("UndoRedo", "Redo"); defActionClass();};
    $scope.FPS = function () { 
        SendMessage("EventSystem", "FpsPosition");
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DefaultAction");
        defActionClass();
    };
    $scope.Kvalita = function (value) { SendMessage("Settings", "setLevel", value); };
    $scope.HranySet = function (value) { SendMessage("Settings", "setAA", value); };
    $scope.RozmerySet = function (value) { SendMessage("Settings", "ShowTextFromWeb", value); };
    $scope.MierkaAuto = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 0);}
    $scope.Mierka10 = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 500);}
    $scope.Mierka50 = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 100);}
    $scope.Mierka100 = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 50);}
    $scope.MierkaVyp = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 1000000);}

    $scope.UlozitProjekt = function () {
        document.getElementById('sp-holder').style.display = "block";
        document.getElementById('sp-holder').style.opacity = 1;
        document.getElementById('sp').value = '';
        setInputValue();
        closeAll();
        SendMessage('FunctionsManager','SetInputEnabled','0');
    };

    var setInputValue = function () {
        var inpt = document.getElementById('sp'),
            _k = '',
            _kk = '',
            _ctrl = false,
            _shft = false;
        inpt.focus();

        inpt.addEventListener('keyup', function (e) {
            if (e.keyCode === 37 && e.shiftKey){
                this.selectionStart = this.selectionStart -1;
            }else if(e.keyCode === 37){
                this.selectionStart = this.selectionStart -1;
                this.selectionEnd = this.selectionStart;
            } else if (e.keyCode === 39 && e.shiftKey){
                this.selectionEnd = this.selectionEnd +1;
            } else if (e.keyCode === 39) {
                this.selectionStart = this.selectionStart +1;
                this.selectionEnd = this.selectionStart;
            } else if (e.keyCode === 8 && this.value.length > 0 && this.selectionStart == this.selectionEnd) {
                var _index = this.selectionStart;
                this.value = this.value.slice(0,this.selectionStart-1) + this.value.slice(this.selectionStart);
                this.selectionStart = this.selectionEnd = _index - 1;
            } else if (e.keyCode === 8 && this.value.length > 0 && this.selectionStart !== this.selectionEnd ){
                var _index = this.selectionStart;
                this.value = this.value.slice(0,this.selectionStart) + this.value.slice(this.selectionEnd, this.value.length);
                this.selectionStart = this.selectionEnd = _index;
            } else if (e.keyCode === 46 && this.value.length > 0 && this.selectionStart == this.selectionEnd) {
                var _index = this.selectionStart;
                this.value = this.value.slice(0,this.selectionStart) + this.value.slice(this.selectionStart+1);
                this.selectionStart = this.selectionEnd = _index;
            } else if (e.keyCode === 46 && this.value.length > 0 && this.selectionStart !== this.selectionEnd){
                var _index = this.selectionStart;
                this.value = this.value.slice(0,this.selectionStart) + this.value.slice(this.selectionEnd, this.value.length);
                this.selectionStart = this.selectionEnd = _index;
            } else if (e.keyCode === 8 && _kk.length == 0){
                e.preventDefault();
            } else if (e.keyCode === 16 || e.keyCode === 27 || e.keyCode === 17 || e.keyCode === 9 || e.keyCode === 18 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 46) {
                e.preventDefault();
            } else if (e.ctrlKey && e.keyCode === 65){
                this.selectionStart = 0;
                this.selectionEnd = this.value.length;
            } else if (this.selectionStart == this.selectionEnd && _ctrl == false){
                _k = e.key;
                var _index = this.selectionStart;
                var _val = this.value;
                var _val = _val.splice(_index,0,_k);
                this.value = _val;
                this.selectionStart = this.selectionEnd = _index + 1;
            } 
        }, false);
    }

    $scope.cancel = function () {
        document.getElementById('sp-holder').style.display = "none";
        document.getElementById('sp').value = "";
        document.getElementById('np-holder').style.display = "none";
        document.getElementById('sp-holder').style.opacity = 0;
        SendMessage('FunctionsManager','SetInputEnabled','1');
    }

    $scope.potvrdit = function () {
        var saveName = document.getElementById('sp').value;
        SendMessage("Save Game Manager", "SaveFromWeb", saveName);
        document.getElementById('sp-holder').style.display = "none";
        document.getElementById('sp').value = "";
        document.getElementById('sp-holder').style.opacity = 0;
        SendMessage('FunctionsManager','SetInputEnabled','1');
    }

    setShowRozmery = function (show) {
        if (show === 0) {
            $('#RozmeryVypnute').prop('checked', true);
            $scope.RozmerySet(0);
        }
        else {
            $('#RozmeryZapnute').prop('checked', true);
            $scope.RozmerySet(1);
        }
    }

    var closeAll = function(){
        $('#Settings').css({ top: -470 + 'px' });
        $('#LoadProject').css({ top: -300 + 'px' });
    }

    $scope.NovyProjekt = function () {
        closeAll();
        defActionClass();
        document.getElementById('np-holder').style.display = "block";
        document.getElementById('np-holder').style.opacity = 1;
        SendMessage('FunctionsManager','SetInputEnabled','0');
    }

    $scope.CleanProject = function () {
        defActionClass();
        document.getElementById('np-holder').style.display = "none";
        document.getElementById('np-holder').style.opacity = 0;
        SendMessage("NewProject", "NewProject");
        SendMessage('FunctionsManager','SetInputEnabled','1');
    }

    savingFinished = function (value) {
        if (value === "1") getErrorText('Uloženie prebehlo správne');
        else if (value === "0") getErrorText("Váš projekt nebol uložený");
    }

    loadingFinished = function (value) { }

    $scope.OtvoritProjekt = function (jsonstring) {
        SendMessage("Save Game Manager", "LoadAndDeserializeFromWeb", jsonstring);
    }
}]);

app.controller('podorysCtrl', ['$scope', 'matJson','floorJson', function ($scope, matJson, floorJson) {
    
    wallCursors = function(cursor){
        switch(cursor){
            case '0': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});break;
            case '1': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/0.png) 0 17, default'});break;
            case '2': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/90.png) 17 0, default'});break;
        }
    }

    var setInputValue = function () {
        var inpt = document.getElementById('sp'),
            _k = '',
            _kk = '',
            _ctrl = false,
            _shft = false;
        inpt.focus();

        inpt.addEventListener('keyup', function (e) {
            if (e.keyCode === 37 && e.shiftKey){
                this.selectionStart = this.selectionStart -1;
            }else if(e.keyCode === 37){
                this.selectionStart = this.selectionStart -1;
                this.selectionEnd = this.selectionStart;
            } else if (e.keyCode === 39 && e.shiftKey){
                this.selectionEnd = this.selectionEnd +1;
            } else if (e.keyCode === 39) {
                this.selectionStart = this.selectionStart +1;
                this.selectionEnd = this.selectionStart;
            } else if (e.keyCode === 8 && this.value.length > 0 && this.selectionStart == this.selectionEnd) {
                var _index = this.selectionStart;
                this.value = this.value.slice(0,this.selectionStart-1) + this.value.slice(this.selectionStart);
                this.selectionStart = this.selectionEnd = _index - 1;
            } else if (e.keyCode === 8 && this.value.length > 0 && this.selectionStart !== this.selectionEnd ){
                var _index = this.selectionStart;
                this.value = this.value.slice(0,this.selectionStart) + this.value.slice(this.selectionEnd, this.value.length);
                this.selectionStart = this.selectionEnd = _index;
            } else if (e.keyCode === 46 && this.value.length > 0 && this.selectionStart == this.selectionEnd) {
                var _index = this.selectionStart;
                this.value = this.value.slice(0,this.selectionStart) + this.value.slice(this.selectionStart+1);
                this.selectionStart = this.selectionEnd = _index;
            } else if (e.keyCode === 46 && this.value.length > 0 && this.selectionStart !== this.selectionEnd){
                var _index = this.selectionStart;
                this.value = this.value.slice(0,this.selectionStart) + this.value.slice(this.selectionEnd, this.value.length);
                this.selectionStart = this.selectionEnd = _index;
            } else if (e.keyCode === 8 && _kk.length == 0){
                e.preventDefault();
            } else if (e.keyCode === 16 || e.keyCode === 27 || e.keyCode === 17 || e.keyCode === 9 || e.keyCode === 18 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 46) {
                e.preventDefault();
            } else if (e.ctrlKey && e.keyCode === 65){
                this.selectionStart = 0;
                this.selectionEnd = this.value.length;
            } else if (this.selectionStart == this.selectionEnd && _ctrl == false){
                _k = e.key;
                var _index = this.selectionStart;
                var _val = this.value;
                var _val = _val.splice(_index,0,_k);
                this.value = _val;
                this.selectionStart = this.selectionEnd = _index + 1;
            } 
        }, false);
    }

    $(document.documentElement).css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});

    $scope.isCollapsed = true;

    matJson.get().then(function (data) {
        $scope.mats = data;
    });

      floorJson.get().then(function (data) {
        $scope.floors = data;
    });

    var hodnotaB15 = 0;
    var vyskaSteny = 2.4;
    var hodnotaRotacie = 0;
    $(function () {
        $("#slider").slider({
            step: 0.01,
            min: 0,
            max: 1,
            values: [0], 
            slide: function (event, ui) {
               hodnotaRotacie = ui.value;
               SendMessage("RotaciaVzoruSlider","WebRotated", hodnotaRotacie);
            }
        });
        var slideris = document.getElementById("slider");
        slideris.addEventListener('mousedown', function (e) {
            SendMessage("RotaciaVzoruSlider","WebStartedRotating");
        });
        slideris.addEventListener('mouseup', function (e) {
            SendMessage("RotaciaVzoruSlider","WebEndedRotating");
        });
    });

    $(function () {
        $("#spinner").spinner({
            step: 0.1,
            numberFormat: "n",
            spin: function (event, ui) {
                $(this).change();
                vyskaSteny = ui.value;
            }
        });
    });

    $("#B15").click(function () {
        if (hodnotaB15 === 0) {
            this.className = 'Button btn-my2 radio-i';
            hodnotaB15 = 1;
        }
        else if (hodnotaB15 === 1) {
            this.className = 'Button btn-my radio-i';
            hodnotaB15 = 0;
            SendMessage("FunctionsManager", "SetFunctionActive", "G01_DefaultAction");
            for (var i = 0, iL = document.querySelectorAll('a.radio-picture').length; i < iL; i++)
                document.querySelectorAll('a.radio-picture')[i].className = 'Button radio-picture btn-my';
            document.getElementById('B0').className = 'Button radio-picture btn-my2';
        }
    });

    $scope.set_radio = function ($inputid) {
        var _pR = document.getElementById($inputid).parentNode,
            _pRi = _pR.querySelectorAll('input');

        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        //for (var j = 0, jL = _pRa.length; j < jL; j++) _pRa[0].className = 'Button btn-my radio-picture';
        document.getElementById($inputid).checked = true;
    }

    $("input:radio[name=view]").click(function () {
        var $id = $(this).val();

        $.post("includes/determine_next_questions.php", { prodfamily: $id }, function (data) {
            $("#results").html(data);
        });
    });

    $scope.NoOp = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DefaultAction");
        document.getElementById('B0').className='Button radio-picture btn-my2';
        document.getElementById('B1').className='Button radio-picture btn-my';
        document.getElementById('B2').className='Button radio-picture btn-my';
        document.getElementById('B3').className='Button radio-picture btn-my';
        document.getElementById('B4').className='Button radio-picture btn-my';
        document.getElementById('B5').className='Button radio-picture btn-my';
        document.getElementById('B8').className='Button radio-picture btn-my';
        document.getElementById('B9').className='Button radio-picture btn-my';
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
        document.getElementById('MaterialChooser').style.left = -230 +'px';
    };
    $scope.SingleWall = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_SingleWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/2.png), default'});
    };
    $scope.CurveWall = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_CurveWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/3.png), default'});
    };
    $scope.FourWall = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_4Wall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/4.png), default'});
    };
    $scope.Delete = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DeleteWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/5.png) 7 22 , default'});
    };
    $scope.AddControlPoint = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_AddControlPoint");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/6.png), default'});
    };
    $scope.PosunSteny = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_MoveWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/7.png), default'});
    };
    $scope.ZmenaMat = function () {
        getErrorText('Zvoľte stenu pre zmenu materiálu');
        SendMessage("CanvasEditor", "SetView3D");
        document.getElementById('B12').className = 'Button btn-my radio-view';
        document.getElementById('B13').className = 'Button btn-my2 radio-view';
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_ChangeMatWall");
        //document.getElementById('MaterialChooser').style.left = 0+'px';
    };

    SetUndoRedoInteractable = function (IsInteractable) { 
         console.log(IsInteractable);
        if(IsInteractable == "U0R0"){
            console.log("Mali by byt oba neaktivne.");
        }
        else if(IsInteractable == "U1R0"){
            $("#B10").removeClass('inActive');
             $("#B11").addClass('inActive');
        }
        else if(IsInteractable == "U0R1"){
            $("#B10").addClass('inActive');
            $("#B11").removeClass('inActive');
        }
        else if(IsInteractable == "U1R1"){
            $("#B10").removeClass('inActive');
            $("#B11").removeClass('inActive');
        }
    }


    SetWallTypeButtonActive = function (IsInteractable) {

     }
    $scope.ZmenaVysky = function () {
        SendMessage("Plane0", "ChangeFloorScale", vyskaSteny);
    }

    $scope.ChoosenMaterial = function (id) {
        SendMessage("changeMat", "ChangeMatGL", id);
        document.getElementById('MaterialChooser').style.left = -240+'px';
        $scope.ZmenaMat();
    }

    Set2D = function () {
        SendMessage("CanvasEditor", "SetView2D");
        $("#B12").removeClass('btn-my');
        $("#B12").addClass('btn-my2');
        $("#B13").removeClass('btn-my2');
        $("#B13").addClass('btn-my');
    }
    Set3D = function(){
        //SendMessage("CanvasEditor", "SetView3D");
        $("#B13").removeClass('btn-my');
        $("#B13").addClass('btn-my2');
        $("#B12").removeClass('btn-my2');
        $("#B12").addClass('btn-my');
    }
    SetDefaultFunctionPodorys = function () {
        $("#B0").removeClass('btn-my');
        $("#B0").addClass('btn-my2');
        $("#B5").removeClass('btn-my2');
        $("#B5").addClass('btn-my');
        $scope.NoOp();
    }

    $scope.Center = function () {
        SendMessage("Main Camera", "ResetPosition");
    }
    $scope.Obvodova = function () {
        SendMessage("WallTypeToggleGroup", "SetWallTypeObvodova");
    }
    $scope.Vnutorna = function () {
        SendMessage("WallTypeToggleGroup", "SetWallTypePriecna");
    }
    $scope.Oznacit = function () {
        SendMessage("WallTypeToggleGroup", "StartSelectWalls");
    }
    $scope.OznacitVsetky = function () {
        SendMessage("WallTypeToggleGroup", "SelectAllWallsAndStartSelect");
    }
    $scope.ZmenitNaObvodove = function () {
        SendMessage("WallTypeToggleGroup", "ConfirmSelectObvodova");
    }
    $scope.ZmenitNaVnutorne = function () {
        SendMessage("WallTypeToggleGroup", "ConfirmSelectPriecna");
    }

    $scope.VyberPodlahy = function(){
        SendMessage("FunctionsManager","SetFunctionActive","G01_SelectFlooring");
    }

    $scope.Strih = function(){
        SendMessage("FunctionsManager","SetFunctionActive","G01_CutFlooring");
    }

    $scope.VzorMaterialu = function(){
        document.getElementById('FloorChooser').style.left = "220px";
        SendMessage("FunctionsManager","SetFunctionActive","G04_MaterialSelection");
    }
    $scope.HustotaVzoru = function(){
        SendMessage("FunctionsManager","SetFunctionActive","G04_MaterialTiling");
    }

    $scope.RotateFloor = function(){
        
    }

    $scope.ChangeFloor = function(value){
        SendMessage("VzorButton","WEBMaterialSelected", value);
    }

    isFloorChoosen = function(value){
        console.log("Je oznacena podlaha???" + value);
                if(value == 0){
                    $("#B33").addClass('disabled');
                }
                else{
                    $("#B33").removeClass('disabled');
                }
    }

    $scope.setMenuMaterial = function (value) {
        if (value == 1) { }
        else { }
    }
    openMaterialMenu = function () {
        document.getElementById('MaterialChooser').style.left = "220px";
    }
    $scope.closeMaterialMenu = function(){
        $scope.ZmenaMat();
        document.getElementById('MaterialChooser').style.left = -230 +'px';
    }
    $scope.closeFloorMenu = function(){
        //$scope.ZmenaMat();
        document.getElementById('FloorChooser').style.left = -230 +'px';
    }
}]);

app.controller('dwCtrl', ['$scope', 'menuJson', function ($scope, menuJson) {

    menuJson.get().then(function (data) {
        $scope.menuData = data;
    });

    var hodnotaBDW4 = 0;
    var hodnotaBDW6 = 0;
    var hodnotaBDW7 = 0;

    $("#BDW4").click(function () {
        if (hodnotaBDW4 == 0) {
            $("#BDW4").removeClass('btn-my');
            $("#BDW4").addClass('btn-my2');
            hodnotaBDW4 = 1;
        }
        else if (hodnotaBDW4 == 1) {
            $("#BDW4").removeClass('btn-my2');
            $("#BDW4").addClass('btn-my');
            hodnotaBDW4 = 0;
        }
    });
    $scope.isWindowDropdownDisplayed = true;
    $scope.isDoorDropdownDisplayed = true;

    $scope.setMenu = function (value) {
        if (value == 1) {
            $scope.isWindowDropdownDisplayed = false;
            $scope.isDoorDropdownDisplayed = true;
        }
        else if (value == 2) {
            $scope.isWindowDropdownDisplayed = true;
            $scope.isDoorDropdownDisplayed = false;
        }
        else {
            $scope.isWindowDropdownDisplayed = true;
            $scope.isDoorDropdownDisplayed = true;
        }
    }

    $("a.radio-dw").click(function () {
        var $id = $(this).attr('id');
        $("a.radio-dw").removeClass('btn-my2');
        $("a.radio-dw").addClass('btn-my');
        $("a#" + $id).addClass('btn-my2');
    });

    $scope.set_dw = function ($inputid) {
        var _pR = document.getElementById($inputid).parentNode,
            _pRi = _pR.querySelectorAll('input');

        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        document.getElementById($inputid).checked = true;
    }

    $("a.radio-dwview").click(function () {
        var $id = $(this).attr('id');
        $("a.radio-dwview").removeClass('btn-my2');
        $("a.radio-dwview").addClass('btn-my');
        $("a#" + $id).addClass('btn-my2');
    });

    $scope.set_dwview = function ($inputid) {
        var _pR = document.getElementById($inputid).parentNode,
            _pRi = _pR.querySelectorAll('input');

        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        document.getElementById($inputid).checked = true;
    }

    $scope.$watch('isWindowDropdownDisplayed', function (value, oldValue) {
        //if (value === oldValue) { return; }
        var d = document.getElementById('MenuItemWindow');
        if (!!value) d.style.left = "-720px";
        else d.style.left = "10px";
    });

    $scope.$watch('isDoorDropdownDisplayed', function (value, oldValue) {
        //if (value === oldValue) { return; }
        var d = document.getElementById('MenuItemDoor');
        if (!!value) d.style.left = "-720px";
        else d.style.left = "10px";
    });

    $scope.D2DDW = function () {
        SendMessage("CanvasEditor", "SetView2D");
    };
    $scope.D3DDW = function () {
        SendMessage("CanvasEditor", "SetView3D");
    };
    $scope.CenterDW = function () {
        SendMessage("Main Camera", "ResetPosition");
    };
    $scope.NoOpDW = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G02_DefaultAction");
    };
    $scope.DeleteDW = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G02_Delete");
    };
    $scope.AddWindow = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G02_Adding");
    };
    $scope.AddDoor = function(){
        SendMessage("FunctionsManager", "SetFunctionActive", "G02_Adding");
    }
    $scope.ChooseWindow = function (path) {
        SendMessage("GUI OKNA_DVERE", "download_window", path);
        $scope.isWindowDropdownDisplayed = true;
    }
    $scope.ChooseDoor = function (path) {
        SendMessage("GUI OKNA_DVERE", "download_door", path);
        $scope.isDoorDropdownDisplayed = true;
    }
    $scope.setNoDWclass = function(){
        var dw = $('#dw-toolbar .btn-my2');
        dw.removeClass('btn-my2');
        $('#BDW5').addClass('btn-my2');
    }
    $scope.getClass = function(indx, list){
        return {
            rightColumn: indx % 2,
            NotLastOnes: indx < list.length - 2 
        }
    }
}]);

app.controller('interierCtrl', ['$scope', 'menuJson', function ($scope, menuJson) {

    $scope.trieda = "TypeProductDesign";
    var hodnotaBI4 = 0;

    $("#BI4").click(function () {
        if (hodnotaBI4 == 0) {
            $("#BI4").removeClass('btn-my');
            $("#BI4").addClass('btn-my2');
            hodnotaBI4 = 1;
        }
        else if (hodnotaBI4 == 1) {
            $("#BI4").removeClass('btn-my2');
            $("#BI4").addClass('btn-my');
            hodnotaBI4 = 0;
        }
    });

    menuJson.get().then(function (data) {
        $scope.menuData = data;
        $scope.mf = data.manufacturers;
        for (var i = 0; i<$scope.mf.length; i++){
            $scope.mf[i].isChecked = true;
        }
        $scope.dataToRepeat = null;
    });

    $("a.radio-i").click(function () {
        var $id = $(this).attr('id');
        $("a.radio-i").removeClass('btn-my2');
        $("a.radio-i").addClass('btn-my');
        $("a#" + $id).addClass('btn-my2');
    });

    $scope.set_i = function ($inputid) {
        var _pR = document.getElementById($inputid).parentNode,
            _pRi = _pR.querySelectorAll('input');
        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        document.getElementById($inputid).checked = true;
    }

    $("a.radio-iview").click(function () {
        var $id = $(this).attr('id');
        $("a.radio-iview").removeClass('btn-my2');
        $("a.radio-iview").addClass('btn-my');
        $("a#" + $id).addClass('btn-my2');
    });

    $scope.set_iview = function ($inputid) {
        var _pR = document.getElementById($inputid).parentNode,
            _pRi = _pR.querySelectorAll('input');
        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        document.getElementById($inputid).checked = true;
    }

    $scope.changedValue = function (element) {

        var id = element.id;
        $scope.dataToRepeat = $scope.menuData.elements[id].child;
        $scope.producttypes = $scope.menuData.elements[id].child[0].child;
        /*
        $scope.productsToShow = {}
        console.log($scope.dataToRepeat);
        for (var i=0; i < $scope.dataToRepeat.length; i++){
        if ($scope.dataToRepeat[i].child[0].hasOwnProperty("parentid")){
        console.log("ma prop");
        }
        else {console.log("nema prop");}
        }
        */
    }

    $scope.PridatNabytok = function (value) {
        SendMessage("GUI INTERIOR", "AddObjectFromWeb", JSON.stringify(value));
    };

    $scope.showProdDetails = function (value) {
        SendMessage("GUI INTERIOR", "ShowDetailPanelFromWeb", JSON.stringify(value));
    };

    $scope.ShowAllPosible = function (element) {
        $scope.SelectedProducts = $scope.menuData.element.products;
    };

    $scope.intDefAction = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G03_DefaultAction");
    };

    $scope.intRotAction = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G03_Rotate");
    };

    $scope.intDelAction = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G03_Delete");
    };

    setDefaultFunctionInterier = function () {
        var _pR = document.getElementById('B15').parentNode,
            _pRi = _pR.querySelectorAll('input');
        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        document.getElementById('B15').checked = true;

        document.getElementById('B15').classname = 'Button btn-my2 radio-i';
        SendMessage("FunctionsManager", "SetFunctionActive", "G03_DefaultAction");
    }
    
    //$scope.accordionID = function (id) { console.log(id); };

    // initiate an array to hold all active tabs
    $scope.activeTabs = [];

    // check if the tab is active
    $scope.isOpenTab = function (tab) {
        // check if this tab is already in the activeTabs array
        if ($scope.activeTabs.indexOf(tab) > -1) {
            // if so, return true
            return true;
        } else {
            // if not, return false
            return false;
        }
    }

    $scope.activeTT = [];
    $scope.productsToShow = [];
    $scope.asSelectedMans = [];

    $scope.manClicked = function(man){
        man.isChecked = !man.isChecked;
        $scope.setSelectedMan($scope.mf);
    }

    $scope.setSelectedMan = function(aoManufacturers) {
        $scope.asSelectedMans = [];
    
        if (aoManufacturers) {
            for (var i = 0, len = aoManufacturers.length; i < len; i++) {
                if (aoManufacturers[i].isChecked) {
                    $scope.asSelectedMans.push(aoManufacturers[i].uidisplayname);                         
                }
            }
        }
        if ($scope.activeTT.length > 0) filterProducts();
    };

    // function to 'open' a tab
    $scope.openTab = function (tab) {
        $scope.setSelectedMan($scope.mf);
        // check if tab is already open
        if ($scope.isOpenTab(tab.uidisplayname)) {
            if (!tab.child[0].hasOwnProperty("parentid"))
                for (var i = 0; i < tab.child.length; i++) {
                    if (!tab.child[i].hasOwnProperty("parentid")) {
                        var index = $scope.activeTT.indexOf(tab.child[i]);
                        $scope.activeTT.splice(index, 1);
                    }
                }
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab.uidisplayname), 1);
            tab.toggled = !tab.toggled;
        } else {
            // if it's not, add it!
            for (var i = 0; i < tab.child.length; ++i) {
                if (tab.child[0].hasOwnProperty("parentid") && tab.wasOpened !== true) {
                    $scope.activeTT.push(tab.child[i]);
                }
                else if (!tab.child[0].hasOwnProperty("parentid")) {
                    $scope.activeTT.push(tab.child[i]);
                }
            }
            $scope.activeTabs.push(tab.uidisplayname);
            tab.toggled = !tab.toggled;
            tab.wasOpened = true;
        }
    }

    $scope.$watchCollection('activeTT', function (newTT, oldTT) {
        filterProducts();
    });

    $scope.$watchCollection('asSelectedMans', function (newTT, oldTT) {
        filterProducts();
    });

    $scope.ClickedTypeType = function (tab) {
        tab.toggled = !tab.toggled;
        if (tab.toggled) {
            var index = $scope.activeTT.indexOf(tab);
            $scope.activeTT.splice(index, 1);
        }
        else if (!tab.toggled) {
            $scope.activeTT.push(tab);
        }
    }
    $scope.isProductBoxDisplayed = false;

    $scope.$watch('isProductBoxDisplayed', function (value, oldValue) {
        //if (value === oldValue) { return; }
        var d = document.getElementById('ProductBox');
        if (!!value) d.style.left = "210px";
        else d.style.left = "-600px";
    });

    var sipRot;

    $scope.toggleProdMenu = function () {
        $scope.isProductBoxDisplayed = !$scope.isProductBoxDisplayed;
        if (sipRot == true) {
            document.getElementById('sipka').style.transform = 'rotate(0deg)';
            sipRot = false;
        }
        else {
            document.getElementById('sipka').style.transform = 'rotate(180deg)';
            sipRot = true;
        }
    }

    var filterProducts = function(){

        $scope.productsToShow = [];
        for (var i = 0; i < $scope.activeTT.length; i++) {
            for (var j = 0; j < $scope.activeTT[i].products.length; j++) {
                if ($scope.asSelectedMans.length > 0 && $scope.asSelectedMans.indexOf($scope.activeTT[i].products[j].manufacturername) > -1) {
                    $scope.productsToShow = $scope.productsToShow.concat($scope.activeTT[i].products[j]);
                }
            }
        }

        if ($scope.productsToShow.length > 0) {
            $scope.isProductBoxDisplayed = true
            document.getElementById('sipka').style.transform = 'rotate(180deg)';
            sipRot = true;
            $scope.sipkaValid = false;
            if ($scope.productsToShow.length == 1){
                document.getElementById('ProductBox').style.width = '400px';
                $('#ProductBox .btn-group').css('width','100%');
            }
            else {
                document.getElementById('ProductBox').style.width = '800px';
                $('#ProductBox .btn-group').css('width','50%');
            }
        } else {
            $scope.isProductBoxDisplayed = false;
            document.getElementById('sipka').style.transform = 'rotate(0deg)';
            sipRot = false;
            $scope.sipkaValid = true;
        };
    }

    $scope.CenterInterier = function () {
        SendMessage("Main Camera", "ResetPosition");
    };
    $scope.getClass = function(indx, list){
        return {
            rightColumn: indx % 2,
            NotLastOnes: indx < list.length - 2 
        }
    }
}]);

app.controller('FPSCtrl', ['$scope', function ($scope) {
    setOkTrigger = function (string) {
        var okstring = string;
        showButtonMenu();
        if(okstring.charAt(0) == "0"){

        }
    };

    $scope.takeScreenShot = function(){
        SendMessage();
    }

    sendScreenAsBytes = function(byteString){
        var str = byteString;
        var bytes = [];

        for (var i = 0; i < str.length; ++i) {
            bytes.push(str.charCodeAt(i));
        }

        console.log(bytes);
    }

    var showButtonMenu = function(){
        document.getElementById('objMove').style.visibility = 'visible';
        document.getElementById('objRot').style.visibility = 'visible';
        document.getElementById('ok').style.visibility = 'visible';
        document.getElementById('colorCh').style.visibility = 'visible';
    }

    var hideButtonMenu = function(){
        document.getElementById('objMove').style.visibility = 'hidden';
        document.getElementById('objRot').style.visibility = 'hidden';
        document.getElementById('ok').style.visibility = 'hidden';
        document.getElementById('colorCh').style.visibility = 'hidden';
    }

    setGuiInfo = function (string) {
        var info = string;
        if (info.charAt(0) == "0") {
            document.getElementById('del').style.visibility = 'hidden';
        }
        else {
            document.getElementById('del').style.visibility = 'visible';
        }
        if (info.charAt(1) == "0") {
            document.getElementById('change-mat').style.visibility = 'hidden';
        }
        else {
            document.getElementById('change-mat').style.visibility = 'visible';
        }
        if (info.charAt(2) == "0") {
            document.getElementById('change-obj').style.visibility = 'hidden';
        }
        else {
            document.getElementById('change-obj').style.visibility = 'visible';
        }
        if (info.charAt(3) == "0") {
            document.getElementById('add').style.visibility = 'hidden';
        }
        else {
            document.getElementById('add').style.visibility = 'visible';
        }
        if (info.charAt(4) == "0") {
            document.getElementById('close').style.visibility = 'hidden';
        }
        else {
            document.getElementById('close').style.visibility = 'visible';
        }
        if (info.charAt(6) == "0") {
            document.getElementById('colorCh').style.visibility = 'hidden';
        }
        else {
            document.getElementById('colorCh').style.visibility = 'visible';
        }
    }

    $scope.destroyObject = function () {
        SendMessage("FpsManager", "Odstranit");
        hideAll();
    }

    $scope.changeMat = function () {
        SendMessage("FpsManager", "zmenitMaterial");
    }

    var hideAll = function () {
        document.getElementById('change-mat').style.visibility = 'hidden';
        document.getElementById('close').style.visibility = 'hidden';
        document.getElementById('add').style.visibility = 'hidden';
        document.getElementById('change-obj').style.visibility = 'hidden';
        document.getElementById("colorCh").style.visibility = 'hidden';
        document.getElementById("del").style.visibility = 'hidden';
    }

    $scope.closeRoundMenu = function () {
        hideAll();
        SendMessage("FpsManager", "X");
    }

    $scope.addObj = function () {
        SendMessage("FpsManager", "pridatObjekt");
    }

    $scope.changeObj = function () {
        SendMessage("FpsManager", "zmenitObjekt");
    }
    $scope.move = function () {
        SendMessage("FpsManager", "move");
    }

    $scope.rotate = function () {
        SendMessage("FpsManager", "rotation");
    }

    $scope.okTrigger = function () {
        SendMessage("FpsManager", "okTrigger");
        hideButtonMenu();
    }

    $scope.colorChooser = function () {
        SendMessage("FpsManager", "colorChooser");
    }

    $scope.mouseWASD_controll = function () {
        SendMessage("FpsManager", "mouseWASD_controll");
    }

    $scope.mouse_controll = function () {
        SendMessage("FpsManager", "mouse_controll");
    }

    $scope.editor = function () {
        SendMessage("FpsManager", "goToEditor");
        //browserDimensions();
    }

    $scope.activeM = function () {
        $("#objMove").addClass("selected");
        $("#objRot").removeClass("selected");
    }

    $scope.activeR = function () {
        $("#objRot").addClass("selected");
        $("#objMove").removeClass("selected");
    }
}])

