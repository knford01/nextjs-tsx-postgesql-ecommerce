"use client";

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { FaYoutube, FaTwitter, FaFacebook, FaInstagram, FaSnapchatGhost } from 'react-icons/fa';
import ContactForm from '@/components/forms/ContactForm';

const Header = ({ openContactForm }: { openContactForm: () => void }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#1E4258] text-white shadow-md flex items-center px-6 md:px-24 h-16 z-50 overflow-hidden">
      <div className="hidden md:flex gap-4 ml-auto">
        <button
          onClick={openContactForm}
          className="bg-[#0288d1] hover:bg-[#01579b] text-white px-4 py-2 rounded-md transition whitespace-nowrap w-auto"
        >
          Contact Us
        </button>
        <Link href="/login">
          <button className="bg-[#2D5F5D] hover:bg-[#265077] text-white px-4 py-2 rounded-md transition whitespace-nowrap w-auto">
            Login
          </button>
        </Link>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 text-center leading-tight">
        <h1 className="text-lg md:text-xl font-bold m-0 p-0 leading-none">AR-Source Software</h1>
        <div className="w-full h-[1px] bg-[#eb3c00] m-0 p-0"></div> {/* Ensures no extra space */}
        <span className="text-xs md:text-sm text-gray-300 m-0 p-0 block leading-none">Our Source For Software</span>
      </div>

      <div className="flex items-center w-full md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="ml-auto md:hidden p-2 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#1E4258] shadow-md flex flex-col items-center py-4 space-y-2 md:hidden">
          <button
            onClick={openContactForm}
            className="bg-[#0288d1] hover:bg-[#01579b] text-white px-4 py-2 rounded-md transition w-3/4"
          >
            Contact Us
          </button>
          <Link href="/login" className="w-3/4">
            <button className="bg-[#2D5F5D] hover:bg-[#265077] text-white px-4 py-2 rounded-md transition w-full">
              Login
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

const HeroSection = () => {
  return (
    <section
      className="relative w-full h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
    >
      <Image
        src="/images/website2/support1.jpg"
        alt="Cloud-Based ERP Solutions"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      {/* Opaque Overlay Box */}
      <div className="bg-black bg-opacity-60 text-white text-center px-6 py-12 rounded-lg max-w-3xl mx-auto relative">
        <h1 className="text-4xl md:text-5xl font-bold">
          Start Your Digital Transformation
        </h1>
        <p className="text-lg md:text-xl mt-4">
          With Our Suite Of Cloud-Based ERP Software
        </p>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    {
      image: "/images/website2/custom_software.png",
      title: "Custom Software Development",
      description: "Tailored solutions to streamline your business operations and maximize efficiency."
    },
    {
      image: "/images/website2/ecommerce.png",
      title: "E-Commerce Solutions",
      description: "Powerful platforms to enhance your online sales and customer engagement."
    },
    {
      image: "/images/website2/edi_integration.png",
      title: "EDI Integration",
      description: "Seamless electronic data interchange to automate transactions with partners."
    },
    {
      image: "/images/website2/warehousing_inventory.png",
      title: "Warehousing and Inventory Management",
      description: "Efficient storage solutions with real-time inventory tracking."
    },
    {
      image: "/images/website2/order_tracking.png",
      title: "Order Tracking",
      description: "Real-time monitoring and updates on order status and fulfillment."
    },
    {
      image: "/images/website2/shipping_labels.png",
      title: "Shipping Label Generation",
      description: "Effortless label creation for a smooth and efficient shipping process."
    }
  ];

  return (
    <section className="bg-backgroundLvl1 py-16 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-primaryMain">Solutions to Solve Your Supply Chain Challenges</h2>
        <p className="text-lg text-secondaryMain mt-4">
          Work With An Expert Team: Our process will swiftly transform your concept into a Minimum Viable Product (MVP)
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="p-6 bg-white border border-borderBottom rounded-lg shadow-lg text-left">
              <img src={service.image} alt={service.title} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-xl font-semibold text-actionHover mt-4">{service.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SoftwareSuite = () => {
  const softwareServices = [
    {
      image: "/images/website2/crm.png",
      title: "Customer Relations Management",
      description: "Optimize customer interactions and improve retention with tailored CRM solutions."
    },
    {
      image: "/images/website2/hrm.png",
      title: "Human Relations Management",
      description: "Streamline employee management and HR processes efficiently."
    },
    {
      image: "/images/website2/project_management.png",
      title: "Project and Task Management",
      description: "Enhance productivity with structured workflows and real-time tracking."
    },
    {
      image: "/images/website2/warehouse_management.png",
      title: "Warehouse Management",
      description: "Advanced solutions for tracking and managing inventory seamlessly."
    },
    {
      image: "/images/website2/edi_processing.png",
      title: "EDI Order Processing",
      description: "Automate order transactions with reliable EDI integration."
    },
    {
      image: "/images/website2/gps_tracking.png",
      title: "GPS Tracking",
      description: "Monitor logistics and fleet movements with real-time GPS tracking."
    }
  ];

  return (
    <section className="bg-backgroundLvl1 py-16 px-6 text-center relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300"></div>
      <div className="max-w-5xl mx-auto mt-4">
        <h2 className="text-3xl font-bold text-primaryMain">Enterprise Resource Software That Encompasses Your Business Needs</h2>
        <p className="text-lg text-secondaryMain mt-4">
          We can tailor our integrated software suite to meet any specific business needs you have.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softwareServices.map((service, index) => (
            <div key={index} className="p-6 bg-white border border-borderBottom rounded-lg shadow-lg text-left">
              <img src={service.image} alt={service.title} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-xl font-semibold text-actionHover mt-4">{service.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BottomSection = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="relative bg-gray-200 text-primaryMain py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold">Why Choose Us</h2>
        <p className="mt-4 text-lg">
          At AR-Source Software, we build code the right way, starting with our tried and tested framework.
          We deliver a Minimum Viable Product (MVP) that meets your needs and further customize it from there to ensure
          it aligns perfectly with your business goals.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold">About Us</h2>
        <p className="mt-4 text-lg">
          AR-Source Software has been serving NWA and Fort Smith since 2023, offering professional-grade software
          at an affordable price.
        </p>
      </div>

      <div className="mt-10">
        <button
          className="bg-[#eb3c00] text-white py-4 px-8 text-xl rounded-lg hover:bg-actionHover transition"
          onClick={() => setIsContactOpen(true)}
        >
          Contact Us
        </button>
      </div>

      {isContactOpen && <ContactForm onClose={() => setIsContactOpen(false)} />}

      <div className="mt-10 text-lg">
        <p>Contact: <span className="font-semibold">Kori Ford</span></p>
        <p>Phone: <a href="tel:4795861906" className="text-info-main hover:underline">479-586-1906</a></p>
      </div>

      <div className="absolute bottom-4 right-4 flex space-x-4 text-2xl text-gray-600">
        <FaYoutube />
        <FaTwitter />
        <FaFacebook />
        <FaInstagram />
        <FaSnapchatGhost />
      </div>
    </div>
  );
}

const HomePage = () => {
  const [isContactFormVisible, setContactFormVisible] = useState(false);
  const openContactForm = () => setContactFormVisible(true);
  const closeContactForm = () => setContactFormVisible(false);

  return (
    <>
      <Head>
        <title>Supply Chain Management - Warehousing & Order Fulfillment</title>
        <meta name="description" content="Expert warehousing and order fulfillment services through EDI and API." />
        <meta name="keywords" content="supply chain, warehousing, order fulfillment, EDI, API, custom software" />
        <meta property="og:title" content="Supply Chain Management - Warehousing & Order Fulfillment" />
        <meta property="og:description" content="Expert warehousing and order fulfillment services through EDI and API." />
        <meta property="og:image" content="/images/hero-image.jpg" />
      </Head>

      <main className="min-h-screen pt-20"> {/* Adjust padding for fixed header */}
        <Header openContactForm={openContactForm} />

        <HeroSection />

        <ServicesSection />

        <SoftwareSuite />

        <BottomSection />

        {isContactFormVisible && <ContactForm onClose={closeContactForm} />}

      </main>
    </>
  );
};

export default HomePage;
