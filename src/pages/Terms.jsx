import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import './Privacy.css';
import './Terms.css';

const Terms = () => {
  return (
    <div className="legal-page terms-page">
      <div className="container">
        <Link to="/" className="legal-back-link">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <header className="legal-header">
          <FileText size={40} className="legal-icon" />
          <h1 className="legal-title">Terms and Conditions of Use</h1>
          <p className="legal-updated">Last updated: February 2025</p>
        </header>

        <div className="legal-content">
          <section>
            <h2>Introduction</h2>
            <p>
              Thank you for visiting our website. Please read and review the following Terms and Conditions of Use Agreement (the “Agreement”) carefully before using the website and any associated services. By using the website, you agree to be bound by the terms of this Agreement. If you do not agree with the terms of this Agreement, please exit the website and do not use the information contained herein.
            </p>
            <p>
              We reserve the right to change this Agreement, in whole or in part, at any time without prior notice. You should review this page before using the website and its related services to ensure you understand the terms upon which you are permitted access.
            </p>
          </section>

          <section>
            <h2>Your Use of the Website</h2>
            <p>
              Unless otherwise specified, your use of the website is governed by this Agreement and our <Link to="/privacy">Privacy Policy</Link>, which is incorporated by reference. You may not modify, distribute, transmit, reproduce, publish, license, transfer, or sell any information, products or services obtained or viewed on the website. You may display, download, or print hard copies of material contained on the website for your own personal, non-commercial use, provided you do not modify the content or delete any copyright, trademark or other proprietary notice. Any other use of the information on the website is prohibited without our express written consent.
            </p>
          </section>

          <section>
            <h2>Use of Information</h2>
            <p>
              This website provides information that must not be used as a substitute for the advice of your own physician (“Your Own Physician”). Information available from the website is not intended to diagnose any medical condition or disease. Always consult Your Own Physician concerning any health problem, medical condition or disease, and before taking any new medication or changing the dosage of medications you are currently taking. Always read the information provided with your medications.
            </p>
            <p>
              We reserve the right to correct any inaccuracies or typographical errors in the information posted on the website and shall have no liability for such inaccuracies or errors. Information may be changed or updated without notice. Prices and availability of goods and services are subject to change without notice.
            </p>
          </section>

          <section>
            <h2>Not Offering Advice</h2>
            <p>
              The content of the website is for informational purposes only. It is not intended to provide specific medical or non-medical advice and should not be relied upon in that regard. You should not act or rely on the content without seeking the advice of Your Own Physician and/or other health care professional where necessary.
            </p>
            <p>
              <strong>You should not use the content of the website for diagnosing, treating, curing or preventing a health problem or prescribing a product.</strong> You should carefully read all information provided by the manufacturers of the product or in the product packaging before using any product. Always consult Your Own Physician and/or health care professional for advice and treatment.
            </p>
          </section>

          <section>
            <h2>Trademarks and Other Intellectual Property</h2>
            <p>
              All text, graphics, user interfaces, visual interfaces, photographs, trademarks, logos, sounds, music, artwork and computer code (collectively, the “Content”), including the design, structure, selection, coordination, expression and arrangement of such Content on the website, is owned, controlled or licensed by us and is protected by copyright, patent and trademark laws and other intellectual property rights.
            </p>
            <p>
              Except as expressly provided in this Agreement, no part of the website and no Content may be copied, reproduced, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted or distributed in any way to any other computer, server, website or other medium for publication or distribution or for any commercial enterprise, without our express prior written consent.
            </p>
          </section>

          <section>
            <h2>Indemnity</h2>
            <p>
              You agree to indemnify and hold us and our subsidiaries, affiliates, officers, directors, agents, partners and employees harmless from any claim or demand, including reasonable attorney’s fees, made by any third party due to or arising out of your use of the Content and/or the website, any content you submit, post or transmit through the website, your connection to the website, your violation of this Agreement, or your violation of any rights of another.
            </p>
          </section>

          <section>
            <h2>Internet E-Mail</h2>
            <p>
              Any unprotected e-mail communication over the Internet is not confidential and is subject to possible interception, loss or alteration. Do not send anything you deem confidential. We are not responsible for and will not be liable to you or anyone else for any damages in connection with an e-mail sent by you to us or an e-mail sent by us to you at your request.
            </p>
          </section>

          <section>
            <h2>Links and Third-Party Content</h2>
            <p>
              Links from or to websites outside this website are for convenience only. We do not review, endorse, approve or control, and are not responsible for, any websites linked from or to the website, the content of those websites, or their products or services. Linking to any other website is at your sole risk. We disclaim all warranties, express or implied, as to the accuracy, validity and legality of any materials or information found on those websites. Links to downloadable software sites are for convenience only and we are not responsible or liable for any difficulties or consequences associated with downloading such software.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              Like many websites, we may collect information about website traffic and usage patterns through the use of cookies and server logs. Cookies are small text files that help us personalize content and provide certain features. Your browser can be set to reject all cookies; instructions are usually available in the “Help” section of your browser. Our use of cookies may allow us to collect information such as the type of web browser used. This information is not linked to personally identifiable information about a particular individual. Only authorized personnel have access to server logs and cookie data, and are held to strict confidentiality and security policies.
            </p>
          </section>

          <section>
            <h2>Availability of the Website</h2>
            <p>
              The website is generally available but we retain the right to make it unavailable at any time, for any reason. By using the website you agree that we will not be liable for any damage arising out of or related to any such interruption, suspension or termination. You are authorized to view the Content solely for your personal use. The material on the website is intended for individuals enquiring about the products or services we offer. Use by others may be prohibited.
            </p>
          </section>

          <section>
            <h2>Information You Provide</h2>
            <p>
              The collection and use of any information you provide is governed by our <Link to="/privacy">Privacy Policy</Link> and this Agreement. By using the website you grant us the rights set out in the Privacy Policy. You may not upload, distribute or otherwise publish on the website any information that is obscene, defamatory, libelous, threatening, abusive, illegal, an invasion of privacy, or otherwise objectionable.
            </p>
            <p>
              Except for individually-identifiable information collected in accordance with the Privacy Policy, any comments, suggestions, ideas or other information you communicate may become our exclusive property and you grant us a royalty-free, perpetual, irrevocable, world-wide, non-exclusive license to use or reproduce same. We are not obligated to compensate you for any such information.
            </p>
          </section>

          <section>
            <h2>Disclaimer of Warranties</h2>
            <p>
              We provide content on the website as a service to you. The website cannot and does not contain information about all medical conditions and may not contain all information applicable to your circumstances. The website is not intended for diagnosis and should not be used as a substitute for consultation with Your Own Physician. The content, the server that makes it available, and our services and products are provided on an “as is” and “as available” basis without warranty of any kind. We expressly disclaim liability for technical failures, incomplete or delayed transmissions, technical inaccuracies, and unauthorized access by third parties. We do not represent or warrant that no viruses or other harmful properties will be transmitted or that no damage will occur to your computer system. You have sole responsibility for adequate protection and backup of data and equipment. By using the website, you acknowledge that such use is at your own risk.
            </p>
            <p>
              To the full extent permitted by applicable law, we and our advisors, suppliers, officers, directors, employees and their successors and assigns disclaim and exclude all warranties with respect to all content, express, implied or statutory, including but not limited to warranties of merchantability, fitness for a particular purpose and non-infringement. We do not warrant the content to be accurate, complete or current, or that the website will operate without error or that the website or server are free of viruses or other harmful components. Price and availability content is subject to change without notice.
            </p>
            <p>
              We do not endorse the content of any website accessed via links from this website and are not responsible or liable for any such content. The website may include content provided by third parties and by you; we are a distributor of such content and not its publisher. We make no warranties as to the completeness, accuracy, timeliness or reliability of information or offers supplied by third parties. We do not warrant that information, services and products set out on the website will satisfy your requirements or that they are error- or defect-free. You assume responsibility for the accuracy and legality of any information you supply. We make no warranty that our content is applicable or appropriate for use in all jurisdictions.
            </p>
            <p>
              As partial consideration for your access to the website and use of its content, you agree that we are not liable to you for decisions you may make or your actions or non-actions in reliance upon the content. You also agree that our aggregate liability arising from or related to your use and access is limited to the purchase price of any items you purchased from us in the applicable transaction. We shall not be liable for any direct, indirect, special, incidental, consequential or punitive damages. If you are dissatisfied with the website or its content, your sole remedy is to discontinue using the website.
            </p>
          </section>

          <section>
            <h2>Your Agreement to Abide by Applicable Laws</h2>
            <p>
              By using the website you agree to comply with all applicable local, state, federal or international laws, statutes and regulations that relate to the use of the website and the associated services or products.
            </p>
          </section>

          <section>
            <h2>Relationship Between Us and Users</h2>
            <p>
              We and users of the website are independent contractors. No agency, partnership, employment or other relationship is created or intended to be created by use of the website.
            </p>
          </section>

          <section>
            <h2>Governing Law and Jurisdiction</h2>
            <p>
              The website is administered and controlled by us from our offices. You agree that this Agreement and use of the website will be governed by and construed in accordance with the laws of our jurisdiction. You have accessed the website at your own risk and remain responsible for complying with the laws of the jurisdiction in which you are located. You agree that all disputes, controversies or claims arising out of or in connection with the website shall be subject to the jurisdiction of our jurisdiction.
            </p>
          </section>

          <section>
            <h2>Local Laws, Import and Export</h2>
            <p>
              Not all products, services and content associated with the website may be available in all jurisdictions. By placing an order, you represent and are responsible to ensure that the sale, delivery and shipment will not violate any import, export or other law or regulation in your jurisdiction. The content does not constitute an offer or solicitation in any jurisdiction where it is not authorized or to any person to whom it is unlawful to make an offer or solicitation. The terms applicable to any product or service will be those determined at the time of provision. You are responsible for compliance with applicable laws. The website is not intended for use by persons under the age of majority in the jurisdiction in which they reside.
            </p>
          </section>

          <section>
            <h2>Prices; Payment Terms</h2>
            <p>
              Prices for products and services on the website are as set forth at the time of acceptance of an order. Prices may be subject to change without notice. Credit terms are at our discretion. Unless otherwise specified, payment must be received prior to our acceptance of an order.
            </p>
          </section>

          <section>
            <h2>Consequences</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate this Agreement. If your violation causes harm to others, you agree to indemnify and hold us harmless from and against any and all loss, damage or expense. If any dispute arises between us regarding this Agreement or your use of the website, it shall be resolved through good faith negotiations. If negotiations are unsuccessful, such disputes may be submitted to binding arbitration in accordance with the laws of our jurisdiction. The arbitration award shall be final and binding. Each party shall pay its own attorney fees and the parties shall share equally in the costs of the arbitration.
            </p>
          </section>

          <section>
            <h2>Entire Agreement</h2>
            <p>
              This Agreement, and any terms incorporated or referred to herein, constitute the entire agreement between us and you relating to your use of the website and supersede any prior understandings or agreements. This Agreement may not be amended or modified except in writing or by us making such amendments or modifications in accordance with this Agreement.
            </p>
          </section>

          <section>
            <h2>Severability</h2>
            <p>
              If any part of this Agreement is deemed unenforceable, that part shall be eliminated or limited to the minimum extent necessary. The remainder of this Agreement shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2>Headings</h2>
            <p>
              The section headings in this Agreement are for convenience only, do not form part of this Agreement, and no construction or inference may be derived from them.
            </p>
          </section>

          <section>
            <h2>Force Majeure</h2>
            <p>
              We shall not be liable for any delay or failure in performance caused by circumstances beyond our reasonable control, including without limitation delays due to backorders, mail delays, customs delays or lost shipments. We shall not be responsible to notify you in the event of such delays. You shall be solely responsible to make other arrangements or to purchase alternative products, and any costs incurred in connection with such purchases shall be borne by you.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For questions about these Terms and Conditions of Use, please visit our <Link to="/contact">Contact</Link> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
