var d = 100;	// 고누 격자간 간격(픽셀)
var r = 40;		// 고누 돌 반지름
var cw = 500;	// 캔버스 가로 크기
var ch = 550;	// 캔버스 세로 크기
var sx = 100;	// 고누 그리기 시작 x좌표
var sy = 60;	// 고누 그리기 시작 y좌표

var ctx = null;

var gameState = 0;		// 게임 상태(-1:게임종료, 0:연습, 1:PC대전, 2:홀로2인)
var strGameState = new Array("연습하기", "1인용 게임", "2인용 게임");
var clickPosition = -1;	// 클릭한 위치(미클릭시 -1)
var moveCount = 0;	// 게임중 돌 이동 수
var whoFirst = -1;	// 먼저 시작하는 돌(-1:미정, 0:상대, 1:나)

//돌의 색(상대편, 나, 클릭표시, 이동가능위치)
var colorStone = new Array("rgb(200,0,0)", "rgb(0,0,200)", "rgb(0,200,0)", "rgb(0,200,0)");

var stone = new Array(11);	// 돌 정보 배열

/**
 * 돌 정보 구조체
 * x : 캔버스에서 x 좌표
 * y : 캔버스에서 y 좌표
 * state : 돌의 피아 표시(-1:빈곳, 0:상대, 1:나)
 * moveable : 이동 가능 위치
 */
function StoneInfo(x, y, state, moveable) {
	this.x = x;
	this.y = y;
	this.state = state;
	this.moveable = moveable;
}

// 초기 틀 그리기(bInitData:돌 정보 초기화 여부)
function init(bInitData) {
	var c = document.getElementById("cnvs");
	if (c.getContext) {
		if (ctx==null) {
			c.addEventListener("mouseup", clickUpCanvas, false);
			c.addEventListener("mousedown", clickDownCanvas, false);
			ctx = c.getContext("2d");
		}
		
		// 고누 틀 그리기
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(sx + 2 * d, sy);
		ctx.moveTo(sx + d, sy);
		ctx.lineTo(sx + d, sy + 4 * d);
		ctx.moveTo(sx, sy + 4 * d);
		ctx.lineTo(sx + 2 * d, sy + 4 * d);
		ctx.moveTo(sx, sy + 2 * d);
		ctx.lineTo(sx + 2 * d, sy + 2 * d);
		ctx.arc(sx + d, sy + 2 * d, d, 0, 2 * Math.PI, true);
		ctx.lineWidth = 3;	// 선 두께
		ctx.strokeStyle = "rgb(50,50,50)";	// 테두리 선 색
		ctx.stroke();
		
		ctx.font = "15px 돋움";
		ctx.fillStyle = "rgb(50,50,50)";	// 채우기 색
		ctx.fillText("상대편", sx + 2.7 * d, sy);
		ctx.fillText("나", sx + 2.7 * d, sy + 4 * d);
		ctx.fillText(strGameState[gameState], sx + 2.7 * d, sy + 1 * d);

		if (gameState == 0) {
			ctx.fillText("차례 : 아무나", sx + 2.7 * d, sy + 2 * d);
		} else if (gameState > 0) {
			ctx.fillText("현재 :  " + moveCount + " 수", sx + 2.7 * d, sy + 2 * d);
			if (gameState==2) {
				if (whoFirst<0)
					ctx.fillText("차례 : 아무나", sx + 2.7 * d, sy + 2 * d + 30);
				else
					displayOrder();	// 차례 표시
			} else {
				if (whoFirst<0) whoFirst = Math.floor(Math.random() * 2);
				displayOrder();	// 차례 표시
			}
		}
		
		if (bInitData) initStoneData();
		printStone();
	}
};

// 차례 표시
function displayOrder() {
	ctx.beginPath();
	ctx.fillText("차례 : ", sx + 2.7 * d, sy + 2 * d + 30);
	ctx.arc(sx + 2.7 * d + 60, sy + 2 * d + 25, 10, 0, 2 * Math.PI, false);
	ctx.fillStyle = colorStone[(whoFirst + moveCount) % 2];	// 채우기 색
	ctx.fill();
}

