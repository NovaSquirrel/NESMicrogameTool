;
; NES Microgame engine
; Copyright 2019 NovaSquirrel
; 
; This software is provided 'as-is', without any express or implied
; warranty.  In no event will the authors be held liable for any damages
; arising from the use of this software.
; 
; Permission is granted to anyone to use this software for any purpose,
; including commercial applications, and to alter it and redistribute it
; freely, subject to the following restrictions:
; 
; 1. The origin of this software must not be misrepresented; you must not
;    claim that you wrote the original software. If you use this software
;    in a product, an acknowledgment in the product documentation would be
;    appreciated but is not required.
; 2. Altered source versions must be plainly marked as such, and must not be
;    misrepresented as being the original software.
; 3. This notice may not be removed or altered from any source distribution.
;

.proc InitMicrogame
  lda #0
  sta MicrogameWon
  sta MicrogameLost
  sta MicrogameJustWon
  sta MicrogameJustLost
  sta MicrogameTime
  sta MicrogameFrames
  sta MicrogameRealFrames


  ; Clear out the globals
  ldy #15
: sta MicrogameGlobals,y
  jsr ActorClearY ; also clear out actors
  dey
  bpl :-


  ; Set microgame pointers
  lda #1
  asl
  tax
  lda All_ActorWidth+0,x
  sta MicrogameActorWidth+0
  lda All_ActorWidth+1,x
  sta MicrogameActorWidth+1
  ; ---
  lda All_ActorHeight+0,x
  sta MicrogameActorHeight+0
  lda All_ActorHeight+1,x
  sta MicrogameActorHeight+1
  ; ---
  lda All_ActorGraphic+0,x
  sta MicrogameActorGraphic+0
  lda All_ActorGraphic+1,x
  sta MicrogameActorGraphic+1
  ; ---
  lda All_ActorRun+0,x
  sta MicrogameActorRun+0
  lda All_ActorRun+1,x
  sta MicrogameActorRun+1
  ; ---
  lda All_ActorInit+0,x
  sta MicrogameActorInit+0
  lda All_ActorInit+1,x
  sta MicrogameActorInit+1
  ; ---
  lda All_Init+0,x
  sta MicrogameGameInit+0
  lda All_Init+1,x
  sta MicrogameGameInit+1
  ; ---
  lda All_Run+0,x
  sta MicrogameGameRun+0
  lda All_Run+1,x
  sta MicrogameGameRun+1

  ; Place actors
  lda All_ActorPlacement+0,x
  sta 0
  lda All_ActorPlacement+1,x
  sta 1
  ldx #0
  ldy #0
: lda (0),y
  bmi :+
  sta ActorType,x
  iny
  lda (0),y
  sta ActorPXH,x
  iny
  lda (0),y
  sta ActorPYH,x
  iny
  inx
  bne :- ; unconditional
:

  jsr CallInit

  jmp MicrogameLoop

CallInit:
  jmp (MicrogameGameInit)
.endproc

.proc MicrogameLoop
  jsr ClearOAM
Loop:
  jsr WaitVblank
  lda #2
  sta OAM_DMA
  lda #BG_ON|OBJ_ON
  sta PPUMASK

  jsr ClearOAM
  jsr ReadJoy

  jsr CallRun

  ; Call all actors
  ldx #NUM_ACTORS-1
ActorLoop:
  stx ThisActor
  jsr CallActor
  ldx ThisActor
  jsr DrawActor
  dex
  bpl ActorLoop


  inc MicrogameFrames
  inc MicrogameRealFrames

  jmp Loop

CallRun:
  jmp (MicrogameGameRun)
CallActor:
  lda ActorType,x
  asl
  tay
  ; Using .dbyt so the high byte is already first
  lda (MicrogameActorRun),y
  pha
  iny
  lda (MicrogameActorRun),y
  pha
  rts
.endproc

.proc CallActorInit
  lda ActorType,x
  asl
  tay
  ; Using .dbyt so the high byte is already first
  lda (MicrogameActorInit),y
  pha
  iny
  lda (MicrogameActorInit),y
  pha
  rts
.endproc

.proc DrawActor
  Graphic = 0
  Width = 1
  Height = 2

  ldy ActorType,x
  bne :+
    rts
  :
  lda (MicrogameActorGraphic),y
  sta Graphic

  .if 0
  ; Get width and height too
  lda (MicrogameActorWidth),y
  lda #16
  lsr
  sta Width
  lda (MicrogameActorHeight),y
  lda #16
  lsr
  sta Height
  .endif

  ; -----------------------------------
  ldy OamPtr

  lda ActorPXH,x
  sta OAM_XPOS+(4*1),y
  sub #8
  sta OAM_XPOS+(4*0),y

  lda ActorPYH,x
  sub #8
  sta OAM_YPOS+(4*0),y
  sta OAM_YPOS+(4*1),y

  lda Graphic
  sta OAM_TILE+(4*0),y
  add #2
  sta OAM_TILE+(4*1),y

  lda #0
  sta OAM_ATTR+(4*0),y
  sta OAM_ATTR+(4*1),y

  tya
  add #4*2
  sta OamPtr
  rts
.endproc

; Does a collision check on two rectangles
; input: TouchTopA/B, TouchLeftA/B, TouchWidthA/B, TouchHeightA/B
; output: carry (rectangles are overlapping)
.proc ChkTouchGeneric
  ; http://atariage.com/forums/topic/71120-6502-killer-hacks/page-3?&#entry1054049
; X positions
  lda TouchWidthB
  sub #1
  sta TouchTemp
  add TouchWidthA
  sta TouchTemp2  ; carry now clear

  lda TouchLeftA
  sbc TouchLeftB ; Note will subtract n-1
  sbc TouchTemp  ;#SIZE2-1
  adc TouchTemp2 ;#SIZE1+SIZE2-1 ; Carry set if overlap
  bcc No

; Y positions
  lda TouchHeightB
  sub #1
  sta TouchTemp
  add TouchHeightA
  sta TouchTemp2   ; carry now clear

  lda TouchTopA
  sbc TouchTopB  ; Note will subtract n-1
  sbc TouchTemp  ;#SIZE2-1
  adc TouchTemp2 ;#SIZE1+SIZE2-1 ; Carry set if overlap
  bcc No

  sec
  rts
No:
  clc
  rts
.endproc

.proc DoNothing
  rts
.endproc
