var hc = 4;      // 사사퍼즐
var d = 100;	// 한 칸 간격(픽셀)
var cw = 600;	// 캔버스 가로 크기
var ch = 600;	// 캔버스 세로 크기
var sx = 0;	// 출발지점 x좌표
var sy = 0;	// 출발지점 y좌표
var ex = 0;	// 도착지점 x좌표
var ey = 0;	// 도착지점 y좌표

var ctx = null;

//돌의 색(상대편, 나, 클릭표시, 이동가능위치)
var colorStone = new Array("rgb(200,0,0)", "rgb(0,0,200)", "rgb(0,200,0)", "rgb(0,200,0)");

var stone = new Array(11);	// 위치 정보 배열

// 초기 배경 그리기
function init() {
    sx = cw / 2;
    ex = cw / 2;
    ey = 100;
    sy = ch - ey;

	var c = document.getElementById("cnvs");
	if (c.getContext) {
		if (ctx==null) {
			ctx = c.getContext("2d");
		} else {
		    ctx.clearRect(0,0, cw,ch);
		}

		// 시작지점 그리기
		ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - 7, sy + 15);
        ctx.lineTo(sx + 7, sy + 15);
        ctx.lineTo(sx, sy);
		ctx.lineWidth = 1;	// 선 두께
		ctx.strokeStyle = "rgb(0,0,200)";	// 테두리 선 색
		ctx.fillStyle = "rgb(0,0,200)";	// 채우기 색
    	ctx.fill();
		ctx.stroke();

		// 도착지점 그리기
		ctx.beginPath();
        ctx.moveTo(ex - 10, ey);
        ctx.lineTo(ex + 10, ey);
        ctx.moveTo(ex, ey - 10);
        ctx.lineTo(ex, ey + 10);
		ctx.lineWidth = 2;	// 선 두께
		ctx.strokeStyle = "rgb(200,0,0)";	// 테두리 선 색
		ctx.stroke();
	}
};

// 궤적 그리기
function start() {
    //ctx.clearRect(0,0, cw,ch);
    //init();

    var info = infoTarget(sx, sy, ex, ey);
    var distance = info[0];
    var angle = info[1];

    var degree = document.getElementById("degree").value;
    var divide = document.getElementById("divide").value;
    var viewNumber = document.getElementById("viewNumber").value;   // 숫자 표시 여부

    var d = distance / divide;  // 한 번에 이동하는 거리

    console.log("기울어진 각도 : " + degree + ", 쪼개기 : " + divide + ", distance : " + distance + ", d : " + d);

    var x = sx;
    var y = sy;

    var i = 0;
    while (true) {

        info = infoTarget(x, y, ex, ey);
        var _d = info[0];
        angle = info[1];

		// 종료 계산
		if (i>=divide) {
		    if (_d >= distance)	break;  // 줄어들 가능성이 없으면 종료
		    if (_d<d) break;    // 충분히 줄어들었으면 종료
		    if (i>2*divide) break;  // 무한루프 방지
		}

		i++;

        var deg = angle + Number(degree);
        var nx = x + d * Math.sin(deg * Math.PI / 180);
        var ny = y - d * Math.cos(deg * Math.PI / 180);
		// 선 그리기
		ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
		ctx.lineWidth = 1;	// 선 두께
		ctx.strokeStyle = "rgb(0,0,0)";	// 테두리 선 색

		// 숫자 표시 여부
		if (viewNumber == 'on') {
            ctx.fillText(i, nx, ny);
            ctx.fillStyle = "gray";	// 채우기 색
		}
		ctx.stroke();
        console.log("   " + i + " " + deg + " : (" + x + "," + y + ") ~ (" + nx + "," + ny + ")");
		x = nx;
		y = ny;
    }
}

// 목표지점 방위각과 거리 계산
function infoTarget(startX, startY, endX, endY) {
    // canvas 좌표를 수학 좌표로 변환해서 계산
    var dx = startY - endY;
    var dy = endX - startX;
    var distance = Math.sqrt(dx*dx + dy*dy);
    var angle = 0;
    if (dx==0) {
        if (dy>0)
            angle = 90;
        else if (dy<0)
             angle = 270;
    } else if (dx>0) {
        angle = Math.atan(dy/dx) / Math.PI * 180;
        if (angle<0) angle += 360;
    } else {
        angle = Math.atan(dy/dx) / Math.PI * 180 + 180;
        if (angle<0) angle += 360;
    }
    console.log("dx : " + dx + ", dy : " + dy + ", angle : " + angle + ", distance : " + distance);

    return [distance, angle];
}