/* ==========================================================================
   lang.js — 界面语言层（中文 / English / Français）
   职责：
     1. 维护 UI 词典 UI[key] = [zh, en, fr]
     2. 把 <html data-lang> 上的语言应用到所有 data-i18n* 元素
     3. 在导航右侧注入语言切换器
     4. 提供 t(key) / fmtDate(iso) / on(cb) 给 app.js 与各页脚本使用
   页面用法（声明式，无需写 JS）：
     <span data-i18n="nav.home">首页</span>
     <button data-i18n-attr="title:btn.reset.title;aria-label:btn.reset.aria">…</button>
     <span data-i18n-html="my.block">…（允许内部 HTML）…</span>
     内容型双语（中文讲解 + 英文/法文对照，由 lang.js 自动控制显示）：
     <div class="zh" data-lang-zh>中文讲解…</div>
     <div class="en" data-lang-alt="en">English explanation…</div>
     <div class="fr" data-lang-alt="fr">Explication en français…</div>
     —— 当界面语言为 en 时只显示 data-lang-alt="en" 的块，为 zh 时只显示 data-lang-zh 块。
   注意：本文件由多个队友共同扩展，每个页面组的 key 请写在自己那一节里，不要重排既有 key。
   ========================================================================== */
(function () {
  'use strict';

  var SUPPORTED = ['zh', 'en', 'fr'];
  var NAMES = { zh: '中文', en: 'English', fr: 'Français' };
  var STORE = 'fr.ui.lang';

  /* ======================= 1. 通用 UI 词典 ======================= */
  /* 格式：'key': ['中文', 'English', 'Français'] */
  var UI = {
    /* ---- 导航与全局（lead 维护） ---- */
    'brand': ['法语 B2 · 一年计划', 'French B2 · One-Year Plan', 'Français B2 · Programme d\'un an'],
    'nav.home': ['首页', 'Home', 'Accueil'],
    'nav.calendar': ['52周计划', '52-Week Plan', 'Plan de 52 semaines'],
    'nav.phonetics': ['发音', 'Pronunciation', 'Prononciation'],
    'nav.grammar': ['语法', 'Grammar', 'Grammaire'],
    'nav.vocab': ['词汇', 'Vocabulary', 'Vocabulaire'],
    'nav.dialogue': ['对话', 'Dialogues', 'Dialogues'],
    'nav.exams': ['考试', 'Exam', 'Examen'],
    'nav.main': ['主导航', 'Main navigation', 'Navigation principale'],
    'lang.label': ['语言', 'Language', 'Langue'],
    'lang.switch': ['切换界面语言', 'Switch interface language', 'Changer la langue de l\'interface'],

    /* ---- 动态生成内容 / JS 文案（lead 维护） ---- */
    'week.range': ['—', '—', '—'], /* 占位，实际由 fmtDate 拼装 */
    'week.week': ['第 {n} 周', 'Week {n}', 'Semaine {n}'],
    'week.done': ['已完成', 'Completed', 'Terminé'],
    'week.todo': ['待学习', 'To do', 'À faire'],
    'btn.reset': ['清空打卡记录', 'Clear progress', 'Réinitialiser la progression'],
    'btn.reset.title': ['清空已完成周的打卡记录', 'Clear all checked weeks', 'Effacer toutes les semaines cochées'],
    'btn.reset.aria': ['清空打卡记录', 'Clear progress', 'Réinitialiser la progression'],
    'confirm.reset': ['确定清空全部打卡记录吗？此操作只影响本机浏览器。',
      'Clear all checked weeks? This only affects this browser.',
      'Effacer toutes les semaines cochées ? Cela n\'affecte que ce navigateur.'],
    'speak.title': ['朗读', 'Read aloud', 'Lire à voix haute'],
    'speak.aria': ['朗读法语', 'Read French aloud', 'Lire le français à voix haute'],
    'reveal.show': ['显示答案', 'Show answer', 'Afficher la réponse'],
    'reveal.hide': ['收起答案', 'Hide answer', 'Masquer la réponse'],
    'detail.hint': ['点一个周次，看这一周要做什么', 'Click a week to see what to do', 'Cliquez sur une semaine pour voir le programme'],
    'detail.date': ['{a} – {b}', '{a} – {b}', '{a} – {b}'],
    'print': ['打印本页', 'Print this page', 'Imprimer cette page'],
    'foot.plan': ['「法语 B2 · 一年计划」是一个纯静态学习站，进度保存在你的浏览器本地。© <span id="year"></span>',
      '"French B2 · One-Year Plan" is a fully static site. Your progress is stored locally in this browser. © <span id="year"></span>',
      '« Français B2 · Programme d\'un an » est un site entièrement statique. Votre progression est enregistrée dans ce navigateur. © <span id="year"></span>'],

    /* ---- 阶段名（lead 维护） ---- */
    'phase.a1': ['第一阶段 · 基础夯实（A1）', 'Phase 1 · Foundations (A1)', 'Phase 1 · Bases (A1)'],
    'phase.a2': ['第二阶段 · 日常流畅（A2）', 'Phase 2 · Everyday fluency (A2)', 'Phase 2 · Aisance quotidienne (A2)'],
    'phase.b1': ['第三阶段 · 独立表达（B1）', 'Phase 3 · Independent use (B1)', 'Phase 3 · Expression autonome (B1)'],
    'phase.b2': ['第四阶段 · 论述与灵活（B2）', 'Phase 4 · Argumentation & flexibility (B2)', 'Phase 4 · Argumentation et souplesse (B2)'],

    /* ---- 起始位置 / 自评（lead 维护） ---- */
    'start.title': ['我要从哪里开始', 'Where do I start?', 'Où commencer ?'],
    'start.help': ['先做下面的 60 秒自评，或直接选起始周。设定后：进度条的起点会前移、日历里起始周之前的周次标记为已掌握，日期也按新起点重算。',
      'Take the 60-second self-check below, or pick a starting week directly. Either way the progress bar starts further along, earlier weeks are marked as mastered, and all dates are recalculated from the new starting point.',
      'Faites le test de 60 secondes ci-dessous, ou choisissez directement une semaine de départ. Dans les deux cas, la barre de progression démarre plus loin, les semaines antérieures sont marquées comme acquises et les dates sont recalculées.'],
    'start.weekLabel': ['起始周次', 'Starting week', 'Semaine de départ'],
    'start.apply': ['设为起始位置', 'Set as starting point', 'Définir comme point de départ'],
    'start.current': ['当前起始位置', 'Current starting point', 'Point de départ actuel'],
    'start.remaining': ['从起点起还需学习', 'Weeks to go from your starting point', 'Semaines restantes depuis votre point de départ'],
    'start.weeks': ['周', 'weeks', 'semaines'],
    'start.autoNote': ['未自定义时，默认从第 1 周开始。', 'If you never set it, the plan starts at week 1.', 'Sans réglage, le programme commence à la semaine 1.'],
    'pl.title': ['60 秒自评：你现在在哪一级', '60-second self-check: what is your level?', 'Auto-évaluation en 60 secondes : quel est votre niveau ?'],
    'pl.help': ['选最符合你现在情况的描述（不确定就选更低的），系统会把起始位置设到对应段落。',
      'Pick the description that fits you best (if unsure, pick the lower one). The starting point moves to the matching phase.',
      'Choisissez la description qui vous correspond (en cas de doute, prenez la plus basse). Le point de départ se place sur la phase correspondante.'],
    'pl.from': ['建议起点', 'Suggested start', 'Départ conseillé'],
    'pl.chosen': ['已按自评把起点设为第 {week} 周。', 'Starting point set to week {week}.', 'Point de départ réglé à la semaine {week}.'],
    'pl.addToCal': ['把起点周的任务抄进日历，然后每周打勾即可。', 'Copy that week\'s tasks into your calendar, then check off each week.', 'Recopiez les tâches de cette semaine dans votre agenda, puis cochez chaque semaine.'],
    'pl.name.a0': ['完全零基础', 'Absolute beginner', 'Grand débutant'],
    'pl.name.a1': ['学过一点', 'False beginner', 'Faux débutant'],
    'pl.name.a2': ['能应付日常', 'Everyday survival', 'Niveau survie quotidien'],
    'pl.name.b1': ['能聊但吃力', 'Conversational but shaky', 'Conversationnel mais hésitant'],
    'pl.name.b2': ['接近 B2', 'Nearly B2', 'Presque B2'],
    'pl.desc.a0': ['字母和读音都不熟，几乎不会说。', 'I do not know the alphabet or sounds, and can barely speak.', 'Je ne connais ni l\'alphabet ni les sons, je parle à peine.'],
    'pl.desc.a1': ['会打招呼、自我介绍一下，但句子说不完整。', 'I can greet and introduce myself, but cannot build full sentences.', 'Je peux saluer et me présenter, mais je ne fais pas de phrases complètes.'],
    'pl.desc.a2': ['能点餐、问路、讲过去的事，但错误多、词汇有限。', 'I can order, ask directions and talk about the past, with many mistakes and limited vocabulary.', 'Je peux commander, demander mon chemin et parler du passé, avec beaucoup d\'erreurs et un vocabulaire limité.'],
    'pl.desc.b1': ['能就熟悉话题聊几分钟，但抽象话题卡壳、写作没结构。', 'I can talk for minutes on familiar topics, but stall on abstract ones and my writing lacks structure.', 'Je peux parler quelques minutes de sujets familiers, mais je bloque sur l\'abstrait et mes écrits manquent de structure.'],
    'pl.desc.b2': ['能读懂报刊长文、写出有结构的文章，只差考试技巧与精度。', 'I can read long press articles and write structured texts; I mainly lack exam technique and precision.', 'Je lis de longs articles de presse et j\'écris des textes structurés ; il me manque surtout la technique d\'examen et la précision.'],
    'place.card': ['设为我的水平', 'Set as my level', 'Définir comme mon niveau'],
    'place.selected': ['已选择', 'Selected', 'Sélectionné'],

    /* ==== PHONETICS / EXAMS（phon-exam 维护，前缀 phon. / ex.） ==== */

    /* ---- exams.html：首屏 / 按钮 ---- */
    'ex.hero.eyebrow': ['模块二 · DELF B2 考试', 'Module 2 · The DELF B2 exam', 'Module 2 · L\'examen DELF B2'],
    'ex.hero.h1': ['DELF B2 完全攻略：从评分表倒推怎么学',
      'DELF B2: the complete guide — work backwards from the marking grid',
      'DELF B2 : le guide complet — partir de la grille d\'évaluation'],
    'ex.hero.lede': ['这一页按「考什么 → 怎么评 → 怎么练 → 怎么模考」的顺序展开：考试结构与评分表、听力与阅读各专项的真题风格练习（含原文、题目与逐题解析）、写作三档范文对照、口语表达库与 6 个主题提纲、<strong>4 套完整模拟卷</strong>、最后 8 周冲刺表和资源清单。<span class="muted">所有法语段落旁都有朗读按钮，可先盲听再对照文本。</span>',
      'This page follows one order: what is tested → how it is marked → how to train → how to sit a full mock. It covers the exam structure and marking grids, exam-style listening and reading practice (transcripts, questions, explained answers), three graded model essays, an oral phrase bank with six topic outlines, <strong>4 complete mock papers</strong>, an 8-week final sprint and a resource list.<span class="muted">Every French passage has a read-aloud button: listen blind first, then check the text.</span>',
      'Cette page suit un ordre précis : ce qui est évalué → comment c\'est noté → comment s\'entraîner → comment passer un sujet blanc complet. Elle couvre la structure de l\'examen et les grilles d\'évaluation, des exercices d\'oral et d\'écrit au format DELF (transcriptions, questions, corrigés expliqués), trois copies modèles notées, une banque d\'expressions orales avec six plans de sujets, <strong>4 sujets blancs complets</strong>, un sprint final de 8 semaines et une liste de ressources.<span class="muted">Chaque passage en français dispose d\'un bouton de lecture : écoutez d\'abord sans le texte, puis vérifiez.</span>'],
    'ex.cta.sujets': ['直接做 4 套模拟卷', 'Go straight to the 4 mock papers', 'Passer aux 4 sujets blancs'],
    'ex.cta.bareme': ['看评分细则', 'See the marking criteria', 'Voir les critères d\'évaluation'],
    'ex.cta.phonetics': ['先补发音与联诵', 'Start with sounds and liaison', 'Commencer par les sons et la liaison'],
    'ex.cta.calendar': ['对照 52 周计划', 'Compare with the 52-week plan', 'Comparer avec le plan de 52 semaines'],
    'ex.cta.back': ['回去做模拟卷', 'Back to the mock papers', 'Retour aux sujets blancs'],
    'ex.cta.phonetics2': ['补发音与联诵', 'Sounds and liaison', 'Sons et liaison'],
    'ex.cta.grammar': ['B1–B2 语法', 'B1–B2 grammar', 'Grammaire B1–B2'],
    'ex.cta.top': ['回到本页顶部', 'Back to top', 'Revenir en haut'],

    /* ---- exams.html：章节标题 ---- */
    'ex.h2.b2': ['一、B2 到底要求什么', '1 · What B2 actually requires', '1 · Ce que le B2 exige vraiment'],
    'ex.h2.structure': ['二、考试结构', '2 · Exam structure', '2 · Structure de l\'examen'],
    'ex.h2.bareme': ['三、评分细则', '3 · Marking criteria', '3 · Les critères d\'évaluation'],
    'ex.h2.ecoute': ['四、听力专项', '4 · Listening', '4 · Compréhension de l\'oral'],
    'ex.h2.lecture': ['五、阅读专项', '5 · Reading', '5 · Compréhension des écrits'],
    'ex.h2.ecrit': ['六、写作专项', '6 · Writing', '6 · Production écrite'],
    'ex.h2.oral': ['七、口语专项', '7 · Speaking', '7 · Production orale'],
    'ex.h2.sujets': ['八、4 套完整模拟卷', '8 · Four complete mock papers', '8 · Quatre sujets blancs complets'],
    'ex.h2.plan8': ['九、模考安排与 8 周冲刺', '9 · Mock exams and the 8-week sprint', '9 · Passer l\'examen et sprint de 8 semaines'],
    'ex.h2.ressources': ['十、资源清单', '10 · Resource list', '10 · Liste de ressources'],
    'ex.h3.1_1': ['1.1 CEFR 对 B2 的能力描述', '1.1 The CEFR descriptors for B2', '1.1 Les descripteurs CECRL du B2'],
    'ex.h3.1_2': ['1.2 B2 与 B1 的差距对照', '1.2 B2 and B1 side by side', '1.2 B2 et B1 en regard'],
    'ex.h3.2_1': ['2.1 四项一览表', '2.1 The four papers at a glance', '2.1 Les quatre épreuves en un coup d\'œil'],
    'ex.h3.2_2': ['2.2 总分与通过条件', '2.2 Total score and pass conditions', '2.2 Note totale et conditions de réussite'],
    'ex.h3.3_1': ['3.1 听力与阅读：客观题，机械给分', '3.1 Listening and reading: objective marking', '3.1 Oral et écrit : une notation objective'],
    'ex.h3.3_2': ['3.2 写作 25 分：五个维度，各 5 分', '3.2 Writing, 25 marks: five criteria worth 5 each', '3.2 Production écrite, 25 points : cinq critères de 5 points'],
    'ex.h3.3_3': ['3.3 口语 25 分：练习用评分表', '3.3 Speaking, 25 marks: a practice grid', '3.3 Production orale, 25 points : une grille d\'entraînement'],
    'ex.h3.4_1': ['4.1 题型与出题逻辑', '4.1 Task types and how questions are built', '4.1 Types de questions et logique de conception'],
    'ex.h3.4_2': ['4.2 两遍播放怎么用', '4.2 How to use the two playings', '4.2 Comment utiliser les deux écoutes'],
    'ex.h3.4_3': ['4.3 速记符号表（考前背熟）', '4.3 Shorthand symbols (learn them by heart)', '4.3 Tableau d\'abréviations (à mémoriser)'],
    'ex.h3.4_4': ['4.4 六类常见陷阱', '4.4 Six classic traps', '4.4 Six pièges classiques'],
    'ex.h3.4_5': ['4.5 Écoute 1 · 广播专题：远程办公', '4.5 Listening 1 · Radio feature: remote work', '4.5 Écoute 1 · Émission : le télétravail'],
    'ex.h3.4_6': ['4.6 Écoute 2 · 对话：选择交换项目', '4.6 Listening 2 · Dialogue: choosing an exchange', '4.6 Écoute 2 · Dialogue : choisir un échange'],
    'ex.h3.4_7': ['4.7 Écoute 3 · 报道：食品浪费', '4.7 Listening 3 · Report: food waste', '4.7 Écoute 3 · Reportage : le gaspillage alimentaire'],
    'ex.h3.4_8': ['4.8 Écoute 4 · 职场对话：调整上下班时间', '4.8 Listening 4 · Workplace dialogue: new hours', '4.8 Écoute 4 · Dialogue : modifier ses horaires'],
    'ex.h3.4_9': ['4.9 Écoute 5 · 播客：屏幕与青少年睡眠', '4.9 Listening 5 · Podcast: screens and teen sleep', '4.9 Écoute 5 · Podcast : écrans et sommeil des ados'],
    'ex.h3.4_10': ['4.10 Écoute 6 · 讨论：过度旅游', '4.10 Listening 6 · Panel: overtourism', '4.10 Écoute 6 · Débat : le tourisme de masse'],
    'ex.h3.5_1': ['5.1 三种题型与要求', '5.1 Three question types and what they require', '5.1 Trois types de questions et leurs exigences'],
    'ex.h3.5_2': ['5.2 长文阅读法：先建地图，再找答案', '5.2 Reading long texts: map first, then hunt', '5.2 Lire un texte long : la carte d\'abord'],
    'ex.h3.5_3': ['5.3 Texte 1 · 社会：四天工作制', '5.3 Text 1 · Society: the four-day week', '5.3 Texte 1 · Société : la semaine de quatre jours'],
    'ex.h3.5_4': ['5.4 Texte 2 · 环境：无车城市', '5.4 Text 2 · Environment: car-free cities', '5.4 Texte 2 · Environnement : les villes sans voiture'],
    'ex.h3.5_5': ['5.5 Texte 3 · 科技：人工智能与工作', '5.5 Text 3 · Technology: AI and work', '5.5 Texte 3 · Technologie : l\'IA et le travail'],
    'ex.h3.5_6': ['5.6 Texte 4 · 文化：流媒体与电影院', '5.6 Text 4 · Culture: streaming and cinemas', '5.6 Texte 4 · Culture : streaming et salles'],
    'ex.h3.6_1': ['6.1 两种题型', '6.1 The two task types', '6.1 Les deux types de sujet'],
    'ex.h3.6_2': ['6.2 五段式模板（约 250–280 词）', '6.2 Five-paragraph template (~250–280 words)', '6.2 Plan en cinq paragraphes (~250–280 mots)'],
    'ex.h3.6_3': ['6.3 高频逻辑连接词', '6.3 High-frequency logical connectors', '6.3 Connecteurs logiques fréquents'],
    'ex.h3.6_4': ['6.4 20 个 B2 写作高分句式', '6.4 Twenty top-scoring B2 sentence patterns', '6.4 Vingt structures qui rapportent des points'],
    'ex.h3.6_5': ['6.5 同题范文三档对照', '6.5 Three graded answers to the same prompt', '6.5 Trois copies notées sur le même sujet'],
    'ex.h3.7_1': ['7.1 考试流程', '7.1 How the exam runs', '7.1 Le déroulement de l\'épreuve'],
    'ex.h3.7_2': ['7.2 30 分钟准备时间怎么用', '7.2 How to use the 30 minutes of preparation', '7.2 Utiliser les 30 minutes de préparation'],
    'ex.h3.7_3': ['7.3 陈述结构模板（6 分钟版）', '7.3 Presentation template (6-minute version)', '7.3 Plan d\'exposé (version 6 minutes)'],
    'ex.h3.7_4': ['7.4 争取时间的表达', '7.4 Buying-time phrases', '7.4 Expressions pour gagner du temps'],
    'ex.h3.7_5': ['7.5 礼貌反驳与让步', '7.5 Polite disagreement and concession', '7.5 Contredire et concéder avec politesse'],
    'ex.h3.7_6': ['7.6 50 个口语高分表达', '7.6 Fifty high-scoring speaking phrases', '7.6 Cinquante expressions orales qui rapportent'],
    'ex.h3.7_7': ['7.7 六个模拟主题与论点提纲', '7.7 Six practice topics with argument outlines', '7.7 Six sujets d\'entraînement avec plans d\'arguments'],
    'ex.h3.9_1': ['9.1 报名与考试机会', '9.1 Registration and exam sessions', '9.1 Inscription et sessions d\'examen'],
    'ex.h3.9_2': ['9.2 成绩与通过规则', '9.2 Results and pass rules', '9.2 Résultats et règles de réussite'],
    'ex.h3.9_3': ['9.3 十种常见失败原因与对策', '9.3 Ten common reasons for failing — and the fixes', '9.3 Dix causes d\'échec fréquentes et leurs remèdes'],
    'ex.h3.9_4': ['9.4 最后 8 周冲刺表', '9.4 The final 8-week sprint plan', '9.4 Le plan de sprint des 8 dernières semaines'],
    'ex.h3.10_1': ['10.1 法语媒体（每天投入 20–40 分钟）', '10.1 French media (20–40 minutes a day)', '10.1 Médias francophones (20 à 40 min par jour)'],
    'ex.h3.10_2': ['10.2 教材与工具书', '10.2 Coursebooks and reference works', '10.2 Méthodes et ouvrages de référence'],
    'ex.h3.10_3': ['10.3 词典与学习工具', '10.3 Dictionaries and study tools', '10.3 Dictionnaires et outils d\'apprentissage'],
    'ex.h3.t1': ['听与读：理解复杂文本', 'Listening and reading: handling complex texts', 'Écouter et lire : comprendre des textes complexes'],
    'ex.h3.t2': ['说：自然互动 + 有条理陈述', 'Speaking: natural interaction and structured presentation', 'Parler : interagir naturellement et présenter avec méthode'],
    'ex.h3.t3': ['写：论说文与正式信函', 'Writing: argumentative texts and formal letters', 'Écrire : textes argumentés et lettres formelles'],
    'ex.h3.t4': ['语言的「分寸感」', 'The sense of nuance', 'Le sens de la nuance'],
    'ex.h3.t5': ['一天内完成四项', 'All four papers in one day', 'Les quatre épreuves le même jour'],
    'ex.h3.t6': ['约 4–8 周出结果', 'Results in about 4–8 weeks', 'Résultats en 4 à 8 semaines environ'],
    'ex.h3.t7': ['先读题，划关键词', 'Read the questions first, underline keywords', 'Lire d\'abord les questions, souligner les mots clés'],
    'ex.h3.t8': ['抓框架，不追细节', 'Catch the frame, not the details', 'Saisir la structure, pas les détails'],
    'ex.h3.t9': ['补第一遍的框架', 'Fill in the frame from the first playing', 'Compléter la structure de la première écoute'],
    'ex.h3.t10': ['逐题确认，写完整答案', 'Confirm each answer and write it out fully', 'Vérifier chaque réponse et la rédiger'],
    'ex.h3.t11': ['绝不空题', 'Never leave a blank', 'Ne jamais laisser de blanc'],
    'ex.h3.t12': ['先看题，不读文', 'Read the questions, not the text', 'Lire les questions, pas le texte'],
    'ex.h3.t13': ['Skimming：读三处', 'Skimming: read three places', 'Survol : lire trois endroits'],
    'ex.h3.t14': ['Scanning：定位后精读 2–3 句', 'Scanning: locate, then read 2–3 sentences closely', 'Repérage : localiser puis lire 2–3 phrases'],
    'ex.h3.t15': ['检查 + 誊写', 'Check and transfer your answers', 'Vérifier et recopier'],
    'ex.h3.t16': ['读文献两遍', 'Read the document twice', 'Lire le document deux fois'],
    'ex.h3.t17': ['确定立场', 'Choose your stance', 'Fixer votre position'],
    'ex.h3.t18': ['写提纲（只写关键词）', 'Write an outline (keywords only)', 'Rédiger un plan (mots clés seulement)'],
    'ex.h3.t19': ['准备「弹药」', 'Prepare your ammunition', 'Préparer vos munitions'],
    'ex.h3.t20': ['默述开场与结尾', 'Rehearse the opening and the ending', 'Répéter mentalement l\'ouverture et la conclusion'],
    'ex.h3.t21': ['模拟卷 1', 'Mock paper 1', 'Sujet blanc 1'],
    'ex.h3.t22': ['模拟卷 2', 'Mock paper 2', 'Sujet blanc 2'],
    'ex.h3.t23': ['模拟卷 3', 'Mock paper 3', 'Sujet blanc 3'],
    'ex.h3.t24': ['模拟卷 4', 'Mock paper 4', 'Sujet blanc 4'],
    'ex.h3.t25': ['算分方式', 'How the score is calculated', 'Comment le score est calculé'],
    'ex.h3.t26': ['没通过怎么办', 'What to do if you fail', 'Que faire en cas d\'échec'],
    'ex.h4.t1': ['范文 A · 13/25（及格线）', 'Model A · 13/25 (just passing)', 'Copie A · 13/25 (tout juste admis)'],
    'ex.h4.t2': ['范文 B · 17/25（良好）', 'Model B · 17/25 (good)', 'Copie B · 17/25 (bien)'],
    'ex.h4.t3': ['范文 C · 22/25（优秀）', 'Model C · 22/25 (excellent)', 'Copie C · 22/25 (excellent)'],
    'ex.h4.t4': ['A. 引出观点（10 句）', 'A. Stating an opinion (10)', 'A. Exprimer son point de vue (10)'],
    'ex.h4.t5': ['B. 举例与说明（8 句）', 'B. Giving examples and explaining (8)', 'B. Illustrer et expliquer (8)'],
    'ex.h4.t6': ['C. 让步与反驳（10 句）', 'C. Conceding and rebutting (10)', 'C. Concéder et réfuter (10)'],
    'ex.h4.t7': ['D. 强调与推进（8 句）', 'D. Emphasising and moving on (8)', 'D. Insister et avancer (8)'],
    'ex.h4.t8': ['E. 总结与收尾（7 句）', 'E. Summarising and closing (7)', 'E. Résumer et conclure (7)'],
    'ex.h4.t9': ['F. 争取时间与救场（7 句）', 'F. Buying time and rescuing yourself (7)', 'F. Gagner du temps et se rattraper (7)'],
    'ex.h4.t10': ['主题 1 · Le télétravail doit-il devenir la norme ?（远程办公应成为常态吗？）', 'Topic 1 · Should remote work become the norm?', 'Sujet 1 · Le télétravail doit-il devenir la norme ?'],
    'ex.h4.t11': ['主题 2 · Faut-il limiter l\'usage des écrans chez les adolescents ?（该限制青少年使用屏幕吗？）', 'Topic 2 · Should teenagers\' screen time be limited?', 'Sujet 2 · Faut-il limiter l\'usage des écrans chez les adolescents ?'],
    'ex.h4.t12': ['主题 3 · Le tourisme de masse : faut-il le réguler ?（大众旅游需要管制吗？）', 'Topic 3 · Mass tourism: should it be regulated?', 'Sujet 3 · Le tourisme de masse : faut-il le réguler ?'],
    'ex.h4.t13': ['主题 4 · Faut-il autoriser l\'intelligence artificielle dans les devoirs ?（作业中该允许使用 AI 吗？）', 'Topic 4 · Should AI be allowed for homework?', 'Sujet 4 · Faut-il autoriser l\'intelligence artificielle dans les devoirs ?'],
    'ex.h4.t14': ['主题 5 · Faut-il rendre les transports publics gratuits ?（公共交通该免费吗？）', 'Topic 5 · Should public transport be free?', 'Sujet 5 · Faut-il rendre les transports publics gratuits ?'],
    'ex.h4.t15': ['主题 6 · Le livre papier a-t-il encore un avenir ?（纸质书还有未来吗？）', 'Topic 6 · Do printed books still have a future?', 'Sujet 6 · Le livre papier a-t-il encore un avenir ?'],
    'ex.h4.t16': ['Partie 1 · 听力（原文，播放两遍后再做题）', 'Part 1 · Listening (transcript; listen twice before answering)', 'Partie 1 · Compréhension de l\'oral (transcription ; deux écoutes)'],
    'ex.h4.t17': ['Partie 2 · 阅读', 'Part 2 · Reading', 'Partie 2 · Compréhension des écrits'],
    'ex.h4.t18': ['Partie 3 · 写作（60 分钟，约 250 词）', 'Part 3 · Writing (60 min, ~250 words)', 'Partie 3 · Production écrite (60 min, environ 250 mots)'],
    'ex.h4.t19': ['Partie 4 · 口语（准备 30 分钟 + 陈述 6 分钟 + 答辩 12 分钟）', 'Part 4 · Speaking (30 min prep + 6 min talk + 12 min Q&A)', 'Partie 4 · Production orale (30 min de préparation + 6 min d\'exposé + 12 min d\'entretien)'],
    'ex.h4.t20': ['Partie 3 · 写作（60 分钟，约 250 词，正式信函）', 'Part 3 · Writing (60 min, ~250 words, formal letter)', 'Partie 3 · Production écrite (60 min, environ 250 mots, lettre formelle)'],

    /* ---- exams.html：表头 ---- */
    'ex.th.item': ['单项', 'Paper', 'Épreuve'],
    'ex.th.duration': ['时长', 'Duration', 'Durée'],
    'ex.th.format': ['形式', 'Format', 'Format'],
    'ex.th.mark': ['满分', 'Out of', 'Barème'],
    'ex.th.tip': ['关键提示', 'Key tip', 'Conseil clé'],
    'ex.th.dimension': ['维度', 'Criterion', 'Critère'],
    'ex.th.points': ['分值', 'Marks', 'Points'],
    'ex.th.look': ['具体看什么', 'What is assessed', 'Ce qui est évalué'],
    'ex.th.action': ['拿分动作', 'How to score', 'Comment marquer des points'],
    'ex.th.examiner': ['考官在听什么', 'What the examiner listens for', 'Ce que l\'examinateur écoute'],
    'ex.th.item2': ['项目', 'Item', 'Élément'],
    'ex.th.breakdown': ['分值构成', 'Mark breakdown', 'Répartition des points'],
    'ex.th.avoid': ['必须避免', 'Must avoid', 'À éviter absolument'],
    'ex.th.explanation': ['说明', 'Notes', 'Remarques'],
    'ex.th.caution': ['注意事项', 'Watch out', 'Points de vigilance'],
    'ex.th.trap': ['陷阱', 'Trap', 'Piège'],
    'ex.th.howtrap': ['怎么设套', 'How it traps you', 'Comment le piège est posé'],
    'ex.th.break': ['破解方法', 'How to break it', 'Comment le déjouer'],
    'ex.th.symbol': ['符号', 'Symbol', 'Symbole'],
    'ex.th.meaning': ['含义', 'Meaning', 'Signification'],
    'ex.th.type': ['题型', 'Task type', 'Type d\'exercice'],
    'ex.th.requirement': ['要求', 'Requirement', 'Exigence'],
    'ex.th.keypoint': ['拿分要点', 'Key scoring points', 'Points qui rapportent'],
    'ex.th.function': ['功能', 'Function', 'Fonction'],
    'ex.th.connector': ['连接词', 'Connector', 'Connecteur'],
    'ex.th.zh': ['中文', 'Chinese', 'Chinois'],
    'ex.th.usage': ['用法提示', 'Usage note', 'Note d\'usage'],
    'ex.th.pattern': ['句式', 'Sentence pattern', 'Structure de phrase'],
    'ex.th.where': ['用在哪一段', 'Where to use it', 'Où l\'utiliser'],
    'ex.th.expression': ['表达', 'Phrase', 'Expression'],
    'ex.th.resource': ['资源', 'Resource', 'Ressource'],
    'ex.th.kind': ['类型', 'Type', 'Type'],
    'ex.th.level': ['适用等级', 'Level', 'Niveau'],
    'ex.th.howto': ['具体用法', 'How to use it', 'Comment l\'utiliser'],
    'ex.th.week': ['周', 'Week', 'Semaine'],
    'ex.th.focus': ['本周重点', 'Focus of the week', 'Priorité de la semaine'],
    'ex.th.daily': ['每日任务（约 90 分钟）', 'Daily task (~90 min)', 'Tâche quotidienne (~90 min)'],
    'ex.th.weekend': ['周末任务', 'Weekend task', 'Tâche du week-end'],
    'ex.th.check': ['达标检查', 'Check', 'Contrôle'],
    'ex.th.reason': ['失败原因', 'Cause of failure', 'Cause d\'échec'],
    'ex.th.symptom': ['典型表现', 'Typical sign', 'Symptôme typique'],
    'ex.th.counter': ['对策', 'Fix', 'Remède'],
    'ex.th.part': ['部分', 'Part', 'Partie'],
    'ex.th.time': ['时间', 'Time', 'Temps'],
    'ex.th.todo': ['要做什么', 'What to do', 'Ce qu\'il faut faire'],
    'ex.th.when': ['什么时候用', 'When to use it', 'Quand l\'utiliser'],
    'ex.th.force': ['语气强度', 'Tone strength', 'Force du ton'],
    'ex.th.stage': ['环节', 'Stage', 'Étape'],
    'ex.th.content': ['内容', 'Content', 'Contenu'],
    'ex.th.scoring': ['评分关联', 'Link to marking', 'Lien avec la notation'],
    'ex.th.cue': ['题干标志', 'Prompt cue', 'Indice dans la consigne'],
    'ex.th.structure': ['结构', 'Structure', 'Structure'],
    'ex.th.register': ['语体与格式', 'Register and format', 'Registre et format'],
    'ex.th.pitfall': ['常见陷阱', 'Common trap', 'Piège fréquent'],
    'ex.th.formula': ['可套用的句式', 'Ready-made sentence', 'Phrase à réutiliser'],
    'ex.th.example': ['录音中的例子', 'Example in the recording', 'Exemple dans l\'enregistrement'],
    'ex.th.youwrite': ['你会记下', 'What you write', 'Ce que vous notez'],
    'ex.th.words': ['词数', 'Words', 'Mots'],
    'ex.th.num': ['#', '#', '#'],

    /* ==== LEARN / QUIZ / WRONG BOOK（lead 维护，前缀 learn. / wrong.） ==== */
    'learn.title': ['按日学习', 'Day-by-day study', 'Étude jour par jour'],
    'learn.lede': ['下面 364 个格子对应一年里的每一天：点某一天打开当天的学习内容，一条一条推进知识点，每条约 20–30 分钟。每条知识点都配了从真题风格改写的例题，答完立刻判对错；答错会自动收进下面的错题本，供你日后重做。',
      'The 364 cells below are the days of your year. Click a day to open its content and move through the knowledge points one at a time (about 20–30 minutes each). Every point comes with exam-style practice questions that are marked instantly; anything you get wrong goes straight into the error log below for later review.',
      'Les 364 cases ci-dessous correspondent aux jours de votre année. Cliquez sur un jour pour ouvrir son contenu et avancer point par point (environ 20 à 30 minutes chacun). Chaque point est accompagné d\'exercices de type examen corrigés instantanément ; toute erreur est ajoutée au carnet d\'erreurs ci-dessous pour être revue plus tard.'],
    'learn.today': ['今天', 'Today', 'Aujourd\'hui'],
    'learn.todayIs': ['今天 → 第 {w} 周 第 {d} 天', 'Today → week {w}, day {d}', 'Aujourd\'hui → semaine {w}, jour {d}'],
    'learn.weekDay': ['第 {w} 周 · 第 {d} 天', 'Week {w} · day {d}', 'Semaine {w} · jour {d}'],
    'learn.stepProgress': ['已完成 {done}/{total} 条', '{done}/{total} done', '{done}/{total} terminés'],
    'learn.legend': ['灰=未开始　蓝框=今天　浅蓝=进行中　绿=当天已完成　红点=有错题',
      'Grey = not started · blue outline = today · light blue = in progress · green = day complete · red dot = has errors',
      'Gris = non commencé · contour bleu = aujourd\'hui · bleu clair = en cours · vert = journée terminée · point rouge = erreurs'],
    'learn.prevStep': ['上一条', 'Previous', 'Précédent'],
    'learn.nextStep': ['下一条', 'Next', 'Suivant'],
    'learn.markStepDone': ['标记本条已学完', 'Mark this point as done', 'Marquer ce point comme fait'],
    'learn.stepDone': ['本条已学完', 'Point completed', 'Point terminé'],
    'learn.openSource': ['打开对应资料', 'Open the source material', 'Ouvrir la ressource'],
    'learn.weekOverview': ['看本周计划', 'See the weekly plan', 'Voir le plan de la semaine'],
    'learn.practice': ['例题与自测', 'Practice questions', 'Exercices et auto-évaluation'],
    'learn.right': ['答对了', 'Correct', 'Correct'],
    'learn.wrong': ['答错了', 'Incorrect', 'Incorrect'],
    'learn.answerIs': ['正确答案：', 'Correct answer: ', 'Bonne réponse : '],
    'learn.addedToWrong': ['已加入错题本，可在下方重做。', 'Added to your error log below for review.', 'Ajouté au carnet d\'erreurs ci-dessous.'],
    'learn.dayComplete': ['今天的内容全部完成，可以收工了。', 'Everything for today is done. Nice work.', 'Tout est fait pour aujourd\'hui. Bravo.'],
    'learn.noContent': ['这一天还没有内容数据。', 'No content data for this day yet.', 'Pas encore de contenu pour ce jour.'],
    'learn.examTitle': ['真题风格练习', 'Exam-style practice', 'Exercice type examen'],
    'learn.playExam': ['播放原文', 'Play the text', 'Écouter le texte'],
    'learn.playSlow': ['慢速', 'Slow', 'Lent'],
    'learn.selfCheck': ['参考答案与自评标准', 'Model answer & self-assessment', 'Corrigé et auto-évaluation'],
    'learn.type.vocab': ['词汇', 'Vocabulary', 'Vocabulaire'],
    'learn.type.grammar': ['语法', 'Grammar', 'Grammaire'],
    'learn.type.listen': ['精听', 'Listening', 'Écoute'],
    'learn.type.speak': ['口语', 'Speaking', 'Oral'],
    'learn.type.read': ['阅读', 'Reading', 'Lecture'],
    'learn.type.write': ['写作', 'Writing', 'Écrit'],
    'learn.type.review': ['复盘', 'Review', 'Révision'],
    'learn.type.other': ['练习', 'Practice', 'Exercice'],
    'wrong.title': ['错题本', 'Error log', 'Carnet d\'erreurs'],
    'wrong.stats': ['共 {n} 道错题 · 历史正确率 {acc}%（已作答 {answered} 题）',
      '{n} errors · overall accuracy {acc}% ({answered} answered)',
      '{n} erreurs · précision globale {acc} % ({answered} répondues)'],
    'wrong.empty': ['还没有错题。去上面点开今天的内容，做几道例题吧。',
      'No errors yet. Open today\'s content above and try some questions.',
      'Aucune erreur pour l\'instant. Ouvrez le contenu du jour ci-dessus.'],
    'wrong.remove': ['移出错题本', 'Remove from the log', 'Retirer du carnet'],
    'wrong.clear': ['清空错题本', 'Clear the error log', 'Vider le carnet'],
    'wrong.confirmClear': ['确定清空全部错题吗？此操作只影响本机浏览器。',
      'Clear the whole error log? This only affects this browser.',
      'Vider tout le carnet ? Cela n\'affecte que ce navigateur.'],

    /* ---- phonetics.html：首屏 / 按钮 ---- */
    'phon.hero.eyebrow': ['模块一 · 发音与拼读', 'Module 1 · Sounds and spelling', 'Module 1 · Sons et orthographe'],
    'phon.hero.h1': ['先把嘴练对，再让词汇量起飞',
      'Get the sounds right first, then let vocabulary take off',
      'D\'abord les sons : le vocabulaire décollera ensuite'],
    'phon.hero.lede': ['法语最大的红利是<strong>音形对应极强</strong>：看到拼写能读、听到读音能拼，是法语区别于英语的核心优势。这一页把字母表、36 个音素、元音对立、鼻化元音、联诵、节奏语调、中国人专属陷阱和 14 天突击计划一次讲全。<span class="muted">页面中所有法语词都可以点击朗读（浏览器离线语音合成）。</span>',
      'The great gift of French is how <strong>predictable its spelling-to-sound mapping is</strong>: see a word and you can read it, hear a word and you can spell it. That is what sets French apart from English. This page covers the alphabet, the 36 phonemes, vowel contrasts, nasal vowels, liaison, rhythm and intonation, the traps Chinese speakers fall into, and a 14-day crash plan.<span class="muted">Every French word on this page can be clicked and read aloud (offline browser speech synthesis).</span>',
      'Le grand atout du français, c\'est la <strong>régularité de ses correspondances son-orthographe</strong> : ce que vous voyez, vous savez le lire ; ce que vous entendez, vous savez l\'écrire. C\'est ce qui le distingue de l\'anglais. Cette page couvre l\'alphabet, les 36 phonèmes, les oppositions vocaliques, les voyelles nasales, la liaison, le rythme et l\'intonation, les pièges propres aux sinophones et un plan intensif de 14 jours.<span class="muted">Chaque mot français de cette page peut être écouté d\'un clic (synthèse vocale hors ligne du navigateur).</span>'],
    'phon.btn.syllables': ['听示范音节', 'Hear model syllables', 'Écouter des syllabes modèles'],
    'phon.cta.plan14': ['直接看 14 天突击计划', 'Go to the 14-day crash plan', 'Voir le plan intensif de 14 jours'],
    'phon.cta.lecture': ['跳到拼读实战', 'Jump to decoding practice', 'Aller à la lecture à voix haute'],
    'phon.cta.grammar': ['配套语法 A1–A2', 'Companion grammar A1–A2', 'Grammaire complémentaire A1–A2'],
    'phon.cta.vocab': ['配套词汇表', 'Companion vocabulary list', 'Liste de vocabulaire complémentaire'],
    'phon.cta.home': ['回到学习中心', 'Back to the learning hub', 'Retour au centre d\'apprentissage'],
    'phon.cta.exams': ['进入 DELF B2 考试攻略', 'Go to the DELF B2 guide', 'Aller au guide DELF B2'],
    'phon.cta.dialogue': ['去练情境对话', 'Practise with dialogues', 'S\'entraîner avec des dialogues'],
    'phon.cta.top': ['回到本页顶部', 'Back to top', 'Revenir en haut'],

    /* ---- phonetics.html：章节标题 ---- */
    'phon.h2.pourquoi': ['一、为什么先学发音', '1 · Why start with pronunciation', '1 · Pourquoi commencer par les sons'],
    'phon.h2.alphabet': ['二、字母表与音符', '2 · Alphabet and accents', '2 · Alphabet et accents'],
    'phon.h2.phonemes': ['三、36 音素总表', '3 · The 36 phonemes', '3 · Les 36 phonèmes'],
    'phon.h2.voyelles': ['四、元音详解', '4 · Vowels in detail', '4 · Les voyelles en détail'],
    'phon.h2.nasales': ['五、鼻化元音', '5 · Nasal vowels', '5 · Voyelles nasales'],
    'phon.h2.semi-voyelles': ['六、半元音', '6 · Semi-vowels', '6 · Semi-voyelles'],
    'phon.h2.consonnes': ['七、辅音难点', '7 · Hard consonants', '7 · Les consonnes difficiles'],
    'phon.h2.liaison': ['八、联诵 liaison', '8 · Liaison', '8 · La liaison'],
    'phon.h2.enchainement': ['九、连音与省音', '9 · Enchaînement and elision', '9 · Enchaînement et élision'],
    'phon.h2.rythme': ['十、重音、节奏与语调', '10 · Stress, rhythm and intonation', '10 · Accent, rythme et intonation'],
    'phon.h2.pieges': ['十一、中国人发音陷阱', '11 · Pronunciation traps for Chinese speakers', '11 · Pièges de prononciation pour sinophones'],
    'phon.h2.lecture': ['十二、拼读实战', '12 · Decoding practice', '12 · Lecture à voix haute'],
    'phon.h2.plan14': ['十三、14 天突击计划', '13 · The 14-day crash plan', '13 · Plan intensif de 14 jours'],
    'phon.h3.1_1': ['1.1 法语的音形对应规律到底有多强', '1.1 How regular is French spelling-to-sound?', '1.1 La régularité des correspondances son-orthographe'],
    'phon.h3.1_2': ['1.2 先攻发音的六项收益', '1.2 Six payoffs from learning the sounds first', '1.2 Six bénéfices à commencer par les sons'],
    'phon.h3.1_3': ['1.3 学习顺序建议（按依赖关系排列）', '1.3 Suggested study order (by dependency)', '1.3 Ordre d\'apprentissage conseillé (par dépendances)'],
    'phon.h3.2_1': ['2.1 26 个字母的法语名称', '2.1 The French names of the 26 letters', '2.1 Le nom français des 26 lettres'],
    'phon.h3.2_2': ['2.2 带音符字母与音符的功能', '2.2 Accented letters and what accents do', '2.2 Lettres accentuées et rôle des accents'],
    'phon.h3.3_1': ['3.1 口腔元音（12 个）', '3.1 Oral vowels (12)', '3.1 Voyelles orales (12)'],
    'phon.h3.3_2': ['3.2 鼻化元音（4 个）', '3.2 Nasal vowels (4)', '3.2 Voyelles nasales (4)'],
    'phon.h3.3_3': ['3.3 半元音 / 滑音（3 个）', '3.3 Semi-vowels / glides (3)', '3.3 Semi-voyelles (3)'],
    'phon.h3.3_4': ['3.4 辅音（17 个）', '3.4 Consonants (17)', '3.4 Consonnes (17)'],
    'phon.h3.4_1': ['4.1 /i/ – /y/ – /u/ 三角对立', '4.1 The /i/ – /y/ – /u/ triangle', '4.1 Le triangle /i/ – /y/ – /u/'],
    'phon.h3.4_2': ['4.2 /ø/ 与 /œ/', '4.2 /ø/ versus /œ/', '4.2 /ø/ et /œ/'],
    'phon.h3.4_3': ['4.3 /ə/ 的省略（e muet / e caduc）', '4.3 Dropping /ə/ (e muet / e caduc)', '4.3 La chute du /ə/ (e muet / e caduc)'],
    'phon.h3.4_4': ['4.4 /e/ 与 /ɛ/：词尾 -er / -ez / -ai / -ais', '4.4 /e/ versus /ɛ/: the endings -er / -ez / -ai / -ais', '4.4 /e/ et /ɛ/ : les finales -er / -ez / -ai / -ais'],
    'phon.h3.4_5': ['4.5 /o/ 与 /ɔ/ 及开闭音节规律', '4.5 /o/ versus /ɔ/ and open/closed syllables', '4.5 /o/ et /ɔ/ : syllabes ouvertes et fermées'],
    'phon.h3.5_1': ['5.1 四个鼻化元音与拼写', '5.1 The four nasal vowels and their spellings', '5.1 Les quatre voyelles nasales et leurs graphies'],
    'phon.h3.5_2': ['5.2 鼻化失效（dénasalisation）的三个条件', '5.2 The three cases that cancel nasalisation', '5.2 Les trois cas de dénasalisation'],
    'phon.h3.5_3': ['5.3 an / am / en / em 的选择规律', '5.3 Choosing between an / am / en / em', '5.3 Choisir entre an / am / en / em'],
    'phon.h3.6_1': ['6.1 /j/（音标 [j]，来自 i / y / il / ill）', '6.1 /j/ (from i / y / il / ill)', '6.1 /j/ (venu de i / y / il / ill)'],
    'phon.h3.6_2': ['6.2 /w/（来自 ou / oi）', '6.2 /w/ (from ou / oi)', '6.2 /w/ (venu de ou / oi)'],
    'phon.h3.6_3': ['6.3 /ɥ/（来自 u + 元音）', '6.3 /ɥ/ (from u + vowel)', '6.3 /ɥ/ (venu de u + voyelle)'],
    'phon.h3.7_1': ['7.1 法语 R：小舌音 /ʁ/', '7.1 The French R: the uvular /ʁ/', '7.1 Le R français : le /ʁ/ uvulaire'],
    'phon.h3.7_2': ['7.2 不送气清塞音 /p t k/ 与浊塞音 /b d g/', '7.2 Unaspirated /p t k/ and voiced /b d g/', '7.2 Les occlusives non aspirées /p t k/ et sonores /b d g/'],
    'phon.h3.7_3': ['7.3 /ʃ/ /ʒ/ 与汉语 x / sh / r 的区别', '7.3 /ʃ/ /ʒ/ versus Chinese x / sh / r', '7.3 /ʃ/ /ʒ/ face aux x / sh / r du chinois'],
    'phon.h3.7_4': ['7.4 拼写规则：-tion / gn / h', '7.4 Spelling rules: -tion / gn / h', '7.4 Règles de graphie : -tion / gn / h'],
    'phon.h3.7_5': ['7.5 词末辅音：通常不发音 + caReFuL + 例外', '7.5 Final consonants: silent by default, plus caReFuL and its exceptions', '7.5 Consonnes finales : muettes par défaut, caReFuL et ses exceptions'],
    'phon.h3.8_1': ['8.1 联诵时辅音怎么变', '8.1 How the consonant changes in liaison', '8.1 Comment la consonne change en liaison'],
    'phon.h3.8_2': ['8.2 三类联诵', '8.2 The three kinds of liaison', '8.2 Les trois types de liaison'],
    'phon.h3.9_1': ['9.1 连音 enchaînement：不是联诵', '9.1 Enchaînement: not the same as liaison', '9.1 L\'enchaînement : ce n\'est pas la liaison'],
    'phon.h3.9_2': ['9.2 省音 élision：必须合写的词', '9.2 Élision: the words that must contract', '9.2 L\'élision : les mots qui se contractent'],
    'phon.h3.10_1': ['10.1 法语的三种「重音」', '10.1 The three kinds of French stress', '10.1 Les trois accents du français'],
    'phon.h3.10_2': ['10.2 节奏组（groupe rythmique）怎么划分', '10.2 How to divide rhythm groups', '10.2 Comment découper les groupes rythmiques'],
    'phon.h3.10_3': ['10.3 语调曲线', '10.3 Intonation contours', '10.3 Les courbes intonatives'],
    'phon.h3.10_4': ['10.4 影子跟读（shadowing）每日 10 分钟', '10.4 Shadowing: 10 minutes a day', '10.4 Le shadowing : 10 minutes par jour'],
    'phon.h3.12_1': ['12.1 十句绕口令 virelangues', '12.1 Ten tongue twisters', '12.1 Dix virelangues'],
    'phon.h3.t1': ['① 记词效率翻倍', '① Vocabulary sticks twice as fast', '① Le vocabulaire se retient deux fois plus vite'],
    'phon.h3.t2': ['② 听力从「噪音」变「词」', '② Listening turns from noise into words', '② L\'oral cesse d\'être du bruit'],
    'phon.h3.t3': ['③ 口语立刻可用', '③ You can speak from day one', '③ Parler devient possible tout de suite'],
    'phon.h3.t4': ['④ 错误纠正成本最低', '④ Mistakes are cheapest to fix now', '④ Corriger tôt coûte le moins cher'],
    'phon.h3.t5': ['⑤ 拼写听写（dictée）不丢分', '⑤ No lost marks in dictation', '⑤ Pas de points perdus en dictée'],
    'phon.h3.t6': ['⑥ 为 DELF B2 口语打底', '⑥ A foundation for the DELF B2 oral', '⑥ Une base pour l\'oral du DELF B2'],
    'phon.h3.t7': ['字母表与音符', 'Alphabet and accents', 'Alphabet et accents'],
    'phon.h3.t8': ['口型与音素对立', 'Mouth positions and phoneme contrasts', 'Articulation et oppositions de phonèmes'],
    'phon.h3.t9': ['拼写规则与音素表', 'Spelling rules and the phoneme chart', 'Règles de graphie et tableau des phonèmes'],
    'phon.h3.t10': ['鼻化元音与半元音', 'Nasal vowels and glides', 'Voyelles nasales et semi-voyelles'],
    'phon.h3.t11': ['辅音难点：/ʁ/ 与不送气塞音', 'Hard consonants: /ʁ/ and unaspirated stops', 'Consonnes difficiles : /ʁ/ et occlusives non aspirées'],
    'phon.h3.t12': ['联诵、连音、省音', 'Liaison, enchaînement, elision', 'Liaison, enchaînement, élision'],
    'phon.h3.t13': ['节奏、语调与影子跟读', 'Rhythm, intonation and shadowing', 'Rythme, intonation et shadowing'],
    'phon.h3.t14': ['找到位置', 'Find the place of articulation', 'Trouver le point d\'articulation'],
    'phon.h3.t15': ['不爆破，改成摩擦', 'No burst: turn it into friction', 'Pas d\'explosion : passer à la friction'],
    'phon.h3.t16': ['加上声带振动', 'Add vocal-cord vibration', 'Ajouter la vibration des cordes vocales'],
    'phon.h3.t17': ['放进音节', 'Put it into syllables', 'L\'intégrer dans des syllabes'],
    'phon.h3.t18': ['盲听', 'Listen blind', 'Écouter sans le texte'],
    'phon.h3.t19': ['看文本听', 'Listen with the text', 'Écouter avec le texte'],
    'phon.h3.t20': ['逐句跟读', 'Repeat sentence by sentence', 'Répéter phrase par phrase'],
    'phon.h3.t21': ['同步跟读', 'Shadow in real time', 'Répéter en simultané'],
    'phon.h3.t22': ['录音对比', 'Record and compare', 'Enregistrer et comparer'],
    'phon.h4.t1': ['caReFuL 的例外（考试高频）', 'Exceptions to caReFuL (exam favourites)', 'Les exceptions de caReFuL (fréquentes à l\'examen)'],

    /* ---- phonetics.html：表头 ---- */
    'phon.th.phoneme': ['音素', 'Phoneme', 'Phonème'],
    'phon.th.example': ['例词', 'Example', 'Exemple'],
    'phon.th.meaning': ['词义', 'Meaning', 'Sens'],
    'phon.th.spelling': ['常见拼写', 'Common spellings', 'Graphies courantes'],
    'phon.th.points': ['要点', 'Key point', 'Point clé'],
    'phon.th.day': ['天', 'Day', 'Jour'],
    'phon.th.content': ['内容', 'Content', 'Contenu'],
    'phon.th.practice': ['练习（具体做法）', 'Practice (what to do)', 'Exercice (quoi faire)'],
    'phon.th.selfcheck': ['自测标准', 'Self-check', 'Auto-évaluation'],
    'phon.th.interference': ['汉语干扰', 'Chinese interference', 'Interférence du chinois'],
    'phon.th.target': ['影响到的法语', 'French sound affected', 'Son français concerné'],
    'phon.th.wrongright': ['错误 → 正确', 'Wrong → right', 'Faux → juste'],
    'phon.th.fix': ['纠正方法', 'How to fix it', 'Comment corriger'],
    'phon.th.rule': ['规律', 'Pattern', 'Règle'],
    'phon.th.note': ['说明', 'Notes', 'Remarques'],

    /* ==== GRAMMAR（grammar 维护，前缀 gr.） ==== */
    'gr.h.a1': ['A1–A2 语法：把地基打到底', 'A1–A2 grammar: building the foundations properly', 'Grammaire A1–A2 : poser des bases solides'],
    'gr.h.adj-accord': ['1. 性数配合', '1. Gender and number agreement', '1. L\'accord en genre et en nombre'],
    'gr.h.adj-dem': ['4. 指示形容词 ce / cet / cette / ces', '4. Demonstrative adjectives ce / cet / cette / ces', '4. Les adjectifs démonstratifs ce / cet / cette / ces'],
    'gr.h.adj-place': ['2. 形容词的位置', '2. Position of adjectives', '2. La place de l\'adjectif'],
    'gr.h.adj-poss': ['5. 主有形容词 mon / ma / mes 等', '5. Possessive adjectives mon / ma / mes, etc.', '5. Les adjectifs possessifs mon / ma / mes, etc.'],
    'gr.h.adj-special': ['3. beau / nouveau / vieux 的特殊形式', '3. The special forms of beau / nouveau / vieux', '3. Les formes spéciales de beau / nouveau / vieux'],
    'gr.h.adjectifs': ['三、形容词', 'III. Adjectives', 'III. Les adjectifs'],
    'gr.h.art-contract': ['4. 缩合冠词 au / du / aux / des', '4. Contracted articles au / du / aux / des', '4. Les articles contractés au / du / aux / des'],
    'gr.h.art-def': ['1. 定冠词 le / la / les', '1. The definite article le / la / les', '1. L\'article défini le / la / les'],
    'gr.h.art-indef': ['2. 不定冠词 un / une / des', '2. The indefinite article un / une / des', '2. L\'article indéfini un / une / des'],
    'gr.h.art-part': ['3. 部分冠词 du / de la / de l\' / des', '3. The partitive article du / de la / de l\' / des', '3. L\'article partitif du / de la / de l\' / des'],
    'gr.h.articles': ['一、冠词', 'I. Articles', 'I. Les articles'],
    'gr.h.avenir-styles': ['9. 提示：「将来」的三种表达与语体差别', '9. Tip: three ways to talk about the future and their register', '9. Astuce : trois façons d\'exprimer le futur et leurs registres'],
    'gr.h.b1': ['B1–B2 语法：从「说对」到「说得有层次」', 'B1–B2 grammar: from saying it correctly to saying it with structure', 'Grammaire B1–B2 : de la correction à la structuration'],
    'gr.h.causatif': ['4. 使役结构 faire / laisser / voir + 不定式', '4. Causative faire / laisser / voir + infinitive', '4. Le causatif faire / laisser / voir + infinitif'],
    'gr.h.comp-adj': ['1. 形容词、副词的比较级', '1. Comparing adjectives and adverbs', '1. Le comparatif des adjectifs et des adverbes'],
    'gr.h.comp-super': ['2. 最高级', '2. The superlative', '2. Le superlatif'],
    'gr.h.comparaison': ['十、比较级与最高级', 'X. Comparatives and superlatives', 'X. Comparatif et superlatif'],
    'gr.h.concordance': ['3. 时态配合 concordance des temps', '3. Sequence of tenses', '3. La concordance des temps'],
    'gr.h.cond-passe': ['2. 条件式过去时', '2. The past conditional', '2. Le conditionnel passé'],
    'gr.h.cond-usage': ['1. 条件式现在时：三大用法', '1. The conditionnel présent: three main uses', '1. Le conditionnel présent : trois emplois'],
    'gr.h.conditionnel': ['四、条件式与假设', 'IV. Conditional and hypotheses', 'IV. Conditionnel et hypothèses'],
    'gr.h.conditionnel-present': ['8. 简单条件式 conditionnel présent', '8. The conditionnel présent', '8. Le conditionnel présent'],
    'gr.h.conn-but': ['3. 目的 but', '3. Purpose', '3. Le but'],
    'gr.h.conn-cause': ['1. 原因 cause', '1. Cause', '1. La cause'],
    'gr.h.conn-concession': ['5. 让步 concession', '5. Concession', '5. La concession'],
    'gr.h.conn-consequence': ['2. 结果 conséquence', '2. Consequence', '2. La conséquence'],
    'gr.h.conn-opposition': ['4. 对立与转折 opposition', '4. Contrast and opposition', '4. L\'opposition'],
    'gr.h.conn-temps': ['6. 时间 temps', '6. Time', '6. Le temps'],
    'gr.h.connecteurs': ['八、逻辑连接词大表', 'VIII. Big table of logical connectors', 'VIII. Grand tableau des connecteurs logiques'],
    'gr.h.di-mots': ['3. 时间与地点词推移表', '3. Table of time and place shifts', '3. Tableau des décalages de temps et de lieu'],
    'gr.h.di-question': ['4. 疑问句与命令式的转述', '4. Reporting questions and commands', '4. Rapporter les questions et les ordres'],
    'gr.h.di-regle': ['1. 四步转换法', '1. The four-step conversion', '1. La conversion en quatre étapes'],
    'gr.h.di-temps': ['2. 时态推移表', '2. Table of tense shifts', '2. Tableau des décalages de temps'],
    'gr.h.diag-a1': ['A1 诊断自测', 'A1 diagnostic test', 'Test de niveau A1'],
    'gr.h.diag-a2': ['A2 诊断自测', 'A2 diagnostic test', 'Test de niveau A2'],
    'gr.h.diag-b1': ['B1 诊断自测', 'B1 diagnostic test', 'Test de niveau B1'],
    'gr.h.diag-b2': ['B2 诊断自测', 'B2 diagnostic test', 'Test de niveau B2'],
    'gr.h.diagnostic': ['八、分级诊断自测（四级共 32 题）', 'VIII. Graded diagnostic test (32 questions in all)', 'VIII. Auto-évaluation par niveau (32 questions)'],
    'gr.h.discours-indirect': ['二、直接引语转间接引语', 'II. From direct to indirect speech', 'II. Du discours direct au discours indirect'],
    'gr.h.expressions-b2': ['十二、B2 高频固定搭配与书面语惯用结构', 'XII. High-frequency B2 set phrases and written structures', 'XII. Expressions B2 fréquentes et tournures écrites'],
    'gr.h.futur-proche': ['1. 最近将来时 aller + 不定式', '1. Near future: aller + infinitive', '1. Le futur proche : aller + infinitif'],
    'gr.h.futur-simple': ['7. 简单将来时 futur simple', '7. The futur simple', '7. Le futur simple'],
    'gr.h.g1': ['法语语法全景与分级索引', 'French grammar: overview and graded index', 'Grammaire française : panorama et index par niveau'],
    'gr.h.g10': ['虚拟式 + 条件式与假设', 'Weeks 35–40 · Moods', 'Semaines 35–40 · Les modes'],
    'gr.h.g11': ['分词式 + dont / lequel + 关系从句升级', 'Weeks 41–46 · Compressing into written style', 'Semaines 41–46 · Compresser vers l\'écrit'],
    'gr.h.g12': ['逻辑连接 + 名词化 + 强调结构 + 固定搭配', 'Weeks 47–52 · Finishing B2 and exam sprint', 'Semaines 47–52 · Boucler le B2 et sprint final'],
    'gr.h.g2': ['① 名词的性数系统', '① The noun gender and number system', '① Le système du genre et du nombre'],
    'gr.h.g3': ['② 动词的变位系统', '② The verb conjugation system', '② Le système de la conjugaison'],
    'gr.h.g4': ['③ 语式系统（直陈 / 条件 / 虚拟）', '③ The mood system (indicative / conditional / subjunctive)', '③ Le système des modes (indicatif / conditionnel / subjonctif)'],
    'gr.h.g5': ['发音对齐 + 名词的性数 + 最简句型', 'Weeks 1–4 · Getting started', 'Semaines 1–4 · Démarrage'],
    'gr.h.g6': ['现在时三组变位 + 否定 + 疑问 + 部分冠词', 'Weeks 5–12 · Finishing A1', 'Semaines 5–12 · Boucler le A1'],
    'gr.h.g7': ['复合过去时 + 代词体系', 'Weeks 13–20 · Entering the past', 'Semaines 13–20 · Entrer dans le passé'],
    'gr.h.g8': ['未完成过去时 + 两种过去时分工 + 将来与条件', 'Weeks 21–26 · Finishing A2', 'Semaines 21–26 · Boucler le A2'],
    'gr.h.g9': ['愈过去时 + 时态配合 + 间接引语', 'Weeks 27–34 · Tenses and reporting', 'Semaines 27–34 · Temps et discours rapporté'],
    'gr.h.gerondif': ['2. 副动词 gérondif（en + 现在分词）', '2. The gérondif (en + present participle)', '2. Le gérondif (en + participe présent)'],
    'gr.h.heure-date': ['3. 时间与日期', '3. Telling the time and giving dates', '3. L\'heure et la date'],
    'gr.h.imparfait': ['4. 未完成过去时 imparfait', '4. The imparfait', '4. L\'imparfait'],
    'gr.h.imperatif': ['1. 命令式', '1. The imperative', '1. L\'impératif'],
    'gr.h.imperatif-negation': ['八、命令式、否定与疑问', 'VIII. Imperative, negation and questions', 'VIII. Impératif, négation et interrogation'],
    'gr.h.interrogation': ['3. 疑问句三式', '3. The three ways to ask a question', '3. Les trois formes interrogatives'],
    'gr.h.liste-a1': ['四、A1 语法清单（23 个点）', 'IV. A1 grammar checklist (23 points)', 'IV. Liste A1 (23 points)'],
    'gr.h.liste-a2': ['五、A2 语法清单（18 个点）', 'V. A2 grammar checklist (18 points)', 'V. Liste A2 (18 points)'],
    'gr.h.liste-b1': ['六、B1 语法清单（19 个点）', 'VI. B1 grammar checklist (19 points)', 'VI. Liste B1 (19 points)'],
    'gr.h.liste-b2': ['七、B2 语法清单（26 个点）', 'VII. B2 grammar checklist (26 points)', 'VII. Liste B2 (26 points)'],
    'gr.h.mer-autres': ['3. 其他强调手段与倒装', '3. Other emphasis devices and inversion', '3. Autres procédés d\'insistance et inversion'],
    'gr.h.mer-cequi-cest': ['2. ce qui / ce que … c\'est', '2. ce qui / ce que … c\'est', '2. ce qui / ce que … c\'est'],
    'gr.h.mer-cest': ['1. c\'est … qui / c\'est … que', '1. c\'est … qui / c\'est … que', '1. c\'est … qui / c\'est … que'],
    'gr.h.mise-en-relief': ['十、强调结构', 'X. Emphasis structures', 'X. La mise en relief'],
    'gr.h.negation': ['2. 否定：ne…pas 及其扩展', '2. Negation: ne…pas and its extensions', '2. La négation : ne…pas et ses variantes'],
    'gr.h.nom-adj': ['2. 形容词 → 名词转换表', '2. Adjective → noun conversion table', '2. Tableau adjectif → nom'],
    'gr.h.nom-style': ['3. 句子 → 名词短语（书面语改写）', '3. Sentence → noun phrase (rewriting into written style)', '3. Phrase → groupe nominal (réécriture en style écrit)'],
    'gr.h.nom-verbes': ['1. 动词 → 名词转换表', '1. Verb → noun conversion table', '1. Tableau verbe → nom'],
    'gr.h.nombres': ['五、数字、时间与日期', 'V. Numbers, time and dates', 'V. Nombres, heure et date'],
    'gr.h.nominalisation': ['九、名词化与书面语体', 'IX. Nominalisation and written style', 'IX. Nominalisation et style écrit'],
    'gr.h.noms': ['二、名词：性与数', 'II. Nouns: gender and number', 'II. Les noms : genre et nombre'],
    'gr.h.noun-genre': ['1. 判断阴阳性的规律', '1. Patterns for identifying gender', '1. Reconnaître le genre'],
    'gr.h.noun-pluriel': ['2. 名词复数与特殊复数', '2. Plurals and irregular plurals', '2. Le pluriel et les pluriels irréguliers'],
    'gr.h.num-card': ['1. 基数词 0–1000+', '1. Cardinal numbers 0–1000+', '1. Les nombres cardinaux 0–1000+'],
    'gr.h.num-ord': ['2. 序数词', '2. Ordinal numbers', '2. Les nombres ordinaux'],
    'gr.h.ordre': ['二、推荐学习顺序（对应 52 周节奏）', 'II. Recommended study order (aligned with the 52 weeks)', 'II. Ordre d\'étude conseillé (sur 52 semaines)'],
    'gr.h.panorama': ['一、语法全景：法语语法到底在学什么', 'I. Grammar overview: what French grammar really covers', 'I. Panorama : ce que couvre vraiment la grammaire française'],
    'gr.h.participe-compose': ['3. 复合过去分词 participe passé composé', '3. The compound past participle', '3. Le participe passé composé'],
    'gr.h.participe-present': ['1. 现在分词 participe présent', '1. The present participle', '1. Le participe présent'],
    'gr.h.participe-relative': ['4. 分词式与从句的相互转换', '4. Converting between participle phrases and clauses', '4. Convertir participes et subordonnées'],
    'gr.h.participes': ['六、分词式', 'VI. Participle forms', 'VI. Les formes participiales'],
    'gr.h.passe-compose': ['3. 复合过去时 passé composé', '3. The passé composé', '3. Le passé composé'],
    'gr.h.passe-recent': ['2. 最近过去时 venir de + 不定式', '2. Recent past: venir de + infinitive', '2. Le passé récent : venir de + infinitif'],
    'gr.h.passe-simple': ['2. 简单过去时 passé simple：识别与语体', '2. The passé simple: recognition and register', '2. Le passé simple : reconnaissance et registre'],
    'gr.h.passif-formation': ['1. 被动态构成', '1. Forming the passive', '1. La formation du passif'],
    'gr.h.passif-par-de': ['2. 施动者：par 还是 de？', '2. The agent: par or de?', '2. L\'agent : par ou de ?'],
    'gr.h.passif-pronominal': ['3. 代动词被动与 on 替代', '3. Pronominal passive and the on alternative', '3. Le passif pronominal et l\'alternative avec on'],
    'gr.h.pc-imparfait': ['5. 复合过去时 vs 未完成过去时', '5. Passé composé vs. imparfait', '5. Passé composé ou imparfait'],
    'gr.h.plus-que-parfait': ['6. 愈过去时 plus-que-parfait', '6. The plus-que-parfait', '6. Le plus-que-parfait'],
    'gr.h.prep-lieu': ['1. 地点介词', '1. Prepositions of place', '1. Les prépositions de lieu'],
    'gr.h.prep-temps': ['2. 时间介词', '2. Prepositions of time', '2. Les prépositions de temps'],
    'gr.h.prepositions': ['十一、介词与地点、时间表达', 'XI. Prepositions of place and time', 'XI. Prépositions de lieu et de temps'],
    'gr.h.pres-er': ['1. 第一组：-er 动词', '1. Group 1: -er verbs', '1. 1er groupe : les verbes en -er'],
    'gr.h.pres-ir': ['2. 第二组：-ir 动词（-iss- 型）', '2. Group 2: -ir verbs (the -iss- type)', '2. 2e groupe : les verbes en -ir (type -iss-)'],
    'gr.h.pres-irreg': ['4. 常用不规则动词变位表', '4. Conjugation table of common irregular verbs', '4. Tableau des verbes irréguliers courants'],
    'gr.h.pres-re': ['3. 第三组：-re 动词', '3. Group 3: -re verbs', '3. 3e groupe : les verbes en -re'],
    'gr.h.present': ['七、现在时', 'VII. The present tense', 'VII. Le présent'],
    'gr.h.pro-cod': ['3. 直接宾语代词 le / la / les', '3. Direct object pronouns le / la / les', '3. Les pronoms COD le / la / les'],
    'gr.h.pro-coi': ['4. 间接宾语代词 lui / leur', '4. Indirect object pronouns lui / leur', '4. Les pronoms COI lui / leur'],
    'gr.h.pro-ordre': ['6. 代词顺序表', '6. The order of pronouns', '6. L\'ordre des pronoms'],
    'gr.h.pro-subj': ['1. 主语人称代词', '1. Subject personal pronouns', '1. Les pronoms personnels sujets'],
    'gr.h.pro-tonic': ['2. 重读代词', '2. Stressed pronouns', '2. Les pronoms toniques'],
    'gr.h.pro-y-en': ['5. 副代词 y 与 en', '5. The adverbial pronouns y and en', '5. Les pronoms y et en'],
    'gr.h.pronoms': ['六、代词', 'VI. Pronouns', 'VI. Les pronoms'],
    'gr.h.quant-adv': ['1. 数量副词与「de」', '1. Quantity adverbs and the word « de »', '1. Les adverbes de quantité et « de »'],
    'gr.h.quant-autres': ['2. 其他数量与整体表达', '2. Other quantity and whole-set expressions', '2. Autres quantités et ensembles'],
    'gr.h.quantite': ['四、数量表达', 'IV. Expressing quantity', 'IV. L\'expression de la quantité'],
    'gr.h.recit-passe': ['一、叙事中的过去时分工', 'I. Dividing up the past tenses in a narrative', 'I. La répartition des temps du passé dans le récit'],
    'gr.h.recit-pc-imp': ['1. 三种过去时的分工', '1. The division of labour between the three past tenses', '1. La répartition des trois temps du passé'],
    'gr.h.rel-ce-qui': ['3. ce qui / ce que / ce dont（无先行词）', '3. ce qui / ce que / ce dont (no antecedent)', '3. ce qui / ce que / ce dont (sans antécédent)'],
    'gr.h.rel-compose': ['4. 复合关系代词与 où 的扩展', '4. Compound relative pronouns and extensions of où', '4. Les relatifs composés et les emplois de où'],
    'gr.h.rel-dont': ['1. dont（= de + 先行词）', '1. dont (= de + antecedent)', '1. dont (= de + antécédent)'],
    'gr.h.rel-lequel': ['2. lequel 系列（含 à/de 缩合）', '2. The lequel series (with à/de contractions)', '2. La série lequel (avec les contractions à/de)'],
    'gr.h.relatifs-a1a2': ['十二、关系代词 qui / que / où', 'XII. Relative pronouns qui / que / où', 'XII. Les pronoms relatifs qui / que / où'],
    'gr.h.relatifs-b1': ['七、关系代词进阶', 'VII. Relative pronouns, advanced level', 'VII. Les pronoms relatifs, niveau avancé'],
    'gr.h.si-alternatives': ['4. si 的替代结构', '4. Alternatives to si', '4. Les substituts de si'],
    'gr.h.si-trois': ['3. si 的三种假设句型', '3. The three si-clause patterns', '3. Les trois systèmes en si'],
    'gr.h.subj-conjonctions': ['5. 高频虚拟式连词清单', '5. Common conjunctions followed by the subjunctive', '5. Les conjonctions suivies du subjonctif'],
    'gr.h.subj-declencheurs': ['3. 触发词分类表', '3. Triggers by category', '3. Les déclencheurs par catégorie'],
    'gr.h.subj-formation': ['1. 虚拟式现在时变位', '1. Forming the present subjunctive', '1. La formation du subjonctif présent'],
    'gr.h.subj-passe': ['2. 虚拟式过去时', '2. The past subjunctive', '2. Le subjonctif passé'],
    'gr.h.subj-vs-indicatif': ['4. 虚拟式 vs 直陈式：penser / croire / espérer', '4. Subjunctive vs. indicative: penser / croire / espérer', '4. Subjonctif ou indicatif : penser / croire / espérer'],
    'gr.h.subjonctif': ['三、虚拟式 subjonctif', 'III. The subjunctive', 'III. Le subjonctif'],
    'gr.h.temps': ['九、时态', 'IX. Tenses', 'IX. Les temps'],
    'gr.h.top15': ['三、最高频 15 个语法点优先表', 'III. The 15 highest-frequency grammar points, in priority order', 'III. Les 15 points les plus fréquents, par ordre de priorité'],
    'gr.h.verbes-prepositions': ['十一、疑难动词 + 介词搭配表', 'XI. Tricky verbs and their prepositions', 'XI. Verbes difficiles et leurs prépositions'],
    'gr.h.verbes-pronominaux': ['5. 代词式动词', '5. Pronominal verbs', '5. Les verbes pronominaux'],
    'gr.h.voix-passive': ['五、被动态与使役', 'V. Passive voice and causative', 'V. Voix passive et construction causative'],
    'gr.toc.adjectifs': ['三、形容词', '3. Adjectives', '3. Adjectifs'],
    'gr.toc.articles': ['一、冠词', '1. Articles', '1. Articles'],
    'gr.toc.comparaison': ['十、比较级与最高级', '10. Comparatives and superlatives', '10. Comparatif et superlatif'],
    'gr.toc.conditionnel': ['四、条件式与假设', '4. Conditional and hypotheses', '4. Conditionnel et hypothèses'],
    'gr.toc.connecteurs': ['八、逻辑连接词', '8. Logical connectors', '8. Connecteurs logiques'],
    'gr.toc.diagnostic': ['八、分级诊断自测', 'VIII. Diagnostic test', 'VIII. Auto-évaluation'],
    'gr.toc.discours-indirect': ['二、间接引语', '2. Indirect speech', '2. Discours indirect'],
    'gr.toc.expressions-b2': ['十二、B2 高频固定搭配', '12. B2 set phrases', '12. Expressions B2'],
    'gr.toc.imperatif-negation': ['八、命令式、否定、疑问', '8. Imperative, negation, questions', '8. Impératif, négation, questions'],
    'gr.toc.liste-a1': ['四、A1 清单', 'IV. A1 list', 'IV. Liste A1'],
    'gr.toc.liste-a2': ['五、A2 清单', 'V. A2 list', 'V. Liste A2'],
    'gr.toc.liste-b1': ['六、B1 清单', 'VI. B1 list', 'VI. Liste B1'],
    'gr.toc.liste-b2': ['七、B2 清单', 'VII. B2 list', 'VII. Liste B2'],
    'gr.toc.mise-en-relief': ['十、强调结构', '10. Emphasis', '10. Mise en relief'],
    'gr.toc.nombres': ['五、数字、时间与日期', '5. Numbers, time and dates', '5. Nombres, heure et date'],
    'gr.toc.nominalisation': ['九、名词化与书面语体', '9. Nominalisation and written style', '9. Nominalisation et style écrit'],
    'gr.toc.noms': ['二、名词：性与数', '2. Nouns: gender and number', '2. Noms : genre et nombre'],
    'gr.toc.ordre': ['二、推荐学习顺序', 'II. Study order', 'II. Ordre d\'étude'],
    'gr.toc.panorama': ['一、语法全景', 'I. Grammar overview', 'I. Panorama'],
    'gr.toc.participes': ['六、分词式', '6. Participles', '6. Formes participiales'],
    'gr.toc.prepositions': ['十一、介词与地点时间', '11. Prepositions of place and time', '11. Prépositions de lieu et de temps'],
    'gr.toc.present': ['七、现在时', '7. Present tense', '7. Présent'],
    'gr.toc.pronoms': ['六、代词', '6. Pronouns', '6. Pronoms'],
    'gr.toc.quantite': ['四、数量表达', '4. Quantity', '4. Quantité'],
    'gr.toc.recit-passe': ['一、叙事中的过去时', '1. Past tenses in a narrative', '1. Temps du récit'],
    'gr.toc.relatifs-a1a2': ['十二、关系代词', '12. Relative pronouns', '12. Pronoms relatifs'],
    'gr.toc.relatifs-b1': ['七、关系代词进阶', '7. Relative pronouns (advanced)', '7. Pronoms relatifs (avancé)'],
    'gr.toc.subjonctif': ['三、虚拟式', '3. Subjunctive', '3. Subjonctif'],
    'gr.toc.temps': ['九、时态', '9. Tenses', '9. Temps'],
    'gr.toc.top15': ['三、最高频 15 个语法点', 'III. Top 15 points', 'III. Top 15'],
    'gr.toc.verbes-prepositions': ['十一、动词+介词搭配', '11. Verb + preposition', '11. Verbe + préposition'],
    'gr.toc.voix-passive': ['五、被动与使役', '5. Passive and causative', '5. Passif et causatif'],
    'gr.nt.00': ['易错点', 'Common mistakes', 'Erreurs fréquentes'],
    'gr.nt.01': ['结构公式', 'Formula', 'Formule'],
    'gr.nt.02': ['一个反常识的建议', 'A counter-intuitive tip', 'Un conseil contre-intuitif'],
    'gr.nt.03': ['顺序上的三条纪律', 'Three rules of sequencing', 'Trois règles de progression'],
    'gr.nt.04': ['关于比例数据的说明（请务必读）', 'About the percentages (please read)', 'À propos des pourcentages (à lire)'],
    'gr.nt.05': ['经验总结', 'Key takeaway', 'À retenir'],
    'gr.nt.06': ['清单进度自查', 'Checking off the lists', 'Suivre l\'avancement des listes'],
    'gr.nt.07': ['做完诊断题之后', 'After the diagnostic test', 'Après le test de niveau'],
    'gr.nt.08': ['语法模块导航', 'Grammar module navigation', 'Navigation du module grammaire'],
    'gr.nt.09': ['怎么用这一页', 'How to use this page', 'Comment utiliser cette page'],
    'gr.nt.10': ['最重要的两个例外', 'The two key exceptions', 'Les deux exceptions essentielles'],
    'gr.nt.11': ['s 的两条规则', 'Two rules about « s »', 'Deux règles sur le « s »'],
    'gr.nt.12': ['注意 monter / descendre / sortir 的双重助动词', 'Note: the double auxiliary of monter / descendre / sortir', 'Attention : le double auxiliaire de monter, descendre, sortir'],
    'gr.nt.13': ['小故事示例：一句话看分工', 'Mini-story: the division of labour in one sentence', 'Mini-récit : la répartition en une phrase'],
    'gr.nt.14': ['三条实用规则', 'Three practical rules', 'Trois règles pratiques'],
    'gr.nt.15': ['bon / bien 的关键区别', 'bon vs. bien: the key difference', 'bon ou bien : la différence essentielle'],
    'gr.nt.16': ['下一步', 'Next step', 'Étape suivante'],
    'gr.nt.17': ['B2 语法的底层逻辑', 'The logic behind B2 grammar', 'La logique de la grammaire B2'],
    'gr.nt.18': ['一句话判断法', 'A one-line test', 'Un test en une phrase'],
    'gr.nt.19': ['关键规律：两「跳」一「稳」', 'Key rule: two shifts, one stays put', 'Règle clé : deux décalages, un statu quo'],
    'gr.nt.20': ['主句是过去时怎么办？', 'What if the main clause is in the past?', 'Et si la principale est au passé ?'],
    'gr.nt.21': ['容易搞错的两个例外', 'Two easily confused exceptions', 'Deux exceptions faciles à confondre'],
    'gr.nt.22': ['一句话解释原因', 'The reason in one line', 'La raison en une phrase'],
    'gr.nt.23': ['铁律', 'Hard rule', 'Règle absolue'],
    'gr.nt.24': ['记忆捷径', 'Memory shortcut', 'Moyen mnémotechnique'],
    'gr.nt.25': ['把这一页变成能力：三步练习法', 'Turn this page into a skill: a three-step drill', 'Transformer cette page en compétence : trois étapes'],
    'gr.nt.26': ['回到起点', 'Back to the start', 'Retour au départ'],
    'gr.th.000': ['中文', 'Chinese', 'Chinois'],
    'gr.th.001': ['例句', 'Example', 'Exemple'],
    'gr.th.002': ['动词', 'Verb', 'Verbe'],
    'gr.th.003': ['例', 'Examples', 'Exemples'],
    'gr.th.004': ['结构', 'Structure', 'Structure'],
    'gr.th.005': ['含义', 'Meaning', 'Sens'],
    'gr.th.006': ['形式', 'Form', 'Forme'],
    'gr.th.007': ['语体', 'Register', 'Registre'],
    'gr.th.008': ['用法', 'Use', 'Emploi'],
    'gr.th.009': ['连接词', 'Connector', 'Connecteur'],
    'gr.th.010': ['语法点', 'Grammar point', 'Point de grammaire'],
    'gr.th.011': ['类型', 'Type', 'Type'],
    'gr.th.012': ['法语', 'French', 'Français'],
    'gr.th.013': ['法语名', 'French name', 'Nom français'],
    'gr.th.014': ['一句话说明', 'In one line', 'En une phrase'],
    'gr.th.015': ['在本站的链接', 'Link on this site', 'Lien sur ce site'],
    'gr.th.016': ['单数', 'Singular', 'Singulier'],
    'gr.th.017': ['复数', 'Plural', 'Pluriel'],
    'gr.th.018': ['阴性单数', 'Feminine singular', 'Féminin singulier'],
    'gr.th.019': ['说明', 'Notes', 'Remarques'],
    'gr.th.020': ['代词', 'Pronoun', 'Pronom'],
    'gr.th.021': ['变位', 'Conjugation', 'Conjugaison'],
    'gr.th.022': ['介词', 'Preposition', 'Préposition'],
    'gr.th.023': ['直接引语', 'Direct speech', 'Discours direct'],
    'gr.th.024': ['功能', 'Function', 'Fonction'],
    'gr.th.025': ['类别', 'Category', 'Catégorie'],
    'gr.th.026': ['阳性单数', 'Masculine singular', 'Masculin singulier'],
    'gr.th.027': ['形容词', 'Adjective', 'Adjectif'],
    'gr.th.028': ['数字', 'Number', 'Nombre'],
    'gr.th.029': ['用于', 'Used for', 'S\'emploie avec'],
    'gr.th.030': ['规则', 'Rule', 'Règle'],
    'gr.th.031': ['不定式', 'Infinitive', 'Infinitif'],
    'gr.th.032': ['过去分词', 'Past participle', 'Participe passé'],
    'gr.th.033': ['助动词', 'Auxiliary', 'Auxiliaire'],
    'gr.th.034': ['词干', 'Stem', 'Radical'],
    'gr.th.035': ['在从句中的功能', 'Function in the clause', 'Fonction dans la subordonnée'],
    'gr.th.036': ['时态', 'Tense', 'Temps'],
    'gr.th.037': ['从句', 'Clause', 'Subordonnée'],
    'gr.th.038': ['间接引语', 'Indirect speech', 'Discours indirect'],
    'gr.th.039': ['手段', 'Device', 'Procédé'],
    'gr.th.040': ['后接', 'Followed by', 'Suivi de'],
    'gr.th.041': ['层级', 'Level', 'Niveau'],
    'gr.th.042': ['那一层在解决什么问题', 'What that layer solves', 'Ce que ce niveau résout'],
    'gr.th.043': ['语法点数量', 'Number of points', 'Nombre de points'],
    'gr.th.044': ['典型代表', 'Typical examples', 'Exemples typiques'],
    'gr.th.045': ['级别', 'Level', 'Niveau'],
    'gr.th.046': ['近似出现比例', 'Approx. frequency', 'Fréquence approximative'],
    'gr.th.047': ['为什么排这个位置', 'Why it ranks here', 'Pourquoi ce rang'],
    'gr.th.048': ['详细讲解', 'Full lesson', 'Leçon détaillée'],
    'gr.th.049': ['对比定冠词', 'vs. the definite article', 'Par rapport au défini'],
    'gr.th.050': ['原形', 'Base form', 'Forme de base'],
    'gr.th.051': ['缩合后', 'Contracted form', 'Forme contractée'],
    'gr.th.052': ['词尾', 'Ending', 'Terminaison'],
    'gr.th.053': ['多为', 'Mostly', 'Le plus souvent'],
    'gr.th.054': ['例外', 'Exceptions', 'Exceptions'],
    'gr.th.055': ['阳性复数', 'Masculine plural', 'Masculin pluriel'],
    'gr.th.056': ['阴性复数', 'Feminine plural', 'Féminin pluriel'],
    'gr.th.057': ['前置形容词', 'Adjectives placed before the noun', 'Adjectifs antéposés'],
    'gr.th.058': ['阳性单数（辅音前）', 'Masc. sing. (before a consonant)', 'Masc. sing. (devant consonne)'],
    'gr.th.059': ['阳性单数（元音/哑音 h 前）', 'Masc. sing. (before a vowel or mute h)', 'Masc. sing. (devant voyelle ou h muet)'],
    'gr.th.060': ['使用条件', 'When to use', 'Conditions d\'emploi'],
    'gr.th.061': ['拥有者', 'Possessor', 'Possesseur'],
    'gr.th.062': ['复数（阴阳通用）', 'Plural (both genders)', 'Pluriel (les deux genres)'],
    'gr.th.063': ['数量表达', 'Quantity expression', 'Expression de la quantité'],
    'gr.th.064': ['序数', 'Ordinal', 'Ordinal'],
    'gr.th.065': ['阳性', 'Masculine', 'Masculin'],
    'gr.th.066': ['阴性', 'Feminine', 'Féminin'],
    'gr.th.067': ['注意', 'Note', 'Attention'],
    'gr.th.068': ['时间', 'Time', 'Le temps'],
    'gr.th.069': ['星期', 'Day of the week', 'Jour'],
    'gr.th.070': ['月份', 'Month', 'Mois'],
    'gr.th.071': ['人', 'Person', 'Personne'],
    'gr.th.072': ['主语形式', 'Subject form', 'Forme sujet'],
    'gr.th.073': ['重读形式', 'Stressed form', 'Forme tonique'],
    'gr.th.074': ['人称', 'Person', 'Personne'],
    'gr.th.075': ['原结构', 'Original structure', 'Structure de départ'],
    'gr.th.076': ['代词化', 'Pronominalised form', 'Forme pronominale'],
    'gr.th.077': ['替代什么', 'Replaces', 'Remplace'],
    'gr.th.078': ['原句', 'Original sentence', 'Phrase d\'origine'],
    'gr.th.079': ['顺序', 'Order', 'Ordre'],
    'gr.th.080': ['组合', 'Combination', 'Combinaison'],
    'gr.th.081': ['直陈句', 'Indicative sentence', 'Phrase à l\'indicatif'],
    'gr.th.082': ['肯定命令式', 'Affirmative imperative', 'Impératif affirmatif'],
    'gr.th.083': ['变位示例', 'Conjugation examples', 'Exemples de conjugaison'],
    'gr.th.084': ['备注', 'Notes', 'Remarque'],
    'gr.th.085': ['否定词', 'Negation word', 'Mot négatif'],
    'gr.th.086': ['疑问词', 'Question word', 'Mot interrogatif'],
    'gr.th.087': ['动词组', 'Verb group', 'Groupe de verbes'],
    'gr.th.088': ['字母', 'Letter', 'Lettre'],
    'gr.th.089': ['过去分词（阳/阴）', 'Past participle (m. / f.)', 'Participe passé (m. / f.)'],
    'gr.th.090': ['配合规则', 'Agreement rule', 'Règle d\'accord'],
    'gr.th.091': ['对比项', 'Point of comparison', 'Point de comparaison'],
    'gr.th.092': ['je 形式', 'je form', 'Forme avec je'],
    'gr.th.093': ['用途', 'Use', 'Emploi'],
    'gr.th.094': ['语义重心', 'Focus', 'Nuance dominante'],
    'gr.th.095': ['原级', 'Positive form', 'Positif'],
    'gr.th.096': ['比较级', 'Comparative', 'Comparatif'],
    'gr.th.097': ['拆句 → 合句', 'Split apart → merged', 'Découpage → fusion'],
    'gr.th.098': ['叙事功能', 'Narrative role', 'Rôle narratif'],
    'gr.th.099': ['典型标志', 'Typical markers', 'Marqueurs typiques'],
    'gr.th.100': ['时间关系', 'Time relation', 'Relation temporelle'],
    'gr.th.101': ['主句（过去时）', 'Main clause (in the past)', 'Principale (au passé)'],
    'gr.th.102': ['连词', 'Conjunction', 'Conjonction'],
    'gr.th.103': ['从句时态', 'Clause tense', 'Temps de la subordonnée'],
    'gr.th.104': ['步骤', 'Step', 'Étape'],
    'gr.th.105': ['要做的事', 'What to do', 'Ce qu\'il faut faire'],
    'gr.th.106': ['间接引语（主句过去时）', 'Indirect speech (past main clause)', 'Discours indirect (principale au passé)'],
    'gr.th.107': ['直接引语类型', 'Type of direct speech', 'Type de discours direct'],
    'gr.th.108': ['转述结构', 'Reporting structure', 'Structure de reprise'],
    'gr.th.109': ['配合', 'Agreement', 'Accord'],
    'gr.th.110': ['触发词 / 结构', 'Trigger word / structure', 'Déclencheur / structure'],
    'gr.th.111': ['肯定句 → 直陈式', 'Affirmative → indicative', 'Affirmatif → indicatif'],
    'gr.th.112': ['否定 / 疑问句 → 虚拟式', 'Negative / question → subjunctive', 'Négatif ou interrogatif → subjonctif'],
    'gr.th.113': ['连词短语', 'Conjunctive phrase', 'Locution conjonctive'],
    'gr.th.114': ['si 从句', 'si-clause', 'Proposition en si'],
    'gr.th.115': ['主句', 'Main clause', 'Principale'],
    'gr.th.116': ['后接形式', 'Followed by', 'Suivi de'],
    'gr.th.117': ['例（inviter 邀请）', 'Example (inviter, to invite)', 'Exemple (inviter)'],
    'gr.th.118': ['适用动词', 'Verbs concerned', 'Verbes concernés'],
    'gr.th.119': ['特点', 'Feature', 'Particularité'],
    'gr.th.120': ['现在分词', 'Present participle', 'Participe présent'],
    'gr.th.121': ['相当于', 'Equivalent to', 'Équivaut à'],
    'gr.th.122': ['从句类型', 'Clause type', 'Type de subordonnée'],
    'gr.th.123': ['分词式', 'Participle phrase', 'Forme participiale'],
    'gr.th.124': ['场景', 'Context', 'Contexte'],
    'gr.th.125': ['独立句', 'Stand-alone sentence', 'Phrase indépendante'],
    'gr.th.126': ['关系句', 'Relative sentence', 'Phrase relative'],
    'gr.th.127': ['后接语式', 'Mood required', 'Mode requis'],
    'gr.th.128': ['语式', 'Mood', 'Mode'],
    'gr.th.129': ['名词（多阴性 -tion / -aison）', 'Noun (often feminine: -tion / -aison)', 'Nom (souvent féminin : -tion / -aison)'],
    'gr.th.130': ['名词化例句', 'Nominalised example', 'Exemple nominalisé'],
    'gr.th.131': ['名词', 'Noun', 'Nom'],
    'gr.th.132': ['口语 / 动词句', 'Spoken / verbal style', 'Style oral / verbal'],
    'gr.th.133': ['书面 / 名词化', 'Written / nominalised style', 'Style écrit / nominalisé'],
    'gr.th.134': ['改写要点', 'What changes', 'Points de transformation'],
    'gr.th.135': ['强调结构', 'Emphasis structure', 'Structure d\'insistance'],
    'gr.th.136': ['搭配', 'Collocation', 'Construction'],
    'gr.th.137': ['法语表达', 'French expression', 'Expression française'],
    'gr.th.139': ['parler 说话', 'parler — to speak', 'parler'],
    'gr.th.140': ['aimer 爱', 'aimer — to love', 'aimer'],
    'gr.th.141': ['habiter 住', 'habiter — to live', 'habiter'],
    'gr.th.142': ['travailler 工作', 'travailler — to work', 'travailler'],
    'gr.th.143': ['finir 完成', 'finir — to finish', 'finir'],
    'gr.th.144': ['choisir 选择', 'choisir — to choose', 'choisir'],
    'gr.th.145': ['réussir 成功', 'réussir — to succeed', 'réussir'],
    'gr.th.146': ['réfléchir 思考', 'réfléchir — to think', 'réfléchir'],
    'gr.th.147': ['vendre 卖', 'vendre — to sell', 'vendre'],
    'gr.th.148': ['attendre 等', 'attendre — to wait', 'attendre'],
    'gr.th.149': ['répondre 回答', 'répondre — to answer', 'répondre'],
    'gr.th.150': ['perdre 失去', 'perdre — to lose', 'perdre'],
    'gr.th.151': ['se lever 起床', 'se lever — to get up', 'se lever'],
    'gr.th.152': ['s\'appeler 叫', 's\'appeler — to be called', 's\'appeler'],
    'gr.th.153': ['se coucher 睡觉', 'se coucher — to go to bed', 'se coucher'],
    'gr.th.154': ['s\'habiller 穿衣', 's\'habiller — to get dressed', 's\'habiller'],
    'gr.eyebrow.a': ['语法模块 · 第一册', 'Grammar module · Book 1', 'Module grammaire · Volume 1'],
    'gr.eyebrow.b': ['语法模块 · 第二册', 'Grammar module · Book 2', 'Module grammaire · Volume 2'],
    'gr.eyebrow.g': ['语法模块 · 总览', 'Grammar module · Overview', 'Module grammaire · Panorama'],
    'gr.lede.a': ['这一页覆盖零基础到 A2 的<strong>全部</strong>核心语法。每一节都按同样的顺序给你：中文规则 → 结构公式 → 变化表 → 法语例句与翻译 → 易错点 → 自测。建议配合 <a href="calendar.html">52 周计划</a>的前 26 周使用，学一节就立刻朗读例句、默写表格、做小测。', 'This page covers <strong>all</strong> the core grammar from absolute beginner to A2. Every section follows the same order: rule → structure formula → conjugation or agreement table → French examples with translation → common mistakes → self-test. Use it alongside the first 26 weeks of the <a href="calendar.html">52-week plan</a>: after each section, read the examples aloud, write the tables from memory and take the quiz.', 'Cette page couvre <strong>toute</strong> la grammaire essentielle, du niveau grand débutant au A2. Chaque section suit le même ordre : règle → formule de structure → tableau de conjugaison ou d\'accord → exemples français traduits → erreurs fréquentes → auto-test. Utilisez-la avec les 26 premières semaines du <a href="calendar.html">programme de 52 semaines</a> : après chaque section, lisez les exemples à voix haute, réécrivez les tableaux et faites le quiz.'],
    'gr.lede.b': ['这一页是 DELF B2 写作与口语的语法弹药库：虚拟式、条件式三型、被动、分词式、<span class="fr">dont / lequel</span>、逻辑连接、名词化与书面语惯用结构。每一节都是「规则 → 公式 → 表格 → 例句 → 易错点 → 自测」，请配合 <a href="calendar.html">52 周计划</a>第 27–52 周使用。', 'This page is the grammar arsenal for DELF B2 writing and speaking: the subjunctive, the three conditional patterns, the passive, participle forms, <span class="fr">dont / lequel</span>, logical connectors, nominalisation and written set structures. Every section follows “rule → formula → table → examples → common mistakes → self-test”; use it with weeks 27–52 of the <a href="calendar.html">52-week plan</a>.', 'Cette page est l\'arsenal grammatical de l\'écrit et de l\'oral du DELF B2 : subjonctif, les trois systèmes du conditionnel, passif, formes participiales, <span class="fr">dont / lequel</span>, connecteurs logiques, nominalisation et tournures écrites. Chaque section suit « règle → formule → tableau → exemples → erreurs fréquentes → auto-test » ; utilisez-la avec les semaines 27 à 52 du <a href="calendar.html">programme de 52 semaines</a>.'],
    'gr.lede.g': ['这一页是语法模块的地图：<strong>86 个语法点</strong>按 A1 / A2 / B1 / B2 分级列全，每个点都指向详细讲解的真实锚点；再给你一张「最高频 15 个」优先表和四级共 32 道诊断自测题。你可以用它规划学习、查漏补缺，也可以在学完一个阶段后来做一次体检。', 'This page is the map of the grammar module: all <strong>86 grammar points</strong> listed by level (A1 / A2 / B1 / B2), each one linking to the real anchor of its detailed lesson; plus a priority table of the <strong>15 highest-frequency points</strong> and a 32-question diagnostic test covering the four levels. Use it to plan your study, spot the gaps, or run a check-up at the end of a stage.', 'Cette page est la carte du module de grammaire : les <strong>86 points de grammaire</strong> classés par niveau (A1 / A2 / B1 / B2), chacun renvoyant à l\'ancre réelle de sa leçon détaillée ; plus un tableau prioritaire des <strong>15 points les plus fréquents</strong> et une auto-évaluation de 32 questions sur les quatre niveaux. Servez-vous-en pour planifier, repérer vos lacunes ou faire un bilan en fin d\'étape.'],
    'gr.cta.a1a2': ['进入 A1–A2 语法', 'Go to A1–A2 grammar', 'Aller à la grammaire A1–A2'],
    'gr.cta.b1b2': ['进入 B1–B2 语法', 'Go to B1–B2 grammar', 'Aller à la grammaire B1–B2'],
    'gr.cta.back': ['返回语法总览', 'Back to the grammar overview', 'Retour à l\'aperçu de grammaire'],
    'gr.cta.calendar': ['看 52 周计划', 'See the 52-week plan', 'Voir le programme de 52 semaines'],
    'gr.cta.review': ['复习 A1–A2 语法', 'Review A1–A2 grammar', 'Réviser la grammaire A1–A2'],
    'gr.a11y.totop': ['回到顶部', 'Back to top', 'Haut de page'],
    'gr.toc.title': ['本页目录', 'On this page', 'Sur cette page'],

    /* ==== VOCAB / DIALOGUE（vocab-dialog 维护，前缀 vo. / dl.） ==== */
    /* ---- vocab.html：页面框架 ---- */
    'vo.eyebrow': ['词汇 · Vocabulaire', 'Vocabulary · Vocabulaire', 'Vocabulaire · Vocabulaire'],
    'vo.h1': ['B2 核心词汇库：25 个主题域，2500+ 词条', 'B2 core vocabulary: 25 topic areas, 2,500+ entries', 'Vocabulaire essentiel B2 : 25 domaines, plus de 2 500 entrées'],
    'vo.cta.start': ['跳到 30 天启动词表', 'Go to the 30-day starter list', 'Aller à la liste de démarrage 30 jours'],
    'vo.cta.themes': ['跳到 25 个主题域', 'Go to the 25 topic areas', 'Aller aux 25 domaines'],
    'vo.cta.morpho': ['构词法与易混词', 'Word formation & false friends', 'Formation des mots et faux amis'],
    'vo.cta.dialogue': ['去练情境对话', 'Practise with dialogues', 'Aller aux dialogues'],
    'vo.toc': ['本页目录', 'On this page', 'Sur cette page'],
    'vo.h.pourquoi': ['一、为什么 B2 需要 2500–3000 词？', '1. Why does B2 need 2,500–3,000 words?', '1. Pourquoi le B2 exige-t-il 2 500 à 3 000 mots ?'],
    'vo.h.methode': ['二、怎么用本站背词：四步法与间隔重复', '2. How to learn words here: four steps and spaced repetition', '2. Comment apprendre ici : quatre étapes et répétition espacée'],
    'vo.h.start': ['三、30 天启动词表：最高频 300 词', '3. 30-day starter list: the 300 most frequent words', '3. Liste de démarrage 30 jours : les 300 mots les plus fréquents'],
    'vo.h.themes': ['四、25 个主题域（可按等级筛选）', '4. The 25 topic areas (filter by level)', '4. Les 25 domaines (filtre par niveau)'],
    'vo.h.extra': ['二十七、补充高频词：行政、手续与职场', '27. Extra high-frequency words: administration, paperwork and work', '27. Mots fréquents complémentaires : démarches et vie professionnelle'],
    'vo.h.morpho': ['二十八、法语构词法速览：看见生词能猜出意思', '28. French word formation: guess the meaning of new words', '28. Formation des mots : deviner le sens d\'un mot nouveau'],
    'vo.h.genre': ['二十九、名词阴阳性判断规律', '29. How to guess noun gender', '29. Reconnaître le genre des noms'],
    'vo.h.syno': ['三十、近义词辨析 10 组：B2 写作的细节分', '30. Ten synonym pairs: the detail marks in B2 writing', '30. Dix paires de synonymes : les points de détail en B2'],
    'vo.h.faux': ['三十一、10 组易混词（faux-amis）：中国人最爱错的坑', '31. Ten false friends: the traps Chinese speakers fall into', '31. Dix faux-amis : les pièges les plus fréquents'],
    'vo.chip.all': ['全部 {n} 词', 'All {n} words', 'Tous les {n} mots'],
    'vo.btn.grammar': ['配合语法页复习', 'Revise with the grammar pages', 'Réviser avec la grammaire'],
    'vo.btn.dialogue': ['用对话页做输出', 'Produce output with the dialogues', 'S\'entraîner avec les dialogues'],
    'vo.btn.calendar': ['回到 52 周计划', 'Back to the 52-week plan', 'Retour au plan de 52 semaines'],
    'vo.stat.words': ['个词条', 'entries', 'entrées'],
    'vo.stat.levels': ['等级分布', 'levels', 'niveaux'],
    'vo.stat.filtered': ['范围内的 A1–B2 全部词条', 'all A1–B2 entries in range', 'toutes les entrées A1–B2 affichées'],
    /* ---- vocab.html：25 个主题域标题（id 不变） ---- */
    'vo.t1': ['一、人与身份', '1. People and identity', '1. L\'être humain et l\'identité'],
    'vo.t2': ['二、家庭与关系', '2. Family and relationships', '2. La famille et les relations'],
    'vo.t3': ['三、身体与健康', '3. Body and health', '3. Le corps et la santé'],
    'vo.t4': ['四、外貌与性格', '4. Appearance and character', '4. L\'apparence et le caractère'],
    'vo.t5': ['五、房屋与居住', '5. Housing and daily life', '5. Le logement et la vie quotidienne'],
    'vo.t6': ['六、食物与餐饮', '6. Food and eating out', '6. Les aliments et la restauration'],
    'vo.t7': ['七、购物与消费', '7. Shopping and consumption', '7. Les achats et la consommation'],
    'vo.t8': ['八、衣物与时尚', '8. Clothes and fashion', '8. Les vêtements et la mode'],
    'vo.t9': ['九、城市与交通', '9. City and transport', '9. La ville et les transports'],
    'vo.t10': ['十、旅行与度假', '10. Travel and holidays', '10. Les voyages et les vacances'],
    'vo.t11': ['十一、工作与职业', '11. Work and jobs', '11. Le travail et les métiers'],
    'vo.t12': ['十二、教育与学习', '12. Education and learning', '12. L\'éducation et l\'apprentissage'],
    'vo.t13': ['十三、数字、时间与度量', '13. Numbers, time and measures', '13. Les nombres, le temps et les mesures'],
    'vo.t14': ['十四、天气与自然', '14. Weather and nature', '14. La météo et la nature'],
    'vo.t15': ['十五、科技与互联网', '15. Technology and the internet', '15. La technologie et Internet'],
    'vo.t16': ['十六、媒体与娱乐', '16. Media and entertainment', '16. Les médias et les loisirs'],
    'vo.t17': ['十七、体育与休闲', '17. Sport and leisure', '17. Le sport et les loisirs'],
    'vo.t18': ['十八、情感与态度', '18. Emotions and attitudes', '18. Les émotions et les attitudes'],
    'vo.t19': ['十九、社会与议题', '19. Society and current issues', '19. La société et les débats'],
    'vo.t20': ['二十、环境与生态', '20. Environment and ecology', '20. L\'environnement et l\'écologie'],
    'vo.t21': ['二十一、政治与法律', '21. Politics and law', '21. La politique et le droit'],
    'vo.t22': ['二十二、经济与金融', '22. Economy and finance', '22. L\'économie et la finance'],
    'vo.t23': ['二十三、文化与艺术', '23. Culture and the arts', '23. La culture et les arts'],
    'vo.t24': ['二十四、抽象概念与逻辑', '24. Abstract ideas and logic', '24. Les notions abstraites et la logique'],
    'vo.t25': ['二十五、高频动词与万能表达', '25. High-frequency verbs and handy phrases', '25. Verbes fréquents et expressions utiles'],
    'vo.toc.pourquoi': ['为什么 2500–3000 词', 'Why 2,500–3,000 words', 'Pourquoi 2 500 à 3 000 mots'],
    'vo.toc.methode': ['背词四步法', 'Four-step method', 'Méthode en quatre étapes'],
    'vo.toc.start': ['30 天启动词表', '30-day starter list', 'Liste de démarrage 30 jours'],
    'vo.toc.extra': ['补充高频词', 'Extra vocabulary', 'Vocabulaire complémentaire'],
    'vo.toc.morpho': ['构词法速览', 'Word formation', 'Formation des mots'],
    'vo.toc.genre': ['阴阳性规律', 'Noun gender', 'Genre des noms'],
    'vo.toc.syno': ['近义词辨析', 'Synonyms', 'Synonymes'],
    'vo.toc.faux': ['易混词 faux-amis', 'False friends', 'Faux-amis'],
    /* ---- dialogue.html：页面框架 ---- */
    'dl.eyebrow': ['情境对话 · Dialogues', 'Situational dialogues · Dialogues', 'Dialogues en situation · Dialogues'],
    'dl.h1': ['40 篇情境对话：从打招呼到辩论', '40 situational dialogues: from greetings to debate', '40 dialogues en situation : de la salutation au débat'],
    'dl.cta.method': ['听说法：影子跟读与精听', 'Listening method: shadowing and close listening', 'Méthode : shadowing et écoute fine'],
    'dl.cta.list': ['直接开始练', 'Start practising', 'Commencer à pratiquer'],
    'dl.cta.fillers': ['30 个口语填充词', '30 spoken fillers', '30 mots de remplissage'],
    'dl.cta.vocab': ['回到词汇库', 'Back to the vocabulary bank', 'Retour au vocabulaire'],
    'dl.h.method': ['一、怎么用对话练听说', '1. How to train listening and speaking with dialogues', '1. Travailler l\'oral avec les dialogues'],
    'dl.h.list': ['二、按等级筛选 40 篇对话', '2. Filter the 40 dialogues by level', '2. Filtrer les 40 dialogues par niveau'],
    'dl.h.fillers': ['四十二、30 个高频口语填充词与自然表达', '42. Thirty high-frequency spoken fillers and natural phrases', '42. Trente mots de remplissage et expressions naturelles'],
    'dl.h.steps': ['四十三、把对话变成口语输出：六步法', '43. Turn dialogues into speaking practice: six steps', '43. Des dialogues à l\'oral : la méthode en six étapes'],
    'dl.chip.all': ['全部 40 篇', 'All 40', 'Les 40'],
    'dl.count.pre': ['当前显示', 'Now showing', 'Affichage actuel'],
    'dl.count.post': ['篇对话', 'dialogues', 'dialogues'],
    'dl.th.expression': ['表达', 'Expression', 'Expression'],
    'dl.th.usage': ['用法与语气', 'Use and register', 'Emploi et registre'],
    'dl.th.example': ['例句', 'Example', 'Exemple'],
    'dl.filler.title': ['使用分寸', 'Register and restraint', 'Registre et mesure'],
    'dl.hint.method': ['长页面提示：用浏览器搜索（Ctrl+F）找场景关键词，例如「药店」「面试」「气候」。',
      'Long page tip: use your browser search (Ctrl+F) for scene keywords, e.g. "pharmacy", "interview", "climate".',
      'Page longue : utilisez la recherche du navigateur (Ctrl+F) pour trouver une scène : « pharmacie », « entretien », « climat ».'],

    /* ==== INDEX / CALENDAR（lead 维护，前缀 idx. / cal.） ==== */
    'idx.hero.eyebrow': ['一年 · 从零到 B2', 'One year · zero to B2', 'Un an · de zéro à B2'],
    'idx.hero.h1': ['一年把法语学到 B2，用一个页面管住全部学习。',
      'Learn French to B2 in one year, with a single page running the whole plan.',
      'Atteindre le B2 en français en un an, avec une seule page pour tout piloter.'],
    'idx.hero.lede': ['这不是一个"收藏了就不会再打开"的资料页，而是一套完整的封闭课程：<strong>52 周逐周路线</strong>，配发音体系、分级语法、2500 个核心词、40 篇情境对话和 4 套 DELF B2 模拟卷。你只需要按周打卡，剩下的交给路线。',
      'This is not a link you save and never open again: it is a complete, closed curriculum — a <strong>week-by-week 52-week route</strong> with a full pronunciation system, graded grammar, 2,500 core words, 40 situational dialogues and 4 full DELF B2 mock exams. You just check off each week; the route does the rest.',
      'Ce n\'est pas une page qu\'on met en favoris sans jamais l\'ouvrir : c\'est un parcours complet et fermé — <strong>52 semaines détaillées</strong>, avec un système de prononciation, une grammaire graduée, 2 500 mots essentiels, 40 dialogues et 4 examens blancs DELF B2. Vous cochez chaque semaine, le parcours fait le reste.'],
    'idx.hero.cta1': ['开始第 1 周 →', 'Start week 1 →', 'Commencer la semaine 1 →'],
    'idx.hero.cta2': ['先学发音（第 1 周任务）', 'Start with pronunciation (week 1)', 'Commencer par la prononciation (semaine 1)'],
    'idx.hero.cta3': ['怎么用这个站', 'How to use this site', 'Comment utiliser ce site'],
    'idx.hero.b2def': ['B2 是 CEFR 第四级：能听懂广播与辩论的主旨、读懂长篇论述、写出 250 词的论说文与正式信函、与母语者就广泛话题自然交谈而不吃力。DELF B2 通过线为 100 分制总分 ≥50 且单项 ≥5。',
      'B2 is the fourth CEFR level: you can follow the gist of broadcasts and debates, read long argumentative texts, write a 250-word essay or a formal letter, and hold a natural conversation with native speakers on a wide range of topics. DELF B2 is marked out of 100: you need 50 overall and at least 5 in every skill.',
      'Le B2 est le quatrième niveau du CECRL : vous suivez l\'essentiel des émissions et des débats, vous lisez de longs textes argumentatifs, vous rédigez un essai de 250 mots ou une lettre formelle, et vous conversez naturellement avec des locuteurs natifs sur des sujets variés. Le DELF B2 est noté sur 100 : il faut 50 au total et au moins 5 dans chaque épreuve.'],

    'idx.dash.title': ['我的进度', 'My progress', 'Ma progression'],
    'idx.dash.note': ['数据保存在你当前浏览器的本地存储里，不上传、不注册。',
      'Your data stays in this browser\'s local storage. No upload, no account.',
      'Vos données restent dans le stockage local de ce navigateur. Aucun envoi, aucun compte.'],
    'idx.dash.done': ['已完成周数 / 52', 'Weeks completed / 52', 'Semaines terminées / 52'],
    'idx.dash.cur': ['当前应学第几周', 'Current week', 'Semaine en cours'],
    'idx.dash.left': ['剩余周数', 'Weeks remaining', 'Semaines restantes'],
    'idx.dash.elapsed': ['已坚持天数', 'Days since you started', 'Jours depuis le début'],
    'idx.dash.start': ['起学日期', 'Start date', 'Date de début'],
    'idx.dash.phase': ['当前所在阶段', 'Current phase', 'Phase actuelle'],
    'idx.dash.range': ['本周区间', 'This week', 'Cette semaine'],
    'idx.dash.barNote': ['全年 52 周总进度。到 <a href="calendar.html">52 周计划</a> 里给完成的周打勾，这里会自动更新。',
      'Overall progress across the 52 weeks. Tick off weeks in the <a href="calendar.html">52-week plan</a> and this updates automatically.',
      'Progression globale sur les 52 semaines. Cochez les semaines dans le <a href="calendar.html">plan de 52 semaines</a> : cette barre se met à jour automatiquement.'],

    'idx.why.title': ['一年到 B2，凭什么可行', 'Why one year to B2 is realistic', 'Pourquoi un an pour atteindre le B2 est réaliste'],
    'idx.roadmap.title': ['四阶段路线图', 'The four-phase roadmap', 'La feuille de route en quatre phases'],
    'idx.daily.title': ['每天怎么学：2 小时标准循环', 'Your daily routine: the 2-hour loop', 'La routine quotidienne : la boucle de 2 heures'],
    'idx.modules.title': ['六大模块', 'Six modules', 'Six modules'],
    'idx.modules.note': ['每个模块都可以独立使用，但建议按路线图的顺序推进。',
      'Each module works on its own, but they are best used in the order of the roadmap.',
      'Chaque module s\'utilise seul, mais il est préférable de suivre l\'ordre de la feuille de route.'],
    'idx.how.title': ['怎么用这个站', 'How to use this site', 'Comment utiliser ce site'],

    'idx.mod.phon': ['发音与拼读', 'Pronunciation & spelling', 'Prononciation et orthographe'],
    'idx.mod.fromStart': ['A1 起点', 'Start here', 'Point de départ'],
    'idx.mod.phon.desc': ['法语字母表、35 音素 IPA 总表、联诵三类规则、哑音与词末辅音规律、语调节奏，附中国人常见发音陷阱对照与绕口令。',
      'The French alphabet, all 35 phonemes in IPA, the three liaison types, silent letters and final-consonant rules, stress and intonation — plus a table of the mistakes Chinese speakers make and tongue twisters.',
      'L\'alphabet français, les 35 phonèmes en API, les trois types de liaison, les lettres muettes et les consonnes finales, l\'accentuation et l\'intonation — avec les erreurs typiques des sinophones et des virelangues.'],
    'idx.mod.phon.cta': ['去学发音 →', 'Start with pronunciation →', 'Commencer par la prononciation →'],
    'idx.mod.cal': ['52 周课程表', '52-week curriculum', 'Programme de 52 semaines'],
    'idx.mod.cal.desc': ['逐周拆解的主题、语法点、词汇量目标、听说读写任务与阶段里程碑，可打勾打卡，自动计算当前周与总进度。',
      'Week by week: topic, grammar focus, vocabulary target, listening/speaking/reading/writing tasks and milestones. Tick weeks off and the current week and overall progress update automatically.',
      'Semaine par semaine : thème, point de grammaire, objectif de vocabulaire, tâches de compréhension et d\'expression, jalons. Cochez les semaines : la semaine en cours et la progression se calculent automatiquement.'],
    'idx.mod.cal.cta': ['查看 52 周 →', 'See the 52 weeks →', 'Voir les 52 semaines →'],
    'idx.mod.gr': ['语法体系', 'Grammar system', 'Grammaire'],
    'idx.mod.gr.desc': ['四级索引 + 两张详解页：从冠词性数到虚拟式、条件式过去时、时态配合、名词化与书面语体，每点配例句、翻译与易错提示。',
      'A four-level index plus two in-depth pages: from articles and gender to the subjunctive, past conditional, tense agreement, nominalisation and written register — each point with examples, translations and pitfalls.',
      'Un index par niveau et deux pages détaillées : des articles et du genre au subjonctif, au conditionnel passé, à la concordance des temps, à la nominalisation et au registre écrit — chaque point avec exemples, traductions et pièges.'],
    'idx.mod.gr.cta': ['进入语法 →', 'Open grammar →', 'Ouvrir la grammaire →'],
    'idx.mod.vo': ['核心词汇 2500+', '2,500+ core words', '2 500 mots essentiels et plus'],
    'idx.mod.vo.desc': ['25 个主题域的高频词，逐条带 IPA、中文释义与常用搭配，可按 A1–B2 筛选，附构词法、近义词辨析与假朋友清单。',
      'High-frequency words across 25 themes, each with IPA, a Chinese gloss and a common collocation; filter by A1–B2. Includes word formation, synonym distinctions and a list of faux amis.',
      'Des mots fréquents répartis en 25 thèmes, chacun avec l\'API, une glose chinoise et une collocation ; filtrable de A1 à B2. Avec la formation des mots, les nuances de synonymes et les faux amis.'],
    'idx.mod.vo.cta': ['开始背词 →', 'Start learning words →', 'Commencer le vocabulaire →'],
    'idx.mod.dl': ['情境对话 40 篇', '40 situational dialogues', '40 dialogues en situation'],
    'idx.mod.dl.desc': ['A1 到 B2 的真实场景对话，法中对照逐句呈现，含场景说明、生词、语用提示与输出任务，可直接做影子跟读。',
      'Real-life dialogues from A1 to B2, French and Chinese line by line, with a scene brief, key words, usage notes and an output task — ready for shadowing.',
      'Des dialogues authentiques de A1 à B2, français et chinois ligne par ligne, avec le contexte, le vocabulaire, des notes d\'usage et une tâche de production — prêts pour le shadowing.'],
    'idx.mod.dl.cta': ['练听说 →', 'Practise listening & speaking →', 'Travailler l\'oral →'],
    'idx.mod.ex': ['DELF B2 考试', 'DELF B2 exam', 'Examen DELF B2'],
    'idx.mod.ex.desc': ['题型与评分细则、听力速记法、250 词论说文模板与三档范文、口语辩论表达、4 套完整模拟卷与资源清单。',
      'Task types and marking criteria, note-taking for listening, a 250-word essay template with three graded samples, debate phrases for the speaking test, 4 full mock exams and a resource list.',
      'Types d\'épreuves et barème, prise de notes à l\'écoute, modèle de dissertation de 250 mots avec trois copies notées, expressions pour l\'oral, 4 examens blancs complets et une liste de ressources.'],
    'idx.mod.ex.cta': ['准备考试 →', 'Prepare for the exam →', 'Préparer l\'examen →'],

    'idx.why.lede': ['B2 不是天赋问题，是总量问题。按 FSI（美国外交学院）的语言难度分级，<strong>法语对英语母语者属于"约 30 周高强度"的类别</strong>；法语与英语共享大量词汇，而对中文母语者来说真正的额外成本主要在发音、性和动词变位。所以把时间给够了，进度是可以被设计出来的。',
      'B2 is not a talent question, it is a volume question. On the FSI (US Foreign Service Institute) difficulty scale, <strong>French counts as a roughly 30-week intensive language for English speakers</strong>; French and English share a large vocabulary, so for Chinese speakers the real extra cost is pronunciation, gender and verb conjugation. Give it enough hours and progress can be engineered.',
      'Le B2 n\'est pas une question de talent mais de volume. Sur l\'échelle de difficulté du FSI (Foreign Service Institute), <strong>le français représente environ 30 semaines d\'étude intensive pour un anglophone</strong> ; le français et l\'anglais partagent un vaste vocabulaire, si bien que pour un sinophone le coût supplémentaire réel réside dans la prononciation, le genre et la conjugaison. Avec assez d\'heures, la progression se planifie.'],
    'idx.why.c1.title': ['① 时间总量够', '1. You have enough hours', '1. Assez d\'heures'],
    'idx.why.c1.body': ['每周 <strong>12–14 小时</strong>（每天约 2 小时 + 周末复盘），一年约 <strong>650–700 小时</strong>。这是从零到 B2 的现实区间（A1 约 80h、A2 约 200h、B1 约 400h、B2 约 650h）。',
      '<strong>12–14 hours per week</strong> (about 2 hours a day plus weekend review) comes to <strong>650–700 hours a year</strong>. That is the realistic range from zero to B2 (A1 ≈ 80 h, A2 ≈ 200 h, B1 ≈ 400 h, B2 ≈ 650 h).',
      '<strong>12 à 14 heures par semaine</strong> (environ 2 heures par jour plus le bilan du week-end), soit <strong>650 à 700 heures par an</strong>. C\'est la fourchette réaliste de zéro à B2 (A1 ≈ 80 h, A2 ≈ 200 h, B1 ≈ 400 h, B2 ≈ 650 h).'],
    'idx.why.c2.title': ['② 路线不浪费', '2. The route wastes nothing', '2. Un parcours sans perte'],
    'idx.why.c2.body': ['52 周按"语音 → 骨架 → 输出 → 论述"排列，语法点按出现频率排序，高频结构先学，冷门语法留到 B2 后段，避免零基础初期被细节拖死。',
      'The 52 weeks run "sounds → skeleton → output → argument": grammar points are ordered by how often they occur, high-frequency structures come first and rare grammar waits until the B2 phase, so a beginner never drowns in detail.',
      'Les 52 semaines suivent l\'ordre « sons → structure → production → argumentation » : les points de grammaire sont classés par fréquence, les structures fréquentes d\'abord, la grammaire rare plus tard, pour qu\'un débutant ne se noie pas dans les détails.'],
    'idx.why.c3.title': ['③ 输出被强制', '3. Output is non-negotiable', '3. La production est obligatoire'],
    'idx.why.c3.body': ['每天必须"说"和"写"，40% 时间用于产出。B2 的瓶颈几乎从来不是"没学过"，而是"学过但调不出来"——只能靠输出解决。',
      'Every day you must speak and write: 40% of the time goes to production. The B2 bottleneck is almost never "I never learned it" but "I learned it and cannot retrieve it" — and only output fixes that.',
      'Chaque jour, il faut parler et écrire : 40 % du temps va à la production. Le blocage au niveau B2 n\'est presque jamais « je ne l\'ai pas appris » mais « je l\'ai appris et je n\'arrive pas à le réutiliser » — seule la production y remédie.'],
    'idx.why.boundary.title': ['先说清楚边界（不吹"包过"）', 'Let us be honest about the limits', 'Soyons honnêtes sur les limites'],
    'idx.why.boundary.body': ['本站把 B2 所需的<strong>全部内容、顺序、练习与检测</strong>都编排好了，但结果由你的出勤决定。经验上：每周有效投入 ≥12 小时、不出现连续 3 天以上中断、输出时长占比 ≥40%，一年达到 B2 是大概率事件；反之，只输入不输出、或每周不足 5 小时，通常停在 A2–B1。所以本页的"保证"是<strong>课程完整性</strong>的保证：不跳步、不缺口、每周都有可检验的产出。',
      'This site arranges <strong>all the content, order, practice and testing</strong> that B2 requires, but the outcome depends on your attendance. In practice: at least 12 effective hours a week, no gap longer than 3 days, and at least 40% of time spent producing, and reaching B2 in a year is highly likely. Conversely, input-only study, or under 5 hours a week, usually plateaus at A2–B1. So what this site guarantees is <strong>curricular completeness</strong>: no skipped steps, no gaps, and a verifiable output every week.',
      'Ce site organise <strong>tout le contenu, l\'ordre, les exercices et les contrôles</strong> exigés par le B2, mais le résultat dépend de votre assiduité. En pratique : au moins 12 heures efficaces par semaine, aucune interruption de plus de 3 jours et au moins 40 % du temps en production, et atteindre le B2 en un an est très probable. À l\'inverse, une étude purement réceptive ou moins de 5 heures par semaine plafonne en général à A2–B1. La garantie de ce site porte donc sur <strong>la complétude du programme</strong> : aucune étape sautée, aucun trou, et une production vérifiable chaque semaine.'],
    'idx.why.more': ['继续看完整论证 →', 'Read the full argument →', 'Lire l\'argumentation complète →'],

    /* ==== CALENDAR（lead 维护） ==== */
    'cal.title': ['52 周课程表', 'The 52-week curriculum', 'Le programme de 52 semaines'],
    'cal.eyebrow': ['课程主干', 'The backbone', 'Le socle'],
    'cal.lede': ['一年 52 周，每周一个主题、一个语法重点、一个词汇量目标，以及雷打不动的听说读写四项任务。点击任意周即可查看当周清单；完成的周会变绿，进度自动保存在本机。',
      'Fifty-two weeks: every week has a topic, a grammar focus, a vocabulary target and the four non-negotiable tasks (listening, speaking, reading, writing). Click any week to see its checklist; completed weeks turn green and your progress is saved in this browser.',
      'Cinquante-deux semaines : chaque semaine a un thème, un point de grammaire, un objectif de vocabulaire et les quatre tâches incontournables (écouter, parler, lire, écrire). Cliquez sur une semaine pour voir sa liste ; les semaines terminées deviennent vertes et la progression est enregistrée dans ce navigateur.'],
    'cal.progress.title': ['进度追踪', 'Progress tracker', 'Suivi de progression'],
    'cal.planEnd': ['计划结束', 'Plan ends', 'Fin du programme'],
    'cal.doneWeeks': ['已完成周数', 'Weeks completed', 'Semaines terminées'],
    'cal.current': ['当前应学', 'Current week', 'Semaine en cours'],
    'cal.thisWeek': ['本周日期', 'This week', 'Cette semaine'],
    'cal.resetLabel': ['重置进度', 'Reset progress', 'Réinitialiser'],
    'cal.baseWeek': ['起点周次', 'Starting week', 'Semaine de départ'],
    'cal.grid.title': ['逐周清单', 'Week-by-week checklist', 'Liste semaine par semaine'],
    'week.prefix': ['第', 'Week', 'Semaine'],
    'week.suffix': ['周', '', ''],
    'cal.stage1': ['第 1–13 周', 'Weeks 1–13', 'Semaines 1–13'],
    'cal.stage2': ['第 14–26 周', 'Weeks 14–26', 'Semaines 14–26'],
    'cal.stage3': ['第 27–40 周', 'Weeks 27–40', 'Semaines 27–40'],
    'cal.stage4': ['第 41–52 周', 'Weeks 41–52', 'Semaines 41–52'],
    'cal.grid.note': ['绿色 = 已完成。数据只存在本机浏览器；清空缓存会丢失打卡记录，建议每 13 周截图存档。',
      'Green = completed. Data stays in this browser only; clearing the cache loses your check-ins, so screenshot your progress every 13 weeks.',
      'Vert = terminé. Les données restent dans ce navigateur ; vider le cache efface vos coches, pensez à faire une capture d\'écran toutes les 13 semaines.'],
    'cal.how.title': ['怎么执行这张表', 'How to run this schedule', 'Comment suivre ce programme'],
    'cal.how.week.title': ['每周固定节奏', 'The weekly rhythm', 'Le rythme hebdomadaire'],
    'cal.how.week.list': ['<li>周一：读当周清单，把词汇导入背词工具（30 分钟）</li><li>周二–周五：每天 2 小时标准循环（词汇→语法→精听→口语→阅读→写作）</li><li>周六：3 小时输出日（写作 + 口语 + 语伴/AI 对话）</li><li>周日：1 小时复盘（错题、当周自测、打勾）</li>',
      '<li>Monday: read the week\'s checklist and load the vocabulary into your flashcard tool (30 min)</li><li>Tuesday–Friday: the 2-hour loop (vocabulary → grammar → close listening → speaking → reading → writing)</li><li>Saturday: a 3-hour output day (writing + speaking + a conversation partner or AI)</li><li>Sunday: 1 hour of review (redo mistakes, self-test the week, tick it off)</li>',
      '<li>Lundi : lire la liste de la semaine et charger le vocabulaire dans votre outil de révision (30 min)</li><li>Mardi–vendredi : la boucle de 2 heures (vocabulaire → grammaire → écoute fine → oral → lecture → écrit)</li><li>Samedi : 3 heures de production (écrit + oral + un partenaire ou une IA)</li><li>Dimanche : 1 heure de bilan (refaire les erreurs, s\'auto-tester, cocher la semaine)</li>'],
    'cal.how.gate.title': ['四个关卡周', 'Four gate weeks', 'Quatre semaines jalons'],
    'cal.how.gate.body': ['第 <strong>13 / 26 / 40 / 52</strong> 周是硬性关卡，只做检测与补漏，不学新内容。每次都要录音 + 写文章存档，因为没有留痕就无法判断进步。未达标不要硬走：补 1–2 周再进下一阶段，比带病前进便宜得多。',
      'Weeks <strong>13 / 26 / 40 / 52</strong> are hard gates: testing and gap-filling only, no new material. Always record audio and archive a written piece — without a record you cannot measure progress. If you do not pass, do not push on: take 1–2 extra weeks before the next phase, which is far cheaper than moving forward with holes.',
      'Les semaines <strong>13 / 26 / 40 / 52</strong> sont des jalons fermes : contrôle et rattrapage seulement, aucun contenu nouveau. Enregistrez toujours l\'audio et archivez un texte : sans trace, impossible de mesurer les progrès. En cas d\'échec, n\'avancez pas de force : prenez 1 à 2 semaines de plus, c\'est bien moins coûteux que d\'avancer avec des lacunes.'],
    'cal.short.title': ['时间不够怎么办', 'If you have less time', 'Si vous manquez de temps'],
    'cal.short.body': ['每天只有 1 小时：保留"词汇 20 分钟 + 输出 40 分钟"两项不可省，听力和阅读挪到通勤泛听泛读；进度会自然拉长到 18–24 个月，这是正常的，比每天 1 小时只背单词、两年后不会说要好得多。',
      'With only one hour a day: keep the two non-negotiables — 20 minutes of vocabulary and 40 minutes of output — and move listening and reading into your commute as extensive practice. The plan will stretch to 18–24 months, which is normal, and far better than one hour a day of vocabulary only and still not being able to speak after two years.',
      'Avec une seule heure par jour : gardez les deux incontournables — 20 minutes de vocabulaire et 40 minutes de production — et déplacez l\'écoute et la lecture dans vos trajets en pratique extensive. Le programme s\'étalera sur 18 à 24 mois, ce qui est normal et bien préférable à une heure de vocabulaire par jour sans jamais parler au bout de deux ans.'],
    'cal.cta.phon': ['去学第 1–2 周：发音', 'Start weeks 1–2: pronunciation', 'Commencez les semaines 1–2 : prononciation'],

    /* ==== I18N-CORE（i18n-core 维护，前缀 core.） ==== */
    'core.langChanged': ['语言已切换为 {lang}', 'Language switched to {lang}', 'Langue changée en {lang}'],
    'core.onboard.title': ['先做 60 秒自评，选好你的起点',
      'Take the 60-second self-check and set your starting point',
      'Faites l\'auto-évaluation de 60 secondes et fixez votre point de départ'],
    'core.onboard.cta': ['去设置', 'Set it up', 'Configurer'],
    'core.onboard.close': ['关闭提示', 'Dismiss', 'Fermer'],
    'core.hintKey': ['提示：Alt+L 可切换界面语言',
      'Tip: press Alt+L to switch interface language',
      'Astuce : Alt+L pour changer la langue de l\'interface'],
  };

  /* ======================= 2. 语言状态 ======================= */
  function detect() {
    /* ① 显式参数优先：?lang=en / ?lang=fr / #lang=zh（便于分享与自动化测试） */
    var q = (location.search + location.hash).toLowerCase();
    var m = q.match(/lang=(zh|en|fr)/);
    if (m) return m[1];
    /* ② 上次选择 */
    var saved = null;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    if (saved && SUPPORTED.indexOf(saved) > -1) return saved;
    /* ③ 浏览器语言 */
    var nav = (navigator.language || 'zh').toLowerCase();
    if (nav.indexOf('fr') === 0) return 'fr';
    if (nav.indexOf('en') === 0) return 'en';
    return 'zh';
  }

  var current = detect();
  var listeners = [];

  function t(key, vars) {
    var row = UI[key];
    var s = row ? (row[SUPPORTED.indexOf(current)] || row[0]) : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return s;
  }
  /* 始终取中文（用于「显示中文对照」按钮） */
  function tzh(key) {
    var row = UI[key];
    return row ? row[0] : key;
  }

  /* 供扩展词典（如生成出来的 lang-weeks.js）注册 key：
     register({ 'week.1.title': ['中文','English','Français'], ... })
     已存在的 key 不覆盖，避免扩展文件改写核心 UI 文案。 */
  function register(dict) {
    if (!dict || typeof dict !== 'object') return 0;
    var n = 0;
    Object.keys(dict).forEach(function (k) {
      if (Object.prototype.hasOwnProperty.call(UI, k)) return;
      var row = dict[k];
      if (!Array.isArray(row)) return;
      UI[k] = row;
      n++;
    });
    return n;
  }

  /* ======================= 3. 日期本地化 ======================= */
  var MONTHS = {
    zh: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
  };

  function fmtDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso + 'T00:00:00');
    var y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
    if (current === 'zh') return y + '\u00a0年\u00a0' + (m + 1) + '\u00a0月\u00a0' + day + '\u00a0日';
    if (current === 'fr') return day + '\u00a0' + MONTHS.fr[m] + '\u00a0' + y;
    return MONTHS.en[m] + '\u00a0' + day + ',\u00a0' + y;
  }
  function fmtRange(a, b) { return fmtDate(a) + ' – ' + fmtDate(b); }

  /* ======================= 4. 应用翻译 ======================= */
  /* 让含 {year} 等占位符的 key 自动注入变量 */
  var AUTO_VARS = { year: function () { return new Date().getFullYear(); } };
  function autoVars(s) {
    Object.keys(AUTO_VARS).forEach(function (k) {
      if (s.indexOf('{' + k + '}') > -1) {
        s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), String(AUTO_VARS[k]()));
      }
    });
    return s;
  }

  function apply() {
    document.documentElement.setAttribute('lang', current);
    document.documentElement.setAttribute('data-lang', current);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (el.hasAttribute('data-i18n-keep') && el.dataset.i18nDone === '1') return;
      el.textContent = autoVars(t(k));
      el.dataset.i18nDone = '1';
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html');
      var html = autoVars(t(k));
      if (html !== k) el.innerHTML = html;
    });
    /* data-i18n-attr="title:key;aria-label:key2" */
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i < 0) return;
        var attr = pair.slice(0, i).trim(), key = pair.slice(i + 1).trim();
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    /* 内容型双语块 */
    document.querySelectorAll('[data-lang-zh]').forEach(function (el) {
      el.hidden = current !== 'zh' && !showZh;
    });
    document.querySelectorAll('[data-lang-alt]').forEach(function (el) {
      el.hidden = el.getAttribute('data-lang-alt') !== current;
    });
    syncSwitcher();
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    listeners.forEach(function (cb) { try { cb(current); } catch (e) {} });
  }

  var showZh = false; /* 界面为 en/fr 时，是否同时显示中文对照 */

  /* ======================= 5. 语言切换器 ======================= */
  function injectSwitcher() {
    var nav = document.querySelector('.site-nav .wrap');
    if (!nav || document.getElementById('langSwitch')) return;

    var box = document.createElement('div');
    box.className = 'lang-switch';
    box.id = 'langSwitch';
    var label = document.createElement('span');
    label.className = 'lang-label';
    label.setAttribute('data-i18n', 'lang.label');
    label.textContent = t('lang.label');
    box.appendChild(label);

    SUPPORTED.forEach(function (code) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lang-btn';
      b.setAttribute('data-lang-code', code);
      b.setAttribute('data-i18n-attr', 'title:lang.switch;aria-label:lang.switch');
      b.textContent = NAMES[code];
      b.addEventListener('click', function () { setLang(code); });
      box.appendChild(b);
    });

    var zhToggle = document.createElement('button');
    zhToggle.type = 'button';
    zhToggle.className = 'lang-btn lang-zh-toggle hidden';
    zhToggle.id = 'zhToggle';
    zhToggle.title = '中文对照';
    zhToggle.setAttribute('aria-label', '中文对照');
    zhToggle.textContent = '中文对照';
    zhToggle.addEventListener('click', function () {
      showZh = !showZh;
      try { localStorage.setItem('fr.ui.showZh', JSON.stringify(showZh)); } catch (e) {}
      zhToggle.classList.toggle('active', showZh);
      apply();
    });
    box.appendChild(zhToggle);

    nav.appendChild(box);
  }

  function syncSwitcher() {
    var box = document.getElementById('langSwitch');
    if (!box) return;
    box.querySelectorAll('.lang-btn[data-lang-code]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang-code') === current);
    });
    var zhToggle = document.getElementById('zhToggle');
    if (zhToggle) {
      zhToggle.classList.toggle('hidden', current === 'zh');
      zhToggle.classList.toggle('active', showZh);
      zhToggle.textContent = showZh ? '隐藏中文' : '中文对照';
    }
    var label = box.querySelector('.lang-label');
    if (label) label.textContent = t('lang.label');
  }

  function setLang(code) {
    if (SUPPORTED.indexOf(code) < 0) return;
    current = code;
    try { localStorage.setItem(STORE, code); } catch (e) {}
    apply();
    /* 让页面内自定义脚本也能响应（例如重渲染动态表格） */
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: code } }));
  }

  /* ======================= 6. 启动 ======================= */
  function boot() {
    try { showZh = JSON.parse(localStorage.getItem('fr.ui.showZh') || 'false'); } catch (e) {}
    injectSwitcher();
    apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.LANG = {
    t: t, tzh: tzh, fmtDate: fmtDate, fmtRange: fmtRange,
    set: setLang, get: function () { return current; },
    supported: SUPPORTED, names: NAMES,
    register: register,
    /* 给 app.js 用：页面加载完但 DOM 变化后，让新节点也被翻译 */
    refresh: apply
  };
  /* 兼容简短调用 */
  window.t = t;
})();
