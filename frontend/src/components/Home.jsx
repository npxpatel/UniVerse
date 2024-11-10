import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, GraduationCap, Library, Users } from "lucide-react";
import { Link } from "react-router-dom";
import collegeCampus from "../assets/img2.avif";
import studentsInClassroom from "../assets/img3.avif";
import library from "../assets/img4.avif";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { image: library, alt: "Library" },
    { image: collegeCampus, alt: "College campus" },
    { image: studentsInClassroom, alt: "studentsInClassroom" },
  ];

  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    navigate("/login");
  };

  const librarysection = () => {
    navigate("library-section");
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <section className="relative h-[500px] overflow-hidden">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt={slide.alt}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Our College
              </h1>
              <p className="text-xl mb-8">Empowering minds, shaping futures</p>
              <Button
                size="lg"
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Admissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Users className="h-12 w-12 mb-4" />
                <p>Apply now for the upcoming academic year</p>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleLearnMoreClick}
                >
                  Learn More
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Feedback Form</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarDays className="h-12 w-12 mb-4" />
                <p>Rate our Instructors and let them know about you!</p>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => navigate("/feedback")}
                >
                  Fill Up!
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Library</CardTitle>
              </CardHeader>
              <CardContent>
                <Library className="h-12 w-12 mb-4" />
                <p>Access our extensive collection of resources</p>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={librarysection}
                >
                  Learn More
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Student Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <GraduationCap className="h-12 w-12 mb-4" />
                <p>Log in to access your student account</p>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleLearnMoreClick}
                >
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Content
            </h2>
            <Tabs defaultValue="news" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="news"
                  className="bg-blue-500 text-white hover:bg-blue-600 mr-7 pt-2"
                >
                  Latest News
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="bg-blue-500 text-white hover:bg-blue-600 mr-7 pt-2"
                >
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger
                  value="research"
                  className="bg-blue-500 text-white hover:bg-blue-600 pt-2"
                >
                  Research Highlights
                </TabsTrigger>
              </TabsList>
              <TabsContent value="news">
                <Card>
                  <CardHeader>
                    <CardTitle>College Wins National Award</CardTitle>
                    <CardDescription>
                      Our institution has been recognized for excellence in
                      education
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button>Read More</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Annual Science Fair</CardTitle>
                    <CardDescription>
                      Join us for an exciting showcase of student projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Date: July 15, 2023</p>
                    <p>Time: 10:00 AM - 4:00 PM</p>
                    <p>Location: Main Campus Auditorium</p>
                  </CardContent>
                  <CardFooter>
                    <Button>Register Now</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="research">
                <Card>
                  <CardHeader>
                    <CardTitle>Breakthrough in Renewable Energy</CardTitle>
                    <CardDescription>
                      Our researchers have made a significant discovery in solar
                      cell efficiency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      The team, led by Dr. Jane Smith, has developed a new
                      material that increases solar cell efficiency by 30%.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button>Learn More</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <footer className="bg-blue-600 text-white mt-12 ">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p>Technology School</p>
              <p>Jodhpur street, ST 12345</p>
              <p>
                Phone: <span className="font-semibold">(123) 456-7890</span>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@college.edu"
                  className="text-blue-300 hover:underline"
                >
                  iiitn@college.edu
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline text-blue-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-blue-300">
                    Academics
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-blue-300">
                    Admissions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-blue-300">
                    Campus Life
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <p className="mb-4">Subscribe to our newsletter for updates</p>
              <form className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="mr-2 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-400"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-4 py-2 transition duration-200"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-2 text-center border-t border-blue-700 ">
            <p>&copy; 2024 MIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
