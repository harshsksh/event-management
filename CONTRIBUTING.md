# Contributing to Event Management App

Thank you for your interest in contributing to the Event Management App! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🚀 Getting Started

1. **Fork the repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/event-management.git
   cd event-management
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/event-management.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

## 🌿 Branch Naming Convention

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `docs/documentation-update` - Documentation updates
- `refactor/refactor-description` - Code refactoring
- `test/test-description` - Adding or updating tests

Examples:
- `feature/event-search`
- `bugfix/login-error`
- `docs/api-documentation`

## 💻 Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add event search functionality"
   ```

5. **Keep your branch up to date**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template
   - Submit the PR

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(events): add event search functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(dashboard): improve responsive layout
refactor(api): optimize event query performance
test(events): add unit tests for event creation
chore(deps): update dependencies
```

## 🎨 Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for all new code
- Use functional components with hooks
- Use async/await over promises
- Prefer const over let
- Use meaningful variable names
- Add type annotations for function parameters and return values

### React Components
```typescript
// ✅ Good
interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
}

export default function EventCard({ event, onRegister }: EventCardProps) {
  const handleClick = () => {
    onRegister(event.id);
  };

  return (
    <div className="card">
      <h3>{event.title}</h3>
      <button onClick={handleClick}>Register</button>
    </div>
  );
}

// ❌ Bad
export default function EventCard(props: any) {
  return (
    <div>
      <h3>{props.event.title}</h3>
    </div>
  );
}
```

### API Routes
```typescript
// ✅ Good
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const events = await Event.find().lean();
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// ❌ Bad
export async function GET(req: NextRequest) {
  const events = await Event.find();
  return NextResponse.json(events);
}
```

### CSS/Tailwind
- Use Tailwind utility classes
- Create reusable component classes in globals.css
- Use responsive prefixes (sm:, md:, lg:)
- Keep consistent spacing

```tsx
// ✅ Good
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <h1 className="text-3xl font-bold text-gray-900 mb-6">Events</h1>
</div>

// ❌ Bad
<div style={{ maxWidth: '1280px', padding: '20px' }}>
  <h1 style={{ fontSize: '30px', fontWeight: 'bold' }}>Events</h1>
</div>
```

## 🧪 Testing Guidelines

While tests aren't currently implemented, future contributions should include:

- Unit tests for utility functions
- Integration tests for API routes
- Component tests for React components
- End-to-end tests for critical user flows

## 📚 Documentation

When adding new features:

1. **Update README.md** if the feature affects setup or usage
2. **Update API_DOCUMENTATION.md** for new API endpoints
3. **Add inline code comments** for complex logic
4. **Update TypeScript types** in type definition files

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node version, browser, etc.
6. **Screenshots**: If applicable

Use the bug report template when creating an issue.

## ✨ Feature Requests

When requesting features, please include:

1. **Description**: Clear description of the feature
2. **Use Case**: Why this feature is needed
3. **Proposed Solution**: How you envision it working
4. **Alternatives**: Other solutions you've considered

## 🔍 Code Review Process

All submissions require review:

1. **Automated Checks**: Must pass linting and build
2. **Code Review**: At least one maintainer approval
3. **Testing**: Changes should be tested
4. **Documentation**: Relevant docs should be updated

Reviewers will check for:
- Code quality and style
- Performance implications
- Security concerns
- Test coverage
- Documentation completeness

## 📋 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests passing

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests that prove fix/feature works
- [ ] New and existing tests pass

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #(issue number)
```

## 🎯 Areas for Contribution

Good first issues:
- UI/UX improvements
- Additional validation
- Error message improvements
- Documentation updates
- Code comments
- Test coverage

Advanced contributions:
- Event search and filtering
- Event categories/tags
- Email notifications
- Calendar integration
- Social sharing
- Admin panel
- Analytics dashboard
- Mobile app

## 🙏 Recognition

Contributors will be:
- Listed in the README
- Acknowledged in release notes
- Given credit in commit history

## 📞 Questions?

- Open an issue with the "question" label
- Join our discussions
- Reach out to maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Event Management App! 🎉

