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

.proc ReadJoy
  ldx #1
  stx $4016
  stx keydown+1
  dex
  stx $4016
  : lda $4016
    and #$03
    cmp #1
    rol keydown+0
    lda $4017
    and #$03
    cmp #1
    rol keydown+1
    bcc :-
  rts
.endproc

.proc wait_vblank
  lda retraces
  loop:
    cmp retraces
    beq loop
  rts
.endproc

.proc PutHex
	pha
	pha
	lsr a
	lsr a
	lsr a
	lsr a
	tax
	lda hexdigits,x
	sta PPUDATA
	pla
	and #$0f
	tax
	lda hexdigits,x
	sta PPUDATA
	pla
	rts
hexdigits:	.byt "0123456789ABCDEF"
.endproc

.proc PutDecimal ; Prints with anywhere from 1 to 3 digits
   cmp #10 ; only one char
   bcs :+
     add #'0'    ; char is number+'0'
     sta PPUDATA
     rts
   :

   ; the hundreds digit if necessary
   cmp #200
   bcc LessThan200
   ldx #'2'
   stx PPUDATA
   sub #200
   jmp :+
LessThan200:
   cmp #100
   bcc :+
   ldx #'1'
   stx PPUDATA
   sub #100
:
   ldx #'0'    ; now calculate the tens digit
:  cmp #10
   bcc Finish
   sbc #10     ; carry will be set if this runs anyway
   inx
   jmp :-
Finish:
   stx PPUDATA ; display tens digit
   add #'0'
   sta PPUDATA ; display ones digit
   rts
.endproc

.proc ClearName
;Clear the nametable
  ldx #$20
  ldy #$00
  stx PPUADDR
  sty PPUADDR
  ldx #64
  ldy #4
  lda #' '
: sta PPUDATA
  inx
  bne :-
  dey
  bne :-
;Clear the attributes
  ldy #64
  lda #0
: dey
  bne :-
  sta PPUSCROLL
  sta PPUSCROLL
  rts
.endproc

.proc WaitForKey
: jsr ReadJoy
  lda keydown
  ora keydown+1
  beq :-
  lda keylast
  ora keylast+1
  bne :-
  rts
.endproc

; Writes a zero terminated string to the screen
; (by Ross Archer)
.proc PutStringImmediate
    DPL = $02
    DPH = $03
    pla             ; Get the low part of "return" address
                    ; (data start address)
    sta DPL
    pla 
    sta DPH         ; Get the high part of "return" address
                    ; (data start address)
                    ; Note: actually we're pointing one short
PSINB:
    ldy #1
    lda (DPL),y     ; Get the next string character
    inc DPL         ; update the pointer
    bne PSICHO      ; if not, we're pointing to next character
    inc DPH         ; account for page crossing
PSICHO:
    ora #0          ; Set flags according to contents of accumulator
                    ;    Accumulator
    beq PSIX1       ; don't print the final NULL 
    sta PPUDATA     ; write it out
    jmp PSINB       ; back around
PSIX1:
    inc DPL
    bne PSIX2
    inc DPH         ; account for page crossing
PSIX2:
    jmp (DPL)       ; return to byte following final NULL
.endproc

.proc BitSelect
 .byt %00000001
 .byt %00000010
 .byt %00000100
 .byt %00001000
 .byt %00010000
 .byt %00100000
 .byt %01000000
 .byt %10000000
.endproc

.proc BitCancel
 .byt %11111110
 .byt %11111101
 .byt %11111011
 .byt %11110111
 .byt %11101111
 .byt %11011111
 .byt %10111111
 .byt %01111111
.endproc
