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
            "profile",
            "skills",
            "languages"
        ];

        let parts = [];

        fields.forEach(function (id) {
            const element = document.getElementById(id);

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
                    education.specialty || "",
                    education.year || ""
                );

            });

        }

        return parts.join(" ");
    }


    function uniqueArray(array) {

        return [...new Set(
            array.filter(Boolean)
        )];

    }


    function skillMatchesResume(skill, resumeText) {

        const normalizedSkill = normalizeText(skill);

        if (!normalizedSkill) {
            return false;
        }

        return resumeText.includes(normalizedSkill);
    }


    function analyzeJob() {

        const jobElement = document.getElementById("jobText");

        const resultElement = document.getElementById("analysisResult");

        if (!jobElement || !resultElement) {
            return;
        }

        const jobText = jobElement.value.trim();

        if (!jobText) {

            resultElement.innerHTML =
                "⚠️ Вставте текст вакансії.";

            return;
        }


        const resumeText = normalizeText(
            getResumeText()
        );


        let requirements = [];

        if (typeof findJobSkills === "function") {

            requirements = findJobSkills(jobText);

        }


        requirements = uniqueArray(requirements);


        let detectedJobs = [];

        if (typeof findJobs === "function") {

            detectedJobs = findJobs(jobText);

        }


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


        let score = 0;

        if (requirements.length > 0) {

            score = Math.round(
                matched.length /
                requirements.length *
                100
            );

        } else {

            score = 50;

        }


        let recommendation = "";


        if (score >= 80) {

            recommendation =
                "🟢 Дуже хороша відповідність вакансії.";

        } else if (score >= 60) {

            recommendation =
                "🟡 Хороша відповідність, але варто доповнити резюме.";

        } else if (score >= 40) {

            recommendation =
                "🟠 Часткова відповідність. Рекомендується додати відсутні навички.";

        } else {

            recommendation =
                "🔴 Низька відповідність вакансії.";

        }


        let jobsHTML = "";

        if (detectedJobs.length > 0) {

            jobsHTML = `
                <div style="margin-bottom:15px;">
                    <strong>🔎 Розпізнана професія:</strong><br>
                    ${detectedJobs.join(", ")}
                </div>
            `;

        }


        let matchedHTML = "";

        if (matched.length > 0) {

            matchedHTML = `
                <div style="margin-top:15px;">
                    <strong>✅ Є в резюме:</strong>
                    <ul>
                        ${matched.map(function (skill) {
                            return `<li>${skill}</li>`;
                        }).join("")}
                    </ul>
                </div>
            `;

        }


        let missingHTML = "";

        if (missing.length > 0) {

            missingHTML = `
                <div style="margin-top:15px;">
                    <strong>❌ Варто додати:</strong>
                    <ul>
                        ${missing.map(function (skill) {
                            return `<li>${skill}</li>`;
                        }).join("")}
                    </ul>
                </div>
            `;

        }


        resultElement.innerHTML = `

            ${jobsHTML}

            <div style="font-size:24px; font-weight:bold; margin:10px 0;">
                ${score}%
            </div>

            <div style="
                background:#e5e7eb;
                border-radius:10px;
                height:14px;
                overflow:hidden;
                margin-bottom:15px;
            ">

                <div style="
                    width:${score}%;
                    height:100%;
                    background:#2563eb;
                "></div>

            </div>

            <div>
                ${recommendation}
            </div>

            ${matchedHTML}

            ${missingHTML}

        `;

    }


    window.analyzeJob = analyzeJob;

})();
