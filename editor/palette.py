red = []
green = []
blue = []

with open("palette.pal", "rb") as f:
	for i in range(64):
		red.append(ord(f.read(1)))
		green.append(ord(f.read(1)))
		blue.append(ord(f.read(1)))

print("var palette_red = [")
for i in range(64):
	print('  %d,' % red[i])
print("];")

print("var palette_green = [")
for i in range(64):
	print('  %d,' % green[i])
print("];")

print("var palette_blue = [")
for i in range(64):
	print('  %d,' % blue[i])
print("];")

