import { createContext, useContext, useEffect, useState } from 'react'
import { FRANCHISE_TR } from './data/franchiseTranslations.js'
import { SERVICE_TR } from './data/serviceTranslations.js'
import { EXTRA_TR } from './data/extraTranslations.js'
import { LEAD_TR } from './data/leadTranslations.js'
import { FAQ_TR } from './data/faqTranslations.js'
import { BRANCH_TR } from './data/branchTranslations.js'
import { COMPOSITION_TR } from './data/compositionTranslations.js'

// Main-site UI strings. Keys are the Russian source text.
const MAIN_TR = {
  ru: {},
  kk: {
    // nav
    'Филиалы': 'Филиалдар', 'О спа': 'Спа туралы', 'О BuddhaSpa': 'BuddhaSpa туралы', 'О нас': 'Біз туралы', 'Гостям': 'Қонақтарға',
    'Франшиза': 'Франшиза', 'Контакты': 'Байланыс', 'Записаться': 'Жазылу',
    'Эконом': 'Эконом', 'Навигация': 'Навигация', 'Главная': 'Басты бет',
    'Шымкент': 'Шымкент', 'Тараз': 'Тараз', 'Астана': 'Астана', 'Актобе': 'Ақтөбе',
    // hero
    'Тайский спа · Казахстан': 'Тай спа · Қазақстан',
    'Тайский массаж': 'Тай массажы', 'и уход': 'және дене', 'за телом': 'күтімі',
    'Порадуйте себя и своих близких — Buddha Spa встречает вас теплом подлинной тайской традиции.':
      'Өзіңізді және жақындарыңызды қуантыңыз — Buddha Spa сізді нағыз тай дәстүрінің жылуымен қарсы алады.',
    'Выбрать филиал': 'Филиал таңдау', 'Записаться на спа': 'Спаға жазылу',
    'Записаться в BuddhaSpa': 'BuddhaSpa-ға жазылу',
    // branch selector
    'Наши адреса': 'Мекенжайларымыз',
    'Выберите удобный для вас филиал': 'Өзіңізге ыңғайлы филиалды таңдаңыз',
    'Сеть спа-салонов в городах Казахстана — в каждом та же тайская забота, приветливые мастера и спокойная атмосфера.':
      'Қазақстан қалаларындағы спа-салондар желісі — әрқайсында сол тай қамқорлығы, ілтипатты шеберлер және тыныш атмосфера.',
    'Перейти': 'Өту',
    'Топ-3 программы': 'Топ-3 бағдарлама', 'Полное меню и запись': 'Толық мәзір және жазылу',
    // about
    'О бренде': 'Бренд туралы', 'Подробнее о нас': 'Біз туралы толығырақ',
    'Интерьер зоны отдыха': 'Демалыс аймағының интерьері',
    'Забота, которая стала сетью спа-салонов': 'Спа-салондар желісіне айналған қамқорлық',
    'BuddhaSpa начинался с одного салона и желания подарить казахстанцам подлинную тайскую традицию заботы о теле. Сегодня это развивающаяся сеть с едиными стандартами сервиса и мастерами из Юго-Восточной Азии в каждом городе.':
      'BuddhaSpa бір салоннан және қазақстандықтарға нағыз тай дене күтімі дәстүрін сыйлау тілегінен басталды. Бүгінде бұл бірыңғай сервис стандарттары мен әр қаладағы Оңтүстік-Шығыс Азия шеберлері бар дамып келе жатқан желі.',
    'города Казахстана': 'Қазақстан қаласы', 'лет на рынке': 'жыл нарықта',
    'клиентов в сети': 'желі клиенттері', 'мастера из Таиланда и Индонезии': 'Таиланд пен Индонезия шеберлері',
    'Роскошь для души и тела': 'Жан мен тәнге арналған сән-салтанат',
    'Большой спа-салон тайского массажа и ухода за собой': 'Тай массажы мен өзін-өзі күтуге арналған үлкен спа-салон',
    // benefits
    'Почему Buddha Spa — лучшая идея': 'Неліктен Buddha Spa — ең жақсы идея',
    'Три момента вашего визита': 'Сіздің сапарыңыздың үш сәті',
    'Как проходит ваш визит': 'Сапарыңыз қалай өтеді',
    'Тёплая встреча': 'Жылы қарсы алу',
    'Чай и настрой': 'Шай және көңіл-күй',
    'Вы устроитесь в уютной чайной зоне, выдохнете и настроитесь на отдых перед процедурой.':
      'Жайлы шай аймағында орналасып, дем алып, процедура алдында демалуға бейімделесіз.',
    'Мастера своего дела': 'Өз ісінің шеберлері',
    'Ритуал заботы': 'Қамқорлық рәсімі',
    'Мастера проведут выбранную программу — прогрев, массаж и уход по тайским традициям.':
      'Шеберлер таңдалған бағдарламаны өткізеді — жылыту, массаж және тай дәстүрі бойынша күтім.',
    'Заряд энергии': 'Қуат сыйы',
    // guest info
    'Информация для наших гостей': 'Қонақтарымызға арналған ақпарат',
    'Перед визитом в Buddha Spa': 'Buddha Spa-ға келер алдында',
    'Предварительная запись': 'Алдын ала жазылу',
    'Что нужно взять с собой': 'Өзіңізбен не алу керек',
    'Забота о себе': 'Өзіңізге қамқорлық',
    'Перенос и опоздание': 'Ауыстыру және кешігу',
    'Оплата и сертификаты': 'Төлем және сертификаттар',
    // about (home)
    'Buddha Spa объединяет оздоровительные массажи, программы для релаксации, спа-ритуалы для похудения и пилинги для тонуса кожи — услуги на любой вкус в одном месте.':
      'Buddha Spa сауықтыру массаждарын, релаксация бағдарламаларын, арықтауға арналған спа-рәсімдер мен тері тонусына арналған пилингтерді біріктіреді — бір орында әр талғамға арналған қызметтер.',
    'Вас встретят приветливые сотрудники и предложат чай или воду. Вы познакомитесь с опытными массажистами — мастерами своего дела — и почувствуете заряд энергии благодаря их уникальной технике.':
      'Сізді ілтипатты қызметкерлер қарсы алып, шай немесе су ұсынады. Сіз өз ісінің шеберлері — тәжірибелі массажистермен танысып, олардың ерекше техникасының арқасында қуат аласыз.',
    // guest benefits (branch aside "Вас ждёт")
    'Укрепление иммунитета': 'Иммунитетті нығайту',
    'Нормализация лимфотока вашего тела': 'Дене лимфа ағымын қалпына келтіру',
    'Релаксация мышечной системы': 'Бұлшықет жүйесін демалдыру',
    'Повышение качества сна': 'Ұйқы сапасын арттыру',
    'Повышение упругости и эластичности кожи': 'Тері серпімділігі мен икемділігін арттыру',
    // misc
    'Меню': 'Мәзір',
    'Договор публичной оферты': 'Жария оферта шарты',
    'Политика в отношении обработки персональных данных': 'Дербес деректерді өңдеу саясаты',
    // branch page
    'Все филиалы': 'Барлық филиалдар', 'О филиале': 'Филиал туралы',
    'Режим работы:': 'Жұмыс режимі:', 'Режим работы': 'Жұмыс режимі',
    'Наши мастера из Азии': 'Азиядан келген шеберлеріміз', 'Фото салона': 'Салон фотосы',
    'Вас ждёт': 'Сізді күтеді', 'Адрес': 'Мекенжай', 'Открыть на карте': 'Картадан ашу',
    'Записаться в WhatsApp': 'WhatsApp арқылы жазылу', 'Меню услуг': 'Қызметтер мәзірі',
    'Прайс-лист': 'Прайс-парақ',
    'Цены указаны в тенге. Актуальную стоимость и наличие программ уточняйте при записи — мы поможем подобрать процедуру под ваш запрос.':
      'Бағалар теңгемен көрсетілген. Нақты құн мен бағдарламалардың бар-жоғын жазылу кезінде нақтылаңыз — сұранысыңызға сай процедураны таңдауға көмектесеміз.',
    // footer
    'Остались вопросы?': 'Сұрақтарыңыз бар ма?',
    'Наши специалисты помогут с ответом': 'Мамандарымыз жауап беруге көмектеседі',
    'Часто задаваемые вопросы': 'Жиі қойылатын сұрақтар',
    'Собрали ответы на самые популярные вопросы. Не нашли нужный — напишите нам, и мы поможем.':
      'Ең танымал сұрақтарға жауап жинадық. Қажеттісін таппасаңыз — бізге жазыңыз, көмектесеміз.',
    'Ежедневно с 11:00 до 23:00': 'Күн сайын 11:00-ден 23:00-ге дейін',
    'Информация': 'Ақпарат', 'Оферта СПА': 'СПА офертасы',
    'Оферта': 'Оферта', 'Правила СПА': 'СПА ережелері', 'Платежи': 'Төлемдер',
    'Политика конфиденциальности': 'Құпиялылық саясаты',
    'Все права защищены.': 'Барлық құқықтар қорғалған.',
    'Сеть тайских спа-салонов в городах Казахстана. Гармония тела и души в каждой процедуре.':
      'Қазақстан қалаларындағы тай спа-салондар желісі. Әр процедурада дене мен жанның үйлесімі.',
    'Тайский массаж и уход за телом в спа-салоне.': 'Спа-салондағы тай массажы және дене күтімі.',
    // branch page
    'Подарок': 'Сыйлық', 'Подарочный сертификат': 'Сыйлық сертификаты',
    'Оформить сертификат': 'Сертификат рәсімдеу', 'Выгода': 'Тиімділік',
    'Годовой абонемент': 'Жылдық абонемент', 'Смотреть абонементы': 'Абонементтерді көру',
    'Универсальный подарок для близких и коллег — сертификат действует на все услуги салона Buddha Spa. Выберите номинал и подарите заботу.':
      'Жақындар мен әріптестерге әмбебап сыйлық — сертификат Buddha Spa салонының барлық қызметіне жарамды. Номиналды таңдап, қамқорлық сыйлаңыз.',
    'С годовым абонементом вы наслаждаетесь массажем и спа-ритуалами чаще и заметно выгоднее. Silver, Gold и Platinum — на выбор.':
      'Жылдық абонементпен массаж бен спа-рәсімдерді жиірек әрі әлдеқайда тиімді қабылдайсыз. Silver, Gold және Platinum — таңдауыңызға.',
    'Выберите массаж': 'Массажды таңдаңыз',
    'Подберём программу под ваш запрос': 'Сұранысыңызға сай бағдарлама таңдаймыз',
    'Мы собрали лучшие массажи и спа-программы по целям — выберите настроение, а остальное доверьте нашим мастерам.':
      'Ең үздік массаж бен спа-бағдарламаларды мақсат бойынша жинадық — көңіл күйіңізді таңдаңыз, қалғанын шеберлерімізге сеніп тапсырыңыз.',
    'Подобрать': 'Таңдау', 'от': 'бастап',
    'Расслабление': 'Демалу', 'Энергия и бодрость': 'Қуат пен сергектік',
    'Стройность, тонус и рельеф': 'Сымбат, тонус және рельеф',
    'Программы для 2-х': 'Екеуге арналған бағдарламалар',
    'Спа для беременных': 'Жүкті әйелдерге арналған спа', 'Для всей семьи': 'Бүкіл отбасыға',
    'Spa-программы': 'Spa-бағдарламалар', 'Spa-процедуры': 'Spa-процедуралар', 'Массажные процедуры': 'Массаж процедуралары',
    'Абонементы': 'Абонементтер', 'Спа-ритуалы — чаще и выгоднее': 'Спа-рәсімдер — жиірек әрі тиімдірек',
    'Оформить': 'Рәсімдеу', 'год': 'жыл',
  },
  en: {
    'Филиалы': 'Locations', 'О спа': 'About', 'О BuddhaSpa': 'About BuddhaSpa', 'О нас': 'About us', 'Гостям': 'Guests',
    'Франшиза': 'Franchise', 'Контакты': 'Contacts', 'Записаться': 'Book now',
    'Эконом': 'Economy', 'Навигация': 'Navigation', 'Главная': 'Home',
    'Шымкент': 'Shymkent', 'Тараз': 'Taraz', 'Астана': 'Astana', 'Актобе': 'Aktobe',
    'Тайский спа · Казахстан': 'Thai spa · Kazakhstan',
    'Тайский массаж': 'Thai massage', 'и уход': 'and body', 'за телом': 'care',
    'Порадуйте себя и своих близких — Buddha Spa встречает вас теплом подлинной тайской традиции.':
      'Treat yourself and your loved ones — Buddha Spa welcomes you with the warmth of authentic Thai tradition.',
    'Выбрать филиал': 'Choose a location', 'Записаться на спа': 'Book a spa session',
    'Записаться в BuddhaSpa': 'Book at BuddhaSpa',
    'Наши адреса': 'Our locations',
    'Выберите удобный для вас филиал': 'Choose the location that suits you',
    'Сеть спа-салонов в городах Казахстана — в каждом та же тайская забота, приветливые мастера и спокойная атмосфера.':
      'A network of spa salons across Kazakhstan — each with the same Thai care, welcoming therapists, and a calm atmosphere.',
    'Перейти': 'View',
    'Топ-3 программы': 'Top-3 programs', 'Полное меню и запись': 'Full menu & booking',
    'О бренде': 'About the brand', 'Подробнее о нас': 'More about us',
    'Интерьер зоны отдыха': 'Relaxation lounge interior',
    'Забота, которая стала сетью спа-салонов': 'The care that grew into a network of spa salons',
    'BuddhaSpa начинался с одного салона и желания подарить казахстанцам подлинную тайскую традицию заботы о теле. Сегодня это развивающаяся сеть с едиными стандартами сервиса и мастерами из Юго-Восточной Азии в каждом городе.':
      'BuddhaSpa began with a single salon and a wish to give Kazakhstan the authentic Thai tradition of body care. Today it is a growing network with unified service standards and therapists from Southeast Asia in every city.',
    'города Казахстана': 'cities in Kazakhstan', 'лет на рынке': 'years on the market',
    'клиентов в сети': 'clients across the network', 'мастера из Таиланда и Индонезии': 'therapists from Thailand & Indonesia',
    'Роскошь для души и тела': 'Luxury for body and soul',
    'Большой спа-салон тайского массажа и ухода за собой': 'A large spa salon of Thai massage and self-care',
    'Почему Buddha Spa — лучшая идея': 'Why Buddha Spa is the best idea',
    'Три момента вашего визита': 'Three moments of your visit',
    'Как проходит ваш визит': 'How your visit unfolds',
    'Тёплая встреча': 'A warm welcome',
    'Чай и настрой': 'Tea and calm',
    'Вы устроитесь в уютной чайной зоне, выдохнете и настроитесь на отдых перед процедурой.':
      'You’ll settle into a cosy tea area, take a breath and tune in to relax before your treatment.',
    'Мастера своего дела': 'True masters of their craft',
    'Ритуал заботы': 'A ritual of care',
    'Мастера проведут выбранную программу — прогрев, массаж и уход по тайским традициям.':
      'Your therapists carry out the chosen program — warming, massage and care in the Thai tradition.',
    'Заряд энергии': 'A boost of energy',
    'Информация для наших гостей': 'Information for our guests',
    'Перед визитом в Buddha Spa': 'Before your visit to Buddha Spa',
    'Предварительная запись': 'Advance booking',
    'Что нужно взять с собой': 'What to bring with you',
    'Забота о себе': 'Taking care of yourself',
    'Перенос и опоздание': 'Rescheduling and lateness',
    'Оплата и сертификаты': 'Payment and certificates',
    // about (home)
    'Buddha Spa объединяет оздоровительные массажи, программы для релаксации, спа-ритуалы для похудения и пилинги для тонуса кожи — услуги на любой вкус в одном месте.':
      'Buddha Spa brings together wellness massages, relaxation programs, slimming spa rituals and skin-toning peels — services for every taste in one place.',
    'Вас встретят приветливые сотрудники и предложат чай или воду. Вы познакомитесь с опытными массажистами — мастерами своего дела — и почувствуете заряд энергии благодаря их уникальной технике.':
      'You’ll be greeted by friendly staff who’ll offer you tea or water. You’ll meet experienced therapists — true masters of their craft — and feel a boost of energy thanks to their unique technique.',
    // guest benefits (branch aside "What awaits you")
    'Укрепление иммунитета': 'Stronger immunity',
    'Нормализация лимфотока вашего тела': 'Balanced lymph flow',
    'Релаксация мышечной системы': 'Muscle relaxation',
    'Повышение качества сна': 'Better sleep quality',
    'Повышение упругости и эластичности кожи': 'Firmer, more elastic skin',
    // misc
    'Меню': 'Menu',
    'Договор публичной оферты': 'Public offer agreement',
    'Политика в отношении обработки персональных данных': 'Personal data processing policy',
    'Все филиалы': 'All locations', 'О филиале': 'About the location',
    'Режим работы:': 'Opening hours:', 'Режим работы': 'Opening hours',
    'Наши мастера из Азии': 'Our therapists from Asia', 'Фото салона': 'Salon photos',
    'Вас ждёт': 'What awaits you', 'Адрес': 'Address', 'Открыть на карте': 'Open on the map',
    'Записаться в WhatsApp': 'Book on WhatsApp', 'Меню услуг': 'Service menu',
    'Прайс-лист': 'Price list',
    'Цены указаны в тенге. Актуальную стоимость и наличие программ уточняйте при записи — мы поможем подобрать процедуру под ваш запрос.':
      'Prices are in tenge. Please confirm the current cost and availability when booking — we will help you choose a treatment for your needs.',
    'Остались вопросы?': 'Have questions?',
    'Наши специалисты помогут с ответом': 'Our specialists will help you',
    'Часто задаваемые вопросы': 'Frequently asked questions',
    'Собрали ответы на самые популярные вопросы. Не нашли нужный — напишите нам, и мы поможем.':
      'We’ve gathered answers to the most common questions. Can’t find yours — message us and we’ll help.',
    'Ежедневно с 11:00 до 23:00': 'Daily from 11:00 to 23:00',
    'Информация': 'Information', 'Оферта СПА': 'SPA offer',
    'Оферта': 'Offer', 'Правила СПА': 'SPA rules', 'Платежи': 'Payments',
    'Политика конфиденциальности': 'Privacy policy',
    'Все права защищены.': 'All rights reserved.',
    'Сеть тайских спа-салонов в городах Казахстана. Гармония тела и души в каждой процедуре.':
      'A network of Thai spa salons across Kazakhstan. Harmony of body and soul in every treatment.',
    'Тайский массаж и уход за телом в спа-салоне.': 'Thai massage and body care at the spa salon.',
    // branch page
    'Подарок': 'Gift', 'Подарочный сертификат': 'Gift certificate',
    'Оформить сертификат': 'Get a certificate', 'Выгода': 'Value',
    'Годовой абонемент': 'Annual membership', 'Смотреть абонементы': 'View memberships',
    'Универсальный подарок для близких и коллег — сертификат действует на все услуги салона Buddha Spa. Выберите номинал и подарите заботу.':
      'A universal gift for loved ones and colleagues — the certificate is valid for all Buddha Spa services. Choose a value and gift some care.',
    'С годовым абонементом вы наслаждаетесь массажем и спа-ритуалами чаще и заметно выгоднее. Silver, Gold и Platinum — на выбор.':
      'With an annual membership you enjoy massages and spa rituals more often and at a much better value. Silver, Gold, and Platinum available.',
    'Выберите массаж': 'Choose your massage',
    'Подберём программу под ваш запрос': 'We’ll match a program to your needs',
    'Мы собрали лучшие массажи и спа-программы по целям — выберите настроение, а остальное доверьте нашим мастерам.':
      'We’ve grouped our best massages and spa programs by goal — pick your mood and leave the rest to our therapists.',
    'Подобрать': 'Explore', 'от': 'from',
    'Расслабление': 'Relaxation', 'Энергия и бодрость': 'Energy & vitality',
    'Стройность, тонус и рельеф': 'Shape, tone & contour',
    'Программы для 2-х': 'Programs for two',
    'Спа для беременных': 'Spa for expecting mothers', 'Для всей семьи': 'For the whole family',
    'Spa-программы': 'Spa programs', 'Spa-процедуры': 'Spa treatments', 'Массажные процедуры': 'Massage treatments',
    'Абонементы': 'Memberships', 'Спа-ритуалы — чаще и выгоднее': 'Spa rituals — more often, better value',
    'Оформить': 'Get started', 'год': 'year',
  },
}

