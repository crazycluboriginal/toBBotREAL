{ pkgs }: {
	deps = [
   pkgs.gotools
   pkgs.killall
		pkgs.nodejs-12_x
		pkgs.nodePackages.typescript-language-server
		pkgs.yarn
		pkgs.replitPackages.jest
	];
}