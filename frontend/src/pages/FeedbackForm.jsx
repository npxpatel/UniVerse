import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";  // Assuming button.tsx exports 'Button'
import { Input } from "@/components/ui/input";  // Corrected import for 'Input'
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Feedback = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);


  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/instructors');
        setInstructors(response.data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
   
    
    const feedbackData = {
      student_id: userId,  
      instructor_id: selectedInstructor,  
      rating,  
      comment: feedback 
    };
  
    try {
        console.log(feedbackData.instructor_id);
      
      const response = await axios.post('http://localhost:3001/api/feedback', feedbackData);
 
      if (response.status === 201) {
        alert("Feedback submitted successfully!");
        setFeedback('');  
        setRating(0);  
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };



  return (
    <div>   
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">Instructor Feedback</h1>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="instructor" className="block text-sm font-semibold text-blue-800">Select Instructor</label>
            <select
              id="instructor"
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="w-full px-3 py-2 mt-2 border rounded"
              required
            >
              <option value="">Select an instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="feedback" className="block text-sm font-semibold text-blue-800">Your Feedback</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 mt-2 border rounded"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-blue-800">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    checked={rating === star}
                    onChange={() => setRating(star)}
                    className="form-radio"
                  />
                  <span className="ml-1">{star}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Submit Feedback
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