export const LANGS = [
  { code: 'ru', short: 'RU', label: 'Рус' },
  { code: 'kk', short: 'KZ', label: 'Қаз' },
  { code: 'en', short: 'EN', label: 'Eng' },
]

const LangContext = createContext({ lang: 'ru', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('buddha-lang') || 'ru'
    } catch {
      return 'ru'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('buddha-lang', lang)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang === 'kk' ? 'kk' : lang
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

// Enforce the single official brand spelling everywhere in the UI: any of
// "Buddha Spa", "Buddha SPA", "Buddha-spa", "buddha spa" → "BuddhaSpa".
// Applied to every translated/source string at render time so we never have to
// touch the (Russian-keyed) translation dictionaries.
const BRAND_RE = /buddha[\s -]?spa/gi
export function brandName(text) {
  return typeof text === 'string' ? text.replace(BRAND_RE, 'BuddhaSpa') : text
}

// Translate a Russian source string for the current language; falls back to the source.
export function useT() {
  const { lang } = useLang()
  return (text) => {
    if (lang === 'ru') return brandName(text)
    const dict = { ...MAIN_TR[lang], ...(SERVICE_TR[lang] || {}), ...(EXTRA_TR[lang] || {}), ...(FRANCHISE_TR[lang] || {}), ...(LEAD_TR[lang] || {}), ...(FAQ_TR[lang] || {}), ...(BRANCH_TR[lang] || {}), ...(COMPOSITION_TR[lang] || {}) }
    return brandName(dict[text] !== undefined ? dict[text] : text)
  }
}
