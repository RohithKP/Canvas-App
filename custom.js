var canvas = new fabric.Canvas('frame');
canvas.backgroundColor = '#f5f5ffs';
canvas.renderAll();
//document.getElementById('img1').addEventListener("click", handler);
function selectimg( e ) {
	var img1 = document.getElementById(e.id);
//	x=dragX<canvas.getWidth()?dragX:canvas.getWidth()-200;
	var img1Instance  = new fabric.Image(img1,
   {
   	id:e.id,
   	left:dragX-50||300,
   	top: dragY-120||300
   }
	);
//img1Instance.perPixelTargetFind = true;
 canvas.add(img1Instance);	
 canvas.renderAll();
}

function setbackgnd(e){
if(e.id=='clr')
{
canvas.setBackgroundImage("", canvas.renderAll.bind(canvas));
//this.__canvases.push(canvas);
}
else{
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
canvas.on("object:moving",setbound);

 function setbound(e) {
  var obj = e.target;
  var canvas = obj.canvas;
  var top = obj.top;
  var left = obj.left;
  var zoom = canvas.getZoom();
  var pan_x = canvas.viewportTransform[4];
  var pan_y = canvas.viewportTransform[5];

  // width & height we are constraining to must be calculated by applying the inverse of the current viewportTransform
  var c_width = canvas.width / zoom;
  var c_height = canvas.height / zoom;


  var w = obj.width * obj.scaleX
  var left_adjust, right_adjust
  if(obj.originX == "center") {
    left_adjust = right_adjust = w / 2;
  } else {
    left_adjust = 0;
    right_adjust = w;
  }

  var h = obj.height * obj.scaleY;
  var top_adjust, bottom_adjust;
  if(obj.originY == "center") {
    top_adjust = bottom_adjust = h / 2;
  } else {
    top_adjust = 0;
    bottom_adjust = h;
  }

  // if you need margins set them here
  var top_margin = 0;
  var bottom_margin = 0;
  var left_margin = 0;
  var right_margin = 0;


  var top_bound = top_margin + top_adjust - pan_y;
  var bottom_bound = c_height - bottom_adjust - bottom_margin - pan_y;
  var left_bound = left_margin + left_adjust - pan_x;
  var right_bound = c_width - right_adjust - right_margin - pan_x;

  if( w > c_width ) {
    obj.setLeft(left_bound);
  } else {
    obj.setLeft(Math.min(Math.max(left, left_bound), right_bound));
  }

  if( h > c_height ) {
    obj.setTop(top_bound);
  } else {
    obj.setTop(Math.min(Math.max(top, top_bound), bottom_bound));
  }
}
function allowDrop(ev) {
    ev.preventDefault();
}

var crt,dragX,dragY;
function drag(ev) {
	  crt = ev.target.cloneNode(true);
    crt.style.position = "absolute";
	  crt.style.left=-200+"px";crt.style.top=-200+"px";
    crt.style.zIndex='998';
    document.getElementById('imdem').appendChild(crt);
	ev.dataTransfer.setDragImage(document.getElementById("imdemo"), 2000, 2000);
	ev.dataTransfer.setData("text", ev.target.id);
}

//set the cloned image position move with cusror whilt dragging
document.addEventListener("dragover", function(ev1){
ev1 = ev1 || window.event;
dragX = ev1.pageX; dragY = ev1.pageY;
crt.style.left=dragX+"px";crt.style.top=  dragY-120+"px";
console.log("X: "+dragX+" Y: "+dragY);
}, false);

//make the cloned image not visible
document.addEventListener("dragend", function( event ) {crt.style.left=-3300+'px';});



function drop(event) {
event.preventDefault();
var data = event.dataTransfer.getData("text");
if(document.getElementById(data).name==='objc')
{
  selectimg(document.getElementById(data));
}
else{
   setbackgnd(document.getElementById(data));
}
}
canvas.renderAll();

var CanvasApp = angular.module('CanvasApp',[]);

CanvasApp.controller('bckCtrl',function($scope,$http){
$http.get('imgdata.json').then(
	function(res){
	  $scope.assets = res.data;
	  console.log($scope.assets);
	}
);
});

CanvasApp.controller('objCtrl',function($scope,$http){
$http.get('objdata.json').then(
	function(res){
	  $scope.assets2 = res.data;
	  console.log($scope.assets2);
	}
);
});
