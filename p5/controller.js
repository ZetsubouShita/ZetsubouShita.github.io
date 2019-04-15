/* Created 3/5/2019 by Jason Clemens
	 Modified 3/5/2019 by Sean Edwards
*/

var DISPLAY_WIDTH = 19;

//Controler Variables
var enteringValue = "0";
var previousValue = 0;
var nextOp;
var opPressedLast = false;
var eqPressedLast = false;
var mem = 0;

//Modal variables
var calculatorHistory = []; // holds the history of user inputs in calculator
var lastOpClicked;
var lastOpSymbol;

//UI variables
var fullDisplayString = "0";
var enterKeyDown = false;
var showsAc = true;

/* ===== VIEW ===== */

/*
	Created 3/18/2019 Jianyi Qian
	Modifed 3/20/2019 Ryan Williamson wired up more buttons
	Modified 3/21/2019 by Sean Edwards wired a couple more buttons.
*/
window.onload = function () {
	resizeListener();
	addEventListener("resize", resizeListener);
	document.getElementById("themeSelect").addEventListener("change", changeThemeToSelected);
	changeThemeToSelected();
	addEventListener("keydown", keyboardListener);
	addEventListener("keyup", keyupListener);

  /*
	  numbers
  */

	document.getElementById("zero").addEventListener("click", function () { numBtnClicked(0); });
	document.getElementById("one").addEventListener("click", function () { numBtnClicked(1); });
	document.getElementById("two").addEventListener("click", function () { numBtnClicked(2); });
	document.getElementById("three").addEventListener("click", function () { numBtnClicked(3); });
	document.getElementById("four").addEventListener("click", function () { numBtnClicked(4); });
	document.getElementById("five").addEventListener("click", function () { numBtnClicked(5); });
	document.getElementById("six").addEventListener("click", function () { numBtnClicked(6); });
	document.getElementById("seven").addEventListener("click", function () { numBtnClicked(7); });
	document.getElementById("eight").addEventListener("click", function () { numBtnClicked(8); });
	document.getElementById("nine").addEventListener("click", function () { numBtnClicked(9); });
  /*
	  operation.
  */
	document.getElementById("clear").addEventListener("click", allClear);
	document.getElementById("ms").addEventListener("click", function () { memBtnClicked('ms'); });
	document.getElementById("mr").addEventListener("click", function () { memBtnClicked('mr'); });
	document.getElementById("mp").addEventListener("click", function () { memBtnClicked('mp'); });
	document.getElementById("mc").addEventListener("click", function () { memBtnClicked('mc'); });
	document.getElementById("modulo").addEventListener("click", function () { opBtnClicked('modulo'); });
	document.getElementById("factorial").addEventListener("click", function () { opBtnClicked('factorial'); });
	document.getElementById("division").addEventListener("click", function () { opBtnClicked('division'); });
	document.getElementById("multiplication").addEventListener("click", function () { opBtnClicked('multiplication'); });
	document.getElementById("subtraction").addEventListener("click", function () { opBtnClicked('subtraction'); });
	document.getElementById("addition").addEventListener("click", function () { opBtnClicked('addition'); });
	document.getElementById("square").addEventListener("click", function () { opBtnClicked('square'); });
	document.getElementById("dot").addEventListener("click", decimalClicked);
	document.getElementById("negate").addEventListener("click", function () { opBtnClicked('negate'); });
	document.getElementById("equal").addEventListener("click", equals);
	document.getElementById("sqrt").addEventListener("click", function () { opBtnClicked('sqrt'); });
	document.getElementById("cubrt").addEventListener("click", function () { opBtnClicked('cubrt'); });
	document.getElementById("recip").addEventListener("click", function () { opBtnClicked('recip'); });
	document.getElementById("powerten").addEventListener("click", function () { opBtnClicked('powerten'); });
	document.getElementById("cube").addEventListener("click", function () { opBtnClicked('cube'); });
	document.getElementById("xtoy").addEventListener("click", function () { opBtnClicked('xtoy'); });
	document.getElementById("e_power").addEventListener("click", function () { opBtnClicked('e_power'); });
	document.getElementById("nroot").addEventListener("click", function () { opBtnClicked('nroot'); });
	document.getElementById("natlog").addEventListener("click", function () { opBtnClicked('natlog'); });
	document.getElementById("logten").addEventListener("click", function () { opBtnClicked('logten'); });
	document.getElementById("e").addEventListener("click", function () { opBtnClicked('e'); });
	document.getElementById("sin").addEventListener("click", function () { opBtnClicked('sin'); });
	document.getElementById("cos").addEventListener("click", function () { opBtnClicked('cos'); });
	document.getElementById("tan").addEventListener("click", function () { opBtnClicked('tan'); });
	document.getElementById("ee").addEventListener("click", eeClicked);
	document.getElementById("pi").addEventListener("click", function () { opBtnClicked('pi'); });
	document.getElementById("invsin").addEventListener("click", function () { opBtnClicked('invsin'); });
	document.getElementById("invcos").addEventListener("click", function () { opBtnClicked('invcos'); });
	document.getElementById("invtan").addEventListener("click", function () { opBtnClicked('invtan'); });
	//document.getElementById("decimalToBinary").addEventListener("click", function () { opBtnClicked('decimalToBinary'); });
	//document.getElementById("binaryToDecimal").addEventListener("click", function () { opBtnClicked('binaryToDecimal'); });
	//document.getElementById("decimalToHex").addEventListener("click", function () { opBtnClicked('decimalToHex'); });
	//document.getElementById("decimalToOctal").addEventListener("click", function () { opBtnClicked('decimalToOctal'); });

	/*
		factorial, modulo, division, multiplication, subtraction, addition, square, negate, sqrt, cubrt, recip, powerten, cube, xtoy,
		e_power, nroot, natlog, logten, e, sin, cos, tan, pi, invsin, invcos, invtan, decimalToBinary, binaryToDecimal,
		decimalToHex, decimalToOctal
	*/

};

