/*
 * NES Microgame engine editor
 * Copyright 2019 NovaSquirrel
 * 
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */
var VIEW_ACTORS = 0;
var VIEW_PALETTE = 1;
var VIEW_ANIMATION = 2;
var VIEW_BLOCKS = 3;
var VIEW_MAP = 4;
var VIEW_ACTOR_PLACEMENT = 5;
var editor_state = VIEW_PALETTE

function rgb(r, g, b) {
	return 'rgb('+r+','+g+','+b+')';
}

function rgb_nes(i) {
	return rgb(palette_red[i], palette_green[i], palette_blue[i]);
}

function getMousePos(canvas, evt) {
	return {
		x: evt.offsetX,
		y: evt.offsetY
	};
}

// size of an individual palette square on the master NES palette
var palette_unit_w = null, palette_unit_h = null;
// currently selected palette color
var palette_selected = 0;
// background color
var palette_background = 0x21;
// the user's palette values for background and sprites
var palette_values = [[0x0f, 0x00, 0x30],
                      [0x0f, 0x16, 0x30],
                      [0x0f, 0x2a, 0x30],
                      [0x0f, 0x12, 0x30],

                      [0x0f, 0x00, 0x30],
                      [0x0f, 0x16, 0x30],
                      [0x0f, 0x2a, 0x30],
                      [0x0f, 0x12, 0x30]];
function updatePalette() {
	// Render the palette picker
	var canvas = document.getElementById('allcolors');
	var ctx = canvas.getContext("2d");
	palette_unit_w = canvas.width/16;
	palette_unit_h = canvas.height/4;
	for(let i=0; i<64; i++) {
		ctx.fillStyle=rgb_nes(i);
		ctx.fillRect((i&15)*palette_unit_w, (i>>4)*palette_unit_h, palette_unit_w, palette_unit_h);
	}

	// Draw selection rectangle for current palette color
	ctx.beginPath();
	ctx.strokeStyle = rgb(255-palette_red[palette_selected], 255-palette_green[palette_selected], 255-palette_blue[palette_selected]);
	ctx.rect((palette_selected&15)*palette_unit_w, (palette_selected>>4)*palette_unit_h, palette_unit_w-1, palette_unit_h-1);
	ctx.stroke();

	// Background color
	canvas = document.getElementById('bgcolor');
	ctx = canvas.getContext("2d");
	ctx.fillStyle=rgb_nes(palette_background);
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw the eight palettes
	for(let i=0; i<8; i++) {
		canvas = document.getElementById('pal'+i);
		ctx = canvas.getContext("2d");
		for(let j=0; j<3; j++) {
			ctx.fillStyle=rgb_nes(palette_values[i][j]);
			ctx.fillRect(32*j, 0, 32, 32);
		}
	}

	updateTilePicker();
}

var tile_selected = 0;
function updateTilePicker() {
	let pal = parseInt(document.getElementById('tilesetpalette').value);

	// Render the tile picker
	let canvas = document.getElementById('selector');
	let ctx = canvas.getContext("2d");

	for(let i=0; i<512; i++) {
// render normally (not used)
//		renderNESTile(ctx, i, (i&15)<<4, (i&0x1f0), pal, true);
// render for 8x16 mode
		renderNESTile(ctx, i, ((i>>1)&15)<<4, (i&~31)|((i&1)<<4), pal, true);
	}

	ctx.beginPath();
	ctx.strokeStyle = "#ff00ff";
	ctx.rect(( (tile_selected>>1)&15)<<4, (tile_selected&~31)|((tile_selected&1)<<4), 15, 15);
	ctx.stroke();
}

function renderNESTile(ctx, tile, x, y, palette, twice) {
	for(let i=0; i<8; i++) {
		for(let j=0; j<8; j++) {
			let plane1 = (chr_rom[tile*16+0+j] >> (7-i))&1;
			let plane2 = (chr_rom[tile*16+8+j] >> (7-i))&1;
			let color = plane1 | plane2<<1;
			if(color == 0)
				ctx.fillStyle = ctx.fillStyle = rgb_nes(palette_background);
			else
				ctx.fillStyle = rgb_nes(palette_values[palette][color-1]);

			if(twice)
				ctx.fillRect(x+i*2, y+j*2, 2, 2);
			else
				ctx.fillRect(x+i, y+j, 1, 1);
		}
	}
}

function renderNESTile8x16(ctx, tile, x, y, palette, twice) {
	renderNESTile(ctx, tile,   x, y,              palette, twice);
	renderNESTile(ctx, tile+1, x, y+(twice?16:8), palette, twice);
}


