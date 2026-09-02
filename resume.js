/* =====================================================
   JobAI Slovakia — RESUME MODULE v0.6
   Збереження / імпорт / експорт резюме
   ===================================================== */


/* =====================================================
   ОТРИМАННЯ ДАНИХ РЕЗЮМЕ
   ===================================================== */

function getResumeData() {

  return {

    name:
      document.getElementById("name")?.value || "",

    position:
      document.getElementById("position")?.value || "",

    phone:
      document.getElementById("phone")?.value || "",

    email:
      document.getElementById("email")?.value || "",

    city:
      document.getElementById("city")?.value || "",

    profile:
      document.getElementById("profile")?.value || "",

    skills:
      document.getElementById("skills")?.value || "",

    languages:
      document.getElementById("languages")?.value || "",

    experiences:
      typeof experiences !== "undefined"
        ? experiences
        : [],

    educations:
      typeof educations !== "undefined"
        ? educations
        : [],

    exportedAt:
      new Date().toISOString(),

    version:
      "0.6"

  };

}


/* =====================================================
   ЗБЕРЕЖЕННЯ В LOCAL STORAGE
   ===================================================== */

function saveResumeData(showMessage = true) {

  const data =
    getResumeData();

  localStorage.setItem(
    "jobaiResume",
    JSON.stringify(data)
  );

  if(showMessage){

    const message =
      currentLanguage === "sk"
        ? "✅ Životopis bol uložený."
        : currentLanguage === "en"
          ? "✅ Resume saved."
          : "✅ Резюме збережено.";

    alert(message);

  }

}


/* =====================================================
   ЗАВАНТАЖЕННЯ З LOCAL STORAGE
   ===================================================== */

function loadResumeData() {

  const saved =
    localStorage.getItem(
      "jobaiResume"
    );

  if(!saved){
    return false;
  }

  try {

    const data =
      JSON.parse(saved);

    setResumeData(data);

    return true;

  }

  catch(error){

    console.error(
      "JobAI: помилка завантаження резюме",
      error
    );

    return false;

  }

}


/* =====================================================
   ЗАПОВНЕННЯ ФОРМИ
   ===================================================== */

function setResumeData(data) {

  if(!data){
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


  fields.forEach(field => {

    const element =
      document.getElementById(field);

    if(element){

      element.value =
        data[field] || "";

    }

  });


  if(
    typeof experiences !== "undefined"
  ){

    experiences =
      Array.isArray(data.experiences)
        ? data.experiences
        : [];

  }


  if(
    typeof educations !== "undefined"
  ){

    educations =
      Array.isArray(data.educations)
        ? data.educations
        : [];

  }


  if(
    typeof renderExperiences === "function"
  ){

    renderExperiences();

  }


  if(
    typeof renderEducation === "function"
  ){

    renderEducation();

  }


  if(
    typeof updateCV === "function"
  ){

    updateCV();

  }

}


/* =====================================================
   ЕКСПОРТ JSON
   ===================================================== */

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
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;


  const name =
    data.name
      ? data.name
          .replace(/[^a-z0-9а-яіїєґ_-]/gi,"_")
      : "JobAI_Resume";


  link.download =
    name + "_resume.json";


  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);


  showExportMessage();

}


/* =====================================================
   ІМПОРТ JSON
   ===================================================== */

function importResumeJSON(event) {

  const file =
    event.target.files[0];


  if(!file){
    return;
  }


  const reader =
    new FileReader();


  reader.onload =
    function(e){

      try {

        const data =
          JSON.parse(
            e.target.result
          );


        setResumeData(data);


        saveResumeData(false);


        const message =
          currentLanguage === "sk"
            ? "✅ Životopis bol importovaný."
            : currentLanguage === "en"
              ? "✅ Resume imported."
              : "✅ Резюме імпортовано.";


        alert(message);

      }

      catch(error){

        alert(
          currentLanguage === "sk"
            ? "❌ Súbor JSON je neplatný."
            : currentLanguage === "en"
              ? "❌ Invalid JSON file."
              : "❌ Неправильний JSON-файл."
        );

      }

    };


  reader.readAsText(file);


  /*
     Дозволяє повторно вибрати
     той самий файл
  */

  event.target.value = "";

}


/* =====================================================
   ПОВІДОМЛЕННЯ
   ===================================================== */

function showExportMessage(){

  const message =
    currentLanguage === "sk"
      ? "✅ Životopis bol exportovaný."
      : currentLanguage === "en"
        ? "✅ Resume exported."
        : "✅ Резюме експортовано.";

  alert(message);

}


/* =====================================================
   ОЧИЩЕННЯ РЕЗЮМЕ
   ===================================================== */

function clearResumeData(){

  const question =
    currentLanguage === "sk"
      ? "Naozaj chcete vymazať životopis?"
      : currentLanguage === "en"
        ? "Are you sure you want to delete the resume?"
        : "Ви точно хочете видалити резюме?";


  if(!confirm(question)){
    return;
  }


  localStorage.removeItem(
    "jobaiResume"
  );


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


  fields.forEach(field => {

    const element =
      document.getElementById(field);

    if(element){

      element.value = "";

    }

  });


  if(typeof experiences !== "undefined"){

    experiences = [];

  }


  if(typeof educations !== "undefined"){

    educations = [];

  }


  if(
    typeof renderExperiences === "function"
  ){

    renderExperiences();

  }


  if(
    typeof renderEducation === "function"
  ){

    renderEducation();

  }


  if(
    typeof updateCV === "function"
  ){

    updateCV();

  }


  alert(
    currentLanguage === "sk"
      ? "🗑️ Životopis bol vymazaný."
      : currentLanguage === "en"
        ? "🗑️ Resume deleted."
        : "🗑️ Резюме видалено."
  );

}


/* =====================================================
   АВТОЗБЕРЕЖЕННЯ
   ===================================================== */

function enableResumeAutosave(){

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


  fields.forEach(field => {

    const element =
      document.getElementById(field);


    if(element){

      element.addEventListener(
        "input",
        function(){

          saveResumeData(false);

        }
      );

    }

  });

}


/* =====================================================
   ІНІЦІАЛІЗАЦІЯ
   ===================================================== */

function initResumeModule(){

  loadResumeData();

  enableResumeAutosave();

}


document.addEventListener(
  "DOMContentLoaded",
  initResumeModule
);
