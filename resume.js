const RESUME_STORAGE_KEY = "jobaiResume";

window.experiences = [];
window.educations = [];

let resumeAutosaveTimer = null;


/* =========================================================
   GET RESUME DATA
========================================================= */

function getResumeData() {

    const getValue = function(id) {

        const element = document.getElementById(id);

        return element ? element.value : "";
    };

    return {

        name: getValue("name"),
        position: getValue("position"),
        phone: getValue("phone"),
        email: getValue("email"),
        city: getValue("city"),
        profile: getValue("profile"),
        skills: getValue("skills"),
        languages: getValue("languages"),

        experiences: Array.isArray(window.experiences)
            ? window.experiences
            : [],

        educations: Array.isArray(window.educations)
            ? window.educations
            : [],

        photo: localStorage.getItem("jobaiPhoto") || ""

    };
}


/* =========================================================
   SAVE RESUME
========================================================= */

function saveResumeData(showMessage = true) {

    const data = getResumeData();

    localStorage.setItem(
        RESUME_STORAGE_KEY,
        JSON.stringify(data)
    );

    if (showMessage) {

        alert(
            "Резюме успішно збережено."
        );

    }

    updateResumePreview();
}


/* =========================================================
   LOAD RESUME
========================================================= */

function loadResumeData() {

    const saved =
        localStorage.getItem(RESUME_STORAGE_KEY);

    if (!saved) {

        window.experiences = [];
        window.educations = [];

        renderExperiences();
        renderEducations();

        displayResumePhoto(
            localStorage.getItem("jobaiPhoto") || ""
        );

        return;
    }

    try {

        const data =
            JSON.parse(saved);

        setResumeData(data);

    } catch (error) {

        console.error(
            "Помилка завантаження резюме:",
            error
        );

    }

}


/* =========================================================
   SET RESUME DATA
========================================================= */

function setResumeData(data) {

    data = data || {};

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

    fields.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.value =
                data[id] || "";

        }

    });


    window.experiences =
        Array.isArray(data.experiences)
            ? data.experiences
            : [];


    window.educations =
        Array.isArray(data.educations)
            ? data.educations
            : [];


    if (data.photo) {

        localStorage.setItem(
            "jobaiPhoto",
            data.photo
        );

    }


    renderExperiences();
    renderEducations();

    displayResumePhoto(
        data.photo ||
        localStorage.getItem("jobaiPhoto") ||
        ""
    );


    setTimeout(function() {

        updateResumePreview();

    }, 50);

}


/* =========================================================
   PHOTO UPLOAD
========================================================= */

function handlePhotoUpload(event) {

    const file =
        event &&
        event.target &&
        event.target.files
            ? event.target.files[0]
            : null;

    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Будь ласка, виберіть зображення."
        );

        return;
    }


    if (file.size > 5 * 1024 * 1024) {

        alert(
            "Фото не повинно перевищувати 5 MB."
        );

        return;
    }


    const reader =
        new FileReader();


    reader.onload = function(e) {

        const photo =
            e.target.result;

        localStorage.setItem(
            "jobaiPhoto",
            photo
        );

        displayResumePhoto(photo);

        saveResumeData(false);

    };


    reader.onerror = function() {

        alert(
            "Не вдалося завантажити фото."
        );

    };


    reader.readAsDataURL(file);

}


/* =========================================================
   DISPLAY PHOTO
========================================================= */

function displayResumePhoto(photo) {

    const preview =
        document.getElementById("photoPreview");

    const placeholder =
        document.getElementById("photoPlaceholder");


    if (!preview) {
        return;
    }


    if (!photo) {

        preview.innerHTML =
            '<span id="photoPlaceholder">Фото не завантажено</span>';

        return;
    }


    preview.innerHTML = `

        <img
            src="${photo}"
            alt="Фото резюме">

    `;


    updateResumePreview();
}


/* =========================================================
   REMOVE PHOTO
========================================================= */

function removeResumePhoto() {

    localStorage.removeItem(
        "jobaiPhoto"
    );


    const input =
        document.getElementById("photoInput");

    if (input) {
        input.value = "";
    }


    displayResumePhoto("");

    saveResumeData(false);

}


/* =========================================================
   ADD EXPERIENCE
========================================================= */

function addExperience(data = {}) {

    window.experiences.push({

        company: data.company || "",
        position: data.position || "",
        start: data.start || "",
        end: data.end || "",
        description: data.description || ""

    });


    renderExperiences();

    saveResumeData(false);

}


/* =========================================================
   REMOVE EXPERIENCE
========================================================= */

function removeExperience(index) {

    if (
        index < 0 ||
        index >= window.experiences.length
    ) {
        return;
    }


    window.experiences.splice(
        index,
        1
    );


    renderExperiences();

    saveResumeData(false);

}