function resizeListener() {
	var oldWidth = DISPLAY_WIDTH;
	DISPLAY_WIDTH = Math.floor(document.getElementById("view").offsetWidth / 25);
	if (DISPLAY_WIDTH != oldWidth) {
		updateView(fullDisplayString);
	}
}

/*
  Created 3/10/2019 by Jianyi Qian
  Modified 3/19/2019 Jason Clemens changed from buttons to <select> element
  This function changes the theme
*/
function changeThemeToSelected() {
	var selector = document.getElementById("themeSelect");
	var newColors = selector.options[selector.selectedIndex].value;
	document.getElementById("colors").href = newColors;
}

/*
	Created  3/5/2019 by Jason Clemens
	Modifed 3/5/2019 by Ryan Williamson added decimal 0 padding functionality
	Modified 3/19/2019 Jason Clemens Redesigned to work with numbers and strings
	Modified 3/20/2019 Jason Clemens Improved formatting of very large and very small numbers
	Modified 3/21/2019 Jianyi Qian modified to support binary convertor page
*/
function updateView(newnumber) {
  if (typeof newnumber == "number") {
    var formatted = newnumber.toString();
    fullDisplayString = formatted;
    if (formatted.length > DISPLAY_WIDTH) {
      //Number is too big to fit in display.
      if (!formatted.includes("E")) {
        formatted = newnumber.toExponential();
        formatted = formatted.replace("e", "E");
      }
      //Fit scientific notation perfectly in display
      var pieces = formatted.split("E");
      formatted = pieces[1];
      if (formatted.startsWith("+")) {
        formatted = formatted.substring(1);
      }
      formatted = "E" + formatted;
      formatted = pieces[0].substring(0, DISPLAY_WIDTH - formatted.length) + formatted;
    }
    newnumber = formatted;
  }
  else {
    fullDisplayString = newnumber;
  }
	document.getElementById("view").innerText = newnumber.substring(newnumber.length - DISPLAY_WIDTH);

	/*
	work for binary convertor function
	*/
	var conterBtn = document.getElementById("convertbtn");
	console.log(fullDisplayString);
	if(Number(fullDisplayString)>0){
		conterBtn.addEventListener("click",function(){convert(Number(fullDisplayString));});
	}else{
		conterBtn.addEventListener("click",function(){convert(0);});
	}
}

