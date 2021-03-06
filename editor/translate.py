#
# NES Microgame engine translator
# Copyright 2019 NovaSquirrel
# 
# This software is provided 'as-is', without any express or implied
# warranty.  In no event will the authors be held liable for any damages
# arising from the use of this software.
# 
# Permission is granted to anyone to use this software for any purpose,
# including commercial applications, and to alter it and redistribute it
# freely, subject to the following restrictions:
# 
# 1. The origin of this software must not be misrepresented; you must not
#    claim that you wrote the original software. If you use this software
#    in a product, an acknowledgment in the product documentation would be
#    appreciated but is not required.
# 2. Altered source versions must be plainly marked as such, and must not be
#    misrepresented as being the original software.
# 3. This notice may not be removed or altered from any source distribution.
#
import xml.etree.ElementTree as ET # phone home
import sys

def strip_namespace(tag):
	# change "{whatever}tag" to "tag"
	find = tag.find('}')
	if find >= 0:
		tag = tag[find+1:]
	return tag

class Block(object):
	def __init__(self, block):
		# translate the XML of a block to something I can work with
		tagname = strip_namespace(block.tag)
		if tagname != 'block':
			print("Bad tag, got "+tagname)
			sys.exit()

		# get ready to parse
		self.type = block.attrib['type']
		self.field = {}
		self.statement = {}
		self.value = {}
		self.next = None
		self.mutation = {}

		# iterate over the items inside the block
		for e in block:
			tagname2 = strip_namespace(e.tag)
			if tagname2 == 'field':
				self.field[e.attrib['name']] = e.text
			elif tagname2 == 'statement':
				self.statement[e.attrib['name']] = e[0]
			elif tagname2 == 'value':
				self.value[e.attrib['name']] = e[0]
			elif tagname2 == 'next':
				self.next = e[0]
			elif tagname2 == 'mutation':
				self.mutation = e.attrib

	def translate_value(self, name):
		block = Block(self.value[name])
		if block.type == 'math_number':
			return int(block.field['NUM'])
		elif block.type == 'property':
			return property_list[block.field['NAME']]
		elif block.type == 'other_property':
			return 'other-'+property_list[block.field['NAME']]
		elif block.type == 'global':
			return 'global'+block.field['NUM']
		elif block.type == 'temp':
			return 'temp'+block.field['NUM']
		elif block.type == 'sound_effect':
			return 'sound:'+block.field['SOUND']
		elif block.type == 'actor_type':
			return 'actor:'+block.field['NAME']

#######################################

# should have just made the property block use the right name
property_list = {}

property_list["TYPE"] = 'type'
property_list["DIRECTION"] = 'direction'
property_list["SPEED"] = 'speed'
property_list["XPOS"] = 'x-position'
property_list["YPOS"] = 'y-position'
property_list["XVEL"] = 'x-velocity'
property_list["YVEL"] = 'y-velocity'
property_list["VAR1"] = 'var1'
property_list["VAR2"] = 'var2'
property_list["VAR3"] = 'var3'
property_list["VAR4"] = 'var4'
property_list["XPOSL"] = 'x-position-l'
property_list["YPOSL"] = 'y-position-l'
property_list["XVELL"] = 'x-velocity-l'
property_list["YVELL"] = 'y-velocity-l'

#######################################

conditions = {}

def cnd_if_find_type(block):
	return ['find-type', block.translate_value('NAME')]
conditions['if_find_type'] = cnd_if_find_type

def cnd_at_end(block):
	return ['at-end']
conditions['at_end'] = cnd_at_end

def cnd_every_x_frames(block):
	return ['every-%s-frames' % block.field['FREQUENCY']]
conditions['every_x_frames'] = cnd_every_x_frames

def cnd_difficulty(block):
	allowed = 0
	if block.field['EASY'] == 'TRUE':
		allowed |= 1
	if block.field['MEDIUM'] == 'TRUE':
		allowed |= 2
	if block.field['HARD'] == 'TRUE':
		allowed |= 4
	return ['difficulty', allowed]
conditions['difficulty'] = cnd_difficulty

def cnd_won_lost(block):
	return []
conditions['won_lost'] = cnd_won_lost