/* =========================================================
   UPDATE EXPERIENCE
========================================================= */

function updateExperience(
    index,
    field,
    value
) {

    if (!window.experiences[index]) {
        return;
    }


    window.experiences[index][field] =
        value;


    saveResumeData(false);

    updateResumePreview();

}


/* =========================================================
   RENDER EXPERIENCES
========================================================= */

function renderExperiences() {

    const container =
        document.getElementById(
            "experienceList"
        );

    if (!container) {
        return;
    }


    if (
        !Array.isArray(window.experiences) ||
        window.experiences.length === 0
    ) {

        container.innerHTML = `
            <p style="color:#7f8a96;">
                Додайте свій досвід роботи.
            </p>
        `;

        return;
    }


    container.innerHTML =
        window.experiences
            .map(function(experience, index) {

                return `

                    <div class="experience-item">

                        <h4>
                            Досвід роботи #${index + 1}
                        </h4>

                        <div class="form-grid">

                            <div class="form-group">

                                <label>
                                    Компанія
                                </label>

                                <input
                                    type="text"
                                    value="${escapeResumeHTML(
                                        experience.company
                                    )}"
                                    oninput="
                                        updateExperience(
                                            ${index},
                                            'company',
                                            this.value
                                        )
                                    ">

                            </div>


                            <div class="form-group">

                                <label>
                                    Посада
                                </label>

                                <input
                                    type="text"
                                    value="${escapeResumeHTML(
                                        experience.position
                                    )}"
                                    oninput="
                                        updateExperience(
                                            ${index},
                                            'position',
                                            this.value
                                        )
                                    ">

                            </div>


                            <div class="form-group">

                                <label>
                                    Початок
                                </label>

                                <input
                                    type="text"
                                    placeholder="01/2023"
                                    value="${escapeResumeHTML(
                                        experience.start
                                    )}"
                                    oninput="
                                        updateExperience(
                                            ${index},
                                            'start',
                                            this.value
                                        )
                                    ">

                            </div>


                            <div class="form-group">

                                <label>
                                    Кінець
                                </label>

                                <input
                                    type="text"
                                    placeholder="12/2025"
                                    value="${escapeResumeHTML(
                                        experience.end
                                    )}"
                                    oninput="
                                        updateExperience(
                                            ${index},
                                            'end',
                                            this.value
                                        )
                                    ">

                            </div>


                            <div class="form-group full">

                                <label>
                                    Опис роботи
                                </label>

                                <textarea
                                    oninput="
                                        updateExperience(
                                            ${index},
                                            'description',
                                            this.value
                                        )
                                    ">${escapeResumeHTML(
                                        experience.description
                                    )}</textarea>

                            </div>

                        </div>


                        <div class="actions">

                            <button
                                class="btn danger"
                                type="button"
                                onclick="
                                    removeExperience(${index})
                                ">

                                Видалити

                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   ADD EDUCATION
========================================================= */

function addEducation(data = {}) {

    window.educations.push({

        school: data.school || "",
        speciality:
            data.speciality ||
            data.specialty ||
            "",
        year: data.year || ""

    });


    renderEducations();

    saveResumeData(false);

}


/* =========================================================
   REMOVE EDUCATION
========================================================= */

function removeEducation(index) {

    if (
        index < 0 ||
        index >= window.educations.length
    ) {
        return;
    }


    window.educations.splice(
        index,
        1
    );


    renderEducations();

    saveResumeData(false);

}


/* =========================================================
   UPDATE EDUCATION
========================================================= */

function updateEducation(
    index,
    field,
    value
) {

    if (!window.educations[index]) {
        return;
    }


    window.educations[index][field] =
        value;


    saveResumeData(false);

    updateResumePreview();

}


/* =========================================================
   RENDER EDUCATION
========================================================= */

function renderEducations() {

    const container =
        document.getElementById(
            "educationList"
        );

    if (!container) {
        return;
    }


    if (
        !Array.isArray(window.educations) ||
        window.educations.length === 0
    ) {

        container.innerHTML = `
            <p style="color:#7f8a96;">
                Додайте освіту.
            </p>
        `;

        return;
    }


    container.innerHTML =
        window.educations
            .map(function(education, index) {

                return `

                    <div class="education-item">

                        <h4>
                            Освіта #${index + 1}
                        </h4>

                        <div class="form-grid">

                            <div class="form-group">

                                <label>
                                    Навчальний заклад
                                </label>

                                <input
                                    type="text"
                                    value="${escapeResumeHTML(
                                        education.school
                                    )}"
                                    oninput="
                                        updateEducation(
                                            ${index},
                                            'school',
                                            this.value
                                        )
                                    ">

                            </div>


                            <div class="form-group">

                                <label>
                                    Спеціальність
                                </label>

                                <input
                                    type="text"
                                    value="${escapeResumeHTML(
                                        education.speciality
                                    )}"
                                    oninput="
                                        updateEducation(
                                            ${index},
                                            'speciality',
                                            this.value
                                        )
                                    ">

                            </div>


                            <div class="form-group">

                                <label>
                                    Рік
                                </label>

                                <input
                                    type="text"
                                    placeholder="2024"
                                    value="${escapeResumeHTML(
                                        education.year
                                    )}"
                                    oninput="
                                        updateEducation(
                                            ${index},
                                            'year',
                                            this.value
                                        )
                                    ">

                            </div>

                        </div>


                        <div class="actions">

                            <button
                                class="btn danger"
                                type="button"
                                onclick="
                                    removeEducation(${index})
                                ">

                                Видалити

                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   UPDATE RESUME PREVIEW
