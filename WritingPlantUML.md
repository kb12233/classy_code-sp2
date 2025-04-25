# PlantUML Class Diagram Writing Guide

This guide helps you write clean, well-structured PlantUML class diagrams. Follow these guidelines to create professional UML diagrams that clearly represent your software design.

## Table of Contents
- [Basic Structure](#basic-structure)
- [Class Definitions](#class-definitions)
- [Interfaces](#interfaces)
- [Enums](#enums)
- [Modifiers](#modifiers)
- [Constructors](#constructors)
- [Relationships](#relationships)
- [Packages](#packages)
- [Generic Types](#generic-types)
- [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
- [Complete Example](#complete-example)

## Basic Structure

Your PlantUML diagram must begin with `@startuml` and end with `@enduml`:

```
@startuml
// Your diagram content here
@enduml
```

## Class Definitions

### Basic Class Syntax

Classes are defined using the `class` keyword followed by the class name:

```
class ClassName {
  // attributes and methods go here
}
```

### Attributes

Define attributes with visibility modifiers and types:

```
class Example {
  +publicAttr: String
  -privateAttr: int
  #protectedAttr: boolean
  ~packageAttr: double
}
```

Visibility Modifiers:
- `+` for public
- `-` for private
- `#` for protected
- `~` for package

### Methods

Define methods with visibility, parameters, and return types:

```
class Example {
  +publicMethod(param1: String, param2: int): boolean
  -privateMethod(): void
  #protectedMethod(param: double): String
}
```

## Interfaces

Interfaces are defined using the `interface` keyword:

```
interface PaymentProcessor {
  +processPayment(amount: double): boolean
  +refund(transactionId: String): void
}
```

## Enums

Enums are defined with values listed inside:

```
enum Status {
  PENDING
  APPROVED
  REJECTED
  COMPLETED
}
```

## Modifiers

Use curly braces `{}` to specify modifiers:

### Static Members
```
class Utility {
  {static} +calculateTax(amount: double): double
  {static} -instance: Utility
}
```

### Abstract Classes and Methods
```
abstract class Shape {
  -color: String
  {abstract} +calculateArea(): double
  +getColor(): String
}
```

### Final Attributes
```
class Constants {
  {final} +PI: double
  {final} -MAX_USERS: int
}
```

### Combined Modifiers
```
class Config {
  {static} {final} +DEFAULT_TIMEOUT: int
}
```

## Constructors

Constructors are defined as special methods with the same name as the class:

```
class User {
  -id: int
  -name: String
  
  +User(id: int, name: String)
}
```

You can also specify visibility for constructors:

```
class Singleton {
  -Singleton()  // private constructor
}
```

## Relationships

### Inheritance
```
// Child inherits from Parent
Child --|> Parent
```

### Implementation
```
// Class implements Interface
UserService ..|> IUserService
```

### Association
```
// Simple arrow for association
Customer --> Order
```

### Aggregation
```
// Empty diamond for aggregation
Department o--> Employee
```

### Composition
```
// Filled diamond for composition
Car *--> Engine
```

### Dependency
```
// Dashed arrow for dependency
PaymentController ..> PaymentService
```

### Reverse Arrows
You can use reverse arrows if needed:
```
Parent <|-- Child
Interface <|.. Class
```

## Packages

Define packages to organize your classes:

```
package com.example.model {
  class User {
    -id: int
    -name: String
  }
}

package com.example.service {
  interface UserService {
    +findById(id: int): User
  }
}
```

Important: Do not use quotes around package names.

## Generic Types

Define generic types using angle brackets:

```
class GenericList<T> {
  -items: T[]
  +add(item: T): void
  +get(index: int): T
}

interface Comparable<T> {
  +compareTo(other: T): int
}
```

You can also use multiple generic parameters:

```
class Pair<K, V> {
  -key: K
  -value: V
  +Pair(key: K, value: V)
}
```

## Common Pitfalls to Avoid

1. **Don't use quotes around class names**:
   ```
   // ❌ Wrong
   class "UserModel" { }
   
   // ✅ Correct
   class UserModel { }
   ```

2. **Use camelCase for compound class names**:
   ```
   // ❌ Wrong
   class user_profile { }
   
   // ✅ Correct
   class UserProfile { }
   ```

3. **Always specify parameter types and return types**:
   ```
   // ❌ Wrong
   +getUserName()
   
   // ✅ Correct
   +getUserName(): String
   ```

4. **Don't use special characters in identifiers**:
   ```
   // ❌ Wrong
   class User$ { }
   
   // ✅ Correct
   class UserValidator { }
   ```

5. **Use proper visibility modifiers**:
   ```
   // ❌ Wrong
   public name: String
   
   // ✅ Correct
   +name: String
   ```

## Complete Example

Here's a comprehensive example that demonstrates all supported features:

```
@startuml
package com.example.banking {
  abstract class Account {
    -accountNumber: String
    -balance: double
    {static} -nextAccountNumber: int
    
    +Account(initialBalance: double)
    +deposit(amount: double): void
    +withdraw(amount: double): boolean
    {abstract} +calculateInterest(): double
    {static} +generateAccountNumber(): String
  }
  
  class SavingsAccount {
    -interestRate: double
    
    +SavingsAccount(initialBalance: double, interestRate: double)
    +calculateInterest(): double
  }
  
  class CheckingAccount {
    -overdraftLimit: double
    
    +CheckingAccount(initialBalance: double, overdraftLimit: double)
    +calculateInterest(): double
  }
  
  interface TransactionLogger {
    +logTransaction(transaction: Transaction): void
    +getLastTransactions(count: int): List<Transaction>
  }
  
  class Transaction {
    {final} -id: String
    -timestamp: Date
    -amount: double
    -type: TransactionType
    
    +Transaction(amount: double, type: TransactionType)
  }
  
  enum TransactionType {
    DEPOSIT
    WITHDRAWAL
    TRANSFER
    INTEREST
  }
  
  SavingsAccount --|> Account
  CheckingAccount --|> Account
  Account ..> TransactionLogger
  Account --> Transaction
  Transaction --> TransactionType
}
@enduml
```

## Tips for Success

1. Keep your diagrams simple and focused
2. Use meaningful names for classes, methods, and attributes
3. Properly specify types for all attributes, parameters, and return values
4. Use appropriate relationships to show class connections
5. Test your diagram with the transpiler to ensure compatibility

## Troubleshooting

If your diagram isn't rendering correctly:

1. Check for syntax errors in your PlantUML code
2. Ensure all types are specified for attributes and methods
3. Verify that visibility modifiers are using the correct symbols
4. Make sure modifiers are properly enclosed in curly braces
5. Confirm that relationships are using the correct arrow syntax

By following these guidelines, you'll create clear, professional PlantUML diagrams that accurately represent your software design.