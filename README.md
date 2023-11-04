# AILift

<img src="frontend/src/assets/images/ailift-logo.png" alt="AILift Logo" width="100"/>

AILift is a fitness application aimed at helping users plan and track their fitness journey with ease. It enables the creation of personalized workout routines, facilitates linear progression for strength training, and allows for tracking of workout performance.

## Features

- **Routine Customization**: Users can create routines tailored to their fitness goals.
- **Progress Tracking**: Linear progression guidance helps users increase workout intensity systematically.
- **Performance Insights**: The app provides tracking and visualization of workout data.

## Local Development Version

This version of AILift is configured for local development and testing. It is not intended for production deployment. It features a Dockerized environment with services for the backend, frontend, and a PostgreSQL database. For convenience, the database is pre-seeded with muscle groups and exercises, allowing new users to explore the app's features immediately.

### MailHog for Email Testing

MailHog is included as part of the local setup to simulate an email service. It captures outgoing emails from the backend, allowing developers to test email-related features like account verification and password resets without sending actual emails to users' mailboxes.

### Environment Variables

The use of environment variables in the `docker-compose.yml` file enables easy configuration management without hardcoding sensitive details. This approach facilitates the setup process for new developers and maintains security best practices.

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Initial Setup

1. **Clone the repository**:

    ```sh
    git clone https://github.com/varoal/ailift.git
    cd ailift
    ```

2. **Start the application**:

    ```sh
    docker-compose up
    ```

    This command orchestrates the build and deployment of the necessary services.

### Accessing the Application

- **Frontend**: Open `http://localhost:4200` in your web browser.
- **Backend API**: Accessible at `http://localhost:3000`.
- **MailHog Interface**: View captured emails at `http://localhost:8025`.

## Usage

After setting up the application, navigate to the front-end URL to register an account. You can then create workout routines, add exercises, and begin tracking your workouts with the assistance of AILift's linear progression system.

## Future Plans

- **AI-Supported Progression Tools**: We aim to integrate artificial intelligence to provide advanced progression tools that will analyze performance data and offer smarter training recommendations.

- **Migration to React & React Native**: Upcoming versions will focus on transitioning the application to a React-based frontend for the web and React Native for mobile platforms, enhancing the user interface and user experience across devices.

- **Enhanced UI/UX**: Aiming for a fluid and intuitive interaction with the app, the upcoming UX/UI redesign will prioritize user-friendly features and workflows that enhance the overall quality of usage and engagement with the app's capabilities.

## Versioning

This local version `1.1.0` introduces Docker support for simplified setup and pre-seeded exercise data for immediate exploration.

## Support

If you encounter any issues or require assistance, please open an issue on the [GitHub repository](https://github.com/varoal/ailift/issues).

## Contributing

We welcome contributions to AILift! If you have suggestions or improvements, please fork the repository, make your changes, and submit a pull request.
