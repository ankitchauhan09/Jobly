import { useRef, useState } from "react";
import home_bg_video from "../assets/home_bg_vid.mp4";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import process_png from "../assets/process_pie.png";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);
const HeroSection = () => {
  const scrollRef = useRef(null);
  const servicesSectionH1Ref = useRef(null);
  const howJoblyWorksSectionH1Ref = useRef(null);
  const howJoblyWorksRef = useRef(null);
  const overlayRef = useRef(null);

  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmission = async (event) => {
    event.preventDefault();
    console.log(`${name}, + ${email}, ${feedback}, ${contact}`);
  };

  //services heading
  useGSAP(() => {
    gsap.from(servicesSectionH1Ref.current, {
      x: -100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: servicesSectionH1Ref.current,
        scroller: "body",
        // markers: true,
        start: "top 90%",
        end: "top 40%",
        scrub: true,
      },
    });
  });

  useGSAP(() => {
    gsap.from(card1Ref.current, {
      y: 130,
      x: -100,
      opacity: 0,
      duration: 2,
      scrollTrigger: {
        trigger: card1Ref.current,
        scroller: "body",
        // markers : true,
        start: "top 90%",
        end: "top 40%",
        scrub: true,
      },
    });

    gsap.from(card2Ref.current, {
      y: 130,
      x: 100,
      opacity: 0,
      duration: 2,
      scrollTrigger: {
        trigger: card2Ref.current,
        scroller: "body",
        // markers : true,
        start: "top 90%",
        end: "top 40%",
        scrub: true,
      },
    });

    gsap.from(card3Ref.current, {
      y: 130,
      x: -100,
      opacity: 0,
      duration: 2,
      scrollTrigger: {
        trigger: card3Ref.current,
        scroller: "body",
        // markers : true,
        start: "top 90%",
        end: "top 40%",
        scrub: true,
      },
    });
  });

  useGSAP(() => {
    gsap.set(overlayRef.current, {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    });

    gsap.set(howJoblyWorksRef.current, {
      scale: 2,
      opacity: 0,
    });

    gsap.to(howJoblyWorksRef.current, {
      scale: 1,
      opacity: 1,
      scrollTrigger: {
        scroller: "body",
        trigger: howJoblyWorksRef.current,
        scrub: 2,
        start: "top 70%",
        end: "top 2%",
        // markers: true,
      },
    });

    gsap.set(howJoblyWorksSectionH1Ref.current, { y: 100, opacity: 0 });
    gsap.to(howJoblyWorksSectionH1Ref.current, {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: howJoblyWorksSectionH1Ref.current,
        scroller: "body",
        start: "top 70%",
        end: "top 2%",
        scrub: 2,
      },
    });
  });

  const containerRef = useRef(null);

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
      }}
      watch={[location.pathname]}
      containerRef={containerRef}
    >
      <div className="w-full overflow-hidden	" ref={containerRef}>
        {/* page 1 starts here */}
        <div
          id="page1"
          className="relative flex flex-col justify-center items-center overflow-hidden h-screen"
        >
          {/* Background Video */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src={home_bg_video}
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/80 z-10"></div>

          {/* Content */}
          <div className="mt-20 relative z-10 text-center flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-wide text-white">
              Jobly
              <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
                {" "}
                - A Job and Internship Platform
              </span>
            </h1>
            <p className="mt-6 md:mt-10 text-base md:text-lg text-center text-neutral-300 max-w-4xl">
              Achieve your career goals with Jobly—where personalized mentorship
              and affordable guidance help you land your dream job. Whether
              you're a job seeker or a recruiter, Jobly is the platform that
              connects talent with opportunity. Start your journey today and
              make your career aspirations a reality!
            </p>
            <div className="flex justify-center my-8 md:my-10">
              <a
                href="#"
                className="bg-gradient-to-r from-orange-500 to-orange-800 hover:from-orange-600 hover:to-orange-900 transition-colors duration-300 py-2 md:py-3 px-3 md:px-4 rounded-md text-white text-sm md:text-base"
              >
                Get Job
              </a>
              <a
                href="#"
                className="border py-2 md:py-3 px-3 md:px-4 ml-4 rounded-md text-white text-sm md:text-base"
              >
                Hire
              </a>
            </div>
          </div>
        </div>
        {/* page 1 ends here */}
        {/* page 2 starts here */}
        <div
          ref={scrollRef}
          id="page2"
          className="min-h-screen w-full bg-[#121212] lg:py-10 lg:px-4 md:px-10"
        >
          <section id="services_section" className="w-full">
            <h1
              ref={servicesSectionH1Ref}
              className="w-full lg:text-8xl md:text-6xl text-6xl pl-5 lg:pl-5 h-fit bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text"
            >
              Services
            </h1>

            <div
              id="page2cards-section"
              className="w-full flex flex-col align-center mt-0"
            >
              <div
                id="page2-card1"
                className="w-full flex lg:flex-row md:flex-row flex-col gap-x-8 justify-center mt-16 align-center"
                ref={card1Ref}
              >
                <img
                  src="https://images.pexels.com/photos/935977/pexels-photo-935977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="lg:w-2/6 md:4/6 5/6 rounded-md transition-shadow duration-1000 ease-in-out hover:shadow-xl hover:shadow-orange-500 "
                />
                <div
                  id="page2-card1-text"
                  className="lg:w-3/6 md:w-4/6 w-6/6 flex flex-col gap-y-30 lg:px-10 px-3 mt-5 lg:mt-0 align-center justify-center"
                >
                  <h1 className="lg:text-5xl text-3xl text-center">
                    Find Jobs and Internships
                  </h1>
                  <p className="mt-10 text-justify">
                    Explore a vast array of job opportunities and internships
                    tailored to your skills and preferences. At Jobly, you can
                    easily find positions in various industries without any
                    hidden fees or premium charges. Start your career journey
                    with us today by browsing the latest openings. Click the
                    button below to begin applying and take the first step
                    toward your future success.
                  </p>
                  <button className="w-2/4 mr-auto ml-auto mt-4 rounded-md text-white py-2 px-5 bg-gradient-to-r from-orange-500 to-orange-800">
                    Search for jobs
                  </button>
                </div>
              </div>
              <div
                id="page2-card2"
                className="w-full flex lg:flex-row-reverse md:flex-row flex-col gap-x-8 justify-center mt-16 align-center"
                ref={card2Ref}
              >
                <img
                  src="https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="lg:w-2/6 md:4/6 5/6 rounded-md transition-shadow duration-1000 ease-in-out hover:shadow-xl hover:shadow-orange-500 "
                />
                <div
                  id="page2-card1-text"
                  className="lg:w-3/6 md:w-4/6 w-6/6 flex flex-col gap-y-30 lg:px-10 px-3 mt-5 lg:mt-0 align-center justify-center"
                >
                  <h1 className="text-5xl text-center">
                    Hire skilled employees
                  </h1>
                  <p className="mt-10 text-justify text-wrap">
                    Connect with a diverse pool of qualified candidates ready to
                    bring their skills and expertise to your organization. At
                    Jobly, we make it easier for you to find the perfect match
                    for your open positions across a wide range of industries.
                    Post your job listings, browse candidate profiles, and hire
                    the talent that fits your business needs, all in one
                    platform. Start today by exploring our extensive database of
                    job seekers and take your recruitment process to the next
                    level.
                  </p>
                  <button className="w-2/4 mr-auto ml-auto mt-4 rounded-md text-white py-2 px-5 bg-gradient-to-r from-orange-500 to-orange-800">
                    Hire employees
                  </button>
                </div>
              </div>
              <div
                id="page2-card3"
                className="w-full flex lg:flex-row md:flex-row flex-col gap-x-8 justify-center mt-16 align-center"
                ref={card3Ref}
              >
                <img
                  src="https://images.pexels.com/photos/5921485/pexels-photo-5921485.jpeg?auto=compress&cs=tinysrgb&w=600"
                  className="lg:w-2/6 md:4/6 5/6 rounded-md transition-shadow duration-1000 ease-in-out hover:shadow-xl hover:shadow-orange-500 "
                />
                <div
                  id="page2-card1-text"
                  className="lg:w-3/6 md:w-4/6 w-6/6 flex flex-col gap-y-30 lg:px-10 px-3 mt-5 lg:mt-0 align-center justify-center"
                >
                  <h1 className="text-5xl text-center">
                    Get Mentorship and Guidance
                  </h1>
                  <p className="mt-10 text-justify text-wrap">
                    Unlock your full potential with personalized mentorship and
                    expert guidance tailored to your career goals. Whether
                    you're navigating a job search, preparing for interviews, or
                    looking to enhance your professional skills, Jobly connects
                    you with seasoned mentors who provide the advice and support
                    you need. Take control of your career journey with
                    one-on-one mentorship sessions designed to help you succeed
                    in today's competitive job market. Begin your path to
                    success with the guidance of industry experts.
                  </p>
                  <button className="w-2/4 mr-auto ml-auto mt-4 rounded-md text-white py-2 px-5 bg-gradient-to-r from-orange-500 to-orange-800">
                    Get Mentorship
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* page 2 end here */}
        {/*page3 starts here*/}
        <div
          id="page3"
          className="relative h-fit mb-9xl w-full bg-[#121212] py-10 px-4 md:px-10 "
        >
          <div className="mt-20 relative z-10 text-center flex flex-col items-center justify-center">
            <h1
              ref={howJoblyWorksSectionH1Ref}
              className="w-full lg:text-8xl text-6xl h-auto bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text"
            >
              How Jobly works?
            </h1>
            <div
              ref={howJoblyWorksRef}
              className="flex items-center w-full space-x-20 justify-center lg:flex-row flex-col whitespace-wrap px-4 mt-30"
            >
              <img
                src={process_png}
                className=" lg:w-3/5 lg:h-2/4 w-5/5 h-3/4"
              />
              <button className="bg-gradient-to-r from-orange-500 to-red-800 text-white rounded-md lg:py-3 lg:px-7 px-4 py-3">
                Find jobs now..
              </button>
            </div>
          </div>
        </div>
        {/* page3 ends here
        <div className="page-divider w-full h-px bg-orange-200" />
        page4 starts here */}

        {/* feedback section starts here */}

        <div
          id="page4"
          className="relative flex flex-col align-center justify-center h-fit w-full bg-[#121212] py-10 px-4 md:px-10 "
        >
          <h2 className="text-2xl">
            If you have any doubts and feedbacks feel free to ask..
          </h2>
          <form
            className="mt-8 lg:mx-auto lg:px-40 px-9 lg:w-2/4 w-4/4 space-y-6"
            onSubmit={handleSubmission}
          >
            <div className="rounded-md shadow-sm">
              <div className="mb-4">
                <label htmlFor="full_name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contact" className="sr-only">
                  Contact
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  autoComplete="contact"
                  required
                  value={contact}
                  maxLength={10}
                  onChange={(e) => setContact(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Contact"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="feedback" className="sr-only">
                  Feedback
                </label>
                <input
                  id="feedback"
                  name="feedback"
                  type="text"
                  autoComplete="feedback"
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Feedback"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-orange-500 to-orange-800 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
        {/*page4 ends here*/}
      </div>
    </LocomotiveScrollProvider>
  );
};

export default HeroSection;
