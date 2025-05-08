# Broadcast Management System

A modern web application for managing and tracking broadcast messages, built with React and Vite. This system enables efficient management of broadcast communications with real-time tracking and analytics.

## Features

- **Broadcast Message Management**
  - Create and manage broadcast messages
  - Support for template messages and regular messages
  - Media attachment support (images and videos)
  - Message deletion and status management
  - Customer list selection

- **Message Scheduling**
  - One-time message scheduling
  - Date and time selection with 15-minute intervals
  - Instant or scheduled delivery options
  - Schedule date validation

- **Message Status Tracking**
  - Real-time delivery status monitoring
  - Multiple status states (Live, Sent, Scheduled, Stopped, Paused)
  - Message funnel analytics
  - Click-through tracking

- **Message Funnel Analytics**
  - Total contacts tracking
  - Message delivery status
  - Read receipts
  - Click-through rates
  - Visual funnel representation

- **User Interface**
  - Responsive design for all devices
  - Intuitive broadcast creation flow
  - Real-time status updates
  - Advanced search and filtering
  - Bulk selection and actions
  - Custom date and file inputs
  - Alert and confirmation dialogs

## Tech Stack

- **Frontend**
  - React 18.x
  - Vite 4.x
  - Tailwind CSS 3.x
  - React Icons 4.x
  - React DatePicker for scheduling
  - React Router for navigation

- **Development Tools**
  - ESLint for code linting
  - Prettier for code formatting
  - React Testing Library
  - Husky for git hooks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn (v1.22 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [your-project-name]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration values.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── assets/           # Static assets and images
├── components/       # Shared components
├── config/          # Configuration files
├── features/        # Feature-based modules
│   ├── broadcast/   # Broadcast management
│   │   ├── components/
│   │   │   ├── AlertDialog.jsx
│   │   │   ├── BroadcastForm.jsx
│   │   │   ├── BroadcastHeader.jsx
│   │   │   ├── BroadcastTable.jsx
│   │   │   ├── ConfirmationDialog.jsx
│   │   │   ├── CustomDateInput.jsx
│   │   │   ├── CustomFileInput.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── MediaPreview.jsx
│   │   │   ├── MessageTypeSelector.jsx
│   │   │   ├── RegularMessage.jsx
│   │   │   ├── ScheduleSelector.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── Broadcast.jsx
│   │   ├── BroadcastDashboard.jsx
│   │   ├── BroadcastPages.jsx
│   │   └── BroadcastStats.jsx
│   ├── chats/       # Chat functionality
│   ├── contacts/    # Contact management
│   ├── dashboard/   # Dashboard views
│   ├── help/        # Help and documentation
│   ├── settings/    # Application settings
│   └── templates/   # Message templates
├── layouts/         # Layout components
├── utils/           # Utility functions
├── App.jsx          # Main application component
├── index.css        # Global styles
└── main.jsx         # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Testing

The project uses Jest and React Testing Library for testing. Run tests using:

```bash
npm run test
```

For test coverage:

```bash
npm run test:coverage
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. The build output will be in the `dist` directory

3. Deploy the contents of the `dist` directory to your hosting provider

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies (`npm install`)
4. Make your changes
5. Run tests (`npm run test`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.