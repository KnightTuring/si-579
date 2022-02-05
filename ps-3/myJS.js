/*
* Excercise 1
*
*/



/*
* Then write a function that changes the text and the color inside the div
*
*/
const colorBlock = document.querySelector("#color-block")
let newColor = false;

colorBlock.addEventListener("click", () => {
    if(newColor) {
        newColor = false;
    } else {
        newColor = true;
    }
    changeColor();
})

function changeColor(){
    //Write a condition determine what color it should be changed to
   const span = document.querySelector("#color-name")
    if(newColor){
        //change the background color using JS
        colorBlock.style.backgroundColor = "#0000FF"

        //Change the text of the color using the span id color-name
        span.textContent = "#0000FF"

    }
    else{
        //change the background color using JS
        colorBlock.style.backgroundColor = "#F08080"
        
        //Change the text of the color using the span id color-name
        span.textContent = "#F08080"
    }
}


/*
* For excercise 2, you need to write an event handler for the button id "convertbtn"
* on mouse click. For best practice use addEventListener.
*
*/


/*
* Then write a function that calculates Fahrenheit to Celsius and display it on the webpage
*
*/

const btnConvert = document.querySelector("#convertbtn")
btnConvert.addEventListener("click", () => {
    convertTemp()
})

function convertTemp(){
    let tempInFahrFloat = 0.0
    let tempInCelsiusFloat = 0.0
    let tempInCelStr = ""
    const txtInput = document.querySelector("#f-input")
    const tempOuput = document.querySelector("#c-output")
    //Calculate the temperature here
    tempInFahrStr = txtInput.value
    tempInFahrFloat = parseFloat(tempInFahrStr)
    tempInCelsiusFloat = (tempInFahrFloat - 32) * (5/9)
    tempInCelStr = tempInCelsiusFloat.toString()
    //Send the calculated temperature to HTML
    tempOuput.textContent = tempInCelsiusFloat
}


