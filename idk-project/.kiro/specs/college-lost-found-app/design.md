# Design Document: College Lost and Found Application

## Overview

The College Lost and Found Application is a web-based system that facilitates the reporting and recovery of lost items within a college community. The system consists of three main subsystems:

1. **Admin Management System**: Provides authentication, authorization, and activity monitoring capabilities for administrators
2. **Lost and Found System**: Enables users to post lost/found items and implements an ownership verification mechanism through text-based questions
3. **Chat System**: Provides both anonymous and non-anonymous communication channels with admin oversight

The design emphasizes security through role-based access control, data integrity through validation, and user privacy through controlled anonymity in the chat system.

## Architecture

The system follows a three-tier architecture:

### Presentation Layer
- Web-based user interface for users and admins
- Separate views for lost items, found items, and chat
- Admin dashboard for monitoring and management

### Application Layer
- Authentication and authorization service
- Lost and found item management service
- Verification question and claim processing service
- Chat message routing service with anonymity handling
- Activity logging service

### Data Layer
- User and admin account storage
- Lost and found item records
- Verification questions and claim requests
- Chat message history with sender metadata
- Activity audit logs

## Components and Interfaces

### 1. Authentication and Authorization Component

**Responsibilities:**
- Validate admin credentials
- Manage user sessions
- Enforce role-based access control

**Interfaces:**

```typescript
interface AuthService {
  // Authenticate admin with credentials
  authenticateAdmin(username: string, password: string): Result<AdminSession, AuthError>
  
  // Validate admin session
  validateAdminSession(sessionToken: string): Result<AdminId, AuthError>
  
  // Check if user has admin privileges
  isAdmin(userId: string): boolean
  
  // Terminate admin session
  logout(sessionToken: string): Result<void, AuthError>
}

type AdminSession = {
  adminId: string
  sessionToken: string
  expiresAt: Date
}

type AuthError = 
  | { type: 'InvalidCredentials' }
  | { type: 'SessionExpired' }
  | { type: 'Unauthorized' }
```

### 2. Lost and Found Item Management Component

**Responsibilities:**
- Create and store lost item posts
- Create and store found item posts
- Search and retrieve items
- Associate verification questions with found items

**Interfaces:**

```typescript
interface ItemService {
  // Post a lost item
  postLostItem(userId: string, description: string): Result<LostItem, ItemError>
  
  // Post a found item with verification questions
  postFoundItem(
    userId: string, 
    description: string, 
    questions: string[]
  ): Result<FoundItem, ItemError>
  
  // Retrieve all lost items
  getLostItems(): LostItem[]
  
  // Retrieve all found items
  getFoundItems(): FoundItem[]
  
  // Search items by keyword
  searchItems(keyword: string, itemType: 'lost' | 'found'): Item[]
}

type LostItem = {
  id: string
  userId: string
  description: string
  timestamp: Date
}

type FoundItem = {
  id: string
  userId: string
  description: string
  verificationQuestions: string[]
  timestamp: Date
}

type ItemError =
  | { type: 'EmptyDescription' }
  | { type: 'DescriptionTooLong', maxLength: number }
  | { type: 'NoVerificationQuestions' }
  | { type: 'ItemNotFound', itemId: string }
```

### 3. Claim Verification Component

**Responsibilities:**
- Present verification questions to claimants
- Process claim requests with text-based answers
- Deliver claims to item finders

**Interfaces:**

```typescript
interface ClaimService {
  // Get verification questions for a found item
  getVerificationQuestions(foundItemId: string): Result<string[], ClaimError>
  
  // Submit a claim with text-based answers
  submitClaim(
    foundItemId: string, 
    claimantUserId: string, 
    answers: string[]
  ): Result<ClaimRequest, ClaimError>
  
  // Get claims for items posted by a user
  getClaimsForUser(userId: string): ClaimRequest[]
}

type ClaimRequest = {
  id: string
  foundItemId: string
  claimantUserId: string
  answers: string[]
  timestamp: Date
}

type ClaimError =
  | { type: 'ItemNotFound', itemId: string }
  | { type: 'AnswerCountMismatch', expected: number, received: number }
  | { type: 'EmptyAnswer', questionIndex: number }
```

