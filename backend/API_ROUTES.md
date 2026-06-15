# Book Exchange API Documentation

## Authentication

### Register

POST /auth/register

Body:

```json
{
  "name": "Shubham",
  "email": "test@gmail.com",
  "password": "123456"
}
```

---

### Login

POST /auth/login

Body:

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

Returns JWT token.

---

## Books

### Add Book

POST /books

Authorization: Bearer TOKEN

```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "isbn": "123456",
  "category": "Fiction"
}
```

---

### Get All Books

GET /books

---

### Get My Books

GET /books/my-books

Authorization: Bearer TOKEN

---

### Search Books

GET /books/search?title=alchemist

---

### Update Book

PUT /books/:id

Authorization: Bearer TOKEN

---

### Delete Book

DELETE /books/:id

Authorization: Bearer TOKEN

---

## Requests

### Request Book

POST /requests/:bookId

Authorization: Bearer TOKEN

---

### Incoming Requests

GET /requests/incoming

Authorization: Bearer TOKEN

---

### Outgoing Requests

GET /requests/outgoing

Authorization: Bearer TOKEN

---

### Accept Request

PUT /requests/accept/:requestId

Authorization: Bearer TOKEN

---

### Reject Request

PUT /requests/reject/:requestId

Authorization: Bearer TOKEN

---

## Database Features

### View

available_books

### Index

idx_books_title

### Trigger

trigger_book_unavailable