========================================================= */

function updateResumePreview() {

    const preview =
        document.getElementById(
            "resumePreview"
        );

    if (!preview) {
        return;
    }


    const getValue = function(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value
            : "";

    };


    const name =
        getValue("name") ||
        "Ваше ім'я";


    const position =
        getValue("position") ||
        "Бажана посада";


    const phone =
        getValue("phone");


    const email =
        getValue("email");


    const city =
        getValue("city");


    const profile =
        getValue("profile");


    const skills =
        getValue("skills");


    const languages =
        getValue("languages");


    const previewName =
        document.getElementById(
            "previewName"
        );

    if (previewName) {
        previewName.textContent =
            name;
    }


    const previewPosition =
        document.getElementById(
            "previewPosition"
        );

    if (previewPosition) {
        previewPosition.textContent =
            position;
    }


    const previewContact =
        document.getElementById(
            "previewContact"
        );

    if (previewContact) {

        const contactParts = [
            phone,
            email,
            city
        ].filter(Boolean);

        previewContact.textContent =
            contactParts.length
                ? contactParts.join(" · ")
                : "Телефон · Email · Місто";

    }


    const previewProfile =
        document.getElementById(
            "previewProfile"
        );

    if (previewProfile) {

        previewProfile.textContent =
            profile || "—";

    }


    const previewLanguages =
        document.getElementById(
            "previewLanguages"
        );

    if (previewLanguages) {

        previewLanguages.textContent =
            languages || "—";

    }


    renderPreviewSkills(
        skills
    );


    renderPreviewExperience();

    renderPreviewEducation();

    renderPreviewPhoto();

}


/* =========================================================
   PREVIEW SKILLS
========================================================= */

function renderPreviewSkills(skills) {

    const container =
        document.getElementById(
            "previewSkills"
        );

    if (!container) {
        return;
    }


    if (!skills.trim()) {

        container.innerHTML =
            "—";

        return;
    }


    const items =
        skills
            .split(/[,;\n]+/)
            .map(function(skill) {
                return skill.trim();
            })
            .filter(Boolean);


    container.innerHTML =
        items
            .map(function(skill) {

                return `
                    <span class="resume-skill">
                        ${escapeResumeHTML(skill)}
                    </span>
                `;

            })
            .join("");

}


/* =========================================================
   PREVIEW EXPERIENCE
========================================================= */

function renderPreviewExperience() {

    const container =
        document.getElementById(
            "previewExperience"
        );

    if (!container) {
        return;
    }


    if (
        !Array.isArray(window.experiences) ||
        window.experiences.length === 0
    ) {

        container.innerHTML =
            "—";

        return;
    }


    container.innerHTML =
        window.experiences
            .filter(function(experience) {

                return (
                    experience.company ||
                    experience.position ||
                    experience.description
                );

            })
            .map(function(experience) {

                const dates = [
                    experience.start,
                    experience.end
                ]
                .filter(Boolean)
                .join(" – ");


                return `

                    <div class="resume-item">

                        <strong>
                            ${escapeResumeHTML(
                                experience.position ||
                                "Посада"
                            )}
                        </strong>

                        <span>
                            ${escapeResumeHTML(
                                experience.company ||
                                ""
                            )}

                            ${
                                dates
                                    ? " · " +
                                      escapeResumeHTML(
                                          dates
                                      )
                                    : ""
                            }

                        </span>

                        ${
                            experience.description
                                ? `
                                    <p>
                                        ${escapeResumeHTML(
                                            experience.description
                                        )}
                                    </p>
                                  `
                                : ""
                        }

                    </div>

                `;

            })
            .join("") || "—";

}


/* =========================================================
   PREVIEW EDUCATION
========================================================= */

