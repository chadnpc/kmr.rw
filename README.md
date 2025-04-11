# kmr: Full Stack Bike Marketplace

## Project Overview

kmr is a full-stack AI-powered bike marketplace designed to revolutionize the way users search, explore, and rent bikes. This project integrates advanced AI features with a modern and responsive user interface, providing a seamless experience for both renters and administrators.

## https://youtu.be/HyGi_SjQqV4

![KMR(1)](https://github.com/user-attachments/assets/dee04576-f30e-4ab8-af7d-f4633621379c)

### Make sure to create a `.env` file with following variables -

```
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=

ARCJET_KEY=
```

## Key Features

### AI-Powered Bike Search
- **Image Upload**: Users can upload any bike image to find similar bikes in the marketplace.
- **Advanced Filtering**: Search by maker, model, price range, and more to find the perfect bike.

### Detailed Bike Pages
- **Specifications**: Comprehensive bike details including specifications and high-quality image galleries.
- **Interactive EMI Calculator**: Helps renters make informed financial decisions.

### Test Ride Booking
- **Real-Time Availability**: Book test rides with real-time availability slots from dealerships.
- **Automated Confirmations**: Receive instant confirmations for test ride bookings.

### Admin Dashboard
- **Analytics**: Powerful analytics to monitor marketplace performance.
- **Bike Inventory Management**: Full control over bike inventory and user test ride management.
- **AI-Powered Bike Detail Extractor**: Automatically populates bike details by analyzing uploaded images, saving hours of manual data entry.

## Technical Stack

### Frontend
- **Next.js**: A React framework for building server-side rendered and static web applications.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **ShadCN UI**: A component library for building modern and responsive user interfaces.

### Backend
- **Prisma**: An ORM for database management, providing type-safe database access.

### AI Integration
- **Gemini AI**: Powers the AI-driven features such as image search and bike detail extraction.

### Authentication
- **Clerk**: A user management and authentication service for secure user login and registration.

### Deployment
- **Arcjet**: A platform for deploying and managing the application.

## Project Structure

The project is structured into several technical sections, each focusing on a specific aspect of the application:

1. **Landing Page**: A professional and modern landing page with AI image search and text search capabilities.
2. **Bike Listing Page**: Displays bikes with pre-applied filters for easy navigation.
3. **Admin Panel**: Controls featured bikes, analytics, and inventory management.
4. **AI Integration**: Implementation of AI features using Gemini AI.
5. **Deployment**: Deployment strategies using Arcjet.

## Getting Started

### Prerequisites
- Node.js and npm installed.
- A database setup for Prisma.
- API keys for Gemini AI and Clerk.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/kmr.git
   ```
2. Navigate to the project directory:
   ```bash
   cd kmr
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your API keys and database URL.

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the MIT License.
