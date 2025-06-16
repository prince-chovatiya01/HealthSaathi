// type TranslationKey =
//   | 'home'
//   | 'login'
//   | 'dashboard'
//   | 'symptomChecker'
//   | 'doctors'
//   | 'appointments'
//   | 'healthRecords'
//   | 'medicines'
//   | 'wellness'
//   | 'profile'
//   | 'logout'
//   | 'footerTagline'
//   | 'quickLinks'
//   | 'healthResources'
//   | 'covidResources'
//   | 'mentalHealth'
//   | 'pregnancyCare'
//   | 'childHealth'
//   | 'contactUs'
//   | 'emergencyHelp'
//   | 'allRightsReserved'
//   | 'loginHeader'
//   | 'phoneNumber'
//   | 'enterOTP'
//   | 'submit'
//   | 'verify'
//   | 'welcomeBack'
//   | 'howAreYouFeeling'
//   | 'upcomingAppointments'
//   | 'viewAll'
//   | 'findDoctor'
//   | 'orderMedicines'
//   | 'checkSymptoms'
//   | 'trackHealthMetrics'
//   | 'viewHealthRecords'
//   | 'getWellnessTips'
//   | 'welcomeToHealthSaathi'
//   | 'heroSubtitle'
//   | 'getStarted'
//   | 'ourServices'
//   | 'testimonials'
//   | 'downloadApp'
//   | 'doctorNearYou'
//   | 'search'
//   | 'searchDoctors'
//   | 'specialty'
//   | 'experience'
//   | 'language'
//   | 'rating'
//   | 'bookAppointment'
//   | 'viewProfile'
//   | 'years'
//   | 'and'
//   | 'more';

// type TranslationSet = Record<TranslationKey, string>;

// interface Translations {
//   en: TranslationSet;
//   hi: TranslationSet;
//   bn: TranslationSet;
//   te: TranslationSet;
//   ta: TranslationSet;
//   mr: TranslationSet;
//   gu: TranslationSet;
// }

