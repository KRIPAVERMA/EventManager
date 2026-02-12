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

## Screenshots
-Sign up / Login Page
<img width="940" height="433" alt="image" src="https://github.com/user-attachments/assets/46d7a5f3-b7cb-41a3-89e4-b0c17fbba308" />

-Home Page
<img width="940" height="452" alt="image" src="https://github.com/user-attachments/assets/2bcfda28-a890-4597-a07d-739e6d6de2b2" />
<img width="940" height="454" alt="image" src="https://github.com/user-attachments/assets/63ec3dcf-b4f8-477d-a366-11919c9e0c5d" />
<img width="940" height="454" alt="image" src="https://github.com/user-attachments/assets/3ac25ecf-b65f-41a1-9d22-e6f61ff13a69" />

-Event Page
<img width="940" height="453" alt="image" src="https://github.com/user-attachments/assets/f2a702cc-6304-488f-adec-1f0d202fff0a" />
<img width="940" height="445" alt="image" src="https://github.com/user-attachments/assets/975c2aac-44ce-4ead-9fc5-f43634f85051" />

-Booking Page
<img width="940" height="453" alt="image" src="https://github.com/user-attachments/assets/dbdca2cb-ea0f-4d75-9515-9153cf74bb56" />

-Calander Page
<img width="940" height="444" alt="image" src="https://github.com/user-attachments/assets/7b23ad81-c77f-4e93-88b4-00bbe75f4d1e" />

-Payments Page
<img width="940" height="454" alt="image" src="https://github.com/user-attachments/assets/ba47da3c-5f08-437f-9558-4c3d9f1ef011" />
<img width="940" height="438" alt="image" src="https://github.com/user-attachments/assets/d041cd8e-9380-4e1b-9fac-1e5f75c57034" />

-Booking Details
<img width="940" height="444" alt="image" src="https://github.com/user-attachments/assets/9503bfb0-2362-4f58-8338-41836c613570" />

-Admin Page
<img width="940" height="453" alt="image" src="https://github.com/user-attachments/assets/34806349-4976-4d39-9abf-fbdb6ccf93fb" />
<img width="940" height="449" alt="image" src="https://github.com/user-attachments/assets/71cee31b-0933-42e9-a586-4652287da8eb" />

-User Panel
<img width="940" height="442" alt="image" src="https://github.com/user-attachments/assets/64130a3c-7238-4a3a-885a-abdcad71a45c" />

-Manage Bookings
<img width="940" height="445" alt="image" src="https://github.com/user-attachments/assets/696789f2-64b4-4476-9047-6f6f4db43cd6" />
<img width="940" height="436" alt="image" src="https://github.com/user-attachments/assets/44881d75-d747-4b7d-a948-d704956b7292" />

-Events and Ticket details
<img width="940" height="448" alt="image" src="https://github.com/user-attachments/assets/e956c555-00a3-414e-8d75-13f9a76e0e2e" />

-Create Event
<img width="940" height="452" alt="image" src="https://github.com/user-attachments/assets/71ac585d-c496-45c2-8cff-1c76d911779b" />
<img width="940" height="453" alt="image" src="https://github.com/user-attachments/assets/abbce3e5-1621-41d7-8543-8a96ea59db95" />

-Admin Profile
<img width="940" height="448" alt="image" src="https://github.com/user-attachments/assets/2bfa1690-febf-4dfd-b531-16cd2a59f735" />

-Stripe Dashboard
<img width="940" height="448" alt="image" src="https://github.com/user-attachments/assets/74a0a8b2-f848-43b6-be6d-41beaf8801b6" />
<img width="940" height="453" alt="image" src="https://github.com/user-attachments/assets/26869725-549b-42ea-8f7c-bcd74d9c05cd" />
<img width="940" height="444" alt="image" src="https://github.com/user-attachments/assets/1e3166f8-ca42-4116-98f2-55daca277b91" />

-Video of Website
https://github.com/user-attachments/assets/36c5e982-40b9-48f3-9614-f425a92971be



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
