# Smart Winner — Event Booking Frontend

A modern React-based frontend for an event management and booking platform. Users can browse events, book tickets, make payments via Stripe, and manage their bookings. Admins have a dedicated panel for managing events, users, and bookings.

## Tech Stack

- **React 18** with Vite
- **React Router v6** — client-side routing with protected & admin routes
- **Axios** — API communication
- **Stripe** (`@stripe/react-stripe-js`) — payment processing
- **react-hot-toast** — notifications
- **react-icons** — icon library
- **date-fns** — date utilities

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- A running backend API (see `VITE_API_URL` in `.env`)

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start Vite dev server           |
| `npm run build`   | Build for production            |
| `npm run preview` | Preview the production build    |

## Project Structure

```
src/
├── api/            # Axios instance & API config
├── components/
│   ├── common/     # ProtectedRoute, AdminRoute, LoadingSpinner
│   ├── events/     # EventCard
│   └── layout/     # Navbar, Footer, Layout
├── context/        # AuthContext (authentication state)
├── pages/
│   ├── admin/      # Dashboard, Manage Events/Users/Bookings
│   └── ...         # Home, Events, Bookings, Payment, Profile, etc.
├── styles/         # Global CSS
├── App.jsx         # Route definitions & AdminLayout
└── main.jsx        # Entry point
```

## Key Features

- **Public pages** — Home, Events listing, Event detail, Calendar
- **Authentication** — Login & Register with protected routes
- **Bookings** — View, manage, and pay for event bookings
- **Stripe Payments** — Secure checkout integration
- **Admin Panel** — Sidebar layout with dashboard, event/user/booking management
- **Responsive UI** — Mobile-friendly design

## License

This project is private.
