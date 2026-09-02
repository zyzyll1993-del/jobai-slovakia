/*
=========================================================
 JobAI Slovakia — Resume module
 Фото + збереження резюме
=========================================================
*/

const RESUME_STORAGE_KEY = "jobaiResume";


// =========================================================
// GET RESUME DATA
// =========================================================

function getResumeData() {

    return {

        name: document.getElementById("name")?.value || "",
        position: document.getElementById("position")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        email: document.getElementById("email")?.value || "",
        city: document.getElementById("city")?.value || "",
        profile: document.getElementById("profile")?.value || "",
        skills: document.getElementById("skills")?.value || "",
        languages: document.getElementById("languages")?.value || "",

        experiences: window.experiences || [],
        educations: window.educations || [],

        photo: localStorage.getItem("jobaiPhoto") || ""

    };

}


// =========================================================
// SAVE RESUME
// =========================================================

function saveResumeData(showMessage = true) {

    const data = getResumeData();

    localStorage.setItem(
        RESUME_STORAGE_KEY,
        JSON.stringify(data)
    );

    if (showMessage) {

        alert("✅ Резюме збережено");

    }

}


// =========================================================
// LOAD RESUME
// =========================================================

function loadResumeData() {

    const saved =
        localStorage.getItem(
            RESUME_STORAGE_KEY
        );

    if (!saved) {
        return;
    }

    try {

        const data = JSON.parse(saved);

        setResumeData(data);

    } catch (error) {

        console.error(
            "Помилка завантаження резюме:",
            error
        );

    }

}


// =========================================================
// SET RESUME DATA
// =========================================================

function setResumeData(data) {

    if (!data) {
        return;
    }


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


    fields.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (
            element &&
            data[id] !== undefined
        ) {

            element.value = data[id];

        }

    });


    if (Array.isArray(data.experiences)) {

        window.experiences =
            data.experiences;

    }


    if (Array.isArray(data.educations)) {

        window.educations =
            data.educations;

    }


    if (data.photo) {

        localStorage.setItem(
            "jobaiPhoto",
            data.photo
        );

        displayResumePhoto(
            data.photo
        );

    }


    if (typeof renderExperiences === "function") {
        renderExperiences();
    }

    if (typeof renderEducation === "function") {
        renderEducation();
    }

    if (typeof updateCV === "function") {
        updateCV();
    }

}


// =========================================================
// PHOTO UPLOAD
// =========================================================

function handlePhotoUpload(event) {

    const file =
        event.target.files?.[0];

    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert("❌ Будь ласка, виберіть зображення.");

        return;

    }


    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "❌ Фото завелике. Максимальний розмір — 5 MB."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload = function (e) {

        const photo =
            e.target.result;


        localStorage.setItem(
            "jobaiPhoto",
            photo
        );


        displayResumePhoto(photo);


        if (typeof updateCV === "function") {

            updateCV();

        }

    };


    reader.readAsDataURL(file);

}


// =========================================================
// DISPLAY PHOTO
// =========================================================

function displayResumePhoto(photo) {

    const preview =
        document.getElementById(
            "photoPreview"
        );

    const image =
        document.getElementById(
            "resumePhoto"
        );


    if (image) {

        image.src = photo;
        image.style.display = "block";

    }


    if (preview) {

        preview.style.display = "block";

    }

}


// =========================================================
// REMOVE PHOTO
// =========================================================

function removeResumePhoto() {

    localStorage.removeItem(
        "jobaiPhoto"
    );


    const image =
        document.getElementById(
            "resumePhoto"
        );


    const preview =
        document.getElementById(
            "photoPreview"
        );


    if (image) {

        image.src = "";
        image.style.display = "none";

    }


    if (preview) {

        preview.style.display = "none";

    }


    if (typeof updateCV === "function") {

        updateCV();

    }

}


// =========================================================
// EXPORT JSON
// =========================================================

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

    link.remove();


    URL.revokeObjectURL(url);

}


// =========================================================
// IMPORT JSON
// =========================================================

function importResumeJSON(event) {

    const file =
        event.target.files?.[0];

    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = function (e) {

        try {

            const data =
                JSON.parse(
                    e.target.result
                );


            setResumeData(data);

            saveResumeData(false);


            alert(
                "✅ Резюме імпортовано"
            );


        } catch (error) {

            alert(
                "❌ Невірний файл резюме."
            );

        }

    };


    reader.readAsText(file);

}


// =========================================================
// CLEAR RESUME
// =========================================================

function clearResumeData() {

    const confirmed =
        confirm(
            "Очистити все резюме та фото?"
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


    location.reload();

}


// =========================================================
// AUTOSAVE
// =========================================================

function enableResumeAutosave() {

    const ids = [
        "name",
        "position",
        "phone",
        "email",
        "city",
        "profile",
        "skills",
        "languages"
    ];


    ids.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.addEventListener(
            "input",
            function () {

                saveResumeData(false);

            }
        );

    });

}


// =========================================================
// INITIALIZATION
// =========================================================

function initResumeModule() {

    loadResumeData();

    enableResumeAutosave();


    const photo =
        localStorage.getItem(
            "jobaiPhoto"
        );


    if (photo) {

        displayResumePhoto(photo);

    }

}


document.addEventListener(
    "DOMContentLoaded",
    initResumeModule
);


// =========================================================
// GLOBAL FUNCTIONS
// =========================================================

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

window.exportResumeJSON =
    exportResumeJSON;

window.importResumeJSON =
    importResumeJSON;

window.clearResumeData =
    clearResumeData;
