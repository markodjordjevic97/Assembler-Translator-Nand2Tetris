import { InstructionC } from './instructionC.js';
import {Utilities} from './utilities.js';
(function () {
	function assemble(asmProgram) {
		var assemblerOutput = '';
		var instC = new InstructionC();
		var utility = new Utilities();
		var symbolTable = new SymbolTable();
		var ROMcounter = 0;
		var RAMcounter = 16;

		// split program into an array of instructions, one per line
		var instructionArray = asmProgram.split('\n');

		// first pass identifies labels, adds them to symbol table
		instructionArray.forEach(function (instruction) {
			instruction = utility.removeWhitespace(instruction);
			instruction = utility.removeComments(instruction);
			// if this line was empty space or a comment, skip it
			if (instruction === '') {
				return;
			} else if (utility.commandType(instruction) === 'C' || utility.commandType(instruction) === 'A') {
				// increment counter to keep track of ROM addresses
				ROMcounter++;
			} else if (utility.commandType(instruction) === 'L') {
				// add label to symbol table with current ROM address
				symbolTable.addEntry(utility.getSymbol(instruction), ROMcounter);
			}
		});

		// second pass identifies variables, adds them to symbol table, replaces symbols with addresses, and translates operations into machine code
		instructionArray.forEach(function (instruction) {
			instruction = utility.removeWhitespace(instruction);
			instruction = utility.removeComments(instruction);
			// if this line was a full-line comment, empty space, or a label, skip it!
			if (instruction === '' || utility.commandType(instruction) === 'L') {
				return;
			} else if (utility.commandType(instruction) === 'A') {
				var AValue = utility.getSymbol(instruction);
				if (!Number.isInteger(parseInt(AValue, 10))) {
					// if it's a symbol (not a decimal integer), save to symbol table and get its value
					if (!symbolTable.contains(AValue)) {
						// if symbol isn't already in symbol table, add it and increase counter
						symbolTable.addEntry(AValue, RAMcounter);
						RAMcounter++;
					}
					// convert from symbol to address (decimal representation)
					AValue = symbolTable.getAddress(AValue);
				}
				// convert from decimal to binary representation
				assemblerOutput += getBinary16(AValue) + '\n';
			} else if (utility.commandType(instruction) === 'C') {
				// convert C-instructions to binary representation
				assemblerOutput += instC.getCInstructMachineCode(utility.operationFields(instruction)) + '\n';
			}
		});
		function getBinary16 (decimalString) {
			var decimalNum = parseInt(decimalString, 10);
			var binaryString = decimalNum.toString(2);
			if (binaryString.length > 16) {
				// if larger than 16 bits in binary, truncate the string
				return binaryString.slice(0,16);
			}
			// pad with leading zeros if needed
			while (binaryString.length < 16) {
				binaryString = '0' + binaryString;
			}
			return binaryString;
		}
		
		// maps symbols to addresses:
		function SymbolTable() {
			// add symbol/address pair
			this.addEntry = function(symbol, address) {
				this[symbol] = address;
			};
			
			// check if symbol is already in the table
			this.contains = function(symbol) {
				if (this.hasOwnProperty(symbol)) {
					return true;
				} else {
					return false;
				}
			};
			
			// return address of given symbol
			this.getAddress = function(symbol) {
				if (this.contains(symbol)) {
					return this[symbol];
				}
			};
			
			// predefined symbols:
			this['SP'] = 0;
			this['LCL'] = 1;
			this['ARG'] = 2;
			this['THIS'] = 3;
			this['THAT'] = 4;
			this['SCREEN'] = 16384;
			this['KBD'] = 24576;
			
			// predefined symbols R0-R15
			for (var i=0;i<=15;i++) {
				this['R'+i] = i;
			}
		}
		return assemblerOutput.trim();
	};


	var textFile = null,
		makeTextFile = function (text) {
			var podatak = new Blob([text], { type: 'text/plain' });

			// Da bi izbegli curenje memorije, oslobodi prethodnu kreiranu URL adresu
			if (textFile !== null) {
				window.URL.revokeObjectURL(textFile);
			}

			textFile = window.URL.createObjectURL(podatak);

			return textFile;
		};
	// DOM HTML elementima:
	var create = document.getElementById('create'),
		hackCode = document.getElementById('hack_code'),  // textbox
		machineCode = document.getElementById('machine_code'),
		downloadlink = document.getElementById('downloadlink')

	// Event na koji se generise vrednost iz hackCode u Masinski kod 0 i 1
	create.addEventListener('click', function () {
		var assemblerOutput = assemble(hackCode.value);
		machineCode.innerHTML = assemblerOutput;
		machineCode.style.backgroundColor = "rgba(25, 182, 25, 0.8)";
		machineCode.style.color = "#fff5ee";
		machineCode.style.boxShadow = "0px 0px 6px rgba(0, 0, 0, 0.8)";
		// Prosledi kod 0 i 1 funkciji kako bi napravio link za download pomocu Blob()
		downloadlink.href = makeTextFile(assemblerOutput);

		downloadlink.style.display = 'inline-block';
		create.style.display = 'none';
	}, false);

	// Event za reset dugmeta:
	downloadlink.addEventListener('click', function () {
		downloadlink.style.display = 'none';
		create.style.display = 'inline-block';
	}, false);
})();







