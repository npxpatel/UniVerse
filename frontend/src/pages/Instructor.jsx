import React from 'react'
import CoursesList from './CourseList'
import InstructorTeaches from './InstructorTeaches'
import Header from '../components/Header'


const Instructor = () => {
 
  return (
    <div>
       <Header/>
        <h1 className="mt-3 text-xl md:text-2xl font-bold mb-4 text-center">Instructor - Section  </h1>
          <CoursesList/>
         <InstructorTeaches /> 

      </div>
  )
}

export default Instructor