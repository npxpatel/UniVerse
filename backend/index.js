const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '7860',
  database: 'college_management_system',
});


db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;


  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

      
      const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', {
        expiresIn: '1h',
      });

      res.json({ token, role: user.role });
   
  });
});


app.get('/api/users', (req, res) => {
  db.query('SELECT id, email, role FROM Users', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

//add user
app.post('/api/users', async (req, res) => {
  const { email, password, role } = req.body;
  try {

    db.query('INSERT INTO Users (email, password, role) VALUES (?, ?, ?)', [email, password, role], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

  
      if (role === 'student') {
        const userId = results.insertId;  
        db.query('INSERT INTO Students (id , user_id) VALUES (? , ?)', [userId , userId], (err, studentResults) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to insert into Student table' });
          }
          res.status(201).json({ message: 'Student created successfully' });
        });
      } else {
        res.status(201).json({ message: 'User created successfully' });
      }
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Server error');
  }
});

//delete user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Users WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'User deleted successfully' });
  });
});




//student route hai :
app.get('/api/courses', (req, res) => {
  db.query('SELECT * FROM Courses', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
  // res.status(200).json({msg : "OK"});
});


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) return res.sendStatus(401); 

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403); 

    req.user = user; 
    next();
  });
};


app.post('/api/enroll', authenticateToken , (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const userId = req.user.id; 
  const { course_id } = req.body;

 
  db.query('SELECT id FROM students WHERE id = ?', [userId], (err, studentResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (studentResults.length === 0)
      return res.status(404).json({ error: 'Student record not found' , userId });

    const student_id = studentResults[0].id;

    db.query(
      'SELECT * FROM Enrollments WHERE student_id = ? AND course_id = ?',
      [student_id, course_id],
      (err, enrollmentResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (enrollmentResults.length > 0)
          return res.status(400).json({ error: 'Already enrolled' });

        
        db.query(
          'INSERT INTO Enrollments (student_id, course_id) VALUES (?, ?)',
          [student_id, course_id],
          (err, insertResult) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Enrolled successfully' });
          }
        );
      }
    );
  });
});



app.get('/api/enrolled-courses', authenticateToken, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const userId = req.user.id; 


  db.query('SELECT id FROM Students WHERE user_id = ?', [userId], (err, studentResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (studentResults.length === 0) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    const student_id = studentResults[0].id;

    
    const query = `
      SELECT Courses.id, Courses.name 
      FROM Enrollments
      JOIN Courses ON Enrollments.course_id = Courses.id
      WHERE Enrollments.student_id = ?
    `;

    db.query(query, [student_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    });
  });
});


//route for instructor to take a course :  :
app.put('/api/courses/:courseId/assign', authenticateToken, (req, res) => {
  const { courseId } = req.params;
  const { instructor_id } = req.body;

  if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can assign themselves to a course' });
  }

  // Update the course's instructor_id
  db.query('UPDATE Courses SET instructor_id = ? WHERE id = ?', [instructor_id, courseId], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Instructor assigned to the course successfully' });
  });
});

//kya kya sikha raha hai instructor
app.get('/api/instructor/courses', authenticateToken, (req, res) => {
  if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can view their courses' });
  }

  const instructorId = req.user.id;

  db.query('SELECT * FROM Courses WHERE instructor_id = ?', [instructorId], (err, courses) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(200).json(courses);
  });
});




app.get('/api/marks', (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const userId = req.user.id; 

  // Get student ID from Students table
  db.query('SELECT id FROM Students WHERE user_id = ?', [userId], (err, studentResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (studentResults.length === 0)
      return res.status(404).json({ error: 'Student record not found' });

    const student_id = studentResults[0].id;

    const query = `
      SELECT Courses.name AS course_name, Marks.marks 
      FROM Marks 
      JOIN Enrollments ON Marks.enrollment_id = Enrollments.id
      JOIN Courses ON Enrollments.course_id = Courses.id
      WHERE Enrollments.student_id = ?
    `;

    db.query(query, [student_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    });
  });
});





// library section:


// get all books hai
app.get('/api/books', (req, res) => {
  db.query('SELECT * FROM Library', (err, results) => {
    if (err) {
      console.error("Error fetching books:", err);
      res.status(500).json({ message: "Error fetching books" });
    } else {
      res.status(200).json(results);
    }
  });
});


//get borrowed books by you:

app.get('/api/borrowed-books', (req, res) => {
  const userId = req.query.userId;  // Get userId from query params
  
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  db.query('SELECT * FROM Library WHERE borrower = ?', [userId], (err, results) => {
    if (err) {
      console.error("Error fetching borrowed books:", err);
      return res.status(500).json({ message: "Error fetching borrowed books" });
    }

    res.status(200).json(results);  // Send the list of borrowed books
  });
});

// return kro borrowed books
app.post('/api/borrowed-books/return/:id', (req, res) => {
  const bookId = req.params.id;
  db.query('UPDATE Library SET borrower = NULL WHERE id = ?', [bookId], (err, result) => {
    if (err) {
      console.error("Error returning book:", err);
      res.status(500).json({ message: "Error returning book" });
    } else {
      res.status(200).json({ message: "Book returned successfully" });
    }
  });
});


// Add a book (Admin only)
app.post('/api/books/add', async (req, res) => {
  const { title, author } = req.body;

    db.query('INSERT INTO Library (title, author) VALUES (?, ?)', [title, author], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
  });
   
  
});

// Borrow book
app.post('/api/borrowed-books/borrow/:id', (req, res) => {
  const bookId = req.params.id;
  const userId = req.body.userId;  

  
  db.query('SELECT borrower FROM Library WHERE id = ?', [bookId], (err, results) => {
    if (err) {
      console.error("Error fetching book status:", err);
      return res.status(500).json({ message: "Error checking book status" });
    }

    const borrower = results[0]?.borrower;
    if (borrower) {
   
      return res.status(400).json({ message: "Book is already borrowed" });
    }

    db.query('UPDATE Library SET borrower = ? WHERE id = ?', [userId, bookId], (err, result) => {
      if (err) {
        console.error("Error borrowing book:", err);
        return res.status(500).json({ message: "Error borrowing book" });
      }

      res.status(200).json({ message: "Book borrowed successfully" });
    });
  });
});




app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`);
});


//feedback - from
app.get('/api/instructors', (req, res) => {
  db.query('SELECT * FROM users WHERE role = "instructor"', (err, results) => {
    if (err) {
      console.error("Error fetching instructors:", err);
      return res.status(500).json({ message: "Error fetching instructors" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "No instructors found" });
    }

    res.status(200).json(results);
  });
});



app.post('/api/feedback', (req, res) => {
  const { student_id, instructor_id, rating, comment } = req.body;

  if (!student_id || !instructor_id || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.query(
    'INSERT INTO Feedback (student_id, instructor_id, rating, comment) VALUES (?, ?, ?, ?)',
    [student_id, instructor_id, rating, comment],
    (err, result) => {
      if (err) {
        console.error("Error adding feedback:", err);
        return res.status(500).json({ message: "Error adding feedback" });
      }

      res.status(201).json({ message: "Feedback added successfully" });
    }
  );
});