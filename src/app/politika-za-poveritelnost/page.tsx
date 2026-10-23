import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Политика за поверителност | Образователен клуб „УМеНИе“",
  description:
    "Политика за поверителност и защита на личните данни на образователен клуб „УМеНИе“, управляван от „НИРАЛО“ ЕООД съгласно GDPR.",
};

export default async function PrivacyPolicyPage() {
  const { locale, dict } = await getServerDictionary();
  const p = dict.legal.privacy;

  return (
    <div className="py-10 sm:py-16 md:py-20 bg-brand-bg">
      <Container size="md">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-brand-purple hover:text-brand-purple-hover transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{dict.legal.backHome}</span>
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-card border border-brand-purple/15 space-y-6">
          <div className="flex items-center gap-3 border-b border-brand-purple/15 pb-4">
            <div className="p-2.5 rounded-2xl bg-brand-purple/10 text-brand-purple shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-brand-purple leading-snug">
              {p.title}
            </h1>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-brand-dark/90 leading-relaxed font-sans">
            <p>{p.intro}</p>

            <div className="bg-brand-purple-light p-5 rounded-2xl border border-brand-purple/20 space-y-2">
              <p className="font-bold text-brand-dark">{p.controllerTitle}</p>
              <p className="text-brand-dark/90">
                <strong>{p.companyName}</strong>
                <br />
                <strong>{p.uicLabel}</strong> 207827453
                <br />
                <strong>{p.repLabel}</strong> {p.repName}
                <br />
                <strong>{p.addressLabel}</strong> {p.addressValue}
                <br />
                <strong>{p.phoneLabel}</strong>{" "}
                <a href="tel:0877488481" className="hover:underline text-brand-purple font-semibold">
                  0877 488 481
                </a>
                <br />
                <strong>{p.emailLabel}</strong>{" "}
                <a href="mailto:info@umenie.net" className="hover:underline text-brand-purple font-semibold">
                  info@umenie.net
                </a>
              </p>
            </div>

            {p.sections.map((section: { heading: string; body: string }, idx: number) => (
              <div key={idx} className="space-y-2">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
                  {section.heading}
                </h2>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
