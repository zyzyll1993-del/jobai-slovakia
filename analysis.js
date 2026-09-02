(function () {

    function normalizeText(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }


    function getResumeText() {

        const fields = [
            "name",
            "position",
            "phone",
            "email",
            "city",
            "profile",
            "skills",
            "languages"
        ];

        let parts = [];


        fields.forEach(function (id) {

            const element =
                document.getElementById(id);

            if (element && element.value) {
                parts.push(element.value);
            }

        });


        if (Array.isArray(window.experiences)) {

            window.experiences.forEach(function (experience) {

                parts.push(
                    experience.company || "",
                    experience.position || "",
                    experience.start || "",
                    experience.end || "",
                    experience.description || ""
                );

            });

        }


        if (Array.isArray(window.educations)) {

            window.educations.forEach(function (education) {

                parts.push(
                    education.school || "",
                    education.speciality || "",
                    education.specialty || "",
                    education.year || ""
                );

            });

        }


        return normalizeText(parts.join(" "));

    }


    function uniqueArray(array) {

        return [
            ...new Set(
                array.filter(Boolean)
            )
        ];

    }


    function skillMatchesResume(skill, resumeText) {

        const normalizedSkill =
            normalizeText(skill);

        if (!normalizedSkill) {
            return false;
        }

        return resumeText.includes(
            normalizedSkill
        );

    }


    function createList(items) {

        if (!items || items.length === 0) {

            return "<p>—</p>";

        }


        return `
            <ul>
                ${items.map(function (item) {

                    return `
                        <li>
                            ${escapeHTML(item)}
                        </li>
                    `;

                }).join("")}
            </ul>
        `;

    }


    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function analyzeJob() {

        const jobElement =
            document.getElementById("jobText") ||
            document.getElementById("job");


        const resultElement =
            document.getElementById("analysisResult");


        if (!jobElement || !resultElement) {

            alert(
                "Не знайдено поле вакансії або блок результату."
            );

            return;

        }


        const jobText =
            jobElement.value.trim();


        if (!jobText) {

            resultElement.style.display =
                "block";

            const recommendation =
                document.getElementById(
                    "recommendation"
                );

            if (recommendation) {

                recommendation.innerText =
                    "⚠️ Вставте текст вакансії.";

            }

            return;

        }


        const resumeText =
            getResumeText();


        /* ==========================================
        FIND JOB
        ========================================== */

        let detectedJobs = [];


        if (
            typeof window.findJobs ===
            "function"
        ) {

            detectedJobs =
                window.findJobs(jobText);

        }


        detectedJobs =
            uniqueArray(detectedJobs);


        /* ==========================================
        FIND REQUIRED SKILLS
        ========================================== */

        let requirements = [];


        if (
            typeof window.findJobSkills ===
            "function"
        ) {

            requirements =
                window.findJobSkills(jobText);

        }


        requirements =
            uniqueArray(requirements);


        /* ==========================================
        MATCH SKILLS
        ========================================== */

        let matched = [];

        let missing = [];


        requirements.forEach(function (skill) {

            if (
                skillMatchesResume(
                    skill,
                    resumeText
                )
            ) {

                matched.push(skill);

            } else {

                missing.push(skill);

            }

        });


        /* ==========================================
        SCORE
        ========================================== */

        let score = 0;


        if (requirements.length > 0) {

            score =
                Math.round(
                    matched.length /
                    requirements.length *
                    100
                );

        } else {

            /*
            Якщо база не знайшла навички,
            аналізуємо ключові слова
            */

            const jobWords =
                normalizeText(jobText)
                .split(/\s+/)
                .filter(function (word) {

                    return word.length >= 4;

                });


            const uniqueWords =
                uniqueArray(jobWords);


            let wordMatches = 0;


            uniqueWords.forEach(function (word) {

                if (
                    resumeText.includes(word)
                ) {

                    wordMatches++;

                }

            });


            if (uniqueWords.length > 0) {

                score =
                    Math.round(
                        wordMatches /
                        uniqueWords.length *
                        100
                    );

            } else {

                score = 50;

            }

        }


        /*
        Не дозволяємо значенням бути
        меншими 0 або більшими 100
        */

        score =
            Math.max(
                0,
                Math.min(100, score)
            );


        /* ==========================================
        RECOMMENDATION
        ========================================== */

        let recommendation = "";


        if (score >= 80) {

            recommendation =
                "🟢 Дуже хороша відповідність. Ви маєте більшість необхідних навичок для цієї вакансії.";

        }

        else if (score >= 60) {

            recommendation =
                "🟡 Хороша відповідність. Резюме варто трохи доповнити відсутніми навичками.";

        }

        else if (score >= 40) {

            recommendation =
                "🟠 Часткова відповідність. Рекомендується додати релевантний досвід та навички.";

        }

        else {

            recommendation =
                "🔴 Низька відповідність. Варто адаптувати резюме під цю вакансію.";

        }


        /* ==========================================
        SHOW RESULT
        ========================================== */

        resultElement.style.display =
            "block";


        /* SCORE */

        const scoreElement =
            document.getElementById("score");


        if (scoreElement) {

            scoreElement.innerText =
                score + "%";

        }


        /* PROGRESS */

        const progressBar =
            document.getElementById(
                "progressBar"
            );


        if (progressBar) {

            progressBar.style.width =
                score + "%";

        }


        /* ==========================================
        DETECTED JOB
        ========================================== */

        const detectedElement =
            document.getElementById(
                "detectedJobs"
            );


        if (detectedElement) {

            if (detectedJobs.length > 0) {

                detectedElement.style.display =
                    "block";

                detectedElement.innerHTML = `

                    <strong>
                        🔎 Розпізнана професія:
                    </strong>

                    <p>
                        ${detectedJobs
                            .map(escapeHTML)
                            .join(", ")}
                    </p>

                `;

            } else {

                detectedElement.style.display =
                    "none";

                detectedElement.innerHTML =
                    "";

            }

        }


        /* ==========================================
        FOUND
        ========================================== */

        const foundElement =
            document.getElementById("found");


        if (foundElement) {

            foundElement.innerHTML =
                createList(matched);

        }


        /* ==========================================
        MISSING
        ========================================== */

        const missingElement =
            document.getElementById("missing");


        if (missingElement) {

            missingElement.innerHTML =
                createList(missing);

        }


        /* ==========================================
        RECOMMENDATION
        ========================================== */

        const recommendationElement =
            document.getElementById(
                "recommendation"
            );


        if (recommendationElement) {

            recommendationElement.innerText =
                recommendation;

        }


        /* ==========================================
        SCROLL TO RESULT
        ========================================== */

        setTimeout(function () {

            resultElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }


    /* ==========================================
    EXPORT
    ========================================== */

    window.analyzeJob =
        analyzeJob;


})();
