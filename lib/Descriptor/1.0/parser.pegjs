{
var sectors = {};
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
}

start = s: Sector* {console.log (sectors);return sectors["generate"][0];}

Sector = nme: Name _ "= " gen: String _{if (!(nme in sectors)) sectors[nme] = []; sectors[nme].push(gen);}

Ref = ("$" / "@") nme: Name {if (!(nme in sectors)) throw new Error("No "+nme+" sector found"); return sectors[nme][getRandomInt(0, sectors[nme].length-1)];}

String = str: (Ref/[A-Za-z0-9"':.,!#%^&*()-_{}=+`~?/ ])+ {return str.join("");}

_  = [ \t\r\n]*

Name = chars: [A-Za-z0-9_]* {return chars.join("");}