function renderPreviewEducation() {

    const container =
        document.getElementById(
            "previewEducation"
        );

    if (!container) {
        return;
    }


    if (
        !Array.isArray(window.educations) ||
        window.educations.length === 0
    ) {

        container.innerHTML =
            "—";

        return;
    }


    container.innerHTML =
        window.educations
            .filter(function(education) {

                return (
                    education.school ||
                    education.speciality ||
                    education.year
                );

            })
            .map(function(education) {

                return `

                    <div class="resume-item">

                        <strong>
                            ${escapeResumeHTML(
                                education.speciality ||
                                "Спеціальність"
                            )}
                        </strong>

                        <span>
                            ${escapeResumeHTML(
                                education.school ||
                                ""
                            )}

                            ${
                                education.year
                                    ? " · " +
                                      escapeResumeHTML(
                                          education.year
                                      )
                                    : ""
                            }

                        </span>

                    </div>

                `;

            })
            .join("") || "—";

}


/* =========================================================
   PREVIEW PHOTO
========================================================= */

function renderPreviewPhoto() {

    const container =
        document.getElementById(
            "previewPhotoContainer"
        );

    if (!container) {
        return;
    }


    const photo =
        localStorage.getItem(
            "jobaiPhoto"
        );


    if (!photo) {

        container.innerHTML =
            "";

        return;
    }


    container.innerHTML = `

        <img
            class="resume-photo"
            src="${photo}"
            alt="Фото">

    `;

}


/* =========================================================
   EXPORT JSON
========================================================= */

function exportResumeJSON() {

    const data =
        getResumeData();


    const json =
        JSON.stringify(
            data,
            null,
            2
        );


    const blob =
        new Blob(
            [json],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "jobai-resume.json";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


/* =========================================================
   IMPORT JSON
========================================================= */

function importResumeJSON(event) {

    const file =
        event &&
        event.target &&
        event.target.files
            ? event.target.files[0]
            : null;


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = function(e) {

        try {

            const data =
                JSON.parse(
                    e.target.result
                );


            if (
                !data ||
                typeof data !== "object"
            ) {

                throw new Error(
                    "Invalid JSON"
                );

            }


            setResumeData(data);

            saveResumeData(false);


            alert(
                "Резюме успішно імпортовано."
            );


        } catch (error) {

            console.error(error);

            alert(
                "Помилка імпорту JSON."
            );

        }

    };


    reader.onerror = function() {

        alert(
            "Не вдалося прочитати файл."
        );

    };


    reader.readAsText(file);

}


/* =========================================================
   CLEAR RESUME
========================================================= */

function clearResumeData() {

    const confirmed =
        confirm(
            "Ви впевнені, що хочете очистити все резюме?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        RESUME_STORAGE_KEY
    );

    localStorage.removeItem(
        "jobaiPhoto"
    );


    window.experiences = [];

    window.educations = [];


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


    fields.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }

    });


    const photoInput =
        document.getElementById(
            "photoInput"
        );

    if (photoInput) {
        photoInput.value = "";
    }


    renderExperiences();

    renderEducations();

    displayResumePhoto("");

    updateResumePreview();


    alert(
        "Резюме очищено."
    );

}


/* =========================================================
   AUTOSAVE
========================================================= */

function enableResumeAutosave() {

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


    fields.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }


        element.addEventListener(
            "input",
            function() {

                clearTimeout(
                    resumeAutosaveTimer
                );


                resumeAutosaveTimer =
                    setTimeout(
                        function() {

                            saveResumeData(
                                false
                            );

                        },
                        500
                    );

            }
        );

    });

}


/* =========================================================
   INITIALIZE MODULE
========================================================= */

function initResumeModule() {

    if (!Array.isArray(window.experiences)) {
        window.experiences = [];
    }


    if (!Array.isArray(window.educations)) {
        window.educations = [];
    }


    renderExperiences();

    renderEducations();


    const photo =
        localStorage.getItem(
            "jobaiPhoto"
        );


    if (photo) {
        displayResumePhoto(photo);
    }

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeResumeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   GLOBAL EXPORTS
========================================================= */

window.getResumeData =
    getResumeData;

window.saveResumeData =
    saveResumeData;

window.loadResumeData =
    loadResumeData;

window.setResumeData =
    setResumeData;

window.handlePhotoUpload =
    handlePhotoUpload;

window.displayResumePhoto =
    displayResumePhoto;

window.removeResumePhoto =
    removeResumePhoto;

window.addExperience =
    addExperience;

window.removeExperience =
    removeExperience;

window.updateExperience =
    updateExperience;

window.renderExperiences =
    renderExperiences;

window.addEducation =
    addEducation;

window.removeEducation =
    removeEducation;

window.updateEducation =
    updateEducation;

window.renderEducations =
    renderEducations;

window.updateResumePreview =
    updateResumePreview;

window.exportResumeJSON =
    exportResumeJSON;

window.importResumeJSON =
    importResumeJSON;

window.clearResumeData =
    clearResumeData;

window.enableResumeAutosave =
    enableResumeAutosave;

window.initResumeModule =
    initResumeModule;