/*
  Created 3/21/2019 Jason Clemens
    Access what is being displayed to the user.
*/
function getView() {
	return fullDisplayString;
}

/*
  Created 3/21/2019 Jason Clemens
    Change AC button to AC or C
    param: true -> AC, else -> C
*/
function setAc(ac) {
	if (ac != showsAc) {
		showsAc = ac;
		if (ac) {
			document.getElementById("clear").innerText = "AC";
		}
		else {
			document.getElementById("clear").innerText = "C";
		}
	}
}

/*
  Created 3/21/2019 Jason Clemens
    Sets a button's class to keypressed if it matches the keycode and hl is true. if hl is false, the keypressed state will be removed.
*/
function highlightKey(keycode, hl) {
	var cl = "button";
	if (hl) {
		cl += " keypressed";
	}
	switch (keycode) {
		case "0": document.getElementById("zero").className = cl; break;
		case "1": document.getElementById("one").className = cl; break;
		case "2": document.getElementById("two").className = cl; break;
		case "3": document.getElementById("three").className = cl; break;
		case "4": document.getElementById("four").className = cl; break;
		case "5": document.getElementById("five").className = cl; break;
		case "6": document.getElementById("six").className = cl; break;
		case "7": document.getElementById("seven").className = cl; break;
		case "8": document.getElementById("eight").className = cl; break;
		case "9": document.getElementById("nine").className = cl; break;
		case ".": document.getElementById("dot").className = cl; break;
		case "subtract": document.getElementById("subtraction").className = cl; break;
		case "negate": document.getElementById("negate").className = cl; break;
		case "-": document.getElementById("subtraction").className = "button";
			document.getElementById("negate").className = "button";
			break;
		case "e": document.getElementById("ee").className = cl; break;
		case "p": document.getElementById("pi").className = cl; break;
		case "/": document.getElementById("division").className = cl; break;
		case "*":
		case "x": document.getElementById("multiplication").className = cl; break;
		case "+": document.getElementById("addition").className = cl; break;
		case "=":
		case "Enter": document.getElementById("equal").className = cl; break;
		case "%": document.getElementById("modulo").className = cl; break;
		case "c": document.getElementById("clear").className = cl; break;
	}
}

/* ===== CONTROLLER ===== */

function keyboardListener(e) {
	if (e.key != "-") {
		highlightKey(e.key, true);
	}
	switch (e.key) {
		case "0":
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
			numBtnClicked(e.key);
			break;
		case ".":
			decimalClicked();
			break;
		case "-":
			if (enteringValue == "0" || enteringValue == "-0") {
				opBtnClicked("negate");
				highlightKey("negate", true);
			} else {
				opBtnClicked("subtraction");
				highlightKey("subtract", true);
			}
			break;
		case "e":
			eeClicked();
			break;
		case "p":
			insertValue(pi_value());
			break;
		case "/":
			opBtnClicked("division");
			break;
		case "*":
		case "x":
			opBtnClicked("multiplication");
			break;
		case "+":
			opBtnClicked("addition");
			break;
		case "=":
		case "Enter":
			enterKeyDown = true;
			equals();
			break;
		case "%":
			opBtnClicked("modulo");
			break;
		case "Backspace":
			enteringValue = enteringValue.substring(0, enteringValue.length - 1);
			if (enteringValue === "" || enteringValue == "-") {
				enteringValue = 0;
			}
			updateView(enteringValue);
			break;
		case "c":
			allClear();
			break;
	}
}

function keyupListener(e) {
	if (e.key == "Enter") {
		enterKeyDown = false;
	}
	highlightKey(e.key, false);
}

