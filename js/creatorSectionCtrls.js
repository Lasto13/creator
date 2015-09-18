/*'use strict';*/
app.controller('mainCtrl', ['$scope', '$window', '$timeout', 'jsonFactory', 'communicator', function ($scope, $window, $timeout, jsonFactory, communicator) {
    console.logError = console.log;
    browserDimensions();
    /*SendMessage('FunctionsManager','SetInputEnabled','1');*/

    var w = angular.element($window);

    w.bind('resize', function () {
        browserDimensions()
        $scope.$broadcast ('calculate');
    });

    function browserDimensions() {
        var clientWidth = window.innerWidth,
        clientHeight = window.innerHeight;

        var leftP = clientWidth / 2 - 20,
        topP = clientHeight / 2 - 10,
        leftT = clientWidth / 2 - 200,
        topT = clientHeight / 2 + 80,
        perc = document.getElementById("splash-sc").children[1],
        text = document.getElementById("splash-sc").children[2];

        perc.style.left = leftP + 'px';
        text.style.left = leftT + 'px';

        perc.style.top = topP + 'px';
        text.style.top = topT + 'px';

        var canvasH = document.getElementById('canvasHolder'),
            c_width = clientWidth - 300,
            c_height = clientHeight - 180;
        document.getElementById('Categories').style.height = clientHeight - 150 - 35 - $('#drop_holder').height() - 20 + 'px';

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

    closeLoder = function(){
        document.getElementById('splash-sc').style.display = 'none';
    }

    var myStorage;
    $scope.user = {};
    $scope.saveName = '';
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

    $scope.logButDisabled = false;

    $scope.currentUser = {}

    if ($window.Storage){
        var myStorage = $window.localStorage;
        var today = new Date();
        if (( myStorage.getItem('day') == today.getDate() ) && ((today.getHours() - myStorage.getItem('time')) < 3)) {
            var _token = myStorage.getItem('token');
            if (_token){
                communicator.getCurrentUser().then(function(resp){
                    $scope.currentUser.email = resp.email;
                });
                document.getElementById('loginScreen').style.opacity = '0';
                document.getElementById('loginScreen').style.display = 'none';
                $timeout(function() {
                    initialize();
                    wasLoaded = true;
                }, 1500);
            }
        } else {
            deleteDataFromStorage();
        }
        
    }

    $scope.logOut = function(){
        deleteDataFromStorage();
        //$scope.$broadcast ('setDefaults');
        SendMessage('FunctionsManager','SetInputEnabled','0');
        document.getElementById('loginScreen').style.opacity = '1';
        document.getElementById('loginScreen').style.display = 'block';
        location.reload();
    }

    function deleteDataFromStorage() {
        $scope.currentUser.email = null;
        var myStorage;
        if ($window.Storage) {
            myStorage = $window.localStorage;
            delete myStorage.token;
            delete myStorage.user;
            delete myStorage.place;
            delete myStorage.day;
            delete myStorage.time;
            $scope.logButDisabled = false;
        } else {
          console.log('Storage is not suported');
        }
    }

    var wasLoaded = false;

    $scope.login = function(){
        if ($scope.logButDisabled == false){
            $scope.logButDisabled = true;
            var email = $scope.user.login,
                password = $scope.user.pass;
            communicator.login(email,password).then(function(resp){
            if (resp == null) {$scope.logButDisabled = false; return}
                communicator.saveDataToStorage(resp.data);
                communicator.userPlaces().then(function(resp){
                    var placeID = resp[0].id;
                    if ($window.Storage){
                        var myStorage = $window.localStorage;
                        myStorage.setItem('place', JSON.stringify(placeID));    
                }
                communicator.getCurrentUser().then(function(resp){
                    $scope.currentUser.email = resp.email;
                });
                communicator.getSave().then(function(resp){
                    $scope.saves = resp.data;
                    if (wasLoaded == true) {
                        SendMessage("NewProject", "NewProject");
                        SendMessage('FunctionsManager','SetInputEnabled','1');
                    } else {
                        $timeout(function() {
                            initialize();
                            wasLoaded = true;
                            }, 1500);
                        }
                    })
                })
            })
        } else {return}
    }
    /*
    $scope.getImgForSave = function(save){
        console.log(save.image);
        if ($window.Storage)
        {
            var myStorage = $window.localStorage;
        }
        var _placeID = JSON.parse(myStorage.getItem('place'));

        var url = 'http://dev.enli.sk/public/places/' + _placeID + '/save/' + save.image.key;

        return url
    }
    */
    $scope.deleteSave = function(save){
        calculateSaveBox();
        communicator.deleteSave(save.id).then(function(resp, status, headers, conf){
            $scope.saves = resp.data;
            if (!$scope.$$phase) $scope.$apply();
        });
    }

    $scope.isSettingOpened = false;

    $scope.SetSettings = function () {
        if (prepinacSet == 0) {
            $('#Settings').css({ top: 110 + 'px' });
            $('#LoadProject').css({ top: -470 + 'px' });
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

    function calculateSaveBox(){
        var _sl = $scope.saves.savePlace.parts.length;
        if (_sl < 5){
            document.getElementById('LoadProject').style.height = 69 * _sl + 2 + 'px';
        } else {
            document.getElementById('LoadProject').style.height = 350 + 'px';
        }
    }

    $scope.SetLoad = function () {
        if (prepinacLoad == 0) {
            if ($window.Storage) var myStorage = $window.localStorage;
            var _placeID = JSON.parse(myStorage.getItem('place'));
            communicator.getSave(_placeID).then(function(resp){
                    $scope.saves = resp.data;
                    calculateSaveBox();
                })
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

    graphicSettings = function(value){
        switch(value){
            case 0: document.getElementById('radio01').checked = true; break;
            case 1: document.getElementById('radio02').checked = true; break;
            case 2: document.getElementById('radio03').checked = true; break;
        }
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
        $timeout(function () { document.getElementById('errMsg').style.opacity = 0; }, 3000);
    };

    $scope.Podorys = function () {
        $scope.$broadcast ('setDefaults');
        prepinac = false;
        SendMessage("CanvasEditor", "changeArea", 0);
        browserDimensions();
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
    };
    $scope.DW = function () {
        SendMessage("CanvasEditor", "changeArea", 2);
        $scope.$broadcast ('setDefaults');
        browserDimensions();
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
    };
    $scope.Interier = function () {
        $scope.$broadcast ('setDefaults');
        SendMessage("CanvasEditor", "changeArea", 5);
        browserDimensions();
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
    };
    $scope.D2D = function () {
        if ($scope.activeMenu.first == true) {
            $scope.$broadcast ('setDefaults');
        }
        SendMessage("CanvasEditor", "SetView2D");
    };
    $scope.D3D = function () {
        SendMessage("CanvasEditor", "SetView3D");
        if ($scope.activeMenu.first == true) {
            $scope.$broadcast ('setDefaults');
        }
    };

    var defActionClass = function(){
        $('#ButtonContainer .btn-my2').removeClass('btn-my2');
        $('#B0').addClass('btn-my2');
    }

    $scope.Center = function () { SendMessage("Main Camera", "ResetPosition"); };
    $scope.Undo = function () { SendMessage("UndoRedo", "Undo"); defActionClass();};
    $scope.Redo = function () { SendMessage("UndoRedo", "Redo"); defActionClass();};
    $scope.FPS = function () {SendMessage("EventSystem", "FpsPosition");};
    $scope.Kvalita = function (value) { SendMessage("Settings", "setLevel", value); };
    $scope.HranySet = function (value) { SendMessage("Settings", "setAA", value); };
    $scope.RozmerySet = function (value) {SendMessage("Settings", "ShowTextFromWeb", value); };
    $scope.MierkaAuto = function () {SendMessage("Settings", "SetRuler", 0);}
    $scope.Mierka10 = function () {SendMessage("Settings", "SetRuler", 500);}
    $scope.Mierka50 = function () {SendMessage("Settings", "SetRuler", 100);}
    $scope.Mierka100 = function () {SendMessage("Settings", "SetRuler", 50);}
    $scope.MierkaVyp = function () {SendMessage("Settings", "SetRuler", 1000000);}

    $scope.UlozitProjekt = function () {
        document.getElementById('sp-holder').style.display = "block";
        document.getElementById('sp-holder').style.opacity = 1;
        document.getElementById('sp').value = '';
        document.getElementById('sp').focus();
        closeAll();
        SendMessage('FunctionsManager','SetInputEnabled','0');
    };
    
    $scope.cancel = function () {
        document.getElementById('sp-holder').style.display = "none";
        document.getElementById('sp').value = "";
        document.getElementById('really-holder').style.display = "none";
        document.getElementById('sp-holder').style.opacity = 0;
        SendMessage('FunctionsManager','SetInputEnabled','1');
    }

    $scope.saveScene = function () {
        var saveName = $scope.saveName;

        communicator.saveScene(saveName);

        document.getElementById('sp-holder').style.display = "none";
        document.getElementById('sp').value = "";
        document.getElementById('sp-holder').style.opacity = 0;
        if ($scope.ask.option == 'new'){
            $scope.CleanProject();
        } else if ($scope.ask.option == 'open'){
            getErrorText('Načítavam');
            closeAll();
            $scope.CleanProject();
            $scope.$broadcast ('setDefaults');
            var jsonstring = $scope.ask.toLoad;
            $timeout(function(){SendMessage("Save Game Manager", "LoadAndDeserializeFromWeb", jsonstring);}, 3000);
        }
        $scope.ask = {};
        $timeout(function(){
            communicator.getSave().then(function(resp){
                $scope.saves = resp.data;
            })
        ;}, 3000);

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
        
        SendMessage('EventSystem','askActionsBeforeOpenNewProject');
        $timeout(function(){
            if (noChangesMade == true){
                //SendMessage('FunctionsManager','SetInputEnabled','0');
                closeAll();
                $scope.CleanProject();
                $scope.$broadcast ('setDefaults');
            } else {
                $scope.ask.text = 'Otvoriť nový projekt';
                $scope.ask.option = 'new';
                SendMessage('FunctionsManager','SetInputEnabled','0');
                closeAll();
                document.getElementById('really-holder').style.display = "block";
                document.getElementById('really-holder').style.opacity = 1;
                $scope.$broadcast ('setDefaults');
            }
        }, 100)
    }

    $scope.openSaveDialog = function(){
        document.getElementById('sp').value = '';
        document.getElementById('really-holder').style.display = "none";
        document.getElementById('really-holder').style.opacity = 0;
        document.getElementById('sp-holder').style.display = "block";
        document.getElementById('sp-holder').style.opacity = 1;
        document.getElementById('sp').focus();
    }

    var noChangesMade = true 

    askActionsBeforeOpenNewProject = function(canLoad){
        if (canLoad == 1){
            noChangesMade = true;
        } else {
            noChangesMade = false;
        }
        console.log(canLoad);
    }

    $scope.CleanProject = function () {
        defActionClass();
        document.getElementById('really-holder').style.display = "none";
        document.getElementById('really-holder').style.opacity = 0;
        SendMessage("NewProject", "NewProject");
        SendMessage('FunctionsManager','SetInputEnabled','1');
    }

    $scope.cleanOrOpen = function(){
        if ($scope.ask.option == 'new'){
            defActionClass();
            document.getElementById('really-holder').style.display = "none";
            document.getElementById('really-holder').style.opacity = 0;
            SendMessage("NewProject", "NewProject");
            SendMessage('FunctionsManager','SetInputEnabled','1');
        } else if ($scope.ask.option == 'open'){
            getErrorText('Načítavam');
            closeAll();
            $scope.CleanProject();
            $scope.$broadcast ('setDefaults');
            var jsonstring = $scope.ask.toLoad;
            $timeout(function(){SendMessage("Save Game Manager", "LoadAndDeserializeFromWeb", jsonstring);}, 3000); 
        }
    }

    savingFinished = function (value) {
        if (value === "1") getErrorText('Uloženie prebehlo správne');
        else if (value === "0") getErrorText("Váš projekt nebol uložený");
    }

    loadingFinished = function (value) {
        document.getElementById('LoadProject').style.pointerEvents = 'auto';
    }

    $scope.ask = {};

    $scope.OtvoritProjekt = function (jsonstring) {
        SendMessage('EventSystem','askActionsBeforeOpenNewProject');
        $timeout(function(){
            if (noChangesMade == true){
                //SendMessage('FunctionsManager','SetInputEnabled','0');
                closeAll();
                $scope.CleanProject();
                $scope.$broadcast ('setDefaults');
                $timeout(function(){SendMessage("Save Game Manager", "LoadAndDeserializeFromWeb", jsonstring);}, 3000);
            } else {
                $scope.ask.text = 'Otvoriť projekt';
                $scope.ask.option = 'open';
                $scope.ask.toLoad = jsonstring;
                SendMessage('FunctionsManager','SetInputEnabled','0');
                closeAll();
                document.getElementById('really-holder').style.display = "block";
                document.getElementById('really-holder').style.opacity = 1;
                $scope.$broadcast ('setDefaults');
            }
        }, 100)
        document.getElementById('LoadProject').style.pointerEvents = 'none';
    }
}]);

app.controller('podorysCtrl', ['$scope', 'jsonFactory', function ($scope, jsonFactory) {
    $(document.documentElement).css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});

    $scope.$on('setDefaults', function(e) {
        $scope.actButtPod = {'id': 'B0'};
        document.getElementById('MaterialChooser').style.left = -230 +'px';
        document.getElementById('FloorChooser').style.left = -230 +'px';
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DefaultAction");
    });

    prepinac = false;
    wallCursors = function(cursor){
        switch(cursor){
            case '0': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});break;
            case '1': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/0.png) 0 17, default'});break;
            case '2': $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/90.png) 17 0, default'});break;
        }
    }
    
    jsonFactory.loadWalls().then(function(data){
        $scope.mats = data;
        calculateMatBox();
    })

    jsonFactory.loadFloors().then(function(data){
        $scope.floors = data;
        calculateFloorBox();
    })

    $scope.isCollapsed = true;

    var calculateMatBox = function(){
        var matCount = $scope.mats.length;
        var maxPBheight = window.innerHeight - 180;
        var _hldr = document.getElementById('mHolder');

        if((matCount)*100 < maxPBheight){
                document.getElementById('MaterialChooser').style.height = matCount*103 + 'px';   
                _hldr.style.height = matCount*103 +'px';
        } else {
            document.getElementById('MaterialChooser').style.height = maxPBheight +'px';
            document.getElementById('MaterialChooser').style.width = 125 +'px';
            _hldr.style.height = maxPBheight - 26 + 'px';
        }
    };

    var calculateFloorBox = function(){
        var flCount = $scope.floors.length;
        var maxPBheight = window.innerHeight - 180;
        var _hldr = document.getElementById('fHolder');

        if((flCount)*100 < maxPBheight){
                document.getElementById('FloorChooser').style.height = matCount*103 + 'px';
                _hldr.style.height = matCount*103 - 26 + 'px';
        } else {
            document.getElementById('FloorChooser').style.height = maxPBheight +'px';
            document.getElementById('FloorChooser').style.width = 125 +'px';
            _hldr.style.height = maxPBheight - 26 + 'px';
        }
    };

    SetWallTypeButtonActive = function(){

    }

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
                $scope.slValue = JSON.stringify(Math.round(ui.value)) + '°';
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

    function zmenaVysky (height) {
        SendMessage("Plane0", "ChangeFloorScale", height);
    }

    $(function () {
        $("#spinner").spinner({
            step: 0.1,
            numberFormat: "n",
            spin: function (event, ui) {
                $(this).change();
                zmenaVysky(ui.value);
            }
        });
    });
    
    $scope.NoOp = function () {
        $scope.actButtPod = {'id': 'B0'};
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DefaultAction");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
        document.getElementById('MaterialChooser').style.left = -230 +'px';
    };
    $scope.SingleWall = function () {
        Set2D();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_SingleWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/2.png), default'});
    };
    $scope.CurveWall = function () {
        Set2D();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_CurveWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/3.png), default'});
    };
    $scope.FourWall = function () {
        Set2D();
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/4.png), default'});
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_4Wall");
    };
    $scope.Delete = function () {
        Set2D();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DeleteWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/5.png) 7 22 , default'});
    };
    $scope.AddControlPoint = function () {
        Set2D();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_AddControlPoint");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/6.png), default'});
    };
    $scope.PosunSteny = function () {
        Set2D();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_MoveWall");
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/7.png), default'});
    };
    $scope.ZmenaMat = function () {
        getErrorText('Zvoľte stenu pre zmenu materiálu');
        Set3D();
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_ChangeMatWall");
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

    $scope.ChoosenMaterial = function (id) {
        SendMessage("changeMat", "ChangeMatGL", id);
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

    $scope.actButtPod = {'id': 'B0'};

    $scope.podActive = function(event){
        if ($scope.actButtPod.id !== 'B31' && event.target.id == 'B31') {
            $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
            SendMessage("FunctionsManager","SetFunctionActive","G01_SelectFlooring");
            $scope.actButtPod = {'id': 'B31'};
            } else if($scope.actButtPod.id == 'B31' && event.target.id == 'B31'){
                SetDefaultFunctionPodorys();
                $scope.closeFloorMenu();
        } else {
            $scope.actButtPod = {'id' : event.target.id};
        }
    }
     
    $scope.VyberPodlahy = function(){
        $scope.NoOp();
        if(prepinac == false){
            $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/1.png), default'});
            SendMessage("FunctionsManager","SetFunctionActive","G01_SelectFlooring");
            prepinac = true;
        } else if(prepinac == true){
            $scope.closeFloorMenu();
            prepinac = false;
            $scope.actButtPod = {'id': 'B0'};
        }
    }     

    $scope.Strih = function(){
        $scope.NoOp();
        $('#canvasHolder').css({'cursor': 'url(http://85.159.111.72/cursors/9.png), default'});
        SendMessage("FunctionsManager","SetFunctionActive","G01_CutFlooring");
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

    $scope.flMat = {}
    $scope.flMat.isDisabled = true;

    isFloorChoosen = function(value){
        if(value == 0){
            SendMessage("VzorButton","SelectionWindowClosed");
            document.getElementById('FloorChooser').style.left = -230 +'px';
            $scope.flMat.isDisabled = true;
        }
        else{
            document.getElementById('FloorChooser').style.left = "270px";
            SendMessage("FunctionsManager","SetFunctionActive","G04_MaterialSelection");
            $scope.flMat.isDisabled = false;
        }
    }
    
    openMaterialMenu = function () {
        document.getElementById('MaterialChooser').style.left = "270px";
    }
    $scope.closeMaterialMenu = function(){
        document.getElementById('MaterialChooser').style.left = -230 +'px';
    }
    $scope.closeFloorMenu = function(){
        SendMessage("VzorButton","SelectionWindowClosed");
        document.getElementById('FloorChooser').style.left = -230 +'px';
    }
}]);

