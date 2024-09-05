import React, { FormEvent, useState } from 'react';

const ContactForm = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        company: '',
        message: '',
        // timeline: 'immediately',
        // heard_about: 'marketing',
        contact_method: 'phone',
    });

    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch('https://formkeep.com/f/cc0993e0bb98', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setSubmitMessage('Thank you for contacting us. We will get back to you shortly.');
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: '',
                    company: '',
                    message: '',
                    // timeline: 'immediately',
                    // heard_about: 'marketing',
                    contact_method: 'phone',
                });
            } else {
                setSubmitMessage('There was an error submitting the form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitMessage('There was an error submitting the form. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 m-2">
            <div className="relative w-full max-w-xl p-4 bg-gray-100 rounded-lg shadow-md max-h-screen overflow-y-auto text-[#26394e]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <div className="mb-1 text-center">
                    <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
                    <p className="hidden font-semibold md:block text-gray-600">Unlock the full potential of your business with our custom tailored cloud-based software solutions</p>
                </div>
                <hr className="mb-3 border-t border-[#eb3c00]" />
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Form fields */}
                        <div className="col-span-1">
                            <label className="block font-bold text-gray-700 mb-2">Your Contact Details:</label>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="col-span-1">
                                <input
                                    name="first_name"
                                    type="text"
                                    placeholder="First Name*"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    autoComplete="off"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-1">
                                <input
                                    name="last_name"
                                    type="text"
                                    placeholder="Last Name*"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    autoComplete="off"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="col-span-1">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address*"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    autoComplete="off"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-1">
                                <input
                                    name="phone_number"
                                    type="tel"
                                    placeholder="Phone Number*"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please Match Format: ###-###-####')}
                                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                    autoComplete="off"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* New Section: Company Information */}
                        <div className="col-span-1">
                            <label className="block font-bold text-gray-700 mb-2">Company Information:</label>
                        </div>
                        <div className="col-span-1">
                            <input
                                name="company"
                                type="text"
                                placeholder="Company Name"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                autoComplete="off"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </div>

                        {/* New Section: Project Details */}
                        <div className="col-span-1">
                            <label className="block font-bold text-gray-700 mb-2">Project Details:</label>
                        </div>
                        <div className="col-span-1">
                            <textarea
                                name="message"
                                placeholder="Enter message"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows={4}
                                autoComplete="off"
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-1">
                            <button type="submit" className="w-full p-2 bg-green-500 font-bold rounded-md transition-transform duration-300 hover:scale-105 text-[#ffffff]">
                                Send Message
                            </button>
                        </div>
                        {submitMessage && (
                            <div className="col-span-1">
                                <p className="text-center text-red-500">{submitMessage}</p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
