import { InstructionC } from './instructionC.js';
import {Utilities} from './utilities.js';
import {SymbolTable} from './symbolTable.js';

(function () {
	function assemble(asmProgram) {
		var assemblerOutput = '';
		var instC = new InstructionC();
		var utility = new Utilities();
		var symbolTable = new SymbolTable();
		var ROMcounter = 0;
		var RAMcounter = 16;

		// Kreiraj niz od unetih redova podataka
		var instructionArray = asmProgram.split('\n');

		// Prvi prolaz identifikuje labele i dodaje ih u SymbolTable
		instructionArray.forEach(function (instruction) {
			instruction = utility.removeWhitespace(instruction);
			instruction = utility.removeComments(instruction);
			// Ukoliko red ima komentar, samo preskoci
			if (instruction === '') {
				return;
			} else if (utility.commandType(instruction) === 'C' || utility.commandType(instruction) === 'A') {
				// Inkrementiraj pomocu brojaca ROM adresu
				ROMcounter++;
			} else if (utility.commandType(instruction) === 'L') {
				// Dodaj labelu u SymbolTable sa trenutnom ROM adresom
				symbolTable.addEntry(utility.getSymbol(instruction), ROMcounter);
			}
		});

		// Drugim prolazom identifikuj promenljive, dodaj u symbol table, zameni simbole adresama, i prevedi naredbe u masinski kod
		instructionArray.forEach(function (instruction) {
			instruction = utility.removeWhitespace(instruction);
			instruction = utility.removeComments(instruction);
			// Ako je komentar ili labela samo preskoci
			if (instruction === '' || utility.commandType(instruction) === 'L') {
				return;
			} else if (utility.commandType(instruction) === 'A') {
				var AValue = utility.getSymbol(instruction);
				// Ukoliko nije ceo decimalni broj, vec simbol sacuvajte u SymbolTable
				if (!Number.isInteger(parseInt(AValue, 10))) {
					// U slucaju da symbol nije u tabeli, dodajte ga
					if (!symbolTable.contains(AValue)) {
						symbolTable.addEntry(AValue, RAMcounter);
						RAMcounter++;
					}
					// konvertuj iz simbola u adresu
					AValue = symbolTable.getAddress(AValue);
				}
				// convert from decimal to binary representation
				assemblerOutput += utility.getBinary16(AValue) + '\n';
			} else if (utility.commandType(instruction) === 'C') {
				// convert C-instructions to binary representation
				assemblerOutput += instC.getCInstructMachineCode(utility.operationFields(instruction)) + '\n';
			}
		});
		return assemblerOutput.trim();
	};


	var textFile = null,
	// Event koji koristi Blob API za kreiranje download fajla
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


	hackCode.addEventListener('click', function(){
		downloadlink.style.display = 'none';
		create.style.display = 'inline-block';
	},false);
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







