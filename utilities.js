export class Utilities {
    // Obrisi razmake, novi red
    removeWhitespace(str) {
        return str.replace(/\s+/g, '');
    }
    // Obrisi korisnikove komentare
    removeComments(str) {
        return str.replace(/\/\/.*$/g, '');
    }

    // Vrati tip instrukcije
    commandType(str) {
        if (str.charAt(0) === '@') {
            return 'A';
        } else if (str.charAt(0) === '(') {
            return 'L';
        } else {
            return 'C';
        }
    }

    // Vrati vrednost A ili L instrukcije, iseci sve ostale znake
    getSymbol(str) {
        if (this.commandType(str) === 'A') {
            return str.slice(1);
        } else if (this.commandType(str) === 'L') {
            return str.slice(1, -1);
        }
    }

    // takes an instruction string, returns object identifying its fields
    operationFields(str) {
        var fields = {};
        var equalsSplit = str.split(/=/);
        if (equalsSplit.length == 1) {
            // no equal sign, so this is a comp;jump code
            var semicolonSplit = equalsSplit[0].split(/;/);
            fields.comp = semicolonSplit[0];
            fields.jump = semicolonSplit[1];
            fields.dest = null;
        } else if (equalsSplit.length == 2) {
            var semicolonSplit = equalsSplit[1].split(/;/);
            if (semicolonSplit.length == 1) {
                // no semicolon, so this is a dest=comp code
                fields.dest = equalsSplit[0];
                fields.comp = semicolonSplit[0];
                fields.jump = null;
            } else if (semicolonSplit.length == 2) {
                // has equals and semicolon, so this is a dest=comp;jump code
                fields.dest = equalsSplit[0];
                fields.comp = semicolonSplit[0];
                fields.jump = semicolonSplit[1];
            }

        }
        return fields;
    }
}