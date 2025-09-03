import React, { useState } from 'react';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is a VIN and where can I find it?",
      answer: "A VIN (Vehicle Identification Number) is a 17-character code that uniquely identifies your vehicle. You can find it on the driver's side dashboard, door jamb, or vehicle registration documents."
    },
    {
      question: "How accurate is your VIN decoding?",
      answer: "Our data is 99.8% accurate. We source information from multiple reliable databases and continuously verify our data for accuracy."
    },
    {
      question: "What information will I get from decoding a VIN?",
      answer: "You'll get detailed vehicle information including model, year, engine specifications, transmission type, factory options, production date, and much more."
    },
    {
      question: "Is there a limit to how many VINs I can decode?",
      answer: "Free accounts can decode 5 VINs per month. Premium accounts have unlimited decoding capabilities."
    },
    {
      question: "How do I upgrade to a Premium account?",
      answer: "You can upgrade from your dashboard or the pricing page. We accept all major credit cards and PayPal."
    },
    {
      question: "Can I decode VINs from other car brands?",
      answer: "Currently, we specialize exclusively in BMW vehicles to provide the most comprehensive data possible."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="fw-bold">Frequently Asked Questions</h1>
            <p className="lead text-muted">Find answers to common questions about BimmerVIN</p>
          </div>

          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div key={index} className="accordion-item border-0 mb-3">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeIndex === index ? '' : 'collapsed'} fw-bold`}
                    type="button"
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${activeIndex === index ? 'show' : ''}`}>
                  <div className="accordion-body">
                    <p className="text-muted">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-5">
            <div className="card-body text-center p-5">
              <h5 className="card-title">Still have questions?</h5>
              <p className="card-text text-muted">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a href="/contact" className="btn btn-primary">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;