import { useState } from "react";
import ContactDataField from "../components/ContactDataField.jsx";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = `Portfolio hello from ${values.get("name")}`;
    const message = [`Name: ${values.get("name")}`, `Email: ${values.get("email")}`, "", values.get("message")].join("\n");
    window.location.href = `mailto:agundaaustine@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    setFormStatus("Your email app should open with this message ready to send.");
  }

  return (
    <main className="contact-page section-wrap" data-scene-stage="4">
      <ContactDataField />
      <div className="contact-copy reveal-on-scroll">
        <p className="eyebrow">CONTACT / OPEN CHANNEL</p><h1>Make a little<br /><em>signal.</em></h1>
        <p>Have a question, a useful problem, or an unexpected collaboration in mind? Send a note. I’m in Nairobi, Kenya.</p>
        <div className="contact-addresses">
          <a href="mailto:agundaaustine@yahoo.com"><span>EMAIL</span>agundaaustine@yahoo.com ↗</a>
          <a href="tel:+254707835758"><span>PHONE</span>+254 707 835 758 ↗</a>
          <a href="https://github.com/agunda99" target="_blank" rel="noreferrer"><span>GITHUB</span>@agunda99 ↗</a>
          <a href="https://linkedin.com/in/austine_agunda" target="_blank" rel="noreferrer"><span>LINKEDIN</span>austine_agunda ↗</a>
        </div>
      </div>
      <form className="contact-form reveal-on-scroll" onSubmit={handleSubmit}>
        <div className="form-topline"><span>TRANSMISSION FORM</span><span>ALL FIELDS REQUIRED</span></div>
        <label><span>YOUR NAME</span><input autoComplete="name" name="name" placeholder="Your name" required /></label>
        <label><span>YOUR EMAIL</span><input autoComplete="email" name="email" type="email" placeholder="you@example.com" required /></label>
        <label><span>THE MESSAGE</span><textarea name="message" rows="5" placeholder="Tell me what you're thinking…" required /></label>
        <button className="button button-dark" type="submit">Compose message <span aria-hidden="true">↗</span></button>
        <p className="form-note" aria-live="polite">{formStatus || "This opens your email app with the message filled in; you send it from there."}</p>
      </form>
    </main>
  );
}