// 돌 정보 초기 설정
function initStoneData() {
	stone[0] = new StoneInfo(sx, sy, 0, [1]);
	stone[1] = new StoneInfo(sx+d, sy, 0, [3]);
	stone[2] = new StoneInfo(sx+2*d, sy, 0, [1]);
	stone[3] = new StoneInfo(sx+d, sy+d, -1, [4,5,6]);
	stone[4] = new StoneInfo(sx, sy+2*d, -1, [3,5,7]);
	stone[5] = new StoneInfo(sx+d, sy+2*d, -1, [3,4,6,7]);
	stone[6] = new StoneInfo(sx+2*d, sy+2*d, -1, [3,5,7]);
	stone[7] = new StoneInfo(sx+d, sy+3*d, -1, [4,5,6]);
	stone[8] = new StoneInfo(sx, sy+4*d, 1, [9]);
	stone[9] = new StoneInfo(sx+d, sy+4*d, 1, [7]);
	stone[10] = new StoneInfo(sx+2*d, sy+4*d, 1, [9]);
}

// 고누 돌 그리기
function printStone() {
	var _x = 0, _y = 0;
	
	for (var i=0; i<stone.length; i++) {
		var nStone = stone[i].state;
		//console.log(i + "-" + n);
		if (nStone>-1) {
			_x = stone[i].x;
			_y = stone[i].y;
			
			ctx.beginPath();
			//ctx.strokeStyle = "rgb(0, 200, 0)";	// 테두리 선 색
			ctx.arc(_x, _y, r, 0, 2 * Math.PI, true);
			ctx.fillStyle = colorStone[nStone];	// 채우기 색
			ctx.fill();
		}
	}
	//ctx.stroke();
	
	if (gameState==1 && moveCount==0 && whoFirst==0) {
		// 시간 지연 후, 컴퓨터 돌 자동 이동
		setTimeout("yourStonAutoMove()", 1000 + Math.random() * 500);
	}
}

//캔버스에서 클릭(다운)시
function clickDownCanvas(ev) {
	if (gameState<0) return;
	var mx = 0, my = 0;
	
	if (ev.layerX || ev.layerX==0) {
		mx = ev.layerX;
		my = ev.layerY;
	} else if (ev.offsetX || ev.offsetX==0) {
		mv = ev.offsetX;
		my = ev.offsetY;
	}
	
	// 클릭한 곳의 돌 위치
	var nPos = calculateClickPosition(mx, my);
//	console.log("in clickDownCanvas(), mx = " + mx + ", my = " + my + ", nPos = " + nPos + ", clickPosition = " + clickPosition);
	
	// 돌 위치 클릭시
	if (nPos>-1) {
		switch(gameState) {
		case 0 :	// 연습 상태인 경우
			// 기존 클릭한 지점이 없을 때
			if (clickPosition == -1) {
				// 방금 클릭한 곳의 돌 피아 정보
				var nStone = stone[nPos].state;
				if (nStone>-1) selectStone(nPos, false);	// 돌 선택 처리
			} else {	// 기존 클릭한 지점이 있을 때
				// 방금 클릭한 곳의 돌 피아 정보
				var nStone = stone[nPos].state;
				if (nStone<0) {
					// 기클릭한 지점에서 방금 클릭한 곳으로 이동 가능하면 이동
					var moveable = stone[clickPosition].moveable;
					for (var i=0; i<moveable.length; i++) {
						if (nPos == moveable[i]) {
							// 이동 처리
							moveStone(clickPosition, nPos);
							break;
						}
					}
				} else if (nPos == clickPosition){
					// 선택된 곳을 다시 클릭시 선택 해제
					deselectStone(nPos);
				}
			}
			break;
		case 1 :	// 1인용(PC 상대)
			// 기존 클릭한 지점이 없을 때
			if (clickPosition == -1) {
				// 방금 클릭한 곳의 돌 피아 정보
				var nStone = stone[nPos].state;
				if (nStone==1) {
					if (nStone==(whoFirst+moveCount)%2) selectStone(nPos, false);	// 돌 선택 처리
				}
			} else {	// 기존 클릭한 지점이 있을 때
				// 방금 클릭한 곳의 돌 피아 정보
				var nStone = stone[nPos].state;
				if (nStone<0) {
					// 기클릭한 지점에서 방금 클릭한 곳으로 이동 가능하면 이동
					var moveable = stone[clickPosition].moveable;
					for (var i=0; i<moveable.length; i++) {
						if (nPos == moveable[i]) {
							// 이동 처리
							moveStone(clickPosition, nPos);
							break;
						}
					}
				} else if (nPos == clickPosition){
					// 선택된 곳을 다시 클릭시 선택 해제
					deselectStone(nPos);
				}
			}
			break;
		case 2 :	// 2인용(홀로 2인)
			// 기존 클릭한 지점이 없을 때
			if (clickPosition == -1) {
				// 방금 클릭한 곳의 돌 피아 정보
				var nStone = stone[nPos].state;
				if (nStone>-1) {
					if (moveCount==0 || nStone==(whoFirst+moveCount)%2) selectStone(nPos, false);	// 돌 선택 처리
				}
			} else {	// 기존 클릭한 지점이 있을 때
				// 방금 클릭한 곳의 돌 피아 정보
				var nStone = stone[nPos].state;
				if (nStone<0) {
					// 기클릭한 지점에서 방금 클릭한 곳으로 이동 가능하면 이동
					var moveable = stone[clickPosition].moveable;
					for (var i=0; i<moveable.length; i++) {
						if (nPos == moveable[i]) {
							// 이동 처리
							moveStone(clickPosition, nPos);
							break;
						}
					}
				} else if (nPos == clickPosition){
					// 선택된 곳을 다시 클릭시 선택 해제
					deselectStone(nPos);
				}
			}
			break;
		}
	}
}