### 4. Chat System Component

**Responsibilities:**
- Send and receive chat messages
- Handle anonymous and non-anonymous modes
- Store sender identity for admin access
- Retrieve chat history with appropriate anonymity

**Interfaces:**

```typescript
interface ChatService {
  // Send a chat message
  sendMessage(
    userId: string, 
    content: string, 
    isAnonymous: boolean
  ): Result<ChatMessage, ChatError>
  
  // Retrieve recent chat messages (applies anonymity rules)
  getRecentMessages(requestingUserId: string, limit: number): ChatMessage[]
  
  // Retrieve messages with full sender info (admin only)
  getMessagesWithSenderInfo(adminId: string): Result<ChatMessageWithSender[], ChatError>
}

type ChatMessage = {
  id: string
  content: string
  timestamp: Date
  senderDisplay: string  // "Anonymous" or actual username
  isAnonymous: boolean
}

type ChatMessageWithSender = {
  id: string
  content: string
  timestamp: Date
  actualSenderId: string
  isAnonymous: boolean
}

type ChatError =
  | { type: 'EmptyMessage' }
  | { type: 'Unauthorized' }
```

### 5. Activity Logging Component

**Responsibilities:**
- Log all user and admin actions
- Store activity records with timestamps
- Provide activity retrieval for admins

**Interfaces:**

```typescript
interface ActivityLogger {
  // Log an activity
  logActivity(
    userId: string, 
    actionType: ActionType, 
    details: string
  ): void
  
  // Retrieve all activities (admin only)
  getActivityLogs(adminId: string): Result<ActivityLog[], LogError>
}

type ActionType = 
  | 'LostItemPosted'
  | 'FoundItemPosted'
  | 'ClaimSubmitted'
  | 'ChatMessageSent'
  | 'AdminLogin'

type ActivityLog = {
  id: string
  userId: string
  actionType: ActionType
  details: string
  timestamp: Date
}

type LogError =
  | { type: 'Unauthorized' }
```

## Data Models

### User Account
```typescript
type UserAccount = {
  id: string
  username: string
  email: string
  isAdmin: boolean
  createdAt: Date
}
```

### Lost Item Record
```typescript
type LostItemRecord = {
  id: string
  userId: string
  description: string
  timestamp: Date
  status: 'active' | 'resolved'
}
```

### Found Item Record
```typescript
type FoundItemRecord = {
  id: string
  userId: string
  description: string
  verificationQuestions: string[]
  timestamp: Date
  status: 'active' | 'claimed'
}
```

### Claim Record
```typescript
type ClaimRecord = {
  id: string
  foundItemId: string
  claimantUserId: string
  answers: string[]
  timestamp: Date
  status: 'pending' | 'approved' | 'rejected'
}
```

### Chat Message Record
```typescript
type ChatMessageRecord = {
  id: string
  senderId: string
  content: string
  isAnonymous: boolean
  timestamp: Date
}
```

