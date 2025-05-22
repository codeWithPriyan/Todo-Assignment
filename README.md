# Todo-Assignment

A full-stack application for managing personal to-do items, generating AI-powered summaries of pending tasks, and sending these summaries to Slack. Built with React (frontend) and Node.js (backend), this project demonstrates modern web development practices and seamless integration with LLM APIs and Slack.

Features -
  1.Add, edit, and delete to-do items
  2.View your current to-do list
  3.Generate a summary of all pending to-dos using a real LLM (e.g., Gemini, OpenAI, Cohere, etc.)
  4.Send the generated summary to a Slack channel with one click
  5.Visual feedback for Slack operation success or failure

Tech Stack -
Layer	Technology Choices
Frontend -	React
Backend -	Node.js (Express) 
Database -	Supabase
LLM -	Gemini
Slack -	Slack Incoming Webhooks

Setup Instructions -

1. Clone the Repository
   
   git clone https://github.com/codeWithPriyan/Todo-Assignment.git
   
   cd Todo-Assignment

3. Configure Environment Variables

    1.Copy .env.example to .env in both frontend and backend directories.
    2.Fill in the required variables:
       LLM API key ( GEMINI_API_KEY)
       Slack Webhook URL (SLACK_WEBHOOK_URL)
       Database credentials ( Supabase keys)

4. Install Dependencies

   Frontend:
   
     cd frontend
     npm install

   Backend:
   
     cd backend
     npm install

5. Run the Application Locally

    Start backend:

       npm run dev
      
    Start frontend 

       npm start
   
LLM Integration Setup

   1.Obtain an API Key
      Register for an API key with your chosen LLM provider (e.g., Gemini, OpenAI, Cohere).

   2.Add the API Key to Your Environment
      In your .env file:
      
         GEMINI_API_KEY = https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key

Backend Integration
The backend will use this key to send the current to-do list to the LLM and generate a summary.



Slack Integration Setup

  1.Go to your Slack workspace and create a new Incoming Webhook:
  
      a.Navigate to Slack API > Incoming Webhooks.
      
      b.Click Add New Webhook to Workspace.
      
      c.Choose the channel where summaries will be posted.
      
      d.Copy the generated Webhook URL.
      
  2.Paste this URL into your .env file as SLACK_WEBHOOK_URL.


Design & Architecture Decisions

  1.Frontend: Built with React for a responsive, component-based UI.
  
  2.Backend: Node.js (Express) or Java (Spring Boot) for RESTful API and integrations.
  
  3.Database: Supabase or Firebase for reliable, scalable storage.
  
  4.LLM Integration: Real-time summarization using a production LLM API.
  
  5.Slack Integration: Simple, secure posting via Slack Incoming Webhooks.
  
  6.Separation of Concerns: Clear division between frontend, backend, and service integrations for maintainability.

Deployed URL on vercel - https://todolist-tm66.vercel.app/
   

