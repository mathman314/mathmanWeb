#!/usr/bin/perl
########################################################################
# 최초 1999년 1월 19일 제작
# 제작자 : 진태식(http://math1.kumoh.ac.kr/~jints)
# 목적 : 이미지 리스트 파일에 기록된 이미지를 웹에서 볼 수 있도록 한다. 
########################################################################

# 이미지 리스트 파일 정의
$imgListFile="imglist.txt";	# 이미지 리스트 파일

# 분류(table)파일을 읽음  
$count=0;
open(imsi, $imgListFile);
	for(<imsi>){ $select[$count++] = $_ ; }
close(imsi);

############## 화면 출력 (브라우징) ###########

# 머리부분 출력
print <<__TopEnd;
Content-type: text/html

<html>
<head>
    <title>이미지 보기</title>
</head>

<body bgcolor=white>

<center>

<h2>이미지 보기</h2>

<table border=0 bgcolor=white> <!-- 외부 테이블 -->
<td align=center>
  <table border=1 width=100% bgcolor=white> <!-- 내부 테이블 -->
    <tr bgcolor=yellow><td>파일명</td><td>이미지</td>
__TopEnd

# 그림을 어떻게 보여줄 것인가?
$count = 0;
for(@select){
    print "    <tr><td>$_</td><td><img src=$_ alt=$_></td>\n";
	++$count;
}

# 꼬리부분 출력 
print <<__BottomEnd;

  </table> <!-- 내부 테이블 -->
  이상 $count개의 이미지가 있습니다.<p>
  <hr>
  저작권자: <a href=http://math1.kumoh.ac.kr/~jints/>진태식</a>
</td>
</table> <!-- 외부 테이블 -->
</center>

</body>
</html>
__BottomEnd

############## 화면 출력 끝  ###########

exit;
