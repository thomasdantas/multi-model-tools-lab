import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import pgp from "pg-promise";
import { z } from "zod";

const server = new McpServer({
    name: "Books MCP",
    version: "1.0.0"
});

const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

server.tool("get_books", "Get all books with author and publisher information", {}, async () => {
    const books = await connection.query(`
        SELECT b.id, b.title, b.pages, a.name as author, p.name as publisher
        FROM books b
        JOIN authors a ON b.author_id = a.id
        JOIN publishers p ON b.publisher_id = p.id
        ORDER BY b.id
    `);
    return {
        content: [{
            type: "text",
            text: JSON.stringify(books, undefined, 2)
        }]
    };
});

server.tool("get_book_by_id", "Get a specific book by ID", {
    bookId: z.number().describe("The book ID")
}, async ({ bookId }) => {
    const book = await connection.oneOrNone(`
        SELECT b.id, b.title, b.pages, a.name as author, p.name as publisher
        FROM books b
        JOIN authors a ON b.author_id = a.id
        JOIN publishers p ON b.publisher_id = p.id
        WHERE b.id = $1
    `, [bookId]);
    if (!book) {
        return {
            content: [{
                type: "text",
                text: `Book with ID ${bookId} not found`
            }]
        };
    }
    return {
        content: [{
            type: "text",
            text: JSON.stringify(book, undefined, 2)
        }]
    };
});

server.tool("get_authors", "Get all authors", {}, async () => {
    const authors = await connection.query(`
        SELECT id, name FROM authors ORDER BY name
    `);
    return {
        content: [{
            type: "text",
            text: JSON.stringify(authors, undefined, 2)
        }]
    };
});

server.tool("get_books_by_author", "Get all books by a specific author", {
    authorName: z.string().describe("The author name")
}, async ({ authorName }) => {
    const books = await connection.query(`
        SELECT b.title, b.pages, p.name as publisher
        FROM books b
        JOIN authors a ON b.author_id = a.id
        JOIN publishers p ON b.publisher_id = p.id
        WHERE a.name ILIKE $1
        ORDER BY b.title
    `, [`%${authorName}%`]);
    return {
        content: [{
            type: "text",
            text: JSON.stringify(books, undefined, 2)
        }]
    };
});

server.tool("get_publishers", "Get all publishers", {}, async () => {
    const publishers = await connection.query(`
        SELECT id, name FROM publishers ORDER BY name
    `);
    return {
        content: [{
            type: "text",
            text: JSON.stringify(publishers, undefined, 2)
        }]
    };
});

server.tool("get_books_by_publisher", "Get all books by a specific publisher", {
    publisherName: z.string().describe("The publisher name")
}, async ({ publisherName }) => {
    const books = await connection.query(`
        SELECT b.title, b.pages, a.name as author
        FROM books b
        JOIN authors a ON b.author_id = a.id
        JOIN publishers p ON b.publisher_id = p.id
        WHERE p.name ILIKE $1
        ORDER BY b.title
    `, [`%${publisherName}%`]);
    return {
        content: [{
            type: "text",
            text: JSON.stringify(books, undefined, 2)
        }]
    };
});

server.tool("get_author_stats", "Get statistics about books and pages by author", {}, async () => {
    const stats = await connection.query(`
        SELECT a.name as author, COUNT(*) as total_books, SUM(b.pages) as total_pages, ROUND(AVG(b.pages)) as avg_pages
        FROM books b
        JOIN authors a ON b.author_id = a.id
        GROUP BY a.id, a.name
        ORDER BY total_pages DESC
    `);
    return {
        content: [{
            type: "text",
            text: JSON.stringify(stats, undefined, 2)
        }]
    };
});

server.tool("get_publisher_stats", "Get statistics about books and pages by publisher", {}, async () => {
    const stats = await connection.query(`
        SELECT p.name as publisher, COUNT(*) as total_books, SUM(b.pages) as total_pages, ROUND(AVG(b.pages)) as avg_pages
        FROM books b
        JOIN publishers p ON b.publisher_id = p.id
        GROUP BY p.id, p.name
        ORDER BY total_books DESC
    `);
    return {
        content: [{
            type: "text",
            text: JSON.stringify(stats, undefined, 2)
        }]
    };
});

server.tool("search_books", "Search books by title", {
    title: z.string().describe("The book title to search for")
}, async ({ title }) => {
    const books = await connection.query(`
        SELECT b.id, b.title, b.pages, a.name as author, p.name as publisher
        FROM books b
        JOIN authors a ON b.author_id = a.id
        JOIN publishers p ON b.publisher_id = p.id
        WHERE b.title ILIKE $1
        ORDER BY b.title
    `, [`%${title}%`]);
    return {
        content: [{
            type: "text",
            text: JSON.stringify(books, undefined, 2)
        }]
    };
});

const transport = new StdioServerTransport();
server.connect(transport);
