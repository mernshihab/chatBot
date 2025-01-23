# AI Chatbot with Speech Recognition

This project is a Next.js application that integrates an AI-powered chatbot with speech recognition. It uses a text generation effect and allows users to interact with the chatbot using both typed and voice input. The application is built with the latest technologies like Next.js, React, Tailwind CSS, and Framer Motion.

## Features

- **AI Chatbot**: Responds to user input using an AI service (configured with an API key).
- **Speech Recognition**: Uses browser speech recognition (SpeechRecognition API) to convert speech to text.
- **Text Animation**: Animated text rendering effect for AI responses.
- **Voice Input**: Users can talk to the chatbot using their voice with real-time transcription.

## Prerequisites

Before you start, ensure that you have the following installed:

- [Node.js](https://nodejs.org/) (Recommended version: 18.x or later)
- [npm](https://www.npmjs.com/get-npm)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone <repository-url>
   cd <project-folder>

2. Install the required dependencies:

   npm install

3. Create a .env file in the root of the project directory and add your AI API key. The API key is required for the chatbot to function correctly.

Example: .env file

AI_API_KEY=your-api-key-here

Running the Application
Once the dependencies are installed and the .env file is set up, you can run the app locally: