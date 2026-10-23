export const blogDict = {
  bg: {
    pageTitle: "НАШИЯТ БЛОГ",
    pageSubtitle:
      "Практически съвети за родители, детско развитие, учене с лекота и моменти от ежедневието в нашия клуб в Бургас.",
    searchPlaceholder: "Търсене на статия по ключова дума...",
    clearSearchAria: "Изчисти търсенето",
    categories: {
      "Всички": "Всички",
      "Съвети за родители": "Съвети за родители",
      "Ранно развитие": "Ранно развитие",
      "Учебна занималня": "Учебна занималня",
      "Творчество": "Творчество",
    },
    featuredBadge: "Препоръчана статия",
    emptyTitle: "Няма намерени статии",
    emptyDescPre: "Не открихме статии, отговарящи на вашето търсене ",
    emptyDescCategory: " в категория ",
    showAllBtn: "Покажи всички статии",
    backToAll: "Към всички статии",
    authorOrg: "Образователен клуб „УМеНИе“ Бургас",
    readArticle: "ПРОЧЕТИ СТАТИЯТА",
    readMore: "Прочети повече",
    commentsText: "коментара",
    cta: {
      badge: "Развийте уменията на вашето дете",
      title: "Искате ли вашето дете да учи с радост и увереност?",
      desc: "Заповядайте на пробни занимания в клуб „УМеНИе“ в Бургас – ж.к. Славейков, бл. 48 партер.",
      btn: "ВИЖТЕ ГРАФИКА",
    },
    commentsSection: {
      title: "Коментари",
      formHeading: "Оставете вашия коментар или въпрос",
      authorLabel: "Вашето име *",
      authorPlaceholder: "напр. Мария Иванова",
      emailLabel: "Имейл (няма да бъде видим публично)",
      emailPlaceholder: "maria@example.com",
      contentLabel: "Коментар *",
      contentPlaceholder: "Споделете вашето мнение или задайте въпрос към екипа на УМеНИе...",
      submitBtn: "Публикувай коментар",
      submittingBtn: "Изпращане...",
      successMsg: "Благодарим ви! Вашият коментар беше публикуван успешно.",
      errorValidation: "Моля, въведете вашето име и коментар.",
      emptyMsg: "Все още няма коментари към тази статия. Бъдете първият, който ще сподели мнение!",
    },
    relatedTitle: "Още полезни статии",
    relatedSubtitle: "Продължете да четете практични съвети от клуба",
  },
  en: {
    pageTitle: "OUR BLOG",
    pageSubtitle:
      "Practical tips for parents, child development, easy learning, and daily moments from our Burgas club.",
    searchPlaceholder: "Search articles by keyword...",
    clearSearchAria: "Clear search",
    categories: {
      "Всички": "All",
      "Съвети за родители": "Parenting Tips",
      "Ранно развитие": "Early Development",
      "Учебна занималня": "Study Hall",
      "Творчество": "Creativity",
    },
    featuredBadge: "Featured Article",
    emptyTitle: "No articles found",
    emptyDescPre: "We could not find any articles matching your search ",
    emptyDescCategory: " in category ",
    showAllBtn: "Show all articles",
    backToAll: "Back to all articles",
    authorOrg: "Umenie Educational Club Burgas",
    readArticle: "READ ARTICLE",
    readMore: "Read more",
    commentsText: "comments",
    cta: {
      badge: "Develop your child's skills",
      title: "Do you want your child to learn with joy and confidence?",
      desc: "Join us for trial sessions at Umenie Club in Burgas – Slaveykov dist., bl. 48 ground floor.",
      btn: "VIEW SCHEDULE",
    },
    commentsSection: {
      title: "Comments",
      formHeading: "Leave a comment or question",
      authorLabel: "Your Name *",
      authorPlaceholder: "e.g. Maria Ivanova",
      emailLabel: "Email (will not be published)",
      emailPlaceholder: "maria@example.com",
      contentLabel: "Comment *",
      contentPlaceholder: "Share your thoughts or ask a question to the Umenie team...",
      submitBtn: "Post Comment",
      submittingBtn: "Sending...",
      successMsg: "Thank you! Your comment was published successfully.",
      errorValidation: "Please enter your name and comment.",
      emptyMsg: "No comments yet on this article. Be the first to share your thoughts!",
    },
    relatedTitle: "More Helpful Articles",
    relatedSubtitle: "Continue reading practical insights from our club",
  },
} as const;

export const fullBlogArticlesEn: Record<
  string,
  {
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    content: string;
  }