/*
	Created 3/5/2019 by Jason Clemens
	Modified 3/5/2019 by Ryan Williamson Added the ability to handle more than 1 digit and decimals
	Modified 3/19/2019 by Jason Clemens changed to string representation.
*/
function numBtnClicked(num) {
	if (enterKeyDown) {
		return;
	}
	if (opPressedLast) {
		enteringValue = "";
	}
	if (eqPressedLast) {
	  nextOp = undefined;
	}
	setAc(false);
	opPressedLast = false;
	if (enteringValue == "0") {
		enteringValue = num.toString();
	}
	else if (enteringValue == "-0") {
		enteringValue = "-" + num.toString();
	}
	else {
		enteringValue = enteringValue + num.toString();
	}
	updateView(enteringValue);
	eqPressedLast = false;
}
/*
	Created 3/5/2019 by Ryan Williamson
	Modifed 3/5/2019 by Ryan Williamson fixed a bug that would happen
	when the decimal button was clicked twice
	The method toggles whether or not you are entering past the decimal point
	Modified 3/19/2019 Jason Clemens switched to string representation.
*/
function decimalClicked() {
	if (enterKeyDown) {
		return;
	}
	if (!(enteringValue.includes(".") || enteringValue.includes("E"))) {
		enteringValue = enteringValue + ".";
	}
	updateView(enteringValue);
	setAc(false);
	opPressedLast = false;
	if (eqPressedLast) {
	  nextOp = undefined;
	}
	eqPressedLast = false;
}

/*
  Created 3/20/2019 Jason Clemens
  Call this function when ee is clicked.
*/
function eeClicked() {
  if (enterKeyDown) {
    return;
  }
  if (enteringValue == "0") {
    enteringValue = "E";
  }
  else if (!enteringValue.includes("E")) {
    enteringValue = enteringValue + "E";
  }
  updateView(enteringValue);
  setAc(false);
  opPressedLast = false;
  if (eqPressedLast) {
	  nextOp = undefined;
	}
  eqPressedLast = false;
}

/*
	Created 3/5/2019 by Ryan Williamson
	resets calculator state
	Updated 3/19/2019 Jason Clemens switched to string representation
	Upadted 3/21/2019 Jason Clemens Added different states
*/
function allClear() {
  if (enterKeyDown) {
    return;
  }
  if (showsAc) {
	  enteringValue = "0";
    previousValue = 0;
    nextOp = undefined;
    opPressedLast = false;
    eqPressedLast = false;
    updateView("0");
  }
  else {
    enteringValue = "0";
    if (eqPressedLast) {
	    nextOp = undefined;
	  }
    eqPressedLast = false;
    updateView("0");
    setAc(true);
  }
}

