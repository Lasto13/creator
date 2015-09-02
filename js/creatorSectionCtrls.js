//'use strict';
app.controller('mainCtrl', ['$scope', '$http', '$window', '$timeout', function ($scope, $http, $window, $timeout) {
    console.logError = console.log;
    browserDimensions();
    //SendMessage('FunctionsManager','SetInputEnabled','1');

    var w = angular.element($window);

    w.bind('resize', function () {
        browserDimensions()
        $scope.$broadcast ('calculate');
    });

    function browserDimensions() {
        var clientWidth = window.innerWidth,
        clientHeight = window.innerHeight;

        var canvasH = document.getElementById('canvasHolder'),
            c_width = clientWidth - 270,
            c_height = clientHeight - 180;

        if (isFps){
            canvasH.style.width = clientWidth + 'px';
            canvasH.style.height = clientHeight +'px'; 
            canvasH.style.left = 0 +'px';
            canvasH.style.top = 0 +'px';
        } else {
            canvasH.style.width = c_width +'px';
            canvasH.style.height = c_height +'px'; 
            canvasH.style.left = 270 +'px';
            canvasH.style.top = 150 +'px';
        }
    }

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

    function userPlaces() {
      var params = {
        limit: 100
      };
      return $http.get('http://dev.enli.sk/api/places', {headers: {'Authorization': 'Bearer ' + JSON.parse(myStorage.getItem('token'))}}).then(function(resp){
        console.log(resp.data.places);
        return resp.data.places;
      }, function(err){
        console.log('server response ERROR');
        console.dir(err);
        $q.reject(err);
      });
    };
    
    //login();
    $scope.login = function() {
        var email = $scope.loginName,
            password = $scope.password;

        var request = $http.post('http://dev.enli.sk/api/tokens', { username: email, password: password });
        request.then(function (response) {
            saveDataToStorage(response.data);
            document.getElementById('loginScreen').style.opacity = '0';
            document.getElementById('loginScreen').style.display = 'none';
            $timeout(function() {
                initialize();
            }, 1500);  
        },
        function (err) {getErrorText('Nesprávne meno alebo heslo'); console.log('Server Error'); console.dir(err); });
    }

    function saveDataToStorage(data) {
        if ($window.Storage) {
            //myStorage = $window.sessionStorage;
            myStorage = $window.localStorage;
            myStorage.setItem('token', JSON.stringify(data.token.value));
            myStorage.setItem('user', JSON.stringify(data.user));            
            var place = userPlaces().then(function(resp){
                console.log(resp);
                getSave(resp);
            })
            
        } else console.log('Storage is not suported');
    };

    //var placeID = "55802cadd2aa3c3d6240679f";
    //var placeID = "55e6afbd8c26cc261ce71de4";

    var getSave = function (place) {
        console.log(place);

        var promise = {
            method: 'GET',
            url: 'http://dev.enli.sk/api/places/' + place[0].id + '/save',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + JSON.parse(myStorage.getItem('token')) }
        };

        $http(promise).then(function(resp, status, headers, conf){
            $scope.saves = resp.data;
        }) 
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
        c_width = window.innerWidth - 270,
        c_height = window.innerHeight - 180;

        canvasH.style.left = 270 + 'px';
        canvasH.style.top = 150 + 'px';

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
        document.getElementById('B31').className = 'Button btn btn-default';
        prepinac = false;
        SendMessage("CanvasEditor", "changeArea", 0);
        browserDimensions();
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
    };
    $scope.DW = function () {
        var _pR = document.getElementById('BDW5').parentNode,
            _pRIe = _pR.querySelectorAll('input');

        SendMessage("CanvasEditor", "changeArea", 2);
        /*
        document.getElementById('BDW5').className = 'Button radio-dw btn-my btn-my2';
        document.getElementById('BDW6').className = 'Button radio-dw btn-my';
        document.getElementById('BDW7').className = 'Button radio-dw btn-my';
        document.getElementById('BDW9').className = 'Button radio-dw btn-my';
        */
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
    $scope.RozmerySet = function (value) {SendMessage("Settings", "ShowTextFromWeb", value); };
    $scope.MierkaAuto = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 0);}
    $scope.Mierka10 = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 500);}
    $scope.Mierka50 = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 100);}
    $scope.Mierka100 = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 50);}
    $scope.MierkaVyp = function () {SendMessage("Mriezka_nastavenie", "SetRuler", 1000000);}

    $scope.UlozitProjekt = function () {
        document.getElementById('sp-holder').style.display = "block";
        document.getElementById('sp-holder').style.opacity = 1;
        document.getElementById('sp').value = '';
        //setInputValue();
        document.getElementById('sp').focus();
        closeAll();
        SendMessage('FunctionsManager','SetInputEnabled','0');
    };
    
    $scope.cancel = function () {
        document.getElementById('sp-holder').style.display = "none";
        document.getElementById('sp').value = "";
        document.getElementById('np-holder').style.display = "none";
        document.getElementById('sp-holder').style.opacity = 0;
        SendMessage('FunctionsManager','SetInputEnabled','1');
    }

    $scope.saveScene = function () {
        var saveName = document.getElementById('sp').value;
        var token = myStorage.getItem('token');
        console.log(token);
        SendMessage("Save Game Manager", "setTokens", token);
        SendMessage("Save Game Manager", "setAdvertisement", placeID);
        SendMessage("Save Game Manager", "SaveFromWeb", saveName);
        //SendMessage("Save Game Manager", "setAdvertisement", '55e6afbd8c26cc261ce71de4');
        document.getElementById('sp-holder').style.display = "none";
        document.getElementById('sp').value = "";
        document.getElementById('sp-holder').style.opacity = 0;
        SendMessage('FunctionsManager','SetInputEnabled','1');
        setTimeout(function(){getSave();}, 3000);
    }

    setShowRozmery = function (show) {
       
        if (show == 0) {
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
        document.getElementById('B31').className = 'Button btn btn-default';
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
        setTimeout(function(){SendMessage("Save Game Manager", "LoadAndDeserializeFromWeb", jsonstring);}, 3000);
    }
}]);

