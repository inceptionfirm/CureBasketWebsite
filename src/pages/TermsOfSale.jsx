import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import './Privacy.css';
import './Terms.css';

const TermsOfSale = () => {
  return (
    <div className="legal-page terms-page">
      <div className="container">
        <Link to="/" className="legal-back-link">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <header className="legal-header">
          <FileText size={40} className="legal-icon" />
          <h1 className="legal-title">Terms of Sale</h1>
          <p className="legal-updated">Last updated: October 2019</p>
        </header>

        <div className="legal-content">
          <section>
            <h2>Introduction</h2>
            <p>
              Our pharmacy, which includes its employees, officers, directors, affiliates, representatives, agents, contractors and sub-contractors (collectively, “we” or “the Pharmacy”), specializes in assisting patients obtain high quality, affordable prescription and non-prescription medications and services (collectively, the “Products”). Since you may not be located in the same area as our pharmacy, it may be necessary for you to authorize us to act as your authorized agent so that you may obtain the Products. The following terms and conditions (collectively, the “Terms of Sale”) govern the services provided by us and you (the “Customer” or “You”) in relation to obtaining the Products we offer. By accepting delivery of the Products described on a purchase order (an “Order”), you agree to be bound by and accept these Terms of Sale.
            </p>
            <p>
              <strong>These Terms of Sale apply to all transactions, both current and future, involving our services and the purchase of Products from us.</strong> If you do not agree to these Terms of Sale, we will not be able to facilitate your purchase of Products. If you have received Products with these Terms of Sale and you do not agree to be bound by them, you must return the Products within 30 days by contacting us using the contact details available on this website.
            </p>
          </section>

          <section>
            <h2>1. About You</h2>
            <p>
              By placing an order with us, you acknowledge that you are of the age of majority in the jurisdiction where you reside, are of sound mind, and are fully competent to make your own decisions. You also agree to be bound by these Terms of Sale with full knowledge and without undue influence or duress. You acknowledge that these Terms of Sale are readily accessible on this website and that you have been provided with the opportunity to obtain independent legal advice with respect to them.
            </p>
          </section>

          <section>
            <h2>2. Personal Examination</h2>
            <p>
              You understand that it is your responsibility to have your prescribing physician (“Your Own Physician”) conduct regular physical examinations, including any and all suggested testing, to ensure that you have no medical problems which would constitute a contraindication to you taking the Product. You certify that you have had a physical examination by Your Own Physician within the last twelve (12) months from the date of accepting delivery of the Products described in the Order.
            </p>
          </section>

          <section>
            <h2>3. Power of Attorney</h2>
            <p>
              You appoint us, as required, to act as your agent and power of attorney in order to take all steps deemed necessary to have the Product dispensed by us, to the same extent that you could do if you were personally present, including: (a) collecting personal health information; (b) disclosing that information to and having a licensed physician (the “Secondary Physician”) perform an independent medical review of your personal health information and the prescription issued by Your Own Physician in order to obtain a valid prescription for the Product, if required; (c) packaging the Product; and (d) arranging for delivery of the Product to you. You hereby waive any requirement of the Secondary Physician to conduct a physical examination of you prior to issuing a valid prescription for the Product, if required. This authorization may be revoked at any time and shall continue until such revocation has been provided by you to us, in writing.
            </p>
          </section>

          <section>
            <h2>4. Parent / Legal Guardian</h2>
            <p>
              If you have placed the Order for a child under the age of majority or a dependent, you confirm that you are the parent, legal guardian and/or have power of attorney for that person, with full authority to agree to these Terms of Sale on their behalf.
            </p>
          </section>

          <section>
            <h2>5. Prescription Required</h2>
            <p>
              You acknowledge that we will not accept any Order for prescription-only Products unless you deliver a valid original prescription issued by Your Own Physician based upon a personal consultation and examination, as referenced in section 2 above.
            </p>
          </section>

          <section>
            <h2>6. Shipping</h2>
            <p>
              Delivery of the Products ordered from us takes place when the Products leave the pharmacy. As your authorized agent, we will arrange for the shipping of the Products to your address. Delivery times may vary. If shipment of the Products is delayed, we may arrange for a replacement order to be sent to you at no additional cost where appropriate. We are not liable for any damages suffered due to delay in shipment or failure of the Products to arrive within a specified number of days.
            </p>
          </section>

          <section>
            <h2>7. Regulatory and Import</h2>
            <p>
              Not all Products we offer may be approved by the regulatory authority in your jurisdiction. By placing an Order, you acknowledge that you are aware that certain Products may be subject to import or regulatory requirements in your location and that regulatory authorities may contact you regarding the importation or use of the Product.
            </p>
          </section>

          <section>
            <h2>8. Payment Terms</h2>
            <p>
              The price(s) for the Products shall be as specified by us and as set forth at the time of acceptance of the Order. Prices may be subject to change without notice. Any Order placed by you is not binding on us until accepted. Credit terms are at our discretion. Payment for the Order may be made by any form of credit or payment we accept.
            </p>
          </section>

          <section>
            <h2>9. Shipping Charges; Taxes</h2>
            <p>
              Charges for shipping and handling will be shown on the invoice issued to you. You are responsible for all applicable taxes associated with the Order. If applicable, separate charges for taxes will be shown on the invoice.
            </p>
          </section>

          <section>
            <h2>10. Warranties</h2>
            <p>
              The manufacturers of the Products are solely responsible for any warranty associated with the Products. To the maximum extent permitted by law, we disclaim all warranties and conditions, express or implied, in respect of the Products and services covered by these Terms of Sale, including without limitation implied warranties of merchantability and fitness for a particular purpose. Our responsibility for claims in respect of the Products is limited to replacement of the Products.
            </p>
          </section>

          <section>
            <h2>11. Return Policy</h2>
            <p>
              We do not accept returns unless an error was made by us in dispensing the medication, such as sending the wrong product or dispensing contrary to a valid prescription. In such cases, only the cost of the medication will be refunded to the original payment method. All duties, tariffs and shipping costs associated with the order are non-refundable.
            </p>
          </section>

          <section>
            <h2>12. Reshipment Policy</h2>
            <p>
              If an order needs to be reshipped due to an error by us, only the cost of the medication will be applied as credit toward the reshipment. Duties, tariffs and shipping for reshipped orders remain the responsibility of the customer. For the most up-to-date information on our return and reshipment policies, please refer to this website or contact us.
            </p>
          </section>

          <section>
            <h2>13. Privacy Policy</h2>
            <p>
              You must fully and accurately disclose your personal health information and consent to its use by us and the Secondary Physician, as required. By submitting an Order, you have consented to the collection and use of your personal information as described in our <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2>14. Force Majeure</h2>
            <p>
              We shall not be liable for any delay or failure in performance caused by circumstances beyond our reasonable control, including without limitation delays due to back orders, mail delays, customs delays and lost shipments. Although we will make reasonable efforts to maintain good client relations, we are not responsible to notify you in the event of any delay. You are solely responsible to make such arrangements or to purchase alternative Products in the event of any such delay. Any costs incurred in association with such purchases shall be borne by you.
            </p>
          </section>

          <section>
            <h2>15. Governing Law</h2>
            <p>
              Title to the Products passes to you when they leave our pharmacy. Any agreements reached or contracts formed and transactions undertaken with us are deemed to be made in our jurisdiction and shall be governed by the laws of that jurisdiction. The laws of that jurisdiction shall have sole and exclusive jurisdiction over any dispute arising between you and us under these Terms of Sale.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For questions about these Terms of Sale, please visit our <Link to="/contact">Contact</Link> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfSale;
