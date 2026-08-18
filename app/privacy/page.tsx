import type { Metadata } from "next";
import { SiteHeader } from "@/components/blocks/site-header";
import { SiteFooter } from "@/components/blocks/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Glow's Lighting Services.",
};

export default function PrivacyPage() {
  return (
    <div className="dark bg-[#141C2F]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-32 pb-20 lg:pt-40">
        <h1 className="text-brand-cream">Privacy Policy</h1>
        <p className="mt-2 text-sm text-brand-cream/50">
          <strong>GrowthStory AI LLC dba Glow&rsquo;s Permanent Lighting</strong>
          <br />
          Last updated: August 10, 2026
        </p>

        <div className="prose-policy mt-10 space-y-8 text-sm leading-relaxed text-brand-cream/70">
          <p>
            This policy explains what information we collect when you use getglowslights.com,
            why we collect it, who we share it with, and how you can control it.
          </p>
          <p>
            If you have questions, contact us at{" "}
            <a href="mailto:blake@growthstory.ai" className="text-brand-gold hover:underline">
              blake@growthstory.ai
            </a>{" "}
            or{" "}
            <a href="tel:+19729510568" className="text-brand-gold hover:underline">
              (972) 951-0568
            </a>
            , or write to GrowthStory AI LLC, 5261 Dunhaven Rd, Noblesville, IN 46062.
          </p>

          <Section title="Who we are">
            <p>
              GrowthStory AI LLC, doing business as Glow&rsquo;s Permanent Lighting
              (&ldquo;Glow&rsquo;s,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;), installs
              permanent architectural lighting for homes and businesses in Hamilton County and
              the greater Indianapolis area. GrowthStory AI LLC is the entity responsible for
              the information described in this policy.
            </p>
          </Section>

          <Section title="What we collect">
            <p>
              <strong className="text-brand-cream/90">Information you give us directly.</strong>{" "}
              When you request a quote, we collect your name, phone number, email address,
              street address, city, and ZIP code, along with details about your property and
              the work you&rsquo;re considering &mdash; number of stories, which sides of the
              home you want lit, what you&rsquo;re lighting it for, your timeline, and anything
              you tell us in the notes field.
            </p>
            <p>
              <strong className="text-brand-cream/90">Information about how you found us.</strong>{" "}
              We collect the page you landed on, the referring website, and advertising
              parameters carried in the URL &mdash; including Meta click identifiers (fbclid),
              Google click identifiers (gclid), and UTM campaign tags.
            </p>
            <p>
              <strong className="text-brand-cream/90">Information collected automatically.</strong>{" "}
              Our site and our advertising tools collect your IP address, browser type and
              settings, device information, and pages viewed, using cookies and similar
              technologies.
            </p>
            <p>
              <strong className="text-brand-cream/90">Information about people you refer.</strong>{" "}
              If you use our referral program, we collect the name and contact information of
              the person you tell us about. See &ldquo;Referrals&rdquo; below.
            </p>
          </Section>

          <Section title="Why we collect it">
            <ul className="list-disc space-y-1 pl-5">
              <li>To prepare and deliver your quote</li>
              <li>To contact you about your quote and schedule work</li>
              <li>To measure which advertising and marketing brings us customers</li>
              <li>To improve our website and our services</li>
              <li>To meet legal, tax, and insurance obligations</li>
            </ul>
          </Section>

          <Section title="Meta Business Tools">
            <p>
              We use Meta Business Tools, including the Meta Pixel and the Meta Conversions
              API, on this website.
            </p>
            <p>
              These tools send information to Meta Platforms, Inc. about actions you take
              here &mdash; for example, viewing our quote page or submitting a quote request.
              The information sent may include your IP address, browser and device details, the
              pages you viewed, and contact information you submitted, such as your email
              address, phone number, name, and ZIP code. Contact information is hashed before
              it is transmitted.
            </p>
            <p>
              We use these tools to measure whether our advertising works, to understand which
              ads produce customers, and to show ads to people who have visited our site or who
              resemble our existing customers.
            </p>
            <p>
              Meta processes this information under its own terms, described at{" "}
              <span className="text-brand-cream/50">facebook.com/privacy/policy</span>. Meta
              may use it for its own purposes as set out in that policy.
            </p>
            <p>
              <strong className="text-brand-cream/90">You can limit this.</strong> You can
              adjust what Meta shows you and how it uses off-Meta activity through your Facebook
              and Instagram ad settings, including the Off-Facebook Activity controls. You can
              also block cookies through your browser settings, though parts of our site may not
              work correctly if you do.
            </p>
            <p>
              We also use similar advertising and analytics tools from Google. The same
              principles apply.
            </p>
          </Section>

          <Section title="Text messages">
            <p>
              If you check the box consenting to text messages, we will text you about your
              quote and your project. Message and data rates may apply. Message frequency varies.
            </p>
            <p>
              Consent to receive texts is not a condition of purchase. Reply STOP to any message
              to opt out, or HELP for assistance. We do not sell or share your phone number with
              third parties for their own marketing.
            </p>
          </Section>

          <Section title="Referrals">
            <p>
              If you refer someone to us, we ask for their name and contact information so we
              can credit your referral discount if they become a customer.
            </p>
            <p>
              <strong className="text-brand-cream/90">We do not contact people you refer.</strong>{" "}
              We give you a link to share with them yourself. If they choose to contact us using
              that link, they become a customer inquiry like any other, and this policy applies
              to them from that point forward.
            </p>
            <p>
              If we hold referral information for someone who never contacts us, we delete it
              when the referral period expires.
            </p>
          </Section>

          <Section title="AI-assisted calls and messages">
            <p>
              We use automated and AI-assisted systems to respond to quote requests, answer
              questions, schedule appointments, and follow up on your project. This means some
              calls and text messages you receive from us may use an artificial or AI-generated
              voice, or may contain text generated by an AI system.
            </p>
            <p>
              <strong className="text-brand-cream/90">We will tell you.</strong> Any call using
              an AI-generated voice identifies itself as such at the start of the call, along
              with our business name. You can ask to speak with a person at any point and we
              will connect you.
            </p>
            <p>
              <strong className="text-brand-cream/90">Consent.</strong> When you submit a quote
              request and consent to be contacted, that consent includes calls and messages that
              may be AI-generated. Consent is not a condition of purchase. You can withdraw it
              at any time by replying STOP to a text, telling us on a call, or contacting us at{" "}
              <a href="mailto:blake@growthstory.ai" className="text-brand-gold hover:underline">
                blake@growthstory.ai
              </a>{" "}
              or{" "}
              <a href="tel:+19729510568" className="text-brand-gold hover:underline">
                (972) 951-0568
              </a>.
            </p>
            <p>
              <strong className="text-brand-cream/90">Recording and transcripts.</strong> Calls
              may be recorded and transcribed so we can service your project accurately and
              improve our systems. Where a call is recorded, we disclose it at the start of the
              call. Recordings and transcripts are stored with our service providers and retained
              as described in &ldquo;How long we keep it.&rdquo;
            </p>
            <p>
              <strong className="text-brand-cream/90">What the AI does with what you say.</strong>{" "}
              Information from calls and messages is used to prepare your quote, schedule your
              work, and maintain your customer record. We do not use your recordings or
              transcripts to train publicly available AI models.
            </p>
          </Section>

          <Section title="Who we share it with">
            <p>We share information with:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="text-brand-cream/90">Service providers</strong> who help us
                run the business &mdash; website hosting, our customer database, email and text
                messaging, scheduling, and payment processing. They may only use it to provide
                services to us.
              </li>
              <li>
                <strong className="text-brand-cream/90">Advertising and analytics platforms</strong>,
                as described above.
              </li>
              <li>
                <strong className="text-brand-cream/90">Subcontractors</strong>, where we use
                them to perform work at your property, limited to what they need to do the job.
              </li>
              <li>
                <strong className="text-brand-cream/90">Anyone we&rsquo;re legally required to share with</strong>,
                including in response to lawful requests, or to protect our rights, property, or safety.
              </li>
            </ul>
            <p>
              <strong className="text-brand-cream/90">We do not sell your personal information.</strong>
            </p>
          </Section>

          <Section title="How long we keep it">
            <p>
              We keep quote requests and customer records for as long as we have a business
              relationship with you, and afterward as long as needed for warranty, tax,
              insurance, and legal purposes. Advertising and analytics data is retained
              according to each platform&rsquo;s own retention schedule.
            </p>
            <p>
              Referral information for people who never contact us is deleted when the referral
              period expires.
            </p>
          </Section>

          <Section title="Your choices">
            <p>You can:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Ask us what information we hold about you</li>
              <li>Ask us to correct it</li>
              <li>Ask us to delete it, subject to records we&rsquo;re required to keep</li>
              <li>Opt out of marketing emails using the unsubscribe link in any message</li>
              <li>Opt out of texts by replying STOP</li>
              <li>Block or delete cookies through your browser</li>
            </ul>
            <p>
              To make a request, contact us at{" "}
              <a href="mailto:blake@growthstory.ai" className="text-brand-gold hover:underline">
                blake@growthstory.ai
              </a>{" "}
              or{" "}
              <a href="tel:+19729510568" className="text-brand-gold hover:underline">
                (972) 951-0568
              </a>
              . We may need to verify your identity before acting on it.
            </p>
            <p>
              Depending on where you live, you may have additional rights under state privacy
              law. We honor those rights where they apply.
            </p>
          </Section>

          <Section title="Security">
            <p>
              We use reasonable measures to protect the information we hold, including
              encryption in transit and access controls on our systems. No method of
              transmission or storage is completely secure, and we cannot guarantee absolute
              security.
            </p>
          </Section>

          <Section title="Children">
            <p>
              Our services are directed to adults. We do not knowingly collect information from
              anyone under 18. If you believe we have, contact us and we will delete it.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              We may update this policy. When we do, we&rsquo;ll change the date at the top.
              Material changes will be posted on this page.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              GrowthStory AI LLC dba Glow&rsquo;s Permanent Lighting
              <br />
              5261 Dunhaven Rd
              <br />
              Noblesville, IN 46062
              <br />
              <a href="mailto:blake@growthstory.ai" className="text-brand-gold hover:underline">
                blake@growthstory.ai
              </a>
              <br />
              <a href="tel:+19729510568" className="text-brand-gold hover:underline">
                (972) 951-0568
              </a>
            </p>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-brand-cream">{title}</h2>
      {children}
    </div>
  );
}