app.controller('podorysCtrl', ['$scope', 'XmatJson','XfloorJson','xMenu', function ($scope, XmatJson, XfloorJson,xMenu) {
    $scope.bla = '0';

    document.getElementById("ButtonContainer").addEventListener('click', function (e) {
        document.getElementById('B31').className = 'Button btn btn-default';
        prepinac = false;
    });

    wallCursors = function(cursor){
        switch(cursor){
            case '0': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});break;
            case '1': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/0.png) 0 17, default'});break;
            case '2': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/90.png) 17 0, default'});break;
        }
    }
    
    $(document.documentElement).css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});

    $scope.isCollapsed = true;

    XmatJson.get().then(function (data) {
        $scope.mats = data;
        calculateMatBox();
    });

    XfloorJson.get().then(function (data) {
        $scope.floors = data;
        calculateFloorBox();
    });

    var calculateMatBox = function(){
        var matCount = $scope.mats.length;
        var maxPBheight = window.innerHeight - 180;

        if((matCount)*100 < maxPBheight){
                document.getElementById('MaterialChooser').style.height = matCount*103 + 'px';    
        } else {
            document.getElementById('MaterialChooser').style.height = maxPBheight +'px';
            document.getElementById('MaterialChooser').style.width = 125 +'px';
        }
    };

    var calculateFloorBox = function(){
        var flCount = $scope.floors.length;
        var maxPBheight = window.innerHeight - 180;

        if((flCount)*100 < maxPBheight){
                document.getElementById('FloorChooser').style.height = matCount*103 + 'px';    
        } else {
            document.getElementById('FloorChooser').style.height = maxPBheight +'px';
            document.getElementById('FloorChooser').style.width = 125 +'px';
        }
    };

    var hodnotaB15 = 0;
    var vyskaSteny = 2.4;
    var hodnotaRotacie = 0;
    var isPressed = false;
    $(function () {
        $("#slider").slider({
            step: 5,
            min: 0,
            max: 360,
            values: [0], 
            slide: function (event, ui) {
                hodnotaRotacie = ui.value/360;
                SendMessage("RotaciaVzoruSlider","WebRotated", hodnotaRotacie);
                $scope.bla = JSON.stringify(Math.round(ui.value)) + '°';
                if (!$scope.$$phase) $scope.$apply();
            }
        });
        var slideris = document.getElementById("slider");
        slideris.addEventListener('mousedown', function (e) {
            document.getElementById('value').style.display = 'block';
            isPressed = true;
            SendMessage("RotaciaVzoruSlider","WebStartedRotating");
        });
        document.addEventListener('mouseup', function (e) {
            if(isPressed == true){
            document.getElementById('value').style.display = 'none';
            SendMessage("RotaciaVzoruSlider","WebEndedRotating");
            isPressed = false;
            }
        });
        
        var _handle = document.getElementsByClassName('ui-slider-handle')[0];
        var _value = document.getElementById('value');
        _handle.appendChild(_value);
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
        $scope.closeFloorMenu();
    };
    $scope.SingleWall = function () {
        $scope.NoOp();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_SingleWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/2.png), default'});
        document.getElementById('B31').className = 'Button btn btn-default';
        document.getElementById('B32').className = 'Button btn btn-default';
    };
    $scope.CurveWall = function () {
        $scope.NoOp();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_CurveWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/3.png), default'});
        document.getElementById('B31').className = 'Button btn btn-default';
        document.getElementById('B32').className = 'Button btn btn-default';
    };
    $scope.FourWall = function () {
        $scope.NoOp();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_4Wall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/4.png), default'});
        document.getElementById('B31').className = 'Button btn btn-default';
        document.getElementById('B32').className = 'Button btn btn-default';
    };
    $scope.Delete = function () {
        $scope.NoOp();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DeleteWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/5.png) 7 22 , default'});
        document.getElementById('B31').className = 'Button btn btn-default';
        document.getElementById('B32').className = 'Button btn btn-default';
    };
    $scope.AddControlPoint = function () {
        $scope.NoOp();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_AddControlPoint");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/6.png), default'});
        document.getElementById('B31').className = 'Button btn btn-default';
        document.getElementById('B32').className = 'Button btn btn-default';
    };
    $scope.PosunSteny = function () {
        $scope.NoOp();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_MoveWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/7.png), default'});
        document.getElementById('B31').className = 'Button btn btn-default';
        document.getElementById('B32').className = 'Button btn btn-default';
    };
    $scope.ZmenaMat = function () {
        $scope.NoOp();
        getErrorText('Zvoľte stenu pre zmenu materiálu');
        SendMessage("CanvasEditor", "SetView3D");
        document.getElementById('B12').className = 'Button btn-my radio-view';
        document.getElementById('B13').className = 'Button btn-my2 radio-view';
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_ChangeMatWall");
        //document.getElementById('MaterialChooser').style.left = 0+'px';
    };

    SetUndoRedoInteractable = function (IsInteractable) { 
        if(IsInteractable == "U0R0"){
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

    //$scope.toggleWallMatBorder = {item: 0}
    //$scope.toggleFloorMatBorder = {item: 0}

    $scope.ChoosenMaterial = function (id) {
        SendMessage("changeMat", "ChangeMatGL", id);
        //document.getElementById('MaterialChooser').style.left = -240+'px';
        //$scope.ZmenaMat();
        document.getElementById('B0').className = 'Button radio-picture btn-my';
        document.getElementById('B9').className = 'Button radio-picture btn-my2';
    }

    Set2D = function () {
        $scope.NoOp();
        SendMessage("CanvasEditor", "SetView2D");
        $("#B12").removeClass('btn-my');
        $("#B12").addClass('btn-my2');
        $("#B13").removeClass('btn-my2');
        $("#B13").addClass('btn-my');
    }
    Set3D = function(){
        $scope.NoOp();
        SendMessage("CanvasEditor", "SetView3D");
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
        $scope.NoOp();
        if(prepinac == false){
            $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
            document.getElementById('B0').className='Button radio-picture btn-my';
            document.getElementById('B1').className='Button radio-picture btn-my';
            document.getElementById('B2').className='Button radio-picture btn-my';
            document.getElementById('B3').className='Button radio-picture btn-my';
            document.getElementById('B4').className='Button radio-picture btn-my';
            document.getElementById('B5').className='Button radio-picture btn-my';
            document.getElementById('B8').className='Button radio-picture btn-my';
            document.getElementById('B9').className='Button radio-picture btn-my';
            SendMessage("FunctionsManager","SetFunctionActive","G01_SelectFlooring");
            document.getElementById('B31').className = 'Button btn activeChoose';
            document.getElementById('B32').className = 'Button btn btn-default';
            prepinac = true;
        } else if(prepinac == true){
            $scope.NoOp();
            $scope.closeFloorMenu();
            document.getElementById('B31').className = 'Button btn btn-default';
            prepinac = false;
        }
    }     

    $scope.Strih = function(){
        $scope.NoOp();
        prepinac = false;
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/9.png), default'});
        SendMessage("FunctionsManager","SetFunctionActive","G01_CutFlooring");
        document.getElementById('B0').className='Button radio-picture btn-my';
        document.getElementById('B1').className='Button radio-picture btn-my';
        document.getElementById('B2').className='Button radio-picture btn-my';
        document.getElementById('B3').className='Button radio-picture btn-my';
        document.getElementById('B4').className='Button radio-picture btn-my';
        document.getElementById('B5').className='Button radio-picture btn-my';
        document.getElementById('B8').className='Button radio-picture btn-my';
        document.getElementById('B9').className='Button radio-picture btn-my';
        document.getElementById('B31').className = 'Button btn btn-default';
        document.getElementById('B32').className = 'Button btn activeChoose';
    }

    $scope.VzorMaterialu = function(){
        document.getElementById('FloorChooser').style.left = "270px";
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
        document.getElementById('MaterialChooser').style.left = "270px";
    }
    $scope.closeMaterialMenu = function(){
        //$scope.ZmenaMat();
        $scope.NoOp();
        document.getElementById('MaterialChooser').style.left = -230 +'px';
    }
    $scope.closeFloorMenu = function(){
        //$scope.ZmenaMat();
        SendMessage("VzorButton","SelectionWindowClosed");
        document.getElementById('FloorChooser').style.left = -230 +'px';
    }
}]);

