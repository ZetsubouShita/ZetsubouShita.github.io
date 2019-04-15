/*
Created and Modified by Jianyi Qian -3/21/2019
*/

// Get DOM Elements
var binary = document.querySelector('#my-binary');
var binaryBtn = document.getElementById("binary-btn");
var closeBinaryBtn = document.querySelector('.binary-close');

// Events
binaryBtn.addEventListener('click', openBinaryModal);
closeBinaryBtn.addEventListener('click', closeBinaryModal);
window.addEventListener('click', outsideClick);



/*
        Created 3/7/2019 by Jianyi Qan
        This function returns the result of covertion from binary to decimal number.
        @RETURNS
	        decimal number converted from binary format.
*/
    function convert(num) {
        decimal_to_binary(num);
        binary_to_decimal(num);
        binary_to_octal(num);
        binary_to_hex(num);
    }

    function decimal_to_binary(num) {

        document.getElementById("binarynum").innerText = num.toString(2);
    }
    

    function binary_to_decimal(num){
        document.getElementById("decimalnum").innerText = num.toString(10);
    }

    function binary_to_octal(num){
        document.getElementById("octalnum").innerText = num.toString(8);
    }

    function binary_to_hex(num){
        document.getElementById("hexnum").innerText = num.toString(16).toUpperCase();
    }




// Open
function openBinaryModal() {
  binary.style.display = 'block';
  binary_to_decimal(Number(getView()));
}

// Close
function closeBinaryModal() {
  binary.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target == binary) {
    binary.style.display = 'none';
  }
}
