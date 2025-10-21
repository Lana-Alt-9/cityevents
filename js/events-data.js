// بيانات الفعاليات السورية - من المصادر الرسمية
const eventsData = {
    1: {
        title: "معرض دمشق الدولي - الدورة 62",
        titleEn: "Damascus International Fair - 62nd Edition",
        category: "معارض",
        categoryEn: "Exhibitions",
        image: "images/1.webp",
        date: "20 أكتوبر 2025",
        dateEn: "October 20, 2025",
        location: "دمشق - أرض المعارض",
        locationEn: "Damascus - Exhibition Grounds",
        duration: "12 يوماً",
        durationEn: "12 days",
        price: "مجاني",
        priceEn: "Free",
        description: "افتتح الرئيس أحمد الشرع الدورة الـ 62 من معرض دمشق الدولي، معلناً عودة سوريا إلى دورها الاقتصادي التاريخي. يشهد المعرض مشاركة 800 شركة من 20 دولة، مع حضور بارز من تركيا والسعودية.",
        descriptionEn: "President Ahmad Al-Sharaa opened the 62nd edition of Damascus International Fair, announcing Syria's return to its historical economic role. The fair features 800 companies from 20 countries, with notable participation from Turkey and Saudi Arabia.",
        fullDescription: `
            <h4>عودة سوريا إلى دورها الاقتصادي</h4>
            <p>قال الرئيس الشرع في كلمة الافتتاح: "لطالما احتلت الشام عبر تاريخها التجاري، المراكزَ المرموقةَ بين دولِ العالم حيث أكسبها موقعُها الهام، تميُّزاً بما تقدمُهُ من خدمات، وما توفرُهُ من رعاية، ما جعلها بيئةً آمنةً لسلامةِ القوافلِ التجارية."</p>
            
            <h4>المشاركة الدولية</h4>
            <ul>
                <li><strong>800 شركة</strong> من 20 دولة</li>
                <li><strong>تركيا:</strong> مشاركة بـ 1000 متر مربع و500 رجل أعمال</li>
                <li><strong>السعودية:</strong> مشاركة كبيرة تحت شعار "نشبه بعضنا"</li>
                <li>عروض فنية وألعاب نارية</li>
            </ul>
            
            <h4>أهمية المعرض</h4>
            <p>يمثل معرض دمشق الدولي محطة مفصلية في الاقتصاد السوري بعد سنوات من العزلة، حيث يفتح آفاق التعاون مع الدول الصديقة ويعزز الاستثمار والتبادل التجاري.</p>
        `,
        fullDescriptionEn: `
            <h4>Syria's Return to Its Economic Role</h4>
            <p>President Al-Sharaa stated in his opening speech: "Throughout its commercial history, Damascus has occupied prestigious positions among the world's nations, where its important location has given it distinction in the services it provides and the care it offers, making it a safe environment for trade caravans."</p>
            
            <h4>International Participation</h4>
            <ul>
                <li><strong>800 companies</strong> from 20 countries</li>
                <li><strong>Turkey:</strong> Participation with 1000 sqm and 500 businessmen</li>
                <li><strong>Saudi Arabia:</strong> Major participation under the slogan "We Resemble Each Other"</li>
                <li>Artistic shows and fireworks</li>
            </ul>
            
            <h4>Fair's Importance</h4>
            <p>Damascus International Fair represents a pivotal milestone in the Syrian economy after years of isolation, opening horizons for cooperation with friendly countries and promoting investment and trade exchange.</p>
        `,
        highlights: [
            "800 شركة من 20 دولة",
            "مشاركة تركية كبيرة بـ 500 رجل أعمال",
            "مشاركة سعودية تحت شعار نشبه بعضنا",
            "عروض فنية وألعاب نارية"
        ],
        highlightsEn: [
            "800 companies from 20 countries",
            "Major Turkish participation with 500 businessmen",
            "Saudi participation under 'We Resemble Each Other' slogan",
            "Artistic shows and fireworks"
        ],
        organizer: "اتحاد المعارض الدولية السورية",
        organizerEn: "Syrian International Fairs Union",
        contact: "+963 11 2219100",
        website: "https://damascusfair.com",
        tags: ["معارض", "تجارة", "استثمار", "دمشق"],
        tagsEn: ["Exhibitions", "Trade", "Investment", "Damascus"]
    },
    
    2: {
        title: "سلسلة معارض سوريا التخصصية",
        titleEn: "Syria Specialized Exhibitions Series",
        category: "معارض",
        categoryEn: "Exhibitions",
        image: "images/2.jpg",
        date: "طوال العام",
        dateEn: "Year-round",
        location: "دمشق - مدينة المعارض",
        locationEn: "Damascus - Exhibition City",
        duration: "معارض متعددة",
        durationEn: "Multiple exhibitions",
        price: "مجاني",
        priceEn: "Free",
        description: "سلسلة من المعارض المتخصصة في مختلف المجالات الصناعية والتجارية والتقنية، تهدف إلى تعزيز الاقتصاد السوري وفتح آفاق جديدة للاستثمار.",
        descriptionEn: "A series of specialized exhibitions in various industrial, commercial, and technological fields, aimed at enhancing the Syrian economy and opening new investment opportunities.",
        fullDescription: `
            <h4>المعارض المتخصصة</h4>
            <p>تشمل سلسلة المعارض التخصصية مجالات متنوعة:</p>
            <ul>
                <li>معرض الصناعات الغذائية</li>
                <li>معرض البناء ومواد الإنشاء</li>
                <li>معرض التكنولوجيا والاتصالات</li>
                <li>معرض الطاقة المتجددة</li>
                <li>معرض الأثاث والديكور</li>
                <li>معرض المنسوجات والألبسة</li>
            </ul>
            
            <h4>الأهداف</h4>
            <p>تهدف هذه المعارض إلى:</p>
            <ul>
                <li>تعزيز التبادل التجاري بين الشركات المحلية والدولية</li>
                <li>عرض أحدث المنتجات والتقنيات</li>
                <li>فتح فرص استثمارية جديدة</li>
                <li>دعم الصناعة الوطنية</li>
            </ul>
        `,
        fullDescriptionEn: `
            <h4>Specialized Exhibitions</h4>
            <p>This series covers multiple fields, including:</p>
            <ul>
                <li>Food Industries Exhibition</li>
                <li>Construction & Building Materials</li>
                <li>Technology & Telecommunications</li>
                <li>Renewable Energy</li>
                <li>Furniture & Interior Design</li>
                <li>Textiles & Apparel</li>
            </ul>
            
            <h4>Objectives</h4>
            <p>These exhibitions aim to:</p>
            <ul>
                <li>Enhance trade between local and international companies</li>
                <li>Showcase the latest products and technologies</li>
                <li>Open new investment opportunities</li>
                <li>Support the national industry</li>
            </ul>
        `,
        highlights: [
            "معارض متخصصة طوال العام",
            "مشاركة محلية ودولية",
            "فرص استثمارية متنوعة",
            "دعم للاقتصاد الوطني"
        ],
        highlightsEn: [
            "Specialized exhibitions year-round",
            "Local and international participation",
            "Diverse investment opportunities",
            "Support for national economy"
        ],
        organizer: "اتحاد المعارض السورية",
        organizerEn: "Syrian Fairs Union",
        contact: "+963 11 2219100",
        tags: ["معارض", "صناعة", "تجارة", "استثمار"],
        tagsEn: ["Exhibitions", "Industry", "Trade", "Investment"]
    },
    
    3: {
        title: "مؤتمر سوريا الأول للذكاء الاصطناعي",
        titleEn: "Syria's First AI Conference",
        category: "تقنية",
        categoryEn: "Technology",
        image: "images/3.webp",
        date: "5 نوفمبر 2025",
        dateEn: "November 5, 2025",
        location: "دمشق - جامعة دمشق",
        locationEn: "Damascus - Damascus University",
        duration: "يومين",
        durationEn: "2 days",
        price: "500 ل.س",
        priceEn: "500 SYP",
        description: "المؤتمر الأول من نوعه في سوريا لمناقشة تطبيقات الذكاء الاصطناعي وتأثيره على المستقبل، بمشاركة خبراء محليين ودوليين.",
        descriptionEn: "Syria's first conference to discuss AI applications and their impact on the future, with participation from local and international experts.",
        fullDescription: `
            <h4>عن المؤتمر</h4>
            <p>يعقد مؤتمر سوريا الأول للذكاء الاصطناعي بهدف استكشاف الفرص والتحديات التي يطرحها الذكاء الاصطناعي في المنطقة، مع التركيز على التطبيقات العملية في مختلف القطاعات.</p>
            
            <h4>محاور المؤتمر</h4>
            <ul>
                <li>الذكاء الاصطناعي في التعليم والبحث العلمي</li>
                <li>تطبيقات الذكاء الاصطناعي في الصحة</li>
                <li>الذكاء الاصطناعي والأمن السيبراني</li>
                <li>الذكاء الاصطناعي في الأعمال والتجارة</li>
                <li>الأخلاقيات والتنظيم القانوني</li>
            </ul>
            
            <h4>المشاركون</h4>
            <ul>
                <li>خبراء في الذكاء الاصطناعي</li>
                <li>باحثون أكاديميون</li>
                <li>شركات تقنية</li>
                <li>صناع قرار ومشرعون</li>
            </ul>
        `,
        fullDescriptionEn: `
            <h4>About the Conference</h4>
            <p>Syria's First AI Conference aims to explore the opportunities and challenges that artificial intelligence brings to the region, with a focus on practical applications across sectors.</p>
            
            <h4>Conference Tracks</h4>
            <ul>
                <li>AI in education and academic research</li>
                <li>AI applications in healthcare</li>
                <li>AI and cybersecurity</li>
                <li>AI in business and commerce</li>
                <li>AI ethics and regulatory frameworks</li>
            </ul>
            
            <h4>Participants</h4>
            <ul>
                <li>Artificial intelligence experts</li>
                <li>Academic researchers</li>
                <li>Technology companies</li>
                <li>Policy makers and legislators</li>
            </ul>
        `,
        highlights: [
            "أول مؤتمر للذكاء الاصطناعي في سوريا",
            "خبراء محليون ودوليون",
            "ورش عمل تطبيقية",
            "معرض للتقنيات الحديثة"
        ],
        highlightsEn: [
            "First AI conference in Syria",
            "Local and international experts",
            "Practical workshops",
            "Modern technology exhibition"
        ],
        organizer: "جامعة دمشق - كلية الهندسة المعلوماتية",
        organizerEn: "Damascus University - Faculty of Information Technology Engineering",
        contact: "+963 11 2134242",
        website: "https://ai-syria.net",
        tags: ["ذكاء اصطناعي", "تقنية", "مؤتمر", "دمشق"],
        tagsEn: ["AI", "Technology", "Conference", "Damascus"]
    },
    
    4: {
        title: "مهرجان أسواق إدلب 2025",
        titleEn: "Idlib Markets Festival 2025",
        category: "ثقافة",
        categoryEn: "Culture",
        image: "images/4.jpg",
        date: "15 سبتمبر 2025",
        dateEn: "September 15, 2025",
        location: "إدلب",
        locationEn: "Idlib",
        duration: "12 يوماً",
        durationEn: "12 days",
        price: "مجاني",
        priceEn: "Free",
        description: 'مهرجان تراثي وثقافي تحت شعار "إدلب بوابة النصر"، استقطب أكثر من مليون زائر وعرض منتجات محلية وفعاليات فنية متنوعة.',
        descriptionEn: 'Heritage and cultural festival under the slogan "Idlib, Gateway to Victory", attracting over a million visitors with local products and diverse artistic events.',
        fullDescription: `
            <h4>مهرجان يحكي قصة الأرض والإنسان</h4>
            <p>في أجواء مفعمة بالفرح والتراث، افتتحت مدينة إدلب أبوابها لاستقبال مهرجان أسواق إدلب 2025 تحت شعار "إدلب بوابة النصر"، الذي استمر على مدى 12 يوماً متواصلة.</p>
            
            <h4>فعاليات المهرجان</h4>
            <ul>
                <li><strong>أجنحة تراثية:</strong> عرض منتجات محلية تروي تاريخ المنطقة</li>
                <li><strong>فقرات فنية:</strong> مسرحيات توعوية وأمسيات إنشادية</li>
                <li><strong>النجوم:</strong> سامر وحود والشيخ مصلح العلياني</li>
                <li><strong>الشعر:</strong> إلقاءات الشاعر يوسف فتح الله</li>
            </ul>
            
            <h4>أرقام قياسية</h4>
            <ul>
                <li>أكثر من <strong>مليون زائر</strong></li>
                <li>مشاركة من جميع المحافظات السورية</li>
                <li>زوار من الدول العربية والأجنبية</li>
                <li>تنظيم محكم من فرق الدفاع المدني</li>
            </ul>
            
            <h4>شهادات الزوار</h4>
            <blockquote>"كانت فرصة رائعة للقاء الأهل والاستمتاع بمنتجات بلدنا" - زائر من إدلب</blockquote>
            <blockquote>"أحسست بشوق لوطني وأنا أتجول بين الأجنحة" - مغتربة من حماة تعيش في ألمانيا</blockquote>
        `,
        fullDescriptionEn: `
            <h4>A festival that tells the story of land and people</h4>
            <p>In a lively atmosphere of heritage and joy, Idlib opened its doors to host the Idlib Markets Festival 2025 under the slogan "Idlib, Gateway to Victory", continuing for 12 consecutive days.</p>
            
            <h4>Festival Activities</h4>
            <ul>
                <li><strong>Heritage pavilions:</strong> Local products that narrate the region's history</li>
                <li><strong>Art programs:</strong> Awareness plays and chanting evenings</li>
                <li><strong>Guest stars:</strong> Samar Wahoud and Sheikh Musleh Al-Aliani</li>
                <li><strong>Poetry:</strong> Readings by the poet Youssef Fathallah</li>
            </ul>
            
            <h4>Record Numbers</h4>
            <ul>
                <li>More than <strong>one million visitors</strong></li>
                <li>Participation from all Syrian governorates</li>
                <li>Visitors from Arab and foreign countries</li>
                <li>Well-organized by civil defense teams</li>
            </ul>
            
            <h4>Visitor Testimonials</h4>
            <blockquote>“A great opportunity to meet family and enjoy our local products.” — Visitor from Idlib</blockquote>
            <blockquote>“I felt homesick as I walked between the pavilions.” — Expat from Hama living in Germany</blockquote>
        `,
        highlights: [
            "مليون زائر من داخل وخارج سوريا",
            "أمسيات فنية وإنشادية",
            "منتجات تراثية ومحلية",
            "تنظيم احترافي وآمن"
        ],
        highlightsEn: [
            "One million visitors from inside and outside Syria",
            "Artistic and chanting evenings",
            "Heritage and local products",
            "Professional and safe organization"
        ],
        organizer: "محافظة إدلب",
        organizerEn: "Idlib Governorate",
        contact: "+963 23 224422",
        tags: ["ثقافة", "تراث", "مهرجان", "إدلب"],
        tagsEn: ["Culture", "Heritage", "Festival", "Idlib"]
    },
    
    5: {
        title: "مهرجان ربيع حماة 2025",
        titleEn: "Hama Spring Festival 2025",
        category: "ثقافة",
        categoryEn: "Culture",
        image: "images/5.jpg",
        date: "10 سبتمبر 2025",
        dateEn: "September 10, 2025",
        location: "حماة",
        locationEn: "Hama",
        duration: "شهر كامل",
        durationEn: "Full month",
        price: "مجاني",
        priceEn: "Free",
        description: 'الدورة 26 تحت شعار "ربيع يزهر ونصر يستمر"، مع مشاركة 225 شركة وفعاليات ثقافية وفنية متنوعة.',
        descriptionEn: 'The 26th edition under the slogan "Spring blooms and victory continues", with the participation of 225 companies and diverse cultural and artistic events.',
        fullDescription: `
            <h4>ولادة جديدة لمدينة جُرحت ثم نهضت</h4>
            <p>منذ انطلاقة دورته السادسة والعشرين، بدا مهرجان ربيع حماة 2025 وكأنه أكثر من مجرد فعالية ثقافية أو سوق تجاري، بل رمزاً لعودة الحياة إلى مدينةٍ عانت طويلاً من الحرب والتهميش.</p>
            
            <h4>تنوع الفعاليات</h4>
            <ul>
                <li><strong>العروض الفنية:</strong> فقرات فنية وتراثية وفولكلورية</li>
                <li><strong>سوق الأشغال اليدوية:</strong> منتجات تقليدية ومحلية</li>
                <li><strong>فعاليات الأطفال:</strong> أنشطة ترفيهية وتعليمية</li>
                <li><strong>المشاركة التجارية:</strong> 225 شركة تجارية</li>
            </ul>
            
            <h4>البعد الاقتصادي</h4>
            <p>بمشاركة 225 شركةً تجاريةً في السوق الملحق بالمهرجان، أعطت للمهرجان بعداً اقتصادياً واضحاً، وأكدت أنَّ عودة النشاط التجاري ضرورة موازية لإحياء الحياة الاجتماعية.</p>
            
            <h4>رسالة المهرجان</h4>
            <p>مهرجان حماة ليس مجرد احتفال سنوي، بل رسالة بأنَّ الحياة مستمرة بسواعد أبنائها، وأنَّ المدن التي قاومت الحرب 14 عاماً قادرة على النهوض متى ما آمنت بقدرة أبنائها على التغيير.</p>
        `,
        fullDescriptionEn: `
            <h4>A rebirth for a wounded city</h4>
            <p>From its 26th edition kickoff, Hama Spring Festival 2025 appeared to be more than a cultural event or a trade fair—it's a symbol of life returning to a city long affected by war and neglect.</p>
            
            <h4>Diverse Activities</h4>
            <ul>
                <li><strong>Artistic shows:</strong> Cultural and folkloric performances</li>
                <li><strong>Handicrafts market:</strong> Traditional and local products</li>
                <li><strong>Kids activities:</strong> Recreational and educational programs</li>
                <li><strong>Commercial participation:</strong> 225 companies</li>
            </ul>
            
            <h4>Economic Dimension</h4>
            <p>With 225 participating companies in the fair market, the festival took on a clear economic aspect, confirming that commercial activity is essential to revive social life.</p>
            
            <h4>Festival Message</h4>
            <p>Hama Festival is not just an annual celebration; it's a message that life goes on through the efforts of its people, and that cities which resisted war for 14 years can rise again when they believe in their power to change.</p>
        `,
        highlights: [
            "الدورة 26 للمهرجان",
            "225 شركة تجارية",
            "عروض فنية وتراثية",
            "فعاليات للأطفال والعائلات"
        ],
        highlightsEn: [
            "The 26th edition of the festival",
            "225 commercial companies",
            "Artistic and heritage performances",
            "Activities for children and families"
        ],
        organizer: "محافظة حماة",
        organizerEn: "Hama Governorate",
        contact: "+963 33 224422",
        tags: ["ثقافة", "مهرجان", "تراث", "حماة"],
        tagsEn: ["Culture", "Festival", "Heritage", "Hama"]
    },
    
    6: {
        title: "معرض ومؤتمر صناعة الإسمنت والمجبول البيتوني",
        titleEn: "Cement & Concrete Industry Exhibition & Conference",
        category: "معارض",
        categoryEn: "Exhibitions",
        image: "images/6.jpg",
        date: "25 أكتوبر 2025",
        dateEn: "October 25, 2025",
        location: "دمشق - مدينة المعارض",
        locationEn: "Damascus - Exhibition City",
        duration: "5 أيام",
        durationEn: "5 days",
        price: "مجاني",
        priceEn: "Free",
        description: "المعرض السادس لصناعة الإسمنت والمجبول البيتوني في سوريا، مع مشاركات محلية ودولية لدعم عملية إعادة الإعمار.",
        descriptionEn: "The sixth exhibition for cement and concrete industry in Syria, with local and international participation to support the reconstruction process.",
        fullDescription: `
            <h4>معرض الإعمار والبناء</h4>
            <p>انطلقت على أرض مدينة المعارض في العاصمة دمشق فعاليات المعرض والمؤتمر السادس لـ"صناعة الإسمنت والمجبول البيتوني في سوريا 2025"، في إطار عملية إعادة الإعمار الشاملة.</p>
            
            <h4>أهمية المعرض</h4>
            <p>أكد أمين سر نقابة المهندسين السوريين، رُصين عصمت، أن المؤتمر والمعرض يشكلان محطة فارقة في مسار البناء والإعمار في سوريا، موضحاً أن انعقاده يأتي ضمن سلسلة فعاليات انطلقت بعد التحرير.</p>
            
            <h4>دعم المواد الأولية</h4>
            <p>أوضح المدير العام للمؤسسة العامة للجيولوجيا والثروة المعدنية سراج الحريري استعداد المؤسسة لتوريد وتأمين المواد الأولية لجميع الشركات الراغبة في الاستثمار داخل سوريا.</p>
            
            <h4>المشاركة</h4>
            <ul>
                <li>شركات محلية متخصصة في صناعة الإسمنت</li>
                <li>شركات دولية لمواد البناء</li>
                <li>مؤسسات حكومية داعمة</li>
                <li>مهندسون ومقاولون</li>
            </ul>
        `,
        fullDescriptionEn: `
            <h4>Reconstruction and Building Exhibition</h4>
            <p>Hosted at Exhibition City in Damascus, the 6th Cement & Concrete Industry Exhibition and Conference 2025 supports the nationwide reconstruction effort.</p>
            
            <h4>Exhibition Importance</h4>
            <p>The Syrian Engineers Syndicate emphasized that the conference and exhibition mark a milestone in Syria's building and reconstruction path, as part of a series of events following liberation.</p>
            
            <h4>Raw Materials Support</h4>
            <p>The General Establishment for Geology and Mineral Resources announced readiness to supply and secure raw materials for all companies looking to invest inside Syria.</p>
            
            <h4>Participation</h4>
            <ul>
                <li>Local companies specialized in cement production</li>
                <li>International building material companies</li>
                <li>Supporting governmental institutions</li>
                <li>Engineers and contractors</li>
            </ul>
        `,
        highlights: [
            "دعم عملية إعادة الإعمار",
            "مشاركة شركات محلية ودولية",
            "مؤتمر وورش عمل تخصصية",
            "فرص استثمارية"
        ],
        highlightsEn: [
            "Supporting reconstruction process",
            "Local and international company participation",
            "Conference and specialized workshops",
            "Investment opportunities"
        ],
        organizer: "نقابة المهندسين السوريين",
        organizerEn: "Syrian Engineers Syndicate",
        contact: "+963 11 3338200",
        tags: ["إسمنت", "بناء", "إعمار", "دمشق"],
        tagsEn: ["Cement", "Construction", "Reconstruction", "Damascus"]
    }
};

// تصدير البيانات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = eventsData;
}