app.controller('dwCtrl', ['$scope', 'jsonFactory', function ($scope, jsonFactory) {

    $scope.$on('setDefaults', function(e) {
        $scope.actButtDw = {'id': 'BDW5'};
        $scope.setMenu(0);
        SendMessage("FunctionsManager", "SetFunctionActive", "G02_DefaultAction");
    });

    $scope.$on('calculate', function(e) {
        calculateWindowBox();
        calculateDoorBox();
    });

    $scope.actButtDw = {'id' : 'BDW5'}
    $scope.dwActive = function(event){
        $scope.actButtDw = {'id' : event.target.id}
    }

    jsonFactory.loadMenu().then(function (data) {
        $scope.menuData = data;
        calculateWindowBox();
        calculateDoorBox();
    });

    var calculateWindowBox = function(){
        var maxPBheight = window.innerHeight - 195;
        var prCount = $scope.menuData.okna.child.length;
        var _hldr = document.getElementById('wHolder');
        if((prCount/2)*157 < maxPBheight){
            if (prCount%2 == 0){
                var _ch = ($scope.menuData.okna.child.length/2)*157+3+24
                document.getElementById('MenuItemWindow').style.height = _ch +'px';
                _hldr.style.height = _ch - 28 + 'px';
            } else{
                var _ch = ($scope.menuData.okna.child.length/2)*157+80+24
                document.getElementById('MenuItemWindow').style.height = _ch +'px';
                _hldr.style.height = _ch - 28 + 'px';
            }
        } else {
            document.getElementById('MenuItemWindow').style.height = maxPBheight +'px';
            _hldr.style.height = maxPBheight -28 + 'px';
        }
    }

    var calculateDoorBox = function(){
        var maxPBheight = window.innerHeight - 195;
        var prCount = $scope.menuData.dvere.child.length;
        var _hldr = document.getElementById('dHolder');
        if((prCount/2)*157 < maxPBheight){
            if (prCount%2 == 0){
                var _ch = ($scope.menuData.dvere.child.length/2)*157+3+30;
                document.getElementById('MenuItemDoor').style.height = _ch +'px';
                document.getElementById('MenuItemDoor').style.overflow = 'hidden';
                _hldr.style.height = _ch - 27 + 'px';
            } else{
                var _ch = ($scope.menuData.dvere.child.length/2)*157+80+30;
                document.getElementById('MenuItemDoor').style.height = _ch+'px';
                document.getElementById('MenuItemDoor').style.overflow = 'hidden';
                _hldr.style.height = _ch - 27 + 'px';
            }
        } else {
            document.getElementById('MenuItemDoor').style.height = maxPBheight +'px';
            _hldr.style.height = maxPBheight - 27 + 'px';
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
            leftColumn: Math.abs(indx+1) % 2 == 1,
            NotLastOnes: indx < list.length - 2,
            specialOne: indx % 2 && list.length %2
        }
    }
}]);

