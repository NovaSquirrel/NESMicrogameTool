.export avoid_ActorPlacement, avoid_ActorWidth, avoid_ActorHeight, avoid_ActorRun, avoid_ActorInit, avoid_ActorGraphic, avoid_Run, avoid_Init

.enum avoid_ActorType
empty
player
avoidme
.endenum

.proc avoid_ActorPlacement
.byt avoid_ActorType::player, 128, 128
.byt avoid_ActorType::avoidme, 32, 32
.byt avoid_ActorType::avoidme, 32, 200
.byt avoid_ActorType::avoidme, 200, 200
.byt avoid_ActorType::avoidme, 200, 32
.byt 255
.endproc

.proc avoid_ActorWidth
.byt 0
.byt 16
.byt 16
.endproc

.proc avoid_ActorHeight
.byt 0
.byt 16
.byt 16
.endproc

.proc avoid_ActorRun
.dbyt (DoNothing-1)
.dbyt (avoid_Actor_Run_player-1)
.dbyt (avoid_Actor_Run_avoidme-1)
.endproc

.proc avoid_ActorInit
.dbyt (DoNothing-1)
.dbyt (DoNothing-1)
.dbyt (DoNothing-1)
.endproc

.proc avoid_ActorGraphic
.byt 0
.byt $01
.byt $25
.endproc

.proc avoid_Run
Exit:
rts
.endproc

.proc avoid_Init
Exit:
rts
.endproc

.proc avoid_Actor_Run_player
lda #2
sta ActorSpeed,x

lda #255
jsr Actor8WayMovement

Exit:
rts
.endproc

.proc avoid_Actor_Run_avoidme
lda #7
sta ActorSpeed,x

jsr ActorBallMovement

lda #avoid_ActorType::player
jsr ActorTouchingType
jcc lbl_16
lda #0
sta ActorType,x

jsr LoseGame

lbl_16:

lda MicrogameFrames
and #31
jne lbl_18
lda #192
jsr RandomChance
jcc lbl_20
lda #31
jsr RandomWithMax
sta ActorDir,x

jmp lbl_21
lbl_20:
lda #avoid_ActorType::player
jsr ActorFindType

jsr ActorLookAtActor

lbl_21:

lbl_18:

Exit:
rts
.endproc