/*
	Created  3/5/2019 by Jason Clemens
	Modifed 3/20/2019 by Ryan Williamson wired up more buttons
	Modified 3/20/2019 by Chandler Gerstenslager to accomodate corresponding operation symbols for modal
	Modified 3/21/2019 by Sean Edwards tied in some of the button features with button presses.
*/
function opBtnClicked(name) {
	lastOpClicked = name;
	if (enterKeyDown) {
		return;
	}
	setAc(false);
	switch (name) {
		case "factorial":
			handleUnaryOp(factorial);
			break;
		case "negate": //Special case: Has more to do with number entry than operations
			if (enteringValue.startsWith("-")) {
				enteringValue = enteringValue.substring(1);
			}
			else {
				enteringValue = "-" + enteringValue;
			}
			updateView(enteringValue);
			eqPressedLast = false;
			break;
		case "modulo":
			//Here is an example of how we handle dual operand operations
			//modulo(num, modulus) is a function defined in the model.
			handleBinaryOp(modulo);
			lastOpSymbol = "%";
			break;
		case "square":
			//Here is an example of how we handle single operand operations
			//square(num) is a function defined in the model.
			handleUnaryOp(square);
			lastOpSymbol = "^";
			break;
		case "sqrt":
			handleUnaryOp(square_root);
			break;
		case "addition":
			handleBinaryOp(plus);
			lastOpSymbol = "+";
			break;
		case "subtraction":
			if (enteringValue.endsWith("E")) {
				enteringValue = enteringValue + "-";
			} else if ((enteringValue == "0" || enteringValue == "-0") && !opPressedLast) {
				opBtnClicked("negate");
			}
			else {
				handleBinaryOp(minus);
			}
			lastOpSymbol = "-";
			break;
		case "multiplication":
			handleBinaryOp(times);
			lastOpSymbol = '\u00D7';
			break;
		case "division":
			handleBinaryOp(divide);
			lastOpSymbol = '\u00F7';
			break;
		case "cubrt":
			handleUnaryOp(cube_root);
			break;
		case "recip":
			handleUnaryOp(one_fraction);
			break;
		case "powerten":
			handleUnaryOp(ten_power);
			break;
		case "xtoy":
			handleBinaryOp(power);
			lastOpSymbol = "^";
			break;
		case "e_power":
			handleUnaryOp(e_power);
			lastOpSymbol = "-";
			break;
		case "cube":
			handleUnaryOp(cube);
			lastOpSymbol = "^";
			break;
		case "nroot":
			handleBinaryOp(n_root);
			lastOpSymbol = "";
			break;
		case "natlog":
			handleUnaryOp(natural_log);
			lastOpSymbol = "-";
			break;
		case "logten":
			handleUnaryOp(log_ten);
			lastOpSymbol = "-";
			break;
		case "e":
			insertValue(e_value());
			break;
		case "sin":
			handleUnaryOp(sine);
			lastOpSymbol = "sin";
			break;
		case "cos":
			handleUnaryOp(cosine);
			lastOpSymbol = "cos";
			break;
		case "tan":
			handleUnaryOp(tangent);
			lastOpSymbol = "tan";
			break;
		case "pi":
			insertValue(pi_value());
			lastOpSymbol = "-";
			break;
		case "invsin":
			handleUnaryOp(inverseSine);
			lastOpSymbol = "-";
			break;
		case "invcos":
			handleUnaryOp(inverseCosine);
			lastOpSymbol = "-";
			break;
		case "invtan":
			handleUnaryOp(inverseTangent);
			lastOpSymbol = "-";
			break;
		case "decimalToBinary":
			handleUnaryOp(decimal_to_binary);
			lastOpSymbol = "-";
			break;
		case "binaryToDecimal":
			handleUnaryOp(binary_to_decimal);
			lastOpSymbol = "-";
			break;
		case "decimalToHex":
			handleUnaryOp(decimal_to_Hex);
			lastOpSymbol = "-";
			break;
		case "decimalToOctal":
			handleUnaryOp(decimal_to_Octal);
			lastOpSymbol = "-";
			break;
	}
}

/*
  Created 3/21/2019 Jason Clemens
  Handles MS, MR, and M+ button presses (pass name of button in)
*/
function memBtnClicked(code) {
  if (enterKeyDown) {
    return;
  }
  switch (code) {
    case "ms":
      mem = Number(getView());
      opPressedLast = true;
      break;
    case "mr":
      insertValue(mem);
      break;
    case "mp":
      mem = mem + Number(getView());
      break;
    case "mc":
      mem = 0;
      break;
  }
  if (eqPressedLast) {
	  nextOp = undefined;
	}
  eqPressedLast = false;
}

/*
  Created 3/20/2019 Jason Clemens
  Overwrite the user's current input with a new value.
 */
function insertValue(newnum) {
  setAc(false);
  enteringValue = newnum.toString();
  updateView(enteringValue);
  opPressedLast = true;
  if (eqPressedLast) {
	  nextOp = undefined;
	}
  eqPressedLast = false;
}

