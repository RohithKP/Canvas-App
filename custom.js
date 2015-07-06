var canvas = new fabric.Canvas('frame');
canvas.backgroundColor = '#f5f5ffs';
canvas.renderAll();
//document.getElementById('img1').addEventListener("click", handler);
function selectimg(e) {
    var img1 = document.getElementById(e.id);
    //	x=dragX<canvas.getWidth()?dragX:canvas.getWidth()-200;
    var img1Instance = new fabric.Image(img1, {
        id: e.id,
        left: dragX - 50 || 300,
        top: dragY - 120 || 300
    });
    //img1Instance.perPixelTargetFind = true;
    canvas.add(img1Instance);
    canvas.renderAll();
}

function setbackgnd(e) {
    if (e.id == 'clr') {
        canvas.setBackgroundImage("", canvas.renderAll.bind(canvas));
        //this.__canvases.push(canvas);
    } else {
        var src = document.getElementById(e.id).src;

        canvas.setBackgroundImage(src, canvas.renderAll.bind(canvas));
        //this.__canvases.push(canvas);
    }
    canvas.renderAll();
}

//delete the object from canvas
window.onkeydown = onKeyDownHandler;

function onKeyDownHandler(e) {
    switch (e.keyCode) {
    case 46: // delete
        var activeObject = canvas.getActiveObject();
        canvas.remove(activeObject);
        return;
    }
};


//To set the boundary
canvas.on("object:moving", setbound);

function setbound(e) {
    var obj = e.target;
    // if object is too big ignore
    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return;
    }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
    }
    // bot-right corner
    if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
    }
}


function allowDrop(ev) {
    ev.preventDefault();
}

var crt, dragX, dragY;

function drag(ev) {
    crt = ev.target.cloneNode(true);
    crt.style.position = "absolute";
    crt.style.left = -200 + "px";
    crt.style.top = -200 + "px";
    crt.style.zIndex = '998';
    document.getElementById('imdem').appendChild(crt);
    ev.dataTransfer.setDragImage(document.getElementById("imdemo"), 2000, 2000);
    ev.dataTransfer.setData("text", ev.target.id);
}

//set the cloned image position move with cusror whilt dragging
document.addEventListener("dragover", function (ev1) {
    ev1 = ev1 || window.event;
    dragX = ev1.pageX;
    dragY = ev1.pageY;
    crt.style.left = dragX - 65 + "px";
    crt.style.top = dragY - 120 + "px";
    console.log("X: " + dragX + " Y: " + dragY);
}, false);

//make the cloned image not visible
document.addEventListener("dragend", function (event) {
    crt.remove();
});



function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    if (document.getElementById(data).name === 'objc') {
        selectimg(document.getElementById(data));
    } else {
        setbackgnd(document.getElementById(data));
    }
}
canvas.renderAll();

var CanvasApp = angular.module('CanvasApp', []);

CanvasApp.controller('bckCtrl', function ($scope, $http) {
    $http.get('json/imgdata.json').then(
        function (res) {
            $scope.assets = res.data;
            console.log($scope.assets);
        }
    );
});

CanvasApp.controller('objCtrl', function ($scope, $http) {
    $http.get('json/objdata.json').then(
        function (res) {
            $scope.assets2 = res.data;
            console.log($scope.assets2);
        }
    );
});
