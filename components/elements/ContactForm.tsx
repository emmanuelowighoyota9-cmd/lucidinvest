"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [formData, setFormData] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let result: unknown = null;
      try {
        result = await response.json();
      } catch {
        /* A non-JSON response still falls back to the message below. */
      }
      const message =
        result && typeof result === "object" && "message" in result && typeof result.message === "string"
          ? result.message
          : "";

      if (response.ok) {
        setStatus("success");
        setFeedback(message || "Message sent successfully.");
        setFormData(EMPTY);
      } else {
        setStatus("error");
        setFeedback(message || "We could not send your message. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Connection problem. Check your internet connection and try again.");
    }
  };

  return (
    <form id="contact-form" onSubmit={handleSubmit} className="default-form2" noValidate={false}>
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-6">
          <div className="form-group">
            <div className="input-box">
              <input
                type="text"
                name="name"
                required
                maxLength={120}
                value={formData.name}
                onChange={handleChange}
                placeholder="your name"
                aria-label="Your name"
              />
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6">
          <div className="form-group">
            <div className="input-box">
              <input
                type="tel"
                name="phone"
                id="formPhone"
                maxLength={32}
                value={formData.phone}
                onChange={handleChange}
                placeholder="phone number"
                aria-label="Phone number"
              />
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6">
          <div className="form-group">
            <div className="input-box">
              <input
                type="email"
                name="email"
                required
                maxLength={254}
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                aria-label="Email address"
              />
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6">
          <div className="form-group">
            <div className="input-box">
              <input
                type="text"
                name="subject"
                id="formSubject"
                required
                maxLength={160}
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                aria-label="Subject"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="form-group">
            <div className="input-box">
              <textarea
                name="message"
                required
                rows={4}
                maxLength={5000}
                value={formData.message}
                onChange={handleChange}
                placeholder="Message goes here"
                aria-label="Message"
              />
            </div>
          </div>
        </div>
        <div className="col-xl-12">
          <div className="button-box">
            <div className="btn-box">
              <button className="btn-one" type="submit" disabled={status === "loading"}>
                <span className="txt">{status === "loading" ? "Sending…" : "Send Your Message"}</span>
                <i className="icon-right-arrow"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <p role="status" aria-live="polite" style={{ marginTop: 12 }}>
        {status === "loading" ? "Sending..." : ""}
        {status === "success" ? feedback : ""}
        {status === "error" ? feedback : ""}
      </p>
    </form>
  );
}
