const { initializeSchema, openDatabase, resetDemoData } = require("./db");
const { hashPassword } = require("./auth/passwords");

const demoUsers = [
  {
    name: "Demo Student",
    memberId: "STU-1001",
    email: "student@example.edu",
    password: "student123",
    role: "student"
  },
  {
    name: "Demo Librarian",
    memberId: "LIB-0001",
    email: "librarian@example.edu",
    password: "librarian123",
    role: "librarian"
  }
];

const sampleBooks = [
  {
    title: "Systems Analysis and Design",
    author: "Alan Dennis",
    category: "Information Systems",
    isbn: "9781119496489"
  },
  {
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "Databases",
    isbn: "9780078022159"
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Software Engineering",
    isbn: "9780132350884"
  }
];

function seedDemoData() {
  const db = openDatabase();
  initializeSchema(db);
  resetDemoData(db);

  const insertUser = db.prepare(
    `INSERT INTO users (name, member_id, email, password_hash, role)
     VALUES (?, ?, ?, ?, ?)`
  );
  const insertBook = db.prepare(
    `INSERT INTO books (title, author, category, isbn, available)
     VALUES (?, ?, ?, ?, 1)`
  );

  for (const user of demoUsers) {
    insertUser.run(user.name, user.memberId, user.email, hashPassword(user.password), user.role);
  }

  for (const book of sampleBooks) {
    insertBook.run(book.title, book.author, book.category, book.isbn);
  }

  return {
    users: demoUsers.length,
    books: sampleBooks.length
  };
}

if (require.main === module) {
  const result = seedDemoData();
  console.log(`Seeded ${result.users} users and ${result.books} books.`);
}

module.exports = {
  demoUsers,
  sampleBooks,
  seedDemoData
};
