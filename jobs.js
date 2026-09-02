/*
=========================================================
 JOBAI SLOVAKIA
 Rozšírená databáza pracovných pozícií
 Slovakia Job Database 2026
=========================================================
*/

const JOB_DATABASE = [

    // =====================================================
    // VÝROBA / MANUFACTURING
    // =====================================================

    {
        name: "Operátor výroby",
        aliases: [
            "operator vyroby",
            "operátor výroby",
            "production operator",
            "production worker",
            "výrobný pracovník",
            "vyrobny pracovnik"
        ],
        skills: [
            "výroba",
            "montáž",
            "production",
            "assembly",
            "kontrola kvality",
            "quality control",
            "zmenová práca"
        ]
    },

    {
        name: "Montážny pracovník",
        aliases: [
            "montazny pracovnik",
            "montážny pracovník",
            "montážnik",
            "montaznik",
            "assembly worker",
            "assembler"
        ],
        skills: [
            "montáž",
            "assembly",
            "ručné náradie",
            "manual tools",
            "výroba"
        ]
    },

    {
        name: "CNC operátor",
        aliases: [
            "cnc operator",
            "cnc operátor",
            "cnc machine operator",
            "operátor cnc"
        ],
        skills: [
            "cnc",
            "čítanie výkresov",
            "technické výkresy",
            "meranie",
            "posuvné meradlo",
            "mikrometer",
            "siemens",
            "fanuc",
            "heidenhain"
        ]
    },

    {
        name: "CNC programátor",
        aliases: [
            "cnc programator",
            "cnc programátor",
            "cnc programmer",
            "programátor cnc"
        ],
        skills: [
            "cnc",
            "programovanie",
            "g code",
            "cam",
            "fanuc",
            "siemens",
            "heidenhain",
            "mazatrol",
            "technické výkresy"
        ]
    },

    {
        name: "CNC nastavovač",
        aliases: [
            "cnc nastavovac",
            "cnc nastavovač",
            "cnc setup",
            "cnc setter",
            "setup operator"
        ],
        skills: [
            "cnc",
            "nastavovanie",
            "seřizovanie",
            "setup",
            "meranie",
            "technické výkresy"
        ]
    },

    {
        name: "Sústružník",
        aliases: [
            "sustruznik",
            "sústružník",
            "cnc sústružník",
            "cnc sustruznik",
            "lathe operator",
            "cnc lathe operator"
        ],
        skills: [
            "sústruh",
            "cnc",
            "sústruženie",
            "meranie",
            "technické výkresy"
        ]
    },

    {
        name: "Frézar",
        aliases: [
            "frezar",
            "frézar",
            "cnc frézar",
            "cnc frezar",
            "miller",
            "cnc milling operator"
        ],
        skills: [
            "frézovanie",
            "cnc",
            "frézka",
            "meranie",
            "technické výkresy"
        ]
    },

    {
        name: "Obrábač kovov",
        aliases: [
            "obrabac kovov",
            "obrábač kovov",
            "metal worker",
            "machinist",
            "metal machining"
        ],
        skills: [
            "obrábanie",
            "kovy",
            "cnc",
            "meranie",
            "technické výkresy"
        ]
    },

    {
        name: "Zvárač",
        aliases: [
            "zvarac",
            "zvárač",
            "welder",
            "zvárač kovov",
            "mig mag zvárač",
            "tig zvárač"
        ],
        skills: [
            "zváranie",
            "mig",
            "mag",
            "tig",
            "elektroda",
            "čítanie výkresov",
            "kovy"
        ]
    },

    {
        name: "Zámočník",
        aliases: [
            "zamocnik",
            "zámočník",
            "locksmith",
            "metal worker",
            "fitter"
        ],
        skills: [
            "kovovýroba",
            "montáž",
            "zváranie",
            "technické výkresy",
            "ručné náradie"
        ]
    },

    {
        name: "Nástrojár",
        aliases: [
            "nastrojar",
            "nástrojár",
            "toolmaker",
            "tool maker",
            "formar"
        ],
        skills: [
            "nástroje",
            "formy",
            "cnc",
            "frézovanie",
            "sústruženie",
            "meranie"
        ]
    },

    {
        name: "Technológ výroby",
        aliases: [
            "technolog vyroby",
            "technológ výroby",
            "production technologist",
            "manufacturing technologist"
        ],
        skills: [
            "technológia výroby",
            "výrobné procesy",
            "technická dokumentácia",
            "optimalizácia",
            "lean"
        ]
    },

    {
        name: "Majster výroby",
        aliases: [
            "majster vyroby",
            "majster výroby",
            "production supervisor",
            "production manager"
        ],
        skills: [
            "vedenie tímu",
            "výroba",
            "plánovanie",
            "kvalita",
            "lean",
            "5s"
        ]
    },

    {
        name: "Kontrolór kvality",
        aliases: [
            "kontrolor kvality",
            "kontrolór kvality",
            "quality inspector",
            "quality control",
            "qc inspector"
        ],
        skills: [
            "kontrola kvality",
            "quality control",
            "meranie",
            "technické výkresy",
            "kalibrácia"
        ]
    },

    {
        name: "Technik kvality",
        aliases: [
            "technik kvality",
            "quality technician",
            "quality engineer technician"
        ],
        skills: [
            "kvalita",
            "quality",
            "meranie",
            "8d",
            "fmea",
            "ppap",
            "spc"
        ]
    },


    // =====================================================
    // 3D / CMM / METROLÓGIA
    // =====================================================

    {
        name: "3D technik programátor",
        aliases: [
            "3d technik",
            "3d technik programator",
            "3d technik programátor",
            "3d programmer",
            "3d technician",
            "3d measurement technician",
            "3d meranie",
            "3d merací technik",
            "3d meraci technik"
        ],
        skills: [
            "3d",
            "3d measurement",
            "3d meranie",
            "cmm",
            "coordinate measuring machine",
            "súradnicové meranie",
            "metrológia",
            "metrology",
            "calypso",
            "zeiss calypso",
            "zeiss",
            "meranie",
            "programovanie"
        ]
    },

    {
        name: "CMM technik",
        aliases: [
            "cmm technik",
            "cmm technician",
            "cmm operator",
            "coordinate measuring machine technician",
            "súradnicový merací technik"
        ],
        skills: [
            "cmm",
            "3d meranie",
            "zeiss",
            "calypso",
            "meranie",
            "metrológia"
        ]
    },

    {
        name: "Metrológ",
        aliases: [
            "metrolog",
            "metrológ",
            "metrologist",
            "metrology technician"
        ],
        skills: [
            "metrológia",
            "meranie",
            "kalibrácia",
            "cmm",
            "zeiss",
            "calypso",
            "meracie prístroje"
        ]
    },

    {
        name: "Technik merania",
        aliases: [
            "technik merania",
            "measurement technician",
            "measurement engineer",
            "merací technik"
        ],
        skills: [
            "meranie",
            "3d meranie",
            "cmm",
            "kalibrácia",
            "technické výkresy"
        ]
    },


    // =====================================================
    // AUTOMOTIVE
    // =====================================================

    {
        name: "Automobilový mechanik",
        aliases: [
            "automobilovy mechanik",
            "automobilový mechanik",
            "automechanik",
            "car mechanic",
            "auto mechanic"
        ],
        skills: [
            "automobily",
            "diagnostika",
            "opravy",
            "motor",
            "brzdy",
            "elektronika"
        ]
    },

    {
        name: "Automechanik",
        aliases: [
            "automechanik",
            "auto mechanic",
            "car mechanic",
            "mechanik vozidiel"
        ],
        skills: [
            "diagnostika",
            "oprava vozidiel",
            "motor",
            "podvozok",
            "brzdy"
        ]
    },

    {
        name: "Autoelektrikár",
        aliases: [
            "autoelektrikar",
            "autoelektrikár",
            "car electrician",
            "automotive electrician"
        ],
        skills: [
            "elektrotechnika",
            "automotive",
            "diagnostika",
            "elektrické systémy",
            "CAN bus"
        ]
    },

    {
        name: "Montážny pracovník automotive",
        aliases: [
            "automotive assembly",
            "automotive operator",
            "montáž automotive",
            "montaz automobilov"
        ],
        skills: [
            "montáž",
            "automotive",
            "výroba",
            "kontrola kvality"
        ]
    },


    // =====================================================
    // ENGINEERING / TECHNICAL
    // =====================================================

    {
        name: "Strojársky technik",
        aliases: [
            "strojarensky technik",
            "strojársky technik",
            "mechanical technician",
            "mechanical engineering technician"
        ],
        skills: [
            "strojárstvo",
            "technické výkresy",
            "cad",
            "cnc",
            "výroba"
        ]
    },

    {
        name: "Strojársky inžinier",
        aliases: [
            "strojarensky inzinier",
            "strojársky inžinier",
            "mechanical engineer",
            "mechanical engineering"
        ],
        skills: [
            "strojárstvo",
            "cad",
            "solidworks",
            "catia",
            "siemens nx",
            "výroba"
        ]
    },

    {
        name: "Procesný inžinier",
        aliases: [
            "procesny inzinier",
            "procesný inžinier",
            "process engineer",
            "process engineering"
        ],
        skills: [
            "process engineering",
            "výrobné procesy",
            "lean",
            "six sigma",
            "fmea",
            "kaizen"
        ]
    },

    {
        name: "CAD technik",
        aliases: [
            "cad technik",
            "cad technician",
            "cad designer",
            "konštruktér cad"
        ],
        skills: [
            "cad",
            "autocad",
            "solidworks",
            "catia",
            "siemens nx",
            "technické výkresy"
        ]
    },

    {
        name: "Konštruktér",
        aliases: [
            "konstrukter",
            "konštruktér",
            "designer",
            "mechanical designer",
            "design engineer"
        ],
        skills: [
            "konštrukcia",
            "cad",
            "solidworks",
            "catia",
            "technické výkresy"
        ]
    },

    {
        name: "CAM programátor",
        aliases: [
            "cam programator",
            "cam programátor",
            "cam programmer",
            "cam specialist"
        ],
        skills: [
            "cam",
            "cnc",
            "programovanie",
            "mastercam",
            "hypermill",
            "siemens nx"
        ]
    },


    // =====================================================
    // ELECTRICAL / AUTOMATION
    // =====================================================

    {
        name: "Elektrikár",
        aliases: [
            "elektrikar",
            "elektrikár",
            "electrician",
            "industrial electrician"
        ],
        skills: [
            "elektrotechnika",
            "elektrické rozvody",
            "zapojenie",
            "údržba",
            "vyhláška 508"
        ]
    },

    {
        name: "Elektromechanik",
        aliases: [
            "elektromechanik",
            "electromechanic",
            "electromechanical technician"
        ],
        skills: [
            "elektrotechnika",
            "mechanika",
            "údržba",
            "diagnostika",
            "elektrické schémy"
        ]
    },

    {
        name: "Mechatronik",
        aliases: [
            "mechatronik",
            "mechatronics technician",
            "mechatronic"
        ],
        skills: [
            "mechatronika",
            "elektrotechnika",
            "mechanika",
            "automatizácia",
            "plc"
        ]
    },

    {
        name: "PLC programátor",
        aliases: [
            "plc programator",
            "plc programátor",
            "plc programmer",
            "automation programmer"
        ],
        skills: [
            "plc",
            "siemens",
            "tia portal",
            "automatizácia",
            "robotika",
            "s7"
        ]
    },

    {
        name: "Automatizačný technik",
        aliases: [
            "automatizacny technik",
            "automatizačný technik",
            "automation technician",
            "automation engineer"
        ],
        skills: [
            "automatizácia",
            "plc",
            "robotika",
            "siemens",
            "tia portal"
        ]
    },

    {
        name: "Technik údržby",
        aliases: [
            "technik udrzby",
            "technik údržby",
            "maintenance technician",
            "maintenance mechanic"
        ],
        skills: [
            "údržba",
            "mechanika",
            "elektrotechnika",
            "diagnostika",
            "opravy"
        ]
    },

    {
        name: "Údržbár",
        aliases: [
            "udrzbar",
            "údržbár",
            "maintenance worker",
            "maintenance"
        ],
        skills: [
            "údržba",
            "opravy",
            "mechanika",
            "elektrotechnika"
        ]
    },

    {
        name: "Servisný technik",
        aliases: [
            "servisny technik",
            "servisný technik",
            "service technician",
            "field service technician"
        ],
        skills: [
            "servis",
            "diagnostika",
            "opravy",
            "technická podpora",
            "elektrotechnika"
        ]
    },


    // =====================================================
    // LOGISTICS / WAREHOUSE
    // =====================================================

    {
        name: "Skladník",
        aliases: [
            "skladnik",
            "skladník",
            "warehouse worker",
            "warehouseman",
            "warehouse operator"
        ],
        skills: [
            "sklad",
            "logistika",
            "vychystávanie",
            "balenie",
            "inventúra"
        ]
    },

    {
        name: "Vodič VZV",
        aliases: [
            "vodic vzv",
            "vodič vzv",
            "vysokozdvižný vozík",
            "forklift driver",
            "forklift operator"
        ],
        skills: [
            "vzv",
            "vysokozdvižný vozík",
            "sklad",
            "logistika"
        ]
    },

    {
        name: "Picker",
        aliases: [
            "picker",
            "order picker",
            "warehouse picker",
            "picker sklad"
        ],
        skills: [
            "sklad",
            "vychystávanie objednávok",
            "skener",
            "logistika"
        ]
    },

    {
        name: "Logistik",
        aliases: [
            "logistik",
            "logistics specialist",
            "logistics coordinator"
        ],
        skills: [
            "logistika",
            "sklad",
            "doprava",
            "sap",
            "excel"
        ]
    },

    {
        name: "Vedúci skladu",
        aliases: [
            "veduci skladu",
            "vedúci skladu",
            "warehouse manager",
            "warehouse supervisor"
        ],
        skills: [
            "sklad",
            "logistika",
            "vedenie tímu",
            "sap",
            "inventúra"
        ]
    },

    {
        name: "Dispečer",
        aliases: [
            "dispecer",
            "dispečer",
            "dispatcher",
            "transport dispatcher"
        ],
        skills: [
            "dispečing",
            "logistika",
            "doprava",
            "plánovanie",
            "komunikácia"
        ]
    },


    // =====================================================
    // TRANSPORT
    // =====================================================

    {
        name: "Vodič kamiónu",
        aliases: [
            "vodic kamionu",
            "vodič kamiónu",
            "kamionista",
            "truck driver",
            "lorry driver",
            "heavy truck driver"
        ],
        skills: [
            "vodičský preukaz c",
            "vodičský preukaz ce",
            "c",
            "ce",
            "tachograf",
            "kvalifikačná karta vodiča",
            "medzinárodná doprava"
        ]
    },

    {
        name: "Vodič nákladného vozidla",
        aliases: [
            "vodic nakladneho vozidla",
            "vodič nákladného vozidla",
            "truck driver",
            "lorry driver"
        ],
        skills: [
            "c",
            "ce",
            "nákladná doprava",
            "tachograf"
        ]
    },

    {
        name: "Vodič autobusu",
        aliases: [
            "vodic autobusu",
            "vodič autobusu",
            "bus driver"
        ],
        skills: [
            "vodičský preukaz d",
            "d",
            "autobus",
            "profesijná kvalifikácia"
        ]
    },

    {
        name: "Vodič dodávky",
        aliases: [
            "vodic dodavky",
            "vodič dodávky",
            "delivery driver",
            "van driver",
            "kurier"
        ],
        skills: [
            "vodičský preukaz b",
            "b",
            "doručovanie",
            "logistika"
        ]
    },

    {
        name: "Kuriér",
        aliases: [
            "kurier",
            "kuriér",
            "courier",
            "delivery driver"
        ],
        skills: [
            "doručovanie",
            "vodičský preukaz b",
            "logistika",
            "komunikácia"
        ]
    },

    {
        name: "Rušňovodič",
        aliases: [
            "rusnovodic",
            "rušňovodič",
            "train driver",
            "lokomotivführer"
        ],
        skills: [
            "železnica",
            "vlak",
            "rušeň",
            "bezpečnosť"
        ]
    },


    // =====================================================
    // CONSTRUCTION
    // =====================================================

    {
        name: "Murár",
        aliases: [
            "murar",
            "murár",
            "bricklayer",
            "mason"
        ],
        skills: [
            "murovanie",
            "stavebníctvo",
            "betón",
            "stavba"
        ]
    },

    {
        name: "Elektrikár stavieb",
        aliases: [
            "elektrikar stavieb",
            "elektrikár stavieb",
            "construction electrician"
        ],
        skills: [
            "elektrotechnika",
            "elektrické rozvody",
            "stavba",
            "zapojenie"
        ]
    },

    {
        name: "Inštalatér",
        aliases: [
            "instalater",
            "inštalatér",
            "plumber"
        ],
        skills: [
            "vodoinštalácia",
            "potrubia",
            "kúrenie",
            "sanita"
        ]
    },

    {
        name: "Kúrenár",
        aliases: [
            "kurenar",
            "kúrenár",
            "heating technician",
            "heating installer"
        ],
        skills: [
            "kúrenie",
            "kotly",
            "potrubia",
            "vykurovanie"
        ]
    },

    {
        name: "Strechár",
        aliases: [
            "strechar",
            "strechár",
            "roofer",
            "roofing worker"
        ],
        skills: [
            "strechy",
            "strešná krytina",
            "stavba",
            "izolácia"
        ]
    },

    {
        name: "Sadrokartonista",
        aliases: [
            "sadrokartonista",
            "drywall installer",
            "drywall worker"
        ],
        skills: [
            "sadrokartón",
            "montáž",
            "stavebníctvo"
        ]
    },

    {
        name: "Stavebný pracovník",
        aliases: [
            "stavebny pracovnik",
            "stavebný pracovník",
            "construction worker",
            "construction labourer"
        ],
        skills: [
            "stavebníctvo",
            "stavba",
            "ručné náradie",
            "montáž"
        ]
    },

    {
        name: "Stavbyvedúci",
        aliases: [
            "stavbyveduci",
            "stavbyvedúci",
            "site manager",
            "construction manager"
        ],
        skills: [
            "stavebníctvo",
            "vedenie stavby",
            "plánovanie",
            "bezpečnosť"
        ]
    },


    // =====================================================
    // HEALTHCARE
    // =====================================================

    {
        name: "Lekár",
        aliases: [
            "lekar",
            "lekár",
            "doctor",
            "physician"
        ],
        skills: [
            "medicína",
            "diagnostika",
            "zdravotníctvo"
        ]
    },

    {
        name: "Zdravotná sestra",
        aliases: [
            "zdravotna sestra",
            "zdravotná sestra",
            "nurse",
            "registered nurse"
        ],
        skills: [
            "zdravotníctvo",
            "ošetrovateľstvo",
            "pacient",
            "medicína"
        ]
    },

    {
        name: "Praktická sestra",
        aliases: [
            "prakticka sestra",
            "praktická sestra",
            "practical nurse"
        ],
        skills: [
            "ošetrovateľstvo",
            "zdravotníctvo",
            "pacient"
        ]
    },

    {
        name: "Opatrovateľ",
        aliases: [
            "opatrovatel",
            "opatrovateľ",
            "caregiver",
            "carer"
        ],
        skills: [
            "opatrovanie",
            "starostlivosť",
            "seniori",
            "pacient"
        ]
    },

    {
        name: "Fyzioterapeut",
        aliases: [
            "fyzioterapeut",
            "physiotherapist",
            "physical therapist"
        ],
        skills: [
            "fyzioterapia",
            "rehabilitácia",
            "cvičenie"
        ]
    },

    {
        name: "Sanitár",
        aliases: [
            "sanitar",
            "sanitár",
            "hospital orderly",
            "healthcare assistant"
        ],
        skills: [
            "zdravotníctvo",
            "pacient",
            "nemocnica"
        ]
    },


    // =====================================================
    // IT
    // =====================================================

    {
        name: "Software Developer",
        aliases: [
            "software developer",
            "programator",
            "programátor",
            "software engineer",
            "developer"
        ],
        skills: [
            "programovanie",
            "git",
            "api",
            "sql",
            "javascript",
            "python"
        ]
    },

    {
        name: "Java Developer",
        aliases: [
            "java developer",
            "java programator",
            "java programátor"
        ],
        skills: [
            "java",
            "spring",
            "sql",
            "git",
            "api"
        ]
    },

    {
        name: "Python Developer",
        aliases: [
            "python developer",
            "python programator",
            "python programátor"
        ],
        skills: [
            "python",
            "django",
            "flask",
            "fastapi",
            "sql",
            "git"
        ]
    },

    {
        name: ".NET Developer",
        aliases: [
            ".net developer",
            "dotnet developer",
            "c# developer",
            "csharp developer"
        ],
        skills: [
            "c#",
            ".net",
            "asp.net",
            "sql",
            "git"
        ]
    },

    {
        name: "Frontend Developer",
        aliases: [
            "frontend developer",
            "front end developer",
            "web developer"
        ],
        skills: [
            "html",
            "css",
            "javascript",
            "react",
            "vue",
            "typescript"
        ]
    },

    {
        name: "Backend Developer",
        aliases: [
            "backend developer",
            "back end developer"
        ],
        skills: [
            "api",
            "sql",
            "database",
            "node.js",
            "python",
            "java"
        ]
    },

    {
        name: "Full Stack Developer",
        aliases: [
            "full stack developer",
            "fullstack developer",
            "full stack"
        ],
        skills: [
            "html",
            "css",
            "javascript",
            "react",
            "node.js",
            "sql",
            "api"
        ]
    },

    {
        name: "QA Tester",
        aliases: [
            "qa tester",
            "software tester",
            "quality assurance",
            "tester"
        ],
        skills: [
            "testing",
            "qa",
            "test cases",
            "jira",
            "api",
            "sql"
        ]
    },

    {
        name: "IT Support",
        aliases: [
            "it support",
            "it technician",
            "it technik",
            "helpdesk",
            "technical support"
        ],
        skills: [
            "windows",
            "hardware",
            "network",
            "troubleshooting",
            "technical support"
        ]
    },

    {
        name: "System Administrator",
        aliases: [
            "system administrator",
            "sysadmin",
            "system administrator",
            "spravca systemov"
        ],
        skills: [
            "linux",
            "windows server",
            "active directory",
            "network",
            "powershell"
        ]
    },

    {
        name: "Network Administrator",
        aliases: [
            "network administrator",
            "network engineer",
            "sieťový administrátor"
        ],
        skills: [
            "network",
            "cisco",
            "tcp ip",
            "firewall",
            "routing",
            "switching"
        ]
    },

    {
        name: "DevOps Engineer",
        aliases: [
            "devops",
            "devops engineer",
            "devops developer"
        ],
        skills: [
            "docker",
            "kubernetes",
            "linux",
            "git",
            "ci cd",
            "aws",
            "azure"
        ]
    },

    {
        name: "Data Analyst",
        aliases: [
            "data analyst",
            "dátový analytik",
            "datovy analytik"
        ],
        skills: [
            "sql",
            "excel",
            "python",
            "power bi",
            "data analysis"
        ]
    },


    // =====================================================
    // HOSPITALITY / GASTRO
    // =====================================================

    {
        name: "Kuchár",
        aliases: [
            "kuchar",
            "kuchár",
            "cook",
            "chef"
        ],
        skills: [
            "varenie",
            "kuchyňa",
            "potraviny",
            "hygiena"
        ]
    },

    {
        name: "Pomocný kuchár",
        aliases: [
            "pomocny kuchar",
            "pomocný kuchár",
            "kitchen assistant",
            "kitchen helper"
        ],
        skills: [
            "kuchyňa",
            "príprava jedla",
            "hygiena"
        ]
    },

    {
        name: "Čašník",
        aliases: [
            "casnik",
            "čašník",
            "waiter",
            "restaurant waiter"
        ],
        skills: [
            "obsluha",
            "reštaurácia",
            "komunikácia",
            "zákazník"
        ]
    },

    {
        name: "Barman",
        aliases: [
            "barman",
            "bartender"
        ],
        skills: [
            "bar",
            "obsluha",
            "komunikácia",
            "zákazník"
        ]
    },

    {
        name: "Recepčný",
        aliases: [
            "recepcny",
            "recepčný",
            "receptionist",
            "hotel receptionist"
        ],
        skills: [
            "recepcia",
            "komunikácia",
            "angličtina",
            "nemčina",
            "zákazník"
        ]
    },


    // =====================================================
    // RETAIL / SALES
    // =====================================================

    {
        name: "Predavač",
        aliases: [
            "predavac",
            "predavač",
            "sales assistant",
            "shop assistant"
        ],
        skills: [
            "predaj",
            "zákazník",
            "pokladňa",
            "komunikácia"
        ]
    },

    {
        name: "Pokladník",
        aliases: [
            "pokladnik",
            "pokladník",
            "cashier"
        ],
        skills: [
            "pokladňa",
            "zákazník",
            "hotovosť",
            "platba"
        ]
    },

    {
        name: "Obchodný zástupca",
        aliases: [
            "obchodny zastupca",
            "obchodný zástupca",
            "sales representative",
            "sales specialist"
        ],
        skills: [
            "predaj",
            "sales",
            "komunikácia",
            "zákazníci",
            "crm"
        ]
    },

    {
        name: "Account Manager",
        aliases: [
            "account manager",
            "key account manager",
            "key account"
        ],
        skills: [
            "sales",
            "crm",
            "customer relationship",
            "komunikácia",
            "excel"
        ]
    },


    // =====================================================
    // OFFICE / FINANCE / HR
    // =====================================================

    {
        name: "Účtovník",
        aliases: [
            "uctovnik",
            "účtovník",
            "accountant",
            "accounting"
        ],
        skills: [
            "účtovníctvo",
            "excel",
            "fakturácia",
            "mzdy",
            "erp"
        ]
    },

    {
        name: "HR špecialista",
        aliases: [
            "hr specialista",
            "hr špecialista",
            "human resources",
            "hr specialist"
        ],
        skills: [
            "hr",
            "recruitment",
            "nábor",
            "personalistika",
            "komunikácia"
        ]
    },

    {
        name: "Administratívny pracovník",
        aliases: [
            "administrativny pracovnik",
            "administratívny pracovník",
            "administrative worker",
            "office administrator"
        ],
        skills: [
            "administratíva",
            "ms office",
            "excel",
            "word",
            "komunikácia"
        ]
    },

    {
        name: "Asistent",
        aliases: [
            "asistent",
            "assistant",
            "office assistant",
            "administrative assistant"
        ],
        skills: [
            "administratíva",
            "ms office",
            "komunikácia",
            "organizácia"
        ]
    },


    // =====================================================
    // OTHER HIGH-DEMAND / GENERAL
    // =====================================================

    {
        name: "Technický pracovník",
        aliases: [
            "technicky pracovnik",
            "technický pracovník",
            "technical worker",
            "technical operator"
        ],
        skills: [
            "technika",
            "údržba",
            "výroba",
            "technické výkresy"
        ]
    },

    {
        name: "Pracovník údržby",
        aliases: [
            "pracovnik udrzby",
            "pracovník údržby",
            "maintenance worker"
        ],
        skills: [
            "údržba",
            "opravy",
            "mechanika",
            "elektrotechnika"
        ]
    },

    {
        name: "Operátor stroja",
        aliases: [
            "operator stroja",
            "operátor stroja",
            "machine operator",
            "machine worker"
        ],
        skills: [
            "stroj",
            "výroba",
            "obsluha stroja",
            "kontrola kvality"
        ]
    },

    {
        name: "Pracovník kontroly kvality",
        aliases: [
            "pracovnik kontroly kvality",
            "quality control worker",
            "quality inspector"
        ],
        skills: [
            "kontrola kvality",
            "meranie",
            "technické výkresy",
            "kvalita"
        ]
    }

];


