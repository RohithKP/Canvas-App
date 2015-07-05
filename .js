
var canvas = new fabric.Canvas('canvas', {
    backgroundColor: 'grey'
}),
    dragImg;

function handleDragStart(e) {
    [].forEach.call(images, function (img) {
        img.classList.remove('img_dragging');
    });
    this.classList.add('img_dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'copy';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over'); // this / e.target is previous target element.
}

function handleDrop(e) {

    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    dragImg = document.querySelector('#photos img.img_dragging');

    return false;
}
canvas.on('object:over', function (e) {
    if (!dragImg) return;

    var activeObject = e.target;

    if (activeObject) {

        text_obj = activeObject.item(1);
        activeObject.remove(text_obj);

        var imag_obj = activeObject.item(0);
        imag_obj.setElement(dragImg);
        canvas.renderAll();
    }

    dragImg = null;

});

canvas.findTarget = (function (originalFn) {
    return function () {
        var target = originalFn.apply(this, arguments);
        if (target) {
            if (this._hoveredTarget !== target) {
                canvas.fire('object:over', {
                    target: target
                });
                if (this._hoveredTarget) {
                    canvas.fire('object:out', {
                        target: this._hoveredTarget
                    });
                }
                this._hoveredTarget = target;
            }
        } else if (this._hoveredTarget) {
            canvas.fire('object:out', {
                target: this._hoveredTarget
            });
            this._hoveredTarget = null;
        }
        return target;
    };
})(canvas.findTarget);

function drop_image(e, img) {

    text_obj = e.target.item(1);
    e.target.remove(text_obj);

    var imag_obj = e.target.item(0);
    imag_obj.setElement(img);
}

function handleDragEnd(e) {
    // this/e.target is the source node.
    [].forEach.call(images, function (img) {
        img.classList.remove('img_dragging');
    });
}

// Bind the event listeners for the image elements
var images = document.querySelectorAll('#photos img');
[].forEach.call(images, function (img) {
    img.addEventListener('dragstart', handleDragStart, false);
    img.addEventListener('dragend', handleDragEnd, false);
});

// Bind the event listeners for the canvas
var canvasContainer = document.getElementById('canvas_container');
canvasContainer.addEventListener('dragenter', handleDragEnter, false);
canvasContainer.addEventListener('dragover', handleDragOver, false);
canvasContainer.addEventListener('dragleave', handleDragLeave, false);
canvasContainer.addEventListener('drop', handleDrop, false);

wid = $("#canvas_container").width();
canvas.setWidth(wid);

$(window).resize(function () {

    wid = $("#canvas_container").width();
    canvas.setWidth(wid);

    canvas.calcOffset();
    canvas.forEachObject(function (o) {
        o.setCoords();
    });
    canvas.renderAll();
});

var scaleFactor = 1;

function createDropPhoto(options) {
    fabric.Image.fromURL('http://www.tutorialsscripts.com/free-icons/clip-art-icons/teal-clip-art-icon-128-x-128.png', function (img) {
        var img1 = img.scale(scaleFactor).set({
            left: 0,
            top: 0
        });
        var text = new fabric.Text('Drag Photo Here', {
            fontFamily: 'Arial',
            fontSize: 15
        });

        text.set("top", img.height * scaleFactor / 2 + text.getBoundingRectHeight() / 2);
        text.set("left", -img.width * scaleFactor / 2 + text.getBoundingRectWidth() / 2);

        image_group = new fabric.Group([img1, text], {
            left: options.left,
            top: options.top
        });
        image_group.name = options.name;
        canvas.add(image_group);
    });
}

createDropPhoto({
    left: 150,
    top: 40,
    name: 'Group One'
});
createDropPhoto({
    left: 475,
    top: 40,
    name: 'Group Tow'
});