.export getcoins_ActorPlacement, getcoins_ActorWidth, getcoins_ActorHeight, getcoins_ActorRun, getcoins_ActorInit, getcoins_ActorGraphic, getcoins_Run, getcoins_Init

.enum getcoins_ActorType
empty
player
getme
condition_test
misc_test
.endenum

.proc getcoins_ActorPlacement
.byt getcoins_ActorType::player, 128, 128
.byt getcoins_ActorType::getme, 32, 32
.byt getcoins_ActorType::getme, 32, 200
.byt getcoins_ActorType::getme, 200, 200
.byt getcoins_ActorType::getme, 200, 32
.byt 255
.endproc

.proc getcoins_ActorWidth
.byt 0
.byt 16
.byt 16
.byt 16
.byt 16
.endproc

.proc getcoins_ActorHeight
.byt 0
.byt 16
.byt 16
.byt 16
.byt 16
.endproc

.proc getcoins_ActorRun
.dbyt (DoNothing-1)
.dbyt (getcoins_Actor_Run_player-1)
.dbyt (getcoins_Actor_Run_getme-1)
.dbyt (getcoins_Actor_Run_condition_test-1)
.dbyt (getcoins_Actor_Run_misc_test-1)
.endproc

.proc getcoins_ActorInit
.dbyt (DoNothing-1)
.dbyt (DoNothing-1)
.dbyt (DoNothing-1)
.dbyt (DoNothing-1)
.dbyt (DoNothing-1)
.endproc

.proc getcoins_ActorGraphic
.byt 0
.byt $01
.byt $e8
.byt $05
.byt $03
.endproc

.proc getcoins_Run
Exit:
rts
.endproc

.proc getcoins_Init
Exit:
rts
.endproc

.proc getcoins_Actor_Run_player
lda #2
sta ActorSpeed,x

lda #255
jsr Actor8WayMovement

Exit:
rts
.endproc

.proc getcoins_Actor_Run_getme
lda #5
sta ActorSpeed,x

jsr ActorBallMovement

lda #getcoins_ActorType::player
jsr ActorTouchingType
jcc lbl_1
lda #0
sta ActorType,x

lda #getcoins_ActorType::getme
jsr ActorFindType
jcs lbl_3
jsr WinGame

lbl_3:

lbl_1:

Exit:
rts
.endproc

.proc getcoins_Actor_Run_condition_test
lda MicrogameGlobals
cmp MicrogameGlobals+1
jcs lbl_5
inc ActorSpeed,x

lbl_5:

lda MicrogameGlobals
cmp MicrogameGlobals+1
jcc lbl_7
inc ActorSpeed,x

lbl_7:

lda MicrogameGlobals
cmp #10
jcc lbl_11
lda MicrogameGlobals
cmp MicrogameGlobals+1
jcs lbl_9
lbl_11:
inc ActorSpeed,x

lbl_9:

lda MicrogameGlobals
cmp #10
jcs lbl_12
lda MicrogameGlobals
cmp MicrogameGlobals+1
jcs lbl_12
inc ActorSpeed,x

lbl_12:

Exit:
rts
.endproc

.proc getcoins_Actor_Run_misc_test
lda #50
sta 1
lda #50
sta 0
lda #getcoins_ActorType::getme
jsr ActorCreateAtXY

nop
nop
nop

jsr getcoins_subroutine_test

lda ActorSpeed,x
cmp #20
jcs lbl_14
inc ActorSpeed,x

jmp lbl_15
lbl_14:
lda #0
sta ActorSpeed,x

lbl_15:

Exit:
rts
.endproc

.proc getcoins_subroutine_test
lda #1
lda #2
lda #3
lda #4

jsr ActorStop

Exit:
rts
.endproc