function autoBlock() {
	if(tile_selected > 252)
		return;
	document.getElementById('blockul').value = tile_selected+0;
	document.getElementById('blockll').value = tile_selected+1;
	document.getElementById('blockur').value = tile_selected+2;
	document.getElementById('blocklr').value = tile_selected+3;
	updateBlockPreview();
}

var block_list = {
	'empty': {
		'tile': [32, 32, 32, 32],
		'palette': 0,
		'flag': {'solidall': false, 'solidtop': false, 'a': false, 'b': false, 'c': false, 'd': false}
	},
	'wall': {
		'tile': [172, 173, 174, 175],
		'palette': 0,
		'flag': {'solidall': true, 'solidtop': true, 'a': false, 'b': false, 'c': false, 'd': false}
	}
};

function updateBlockList() {
	// Display the list
	var select = document.getElementById("blockedit_select"); 
	while(select.firstChild) {
		select.removeChild(select.firstChild);
	}

	if (Object.keys(block_list).length != 0) {
		for(var i in block_list) {
			el = document.createElement("option");
			el.textContent = i;
			el.value = i;
			select.appendChild(el);
		}
	}
}

function createBlock() {
	let name = document.getElementById('blockname').value;
	if(name == '')
		return;
	let block = {
		'tile': [document.getElementById('blockul').value, document.getElementById('blockll').value, document.getElementById('blockur').value , document.getElementById('blocklr').value],
		'palette': document.getElementById('flagpalette').value,
		'flag': {
			'solidall': document.getElementById('flagsolidall').checked,
			'solidtop': document.getElementById('flagsolidtop').checked,
			'a': document.getElementById('flaga').checked,
			'b': document.getElementById('flagb').checked,
			'c': document.getElementById('flagc').checked,
			'd': document.getElementById('flagd').checked,
		}
	};
	block_list[name] = block;
	updateBlockList();
}

function loadBlock() {
	if (Object.keys(block_list).length == 0)
		return;
	let selected = document.getElementById('blockedit_select').value;
	let block = block_list[selected];

	document.getElementById('blockname').value = selected;
	document.getElementById('blockul').value = block['tile'][0];
	document.getElementById('blockll').value = block['tile'][1];
	document.getElementById('blockur').value = block['tile'][2];
	document.getElementById('blocklr').value = block['tile'][3];
	document.getElementById('flagsolidall').checked = block['flag']['solidall'];
	document.getElementById('flagsolidtop').checked = block['flag']['solidtop'];
	document.getElementById('flaga').checked = block['flag']['a'];
	document.getElementById('flagb').checked = block['flag']['b'];
	document.getElementById('flagc').checked = block['flag']['c'];
	document.getElementById('flagd').checked = block['flag']['d'];
	document.getElementById('flagpalette').value = block['palette'];

	updateBlockPreview();
}

function deleteBlock() {
	if (Object.keys(block_list).length == 0)
		return;
	let selected = document.getElementById('blockedit_select').value;
	if(!confirm('Really delete "'+selected+'"?'))
		return;
	delete block_list[selected];
	updateBlockList();
}

function updateBlockPreview() {
	// Render the tile picker
	let canvas = document.getElementById('blockpreview');
	let ctx = canvas.getContext("2d");
	let pal = parseInt(document.getElementById('flagpalette').value);
	renderNESTile(ctx, parseInt(document.getElementById('blockul').value), 0, 0, pal, true);
	renderNESTile(ctx, parseInt(document.getElementById('blockur').value), 16, 0, pal, true);
	renderNESTile(ctx, parseInt(document.getElementById('blockll').value), 0, 16, pal, true);
	renderNESTile(ctx, parseInt(document.getElementById('blocklr').value), 16, 16, pal, true);
}

var animation_list = {};

function updateAnimationList() {
	// Display the list
	var select = document.getElementById("animation_select"); 
	while(select.firstChild) {
		select.removeChild(select.firstChild);
	}
	if (Object.keys(animation_list).length != 0) {
		for(var i in animation_list) {
			el = document.createElement("option");
			el.textContent = i;
			el.value = i;
			select.appendChild(el);
		}
	}
}

function createAnimation() {
	let name = document.getElementById('animname').value;
	if(name == '')
		return;
	let anim = {
		'length':  document.getElementById('animlength').value,
		'speed':   document.getElementById('animspeed').value,
		'width':   document.getElementById('animwidth').value,
		'height':  document.getElementById('animheight').value,
		'palette': document.getElementById('animpalette').value,
		'frames':  animation_frame.slice(0)
	};
	animation_list[name] = anim;
	updateAnimationList();
}

