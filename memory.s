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

.segment "ZEROPAGE"
random1:  .res 2
random2:  .res 2
keydown:  .res 2
keylast:  .res 2
keynew:   .res 2
retraces: .res 1
OamPtr:   .res 1

MicrogameTime:       .res 1 ; 1 tick = 2 game frames
MicrogameRealFrames: .res 1 ; Used to determine when to run everything twice
MicrogameFrames:     .res 1 ; Used for every X frames stuff

MicrogameDifficulty: .res 1 ; 1, 2, or 4
MicrogameWon: .res 1
MicrogameLost: .res 1
MicrogameJustWon: .res 1
MicrogameJustLost: .res 1

; Game-specific pointers
MicrogameGameInit:     .res 2
MicrogameGameRun:      .res 2
MicrogameActorRun:     .res 2
MicrogameActorInit:    .res 2
MicrogameActorWidth:   .res 2
MicrogameActorHeight:  .res 2
MicrogameActorGraphic: .res 2

; Variables for use in games
MicrogameGlobals: .res 16
MicrogameTemp:    .res 4

ThisActor: .res 1 ; current actor
OtherActor: .res 1 ; the other actor

; the NES CPU can't access VRAM outside of vblank, so this is a queue
; of metatile and byte updates that wait until vblank to trigger
MaxNumBlockUpdates = 4
MaxNumTileUpdates  = 4
BlockUpdateA1:   .res MaxNumBlockUpdates ; \ address of the top two tiles
BlockUpdateA2:   .res MaxNumBlockUpdates ; /
BlockUpdateB1:   .res MaxNumBlockUpdates ; \ address of the bottom two tiles
BlockUpdateB2:   .res MaxNumBlockUpdates ; /
BlockUpdateT1:   .res MaxNumBlockUpdates ; \ top two tiles to write
BlockUpdateT2:   .res MaxNumBlockUpdates ;  \
BlockUpdateT3:   .res MaxNumBlockUpdates ;  / bottom two tiles to write
BlockUpdateT4:   .res MaxNumBlockUpdates ; /

TouchTemp:       .res 1
TouchTemp2:      .res 1
TouchTopA:       .res 1
TouchTopB:       .res 1
TouchLeftA:      .res 1
TouchLeftB:      .res 1
TouchWidthA:     .res 1
TouchWidthB:     .res 1
TouchHeightA:    .res 1
TouchHeightB:    .res 1

TempVal: .res 4

LevelMap = $700

.segment "BSS"
; Allocate one more actor than there are in the list
; and the final entry is used for error protection
NUM_ACTORS = 16
ALLOC_ACTORS = NUM_ACTORS + 1
INVALID_ACTOR = NUM_ACTORS

; Info
ActorType:  .res ALLOC_ACTORS
ActorDir:   .res ALLOC_ACTORS
ActorSpeed: .res ALLOC_ACTORS ; Speed used for movements aside from Vector
ActorArt:   .res ALLOC_ACTORS ; Which animation is used
; Positions
ActorPXL:   .res ALLOC_ACTORS
ActorPXH:   .res ALLOC_ACTORS
ActorPYL:   .res ALLOC_ACTORS
ActorPYH:   .res ALLOC_ACTORS
; Velocities
ActorVXL:   .res ALLOC_ACTORS
ActorVXH:   .res ALLOC_ACTORS
ActorVYL:   .res ALLOC_ACTORS
ActorVYH:   .res ALLOC_ACTORS
; Generic variables
ActorVar1:  .res ALLOC_ACTORS
ActorVar2:  .res ALLOC_ACTORS
ActorVar3:  .res ALLOC_ACTORS
ActorVar4:  .res ALLOC_ACTORS

