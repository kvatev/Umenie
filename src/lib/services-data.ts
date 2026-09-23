export interface ServiceData {
  slug: string;
  title: string;
  shortTitle: string;
  cardImage: string;
  shortDescription: string;
  sloganPart1: string;
  sloganPart2: string;
  intro: string;
  bulletPoints: string[];
  sliderImages: string[];
  pageImages: string[];
  seoDescription: string;
}

export const SERVICES_DATA: ServiceData[] = [
  {
    slug: "pletivo",
    title: "ПЛЕТИВО",
    shortTitle: "Плетиво",
    cardImage: "/images/services/pletivo.webp",
    shortDescription:
      "Бримките се редят, разговорите вървят, а идеите стават плетива. Децата развиват сръчност и търпение, следват идеите си докрай и виждат резултата от усилията си – с приятели и подкрепа по пътя.",
    sloganPart1: "Днес е плетиво.",
    sloganPart2: "Утре е постоянството да стигаш докрай.",
    intro:
      "Всяка седмица в образователен клуб „УМеНИе“ връщаме децата към радостта от малките неща. Плетивото развива фината моторика, сръчност и внимание към детайла, стимулира креативността и носи истинско удовлетворение от сътворяването с ръце.",
    bulletPoints: [
      "Грешките се разплитат, опитите се повтарят, а във всяко плетиво се оглеждат усилията им и радостта, че не са се отказали.",
      "Първите бримки започват от нулата – опитът не е условие, любопитството е.",
      "Опитни преподаватели са до децата, за да има кой да помогне точно когато е нужно.",
      "Докато ръцете са заети с плетиво, има време за споделяне, смях и нови приятелства.",
      "Преждата, инструментите и всичко необходимо ги очакват при нас – остава само да започнат.",
    ],
    sliderImages: [
      "/images/services/pletivo/slider/slide-1.webp",
      "/images/services/pletivo/slider/slide-2.webp",
      "/images/services/pletivo/slider/slide-3.webp",
      "/images/services/pletivo/slider/slide-4.webp",
      "/images/services/pletivo/slider/slide-5.webp",
      "/images/services/pletivo/slider/slide-6.webp",
      "/images/services/pletivo/slider/slide-7.webp",
      "/images/services/pletivo/slider/slide-8.webp",
    ],
    pageImages: [
      "/images/services/pletivo/page/page-1.webp",
      "/images/services/pletivo/page/page-2.webp",
      "/images/services/pletivo/page/page-3.webp",
    ],
    seoDescription:
      "Занимания по плетиво за деца в Бургас. Развиване на търпение, фина моторика и творчески умения в Образователен клуб „УМеНИе“.",
  },
  {
    slug: "urotsi-i-kursove",
    title: "УРОЦИ И КУРСОВЕ",
    shortTitle: "Уроци и курсове",
    cardImage: "/images/services/urotsi.webp",
    shortDescription:
      "Истинският напредък започва там, където е детето. Английски, български и математика в малки групи, с лично внимание и практика, която превръща знанията в увереност.",
    sloganPart1: "Днес е урок.",
    sloganPart2: "Утре е увереността, че можеш да се справиш сам.",
    intro:
      "Български език, математика и английски език в малки групи, с внимание към нивото и индивидуалните нужди на всяко дете. Стъпваме върху текущите му знания и уверено го издигаме нагоре.",
    bulletPoints: [
      "Разбирането идва преди запомнянето – целта е детето да знае как да стигне само до верния отговор.",
      "Малките групи дават пространство на всяко дете да задава въпроси, да опитва и да напредва без притеснение.",
      "Знанията влизат в употреба с практически задачи и упражнения, които гарантират дълготрайно научаване.",
      "Регулярна и открита обратна връзка към родителите – за постигнатия напредък, силните страни и следващите цели.",
    ],
    sliderImages: [
      "/images/services/urotsi-i-kursove/page/page-1.webp",
      "/images/services/urotsi-i-kursove/page/page-2.webp",
      "/images/banner/1.webp",
      "/images/banner/2.webp",
      "/images/banner/3.webp",
    ],
    pageImages: [
      "/images/services/urotsi-i-kursove/page/page-1.webp",
      "/images/services/urotsi-i-kursove/page/page-2.webp",
    ],
    seoDescription:
      "Уроци и курсове по български език, математика и английски за деца в Бургас, кв. Славейков. Малки групи и високи резултати в клуб УМеНИе.",
  },
  {
    slug: "uchebna-zanimalnya",
    title: "УЧЕБНА ЗАНИМАЛНЯ",
    shortTitle: "Учебна занималня",
    cardImage: "/images/services/uchebna-zanimalnya.webp",
    shortDescription:
      "Домашните не трябва да са предизвикателство. В спокойна среда и с нужната подкрепа децата се учат да работят самостоятелно и с гордост от резултатите си.",
    sloganPart1: "Днес е домашно.",
    sloganPart2: "Утре е умението да се справяш сам.",
    intro:
      "В учебната занималня децата подготвят уроците и домашните си работи с навременна подкрепа. Учат се постепенно сами да организират задачите си, да разпределят времето си ефективно и да довършват започнатото с желание.",
    bulletPoints: [
      "Домашните са написани, уроците – подготвени, с подкрепа точно там, където детето среща затруднение.",
      "Учи се как да управлява времето си – кое е първо, колко време остава и как се постига крайната цел.",
      "Помагаме, без да вършим вместо тях – целта е детето с всеки изминал ден да има все по-малко нужда от външна намеса.",
      "Редът в задачите носи ред и в ученето – децата изграждат свой собствен устойчив работен ритъм.",
    ],
    sliderImages: [
      "/images/services/uchebna-zanimalnya/page/page-1.webp",
      "/images/services/uchebna-zanimalnya/page/page-2.webp",
      "/images/banner/4.webp",
      "/images/banner/5.webp",
      "/images/banner/6.webp",
    ],
    pageImages: [
      "/images/services/uchebna-zanimalnya/page/page-1.webp",
      "/images/services/uchebna-zanimalnya/page/page-2.webp",
    ],
    seoDescription:
      "Учебна занималня в Бургас (кв. Славейков) за ученици. Подготовка на уроци и домашни, изграждане на самостоятелност в образователен клуб УМеНИе.",
  },
  {
    slug: "art-zanimaniya",
    title: "АРТ ЗАНИМАНИЯ",
    shortTitle: "Арт занимания",
    cardImage: "/images/services/art.webp",
    shortDescription:
      "Децата рисуват, създават и експериментират с различни техники и материали, докато дават свобода на въображението си и превръщат идеите в нещо свое.",
    sloganPart1: "Днес е идея.",
    sloganPart2: "Утре е смелостта да я превърнеш в реалност.",
    intro:
      "Рисуване, моделиране и работа с разнообразни художествени материали дават на децата свободата да експериментират и да превръщат идеите си в красиви реални творби.",
    bulletPoints: [
      "Въображението също иска тренировка – всяка нова тема ги провокира да търсят свои автентични решения.",
      "Сръчни ръце, по-смели идеи – рисуването и приложните изкуства развиват фината моторика, търпението и естетическия усет.",
      "Творчеството е още по-вдъхновяващо в компания – материалите се споделят, идеите се обсъждат, а детските усмивки са навсякъде.",
      "Всяко дете си тръгва със завършена творба и гордост от създаденото със собствените си ръце.",
    ],
    sliderImages: [
      "/images/services/art-zanimaniya/slider/slide-1.webp",
      "/images/services/art-zanimaniya/slider/slide-2.webp",
      "/images/services/art-zanimaniya/slider/slide-3.webp",
      "/images/services/art-zanimaniya/slider/slide-4.webp",
      "/images/services/art-zanimaniya/slider/slide-5.webp",
      "/images/services/art-zanimaniya/slider/slide-6.webp",
      "/images/services/art-zanimaniya/slider/slide-7.webp",
      "/images/services/art-zanimaniya/slider/slide-8.webp",
    ],
    pageImages: [
      "/images/services/art-zanimaniya/page/page-1.webp",
      "/images/services/art-zanimaniya/page/page-2.webp",
    ],
    seoDescription:
      "Арт работилници и уроци по рисуване и приложни изкуства за деца в Бургас. Творческа среда и изразяване в клуб УМеНИе.",
  },
  {
    slug: "shah",
    title: "ШАХ",
    shortTitle: "Шах",
    cardImage: "/images/services/shah.webp",
    shortDescription:
      "Няколко хода напред – в играта и в живота. Шахът развива логика, памет и концентрация. Всяка победа дава увереност, всяка загуба – урок, а играта създава приятелства.",
    sloganPart1: "Днес е шах.",
    sloganPart2: "Утре е умението да мислиш ход напред.",
    intro:
      "Шахът развива стратегическо и логическо мислене, концентрация и памет – безценни умения за цял живот. Учи децата да анализират ситуациите хладнокръвно и да взимат самостоятелни решения.",
    bulletPoints: [
      "Всяка победа носи увереност, а всяка загуба – ценен урок за постоянство.",
      "Мисленето преди действието се тренира целенасочено – на дъската детето веднага вижда последствията от всеки свой ход.",
      "Концентрацията идва с играта – всяка партия изисква фокус и внимание от първия до последния ход.",
      "Първият ход е наш – показваме правилата и стратегиите от самото начало по забавен начин.",
      "Шахматът е за двама, но общността е много по-голяма – турнири, анализи и приятелства около черно-бялата дъска.",
    ],
    sliderImages: [
      "/images/services/shah/slider/slide-1.webp",
      "/images/services/shah/slider/slide-2.webp",
      "/images/services/shah/slider/slide-3.webp",
      "/images/services/shah/slider/slide-4.webp",
      "/images/services/shah/slider/slide-5.webp",
    ],
    pageImages: [
      "/images/services/shah/page/page-1.webp",
      "/images/services/shah/page/page-2.webp",
    ],
    seoDescription:
      "Уроци по шах за деца в Бургас. Стратегическо мислене, концентрация и треньорска подготовка в клуб УМеНИе.",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES_DATA.find((s) => s.slug === slug);
}