### Activity Log Record
```typescript
type ActivityLogRecord = {
  id: string
  userId: string
  actionType: string
  details: string
  timestamp: Date
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Authentication and Authorization Properties

**Property 1: Valid admin credentials grant access**
*For any* valid admin credentials, authenticating with those credentials should result in a successful admin session with access granted.
**Validates: Requirements 1.1**

**Property 2: Non-admin users cannot access admin functions**
*For any* non-admin user and any admin-only function, attempting to access that function should result in an authorization error.
**Validates: Requirements 1.2**

**Property 3: Admin identifiers are unique**
*For any* set of admin accounts in the system, all admin identifiers should be unique with no duplicates.
**Validates: Requirements 1.3**

**Property 4: Expired sessions require re-authentication**
*For any* expired admin session, attempting to perform an admin action should fail and require re-authentication.
**Validates: Requirements 1.4**

### Activity Logging Properties

**Property 5: All user actions are logged with required metadata**
*For any* user action (lost item post, found item post, claim submission, or chat message), the system should create an activity log entry containing timestamp, user identifier, and action type.
**Validates: Requirements 2.1, 2.3**

**Property 6: Activity logs are chronologically ordered**
*For any* sequence of logged activities, when an admin retrieves the activity logs, they should be ordered chronologically by timestamp.
**Validates: Requirements 2.2**

**Property 7: Admins can see actual sender IDs for all activities**
*For any* activity including anonymous chat messages, when an admin views the activity logs, the actual user identifier should be visible.
**Validates: Requirements 2.4**

### Item Posting Properties

**Property 8: Valid item posts create records with correct associations**
*For any* user and valid item description (lost or found), posting the item should create a record associated with that user's identifier and include a timestamp.
**Validates: Requirements 3.1, 3.3, 3.4, 4.1, 4.3, 4.4**

**Property 9: Empty descriptions are rejected**
*For any* string composed entirely of whitespace or empty string, attempting to post an item with that description should be rejected.
**Validates: Requirements 3.2, 4.2**

**Property 10: Description length validation**
*For any* description string, the system should accept descriptions up to 1000 characters and reject descriptions exceeding 1000 characters.
**Validates: Requirements 3.5, 4.5**

### Verification Question Properties

**Property 11: Found items can have multiple verification questions**
*For any* found item with one or more verification questions, the system should store all questions and associate them with that found item.
**Validates: Requirements 5.1, 5.4**

**Property 12: Verification questions are stored as free-form text**
*For any* verification question, the stored question should be free-form text without multiple choice options or structured format.
**Validates: Requirements 5.2, 5.5**

**Property 13: Found items require at least one verification question**
*For any* attempt to create a found item with zero verification questions, the system should reject the creation.
**Validates: Requirements 5.3**

### Claim Processing Properties

**Property 14: Claiming presents all verification questions**
*For any* found item with verification questions, when a user initiates a claim, all associated verification questions should be presented to the claimant.
**Validates: Requirements 6.1**

**Property 15: Claims require text-based answers for all questions**
*For any* claim submission, the system should require text-based answers for each verification question and create a claim request with those answers.
**Validates: Requirements 6.2, 6.3**

**Property 16: Claims are routed to the correct finder**
*For any* claim submission for a found item, the claim request should be delivered to the user who posted that found item.
**Validates: Requirements 6.4**

**Property 17: Claims are not automatically decided**
*For any* claim submission with any set of answers, the system should not automatically approve or reject the claim.
**Validates: Requirements 6.5**

### Anonymous Chat Properties

**Property 18: Anonymous messages hide sender identity from non-admins**
*For any* message sent in anonymous mode, when retrieved by a non-admin user, the sender's actual identity should not be visible and should display a generic identifier like "Anonymous".
**Validates: Requirements 7.1, 7.5**

**Property 19: Anonymous messages store actual sender ID internally**
*For any* message sent in anonymous mode, the system should store the actual sender's identifier in the database and make it visible to admins.
**Validates: Requirements 7.2, 7.3**

**Property 20: Users can toggle anonymity modes**
*For any* user, the system should allow switching between anonymous and non-anonymous chat modes.
**Validates: Requirements 7.4**

### Chat System Properties

**Property 21: Non-anonymous messages show sender identity**
*For any* message sent in non-anonymous mode, the sender's identifier should be visible to all users when the message is displayed.
**Validates: Requirements 8.1**

**Property 22: Anonymous and non-anonymous messages coexist**
*For any* chat interface containing both anonymous and non-anonymous messages, both types should be displayed together with clear visual distinction between them.
**Validates: Requirements 8.2, 8.3**

**Property 23: Messages maintain chronological ordering**
*For any* set of chat messages regardless of anonymity mode, when displayed or retrieved, they should be ordered chronologically by timestamp.
**Validates: Requirements 8.4, 9.1**

**Property 24: Chat messages persist with complete metadata**
*For any* chat message sent, the system should persist the message with timestamp, sender identifier, content, and anonymity flag.
**Validates: Requirements 9.2**

**Property 25: Anonymity rules apply based on user role**
*For any* chat message retrieval, the system should apply anonymity rules based on whether the requesting user is an admin (show actual IDs) or non-admin (hide anonymous sender IDs).
**Validates: Requirements 9.3**

**Property 26: Chat retrieval supports at least 100 messages**
*For any* chat history with more than 100 messages, the system should be able to retrieve at least the 100 most recent messages.
**Validates: Requirements 9.4**

### Item Search and Discovery Properties

**Property 27: All items are displayed in their respective sections**
*For any* set of lost items and found items, accessing the lost items section should display all lost items, and accessing the found items section should display all found items.
**Validates: Requirements 10.1, 10.2**

**Property 28: Items display in reverse chronological order**
*For any* set of items (lost or found), they should be displayed with the most recent items first in reverse chronological order.
**Validates: Requirements 10.3**

**Property 29: Keyword search returns matching items**
*For any* keyword and set of items, searching should return all items whose descriptions contain that keyword using case-insensitive matching.
**Validates: Requirements 10.4, 10.5**

## Error Handling

### Authentication Errors
- **Invalid Credentials**: Return clear error message without revealing whether username or password was incorrect (security best practice)
- **Session Expiration**: Return session expired error and redirect to login
- **Unauthorized Access**: Return 403 Forbidden with clear message about insufficient privileges

### Item Posting Errors
- **Empty Description**: Return validation error indicating description is required
- **Description Too Long**: Return validation error with maximum length information
- **Missing Verification Questions**: Return validation error for found items without questions
- **Invalid User**: Return error if user ID doesn't exist

### Claim Processing Errors
- **Item Not Found**: Return error if found item ID doesn't exist
- **Answer Count Mismatch**: Return error if number of answers doesn't match number of questions
- **Empty Answers**: Return validation error if any answer is empty

### Chat Errors
- **Empty Message**: Return validation error indicating message content is required
- **Unauthorized Chat Access**: Return error if user is not authenticated

### General Error Handling Principles
- All errors should include descriptive messages
- Sensitive information should not be leaked in error messages
- Errors should be logged for admin monitoring
- Client should receive appropriate HTTP status codes

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing as complementary approaches:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs through randomization

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Property-Based Testing Configuration

**Library Selection**: 
- For TypeScript/JavaScript: Use `fast-check` library
- For Python: Use `hypothesis` library
- For Java: Use `jqwik` library

**Test Configuration**:
- Each property test must run a minimum of 100 iterations
- Each test must include a comment tag referencing the design property
- Tag format: `// Feature: college-lost-found-app, Property {number}: {property_text}`

