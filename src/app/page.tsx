"use client";

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { EnvelopeIcon, RocketLaunchIcon, ArrowRightCircleIcon, XMarkIcon, ShoppingCartIcon, ComputerDesktopIcon, GlobeAltIcon, BookOpenIcon, TruckIcon, MapIcon, UserGroupIcon, CheckBadgeIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { Bars3BottomRightIcon } from '@heroicons/react/24/solid';
import ContactForm from '@/components/forms/ContactForm';
import InfoModal from '@/components/modals/InfoModal';

const HomePage = () => {
  const [isContactFormVisible, setContactFormVisible] = useState(false);
  const openContactForm = () => setContactFormVisible(true);
  const closeContactForm = () => setContactFormVisible(false);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  const [infoModalTitle, setInfoModalTitle] = useState<string>('');
  const [infoModalContent, setInfoModalContent] = useState<string>('');
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);

  const toggleInfoModal = (titleString: string, contentString: string) => {
    setInfoModalTitle(titleString);
    setInfoModalContent(contentString);
    setInfoModalOpen(true);
  }

  const repeatedListItems = Array.from({ length: 50 }, (_, index) => <li key={index}></li>);

  return (
    <>
      <Head>
        <title>Supply Chain Management - Warehousing & Order Fulfillment</title>
        <meta name="description" content="Expert warehousing and order fulfillment services through EDI and API. Custom software solutions for your business." />
        <meta name="keywords" content="supply chain, warehousing, order fulfillment, EDI, API, custom software" />
        <meta property="og:title" content="Supply Chain Management - Warehousing & Order Fulfillment" />
        <meta property="og:description" content="Expert warehousing and order fulfillment services through EDI and API." />
        <meta property="og:image" content="/images/hero-image.jpg" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center z-0 overflow-auto">
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#26394e] text-white shadow">
          <div className="relative flex items-center justify-between p-2">
            {/* Hamburger Icon */}
            <button
              className="md:hidden p-2 text-[#eb3c00] hover:text-white absolute right-4 top-3/4 transform -translate-y-1/2"
              onClick={toggleMobileMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Centered Title */}
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-white">AR-Source Software</h1>
              <hr className="my-2 border-t border-[#eb3c00] mx-auto" style={{ maxWidth: '15%' }} />
              <span className="text-lg italic text-white">Our Source For Software</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-4 md:absolute md:right-20 md:top-1/2 md:transform md:-translate-y-1/2">
              <button onClick={openContactForm} className="font-bold hover:text-white text-[#eb3c00] flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Contact Us
              </button>
              <Link href="/login" legacyBehavior>
                <a className="font-bold hover:text-white text-[#eb3c00] flex items-center">
                  <ArrowRightCircleIcon className="h-5 w-5 mr-2" />
                  Login
                </a>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`fixed top-0 left-0 right-0 bg-[#26394e] text-white p-4 md:hidden mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : 'mobile-menu-close'}`}>
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={() => {
                    openContactForm();
                    setMobileMenuOpen(false);
                  }}
                  className="text-2xl font-bold hover:text-white text-[#eb3c00] flex items-center"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Contact Us
                </button>
                <Link href="/login" legacyBehavior>
                  <a className="text-2xl font-bold hover:text-white text-[#eb3c00] flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <ArrowRightCircleIcon className="h-5 w-5 mr-2" />
                    Login
                  </a>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold hover:text-white text-[#eb3c00] flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  Close Menu
                </button>
              </div>
            </div>
          )}
        </header>

        <section className="relative w-full min-h-[60vh] md:min-h-[50vh] flex items-start justify-center pt-36 overflow-hidden">
          <div className="absolute md:p-10 p-4 z-20 bg-transparent rounded-lg">
            <h2 className="md:text-6xl text-4xl font-bold text-center text-white">Start Your</h2>
            <h2 className="md:text-6xl text-4xl font-bold text-center text-white">Digital Transformation</h2>
            <hr className="border-t border-[#eb3c00]" />
            <p className="md:text-3xl text-2xl mt-4 font-semibold text-center text-[#e8e8e8]">
              With Our Suite Of Cloud-Based ERP Software
            </p>
          </div>
        </section>

        <section className="relative w-full flex flex-col justify-center items-center overflow-hidden mt-10">
          <div className="flex flex-col justify-around items-center p-10 z-10 space-y-4">
            <div className="block bg-[#26394e] bg-opacity-95 rounded-lg p-6 text-center mb-2 w-full">
              <h2 className="text-4xl font-bold text-white">Work With An Expert Team</h2>
              <hr className="my-4 border-t border-[#eb3c00] mx-auto w-1/4" />
              <p className="text-2xl text-white font-semibold">
                Our process will swiftly transform your concept into a Minimum Viable Product (MVP)
              </p>
            </div>
          </div>
        </section>


        <section className="relative w-full flex justify-center overflow-hidden mb-16">
          <div className="flex flex-row max-w-[950px] w-full items-stretch space-x-8 p-4">
            <div className="flex-1 bg-[#26394e] bg-opacity-95 rounded-lg p-6 text-center flex flex-col">
              <h2 className="text-4xl font-bold text-white">Services</h2>
              <hr className="my-4 border-t border-[#eb3c00] mx-auto w-1/4" />
              <ul className="md:text-xl space-y-2 text-left flex-grow">
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "Custom Software Development",
                      "Using a combination of expertise, engineering talent, and rigorous Agile development processes, we ensure the protection of sensitive data throughout the development lifecycle. Our clients value our step-by-step approach as they gather feedback from target users, enabling them to progress confidently towards their software solution."
                    )
                  }
                >
                  <ComputerDesktopIcon className="wpicon h-5 w-5 mr-2" />
                  Custom Software Development
                </li>
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "E-Commerce Solution Development",
                      "Electronic commerce, commonly known as e-commerce, encompasses the buying and selling of goods and services over the internet. This versatile platform caters to various market segments and is accessible through computers, tablets, and other smart devices. From books and music to plane tickets and financial services like stock investing and online banking, virtually every product and service imaginable is available through e-commerce transactions."
                    )
                  }
                >
                  <ShoppingCartIcon className="wpicon h-5 w-5 mr-2" />
                  E-Commerce Solutions
                </li>
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "EDI Integration",
                      "Electronic Data Interchange (EDI) facilitates the seamless exchange of business documents in a standardized electronic format between business partners. This computer-to-computer communication eliminates the need for traditional methods like postal mail, fax, and email. Businesses reap significant benefits from EDI integration, including reduced costs, accelerated processing speeds, minimized errors, and enhanced relationships with business partners."
                    )
                  }
                >
                  <Bars3BottomRightIcon className="wpicon h-5 w-5 mr-2" />
                  EDI Integration
                </li>
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "Inventory and Order Tracking",
                      "Our warehousing software streamlines supply chain operations by providing real-time visibility into inventory levels and order statuses. It helps businesses manage stock more efficiently, reducing excess inventory and preventing stockouts. By automating tracking, the software minimizes errors and ensures accurate, timely order fulfillment. Additionally, it offers forecasting tools to optimize inventory levels and improve customer satisfaction with precise delivery estimates. This software enables businesses to operate more efficiently, reduce costs, and enhance service quality."
                    )
                  }
                >
                  <RocketLaunchIcon className="wpicon h-5 w-5 mr-2" />
                  Inventory and Order Tracking
                </li>
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "Generate Shipping Labels and Track Packages",
                      "Shipping APIs serve as the link between your business application and FedEx or UPS logistics solutions, ensuring efficient management of shipping operations and enhanced tracking capabilities."
                    )
                  }
                >
                  <GlobeAltIcon className="wpicon h-5 w-5 mr-2" />
                  Shipping Label Generation
                </li>
              </ul>
            </div>

            <div className="w-full md:w-[300px] h-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <Image
                src="/images/website/ECom_Services.png"
                alt="Services Illustration"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        <section className="relative w-full flex flex-col justify-center items-center overflow-hidden">
          <div className="flex flex-col justify-around items-center p-10 z-10 space-y-4">
            <div className="block bg-[#26394e] bg-opacity-95 rounded-lg p-6 text-center mb-2 w-full">
              <h2 className="text-4xl font-bold text-white">Schedule a Demo Today</h2>
              <hr className="my-4 border-t border-[#eb3c00] mx-auto w-1/4" />
              <p className="text-2xl text-white font-semibold">
                We can tailor our integrated software suite to meet any specific business needs you have
              </p>
            </div>
          </div>
        </section>

        <section className="relative w-full flex justify-center overflow-hidden">
          <div className="flex flex-row-reverse max-w-[950px] w-full items-stretch space-x-8 space-x-reverse p-4">
            {/* Text Section */}
            <div className="flex-[3] bg-[#26394e] bg-opacity-95 rounded-lg p-6 text-center flex flex-col">
              <h2 className="text-4xl font-bold text-white">Software Suite</h2>
              <hr className="my-4 border-t border-[#eb3c00] mx-auto w-1/2" />
              <ul className="md:text-xl space-y-2 text-left flex-grow">
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "Customer Relationship Management Software (CRM)",
                      "CRM, or Customer Relationship Management, software simplifies lead and client management for business owners. It consolidates data, communications, documents, and tasks into one accessible platform, enabling efficient sales and service delivery. Ideal for small businesses, CRM replaces the need for multiple spreadsheets and databases, offering a unified solution for effective customer relationship management."
                    )
                  }
                >
                  <BookOpenIcon className="wpicon h-5 w-5 mr-2" />
                  Customer Relations Management
                </li>
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "EDI Order Processing",
                      "EDI documents are transmitted directly to the recipient's Order Management System, allowing for immediate processing. Businesses reap significant benefits from EDI integration, including reduced costs, accelerated processing speeds, minimized errors, and enhanced relationships with business partners."
                    )
                  }
                >
                  <CheckBadgeIcon className="wpicon h-5 w-5 mr-2" />
                  EDI Order Processing
                </li>
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "GPS Tracking & Google Maps Integration",
                      "Looking for real-time GPS tracking to pinpoint your packages' locations? The Google Maps API enables you to incorporate the capabilities of Google Maps directly into your software. When paired with a shipping API, you can monitor the progress of your packages as they are delivered. This API offers detailed information, including street names and directions of your device's location."
                    )
                  }
                >
                  <MapIcon className="wpicon h-5 w-5 mr-2" />
                  GPS Tracking
                </li>
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "Human Relations Management Software (HRM)",
                      "Human Relations Management (HRM) software encompasses digital solutions designed to enhance and optimize the daily tasks and overarching goals of an organization's human resources department. By leveraging HR software, HR staff and managers can efficiently manage various HR functions, freeing up valuable time that can be redirected towards more productive and profitable endeavors."
                    )
                  }
                >
                  <UserGroupIcon className="wpicon h-5 w-5 mr-2" />
                  Human Relations Management
                </li>
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "Project Management Software",
                      "Project management software is a tool designed to help teams plan, organize, and manage their projects and tasks effectively. It facilitates collaboration among team members, streamlines task assignments, tracks progress, and schedules deadlines."
                    )
                  }
                >
                  <BriefcaseIcon className="wpicon h-5 w-5 mr-2" />
                  Project and Task Management
                </li>
                <li
                  className="text-white font-semibold group cursor-pointer wpli transition-transform duration-300 hover:scale-105 whitespace-nowrap"
                  onClick={() =>
                    toggleInfoModal(
                      "Warehousing and Inventory Software",
                      "Warehousing and Inventory Software optimizes inventory and warehouse management. It includes features like inventory tracking, order management, and warehouse organization. This software helps businesses track stock levels, manage shipments, and improve inventory accuracy. Advanced features such as barcode scanning and real-time analytics enhance its capabilities, making it essential for modern supply chain operations."
                    )
                  }
                >
                  <TruckIcon className="wpicon h-5 w-5 mr-2" />
                  Warehouse Management
                </li>
              </ul>
            </div>

            <div className="w-full md:w-[300px] h-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <Image
                src="/images/website/Software_Suite.png"
                alt="Services Illustration"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>


        {/* Why Choose Us Section */}
        <section className="relative w-full flex flex-col justify-between overflow-hidden mt-10 mb-20">

          <div className="flex flex-col justify-center items-center w-full p-10 z-10 text-center">
            <h2 className="text-4xl font-bold text-white">Why Choose Us</h2>
            <hr className="my-4 border-t border-[#eb3c00] w-24" />
            <p className="text-xl text-white max-w-3xl mb-10">
              At AR-Source Software, we build code the right way, starting with our tried and tested framework. We deliver a Minimum Viable Product (MVP) that meets your needs and further customize it from there to ensure it aligns perfectly with your business goals.
            </p>
            <h2 className="text-2xl font-bold text-white mt-10">About Us</h2>
            <p className="text-lg text-white max-w-3xl mb-10">
              AR-Source Software has been serving NWA and Fort Smith since 2023, offering professional-grade software at an affordable price.
            </p>
            <button onClick={openContactForm} className="w-full max-w-xs p-4 mt-10 mb-10 bg-[#eb3c00] text-white rounded-md flex justify-center items-center font-bold text-xl transition-transform duration-300 hover:scale-105">
              <EnvelopeIcon className="h-6 w-6 mr-2" />
              Contact Us
            </button>

            <h2 className="text-2xl font-bold text-white">Contact: Kori Ford</h2>
            <h2 className="text-2xl font-bold text-white">Phone: 479-586-1906</h2>
          </div>
        </section>

        {/* Moving Background Images where things like services will appear over it */}
        <ul className="background">
          {repeatedListItems}
        </ul>

        {isContactFormVisible && (
          <ContactForm onClose={closeContactForm} />
        )}

        <InfoModal
          isOpen={infoModalOpen}
          onRequestClose={() => setInfoModalOpen(false)}
          title={infoModalTitle}
          content={infoModalContent}
          h2_color='#26394e'
        />
      </main >
    </>
  );
};

export default HomePage;  
