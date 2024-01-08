//===========================
/* Calculation Part */
//===========================
function calculateExpression(expression) {
  try {
    const tokens = tokenize(expression);
    const result = parseExpression(tokens);
    
    // Check if the result is a finite number
    if (typeof result === 'number' && isFinite(result)) {
      return result;
    } else {
      throw new Error('Invalid result');
    }
  } catch (error) {
    console.error('Error in calculation:', error.message);
    return NaN; // Return NaN for invalid expressions or errors
  }
}

// Tokenize the expression into an array of tokens
function tokenize(expression) {
  const regex = /\d+\.?\d*|[+\-*/()]/g;
  return expression.match(regex) || [];
}

// Parse the expression using a recursive descent parser
function parseExpression(tokens) {
  let value = parseTerm(tokens);

  while (tokens.length > 0 && (tokens[0] === '+' || tokens[0] === '-')) {
    const operator = tokens.shift();
    const nextTerm = parseTerm(tokens);

    if (operator === '+') {
      value += nextTerm;
    } else {
      value -= nextTerm;
    }
  }

  return value;
}

function parseTerm(tokens) {
  let value = parseFactor(tokens);

  while (tokens.length > 0 && (tokens[0] === '*' || tokens[0] === '/')) {
    const operator = tokens.shift();
    const nextFactor = parseFactor(tokens);

    if (operator === '*') {
      value *= nextFactor;
    } else {
      value /= nextFactor;
    }
  }

  return value;
}

function parseFactor(tokens) {
  if (tokens.length === 0) {
    throw new Error('Unexpected end of expression');
  }

  const token = tokens.shift();

  if (token === '(') {
    const value = parseExpression(tokens);
    if (tokens.shift() !== ')') {
      throw new Error('Mismatched parentheses');
    }
    return value;
  } else if (!isNaN(parseFloat(token))) {
    return parseFloat(token);
  } else {
    throw new Error('Unexpected token: ' + token);
  }
}

