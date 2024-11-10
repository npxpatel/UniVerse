import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import {jwtDecode} from 'jwt-decode';

export default function Library() {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [role, setRole] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
      console.log(decodedToken.role); // Debugging role
    }

    getBooks();
    getBorrowedBooks();
  }, []);

  async function addBook() {
    try {
      const response = await axios.post('http://localhost:3001/api/books/add', { title, author });
      getBooks();
      setTitle(''); // Clear input after adding
      setAuthor('');
    } catch (error) {
      console.error("Error adding book:", error);
    }
  }

  async function getBooks() {
    try {
      const response = await axios.get('http://localhost:3001/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  async function getBorrowedBooks() {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
  
      const response = await axios.get('http://localhost:3001/api/borrowed-books', {
        params: { userId }  // Send userId as query parameter
      });
      
      setBorrowedBooks(response.data);  // Set the response data to state
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
    }
  }

  async function returnBook(bookId) {
    try {
      await axios.post(`http://localhost:3001/api/borrowed-books/return/${bookId}`);
      getBorrowedBooks();
    } catch (error) {
      console.error("Error returning book:", error);
    }
  }

  async function borrowBook(bookId) {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;  

    try {
      await axios.post(`http://localhost:3001/api/borrowed-books/borrow/${bookId}`, { userId });
      getBorrowedBooks();
      alert("Book borrowed successfully!");
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Error borrowing book");
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">College Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="col-span-2 border-blue-200 shadow-md">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-blue-800">Featured Books</CardTitle>
              <CardDescription className="text-blue-600">Check out our latest additions and popular titles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 ">
                {books.map((book) => (
                  <div key={book.id} className="text-center">
                    <img
                      src='https://via.placeholder.com/100x150'
                      alt={book.title}
                      width={100}
                      height={150}
                      className="mx-auto mb-2 shadow-md"
                    />
                    <h3 className="font-semibold text-sm text-blue-800">{book.title}</h3>
                    <p className="text-sm text-blue-600">{book.author}</p>
                    {role !== 'admin' && (
                      <Button
                        variant="outline"
                        className="mt-2 text-blue-700 hover:bg-blue-50"
                        onClick={() => borrowBook(book.id)}
                      >
                        Borrow Book
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-blue-800">My Borrowed Books</CardTitle>
              <CardDescription className="text-blue-600">Keep track of your current loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {borrowedBooks.map((book) => (
                  <div key={book.id} className="text-center">
                    <h3 className="font-semibold text-sm text-blue-800">{book.title}</h3>
                    <p className="text-sm text-blue-600">{book.author}</p>
                    <Button
                      variant="outline"
                      className="mt-2 text-blue-700 hover:bg-blue-50"
                      onClick={() => returnBook(book.id)}
                    >
                      Return Book
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                <Book className="mr-2 h-4 w-4" /> View All Borrowed Books
              </Button>
            </CardFooter>
          </Card>
        </div>

        {role === 'admin' && (
          <Card className="border-blue-200 shadow-md mt-8">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-blue-800">Add a New Book</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                placeholder="Book Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4 px-3 py-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mb-4 px-3 py-2 border rounded w-full"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={addBook} variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                Add Book
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
}
