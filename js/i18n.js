// ===== INTERNATIONALIZATION (i18n) =====
// Language switcher with Syrian flag for Arabic and USA flag for English

const i18n = {
    currentLanguage: localStorage.getItem('language') || 'en',
    translations: {},
    
    // Initialize the i18n system
    async init() {
        await this.loadTranslations(this.currentLanguage);
        this.applyTranslations();
        this.updateLanguageUI();
        this.setupLanguageSwitcher();
        this.applyRTL();
    },
    
    // Load translation file
    async loadTranslations(lang) {
        try {
            // If running directly from file://, use embedded translations to avoid CORS
            if (location.protocol === 'file:') {
                this.translations = this.getEmbeddedTranslations(lang);
                this.currentLanguage = lang;
                localStorage.setItem('language', lang);
                return; // Skip fetch entirely
            }
            const response = await fetch(`translations/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
        } catch (error) {
            console.error('Error loading translations:', error);
            console.warn('Loading embedded translations as fallback...');
            // Use embedded translations as fallback
            this.translations = this.getEmbeddedTranslations(lang);
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
        }
    },
    
    // Embedded translations as fallback (for file:// protocol)
    getEmbeddedTranslations(lang) {
        const translations = {
            'en': {"nav":{"brand":"City Events","home":"Home","allEvents":"All Events","about":"About","contact":"Contact"},"hero":{"title":"Discover Amazing","titleSpan":"Local Events","subtitle":"Find the best concerts, festivals, workshops, and community gatherings happening in your city. Never miss out on the fun!","exploreEvents":"Explore Events","learnMore":"Learn More"},"featured":{"title":"Featured Events of the Week","subtitle":"Don't miss these amazing upcoming events","viewDetails":"View Details","slider":{"event1":{"category":"Music","title":"Summer Music Festival 2024","description":"Join us for an unforgettable night of live music featuring top local and international artists.","date":"October 15, 2024","location":"Central Park Amphitheater","price":"$45 - $120"},"event2":{"category":"Culture","title":"Modern Art Exhibition","description":"Explore contemporary artworks from emerging and established artists in our city.","date":"October 12-20, 2024","location":"City Art Gallery","price":"Free Entry"},"event3":{"category":"Sports","title":"City Marathon 2024","description":"Challenge yourself in our annual city marathon with routes for all fitness levels.","date":"October 22, 2024","location":"City Center","price":"$25 - $50"}}},"categories":{"title":"Browse by Category","subtitle":"Find events that match your interests","music":"Music","culture":"Culture","sports":"Sports","family":"Family","food":"Food","business":"Business","technology":"Technology","literature":"Literature","events":"Events"},"latest":{"title":"Latest Events","subtitle":"Recently added events you might be interested in","viewAll":"View All Events","cards":{"event1":{"title":"Tech Innovation Conference","description":"Discover the latest trends in technology and innovation.","location":"Convention Center","time":"9:00 AM - 6:00 PM"},"event2":{"title":"International Food Festival","description":"Taste cuisines from around the world in one place.","location":"City Square","time":"11:00 AM - 9:00 PM"},"event3":{"title":"Author Book Reading","description":"Meet bestselling authors and discover new books.","location":"Public Library","time":"2:00 PM - 4:00 PM"}}},"newsletter":{"title":"Stay Updated","subtitle":"Subscribe to our newsletter and never miss an exciting event in your city","placeholder":"Enter your email address","subscribe":"Subscribe","features":{"alerts":"Event Alerts","offers":"Exclusive Offers","digest":"Weekly Digest"}},"footer":{"description":"Your ultimate guide to discovering amazing local events. From concerts to workshops, we help you find the perfect events in your city.","quickLinks":"Quick Links","categories":"Categories","contactInfo":"Contact Info","address":"123 Event Street, City Center, CC 12345","phone":"+1 (555) 123-4567","email":"info@cityevents.com","copyright":"2024 City Events Guide. All rights reserved.","privacy":"Privacy Policy","terms":"Terms of Service","cookies":"Cookie Policy"},"events":{"pageTitle":"All Events","pageSubtitle":"Discover amazing events happening in your city","search":"Search events...","allCategories":"All Categories","allDates":"All Dates","today":"Today","tomorrow":"Tomorrow","thisWeek":"This Week","thisMonth":"This Month","allLocations":"All Locations","sortBy":"Sort By","sortLabel":"Sort by:","sort":{"date":"Date","name":"Name","price":"Price","popularity":"Popularity"},"allPrices":"All Prices","priceRanges":{"0_25":"$0 - $25","25_50":"$25 - $50","50_100":"$50 - $100","100_plus":"$100+"},"gridView":"Grid View","listView":"List View","dateAsc":"Date (Earliest First)","dateDesc":"Date (Latest First)","priceAsc":"Price (Low to High)","priceDesc":"Price (High to Low)","resultsFound":"results found","showing":"Showing","of":"of","noResults":"We couldn't find any events matching your criteria. Try adjusting your filters or search terms.","noResultsTitle":"No Events Found","clearAllFilters":"Clear All Filters","free":"Free","freeEntry":"Free Entry","months":{"Jan":"Jan","Feb":"Feb","Mar":"Mar","Apr":"Apr","May":"May","Jun":"Jun","Jul":"Jul","Aug":"Aug","Sep":"Sep","Oct":"Oct","Nov":"Nov","Dec":"Dec"},"addToFavorites":"Add to Favorites","filters":{"advancedToggle":"Advanced Filters","location":{"label":"Location","options":{"downtown":"Downtown","uptown":"Uptown","suburbs":"Suburbs"}},"duration":{"label":"Duration","options":{"all":"Any Duration","short":"1-2 hours","medium":"3-5 hours","long":"Full day"}},"age":{"label":"Age Group","options":{"all":"All Ages","kids":"Kids (0-12)","teens":"Teens (13-17)","adults":"Adults (18+)"}},"accessibility":{"label":"Accessibility","options":{"all":"No Preference","wheelchair":"Wheelchair Accessible","hearing":"Hearing Impaired Friendly","visual":"Visually Impaired Friendly"}}},"cards":{"event1":{"title":"Summer Music Festival 2024","description":"Join us for an unforgettable night of live music featuring top local and international artists.","location":"Central Park Amphitheater","time":"7:00 PM - 11:00 PM","price":"$45 - $120"},"event2":{"title":"Modern Art Exhibition","description":"Explore contemporary artworks from emerging and established artists in our city.","location":"City Art Gallery","time":"10:00 AM - 6:00 PM","price":"Free Entry"},"event3":{"title":"City Marathon 2024","description":"Challenge yourself in our annual city marathon with routes for all fitness levels.","location":"City Center","time":"6:00 AM - 12:00 PM","price":"$25 - $50"},"event4":{"title":"Tech Innovation Conference","description":"Discover the latest trends in technology and innovation with industry leaders.","location":"Convention Center","time":"9:00 AM - 6:00 PM","price":"$75"},"event5":{"title":"International Food Festival","description":"Taste cuisines from around the world in one amazing location.","location":"City Square","time":"11:00 AM - 9:00 PM","price":"Free"},"event6":{"title":"Author Book Reading","description":"Meet bestselling authors and discover new books in this intimate reading session.","location":"Public Library","time":"2:00 PM - 4:00 PM","price":"$15"}}},"eventDetails":{"pageTitle":"Event Details","eventInformation":"Event Information","dateTime":"Date & Time","location":"Location","price":"Price","category":"Category","organizer":"Organizer","website":"Website","visitWebsite":"Visit Website","addToWishlist":"Add to Wishlist","shareEvent":"Share Event","getTickets":"Get Tickets","eventDescription":"About This Event","hero":{"category":"Music Festival","subtitle":"Join us for an unforgettable night of live music featuring top local and international artists in the heart of the city.","day":"Saturday","durationLabel":"4 hours","area":"Downtown Area","tiers":"Multiple tiers available"},"locationSection":"Location & Directions","viewOnGoogleMaps":"View on Google Maps","eventSchedule":"Event Schedule","ticketInformation":"Ticket Information","relatedEvents":"Similar Events","seeAllEvents":"See All Events","about":{"p1":"Get ready for the most spectacular music festival of the year! The Summer Music Festival 2024 brings together an incredible lineup of artists from various genres, creating an unforgettable experience for music lovers of all ages.","p2":"This year's festival features over 20 artists performing across multiple stages, including headliners that will blow your mind. From indie rock to electronic dance music, from folk to hip-hop, we've curated a diverse lineup that celebrates the rich tapestry of contemporary music.","p3":"The Central Park Amphitheater provides the perfect backdrop for this musical celebration, with its natural acoustics and beautiful outdoor setting. Whether you're dancing under the stars or relaxing on the grass, this festival promises to be an experience you'll never forget.","expectTitle":"What to Expect:","list":{"li1":"Live performances from 20+ renowned artists","li2":"Multiple stages with different music genres","li3":"Food trucks and local vendors","li4":"Interactive art installations","li5":"VIP areas with premium amenities","li6":"Professional sound and lighting systems"}},"featuredArtists":"Featured Artists","artists":{"electricWaves":{"title":"The Electric Waves","genre":"Electronic / Headliner","desc":"Known for their electrifying performances and chart-topping hits."},"midnightEchoes":{"title":"Midnight Echoes","genre":"Indie Rock","desc":"Rising stars with a unique sound that blends classic and modern rock."},"lunaDreamers":{"title":"Luna & The Dreamers","genre":"Folk / Acoustic","desc":"Soulful melodies and heartfelt lyrics that touch the soul."},"bassRevolution":{"title":"Bass Revolution","genre":"Hip-Hop / Rap","desc":"High-energy performances with powerful beats and meaningful lyrics."}},"schedule":{"gatesOpen":{"title":"Gates Open","desc":"Festival grounds open, food vendors available"},"openingAct":{"title":"Opening Act - Luna & The Dreamers","desc":"Acoustic stage performance"},"midnightEchoes":{"title":"Midnight Echoes","desc":"Main stage rock performance"},"bassRevolution":{"title":"Bass Revolution","desc":"Hip-hop stage takeover"},"headliner":{"title":"The Electric Waves - Headliner","desc":"Main stage closing performance"}},"venueDetails":"Venue Details","parkingInfo":"Parking Information","parking":{"list":{"li1":"On-site parking: $15","li2":"Street parking available","li3":"Public transit recommended"}},"accessibilityTitle":"Accessibility","accessibility":{"list":{"li1":"Wheelchair accessible","li2":"ADA compliant facilities","li3":"Sign language interpreters available"}},"tickets":{"generalAdmission":"General Admission","vipExperience":"VIP Experience","mostPopular":"Most Popular","features":{"li1":"Access to all stages","li2":"General seating area","li3":"Food court access","li4":"Premium viewing area","li5":"Complimentary drinks","li6":"VIP restrooms","li7":"Meet & greet opportunity","li8":"Exclusive merchandise"},"nonRefundable":"Tickets are non-refundable. All sales final.","generalAdmissionOption":"General Admission - $45","vipExperienceOption":"VIP Experience - $120"},"purchaseTickets":"Purchase Tickets","eventOrganizer":"Event Organizer","organizerInfo":{"description":"Professional event organizer with 10+ years of experience in music festivals.","ratingLabel":"Rating"},"contactOrganizer":"Contact Organizer","similarEvents":"Similar Events","viewOnMap":"View on Map","modal":{"ticketType":"Ticket Type","selectTicketType":"Select ticket type","quantity":"Quantity","selectQuantity":"Select quantity","qty1":"1 Ticket","qty2":"2 Tickets","qty3":"3 Tickets","qty4":"4 Tickets","orderSummary":"Order Summary","subtotal":"Subtotal:","serviceFee":"Service Fee:","total":"Total:","proceed":"Proceed to Payment","processing":"Processing..."},"similar":{"jazz":{"title":"Jazz in the Park","date":"Oct 28, 2024","price":"$25"},"rock":{"title":"Rock the Night","date":"Nov 5, 2024","price":"$55"},"classical":{"title":"Classical Evening","date":"Nov 12, 2024","price":"$40"}},"heroTitle":"Summer Music Festival 2024","addedToWishlist":"Added to Wishlist","shareTextPrefix":"Check out this amazing event:","notifications":{"linkCopied":"Event link copied to clipboard!","unableToCopy":"Unable to copy link","redirectingTo":"Redirecting to {title}..."},"validation":{"selectTicketType":"Please select a ticket type","selectQuantity":"Please select quantity","enterFirstName":"Please enter your first name","enterLastName":"Please enter your last name","enterEmail":"Please enter your email","validEmail":"Please enter a valid email","enterPhone":"Please enter your phone number"},"confirmation":{"title":"Tickets Purchased Successfully!","event":"Event:","ticketType":"Ticket Type:","quantity":"Quantity:","name":"Name:","email":"Email:","note":"Confirmation details have been sent to your email address.","addToCalendar":"Add to Calendar"}},"about":{"pageTitle":"About Us","pageSubtitle":"Learn more about our mission and team","pageHero":{"title":"About City Events Guide","subtitle":"Connecting communities through amazing local experiences","breadcrumb":"About"},"story":{"title":"Our Story","lead":"City Events Guide was born from a simple idea: every community deserves to know about the amazing events happening right in their backyard.","paragraph1":"Founded in 2020, we started as a small team of event enthusiasts who were frustrated by the scattered information about local events. We believed there had to be a better way to discover concerts, festivals, workshops, and community gatherings.","paragraph2":"Today, we're proud to be the leading platform for local event discovery, helping thousands of people find their next favorite experience every month.","stats":{"events":{"count":"10,000+","label":"Events Listed"},"users":{"count":"50,000+","label":"Happy Users"},"organizers":{"count":"500+","label":"Event Organizers"}}},"mission":{"title":"Our Mission & Values","subtitle":"What drives us every day"},"values":{"community":{"title":"Community First","description":"We believe in the power of community and strive to bring people together through shared experiences and local events."},"discovery":{"title":"Easy Discovery","description":"Finding great events should be simple and enjoyable. We make it easy to discover experiences that match your interests."},"passion":{"title":"Passion Driven","description":"Our team is passionate about events and experiences. We're not just building a platform; we're creating connections."},"trust":{"title":"Trust & Safety","description":"We verify event organizers and provide secure ticketing to ensure safe and reliable experiences for everyone."},"innovation":{"title":"Innovation","description":"We continuously improve our platform with new features and technologies to enhance your event discovery experience."},"inclusivity":{"title":"Inclusivity","description":"We celebrate diversity and work to make events accessible to everyone, regardless of background or ability."}},"team":{"title":"Meet Our Team","subtitle":"The passionate people behind City Events Guide","members":{"alex":{"name":"Alex Johnson","role":"Founder & CEO","bio":"Passionate about connecting communities through events. 10+ years in event management."},"sarah":{"name":"Sarah Chen","role":"Head of Product","bio":"UX designer turned product manager. Focused on creating intuitive user experiences."},"michael":{"name":"Michael Rodriguez","role":"Lead Developer","bio":"Full-stack developer with expertise in scalable web applications and mobile development."},"emily":{"name":"Emily Davis","role":"Marketing Director","bio":"Creative marketer specializing in community engagement and digital marketing strategies."}}},"cta":{"title":"Ready to Discover Amazing Events?","subtitle":"Join thousands of event-goers who trust City Events Guide to find their next great experience.","buttons":{"browse":"Browse Events","contact":"Get in Touch"},"features":{"discovery":"Easy Event Discovery","ticketing":"Secure Ticketing","community":"Community Driven"}},"links":{"aboutUs":"About Us"},"ourStory":"Our Story","ourMission":"Our Mission","ourValues":"Our Values"},"contact":{"pageTitle":"Contact Us","pageSubtitle":"Get in touch with our team","getInTouch":"Get In Touch","subtitle":"Have questions? We'd love to hear from you.","fullName":"Full Name","email":"Email Address","subject":"Subject","message":"Your Message","sendMessage":"Send Message","contactInfo":"Contact Information","address":"Address","phone":"Phone","emailLabel":"Email","followUs":"Follow Us"},"wishlist":{"pageTitle":"My Wishlist","pageSubtitle":"Events you've saved for later","empty":"Your wishlist is empty","emptyDescription":"Start adding events to your wishlist to keep track of your favorite events.","browseEvents":"Browse Events","removeFromWishlist":"Remove from Wishlist"},"common":{"loading":"Loading...","error":"An error occurred. Please try again.","success":"Success!","backToTop":"Back to Top","readMore":"Read More","seeMore":"See More","changeLanguage":"Change Language","toggleDarkMode":"Toggle Dark Mode","cancel":"Cancel"}},
            'ar': {"nav":{"brand":"فعاليات المدينة","home":"الرئيسية","allEvents":"جميع الفعاليات","about":"من نحن","contact":"اتصل بنا"},"hero":{"title":"اكتشف","titleSpan":"فعاليات محلية مذهلة","subtitle":"اعثر على أفضل الحفلات الموسيقية والمهرجانات وورش العمل والتجمعات المجتمعية التي تحدث في مدينتك. لا تفوت المتعة!","exploreEvents":"استكشف الفعاليات","learnMore":"اعرف المزيد"},"featured":{"title":"فعاليات مميزة للأسبوع","subtitle":"لا تفوت هذه الفعاليات المذهلة القادمة","viewDetails":"عرض التفاصيل","slider":{"event1":{"category":"موسيقى","title":"مهرجان الموسيقى الصيفي 2024","description":"انضم إلينا لقضاء ليلة لا تُنسى من الموسيقى الحية تضم أفضل الفنانين المحليين والعالميين.","date":"15 أكتوبر 2024","location":"مدرج الحديقة المركزية","price":"45 دولار - 120 دولار"},"event2":{"category":"ثقافة","title":"معرض الفن الحديث","description":"استكشف الأعمال الفنية المعاصرة من فنانين ناشئين ومعروفين في مدينتنا.","date":"12-20 أكتوبر 2024","location":"معرض الفنون بالمدينة","price":"دخول مجاني"},"event3":{"category":"رياضة","title":"ماراثون المدينة 2024","description":"تحدى نفسك في ماراثون المدينة السنوي مع مسارات لجميع مستويات اللياقة البدنية.","date":"22 أكتوبر 2024","location":"وسط المدينة","price":"25 دولار - 50 دولار"}}},"categories":{"title":"تصفح حسب الفئة","subtitle":"ابحث عن الفعاليات التي تناسب اهتماماتك","music":"موسيقى","culture":"ثقافة","sports":"رياضة","family":"عائلة","food":"طعام","business":"أعمال","technology":"تكنولوجيا","literature":"أدب","events":"فعاليات"},"latest":{"title":"أحدث الفعاليات","subtitle":"فعاليات مضافة حديثاً قد تهمك","viewAll":"عرض جميع الفعاليات","cards":{"event1":{"title":"مؤتمر الابتكار التقني","description":"اكتشف أحدث الاتجاهات في التكنولوجيا والابتكار.","location":"مركز المؤتمرات","time":"9:00 صباحاً – 6:00 مساءً"},"event2":{"title":"مهرجان الطعام الدولي","description":"تذوق أشهى الأطباق من جميع أنحاء العالم في مكان واحد.","location":"ساحة المدينة","time":"11:00 صباحاً – 9:00 مساءً"},"event3":{"title":"قراءة كتاب لمؤلف","description":"التقِ بأشهر المؤلفين واكتشف كتباً جديدة.","location":"المكتبة العامة","time":"2:00 مساءً – 4:00 مساءً"}}},"newsletter":{"title":"ابق على اطلاع","subtitle":"اشترك في نشرتنا الإخبارية ولا تفوت أي فعالية مثيرة في مدينتك","placeholder":"أدخل بريدك الإلكتروني","subscribe":"اشترك","features":{"alerts":"تنبيهات الفعاليات","offers":"عروض حصرية","digest":"ملخص أسبوعي"}},"footer":{"description":"دليلك النهائي لاكتشاف الفعاليات المحلية المذهلة. من الحفلات الموسيقية إلى ورش العمل، نساعدك في العثور على الفعاليات المثالية في مدينتك.","quickLinks":"روابط سريعة","categories":"الفئات","contactInfo":"معلومات الاتصال","address":"123 شارع الفعاليات، وسط المدينة، CC 12345","phone":"+1 (555) 123-4567","email":"info@cityevents.com","copyright":"2024 دليل فعاليات المدينة. جميع الحقوق محفوظة.","privacy":"سياسة الخصوصية","terms":"شروط الخدمة","cookies":"سياسة ملفات تعريف الارتباط"},"events":{"pageTitle":"جميع الفعاليات","pageSubtitle":"اكتشف الفعاليات المذهلة التي تحدث في مدينتك","search":"البحث عن فعاليات...","allCategories":"جميع الفئات","allDates":"جميع التواريخ","today":"اليوم","tomorrow":"غداً","thisWeek":"هذا الأسبوع","thisMonth":"هذا الشهر","allLocations":"جميع المواقع","sortBy":"ترتيب حسب","sortLabel":"ترتيب حسب:","sort":{"date":"التاريخ","name":"الاسم","price":"السعر","popularity":"الشعبية"},"allPrices":"جميع الأسعار","priceRanges":{"0_25":"$0 - $25","25_50":"$25 - $50","50_100":"$50 - $100","100_plus":"$100+"},"gridView":"عرض الشبكة","listView":"عرض القائمة","dateAsc":"التاريخ (الأقرب أولاً)","dateDesc":"التاريخ (الأحدث أولاً)","priceAsc":"السعر (من الأقل للأعلى)","priceDesc":"السعر (من الأعلى للأقل)","resultsFound":"نتيجة","showing":"عرض","of":"من","noResults":"لم نتمكن من العثور على أي فعاليات تطابق معاييرك. حاول تعديل عوامل التصفية أو مصطلحات البحث.","noResultsTitle":"لم يتم العثور على فعاليات","clearAllFilters":"مسح جميع الفلاتر","free":"مجاني","freeEntry":"دخول مجاني","months":{"Jan":"يناير","Feb":"فبراير","Mar":"مارس","Apr":"أبريل","May":"مايو","Jun":"يونيو","Jul":"يوليو","Aug":"أغسطس","Sep":"سبتمبر","Oct":"أكتوبر","Nov":"نوفمبر","Dec":"ديسمبر"},"addToFavorites":"إضافة إلى المفضلة","filters":{"advancedToggle":"فلاتر متقدمة","location":{"label":"الموقع","options":{"downtown":"وسط المدينة","uptown":"المدينة العليا","suburbs":"الضواحي"}},"duration":{"label":"المدة","options":{"all":"أي مدة","short":"1-2 ساعة","medium":"3-5 ساعات","long":"يوم كامل"}},"age":{"label":"الفئة العمرية","options":{"all":"كل الأعمار","kids":"أطفال (0-12)","teens":"مراهقون (13-17)","adults":"بالغون (18+)"}},"accessibility":{"label":"إمكانية الوصول","options":{"all":"بدون تفضيل","wheelchair":"صالح لذوي الكراسي المتحركة","hearing":"ملائم لضعاف السمع","visual":"ملائم لضعاف البصر"}}},"cards":{"event1":{"title":"مهرجان الموسيقى الصيفي 2024","description":"انضم إلينا لقضاء ليلة لا تُنسى من الموسيقى الحية تضم أفضل الفنانين المحليين والعالميين.","location":"مدرج الحديقة المركزية","time":"7:00 مساءً – 11:00 مساءً","price":"45 دولار - 120 دولار"},"event2":{"title":"معرض الفن الحديث","description":"استكشف الأعمال الفنية المعاصرة من فنانين ناشئين ومعروفين في مدينتنا.","location":"معرض الفنون بالمدينة","time":"10:00 صباحاً – 6:00 مساءً","price":"دخول مجاني"},"event3":{"title":"ماراثون المدينة 2024","description":"تحدى نفسك في ماراثون المدينة السنوي مع مسارات لجميع مستويات اللياقة البدنية.","location":"وسط المدينة","time":"6:00 صباحاً – 12:00 ظهراً","price":"25 دولار - 50 دولار"},"event4":{"title":"مؤتمر الابتكار التقني","description":"اكتشف أحدث الاتجاهات في التكنولوجيا والابتكار مع رواد الصناعة.","location":"مركز المؤتمرات","time":"9:00 صباحاً – 6:00 مساءً","price":"75 دولار"},"event5":{"title":"مهرجان الطعام الدولي","description":"تذوق أشهى الأطباق من حول العالم في مكان واحد مذهل.","location":"ساحة المدينة","time":"11:00 صباحاً – 9:00 مساءً","price":"مجاني"},"event6":{"title":"قراءة كتاب لمؤلف","description":"التقِ بأشهر المؤلفين واكتشف كتباً جديدة في جلسة قراءة حميمة.","location":"المكتبة العامة","time":"2:00 مساءً – 4:00 مساءً","price":"15 دولار"}}},"eventDetails":{"pageTitle":"تفاصيل الفعالية","eventInformation":"معلومات الفعالية","dateTime":"التاريخ والوقت","location":"الموقع","price":"السعر","category":"الفئة","organizer":"المنظم","website":"الموقع الإلكتروني","visitWebsite":"زيارة الموقع","addToWishlist":"إضافة للمفضلة","shareEvent":"مشاركة الفعالية","getTickets":"احصل على التذاكر","eventDescription":"نبذة عن الفعالية","hero":{"category":"مهرجان موسيقي","subtitle":"انضم إلينا لقضاء ليلة لا تُنسى من الموسيقى الحية بمشاركة نخبة من الفنانين المحليين والعالميين في قلب المدينة.","day":"السبت","durationLabel":"4 ساعات","area":"منطقة وسط المدينة","tiers":"توفر عدة فئات"},"locationSection":"الموقع والاتجاهات","viewOnGoogleMaps":"عرض على خرائط جوجل","eventSchedule":"جدول الفعالية","ticketInformation":"معلومات التذاكر","relatedEvents":"فعاليات مشابهة","seeAllEvents":"عرض جميع الفعاليات","about":{"p1":"استعدوا لأروع مهرجان موسيقي لهذا العام! يجمع مهرجان الموسيقى الصيفي 2024 نخبة من الفنانين من مختلف الأنواع الموسيقية لتجربة لا تُنسى لعشاق الموسيقى من جميع الأعمار.","p2":"يضم مهرجان هذا العام أكثر من 20 فناناً على عدة مسارح، بما في ذلك العروض الرئيسية المذهلة. من الروك المستقل إلى الموسيقى الإلكترونية، ومن الفولك إلى الهيب هوب، قمنا باختيار تشكيلة متنوعة تحتفي بروعة الموسيقى المعاصرة.","p3":"يوفر مدرج الحديقة المركزية الخلفية المثالية لهذا الاحتفال الموسيقي بفضل صوته الطبيعي وإطلالته الخارجية الجميلة. سواء كنت ترقص تحت النجوم أو تسترخي على العشب، سيمنحك هذا المهرجان تجربة لا تُنسى.","expectTitle":"ماذا تتوقع؟","list":{"li1":"عروض حية لأكثر من 20 فناناً مشهوراً","li2":"مسارح متعددة بأنواع موسيقية مختلفة","li3":"شاحنات طعام وبائعون محليون","li4":"تركيبات فنية تفاعلية","li5":"مناطق كبار الشخصيات مع خدمات مميزة","li6":"أنظمة صوت وإضاءة احترافية"}},"featuredArtists":"الفنانون المشاركون","artists":{"electricWaves":{"title":"The Electric Waves","genre":"إلكتروني / العرض الرئيسي","desc":"معروفون بعروضهم المبهرة وأغانيهم ذات المراتب الأولى."},"midnightEchoes":{"title":"Midnight Echoes","genre":"روك مستقل","desc":"نجوم صاعدون بصوت فريد يجمع بين الروك الكلاسيكي والحديث."},"lunaDreamers":{"title":"Luna & The Dreamers","genre":"فولك / أكوستيك","desc":"ألحان عذبة وكلمات مؤثرة تلامس القلوب."},"bassRevolution":{"title":"Bass Revolution","genre":"هيب هوب / راب","desc":"عروض مليئة بالطاقة بإيقاعات قوية وكلمات معبرة."}},"schedule":{"gatesOpen":{"title":"فتح الأبواب","desc":"فتح ساحات المهرجان وتوفر بائعي الطعام"},"openingAct":{"title":"العرض الافتتاحي - Luna & The Dreamers","desc":"عرض على المسرح الأكوستيك"},"midnightEchoes":{"title":"Midnight Echoes","desc":"عرض روك على المسرح الرئيسي"},"bassRevolution":{"title":"Bass Revolution","desc":"عرض هيب هوب مميز"},"headliner":{"title":"The Electric Waves - العرض الرئيسي","desc":"العرض الختامي على المسرح الرئيسي"}},"venueDetails":"تفاصيل المكان","parkingInfo":"معلومات الوقوف","parking":{"list":{"li1":"موقف داخل الموقع: 15$","li2":"توفر مواقف في الشوارع","li3":"يوصى بوسائل النقل العامة"}},"accessibilityTitle":"إمكانية الوصول","accessibility":{"list":{"li1":"إمكانية وصول لذوي الكراسي المتحركة","li2":"مرافق متوافقة مع ADA","li3":"إتاحة مترجمي لغة الإشارة"}},"tickets":{"generalAdmission":"دخول عام","vipExperience":"تجربة كبار الشخصيات","mostPopular":"الأكثر شعبية","features":{"li1":"الدخول إلى جميع المسارح","li2":"منطقة جلوس عامة","li3":"دخول ساحة الطعام","li4":"منطقة مشاهدة مميزة","li5":"مشروبات مجانية","li6":"دورات مياه خاصة بكبار الشخصيات","li7":"فرصة لقاء وتحية","li8":"هدايا حصرية"},"nonRefundable":"التذاكر غير قابلة للاسترداد. جميع المبيعات نهائية.","generalAdmissionOption":"دخول عام - 45$","vipExperienceOption":"تجربة كبار الشخصيات - 120$"},"purchaseTickets":"شراء التذاكر","eventOrganizer":"منظم الفعالية","organizerInfo":{"description":"منظم فعاليات محترف بخبرة تزيد عن 10 سنوات في المهرجانات الموسيقية.","ratingLabel":"تقييم"},"contactOrganizer":"تواصل مع المنظم","similarEvents":"فعاليات مشابهة","viewOnMap":"عرض على الخريطة","modal":{"ticketType":"نوع التذكرة","selectTicketType":"اختر نوع التذكرة","quantity":"الكمية","selectQuantity":"اختر الكمية","qty1":"تذكرة واحدة","qty2":"تذكرتان","qty3":"3 تذاكر","qty4":"4 تذاكر","orderSummary":"ملخص الطلب","subtotal":"الإجمالي الفرعي:","serviceFee":"رسوم الخدمة:","total":"الإجمالي:","proceed":"متابعة الدفع","processing":"جارٍ المعالجة..."},"similar":{"jazz":{"title":"جاز في الحديقة","date":"28 أكتوبر 2024","price":"25$"},"rock":{"title":"روك ذا نايت","date":"5 نوفمبر 2024","price":"55$"},"classical":{"title":"أمسية كلاسيكية","date":"12 نوفمبر 2024","price":"40$"}},"heroTitle":"مهرجان الموسيقى الصيفي 2024","addedToWishlist":"تمت الإضافة إلى المفضلة","shareTextPrefix":"اطلع على هذه الفعالية الرائعة:","notifications":{"linkCopied":"تم نسخ رابط الفعالية إلى الحافظة!","unableToCopy":"تعذر نسخ الرابط","redirectingTo":"جاري التحويل إلى {title}..."},"validation":{"selectTicketType":"يرجى اختيار نوع التذكرة","selectQuantity":"يرجى اختيار الكمية","enterFirstName":"يرجى إدخال الاسم الأول","enterLastName":"يرجى إدخال اسم العائلة","enterEmail":"يرجى إدخال البريد الإلكتروني","validEmail":"يرجى إدخال بريد إلكتروني صالح","enterPhone":"يرجى إدخال رقم الهاتف"},"confirmation":{"title":"تم شراء التذاكر بنجاح!","event":"الفعالية:","ticketType":"نوع التذكرة:","quantity":"الكمية:","name":"الاسم:","email":"البريد الإلكتروني:","note":"تم إرسال تفاصيل التأكيد إلى بريدك الإلكتروني.","addToCalendar":"إضافة إلى التقويم"}},"about":{"pageTitle":"من نحن","pageSubtitle":"تعرف على مهمتنا وفريقنا","pageHero":{"title":"عن دليل فعاليات المدينة","subtitle":"نربط المجتمعات من خلال تجارب محلية مذهلة","breadcrumb":"من نحن"},"story":{"title":"قصتنا","lead":"وُلد دليل فعاليات المدينة من فكرة بسيطة: كل مجتمع يستحق أن يعرف عن الفعاليات المذهلة التي تحدث بالقرب منه.","paragraph1":"تأسسنا في عام 2020 كفريق صغير من عشاق الفعاليات شعروا بالإحباط من تشتت المعلومات حول الفعاليات المحلية. كنا نؤمن بوجود طريقة أفضل لاكتشاف الحفلات والمهرجانات وورش العمل والتجمعات المجتمعية.","paragraph2":"اليوم نفخر بأننا المنصة الرائدة لاكتشاف الفعاليات المحلية، حيث نساعد آلاف الأشخاص على العثور على تجربتهم المفضلة التالية كل شهر.","stats":{"events":{"count":"10,000+","label":"فعاليات مدرجة"},"users":{"count":"50,000+","label":"مستخدمون سعداء"},"organizers":{"count":"500+","label":"منظمو فعاليات"}}},"mission":{"title":"مهمتنا وقيمنا","subtitle":"ما الذي يدفعنا كل يوم"},"values":{"community":{"title":"المجتمع أولاً","description":"نؤمن بقوة المجتمع ونسعى لجمع الناس من خلال التجارب المشتركة والفعاليات المحلية."},"discovery":{"title":"اكتشاف سهل","description":"يجب أن يكون العثور على فعاليات رائعة سهلاً وممتعاً. نسهل عليك اكتشاف التجارب التي تناسب اهتماماتك."},"passion":{"title":"مدفوعون بالشغف","description":"فريقنا شغوف بالفعاليات والتجارب. نحن لا نبني منصة فحسب، بل نخلق روابط."},"trust":{"title":"الثقة والسلامة","description":"نقوم بالتحقق من منظمي الفعاليات ونوفر تذاكر آمنة لضمان تجارب موثوقة للجميع."},"innovation":{"title":"الابتكار","description":"نحسّن منصتنا باستمرار بميزات وتقنيات جديدة لتعزيز تجربة اكتشاف الفعاليات."},"inclusivity":{"title":"الشمولية","description":"نحتفل بالتنوع ونعمل على جعل الفعاليات متاحة للجميع بغض النظر عن الخلفية أو القدرات."}},"team":{"title":"تعرف على فريقنا","subtitle":"الأشخاص الشغوفون وراء دليل فعاليات المدينة","members":{"alex":{"name":"Alex Johnson","role":"المؤسس والرئيس التنفيذي","bio":"شغوف بربط المجتمعات من خلال الفعاليات. أكثر من 10 سنوات من الخبرة في إدارة الفعاليات."},"sarah":{"name":"Sarah Chen","role":"رئيسة المنتج","bio":"مصممة تجربة مستخدم تحولت إلى مديرة منتج. تركز على ابتكار تجارب مستخدم سلسة."},"michael":{"name":"Michael Rodriguez","role":"قائد فريق التطوير","bio":"مطوّر متكامل يتمتع بخبرة في تطوير تطبيقات ويب قابلة للتوسع وتطبيقات الأجهزة المحمولة."},"emily":{"name":"Emily Davis","role":"مديرة التسويق","bio":"مسوّقة مبدعة متخصصة في تفعيل المجتمعات واستراتيجيات التسويق الرقمي."}}},"cta":{"title":"هل أنت مستعد لاكتشاف فعاليات مذهلة؟","subtitle":"انضم إلى آلاف محبي الفعاليات الذين يثقون بدليل فعاليات المدينة للعثور على تجربتهم التالية.","buttons":{"browse":"تصفح الفعاليات","contact":"تواصل معنا"},"features":{"discovery":"اكتشاف فعاليات بسهولة","ticketing":"تذاكر آمنة","community":"مدفوع بالمجتمع"}},"links":{"aboutUs":"من نحن"},"ourStory":"قصتنا","ourMission":"مهمتنا","ourValues":"قيمنا"},"contact":{"pageTitle":"اتصل بنا","pageSubtitle":"تواصل مع فريقنا","getInTouch":"تواصل معنا","subtitle":"هل لديك أسئلة؟ نحب أن نسمع منك.","fullName":"الاسم الكامل","email":"البريد الإلكتروني","subject":"الموضوع","message":"رسالتك","sendMessage":"إرسال الرسالة","contactInfo":"معلومات الاتصال","address":"العنوان","phone":"الهاتف","emailLabel":"البريد الإلكتروني","followUs":"تابعنا"},"wishlist":{"pageTitle":"قائمة الأمنيات","pageSubtitle":"الفعاليات التي حفظتها لوقت لاحق","empty":"قائمة أمنياتك فارغة","emptyDescription":"ابدأ بإضافة الفعاليات إلى قائمة أمنياتك لتتبع الفعاليات المفضلة لديك.","browseEvents":"تصفح الفعاليات","removeFromWishlist":"حذف من المفضلة"},"common":{"loading":"جارٍ التحميل...","error":"حدث خطأ. يرجى المحاولة مرة أخرى.","success":"نجح!","backToTop":"العودة للأعلى","readMore":"اقرأ المزيد","seeMore":"شاهد المزيد","changeLanguage":"تغيير اللغة","toggleDarkMode":"تبديل الوضع الداكن","cancel":"إلغاء"}}
        };
        // Extend embedded fallback with detailed Contact and Wishlist (parity with translations/*.json)
        translations['en'].contact = {
            pageTitle: 'Contact Us',
            pageSubtitle: 'Get in touch with our team',
            pageHero: {
                title: 'Contact Us',
                subtitle: "We'd love to hear from you. Get in touch with our team!",
                breadcrumb: 'Contact'
            },
            form: {
                title: 'Send us a Message',
                subtitle: "Have a question, suggestion, or want to partner with us? We're here to help!",
                firstNameLabel: 'First Name *',
                lastNameLabel: 'Last Name *',
                emailLabel: 'Email Address *',
                phoneLabel: 'Phone Number',
                subjectLabel: 'Subject *',
                subjectPlaceholder: 'Choose a subject',
                subjectOptions: {
                    general: 'General Inquiry',
                    eventListing: 'List My Event',
                    partnership: 'Partnership Opportunity',
                    technical: 'Technical Support',
                    feedback: 'Feedback & Suggestions',
                    press: 'Press & Media',
                    other: 'Other'
                },
                messageLabel: 'Message *',
                messagePlaceholder: 'Tell us more about your inquiry...',
                messageHelp: 'Minimum 10 characters required.',
                newsletterLabel: 'Subscribe to our newsletter for event updates and announcements',
                privacy: {
                    agreePrefix: 'I agree to the',
                    and: 'and'
                },
                send: 'Send Message',
                reset: 'Reset Form'
            },
            validation: {
                firstName: 'Please provide your first name.',
                lastName: 'Please provide your last name.',
                email: 'Please provide a valid email address.',
                subject: 'Please select a subject.',
                message: 'Please provide your message.',
                privacy: 'You must agree to our privacy policy.'
            },
            info: {
                title: 'Get in Touch',
                subtitle: "We're here to help and answer any questions you might have.",
                office: {
                    title: 'Visit Our Office',
                    addressLine1: '123 Event Street',
                    addressLine2: 'City Center, CC 12345',
                    country: 'United States'
                },
                phone: {
                    title: 'Call Us',
                    number: '+1 (555) 123-4567',
                    weekdays: 'Mon - Fri: 9:00 AM - 6:00 PM',
                    weekend: 'Weekend: 10:00 AM - 4:00 PM'
                },
                email: {
                    title: 'Email Us',
                    primary: 'info@cityevents.com',
                    support: 'support@cityevents.com',
                    partnerships: 'partnerships@cityevents.com'
                },
                chat: {
                    title: 'Live Chat',
                    available: 'Available 24/7 for immediate assistance',
                    hint: 'Click the chat icon in the bottom right'
                }
            },
            faq: {
                title: 'Frequently Asked Questions',
                subtitle: 'Quick answers to common questions',
                items: {
                    q1: {
                        question: 'How do I list my event on City Events Guide?',
                        answer: `Listing your event is easy! Simply contact us through the form above with "List My Event" as the subject, or email us directly at partnerships@cityevents.com. We'll guide you through our simple submission process and help you reach more attendees.`
                    },
                    q2: {
                        question: 'Is there a fee to list events?',
                        answer: 'We offer both free and premium listing options. Basic listings are completely free and include essential event information. Premium listings offer enhanced visibility, featured placement, and additional promotional tools for a small fee.'
                    },
                    q3: {
                        question: 'How do I purchase tickets through your platform?',
                        answer: `Purchasing tickets is secure and straightforward. Click on any event to view details, then select "Get Tickets" or "Purchase Tickets." You'll be guided through our secure checkout process. We accept all major credit cards and PayPal.`
                    },
                    q4: {
                        question: 'Can I get refunds for purchased tickets?',
                        answer: 'Refund policies vary by event organizer. Most events offer refunds if cancelled by the organizer. For event-specific refund policies, check the event details page or contact the organizer directly. We\'re happy to help facilitate communication if needed.'
                    },
                    q5: {
                        question: 'How do I stay updated on new events?',
                        answer: "Subscribe to our newsletter for weekly event updates, follow us on social media, or create an account to set up personalized event alerts based on your interests and location. You can also bookmark events you're interested in."
                    }
                }
            },
            map: {
                title: 'Find Our Office',
                subtitle: 'Visit us in person or find us on the map',
                cardTitle: 'City Events Guide Office',
                address: '123 Event Street, City Center',
                getDirections: 'Get Directions'
            }
        };
        translations['en'].wishlist = {
            pageTitle: 'My Wishlist',
            pageSubtitle: "Events you've saved for later",
            breadcrumb: 'Wishlist',
            header: {
                title: 'Your Saved Events',
                countPrefix: 'You have',
                countSuffix: 'events in your wishlist'
            },
            actions: {
                sortByDate: 'Sort by Date',
                clearAll: 'Clear All',
                share: 'Share Wishlist'
            },
            emptyTitle: 'Your Wishlist is Empty',
            empty: 'Your wishlist is empty',
            emptyDescription: 'Start adding events to your wishlist to keep track of your favorite events.',
            browseEvents: 'Browse Events',
            removeFromWishlist: 'Remove from Wishlist',
            insights: {
                upcomingTitle: 'Upcoming Events',
                upcomingMeta: 'events this month',
                favoriteTitle: 'Favorite Category',
                favoriteMeta: 'most saved category',
                recentTitle: 'Recently Added',
                recentMeta: 'last addition'
            },
            related: {
                title: 'You Might Also Like',
                subtitle: 'Based on your wishlist preferences'
            }
        };
        translations['ar'].contact = {
            pageTitle: 'اتصل بنا',
            pageSubtitle: 'تواصل مع فريقنا',
            pageHero: {
                title: 'اتصل بنا',
                subtitle: 'يسعدنا سماعك. تواصل مع فريقنا!',
                breadcrumb: 'اتصل بنا'
            },
            form: {
                title: 'أرسل لنا رسالة',
                subtitle: 'هل لديك سؤال أو اقتراح أو ترغب في الشراكة معنا؟ نحن هنا للمساعدة!',
                firstNameLabel: 'الاسم الأول *',
                lastNameLabel: 'اسم العائلة *',
                emailLabel: 'البريد الإلكتروني *',
                phoneLabel: 'رقم الهاتف',
                subjectLabel: 'الموضوع *',
                subjectPlaceholder: 'اختر موضوعاً',
                subjectOptions: {
                    general: 'استفسار عام',
                    eventListing: 'أضف فعاليتي',
                    partnership: 'فرصة شراكة',
                    technical: 'دعم فني',
                    feedback: 'ملاحظات واقتراحات',
                    press: 'الصحافة والإعلام',
                    other: 'أخرى'
                },
                messageLabel: 'الرسالة *',
                messagePlaceholder: 'أخبرنا المزيد عن استفسارك...',
                messageHelp: 'الحد الأدنى 10 أحرف.',
                newsletterLabel: 'اشترك في نشرتنا للحصول على تحديثات وإعلانات الفعاليات',
                privacy: {
                    agreePrefix: 'أوافق على',
                    and: 'و'
                },
                send: 'إرسال الرسالة',
                reset: 'إعادة تعيين النموذج'
            },
            validation: {
                firstName: 'يرجى إدخال الاسم الأول.',
                lastName: 'يرجى إدخال اسم العائلة.',
                email: 'يرجى إدخال بريد إلكتروني صالح.',
                subject: 'يرجى اختيار موضوع.',
                message: 'يرجى إدخال رسالتك.',
                privacy: 'يجب أن توافق على سياسة الخصوصية.'
            },
            info: {
                title: 'تواصل معنا',
                subtitle: 'نحن هنا للمساعدة والإجابة عن أي أسئلة لديك.',
                office: {
                    title: 'زر مكتبنا',
                    addressLine1: '123 شارع الفعاليات',
                    addressLine2: 'وسط المدينة، CC 12345',
                    country: 'الولايات المتحدة'
                },
                phone: {
                    title: 'اتصل بنا',
                    number: '+1 (555) 123-4567',
                    weekdays: 'الإثنين - الجمعة: 9:00 ص - 6:00 م',
                    weekend: 'عطلة نهاية الأسبوع: 10:00 ص - 4:00 م'
                },
                email: {
                    title: 'راسلنا',
                    primary: 'info@cityevents.com',
                    support: 'support@cityevents.com',
                    partnerships: 'partnerships@cityevents.com'
                },
                chat: {
                    title: 'دردشة مباشرة',
                    available: 'متاحة على مدار الساعة للمساعدة الفورية',
                    hint: 'انقر على أيقونة الدردشة في أسفل اليمين'
                }
            },
            faq: {
                title: 'الأسئلة الشائعة',
                subtitle: 'إجابات سريعة لأكثر الأسئلة شيوعاً',
                items: {
                    q1: {
                        question: 'كيف أضيف فعالتي إلى دليل فعاليات المدينة؟',
                        answer: 'إضافة فعاليتك سهلة! تواصل معنا عبر النموذج أعلاه واختر "أضف فعاليتي" كموضوع، أو أرسل بريداً مباشرة إلى partnerships@cityevents.com. سنرشدك خلال عملية الإرسال البسيطة ونساعدك في الوصول إلى مزيد من الحضور.'
                    },
                    q2: {
                        question: 'هل توجد رسوم لإدراج الفعاليات؟',
                        answer: 'نقدم خيارات إدراج مجانية ومميزة. الإدراج الأساسي مجاني تماماً ويشمل معلومات الفعالية الأساسية. أما الإدراج المميز فيوفر ظهوراً أكبر ومكاناً مميزاً وأدوات ترويج إضافية مقابل رسوم بسيطة.'
                    },
                    q3: {
                        question: 'كيف أشتري التذاكر عبر منصتكم؟',
                        answer: 'شراء التذاكر آمن وسهل. انقر على أي فعالية لعرض التفاصيل ثم اختر "احصل على التذاكر" أو "شراء التذاكر". ستتبع عملية دفع آمنة. نقبل جميع البطاقات الائتمانية الرئيسية وPayPal.'
                    },
                    q4: {
                        question: 'هل يمكنني استرداد ثمن التذاكر؟',
                        answer: 'تختلف سياسات الاسترداد حسب منظم الفعالية. غالباً ما تُقدّم الاستردادات في حال إلغاء الفعالية من قبل المنظم. لمزيد من التفاصيل، راجع صفحة الفعالية أو تواصل مع المنظم مباشرة. يسعدنا المساعدة في تسهيل التواصل عند الحاجة.'
                    },
                    q5: {
                        question: 'كيف أبقى على اطلاع بالفعاليات الجديدة؟',
                        answer: 'اشترك في نشرتنا الأسبوعية، وتابعنا على وسائل التواصل، أو أنشئ حساباً لتفعيل تنبيهات فعاليات مخصصة بناءً على اهتماماتك وموقعك. يمكنك أيضاً حفظ الفعاليات التي تهمك.'
                    }
                }
            },
            map: {
                title: 'اعثر على مكتبنا',
                subtitle: 'زرنا شخصياً أو اعثر علينا على الخريطة',
                cardTitle: 'مكتب دليل فعاليات المدينة',
                address: '123 شارع الفعاليات، وسط المدينة',
                getDirections: 'احصل على الاتجاهات'
            }
        };
        translations['ar'].wishlist = {
            pageTitle: 'قائمة الأمنيات',
            pageSubtitle: 'الفعاليات التي حفظتها لوقت لاحق',
            breadcrumb: 'قائمة الأمنيات',
            header: {
                title: 'فعالياتك المحفوظة',
                countPrefix: 'لديك',
                countSuffix: 'فعالية في قائمة الأمنيات'
            },
            actions: {
                sortByDate: 'الترتيب حسب التاريخ',
                clearAll: 'مسح الكل',
                share: 'مشاركة قائمة الأمنيات'
            },
            emptyTitle: 'قائمة أمنياتك فارغة',
            empty: 'قائمة أمنياتك فارغة',
            emptyDescription: 'ابدأ بإضافة الفعاليات إلى قائمة أمنياتك لتتبع الفعاليات المفضلة لديك.',
            browseEvents: 'تصفح الفعاليات',
            removeFromWishlist: 'حذف من المفضلة',
            insights: {
                upcomingTitle: 'فعاليات قادمة',
                upcomingMeta: 'فعاليات هذا الشهر',
                favoriteTitle: 'الفئة المفضلة',
                favoriteMeta: 'أكثر فئة تم حفظها',
                recentTitle: 'أضيفت مؤخراً',
                recentMeta: 'آخر إضافة'
            },
            related: {
                title: 'قد يعجبك أيضاً',
                subtitle: 'استناداً إلى تفضيلات قائمة أمنياتك'
            }
        };
        return translations[lang] || translations['en'];
    },
    
    // Get translation by key path (e.g., 'nav.home')
    t(keyPath) {
        const keys = keyPath.split('.');
        let value = this.translations;
        
        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            } else {
                return keyPath; // Return key if translation not found
            }
        }
        
        return value || keyPath;
    },
    
    // Apply translations to all elements with data-i18n attribute
    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // Check if we should translate placeholder or text content
            if (element.hasAttribute('data-i18n-placeholder')) {
                // Only set if we actually have a translated value
                if (translation && translation !== key) {
                    element.setAttribute('placeholder', translation);
                }
            } else {
                // Only replace content if translation exists; otherwise keep original text
                if (translation && translation !== key) {
                    element.textContent = translation;
                }
            }
        });

        // Translate title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation && translation !== key) {
                element.setAttribute('title', translation);
            }
        });

        // Translate aria-label attributes if needed
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            const translation = this.t(key);
            if (translation && translation !== key) {
                element.setAttribute('aria-label', translation);
            }
        });
        
        // Update document language attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Trigger custom event for auto-translate to run
        window.dispatchEvent(new CustomEvent('i18n-translations-applied', { 
            detail: { language: this.currentLanguage } 
        }));
    },
    
    // Apply RTL direction for Arabic
    applyRTL() {
        const html = document.documentElement;
        const body = document.body;
        
        if (this.currentLanguage === 'ar') {
            html.setAttribute('dir', 'rtl');
            body.classList.add('rtl');
        } else {
            html.setAttribute('dir', 'ltr');
            body.classList.remove('rtl');
        }
    },
    
    // Update language selector UI
    updateLanguageUI() {
        const currentFlag = document.querySelector('.current-flag');
        const currentLangText = document.querySelector('.current-lang-text');
        
        if (currentFlag && currentLangText) {
            if (this.currentLanguage === 'ar') {
                currentFlag.src = 'https://flagcdn.com/w40/sy.png';
                currentFlag.srcset = 'https://flagcdn.com/w80/sy.png 2x';
                currentFlag.alt = 'Syria Flag';
                currentLangText.textContent = 'العربية';
            } else {
                currentFlag.src = 'https://flagcdn.com/w40/us.png';
                currentFlag.srcset = 'https://flagcdn.com/w80/us.png 2x';
                currentFlag.alt = 'USA Flag';
                currentLangText.textContent = 'English';
            }
        }

        // Ensure the dropdown reflects the current language (fixes: wrong item stays active)
        document.querySelectorAll('.lang-option').forEach(btn => {
            const isActive = btn.getAttribute('data-lang') === this.currentLanguage;
            if (isActive) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },
    
    // Setup language switcher event listeners
    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-option');
        
        langButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const lang = button.getAttribute('data-lang');
                
                if (lang !== this.currentLanguage) {
                    await this.switchLanguage(lang);
                }
                
                // Close dropdown after selection
                const dropdown = button.closest('.dropdown-menu');
                if (dropdown) {
                    const bsDropdown = bootstrap.Dropdown.getInstance(
                        button.closest('.dropdown').querySelector('[data-bs-toggle="dropdown"]')
                    );
                    if (bsDropdown) {
                        bsDropdown.hide();
                    }
                }
            });
        });
    },
    
    // Switch to a different language
    async switchLanguage(lang) {
        // Show loading state
        document.body.style.opacity = '0.7';
        
        await this.loadTranslations(lang);
        this.applyTranslations();
        this.updateLanguageUI();
        this.applyRTL();
        
        // Update active state in dropdown
        document.querySelectorAll('.lang-option').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Restore opacity
        document.body.style.opacity = '1';
        
        // Reinitialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        console.log(`Language switched to: ${lang}`);
    }
};

// Initialize i18n when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Export for use in other scripts
window.i18n = i18n;
