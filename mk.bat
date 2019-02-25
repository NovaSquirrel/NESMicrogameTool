@echo off
ca65 microgame.s -o microgame.o -l microgame.lst -g
ld65 -C microgame.x microgame.o -o microgame.nes --dbgfile debug.dbg
pause