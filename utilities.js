export class Utilities {
    // Obrisi korisnikove razmake
    removeWhitespace(str) {
        return str.replace(/\s+/g, '');
    }
    // Obrisi korisnikove komentare
    removeComments(str) {
        return str.replace(/\/\/.*$/g, '');
    }

    // Vrati tip instrukcije ili labelu
    commandType(str) {
        if (str.charAt(0) === '@') {
            return 'A';
        } else if (str.charAt(0) === '(') {
            return 'L';
        } else {
            return 'C';
        }
    }

    // Vrati vrednost A ili L instrukcije
    getSymbol(str) {
        if (this.commandType(str) === 'A') {
            return str.slice(1); // izbaci @
        } else if (this.commandType(str) === 'L') {
            return str.slice(1, -1); // izbaci () kod labela
        }
    }

    // uhvati uneseni string, i vrati objekat C instrukcije sa njegovim poljima
    // dest = comp; jump
    operationFields(str) {
        var fields = {};
        var equalsSplit = str.split(/=/);
        if (equalsSplit.length == 1) {
            // nema znaka jednakosti, onda je comp=jmp,   primer: 0; JMP
            var semicolonSplit = equalsSplit[0].split(/;/);
            fields.comp = semicolonSplit[0];
            fields.jump = semicolonSplit[1];
            fields.dest = null;
        } else if (equalsSplit.length == 2) {
            var semicolonSplit = equalsSplit[1].split(/;/);
            if (semicolonSplit.length == 1) {
                // nema ; , onda je dest=comp,        primer: D = -1
                fields.dest = equalsSplit[0];
                fields.comp = semicolonSplit[0];
                fields.jump = null;
            } else if (semicolonSplit.length == 2) {
                // cela C instrukcija,               primer: D-1; JEQ
                fields.dest = equalsSplit[0];
                fields.comp = semicolonSplit[0];
                fields.jump = semicolonSplit[1];
            }
        }
        return fields;
    }

    // Metoda za pretvaranje unosa u decimalni broj, potom u binarni broj i heksadecimalni
    getBinary16 (decimalString) {
        var decimalNum = parseInt(decimalString, 10); 
        var binaryString = decimalNum.toString(2);
        if (binaryString.length > 16) {
            return binaryString.slice(0,16);
        }
        while (binaryString.length < 16) {
            binaryString = '0' + binaryString;
        }
        return binaryString;
    }
}