# Database Documentation

## Overview

Database schema for managing books, authors, and publishers. The schema follows normalization principles (3NF) to eliminate data redundancy.

## Tables

### authors

Stores information about book authors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Author's full name |

### publishers

Stores information about book publishers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Publisher's name |

### books

Stores information about books with references to authors and publishers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Book title |
| pages | INTEGER | NOT NULL | Number of pages |
| author_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to authors.id |
| publisher_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to publishers.id |

## Relationships

```
authors (1) ←──── (N) books (N) ────→ (1) publishers
```

- **authors → books**: One author can have many books (1:N)
- **publishers → books**: One publisher can have many books (1:N)

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     authors     │       │      books      │       │   publishers    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │   ┌───│ id (PK)         │
│ name            │   └──→│ title           │←──┘   │ name            │
│                 │       │ pages           │       │                 │
│                 │       │ author_id (FK)  │       │                 │
│                 │       │ publisher_id(FK)│       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

## Common Queries

### List all books with author and publisher names

```sql
SELECT b.id, b.title, b.pages, a.name as author, p.name as publisher
FROM books b
JOIN authors a ON b.author_id = a.id
JOIN publishers p ON b.publisher_id = p.id
ORDER BY b.id;
```

### Count books and total pages by author

```sql
SELECT a.name as author, COUNT(*) as total_books, SUM(b.pages) as total_pages
FROM books b
JOIN authors a ON b.author_id = a.id
GROUP BY a.id, a.name
ORDER BY total_pages DESC;
```

### Average pages per book by author

```sql
SELECT a.name as author, COUNT(*) as total_books, ROUND(AVG(b.pages)) as avg_pages
FROM books b
JOIN authors a ON b.author_id = a.id
GROUP BY a.id, a.name
ORDER BY avg_pages DESC;
```

### Group by author's first letter

```sql
SELECT SUBSTRING(a.name, 1, 1) as initial, COUNT(*) as total_books, SUM(b.pages) as total_pages
FROM books b
JOIN authors a ON b.author_id = a.id
GROUP BY SUBSTRING(a.name, 1, 1)
ORDER BY initial;
```

### Find books by a specific author

```sql
SELECT b.title, b.pages, p.name as publisher
FROM books b
JOIN authors a ON b.author_id = a.id
JOIN publishers p ON b.publisher_id = p.id
WHERE a.name = 'Machado de Assis';
```

### Find books by a specific publisher

```sql
SELECT b.title, b.pages, a.name as author
FROM books b
JOIN authors a ON b.author_id = a.id
JOIN publishers p ON b.publisher_id = p.id
WHERE p.name = 'José Olympio';
```

## Sample Data

The database is populated with famous Brazilian literature including works from:

- Machado de Assis
- Jorge Amado
- Clarice Lispector
- Graciliano Ramos
- Guimarães Rosa
- José de Alencar
- Carlos Drummond de Andrade
- Euclides da Cunha
