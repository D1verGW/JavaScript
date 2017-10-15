BinarySearchTree.prototype.add = function(value) {
    var currentNode = this.makeNode(value);
    if (!this.root) {
        this.root = currentNode;
    } else {
        this.insert(currentNode);
    }
    return this;
};
BinarySearchTree.prototype.makeNode = function(value) {
    var node = {};
    node.value = value;
    node.left = null;
    node.right = null;
	node.parent = null;
	node.depth = 0;
	node.drawPoint = {
		x: 0,
		y: 0,
		parent: {
			x: 0,
			y: 0
		}
	}
	node.index = this.index;
	this.index += 1;
    return node;
};
BinarySearchTree.prototype.insert = function(currentNode) {
    var value = currentNode.value;

    var traverse = function(node) {
        //if value is equal to the value of the node, ignore
        //and exit function since we don't want duplicates
        if (value === node.value) {
            return;
        } else if (value > node.value) {
            if (!node.right) {
                node.right = currentNode;
				node.depth++;
                return;
            } else
                traverse(node.right);
        } else if (value < node.value) {
            if (!node.left) {
                node.left = currentNode;
				node.depth++;
                return;
            } else
                traverse(node.left);
        }
    };
    traverse(this.root);
};
BinarySearchTree.prototype.setDepth = function() {
    var node = this.root;
    var maxDepth = 0;
    var traverse = function(node, depth) {
        if (!node) return null;
        if (node) {
            maxDepth = depth > maxDepth ? depth : maxDepth;
			node.depth = depth;
			//set parent too
			if (node.right){
				(node.right).parent = node;
			}
			if (node.left){
        		(node.left).parent = node;
        	}
            traverse(node.left, depth + 1);
            traverse(node.right, depth + 1);
        }
    };
    traverse(node, 1);
};
BinarySearchTree.prototype.maxDepth = function() {
    var node = this.root;
    var maxDepth = 0;
    var traverse = function(node) {
        if (!node) return null;
        if (node) {
            maxDepth = node.depth > maxDepth ? node.depth : maxDepth;
            traverse(node.left);
            traverse(node.right);
        }
    };
    traverse(node, 0);
    return maxDepth;
};
BinarySearchTree.prototype.setDrawPoint = function(maxDepth, resizerY) {
    var node = this.root;
    var parentX;
    var traverse = function(node, left) {
        if (!node) return null;
        if (node) {
        	parentX = node.parent ? (node.parent).drawPoint.x : 0;
        	let resizerX = Math.pow(2,maxDepth - node.depth + 1);
        	resizerX = left ? -resizerX : resizerX;
			node.drawPoint.x = parentX + resizerX;
			node.drawPoint.y = node.depth + resizerY;
			node.drawPoint.parent.x = node.parent ? (node.parent).drawPoint.x : null;
			node.drawPoint.parent.y = node.parent ? (node.parent).drawPoint.y : null;
            traverse(node.left, true);
            traverse(node.right);
        }
    };
    traverse(node.left, true);
    traverse(node.right);	
};
BinarySearchTree.prototype.checkDrawPoint = function() {
    var node = this.root;
    var drawPoint = [];
    var traverse = function(node) {
        if (!node) return null;
        if (node) {
        	drawPoint.push(node);
            traverse(node.left);
            traverse(node.right);
        }
    };
    traverse(node, 0);
    return drawPoint;
};

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
function redraw () {
	let oldTreeArr = createCoordArray(window.binarySearchTree);
	drawPoly('canvasId', oldTreeArr);
}
function onClick(e) {
	var point = getCursorPosition(e);
	var pointArr = this.pointArr;
	redraw();
	for (let i = 0; i < pointArr.length; i++){
		if (point[0] > pointArr[i].xLeft && point[0] < pointArr[i].xRight){
			if (point[1] > pointArr[i].yLeft && point[1] < pointArr[i].yRight){
				let info = {};
				info.canvas = this;
				info.obj = pointArr[i];
				info.point = point;
				drawInfo(info);
			}
		} 
	}
}
function onDblClick (e){
	redraw();
	return 0;
}
function getCursorPosition(e) {
	var x;
	var y;
	if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
	}
	else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	let canvas = e.path[0];
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	return [x,y];
}
function drawInfo (info){
	var canvas = info.canvas;
	var canvasInfo = {
		width: canvas.width,
		height: canvas.height
	}
	var ctx = canvas.getContext('2d');
	var point = info.point;
	let width = canvasInfo.width / 25 * 2;
	let height = canvasInfo.height / 50 * 2;
	

	ctx.fillStyle = '#d5dddf';
	ctx.fillRect(0, 0, canvasInfo.width, canvasInfo.height);

    let arr = customCheckDrawPoint(info.obj.obj);
    
    let oldTreeArr = createCoordArray(window.binarySearchTree);
    drawCurveToParent(ctx, oldTreeArr, canvasInfo, '#f0f0f0');
    drawCurveToParent(ctx, arr, canvasInfo, '#a8bac5', true);
    drawNodes(canvas, oldTreeArr, canvasInfo);
    let text;
    text = "X,Y  : " + point[0] + "," + point[1];
    drawText(text, {x: width / 10, y: height / 10});
    text = "Value: " + info.obj.obj.value;
    drawText(text, {x: width / 10, y: 10 * height / 10});
    text = "Index: " + info.obj.obj.index;
    drawText(text, {x: width / 10, y: 20 * height / 10});
}
function drawText(text, coord){
	var canvasObj = document.getElementById('canvasId');
	var width = canvasObj.width;
	var height = canvasObj.height;
	var ctx = canvasObj.getContext('2d');
	ctx.beginPath();
	ctx.textBaseline = "top";
	ctx.textAlign = "left";
	ctx.font='1.5em courier';
	ctx.fillStyle = '#000';
    ctx.fillText(text, coord.x, coord.y);
}
function drawCurveToParent (context, arr, canvasInfo, color, logger){
	context.beginPath();
	context.strokeStyle = color;	
	context.lineWidth = 1;
	if (logger) {
		console.clear();
		console.group("Node : " + arr[0].index);
	}
	for (let i = 0; i < arr.length; i++) {
		let pointObj = arr[i].drawPoint;
		let x = pointObj.x;
		let y = pointObj.y;
		let xp = pointObj.parent.x;
		let yp = pointObj.parent.y;
		yp = yp ? yp : 0;
		yp = yp > 0 ? yp : 0;
		context.moveTo(x + canvasInfo.width/2, y * canvasInfo.height/10);
		context.bezierCurveTo(
			x + canvasInfo.width/2, 
			y * canvasInfo.height/10 - canvasInfo.height/10, 
			xp + canvasInfo.width/2, 
			yp * canvasInfo.height/10 + canvasInfo.height/10, 
			xp + canvasInfo.width/2, 
			yp * canvasInfo.height/10);
		context.stroke();
		if (logger) {console.log({index: arr[i].index, value: arr[i].value, x: x, y: y});}
	}
	if (logger) {console.groupEnd();}
}
function drawNodes (canvasObj, arr, canvasInfo) {
	var canvas = canvasObj.getContext('2d');
	var pointArr = [];	
	let retval = 0;
	for (let i = 0; i < arr.length; i++) {
		let rectSize, color;
		let pointObj = arr[i].drawPoint;
		if (pointObj.x > canvasObj.width/2 || pointObj.x < -(canvasObj.width/2)){
			retval = 1;
		}
		switch (arr[i].depth) {
			case 0:
				color = 'Indigo';
				break;
			case 1:
				color = 'DarkSlateBlue';
				break;
			case 2:
			case 3:
				color = 'DarkViolet';
				break;
			case 4:
			case 5:
				color = 'BlueViolet';
				break;
			case 6:
			case 7:
				color = 'MediumPurple';
				break;
			default:
				color = 'red';
			}

		switch (pointObj.y) {
			case 0:
				rectSize = 36;
				break;
			case 1:
				rectSize = 18;
				break;
			case 2:
			case 3:
				rectSize = 14;
				break;
			case 4:
			case 5:
				rectSize = 10;
				break;
			case 6:
			case 7:
				rectSize = 8;
				break;
			default:
				rectSize = 6;
			}

		let y = pointObj.y > 0 ? pointObj.y : rectSize / canvasInfo.height/10 - rectSize / 2 / canvasInfo.height/10;

		y = Math.round(y * canvasInfo.height/10 - rectSize / 4);
		y = y < 0 ? 0 : y;
		let x = pointObj.x;
		x = Math.round(x + canvasInfo.width/2 - rectSize / 2);

		let rectangle = [rectSize, rectSize];
		canvas.fillStyle = color;
		canvas.fillRect(x, y, rectangle[0], rectangle[1]);
		let rectObj = {
			xLeft: x,
			yLeft: y,
			xRight: x + rectangle[0],
			yRight: y + rectangle[1],
			obj: arr[i]
		};
		pointArr[i] = rectObj;
		canvas.strokeStyle = '#f0f0f0';
		canvas.strokeRect(x + 1, y + 1, rectangle[0] - 1, rectangle[1] - 1);
	}
	canvasObj.pointArr = pointArr;
	return retval;
}
function drawPoly (id, arr) { //id тега <canvas> и массив координат
	// Отрисовка
	var canvasObj = document.getElementById(id);
	var canvas = canvasObj.getContext('2d');
	var canvasInfo = {
		width: canvasObj.width,
		height: canvasObj.height
	}
	clear_all(canvasObj, canvasObj.width, canvasObj.height);
	canvasObj.addEventListener("click", onClick, false);
	canvasObj.addEventListener("dblclick", onDblClick, false);
	canvas.beginPath();
	canvas.fillStyle = '#d5dddf';
	canvas.fillRect(0,0, canvasInfo.width, canvasInfo.height);
	drawCurveToParent(canvas, arr, canvasInfo, '#f0f0f0');
	
	return drawNodes (canvasObj, arr, canvasInfo) == 1 ? 1 : 0;
}
function clear_all (canvasObj, width, height){
	var canvas = canvasObj.getContext('2d');
	canvas.clearRect(0,0,width,height);
	canvasObj.removeEventListener("click", onClick, false);
	canvasObj.removeEventListener("click", onDblClick, false);
}
function BinarySearchTree() {
    this.root = null;
    this.index = 0;
}
function customCheckDrawPoint (node) {
    var drawPoint = [];
    var traverse = function(node) {
        if (!node) return null;
        if (node) {
        	drawPoint.push(node);
            traverse(node.parent);
        }
    };
    traverse(node);
    return drawPoint;
}
function BinaryTreeConstructor (num) {
	var tree = new BinarySearchTree();
	let arr = [];
	for (let i = 0; i < num; i++) {
		while (true) {
			let randomIn = randomInteger(0,num);
			if (arr.indexOf(randomIn) === -1) {
				arr.push(randomIn);
				break;
			}
		}
	}
	for (let i = 0; i < arr.length; i++) {
		tree.add(arr[i]);
	}
	tree.setDepth();
	tree.setDrawPoint(tree.maxDepth(), 0);
	delete(tree.index);
	return tree;
}
function createTree (num) {
	var tree = new BinaryTreeConstructor(num);
	window.binarySearchTree = tree;
	return tree;
}
function createCoordArray(tree) {
	var coordArray = tree.checkDrawPoint();
	return coordArray;
}
function draw(onScreen) {
	let endDraw = false;
	console.clear();
	let iterator = 0;
	let width = document.getElementById('canvasId').width;
	let height = document.getElementById('canvasId').height;
	while(!endDraw){
		var retval = drawPoly('canvasId', createCoordArray(createTree(document.getElementById('count').value)));
		if (!onScreen){
			endDraw = true;
		} else {
			if (retval == 0){
				endDraw = true;
				drawText("Iteration : " + iterator, {x: width - 1.8 * width / 10, y: height / 50 * 2 / 10});
			}
		}
		iterator++;
		if (iterator >= 200){
			endDraw = true;
			alert("Too much iteration for draw all nodes on you screen, please, try again!");
		}
	}
}

window.onload = function() {
	let form = `
	<form id="form">
		<canvas style='border:1px dashed #888;' id='canvasId' width='100' height='100'>
			"Canvas" tag not avilable on this place!
		</canvas>
		<br>
		<div id="wh" style="width: 100%; margin-top: 10px;">
			<input id="button" style="width: 43%; float: right;" type="button" value="Draw" onclick="draw(false);">
			<input id="button" style="width: 46%; float: right; margin-right: 1%;" type="button" value="Draw on screen" onclick="draw(true);">
			<input style="width: 9%; float: left;" type="text" value="50" id="count">
		</div>
	</form>`;
	document.write(form);
	document.getElementById('canvasId').width = document.getElementById('wh').clientWidth - 2;
	document.getElementById('canvasId').height = document.getElementById('canvasId').width / 1.4;
	document.getElementById('wh').style.width = document.getElementById('canvasId').width + 2 + "px";
	document.getElementById('button').style.width = document.getElementById('canvasId').width - (document.getElementById('canvasId').width / 90) * 100;
	document.getElementById('count').style.width = document.getElementById('canvasId').width - (document.getElementById('canvasId').width / 10) * 100;
}
