export interface ServiceData {
  slug: string;
  title: string;
  titleLines?: string[];
  shortTitle: string;
  cardImage: string;
  featuredImage: string;
  shortDescription: string;
  sloganPart1: string;
  sloganPart2: string;
  intro: string;
  bulletPoints: string[];
  sliderImages: string[];
  pageImages: string[];
  galleryTitle: string;
  seoDescription: string;
}

export const SERVICES_DATA: ServiceData[] = [
  {
    slug: "urotsi-i-kursove",
    title: "УРОЦИ И КУРСОВЕ",
    titleLines: ["УРОЦИ И", "КУРСОВЕ"],
    shortTitle: "Уроци и курсове",
    cardImage: "/images/banner/1.webp",
    featuredImage: "/images/services/urotsi-i-kursove/page/page-1.webp",
    shortDescription:
      "Истинският напредък започва там, където е детето. Английски, български и математика в малки групи, с лично внимание и практика, която превръща знанията в увереност.",
    sloganPart1: "Днес е урок.",
    sloganPart2: "Утре е увереността, че можеш да се справиш сам.",
    intro:
      "Български, математика и английски език в малки групи, с внимание към нивото и нуждите на всяко дете. Стъпваме върху нивото на детето и уверено го издигаме нагоре.",
    bulletPoints: [
      "Стъпваме върху нивото на детето и го **издигаме нагоре**.",
      "**Разбирането идва преди запомнянето** – целта е детето да знае как да стигне до отговора.",
      "**Малките групи** дават пространство на всяко дете да пита, опитва и напредва.",
      "Знанията влизат в употреба – с **практически задачи и упражнения**, които помагат наученото да остане.",
      "**Регулярна обратна връзка** към родителите – за напредъка, силните страни и следващите стъпки.",
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
    galleryTitle: "ВИЖТЕ ЗНАНИЕТО С ПОВЕЧЕ УМЕНИЕ",
    seoDescription:
      "Уроци и курсове по български език, математика и английски за деца в Бургас, кв. Славейков. Малки групи и високи резултати в клуб УМеНИе.",
  },
  {
    slug: "uchebna-zanimalnya",
    title: "УЧЕБНА ЗАНИМАЛНЯ",
    titleLines: ["УЧЕБНА", "ЗАНИМАЛНЯ"],
    shortTitle: "Учебна занималня",
    cardImage: "/images/banner/2.webp",
    featuredImage: "/images/services/uchebna-zanimalnya/page/page-1.webp",
    shortDescription:
      "Домашните не трябва да са предизвикателство. В спокойна среда и с нужната подкрепа децата се учат да работят самостоятелно и с гордост от резултатите си.",
    sloganPart1: "Днес е домашно.",
    sloganPart2: "Утре е умението да се справяш сам.",
    intro:
      "В учебната занималня децата подготвят уроците и домашните си с помощ, когато е нужно. Учат се постепенно сами да организират задачите си, да разпределят времето си и да довършват започнатото.",
    bulletPoints: [
      "Домашните са написани, уроците – подготвени – с подкрепа там, където детето среща трудност.",
      "Учи се как да **управлява времето**, кое е първо, колко остава и как да стигнеш докрай.",
      "Помагаме, без да вършим вместо тях – целта е с времето детето да има все по-малко нужда от помощ.",
      "Редът в задачите носи **ред и в ученето** – децата постепенно изграждат свой начин за работа.",
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
    galleryTitle: "ВИЖТЕ САМОСТОЯТЕЛНОСТТА С ПОВЕЧЕ УМЕНИЕ",
    seoDescription:
      "Учебна занималня в Бургас (кв. Славейков) за ученици. Подготовка на уроци и домашни, изграждане на самостоятелност в образователен клуб УМеНИе.",
  },
  {
    slug: "pletivo",
    title: "ПЛЕТИВО",
    titleLines: ["ПЛЕТИВО"],
    shortTitle: "Плетиво",
    cardImage: "/images/banner/3.webp",
    featuredImage: "/images/services/pletivo/page/page-1.webp",
    shortDescription:
      "Бримките се редят, разговорите вървят, а идеите стават плетива. Децата развиват сръчност и търпение, следват идеите си докрай и виждат резултата от усилията си – с приятели и подкрепа по пътя.",
    sloganPart1: "Днес е плетиво.",
    sloganPart2: "Утре е постоянството да стигаш докрай.",
    intro:
      "Всяка седмица в образователен клуб „УМеНИе“ връщаме децата към радостта от малките неща. Плетивото развива фината моторика, сръчност и внимание към детайла, стимулира креативността и носи радост от създаването с ръце.",
    bulletPoints: [
      "Първите бримки започват от нулата. **Опитът не е условие**, любопитството е.",
      "**Няколко учители** са до децата, за да има кой да помогне точно когато е нужно.",
      "Преждата, инструментите и **всичко необходимо ги очакват при нас** – остава само да започнат.",
      "Докато ръцете са заети с плетиво, има време за **разговори, смях и нови приятелства**.",
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
      "/images/services/pletivo/slider/slide-9.webp",
      "/images/services/pletivo/slider/slide-10.webp",
    ],
    pageImages: [
      "/images/services/pletivo/page/page-1.webp",
      "/images/services/pletivo/page/page-3.webp",
      "/images/services/pletivo/page/page-2.webp",
    ],
    galleryTitle: "ВИЖТЕ УМЕНИЕТО В РЪЦЕТЕ ИМ.",
    seoDescription:
      "Занимания по плетиво за деца в Бургас. Развиване на търпение, фина моторика и творчески умения в Образователен клуб „УМеНИе“.",
  },
  {
    slug: "art-zanimaniya",
    title: "АРТ ЗАНИМАНИЯ",
    titleLines: ["АРТ", "ЗАНИМАНИЯ"],
    shortTitle: "Арт занимания",
    cardImage: "/images/banner/4.webp",
    featuredImage: "/images/services/art-zanimaniya/page/page-1.webp",
    shortDescription:
      "Децата рисуват, създават и експериментират с различни техники и материали, докато дават свобода на въображението си и превръщат идеите в нещо свое.",
    sloganPart1: "Днес е идея.",
    sloganPart2: "Утре е смелостта да я превърнеш в реалност.",
    intro:
      "Всяка седмица в образователен клуб „УМеНИе“ една нова тема събужда десетки идеи. Рисуване, моделиране и работа с разнообразни художествени материали дават на децата свободата да експериментират и да превръщат идеите си в красиви реални творби.",
    bulletPoints: [
      "Рисуване, моделиране и работа с различни материали дават на децата свободата да експериментират и да превръщат въображението си в нещо истинско.",
      "Въображението също иска тренировка, всяка тема ги провокира да **търсят свои решения**.",
      "Сръчни ръце, по-смели идеи – рисуването, моделирането и работата с материали развиват **фината моторика и координацията**.",
      "Творчеството е още по-хубаво в компания, материалите се споделят, идеите се обсъждат, а разговорите вървят покрай тях.",
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
      "/images/services/art-zanimaniya/slider/slide-9.webp",
      "/images/services/art-zanimaniya/slider/slide-10.webp",
    ],
    pageImages: [
      "/images/services/art-zanimaniya/page/page-1.webp",
      "/images/services/art-zanimaniya/page/page-2.webp",
    ],
    galleryTitle: "ВИЖТЕ ВЪОБРАЖЕНИЕТО С ПОВЕЧЕ УМЕНИЕ",
    seoDescription:
      "Арт работилници и уроци по рисуване и приложни изкуства за деца в Бургас. Творческа среда и изразяване в клуб УМеНИе.",
  },
  {
    slug: "chitatelski-klub-ligeria",
    title: "ЧИТАТЕЛСКИ КЛУБ „ЛИГЕРИА“",
    titleLines: ["ЧИТАТЕЛСКИ", "КЛУБ"],
    shortTitle: "Читателски клуб",
    cardImage: "/images/banner/5.webp",
    featuredImage: "/images/services/chitatelski-klub/page/page-1.webp",
    shortDescription:
      "Колко рядко си подарявате време за себе си? Четенето се допълва с вино, разговори и нови приятелства. Време за възрастните да се откъснат от ежедневието и да се потопят във вдъхновяваща атмосфера.",
    sloganPart1: "Днес е книга.",
    sloganPart2: "Утре е усещането, че сте презаредили.",
    intro:
      "Колко рядко си подарявате време за себе си? Време за възрастните да се откъснат от ежедневието и да се потопят във вдъхновяваща атмосфера. Читателски клуб „Лигериа“ е уютно пространство за възрастни, където хубавата книга се съчетава с хубаво вино и задълбочени разговори.",
    bulletPoints: [
      "Всеки месец – **нова книга и нов разговор**, в който всеки може да сподели своя прочит.",
      "Книгите вървят с **чаша вино и приятна компания** – защото това е време за вас.",
      "Понякога обръщаме страницата **заедно с автора** – с гостувания, въпроси и истории от първо лице.",
      "Малък спомен от всяка история – към всяка среща сме подготвили **ръчно изработен подарък**, вдъхновен от книгата.",
    ],
    sliderImages: [
      "/images/services/chitatelski-klub/slider/slide-1.webp",
      "/images/services/chitatelski-klub/slider/slide-2.webp",
      "/images/services/chitatelski-klub/slider/slide-3.webp",
      "/images/services/chitatelski-klub/slider/slide-4.webp",
      "/images/services/chitatelski-klub/slider/slide-5.webp",
      "/images/services/chitatelski-klub/slider/slide-6.webp",
      "/images/services/chitatelski-klub/slider/slide-7.webp",
      "/images/services/chitatelski-klub/slider/slide-8.webp",
      "/images/services/chitatelski-klub/slider/slide-9.webp",
      "/images/services/chitatelski-klub/slider/slide-10.webp",
    ],
    pageImages: [
      "/images/services/chitatelski-klub/page/page-1.webp",
      "/images/services/chitatelski-klub/page/page-2.webp",
    ],
    galleryTitle: "НАДНИКНЕТЕ В СРЕЩИТЕ С КНИГИ И УМЕНИЕ.",
    seoDescription:
      "Читателски клуб „Лигериа“ в Бургас за възрастни. Литература, селектирано вино, приятни срещи и вдъхновение в клуб УМеНИе.",
  },
  {
    slug: "shah",
    title: "ШАХ",
    titleLines: ["ШАХ"],
    shortTitle: "Шах",
    cardImage: "/images/banner/6.webp",
    featuredImage: "/images/services/shah/page/page-1.webp",
    shortDescription:
      "Няколко хода напред – в играта и в живота. Шахът развива логика, памет и концентрация. Всяка победа дава увереност, всяка загуба – урок, а играта създава приятелства.",
    sloganPart1: "Днес е шах.",
    sloganPart2: "Утре е умението да мислиш ход напред.",
    intro:
      "Шахът развива логическо мислене, памет и концентрация – умения за цял живот. Учи децата да анализират ситуацията и да намират решения.",
    bulletPoints: [
      "Всяка победа носи увереност, всяка загуба – **ценен урок**.",
      "**Мисленето преди действието** се тренира, на дъската детето вижда последствията от всеки свой избор.",
      "**Концентрацията** идва с играта – една партия изисква внимание от първия до последния ход.",
      "Първият ход е наш – ще покажем **всичко от самото начало**.",
      "Шахматът е за двама, но компанията е много повече. **Игра, разговори и приятелства** около дъската.",
    ],
    sliderImages: [
      "/images/services/shah/slider/slide-1.webp",
      "/images/services/shah/slider/slide-2.webp",
      "/images/services/shah/slider/slide-3.webp",
      "/images/services/shah/slider/slide-4.webp",
      "/images/services/shah/slider/slide-5.webp",
    ],
    pageImages: [
      "/images/services/shah/page/page-2.webp",
      "/images/services/shah/page/page-1.webp",
    ],
    galleryTitle: "ВИЖТЕ УМЕНИЕТО В ИГРА",
    seoDescription:
      "Уроци по шах за деца в Бургас. Стратегическо мислене, концентрация и треньорска подготовка в клуб УМеНИе.",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  if (slug === "chitatelski-klub") {
    return SERVICES_DATA.find((s) => s.slug === "chitatelski-klub-ligeria");
  }
  return SERVICES_DATA.find((s) => s.slug === slug);
}