function loadAnimation() {
	if (Object.keys(animation_list).length == 0)
		return;
	let selected = document.getElementById('animation_select').value;
	let anim = animation_list[selected];

	document.getElementById('animname').value = selected;
	document.getElementById('animlength').value = anim.length;
	document.getElementById('animspeed').value = anim.speed;
	document.getElementById('animwidth').value = anim.width;
	document.getElementById('animheight').value = anim.height;
	document.getElementById('animpalette').value = anim.palette;
	animation_frame = anim.frames.slice(0);
	
	updateAnimFrames();
}

function deleteAnimation() {
	if (Object.keys(animation_list).length == 0)
		return;
	let selected = document.getElementById('animation_select').value;
	if(!confirm('Really delete "'+selected+'"?'))
		return;
	delete animation_list[selected];
	updateAnimationList();
}

function renderAnimFrame(ctx, tile, x, y, w, h, palette) {
	ctx.fillStyle=rgb_nes(palette_background);
	ctx.fillRect(x, y, 32, 32);

	// yes I'm aware I could solve this with a loop
	if(w == 0 && h < 2) {
		renderNESTile8x16(ctx, tile+0, x+8,  y,     palette, true);
	} else if(w == 1 && h < 2) {
		renderNESTile8x16(ctx, tile+0, x+0,  y,     palette, true);
		renderNESTile8x16(ctx, tile+2, x+16, y,     palette, true);
	} else if(w == 2 && h < 2) {
		renderNESTile8x16(ctx, tile+0, x+4,  y+8,   palette, false);
		renderNESTile8x16(ctx, tile+2, x+12, y+8,   palette, false);
		renderNESTile8x16(ctx, tile+4, x+20, y+8,   palette, false);
	} else if(w == 3 && h < 2) {
		renderNESTile8x16(ctx, tile+0, x+0,  y+8,   palette, false);
		renderNESTile8x16(ctx, tile+2, x+8,  y+8,   palette, false);
		renderNESTile8x16(ctx, tile+4, x+16, y+8,   palette, false);
		renderNESTile8x16(ctx, tile+6, x+24, y+8,   palette, false);
	} else if(w == 0) {
		renderNESTile8x16(ctx, tile+0, x+12, y+0,   palette, false);
		renderNESTile8x16(ctx, tile+2, x+12, y+16,  palette, false);
	} else if(w == 1) {
		renderNESTile8x16(ctx, tile+0, x+8,  y,     palette, false);
		renderNESTile8x16(ctx, tile+2, x+16, y,     palette, false);
		renderNESTile8x16(ctx, tile+4, x+8,  y+16,  palette, false);
		renderNESTile8x16(ctx, tile+6, x+16, y+16,  palette, false);
	} else if(w == 2) {
		renderNESTile8x16(ctx, tile+0,  x+4,  y+4,  palette, false);
		renderNESTile8x16(ctx, tile+2,  x+12, y+4,  palette, false);
		renderNESTile8x16(ctx, tile+4,  x+20, y+4,  palette, false);
		renderNESTile8x16(ctx, tile+6,  x+4,  y+20, palette, false);
		renderNESTile8x16(ctx, tile+8,  x+12, y+20, palette, false);
		renderNESTile8x16(ctx, tile+10, x+20, y+20, palette, false);
	} else if(w == 3) {
		renderNESTile8x16(ctx, tile+0,  x+0,  y+0,  palette, false);
		renderNESTile8x16(ctx, tile+2,  x+8,  y+0,  palette, false);
		renderNESTile8x16(ctx, tile+4,  x+16, y+0,  palette, false);
		renderNESTile8x16(ctx, tile+6,  x+24, y+0,  palette, false);
		renderNESTile8x16(ctx, tile+8,  x+0,  y+16, palette, false);
		renderNESTile8x16(ctx, tile+10, x+8,  y+16, palette, false);
		renderNESTile8x16(ctx, tile+12, x+16, y+16, palette, false);
		renderNESTile8x16(ctx, tile+14, x+24, y+16, palette, false);
	}


}

var animation_frame = [0, 0, 0, 0, 0, 0, 0, 0];
function updateAnimFrames() {
	let pal = parseInt(document.getElementById('animpalette').value)+4;
	let w = parseInt(document.getElementById('animwidth').value);
	let h = parseInt(document.getElementById('animheight').value);

	let canvas = document.getElementById('animframes');
	let ctx = canvas.getContext("2d");

	for(let i=0; i<8; i++)
		renderAnimFrame(ctx, animation_frame[i], (i&3)*32, (i&4)*8, w, h, pal);
}


