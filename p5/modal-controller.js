/* Created 3/20/2019 by Chandler Gerstenslager
*/

/*
Access DOM Elements and some variables
*/
var historyLength;
var deleteInitString = false;
var closeBtn = document.querySelector('.close');
var modalBtn = document.querySelector('#modal-btn');
var modal = document.querySelector('#my-modal');


/*
Access events to the DOM elements
*/
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

/*
This function allows the user to open the modal
*/
function openModal() {
  var modalTable = document.querySelector('.modal-table');
  historyLength = calculatorHistory.length;
  if(historyLength !== 0){
    modalTable.innerHTML = "";
    // this prevents more than 10 calculatiosn
    if (historyLength > 10){
      historyLength = 10;
      calculatorHistory = calculatorHistory.slice(calculatorHistory.length-10, calculatorHistory.length);
    }
    console.log("The length is: " + historyLength);
    // when the user opens the history, this adds the HTML to the history table
    for(var i = 0; i < historyLength; i++){
      var rawHTML = "<tr class=\"modal-tr\"><td class=\"modal-td\">" + calculatorHistory[i] + "</td></tr>";
      console.log("The length is: " + historyLength);
      modalTable.innerHTML = modalTable.innerHTML + rawHTML;
    }
  }
  modal.style.display = 'block';
}

/*
This closes the modal
*/
function closeModal() {
  modal.style.display = 'none';
}

/*
If the user clicks outside the modal, this function is called
*/
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

/*
This function allows the user to download the calculator's calculation history
It downloads up to the last 10 previous calculations
*/
function download() {
  var filename = "calculatorhistory.txt";
  var text = "";
  if(historyLength === 0){
    alert("No calculations have been entered. Please enter calculations to download them.");
  } else {
    for(var i = 0; i < historyLength; i++){
      text = text + calculatorHistory[i] + "\n";
    }
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

}
