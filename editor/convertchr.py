print("var chr_rom = [")
with open("../ascii.chr", "rb") as f:
	for i in range(8192):
		print("  %d," % ord(f.read(1)))
print("];")