//캔버스에서 클릭(업)시 - 돌 이동에 대해서만 처리
function clickUpCanvas(ev) {
	if (gameState<0) return;
	var mx = 0, my = 0;
	
	if (ev.layerX || ev.layerX==0) {
		mx = ev.layerX;
		my = ev.layerY;
	} else if (ev.offsetX || ev.offsetX==0) {
		mv = ev.offsetX;
		my = ev.offsetY;
	}
	
	// 클릭한 곳의 돌 위치
	var nPos = calculateClickPosition(mx, my);
//	console.log("in clickUpCanvas(), mx = " + mx + ", my = " + my + ", nPos = " + nPos);
	
	// 돌 위치 클릭시
	if (nPos>-1) {
		// 기존 클릭한 지점이 있을 때
		if (clickPosition > -1) {
			// 방금 클릭한 곳의 돌 피아 정보
			var nStone = stone[nPos].state;
			if (nStone<0) {
				// 기클릭한 지점에서 방금 클릭한 곳으로 이동 가능하면 이동
				var moveable = stone[clickPosition].moveable;
				for (var i=0; i<moveable.length; i++) {
					if (nPos == moveable[i]) {
						// 이동 처리
						moveStone(clickPosition, nPos);
						break;
					}
				}
			}
		}
	}
}

// 클릭한 곳의 돌 위치 계산
function calculateClickPosition(mx, my) {
	for (var i=0; i<stone.length; i++) {
		_x = stone[i].x;
		_y = stone[i].y;
		var distance = Math.sqrt((_x-mx)*(_x-mx) + (_y-my)*(_y-my));
		if (distance < r) {
//			console.log("in calculateClickPosition(), distance = " + distance);
			return i;
		}
	}
	return -1;
}

// 돌 선택 처리
function selectStone(nPos, isAuto) {
	// 1. 클릭한 돌 표시
	_x = stone[nPos].x;
	_y = stone[nPos].y;
	ctx.beginPath();
	ctx.strokeStyle = colorStone[2];	// 테두리 선 색
	ctx.arc(_x, _y, r + 10, 0, 2 * Math.PI, true);
	ctx.lineWidth = 3;	// 선 두께
	ctx.stroke();
	
	// 2. 이동가능한 곳 표시
	var moveable = stone[nPos].moveable;
	for (var i=0; i<moveable.length; i++) {
		var _pos = moveable[i];
		if (stone[_pos].state < 0) {	// 돌이 없는 경우만 표시
			_x = stone[_pos].x;
			_y = stone[_pos].y;
			ctx.strokeStyle = colorStone[3];	// 테두리 선 색
			printDotCircle(_x, _y, r, 50);
		}
	}
	
	if (!isAuto) clickPosition = nPos;
	
	playAudio("척");
}

// 돌 선택 해제
function deselectStone(nPos) {
	ctx.clearRect(0,0, cw,ch);
	clickPosition = -1;
	init(false);
	playAudio("취소");
}

//점선 원 그리기
function printDotCircle(_x, _y, _r, devide) {
	for (var i = 0; i < devide; i++) {
		// 짝수번째에서 호를 그린다.
		if (i % 2 == 0) {
			ctx.beginPath();
			ctx.arc(_x, _y, _r, i * (2 * Math.PI / devide), (i + 1) * (2 * Math.PI / devide), false);
			ctx.stroke();
		}
	}
}

