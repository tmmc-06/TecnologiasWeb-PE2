
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

// Código para Bar Chart / Pie Chart

/*
PASSOS

PASSO 1: Definir as variaveis constante para o tamanho do gráfico
PASSO 2: Criar o container svg para o gráfico
PASSO 3: Carregar os dados
Passo 4: definir x e y do gráfico
Passo 5: Adicionar o x e o y ao gráfico
*/

//Passo 1
const margin = { top: 20, right: 30, bottom: 60, left: 50 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Passo 2: SVG Responsivo
const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Passo 3 (yt) - conseguir os dados do ficheiro csv
d3.csv("grafico_barras.csv").then(data => {
    data.forEach(d => {
        d.total = +d.total;
    });

    data.sort(function(a,b) {
        return d3.ascending(a.total, b.total);
    })
    // Passo 4
    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0,d3.max(data, function(d) {return d.total;})])

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.2)
        .domain(data.map(function(d) {return d.grafico_barras_type;}));

    

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");
    // Eixo Y (Esquerda)
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5));
    // PASSO EXTRA: Desenhar as Barras (Sem isto, o gráfico fica vazio!)
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.grafico_barras_type)) // Posição horizontal baseada no nome
        .attr("y", d => y(d.total))               // Posição vertical baseada no valor
        .attr("width", x.bandwidth())             // Largura da barra automática
        .attr("height", d => height - y(d.total)) // A altura é a diferença até à base
        .attr("fill", "#279B7A")

        .attr("rx", 10)
        .attr("ry", 10) 

        .on("mouseover", function(event,d) { // Hover
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill","#084C7E")
            
            tooltip.transition().duration(200).style("opacity",.9);
            tooltip.html(`Na especialidade <strong>${d.grafico_barras_type}</strong> são realizadas <strong>${d.total}</strong> consultas`)
                .style("left", (event.pageX - 10) + "px") 
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", function(event) {
    
            tooltip.style("left", (event.pageX - 10) + "px")
               .style("top", (event.pageY - 20) + "px");
        })
        
        .on("mouseout", function(){ // Volta ao normal
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill","#279B7A")
            
                tooltip.transition().duration(500).style("opacity", 0);
        })
})
        



// Código para Formulário

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