// =========================================================
// TEXT NORMALIZATION
// =========================================================

function normalizeJobText(text) {

    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9+#.\s-]/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

}


// =========================================================
// FIND JOBS
// =========================================================

function findJobs(text) {

    const normalizedText = normalizeJobText(text);

    const results = [];

    JOB_DATABASE.forEach(function (job) {

        let found = false;

        const names = [
            job.name,
            ...(job.aliases || [])
        ];

        names.forEach(function (alias) {

            if (
                normalizedText.includes(
                    normalizeJobText(alias)
                )
            ) {

                found = true;

            }

        });

        if (found) {

            results.push(job.name);

        }

    });

    return [...new Set(results)];

}


// =========================================================
// FIND REQUIRED SKILLS
// =========================================================

function findJobSkills(text) {

    const normalizedText = normalizeJobText(text);

    const skills = [];

    JOB_DATABASE.forEach(function (job) {

        const names = [
            job.name,
            ...(job.aliases || [])
        ];

        let jobFound = false;

        names.forEach(function (alias) {

            if (
                normalizedText.includes(
                    normalizeJobText(alias)
                )
            ) {

                jobFound = true;

            }

        });


        if (jobFound) {

            skills.push(
                ...(job.skills || [])
            );

        }

    });


    // Also search for skills directly in the vacancy
    JOB_DATABASE.forEach(function (job) {

        (job.skills || []).forEach(function (skill) {

            const normalizedSkill =
                normalizeJobText(skill);

            if (
                normalizedSkill.length >= 3 &&
                normalizedText.includes(normalizedSkill)
            ) {

                skills.push(skill);

            }

        });

    });


    return [...new Set(skills)];

}


// =========================================================
// GET SKILLS FOR DETECTED JOBS
// =========================================================

function getSkillsForJobs(jobs) {

    const skills = [];

    JOB_DATABASE.forEach(function (job) {

        if (jobs.includes(job.name)) {

            skills.push(
                ...(job.skills || [])
            );

        }

    });

    return [...new Set(skills)];

}


// =========================================================
// GLOBAL EXPORT
// =========================================================

window.JOB_DATABASE = JOB_DATABASE;
window.findJobs = findJobs;
window.findJobSkills = findJobSkills;
window.getSkillsForJobs = getSkillsForJobs;
window.normalizeJobText = normalizeJobText;