def cnd_keys(block):
	if block.field['STATE'] == 'DOWN':
		return ['key-held', 'key:'+block.field['KEY']]
	elif block.field['STATE'] == 'UP':
		return ['not', 'key-held', 'key:'+block.field['KEY']]
	elif block.field['STATE'] == 'PRESSED':
		return ['key-press', 'key:'+block.field['KEY']]
	elif block.field['STATE'] == 'RELEASED':
		return ['key-release', 'key:'+block.field['KEY']]
conditions['keys'] = cnd_keys

def cnd_touching_type(block):
	return ['touching-type', block.translate_value('NAME')]
conditions['touching_type'] = cnd_touching_type

def cnd_in_region(block):
	return ['in-region', block.translate_value('XPOS1'), block.translate_value('YPOS1'), block.translate_value('XPOS2'), block.translate_value('YPOS2')]
conditions['in_region'] = cnd_in_region

def cnd_asm_condition(block):
	# todo
	return []
conditions['asm_condition'] = cnd_asm_condition

def cnd_logic_operation(block):
	return [block.field['OP'].lower(), translate_condition(block.value['A']), translate_condition(block.value['B'])]
conditions['logic_operation'] = cnd_logic_operation

def cnd_logic_compare(block):
	comparisons = {}
	comparisons['EQ'] = '=='
	comparisons['NE'] = '!='
	comparisons['LT'] = '<'
	comparisons['LTE'] = '<='
	comparisons['GT'] = '>'
	comparisons['GTE'] = '>='
	return [block.translate_value('A'), comparisons[block.field['OP']], block.translate_value('B')]
conditions['logic_compare'] = cnd_logic_compare

def cnd_logic_boolean(block):
	if block.field['BOOL'] == 'TRUE':
		return ['always']
	else:
		return ['not', 'always']
conditions['logic_boolean'] = cnd_logic_boolean

def cnd_logic_negate(block):
	return ['not'] + translate_condition(block.value['BOOL'])
conditions['logic_negate'] = cnd_logic_negate

def translate_condition(block):
	block = Block(block)
	if block.type in conditions:
		return conditions[block.type](block)
	else:
		print("Unrecognized condition block: "+block.type)

#######################################

blocks = {}

def blk_assembly(block):
	return ['asm', block.field['instruction']]
blocks['assembly'] = blk_assembly

def blk_set_math(block):
	# should have just directly used the names here too
	operators = {}
	operators['ADD'] = '+'
	operators['SUB'] = '-'
	operators['MULTIPLY'] = '*'
	operators['DIVIDE'] = '/'
	operators['MODULO'] = '%'
	operators['RANDOM'] = 'random'
	operators['AND'] = '&'
	operators['OR'] = '|'
	operators['XOR'] = '^'
	operators['SHIFTL'] = '<<'
	operators['SHIFTR'] = '>>'
	return ['set',
		block.translate_value('VARIABLE'),
		block.translate_value('LEFT'),
		operators[block.field['OPERATION']],
		block.translate_value('RIGHT')]

blocks['set_math'] = blk_set_math

def blk_animation(block):
	flips = 0
	if block.field['XFLIP'] == 'TRUE':
		flips |= 64
	if block.field['YFLIP'] == 'TRUE':
		flips |= 128
	return ['animation', '%s|%d' % (block.field['NAME'], flips)]	
blocks['animation'] = blk_animation

def blk_set_nomath(block):
	return ['set', block.translate_value('LEFT'), block.translate_value('RIGHT')]
blocks['set_nomath'] = blk_set_nomath

def blk_ball_movement(block):
	return ['ball-movement']
blocks['ball_movement'] = blk_ball_movement

def blk_vector_movement(block):
	return ['vector-movement']
blocks['vector_movement'] = blk_vector_movement

def blk_eightway_movement(block):
	allowed = 0
	if block.field['RIGHT'] == 'TRUE':
		allowed |= 1
	if block.field['LEFT'] == 'TRUE':
		allowed |= 2
	if block.field['DOWN'] == 'TRUE':
		allowed |= 4
	if block.field['UP'] == 'TRUE':
		allowed |= 8
	return ['8way-movement', allowed]
blocks['eightway_movement'] = blk_eightway_movement

def blk_win_game(block):
	return ['win-game']
blocks['win_game'] = blk_win_game