// const translations: Translations = {
//   en: {
//     home: 'Home',
//     login: 'Login',
//     dashboard: 'Dashboard',
//     symptomChecker: 'Symptom Checker',
//     doctors: 'Find Doctors',
//     appointments: 'My Appointments',
//     healthRecords: 'Health Records',
//     medicines: 'Medicines',
//     wellness: 'Wellness',
//     profile: 'Profile',
//     logout: 'Logout',
//     footerTagline: 'Bringing quality healthcare to rural India through technology',
//     quickLinks: 'Quick Links',
//     healthResources: 'Health Resources',
//     covidResources: 'COVID-19 Resources',
//     mentalHealth: 'Mental Health',
//     pregnancyCare: 'Pregnancy Care',
//     childHealth: 'Child Health',
//     contactUs: 'Contact Us',
//     emergencyHelp: 'Emergency Help',
//     allRightsReserved: 'All Rights Reserved',
//     loginHeader: 'Login to your account',
//     phoneNumber: 'Phone Number',
//     enterOTP: 'Enter OTP',
//     submit: 'Submit',
//     verify: 'Verify',
//     welcomeBack: 'Welcome Back',
//     howAreYouFeeling: 'How are you feeling today?',
//     upcomingAppointments: 'Upcoming Appointments',
//     viewAll: 'View All',
//     findDoctor: 'Find a Doctor',
//     orderMedicines: 'Order Medicines',
//     checkSymptoms: 'Check Symptoms',
//     trackHealthMetrics: 'Track Health Metrics',
//     viewHealthRecords: 'View Health Records',
//     getWellnessTips: 'Get Wellness Tips',
//     welcomeToHealthSaathi: 'Quality Healthcare at Your Fingertips',
//     heroSubtitle: 'Connect with doctors, check symptoms, order medicines, and manage your health records - all in one place.',
//     getStarted: 'Get Started',
//     ourServices: 'Our Services',
//     testimonials: 'Testimonials',
//     downloadApp: 'Download Our App',
//     doctorNearYou: 'Find Doctors Near You',
//     search: 'Search',
//     searchDoctors: 'Search doctors by name, specialty or location',
//     specialty: 'Specialty',
//     experience: 'Experience',
//     language: 'Language',
//     rating: 'Rating',
//     bookAppointment: 'Book Appointment',
//     viewProfile: 'View Profile',
//     years: 'years',
//     and: 'and',
//     more: 'more'
//   },
//   hi: {
//     home: 'होम',
//     login: 'लॉगिन',
//     dashboard: 'डैशबोर्ड',
//     symptomChecker: 'लक्षण जांचक',
//     doctors: 'डॉक्टर खोजें',
//     appointments: 'मेरी अपॉइंटमेंट',
//     healthRecords: 'स्वास्थ्य रिकॉर्ड',
//     medicines: 'दवाइयां',
//     wellness: 'स्वास्थ्य',
//     profile: 'प्रोफाइल',
//     logout: 'लॉगआउट',
//     footerTagline: 'तकनीक के माध्यम से ग्रामीण भारत को गुणवत्तापूर्ण स्वास्थ्य सेवा प्रदान करना',
//     quickLinks: 'त्वरित लिंक',
//     healthResources: 'स्वास्थ्य संसाधन',
//     covidResources: 'कोविड-19 संसाधन',
//     mentalHealth: 'मानसिक स्वास्थ्य',
//     pregnancyCare: 'गर्भावस्था देखभाल',
//     childHealth: 'बाल स्वास्थ्य',
//     contactUs: 'संपर्क करें',
//     emergencyHelp: 'आपातकालीन सहायता',
//     allRightsReserved: 'सर्वाधिकार सुरक्षित',
//     loginHeader: 'अपने खाते में लॉगिन करें',
//     phoneNumber: 'फोन नंबर',
//     enterOTP: 'OTP दर्ज करें',
//     submit: 'सबमिट करें',
//     verify: 'सत्यापित करें',
//     welcomeBack: 'वापसी पर स्वागत है',
//     howAreYouFeeling: 'आज आप कैसा महसूस कर रहे हैं?',
//     upcomingAppointments: 'आगामी अपॉइंटमेंट',
//     viewAll: 'सभी देखें',
//     findDoctor: 'डॉक्टर खोजें',
//     orderMedicines: 'दवाइयां ऑर्डर करें',
//     checkSymptoms: 'लक्षण जांचें',
//     trackHealthMetrics: 'स्वास्थ्य मेट्रिक्स ट्रैक करें',
//     viewHealthRecords: 'स्वास्थ्य रिकॉर्ड देखें',
//     getWellnessTips: 'स्वास्थ्य टिप्स प्राप्त करें',
//     welcomeToHealthSaathi: 'आपकी उंगलियों पर गुणवत्तापूर्ण स्वास्थ्य देखभाल',
//     heroSubtitle: 'डॉक्टरों से जुड़ें, लक्षण जांचें, दवाइयां ऑर्डर करें और अपने स्वास्थ्य रिकॉर्ड प्रबंधित करें - सब एक ही जगह पर।',
//     getStarted: 'शुरू करें',
//     ourServices: 'हमारी सेवाएँ',
//     testimonials: 'प्रशंसापत्र',
//     downloadApp: 'हमारा ऐप डाउनलोड करें',
//     doctorNearYou: 'आपके पास डॉक्टर खोजें',
//     search: 'खोज',
//     searchDoctors: 'नाम, विशेषज्ञता या स्थान से डॉक्टर खोजें',
//     specialty: 'विशेषज्ञता',
//     experience: 'अनुभव',
//     language: 'भाषा',
//     rating: 'रेटिंग',
//     bookAppointment: 'अपॉइंटमेंट बुक करें',
//     viewProfile: 'प्रोफाइल देखें',
//     years: 'वर्ष',
//     and: 'और',
//     more: 'अधिक'
//   },
//   bn: {
//     home: 'হোম',
//     login: 'লগইন',
//     dashboard: 'ড্যাশবোর্ড',
//     symptomChecker: 'লক্ষণ চেকার',
//     doctors: 'ডাক্তার খুঁজুন',
//     appointments: 'আমার অ্যাপয়েন্টমেন্ট',
//     healthRecords: 'স্বাস্থ্য রেকর্ড',
//     medicines: 'ওষুধ',
//     wellness: 'সুস্থতা',
//     profile: 'প্রোফাইল',
//     logout: 'লগআউট',
//     footerTagline: 'প্রযুক্তির মাধ্যমে গ্রামীণ ভারতে মানসম্পন্ন স্বাস্থ্যসেবা নিয়ে আসা',
//     quickLinks: 'দ্রুত লিঙ্ক',
//     healthResources: 'স্বাস্থ্য সম্পদ',
//     covidResources: 'কোভিড-১৯ সম্পদ',
//     mentalHealth: 'মানসিক স্বাস্থ্য',
//     pregnancyCare: 'গর্ভাবস্থার যত্ন',
//     childHealth: 'শিশু স্বাস্থ্য',
//     contactUs: 'যোগাযোগ করুন',
//     emergencyHelp: 'জরুরি সাহায্য',
//     allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত',
//     loginHeader: 'আপনার অ্যাকাউন্টে লগইন করুন',
//     phoneNumber: 'ফোন নম্বর',
//     enterOTP: 'OTP লিখুন',
//     submit: 'জমা দিন',
//     verify: 'যাচাই করুন',
//     welcomeBack: 'ফিরে আসার জন্য স্বাগতম',
//     howAreYouFeeling: 'আজ আপনি কেমন বোধ করছেন?',
//     upcomingAppointments: 'আসন্ন অ্যাপয়েন্টমেন্ট',
//     viewAll: 'সব দেখুন',
//     findDoctor: 'ডাক্তার খুঁজুন',
//     orderMedicines: 'ওষুধ অর্ডার করুন',
//     checkSymptoms: 'লক্ষণ চেক করুন',
//     trackHealthMetrics: 'স্বাস্থ্য মেট্রিক্স ট্র্যাক করুন',
//     viewHealthRecords: 'স্বাস্থ্য রেকর্ড দেখুন',
//     getWellnessTips: 'সুস্থতার টিপস পান',
//     welcomeToHealthSaathi: 'আপনার আঙ্গুলের ডগায় মানসম্পন্ন স্বাস্থ্যসেবা',
//     heroSubtitle: 'ডাক্তারদের সাথে যোগাযোগ করুন, লক্ষণ চেক করুন, ওষুধ অর্ডার করুন এবং আপনার স্বাস্থ্য রেকর্ড পরিচালনা করুন - সবকিছু একজায়গায়।',
//     getStarted: 'শুরু করুন',
//     ourServices: 'আমাদের সেবা',
//     testimonials: 'প্রশংসাপত্র',
//     downloadApp: 'আমাদের অ্যাপ ডাউনলোড করুন',
//     doctorNearYou: 'আপনার কাছে ডাক্তার খুঁজুন',
//     search: 'অনুসন্ধান',
//     searchDoctors: 'নাম, বিশেষজ্ঞতা বা অবস্থান দ্বারা ডাক্তার খুঁজুন',
//     specialty: 'বিশেষজ্ঞতা',
//     experience: 'অভিজ্ঞতা',
//     language: 'ভাষা',
//     rating: 'রেটিং',
//     bookAppointment: 'অ্যাপয়েন্টমেন্ট বুক করুন',
//     viewProfile: 'প্রোফাইল দেখুন',
//     years: 'বছর',
//     and: 'এবং',
//     more: 'আরও'
//   },
//   te: {
//     home: 'హోమ్',
//     login: 'లాగిన్',
//     dashboard: 'డాష్‌బోర్డ్',
//     symptomChecker: 'లక్షణాల చెకర్',
//     doctors: 'వైద్యులను కనుగొనండి',
//     appointments: 'నా అపాయింట్మెంట్లు',
//     healthRecords: 'ఆరోగ్య రికార్డులు',
//     medicines: 'మందులు',
//     wellness: 'ఆరోగ్యం',
//     profile: 'ప్రొఫైల్',
//     logout: 'లాగ్అవుట్',
//     footerTagline: 'టెక్నాలజీ ద్వారా గ్రామీణ భారతదేశానికి నాణ్యమైన ఆరోగ్య సంరక్షణను అందిస్తుంది',
//     quickLinks: 'త్వరిత లింకులు',
//     healthResources: 'ఆరోగ్య వనరులు',
//     covidResources: 'కోవిడ్-19 వనరులు',
//     mentalHealth: 'మానసిక ఆరోగ్యం',
//     pregnancyCare: 'గర్భధారణ సంరక్షణ',
//     childHealth: 'పిల్లల ఆరోగ్యం',
//     contactUs: 'మమ్మల్ని సంప్రదించండి',
//     emergencyHelp: 'అత్యవసర సహాయం',
//     allRightsReserved: 'అన్ని హక్కులు మరియు ప్రత్యేకాధికారాలు',
//     loginHeader: 'మీ ఖాతాకు లాగిన్ చేయండి',
//     phoneNumber: 'ఫోన్ నంబర్',
//     enterOTP: 'OTP ని నమోదు చేయండి',
//     submit: 'సమర్పించండి',
//     verify: 'ధృవీకరించండి',
//     welcomeBack: 'తిరిగి స్వాగతం',
//     howAreYouFeeling: 'ఈరోజు మీరు ఎలా అనుభవిస్తున్నారు?',
//     upcomingAppointments: 'రాబోయే అపాయింట్మెంట్లు',
//     viewAll: 'అన్నీ చూడండి',
//     findDoctor: 'వైద్యుడిని కనుగొనండి',
//     orderMedicines: 'మందులు ఆర్డర్ చేయండి',
//     checkSymptoms: 'లక్షణాలను తనిఖీ చేయండి',
//     trackHealthMetrics: 'ఆరోగ్య మెట్రిక్స్‌ను ట్రాక్ చేయండి',
//     viewHealthRecords: 'ఆరోగ్య రికార్డులను చూడండి',
//     getWellnessTips: 'ఆరోగ్య చిట్కాలు పొందండి',
//     welcomeToHealthSaathi: 'మీ వేలికొనల వద్ద నాణ్యమైన ఆరోగ్య సంరక్షణ',
//     heroSubtitle: 'వైద్యులతో కనెక్ట్ అవ్వండి, లక్షణాలను తనిఖీ చేయండి, మందులను ఆర్డర్ చేయండి మరియు మీ ఆరోగ్య రికార్డులను నిర్వహించండి - అన్నీ ఒకే చోట.',
//     getStarted: 'ప్రారంభించండి',
//     ourServices: 'మా సేవలు',
//     testimonials: 'వాడుకరుల అభిప్రాయాలు',
//     downloadApp: 'మా యాప్ డౌన్‌లోడ్ చేయండి',
//     doctorNearYou: 'మీ దగ్గర వైద్యులను కనుగొనండి',
//     search: 'శోధన',
//     searchDoctors: 'పేరు, ప్రత్యేకత లేదా స్థానం ద్వారా వైద్యులను శోధించండి',
//     specialty: 'ప్రత్యేకత',
//     experience: 'అనుభవం',
//     language: 'భాష',
//     rating: 'రేటింగ్',
//     bookAppointment: 'అపాయింట్మెంట్ బుక్ చేయండి',
//     viewProfile: 'ప్రొఫైల్ చూడండి',
//     years: 'సంవత్సరాలు',
//     and: 'మరియు',
//     more: 'మరింత'
//   },
//   ta: {
//     home: 'முகப்பு',
//     login: 'உள்நுழைய',
//     dashboard: 'டாஷ்போர்டு',
//     symptomChecker: 'அறிகுறி சரிபார்ப்பி',
//     doctors: 'மருத்துவர்களைக் கண்டறிக',
//     appointments: 'எனது சந்திப்புகள்',
//     healthRecords: 'சுகாதார பதிவுகள்',
//     medicines: 'மருந்துகள்',
//     wellness: 'நலன்',
//     profile: 'சுயவிவரம்',
//     logout: 'வெளியேறு',
//     footerTagline: 'தொழில்நுட்பத்தின் மூலம் கிராமப்புற இந்தியாவிற்கு தரமான சுகாதார சேவைகளைக் கொண்டு வருகிறது',
//     quickLinks: 'விரைவு இணைப்புகள்',
//     healthResources: 'சுகாதார வளங்கள்',
//     covidResources: 'கோவிட்-19 வளங்கள்',
//     mentalHealth: 'மன நலம்',
//     pregnancyCare: 'கர்ப்ப காலப் பராமரிப்பு',
//     childHealth: 'குழந்தை நலம்',
//     contactUs: 'எங்களை தொடர்புகொள்ள',
//     emergencyHelp: 'அவசர உதவி',
//     allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை',
//     loginHeader: 'உங்கள் கணக்கில் உள்நுழையவும்',
//     phoneNumber: 'தொலைபேசி எண்',
//     enterOTP: 'OTP ஐ உள்ளிடவும்',
//     submit: 'சமர்ப்பி',
//     verify: 'சரிபார்க்க',
//     welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
//     howAreYouFeeling: 'இன்று நீங்கள் எப்படி உணருகிறீர்கள்?',
//     upcomingAppointments: 'வரவிருக்கும் சந்திப்புகள்',
//     viewAll: 'அனைத்தையும் காண',
//     findDoctor: 'மருத்துவரை கண்டறிக',
//     orderMedicines: 'மருந்துகளை ஆர்டர் செய்க',
//     checkSymptoms: 'அறிகுறிகளை சரிபார்க்க',
//     trackHealthMetrics: 'சுகாதார அளவீடுகளைக் கண்காணிக்க',
//     viewHealthRecords: 'சுகாதார பதிவுகளைக் காண',
//     getWellnessTips: 'நல குறிப்புகளைப் பெறுக',
//     welcomeToHealthSaathi: 'உங்கள் விரல்களில் தரமான சுகாதார பராமரிப்பு',
//     heroSubtitle: 'மருத்துவர்களுடன் இணைக, அறிகுறிகளை சரிபார்க்க, மருந்துகளை ஆர்டர் செய்க, மற்றும் உங்கள் சுகாதார பதிவுகளை நிர்வகிக்க - அனைத்தும் ஒரே இடத்தில்.',
//     getStarted: 'தொடங்குங்கள்',
//     ourServices: 'எங்கள் சேவைகள்',
//     testimonials: 'பயனர் கருத்துகள்',
//     downloadApp: 'எங்கள் செயலியைப் பதிவிறக்குக',
//     doctorNearYou: 'உங்களுக்கு அருகில் மருத்துவர்களைக் கண்டறிக',
//     search: 'தேடல்',
//     searchDoctors: 'பெயர், சிறப்புத்துவம் அல்லது இருப்பிடம் மூலம் மருத்துவர்களைத் தேடுங்கள்',
//     specialty: 'சிறப்புத்துவம்',
//     experience: 'அனுபவம்',
//     language: 'மொழி',
//     rating: 'மதிப்பீடு',
//     bookAppointment: 'சந்திப்பைப் பதிவு செய்க',
//     viewProfile: 'சுயவிவரத்தைக் காண',
//     years: 'ஆண்டுகள்',
//     and: 'மற்றும்',
//     more: 'மேலும்'
//   },
//   mr: {
//     home: 'होम',
//     login: 'लॉगिन',
//     dashboard: 'डॅशबोर्ड',
//     symptomChecker: 'लक्षण तपासक',
//     doctors: 'डॉक्टर शोधा',
//     appointments: 'माझी अपॉइंटमेंट',
//     healthRecords: 'आरोग्य रेकॉर्ड',
//     medicines: 'औषधे',
//     wellness: 'आरोग्य',
//     profile: 'प्रोफाइल',
//     logout: 'लॉगआउट',
//     footerTagline: 'तंत्रज्ञानाद्वारे ग्रामीण भारतात दर्जेदार आरोग्य सेवा आणणे',
//     quickLinks: 'क्विक लिंक्स',
//     healthResources: 'आरोग्य संसाधने',
//     covidResources: 'कोविड-19 संसाधने',
//     mentalHealth: 'मानसिक आरोग्य',
//     pregnancyCare: 'गरोदरपणाची काळजी',
//     childHealth: 'बाल आरोग्य',
//     contactUs: 'संपर्क करा',
//     emergencyHelp: 'आणीबाणी मदत',
//     allRightsReserved: 'सर्व हक्क राखीव',
//     loginHeader: 'आपल्या खात्यात लॉग इन करा',
//     phoneNumber: 'फोन नंबर',
//     enterOTP: 'OTP प्रविष्ट करा',
//     submit: 'सबमिट करा',
//     verify: 'सत्यापित करा',
//     welcomeBack: 'पुन्हा स्वागत आहे',
//     howAreYouFeeling: 'आज तुम्ही कसे वाटते?',
//     upcomingAppointments: 'आगामी अपॉइंटमेंट',
//     viewAll: 'सर्व पहा',
//     findDoctor: 'डॉक्टर शोधा',
//     orderMedicines: 'औषधे ऑर्डर करा',
//     checkSymptoms: 'लक्षणे तपासा',
//     trackHealthMetrics: 'आरोग्य मेट्रिक्स ट्रॅक करा',
//     viewHealthRecords: 'आरोग्य रेकॉर्ड पहा',
//     getWellnessTips: 'आरोग्य टिप्स मिळवा',
//     welcomeToHealthSaathi: 'तुमच्या बोटांवर दर्जेदार आरोग्य सेवा',
//     heroSubtitle: 'डॉक्टरांशी कनेक्ट करा, लक्षणे तपासा, औषधे ऑर्डर करा आणि तुमचे आरोग्य रेकॉर्ड व्यवस्थापित करा - सर्व एकाच ठिकाणी.',
//     getStarted: 'सुरू करा',
//     ourServices: 'आमच्या सेवा',
//     testimonials: 'अभिप्राय',
//     downloadApp: 'आमचे अॅप डाउनलोड करा',
//     doctorNearYou: 'तुमच्या जवळील डॉक्टर शोधा',
//     search: 'शोध',
//     searchDoctors: 'नाव, विशेषज्ञता किंवा स्थानानुसार डॉक्टर शोधा',
//     specialty: 'विशेषज्ञता',
//     experience: 'अनुभव',
//     language: 'भाषा',
//     rating: 'रेटिंग',
//     bookAppointment: 'अपॉइंटमेंट बुक करा',
//     viewProfile: 'प्रोफाइल पहा',
//     years: 'वर्षे',
//     and: 'आणि',
//     more: 'अधिक'
//   },
//   gu: {
//     home: 'હોમ',
//     login: 'લોગિન',
//     dashboard: 'ડેશબોર્ડ',
//     symptomChecker: 'લક્ષણ ચેકર',
//     doctors: 'ડૉક્ટરો શોધો',
//     appointments: 'મારી એપોઇન્ટમેન્ટ',
//     healthRecords: 'આરોગ્ય રેકોર્ડ્સ',
//     medicines: 'દવાઓ',
//     wellness: 'સ્વાસ્થ્ય',
//     profile: 'પ્રોફાઇલ',
//     logout: 'લોગઆઉટ',
//     footerTagline: 'ટેકનોલોજી દ્વારા ગ્રામીણ ભારતમાં ગુણવત્તાયુક્ત આરોગ્ય સંભાળ લાવવી',
//     quickLinks: 'ઝડપી લિંક્સ',
//     healthResources: 'આરોગ્ય સંસાધનો',
//     covidResources: 'કોવિડ-19 સંસાધનો',
//     mentalHealth: 'માનસિક સ્વાસ્થ્ય',
//     pregnancyCare: 'ગર્ભાવસ્થા કાળજી',
//     childHealth: 'બાળ આરોગ્ય',
//     contactUs: 'અમારો સંપર્ક કરો',
//     emergencyHelp: 'કટોકટી સહાય',
//     allRightsReserved: 'બધા અધિકારો સુરક્ષિત',
//     loginHeader: 'તમારા એકાઉન્ટમાં લોગિન કરો',
//     phoneNumber: 'ફોન નંબર',
//     enterOTP: 'OTP દાખલ કરો',
//     submit: 'સબમિટ કરો',
//     verify: 'ચકાસો',
//     welcomeBack: 'પાછા આવવા પર આપનું સ્વાગત છે',
//     howAreYouFeeling: 'આજે તમે કેવું અનુભવો છો?',
//     upcomingAppointments: 'આગામી એપોઇન્ટમેન્ટ',
//     viewAll: 'બધા જુઓ',
//     findDoctor: 'ડૉક્ટર શોધો',
//     orderMedicines: 'દવાઓ ઓર્ડર કરો',
//     checkSymptoms: 'લક્ષણો તપાસો',
//     trackHealthMetrics: 'આરોગ્ય મેટ્રિક્સ ટ્રેક કરો',
//     viewHealthRecords: 'આરોગ્ય રેકોર્ડ્સ જુઓ',
//     getWellnessTips: 'સ્વાસ્થ્ય ટિપ્સ મેળવો',
//     welcomeToHealthSaathi: 'તમારી આંગળીઓ પર ગુણવત્તાયુક્ત આરોગ્ય સંભાળ',
//     heroSubtitle: 'ડૉક્ટરો સાથે જોડાઓ, લક્ષણો તપાસો, દવાઓ ઓર્ડર કરો અને તમારા આરોગ્ય રેકોર્ડ્સ મેનેજ કરો - બધું એક જ જગ્યાએ.',
//     getStarted: 'શરૂ કરો',
//     ourServices: 'અમારી સેવાઓ',
//     testimonials: 'ટેસ્ટિમોનિયલ્સ',
//     downloadApp: 'અમારી એપ ડાઉનલોડ કરો',
//     doctorNearYou: 'તમારી નજીકના ડૉક્ટરો શોધો',
//     search: 'શોધ',
//     searchDoctors: 'નામ, વિશેષતા અથવા સ્થાન દ્વારા ડૉક્ટરો શોધો',
//     specialty: 'વિશેષતા',
//     experience: 'અનુભવ',
//     language: 'ભાષા',
//     rating: 'રેટિંગ',
//     bookAppointment: 'એપોઇન્ટમેન્ટ બુક કરો',
//     viewProfile: 'પ્રોફાઇલ જુઓ',
//     years: 'વર્ષ',
//     and: 'અને',
//     more: 'વધુ'
//   }
// };

