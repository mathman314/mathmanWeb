#!/usr/bin/sh

ls | grep gif > imglist.txt
ls | grep jpg >> imglist.txt

# ���⼭ �ٸ� ������ ���ϵ� ���ٿ� ��� �߰��� �� �ִ�(��ҹ��� ����).
# ���� ��� JPG ������ �߰� = ls | grep JPG >> imglist.txt

eval perl imgshow.pl