// 돌 이동
function moveStone(p1, p2) {
	var _state = stone[p1].state;
	stone[p2].state = _state;
	stone[p1].state = -1;
	ctx.clearRect(0,0, cw,ch);
	clickPosition = -1;
	if (gameState==2 && moveCount==0) whoFirst = _state;
	moveCount++;
	init(false);
	playAudio("칙");
	
	if (gameState>0) {
		// 게임 종료 확인
		if (checkGameOver()) return;
		
		if (gameState==1 && _state==1) {
			// 시간 지연 후, 컴퓨터 돌 자동 이동
			setTimeout("yourStonAutoMove()", 1000 + Math.random() * 500);
		}
	}
}

// 게임 시작
function startGame(n) {
	if (ctx==null) {
		alert("canvas를 지원하지 않는 브라우저입니다.");
	} else {
		ctx.clearRect(0,0, cw,ch);
		gameState = n;
		clickPosition = -1;
		moveCount = 0;
		whoFirst = -1;
		init(true);
		
		if (gameState>0) playAudio("start");
	}
}

/**
 * 게임 종료 확인
 * 현재 두어야 할 쪽(상대/나)에서 이동가능한 돌이 없으면 그가 졌다.
 */
function checkGameOver() {
	var bOver = true;	// 게임 종료 여부
	for (var i=0; i<stone.length; i++) {
		var nStone = stone[i].state;
		if (nStone == (whoFirst + moveCount) % 2) {
			var moveable = stone[i].moveable;
			for (var j=0; j<moveable.length; j++) {
				var _pos = moveable[j];
				if (stone[_pos].state < 0) {	// 이동 가능
					bOver = false;
					break;
				}
			}
		}
	}
	if (bOver) {
		var strMsg = null;
		if ((whoFirst + moveCount) % 2 == 0) {	// 이겼다
			if (gameState==1) {
				strMsg = "이겼다^^";
				setTimeout("playAudio('이겼다')", 1000);
			} else {
				strMsg = "파랑 승리!";
				setTimeout("playAudio('파랑승리')", 1000);
			}
		} else {	// 졌다
			if (gameState==1) {
				strMsg = "졌다ㅠㅠ";
				setTimeout("playAudio('졌다')", 1000);
			} else {
				strMsg = "빨강 승리!";
				setTimeout("playAudio('빨강승리')", 1000);
			}
		}
		ctx.fillStyle = "rgb(50,50,50)";	// 채우기 색
		ctx.fillText(strGameState[gameState] + " 종료", sx + 2.7 * d, sy + 1 * d);
		ctx.fillText(strMsg, sx + 2.7 * d, sy + 1 * d + 30);
		gameState = -1;
	}
	
	return bOver;
}

/**
 * 컴퓨터 돌 자동 이동
 */
function yourStonAutoMove() {
	// 상대편 돌 전체에서 이동가능한 곳이 몇 군데인지 계산
	var total = 0;
	for (var i=0; i<stone.length; i++) {
		if (stone[i].state == 0) {
			var moveable = stone[i].moveable;
			for (var j=0; j<moveable.length; j++) {
				if (stone[moveable[j]].state < 0) total++;	// 이동 가능한 수 증가
			}
		}
	}
	
	// 자동 이동할 위치는 랜덤 처리
	var moveCnt = Math.floor(Math.random() * total);
	var cnt = 0;
	for (var i=0; i<stone.length; i++) {
		if (stone[i].state == 0) {
			var moveable = stone[i].moveable;
			for (var j=0; j<moveable.length; j++) {
				if (stone[moveable[j]].state < 0) {
					if (cnt==moveCnt) {
//						console.log(total + "개의 이동가능한 곳 중 " + (moveCnt+1) + "번째 이동 선택 : " + i + " -> " + moveable[j]);
						
						selectStone(i, true);	// 돌 선택 처리
						
						// 시간 지연 후, 이동 처리
//						moveStone(i, moveable[j]);	// 이동 처리
						setTimeout("moveStone(" + i + ", " + moveable[j] + ")", 500 + Math.random() * 1000);
						return;
					}
					cnt++;	// 이동 가능한 수 증가
				}
			}
		}
	}
}

//소리 재생
function playAudio(str) {
	var audio = new Audio("audio/" + str + ".mp3");
	audio.play();
}