/*
  Created 3/19/2019 Jason Clemens
  When a single operand function's button is pressed, call this function, passing in a function that takes in one operand and returns the mathematical result.
	Modified 3/21/2019 Chandler Gerstenslager - collects data for modal information
*/
function handleUnaryOp(modelFunc) {
	enteringValue = getView();

	//console.log("entering value: " + enteringValue);
	var previousEntry = enteringValue;
	opPressedLast = true;
	enteringValue = modelFunc(Number(enteringValue)).toString();
	//console.log("new entering value: " + enteringValue);
	modalHistoryUnary(previousEntry, lastOpClicked, enteringValue);
	updateView(enteringValue);
	if (eqPressedLast) {
	  nextOp = undefined;
	}
	eqPressedLast = false;
}

/*
  Created 3/19/2019 Jason Clemens
  When a double operand function's button is pressed, call this function, passing in a function that takes in two operands and returns the mathematical result.
*/
function handleBinaryOp(modelFunc) {
	if (nextOp === undefined) {
		previousValue = Number(enteringValue);
		enteringValue = "0";
		nextOp = modelFunc;
		opPressedLast = true;
	}
	else if (opPressedLast) {
		nextOp = modelFunc;
		enteringValue = previousValue.toString();
	}
	else {
		//Implicit equals
		if (!eqPressedLast) {
		  previousValue = equals();
		}
		enteringValue = "0";
		nextOp = modelFunc;
		opPressedLast = true;
	}
	eqPressedLast = false;
}

/*
	Created 3/5/2019 by Jason Clemens
	Modifed 3/6/2019 by Ryan Williamson - Filled in the method stub with real functionality
	Handle presses of equals
	Modified 3/19/2019 by Jason Clemens - Made behavior consistent with definitions in behaviorDef.html
	Modified 3/20/2020 by Chandler Gerstenslager - added modal functionality
*/
function equals() {
	var firstValue = previousValue;
	var secondValue = Number(enteringValue);
	var operation = lastOpSymbol;
	if (nextOp === undefined) {
	  console.log("nextOp undefined");
		var result = Number(enteringValue);
		updateView(result);
		//enteringValue = "0";
		opPressedLast = true;
		return result;
	}
	opPressedLast = true;
	console.log("op(" + previousValue + ", " + enteringValue +")");
	previousValue = nextOp(previousValue, Number(enteringValue));
	updateView(previousValue);
	console.log("=> " + previousValue);
	var calculation = previousValue;
	modalHistory(firstValue, operation, secondValue, calculation);
	eqPressedLast = true;
	return previousValue;
}

/* ===== MODEL ===== */


/*
Created 3/19/2019 by Jason Clemens
Function to return the modulus of two numbers
@REQUIRES num
  Any number to take the modulus of
@REQUIRES modulus
  A number to use as the modulus
@RETURNS
  The num % modulus.
*/
function modulo(num, modulus) {
	return num % modulus;
}

function plus(n1, n2) {
	return n1 + n2;
}

function divide(n1, n2) {
	return n1 / n2;
}

function times(n1, n2) {
	return n1 * n2;
}

function minus(n1, n2) {
	return n1 - n2;
}

/*
Created 3/5/2019 by Sean Edwards
Function to square a number value and return said squared value.
@REQUIRES num
	An integer or decimal value to be squared.
@RETURNS
	The squared value.
*/
function square(num) {
	return (Math.pow(num, 2));
}

/*
Created 3/5/2019 by Sean Edwards
Function to cube a number value and return said cubed value.
@REQUIRES num
	An integer or decimal value to be cubed.
@RETURNS
	The cubed value.
*/
function cube(num) {
	return (Math.pow(num, 3));
}

/*
Created 3/20/2019 by Sean Edwards
Function to take the natural log a number value and return the result.
@REQUIRES num
	An integer or decimal value.
@RETURNS
	The natural log of num.
*/
function natural_log(num) {
	if (num <= 0) {
		return "Error";
	}
	return Math.log(num);
}
/*
Created 3/20/2019 by Sean Edwards
Function to take the log base ten a number value and return the result.
@REQUIRES num
	An integer or decimal value.
@RETURNS
	The log base ten of num.
*/
function log_ten(num) {
	if (num <= 0) {
		return "Error";
	}
	return Math.log10(num);
}

