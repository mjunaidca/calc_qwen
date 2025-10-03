# Data Model: Modern 3D Calculator Web App

## Entities

### Calculation
- **Description**: Represents a single calculation performed by the user
- **Fields**:
  - `id`: string (unique identifier)
  - `expression`: string (the mathematical expression entered, e.g., "5 + 3 * 2")
  - `result`: number (the result of the calculation)
  - `timestamp`: Date (when the calculation was performed)
  - `userId`: string (optional, for future multi-user support)

### UserSession
- **Description**: Represents the current user session and stores temporary data
- **Fields**:
  - `id`: string (unique identifier)
  - `currentInput`: string (the current input being entered)
  - `recentCalculations`: Calculation[] (array of recent calculations)
  - `points`: number (gamification points earned)
  - `lastActive`: Date (timestamp of last activity)

### CalculatorState
- **Description**: Represents the current state of the calculator
- **Fields**:
  - `currentValue`: string (the current display value)
  - `previousValue`: number (the previous value in a calculation)
  - `operation`: string | null (the current operation, e.g., '+', '-', '*', '/')
  - `waitingForOperand`: boolean (whether waiting for next operand)
  - `memoryValue`: number (value stored in calculator memory)

### GamificationEvent
- **Description**: Represents an event that triggers gamification elements
- **Fields**:
  - `id`: string (unique identifier)
  - `type`: 'calculation_performed' | 'achievement_earned' | 'streak_milestone' | 'first_use'
  - `pointsEarned`: number (points awarded for this event)
  - `timestamp`: Date (when the event occurred)
  - `description`: string (description of the event)

## Relationships
- UserSession contains many Calculation instances (recent calculations)
- UserSession has one CalculatorState
- UserSession has many GamificationEvent instances

## Validation Rules
- Calculation.expression: Must be a valid mathematical expression
- Calculation.result: Must be a valid number (not NaN or Infinity for most operations)
- UserSession.points: Must be a non-negative integer
- CalculatorState.currentValue: Must be a string that can be converted to a number or empty
- CalculatorState.operation: Must be one of the supported operations or null

## State Transitions
- CalculatorState can transition based on user input:
  - When number is pressed: Update currentValue
  - When operation is pressed: Store currentValue as previousValue, set operation, reset currentValue
  - When equals is pressed: Perform calculation, update display with result
  - When clear is pressed: Reset to initial state

## Serialization Format
- Calculations are stored in localStorage as JSON with the following structure:
```json
{
  "recentCalculations": [
    {
      "id": "unique-id",
      "expression": "5 + 3",
      "result": 8,
      "timestamp": "2025-10-03T10:00:00.000Z"
    }
  ],
  "points": 50,
  "calculatorState": {
    "currentValue": "0",
    "previousValue": null,
    "operation": null,
    "waitingForOperand": false,
    "memoryValue": 0
  }
}
```