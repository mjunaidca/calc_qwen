# Calculator Engine API Contract

## Purpose
This contract defines the interface for the calculator engine component that will be used by the UI components.

## Calculator Engine Interface

### Methods

#### `calculate(expression: string): number | null`
- **Purpose**: Evaluates a mathematical expression and returns the result
- **Parameters**:
  - `expression`: A string containing a valid mathematical expression (e.g., "5 + 3 * 2")
- **Returns**: 
  - The calculated result as a number
  - `null` if the expression is invalid
- **Example**: 
  - Input: "5 + 3 * 2"
  - Output: 11

#### `add(a: number, b: number): number`
- **Purpose**: Performs addition of two numbers
- **Parameters**:
  - `a`: First operand
  - `b`: Second operand
- **Returns**: Sum of the two operands
- **Example**:
  - Input: add(5, 3)
  - Output: 8

#### `subtract(a: number, b: number): number`
- **Purpose**: Performs subtraction of two numbers
- **Parameters**:
  - `a`: First operand
  - `b`: Second operand
- **Returns**: Difference of the two operands
- **Example**:
  - Input: subtract(10, 3)
  - Output: 7

#### `multiply(a: number, b: number): number`
- **Purpose**: Performs multiplication of two numbers
- **Parameters**:
  - `a`: First operand
  - `b`: Second operand
- **Returns**: Product of the two operands
- **Example**:
  - Input: multiply(4, 5)
  - Output: 20

#### `divide(a: number, b: number): number`
- **Purpose**: Performs division of two numbers
- **Parameters**:
  - `a`: Dividend
  - `b`: Divisor
- **Returns**: Quotient of the division
- **Throws**: Error if attempting to divide by zero
- **Example**:
  - Input: divide(10, 2)
  - Output: 5

#### `percentage(value: number, percent: number): number`
- **Purpose**: Calculates a percentage of a value
- **Parameters**:
  - `value`: The base value
  - `percent`: The percentage to calculate
- **Returns**: The calculated percentage value
- **Example**:
  - Input: percentage(100, 15)
  - Output: 15

#### `squareRoot(value: number): number`
- **Purpose**: Calculates the square root of a number
- **Parameters**:
  - `value`: The number to find the square root of
- **Returns**: The square root of the value
- **Throws**: Error if trying to take the square root of a negative number
- **Example**:
  - Input: squareRoot(16)
  - Output: 4

#### `toggleSign(value: number): number`
- **Purpose**: Toggles the sign of a number (positive to negative or vice versa)
- **Parameters**:
  - `value`: The value to toggle the sign of
- **Returns**: The value with its sign toggled
- **Example**:
  - Input: toggleSign(5)
  - Output: -5

#### `calculateExpression(expression: string): { result: number, error?: string }`
- **Purpose**: Safely evaluates a mathematical expression with error handling
- **Parameters**:
  - `expression`: A string containing a mathematical expression
- **Returns**: An object with the result and optional error message
- **Example**:
  - Input: calculateExpression("5 + 3")
  - Output: { result: 8 }
  - Input: calculateExpression("10 / 0")
  - Output: { result: null, error: "Division by zero" }

## Storage Interface

### Methods

#### `saveCalculation(calculation: Calculation): void`
- **Purpose**: Saves a calculation to browser storage
- **Parameters**:
  - `calculation`: A Calculation object with expression, result, and timestamp
- **Returns**: void

#### `getRecentCalculations(limit: number = 10): Calculation[]`
- **Purpose**: Retrieves recent calculations from browser storage
- **Parameters**:
  - `limit`: Maximum number of calculations to return (default: 10)
- **Returns**: Array of Calculation objects

#### `clearHistory(): void`
- **Purpose**: Clears the calculation history from browser storage
- **Returns**: void

#### `updateUserPoints(points: number): void`
- **Purpose**: Updates the user's gamification points in storage
- **Parameters**:
  - `points`: New total points value
- **Returns**: void

#### `getUserPoints(): number`
- **Purpose**: Retrieves the user's current gamification points
- **Returns**: Current points value

## Events

### `calculation.performed`
- **Payload**: `{ expression: string, result: number, timestamp: Date }`
- **Triggered when**: A calculation is successfully performed

### `error.occurred`
- **Payload**: `{ message: string, expression?: string }`
- **Triggered when**: An error occurs during calculation

### `points.updated`
- **Payload**: `{ points: number, reason: string }`
- **Triggered when**: User points are updated