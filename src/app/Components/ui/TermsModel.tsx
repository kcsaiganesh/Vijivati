import React from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center m-auto justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md mx-10 w-[80vw]">
        <div className="max-h-96 overflow-y-auto">
          <p className="py-2">
            Welcome to Vijivati! These Terms and Conditions govern your use of
            our application and services (collectively referred to as the
            &quot;Service&quot;). By using Vijivati, you agree to these Terms.
            If you do not agree, please do not use our Service.
          </p>
          <h1 className="text-xl font-bold">Terms and Conditions</h1>
          <p>Last Updated: 10/10/2024</p>

          <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our Service, you confirm that you are at least
            18 years old or that you have obtained the consent of a parent or
            guardian to use the Service. If you are accessing the Service on
            behalf of a company or organization, you represent that you have the
            authority to bind that entity to these Terms.
          </p>

          <h2 className="text-lg font-semibold">2. Use of the Service</h2>
          <h3 className="font-semibold">a. Account Registration</h3>
          <p>
            To use certain features of the Service, you may be required to
            create an account. You agree to provide accurate, current, and
            complete information during the registration process and to update
            such information to keep it accurate, current, and complete.
          </p>

          <h3 className="font-semibold">b. User Conduct</h3>
          <p>
            You agree not to engage in any of the following prohibited
            activities:
          </p>
          <ul className="list-disc pl-5">
            <li>
              Using the Service for any illegal purpose or in violation of any
              local, state, national, or international law.
            </li>
            <li>
              Impersonating any person or entity or misrepresenting your
              affiliation with any person or entity.
            </li>
            <li>
              Transmitting any material that is unlawful, harmful, threatening,
              abusive, harassing, defamatory, vulgar, obscene, or otherwise
              objectionable.
            </li>
          </ul>

          <h2 className="text-lg font-semibold">3. Donations</h2>
          <p>
            Vijivati facilitates donations to registered animal rescue
            organizations. By making a donation through the Service, you
            acknowledge and agree to the following:
          </p>
          <ul className="list-disc pl-5">
            <li>All donations are final and non-refundable.</li>
            <li>
              The funds will be disbursed to the selected rescue organization in
              accordance with our internal policies.
            </li>
            <li>
              Vijivati does not guarantee the use of funds by the recipient
              organization.
            </li>
          </ul>

          <h2 className="text-lg font-semibold">4. Intellectual Property</h2>
          <p>
            The content and materials on the Service, including but not limited
            to text, graphics, logos, and software, are the property of Vijivati
            or its licensors and are protected by copyright, trademark, and
            other intellectual property laws. You may not use, reproduce, or
            distribute any content from the Service without our prior written
            consent.
          </p>

          <h2 className="text-lg font-semibold">5. Third-Party Links</h2>
          <p>
            The Service may contain links to third-party websites or services
            that are not owned or controlled by Vijivati. We have no control
            over, and assume no responsibility for, the content, privacy
            policies, or practices of any third-party sites or services. You
            acknowledge and agree that Vijivati shall not be responsible or
            liable, directly or indirectly, for any damage or loss caused by or
            in connection with the use of any such content, goods, or services
            available on or through any such sites or services.
          </p>

          <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Vijivati and its affiliates
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including without limitation,
            loss of profits, data, use, goodwill, or other intangible losses,
            resulting from:
          </p>
          <ul className="list-disc pl-5">
            <li>
              Your access to or use of (or inability to access or use) the
              Service;
            </li>
            <li>Any conduct or content of any third party on the Service;</li>
            <li>Any content obtained from the Service; and</li>
            <li>
              Unauthorized access, use, or alteration of your transmissions or
              content.
            </li>
          </ul>

          <h2 className="text-lg font-semibold">7. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Vijivati, its
            affiliates, and their respective officers, directors, employees, and
            agents from and against any claims, liabilities, damages, losses,
            costs, or expenses (including reasonable attorneys fees) arising out
            of or in any way connected with:
          </p>
          <ul className="list-disc pl-5">
            <li>Your access to or use of the Service;</li>
            <li>Your violation of these Terms;</li>
            <li>
              Your violation of any rights of another party, including without
              limitation any intellectual property rights; or
            </li>
            <li>Your violation of any applicable law.</li>
          </ul>

          <h2 className="text-lg font-semibold">8. Modifications</h2>
          <p>
            Vijivati reserves the right, at our sole discretion, to modify or
            replace these Terms at any time. If a revision is material, we will
            provide at least 30 days notice prior to the new terms taking
            effect. What constitutes a material change will be determined at our
            sole discretion. By continuing to access or use our Service after
            revisions become effective, you agree to be bound by the revised
            terms.
          </p>

          <h2 className="text-lg font-semibold">9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of India, without regard to its conflict of law provisions.
            You agree to submit to the personal jurisdiction of the courts
            located within India for the resolution of any disputes.
          </p>

          <h2 className="text-lg font-semibold">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            Vijivati-support@email.com <br />
            xxxxxxxx
          </p>
        </div>

        <div className="mt-4">
          <button
            onClick={onClose}
            className="bg-secondary text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
