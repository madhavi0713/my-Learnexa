import React, { useEffect, useState, useRef } from "react";
import { getUserEvents, registerForEvent, getMyEvents } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "./Events.css";

const Events = ({ home = false }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carousel slider state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const autoSlideTimer = useRef(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    fetchEvents();
    return () => {
      stopAutoSlide();
    };
  }, []);

  // Set up auto-sliding timer when events load for home page carousel
  useEffect(() => {
    if (home && events.length > 1) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, home]);

  const startAutoSlide = () => {
    stopAutoSlide();
    if (isHoveredRef.current) return;
    autoSlideTimer.current = setInterval(() => {
      const maxIndex = events.length > 0 ? events.length - 1 : 0;
      setCarouselIndex((prev) => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (autoSlideTimer.current) {
      clearInterval(autoSlideTimer.current);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const allEvents = await getUserEvents();
      setEvents(Array.isArray(allEvents) ? allEvents : []);

      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
        try {
          const registered = await getMyEvents();
          setMyEvents(Array.isArray(registered) ? registered : []);
        } catch (evtErr) {
          console.warn("Failed fetching registered events, continuing as guest", evtErr);
        }
      }
    } catch (err) {
      console.error("Error loading events", err);
      setError("Failed to fetch upcoming schedule. Please check back later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    if (!localStorage.getItem("token") && !localStorage.getItem("userToken")) {
      alert("Please log in to register for events.");
      return;
    }
    setActionLoading(true);
    try {
      await registerForEvent(eventId);
      alert("Successfully registered for this event!");
      // Refresh user's events list
      const registered = await getMyEvents();
      setMyEvents(Array.isArray(registered) ? registered : []);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || "Failed to register for event.");
    } finally {
      setActionLoading(false);
    }
  };

  const isRegistered = (eventId) => {
    return myEvents.some((e) => e._id === eventId || e.eventId?._id === eventId || e.eventId === eventId);
  };

  const nextSlide = () => {
    stopAutoSlide();
    const maxIndex = events.length > 0 ? events.length - 1 : 0;
    setCarouselIndex((prev) => {
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
    startAutoSlide();
  };

  const prevSlide = () => {
    stopAutoSlide();
    const maxIndex = events.length > 0 ? events.length - 1 : 0;
    setCarouselIndex((prev) => {
      if (prev <= 0) return maxIndex;
      return prev - 1;
    });
    startAutoSlide();
  };

  if (loading) {
    return (
      <div className="events-loading-panel">
        <div className="spinner-large"></div>
        <p>Syncing event schedules...</p>
      </div>
    );
  }

  // Home Page View: 3D perspective slider carousel
  if (home) {
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      stopAutoSlide();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      startAutoSlide();
    };

    const getCardStatus = (index) => {
      const total = events.length;
      if (total === 0) return "hidden";
      if (total === 1) return index === carouselIndex ? "active" : "hidden";
      if (total === 2) {
        if (index === carouselIndex) return "active";
        return "next";
      }
      
      let diff = index - carouselIndex;
      if (diff < -total / 2) diff += total;
      if (diff > total / 2) diff -= total;
      
      if (diff === 0) return "active";
      if (diff === -1) return "prev";
      if (diff === 1) return "next";
      return "hidden";
    };

    return (
      <section className="home-events-section" id="events">
        <div className="home-events-header">
          <h2 className="home-events-title">Upcoming Events</h2>
          <div className="carousel-controls">
            <button className="carousel-arrow prev" onClick={prevSlide} aria-label="Previous Slide">
              ←
            </button>
            <button className="carousel-arrow next" onClick={nextSlide} aria-label="Next Slide">
              →
            </button>
          </div>
        </div>

        <div className="home-events-carousel-wrapper">
          {events.length === 0 ? (
            <div className="empty-carousel-card">
              <span className="empty-icon">📅</span>
              <p>No seminars scheduled at this moment.</p>
            </div>
          ) : (
            <div 
              className="carousel-viewport-3d"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {events.map((evt, idx) => {
                const status = getCardStatus(idx);
                if (status === "hidden") return null;

                const registered = isRegistered(evt._id);
                const eventImage =
                  evt.image ||
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop";

                return (
                  <div className={`carousel-slide-item-3d ${status}`} key={evt._id}>
                    <div className="carousel-card-inner">
                      <div className="carousel-card-banner">
                        <img src={eventImage} alt={evt.name} className="carousel-card-img" />
                        <span className={`evt-category-tag ${evt.category?.toLowerCase() === "it" ? "it" : "non-it"}`}>
                          {evt.category || "General"}
                        </span>
                      </div>
                      <div className="carousel-card-body">
                        <h3>{evt.name}</h3>
                        <div className="evt-meta-row">
                          <span>📅 {evt.date ? new Date(evt.date).toLocaleDateString() : "TBA"}</span>
                          <span>📍 {evt.location || "Online"}</span>
                        </div>
                        <p className="evt-desc-excerpt">{evt.description}</p>
                      </div>
                      <div className="carousel-card-footer">
                        {registered ? (
                          <div className="registered-tick-badge">✓ Spot Reserved</div>
                        ) : (
                          <button 
                            className="btn-carousel-register"
                            onClick={() => handleRegister(evt._id)}
                            disabled={actionLoading}
                          >
                            Register Spot
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Dashboard Page View
  return (
    <div className="events-workspace">
      <section className="events-hero-section">
        <div className="hero-content">
          <h1>Workshops & Events</h1>
          <p>Join live, expert-led training sessions to gain competitive industry skills.</p>
        </div>
      </section>

      {error && <div className="events-error-banner">{error}</div>}

      <div className="events-layout-container">
        <main className="all-events-section">
          <h2>Upcoming Schedules ({events.length})</h2>
          {events.length === 0 ? (
            <div className="empty-events-card">
              <span className="empty-icon">📅</span>
              <p>No active schedules found.</p>
            </div>
          ) : (
            <div className="events-layout-grid">
              {events.map((evt) => {
                const registered = isRegistered(evt._id);
                const eventImage =
                  evt.image ||
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop";

                return (
                  <div className="event-workspace-card" key={evt._id}>
                    <div className="event-card-banner">
                      <img src={eventImage} alt={evt.name} className="evt-banner-img" />
                      <span className={`evt-category-tag ${evt.category?.toLowerCase() === "it" ? "it" : "non-it"}`}>
                        {evt.category || "General"}
                      </span>
                    </div>

                    <div className="event-card-body">
                      <h3>{evt.name}</h3>
                      <div className="evt-details-info">
                        <span className="evt-meta-item">📅 {evt.date ? new Date(evt.date).toLocaleDateString() : "TBA"}</span>
                        <span className="evt-meta-item">📍 {evt.location || "Online"}</span>
                      </div>
                      <p className="evt-desc">{evt.description}</p>
                    </div>

                    <div className="event-card-footer">
                      {registered ? (
                        <div className="event-registered-badge">✓ Reserved Spot</div>
                      ) : (
                        <button
                          className="btn-event-register"
                          onClick={() => handleRegister(evt._id)}
                          disabled={actionLoading}
                        >
                          Register Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <aside className="my-events-sidebar">
          <div className="my-events-card">
            <h3>My Reserved Events</h3>
            {!user ? (
              <p className="sidebar-empty-note">Log in to view and track your reserved events.</p>
            ) : myEvents.length === 0 ? (
              <p className="sidebar-empty-note">You haven't registered for any webinars yet.</p>
            ) : (
              <ul className="my-events-list">
                {myEvents.map((userEvt) => {
                  const evtDetail = userEvt.eventId || userEvt;
                  if (!evtDetail || !evtDetail.name) return null;
                  return (
                    <li className="my-event-list-item" key={userEvt._id}>
                      <span className="item-title">{evtDetail.name}</span>
                      <div className="item-meta">
                        <span>📅 {evtDetail.date ? new Date(evtDetail.date).toLocaleDateString() : "TBA"}</span>
                        <span>📍 {evtDetail.location || "Online"}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Events;
