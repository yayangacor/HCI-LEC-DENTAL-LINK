const patients = [
    {
        initial: "SC",
        name: "Sarah Connor",
        gender: "Perempuan",
        age: "28 Tahun",
        phone: "+62 812-3456-7890",
        visit: "12 Okt 2023",
        condition: "Hipersensitivitas",
        style: "badge-orange"
    },
    {
        initial: "JD",
        name: "John Doe",
        gender: "Laki-laki",
        age: "34 Tahun",
        phone: "+62 812-3456-7891",
        visit: "15 Okt 2023",
        condition: "Sehat",
        style: "badge-blue"
    },
    {
        initial: "MR",
        name: "Mike Ross",
        gender: "Laki-laki",
        age: "26 Tahun",
        phone: "+62 812-3456-7892",
        visit: "18 Okt 2023",
        condition: "Hipersensitivitas",
        style: "badge-orange"
    },
    {
        initial: "RZ",
        name: "Rachel Zane",
        gender: "Perempuan",
        age: "31 Tahun",
        phone: "+62 812-3456-7893",
        visit: "20 Okt 2023",
        condition: "Sehat",
        style: "badge-blue"
    },
    {
        initial: "BC",
        name: "Barbara Cooper",
        gender: "Perempuan",
        age: "41 Tahun",
        phone: "+62 812-3456-7894",
        visit: "23 Okt 2023",
        condition: "Diabetes",
        style: "badge-red"
    },
    {
        initial: "WA",
        name: "Will Abbott",
        gender: "Laki-laki",
        age: "38 Tahun",
        phone: "+62 812-3456-7895",
        visit: "25 Okt 2023",
        condition: "Sehat",
        style: "badge-blue"
    }
];

const patientList = document.getElementById("patients-list");

patientList.innerHTML = patients.map(patient => `
    <tr>
        <td>
            <div class="patient-info">
                <div class="patient-avatar">
                    ${patient.initial}
                </div>
                <div>
                    <p class="patient-name">${patient.name}</p>
                    <p class="patient-meta">
                        ${patient.gender} • ${patient.age}
                    </p>
                </div>
            </div>
        </td>
        <td class="td-contact">
            ${patient.phone}
        </td>
        <td class="td-visit">
            ${patient.visit}
        </td>
        <td>
            <span class="condition-badge ${patient.style}">
                ${patient.condition}
            </span>
        </td>
        <td class="text-right">
            <button class="action-btn">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
        </td>
    </tr>
`).join("");