import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Events.css";

const Events = ({ home }) => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dummyEvents = [
    {
      _id: "dummy-1",
      name: "Tech Summit 2026",
      date: "2026-10-10",
      location: "Hyderabad",
      category: "IT",
      description: "Join top tech innovators to explore the future of AI and cloud computing.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    },
    {
      _id: "dummy-2",
      name: "AI Workshop",
      date: "2026-08-20",
      location: "Bangalore",
      category: "IT",
      description: "Learn Generative AI and machine learning concepts through live demos.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    },
    {
      _id: "dummy-3",
      name: "Business Leadership Summit",
      date: "2026-09-08",
      location: "Hyderabad",
      category: "NON-IT",
      description: "Enhance leadership and strategic management skills through workshops.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    },
    {
      _id: "dummy-4",
      name: "Digital Marketing Workshop",
      date: "2026-08-12",
      location: "Mumbai",
      category: "NON-IT",
      description: "Learn SEO, social media marketing, and online branding strategies.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    }
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const res = await fetch("https://brillon-tasks.onrender.com/events");
        if (!res.ok) throw new Error("Failed to fetch events from server.");

        const data = await res.json();

        if (isMounted) {
          if (data.success && data.events && data.events.length > 0) {
            setEvents(data.events);
          } else {
            setEvents(dummyEvents);
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        if (isMounted) setEvents(dummyEvents);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvents();
    return () => { isMounted = false; };
  }, []);

  const openForm = (event) => {
    setSelectedEventId(event._id);
    setErrorMessage("");
    setSuccessMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setErrorMessage("");
    setSuccessMessage("");
    setFormData({ name: "", email: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!formData.name.trim() || !isValidEmail) {
      setErrorMessage("Please enter a valid name and email address.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("https://brillon-tasks.onrender.com/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          eventId: selectedEventId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage("Successfully Registered!");
        setFormData({ name: "", email: "" });
        setTimeout(() => {
          closeForm();
        }, 1500);
      } else {
        setErrorMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration API error:", error);
      setErrorMessage("Failed to connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayedEvents = home ? events.slice(0, 3) : events;

  return (
    <div className="events-container" id="events">
      <h1 className="title">Upcoming Events</h1>

      {loading ? (
        <p className="loading-text">Loading operational manifests...</p>
      ) : (
        <div className="events-grid">
          {displayedEvents.map((event, index) => (
            <div className="event-card" key={`${event._id}-${index}`}>
              <img src={event.image} alt={event.name} loading="lazy" />

              <div className="event-content">
                {/* Dynamically computes structural tag filters for badge coloring */}
                <span className={`category ${event.category?.toLowerCase() === 'it' ? 'it-badge' : 'non-it-badge'}`}>
                  {event.category || "General"}
                </span>
                
                <h2>{event.name}</h2>
                <p className="event-meta">📅 {event.date ? new Date(event.date).toLocaleDateString(undefined, {dateStyle: 'medium'}) : "TBA"}</p>
                <p className="event-meta">📍 {event.location}</p>
                <p className="event-description">{event.description}</p>

                <button className="register-btn" onClick={() => openForm(event)}>
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {home && (
        <div className="view-more-container">
          <button className="view-more-btn" onClick={() => navigate("/events")}>
            View More Events
          </button>
        </div>
      )}

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Event Registration</h2>

            {errorMessage && <p className="form-msg error">{errorMessage}</p>}
            {successMessage && <p className="form-msg success">{successMessage}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? "Processing..." : "Confirm Seat"}
                </button>
                <button type="button" className="close-btn" onClick={closeForm} disabled={submitting}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;