// export default translations;




export type Language = 'en'; // add more languages here as you implement

export type Translations = {
  name: string;
  signupHeader: string;
  home: string;
  login: string;
  dashboard: string;
  symptomChecker: string;
  doctors: string;
  appointments: string;
  healthRecords: string;
  medicines: string;
  wellness: string;
  profile: string;
  logout: string;
  footerTagline: string;
  quickLinks: string;
  healthResources: string;
  covidResources: string;
  mentalHealth: string;
  pregnancyCare: string;
  childHealth: string;
  contactUs: string;
  emergencyHelp: string;
  allRightsReserved: string;
  loginHeader: string;
  phoneNumber: string;
  enterOTP: string;
  submit: string;
  verify: string;
  welcomeBack: string;
  howAreYouFeeling: string;
  upcomingAppointments: string;
  viewAll: string;
  findDoctor: string;
  orderMedicines: string;
  checkSymptoms: string;
  trackHealthMetrics: string;
  viewHealthRecords: string;
  getWellnessTips: string;
  welcomeToHealthSaathi: string;
  heroSubtitle: string;
  getStarted: string;
  ourServices: string;
  testimonials: string;
  downloadApp: string;
  doctorNearYou: string;
  search: string;
  searchDoctors: string;
  specialty: string;
  experience: string;
  language: string;
  rating: string;
  bookAppointment: string;
  viewProfile: string;
  years: string;
  and: string;
  more: string;
};