function renderMapBlock(ctx, block, x, y) {
	let pal = block.palette;
	renderNESTile(ctx, block.tile[0], x+0, y+0, pal, false);
	renderNESTile(ctx, block.tile[1], x+0, y+8, pal, false);
	renderNESTile(ctx, block.tile[2], x+8, y+0, pal, false);
	renderNESTile(ctx, block.tile[3], x+8, y+8, pal, false);
}

var block_map = [];
for(let x=0; x<16; x++) {
	block_map[x] = [];
	for(let y=0; y<16; y++) {
		block_map[x][y] = 'empty';
	}
}
var block_map_picked = 0;
var block_map_list = []; // list of all blocks in array form instead of dictionary form
function updateMapBlockPicker() {
	canvas = document.getElementById('map_blocks');
	ctx = canvas.getContext("2d");
	ctx.fillStyle='white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// make a list of all the keys, and display the blocks too
	block_map_list = [];
	let count = 0;
	for(let i in block_list) {
		block_map_list.push(i);
		renderMapBlock(ctx, block_list[i], (count&15)<<4, (count&0xf0));
		count++;
	}

	// the selected block
	ctx.beginPath();
	ctx.strokeStyle = "#ff00ff";
	ctx.rect( (block_map_picked&15)<<4, (block_map_picked&~15), 15, 15);
	ctx.stroke();
} 
function updateMap() {
	let canvas = document.getElementById('map');
	let ctx = canvas.getContext("2d");

	for(let x=0; x<16; x++) {
		for(let y=0; y<15; y++) {
			let block = block_map[x][y];
			if(!(block in block_list)) {
				console.log("Nonexistent block "+block+" on map");
				continue;
			}
			renderMapBlock(ctx, block_list[block], x*16, y*16);
		}
	}
}

var mapDrag = false; // true while the mouse is down
var mapDragX = -1, mapDragY = -1;
function initArt() {
	updatePalette();

	// click event for the color picker
	let canvas = document.getElementById('allcolors');
	canvas.addEventListener('mousedown', function(evt) {
		var pos = getMousePos(canvas, evt);
		if(evt.button == 0) {
			palette_selected = Math.floor(pos.y / palette_unit_h) * 16 + Math.floor(pos.x / palette_unit_w);
			palette_selected &= 63; // keep in range
			if(palette_selected == 0x0d)
				palette_selected = 0x0f;
			updatePalette();
		}
	}, false);

	canvas = document.getElementById('bgcolor');
	canvas.addEventListener('mousedown', function(evt) {
		if(evt.button == 0) {
			palette_background = palette_selected;
		} else if(evt.button == 2) {
			palette_selected = palette_background;
		}
		updatePalette();
	}, false);

	// click events for the 8 palettes
	for(let i=0; i<8; i++) {
		canvas = document.getElementById('pal'+i);
		canvas.addEventListener('mousedown', function(evt) {
			var pos = getMousePos(canvas, evt);
			if(evt.button == 0) {
				palette_values[i][Math.floor(pos.x/32)] = palette_selected;
			} else if(evt.button == 2) {
				palette_selected = palette_values[i][Math.floor(pos.x/32)];
			}
			updatePalette();
		}, false);
	}

	// click event for tile picker
	canvas = document.getElementById('selector');
	canvas.addEventListener('mousedown', function(evt) {
		var pos = getMousePos(canvas, evt);
		if(evt.button == 0) {
			// convert to tile sized chunks
			pos.x = pos.x >> 4;
			pos.y = pos.y >> 4;

			// for 8x16 tiles
			tile_selected = ((pos.x&15)<<1) | (pos.y & 1) | ((pos.y&~1)<<4);

			// for normal 8x8 tiles
			//pos.x | (pos.y <<4);
			tile_selected &= 511;
		}
		updateTilePicker();
	}, false);

	// click event for block preview
	canvas = document.getElementById('blockpreview');
	canvas.addEventListener('mousedown', function(evt) {
		var pos = getMousePos(canvas, evt);
		if(evt.button == 0 && tile_selected < 256) {
			if(pos.x < 16) {
				if(pos.y < 16) {
					document.getElementById('blockul').value = tile_selected;
				} else {
					document.getElementById('blockll').value = tile_selected;
				}
			} else {
				if(pos.y < 16) {
					document.getElementById('blockur').value = tile_selected;
				} else {
					document.getElementById('blocklr').value = tile_selected;
				}
			}
		}
		updateBlockPreview();
	}, false);

	// click event for the animation frame picker
	canvas = document.getElementById('animframes');
	canvas.addEventListener('mousedown', function(evt) {
		var pos = getMousePos(canvas, evt);
		if(evt.button == 0) {
			let index = (pos.y>>5)*4 + (pos.x>>5);
			animation_frame[index & 7] = tile_selected & ~1;
			updateAnimFrames();
		}
		if(evt.button == 2) {
			tile_selected = animation_frame[((pos.y>>5)*4 + (pos.x>>5))&7];
			updateTilePicker();
		}
	}, false);

	// click event for the block picker for the map layout
	canvas = document.getElementById('map_blocks');
	canvas.addEventListener('mousedown', function(evt) {
		var pos = getMousePos(canvas, evt);
		if(evt.button == 0) {
			let index = ((pos.y&0xf0) + (pos.x>>4)) & 63;
			if(block_map_list.length > index)
				block_map_picked = index;
			updateMapBlockPicker();
		}
	}, false);

	// click event for the map layout itself
	canvas = document.getElementById('map');
	canvas.addEventListener('mousedown', function(evt) {
		var pos = getMousePos(canvas, evt);
		pos.x = (pos.x>>4)&15;
		pos.y = (pos.y>>4)&15;
		if(evt.button == 0) {
			let block = block_map_list[block_map_picked];
			block_map[pos.x][pos.y] = block
			let ctx = document.getElementById('map').getContext("2d");
			renderMapBlock(ctx, block_list[block], pos.x<<4, pos.y<<4);
			mapDrag = true;
			mapDragX = pos.x;
			mapDragY = pos.y;
		}
		if(evt.button == 2) {
			for(let i=0; i<block_map_list.length; i++) {
				if(block_map_list[i] == block_map[pos.x][pos.y])
					block_map_picked = i;
			}
			updateMapBlockPicker();
		}
	}, false);
	canvas.addEventListener('mousemove', function(evt) {
		if(mapDrag) {
			var pos = getMousePos(canvas, evt);
			pos.x = (pos.x>>4)&15;
			pos.y = (pos.y>>4)&15;
			if(mapDragX == pos.x && mapDragY == pos.y)
				return;
			mapDragX = pos.x;
			mapDragY = pos.y;
			let block = block_map_list[block_map_picked];
			block_map[pos.x][pos.y] = block
			let ctx = document.getElementById('map').getContext("2d");
			renderMapBlock(ctx, block_list[block], pos.x<<4, pos.y<<4);
		}
	}, false);

	canvas.addEventListener('mouseup', function(evt) {
		mapDrag = false;
	}, false);


	updateBlockList();
	window.setInterval(tickAnimation, 16);
}

