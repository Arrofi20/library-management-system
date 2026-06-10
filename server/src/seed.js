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
    isbn: "9781119496489",
    available: 1
  },
  {
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "Databases",
    isbn: "9780078022159",
    available: 1
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Software Engineering",
    isbn: "9780132350884",
    available: 1
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Software Engineering",
    isbn: "9780201616224",
    available: 0
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    isbn: "9780262541962",
    available: 1
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "Databases",
    isbn: "9781491903063",
    available: 1
  },
  {
    title: "User Story Mapping",
    author: "Jeff Patton",
    category: "UX",
    isbn: "9781491904909",
    available: 1
  },
  {
    title: "Peopleware",
    author: "Tom DeMarco",
    category: "Management",
    isbn: "9780932633439",
    available: 0
  },
  {
    title: "The Phoenix Project",
    author: "Gene Kim",
    category: "Information Systems",
    isbn: "9781942788294",
    available: 0
  },
  {
    title: "Refactoring",
    author: "Martin Fowler",
    category: "Software Engineering",
    isbn: "9780201485677",
    available: 1
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
     VALUES (?, ?, ?, ?, ?)`
  );

  for (const user of demoUsers) {
    insertUser.run(user.name, user.memberId, user.email, hashPassword(user.password), user.role);
  }

  for (const book of sampleBooks) {
    insertBook.run(book.title, book.author, book.category, book.isbn, book.available ?? 1);
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
