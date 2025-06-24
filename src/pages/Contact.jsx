import React, { useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill all fields.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/feedback", formData);
      setFormData({ name: "", email: "", message: "" });
      setSuccess(true);
    } catch (err) {
      console.error("Error sending feedback", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6" data-aos="fade-up">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        📬 Contact / Feedback
      </h2>

      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center">
          ✅ Thank you! Your message has been sent.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-6 space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full border border-green-300 p-3 rounded-lg"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="w-full border border-green-300 p-3 rounded-lg"
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="message"
          rows="4"
          placeholder="Your Message"
          className="w-full border border-green-300 p-3 rounded-lg"
          value={formData.message}
          onChange={handleChange}
        ></textarea>

        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
