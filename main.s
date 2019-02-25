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

.code
.proc MainLoop
  jsr wait_vblank
  lda #2
  sta OAM_DMA

  lda #0
  sta PPUSCROLL
  sta PPUSCROLL
  lda #OBJ_ON|BG_ON
  sta PPUMASK

  lda keydown
  sta keylast
  jsr ReadJoy

  lda keydown
  and #KEY_LEFT|KEY_DOWN|KEY_UP|KEY_RIGHT
  sta 0
  lda keylast
  and #KEY_LEFT|KEY_DOWN|KEY_UP|KEY_RIGHT
  cmp 0
  bne :+
    lda KeyRepeat
    cmp #16
    bcc NoRepeat
    lda retraces
    and #3
    bne NoRepeat
    lda keylast
    and #<~(KEY_LEFT|KEY_DOWN|KEY_UP|KEY_RIGHT)
    sta keylast
  NoRepeat:

    lda KeyRepeat
    bmi DidRepeat
    inc KeyRepeat
    jmp DidRepeat
: lda #0
  sta KeyRepeat
DidRepeat:

  lda keydown
  and #KEY_DOWN
  beq :+
    lda keylast
    and #KEY_DOWN
    bne :+
      inc cursorY
  :

  lda keydown
  and #KEY_UP
  beq :+
    lda keylast
    and #KEY_UP
    bne :+
      dec cursorY
  :

  lda cursorY
  bpl :+
    lda #23
    sta cursorY
    jmp :++
  :
  cmp #24
  bcc :+
    lda #0
    sta cursorY
  :


  lda cursorY
  asl
  asl
  asl
  add #4*8-1
  sta OAM_YPOS+(4*0)
  sta OAM_YPOS+(4*1)
  lda #8
  sta OAM_XPOS+(4*0)
  add #8
  sta OAM_XPOS+(4*1)
  ldx #4
  stx OAM_TILE+(4*0)
  inx
  stx OAM_TILE+(4*1)
  lda #0
  sta OAM_ATTR+(4*0)
  sta OAM_ATTR+(4*1)

  jmp MainLoop
.endproc
