Blockly.defineBlocksWithJsonArray([{
  "type": "assembly",
  "message0": "ASM %1",
  "args0": [
    {
      "type": "field_input",
      "name": "instruction",
      "text": ""
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Type an assembly language instruction here",
  "helpUrl": ""
},
{
  "type": "animation",
  "message0": "Animation: %1 %2 X Flip: %3 Y Flip: %4",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "XFLIP",
      "checked": false
    },
    {
      "type": "field_checkbox",
      "name": "YFLIP",
      "checked": false
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Change the actor's current animation",
  "helpUrl": ""
},
{
  "type": "game_info",
  "message0": "Name %1 %2 Instruction %3 %4 Long? %5",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "example"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "INSTRUCTION",
      "text": "Get!"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "LONG",
      "checked": false
    }
  ],
  "colour": 120,
  "tooltip": "Define info for the game",
  "helpUrl": ""
},
{
  "type": "every_x_frames",
  "message0": "Every %1 frames",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "FREQUENCY",
      "options": [
        [
          "2",
          "2"
        ],
        [
          "4",
          "4"
        ],
        [
          "8",
          "8"
        ],
        [
          "16",
          "16"
        ],
        [
          "32",
          "32"
        ],
        [
          "64",
          "64"
        ],
        [
          "128",
          "128"
        ]
      ]
    }
  ],
  "output": "Boolean",
  "colour": 210,
  "tooltip": "Do the action every so often",
  "helpUrl": ""
},
{
  "type": "set_math",
  "message0": "Set %1 to %2 %3 %4 %5",
  "args0": [
    {
      "type": "input_value",
      "name": "VARIABLE",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "LEFT",
      "check": "Number"
    },
    {
      "type": "field_dropdown",
      "name": "OPERATION",
      "options": [
        [
          "+",
          "ADD"
        ],
        [
          "-",
          "SUB"
        ],
        [
          "*",
          "MULTIPLY"
        ],
        [
          "/",
          "DIVIDE"
        ],
        [
          "%",
          "MODULO"
        ],
        [
          "random",
          "RANDOM"
        ],
        [
          "AND",
          "AND"
        ],
        [
          "OR",
          "OR"
        ],
        [
          "XOR",
          "XOR"
        ],
        [
          "<<",
          "SHIFTL"
        ],
        [
          ">>",
          "SHIFTR"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "RIGHT",
      "check": "Number"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Set a variable to the result of some math",
  "helpUrl": ""
},
{
  "type": "actor",
  "message0": "Actor %1 %2 Init %3 Run %4",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "default"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "INIT"
    },
    {
      "type": "input_statement",
      "name": "RUN"
    }
  ],
  "colour": 135,
  "tooltip": "Defines an actor",
  "helpUrl": ""
},
{
  "type": "ball_movement",
  "message0": "Ball movement",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Moves forward at an angle",
  "helpUrl": ""
},
{
  "type": "vector_movement",
  "message0": "Vector movement",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Add velocity to the position",
  "helpUrl": ""
},
{
  "type": "eightway_movement",
  "message0": "8-way movement %1 %2 Left %3 %4 Down %5 %6 Up %7 %8 Right",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "LEFT",
      "checked": true
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "DOWN",
      "checked": true
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "UP",
      "checked": true
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "RIGHT",
      "checked": true
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Move in response to the player's presses",
  "helpUrl": ""
},
{
  "type": "property",
  "message0": "This %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          "type",
          "TYPE"
        ],
        [
          "direction",
          "DIRECTION"
        ],
        [
          "speed",
          "SPEED"
        ],
        [
          "x position",
          "XPOS"
        ],
        [
          "y position",
          "YPOS"
        ],
        [
          "x velocity",
          "XVEL"
        ],
        [
          "y velocity",
          "YVEL"
        ],
        [
          "variable 1",
          "VAR1"
        ],
        [
          "variable 2",
          "VAR2"
        ],
        [
          "variable 3",
          "VAR3"
        ],
        [
          "variable 4",
          "VAR4"
        ],
        [
          "x position low",
          "XPOSL"
        ],
        [
          "y position low",
          "YPOSL"
        ],
        [
          "x velocity low",
          "XVELL"
        ],
        [
          "y velocity low",
          "YVELL"
        ]
      ]
    }
  ],
  "output": "Number",
  "colour": 230,
  "tooltip": "Property for this object",
  "helpUrl": ""
},
{
  "type": "other_property",
  "message0": "Other %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "NAME",
      "options": [
        [
          "type",
          "TYPE"
        ],
        [
          "direction",
          "DIRECTION"
        ],
        [
          "speed",
          "SPEED"
        ],
        [
          "x position",
          "XPOS"
        ],
        [
          "y position",
          "YPOS"
        ],
        [
          "x velocity",
          "XVEL"
        ],
        [
          "y velocity",
          "YVEL"
        ],
        [
          "variable 1",
          "VAR1"
        ],
        [
          "variable 2",
          "VAR2"
        ],
        [
          "variable 3",
          "VAR3"
        ],
        [
          "variable 4",
          "VAR4"
        ],
        [
          "x position low",
          "XPOSL"
        ],
        [
          "y position low",
          "YPOSL"
        ],
        [
          "x velocity low",
          "XVELL"
        ],
        [
          "y velocity low",
          "YVELL"
        ]
      ]
    }
  ],
  "output": "Number",
  "colour": 230,
  "tooltip": "Property for other block",
  "helpUrl": ""
},
{
  "type": "win_game",
  "message0": "Win game",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Win the game",
  "helpUrl": ""
},
{
  "type": "lose_game",
  "message0": "Lose game",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Lose the game",
  "helpUrl": ""
},
{
  "type": "destroy",
  "message0": "Destroy",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Destroy the current object",
  "helpUrl": ""
},
{
  "type": "exit",
  "message0": "Exit code",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Stop running this code",
  "helpUrl": ""
},
{
  "type": "target_other",
  "message0": "As other object %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "NAME"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Do these actions as the other object",
  "helpUrl": ""
},
{
  "type": "actor_type",
  "message0": "Actor %1",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "default"
    }
  ],
  "output": "actor_type",
  "colour": 65,
  "tooltip": "Specify an actor type by name",
  "helpUrl": ""
},
{
  "type": "jump_xy",
  "message0": "Jump to %1 %2",
  "args0": [
    {
      "type": "input_value",
      "name": "XPOS"
    },
    {
      "type": "input_value",
      "name": "YPOS"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Jump to a specific location",
  "helpUrl": ""
},
{
  "type": "jump_other",
  "message0": "Jump to other actor",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Jump to the other object",
  "helpUrl": ""
},
{
  "type": "swap_places",
  "message0": "Swap places with other",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Swap positions with another object",
  "helpUrl": ""
},
{
  "type": "destroy_type",
  "message0": "Destroy all %1",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME",
      "check": "actor_type"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Destroy all objects of a given type",
  "helpUrl": ""
},
{
  "type": "stop_moving",
  "message0": "Stop moving",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Clear the speed and velocity",
  "helpUrl": ""
},
{
  "type": "reverse",
  "message0": "Reverse movement",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Turn around",
  "helpUrl": ""
},
{
  "type": "find_type",
  "message0": "Find actor of type %1",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME",
      "check": "actor_type"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Find first actor of a given type",
  "helpUrl": ""
},
{
  "type": "look_xy",
  "message0": "Look towards %1 %2",
  "args0": [
    {
      "type": "input_value",
      "name": "POSX"
    },
    {
      "type": "input_value",
      "name": "POSY"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Look towards a given X and Y",
  "helpUrl": ""
},
{
  "type": "look_other",
  "message0": "Look towards other actor",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Look towards the other actor",
  "helpUrl": ""
},
{
  "type": "create",
  "message0": "Create %1 at %2 %3",
  "args0": [
    {
      "type": "input_value",
      "name": "TYPE",
      "check": "actor_type"
    },
    {
      "type": "input_value",
      "name": "POSX",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "POSY",
      "check": "Number"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Create an actor somewhere",
  "helpUrl": ""
},
{
  "type": "if_find_type",
  "message0": "Actor of type %1 exists",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME",
      "check": "actor_type"
    }
  ],
  "output": "Boolean",
  "colour": 210,
  "tooltip": "Can an actor of a given type be found?",
  "helpUrl": ""
},
{
  "type": "difficulty",
  "message0": "%1 Easy %2 %3 Medium %4 %5 Hard",
  "args0": [
    {
      "type": "field_checkbox",
      "name": "EASY",
      "checked": true
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "MEDIUM",
      "checked": true
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "HARD",
      "checked": true
    }
  ],
  "output": "Boolean",
  "colour": 210,
  "tooltip": "What difficulty is the microgame on?",
  "helpUrl": ""
},
{
  "type": "won_lost",
  "message0": "Game %1 %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "WHEN",
      "options": [
        [
          "has been",
          "HAS_BEEN"
        ],
        [
          "is",
          "IS"
        ]
      ]
    },
    {
      "type": "field_dropdown",
      "name": "WINLOSE",
      "options": [
        [
          "won",
          "WON"
        ],
        [
          "lost",
          "LOST"
        ]
      ]
    }
  ],
  "inputsInline": true,
  "output": "Boolean",
  "colour": 210,
  "tooltip": "Detect game win/loss",
  "helpUrl": ""
},
{
  "type": "keys",
  "message0": "Key %1 %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "KEY",
      "options": [
        [
          "A",
          "A"
        ],
        [
          "B",
          "B"
        ],
        [
          "Left",
          "LEFT"
        ],
        [
          "Down",
          "DOWN"
        ],
        [
          "Up",
          "UP"
        ],
        [
          "Right",
          "RIGHT"
        ],
        [
          "Select",
          "SELECT"
        ]
      ]
    },
    {
      "type": "field_dropdown",
      "name": "STATE",
      "options": [
        [
          "down",
          "DOWN"
        ],
        [
          "pressed",
          "PRESSED"
        ],
        [
          "up",
          "UP"
        ],
        [
          "released",
          "RELEASED"
        ]
      ]
    }
  ],
  "output": "Boolean",
  "colour": 210,
  "tooltip": "Detect the state of a key",
  "helpUrl": ""
},
{
  "type": "touching_type",
  "message0": "Touching actor type %1",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME",
      "check": "actor_type"
    }
  ],
  "output": "Boolean",
  "colour": 210,
  "tooltip": "Is the actor touching an actor of a type?",
  "helpUrl": ""
},
{
  "type": "in_region",
  "message0": "In region %1 %2 to %3 %4",
  "args0": [
    {
      "type": "input_value",
      "name": "XPOS1"
    },
    {
      "type": "input_value",
      "name": "YPOS1"
    },
    {
      "type": "input_value",
      "name": "XPOS2"
    },
    {
      "type": "input_value",
      "name": "YPOS2"
    }
  ],
  "inputsInline": true,
  "output": "Boolean",
  "colour": 210,
  "tooltip": "Is the actor in a given region?",
  "helpUrl": ""
},
{
  "type": "asm_condition",
  "message0": "%1 flags %2",
  "args0": [
    {
      "type": "input_statement",
      "name": "NAME"
    },
    {
      "type": "field_dropdown",
      "name": "FLAGS",
      "options": [
        [
          "eq",
          "eq"
        ],
        [
          "ne",
          "ne"
        ],
        [
          "pl",
          "pl"
        ],
        [
          "mi",
          "mi"
        ],
        [
          "cc",
          "cc"
        ],
        [
          "cs",
          "cs"
        ],
        [
          "vc",
          "vc"
        ],
        [
          "vs",
          "vs"
        ]
      ]
    }
  ],
  "output": "Boolean",
  "colour": 210,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "global",
  "message0": "Global (1-16) %1",
  "args0": [
    {
      "type": "field_number",
      "name": "NUM",
      "value": 1,
      "min": 1,
      "max": 16
    }
  ],
  "output": "Number",
  "colour": 65,
  "tooltip": "Access a global variable",
  "helpUrl": ""
},
{
  "type": "temp",
  "message0": "Temp (1-4) %1",
  "args0": [
    {
      "type": "field_number",
      "name": "NUM",
      "value": 1,
      "min": 1,
      "max": 4
    }
  ],
  "output": null,
  "colour": 65,
  "tooltip": "Access a temporary variable",
  "helpUrl": ""
},
{
  "type": "set_nomath",
  "message0": "Set %1 to %2",
  "args0": [
    {
      "type": "input_value",
      "name": "LEFT",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "RIGHT",
      "check": "Number"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "at_end",
  "message0": "At end of game",
  "output": "Boolean",
  "colour": 210,
  "tooltip": "Triggered at the end of a microgame",
  "helpUrl": ""
},
{
  "type": "game_init_run",
  "message0": "Game %1 Init %2 Run %3",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "INIT"
    },
    {
      "type": "input_statement",
      "name": "RUN"
    }
  ],
  "inputsInline": false,
  "colour": 120,
  "tooltip": "Code for the game itself",
  "helpUrl": ""
},
{
  "type": "play_sfx",
  "message0": "Play sound %1",
  "args0": [
    {
      "type": "input_value",
      "name": "SOUND",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Play a sound effect",
  "helpUrl": ""
},
{
  "type": "sound_effect",
  "message0": "Sound %1",
  "args0": [
    {
      "type": "field_input",
      "name": "SOUND",
      "text": ""
    }
  ],
  "output": "Number",
  "colour": 230,
  "tooltip": "Sound effect",
  "helpUrl": ""
},
{
  "type": "note",
  "message0": "// %1",
  "args0": [
    {
      "type": "field_input",
      "name": "NAME",
      "text": "default"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 20,
  "tooltip": "A comment",
  "helpUrl": ""
}]);