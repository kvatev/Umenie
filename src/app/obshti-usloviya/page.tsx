import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Общи условия | Образователен клуб „УМеНИе“",
  description:
    "Общи условия за използване на уебсайта на образователен клуб „УМеНИе“, гр. Бургас, управляван от „НИРАЛО“ ЕООД.",
};

export default function TermsPage() {
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
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-brand-purple leading-snug">
              ОБЩИ УСЛОВИЯ ЗА ИЗПОЛЗВАНЕ НА УЕБСАЙТА
            </h1>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-brand-dark/90 leading-relaxed font-sans">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              1. Общи положения
            </h2>
            <p>
              Настоящите Общи условия уреждат използването на уебсайта на образователен клуб „УМеНИе“,
              управляван от:
            </p>
            <div className="bg-brand-purple-light p-5 rounded-2xl border border-brand-purple/20 space-y-2">
              <p className="font-bold text-brand-dark">Данни за доставчика / дружеството:</p>
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
            <p>С използването на уебсайта потребителят се съгласява с настоящите Общи условия.</p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              2. Предназначение на уебсайта
            </h2>
            <p>
              Уебсайтът има информационен характер и предоставя информация относно дейността на
              образователен клуб „УМеНИе“, включително предлаганите курсове, уроци, клубове,
              творчески занимания, учебна занималня, събития, графици и други инициативи.
            </p>
            <p>
              Чрез уебсайта потребителите могат да разглеждат актуалния график и да изпращат заявки за
              записване за конкретно занимание.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              3. Информация за заниманията
            </h2>
            <p>На уебсайта може да бъде публикувана информация относно:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-brand-dark/85">
              <li>вид и описание на заниманието;</li>
              <li>подходяща възраст на децата;</li>
              <li>дата, ден и начален/краен час;</li>
              <li>място на провеждане (гр. Бургас, ж.к. Славейков, бл. 48, партер);</li>
              <li>наличие на свободни места.</li>
            </ul>
            <p>
              „НИРАЛО“ ЕООД полага необходимите грижи публикуваната информация да бъде актуална и точна.
              При необходимост графикът, датата, часът или преподавателят могат да бъдат актуализирани.
              При промяна, засягаща потвърдено участие, родителят или настойникът се уведомява
              своевременно по телефон.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              4. Изпращане на заявка за записване
            </h2>
            <p>
              Чрез уебсайта потребителят може да изпрати заявка за участие на дете в избрано занимание.
              За тази цел се предоставят необходимите данни, посочени във формата за записване.
            </p>
            <p className="bg-brand-purple-light p-4 rounded-2xl border border-brand-purple/20 font-semibold text-brand-dark">
              Изпращането на заявка чрез уебсайта не представлява автоматично сключване на договор или
              гаранция за запазено място.
            </p>
            <p>
              След получаване на заявката представител на образователен клуб „УМеНИе“ се свързва с
              родителя или настойника на посочения телефон за потвърждение и уточняване на детайли.
              Записването се счита за потвърдено след изрично потвърждение от страна на клуба.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              5. Онлайн плащания
            </h2>
            <p>
              Чрез уебсайта <strong>не се извършват онлайн плащания</strong>. Изпращането на заявка чрез
              формата не води до таксуване на банкови карти или автоматично начисляване на суми.
              Информация относно цената и начина на заплащане на конкретното занимание се предоставя
              лично или по телефона от клуба.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              6. Участие на деца
            </h2>
            <p>
              Заявка за записване на дете следва да бъде изпращана единствено от негов родител или
              законен настойник. При записване родителят предоставя вярна информация, необходима за
              организиране на безопасното и пълноценно участие на детето.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              7. Права и задължения на потребителите
            </h2>
            <p>При използване на уебсайта потребителите се задължават:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-brand-dark/85">
              <li>да предоставят коректни и валидни данни за контакт при подаване на заявка;</li>
              <li>да използват уебсайта съобразно неговото предназначение;</li>
              <li>
                да не предприемат действия, които могат да нарушат нормалното функциониране или
                сигурността на системата.
              </li>
            </ul>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              8. Интелектуална собственост
            </h2>
            <p>
              Цялото съдържание на уебсайта, включително текстове, авторски методики, графични
              елементи, лого, фотографски материали и дизайн, са собственост на „НИРАЛО“ ЕООД или се
              използват на законово основание. Не се допуска тяхното копиране, разпространение или
              използване за търговски цели без предварително писмено съгласие.
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              9. Защита на личните данни
            </h2>
            <p>
              Обработването на лични данни се осъществява в съответствие с Регламент (ЕС) 2016/679 (GDPR).
              Подробна информация за начините на събиране, съхранение и правата на субектите на данни
              може да намерите в нашата{" "}
              <Link
                href="/politika-za-poveritelnost"
                className="text-brand-purple font-semibold underline hover:text-brand-purple-hover"
              >
                Политика за поверителност
              </Link>
              .
            </p>

            <h2 className="font-heading font-bold text-lg sm:text-xl text-brand-purple pt-4">
              10. Контакти и сигнали
            </h2>
            <div className="bg-brand-bg p-4 rounded-2xl border border-brand-purple/20 space-y-1">
              <p className="font-bold text-brand-dark">За въпроси относно Общите условия:</p>
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
              <p className="text-sm">Адрес: гр. Бургас, ж.к. Славейков, бл. 48, партер</p>
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