export const translations: Record<Language, Translations> = {
  en: {
    name: "Name",
    signupHeader: "Create Account",
    home: 'Home',
    login: 'Login',
    dashboard: 'Dashboard',
    symptomChecker: 'Symptom Checker',
    doctors: 'Find Doctors',
    appointments: 'My Appointments',
    healthRecords: 'Health Records',
    medicines: 'Medicines',
    wellness: 'Wellness',
    profile: 'Profile',
    logout: 'Logout',
    footerTagline: 'Bringing quality healthcare to rural India through technology',
    quickLinks: 'Quick Links',
    healthResources: 'Health Resources',
    covidResources: 'COVID-19 Resources',
    mentalHealth: 'Mental Health',
    pregnancyCare: 'Pregnancy Care',
    childHealth: 'Child Health',
    contactUs: 'Contact Us',
    emergencyHelp: 'Emergency Help',
    allRightsReserved: 'All Rights Reserved',
    loginHeader: 'Login to your account',
    phoneNumber: 'Phone Number',
    enterOTP: 'Enter OTP',
    submit: 'Submit',
    verify: 'Verify',
    welcomeBack: 'Welcome Back',
    howAreYouFeeling: 'How are you feeling today?',
    upcomingAppointments: 'Upcoming Appointments',
    viewAll: 'View All',
    findDoctor: 'Find a Doctor',
    orderMedicines: 'Order Medicines',
    checkSymptoms: 'Check Symptoms',
    trackHealthMetrics: 'Track Health Metrics',
    viewHealthRecords: 'View Health Records',
    getWellnessTips: 'Get Wellness Tips',
    welcomeToHealthSaathi: 'Quality Healthcare at Your Fingertips',
    heroSubtitle: 'Connect with doctors, check symptoms, order medicines, and manage your health records - all in one place.',
    getStarted: 'Get Started',
    ourServices: 'Our Services',
    testimonials: 'Testimonials',
    downloadApp: 'Download Our App',
    doctorNearYou: 'Find Doctors Near You',
    search: 'Search',
    searchDoctors: 'Search doctors by name, specialty or location',
    specialty: 'Specialty',
    experience: 'Experience',
    language: 'Language',
    rating: 'Rating',
    bookAppointment: 'Book Appointment',
    viewProfile: 'View Profile',
    years: 'years',
    and: 'and',
    more: 'more',
  },
  // Add other languages here, e.g.
  // hi: { ... } 
};

export default translations;
