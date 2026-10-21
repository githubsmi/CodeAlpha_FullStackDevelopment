const display = document.getElementById("display");

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForOperand = false;


// ========================================
// UPDATE DISPLAY
// ========================================

function updateDisplay() {
    display.textContent = currentValue;
}


// ========================================
// ENTER NUMBER
// ========================================

function inputNumber(number) {

    if (currentValue === "Error") {

        currentValue = number;

        waitingForOperand = false;

        updateDisplay();

        return;
    }


    if (waitingForOperand) {

        currentValue = number;

        waitingForOperand = false;

    } else {

        currentValue =
            currentValue === "0"
                ? number
                : currentValue + number;
    }


    updateDisplay();
}


// ========================================
// DECIMAL POINT
// ========================================

function inputDecimal() {

    if (currentValue === "Error") {

        currentValue = "0.";

        waitingForOperand = false;

        updateDisplay();

        return;
    }


    if (waitingForOperand) {

        currentValue = "0.";

        waitingForOperand = false;

    } else if (!currentValue.includes(".")) {

        currentValue += ".";
    }


    updateDisplay();
}


// ========================================
// CHOOSE OPERATOR
// ========================================

function chooseOperator(nextOperator) {

    if (currentValue === "Error") {
        return;
    }


    const inputValue = parseFloat(currentValue);


    if (
        operator &&
        waitingForOperand
    ) {

        operator = nextOperator;

        return;
    }


    if (previousValue === null) {

        previousValue = inputValue;

    } else if (operator) {

        const result = calculate(
            previousValue,
            inputValue,
            operator
        );


        if (result === "Error") {

            currentValue = "Error";

            previousValue = null;

            operator = null;

            updateDisplay();

            return;
        }


        currentValue = formatResult(result);

        previousValue = result;
    }


    operator = nextOperator;

    waitingForOperand = true;

    updateDisplay();
}


// ========================================
// CALCULATE
// ========================================

function calculate(
    first,
    second,
    operator
) {

    switch (operator) {

        case "+":
            return first + second;


        case "-":
            return first - second;


        case "*":
            return first * second;


        case "/":

            if (second === 0) {
                return "Error";
            }

            return first / second;


        default:
            return second;
    }
}


// ========================================
// FORMAT RESULT
// ========================================

function formatResult(result) {

    if (!Number.isFinite(result)) {
        return "Error";
    }


    return String(
        parseFloat(
            result.toFixed(10)
        )
    );
}


// ========================================
// EQUALS
// ========================================

function calculateResult() {

    if (
        operator === null ||
        previousValue === null ||
        currentValue === "Error"
    ) {
        return;
    }


    const secondValue =
        parseFloat(currentValue);


    const result = calculate(
        previousValue,
        secondValue,
        operator
    );


    if (result === "Error") {

        currentValue = "Error";

    } else {

        currentValue =
            formatResult(result);
    }


    previousValue = null;

    operator = null;

    waitingForOperand = true;


    updateDisplay();
}


// ========================================
// CLEAR
// ========================================

function clearCalculator() {

    currentValue = "0";

    previousValue = null;

    operator = null;

    waitingForOperand = false;


    updateDisplay();
}


// ========================================
// DELETE
// ========================================

function deleteLast() {

    if (
        currentValue === "Error" ||
        waitingForOperand
    ) {
        return;
    }


    if (currentValue.length <= 1) {

        currentValue = "0";

    } else {

        currentValue =
            currentValue.slice(0, -1);
    }


    updateDisplay();
}


// ========================================
// PERCENTAGE
// ========================================

function calculatePercentage() {

    if (currentValue === "Error") {
        return;
    }


    const value =
        parseFloat(currentValue);


    currentValue =
        formatResult(value / 100);


    updateDisplay();
}


// ========================================
// BUTTON CLICK HANDLER
// ========================================

document
    .querySelector(".buttons")
    .addEventListener(
        "click",
        function (event) {

            const button = event.target;


            if (!button.matches("button")) {
                return;
            }


            // Number button
            if (
                button.dataset.number !==
                undefined
            ) {

                inputNumber(
                    button.dataset.number
                );

                return;
            }


            // Operator button
            if (
                button.dataset.operator !==
                undefined
            ) {

                chooseOperator(
                    button.dataset.operator
                );

                return;
            }


            // Other actions
            switch (button.dataset.action) {

                case "clear":

                    clearCalculator();

                    break;


                case "delete":

                    deleteLast();

                    break;


                case "decimal":

                    inputDecimal();

                    break;


                case "percent":

                    calculatePercentage();

                    break;


                case "equals":

                    calculateResult();

                    break;
            }
        }
    );


// ========================================
// KEYBOARD SUPPORT
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key;


        // Numbers
        if (
            key >= "0" &&
            key <= "9"
        ) {

            inputNumber(key);

            return;
        }


        // Decimal
        if (key === ".") {

            inputDecimal();

            return;
        }


        // Operators
        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            chooseOperator(key);

            return;
        }


        // Enter or =
        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculateResult();

            return;
        }


        // Clear
        if (
            key === "Escape" ||
            key === "c" ||
            key === "C"
        ) {

            clearCalculator();

            return;
        }


        // Delete
        if (key === "Backspace") {

            deleteLast();

            return;
        }


        // Percentage
        if (key === "%") {

            calculatePercentage();
        }
    }
);


// ========================================
// INITIAL DISPLAY
// ========================================

updateDisplay();