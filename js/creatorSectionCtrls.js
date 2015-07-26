//'use strict';
app.controller('mainCtrl', ['$scope', '$modal', '$compile', '$http', '$window', '$timeout', function ($scope, $modal, $compile, $http, $window, $timeout) {
    console.logError = console.log;

    $scope.bridge = {
        changeSection: function () { $scope.activateMenu(1); }
    };

    var prepinacSave = 0,
        myStorage;
    $scope.activeMenu = {};
    $scope.activeMenu.first = true;

    $scope.activateMenu = function (n) {
        $scope.activeMenu = {};
        console.log(n);
        switch (n) {
            case 1: $scope.activeMenu.first = true; break;
            case 2: $scope.activeMenu.second = true; break;
            case 3: $scope.activeMenu.third = true; break;
            case 4: $scope.activeMenu.fourth = true; break;
            default: $scope.activeMenu = {};
        }
        console.log($scope.activeMenu);
    }
    /*
    calculateMaxHeight();
    function calculateMaxHeight() {
        console.log("volam <");
        _vwpHeight = window.innerHeight;
        var _clss = document.getElementsByClassName('left-menu')[0];
        height = _vwpHeight - 180;
        console.log(_clss);
        _clss.style.height = height + 'px';
        for (var i = 0; i < _clss.length; i++) {_clss[i].style.height = height + 'px';}
    }
    */
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
            //transformRequest: angular.identity,
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + JSON.parse(myStorage.getItem('token')) }
        });
        promise.success(function (data, status, headers, conf) {
            console.log(data, status, headers, conf);
            $scope.LoadSave = data;
            return data;
        });
    };
    //Neviem preco to nefunguje ale nejako takto by sa malo robit obmedzenie pre radio buttony pomocou sipiek 
    //$(document).keydown(function(e) { $('#canvasHolder').blur(); return false; });

    var prepinacSet = 0,
        prepinacLoad = 0;

    $scope.isSettingOpened = false;

    $scope.SetSettings = function () {
        if (prepinacSet == 0) {
            $('#Settings').css({ top: 110 + 'px' });
            $('#SaveProject').css({ top: -50 + 'px' });
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
            $('#SaveProject').css({ top: -50 + 'px' });
            prepinacLoad = 1;
            prepinacSet = 0;
            prepinacSave = 0;
        }
        else if (prepinacLoad == 1) {
            $('#LoadProject').css({ top: -300 + 'px' });
            prepinacLoad = 0;
        }
    }

    $scope.selectedTemplate = {};
    $scope.selectedTemplate.path = "partials/podorys.tpl.html";

    setActiveSection = function (n) {
        $scope.activeMenu = {};
        console.log(n);
        switch (n) {
            case "0": $scope.activeMenu.first = true; break;
            case "2": $scope.activeMenu.second = true; break;
            case "5": $scope.activeMenu.third = true; break;
            case "6": $scope.activeMenu.fourth = true; break;
            default: $scope.activeMenu = {};
        }

        if (!$scope.$$phase) $scope.$apply();
        console.log($scope.activeMenu);
    }

    getErrorText = function (string) {
        $scope.message = "iny message";
        $scope.message = string;
        console.log($scope.message);

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
    };
    $scope.DW = function () {
        var _pR = document.getElementById('BDW5').parentNode,
            _pRIe = _pR.querySelectorAll('input');

        SendMessage("CanvasEditor", "changeArea", 2);

        document.getElementById('BDW5').className = 'Button radio-dw btn-my btn-my2';
        for (var i = 0, iL = _pRIe.length; i < iL; i++) _pRIe[i].checked = false;
        document.getElementById('dwcategory_1').checked = true;
    };
    $scope.Interier = function () {
        var _pR = document.getElementById('BI5').parentNode,
            _pRi = _pR.querySelectorAll('input');

        for (var i = 0, iL = _pRi.length; i < iL; i++) _pRi[i].checked = false;
        document.getElementById('icategory_1').checked = true;
        SendMessage("CanvasEditor", "changeArea", 5);
    };
    $scope.D2D = function () {
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
            document.getElementById('B0').className = 'Button radio-picture btn-my btn-my2';
            document.getElementById('B3').className = 'Button radio-picture btn-my';
        }
    };

    $scope.Center = function () { SendMessage("Main Camera", "ResetPosition"); };
    $scope.Undo = function () { SendMessage("UndoRedo", "Undo"); };
    $scope.Redo = function () { SendMessage("UndoRedo", "Redo"); };
    $scope.FPS = function () { SendMessage("EventSystem", "FpsPosition"); };
    showUIforFps = function () {
        console.log("zobraz UI pre panaka");
        //var fpsText = document.createElement("div");
        //fpsText.id = "fpsText";
        //document.appendChild(fpsText);
    };
    $scope.Kvalita = function (value) { SendMessage("Settings", "setLevel", value); };
    $scope.HranySet = function (value) { SendMessage("Settings", "setAA", value); };
    $scope.RozmerySet = function (value) { SendMessage("Settings", "ShowTextFromWeb", value); };

    $scope.UlozitProjekt = function () {
        document.getElementById('sp-holder').style.display = "block";
        setInputValue();
        /*
        $('#sp').focus();
        console.log(Module);
        Module.keyboardListeningElement = document.getElementById('sp');
        console.log(Module);
        */
        //console.log(document.activeElement);
        /*
        var saveModal = $modal.open({
        keyboard: false,
        templateUrl:'partials/saveProject.html',
        controller: 'SaveProjectCtrl',
        transclude: true
        });
        */
    };

    var setInputValue = function () {
        var inpt = document.getElementById('sp'),
            _k = '',
            _kk = '';

        inpt.addEventListener('keyup', function (e) {
            if (e.keyCode === 8 && _kk.length > 0) {
                _kk = _kk.substring(0, _kk.length - 1);
                this.value = _kk;
            }
            else if (e.keyCode !== 27 || e.keyCode !== 17 || e.keyCode !== 9 || e.keyCode !== 18 || e.keyCode !== 37 || e.keyCode !== 38 || e.keyCode !== 39 || e.keyCode !== 40) {
                _k = e.key;
                _kk = _kk + _k;
                this.value = _kk;
            }
        }, false);
    }

    $scope.cancel = function () {
        document.getElementById('sp-holder').style.display = "none";
        document.getElementById('sp').value = "";
    }

    $scope.potvrdit = function () {
        var saveName = document.getElementById('sp').value;
        SendMessage("Save Game Manager", "SaveFromWeb", saveName);
        document.getElementById('sp-holder').style.display = "none";
        document.getElementById('sp').value = "";
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

    $scope.NovyProjekt = function () {
        $('#Settings').css({ top: -470 + 'px' });
        $('#SaveProject').css({ top: -50 + 'px' });
        $('#LoadProject').css({ top: -300 + 'px' });
        var projectModal = $modal.open({
            //backdrop: 'static',
            keyboard: false,
            templateUrl: 'partials/newProject.html',
            controller: 'NewProjectCtrl',
            transclude: true,
            resolve: {
                bridge: function () {
                    return $scope.bridge;
                }
            }
        });
    }

    $scope.CleanProject = function () {
        SendMessage("NewProject", "NewProject");
    }

    savingFinished = function (value) {
        if (value === "1") console.log("Ukladanie skoncilo dobre");
        else if (value === "0") console.log("Ukladanie skoncilo zle");
    }

    loadingFinished = function (value) { }

    $scope.OtvoritProjekt = function (jsonstring) {
        SendMessage("Save Game Manager", "LoadAndDeserializeFromWeb", jsonstring);
        console.log(jsonstring);
    }
}]);

