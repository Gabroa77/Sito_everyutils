/**
 * Calculator Logic Utilities - Ported from original index.html
 */

export function tokenize(str: string) {
  const tokens = [];
  let i = 0;
  while (i < str.length) {
    let char = str[i];
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < str.length && /[0-9.]/.test(str[i])) {
        numStr += str[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
      continue;
    }

    if (/[a-zA-Zà-ÿ]/.test(char)) {
      let name = '';
      while (i < str.length && /[a-zA-Z0-9]/.test(str[i])) {
        name += str[i];
        i++;
      }
      let lowerName = name.toLowerCase();

      if (lowerName === 'pi' || lowerName === 'π') {
        tokens.push({ type: 'NUMBER', value: Math.PI });
      } else if (lowerName === 'e') {
        tokens.push({ type: 'NUMBER', value: Math.E });
      } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(lowerName)) {
        tokens.push({ type: 'FUNCTION', value: lowerName });
      } else {
        throw new Error(`Identificatore sconosciuto: ${name}`);
      }
      continue;
    }

    if ('+-*/^()'.includes(char) || char === '×' || char === '÷' || char === '−') {
      let opVal = char;
      if (char === '×') opVal = '*';
      if (char === '÷') opVal = '/';
      if (char === '−') opVal = '-';

      if (opVal === '-' || opVal === '+') {
        const lastTok: any = tokens[tokens.length - 1];
        const isUnary = !lastTok ||
                        (lastTok.type === 'OPERATOR' && lastTok.value !== ')') ||
                        lastTok.type === 'FUNCTION';
        if (isUnary) {
          opVal = opVal === '-' ? 'u-' : 'u+';
        }
      }

      tokens.push({ type: 'OPERATOR', value: opVal });
      i++;
      continue;
    }
    throw new Error(`Carattere non valido: ${char}`);
  }
  return tokens;
}

const OPERATORS_METADATA: any = {
  '+': { precedence: 2, associativity: 'LEFT' },
  '-': { precedence: 2, associativity: 'LEFT' },
  '*': { precedence: 3, associativity: 'LEFT' },
  '/': { precedence: 3, associativity: 'LEFT' },
  '^': { precedence: 4, associativity: 'RIGHT' },
  'u-': { precedence: 5, associativity: 'RIGHT' },
  'u+': { precedence: 5, associativity: 'RIGHT' }
};

function evaluateRPN(rpnTokens: any[], activeAngleMode: string) {
  const stack = [];
  for (const token of rpnTokens) {
    if (token.type === 'NUMBER') {
      stack.push(token.value);
    } else if (token.type === 'OPERATOR') {
      if (token.value === 'u-') {
        const val = stack.pop();
        stack.push(-val);
      } else if (token.value === 'u+') {
        // do nothing
      } else {
        const b = stack.pop();
        const a = stack.pop();
        switch (token.value) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(a / b); break;
          case '^': stack.push(Math.pow(a, b)); break;
        }
      }
    } else if (token.type === 'FUNCTION') {
      const val = stack.pop();
      switch (token.value) {
        case 'sin': stack.push(Math.sin(activeAngleMode === 'deg' ? (val * Math.PI) / 180 : val)); break;
        case 'cos': stack.push(Math.cos(activeAngleMode === 'deg' ? (val * Math.PI) / 180 : val)); break;
        case 'tan': stack.push(Math.tan(activeAngleMode === 'deg' ? (val * Math.PI) / 180 : val)); break;
        case 'log': stack.push(Math.log10(val)); break;
        case 'ln': stack.push(Math.log(val)); break;
        case 'sqrt': stack.push(Math.sqrt(val)); break;
      }
    }
  }
  return stack[0];
}

export function parseAndEvaluate(expr: string, activeAngleMode: string) {
  let processedStr = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/−/g, '-');

  processedStr = processedStr.replace(/(\d)(\()/g, '$1*$2');
  processedStr = processedStr.replace(/(\))(\d)/g, '$1*$2');
  processedStr = processedStr.replace(/(\))(\()/g, '$1*$2');
  processedStr = processedStr.replace(/(\d)(pi|e|sin|cos|tan|log|ln|sqrt)/gi, '$1*$2');
  processedStr = processedStr.replace(/(\))(pi|e)/gi, '$1*$2');
  processedStr = processedStr.replace(/(pi|e)(\()/gi, '$1*$2');

  const tokens = tokenize(processedStr);
  const outputQueue = [];
  const operatorStack = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER') {
      outputQueue.push(token);
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'OPERATOR') {
      const op = token.value;
      if (op === '(') {
        operatorStack.push(token);
      } else if (op === ')') {
        let top = operatorStack[operatorStack.length - 1];
        while (top && !(top.type === 'OPERATOR' && top.value === '(')) {
          outputQueue.push(operatorStack.pop());
          top = operatorStack[operatorStack.length - 1];
        }
        operatorStack.pop();
      } else {
        let top = operatorStack[operatorStack.length - 1];
        while (
          top &&
          (top.type === 'FUNCTION' ||
            (top.type === 'OPERATOR' && top.value !== '(' && top.value !== ')' &&
              (OPERATORS_METADATA[top.value].precedence > OPERATORS_METADATA[op].precedence ||
                (OPERATORS_METADATA[top.value].precedence === OPERATORS_METADATA[op].precedence &&
                  OPERATORS_METADATA[op].associativity === 'LEFT'))))
        ) {
          outputQueue.push(operatorStack.pop());
          top = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(token);
      }
    }
  }
  while (operatorStack.length > 0) outputQueue.push(operatorStack.pop());
  return evaluateRPN(outputQueue, activeAngleMode);
}

export function formatResult(val: number) {
  if (typeof val !== 'number' || isNaN(val)) return "Errore";
  if (!isFinite(val)) return "Infinito";
  let precision = 8;
  if (typeof window !== 'undefined') {
    precision = parseInt(localStorage.getItem('everyutils_precision') || '8');
  }
  let rounded = parseFloat(val.toFixed(precision));
  if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
    return val.toExponential(4);
  }
  return String(rounded);
}
