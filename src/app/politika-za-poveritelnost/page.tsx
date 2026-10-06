import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Политика за поверителност | Образователен клуб „УМеНИе“",
  description:
    "Политика за поверителност и защита на личните данни на образователен клуб „УМеНИе“, управляван от „НИРАЛО“ ЕООД съгласно GDPR.",
};

export default function PrivacyPolicyPage() {
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
            <span>Назад към началната страница</span>
          </Link>
        </div>

        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-card border border-brand-purple/15 space-y-6">
          <div className="flex items-center gap-3 border-b border-brand-purple/15 pb-4">
            <div className="p-2.5 rounded-2xl bg-brand-purple/10 text-brand-purple shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-brand-purple leading-snug">
              ПОЛИТИКА ЗА ПОВЕРИТЕЛНОСТ И ЗАЩИТА НА ЛИЧНИТЕ ДАННИ
            </h1>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-brand-dark/90 leading-relaxed font-sans">
            <p>
              Настоящата Политика за поверителност и защита на личните данни урежда начина, по който
              „НИРАЛО“ ЕООД събира, обработва, съхранява и защитава личните данни на посетителите на
              уебсайта на образователен клуб „УМеНИе“, включително данните, предоставяни чрез
              формата за записване.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              1. Администратор на лични данни
            </h2>
            <div className="bg-brand-purple-light p-5 rounded-2xl border border-brand-purple/20 space-y-2">
              <p className="font-bold text-brand-dark">Администратор на личните данни е:</p>
              <p className="text-brand-dark/90">
                <strong>„НИРАЛО“ ЕООД</strong>
                <br />
                <strong>ЕИК:</strong> 207827453
                <br />
                <strong>Представлявано от:</strong> Теодора Ралева Бакърджиева
                <br />
                <strong>Седалище и адрес на управление:</strong> гр. Бургас, ж.к. Славейков, бл. 39,
                вх. 7, ет. 4
                <br />
                <strong>Телефон за контакт:</strong>{" "}
                <a href="tel:0877488481" className="hover:underline text-brand-purple font-semibold">
                  0877 488 481
                </a>
                <br />
                <strong>Електронна поща:</strong> umenie48@gmail.com
              </p>
            </div>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              2. Категории лични данни
            </h2>
            <p>
              При използване на формата за заявка за записване на уебсайта могат да бъдат
              обработвани следните лични данни:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-brand-dark/85">
              <li>име на детето;</li>
              <li>възраст на детето;</li>
              <li>име на родител или законен настойник;</li>
              <li>телефон за контакт;</li>
              <li>електронна поща, когато е предоставена;</li>
              <li>информация за избраното занимание, включително дата и час.</li>
            </ul>
            <p>
              Задължителните полета във формата са необходими за приемане, обработване и
              потвърждаване на заявката за записване. Предоставянето на електронна поща за целите на
              директния маркетинг е напълно доброволно.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              3. Цели на обработването
            </h2>
            <p>Личните данни, предоставени чрез формата за записване, се обработват за следните цели:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-brand-dark/85">
              <li>приемане и обработване на заявката за записване;</li>
              <li>осъществяване на контакт с родителя или законния настойник;</li>
              <li>предоставяне на информация относно избраното занимание, график и свободни места;</li>
              <li>потвърждаване и организиране на записването;</li>
              <li>
                изпращане на информация за предстоящи занимания, курсове и събития на образователен клуб
                „УМеНИе“, когато е предоставено отделно съгласие за получаване на такава комуникация.
              </li>
            </ul>
            <p>
              Данните, предоставени за обработване на заявката, не се използват за директен маркетинг,
              освен когато лицето изрично е предоставило отделно съгласие за това.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              4. Правни основания за обработването
            </h2>
            <p>
              Личните данни, необходими за обработване на заявката за записване, се обработват на
              основание чл. 6, пар. 1, б. „б“ от Регламент (ЕС) 2016/679 (GDPR) – обработването е
              необходимо за предприемане на стъпки по искане на субекта на данните преди сключването
              на договор.
            </p>
            <p>
              Електронната поща се използва за изпращане на маркетингова комуникация на основание
              чл. 6, пар. 1, б. „а“ от Регламент (ЕС) 2016/679 – изрично съгласие на субекта на
              данните. Съгласието за получаване на маркетингови съобщения е доброволно и не е
              условие за изпращане или обработване на заявка за записване.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              5. Съгласие за директен маркетинг
            </h2>
            <p>
              Съгласието за получаване на маркетингови съобщения се предоставя чрез отделно,
              предварително неотметнато поле (чекбокс) във формата на уебсайта. При предоставено
              съгласие електронният адрес може да бъде използван за изпращане на информация относно
              предстоящи занимания, курсове, събития и други инициативи на образователен клуб
              „УМеНИе“.
            </p>
            <p>
              Съгласието може да бъде оттеглено по всяко време чрез механизма за отписване в съответното
              електронно съобщение или чрез изпращане на писмено искане на имейл:{" "}
              <a
                href="mailto:umenie48@gmail.com"
                className="text-brand-purple underline font-semibold hover:text-brand-purple-hover"
              >
                umenie48@gmail.com
              </a>
              . Оттеглянето на съгласието не засяга законосъобразността на обработването, извършено
              преди неговото оттегляне.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              6. Срокове за съхранение
            </h2>
            <p>
              Личните данни, предоставени чрез заявка, която не е довела до записване, се съхраняват
              за срок до 1 година след приключване на комуникацията, след което се изтриват.
            </p>
            <p>
              Когато заявката доведе до записване, данните, необходими за предоставяне на съответната
              услуга, могат да бъдат обработвани за срока на предоставянето ѝ, както и за по-дълъг
              срок, когато това е необходимо за изпълнение на приложимо счетоводно или законово
              задължение.
            </p>
            <p>
              Електронният адрес, използван за директен маркетинг въз основа на съгласие, се обработва
              до оттегляне на съгласието или до преустановяване на маркетинговата комуникация от
              страна на администратора.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              7. Получатели на личните данни
            </h2>
            <p>
              Достъп до личните данни имат само лица, за които той е необходим във връзка с
              обработването на заявките, организацията на заниманията и дейността на образователен
              клуб „УМеНИе“.
            </p>
            <p>
              При необходимост лични данни могат да бъдат обработвани от доверени доставчици на
              услуги, използвани от „НИРАЛО“ ЕООД, включително:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-brand-dark/85">
              <li>доставчици на хостинг и техническа поддръжка на уебсайта;</li>
              <li>доставчици на сигурни облачни услуги и бази данни (Supabase);</li>
              <li>доставчици на електронна поща и бюлетини (Mailchimp/Resend).</li>
            </ul>
            <p className="bg-brand-purple-light p-4 rounded-2xl border border-brand-purple/20 font-semibold text-brand-dark">
              „НИРАЛО“ ЕООД не продава и не предоставя личните данни на трети лица за техни собствени
              маркетингови цели.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              8. Лични данни на деца
            </h2>
            <p>
              Във връзка със заявката за записване се обработват единствено минимално необходимите
              лични данни на детето – собствено име, възраст и информация за избраното занимание.
              Заявката за записване следва да бъде подавана от родител или законен настойник. Чрез
              формата не се изисква предоставяне на ЕГН, адрес или чувствителни категории данни.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              9. Защита на личните данни
            </h2>
            <p>
              „НИРАЛО“ ЕООД прилага съвременни технически и организационни мерки за защита на
              личните данни от неправомерен достъп, загуба, унищожаване, изменение или неразрешено
              разкриване, включително криптиране при предаване по интернет чрез SSL протокол.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              10. Права на субектите на данни
            </h2>
            <p>Съгласно Регламент (ЕС) 2016/679, вие разполагате със следните права:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-brand-dark/85">
              <li>право на достъп до личните си данни;</li>
              <li>право да поискате коригиране на неточни или непълни лични данни;</li>
              <li>право да поискате изтриване на личните данни („право да бъдеш забравен“);</li>
              <li>право да поискате ограничаване на обработването;</li>
              <li>право на преносимост на данните;</li>
              <li>право на възражение срещу обработването;</li>
              <li>право да оттеглите предоставеното съгласие по всяко време;</li>
              <li>право на жалба до Комисията за защита на личните данни (КЗЛД).</li>
            </ul>

            <div className="bg-brand-bg p-4 rounded-2xl border border-brand-purple/20 space-y-1">
              <p className="font-bold text-brand-dark">За контакт и упражняване на вашите права:</p>
              <p className="text-sm">
                Телефон:{" "}
                <a href="tel:0877488481" className="hover:underline text-brand-purple font-semibold">
                  0877 488 481
                </a>
              </p>
              <p className="text-sm">
                Имейл:{" "}
                <a href="mailto:umenie48@gmail.com" className="text-brand-purple underline">
                  umenie48@gmail.com
                </a>
              </p>
            </div>

            <div className="pt-6 border-t border-brand-purple/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-brand-muted">
                Последна актуализация: 28 септември 2026 г.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-heading font-bold text-brand-purple hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Обратно към началната страница</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
