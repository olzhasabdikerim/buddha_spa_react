import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang, useT, LANGS } from '../i18n.jsx'
import LegalModal from './LegalModal.jsx'
import Footer from './Footer.jsx'
import { applyFranchiseSeo } from '../lib/seo.js'
import { EditableText, EditorModal } from './EditableText.jsx'
import { useEditMode } from '../contexts/EditModeContext.jsx'
import { useContentContext } from '../contexts/ContentContext.jsx'
import '../franchise.css'

// Images downloaded from the Tilda CDN into public/images/franchise/lp.
const LP = '/images/franchise/lp/'
const IMG = {
  hero: LP + 'hero.jpg',
  phil: LP + 'philosophy.jpg',
  imm: LP + 'immersive.jpg',
  f1: LP + 'immersive.jpg',            // CTA background — как на живом (DSC_7087-2)
  f2: LP + 'format-franchise.png',     // карточка «Франшиза» — как на живом
  fPartner: LP + 'format-partner.jpg', // карточка «Партнёр» — как на живом

  m1: LP + 'manage-1.jpg',
  m2: LP + 'manage-2.png',
  m3: LP + 'manage-3.jpg',
  m4: LP + 'manage-4.jpg',
  m5: LP + 'manage-5.png',
  s1: LP + 'step-1.jpg',
  s2: LP + 'step-2.jpg',
  s3: LP + 'step-3.jpg',
  s4: LP + 'step-4.png',
  s5: LP + 'step-5.jpg',
  it: LP + 'it.jpg',
  founder: LP + 'founder.jpg',
  logo: LP + 'logo.png',
}

const REASONS = [
  { n: '01', t: 'Мастера из Юго-Восточной Азии — это не маркетинг', a: 'Мы отбираем специалистов прямо в Таиланде и Индонезии, официально оформляем и привозим в Казахстан. Все мастера прошли сертификацию в лучших школах.', em: 'Это невозможно повторить с нуля без наших связей и опыта.' },
  { n: '02', t: 'Системность вместо хаоса', a: 'Бизнесом управляют не люди, а система. CRM, телефония, финансовая аналитика и контроль показателей работают как единый механизм.', em: 'Вы видите ключевые показатели бизнеса в реальном времени с любого устройства.' },
  { n: '03', t: '10 работающих салонов — не теория', a: '10 салонов в 4 городах: Астана, Шымкент, Тараз, Актобе. Более 80 000 клиентов в базе, 5 000+ гостей в месяц по сети.', em: 'Вы покупаете работающую модель, а не концепцию.' },
  { n: '04', t: 'Маркетинг, который приносит клиентов', a: 'Мы знаем, какие рекламные каналы работают в SPA-бизнесе, и умеем эффективно использовать каждый.', em: 'Средний клиент возвращается каждые 3–4 недели.', after: ' Retention Rate — 38%+.' },
  { n: '05', t: 'Бизнес, проверенный временем', a: 'Buddha Spa развивается на рынке уже больше 6 лет. Все процессы, стандарты, маркетинг и финансовая модель прошли проверку на собственных салонах.', em: 'Вам не нужно экспериментировать — вы получаете доказанную систему.' },
  { n: '06', t: 'Успех партнёров — главный показатель', a: 'Результат франшизы измеряется не количеством проданных франшиз, а успешными филиалами. Наши партнёры развивают бизнес вместе с сетью и получают доступ ко всем инструментам,', em: 'которые увеличивают выручку, прибыль и клиентскую базу.' },
]

const MANAGE = [
  { n: '01', img: IMG.m1, tag: 'Операционка', title: 'Контроль качества и сервиса каждый день', text: 'Полностью берём на себя управление сервисом и стандартами. Руководитель клиентского сервиса сопровождает работу филиала, поэтому партнёру не нужно погружаться в ежедневную операционку.', list: ['Управление управляющим филиала и администраторами', 'Внедрение и контроль стандартов Buddha Spa', 'Разработка и обновление SOP и регламентов', 'Проверки тайными гостями', 'Контроль NPS, CSAT и кассовой дисциплины', 'Регулярные аудиты и выезд специалистов УК'], tags: ['Высокий сервис во всех точках контакта', 'Контроль качества без личного участия', 'Снижение потерь от ошибок персонала', 'Рост повторных продаж и лояльности'] },
  { n: '02', img: IMG.m2, tag: 'Маркетинг', title: 'Постоянный поток новых клиентов', text: 'Мы знаем, какие рекламные каналы работают в SPA-бизнесе, и умеем эффективно использовать каждый.', list: ['Ведение соцсетей и контент-стратегия', 'Таргетированная реклама и работа с блогерами', 'Продвижение на картах и геосервисах', 'Акции и программы лояльности', 'Аналитика каждого рекламного канала'], tags: ['Стабильный поток новых клиентов', 'Снижение стоимости привлечения', 'Профессиональный маркетинг без своего отдела', 'Узнаваемый бренд в вашем городе'] },
  { n: '03', img: IMG.m3, tag: 'Продажи', title: 'Рост выручки — наша прямая ответственность', text: 'Наш доход зависит от вашей выручки. Поэтому управление продажами — в нашей зоне ответственности.', list: ['Контроль обработки лидов и конверсии', 'Внедрение и обновление скриптов продаж', 'Прослушивание звонков и разбор переписок', 'Акции для роста среднего чека', 'AI-инструменты для автоматизации продаж'], tags: ['Рост выручки из месяца в месяц', 'Рост конверсии и среднего чека', 'Больше повторных клиентов'] },
  { n: '04', img: IMG.m4, tag: 'Мастера', title: 'Мастера из Юго-Восточной Азии — под ключ', text: 'Нехватка квалифицированных специалистов — главная причина потерь выручки в SPA. Мы закрываем эту задачу полностью.', list: ['Отбор мастеров прямо в Таиланде и Индонезии', 'Официальное оформление и привоз в Казахстан', 'Проверка квалификации и тестирование', 'Адаптация и обучение стандартам Buddha Spa', 'Оперативная замена при выбытии'], tags: ['Берём на себя поиск, оформление и переезд мастеров', 'Адаптация, контроль и сопровождение', 'Стабильное качество услуг по стандартам'] },
  { n: '05', img: IMG.m5, tag: 'Развитие', title: 'Постоянное развитие на основе опыта сети', text: 'Мы тестируем новые инструменты, акции, процедуры и технологии на действующих филиалах. Партнёры получают только решения, которые уже доказали эффективность.', list: ['Новые маркетинговые инструменты', 'Успешные акции и программы лояльности', 'Новые процедуры и услуги', 'Лучшие практики всей сети'], tags: ['Проверенные бизнес-решения без экспериментов', 'Готовую систему управления и аналитику', 'Доступ к опыту всей сети Buddha Spa'] },
]

