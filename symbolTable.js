export function SymbolTable() {
    // dodaj simbol u tabelu
    this.addEntry = function (symbol, address) {
        this[symbol] = address;
    };

    // proveri da li simbol postoji
    this.contains = function (symbol) {
        if (this.hasOwnProperty(symbol)) {
            return true;
        } else {
            return false;
        }
    };

    // vrati adresu prosledjenog simbola
    this.getAddress = function (symbol) {
        if (this.contains(symbol)) {
            return this[symbol];
        }
    };
    // Predefinisani simboli
    this['SP'] = 0;
    this['LCL'] = 1;
    this['ARG'] = 2;
    this['THIS'] = 3;
    this['THAT'] = 4;
    this['SCREEN'] = 16384;
    this['KBD'] = 24576;
    for (var i = 0; i <= 15; i++) {
        this['R' + i] = i;
    }
}