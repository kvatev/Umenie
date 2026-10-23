import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Общи условия | Образователен клуб „УМеНИе“",
  description:
    "Общи условия за използване на уебсайта на образователен клуб „УМеНИе“, гр. Бургас, управляван от „НИРАЛО“ ЕООД.",
};

export default async function TermsPage() {
  const { locale, dict } = await getServerDictionary();
  const t = dict.legal.terms;

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
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-brand-purple leading-snug">
              {t.title}
            </h1>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-brand-dark/90 leading-relaxed font-sans">
            <p>{t.intro}</p>

            <div className="bg-brand-purple-light p-5 rounded-2xl border border-brand-purple/20 space-y-2">
              <p className="font-bold text-brand-dark">{t.providerTitle}</p>
              <p className="text-brand-dark/90">
                <strong>{t.companyName}</strong>
                <br />
                <strong>{t.uicLabel}</strong> 207827453
                <br />
                <strong>{t.repLabel}</strong> {t.repName}
                <br />
                <strong>{t.addressLabel}</strong> {t.addressValue}
                <br />
                <strong>{t.phoneLabel}</strong>{" "}
                <a href="tel:0877488481" className="hover:underline text-brand-purple font-semibold">
                  0877 488 481
                </a>
                <br />
                <strong>{t.emailLabel}</strong>{" "}
                <a href="mailto:info@umenie.net" className="hover:underline text-brand-purple font-semibold">
                  info@umenie.net
                </a>
              </p>
            </div>

            {t.sections.map((section: { heading: string; body: string }, idx: number) => (
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