**Property Test Implementation**:
- Each correctness property listed above must be implemented as a single property-based test
- Tests should generate random valid inputs to verify properties hold universally
- Tests should include appropriate generators for users, items, messages, etc.

### Unit Testing Focus

Unit tests should focus on:
- Specific examples demonstrating correct behavior (e.g., posting a specific lost item)
- Edge cases (e.g., description exactly 1000 characters, empty strings)
- Error conditions (e.g., invalid credentials, missing required fields)
- Integration points between components (e.g., claim routing to correct user)

Avoid writing excessive unit tests for scenarios already covered by property tests. Property-based tests handle comprehensive input coverage through randomization.

### Test Coverage Goals

- All correctness properties implemented as property-based tests
- All error conditions covered by unit tests
- All edge cases identified in requirements covered by unit tests
- Integration tests for critical user flows (post item → claim → verify)

### Testing Phases

1. **Component Testing**: Test each component in isolation with mocked dependencies
2. **Integration Testing**: Test interactions between components
3. **End-to-End Testing**: Test complete user workflows
4. **Property Testing**: Run property-based tests with high iteration counts

### Continuous Testing

- Run unit tests on every code change
- Run property tests before merging to main branch
- Monitor test execution time and optimize slow tests
- Track test coverage metrics (aim for >80% code coverage)