let tick_counter = 0;
function tickAnimation() {
	if(editor_state != VIEW_ANIMATION)
		return;

	// draw the animation frame
	let pal = parseInt(document.getElementById('animpalette').value)+4;
	let w = parseInt(document.getElementById('animwidth').value);
	let h = parseInt(document.getElementById('animheight').value);
	let length = [0, 1, 3, 7][parseInt(document.getElementById('animlength').value)]; // number of animation frames
	let speed = parseInt(document.getElementById('animspeed').value)+1; // amount to shift the tick counter
	let canvas = document.getElementById('animpreview');
	let ctx = canvas.getContext("2d");
	renderAnimFrame(ctx, animation_frame[(tick_counter>>speed)&length], 0, 0, w, h, pal);

	tick_counter = (tick_counter+1) & 255;
}

function rightChange() {
	var which = document.getElementById('rightselect').value;
	document.getElementById('rightpalette').style.display = (which == 'palette') ? 'block' : 'none';
	document.getElementById('rightblocks').style.display = (which == 'blocks') ? 'block' : 'none';
	document.getElementById('rightactors').style.display = (which == 'actors') ? 'block' : 'none';
	document.getElementById('rightmap').style.display = (which == 'map' || which=='actorplacement') ? 'block' : 'none';
	document.getElementById('rightanimation').style.display = (which == 'animation') ? 'block' : 'none';
	if(which == 'palette')
		editor_state = VIEW_PALETTE;
	if(which == 'blocks') {
		editor_state = VIEW_BLOCKS;
		updateBlockPreview();
	}
	if(which == 'animation') {
		updateAnimFrames();
	}
	if(which == 'actors')
		editor_state = VIEW_ACTORS;
	if(which == 'map') {
		updateMap();
		updateMapBlockPicker();
		editor_state = VIEW_MAP;
	}
	if(which == 'actorplacement') {
		updateMap();
		updateMapBlockPicker();
		editor_state = VIEW_ACTOR_PLACEMENT;
	}
	if(which == 'animation')
		editor_state = VIEW_ANIMATION;
}
