(function () {

    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }


    function getSearchData() {

        let position = getValue("jobSearchPosition");
        let city = getValue("jobSearchCity");
        let keywords = getValue("jobSearchKeywords");

        if (!position) {
            position = getValue("position");
        }

        if (!city) {
            city = getValue("city");
        }

        const query = [
            position,
            city,
            keywords
        ]
        .filter(Boolean)
        .join(" ");

        return {
            position: position,
            city: city,
            keywords: keywords,
            query: query
        };
    }


    function useResumeForJobSearch() {

        const position = getValue("position");
        const city = getValue("city");

        const positionField =
            document.getElementById("jobSearchPosition");

        const cityField =
            document.getElementById("jobSearchCity");

        if (positionField) {
            positionField.value = position;
        }

        if (cityField) {
            cityField.value = city;
        }
    }


    function createSearchUrl(base, query) {

        return base + encodeURIComponent(query);
    }


    function searchJobs() {

        const data = getSearchData();

        if (!data.query) {

            alert(
                "Вкажіть професію, місто або ключові слова."
            );

            return;
        }


        const results =
            document.getElementById("jobSearchResults");

        if (!results) {
            return;
        }


        const googleBase =
            "https://www.google.com/search?q=";


        const profQuery =
            encodeURIComponent(
                "site:profesia.sk/praca/ " +
                data.query
            );


        const stateQuery =
            encodeURIComponent(
                "site:sluzbyzamestnanosti.gov.sk/pracovne-ponuky " +
                data.query
            );


        const linkedinQuery =
            encodeURIComponent(
                "site:linkedin.com/jobs/view/ " +
                data.query
            );


        const profesiaUrl =
            googleBase + profQuery;


        const stateUrl =
            googleBase + stateQuery;


        const linkedinUrl =
            googleBase + linkedinQuery;


        results.innerHTML = `

            <div class="job-source-card">

                <h3>Profesia</h3>

                <p>
                    Актуальні вакансії зі словацького
                    порталу Profesia.
                </p>

                <a
                    class="primary source-button"
                    href="${profesiaUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Знайти вакансії
                </a>

            </div>


            <div class="job-source-card">

                <h3>Služby zamestnanosti</h3>

                <p>
                    Офіційні вакансії через державний
                    портал Словаччини.
                </p>

                <a
                    class="primary source-button"
                    href="${stateUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Знайти вакансії
                </a>

            </div>


            <div class="job-source-card">

                <h3>LinkedIn Jobs</h3>

                <p>
                    Пошук вакансій від роботодавців
                    та рекрутерів.
                </p>

                <a
                    class="primary source-button"
                    href="${linkedinUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Знайти вакансії
                </a>

            </div>


            <div class="job-source-card">

                <h3>Ваш запит</h3>

                <p>
                    <strong>Професія:</strong>
                    ${escapeHTML(data.position || "—")}
                </p>

                <p>
                    <strong>Місто:</strong>
                    ${escapeHTML(data.city || "—")}
                </p>

                <p>
                    <strong>Ключові слова:</strong>
                    ${escapeHTML(data.keywords || "—")}
                </p>

            </div>

        `;

        results.style.display = "grid";

    }


    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    window.searchJobs =
        searchJobs;

    window.useResumeForJobSearch =
        useResumeForJobSearch;

})();
