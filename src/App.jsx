import { useEffect, useState } from 'react'

function App() {
  const [operand1, setOperand1] = useState('')
  const [operator, setOperator] = useState('')
  const [operand2, setOperand2] = useState('')
  const [result, setResult] = useState('')

  // Functions to perform arithmetic operations
  function add(op1, op2) {
    if ((op1 + op2) % 1 === 0) {
      return parseInt(op1 + op2);
    }
    return (op1 + op2).toFixed(1);
  }
  function subtract(op1, op2) {
    if ((op1 - op2) % 1 === 0) {
      return parseInt(op1 - op2);
    }
    return (op1 - op2).toFixed(1);
  }
  function multiply(op1, op2) {
    if ((op1 * op2) % 1 === 0) {
      return parseInt(op1 * op2);
    }
    return (op1 * op2).toFixed(1);
  }
  function divide(op1, op2) {
    if (op2 === 0) {
      return 'Infinity!';
    }
    if ((op1 / op2) % 1 === 0) {
      return parseInt(op1 / op2);
    }
    return (op1 / op2).toFixed(1);
  }

  function setOperand(value) {
    if(operand1.length === 24 || operand2.length === 24) {
      return;
    }
    if(operand1.length + operand2.length >= 24) {
      return;
    }
    // If the operator is not set, append the value to operand1, otherwise to operand2
    if (operator === '') {
      setOperand1(prev => prev + value);
    } else {
      setOperand2(prev => prev + value);
    }
  }

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") allClear();
    else if (e.key === "F9") setNegativePositive();
    else if (e.key === "%") setOperator('%');
    else if (e.key === "/") setOperator('/');
    else if (e.key === "*") setOperator('X');
    else if (e.key === "-") setOperator('-');
    else if (e.key === "+") setOperator('+');
    else if (e.key === "=" || e.key === "Enter") calculate();
    else if (e.key === ".") setDecimal();
    else if ("0123456789".includes(e.key)) setOperand(e.key);
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [operator, operand1, operand2, result]);


  function setNegativePositive() {
    if (operator === '') {
      if (operand1 !== '') {
        setOperand1(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
      }
    } else {
      if (operand2 !== '') {
        setOperand2(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
      }
    }
  }
  function setDecimal() {
    if (operator === '') {
      if (!operand1.includes('.')) {
        setOperand1(prev => prev + '.');
      }
    } else {
      if (!operand2.includes('.')) {
        setOperand2(prev => prev + '.');
      }
    }
  }

  // Function to clear all operands and operators
  function allClear() {
    setOperand1('');
    setOperator('');
    setOperand2('');
    setResult('');
    console.log(operand1 + " " + operator + " " + operand2 + " " + result);
  }

  // Function to pre-display the current state of the calculator
  function preDisplay() {
    return `${operand1}${operator}${operand2}`;
  }

  // Function to show the output based on the current state
  function showOutput() {
    // Helper to format with commas, but keep decimals
    function formatWithCommas(val) {
      if (val === '' || isNaN(Number(val))) return val;
      const [intPart, decPart] = val.split('.');
      const formattedInt = Number(intPart).toLocaleString();
      return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
    }

    if (result !== '') {
      return formatWithCommas(String(result).slice(0, 24));
    } else if (operand2 !== '') {
      return formatWithCommas(operand2.slice(0, 24));
    } else {
      return formatWithCommas(operand1.slice(0, 24));
    }
  }

  useEffect(() => {
    showOutput();
    preDisplay();
  }, [operand1, operator, operand2]
  );


  function calculate() {
    // Check if any operand or operator is empty
    let result = 0;
    if (operand1 === '' || operand2 === '' || operator === '') {
      return;
    }
    if (operand1 === 'Infinity!' || operand2 === 'Infinity!') {
      setResult('Infinity!');
      return;
    }
    // Perform the calculation based on the operator
    switch (operator) {
      case '+':
        result = add((Number(operand1)), (Number(operand2)));
        break;
      case '-':
        result = subtract(Number(operand1), (Number(operand2)));
        break;
      case 'X':
        result = multiply(Number(operand1), Number(operand2));
        break;
      case '/':
        result = divide(Number(operand1), Number(operand2));
        break;
      case '%':
        result = (Number(operand1) * Number(operand2)) / 100;
        break;
      default:
        result = 'Error';
    }

    setResult(String(result).slice(0, 24));
    setOperand1(String(result));
    setResult('');
    setOperand2('');
    setOperator('');
  }
  return (
    <div className='bg-[url(./assets/apple.jpg)] bg-cover h-svh overflow-hidden w-auto flex items-center justify-center'>
      <div className='bg-[#000000c4] rounded-[26px] w-2xs min-h-390px flex items-center shadow-md shadow-[#000000] justify-center'>
        <div className='flex justify-center w-full item-center flex-col p-3 gap-4.5 '>

          <div className='text-white min-h-40 justify-between flex flex-col'>           
            <div className=' bg-black text-center p-3 mx-auto shadow-sm shadow-[#5050508e] min-w-21 rounded-full '></div>
            <div className=' text-right mt-2 text-[#d4d4d2d5]'>{preDisplay()}</div>
            <div className=' text-[2.8rem] font-[350] text-right break-words break-all text-shadow-black max-h-[152px] text-shadow-sm'>{showOutput()}</div>
          </div>

          <div className='grid grid-cols-4 w-full gap-4 mb-6'>
            <button onClick={() => { allClear() }} className='bg-[#d4d4d2d5] text-[#1c1c1cd0] hover:bg-[#979797] active:bg-[#c0bdbd9f] transition-normal ease-in-out'>AC</button>
            <button onClick={()=>{setNegativePositive()}} className='bg-[#d4d4d2d5] text-[#1c1c1cd0] hover:bg-[#979797] active:bg-[#c0bdbd9f] transition-normal ease-in-out '>+/-</button>
            <button onClick={() => { setOperator('%') }} className='bg-[#d4d4d2d5] text-[#1c1c1cd0] hover:bg-[#979797] active:bg-[#c0bdbd9f] transition-normal ease-in-out'>%</button>
            <button onClick={() => { setOperator('/') }} className='bg-[#ee8c04] text-white hover:bg-[#ff9500b6] active:bg-[#ff95009d] transition-normal ease-in-out'>÷</button>
            <button onClick={() => { setOperand('7') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>7</button>
            <button onClick={() => { setOperand('8') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>8</button>
            <button onClick={() => { setOperand('9') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>9</button>

            <button onClick={() => { setOperator('X') }} className='bg-[#ee8c04] text-white hover:bg-[#ff9500b6] active:bg-[#ff95009d] transition-normal ease-in-out'>x</button>
            <button onClick={() => { setOperand('4') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>4</button>
            <button onClick={() => { setOperand('5') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>5</button>
            <button onClick={() => { setOperand('6') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>6</button>
            <button onClick={() => { setOperator('-') }} className='bg-[#ee8c04] text-white hover:bg-[#ff9500b6] active:bg-[#ff95009d] transition-normal ease-in-out'>−</button>
            <button onClick={() => { setOperand('1') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>1</button>
            <button onClick={() => { setOperand('2') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>2</button>
            <button onClick={() => { setOperand('3') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>3</button>
            <button onClick={() => { setOperator('+') }} className='bg-[#ee8c04] text-white hover:bg-[#ff9500b6] active:bg-[#ff95009d] transition-normal ease-in-out'>+</button>
            <button onClick={() => { setOperand('0') }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out grid col-span-2 text-left'><span className='ml-3' >0</span></button>
            <button onClick={() => { setDecimal() }} className='bg-[#5050509c] text-[#D4D4D2] hover:bg-[#383838cc] active:bg-[#292929] transition-normal ease-in-out'>.</button>
            <button onClick={() => { calculate() }} className='bg-[#ee8c04] text-white hover:bg-[#ff9500b6] active:bg-[#ff95009d] transition-normal ease-in-out'>=</button>
          </div>
          <div className='bg-white block shadow-sm shadow-[#000000] h-1 -mt-1.5 -mb-1 mx-auto w-25 rounded-full'></div>

        </div>
      </div>
    </div>
  )
}

export default App
