#!/usr/bin/perl
########################################################################
# ���� 1999�� 1�� 19�� ����
# ������ : ���½�(http://math1.kumoh.ac.kr/~jints)
# ���� : �̹��� ����Ʈ ���Ͽ� ��ϵ� �̹����� ������ �� �� �ֵ��� �Ѵ�. 
########################################################################

# �̹��� ����Ʈ ���� ����
$imgListFile="imglist.txt";	# �̹��� ����Ʈ ����

# �з�(table)������ ����  
$count=0;
open(imsi, $imgListFile);
	for(<imsi>){ $select[$count++] = $_ ; }
close(imsi);

############## ȭ�� ��� (����¡) ###########

# �Ӹ��κ� ���
print <<__TopEnd;
Content-type: text/html

<html>
<head>
    <title>�̹��� ����</title>
</head>

<body bgcolor=white>

<center>

<h2>�̹��� ����</h2>

<table border=0 bgcolor=white> <!-- �ܺ� ���̺� -->
<td align=center>
  <table border=1 width=100% bgcolor=white> <!-- ���� ���̺� -->
    <tr bgcolor=yellow><td>���ϸ�</td><td>�̹���</td>
__TopEnd

# �׸��� ��� ������ ���ΰ�?
$count = 0;
for(@select){
    print "    <tr><td>$_</td><td><img src=$_ alt=$_></td>\n";
	++$count;
}

# �����κ� ��� 
print <<__BottomEnd;

  </table> <!-- ���� ���̺� -->
  �̻� $count���� �̹����� �ֽ��ϴ�.<p>
  <hr>
  ���۱���: <a href=http://math1.kumoh.ac.kr/~jints/>���½�</a>
</td>
</table> <!-- �ܺ� ���̺� -->
</center>

</body>
</html>
__BottomEnd

############## ȭ�� ��� ��  ###########

exit;
