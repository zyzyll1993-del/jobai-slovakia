/* =====================================================
   JobAI Slovakia — JOB DATABASE v0.6
   Професії, синоніми та ключові навички
   ===================================================== */

const JOB_DATABASE = [

  /* ================= CNC / MACHINING ================= */

  {
    title: "CNC operátor",
    aliases: [
      "cnc operator",
      "cnc operátor",
      "operátor cnc",
      "cnc pracovník",
      "cnc machine operator"
    ],
    skills: [
      "cnc",
      "cnc machine",
      "technical drawing",
      "technický výkres",
      "meranie",
      "measuring",
      "tool setting",
      "nastavenie stroja"
    ]
  },

  {
    title: "CNC programátor",
    aliases: [
      "cnc programmer",
      "cnc programátor",
      "programátor cnc",
      "cnc programming"
    ],
    skills: [
      "cnc programming",
      "programovanie cnc",
      "g-code",
      "g code",
      "m-code",
      "fanuc",
      "siemens",
      "sinumerik",
      "heidenhain",
      "mazatrol",
      "programming"
    ]
  },

  {
    title: "CNC nastavovač",
    aliases: [
      "cnc setter",
      "cnc setup",
      "cnc setup operator",
      "nastavovač cnc",
      "nastavovač"
    ],
    skills: [
      "cnc",
      "setup",
      "nastavenie",
      "seřízení",
      "tools",
      "nástroje",
      "technical drawing"
    ]
  },

  {
    title: "Obrábač kovov",
    aliases: [
      "metal machinist",
      "machinist",
      "obrábač kovov",
      "strojár",
      "machinist"
    ],
    skills: [
      "machining",
      "obrábanie",
      "milling",
      "frézovanie",
      "turning",
      "sústruženie",
      "cnc",
      "technical drawing"
    ]
  },

  {
    title: "Frézar",
    aliases: [
      "miller",
      "milling operator",
      "frézar",
      "cnc frézar"
    ],
    skills: [
      "milling",
      "frézovanie",
      "cnc",
      "heidenhain",
      "fanuc",
      "technical drawing"
    ]
  },

  {
    title: "Sústružník",
    aliases: [
      "turner",
      "lathe operator",
      "sústružník",
      "cnc sústružník"
    ],
    skills: [
      "turning",
      "sústruženie",
      "cnc",
      "fanuc",
      "siemens",
      "technical drawing"
    ]
  },


  /* ================= 3D / CAD / CAM ================= */

  {
    title: "3D technik programátor",
    aliases: [
      "3d technik",
      "3d technik programátor",
      "3d technik programator",
      "3d programmer",
      "3d technician",
      "3d measurement technician",
      "3d meranie",
      "3d merací technik",
      "3d merací technik programátor"
    ],
    skills: [
      "3d",
      "3d measurement",
      "3d meranie",
      "cmm",
      "coordinate measuring machine",
      "súradnicové meranie",
      "metrology",
      "metrológia",
      "calypso",
      "zeiss calypso",
      "zeiss",
      "measurement",
      "meranie",
      "programming"
    ]
  },

  {
    title: "CMM technik",
    aliases: [
      "cmm technician",
      "cmm technik",
      "cmm operator",
      "coordinate measuring machine technician",
      "súradnicový merací technik"
    ],
    skills: [
      "cmm",
      "3d measurement",
      "coordinate measuring machine",
      "súradnicové meranie",
      "calypso",
      "zeiss",
      "metrology",
      "metrológia"
    ]
  },

  {
    title: "Metrológ",
    aliases: [
      "metrologist",
      "metrology technician",
      "metrológ",
      "technik metrológie"
    ],
    skills: [
      "metrology",
      "metrológia",
      "measurement",
      "meranie",
      "cmm",
      "3d measurement",
      "calypso",
      "zeiss",
      "quality"
    ]
  },

  {
    title: "CAD technik",
    aliases: [
      "cad technician",
      "cad technik",
      "cad designer",
      "cad kreslič",
      "technický kreslič"
    ],
    skills: [
      "cad",
      "autocad",
      "solidworks",
      "catia",
      "nx",
      "creo",
      "technical drawing",
      "technická dokumentácia"
    ]
  },

  {
    title: "CAM programátor",
    aliases: [
      "cam programmer",
      "cam programátor",
      "cam technik"
    ],
    skills: [
      "cam",
      "mastercam",
      "fusion 360",
      "siemens nx",
      "hypercam",
      "cnc programming",
      "g-code"
    ]
  },

  {
    title: "Konštruktér",
    aliases: [
      "designer",
      "mechanical designer",
      "design engineer",
      "konštruktér",
      "strojársky konštruktér"
    ],
    skills: [
      "solidworks",
      "autocad",
      "catia",
      "nx",
      "creo",
      "3d cad",
      "technical drawing",
      "technická dokumentácia"
    ]
  },


  /* ================= AUTOMATION ================= */

  {
    title: "PLC programátor",
    aliases: [
      "plc programmer",
      "plc programátor",
      "programátor plc",
      "automation programmer"
    ],
    skills: [
      "plc",
      "siemens",
      "tia portal",
      "step 7",
      "allen bradley",
      "beckhoff",
      "automation",
      "automatizácia"
    ]
  },

  {
    title: "Mechatronik",
    aliases: [
      "mechatronics technician",
      "mechatronic",
      "mechatronik"
    ],
    skills: [
      "mechatronics",
      "mechatronika",
      "plc",
      "automation",
      "electrical",
      "mechanical"
    ]
  },

  {
    title: "Elektrotechnik",
    aliases: [
      "electrical technician",
      "electrician",
      "elektrotechnik",
      "elektrikár"
    ],
    skills: [
      "electrical",
      "elektrotechnika",
      "wiring",
      "zapojenie",
      "plc",
      "automation"
    ]
  },


  /* ================= PRODUCTION ================= */

  {
    title: "Technológ výroby",
    aliases: [
      "production technologist",
      "manufacturing technologist",
      "technológ",
      "technológ výroby"
    ],
    skills: [
      "production",
      "výroba",
      "manufacturing",
      "process",
      "technológia",
      "technical documentation",
      "quality"
    ]
  },

  {
    title: "Majster výroby",
    aliases: [
      "production supervisor",
      "production manager",
      "shift leader",
      "majster výroby",
      "vedúci výroby"
    ],
    skills: [
      "production",
      "výroba",
      "team leader",
      "shift",
      "smennosť",
      "management",
      "quality"
    ]
  },

  {
    title: "Kontrolór kvality",
    aliases: [
      "quality inspector",
      "quality controller",
      "quality technician",
      "kontrolór kvality",
      "technik kvality"
    ],
    skills: [
      "quality",
      "quality control",
      "kontrola kvality",
      "measurement",
      "meranie",
      "technical drawing",
      "cmm"
    ]
  },


  /* ================= WAREHOUSE ================= */

  {
    title: "Skladník",
    aliases: [
      "warehouse worker",
      "warehouse operator",
      "warehouseman",
      "skladník"
    ],
    skills: [
      "warehouse",
      "sklad",
      "inventory",
      "zásoby",
      "logistics",
      "logistika"
    ]
  },

  {
    title: "Vodič VZV",
    aliases: [
      "forklift driver",
      "forklift operator",
      "vodič vzv",
      "vodič vysokozdvižného vozíka"
    ],
    skills: [
      "forklift",
      "vysokozdvižný vozík",
      "vzv",
      "warehouse",
      "sklad"
    ]
  },


  /* ================= GENERAL SKILLS ================= */

  {
    title: "Technické zručnosti",
    aliases: [
      "technical skills",
      "technické zručnosti"
    ],
    skills: [
      "technical drawing",
      "technický výkres",
      "technical documentation",
      "technická dokumentácia",
      "measurement",
      "meranie",
      "quality",
      "kontrola kvality"
    ]
  },

  {
    title: "Jazyky",
    aliases: [
      "slovak",
      "slovenčina",
      "slovenský jazyk",
      "english",
      "angličtina",
      "german",
      "nemčina"
    ],
    skills: [
      "slovak",
      "slovenčina",
      "english",
      "angličtina",
      "german",
      "nemčina"
    ]
  }

];


/* =====================================================
   ПОШУК ПРОФЕСІЇ
   ===================================================== */

function findJobs(text){

  if(!text){
    return [];
  }

  const normalized =
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"");

  return JOB_DATABASE.filter(job => {

    return job.aliases.some(alias => {

      const a =
        alias
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g,"");

      return normalized.includes(a);

    });

  });

}


/* =====================================================
   ПОШУК НАВИЧОК
   ===================================================== */

function findJobSkills(text){

  if(!text){
    return [];
  }

  const normalized =
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"");

  let skills = [];

  JOB_DATABASE.forEach(job => {

    job.skills.forEach(skill => {

      const s =
        skill
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g,"");

      if(normalized.includes(s)){
        skills.push(skill);
      }

    });

  });

  return [...new Set(skills)];

}


/* =====================================================
   ОТРИМАТИ ВСІ ВІДПОВІДНІ НАВИЧКИ
   ДЛЯ КОНКРЕТНОЇ ПРОФЕСІЇ
   ===================================================== */

function getSkillsForJobs(jobs){

  let skills = [];

  jobs.forEach(job => {

    skills.push(...job.skills);

  });

  return [...new Set(skills)];

      }
