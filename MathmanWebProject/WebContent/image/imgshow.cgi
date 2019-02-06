#!/usr/bin/sh

ls | grep gif > imglist.txt
ls | grep jpg >> imglist.txt

# 여기서 다른 형식의 파일도 윗줄에 계속 추가할 수 있다(대소문자 구분).
# 예를 들어 JPG 파일을 추가 = ls | grep JPG >> imglist.txt

eval perl imgshow.pl