/*
Created 3/5/2019 by Ryan Williamson
Function to take a number in radians and return the sine of the number
@REQUIRES num
	An integer or decimal value in radians
@RETURNS
	The sine of num.
*/
function sine(num) {
	//console.log(num);
	//console.log(Math.sin(num));
	return Math.sin(num);
}

/*
Created 3/5/2019 by Ryan Williamson
Function to take a number in radians and return the cosine of the number
@REQUIRES num
	An integer or decimal value in radians
@RETURNS
	The cosine of num.
*/
function cosine(num) {
	return Math.cos(num);
}

/*
Created 3/5/2019 by Ryan Williamson
Function to take a number in radians and return the tangent of the number
@REQUIRES num
	An integer or decimal value in radians
@RETURNS
	The tangent of num.
*/
function tangent(num) {
	return Math.tan(num);
}
/*
Created 3/5/2019 by Ryan Williamson
Modifed 3/21/2019 by Ryan Williamson added boundary checks
Function to take a number in radians and return the inverse sine of the number
@REQUIRES num
	An integer or decimal value in radians
@RETURNS
	The inverse sine of num.
*/
function inverseSine(num) {
	if (num <= 1 && num >= -1) {
		return Math.asin(num);
	} else {
		return "Error";
	}
}
/*
Created 3/5/2019 by Ryan Williamson
Modifed 3/21/2019 by Ryan Williamson added boundary checks
Function to take a number in radians and return the inverse cosine of the number
@REQUIRES num
	An integer or decimal value in radians
@RETURNS
	The inverse cosine of num.
*/
function inverseCosine(num) {
	if (num <= 1 && num >= -1) {
		return Math.acos(num);
	} else {
		return "Error";
	}

}
/*
Created 3/5/2019 by Ryan Williamson
Function to take a number in radians and return the inverse tangent of the number
@REQUIRES num
	An integer or decimal value in radians
@RETURNS
	The inverse cosine of num.
*/
function inverseTangent(num) {
	return Math.atan(num);
}
// Created 3/5/2019 by Ryan Williamson
// converts num from degrees to radians
function degreesToRadians(num) {
	return (num / 180) * Math.PI;
}
// Created 3/5/2019 by Ryan Williamson
// converts num from radians to degrees
function radiansToDegrees(num) {
	return num * (180 / Math.PI);
}

/*
Created 3/5/2019 by Sean Edwards
Modified 3/11/2019 by Sean Edwards to account for a 0 being provided as pwr value.
Function to caluclate a number value raised to another number value
and then return said value.
@REQUIRES num
	An integer or decimal value to be squared.
@REQUIRES pwr
	An integer or decimal value to raise the num variable to. If
	pwr is 0 the function returns "Error".
@RETURNS answer
	The raised value.
*/
function power(num, pwr) {
	var answer;
	if (pwr === 0) {
		answer = "Error";
	}
	else {
		answer = Math.pow(num, pwr);
	}
	return answer;
}

/*
Created 3/5/2019 by Sean Edwards
Modified 3/11/2019 by Sean Edwards to fix issue with Math.E syntax.
Function to calculate the mathematical value of e to a raised power.
@REQUIRES pwr
	An integer or decimal value to raise the mathematical value of e to.
@RETURNS
	The raised value of e.
*/
function e_power(pwr) {
	return (Math.pow(Math.E, pwr));
}

/*
Created 3/5/2019 by Sean Edwards
Function to calculate the value of 10 raised to the power of another number value, returning said value.
@REQUIRES pwr
	An integer or decimal value to raise the value of 10 to.
@RETURNS
	The raised value of 10 to a power.
*/
function ten_power(pwr) {
	return (Math.pow(10, pwr));
}