def blk_lose_game(block):
	return ['lose-game']
blocks['lose_game'] = blk_lose_game

def blk_destroy(block):
	return ['destroy']
blocks['destroy'] = blk_destroy

def blk_destroy_type(block):
	return ['destroy-type', block.translate_value('NAME')]
blocks['destroy_type'] = blk_destroy_type

def blk_exit(block):
	return ['exit']
blocks['exit'] = blk_exit

def blk_target_other(block):
	#todo
	pass
blocks['target_other'] = blk_target_other

def blk_jump_xy(block):
	return ['jump-to-xy', block.translate_value('XPOS'), block.translate_value('YPOS')]
blocks['jump_xy'] = blk_jump_xy

def blk_jump_other(block):
	return ['jump-to-other']
blocks['jump_other'] = blk_jump_other

def blk_swap_places(block):
	return ['swap-places']
blocks['swap_places'] = blk_swap_places

def blk_stop_moving(block):
	return ['stop']
blocks['stop_moving'] = blk_stop_moving

def blk_reverse(block):
	return ['reverse']
blocks['reverse'] = blk_reverse

def blk_find_type(block):
	return ['find-type', block.translate_value('NAME')]
blocks['find_type'] = blk_find_type

def blk_look_xy(block):
	return ['look_at_point', block.translate_value('XPOS'), block.translate_value('YPOS')]
blocks['look_xy'] = blk_look_xy

def blk_look_other(block):
	return ['look-at-actor']
blocks['look_other'] = blk_look_other

def blk_create(block):
	return ['create', block.translate_value('TYPE'), block.translate_value('POSX'), block.translate_value('POSY')]
blocks['create'] = blk_create

def blk_play_sfx(block):
	return ['play-sound', block.translate_value('SOUND')]
blocks['play_sfx'] = blk_play_sfx

def blk_controls_whileUntil(block):
	# ignore for now
	return []
blocks['controls_whileUntil'] = blk_controls_whileUntil

def blk_note(block):
	return []
blocks['note'] = blk_note

def blk_procedures_callnoreturn(block):
	return ['call', block.mutation['name']]
blocks['procedures_callnoreturn'] = blk_procedures_callnoreturn

def blk_controls_if(block):
	out = {}
	# if IF1 DO1 and so on are present, there's "else if" which should just be a bunch of nested elses
	out['if'] = translate_condition(block.value['IF0'])
	out['then'] = translate_routine(block.statement['DO0'])
	if 'ELSE' in block.statement:
		out['else'] = translate_routine(block.statement['ELSE'])
	return out
blocks['controls_if'] = blk_controls_if

def translate_instruction(block):
	if block.type in blocks:
		return blocks[block.type](block)
	else:
		print("Unrecognized block "+block.type)
		sys.exit()

#######################################

def translate_routine(routine):
	out = []

	# convert the weird linked list thing to an array
	while routine != None:
		block = Block(routine)
		out.append(translate_instruction(block))
		routine = block.next
	return out

def translate_xml(filename):
	tree = ET.parse(filename)
	root = tree.getroot()

	out = {'game': {}, 'actors': {}, 'subroutines': {}}

	for e in root:
		block = Block(e)
		if block.type == 'actor':
			actorname = block.field['NAME']
			out['actors'][actorname] = {}

			if 'RUN' in block.statement:
				out['actors'][actorname]['run'] = translate_routine(block.statement['RUN'])
			if 'INIT' in block.statement:
				out['actors'][actorname]['init'] = translate_routine(block.statement['INIT'])			
		elif block.type == 'game_init_run':
			if 'RUN' in block.statement:
				out['game']['run'] = translate_routine(block.statement['RUN'])
			if 'INIT' in block.statement:
				out['game']['init'] = translate_routine(block.statement['INIT'])
		elif block.type == 'procedures_defnoreturn':
			out['subroutines'][block.field['NAME']] = translate_routine(block.statement['STACK'])
		elif block.type == 'game_info':
			out['game']['name'] = block.field['NAME']
			out['game']['instruction'] = block.field['INSTRUCTION']
			out['game']['length'] = 8 if (block.field['LONG'] == 'TRUE') else 4
		else:
			print("Unexpected block? "+block.type)

	print(out)

translate_xml('microgame.xml')

