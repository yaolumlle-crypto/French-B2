/* ==========================================================================
   法语 B2 · 一年计划 —— 真题风格大题集 (exam-items.js)
   数据契约：DAILY-CONTRACT.md 第 4 节
   命名空间：window.EXAM_ITEMS
   包含：听力 5 条 / 阅读 5 条 / 写作 5 条 / 口语 5 条，共 20 条。
   每条 questions 里的字段完全遵守契约第 2 节：
     id / level / skill / prompt / options / answer / explain / source
   题目 id 使用 9xxx 序号段（q-<skill>-<level>-9xxx），与 quiz-bank.js 的
   0001 起编号错开，避免全站 id 冲突。
   ========================================================================== */
window.EXAM_ITEMS = [

  /* ====================== 一、听力 listening（5 条） ====================== */
  {
    id: "ex-b2-listening-01",
    level: "B2",
    skill: "listening",
    title: "电台辩论：是否应该禁止一次性塑料",
    textFr: "Bonsoir, vous écoutez « Le débat du soir ». Ce soir, la question est simple : faut-il interdire les emballages en plastique à usage unique ? Dans notre pays, chaque habitant en jette en moyenne quatre-vingt-cinq kilos par an, un chiffre qui a doublé depuis vingt ans. Pour notre invitée, la députée Claire Fontaine, l'interdiction est inévitable : le recyclage ne suffit plus, il faut tarir la source, sinon nous laisserons à nos enfants un océan de déchets. L'industriel Marc Dubreuil n'est pas du tout de cet avis. Selon lui, remplacer le plastique par le verre ou le carton alourdirait les transports et, au bout du compte, augmenterait les émissions de gaz à effet de serre : interdire, dit-il, c'est agir vite pour mal faire. Une chose est sûre : les deux invités s'accordent sur un point, rien ne changera sans une politique européenne commune, car un pays seul ne pèse rien face aux multinationales.",
    instructions: "先盲听两遍再答题，第三遍对照原文核对。第一遍只抓框架（谁在说话、主题、分几部分），第二遍核对数字与态度词。注意 quatre-vingt-cinq 的换算，以及否定与转折之后才是真实立场。",
    questions: [
      {
        id: "q-listening-b2-9001",
        level: "B2",
        skill: "listening",
        prompt: "Pourquoi, selon Claire Fontaine, l'interdiction est-elle inévitable ?",
        options: [
          "Parce que le recyclage ne suffit plus et qu'il faut tarir la source du problème.",
          "Parce que le plastique coûte trop cher aux ménages.",
          "Parce que les industriels refusent de recycler leurs produits."
        ],
        answer: "Parce que le recyclage ne suffit plus et qu'il faut tarir la source du problème.",
        explain: "原文 « le recyclage ne suffit plus, il faut tarir la source » 是典型的同义替换考点：tarir la source（截断源头）＝ 从生产端减少，而不是「回收做得更好」。选项「parce que le plastique coûte trop cher aux ménages」无中生有——原文从未提价格；选项「parce que les industriels refusent de recycler leurs produits」把「产业结构问题」偷换成「企业拒绝回收」，原文没有这样的指控。",
        source: "DELF B2 听力 · 电台辩论（真题风格）"
      },
      {
        id: "q-listening-b2-9002",
        level: "B2",
        skill: "listening",
        prompt: "Combien de kilos de plastique à usage unique chaque habitant jette-t-il en moyenne par an ?",
        options: ["85 kilos", "45 kilos", "20 kilos"],
        answer: "85 kilos",
        explain: "原文 « quatre-vingt-cinq kilos par an »，法语 80 以上要条件反射式换算：quatre-vingt-cinq = 4 × 20 + 5 = 85。45 与 20 都是把句子里的其他数字（vingt ans、doublé depuis vingt ans）误听或搬用，属于数字陷阱。",
        source: "DELF B2 听力 · 数字与时间"
      },
      {
        id: "q-listening-b2-9003",
        level: "B2",
        skill: "listening",
        prompt: "Quel est l'argument principal de Marc Dubreuil ?",
        options: [
          "Remplacer le plastique par le verre ou le carton alourdirait les transports et augmenterait les émissions de gaz à effet de serre.",
          "Le plastique reste, en toute circonstance, le matériau le moins polluant.",
          "Les consommateurs refusent de trier leurs déchets."
        ],
        answer: "Remplacer le plastique par le verre ou le carton alourdirait les transports et augmenterait les émissions de gaz à effet de serre.",
        explain: "他反对禁令的理由是「替代材料更重、运输排放更多」，属于成本—效益论证。选项 « en toute circonstance » 含绝对化表达，口语材料极少说绝对话，这是 DELF 最常见的绝对化干扰项；选项「les consommateurs refusent de trier leurs déchets」把责任推给消费者，原文完全没有提到。",
        source: "DELF B2 听力 · 观点归属"
      },
      {
        id: "q-listening-b2-9004",
        level: "B2",
        skill: "listening",
        prompt: "Sur quel point les deux invités finissent-ils par se rejoindre ?",
        options: [
          "Sur la nécessité d'une politique européenne commune.",
          "Sur la nécessité d'interdire immédiatement les emballages.",
          "Sur l'inutilité du recyclage."
        ],
        answer: "Sur la nécessité d'une politique européenne commune.",
        explain: "原文 « les deux invités s'accordent sur un point, rien ne changera sans une politique européenne commune »，s'accordent ＝ 意见一致（同义替换：être d'accord）。选项「interdire immédiatement」与 Marc Dubreuil 的立场直接相反；选项「l'inutilité du recyclage」是对 Claire Fontaine 的过度解读——她说「回收不够」，不等于「回收无用」。",
        source: "DELF B2 听力 · 共识与分歧"
      }
    ]
  },

  {
    id: "ex-b2-listening-02",
    level: "B2",
    skill: "listening",
    title: "企业访谈：四天工作制试行一年之后",
    textFr: "Journaliste : Vous avez testé la semaine de quatre jours pendant un an dans votre entreprise. Quel bilan en tirez-vous ? Directrice : Au début, j'étais sceptique, je l'avoue. Nous redoutions une baisse de production. Or, après douze mois, la production a progressé de sept pour cent et les arrêts maladie ont diminué de moitié. En réalité, ce ne sont pas les heures qui manquaient, c'était l'organisation. Journaliste : Et du côté des salariés ? Directrice : Ils sont presque tous satisfaits, mais je ne prétends pas que ce soit une recette miracle. Nos clients, eux, ont mis du temps à s'habituer : le vendredi, personne ne répondait au téléphone. Nous avons donc embauché une personne chargée de l'accueil. Le dispositif n'est pas gratuit : il faut accepter de revoir toute la manière de travailler. Si c'était à refaire, je le referais sans hésiter.",
    instructions: "听两遍后作答。第二遍重点核对：试行几个月、产量变化的具体百分比、缺勤变化，以及说话人自己承认的「保留意见」。注意 mais 与 « je ne prétends pas que » 之后的内容往往是态度题答案。",
    questions: [
      {
        id: "q-listening-b2-9005",
        level: "B2",
        skill: "listening",
        prompt: "Comment la directrice décrit-elle son état d'esprit au début de l'expérience ?",
        options: [
          "Elle était sceptique et craignait une baisse de production.",
          "Elle était convaincue d'avance du succès du dispositif.",
          "Elle était indifférente au résultat de l'essai."
        ],
        answer: "Elle était sceptique et craignait une baisse de production.",
        explain: "原文 « j'étais sceptique » ＋ « Nous redoutions une baisse de production »，态度题答案就在这类态度词里（sceptique 怀疑、redouter 担心）。选项「convaincue d'avance」与原文相反；选项「indifférente」无中生有——她全程在细致评估，不可能无所谓。",
        source: "DELF B2 听力 · 态度题"
      },
      {
        id: "q-listening-b2-9006",
        level: "B2",
        skill: "listening",
        prompt: "Quels résultats l'entreprise a-t-elle obtenus après douze mois ?",
        options: [
          "La production a augmenté de 7 % et les arrêts maladie ont été divisés par deux.",
          "La production a baissé de 7 % et l'absentéisme a doublé.",
          "La production est restée stable, mais l'absentéisme a reculé."
        ],
        answer: "La production a augmenté de 7 % et les arrêts maladie ont été divisés par deux.",
        explain: "« la production a progressé de sept pour cent » ＋ « les arrêts maladie ont diminué de moitié »。diminuer de moitié ＝ 减少一半 ＝ être divisé(e) par deux，这是听力高频同义替换。选项「a baissé de 7 %」把增减方向整体颠倒，是典型的正负号陷阱。",
        source: "DELF B2 听力 · 数据细节与同义替换"
      },
      {
        id: "q-listening-b2-9007",
        level: "B2",
        skill: "listening",
        prompt: "Pourquoi l'entreprise a-t-elle embauché une personne chargée de l'accueil ?",
        options: [
          "Parce que les clients ne joignaient plus personne le vendredi.",
          "Parce que les salariés refusaient de répondre au téléphone.",
          "Parce que la loi obligeait l'entreprise à créer ce poste."
        ],
        answer: "Parce que les clients ne joignaient plus personne le vendredi.",
        explain: "原文 « Nos clients, eux, ont mis du temps à s'habituer : le vendredi, personne ne répondait au téléphone »，问题是星期五无人接听，因此补一个接待岗。选项「les salariés refusaient de répondre」把制度性后果歪曲成员工主观拒绝，属于因果替换；选项「la loi obligeait」无中生有。",
        source: "DELF B2 听力 · 推断题"
      },
      {
        id: "q-listening-b2-9008",
        level: "B2",
        skill: "listening",
        prompt: "Quelle réserve la directrice exprime-t-elle sur le dispositif ?",
        options: [
          "Ce n'est pas une solution miracle et il faut accepter de revoir toute l'organisation.",
          "Les salariés se plaignent de travailler davantage qu'avant.",
          "Le dispositif coûte trop cher en salaires supplémentaires."
        ],
        answer: "Ce n'est pas une solution miracle et il faut accepter de revoir toute l'organisation.",
        explain: "「je ne prétends pas que ce soit une recette miracle」＋「il faut accepter de revoir toute la manière de travailler」：她承认这不是万灵药，且改革成本是组织成本，不是金钱成本。选项「se plaignent de travailler davantage」与「salariés presque tous satisfaits」矛盾；选项「coûte trop cher en salaires」把组织成本偷换为工资成本，原文说的是新招一名接待人员，不是普调工资。",
        source: "DELF B2 听力 · 态度与细微差别"
      }
    ]
  },

  {
    id: "ex-b1-listening-03",
    level: "B1",
    skill: "listening",
    title: "日常电话：预约看房",
    textFr: "Agence : Bonjour, vous appelez pour l'appartement de la rue Pasteur ? Cliente : Oui. J'ai vu l'annonce : trois pièces, six cent cinquante euros par mois, charges comprises. Est-ce qu'il est encore libre ? Agence : Il l'était ce matin, mais j'ai déjà deux visites cet après-midi. Je vous le dis franchement : si vous êtes intéressée, il faut venir rapidement. Cliente : Je peux passer demain matin à dix heures ? Agence : Dix heures trente, plutôt : je suis en rendez-vous avant. Il faut apporter une pièce d'identité, vos trois derniers bulletins de salaire et un justificatif de domicile. Cliente : Le loyer est bien de six cent cinquante euros, tout compris ? Agence : Presque : le chauffage est individuel, donc l'électricité n'est pas incluse. Comptez une quarantaine d'euros en plus par mois. Cliente : D'accord, à demain dix heures trente.",
    instructions: "听两遍后作答。这通电话里有三次「信息纠正」（时间被改、价格没有全包、看房要快），纠正处就是考点。注意 une quarantaine d'euros 表示「大约四十欧元」。",
    questions: [
      {
        id: "q-listening-b1-9009",
        level: "B1",
        skill: "listening",
        prompt: "Combien la cliente devra-t-elle prévoir par mois, en tout et pour tout ?",
        options: ["Environ 690 euros", "650 euros exactement", "Environ 750 euros"],
        answer: "Environ 690 euros",
        explain: "房租 650 €（charges comprises），但 « l'électricité n'est pas incluse. Comptez une quarantaine d'euros en plus »，所以还要再加约 40 €，合计约 690 €。选项「650 euros exactement」正是原文被纠正的说法（客户的 tout compris 是误以为）；选项「Environ 750 euros」多算了一百欧元。",
        source: "DELF B1 听力 · 日常对话（数字计算）"
      },
      {
        id: "q-listening-b1-9010",
        level: "B1",
        skill: "listening",
        prompt: "À quelle heure le rendez-vous est-il finalement fixé ?",
        options: ["À dix heures trente, demain matin", "À dix heures, demain matin", "À onze heures trente, demain matin"],
        answer: "À dix heures trente, demain matin",
        explain: "客户提议 dix heures，中介纠正为 « Dix heures trente, plutôt »，最终约定是 10h30。选项「À dix heures」正是客户自己提的时间，属于「所提非所定」陷阱；选项「À onze heures trente」把 10h30 的 dix 与 onze 混听。",
        source: "DELF B1 听力 · 信息纠正"
      },
      {
        id: "q-listening-b1-9011",
        level: "B1",
        skill: "listening",
        prompt: "Pourquoi l'agent conseille-t-il de venir rapidement ?",
        options: [
          "Parce que deux visites sont déjà prévues dans l'après-midi et que l'appartement pourrait être pris.",
          "Parce que le loyer va augmenter la semaine prochaine.",
          "Parce que l'agence ferme pour les vacances."
        ],
        answer: "Parce que deux visites sont déjà prévues dans l'après-midi et que l'appartement pourrait être pris.",
        explain: "« j'ai déjà deux visites cet après-midi » ＋ « si vous êtes intéressée, il faut venir rapidement » 合起来推出结论。这是推断题：原文没有直说「可能会被租走」，但这是唯一合逻辑的原因。选项「le loyer va augmenter」与「l'agence ferme pour les vacances」均无中生有。",
        source: "DELF B1 听力 · 推断题"
      },
      {
        id: "q-listening-b1-9012",
        level: "B1",
        skill: "listening",
        prompt: "Quels documents la cliente doit-elle apporter ?",
        options: [
          "Une pièce d'identité, ses trois derniers bulletins de salaire et un justificatif de domicile.",
          "Son contrat de travail et son dernier avis d'imposition.",
          "Une attestation de son ancien propriétaire."
        ],
        answer: "Une pièce d'identité, ses trois derniers bulletins de salaire et un justificatif de domicile.",
        explain: "原文逐项列举：pièce d'identité / trois derniers bulletins de salaire / justificatif de domicile。另外两项都是同类替换（用材料清单里其他常见文件替换原件），听的时候要靠「列举顺序 + 数字 trois」定位。",
        source: "DELF B1 听力 · 列举细节"
      }
    ]
  },

  {
    id: "ex-b2-listening-04",
    level: "B2",
    skill: "listening",
    title: "广播报道：自行车道引发的城市争论",
    textFr: "À Lyon, comme dans beaucoup de villes françaises, les pistes cyclables ont poussé partout en trois ans. La mairie s'en félicite : le nombre de cyclistes a augmenté de soixante pour cent et la pollution du centre a reculé. Mais tous les habitants ne partagent pas cet enthousiasme. Dans le quartier de la Guillotière, les commerçants se plaignent : on a supprimé cent vingt places de stationnement, nos clients viennent en voiture et ne trouvent plus où se garer ; certains ont simplement changé de quartier. Un automobiliste résume le sentiment général : je ne suis pas contre le vélo, je suis contre le fait qu'on décide sans nous. Interrogé, l'adjoint au maire reconnaît que la concertation a été trop rapide. Il annonce une réunion publique au mois de juin et la création de deux cents places de parking en périphérie. Nous ne reviendrons pas en arrière, précise-t-il, mais nous pouvons mieux faire.",
    instructions: "听两遍后作答。这类报道结构固定：官方成绩 → 反对声音 → 官方回应。态度题先分清「谁说的」；数字题注意 soixante pour cent 与 cent vingt 的区别。",
    questions: [
      {
        id: "q-listening-b2-9013",
        level: "B2",
        skill: "listening",
        prompt: "De combien le nombre de cyclistes a-t-il augmenté en trois ans ?",
        options: ["De 60 %", "De 16 %", "De 20 %"],
        answer: "De 60 %",
        explain: "« le nombre de cyclistes a augmenté de soixante pour cent »，soixante ＝ 60。选项「De 16 %」是把 soixante 听成 seize 的经典误听；选项「De 20 %」借用了后面的数字（deux cents places、cent vingt）制造干扰。",
        source: "DELF B2 听力 · 数字细节"
      },
      {
        id: "q-listening-b2-9014",
        level: "B2",
        skill: "listening",
        prompt: "Que reprochent les commerçants du quartier ?",
        options: [
          "La suppression de cent vingt places de stationnement, qui éloigne leur clientèle.",
          "L'interdiction totale de la voiture dans tout le centre-ville.",
          "La hausse des impôts locaux décidée par la mairie."
        ],
        answer: "La suppression de cent vingt places de stationnement, qui éloigne leur clientèle.",
        explain: "原文 « on a supprimé cent vingt places de stationnement » ＋ « certains ont simplement changé de quartier »。选项「interdiction totale … tout le centre-ville」用绝对化表达，原文只提停车位减少，并没有禁车；选项「hausse des impôts locaux」属于无中生有。",
        source: "DELF B2 听力 · 细节定位与绝对化干扰"
      },
      {
        id: "q-listening-b2-9015",
        level: "B2",
        skill: "listening",
        prompt: "Quelle est la position de l'automobiliste cité dans le reportage ?",
        options: [
          "Il n'est pas hostile au vélo, mais il critique l'absence de concertation.",
          "Il est opposé au vélo par principe et demande la suppression des pistes.",
          "Il soutient la mairie et juge les commerçants trop sévères."
        ],
        answer: "Il n'est pas hostile au vélo, mais il critique l'absence de concertation.",
        explain: "原文 « je ne suis pas contre le vélo, je suis contre le fait qu'on décide sans nous »：这是 B2 最爱考的部分否定——先否认「反对自行车」，再点出真正的不满是决策过程。选项「opposé au vélo par principe」把否定对象搞反；选项「soutient la mairie」与原文批评口吻相反。",
        source: "DELF B2 听力 · 部分否定与态度"
      },
      {
        id: "q-listening-b2-9016",
        level: "B2",
        skill: "listening",
        prompt: "Que propose l'adjoint au maire ?",
        options: [
          "Maintenir les pistes, organiser une réunion publique et créer des places de parking en périphérie.",
          "Revenir en arrière et rendre les places de stationnement supprimées.",
          "Transférer la décision au ministère des Transports."
        ],
        answer: "Maintenir les pistes, organiser une réunion publique et créer des places de parking en périphérie.",
        explain: "原文给出三项措施：réunion publique en juin、deux cents places en périphérie，并且明确 « Nous ne reviendrons pas en arrière »，所以「维持自行车道」是隐含前提。选项「Revenir en arrière」与这句话直接矛盾；选项「Transférer la décision au ministère」无中生有。",
        source: "DELF B2 听力 · 回应与措施"
      }
    ]
  },

  {
    id: "ex-a2-listening-05",
    level: "A2",
    skill: "listening",
    title: "车站广播与站台问询",
    textFr: "Annonce : Le train à destination de Marseille, départ prévu à quatorze heures cinquante-deux, voie numéro six, partira avec un retard d'environ vingt minutes. Les voyageurs sont priés de se rendre en voie six et de ne pas monter dans le train avant l'annonce officielle. Voyageuse : Excusez-moi, monsieur, le train pour Marseille est en retard ? Contrôleur : Oui, madame, environ vingt minutes. Vous avez le temps de prendre un café, mais restez près de la voie six. Voyageuse : Merci. Est-ce que le wagon numéro douze est bien au fond du train ? Contrôleur : Non, madame, en général la seconde classe est au milieu. Le wagon douze se trouve cinq voitures après la locomotive. Ne vous inquiétez pas, il y a des panneaux sur le quai.",
    instructions: "听两遍后作答。先听广播里的时间、站台号与延误时长，再听对话里对「车厢位置」的纠正。注意 quatorze heures cinquante-deux 是 14h52。",
    questions: [
      {
        id: "q-listening-a2-9017",
        level: "A2",
        skill: "listening",
        prompt: "À quelle heure le train devait-il partir ?",
        options: ["À 14h52", "À 14h32", "À 15h12"],
        answer: "À 14h52",
        explain: "广播说 « départ prévu à quatorze heures cinquante-deux »，即 14h52。法语报时是「24 小时制 + heures + 分钟」，选项「À 14h32」把 cinquante-deux（52）听成 trente-deux（32），选项「À 15h12」移动了小时数。",
        source: "DELF A2 听力 · 车站广播（时间）"
      },
      {
        id: "q-listening-a2-9018",
        level: "A2",
        skill: "listening",
        prompt: "De combien de temps le train est-il retardé ?",
        options: ["D'environ 20 minutes", "D'environ 12 minutes", "D'environ 25 minutes"],
        answer: "D'environ 20 minutes",
        explain: "广播与乘务员都说了 « environ vingt minutes »，两次出现互相印证。选项「D'environ 12 minutes」借用了车厢号 douze，「D'environ 25 minutes」是 vingt-cinq 的近似音，都属于数字近似干扰。",
        source: "DELF A2 听力 · 延误信息"
      },
      {
        id: "q-listening-a2-9019",
        level: "A2",
        skill: "listening",
        prompt: "Où se trouve le wagon numéro douze ?",
        options: [
          "Cinq voitures après la locomotive.",
          "Au fond du train.",
          "Au milieu du train, avec la seconde classe."
        ],
        answer: "Cinq voitures après la locomotive.",
        explain: "乘务员明确说 « Le wagon douze se trouve cinq voitures après la locomotive »。选项「Au fond du train」是乘客自己先说的猜测（« … est bien au fond du train ? »），被回答 Non 否定；选项「Au milieu du train」来自「二等车厢通常在中部」这一普遍说法，注意 en général 表示一般情况，不等于 12 号车厢的位置。",
        source: "DELF A2 听力 · 对方猜测与纠正"
      },
      {
        id: "q-listening-a2-9020",
        level: "A2",
        skill: "listening",
        prompt: "Que conseille le contrôleur à la voyageuse ?",
        options: [
          "Elle peut prendre un café, mais elle doit rester près de la voie six.",
          "Elle peut monter tout de suite dans le wagon douze.",
          "Elle doit aller au guichet pour se faire rembourser."
        ],
        answer: "Elle peut prendre un café, mais elle doit rester près de la voie six.",
        explain: "« Vous avez le temps de prendre un café, mais restez près de la voie six »，mais 之后才是真正的要求。选项「monter tout de suite」与广播「ne pas monter dans le train avant l'annonce officielle」矛盾；选项「aller au guichet pour se faire rembourser」无中生有。",
        source: "DELF A2 听力 · 建议与要求"
      }
    ]
  },

  /* ====================== 二、阅读 reading（5 条） ====================== */
  {
    id: "ex-b2-reading-01",
    level: "B2",
    skill: "reading",
    title: "阅读：远程办公会让市中心空心化吗",
    textFr: "Depuis la généralisation du télétravail, une question travaille les maires des grandes villes : que deviendront nos centres ? La tendance est réelle. En cinq ans, la demande de bureaux a reculé de près d'un quart dans certaines métropoles, tandis que les locations en périphérie, plus grandes et moins chères, progressent. Pour les économistes de la chambre de commerce, le phénomène est sain : les salariés gagnent du temps, les entreprises réduisent leurs coûts, et les villes moyennes attirent enfin de nouveaux habitants. D'autres, en revanche, tirent la sonnette d'alarme. Selon eux, si les bureaux se vident, c'est tout un écosystème qui s'effondre : les cafés, les restaurants et les commerces de proximité vivent d'abord de la clientèle des employés. Un centre-ville sans travailleurs serait, disent-ils, un décor sans vie, et les recettes municipales en souffriraient aussi. Pourtant, le débat oppose souvent deux camps qui oublient l'essentiel. La question n'est pas de savoir si l'on travaille au bureau ou chez soi, mais si l'espace urbain reste habité toute la semaine. Or, ce qui manque le plus dans nos centres, ce n'est ni la demande ni l'argent : c'est le logement. Tant que les loyers y resteront inabordables pour les familles, aucun aménagement de bureaux ne redonnera vie aux quartiers.",
    instructions: "先读题、划关键词，再读正文（限时 12 分钟）。注意三段式结构：第一段提出问题并给出两种立场，第二段是对立论点，最后两段「Pourtant… Or…」才是作者自己的判断。词汇题要回到上下句判断，不要按常见义硬套。",
    questions: [
      {
        id: "q-reading-b2-9021",
        level: "B2",
        skill: "reading",
        prompt: "Quelle est l'idée essentielle du texte ?",
        options: [
          "Le vrai problème des centres-villes n'est pas le télétravail, mais le manque de logements abordables.",
          "Le télétravail va disparaître et les bureaux seront de nouveau pleins.",
          "Les centres-villes doivent être transformés en zones commerciales."
        ],
        answer: "Le vrai problème des centres-villes n'est pas le télétravail, mais le manque de logements abordables.",
        explain: "答案落在最后三句：「ce qui manque le plus dans nos centres […] c'est le logement. Tant que les loyers y resteront inabordables…」。这是典型的「把问题移位」手法——作者认为双方都问错了问题。选项「le télétravail va disparaître」是原文没有的预测；选项「transformés en zones commerciales」把原文提到的「商铺受影响」升级为「改成商业区」，属于无中生有。",
        source: "DELF B2 阅读 · 主旨题（社会经济）"
      },
      {
        id: "q-reading-b2-9022",
        level: "B2",
        skill: "reading",
        prompt: "Que soutiennent les économistes de la chambre de commerce ?",
        options: [
          "Le phénomène est positif : les salariés gagnent du temps et les villes moyennes attirent de nouveaux habitants.",
          "Le phénomène est catastrophique pour l'emploi dans les métropoles.",
          "Il faut interdire le télétravail pour sauver les commerces de proximité."
        ],
        answer: "Le phénomène est positif : les salariés gagnent du temps et les villes moyennes attirent de nouveaux habitants.",
        explain: "定位到 « Pour les économistes de la chambre de commerce, le phénomène est sain »，后面三项都是理由。sain 在此语境是「健康、良性」，与 positif 同义。选项「catastrophique」是第二段 D'autres 阵营的观点，属于「观点归属错位」；选项「interdire le télétravail」两派都没说。",
        source: "DELF B2 阅读 · 细节定位与观点归属"
      },
      {
        id: "q-reading-b2-9023",
        level: "B2",
        skill: "reading",
        prompt: "Quelle est l'attitude de l'auteur ?",
        options: [
          "Il juge le débat mal posé et déplace la question vers le logement.",
          "Il prend nettement parti pour les entreprises contre les commerçants.",
          "Il annonce la fin inévitable des centres-villes."
        ],
        answer: "Il juge le débat mal posé et déplace la question vers le logement.",
        explain: "标志词是 « Pourtant, le débat oppose souvent deux camps qui oublient l'essentiel »：作者先中立转述两派，再用 Pourtant 批评双方，最后把焦点移到 logement。选项「prend nettement parti pour les entreprises」与作者对两派的批评不符；选项「annonce la fin inévitable」是把作者的警告误读为预言，文中用的是条件句 Tant que…，并未断言必然如此。",
        source: "DELF B2 阅读 · 作者态度"
      },
      {
        id: "q-reading-b2-9024",
        level: "B2",
        skill: "reading",
        prompt: "Que signifie l'expression « tirer la sonnette d'alarme » dans ce texte ?",
        options: [
          "Attirer l'attention sur un danger.",
          "Célébrer une réussite économique.",
          "Refuser de participer au débat public."
        ],
        answer: "Attirer l'attention sur un danger.",
        explain: "该短语字面是「拉响警铃」，语境是 D'autres, en revanche… 后面列举「整个生态崩塌」的后果，所以是「发出警告」。选项「Célébrer une réussite」正好相反；选项「Refuser de participer」把「警告」错解为「退出」，考的是短语义而非字面义。",
        source: "DELF B2 阅读 · 词语在语境中的含义"
      }
    ]
  },

  {
    id: "ex-b2-reading-02",
    level: "B2",
    skill: "reading",
    title: "阅读：人工智能进入编辑部",
    textFr: "Depuis deux ans, l'intelligence artificielle s'est installée dans les rédactions. Elle rédige les résultats sportifs, traduit des dépêches, propose des titres et trie des milliers de documents en quelques secondes. Ses partisans rappellent qu'aucun outil n'a jamais supprimé le journalisme : l'imprimerie, la photographie, puis Internet ont transformé le métier sans le faire disparaître. Ils font valoir qu'en libérant les journalistes des tâches répétitives, l'IA leur rend du temps pour ce qui compte : enquêter, vérifier, rencontrer des témoins. Les syndicats, eux, sont plus réservés. Ils redoutent une réduction des effectifs, mais surtout une confusion des genres : un texte produit en trois secondes a-t-il été vérifié ? Qui en porte la responsabilité en cas d'erreur ? À leurs yeux, le risque n'est pas technique, il est démocratique : si le lecteur ne sait plus qui parle, il finit par ne plus croire personne. Le débat gagnerait pourtant à être déplacé. La véritable question n'est pas de savoir si l'IA doit entrer dans les rédactions — elle y est déjà — mais à quelles conditions. Ce qui manque aujourd'hui, ce n'est pas la technologie, c'est la transparence : indiquer clairement au lecteur ce qui a été produit par une machine, et sous la responsabilité de qui.",
    instructions: "限时 12 分钟。第一遍只看每段首句和 « mais » « pourtant » 后的句子，抓住双方立场；第二遍带着题目回原文定位。注意破折号中间的内容（— elle y est déjà —）往往是作者的判断依据。",
    questions: [
      {
        id: "q-reading-b2-9025",
        level: "B2",
        skill: "reading",
        prompt: "Que rappellent les partisans de l'intelligence artificielle ?",
        options: [
          "D'autres innovations ont transformé le journalisme sans le faire disparaître.",
          "L'intelligence artificielle remplacera tous les journalistes d'ici dix ans.",
          "Les journalistes refusent d'utiliser les outils numériques."
        ],
        answer: "D'autres innovations ont transformé le journalisme sans le faire disparaître.",
        explain: "原文 « aucun outil n'a jamais supprimé le journalisme : l'imprimerie, la photographie, puis Internet… »，用历史类比证明技术不等于失业。选项「remplacera tous les journalistes」正好是支持者反对的结论，且含绝对化 tous；选项「refusent d'utiliser les outils numériques」属于无中生有。",
        source: "DELF B2 阅读 · 细节定位（科技议题）"
      },
      {
        id: "q-reading-b2-9026",
        level: "B2",
        skill: "reading",
        prompt: "Quel est, selon les syndicats, le risque principal ?",
        options: [
          "Un risque démocratique : le lecteur ne sait plus qui parle et perd confiance.",
          "Un risque purement technique : les machines font trop de fautes de frappe.",
          "Un risque financier : les abonnements deviennent trop chers."
        ],
        answer: "Un risque démocratique : le lecteur ne sait plus qui parle et perd confiance.",
        explain: "原文 « À leurs yeux, le risque n'est pas technique, il est démocratique »。这是「否定—更正」结构，命题人常用被否定的那一项（technique）做干扰。选项「risque purement technique」正好是原文明确排除的；选项「abonnements trop chers」无中生有。",
        source: "DELF B2 阅读 · 否定结构与观点归属"
      },
      {
        id: "q-reading-b2-9027",
        level: "B2",
        skill: "reading",
        prompt: "Quelle position l'auteur défend-il dans le dernier paragraphe ?",
        options: [
          "Le débat doit porter non sur la présence de l'IA, mais sur les conditions et la transparence.",
          "L'intelligence artificielle doit être interdite dans les rédactions.",
          "L'IA est un outil neutre et le débat n'a pas lieu d'être."
        ],
        answer: "Le débat doit porter non sur la présence de l'IA, mais sur les conditions et la transparence.",
        explain: "原文 « La véritable question n'est pas de savoir si l'IA doit entrer dans les rédactions — elle y est déjà — mais à quelles conditions »，随后点出 manque la transparence。选项「doit être interdite」与「elle y est déjà」矛盾；选项「outil neutre et le débat n'a pas lieu d'être」与作者通篇主张「要定条件」相反。",
        source: "DELF B2 阅读 · 作者态度"
      },
      {
        id: "q-reading-b2-9028",
        level: "B2",
        skill: "reading",
        prompt: "Que désigne l'expression « une confusion des genres » dans ce contexte ?",
        options: [
          "Le mélange, pour le lecteur, entre textes écrits par des humains et textes produits par une machine.",
          "Le mélange de plusieurs langues dans un même article.",
          "Un désaccord profond entre plusieurs syndicats."
        ],
        answer: "Le mélange, pour le lecteur, entre textes écrits par des humains et textes produits par une machine.",
        explain: "紧接其后的两句给出解释：« un texte produit en trois secondes a-t-il été vérifié ? Qui en porte la responsabilité ? »，再往后是 « si le lecteur ne sait plus qui parle »。genres 在这里指文本的「来源类别」（人 / 机器），不是文学体裁，也不是语言混用。选项「mélange de langues」利用 genre 的另一个义项设套。",
        source: "DELF B2 阅读 · 词语在语境中的含义"
      }
    ]
  },

  {
    id: "ex-b2-reading-03",
    level: "B2",
    skill: "reading",
    title: "阅读：一次性塑料禁令五年之后",
    textFr: "En 2021, la France a interdit plusieurs objets en plastique à usage unique : pailles, couverts, touillettes, boîtes en polystyrène. Cinq ans plus tard, le bilan est plus contrasté qu'on ne l'espérait. La production mondiale de plastique, elle, n'a pas ralenti : elle a même augmenté de dix pour cent. Comment l'expliquer ? D'abord, parce qu'aucun pays ne peut agir seul : un objet interdit ici se fabrique ailleurs et revient par le commerce en ligne. Ensuite, parce que les substituts ne sont pas toujours plus propres. Le carton et le papier, par exemple, exigent de l'eau, des transports et parfois des colles difficiles à recycler. Pourtant, renoncer serait une erreur. Les chercheurs sont clairs : ce n'est pas l'objet jetable en lui-même qui pose problème, c'est la quantité que nous en consommons et la façon dont il est conçu. Un emballage réellement recyclable, collecté partout et réutilisé dix fois, pèse moins lourd qu'un emballage « écologique » à usage unique. Le vrai levier n'est donc ni la liste des produits interdits, ni le choix du matériau : c'est la conception même des emballages et la filière de collecte. Autrement dit, la loi a ouvert la voie ; elle n'a pas encore changé le système.",
    instructions: "限时 12 分钟。本文是「提出问题 → 两种解释 → 转折 → 指出症结」的典型论说结构；D'abord… Ensuite… 是解释层，Pourtant 之后才是作者主张。注意 « écologique » 加引号表示反讽。",
    questions: [
      {
        id: "q-reading-b2-9029",
        level: "B2",
        skill: "reading",
        prompt: "Quelle thèse l'auteur défend-il ?",
        options: [
          "L'interdiction seule ne suffit pas : le vrai levier est la conception des emballages et la filière de collecte.",
          "L'interdiction de 2021 a permis de faire baisser la production mondiale de plastique.",
          "Il faudrait revenir au plastique, car les substituts sont tous plus polluants."
        ],
        answer: "L'interdiction seule ne suffit pas : le vrai levier est la conception des emballages et la filière de collecte.",
        explain: "结论句 « Le vrai levier n'est donc ni la liste des produits interdits, ni le choix du matériau : c'est la conception même des emballages et la filière de collecte »。选项「a permis de faire baisser la production mondiale」与原文 « la production […] a même augmenté de dix pour cent » 相反；选项「il faudrait revenir au plastique」与 « renoncer serait une erreur » 正面冲突，且 tous plus polluants 属绝对化。",
        source: "DELF B2 阅读 · 主旨题（环境议题）"
      },
      {
        id: "q-reading-b2-9030",
        level: "B2",
        skill: "reading",
        prompt: "Pourquoi la production mondiale de plastique n'a-t-elle pas reculé ?",
        options: [
          "Parce qu'aucun pays ne peut agir seul et qu'un produit interdit ici est fabriqué ailleurs.",
          "Parce que les consommateurs refusent de changer leurs habitudes.",
          "Parce que le plastique est le seul matériau réellement recyclable."
        ],
        answer: "Parce qu'aucun pays ne peut agir seul et qu'un produit interdit ici est fabriqué ailleurs.",
        explain: "D'abord 引出的第一条解释即答案：« aucun pays ne peut agir seul : un objet interdit ici se fabrique ailleurs et revient par le commerce en ligne »。选项「les consommateurs refusent de changer」文中没有出现，属于把责任归给个人这一常见臆测；选项「le seul matériau réellement recyclable」与原文对 carton、papier 的批评矛盾，且 seul 绝对化。",
        source: "DELF B2 阅读 · 细节定位与原因"
      },
      {
        id: "q-reading-b2-9031",
        level: "B2",
        skill: "reading",
        prompt: "Quel reproche est adressé aux matériaux de substitution ?",
        options: [
          "Le carton et le papier demandent de l'eau, des transports et parfois des colles difficiles à recycler.",
          "Ils coûtent beaucoup plus cher que le plastique.",
          "Ils sont interdits dans la plupart des pays européens."
        ],
        answer: "Le carton et le papier demandent de l'eau, des transports et parfois des colles difficiles à recycler.",
        explain: "定位 Ensuite 句：« les substituts ne sont pas toujours plus propres. Le carton et le papier, par exemple, exigent de l'eau, des transports et parfois des colles difficiles à recycler »。选项「coûtent beaucoup plus cher」原文未提价格；选项「interdits dans la plupart des pays」无中生有。",
        source: "DELF B2 阅读 · 细节定位（论据）"
      },
      {
        id: "q-reading-b2-9032",
        level: "B2",
        skill: "reading",
        prompt: "Que signifie « le bilan est plus contrasté qu'on ne l'espérait » ?",
        options: [
          "Le résultat mêle des progrès et des échecs, et il est moins favorable que prévu.",
          "Le résultat est entièrement négatif et l'interdiction a échoué.",
          "Le résultat est meilleur que prévu et la production a reculé."
        ],
        answer: "Le résultat mêle des progrès et des échecs, et il est moins favorable que prévu.",
        explain: "contrasté 指「明暗对比明显、褒贬并存」；后文同时给出「禁令已出台」与「全球产量反增 10 %」，正是喜忧参半。esperait 表示原本期待更好，故「不如预期」。选项「entièrement négatif」忽略了作者最后「renoncer serait une erreur / la loi a ouvert la voie」的肯定；选项「meilleur que prévu」相反。",
        source: "DELF B2 阅读 · 词语在语境中的含义"
      }
    ]
  },

  {
    id: "ex-b1-reading-04",
    level: "B1",
    skill: "reading",
    title: "阅读：青少年与屏幕，该不该设时限",
    textFr: "Les adolescents passent en moyenne quatre heures par jour devant un écran, sans compter le temps scolaire. Faut-il fixer une limite ? Une partie des parents en est convaincue : poser des règles claires, disent-ils, protège le sommeil, l'attention et les résultats scolaires. Certaines familles vont jusqu'à interdire tout téléphone avant seize ans. D'autres trouvent cette solution simpliste. Le problème, rappellent-ils, n'est pas la durée mais l'usage : une heure de cours de musique en ligne n'a rien à voir avec une heure de vidéos courtes. Ils ajoutent que l'interdiction pousse souvent les jeunes à cacher leurs pratiques, ce qui rend le dialogue plus difficile encore. Entre ces deux positions, un point semble faire l'unanimité chez les chercheurs : ce n'est pas l'écran qui crée le malaise, c'est le vide qu'il remplit. Un adolescent qui a des amis, un sport, un projet, passe naturellement moins de temps en ligne. Le débat sur les minutes oublie donc l'essentiel : plutôt que de compter les heures, il vaudrait mieux se demander ce que le jeune fait de son temps, et avec qui.",
    instructions: "限时 10 分钟。B1 阅读的关键是分清「谁的观点」：先看家长一方，再看 D'autres 一方，最后看研究者的共识。最后一句 souvent 出现 donc，是全文结论。",
    questions: [
      {
        id: "q-reading-b1-9033",
        level: "B1",
        skill: "reading",
        prompt: "Quelle est l'idée principale du texte ?",
        options: [
          "Compter les heures est moins utile que s'intéresser à ce que le jeune fait de son temps.",
          "Il faut interdire le téléphone portable avant seize ans.",
          "Les écrans n'ont aucune influence sur les adolescents."
        ],
        answer: "Compter les heures est moins utile que s'intéresser à ce que le jeune fait de son temps.",
        explain: "结论句 « Le débat sur les minutes oublie donc l'essentiel : plutôt que de compter les heures, il vaudrait mieux se demander ce que le jeune fait de son temps — et avec qui »。选项「interdire avant seize ans」只是部分家长的做法，不是作者结论；选项「aucune influence」绝对化，作者承认空虛感是问题。",
        source: "DELF B1 阅读 · 主旨题"
      },
      {
        id: "q-reading-b1-9034",
        level: "B1",
        skill: "reading",
        prompt: "Quel reproche les opposants à une limite adressent-ils à l'interdiction ?",
        options: [
          "Elle pousse les jeunes à cacher leurs pratiques et complique le dialogue.",
          "Elle coûte trop cher aux familles.",
          "Elle n'est jamais appliquée par les écoles."
        ],
        answer: "Elle pousse les jeunes à cacher leurs pratiques et complique le dialogue.",
        explain: "原文 « l'interdiction pousse souvent les jeunes à cacher leurs pratiques, ce qui rend le dialogue plus difficile encore »。选项「coûte trop cher」与「les écoles» 在文中都没有对应内容，属于无中生有。",
        source: "DELF B1 阅读 · 细节定位"
      },
      {
        id: "q-reading-b1-9035",
        level: "B1",
        skill: "reading",
        prompt: "Quelle distinction les opposants font-ils ?",
        options: [
          "Ils distinguent la durée de l'usage.",
          "Ils distinguent les filles et les garçons.",
          "Ils distinguent le téléphone et l'ordinateur."
        ],
        answer: "Ils distinguent la durée de l'usage.",
        explain: "原文 « Le problème […] n'est pas la durée mais l'usage : une heure de cours de musique en ligne n'a rien à voir avec une heure de vidéos courtes »。n'est pas A mais B 是 B1 阅读最高频的对比结构，答案永远在 mais 之后。其余两个选项的对比维度在文中不存在。",
        source: "DELF B1 阅读 · 对比结构"
      },
      {
        id: "q-reading-b1-9036",
        level: "B1",
        skill: "reading",
        prompt: "Que signifie « un point semble faire l'unanimité chez les chercheurs » ?",
        options: [
          "Les chercheurs se rejoignent sur un point.",
          "Les chercheurs sont totalement en désaccord.",
          "Les chercheurs refusent de répondre à cette question."
        ],
        answer: "Les chercheurs se rejoignent sur un point.",
        explain: "faire l'unanimité ＝ 取得一致、无人反对，所以是「研究者在一个点上看法相同」。选项「totalement en désaccord」意思相反；选项「refusent de répondre」把「达成共识」错解为「回避」，属于生造。",
        source: "DELF B1 阅读 · 词语在语境中的含义"
      }
    ]
  },

  {
    id: "ex-b2-reading-05",
    level: "B2",
    skill: "reading",
    title: "阅读：过度旅游，谁该为「人满为患」负责",
    textFr: "À Venise, à Barcelone comme sur la côte bretonne, le même mot revient : la surfréquentation. Dans certains quartiers, un habitant sur trois a quitté son logement en dix ans, remplacé par des locations de courte durée. Faut-il alors limiter le nombre de visiteurs ? Les professionnels du tourisme s'y opposent fermement. Le tourisme, rappellent-ils, représente des millions d'emplois et fait vivre des régions entières ; les touristes d'aujourd'hui financeront peut-être les musées de demain. Taxer ou plafonner, selon eux, reviendrait à punir une activité utile au moment même où les communes ont besoin de recettes. Les habitants, en revanche, ne parlent pas de chiffres mais de vie quotidienne : des rues où l'on ne peut plus marcher, des commerces qui ne vendent plus ni pain ni outils, mais des souvenirs, des écoles qui ferment faute d'enfants. Le conflit ne porte donc pas sur le nombre de touristes, mais sur ce qu'une ville accepte de devenir. Or, la solution la plus souvent citée — un malus sur les locations touristiques — ne traite que le logement. Ce qui manque, c'est une règle du jeu commune : tant que chaque plateforme fixe seule ses limites, les villes s'épuisent à courir après un phénomène qu'elles ne contrôlent pas.",
    instructions: "限时 12 分钟。三段结构：现象与提问 → 两派论点 → « Le conflit ne porte donc pas sur… mais sur… » 与 Or… 引出症结。主旨题与态度题的答案都在最后两句。",
    questions: [
      {
        id: "q-reading-b2-9037",
        level: "B2",
        skill: "reading",
        prompt: "Quelle est la thèse de l'auteur ?",
        options: [
          "L'enjeu réel est ce qu'une ville accepte de devenir, et il manque une règle commune aux plateformes.",
          "Il faut interdire le tourisme dans les villes les plus visitées.",
          "Les touristes sont les seuls responsables de la hausse des loyers."
        ],
        answer: "L'enjeu réel est ce qu'une ville accepte de devenir, et il manque une règle commune aux plateformes.",
        explain: "两句一起构成结论：« Le conflit ne porte donc pas sur le nombre de touristes, mais sur ce qu'une ville accepte de devenir » ＋ « Ce qui manque, c'est une règle du jeu commune »。选项「interdire le tourisme」在文中无人主张，属于极端化改写；选项「les seuls responsables」用 seul 绝对化，且作者明确指出单靠「旅游住房附加税」不够。",
        source: "DELF B2 阅读 · 主旨题（社会经济）"
      },
      {
        id: "q-reading-b2-9038",
        level: "B2",
        skill: "reading",
        prompt: "Quel argument les professionnels du tourisme avancent-ils ?",
        options: [
          "Le tourisme fait vivre des régions entières et taxer reviendrait à punir une activité utile.",
          "Le tourisme ne crée plus d'emplois depuis dix ans.",
          "Il faut plafonner le nombre de visiteurs à un million par an."
        ],
        answer: "Le tourisme fait vivre des régions entières et taxer reviendrait à punir une activité utile.",
        explain: "定位 « Le tourisme, rappellent-ils, représente des millions d'emplois et fait vivre des régions entières » 与 « Taxer ou plafonner […] reviendrait à punir une activité utile »。选项「ne crée plus d'emplois」与原文恰好相反；选项「plafonner à un million」把行业反对的措施说成行业主张，属于观点归属错位。",
        source: "DELF B2 阅读 · 细节定位与观点归属"
      },
      {
        id: "q-reading-b2-9039",
        level: "B2",
        skill: "reading",
        prompt: "Comment les habitants expriment-ils leur mécontentement, selon le texte ?",
        options: [
          "Ils parlent de la vie quotidienne : rues, commerces, écoles.",
          "Ils citent des statistiques économiques sur les recettes municipales.",
          "Ils demandent la fermeture des musées de la ville."
        ],
        answer: "Ils parlent de la vie quotidienne : rues, commerces, écoles.",
        explain: "原文 « Les habitants, en revanche, ne parlent pas de chiffres mais de vie quotidienne : des rues où l'on ne peut plus marcher, des commerces qui ne vendent plus ni pain ni outils, mais des souvenirs, des écoles qui ferment… »。选项「citent des statistiques」正是文中被否定的说法（ne parlent pas de chiffres）；选项「fermeture des musées」无中生有，文中只提到游客可能「资助」博物馆。",
        source: "DELF B2 阅读 · 对比与细节"
      },
      {
        id: "q-reading-b2-9040",
        level: "B2",
        skill: "reading",
        prompt: "Que signifie « un habitant sur trois a quitté son logement en dix ans » ?",
        options: [
          "Un tiers environ des habitants est parti pendant cette période.",
          "Trois habitants seulement ont déménagé.",
          "Tous les habitants ont été remplacés par des touristes."
        ],
        answer: "Un tiers environ des habitants est parti pendant cette période.",
        explain: "« un … sur trois » 是法语分数表达，等于 un tiers（三分之一）。选项「Trois habitants seulement」把比例误读为具体人数；选项「Tous les habitants」用 tous 绝对化，原文只说三分之—，属于典型量化陷阱。",
        source: "DELF B2 阅读 · 数量表达与词语含义"
      }
    ]
  },

  /* ====================== 三、写作 writing（5 条） ====================== */
  {
    id: "ex-b2-writing-01",
    level: "B2",
    skill: "writing",
    title: "写作：给市长写信，反对取消市中心免费停车",
    textFr: "Sujet : La mairie de votre ville envisage de supprimer le stationnement gratuit en centre-ville afin de financer de nouvelles pistes cyclables. Le maire a ouvert une consultation publique. Vous lui écrivez une lettre pour exprimer votre opposition à cette mesure, en présentant vos arguments et en proposant des solutions alternatives. Vous respectez la forme d'une lettre formelle. 250 mots environ.",
    instructions: "限时 40 分钟，写 250 词左右（230–270 均可）。必须做到三件事：① 用正式书信格式（称呼 + 引言 + 论证 + 建议 + 结束语 + 署名）；② 至少两个具体论点，每个论点配一个事实或例子；③ 回应反方最强论据（自行车道能减少污染），再提出折中方案。不要写成口号堆砌，也不要用 tu。",
    questions: [
      {
        id: "q-writing-b2-9041",
        level: "B2",
        skill: "writing",
        prompt: "Quelle formule d'appel convient à cette lettre ?",
        options: ["Monsieur le Maire,", "Salut Monsieur,", "Cher ami,"],
        answer: "Monsieur le Maire,",
        explain: "写给市长的正式信，称呼用 Monsieur le Maire,（女性市长则 Madame la Maire,），后接逗号并另起一行。Salut Monsieur 属于口语；Cher ami 把行政关系私人化，两者都与书信的语域不符，DELF B2 写作的「语域恰当」一项会直接扣分。",
        source: "DELF B2 写作 · 正式书信语域"
      },
      {
        id: "q-writing-b2-9042",
        level: "B2",
        skill: "writing",
        prompt: "Quelle stratégie argumentative est la plus efficace dans une lettre d'opposition ?",
        options: [
          "Reconnaître l'objectif visé par la mairie, puis proposer une solution alternative chiffrée.",
          "Refuser tout dialogue et menacer la mairie d'un procès.",
          "Répéter le même argument sous trois formes différentes."
        ],
        answer: "Reconnaître l'objectif visé par la mairie, puis proposer une solution alternative chiffrée.",
        explain: "B2 评分要求「能针对对方立场展开论证」。先承认对方目标（减少污染）再提出替代方案，展示的是 concession + proposition 的能力，属于高分策略。威胁起诉属于情绪化表达，重复同一论点则缺乏论证深度，两者都会被「任务完成度」扣分。",
        source: "DELF B2 写作 · 论证策略"
      },
      {
        id: "q-writing-b2-9043",
        level: "B2",
        skill: "writing",
        prompt: "Quelle formule de clôture est adaptée à une lettre adressée au maire ?",
        options: [
          "Je vous prie d'agréer, Monsieur le Maire, l'expression de ma haute considération.",
          "Bisous et à bientôt.",
          "Voilà, j'espère que tu vas faire quelque chose."
        ],
        answer: "Je vous prie d'agréer, Monsieur le Maire, l'expression de ma haute considération.",
        explain: "正式书信的结束语固定搭配：Je vous prie d'agréer, + 称呼, + l'expression de ma haute considération / de mes salutations distinguées。Bisous 用于私人关系，tu 用于熟人，两者都会让整封信的语域崩掉。",
        source: "DELF B2 写作 · 书信结束语"
      }
    ],
    selfCheck: `【结构提纲（引言 — 论点 1 — 论点 2 — 反方 — 结论）】
引言（约 40 词）：写明身份与写信目的，给出总体立场。
  示范：Monsieur le Maire, je suis résidente du quartier Saint-Jean depuis douze ans et je me permets de vous écrire au sujet du projet de suppression du stationnement gratuit en centre-ville.
论点 1（约 55 词）：经济影响——小商户依赖开车来的顾客。
  示范：Cette mesure pénaliserait d'abord les commerces de proximité, dont la clientèle vient en voiture ; plusieurs boutiques du centre emploient moins de cinq personnes et ne survivraient pas à une baisse de fréquentation.
论点 2（约 55 词）：社会公平——老人、行动不便者、带孩子的家庭最需要把车停在目的地附近。
  示范：Elle frapperait aussi les habitants les moins mobiles : personnes âgées, familles avec de jeunes enfants, personnes à mobilité réduite, pour qui le vélo n'est pas une option réaliste.
反方与让步（约 50 词）：承认自行车道减少污染，但不该由最弱势者买单。
  示范：Je comprends votre souci de réduire la pollution et je ne conteste pas l'intérêt des pistes cyclables ; il n'en reste pas moins que le financement ne peut pas reposer sur les usagers les plus fragiles.
结论与建议（约 50 词）：提出折中方案 + 正式结束语。
  示范：Je me permets donc de suggérer une solution intermédiaire : une première heure gratuite, puis un tarif progressif, et un parking relais gratuit en périphérie. Je souhaiterais que cette question fasse l'objet d'une véritable concertation.

【20 个可复用高分句式（正式书信 / 表达反对）】
1. Je me permets de vous écrire au sujet de… — 我冒昧就……给您写信。
2. C'est avec une vive inquiétude que j'ai appris votre projet de… — 得知您……的计划，我深感忧虑。
3. Je tiens à vous faire part de mon désaccord sur ce point. — 我谨就此向您表达我的不同意见。
4. Permettez-moi d'attirer votre attention sur un point essentiel. — 请允许我提请您注意一个关键点。
5. En premier lieu, il convient de rappeler que… — 首先，应当提醒的是……
6. Ce projet risque d'avoir des conséquences regrettables pour… — 该计划可能给……带来令人遗憾的后果。
7. À cela s'ajoute un problème de fond : … — 此外还有一个根本性问题：……
8. Force est de constater que… — 不得不承认……
9. Loin de résoudre le problème, cette mesure l'aggraverait. — 这项措施非但不能解决问题，反而会加剧它。
10. On peut certes objecter que…, mais il n'en reste pas moins que… — 诚然可以反驳说……，但尽管如此……
11. Je comprends votre souci de…, néanmoins… — 我理解您对……的关切，然而……
12. Je ne conteste pas l'intérêt de… ; je m'interroge seulement sur… — 我不否认……的价值，只是对……存疑。
13. Si l'on veut vraiment…, il serait plus efficace de… — 若真想……，更有效的做法是……
14. Je me permets donc de vous suggérer une solution intermédiaire : … — 因此我冒昧建议一个折中方案：……
15. Une telle solution aurait le mérite de concilier… et… — 这样的方案的可取之处在于兼顾……与……
16. Plutôt que de supprimer…, ne vaudrait-il pas mieux… ? — 与其取消……，是不是更该……？
17. Je souhaiterais que cette question fasse l'objet d'une véritable concertation. — 我希望这个问题能经过真正的协商。
18. Je vous serais reconnaissant(e) de bien vouloir tenir compte de ces observations. — 若您能考虑这些意见，我将十分感激。
19. Je reste à votre disposition pour tout complément d'information. — 如需补充信息，我随时配合。
20. Dans l'attente de votre réponse, je vous prie d'agréer, Monsieur le Maire, l'expression de ma haute considération. — 期待您的答复，谨致崇高敬意。

【评分说明（DELF B2 写作 · 25 分制）】
· 任务完成度（5 分）：是否写够词数、是否回应了题目全部要求（表达反对 + 提出替代方案）、文体是否为正式书信。
· 连贯与衔接（5 分）：是否有清晰的引言—论证—让步—结论结构，逻辑连接词是否准确（En premier lieu / À cela s'ajoute / néanmoins / donc）。
· 词汇丰富度（5 分）：能否使用主题词（stationnement, commerces de proximité, concertation, usagers）并避免重复。
· 语法准确性（10 分）：时态、性数配合、虚拟式（Je souhaiterais que… fasse）、条件式（serait, reviendrait）、代词位置。
自评做法：写完后逐条打勾，任何一项做不到就重写该段；把 20 个句式里至少 6 个自然地用进文章，不要生硬堆砌。`
  },

  {
    id: "ex-b2-writing-02",
    level: "B2",
    skill: "writing",
    title: "写作：论坛帖——大学校园该不该禁用手机",
    textFr: "Sujet : Sur le forum de votre université, un débat est ouvert : faut-il interdire l'usage du téléphone portable sur le campus ? Vous publiez un message argumenté d'environ 250 mots. Vous prenez position, vous répondez à l'argument principal de ceux qui défendent l'interdiction (« le téléphone nuit à la concentration ») et vous proposez une règle concrète.",
    instructions: "限时 40 分钟，250 词左右。论坛帖可以比书信自由，但仍需：一个明确的立场句（在前 30 词内）、两个理由 + 一个例子、对反方论据的正面回应、一条可操作的规则建议。用小标题或分段让结构可见；不要出现真实人名。",
    questions: [
      {
        id: "q-writing-b2-9044",
        level: "B2",
        skill: "writing",
        prompt: "Dans un message de forum argumenté, où placer l'annonce de sa position ?",
        options: [
          "Dans les premières lignes, pour que le lecteur sache immédiatement où vous voulez en venir.",
          "À la toute fin, afin de créer un effet de surprise.",
          "Nulle part : il faut laisser le lecteur deviner."
        ],
        answer: "Dans les premières lignes, pour que le lecteur sache immédiatement où vous voulez en venir.",
        explain: "B2 论述文要求立场清晰（prise de position explicite）。论坛帖尤其要「先给结论，再给理由」。把立场藏到最后是三段式不完整的表现；完全不表态属于「任务完成度」不达标。",
        source: "DELF B2 写作 · 立场与结构"
      },
      {
        id: "q-writing-b2-9045",
        level: "B2",
        skill: "writing",
        prompt: "Quelle phrase permet de concéder puis de retourner l'argument adverse ?",
        options: [
          "Il est vrai que le téléphone peut nuire à la concentration, encore faut-il distinguer l'usage de la durée.",
          "Le téléphone ne nuit absolument jamais à la concentration.",
          "Ceux qui pensent cela sont des ignorants."
        ],
        answer: "Il est vrai que le téléphone peut nuire à la concentration, encore faut-il distinguer l'usage de la durée.",
        explain: "「Il est vrai que…, encore faut-il…」是标准的让步—转进结构：先承认对方合理之处，再用 encore faut-il 提出限定条件，论证层次立刻提升。选项「ne nuit absolument jamais」绝对化且无法证明；选项「des ignorants」是人身攻击（attaque personnelle），在 DELF 中属于论证失败。",
        source: "DELF B2 写作 · 让步与反驳"
      },
      {
        id: "q-writing-b2-9046",
        level: "B2",
        skill: "writing",
        prompt: "Quelle formulation exprime une proposition avec le subjonctif correct ?",
        options: [
          "Je propose que l'université instaure des zones sans téléphone plutôt qu'une interdiction générale.",
          "Je propose que l'université instaure-t-elle des zones sans téléphone.",
          "Je propose que l'université instaure pas d'interdiction générale."
        ],
        answer: "Je propose que l'université instaure des zones sans téléphone plutôt qu'une interdiction générale.",
        explain: "proposer que 引导虚拟式：que l'université instaure。选项 B 在从句里误加倒装（-t-elle），虚拟式从句不用疑问倒装；选项 C 结构残缺，虚拟式的否定应是 ne… pas 且位置固定（qu'elle n'instaure pas）。",
        source: "DELF B2 写作 · 虚拟式与句式准确性"
      }
    ],
    selfCheck: `【结构提纲（引言 — 论点 1 — 论点 2 — 反方 — 结论）】
引言（约 40 词）：点题 + 明确立场。示范：Ce débat revient chaque rentrée, et il mérite mieux que des slogans : à mon sens, interdire le téléphone sur tout le campus serait à la fois inapplicable et contre-productif.
论点 1（约 55 词）：禁令不可执行，且把使用推向隐蔽。示范：Une interdiction générale serait impossible à contrôler ; elle pousserait simplement les étudiants à utiliser leur téléphone en cachette, ce qui rendrait tout dialogue éducatif impossible.
论点 2（约 55 词）：真正的问题是用途而非工具。示范：Ce qui pose problème, ce n'est pas l'appareil, c'est l'usage : dix minutes de révision avec une application de vocabulaire n'ont rien à voir avec une heure de vidéos courtes pendant un cours.
反方与回应（约 55 词）：承认影响专注，但主张分级管理。示范：Il est vrai que les notifications nuisent à la concentration ; encore faut-il distinguer les lieux : amphithéâtre, bibliothèque, espaces communs n'appellent pas les mêmes règles.
结论与建议（约 45 词）：提出具体规则 + 收束。示范：Je propose donc des zones sans téléphone clairement signalées, une pause de dix minutes par cours et un affichage des règles voté par les étudiants eux-mêmes.

【20 个可复用高分句式（论坛帖 / 表达观点）】
1. Ce sujet me tient particulièrement à cœur, car… — 这个话题对我尤其重要，因为……
2. Il me semble indispensable de rappeler que… — 我觉得有必要提醒的是……
3. Pour ma part, je suis convaincu(e) que… — 就我而言，我确信……
4. D'un côté…, de l'autre… — 一方面……，另一方面……
5. Il est vrai que…, encore faut-il… — 诚然……，但还需……
6. Je ne nie pas que…, cependant… — 我不否认……，然而……
7. On aurait tort de croire que… — 若认为……那就错了。
8. Loin de moi l'idée de… — 我绝无……之意。
9. Ce qui me gêne dans cet argument, c'est que… — 这个论点让我不安的地方在于……
10. Rien ne prouve que… — 没有任何证据表明……
11. Force est de reconnaître que… — 不得不承认……
12. Il ne s'agit pas tant de… que de… — 与其说是……，不如说是……
13. Tout bien considéré, … — 通盘考虑之后，……
14. En définitive, … — 归根结底，……
15. Je rejoins ceux qui… — 我赞同那些……的人。
16. J'ajouterai que… — 我还要补充一点：……
17. Il serait naïf de penser que… — 认为……未免天真。
18. C'est pourquoi je propose que… (+ subjonctif) — 因此我建议……
19. Quoi qu'on en dise, … — 不管别人怎么说，……
20. Reste une question de fond : … — 剩下的一个根本问题是：……

【评分说明（DELF B2 写作 · 25 分制）】
· 任务完成度（5 分）：立场明确、词数达标、回应了「手机影响专注」这一指定反方论据、给出具体规则。
· 连贯与衔接（5 分）：段落功能分明，连接词使用准确（Il est vrai que… encore faut-il, donc, en définitive）。
· 词汇丰富度（5 分）：能否避免 répéter「téléphone / interdit」，改用 appareil, notifications, usage, encadrer, zones délimitées。
· 语法准确性（10 分）：虚拟式（je propose que… instaure）、条件式（serait, pousserait）、否定结构、比较级。
自评做法：把立场句圈出来，如果它不在前 40 词内就前移；每一段只留一个核心意思，超出就拆段。`
  },

  {
    id: "ex-b2-writing-03",
    level: "B2",
    skill: "writing",
    title: "写作：内部提案——支持四天工作制试点",
    textFr: "Sujet : Votre entreprise réfléchit à expérimenter la semaine de quatre jours. Le directeur général a demandé aux salariés de lui adresser des propositions écrites. Vous rédigez une note argumentée d'environ 250 mots : vous défendez l'expérimentation, vous en précisez les modalités et les indicateurs d'évaluation, et vous signalez les points de vigilance.",
    instructions: "限时 40 分钟，250 词左右。这是一份职业场景下的书面提案（note de proposition），要求：① 标题与事由（Objet）；② 现状与理由；③ 具体试行办法（周期、范围、评估指标）；④ 风险与应对；⑤ 正式结束语。多用无人称结构与名词化表达，避免口语。",
    questions: [
      {
        id: "q-writing-b2-9047",
        level: "B2",
        skill: "writing",
        prompt: "Quelle formule convient pour introduire l'objet d'une note professionnelle ?",
        options: [
          "Objet : proposition d'expérimentation de la semaine de quatre jours.",
          "Objet : je veux vous parler d'un truc.",
          "Objet : peut-être une idée, on verra bien."
        ],
        answer: "Objet : proposition d'expérimentation de la semaine de quatre jours.",
        explain: "职业书面语的 Objet 用名词化短语（proposition d'expérimentation de…），简洁、可归档。选项「un truc」是口语词汇，选项「peut-être… on verra bien」既含糊又无信息量，两者都会破坏书面语体（registre soutenu）。",
        source: "DELF B2 写作 · 职业书面语体"
      },
      {
        id: "q-writing-b2-9048",
        level: "B2",
        skill: "writing",
        prompt: "Quelle phrase introduit correctement une évaluation limitée dans le temps ?",
        options: [
          "Le dispositif serait testé à titre expérimental pendant six mois, puis évalué sur trois indicateurs précis.",
          "Le dispositif sera appliqué définitivement et sans évaluation.",
          "On verra bien ce que ça donne."
        ],
        answer: "Le dispositif serait testé à titre expérimental pendant six mois, puis évalué sur trois indicateurs précis.",
        explain: "条件式（serait testé）在提案中用来表示「尚未批准、仍在讨论」的建议，语气委婉而专业；à titre expérimental + pendant six mois + indicateurs précis 给出可核查的边界。另外两项要么越权决定（appliqué définitivement），要么无信息量。",
        source: "DELF B2 写作 · 条件式与提案语体"
      },
      {
        id: "q-writing-b2-9049",
        level: "B2",
        skill: "writing",
        prompt: "Quel point de vigilance faut-il signaler dans ce type de note ?",
        options: [
          "La continuité du service client le jour non travaillé.",
          "La couleur des murs du bureau.",
          "Le choix du restaurant pour la réunion d'équipe."
        ],
        answer: "La continuité du service client le jour non travaillé.",
        explain: "试行四天制的真实风险是「客户服务中断」「工作量压缩」「跨部门协调」，所以必须提出应对措施。另外两项与本议题无关，属于把「具体」误解为「琐碎」；B2 写作要求的是 relevant 的具体，而不是无关细节。",
        source: "DELF B2 写作 · 风险意识与论证相关性"
      }
    ],
    selfCheck: `【结构提纲（引言 — 论点 1 — 论点 2 — 反方 — 结论）】
引言（约 40 词）：交代背景与请求来源。示范：À la suite de votre appel à propositions sur l'organisation du temps de travail, j'ai l'honneur de vous soumettre la note suivante.
论点 1（约 55 词）：试行有据可依——生产力更多取决于组织方式而非工时长度。示范：Les expériences menées ailleurs montrent que la baisse du temps de travail s'accompagne souvent d'une réorganisation des tâches plutôt que d'une perte de production.
论点 2（约 55 词）：对我方的具体好处——减少缺勤、留住人才。示范：Un tel dispositif réduirait l'absentéisme et renforcerait notre attractivité, à un moment où le recrutement de profils qualifiés devient difficile.
反方与让步（约 50 词）：承认客户服务与协调成本是难点，并给出对策。示范：Je ne sous-estime pas la difficulté : la continuité du service les jours non travaillés exigerait un roulement par équipe et un engagement sur les horaires de réponse.
结论与建议（约 50 词）：写明周期、指标、可逆性与正式结束语。示范：Je propose une expérimentation de six mois sur un service volontaire, évaluée sur la production, l'absentéisme et la satisfaction client, et réversible à tout moment.

【20 个可复用高分句式（职业提案 / note de proposition）】
1. À la suite de…, j'ai l'honneur de vous soumettre… — 继……之后，我谨向您提交……
2. Le présent document a pour objet de… — 本文件旨在……
3. Il ressort de nos échanges que… — 从我们的交流中可以得出……
4. Force est de constater que… — 不得不承认……
5. Ce constat nous conduit à proposer… — 这一观察促使我们提议……
6. Il conviendrait d'expérimenter… avant de généraliser. — 在推广之前，宜先试行……
7. Le dispositif envisagé reposerait sur trois principes : … — 拟议方案将建立在三项原则之上：……
8. Les modalités seraient les suivantes : … — 具体办法如下：……
9. Le calendrier prévoirait une phase pilote de six mois. — 时间表将安排六个月的试点阶段。
10. L'évaluation s'appuierait sur des indicateurs mesurables tels que… — 评估将依据……等可量化指标。
11. Les points de vigilance portent notamment sur… — 需要警惕的方面尤其包括……
12. À ces difficultés, deux réponses sont possibles : … — 面对这些困难，有两种应对：……
13. Le coût estimé resterait limité, de l'ordre de… — 预计成本仍然有限，约……
14. Cette mesure serait réversible à tout moment. — 该措施可随时撤销。
15. Elle présenterait l'avantage de… — 它的好处是……
16. Il ne s'agit pas de…, mais de… — 这不是……，而是……
17. Je me tiens à votre disposition pour préciser ces éléments. — 如需细化这些内容，我随时可以配合。
18. Dans l'attente de votre arbitrage, je vous prie d'agréer, Monsieur le Directeur, l'expression de ma considération distinguée. — 期待您的裁定，谨致敬意。
19. Une telle démarche supposerait un accompagnement des équipes. — 这样的举措需要为团队提供配套支持。
20. Je suggère enfin que cette expérimentation fasse l'objet d'un bilan écrit. — 最后我建议为这次试行出一份书面总结。

【评分说明（DELF B2 写作 · 25 分制）】
· 任务完成度（5 分）：是否同时给出「支持理由 + 试行办法 + 评估指标 + 风险」四块内容。
· 连贯与衔接（5 分）：是否用 Objet / Modalités / Points de vigilance 等板块组织，逻辑连接是否清晰。
· 词汇丰富度（5 分）：organization, temps de travail, absentéisme, roulement, productivité, expérimentation, réversible 等职业词汇的使用。
· 语法准确性（10 分）：条件式表示建议（serait, reposerait）、虚拟式（je suggère que… fasse）、无人称结构（il conviendrait de, il ressort de）。
自评做法：检查每一段是否都能回答「谁做什么、什么时候、怎么衡量」；答不上来的段落就是空话，应当删掉或补数据。`
  },

  {
    id: "ex-b1-writing-04",
    level: "B1",
    skill: "writing",
    title: "写作：给报社编辑写信，谈廉价航空该不该受限",
    textFr: "Sujet : Dans votre journal local, un lecteur affirme que les vols à bas prix devraient être limités pour protéger l'environnement. Vous écrivez une lettre au courrier des lecteurs, d'environ 180 mots, pour donner votre avis : vous réagissez à cet article, vous exposez deux arguments et vous proposez une mesure réaliste.",
    instructions: "限时 30 分钟，180 词左右（160–200 均可）。B1 要求：① 明确说自己是在回应哪篇文章；② 用 D'abord / Ensuite / Enfin 之类的连接词组织；③ 两个论点都配一个简单的例子；④ 结尾提出一条现实可行的建议；⑤ 用 vous 称呼编辑，语域礼貌但不需过度正式。",
    questions: [
      {
        id: "q-writing-b1-9050",
        level: "B1",
        skill: "writing",
        prompt: "Quelle phrase montre clairement que vous réagissez à l'article ?",
        options: [
          "Je vous écris en réaction à l'article paru dans votre édition de mardi.",
          "Je vous écris pour parler de l'avion.",
          "Bonjour, j'ai une idée."
        ],
        answer: "Je vous écris en réaction à l'article paru dans votre édition de mardi.",
        explain: "B1 写作看重「交际意图明确」：写给谁、为什么写。en réaction à l'article paru dans votre édition de mardi 同时交代了对象与出处。另外两项既没有点出文章，也没有说明立场，属于信息不足。",
        source: "DELF B1 写作 · 交际意图"
      },
      {
        id: "q-writing-b1-9051",
        level: "B1",
        skill: "writing",
        prompt: "Quelle formule introduit une proposition réaliste ?",
        options: [
          "On pourrait, par exemple, instaurer une taxe progressive sur les vols très courts.",
          "Il faut absolument supprimer tous les vols, sinon rien ne changera.",
          "Chacun devrait simplement arrêter de prendre l'avion."
        ],
        answer: "On pourrait, par exemple, instaurer une taxe progressive sur les vols très courts.",
        explain: "On pourrait + 具体措施（taxe progressive sur les vols très courts）是 B1 表达建议的稳妥句式：条件式让语气缓和，par exemple 让措施落地。选项「supprimer tous les vols」绝对化且不现实；选项「chacun devrait arrêter」把公共政策问题变成个人道德要求。",
        source: "DELF B1 写作 · 提出建议"
      },
      {
        id: "q-writing-b1-9052",
        level: "B1",
        skill: "writing",
        prompt: "Quelle construction est correcte pour exprimer un souhait ?",
        options: [
          "Je souhaite que les compagnies proposent une alternative en train.",
          "Je souhaite que les compagnies proposent-elles une alternative en train.",
          "Je souhaite les compagnies proposent une alternative en train."
        ],
        answer: "Je souhaite que les compagnies proposent une alternative en train.",
        explain: "souhaiter que 引导虚拟式：que + 主语 + proposent（虚拟式现在时，第三人称复数与直陈式同形）。选项 B 多加了倒装代词；选项 C 缺少连词 que，是整个从句结构崩塌，B1 阶段这类错误最影响语法分。",
        source: "DELF B1 写作 · 虚拟式基础"
      }
    ],
    selfCheck: `【结构提纲（引言 — 论点 1 — 论点 2 — 反方 — 结论）】
引言（约 30 词）：点出所回应的文章 + 自己的总体立场。
  示范：Je vous écris en réaction à l'article paru mardi, qui propose de limiter les vols à bas prix. Je partage l'objectif, mais pas la méthode.
论点 1（约 40 词）：航空并非唯一责任方，限制低价票会伤害普通家庭。
  示范：D'abord, ces vols permettent à des familles modestes de partir en vacances ; les interdire punirait les voyageurs les moins riches sans réduire beaucoup les émissions.
论点 2（约 40 词）：真正有效的是推动替代方案（夜班火车、铁路通票）。
  示范：Ensuite, on n'obtient un changement durable qu'en proposant une alternative : des trains de nuit moins chers et un billet unique train-avion.
反方与让步（约 35 词）：承认航空排放不可忽视，但要求措施公平。
  示范：Il est vrai que l'avion pollue davantage que le train ; c'est justement pourquoi la solution doit être progressive et non brutale.
结论（约 35 词）：提出一条具体建议 + 礼貌收尾。
  示范：Je propose donc une taxe progressive sur les vols très courts, dont les recettes financeraient le rail. Avec mes remerciements pour la publication de ce courrier.

【20 个可复用高分句式（读者来信 / 表达个人意见 · B1 级）】
1. Je vous écris en réaction à l'article paru dans votre édition de… — 我写信回应贵刊……日刊登的文章。
2. Je voudrais donner mon avis sur ce sujet. — 我想就此发表看法。
3. Je suis tout à fait d'accord avec l'auteur sur un point. — 在一点上我完全同意作者。
4. En revanche, je ne partage pas son point de vue sur… — 但在他对……的看法上我不能赞同。
5. D'abord, … Ensuite, … Enfin, … — 首先……其次……最后……
6. Par exemple, … — 例如……
7. C'est pourquoi je pense que… — 因此我认为……
8. Il est vrai que…, mais… — 诚然……，但是……
9. À mon avis, … — 依我看……
10. Personnellement, je trouve que… — 就我个人而言，我觉得……
11. Je ne pense pas que ce soit la bonne solution. — 我认为这不是好办法。
12. Il faut faire attention à… — 要注意……
13. On pourrait, par exemple, … — 我们可以，比如说，……
14. Je propose que l'on… (+ subjonctif) — 我建议我们……
15. Il serait possible de… — 有可能……
16. Je souhaite que… (+ subjonctif) — 我希望……
17. Ce qui me semble important, c'est de… — 我觉得重要的是……
18. Merci de publier ce courrier. — 感谢刊登此信。
19. Je vous remercie de votre attention et vous adresse mes cordiales salutations. — 感谢垂注，谨致问候。
20. J'espère que ce débat continuera dans vos colonnes. — 希望这场讨论能在贵刊继续。

【评分说明（DELF B1 写作 · 25 分制）】
· 任务完成度（5 分）：是否回应了指定文章、是否给出两个论点与一条建议、词数是否达标。
· 连贯与衔接（5 分）：D'abord / Ensuite / Enfin / Par exemple 等连接词是否使用且位置正确。
· 词汇丰富度（5 分）：vol, émissions, train de nuit, taxe, voyageurs, alternative 等主题词；避免反复用 très bien / mauvais。
· 语法准确性（10 分）：现在时与条件式（on pourrait, il serait possible）、虚拟式（je souhaite que… proposent）、比较级（moins cher que）。
自评做法：数一数每段有几个句子，一段只做一件事；把「je pense que」换成上面 20 句里的不同表达，避免重复。`
  },

  {
    id: "ex-b2-writing-05",
    level: "B2",
    skill: "writing",
    title: "写作：正式投诉信——网购纠纷",
    textFr: "Sujet : Vous avez commandé un ordinateur portable à 749 euros sur un site marchand. Le colis est arrivé avec quinze jours de retard et l'appareil présente un écran fissuré. Malgré trois courriels, le service client ne répond pas. Vous écrivez une lettre de réclamation à l'association de consommateurs, en leur demandant d'intervenir. 250 mots environ.",
    instructions: "限时 40 分钟，250 词左右。投诉信的核心是「事实—证据—诉求」三段式：先按时间顺序客观陈述事实（日期、金额、型号、延迟天数、故障），再列出你已经做过的尝试，最后提出明确诉求（退款或换货 + 补偿）。语气坚定但有礼，不要辱骂；用正式书信格式。",
    questions: [
      {
        id: "q-writing-b2-9053",
        level: "B2",
        skill: "writing",
        prompt: "Quel élément est indispensable dans une lettre de réclamation ?",
        options: [
          "La chronologie précise des faits et les références de la commande.",
          "Une description détaillée de vos vacances d'été.",
          "L'avis de vos amis sur ce site marchand."
        ],
        answer: "La chronologie précise des faits et les références de la commande.",
        explain: "投诉信要能让第三方（消费者协会）代为交涉，因此必须有可核查的信息：下单日期、金额、订单号、故障描述、已发邮件次数。另外两项与诉求无关，会稀释论证；B2 写作中「不相关的内容」同样影响任务完成度。",
        source: "DELF B2 写作 · 投诉信要素"
      },
      {
        id: "q-writing-b2-9054",
        level: "B2",
        skill: "writing",
        prompt: "Quelle formule exprime une demande claire sans agressivité ?",
        options: [
          "Je vous saurais gré d'intervenir auprès du vendeur afin d'obtenir le remboursement intégral de la commande.",
          "Vous feriez mieux de vous occuper de ce vendeur, sinon je le dirai partout.",
          "Faites quelque chose, c'est scandaleux."
        ],
        answer: "Je vous saurais gré d'intervenir auprès du vendeur afin d'obtenir le remboursement intégral de la commande.",
        explain: "「Je vous saurais gré de + infinitif」是正式请求句式，配合 afin d'obtenir 说明诉求内容，坚定而不失礼。选项 B 是威胁，选项 C 是情绪宣泄；两者都没有说明「要什么」，在投诉信里等于没有诉求。",
        source: "DELF B2 写作 · 请求与语域控制"
      },
      {
        id: "q-writing-b2-9055",
        level: "B2",
        skill: "writing",
        prompt: "Quelle phrase annonce correctement une pièce jointe ?",
        options: [
          "Vous trouverez ci-joint la copie de la facture et l'échange de courriels avec le service client.",
          "Je vous envoie des papiers comme ça.",
          "Il y a des documents quelque part."
        ],
        answer: "Vous trouverez ci-joint la copie de la facture et l'échange de courriels avec le service client.",
        explain: "ci-joint 是书信中提示附件的固定表达，并要具体说明是什么文件（facture, échange de courriels）。另外两项含糊不清，收信人无法据以处理；在 B2 评分中这类表达属于词汇与语域双重不足。",
        source: "DELF B2 写作 · 附件与正式表达"
      }
    ],
    selfCheck: `【结构提纲（引言 — 论点 1 — 论点 2 — 反方 — 结论）】
引言（约 40 词）：身份 + 写信目的 + 请求介入。示范：Je me permets de vous saisir d'un litige avec un site marchand, afin que votre association m'aide à faire valoir mes droits.
论点 1（约 60 词）：客观陈述事实，按时间排列。示范：Le 3 mars, j'ai commandé un ordinateur portable d'une valeur de 749 euros. Le colis, annoncé sous cinq jours, est arrivé le 18 mars, soit quinze jours de retard, et l'écran de l'appareil est fissuré à la réception.
论点 2（约 55 词）：说明已做出的尝试与对方的沉默。示范：J'ai adressé trois courriels au service client les 19, 24 et 30 mars ; aucun n'a reçu de réponse, et le suivi de ma réclamation affiche toujours « en attente ».
反方与让步（约 45 词）：预判商家可能的抗辩并先行反驳。示范：Le vendeur pourrait soutenir que le dommage est survenu pendant le transport ; or le colis ne présentait aucune trace d'ouverture, et la garantie légale de conformité s'applique en tout état de cause.
结论与诉求（约 50 词）：明确诉求 + 期限 + 礼貌结尾。示范：Je vous saurais gré d'intervenir pour obtenir le remboursement intégral ou le remplacement de l'appareil, ainsi qu'un dédommagement pour le retard. Vous trouverez ci-joint la facture et l'échange de courriels.

【20 个可复用高分句式（正式投诉信 / lettre de réclamation）】
1. Je me permets de vous saisir d'un litige qui m'oppose à… — 我冒昧就我与……的纠纷向您求助。
2. Objet : réclamation concernant la commande n° … — 事由：关于第……号订单的投诉。
3. Le 3 mars, j'ai commandé… pour un montant de… euros. — 3 月 3 日，我订购了……，金额为……欧元。
4. Or, à la réception du colis, j'ai constaté que… — 然而，收到包裹时我发现……
5. Le produit présente un défaut manifeste : … — 产品存在明显缺陷：……
6. Malgré mes relances des 19, 24 et 30 mars, je n'ai obtenu aucune réponse. — 尽管我在 3 月 19、24、30 日多次催促，仍未得到任何答复。
7. Je vous joins les pièces justificatives suivantes : … — 随函附上以下证明材料：……
8. Je demande donc le remboursement intégral de la commande. — 因此我要求全额退款。
9. À défaut, je demanderai le remplacement de l'appareil. — 若无法退款，我将要求更换设备。
10. Conformément à la garantie légale de conformité, … — 依据法定一致性担保，……
11. Cette situation me cause un préjudice certain. — 这一情况给我造成了确定的损失。
12. Je me réserve le droit de saisir les autorités compétentes. — 我保留向主管机关申诉的权利。
13. Sans réponse de votre part sous huit jours, je serai contraint(e) de… — 若八日内无回复，我将不得不……
14. Je vous serais reconnaissant(e) d'intervenir auprès du vendeur. — 若您能向卖家交涉，我将十分感激。
15. Je vous saurais gré de bien vouloir m'indiquer la suite réservée à ce dossier. — 恳请您告知此案的处理结果。
16. Je reste à votre entière disposition pour tout document complémentaire. — 如需补充材料，我随时配合。
17. Je compte sur votre intervention pour faire aboutir cette réclamation. — 我指望您的介入促成此投诉得到解决。
18. Je vous remercie par avance du temps consacré à ce dossier. — 预先感谢您为此案付出的时间。
19. Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées. — 期待答复，谨致问候。
20. Vous trouverez ci-joint la copie de la facture et l'échange de courriels. — 随函附上发票副本与往来邮件。

【评分说明（DELF B2 写作 · 25 分制）】
· 任务完成度（5 分）：事实是否完整（日期、金额、故障、三次催告）、诉求是否明确、是否请对方介入。
· 连贯与衔接（5 分）：时间顺序词（Le 3 mars / Or / Malgré / donc）是否到位，段落功能是否分明。
· 词汇丰富度（5 分）：litige, relance, pièce justificative, garantie légale de conformité, préjudice, dédommagement 等法律与商务词汇。
· 语法准确性（10 分）：复合过去时与愈过去时配合（j'avais commandé）、条件式（je demanderais, je serais）、被动（le dommage est survenu）、无人称结构（il convient de）。
自评做法：把信里所有形容词与情绪词划掉，如果剩下的事实与诉求仍然完整，这封信就合格；反之需要补事实、删情绪。`
  },

  /* ====================== 四、口语 speaking（5 条） ====================== */
  {
    id: "ex-b2-speaking-01",
    level: "B2",
    skill: "speaking",
    title: "口语：市中心该不该禁止私家车",
    textFr: "Sujet d'exposé : « Faut-il interdire la circulation des voitures particulières dans les centres-villes ? » Vous disposez de 30 minutes de préparation, puis vous présentez un exposé argumenté de 6 minutes environ (monologue), avant un entretien de 10 minutes avec le jury.",
    instructions: "准备 30 分钟，做一张「pour / contre / ma position」三栏提纲，只写关键词。陈述 6 分钟：引入 30 秒 → 支持方 2 分钟 → 反对方 2 分钟 → 个人结论 1 分 30 秒。要求：pour 与 contre 各至少 4 条，每条都配一个具体例子或数字；不许只讲一边；结论必须明确表态。之后回答考官的 5 个追问。",
    questions: [
      {
        id: "q-speaking-b2-9056",
        level: "B2",
        skill: "speaking",
        prompt: "Lequel de ces énoncés est un argument « contre » l'interdiction, et non « pour » ?",
        options: [
          "Les artisans et les livreurs ont besoin de leur véhicule pour travailler.",
          "Le bruit recule et la santé des riverains s'améliore.",
          "L'espace public redevient partageable entre piétons et cyclistes."
        ],
        answer: "Les artisans et les livreurs ont besoin de leur véhicule pour travailler.",
        explain: "这条说的是「职业用车刚需」，属于反对方论据。另外两条是禁车带来的环境与公共空间收益，属于支持方。DELF 口语评分特别看重「能否把双方论点分开陈述」：把 pour 与 contre 混为一谈，连贯性一项会明显失分。",
        source: "DELF B2 口语 · 论点归类"
      },
      {
        id: "q-speaking-b2-9057",
        level: "B2",
        skill: "speaking",
        prompt: "Quelle formule permet d'introduire une concession à l'oral ?",
        options: [
          "Certes, la pollution diminue, mais les ménages modestes habitant en périphérie seraient les premiers pénalisés.",
          "La pollution diminue, point final.",
          "Tout le monde est d'accord avec moi."
        ],
        answer: "Certes, la pollution diminue, mais les ménages modestes habitant en périphérie seraient les premiers pénalisés.",
        explain: "「Certes…, mais…」是口语中最经济有效的让步结构。选项「point final」拒绝讨论，选项「tout le monde est d'accord」用普遍性代替论证（且含绝对化），两者在考官眼里都是论证能力不足的表现。",
        source: "DELF B2 口语 · 让步与转折"
      },
      {
        id: "q-speaking-b2-9058",
        level: "B2",
        skill: "speaking",
        prompt: "Le jury vous demande un chiffre que vous ignorez. Quelle réaction est la plus adaptée ?",
        options: [
          "Signaler qu'on n'a pas le chiffre exact, puis raisonner à partir d'un ordre de grandeur ou d'un exemple connu.",
          "Inventer un chiffre précis pour paraître préparé.",
          "Rester silencieux et attendre la question suivante."
        ],
        answer: "Signaler qu'on n'a pas le chiffre exact, puis raisonner à partir d'un ordre de grandeur ou d'un exemple connu.",
        explain: "口语考的是论证能力而非记忆力。可以说 « Je n'ai pas le chiffre exact en tête, mais on peut raisonner ainsi… »。编造数据一旦被追问就会崩塌；沉默则丢掉互动分。",
        source: "DELF B2 口语 · 应对策略与互动"
      }
    ],
    selfCheck: `【6 分钟陈述提纲】
① 引入（约 30 秒）：界定问题、说明讨论范围、预告结构。
   — « La place de la voiture en ville oppose deux logiques : la santé publique et la liberté de déplacement. J'examinerai d'abord les arguments favorables à l'interdiction, puis ses limites, avant de donner ma position. »
② POUR l'interdiction（约 2 分钟，4 条法语要点）
   1. La pollution de l'air recule : dans les rues piétonnisées, les taux de particules fines baissent nettement.
   2. L'espace public redevient partageable : terrasses, pistes cyclables, aires de jeux remplacent les places de stationnement.
   3. Le bruit diminue, ce qui améliore directement la santé et le sommeil des riverains.
   4. Les commerces y gagnent : un piéton s'arrête et flâne, là où un automobiliste consomme en quelques minutes.
③ CONTRE l'interdiction（约 2 分钟，4 条法语要点）
   1. Les artisans, les livreurs et les aides à domicile ont besoin d'un véhicule pour travailler.
   2. Les personnes âgées et les familles habitant en périphérie perdent leur accès au centre, faute de transports en commun fiables.
   3. Une mesure brutale crée un sentiment d'injustice : seuls ceux qui peuvent payer un logement central s'en sortent bien.
   4. Les commerces de centre-ville risquent de perdre une clientèle venue de loin, au profit des zones commerciales de périphérie.
④ 个人结论（约 1 分 30 秒）
   — « Plutôt qu'une interdiction générale et immédiate, je défendrais une piétonnisation progressive, accompagnée d'un parking relais et d'un renforcement des transports en commun, avec une évaluation chiffrée au bout d'un an. »

【5 个考官追问 + 建议回应方向】
1. « Et les personnes handicapées, comment se déplacent-elles ? »
   → 方向：承认例外不可回避；dérogations pour les véhicules adaptés, places réservées, transport à la demande ; 说明「先保障替代方案，再限制」的顺序。
2. « Combien cela coûterait-il à une ville moyenne ? »
   → 方向：不编造精确数字，给数量级与分摊逻辑（investissement initial, recettes de stationnement réaffectées, retombées commerciales），并强调以试点方式分阶段投入。
3. « N'est-ce pas une mesure anti-pauvres ? »
   → 方向：这是反方最强论点，先让步，再指出 les ménages modestes sont souvent les plus exposés à la pollution et les moins équipés en voiture ; 对策是改善公共交通而非放弃治理。
4. « Connaissez-vous une ville où cela a échoué ? »
   → 方向：承认失败案例存在（措施过快、缺乏替代方案导致商户流失），指出失败原因不是原则错误，而是缺少过渡期与配套。
5. « Que répondez-vous aux automobilistes qui se sentent punis ? »
   → 方向：把叙述从「惩罚」转为「重新分配公共空间」，并给出补偿性措施（停车换乘、月票、送货时段许可）。

【评分维度（DELF B2 口语 · 25 分制）】
· 任务完成度（5 分）：是否做满 6 分钟、pour 与 contre 各 4 条、是否明确表态。
· 连贯与互动（5 分）：结构预告是否清晰、连接词是否准确（d'abord, en revanche, certes… mais, en définitive）、能否自然回应追问。
· 词汇（5 分）：piétonnisation, particules fines, riverains, transports en commun, dérogation, parking relais 等。
· 语法（5 分）：条件式（je défendrais, serait), subjonctif（il faudrait que…）, 无人称结构（il convient de, il s'agit de）。
· 语音与流利度（5 分）：连诵（les‿artisans, en‿effet）、节奏组、避免长时间停顿；宁可慢而清楚，不要快而含糊。`
  },

  {
    id: "ex-b2-speaking-02",
    level: "B2",
    skill: "speaking",
    title: "口语：远程办公该不该成为一项法定权利",
    textFr: "Sujet d'exposé : « Le télétravail doit-il devenir un droit pour tous les salariés ? » Après 30 minutes de préparation, vous présentez un exposé argumenté de 6 minutes, puis vous répondez aux questions du jury pendant 10 minutes.",
    instructions: "准备 30 分钟。关键是把问题拆成两层：① 是否承认远程办公的价值；② 「法定权利」意味着什么（谁可以主张、雇主能否拒绝、如何界定适用范围）。陈述按「引入 → pour 4 条 → contre 4 条 → 个人立场」进行，每条论点给出一个职业场景的例子（护理、物流、软件、客服）。",
    questions: [
      {
        id: "q-speaking-b2-9059",
        level: "B2",
        skill: "speaking",
        prompt: "Quelle question faut-il clarifier avant de débattre d'un « droit au télétravail » ?",
        options: [
          "Le droit s'applique-t-il à tous les métiers, ou seulement à ceux qui peuvent s'exercer à distance ?",
          "Les salariés préfèrent-ils le café du bureau ou celui de la maison ?",
          "Combien de temps dure la pause déjeuner ?"
        ],
        answer: "Le droit s'applique-t-il à tous les métiers, ou seulement à ceux qui peuvent s'exercer à distance ?",
        explain: "「权利」的适用范围是本题的第一争议点：护理、物流、零售无法远程，若不加区分就会造成两类员工。先澄清定义再论证，是 B2 口语展示思维条理的重要手法。另外两项与论证焦点无关，属于跑题。",
        source: "DELF B2 口语 · 定义与问题拆解"
      },
      {
        id: "q-speaking-b2-9060",
        level: "B2",
        skill: "speaking",
        prompt: "Quelle formulation exprime une réserve de manière nuancée ?",
        options: [
          "Le télétravail a des vertus, encore faut-il qu'il reste encadré et réversible.",
          "Le télétravail, c'est formidable, il n'y a aucun problème.",
          "Le télétravail est une catastrophe pour tout le monde."
        ],
        answer: "Le télétravail a des vertus, encore faut-il qu'il reste encadré et réversible.",
        explain: "「encore faut-il que + subjonctif」正面承认优点，再提出条件（encadré, réversible），语气有分寸。另两项都用绝对化判断（aucun problème / tout le monde），正是口语考试中要避免的极端化表达。",
        source: "DELF B2 口语 · 微妙表达与语域"
      },
      {
        id: "q-speaking-b2-9061",
        level: "B2",
        skill: "speaking",
        prompt: "Face à la question « Qui paierait l'équipement du salarié ? », quelle réponse est la plus solide ?",
        options: [
          "Proposer un partage clair : l'employeur fournit l'ordinateur et la connexion, le salarié contribue par un espace dédié.",
          "Répondre que la question est sans intérêt.",
          "Répondre que chacun doit se débrouiller seul."
        ],
        answer: "Proposer un partage clair : l'employeur fournit l'ordinateur et la connexion, le salarié contribue par un espace dédié.",
        explain: "追问常常要求你把抽象主张落到「谁承担什么」。给出一条可执行的分摊方案，比表态更有说服力。选项「sans intérêt」会中断互动，「chacun se débrouille」则回避了雇主责任，两者都会让互动一项失分。",
        source: "DELF B2 口语 · 追问应对与具体化"
      }
    ],
    selfCheck: `【6 分钟陈述提纲】
① 引入（约 30 秒）：区分「事实上的做法」与「法律上的权利」。
   — « Le télétravail s'est installé dans les faits ; la question est de savoir s'il doit devenir un droit opposable, et pour quels métiers. »
② POUR en faire un droit（约 2 分钟，4 条法语要点）
   1. Il réduit le temps et le coût des trajets, avec un bénéfice direct pour l'environnement.
   2. Il ouvre l'emploi aux personnes en situation de handicap et aux aidants familiaux, qui restent souvent écartés du marché du travail.
   3. Il donne au salarié une autonomie qui améliore la qualité de vie, sans nuire à la productivité lorsque les objectifs sont clairs.
   4. Il revitalise les villes moyennes et les zones rurales, où les salariés peuvent enfin s'installer.
③ CONTRE ce droit（约 2 分钟，4 条法语要点）
   1. Tous les métiers ne peuvent pas s'exercer à distance : soignants, chauffeurs-livreurs, vendeurs, techniciens de maintenance.
   2. Il crée deux catégories de salariés, ceux qui peuvent partir et ceux qui restent, ce qui nourrit un sentiment d'injustice.
   3. L'isolement et la perte d'apprentissage informel touchent d'abord les jeunes et les nouveaux embauchés.
   4. Un droit trop rigide réduit la marge de négociation dans l'entreprise et complique l'organisation des équipes.
④ 个人立场（约 1 分 30 秒）
   — « Je défendrais non pas un droit automatique, mais un droit encadré : télétravail possible deux jours par semaine, présences obligatoires définies par équipe, et priorité accordée aux salariés dont la situation le justifie. »

【5 个考官追问 + 建议回应方向】
1. « Un droit, cela signifie-t-il que l'employeur ne peut jamais refuser ? »
   → 方向：区分 droit absolu 与 droit conditionné ; 说明可以通过 accord d'entreprise 规定「拒绝须有书面理由」，并允许 ajournement motivé。
2. « Que proposez-vous pour les métiers qui ne peuvent pas être exercés à distance ? »
   → 方向：承认这一类工作者；提出补偿性措施（aménagement des horaires, réduction du temps de trajet subventionné, compte épargne-temps）以免造成二等员工。
3. « Le lien social dans l'entreprise n'est-il pas menacé ? »
   → 方向：让步 + 对策：présence minimale obligatoire, temps collectifs sanctuarisés, tutorat en présentiel pour les nouveaux arrivants。
4. « Qui paierait ? »
   → 方向：给出分摊逻辑——employeur pour les outils, prise en charge partagée pour la connexion, déduction fiscale pour l'espace de travail.
5. « Comment évalueriez-vous cette mesure ? »
   → 方向：指标化：taux d'absentéisme, rotation du personnel, émissions liées aux trajets, satisfaction mesurée à six et douze mois, avec clause de révision.

【评分维度（DELF B2 口语 · 25 分制）】
· 任务完成度（5 分）：是否做满 6 分钟、是否同时处理「价值」与「求职适用范围」、结论是否明确。
· 连贯与互动（5 分）：结构预告、让步结构（certes… encore faut-il que）、追问时是否先回应再补充。
· 词汇（5 分）：télétravail, droit opposable, aidants, isolement, accord d'entreprise, présence minimale, réversible。
· 语法（5 分）：虚拟式（encore faut-il qu'il reste）、条件式（je défendrais）、无人称与被动（il s'agit de, sont écartés）。
· 语音与流利度（5 分）：注意 liaison（les‿aidants, en‿effet）、词末辅音不发音、法语的节奏组而非逐词重音。`
  },

  {
    id: "ex-b2-speaking-03",
    level: "B2",
    skill: "speaking",
    title: "口语：社交网络是否威胁青少年心理健康",
    textFr: "Sujet d'exposé : « Les réseaux sociaux menacent-ils la santé mentale des adolescents ? » Vous préparez l'exposé en 30 minutes, vous parlez environ 6 minutes, puis vous échangez avec le jury pendant 10 minutes.",
    instructions: "准备 30 分钟。这个题目最容易犯的错误是只看一边：要么把平台说成万恶之源，要么完全否认风险。正确做法是先区分「相关」与「因果」，再分别讨论「风险」与「保护因素」，最后给出可操作的建议（如平台责任、数字素养教育、家长陪伴）。pour 与 contre 各 4 条，各配一个具体现象。",
    questions: [
      {
        id: "q-speaking-b2-9062",
        level: "B2",
        skill: "speaking",
        prompt: "Quelle distinction méthodologique est indispensable pour traiter ce sujet ?",
        options: [
          "Distinguer la corrélation de la causalité entre usage des réseaux et mal-être.",
          "Distinguer les marques de téléphone entre elles.",
          "Distinguer les adolescents qui aiment les jeux vidéo de ceux qui n'en jouent pas."
        ],
        answer: "Distinguer la corrélation de la causalité entre usage des réseaux et mal-être.",
        explain: "数据显示「使用多」与「焦虑多」常同时出现，但可能是焦虑的青少年更常上网，或两者都由第三个因素导致。能否指出这一点，是 B2 与 B1 在思辨上的分水岭。另外两项不构成论证方法。",
        source: "DELF B2 口语 · 思辨与论证方法"
      },
      {
        id: "q-speaking-b2-9063",
        level: "B2",
        skill: "speaking",
        prompt: "Lequel de ces énoncés est un argument favorable aux réseaux sociaux (contre la thèse du danger) ?",
        options: [
          "Ils servent de refuge et de source d'information à des jeunes isolés, notamment en milieu rural.",
          "Les algorithmes poussent les contenus extrêmes pour retenir l'attention.",
          "Le temps d'écran empiète sur le sommeil des adolescents."
        ],
        answer: "Ils servent de refuge et de source d'information à des jeunes isolés, notamment en milieu rural.",
        explain: "这条讲「保护因素」——社交网络对孤立青年（乡村、少数群体）可能是少数可得的支持渠道，属于反方论据。另外两条是风险论据（算法放大、挤占睡眠）。口语考试要求考生能自觉区分自己在为哪一方说话。",
        source: "DELF B2 口语 · 论点归类"
      },
      {
        id: "q-speaking-b2-9064",
        level: "B2",
        skill: "speaking",
        prompt: "Comment terminer l'exposé de la manière la plus efficace ?",
        options: [
          "En proposant une mesure concrète et évaluable, en plus de la prise de position.",
          "En répétant mot pour mot l'introduction.",
          "En s'excusant d'avoir manqué de temps et en s'arrêtant net."
        ],
        answer: "En proposant une mesure concrète et évaluable, en plus de la prise de position.",
        explain: "好的结论 = 明确立场 + 可执行建议，二者缺一不可。逐字重复引言没有推进；以道歉收尾会削弱整体印象（且考试中时间由自己控制，不应出现这种情况）。",
        source: "DELF B2 口语 · 结论与建议"
      }
    ],
    selfCheck: `【6 分钟陈述提纲】
① 引入（约 30 秒）：先立方法——区分相关与因果。
   — « Les enquêtes montrent une corrélation entre usage intensif et mal-être ; encore faut-il se demander dans quel sens joue la cause. »
② POUR la thèse du danger（约 2 分钟，4 条法语要点）
   1. L'usage intensif empiète sur le sommeil, et le manque de sommeil aggrave l'anxiété.
   2. Les algorithmes de recommandation privilégient les contenus qui suscitent l'indignation ou l'envie, donc les plus nocifs.
   3. La comparaison permanente avec des images retouchées dégrade l'estime de soi, surtout chez les adolescentes.
   4. Le cerveau adolescent est encore en construction : le contrôle de soi et la résistance à la récompense immédiate y sont plus faibles.
③ CONTRE la thèse du danger（约 2 分钟，4 条法语要点）
   1. Les réseaux servent aussi de refuge et d'information à des jeunes isolés, notamment en milieu rural ou au sein de minorités.
   2. Corrélation n'est pas causalité : les jeunes en difficulté se tournent souvent vers les écrans, et non l'inverse.
   3. Interdire déplace le problème : les usages se cachent, et le dialogue avec les adultes se perd.
   4. Le facteur décisif reste l'entourage : un adolescent entouré, qui pratique un sport, est bien moins exposé.
④ 个人立场（约 1 分 30 秒）
   — « Je ne crois pas à l'interdiction pure, mais à trois mesures : un plafond d'usage nocturne par défaut, une transparence réelle des algorithmes, et deux heures d'éducation aux médias par mois au collège. »

【5 个考官追问 + 建议回应方向】
1. « Vous voulez donc interdire les réseaux sociaux aux mineurs ? »
   → 方向：澄清立场——réguler les usages et les modèles économiques, non interdire ; 说明 interdiction 会把青少年推向不受监管的空间。
2. « Les études ne se contredisent-elles pas ? »
   → 方向：承认差异来自方法（auto-déclaration, échantillons, effets faibles mais réels）; 结论应表述为「存在风险、程度有争议」，而不是「有或没有」。
3. « Que proposez-vous concrètement ? »
   → 方向：给三条可评估措施，并说明由谁执行、如何检验（plateformes, État, établissements scolaires, familles）。
4. « Et la liberté d'expression et le droit à l'information des jeunes ? »
   → 方向：强调措施针对的是「设计」（dark patterns, notifications nocturnes）而非内容本身，避免介入言论。
5. « Et si les adolescents contournent les règles ? »
   → 方向：承认技术绕行不可避免，因此重点放在 compétence critique（数字素养）而非纯技术封锁。

【评分维度（DELF B2 口语 · 25 分制）】
· 任务完成度（5 分）：是否呈现双方各 4 条、是否给出方法性判断（相关/因果）与可操作建议。
· 连贯与互动（5 分）：先方法后论据的结构，让步结构（certes…, or…）、追问时先回应再补充。
· 词汇（5 分）：santé mentale, algorithme, estime de soi, corrélation, causalité, éducation aux médias, dark patterns。
· 语法（5 分）：虚拟式（encore faut-il que l'on distingue）、条件式（je défendrais）、被动与无人称。
· 语音与流利度（5 分）：注意 liaison 与节奏；列举时用 intonation montante，结论时降调收束。`
  },

  {
    id: "ex-b1-speaking-04",
    level: "B1",
    skill: "speaking",
    title: "口语：小学该不该取消家庭作业",
    textFr: "Sujet d'exposé : « Faut-il supprimer les devoirs à la maison à l'école primaire ? » Vous préparez un exposé de 5 à 6 minutes, puis vous discutez avec le jury.",
    instructions: "准备 25 分钟。B1 的要求是讲清楚、有结构、能用简单例子说明。提纲三栏：pour（4 条）、contre（4 条）、mon avis（2–3 句）。每条论点只用一两句话，用 D'abord / Ensuite / Par exemple 串起来；不需要引用数据，讲身边可观察到的现象即可。",
    questions: [
      {
        id: "q-speaking-b1-9065",
        level: "B1",
        skill: "speaking",
        prompt: "Quel argument est en faveur de la suppression des devoirs ?",
        options: [
          "Tous les parents ne peuvent pas aider leur enfant, ce qui creuse les inégalités.",
          "Les devoirs permettent de mémoriser les leçons.",
          "Les devoirs apprennent aux enfants à s'organiser."
        ],
        answer: "Tous les parents ne peuvent pas aider leur enfant, ce qui creuse les inégalités.",
        explain: "「家庭作业加剧不公平」是支持取消的核心论据（有些家长不会法语、下班晚、无力辅导）。另外两条是「作业的好处」，属于反对方。B1 口语要求能明确区分双方立场，并把论据和立场对应起来。",
        source: "DELF B1 口语 · 论点归类"
      },
      {
        id: "q-speaking-b1-9066",
        level: "B1",
        skill: "speaking",
        prompt: "Quelle phrase donne un exemple de façon naturelle à l'oral ?",
        options: [
          "Par exemple, dans ma famille, ma petite sœur passait deux heures par soir sur ses exercices.",
          "Il faut que je réfléchisse, je ne sais pas.",
          "C'est comme ça, c'est tout."
        ],
        answer: "Par exemple, dans ma famille, ma petite sœur passait deux heures par soir sur ses exercices.",
        explain: "Par exemple + 一个个人化的小例子（两小时、妹妹）是 B1 口语最有效的展开方式：具体、可信、语法简单。另外两项要么表示没有观点，要么拒绝论证，都会拉低任务完成度。",
        source: "DELF B1 口语 · 举例与展开"
      },
      {
        id: "q-speaking-b1-9067",
        level: "B1",
        skill: "speaking",
        prompt: "Vous n'êtes pas sûr(e) d'un mot. Que faites-vous ?",
        options: [
          "Reformuler avec des mots plus simples pour continuer à parler.",
          "Arrêter l'exposé et attendre de retrouver le mot.",
          "Passer au français familier pour aller plus vite."
        ],
        answer: "Reformuler avec des mots plus simples pour continuer à parler.",
        explain: "口语评分看重持续交流的能力，reformulation（换一种说法）正是被鼓励的策略。停下来会打断流利度；为了掩饰而用俚语则与考试语域不符。",
        source: "DELF B1 口语 · 沟通策略"
      }
    ],
    selfCheck: `【5–6 分钟陈述提纲】
① 引入（约 30 秒）
   — « À l'école primaire, les enfants rentrent parfois avec une heure de devoirs. Faut-il continuer ou supprimer ? Je vais présenter les deux positions, puis donner mon avis. »
② POUR la suppression（约 2 分钟，4 条法语要点）
   1. Tous les parents ne peuvent pas aider leur enfant : certains travaillent tard ou ne maîtrisent pas le français, ce qui creuse les inégalités.
   2. Après six heures de classe, les enfants sont fatigués ; travailler encore le soir se fait dans de mauvaises conditions et nuit à la concentration.
   3. Le temps libre sert aussi à apprendre : sport, musique, jeux, lecture plaisir.
   4. Beaucoup d'enfants copient ou bâclent leurs devoirs, donc l'exercice perd son intérêt.
③ CONTRE la suppression（约 2 分钟，4 条法语要点）
   1. La répétition est nécessaire pour mémoriser les tables, l'orthographe et le vocabulaire.
   2. Les devoirs apprennent à s'organiser seul, ce qui prépare au collège.
   3. Ils créent un lien entre l'école et les familles, qui voient ce que l'enfant apprend.
   4. Certains élèves ont besoin de plus de temps que les autres pour progresser.
④ 个人立场（约 1 分钟）
   — « Je pense qu'il faut supprimer les devoirs écrits longs, mais garder dix minutes de lecture ou de révision. Il vaut mieux lire un livre que copier une leçon. »

【5 个考官追问 + 建议回应方向】
1. « Et si les enfants ne travaillent pas du tout à la maison, que se passe-t-il ? »
   → 方向：说明「取消作业」不等于「什么都不做」，主张每天 10 分钟阅读与背诵，并强调课堂内完成练习。
2. « Les devoirs ne sont-ils pas utiles pour les élèves en difficulté ? »
   → 方向：让步后指出「帮助应当在学校里由老师提供」（soutien scolaire, aide aux devoirs encadrée），而不是依赖家庭。
3. « Que proposeriez-vous à la place ? »
   → 方向：给出具体方案：练习在课堂内完成、每晚 10 分钟阅读、每周一次自主小项目。
4. « Les parents ne vont-ils pas s'inquiéter ? »
   → 方向：强调沟通：向家长说明课堂内的练习安排，用 des temps de lecture partagée 等方式维持家长参与感。
5. « Et au collège, il y aura bien des devoirs ? »
   → 方向：承认阶段差异，说明小学末期可逐步引入 20 分钟左右的短任务作为过渡。

【评分维度（DELF B1 口语 · 25 分制）】
· 任务完成度（5 分）：是否讲够时间、双方各 4 条、是否给出个人立场与至少一条建议。
· 连贯与互动（5 分）：D'abord / Ensuite / Par exemple / Enfin 的使用；能否听懂追问并作答。
· 词汇（5 分）：devoirs, inégalités, mémoriser, s'organiser, soutien scolaire, temps libre。
· 语法（5 分）：现在时与条件式（il vaudrait mieux）、比较级（plus utile que）、简单虚拟式（il faut que les enfants lisent）。
· 语音与流利度（5 分）：语速平稳、句末降调；不必追求完美，避免长时间停顿。`
  },

  {
    id: "ex-b2-speaking-05",
    level: "B2",
    skill: "speaking",
    title: "口语：人工智能会消灭工作吗",
    textFr: "Sujet d'exposé : « L'intelligence artificielle va-t-elle détruire des emplois ou en créer ? » Vous préparez l'exposé en 30 minutes, vous parlez environ 6 minutes, puis vous répondez aux questions du jury pendant 10 minutes.",
    instructions: "准备 30 分钟。要点：把「技术可能性」与「社会后果」分开谈。pour（乐观）与 contre（悲观）各 4 条，每条尽量指到一个具体行业（物流、银行、医疗、翻译、制造）。最后给出你主张的三项配套政策，并说明由谁负责落实。",
    questions: [
      {
        id: "q-speaking-b2-9068",
        level: "B2",
        skill: "speaking",
        prompt: "Quel argument est le plus solide pour nuancer la thèse du « chômage technologique » ?",
        options: [
          "Chaque révolution technique a supprimé des tâches tout en créant des métiers nouveaux, mais la vitesse de la transition change tout.",
          "Les machines ne remplaceront jamais personne, c'est impossible.",
          "Il ne faut pas parler de ce sujet, il fait peur."
        ],
        answer: "Chaque révolution technique a supprimé des tâches tout en créant des métiers nouveaux, mais la vitesse de la transition change tout.",
        explain: "这一表述同时做了两件事：承认历史规律（技术创造新职业），又指出真正的变量是 transition 的速度。选项「jamais personne」绝对化且无法证明；选项「il ne faut pas en parler」是回避论证，两者都无法支撑 6 分钟陈述。",
        source: "DELF B2 口语 · 立论与历史类比"
      },
      {
        id: "q-speaking-b2-9069",
        level: "B2",
        skill: "speaking",
        prompt: "Comment structurer l'exposé pour qu'il soit clair à l'écoute ?",
        options: [
          "Annoncer un plan en deux temps, puis respecter ce plan avec des connecteurs explicites.",
          "Donner toutes ses idées en désordre, du plus récent au plus ancien.",
          "Lire un texte rédigé mot à mot pendant six minutes."
        ],
        answer: "Annoncer un plan en deux temps, puis respecter ce plan avec des connecteurs explicites.",
        explain: "口试听众没有回看的机会，因此必须「先报路线，再沿路线走」：用 annonce du plan 与 d'abord / en revanche / pour conclure 等标志词。朗读成稿会造成语调平板、失去互动，也容易被考官追问时卡住。",
        source: "DELF B2 口语 · 结构清晰度"
      },
      {
        id: "q-speaking-b2-9070",
        level: "B2",
        skill: "speaking",
        prompt: "Le jury demande : « Faut-il taxer les robots ? » Quelle réponse montre une réelle maîtrise ?",
        options: [
          "Discuter la faisabilité : qui serait taxé, pourquoi cela pourrait freiner l'investissement, et quelles alternatives existent.",
          "Répondre oui, parce que c'est une idée à la mode.",
          "Dire que la question est trop difficile pour vous."
        ],
        answer: "Discuter la faisabilité : qui serait taxé, pourquoi cela pourrait freiner l'investissement, et quelles alternatives existent.",
        explain: "对争议性追问，高分回答是「拆解条件 + 提出替代方案」，而不是简单表态。可以从「机器人」定义不清、税基难界定、可能抑制投资等角度质疑，再提出替代（对自动化收益征税已在讨论中，或改为资助职业培训）。选项「idée à la mode」附和而不论证；「trop difficile」放弃互动。",
        source: "DELF B2 口语 · 争议问题的拆解"
      }
    ],
    selfCheck: `【6 分钟陈述提纲】
① 引入（约 30 秒）：先区分两件事。
   — « Une chose est la capacité technique de remplacer des tâches ; autre chose est la vitesse à laquelle la société s'y adapte. »
② POUR l'optimisme technologique（约 2 分钟，4 条法语要点）
   1. L'histoire le montre : l'imprimerie, la machine à vapeur puis l'informatique ont supprimé des métiers mais en ont créé davantage.
   2. L'IA prend d'abord en charge les tâches répétitives et pénibles : saisie de données, contrôle qualité, surveillance de nuit.
   3. Elle libère du temps pour les activités à forte valeur humaine : diagnostic, conseil, soin, enseignement.
   4. De nouveaux métiers apparaissent déjà : entraînement de modèles, audit d'algorithmes, cybersécurité, maintenance des systèmes.
③ CONTRE l'optimisme（约 2 分钟，4 条法语要点）
   1. La vitesse de diffusion est inédite : ce qui prenait cinquante ans en prend dix, or le temps de la formation reste long.
   2. Le marché du travail se polarise : les métiers très qualifiés et peu qualifiés résistent, tandis que les emplois intermédiaires reculent.
   3. La déqualification guette : un traducteur ou un assistant qui se contente de corriger la machine perd son autonomie et son savoir-faire.
   4. Les gains de productivité vont surtout au capital, ce qui creuse les inégalités si rien n'est redistribué.
④ 个人主张（约 1 分 30 秒）
   — « Je ne crois ni à la catastrophe ni à la neutralité : je défends trois mesures — un droit à la formation financé par les entreprises, une protection des revenus pendant la reconversion, et une obligation de transparence sur les décisions automatisées. »

【5 个考官追问 + 建议回应方向】
1. « Quels métiers sont, selon vous, les plus menacés ? »
   → 方向：举可核查的例子（saisie de données, téléconseil de premier niveau, traduction standardisée, comptabilité de routine），同时说明「任务」被替代不等于「职位」立刻消失。
2. « Faut-il taxer les robots ? »
   → 方向：先讨论可行性（税基与定义不清、可能抑制投资），再给替代方案（financer la formation, conditionner les aides publiques à l'emploi）。
3. « Que faire des salariés dont le poste disparaît ? »
   → 方向：三支柱：anticipation (gestion prévisionnelle des emplois), formation continue rémunérée, revenu de transition.
4. « L'IA peut-elle décider mieux qu'un humain ? »
   → 方向：区分 domaine (calcul, détection de motifs) 与 jugement de valeur ; 强调 responsabilité humaine 不可转移（医疗、司法、招聘）。
5. « N'êtes-vous pas en train de faire un discours technophobe ? »
   → 方向：明确澄清立场：technophile sur les usages, exigeant sur les règles ; 重申主张是「管好过渡期」而不是「拒绝技术」。

【评分维度（DELF B2 口语 · 25 分制）】
· 任务完成度（5 分）：双方各 4 条、指到具体行业、给出三项配套政策。
· 连贯与互动（5 分）：引入时明确分类标准，主体用 d'abord / en revanche / or / en définitive；追问时先复述问题再回答。
· 词汇（5 分）：chômage technologique, tâches répétitives, polarisation, déqualification, reconversion, formation continue, transparence des algorithmes。
· 语法（5 分）：条件式（je défendrais, serait taxé）、虚拟式（il faudrait que les entreprises financent）、被动（les tâches sont prises en charge）。
· 语音与流利度（5 分）：语速稳定、逻辑词重读、句末降调；注意 nombres 与 sigles 的读法（IA : i-a）。`
  }

];

/* 兼容层：task-12 描述里写的 type 字段与契约第 4 节的 skill 同义，
   这里统一补齐，避免下游渲染层读 it.type 时取到 undefined。 */
window.EXAM_ITEMS.forEach(function (it) {
  if (!it.type) it.type = it.skill;
  if (typeof it.selfCheck !== "string") it.selfCheck = "";
});