/*
Created 3/5/2019 by Sean Edwards
Function to calculate the fraction of 1 divided by a provided number value.
@REQUIRES num
	An integer or decimal value to divide 1 by.
@RETURNS
	The divided value.
*/
function one_fraction(num) {
	var val;
	if (num === 0) {
		val = "Error";
	} else {
		val = 1 / num;
	}
	return val;
}

/*
Created 3/5/2019 by Sean Edwards
Function to calculate the sqaure root of a provided value (num).
@REQUIRES num
	An integer or decimal value to take the square root of.
@RETURNS
	The square root of provided variable num.
*/
function square_root(num) {
	return (Math.sqrt(num));
}

/*
Created 3/5/2019 by Sean Edwards
Modifed 3/5/2019 by Ryan Williamson Fixed Syntax Error
Modified 3/11/2019 by Sean Edwards to leverage inbuilt JS Math functionality.
Function to calculate the sqaure root of a provided value (num).
@REQUIRES num
	An integer or decimal value to take the cubed root of.
@RETURNS
	The cubed root of provided variable num.
*/
function cube_root(num) {
	return (Math.cbrt(num));
}

/*
Created 3/5/2019 by Sean Edwards
Function to calculate the n-root of a provided value (num).
@REQUIRES num
	An integer or decimal value to take the n-root of.
@REQUIRES rt
	An integer or decimal value to use as the root value.
@RETURNS val
	The n-root of provided variable num.
*/
function n_root(num, nval) {
	var val;

	//check to verify num is actually a number and not a string.
	if (typeof (num) == 'number') {

		//Check if n-value is 0.
		if (nval === 0) {
			val = "Error";

			//Otherwise do calculation.
		} else {
			val = power(num, 1 / nval);
		}

		//Accounts for cases where error is passed to function
	} else {
		val = "Error";
	}
	return (val);
}

/* TODODODOOD */
/*
Created 3/5/2019 by Sean Edwards
Function that returns the mathematical value of e.
@RETURNS
	The mathematical value of e.
*/
function e_value() {
	return (Math.E);
}

/*
Created 3/5/2019 by Sean Edwards
Function that returns the mathematical value of Pi.
@RETURNS
	The mathematical value of Pi.
*/
function pi_value() {
	return (Math.PI);
}

/*
Created 3/20/2019 by Sean Edwards
Function that returns the factorialized value of an input number.
@REQUIRES num
	A number to factorialize.
@RETURNS
	The factorialized value.
*/
function factorial(num) {

	var value;

	//Base check to verify incoming number is an int.
	if (Number.isInteger(num)) {

		//Error check for negative values and values greater than 103 to mimic caluclator output software on an iphone.
		if (num < 0 || num > 103) {
			value = "Error";

			//Base case when at smallest value that can be factorialized i.e. 0
		} else if (num === 0) {
			value = 1;

			//case for all other values below 104 and greater than 0.
		} else if (num > 0) {
			value = num * factorial(num - 1);
		}

		//If input number is not an integer then output Error mimicking iphone calculator.
	} else {
		value = "Error";
	}
	return value;
}



//------------------------------------------------------------
/*
Created 3/20/19 by Chandler Gerstenslager
This is the logic to display calculation history in the modal. This pushes the
logic of each operation onto the calculatorHistory array which is accessed when the modal
opens
*/

function modalHistory(firstValue, operation, secondValue, solution) {
	var calculationEntry = firstValue + " " + operation + " " + secondValue + " = " + solution;
	if (lastOpClicked == "nroot") {
		calculationEntry = "(" + secondValue + ")\u221A(" + firstValue + ") = " + solution;
	}
	calculatorHistory.push(calculationEntry);
	//console.log("calculation history: " + calculationEntry);
	//console.log(calculatorHistory[0]);
}

function modalHistoryUnary(firstValue, operation, solution) {
	var calculationEntry = operation + "(" + firstValue + ") = " + solution;
	calculatorHistory.push(calculationEntry);
	//console.log("calculation history: " + calculationEntry);
	//console.log(calculatorHistory[0]);
}
