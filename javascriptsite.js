
/*
Carrosel
1º Criar a constante buttons
2º ForEach button adicionar um eventlistener com tipo "click"
3º Direção das imagens, +1 (direita/next) -1 (esquerda/prev)
4º Criar a lista das imagens que se encontram no carrosel
5º Atribuir  o data-active na imagem que está a ser mostrada no carrosel
6º Calcular próximo indice do array
7º Trocar o estado ativo para a próxima imagem

PASSO 6 - GEMINI UTILIZADO
 */

const buttons = document.querySelectorAll(  "[data-carrosel-button]");

buttons.forEach(button => { // Passo 2 - ForEach + EventListener
    button.addEventListener("click",() => {
        const direcao = button.dataset.carroselButton === "next" ? 1 : -1; //Passo 3 - Constante direcao criada para saber a proxima imagem
        // ? 1 : -1 é como um if-else statement (video yt)

        const imagens = button.closest("[data-carrosel]").querySelector( "[data-imagens]" ); // Passo 4

        const imagem_ativa = imagens.querySelector("[data-active]") // Passo 5

        let newIndex = [...imagens.children].indexOf(imagem_ativa) + direcao;

        if (newIndex < 0) newIndex = imagens.children.length - 1;
        if (newIndex >= imagens.children.length) newIndex = 0;

        imagens.children[newIndex].dataset.active = true; // Passo 7
        delete imagem_ativa.dataset.active; // Retirar o data-active da imagem que estava a ser mostrada
    })


})

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const telInput = document.getElementById('telefone');
    const extraFields = document.getElementById('extra-fields');
    const emailError = document.getElementById('email-error');
    const telError = document.getElementById('tel-error');
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        alert("Mensagem enviada com sucesso!");

        contactForm.reset();

        extraFields.classList.remove('show');

        extraFields.style.display = 'none';


        const inputs = contactForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('input-success', 'input-error');
            input.style.borderColor = 'var(--border)';
        });
    });


    const dominiosPermitidos = [
        "gmail.com",
        "outlook.com",
        "hotmail.com",
        "icloud.com",
        "uac.pt",
        "sapo.pt"
    ];

    function validarFormulario() {
        const emailValue = emailInput.value.trim().toLowerCase();
        const telValue = telInput.value.trim().replace(/\s/g, '');

        let isEmailValid = false;


        if (emailValue.includes("@")) {
            const partes = emailValue.split("@");
            const usuario = partes[0];
            const dominio = partes[1];


            if (usuario.length > 0 && dominiosPermitidos.includes(dominio)) {
                isEmailValid = true;
            }
        }

        const isTelValid = /^(\+351)?(9[1236]\d{7}|2\d{8})$/.test(telValue);

        // Feedback do Email
        if (emailValue.length > 0) {
            if (!isEmailValid) {
                emailError.textContent = "Domínio não permitido (use gmail, outlook, uac.pt, etc)";
                emailError.style.display = 'block';
                emailInput.style.borderColor = '#ff4d4d';
            } else {
                emailError.style.display = 'none';
                emailInput.style.borderColor = '#279B7A';
            }
        }


        if (telValue.length > 0) {
            telError.style.display = isTelValid ? 'none' : 'block';
            telInput.style.borderColor = isTelValid ? '#279B7A' : '#ff4d4d';
        }


        if (isEmailValid && isTelValid) {
            extraFields.style.display = 'block';
            setTimeout(() => extraFields.style.opacity = '1', 10);
        } else {
            extraFields.style.opacity = '0';
            setTimeout(() => {
                if (extraFields.style.opacity === '0') extraFields.style.display = 'none';
            }, 500);
        }
    }

    emailInput.addEventListener('input', validarFormulario);
    telInput.addEventListener('input', validarFormulario);
});

function criarGraficoD3() {
    const container = document.getElementById("d3-investigacao");
    const tooltip = document.getElementById("tooltip-caca");
    if (!container || !tooltip) return;
    const dados = [
        { area: "Biomédica", valor: 40, desc: "Transforma descobertas em tratamentos práticos." },
        { area: "Ensino", valor: 25, desc: "Doutoramentos para reter talento nos Açores." },
        { area: "Digital", valor: 20, desc: "Telemedicina para ligar as 9 ilhas." },
        { area: "Genética", valor: 15, desc: "Estudo do isolamento populacional açoriano." }
    ];

    const width = 250;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3.select("#d3-investigacao")
        .append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(dados.map(d => d.area))
        .range(["#279B7A", "#084C7E", "#45b39d", "#1c5d99"]);

    const pie = d3.pie().value(d => d.valor).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
    const arcOver = d3.arc().innerRadius(radius * 0.5).outerRadius(radius + 8);

    const path = svg.selectAll("path")
        .data(pie(dados))
        .enter()
        .append("path")
        .attr("fill", d => color(d.data.area))
        .attr("d", arc)
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("cursor", "pointer");
-

        path.on("click", function(event, d) {
        event.stopPropagation(); 

        tooltip.style.display = "block";
        tooltip.style.opacity = "1";
        tooltip.innerHTML = `
            <div style="color: var(--primary); font-weight: bold;">${d.data.area}</div>
            <div style="font-size: 1.2rem; font-weight: bold;">${d.data.valor}%</div>
            <div style="font-size: 0.85rem; margin-top:5px;">${d.data.desc}</div>
        `;
        tooltip.style.left = (event.offsetX + 15) + "px";
        tooltip.style.top = (event.offsetY + 15) + "px";


        path.transition().duration(200).style("opacity", 0.3).attr("d", arc);
        d3.select(this).transition().duration(200).style("opacity", 1).attr("d", arcOver);
    });
    document.addEventListener("mousedown", (e) => {

        if (e.target.tagName !== 'path') {
            tooltip.style.opacity = "0";
            setTimeout(() => { tooltip.style.display = "none"; }, 300);
            
            path.transition().duration(200)
                .style("opacity", 1)
                .attr("d", arc);
        }
    });
}
document.addEventListener('DOMContentLoaded', criarGraficoD3);


function initScrollTop() {
    const btn = document.getElementById("backToTop");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }

        const heroSection = document.getElementById("inicio");
        const footerSection = document.querySelector(".footer");
        const heroRect = heroSection.getBoundingClientRect();
        const footerRect = footerSection.getBoundingClientRect();
        const isOverDark = (heroRect.bottom > 50) || (footerRect.top < window.innerHeight - 50);

        if (isOverDark) {
            btn.classList.add("on-dark-bg");
        } else {
            btn.classList.remove("on-dark-bg");
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    initScrollTop();
});