app.controller('dwCtrl', ['$scope', 'xMenu', function ($scope, xMenu) {

    $scope.$on('calculate', function(e) {  
        calculateWindowBox();
        calculateDoorBox();
    });

    xMenu.get().then(function (data) {
        $scope.menuData = data;
        calculateWindowBox();
        calculateDoorBox();
    });

    var calculateWindowBox = function(){
        var maxPBheight = window.innerHeight - 195;
        var prCount = $scope.menuData.okna.child.length;
        if((prCount/2)*157 < maxPBheight){
            if (prCount%2 == 0){
                document.getElementById('MenuItemWindow').style.height = ($scope.menuData.okna.child.length/2)*157+3+24+'px';  
            } else{
                document.getElementById('MenuItemWindow').style.height = ($scope.menuData.okna.child.length/2)*157+80+24+'px';
            }
        } else {
            document.getElementById('MenuItemWindow').style.height = maxPBheight +'px';
        }
    }

    var calculateDoorBox = function(){
        var maxPBheight = window.innerHeight - 195;
        var prCount = $scope.menuData.dvere.child.length;
        if((prCount/2)*157 < maxPBheight){
            if (prCount%2 == 0){
                document.getElementById('MenuItemDoor').style.height = ($scope.menuData.dvere.child.length/2)*157+3+30+'px';
                document.getElementById('MenuItemDoor').style.overflow = 'hidden'; 
            } else{
                document.getElementById('MenuItemDoor').style.height = ($scope.menuData.dvere.child.length/2)*157+80+30+'px';
                document.getElementById('MenuItemDoor').style.overflow = 'hidden';
            }
        } else {
            document.getElementById('MenuItemDoor').style.height = maxPBheight +'px';
        }
    }

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
    /*
    $scope.D2DDW = function () {
        SendMessage("CanvasEditor", "SetView2D");
    };
    $scope.D3DDW = function () {
        SendMessage("CanvasEditor", "SetView3D");
    };
    $scope.CenterDW = function () {
        SendMessage("Main Camera", "ResetPosition");
    };
    */
    $scope.NoOpDW = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G02_DefaultAction");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
    };
    $scope.DeleteDW = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G02_Delete");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/5.png) 7 22 , default'});
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

app.controller('interierCtrl', ['$scope','xMenu', function ($scope,xMenu) {

    xMenu.get().then(function(data){
        $scope.menuData = data;
        $scope.mf = data.manufacturers;
        for (var i = 0; i < data.elements.length; i++){
            for (var j = 0; j < data.elements[i].child.length; j++){
                if (data.elements[i].child[j].child[0].hasOwnProperty('parentid')){
                    data.elements[i].child[j].hasSubs = true;
                } else {
                    data.elements[i].child[j].hasSubs = false;
                }
            }
        }
        $scope.dropdownData = [];

        for (var i = 0; i<$scope.mf.length; i++){
            $scope.dropdownData.push($scope.mf[i]);
            //$scope.mf[i].isChecked = false;
        }
        $scope.dataToRepeat = [];
    });

    var hodnotaBI4 = 0;

    $scope.activeTT = [];
    $scope.productsToShow = [];
    $scope.asSelectedMans = [];
    $scope.sipkaValid = true;

    $scope.$on('calculate', function(e) {  
        $scope.calculateProductBox(); 
    });

    $scope.selectedManufacturers = [];
    $scope.TypIzby = [];

    $scope.izbaTexts = {toggle: 'Všetky',buttonDefaultText: 'Typ izby',dynamicButtonTextSuffix: 'Vybraná'};
    $scope.izbaSettings = {showCheckAll: false,showUncheckAll: false,chkbxID: 'toggleAllRooms',toggler: true, allID:'roomAll'};
    $scope.manSettings = {
        allID:'manAll',
        chkbxID: 'toggleAllMans',
        smartButtonMaxItems: 3,
        smartButtonTextConverter: function(itemText, originalItem) {
            return itemText;
        }
    };

    var numberOfProds = function(){
        if ($scope.dataToRepeat){
            for (var i=0; i < $scope.dataToRepeat.length; i++){
                $scope.dataToRepeat[i].prodsIncluded = 0;
                if ($scope.dataToRepeat[i].hasSubs == false){
                        for (var j=0; j < $scope.dataToRepeat[i].child[0].products.length; j++){
                            if ($scope.asSelectedMans.length > 0 && $scope.asSelectedMans.indexOf($scope.dataToRepeat[i].child[0].products[j].manufacturername) > -1){
                            $scope.dataToRepeat[i].prodsIncluded += 1;
                        }
                    }
                } else {
                    for (var k=0; k < $scope.dataToRepeat[i].child.length; k++){
                            $scope.dataToRepeat[i].child[k].prodsIncluded = 0;
                            for (var l = 0; l < $scope.dataToRepeat[i].child[k].products.length; l++){
                                if ($scope.asSelectedMans.length > 0 && $scope.asSelectedMans.indexOf($scope.dataToRepeat[i].child[k].products[l].manufacturername) > -1){
                                $scope.dataToRepeat[i].prodsIncluded += 1;
                                $scope.dataToRepeat[i].child[k].prodsIncluded += 1;
                            }
                        }
                    }
                }
            }
        }
    }
    
    function conTwoArr(a1, a2) {
        var unique = a1.concat(a2);
        for (i = 0; i < unique.length; i++){
            for (j = i+1 ; j < unique.length; j++){
                if (unique[i].uidisplayname == unique[j].uidisplayname){
                    unique.splice(j,1);
                }
            }
        }
        return unique;
    };
    
    $scope.roomProdCount = 0;
    $scope.$watchCollection('TypIzby', function (newIzba, oldIzba) {
        $scope.dataToRepeat = [];
        if (newIzba == oldIzba || newIzba.length == 0) return;
        $scope.roomProdCount = 0;
        if (newIzba.length == 1){
            $scope.dataToRepeat = newIzba[0].child;
            $scope.dataToRepeat.allSelected = false;
            if ($scope.asSelectedMans.length > 0){
                $scope.dataToRepeat.show = true;
            } else {
                $scope.dataToRepeat.show = false;
            }
            for (var i=0; i < $scope.dataToRepeat.length;i++){
                $scope.dataToRepeat[i].toggled = false;
                for (var j = 0; j < $scope.dataToRepeat[i].child.length; j++){
                    $scope.roomProdCount += $scope.dataToRepeat[i].child[j].products.length;
                    if ($scope.dataToRepeat[i].hasSubs){
                        $scope.dataToRepeat[i].child[j].toggled = false;
                    }
                }
            }
        } else {
            $scope.dataToRepeat = conTwoArr(newIzba[0].child,newIzba[1].child);
            $scope.dataToRepeat.allSelected = false;
            if ($scope.asSelectedMans.length > 0){
                $scope.dataToRepeat.show = true;
            } else {
                $scope.dataToRepeat.show = false;
            }
            for (var i=0; i < $scope.dataToRepeat.length;i++){
                $scope.dataToRepeat[i].toggled = false;
                for (var j = 0; j < $scope.dataToRepeat[i].child.length; j++){
                    $scope.roomProdCount += $scope.dataToRepeat[i].child[j].products.length;
                    if ($scope.dataToRepeat[i].hasSubs){
                        $scope.dataToRepeat[i].child[j].toggled = false;
                    }
                }
            }
        }
        $scope.activeTT = [];
        numberOfProds();
    });

    $scope.$watchCollection('selectedManufacturers', function (newMans, oldMans) {
        if (newMans == oldMans) return;
        $scope.setSelectedMan(newMans);
    });
    
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
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
        SendMessage("FunctionsManager", "SetFunctionActive", "G03_DefaultAction");
    };

    $scope.intRotAction = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G03_Rotate");
    };

    $scope.intDelAction = function () {
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/5.png) 7 22 , default'});
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
    };

    $scope.selectAllProds = function(){
        $scope.activeTT = [];
        //$scope.activeTabs = [];
        if (!$scope.dataToRepeat.allSelected){
            for (var i = 0; i < $scope.dataToRepeat.length; i++){
                if ($scope.dataToRepeat[i].hasSubs == true){
                    $scope.dataToRepeat[i].isOpen = true;
                    $scope.dataToRepeat[i].toggled = true;
                    $scope.dataToRepeat[i].halfToggled = false;
                    for (var j = 0; j < $scope.dataToRepeat[i].child.length; j++){
                        $scope.dataToRepeat[i].child[j].toggled = true;
                        $scope.activeTT.push($scope.dataToRepeat[i].child[j]);
                    }
                } else if ($scope.dataToRepeat[i].hasSubs == false) {
                    $scope.activeTT.push($scope.dataToRepeat[i].child[0]);
                }
                $scope.dataToRepeat[i].toggled = true;
                $scope.activeTabs.push($scope.dataToRepeat[i]);
            }
            $scope.dataToRepeat.allSelected = true;
        } else {
            for (var i = 0; i < $scope.dataToRepeat.length; i++){
                if ($scope.dataToRepeat[i].hasSubs){
                    $scope.dataToRepeat[i].isOpen = false;
                    $scope.dataToRepeat[i].toggled = false;
                    $scope.dataToRepeat[i].halfToggled = false;
                    for (var j = 0; j < $scope.dataToRepeat[i].child.length; j++){
                        $scope.dataToRepeat[i].child[j].toggled = false;
                    }
                } 
                $scope.dataToRepeat[i].toggled = false;
            }
            $scope.dataToRepeat.allSelected = false;
        }
        checkIfAll();
    };
    
    $scope.setSelectedMan = function(aoManufacturers) {
        $scope.asSelectedMans = [];
    
        if (aoManufacturers) {
            for (var i = 0, len = aoManufacturers.length; i < len; i++) {
                $scope.asSelectedMans.push(aoManufacturers[i].uidisplayname);                         
            }
        }
        if ($scope.TypIzby.length > 0 && $scope.asSelectedMans.length > 0){
                $scope.dataToRepeat.show = true;
            } else{
                $scope.dataToRepeat.show = false;
            }
        if ($scope.activeTT.length > 0) filterProducts();
    };

    // function to 'open' a tab
    $scope.openTab = function (tab) {
        // check if tab is already open
        if (tab.hasSubs){
            if ($scope.isOpenTab(tab.uidisplayname)) {
                $scope.activeTabs.splice($scope.activeTabs.indexOf(tab.uidisplayname), 1);
                tab.isOpen = false;
            } else {
            $scope.activeTabs.push(tab.uidisplayname);
            tab.isOpen = true;
            }
        } else if (tab.toggled == true) {
                for (var i = 0; i < tab.child.length; i++) {
                        var index = $scope.activeTT.indexOf(tab.child[i]);
                        $scope.activeTT.splice(index, 1);
                }
            //if it is, remove it from the activeTabs array
            $scope.activeTabs.splice($scope.activeTabs.indexOf(tab.uidisplayname), 1);
            tab.toggled = !tab.toggled;
        } else {
            for (var i = 0; i < tab.child.length; ++i) {
                $scope.activeTT.push(tab.child[i]);
                $scope.activeTabs.push(tab.uidisplayname);
                tab.toggled = !tab.toggled;
            }
        }
        checkIfAll();
    }

    $scope.checkAllSubtypes = function(tab){
        tab.halfToggled = false;
        tab.toggled = !tab.toggled;

        if (tab.toggled){
            for (var i = 0; i < tab.child.length; i++){
                tab.child[i].toggled = true;
                if ($scope.activeTT.indexOf(tab.child[i]) > -1) {
                    $scope.activeTT.splice($scope.activeTT.indexOf(tab.child[i]), 1);
                }
                var index = $scope.activeTT.indexOf(tab.child[i]);
                $scope.activeTT.push(tab.child[i]);
            }
        } else if (!tab.toggled){
            for (var i = 0; i < tab.child.length; i++){
                tab.child[i].toggled = false;
                if ($scope.activeTT.indexOf(tab.child[i]) > -1) {
                    $scope.activeTT.splice($scope.activeTT.indexOf(tab.child[i]), 1);
                }
            } 
        }
        checkIfAll();
    }
    
    var checkIfAll = function(){
        $scope.asProdCount = 0;
        $scope.dataToRepeat.halfToggled = false;
        for (var i = 0; i < $scope.dataToRepeat.length; i++ ){
            if ($scope.dataToRepeat[i].hasSubs){
                for (var j = 0; j < $scope.dataToRepeat[i].child.length; j++){
                    console.log('child');
                    if ($scope.dataToRepeat[i].child[j].toggled){
                        $scope.asProdCount += $scope.dataToRepeat[i].child[j].products.length;
                    }
                }
            } else {
                if ($scope.dataToRepeat[i].toggled){
                    $scope.asProdCount += $scope.dataToRepeat[i].child[0].products.length;
                }
            }
        }
        if ($scope.asProdCount == $scope.roomProdCount){
            $scope.dataToRepeat.allSelected = true;
        } else if ($scope.asProdCount == 0) {
            $scope.dataToRepeat.allSelected = false;
        } else {
            $scope.dataToRepeat.halfToggled = true;
        }
    };
    
    $scope.$watchCollection('activeTT', function (newTT, oldTT) {
        if (newTT == oldTT) return;
        filterProducts();
    });

    $scope.$watchCollection('asSelectedMans', function (newMans, oldMans) {
        if (newMans == oldMans) return;
        filterProducts();
    });

    $scope.ClickedTypeType = function (tab, $parent) {
        tab.toggled = !tab.toggled;

        if (tab.toggled == false) {
            console.log($scope.activeTT);
            var index = $scope.activeTT.indexOf(tab);
            $scope.activeTT.splice(index, 1);
            console.log($scope.activeTT);
        }
        if (tab.toggled == true) {
            $scope.activeTT.push(tab);
        }
        var _isT = 0;
        for (var i = 0; i < $parent.TypeProduct.child.length; i++){
            if ($parent.TypeProduct.child[i].toggled == true){
                _isT +=1;
            }
        }
        $parent.TypeProduct.halfToggled = false;
        if (_isT == $parent.TypeProduct.child.length){
            $parent.TypeProduct.toggled = true;
        } else if (_isT == 0){
            $parent.TypeProduct.toggled = false;
        } else {
            $parent.TypeProduct.halfToggled = true;
        }
        checkIfAll();
    }

    $scope.isProductBoxDisplayed = false;

    $scope.$watch('isProductBoxDisplayed', function (value, oldValue) {
        var d = document.getElementById('ProductBox');
        if (!!value) {
            d.style.left = "270px";
        }
        else {
            d.style.left = "-600px";
        }
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

    $scope.calculateProductBox = function(){
        var maxPBheight = window.innerHeight - 195;
        var prCount = $scope.productsToShow.length;
        if((prCount/2)*157 < maxPBheight){
            if (prCount%2 == 0){
                document.getElementById('ProductBox').style.height = ($scope.productsToShow.length/2)*157+3+24+'px';    
            } else{
                document.getElementById('ProductBox').style.height = ($scope.productsToShow.length/2)*157+80+24+'px';
            }
        } else {
            document.getElementById('ProductBox').style.height = maxPBheight +'px';
        }

        if ($scope.productsToShow.length == 1){
            document.getElementById('ProductBox').style.width = '400px';
            setTimeout(function(){$('#ProductBox .btn-group').css('width','100%');}, 10);
        } else {
            document.getElementById('ProductBox').style.width = '800px';
            setTimeout(function(){$('#ProductBox .btn-group').css('width','50%');}, 10);
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

        numberOfProds();
        $scope.calculateProductBox();

        if ($scope.productsToShow.length > 0) {
            $scope.isProductBoxDisplayed = true
            document.getElementById('sipka').style.transform = 'rotate(180deg)';
            sipRot = true;
            $scope.sipkaValid = false;
        } else {
            $scope.isProductBoxDisplayed = false;
            document.getElementById('sipka').style.transform = 'rotate(0deg)';
            sipRot = false;
            $scope.sipkaValid = true;
        };
    }

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
    $scope.getClass = function(indx, list){
        return {
            rightColumn: indx % 2,
            NotLastOnes: indx < list.length - 2 
        }
    }
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
}]);

app.controller('FPSCtrl', ['$scope', function ($scope) {
    setOkTrigger = function (string) {
        var okstring = string;
        showButtonMenu();
        if(okstring.charAt(0) == "0"){

        }
    };

    setFpsCursors = function(cursor){
        switch(cursor){
            case '0': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});break;
            case '1': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/8.png), default'});break;
        }
    }

    $scope.takeScreenShot = function(){
        SendMessage('Screen_and_Save','getScreenByte');
    }

    sendScreenAsBytes = function(){

        for (var i = 0; i < arguments.length; i++) {
            //console.log(arguments[i]);
        }
        //console.log(byteString);
        /*
        var str = byteString;
        var bytes = [];
        /*
        for (var i = 0; i < str.length; ++i) {
            bytes.push(str.charCodeAt(i));
        }
        */
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
        if (string == '0000000'){
            hideAll();
        } else {
            showAll();
            var info = string;
            if (info.charAt(0) == "0") {
                document.getElementById('del').style.opacity = '0.3';
                document.getElementById('del').style.pointerEvents = 'none';
            }
            else {
                document.getElementById('del').style.opacity = '1';
                document.getElementById('del').style.pointerEvents = 'auto';
            }
            if (info.charAt(1) == "0") {
                document.getElementById('change-mat').style.opacity = '0.3';
                document.getElementById('change-mat').style.pointerEvents = 'none'
            }
            else {
                document.getElementById('change-mat').style.opacity = '1';
                document.getElementById('change-mat').style.pointerEvents = 'auto';
            }
            if (info.charAt(2) == "0") {
                document.getElementById('change-obj').style.opacity = '0.3';
                document.getElementById('change-obj').style.pointerEvents = 'none';
            }
            else {
                document.getElementById('change-obj').style.opacity = '1';
                document.getElementById('change-obj').style.pointerEvents = 'auto';
            }
            if (info.charAt(3) == "0") {
                document.getElementById('add').style.opacity = '0.3';
                document.getElementById('add').style.pointerEvents = 'none';
            }
            else {
                document.getElementById('add').style.opacity = '1';
                document.getElementById('add').style.pointerEvents = 'auto';
            }
            if (info.charAt(4) == "0") {
                document.getElementById('close').style.visibility = 'hidden';
            }
            else {
                document.getElementById('close').style.visibility = 'visible';
            }
            if (info.charAt(5) == "0") {
                document.getElementById('colorCh').style.visibility = 'hidden';
            }
            else {
                document.getElementById('colorCh').style.visibility = 'visible';
            }
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

    var showAll = function () {
        document.getElementById('change-mat').style.visibility = 'visible';
        document.getElementById('close').style.visibility = 'visible';
        document.getElementById('add').style.visibility = 'visible';
        document.getElementById('change-obj').style.visibility = 'visible';
        document.getElementById("colorCh").style.visibility = 'visible';
        document.getElementById("del").style.visibility = 'visible';
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

    $scope.keybControll = function (){
        SendMessage("FpsManager", "keyboard_controll");
    }

    $scope.mouse_controll = function () {
        SendMessage("FpsManager", "mouse_controll");
    }

    $scope.editor = function () {
        SendMessage("FpsManager", "goToEditor");
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

