Coding Fundamentals & Best Practices
A comprehensive guide for building robust, maintainable projects in Cursor AI.

Code Quality Fundamentals
Write Clear, Self-Documenting Code
Use descriptive variable and function names that reveal intent
Prefer getUserById(id) over get(id) or fetchData(x)
Keep functions small and focused on a single responsibility
Add comments only when the "why" isn't obvious from the code itself
Follow Consistent Naming Conventions
Variables/Functions: camelCase (userData, fetchUserData)
Classes/Components: PascalCase (UserProfile, DataService)
Constants: UPPER_SNAKE_CASE (MAX_RETRY_ATTEMPTS, API_BASE_URL)
Files: Match your framework conventions (kebab-case, PascalCase, etc.)

Edge Case Handling
Always Consider Edge Cases
Null/Undefined: Check for missing or undefined values
Empty Collections: Handle empty arrays, objects, and strings
Boundary Values: Test min/max values, zero, negative numbers
Invalid Input: Validate and sanitize all user input
Network Failures: Handle timeouts, connection errors, and partial data
Race Conditions: Consider concurrent operations and async timing
Defensive Programming
// Bad
function divide(a, b) {
  return a / b;
}

// Good
function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}


Code Reusability
DRY Principle (Don't Repeat Yourself)
Extract repeated logic into utility functions
Create shared components for common UI patterns
Use configuration objects instead of duplicating similar code
Build composable functions that can be combined in different ways
Create Reusable Utilities
Location: Organize in /utils, /helpers, or /lib directories
Scope: Keep utilities pure and framework-agnostic when possible
Documentation: Include JSDoc comments with usage examples
Testing: Write unit tests for all utility functions
Component/Module Design
Design components with props/parameters for flexibility
Avoid hard-coded values; use configuration or props instead
Implement composition over inheritance
Keep components focused and single-purpose

Scalability Considerations
Performance Optimization
Lazy Loading: Load code and assets only when needed
Memoization: Cache expensive computations
Debouncing/Throttling: Control frequency of expensive operations
Pagination: Don't load all data at once
Virtual Scrolling: For large lists and tables
Code Splitting: Break bundles into smaller chunks
Data Management
Use appropriate data structures (Map vs Object, Set vs Array)
Consider database indexing for frequently queried fields
Implement caching strategies (in-memory, Redis, CDN)
Plan for data growth and archival strategies
Architecture
Separate concerns (UI, business logic, data access)
Design for horizontal scaling where applicable
Use dependency injection for testability and flexibility
Plan for feature flags and gradual rollouts

Error Handling
Comprehensive Error Management
// Wrap risky operations in try-catch
async function fetchUserData(userId) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`User ${userId} not found`);
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error, please try again later');
    }
    throw new Error('Failed to fetch user data');
  }
}

Error Boundaries and Fallbacks
Implement error boundaries in React or equivalent in other frameworks
Provide meaningful error messages to users
Log errors with sufficient context for debugging
Have fallback UI for graceful degradation

Version Control Best Practices
Commit in Small, Logical Increments
One Feature/Fix per Commit: Each commit should represent a single logical change
Atomic Commits: Changes should be complete and not break the build
Commit Often: Don't wait until end of day; commit working increments
Write Meaningful Commit Messages
Format: <type>: <subject>

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code restructuring without behavior change
- docs: Documentation changes
- style: Formatting, missing semicolons, etc.
- test: Adding or updating tests
- chore: Maintenance tasks

Examples:
feat: add user authentication with JWT
fix: resolve memory leak in data polling
refactor: extract validation logic into separate module

Branching Strategy
Use feature branches for new work (feature/user-auth)
Keep main/master branch always deployable
Use pull requests for code review
Delete branches after merging

Testing Strategy
Test Coverage Priorities
Unit Tests: Test individual functions and components in isolation
Integration Tests: Test how modules work together
E2E Tests: Test critical user journeys
Edge Cases: Explicitly test boundary conditions and error scenarios
Write Testable Code
Keep functions pure when possible (same input = same output)
Inject dependencies rather than hard-coding them
Avoid side effects in business logic
Use interfaces/abstractions to enable mocking

Code Organization
Project Structure
/src
  /components      # Reusable UI components
  /features        # Feature-based modules
  /hooks           # Custom React hooks (or equivalent)
  /utils           # Pure utility functions
  /services        # API calls, external services
  /types           # TypeScript types/interfaces
  /constants       # App-wide constants
  /config          # Configuration files
  /tests           # Test files (or colocated with source)

File Organization Principles
Group related files together
Keep files focused and under 300 lines when possible
Use index files for clean imports
Separate concerns (presentation vs logic)

Documentation
Code Documentation
README: Project setup, dependencies, and getting started
JSDoc/TSDoc: Document public APIs and complex functions
Architecture Decisions: Document why, not just what
Inline Comments: Explain complex algorithms and non-obvious code
Keep Documentation Updated
Update docs when changing functionality
Include examples in documentation
Document environment variables and configuration
Maintain a changelog for significant changes

Security Best Practices
Input Validation & Sanitization
Never trust user input
Validate on both client and server
Use parameterized queries to prevent SQL injection
Sanitize HTML to prevent XSS attacks
Sensitive Data
Never commit secrets, API keys, or passwords to version control
Use environment variables for configuration
Implement proper authentication and authorization
Encrypt sensitive data at rest and in transit
Dependencies
Regularly update dependencies
Audit for known vulnerabilities (npm audit, yarn audit)
Use lock files to ensure consistent installs
Review dependency licenses

Performance Monitoring
Establish Baselines
Measure bundle size and track over time
Monitor page load times
Track API response times
Set performance budgets
Optimize Iteratively
Profile before optimizing (don't guess)
Focus on user-perceived performance
Optimize the critical rendering path
Use browser DevTools and Lighthouse

Code Review Checklist
Before submitting code for review, verify:
[ ] Code follows project style guidelines
[ ] Edge cases are handled appropriately
[ ] No hardcoded values that should be configurable
[ ] Error handling is comprehensive
[ ] Tests are included and passing
[ ] Documentation is updated
[ ] No console.logs or debug code remains
[ ] Performance impact is considered
[ ] Security implications are reviewed
[ ] Commits are atomic and well-messaged

Continuous Improvement
Regular Refactoring
Schedule time for technical debt reduction
Refactor when you touch code (Boy Scout Rule)
Don't over-engineer; refactor when patterns emerge
Keep refactoring separate from feature work
Stay Current
Follow language/framework updates
Learn new patterns and best practices
Share knowledge with your team
Review and update this template as you learn

Quick Reference Principles
SOLID Principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
KISS: Keep It Simple, Stupid
YAGNI: You Aren't Gonna Need It (don't over-engineer)
DRY: Don't Repeat Yourself
Separation of Concerns: Keep different aspects of code separate
Composition Over Inheritance: Prefer flexible composition
Fail Fast: Catch errors early and loudly during development
Convention Over Configuration: Follow established patterns

Use this document as a living template. Adapt it to your specific project needs and technology stack.
Before writing any code, describe your approach and wait for approval. Always ask clarifying questions before writing any code if requirements are ambiguous.
If a task requires changes to more than 3 files, stop and break it into smaller tasks first.
After writing code, list what could break and suggest tests to cover it.
When there’s a bug, start by writing a test that reproduces it, then fix it until the test passes.
Every time I correct you, add a new rule to this .md file so it never happens again.