> = {
  "kak-da-pomognem-na-deteto-da-uchi-s-zhelanie": {
    title: "How to Help Children Learn with Curiosity Rather than Obligation",
    excerpt:
      "Learning motivation is not built on strict demands, but through curiosity, a supportive atmosphere, and small everyday victories. Here are 5 proven approaches from our practice.",
    category: "Parenting Tips",
    readTime: "4 min read",
    content: `Learning is a natural instinct for every child – by nature, children are endlessly curious, asking countless questions and longing to understand how the world works. Too often, however, starting school and accumulating heavy homework burdens gradually transforms curiosity into fatigue and obligation.

At Umenie Educational Club, we witness every day how rapidly a child's attitude transforms when the learning environment adapts to their unique individual rhythm.

### 1. Transform Mistakes into Valuable Lessons
One of the most common reasons children disengage from learning is the fear of making a mistake or getting a low mark. When a child errs, never rush to reprimand. Instead ask gently: *"How did you arrive at this answer?"* or *"What might we try differently next time?"*. When mistakes are embraced as a natural step in exploration, anxiety dissolves.

### 2. Small Steps and Specific Praise
Rather than generic praise like *"Good job, you are so smart!"*, celebrate the tangible effort: *"I loved how tenaciously you tackled that tricky math challenge until you solved it!"*. This builds a growth mindset, showing the child that true mastery comes from persistence.

### 3. Balance Concentrated Study with Movement
A child's developing brain needs deliberate breaks to assimilate new knowledge. In our study hall, after each focused block of homework, we ensure time for creativity, board games, or simple, lively conversations with peers.

### 4. Bridge Academic Concepts to Real Life
Mathematics turns fascinating when calculating change at the neighborhood bakery or dividing a pizza into equal slices. Language comes alive when writing genuine greeting cards or crafting short illustrated comics. Always demonstrate where new knowledge lives in daily life.

### 5. A Supportive Setting in Compact Groups
When children learn alongside peers in small groups (up to 6-8 children), no one gets lost in the background noise. The teacher has dedicated time to listen to their questions, and peers actively inspire one another.

> "Every child possesses an innate spark for discovery. Our mission as educators and parents is not to pressure them, but to nurture that flame with genuine patience and understanding."`,
  },
  "zashto-shahat-razviva-logikata-i-tarpenieto": {
    title: "Why Chess Develops Logic and Patience in Children from Age 5",
    excerpt:
      "Chess is far more than a board game. It teaches strategic foresight, emotional regulation, and deep respect for peers.",
    category: "Early Development",
    readTime: "4 min read",
    content: `In a digital era where rapid screen stimulation conditions children toward instant gratification, chess stands out as a genuine oasis for young minds.

At Umenie Club, chess sessions are consistently among the most beloved activities. But what precisely unfolds in a young child's mind as their fingers move the pawns and knights?

### Strategic Thinking from Early Childhood
In chess, every single move produces a consequence. The child learns to pause and reflect: *"If I move this piece here, what will my friend across the board choose to do?"*. This fosters spatial imagination and rigorous cause-and-effect reasoning.

### Patience and Deep Focus
Sitting calmly for 30 or 40 minutes contemplating the next move is an invaluable capability that translates directly into classroom excellence. Children who regularly engage in chess focus significantly better on school lessons and read with heightened attention.

### Embracing Defeat as a Stepping Stone
Chess leaves no room for luck or rolling dice – the outcome is shaped by chosen decisions. Thus, the royal game instills gracious sportsmanship: when a match is lost, you shake hands with your peer and calmly analyze where mistakes occurred in order to return stronger tomorrow.`,
  },
  "predimstvata-na-malkite-grupi-v-zanimalnyata": {
    title: "The Advantages of Small Groups in Study Hall: Personal Attention for Every Child",
    excerpt:
      "Why learning in compact groups produces superior retention, minimizes academic stress, and fosters genuine homework autonomy.",
    category: "Study Hall",
    readTime: "5 min read",
    content: `In a bustling classroom of 25 or 30 pupils, even the most devoted educator cannot devote 10 individual minutes to every student experiencing a momentary roadblock. Over time, unresolved questions accumulate into anxiety.

That is why at Umenie Club, we uphold a fundamental principle: study hall groups are deliberately capped at small numbers.

### Immediate Clarification of Doubts
When a child encounters difficulty with a mathematical problem or grammatical rule, they do not wait until frustration sets in. The teacher sits beside them, identifies the exact conceptual hurdle, and explains it through relatable metaphors.

### True Autonomy Without Rushing
The objective of our study hall is never to mechanically fill workbooks on behalf of the child. We teach children how to prioritize their assignments, budget their afternoon, and verify their own work before seeking final review.

### A Safe, Home-Like Atmosphere
In small groups, children feel safe to admit what they do not yet comprehend without fear of ridicule. This emotional safety turns homework from a tense ordeal into a satisfying afternoon routine.`,
  },
  "tvorchestvoto-kato-nachin-za-izrazyavane-na-emotsiite": {
    title: "Creativity and Art Activities: How Art Helps Children Release Stress",
    excerpt:
      "Painting, sculpting, and applied crafts as an intuitive bridge to a child's inner emotional world and creative resilience.",
    category: "Creativity",
    readTime: "4 min read",
    content: `Children often experience intricate feelings that their evolving vocabulary cannot yet fully express. Frustration, excitement, school fatigue, or unspoken worries frequently manifest as restless energy or withdrawal.

Art serves as the most natural, welcoming outlet for these emotions.

### Freedom Beyond the Boundaries of Right and Wrong
Unlike traditional academic subjects where an answer is strictly correct or incorrect, a blank sheet of paper holds no mistakes. An unusual color choice or bold brushstroke is an expression of individuality, fostering unshakeable self-trust.

### Developing Fine Motor Skills and Tactile Awareness
Working with clay, weaving textiles, and blending watercolors directly strengthens the neural pathways governing fine motor coordination and focus, supporting neat handwriting and manual dexterity.

### The Pure Pride of Tangible Creation
There is nothing quite like witnessing a child's radiant expression when displaying a finished painting or handcrafted ceramic piece to their parents: *"I created this entirely on my own!"*. That pride radiates into everything else they undertake.`,
  },
};
