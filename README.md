# Support-Chat-System-


Frontend:
cd support-chat
cd client
cd vite-project
React part not fully done, but attempted it, you can go through the code.


Backend:
cd support-chat
cd server
Backend: 

start server: npm start (or if want to start with nodemon: npm run dev)

GET http://localhost:5000/

POST: Register:   http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}


POST: Login:   http://localhost:5000/api/auth/login

POST: Create Tickets: http://localhost:5000/api/tickets/
Body (JSON):
{
  "subject": "Issue with login",
  "message": "I cannot log in to my account."
}
Authorization: Bearer <user_token>


GET http://localhost:5000/api/tickets/me
Headers:
Authorization: Bearer <user_token>


POST http://localhost:5000/api/tickets/<ticket_id>/reply
Headers:
Authorization: Bearer <admin_token>
Body (JSON):
{
  "message": "We have resolved your issue."
}

POST http://localhost:5000/api/bot
Authorization: Bearer <admin_token>
Content-Type: application/json
Body:
{
  "title": "Welcome",
  "message": "Hi! How can I help you today?",
  "options": [
    { "label": "Create ticket", "createTicket": true }
  ],
  "isTerminal": false
}

GET  http://localhost:5000/api/bot/root

GET http://localhost:5000/api/bot/node/<_id>