app.controller('NewProjectCtrl', ['$scope', '$modalInstance', 'bridge', function ($scope, $modalInstance, bridge) {

    $scope.cancel = function () {
        console.log("Malo by to vypnut");
        $modalInstance.dismiss('cancel');
    }

    $scope.ok = function () {
        $modalInstance.close(SendMessage("NewProject", "NewProject"));
        SendMessage("NewProject", "NewProject");
        SendMessage("CanvasEditor", "changeArea", 0);
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DefaultAction");
        $("a.radio-picture").removeClass('btn-my2');
        $("a.radio-picture").addClass('btn-my');
        $("#B0").removeClass('btn-my');
        $("#B0").addClass('btn-my2');
        bridge.changeSection();
    }
}]);

/*
app.controller('SaveProjectCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.cancel = function () {
        console.log("Malo by to vypnut");
        $modalInstance.dismiss('cancel');
    }

    $scope.potvrdit = function () {
        $modalInstance.close(SendMessage("NewProject", "NewProject"));
    }
} ]);
*/

app.controller('podorysCtrl', ['$scope', 'matJson', function ($scope, matJson) {

    matJson.get().then(function (data) {
        $scope.mats = data;
    });

    var hodnotaB15 = 0;
    var vyskaSteny = 2.4;
    $(function () {
        $("#slider").slider({
            step: 0.001,
            min: 0,
            max: 1,
            values: [0],
            slide: function (event, ui) {
                $("#amount").val("€" + ui.values[0] + " - €" + ui.values[1]);

            },
            change: function (event, ui) {
                $("#amount").val("€" + ui.values[0] + " - €" + ui.values[1]);
            }
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
        //console.log(this.currentTarget);
    }

    $("input:radio[name=view]").click(function () {
        var $id = $(this).val();

        $.post("includes/determine_next_questions.php", { prodfamily: $id }, function (data) {
            $("#results").html(data);
        });
    });

    $scope.NoOp = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DefaultAction");
    };
    $scope.SingleWall = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_SingleWall");
    };
    $scope.CurveWall = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_CurveWall");
    };
    $scope.FourWall = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_4Wall");
    };
    $scope.Delete = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_DeleteWall");
    };
    $scope.AddControlPoint = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_AddControlPoint");
    };
    $scope.PosunSteny = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_MoveWall");
    };
    $scope.ZmenaMat = function () {
        SendMessage("FunctionsManager", "SetFunctionActive", "G01_ChangeMatWall");
    };
    $scope.Undo = function () {
        SendMessage("UndoRedo", "Undo");
        $scope.NoOp();
        $("a.radio-picture").removeClass('btn-my2');
        $("a.radio-picture").addClass('btn-my');
        $("#B0").removeClass('btn-my');
        $("#B0").addClass('btn-my2');
    };
    $scope.Redo = function () { SendMessage("UndoRedo", "Redo"); };

    SetUndoRedoInteractable = function (IsInteractable) { }

    SetWallTypeButtonActive = function (IsInteractable) { }

    $scope.ZmenaVysky = function () {
        SendMessage("Plane0", "ChangeFloorScale", vyskaSteny);
    }

    $scope.ChoosenMaterial = function (id) {
        SendMessage("changeMat", "ChangeMatGL", id);
        document.getElementById('MaterialChooser').style.left = "0px";
        $scope.ZmenaMat();
    }

    Set2D = function () {
        SendMessage("CanvasEditor", "SetView2D");
        $("#B12").removeClass('btn-my');
        $("#B12").addClass('btn-my2');
        $("#B13").removeClass('btn-my2');
        $("#B13").addClass('btn-my');
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

    $scope.MierkaAuto = function () {
        SendMessage("Ruler", "SetRuler", 0);
    }
    $scope.Mierka10 = function () {
        SendMessage("Ruler", "SetRuler", 500);
    }

    $scope.Mierka50 = function () {
        SendMessage("Ruler", "SetRuler", 100);
    }

    $scope.Mierka100 = function () {
        SendMessage("Ruler", "SetRuler", 50);
    }
    $scope.MierkaVyp = function () {
        SendMessage("Ruler", "SetRuler", 1000000);
    }

    $scope.IsMaterialsDisplayed = true;

    $scope.setMenuMaterial = function (value) {
        if (value == 1) { }
        else { }
    }
    openMaterialMenu = function () {
        document.getElementById('MaterialChooser').style.left = "510px";
    }
    $scope.$watch('IsMaterialsDisplayed', function (value, oldValue) {
        //if (value === oldValue) { return; }
        var d = document.getElementById('MaterialChooser');
        if (!!value) d.style.left = "0px";
        else d.style.left = "750px";
    });
}])

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
        if (!!value) d.style.left = "-320px";
        else d.style.left = "5px";
    });

    $scope.$watch('isDoorDropdownDisplayed', function (value, oldValue) {
        //if (value === oldValue) { return; }
        var d = document.getElementById('MenuItemDoor');
        if (!!value) d.style.left = "-320px";
        else d.style.left = "5px";
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

    $scope.ChooseWindow = function (path) {
        SendMessage("GUI OKNA_DVERE", "download_window", path);
        $scope.isWindowDropdownDisplayed = true;
    }
    $scope.ChooseDoor = function (path) {
        SendMessage("GUI OKNA_DVERE", "download_door", path);
        $scope.isDoorDropdownDisplayed = true;
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
        console.log($scope.menuData);
        $scope.dataToRepeat = null;
    });

    $("a.radio-i").click(function () {
        var $id = $(this).attr('id');
        console.log('Do it');
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
    /*
    $scope.example1data = [{ id: 1, label: "Obyvacka" }, { id: 2, label: "Kuchyna" }, { id: 3, label: "Spalna"}];
    $scope.example1model = [];
    */
    $scope.accordionID = function (id) { console.log(id); };

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

    // function to 'open' a tab
    $scope.openTab = function (tab) {
        // check if tab is already open
        if ($scope.isOpenTab(tab.uidisplayname)) {
            if (!tab.child[0].hasOwnProperty("parentid"))
                for (var i = 0; i < tab.child.length; i++) {
                    if (!tab.child[i].hasOwnProperty("parentid")) {
                        var index = $scope.activeTT.indexOf(tab.child[i]);
                        $scope.activeTT.splice(index, 1);
                        console.log($scope.activeTT);
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
                    console.log($scope.activeTT);
                    console.log(tab.child[i]);

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
        $scope.productsToShow = [];
        for (var i = 0; i < $scope.activeTT.length; i++) {
            $scope.productsToShow = $scope.productsToShow.concat($scope.activeTT[i].products);
        }
        if ($scope.productsToShow.length > 0) {
            $scope.isProductBoxDisplayed = true
            document.getElementById('sipka').style.transform = 'rotate(180deg)';
            sipRot = false;
        } else {
            $scope.isProductBoxDisplayed = false;
            document.getElementById('sipka').style.transform = 'rotate(0deg)';
            sipRot = true;
        };
    });

    $scope.ClickedTypeType = function (tab) {
        console.log($scope.activeTT);
        tab.toggled = !tab.toggled;
        if (tab.toggled) {
            var index = $scope.activeTT.indexOf(tab);
            $scope.activeTT.splice(index, 1);
        }
        else if (!tab.toggled) {
            $scope.activeTT.push(tab);
        }
        console.log($scope.activeTT);

        /*
        $scope.activeTypeTypeTabs.push(tab);
        for (var i = 0; i < $scope.activeTypeTypeTabs.length; i++){
        if ($scope.activeTypeTypeTabs[i].uidisplayname == tab.uidisplayname)
        {
        var index = $scope.activeTypeTypeTabs.indexOf(tab);
        console.log(index);
        $scope.activeTypeTypeTabs.splice(index,1);
        } 
        }
        /*
        $scope.activeTypeTypeTabs = [];
        $scope.activeTypeTypeTabs.push(tab);
        */
        //console.log($scope.activeTypeTypeTabs);
    }
    $scope.isProductBoxDisplayed = false;

    $scope.$watch('isProductBoxDisplayed', function (value, oldValue) {
        //if (value === oldValue) { return; }
        var d = document.getElementById('ProductBox');
        if (!!value) d.style.left = "250px";
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

    $scope.CenterInterier = function () {
        SendMessage("Main Camera", "ResetPosition");
    };
}]);

app.controller('FPSCtrl', ['$scope', function ($scope) {

    //$("#wasd").click();
    //if(typeof SendMessage === 'function') SendMessage("FpsManager", "mouseWASD_controll");
    //\\
    /*
    $scope.toggleFpsMats = function () {
        $scope.isFpsMats = !$scope.isFpsMats;
    };

    $scope.toggleFpsProds = function () {
        $scope.isFpsProds = !$scope.isFpsProds;
    };

    $scope.$watch('isFpsMats', function (value, oldValue) {
        //if (value === oldValue) { return; }
        var d = document.getElementById('fpsMaterials');
        if (!!value) d.style.right = "0px";
        else d.style.right = "-250px";
    });

    $scope.$watch('isFpsProds', function (value, oldValue) {
        //if (value === oldValue) { return; }
        var e = document.getElementById('fpsProducts');
        if (!!value) e.style.right = "0px";
        else e.style.right = "-250px";
    });
    */
    setOkTrigger = function (string) {
        console.log("okstring" + string);
    };

    setGuiInfo = function (string) {
        console.log("Tomasov string " + string);

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
        if (info.charAt(5) == "0") {
            document.getElementById('objMove').style.visibility = 'hidden';
            document.getElementById('objRot').style.visibility = 'hidden';
        }
        else {
            document.getElementById('objMove').style.visibility = 'visible';
            document.getElementById('objRot').style.visibility = 'visible';
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
        document.getElementById("objMove").style.visibility = 'hidden';
        document.getElementById("objRot").style.visibility = 'hidden';
        document.getElementById("ok").style.visibility = 'hidden';
        document.getElementById("objRot").style.visibility = 'hidden';
        document.getElementById("colorCh").style.visibility = 'hidden';
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
    }

    $scope.activeM = function () {
        console.log("activeM");
        $("#objMove").addClass("selected");
        $("#objRot").removeClass("selected");
    }

    $scope.activeR = function () {
        console.log("activeR");
        $("#objRot").addClass("selected");
        $("#objMove").removeClass("selected");
    }

}])