const STEPS = [
  { n: '01', img: IMG.s1, title: 'Анализ города и выбор локации', text: 'Анализируем трафик, конкурентов и арендные ставки. Помогаем вести переговоры и юридически сопровождаем договор аренды.', chips: [['gold', 'УК: аналитика и переговоры'], ['sage', 'Партнёр: финальное решение']] },
  { n: '02', img: IMG.s2, title: 'Дизайн-проект и подготовка помещения', text: 'Разрабатываем дизайн-проект по стандартам Buddha Spa — планировка, зонирование, освещение. Даём доступ к базе проверенных поставщиков.', chips: [['gold', 'УК: дизайн и стандарты'], ['sage', 'Партнёр: организация ремонта']], rev: true },
  { n: '03', img: IMG.s3, title: 'Привоз мастеров из Юго-Восточной Азии', text: 'Отбираем специалистов на месте. Официально оформляем и привозим в Казахстан. Проводим адаптацию и обучение стандартам.', chips: [['gold', 'УК: подбор, оформление, обучение']] },
  { n: '04', img: IMG.s4, title: 'Набор и обучение команды', text: 'Подбираем и обучаем администраторов и менеджеров. Внедряем скрипты продаж и стандарты обслуживания перед открытием.', chips: [['gold', 'УК: подбор и обучение']], rev: true },
  { n: '05', img: IMG.s5, title: 'Маркетинг и открытие', text: 'Запускаем рекламную кампанию к открытию: таргет, блогеры, геосервисы, офлайн-активации. Цель — очередь клиентов с первого дня.', chips: [['gold', 'УК: весь маркетинг'], ['sage', 'Партнёр: присутствует на открытии']] },
]

const IT = [
  { n: '01', t: 'Финансовый учёт в реальном времени', p: 'Система автоматически фиксирует все оплаты, выручку, средний чек и доход каждого мастера. Исключаются ошибки ручного расчёта.' },
  { n: '02', t: 'CRM и работа с клиентской базой', p: 'Более 80 000 клиентов в базе сети. История посещений, напоминания, работа с оттоком — всё автоматически.' },
  { n: '03', t: 'Складской учёт и сертификаты', p: 'Остатки расходных материалов, движение товаров, контроль сроков сертификатов — в одной системе.' },
  { n: '04', t: 'Мобильное приложение для гостей', p: 'Запись на процедуры, история визитов, программа лояльности — прямо со смартфона. Повышает частоту возвращений.' },
]

const REQS = [
  'Есть свободный капитал от 80 млн ₸ для инвестирования',
  'Вы хотите актив, а не очередную работу на себя',
  'Готовы доверять системе, а не контролировать каждый шаг',
  'Интересует долгосрочный доход, а не быстрые деньги',
  'Понимаете, что у любого бизнеса есть срок окупаемости',
  'Разделяете ценности заботы о клиенте и качества сервиса',
]

const NUMBERS = [
  { value: 18, suffix: 'млн ₸', label: 'Средняя выручка / мес' },
  { value: 35, suffix: '%', label: 'Рентабельность' },
  { static: '24–36', suffix: 'мес', translateSuffix: true, label: 'Срок окупаемости' },
  { prefix: 'от ', value: 80, suffix: 'млн ₸', label: 'Стартовые инвестиции', gold: true },
]

// Real partners of the network (avatars downloaded locally under lp/cases).
const CASES = [
  { name: 'Исатай Жумабеков', city: 'Тараз', img: LP + 'cases/isatai.png', quote: 'Что подкупило в Buddha Spa — это прозрачная финансовая модель. Мы видим окупаемость на цифрах, а не на обещаниях.' },
  { name: 'Асель Сулейменова', city: 'Тараз', img: LP + 'cases/asel.jpg', quote: 'Мне очень нравится надёжность партнёрства. Управляющая компания обеспечивает хороший сервис и загрузку, и мы уверенно движемся к окупаемости к 23-му месяцу.' },
  { name: 'Арыстан Конакбаев', city: 'Шымкент', img: LP + 'cases/arystan.png', quote: 'Название Buddha Spa уже работает на нас — клиенты приходят с доверием к бренду, а не только к новой точке в их районе.' },
  { name: 'Асема Тасанбаева', city: 'Шымкент', img: LP + 'cases/asema.jpg', quote: 'Я долго искала бизнес с надёжным управлением и прозрачностью. С Buddha Spa мы партнёры уже 3,5 года и вышли в окупаемость уже на 16-м месяце. Buddha Spa обеспечила большое доверие к бренду.' },
  { name: 'Асанов Ерлан', city: 'Актобе', img: LP + 'cases/asanov.png', quote: 'Мы партнёры Buddha Spa совсем недавно, но уже видим, насколько всё продумано. Стандарты, отработанные годами, снимают массу вопросов — не нужно изобретать процессы с нуля.' },
  { name: 'Шырын Омарова', city: 'Шымкент', img: LP + 'cases/shyryn.png', quote: 'Мы стали партнёрами совсем недавно, и я могу с уверенностью сказать, что Buddha Spa даёт надёжность и доверие. Многие процессы стандартизированы с учётом многолетнего опыта в этой сфере.' },
  { name: 'Абыз Берик', city: 'Актобе', img: LP + 'cases/abyz.png', quote: 'Отдельно ценим систему обучения администраторов и мастеров. Благодаря готовым регламентам новый сотрудник выходит на нужный уровень сервиса за пару недель, а не месяцев.' },
]

// 360° virtual tours (Kuula). Empty `url` renders a disabled tab (as on the live site).
const TOURS = [
  { city: 'Шымкент', url: 'https://kuula.co/share/collection/7JZy3?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Шымкент', url: 'https://kuula.co/share/collection/7JZg7?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Шымкент', url: 'https://kuula.co/share/collection/7JZWS?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Тараз', url: 'https://kuula.co/share/collection/7bXMS?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Астана', url: 'https://kuula.co/share/collection/7cFJ9?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Актобе', url: '' },
  { city: 'Атырау', url: '' },
  { city: 'Кызылорда', url: '' },
  { city: 'Актау', url: '' },
]

