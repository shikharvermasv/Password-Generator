const inputSlider = document.querySelector("[data-length-slider]");
const passwordLengthDisplay = document.querySelector("[data-input-password-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const Indicator = document.querySelector('[data-indicator]');
const uppercase = document.querySelector('#uppercase');
const lowercase = document.querySelector('#lowercase');
const symbols = document.querySelector('#symbol');
const numbers = document.querySelector('#numbers');
const generateBtn = document.querySelector('.generateButton');
const allcheckbox = document.querySelectorAll('input[type=checkbox]');

let password = "";
let passwordLength = 10;
let checkCount = 0;
let symbolString = '~!@#$%^&*()_+-=[]{};:,<.>/?';

setIndicator("#ccc");


handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    passwordLengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min) * 100 / (max - min)) + "% 100%";   
}

function setIndicator(color){
    Indicator.style.backgroundColor = color;
    // shadow
    Indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRandomInteger(min , max){
    return  Math.floor(Math.random() * (max - min)) + min ;

}   


function generateRandomNumber(){
    return getRandomInteger(0 , 9);
}

function generateRandomLowercase(){
    return String.fromCharCode(getRandomInteger(97 , 123));
}

function generateRandomUppercase(){
    return String.fromCharCode(getRandomInteger(65 , 91));
}

function generateRandomSymbol(){
    let randomNum = getRandomInteger(0 , symbolString.length);
    return symbolString.charAt(randomNum);
}

function strengthCalculate(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercase.checked) hasUpper = true;
    if(lowercase.checked) hasLower = true;
    if(numbers.checked) hasNumber = true;
    if(symbols.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } 
    else if ((hasLower || hasUpper) &&(hasNumber || hasSymbol) &&passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}


async function copyPassword() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'Copied!';
    }
    catch(e) {
        copyMsg.innerText = 'Failed' ;
    } 

    // msg pop up
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 3000);
}

function handleAllCheckBox(){
    checkCount = 0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength < checkCount  ){
        passwordLength = checkCount;
        handleSlider();
    }
}

allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change' , handleAllCheckBox);
});

inputSlider.addEventListener('input' , (e) =>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , (e) =>{
    if(passwordDisplay.value){
        copyPassword();
    }
} );


generateBtn.addEventListener('click' , ()=>{
    
    if(checkCount == 0){
        return; 
    }

    if(passwordLength < checkCount  ){
        passwordLength = checkCount;
        handleSlider();
    }
    
    console.log("Starting password Generation done");

    password = '';

    let funcArr = [];

    if(uppercase.checked){
        funcArr.push(generateRandomUppercase);
    }

    if(lowercase.checked){
        funcArr.push(generateRandomLowercase);
    }

    if(numbers.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbols.checked){
        funcArr.push(generateRandomSymbol);
    }

    for(let i = 0; i < funcArr.length ; i++){
        password += funcArr[i]();
    }

    console.log("Compulsary addition done");



    for(let i = 0; i < passwordLength - funcArr.length ; i++){
        let randomIndex = getRandomInteger(0 , funcArr.length);
        console.log("randIndex" + randomIndex);
        password += funcArr[randomIndex]();
    }
    console.log("LeftOver addition done");

    console.log("ShufflePassword addition done");

    passwordDisplay.value = password;
    console.log("Calculating Strength");
    strengthCalculate();

});