app.controller('interierCtrl', ['$scope','jsonFactory', '$timeout', function ($scope,jsonFactory,$timeout) {

    $scope.$on('setDefaults', function(e) {
        $scope.actButtInt = {'id': 'BI5'};
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DefaultAction");
    });

    $scope.actButtInt = {'id' : 'BI5'}
    $scope.intActive = function(event){
        $scope.actButtInt = {'id' : event.target.id}
    }

    jsonFactory.loadMenu().then(function(data){
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
        $scope.allPossible = 0;
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
            for (var i=0; i < $scope.dataToRepeat.length; i++){
                $scope.allPossible += $scope.dataToRepeat[i].prodsIncluded;
            }
        }
    };
    
    function conTwoArr(a1, a2) {
        var unique = a1.concat(a2);
        for (i = 0; i < unique.length; i++){
            for (j = i+1 ; j < unique.length; j++){
                if (unique[i].uidisplayname == unique[j].uidisplayname){
                    if (unique[i].hasSubs && unique[j].hasSubs){
                        var subtypes = unique[i].child.concat(unique[j].child);
                        for (var k=0; k < subtypes.length; k++){
                            for (var l=k+1; l < subtypes.length; l++){
                                if (subtypes[k].uidisplayname == subtypes[l].uidisplayname){
                                    subtypes.splice(l,1);
                                }
                            }
                        }
                        unique[i].child = subtypes;
                    }
                    unique.splice(j,1);
                }
            }
        }
        return unique;
    };
    
    $scope.manDisabled = false;
    $scope.$watchCollection('TypIzby', function (newIzba, oldIzba) {
        if (newIzba.length == 0){
            $scope.manDisabled = true;
        } else $scope.manDisabled = false;

        $scope.dataToRepeat = [];
        if (newIzba == oldIzba || newIzba.length == 0) return;
        //$scope.roomProdCount = 0;
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
                    //$scope.roomProdCount += $scope.dataToRepeat[i].child[j].products.length;
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
                    //$scope.roomProdCount += $scope.dataToRepeat[i].child[j].products.length;
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
        SendMessage("FunctionsManager", "SetFunctionActive", "G03_DefaultAction");
    }
    
    // initiate an array to hold all active tabs
    $scope.activeTabs = [];

    /* check if the tab is active*/
    $scope.isOpenTab = function (tab) {
        /* check if this tab is already in the activeTabs array */
        if ($scope.activeTabs.indexOf(tab) > -1) {
            /* if so, return true*/
            return true;
        } else {
            /* if not, return false*/
            return false;
        }
    };

    $scope.selectAllProds = function(){
        $scope.activeTT = [];
        $scope.activeTabs = [];
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
                $scope.activeTabs.push($scope.dataToRepeat[i].uidisplayname);
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

    /* function to 'open' a tab*/
    $scope.openTab = function (tab) {
        /* check if tab is already open*/
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
            /*if it is, remove it from the activeTabs array*/
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
        filterProducts();
        $scope.dataToRepeat.halfToggled = false;
        if ($scope.asProdCount == $scope.allPossible){
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
            var index = $scope.activeTT.indexOf(tab);
            $scope.activeTT.splice(index, 1);
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
/*
    $scope.isProductBoxDisplayed = false;

    $scope.$watch('isProductBoxDisplayed', function (value, oldValue) {
        var d = document.getElementById('ProductBox');
        if (!!value) {
            d.style.left = "270px";
            SendMessage("GUI INTERIOR", "HideProductDetailPanel");
        }
        else {
            d.style.left = "-600px";
        }
    });
*/
    var sipRot;

    openPB = function (){ // openPB
        //$timeout(function(){$scope.toggleProdMenu();}, 500);
        document.getElementById('sipka').style.transform = 'rotate(180deg)';
        sipRot = true;
        var d = document.getElementById('ProductBox');
        d.style.left = "270px";
    }

    $scope.toggleProdMenu = function () {
        //$scope.isProductBoxDisplayed = !$scope.isProductBoxDisplayed;
        if (sipRot == true) {
            document.getElementById('sipka').style.transform = 'rotate(0deg)';
            sipRot = false;
            var d = document.getElementById('ProductBox');
            d.style.left = "-600px";
        }
        else {
            document.getElementById('sipka').style.transform = 'rotate(180deg)';
            sipRot = true;
            var d = document.getElementById('ProductBox');
            d.style.left = "270px";
            SendMessage("GUI INTERIOR", "HideProductDetailPanel");
        }
    }

    $scope.calculateProductBox = function(){
        var maxPBheight = window.innerHeight - 195;
        var prCount = $scope.productsToShow.length;
        var hHeight = 27;
        if((prCount/2)*157 < maxPBheight){
            if (prCount%2 == 0){
                var _h = ($scope.productsToShow.length/2)*157+3+25;
                document.getElementById('ProductBox').style.height = _h + 'px';
                document.getElementById('product_holder').style.height = _h - hHeight +'px';    
            } else{
                var _h = ($scope.productsToShow.length/2)*157+80+25;
                document.getElementById('ProductBox').style.height = _h +'px';
                document.getElementById('product_holder').style.height = _h - hHeight +'px';
            }
        } else {
            document.getElementById('ProductBox').style.height = maxPBheight +'px';
            document.getElementById('product_holder').style.height = maxPBheight - hHeight +'px';
        }

        if ($scope.productsToShow.length == 1){
            document.getElementById('ProductBox').style.width = '400px';
            $timeout(function(){$('#ProductBox .btn-group').css('width','100%');}, 10);
        } else {
            document.getElementById('ProductBox').style.width = '800px';
            $timeout(function(){$('#ProductBox .btn-group').css('width','50%');}, 10);
        }
    }

    var filterProducts = function(){
        console.log('filter');
        $scope.asProdCount = 0;
        $scope.productsToShow = [];
        for (var i = 0; i < $scope.activeTT.length; i++) {
            for (var j = 0; j < $scope.activeTT[i].products.length; j++) {
                if ($scope.asSelectedMans.length > 0 && $scope.asSelectedMans.indexOf($scope.activeTT[i].products[j].manufacturername) > -1) {
                    $scope.productsToShow = $scope.productsToShow.concat($scope.activeTT[i].products[j]);
                }
            }
            $scope.asProdCount = $scope.productsToShow.length;
        }
        numberOfProds();
        $scope.calculateProductBox();

        if ($scope.productsToShow.length > 0) {
            console.log('VYSUN');
            document.getElementById('ProductBox').style.left = "270px";
            document.getElementById('sipka').style.transform = 'rotate(180deg)';
            sipRot = true;
            $scope.sipkaValid = false;
        } else {
            console.log('ZASUN');
            document.getElementById('ProductBox').style.left = "-600px";
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
            leftColumn: Math.abs(indx+1) % 2 == 1,
            NotLastOnes: indx < list.length - 2,
            specialOne: indx % 2 && list.length %2
        }
    }
}]);

app.controller('FPSCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
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
        }
        /*
        var str = byteString;
        var bytes = [];
        
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

    setFpsControlls = function (input){
        switch (input){
            case 0 : document.getElementById('lc').checked = true; $timeout(function () {SendMessage("FpsManager", "mouse_controll");}, 1000);  break;
            case 1 : document.getElementById('wasd').checked = true; $timeout(function () { SendMessage("FpsManager", "mouseWASD_controll");}, 1000);  break;
            case 2 : document.getElementById('k').checked = true; $timeout(function () { SendMessage("FpsManager", "keyboard_controll");}, 1000);  break;
            default: document.getElementById('k').checked = true; SendMessage("FpsManager", "keyboard_controll");
        }
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