function NumValEditable({ contentKey, defaultVal, nItem, isEditMode, update, savedVal }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const open = () => { setDraft(savedVal || defaultVal); setEditing(true) }
  const save = async () => {
    setSaving(true)
    const v = draft.trim()
    if (v) await update(contentKey, v)
    setSaving(false)
    setEditing(false)
  }
  const display = savedVal || defaultVal
  if (!isEditMode) {
    return (
      <div className="fr-num-val" style={nItem.gold ? { color: 'var(--fr-gold2)' } : undefined}>
        {savedVal ? savedVal : (
          nItem.static
            ? <span>{nItem.prefix || ''}{nItem.static}<small>{nItem.suffix}</small></span>
            : <CountUpNum value={nItem.value} prefix={nItem.prefix || ''} suffix={nItem.suffix} />
        )}
      </div>
    )
  }
  return (
    <>
      <div
        className="fr-num-val"
        style={{ ...(nItem.gold ? { color: 'var(--fr-gold2)' } : {}), outline: '2px dashed rgba(201,169,110,0.4)', outlineOffset: 3, cursor: 'text', borderRadius: 4 }}
        title="✏️ Кликни чтобы редактировать"
        onClick={open}
      >
        {display}
      </div>
      {editing && (
        <EditorModal title="Редактировать значение" onSave={save} onCancel={() => setEditing(false)} saving={saving}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            style={{ width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '10px 12px', fontSize: 18, fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
          <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Например: 18 млн ₸ или от 80 млн ₸</p>
        </EditorModal>
      )}
    </>
  )
}

function PencilEditModal({ title, fields, onSave, onClose }) {
  const [drafts, setDrafts] = useState(() => Object.fromEntries(fields.map((f) => [f.key, f.value || ''])))
  const [saving, setSaving] = useState(false)
  const save = async () => {
    setSaving(true)
    await onSave(drafts)
    setSaving(false)
    onClose()
  }
  return (
    <EditorModal title={title} onSave={save} onCancel={onClose} saving={saving}>
      {fields.map((f) => (
        <div key={f.key} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 6, fontWeight: 700 }}>{f.label}</div>
          {f.rows > 1
            ? <textarea value={drafts[f.key]} onChange={(e) => setDrafts((d) => ({ ...d, [f.key]: e.target.value }))} rows={f.rows || 3} autoFocus={f.autoFocus} style={{ display: 'block', width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
            : <input type="text" value={drafts[f.key]} onChange={(e) => setDrafts((d) => ({ ...d, [f.key]: e.target.value }))} autoFocus={f.autoFocus} style={{ width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />}
        </div>
      ))}
    </EditorModal>
  )
}

function PencilBtn({ onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, background: 'rgba(201,169,110,0.9)', border: 'none', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, ...style }}
      title="✏️ Редактировать"
    >✏️</button>
  )
}

function StepCard({ s, t, isEditMode, update, content, chipsKey }) {
  const [editingChips, setEditingChips] = useState(false)
  const savedChips = (() => { try { return JSON.parse(content[chipsKey] || 'null') } catch { return null } })()
  const chipList = savedChips || s.chips
  const [chipDrafts, setChipDrafts] = useState([])
  const [saving, setSaving] = useState(false)
  const openChips = () => { setChipDrafts(chipList.map(([k, txt]) => ({ k, txt }))); setEditingChips(true) }
  const saveChips = async () => {
    setSaving(true)
    await update(chipsKey, JSON.stringify(chipDrafts.map((c) => [c.k, c.txt])))
    setSaving(false); setEditingChips(false)
  }
  return (
    <>
      <div className={`rv fr-step ${s.rev ? 'rev' : ''}`}>
        <div className="fr-step-img" style={{ position: 'relative' }}>
          <img src={s.img} alt="" /><div className="grad" /><span className="fr-step-num">{s.n}</span>
          {isEditMode && <PencilBtn onClick={openChips} style={{ bottom: 8, top: 'auto' }} />}
        </div>
        <div className="fr-step-txt">
          <EditableText as="h3" contentKey={`fr.step.${s.n}.title`} fallback={t(s.title)} />
          <EditableText as="p" contentKey={`fr.step.${s.n}.text`} fallback={t(s.text)} />
          <div className="fr-chips">{chipList.map(([k, txt], j) => (<span key={j} className={`fr-chip ${k}`}>{txt}</span>))}</div>
        </div>
      </div>
      {editingChips && (
        <EditorModal title={`Чипы — этап ${s.n}`} onSave={saveChips} onCancel={() => setEditingChips(false)} saving={saving}>
          {chipDrafts.map((chip, idx) => (
            <div key={idx} style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <select value={chip.k} onChange={(e) => setChipDrafts((d) => d.map((c, i) => i === idx ? { ...c, k: e.target.value } : c))} style={{ background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 6, padding: '8px 6px', fontSize: 12 }}>
                <option value="gold">🟡 gold</option>
                <option value="sage">🟢 sage</option>
              </select>
              <input type="text" value={chip.txt} onChange={(e) => setChipDrafts((d) => d.map((c, i) => i === idx ? { ...c, txt: e.target.value } : c))} style={{ flex: 1, background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 6, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit' }} />
              <button onClick={() => setChipDrafts((d) => d.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
          ))}
          <button onClick={() => setChipDrafts((d) => [...d, { k: 'gold', txt: '' }])} style={{ background: 'none', border: '1px dashed #444', color: '#888', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13, marginTop: 4 }}>+ Добавить чип</button>
        </EditorModal>
      )}
    </>
  )
}

function CaseCard({ c, idx, t, isEditMode, update, content }) {
  const [editing, setEditing] = useState(false)
  const nameKey = `fr.case.${idx}.name`
  const cityKey = `fr.case.${idx}.city`
  const quoteKey = `fr.case.${idx}.quote`
  const name = content[nameKey] || c.name
  const city = content[cityKey] || c.city
  const quote = content[quoteKey] || c.quote
  const [drafts, setDrafts] = useState({ name, city, quote })
  const [saving, setSaving] = useState(false)
  const open = () => { setDrafts({ name: content[nameKey] || c.name, city: content[cityKey] || c.city, quote: content[quoteKey] || c.quote }); setEditing(true) }
  const save = async () => {
    setSaving(true)
    await Promise.all([update(nameKey, drafts.name), update(cityKey, drafts.city), update(quoteKey, drafts.quote)])
    setSaving(false); setEditing(false)
  }
  return (
    <>
      <figure className="fr-case" style={{ position: 'relative' }}>
        {isEditMode && <PencilBtn onClick={open} style={{ top: 4, right: 4 }} />}
        <img src={c.img} alt={name} className="fr-case-ph" loading="lazy" />
        <figcaption className="fr-case-name">{name}</figcaption>
        <div className="fr-case-meta">{t('Партнёр')} · {city}</div>
        <span className="fr-case-rule" />
        <blockquote className="fr-case-quote">{quote}</blockquote>
      </figure>
      {editing && (
        <PencilEditModal
          title={`Партнёр — ${c.name}`}
          fields={[
            { key: 'name', label: 'Имя', value: drafts.name, rows: 1, autoFocus: true },
            { key: 'city', label: 'Город', value: drafts.city, rows: 1 },
            { key: 'quote', label: 'Цитата', value: drafts.quote, rows: 4 },
          ]}
          onSave={async (d) => { setSaving(true); await Promise.all([update(nameKey, d.name), update(cityKey, d.city), update(quoteKey, d.quote)]); setSaving(false) }}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}

function AddFormatCard({ update, content }) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', text: '', g1lbl: '', g1val: '', g2lbl: '', g2val: '', g3lbl: '', g3val: '' })
  const [saving, setSaving] = useState(false)
  const inp = (k, label, rows) => (
    <div key={k} style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 5, fontWeight: 700 }}>{label}</div>
      {rows > 1
        ? <textarea value={draft[k]} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} rows={rows} style={{ display: 'block', width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
        : <input type="text" value={draft[k]} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} style={{ width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />}
    </div>
  )
  const save = async () => {
    if (!draft.name.trim()) return
    setSaving(true)
    let extra = []
    try { extra = JSON.parse(content['fr.formats.extra'] || '[]') } catch {}
    extra.push({ name: draft.name.trim(), text: draft.text.trim(), grid: [['g1lbl', 'g1val'], ['g2lbl', 'g2val'], ['g3lbl', 'g3val']].filter(([l]) => draft[l]).map(([l, v]) => ({ label: draft[l], val: draft[v] })) })
    await update('fr.formats.extra', JSON.stringify(extra))
    setSaving(false); setAdding(false)
    setDraft({ name: '', text: '', g1lbl: '', g1val: '', g2lbl: '', g2val: '', g3lbl: '', g3val: '' })
  }
  return (
    <>
      <div className="rv fr-card" style={{ border: '2px dashed rgba(201,169,110,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }} onClick={() => setAdding(true)}>
        <span style={{ fontSize: 48, color: 'rgba(201,169,110,0.5)', lineHeight: 1 }}>+</span>
      </div>
      {adding && (
        <EditorModal title="Добавить формат" onSave={save} onCancel={() => setAdding(false)} saving={saving}>
          {inp('name', 'Название', 1)}{inp('text', 'Описание', 3)}
          {inp('g1lbl', 'Поле 1 — метка', 1)}{inp('g1val', 'Поле 1 — значение', 1)}
          {inp('g2lbl', 'Поле 2 — метка', 1)}{inp('g2val', 'Поле 2 — значение', 1)}
          {inp('g3lbl', 'Поле 3 — метка', 1)}{inp('g3val', 'Поле 3 — значение', 1)}
        </EditorModal>
      )}
    </>
  )
}

function AddCaseCard({ update, content }) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: '', city: '', quote: '' })
  const [saving, setSaving] = useState(false)
  const save = async () => {
    if (!draft.name.trim()) return
    setSaving(true)
    let extra = []
    try { extra = JSON.parse(content['fr.cases.extra'] || '[]') } catch {}
    extra.push({ name: draft.name.trim(), city: draft.city.trim(), quote: draft.quote.trim() })
    await update('fr.cases.extra', JSON.stringify(extra))
    setSaving(false); setAdding(false)
    setDraft({ name: '', city: '', quote: '' })
  }
  return (
    <>
      <figure className="fr-case" style={{ border: '2px dashed rgba(201,169,110,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }} onClick={() => setAdding(true)}>
        <span style={{ fontSize: 48, color: 'rgba(201,169,110,0.5)', lineHeight: 1 }}>+</span>
      </figure>
      {adding && (
        <EditorModal title="Добавить партнёра" onSave={save} onCancel={() => setAdding(false)} saving={saving}>
          {[['name', 'Имя', 1], ['city', 'Город', 1], ['quote', 'Цитата', 4]].map(([k, lbl, rows]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 5, fontWeight: 700 }}>{lbl}</div>
              {rows > 1
                ? <textarea value={draft[k]} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} rows={rows} style={{ display: 'block', width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
                : <input type="text" value={draft[k]} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} style={{ width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />}
            </div>
          ))}
        </EditorModal>
      )}
    </>
  )
}

function AddStepCard({ update, content }) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ title: '', text: '', chip1: '', chip2: '' })
  const [saving, setSaving] = useState(false)
  const save = async () => {
    if (!draft.title.trim()) return
    setSaving(true)
    let extra = []
    try { extra = JSON.parse(content['fr.steps.extra'] || '[]') } catch {}
    const chips = [draft.chip1.trim(), draft.chip2.trim()].filter(Boolean).map((c) => ['gold', c])
    extra.push({ title: draft.title.trim(), text: draft.text.trim(), chips })
    await update('fr.steps.extra', JSON.stringify(extra))
    setSaving(false); setAdding(false)
    setDraft({ title: '', text: '', chip1: '', chip2: '' })
  }
  return (
    <>
      <div className="rv fr-step" style={{ border: '2px dashed rgba(201,169,110,0.3)', cursor: 'pointer', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setAdding(true)}>
        <span style={{ fontSize: 48, color: 'rgba(201,169,110,0.5)', lineHeight: 1 }}>+</span>
      </div>
      {adding && (
        <EditorModal title="Добавить этап" onSave={save} onCancel={() => setAdding(false)} saving={saving}>
          {[['title', 'Заголовок этапа', 1], ['text', 'Описание', 3], ['chip1', 'Чип 1 (напр. УК: ...)', 1], ['chip2', 'Чип 2 (напр. Партнёр: ...)', 1]].map(([k, lbl, rows]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 5, fontWeight: 700 }}>{lbl}</div>
              {rows > 1
                ? <textarea value={draft[k]} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} rows={rows} style={{ display: 'block', width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
                : <input type="text" value={draft[k]} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} style={{ width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '8px 10px', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />}
            </div>
          ))}
        </EditorModal>
      )}
    </>
  )
}

function CountUpNum({ value, prefix = '', suffix }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          io.unobserve(e.target)
          const start = performance.now()
          const duration = 1300
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setN(Math.round(eased * value))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {prefix}
      {n}
      <small>{suffix}</small>
    </span>
  )
}

export default function Franchise() {
  const t = useT()
  const { lang, setLang } = useLang()
  const { isEditMode } = useEditMode()
  const { content, update } = useContentContext()
  const [navSolid, setNavSolid] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [activeTour, setActiveTour] = useState(0)
  const [legal, setLegal] = useState(null) // null | 'oferta' | 'privacy'

  async function onFranchiseSubmit(e) {
    e.preventDefault()
    if (sending) return
    const fd = new FormData(e.currentTarget)
    if (fd.get('company')) { setSent(true); return } // honeypot
    const payload = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      company: fd.get('company'),
      city: fd.get('city'),
      branchSlug: 'franchise',
      branchName: 'Франшиза',
      branchLabel: fd.get('city') ? `Франшиза — ${fd.get('city')}` : 'Франшиза',
      service: 'Заявка на франшизу',
      comment: [
        `Капитал: ${fd.get('capital') || '—'}`,
        `Помещение: ${fd.get('premises') || '—'}`,
      ].join('\n'),
    }
    setSending(true)
    setSendError('')
    try {
      const resp = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok || !data.ok) throw new Error(data.error || '')
      setSent(true)
    } catch (err) {
      setSendError(err.message || t('Не удалось отправить заявку. Попробуйте ещё раз.'))
    } finally {
      setSending(false)
    }
  }
  const rootRef = useRef(null)
  const langRef = useRef(null)
  const heroImgRef = useRef(null)

  useEffect(() => applyFranchiseSeo(), [])

  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setNavSolid(window.scrollY > 60)
        if (heroImgRef.current) {
          const y = Math.min(window.scrollY * 0.25, 140)
          heroImgRef.current.style.transform = `translateY(${y}px) scale(1.08)`
        }
        raf = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!langOpen) return undefined
    const onDocClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setLangOpen(false)
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [langOpen])

  useEffect(() => {
    const els = rootRef.current?.querySelectorAll('.rv') || []
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const currentLabel = LANGS.find((l) => l.code === lang)?.label || 'Рус'

  return (
    <div className="fr-page" ref={rootRef}>
      <nav className={`fr-nav ${navSolid ? 'solid' : ''}`}>
        <Link to="/" className="fr-brand">
          <img src={IMG.logo} alt="Buddha Spa" />
          Buddha<span>Spa</span>
        </Link>
        <div className="fr-nav-right">
          <a className="fr-nav-links" href="#why">{t('Почему мы')}</a>
          <a className="fr-nav-links" href="#qa">{t('FAQ')}</a>
          <a href="#cta" className="btn fr-nav-cta" style={{ padding: '13px 24px' }}>{t('Оставить заявку')}</a>
          <div
            className="fr-lang"
            ref={langRef}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={langOpen}
            onClick={(e) => { e.stopPropagation(); setLangOpen((v) => !v) }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLangOpen((v) => !v) } }}
          >
            <svg className="globe" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 12h18M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span>{currentLabel}</span>
            <span className="arrow">▾</span>
            <div className={`fr-lang-dd ${langOpen ? 'open' : ''}`}>
              {LANGS.map((l) => (
                <button key={l.code} className={lang === l.code ? 'active' : ''} onClick={() => { setLang(l.code); setLangOpen(false) }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <button
            className={`fr-burger ${menuOpen ? 'open' : ''}`}
            aria-label={t('Меню')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
        <div className={`fr-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <a href="#why" onClick={() => setMenuOpen(false)}>{t('Почему мы')}</a>
          <a href="#qa" onClick={() => setMenuOpen(false)}>{t('FAQ')}</a>
          <a href="#cta" onClick={() => setMenuOpen(false)}>{t('Оставить заявку')}</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="fr-hero">
        <img ref={heroImgRef} src={IMG.hero} alt="" style={{ filter: 'brightness(.6)' }} />
        <div className="fr-hero-grad" />
        <div className="wrap fr-hero-inner">
          <EditableText as="span" contentKey="fr.hero.eyebrow" fallback={t('Франшиза · Казахстан')} className="rv fr-hero-eyebrow eyebrow" />
          <EditableText as="h1" contentKey="fr.hero.title" fallback={t('Инвестируйте в готовый прибыльный бизнес.')} className="rv" />
          <EditableText as="p" contentKey="fr.hero.sub" fallback={t('Buddha Spa — лидер премиального SPA-рынка Казахстана: 10 работающих салонов, 80 000+ клиентов и проверенная модель. Вы вкладываете капитал — прибыль, управление, маркетинг и рост берём на себя мы.')} className="rv fr-hero-sub" />
          <div className="rv fr-hero-actions">
            <a href="#cta" className="btn">{t('Получить расчёт →')}</a>
            <a href="#philosophy" className="btn btn-ghost">{t('Узнать больше')}</a>
          </div>
        </div>
      </header>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="sec" style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={IMG.phil} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.14, filter: 'brightness(.7)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 40%, rgba(20,16,11,.6), rgba(20,16,11,.96))' }} />
        <div className="wrap" style={{ maxWidth: 900, textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <EditableText as="span" contentKey="fr.phil.eyebrow" fallback={t('Философия бренда')} className="rv eyebrow" />
          <EditableText as="h2" contentKey="fr.phil.title" fallback={t('Роскошь для души и тела')} className="rv h2" style={{ marginTop: 22 }} />
          <EditableText as="p" contentKey="fr.phil.text" fallback={t('Buddha Spa — это не просто массажный салон. Это пространство, где человек возвращается к себе, обретает внутреннюю тишину и восстанавливает баланс. Мы создаём не услугу — мы создаём состояние, которое остаётся с вами надолго. Каждая деталь здесь работает на одно: чтобы вы чувствовали себя лучше, чем до прихода.')} className="rv" style={{ fontSize: 17, color: 'rgba(243,233,218,.72)', lineHeight: 2, maxWidth: 640, margin: '30px auto 0' }} />
        </div>
      </section>

      {/* VIRTUAL TOUR */}
      <section id="tour" className="sec">
        <div className="wrap">
          <div style={{ maxWidth: 760, margin: '0 0 40px' }}>
            <EditableText as="span" contentKey="fr.tour.eyebrow" fallback={t('Виртуальный тур')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.tour.title" fallback={t('Загляните внутрь ещё до первого визита')} className="rv h2" />
            <EditableText as="p" contentKey="fr.tour.lead" fallback={t('Пройдитесь по действующим салонам Buddha Spa в 360°. Выберите филиал и осмотрите его изнутри — атмосфера, интерьер и уровень сервиса, которые получает каждый партнёр сети.')} className="rv lead" style={{ margin: '22px 0 0', maxWidth: 620 }} />
          </div>
          <div className="rv fr-tour-tabs">
            {TOURS.map((tr, i) => (
              <button
                key={i}
                type="button"
                className={`fr-tour-tab ${activeTour === i ? 'is-active' : ''} ${tr.url ? '' : 'is-disabled'}`}
                disabled={!tr.url}
                onClick={() => tr.url && setActiveTour(i)}
              >
                {t(tr.city)}
              </button>
            ))}
          </div>
          <div className="rv fr-tour-frame">
            <iframe
              title="Buddha Spa 360°"
              src={TOURS[activeTour].url}
              allowFullScreen
              allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="fr-numbers">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 14 }}><EditableText as="span" contentKey="fr.num.eyebrow" fallback={t('Экономика одного салона')} className="rv eyebrow" /></div>
          <div className="rv" style={{ textAlign: 'center', marginBottom: 48 }}>
            <EditableText as="span" contentKey="fr.num.note" fallback={t('Средние показатели по действующим филиалам, данные за 2025 год')} style={{ font: '500 12px/1.6 Manrope', letterSpacing: '.02em', color: 'rgba(243,233,218,.5)' }} />
          </div>
          <div className="fr-numbers-row">
            {NUMBERS.map((nItem, i) => {
              const valKey = `fr.num.${i}.val`
              const defaultVal = nItem.static
                ? `${nItem.prefix || ''}${nItem.static} ${nItem.suffix}`
                : `${nItem.prefix || ''}${nItem.value} ${nItem.suffix}`
              return (
                <div className="rv fr-num" key={nItem.label}>
                  <NumValEditable
                    contentKey={valKey}
                    defaultVal={defaultVal}
                    nItem={nItem}
                    isEditMode={isEditMode}
                    update={update}
                    savedVal={content[valKey] || ''}
                  />
                  <EditableText as="div" contentKey={`fr.num.${i}.lbl`} fallback={t(nItem.label)} className="fr-num-lbl" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* QA */}
      <section id="qa" className="sec">
        <div className="wrap">
          <div style={{ maxWidth: 720, margin: '0 0 60px' }}>
            <EditableText as="span" contentKey="fr.qa.eyebrow" fallback={t('Ответы на ключевые')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.qa.title" fallback={t('Вопросы инвесторов')} className="rv h2" />
            <EditableText as="p" contentKey="fr.qa.lead" fallback={t('Инвестиции требуют понятной бизнес-модели, прозрачной экономики и надёжного партнёра. Ниже — ответы на вопросы, которые нам задают чаще всего.')} className="rv lead" style={{ margin: '22px 0 0', maxWidth: 560 }} />
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">01</span><EditableText as="div" contentKey="fr.qa.1.title" fallback={t('«Сейчас подходящее время для открытия бизнеса?»')} className="fr-qa-title" /></div>
            <div className="fr-qa-a">
              <EditableText as="p" contentKey="fr.qa.1.strong" fallback={t('Да, если бизнес построен на сильной системе управления.')} className="strong" />
              <EditableText as="p" contentKey="fr.qa.1.p1" fallback={t('Во время нестабильности на рынке появляются выгодные помещения, снижается конкуренция и открываются новые возможности. При этом спрос на качественные услуги массажа и восстановления остаётся стабильным.')} />
              <EditableText as="p" contentKey="fr.qa.1.em" fallback={t('Главный фактор успеха — не момент открытия, а эффективное управление бизнесом.')} className="em" style={{ margin: 0 }} />
            </div>
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">02</span><EditableText as="div" contentKey="fr.qa.2.title" fallback={t('«Почему вам можно доверять?»')} className="fr-qa-title" /></div>
            <div className="fr-qa-a">
              <EditableText as="p" contentKey="fr.qa.2.strong" fallback={t('Большинство франшиз продают бренд и инструкции. Мы берём участие в управлении бизнесом после открытия.')} className="strong" />
              <EditableText as="p" contentKey="fr.qa.2.p1" fallback={t('Управляющая компания обеспечивает:')} style={{ marginBottom: 10 }} />
              <ul>
                {['операционное управление', 'маркетинг и привлечение клиентов', 'продажи и обучение персонала', 'контроль качества и финансовую аналитику', 'внедрение стандартов и развитие филиала'].map((s) => (
                  <li key={s}><span>—</span><span>{t(s)}</span></li>
                ))}
              </ul>
              <EditableText as="p" contentKey="fr.qa.2.em" fallback={t('Успех Buddha Spa - это и ваш успех.')} className="em" style={{ margin: 0 }} />
            </div>
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">03</span><EditableText as="div" contentKey="fr.qa.3.title" fallback={t('«Как оценить окупаемость?»')} className="fr-qa-title" /></div>
            <div className="fr-qa-a">
              <EditableText as="p" contentKey="fr.qa.3.strong" fallback={t('Стоимость открытия филиала — от 80 млн ₸.')} className="strong" style={{ marginBottom: 8 }} />
              <EditableText as="p" contentKey="fr.qa.3.p1" fallback={t('Перед запуском мы предоставляем финансовую модель, основанную на показателях действующих филиалов.')} style={{ margin: 0 }} />
            </div>
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">04</span><EditableText as="div" contentKey="fr.qa.4.title" fallback={t('«Почему многие инвестируют сейчас?»')} className="fr-qa-title" /></div>
            <div className="fr-qa-a">
              <EditableText as="p" contentKey="fr.qa.4.strong" fallback={t('Идеального момента для открытия бизнеса не существует.')} className="strong" />
              <EditableText as="p" contentKey="fr.qa.4.p1" fallback={t('Пока одни откладывают решение, другие занимают лучшие локации, формируют клиентскую базу и развивают бизнес.')} />
              <EditableText as="p" contentKey="fr.qa.4.em" fallback={t('По данным Global Wellness Institute, рынок wellness продолжает расти, а спрос на услуги восстановления остаётся высоким.')} className="em" style={{ margin: 0 }} />
            </div>
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">05</span><EditableText as="div" contentKey="fr.qa.5.title" fallback={t('«Что если филиал не выйдет на плановые показатели?»')} className="fr-qa-title" /></div>
            <div className="fr-qa-a">
              <EditableText as="p" contentKey="fr.qa.5.strong" fallback={t('Мы находимся с вами в одной экономике.')} className="strong" />
              <EditableText as="p" contentKey="fr.qa.5.p1" fallback={t('Наш доход — доля от прибыли салона, поэтому отставание бьёт и по нам. Если филиал идёт ниже финмодели, мы проводим аудит показателей, пересматриваем маркетинг и загрузку, усиливаем команду и обучение и вместе с партнёром запускаем план восстановления с чёткими сроками и контрольными точками.')} />
              <EditableText as="p" contentKey="fr.qa.5.em" fallback={t('Цифры в финмодели — расчётные ориентиры, а не гарантия дохода.')} className="em" style={{ margin: 0 }} />
            </div>
          </div>

          <div className="rv fr-callout">
            <div className="fr-callout-title">{t('Почему инвесторы выбирают')} <span className="ital">Buddha Spa</span></div>
            <div className="fr-callout-grid">
              {['10 действующих филиалов в Казахстане', 'Проверенная бизнес-модель на собственной сети', 'Полное операционное управление после открытия', 'Централизованный маркетинг и продажи', 'Контроль качества и единые стандарты', 'Прозрачная финансовая модель', 'Долгосрочное партнёрство и развитие каждого филиала'].map((s) => (
                <div key={s}><span>✓</span><span>{t(s)}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE */}
      <section className="fr-imm">
        <img src={IMG.imm} alt="" />
        <div className="fr-imm-grad" />
        <div className="wrap fr-imm-inner">
          <div>
            <EditableText as="span" contentKey="fr.imm.eyebrow" fallback={t('Почему Buddha Spa')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.imm.title" fallback={t('Мастера из Юго-Восточной Азии')} className="rv h2" style={{ color: 'var(--fr-cream)', marginTop: 22 }} />
            <EditableText as="p" contentKey="fr.imm.text" fallback={t('Мы отбираем специалистов прямо в Таиланде и Индонезии, официально оформляем и привозим в Казахстан. Все мастера прошли сертификацию в лучших школах.')} className="rv" />
          </div>
        </div>
      </section>

      {/* WHY — 6 reasons */}
      <section id="why" className="sec fr-bg2sec">
        <div className="wrap fr-why-grid">
          <div className="fr-why-sticky">
            <EditableText as="span" contentKey="fr.why.eyebrow" fallback={t('Шесть причин')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.why.title" fallback={t('Выбрать нас и быть уверенным в завтрашнем дне')} className="rv h2" />
            <span className="fr-rule" />
          </div>
          <div>
            {REASONS.map((r) => (
              <div className="rv fr-reason" key={r.n}>
                <span className="fr-reason-n">{r.n}</span>
                <div>
                  <EditableText as="h3" contentKey={`fr.reason.${r.n}.t`} fallback={t(r.t)} />
                  <p><EditableText as="span" contentKey={`fr.reason.${r.n}.a`} fallback={t(r.a)} /> <span className="em"><EditableText as="span" contentKey={`fr.reason.${r.n}.em`} fallback={t(r.em)} /></span>{r.after || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section id="formats" className="sec">
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
            <EditableText as="span" contentKey="fr.formats.eyebrow" fallback={t('Форматы партнёрства')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.formats.title" fallback={t('Выберите формат под свои цели')} className="rv h2" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)' }} />
          </div>
          <div className="fr-cardrow">
            {/* Card 01 — Партнёр */}
            <div className="rv fr-card">
              <div className="fr-card-img"><img src={IMG.fPartner} alt="" /><div className="grad" /><span className="fr-card-num">01</span><EditableText as="div" contentKey="fr.format.1.name" fallback={t('Партнёр')} className="fr-card-name" /></div>
              <div className="fr-card-p">
                <EditableText as="p" contentKey="fr.format.1.text" fallback={t('Вы инвестируете капитал в открытие салона (от 80 млн ₸) и контролируете финансовые показатели. Ежедневное управление берёт на себя управляющая компания, а прибыль делится 50/50. Паушального взноса и роялти нет.')} />
                <div className="fr-partner-grid">
                  <div><EditableText as="div" contentKey="fr.format.1.g1.lbl" fallback={t('Условия')} className="flabel" /><EditableText as="div" contentKey="fr.format.1.g1.val" fallback="50 / 50" className="fvalue" translate={false} /></div>
                  <div><EditableText as="div" contentKey="fr.format.1.g2.lbl" fallback={t('Вовлечённость')} className="flabel" /><EditableText as="div" contentKey="fr.format.1.g2.val" fallback={t('Минимальная')} className="fvalue" translate={false} /></div>
                  <div><EditableText as="div" contentKey="fr.format.1.g3.lbl" fallback={t('Паушальный взнос')} className="flabel" /><EditableText as="div" contentKey="fr.format.1.g3.val" fallback="0 ₸" className="fvalue" translate={false} /></div>
                </div>
              </div>
            </div>
            {/* Card 02 — Франшиза */}
            <div className="rv fr-card">
              <div className="fr-card-img"><img src={IMG.f2} alt="" /><div className="grad" /><span className="fr-card-num">02</span><EditableText as="div" contentKey="fr.format.2.name" fallback={t('Франшиза')} className="fr-card-name" /></div>
              <div className="fr-card-p">
                <EditableText as="p" contentKey="fr.format.2.text" fallback={t('Вы активно участвуете в управлении, УК обеспечивает систему, стандарты и поддержку на каждом этапе.')} />
                <div className="fr-partner-grid">
                  <div><EditableText as="div" contentKey="fr.format.2.g1.lbl" fallback={t('Роялти')} className="flabel" /><EditableText as="div" contentKey="fr.format.2.g1.val" fallback={t('7% с оборота')} className="fvalue" translate={false} /></div>
                  <div><EditableText as="div" contentKey="fr.format.2.g2.lbl" fallback={t('Вовлечённость')} className="flabel" /><EditableText as="div" contentKey="fr.format.2.g2.val" fallback={t('Активная')} className="fvalue" translate={false} /></div>
                  <div><EditableText as="div" contentKey="fr.format.2.g3.lbl" fallback={t('Паушальный взнос')} className="flabel" /><EditableText as="div" contentKey="fr.format.2.g3.val" fallback={t('7 млн ₸')} className="fvalue" translate={false} /></div>
                </div>
              </div>
            </div>
            {/* Extra format cards stored in content as JSON */}
            {(() => {
              try {
                const extra = JSON.parse(content['fr.formats.extra'] || '[]')
                return extra.map((card, idx) => (
                  <div className="rv fr-card" key={`extra-fmt-${idx}`}>
                    <div className="fr-card-img"><img src={card.img || IMG.f2} alt="" /><div className="grad" /><span className="fr-card-num">{String(idx + 3).padStart(2, '0')}</span><div className="fr-card-name">{card.name}</div></div>
                    <div className="fr-card-p">
                      <p>{card.text}</p>
                      {card.grid && <div className="fr-partner-grid">{card.grid.map((g, gi) => (<div key={gi}><div className="flabel">{g.label}</div><div className="fvalue">{g.val}</div></div>))}</div>}
                    </div>
                  </div>
                ))
              } catch { return null }
            })()}
            {/* Add new format card button */}
            {isEditMode && <AddFormatCard update={update} content={content} />}
          </div>
        </div>
      </section>

      {/* MANAGEMENT */}
      <section id="manage" className="sec fr-bg2sec">
        <div className="wrap">
          <div style={{ maxWidth: 720, margin: '0 0 56px' }}>
            <EditableText as="span" contentKey="fr.manage.eyebrow" fallback={t('Система управления')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.manage.title" fallback={t('Как мы управляем вашим салоном')} className="rv h2" />
            <EditableText as="p" contentKey="fr.manage.lead" fallback={t('Пять направлений, которые управляющая компания берёт на себя — чтобы партнёр видел результат, а не рутину.')} className="rv lead" style={{ margin: '20px 0 0', maxWidth: 560 }} />
          </div>
          <div className="fr-cardrow four">
            {MANAGE.map((c) => (
              <div className="rv fr-card" key={c.n}>
                <div className="fr-card-img sm"><img src={c.img} alt="" /><div className="grad" /><div className="fr-card-tag"><span className="n">{c.n}</span><EditableText as="span" contentKey={`fr.manage.${c.n}.tag`} fallback={t(c.tag)} className="lbl" /></div></div>
                <div className="fr-card-body">
                  <EditableText as="h3" contentKey={`fr.manage.${c.n}.title`} fallback={t(c.title)} />
                  <EditableText as="p" contentKey={`fr.manage.${c.n}.text`} fallback={t(c.text)} />
                  <ul className="fr-card-list">{c.list.map((li, j) => (<li key={j}><span>—</span><EditableText as="span" contentKey={`fr.manage.${c.n}.li.${j}`} fallback={t(li)} /></li>))}</ul>
                  <div className="fr-card-foot">
                    <EditableText as="div" contentKey={`fr.manage.${c.n}.foot`} fallback={t('Что получает партнёр')} className="fr-card-foot-lbl" />
                    <div className="fr-tags">{c.tags.map((tg, j) => (<EditableText as="span" key={j} contentKey={`fr.manage.${c.n}.tg.${j}`} fallback={t(tg)} />))}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="steps" className="sec">
        <div className="wrap">
          <div style={{ maxWidth: 720, margin: '0 0 64px' }}>
            <EditableText as="span" contentKey="fr.steps.eyebrow" fallback={t('Этапы запуска')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.steps.title" fallback={t('От подписания до первого гостя')} className="rv h2" />
            <EditableText as="p" contentKey="fr.steps.lead" fallback={t('В среднем 5–6 месяцев от подписания до первого гостя. Большую часть работы ведём параллельно.')} className="rv lead" style={{ margin: '20px 0 0', maxWidth: 520 }} />
          </div>
          <div className="fr-steps">
            {STEPS.map((s) => {
              const chipsKey = `fr.step.${s.n}.chips`
              return (
                <StepCard key={s.n} s={s} t={t} isEditMode={isEditMode} update={update} content={content} chipsKey={chipsKey} />
              )
            })}
            {(() => {
              try {
                const extra = JSON.parse(content['fr.steps.extra'] || '[]')
                return extra.map((s, idx) => (
                  <div className="rv fr-step" key={`extra-step-${idx}`}>
                    <div className="fr-step-img"><div style={{ background: '#1a1612', width: '100%', height: '100%', minHeight: 200 }} /><div className="grad" /><span className="fr-step-num">{String(STEPS.length + idx + 1).padStart(2, '0')}</span></div>
                    <div className="fr-step-txt">
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                      <div className="fr-chips">{(s.chips || []).map(([k, txt], j) => (<span key={j} className={`fr-chip ${k}`}>{txt}</span>))}</div>
                    </div>
                  </div>
                ))
              } catch { return null }
            })()}
            {isEditMode && <AddStepCard update={update} content={content} />}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section id="cases" className="sec fr-bg2sec">
        <div className="wrap">
          <div style={{ maxWidth: 760, margin: '0 0 40px' }}>
            <EditableText as="span" contentKey="fr.cases.eyebrow" fallback={t('Партнёры сети')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.cases.title" fallback={t('Реальные предприниматели. Реальные результаты.')} className="rv h2" />
            <EditableText as="p" contentKey="fr.cases.lead" fallback={t('Рентабельность действующих филиалов сети составляет 30–40%. Средняя чистая прибыль партнёров достигает около 5 млн ₸ в месяц.')} className="rv lead" style={{ margin: '22px 0 0', maxWidth: 620 }} />
          </div>
          <div className="rv fr-cases">
            {CASES.map((c, idx) => (
              <CaseCard key={c.name} c={c} idx={idx} t={t} isEditMode={isEditMode} update={update} content={content} />
            ))}
            {(() => {
              try {
                const extra = JSON.parse(content['fr.cases.extra'] || '[]')
                return extra.map((c, idx) => (
                  <figure className="fr-case" key={`extra-case-${idx}`}>
                    <div className="fr-case-ph" style={{ width: 80, height: 80, borderRadius: '50%', background: '#2a2520', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>👤</div>
                    <figcaption className="fr-case-name">{c.name}</figcaption>
                    <div className="fr-case-meta">{t('Партнёр')} · {c.city}</div>
                    <span className="fr-case-rule" />
                    <blockquote className="fr-case-quote">{c.quote}</blockquote>
                  </figure>
                ))
              } catch { return null }
            })()}
            {isEditMode && <AddCaseCard update={update} content={content} />}
          </div>
        </div>
      </section>

      {/* IT */}
      <section id="it" className="sec" style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={IMG.it} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1, filter: 'brightness(.7)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 70% 30%, rgba(20,16,11,.55), rgba(20,16,11,.97))' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 720, margin: '0 0 56px' }}>
            <EditableText as="span" contentKey="fr.it.eyebrow" fallback={t('IT-экосистема')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.it.title" fallback={t('Все показатели бизнеса — у вас в телефоне')} className="rv h2" />
          </div>
          <div className="fr-it-grid">
            {IT.map((it) => (
              <div className="rv fr-it" key={it.n}>
                <div className="fr-it-n">{it.n}</div>
                <EditableText as="h3" contentKey={`fr.it.${it.n}.t`} fallback={t(it.t)} />
                <EditableText as="p" contentKey={`fr.it.${it.n}.p`} fallback={t(it.p)} />
              </div>
            ))}
          </div>
          <div className="rv fr-it-callout">
            <EditableText as="div" contentKey="fr.it.callout.lbl" fallback={t('Одно приложение')} className="fr-it-callout-lbl" />
            <EditableText as="div" contentKey="fr.it.callout.title" fallback={t('Всё под контролем — без вашего участия')} className="fr-it-callout-title" />
            <EditableText as="p" contentKey="fr.it.callout.text" fallback={t('Записи, оплаты, склад, лояльность и финансовая аналитика Buddha Spa — в одной системе, доступной с телефона в любой точке мира.')} />
          </div>
        </div>
      </section>

      {/* FOUNDER — single, do not alter */}
      <section id="founders" className="sec fr-bg2sec">
        <div className="wrap">
          <div style={{ maxWidth: 720, margin: '0 auto 52px', textAlign: 'center' }}>
            <EditableText as="span" contentKey="fr.founder.eyebrow" fallback={t('Основательница')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.founder.title" fallback={t('С вами будет работать')} className="rv h2" />
            <EditableText as="p" contentKey="fr.founder.lead" fallback={t('До подписания вы встретитесь с основательницей лично и побываете в работающем салоне.')} className="rv lead" style={{ margin: '20px auto 0', maxWidth: 520 }} />
          </div>
          <div className="fr-founders">
            <div className="rv fr-founder">
              <div className="fr-founder-card">
                <img src={IMG.founder} alt="Арай Жузенова — основательница Buddha Spa" className="fr-founder-ph" style={{ width: 150, height: 150 }} />
                <div>
                  <EditableText as="div" contentKey="fr.founder.role" fallback={t('Основательница Buddha Spa')} className="fr-founder-role" />
                  <EditableText as="h4" contentKey="fr.founder.name" fallback="Арай Жузенова" translate={false} />
                  <EditableText as="p" contentKey="fr.founder.bio" fallback={t('С самого начала Арай хотела создать место, где забота о теле становится заботой о внутреннем состоянии человека. Buddha Spa — это результат её видения: пространство тишины, присутствия и настоящей перезагрузки.')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section id="req" className="sec" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="wrap" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 52px' }}>
            <EditableText as="span" contentKey="fr.req.eyebrow" fallback={t('Требования к партнёру')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.req.title" fallback={t('Кому подходит')} className="rv h2" />
          </div>
          <div className="rv" style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="fr-req-badge"><span className="dot">✦</span><EditableText as="span" contentKey="fr.req.badge" fallback={t('Вам подойдёт, если')} className="lbl" /></div>
            <ul className="fr-req">{REQS.map((r, i) => (<li key={r}><span>✦</span><EditableText as="span" contentKey={`fr.req.${i}`} fallback={t(r)} /></li>))}</ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="sec fr-cta">
        <img src={IMG.f1} alt="" />
        <div className="fr-cta-grad" />
        <div className="wrap fr-cta-inner">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
            <EditableText as="span" contentKey="fr.cta.eyebrow" fallback={t('Первый шаг')} className="rv eyebrow" />
            <EditableText as="h2" contentKey="fr.cta.title" fallback={t('Оставьте заявку. Расчёт — за 30 минут.')} className="rv h2" style={{ color: 'var(--fr-cream)' }} />
            <EditableText as="p" contentKey="fr.cta.lead" fallback={t('Узнайте, подходит ли ваш город для открытия Buddha Spa.')} className="rv lead" style={{ margin: '20px auto 0', maxWidth: 480 }} />
          </div>
          <div className="fr-cta-grid">
            <div className="rv">
              <p style={{ fontSize: 13.5, color: 'rgba(243,233,218,.6)', margin: '0 0 20px' }}>{t('После получения заявки мы:')}</p>
              <ul className="fr-cta-list">
                {['Свяжемся в течение 30 минут в рабочее время', 'Покажем финансовую модель под ваш город', 'Пригласим на встречу с основательницей — офлайн или онлайн'].map((s, i) => (
                  <li key={i}><span>→</span><EditableText as="span" contentKey={`fr.cta.li.${i}`} fallback={t(s)} /></li>
                ))}
              </ul>
              <div style={{ marginTop: 36, paddingTop: 30, borderTop: '1px solid var(--fr-line)' }}>
                <p style={{ font: '600 10px/1 Manrope', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(243,233,218,.42)', margin: '0 0 14px' }}>{t('Или напишите напрямую')}</p>
                <a href="https://wa.me/77019898001" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 14, fontWeight: 600 }}>WhatsApp →</a>
              </div>
            </div>
            <div className="rv fr-form">
              {!sent ? (
                <form onSubmit={onFranchiseSubmit}>
                  <EditableText as="div" contentKey="fr.form.title" fallback={t('Расскажите о себе')} className="fr-form-title" />
                  <div className="fr-form-fields">
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
                    <div><label>{t('Ваше имя')}</label><input type="text" name="name" required placeholder={t('Как к вам обращаться?')} /></div>
                    <div><label>{t('Телефон / WhatsApp')}</label><input type="tel" name="phone" required placeholder="+7 ___ ___ __ __" /></div>
                    <div><label>{t('Ваш город')}</label>
                      <select name="city">{[
                        'Выберите город',
                        'Алматы', 'Астана', 'Шымкент', 'Актобе', 'Актау',
                        'Атырау', 'Тараз', 'Семей', 'Павлодар', 'Усть-Каменогорск',
                        'Костанай', 'Кызылорда', 'Петропавловск', 'Уральск',
                        'Туркестан', 'Кокшетау', 'Талдыкорган', 'Темиртау',
                        'Экибастуз', 'Жезказган', 'Балхаш', 'Рудный',
                        'Жанаозен', 'Кентау', 'Другой город',
                      ].map((o) => (<option key={o}>{t(o)}</option>))}</select>
                    </div>
                    <div><label>{t('Располагаемый капитал')}</label>
                      <select name="capital">{['Выберите диапазон', 'До 80 млн ₸', '80–120 млн ₸', '120–200 млн ₸', 'Более 200 млн ₸'].map((o) => (<option key={o}>{t(o)}</option>))}</select>
                    </div>
                    <div><label>{t('У вас есть помещение?')}</label>
                      <select name="premises">{['Выберите вариант', 'У меня есть помещение', 'Буду арендовать'].map((o) => (<option key={o}>{t(o)}</option>))}</select>
                    </div>
                    {sendError && <p style={{ color: '#e0a3a3', fontSize: 13, margin: '4px 0 0' }}>{sendError}</p>}
                    <button type="submit" className="btn" disabled={sending} style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>{sending ? t('Отправляем…') : t('Оставить заявку →')}</button>
                  </div>
                </form>
              ) : (
                <div className="fr-confirm">
                  <div className="ring"><span /></div>
                  <h3>{t('Заявка принята')}</h3>
                  <p>{t('Мы свяжемся с вами в течение 30 минут в рабочее время.')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenLegal={(slug) => setLegal(slug)} />

      {legal && <LegalModal slug={legal} onClose={() => setLegal(null)} />}
    </div>
  )
}
