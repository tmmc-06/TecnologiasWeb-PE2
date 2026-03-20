
/*
Carrosel
1º Criar a constante buttons
2º ForEach button adicionar um eventlistener com tipo "click"
3º Direção das imagens, +1 (direita/next) -1 (esquerda/prev)
4º Criar a lista das imagens que se encontram no carrosel
5º Atribuir  o data-active na imagem que está a ser mostrada no carrosel
6º Calcular próximo indice do array
7º Trocar o estado ativo para a próxima imagem

 */

const buttons = document.querySelectorAll(  "[data-carrosel-button]");

buttons.forEach(button => { // Passo 2 - ForEach + EventListener
    button.addEventListener("click",() => {
        const direcao = button.dataset.carroselButton === "next" ? 1 : -1; //Passo 3 - Constante direcao criada para saber a proxima imagem
        // ? 1 : -1 é como um if-else statement

        const imagens = button.closest("[data-carrosel]").querySelector( "[data-imagens]" ); // Passo 4

        const imagem_ativa = imagens.querySelector("[data-active]") // Passo 5

        let newIndex = [...imagens.children].indexOf(imagem_ativa) + direcao; // Passo 6

        if (newIndex < 0) newIndex = imagens.children.length - 1;
        if (newIndex >= imagens.children.length) newIndex = 0;

        imagens.children[newIndex].dataset.active = true; // Passo 7
        delete imagem_ativa.dataset.active; // Retirar o data-active da imagem que estava a ser mostrada
    })


})

// Código para Bar Chart 

/*
PASSOS

PASSO 1: Definir as variaveis constante para o tamanho do gráfico
PASSO 2: Criar o container svg para o gráfico
PASSO 3: Carregar os dados (grafico_barras_csv)
Passo 4: definir x e y do gráfico
Passo 5: Adicionar o x e o y ao gráfico
Passo 6: Preencher as barras
*/

//Passo 1
const margin = { top: 20, right: 30, bottom: 60, left: 50 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Passo 2:
const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Passo 3
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

    
// Passo 5: x
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");
// Passo 5: y
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5));
// Passo 6   
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.grafico_barras_type)) 
        .attr("y", d => y(d.total))               
        .attr("width", x.bandwidth())             
        .attr("height", d => height - y(d.total)) 
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
        



// Formulário
let baseDadosContactos = [];
let nomeInput, emailInput, telInput, emailError, telError, extraFields, telPaises, contactForm, areaCodeSelect, nomePaisLabel;

document.addEventListener('DOMContentLoaded', () => {

    nomeInput = document.getElementById('nome')
    emailInput = document.getElementById('email');
    telInput = document.getElementById('telefone');
    emailError = document.getElementById('email-error');
    telError = document.getElementById('tel-error');
    extraFields = document.getElementById('extra-fields');
    telPaises = document.getElementById('tel-paises');
    contactForm = document.getElementById('contactForm');
    areaCodeSelect = document.getElementById('area-code');
    nomePaisLabel = document.getElementById('nome-pais-label');


    if(areaCodeSelect) areaCodeSelect.addEventListener('change', validarFormulario)
    if(nomeInput) nomeInput.addEventListener('input', validarFormulario)
    if(emailInput) emailInput.addEventListener('input', validarFormulario);
    if(telInput) telInput.addEventListener('input', validarFormulario);


    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // So vai guardar no array se tiver um contacto validado
            if (window.ultimoContactoValidado) {
                baseDadosContactos.push(window.ultimoContactoValidado);
                console.log("Lista de Contactos Atualizada:", baseDadosContactos);
                alert(`Sucesso! A mensagem foi enviada!`);
            }

            // Se o contacto ja for validado, a mensagem é enviada e depois reseta para Portugal
            contactForm.reset();
            nomePaisLabel.innerText = "Portugal";
            extraFields.style.opacity = '0';
            setTimeout(() => { extraFields.style.display = 'none'; }, 400);
            
            const inputs = contactForm.querySelectorAll('input');
            inputs.forEach(input => { input.style.borderColor = 'var(--border)'; });
        });
    }

    // Valida o que está a ser colocado
    [nomeInput, emailInput, telInput, areaCodeSelect].forEach(el => {
        if(el) el.addEventListener('input', validarFormulario);
    });


});

    
// Menu hamburguer
const menuToggle = document.querySelector('#mobile-menu');
const navMenu = document.querySelector('.nav');

if (menuToggle) { // 
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('is-active');
    });
}

// Fecha o menu ao clicar num botao do header
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('is-active');
    });
});
    
// Area Code
const regrasPaises = {
    "+351": { regex: /^9[1236]\d{7}$/, erro: "9 dígitos e começar por 91, 92, 93 ou 96." }, // Portugal
    "+34":  { regex: /^[67]\d{8}$/, erro: "9 dígitos e começar por 6 ou 7." },           // Espanha
    "+33":  { regex: /^[67]\d{8}$/, erro: "9 dígitos e começar por 6 ou 7." },           // França
    "+1":   { regex: /^\d{10}$/, erro: "Deve conter exatamente 10 dígitos." },          // EUA/Canadá
    "+44":  { regex: /^7\d{9}$/, erro: "10 dígitos e começar por 7." },                // Reino Unido
    "+55":  { regex: /^\d{10,11}$/, erro: "Deve conter 10 ou 11 dígitos." }             // Brasil
};

function validarFormulario() {
    if (!nomeInput || !emailInput || !telInput || !areaCodeSelect) return;
    
    const nomeValue = nomeInput.value.trim();
    const emailValue = emailInput.value.trim().toLowerCase();
    const telValue = telInput.value.trim().replace(/\s/g, '');
    
    // Pega no codigo que o utilizador escolheu
    const selectedCode = areaCodeSelect.value.trim();
    const selectedPais = areaCodeSelect.options[areaCodeSelect.selectedIndex].getAttribute('data-pais');

    // Atualiza o nome do país no ecrã
    nomePaisLabel.innerText = selectedPais;

    //valida o nome
    const isNomeValid = nomeValue.length > 2; // menos 3 carateres

    const regra = regrasPaises[selectedCode];
    const isTelValid = regra.regex.test(telValue); // Cada país tem a sua regra, se o telemovel nao for de acordo com a tal regra entao nao permite enviar mensagem

    // Valida o email

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(emailValue);


    // Feedback visual do Email
    if (emailValue.length > 0) {
        emailError.style.display = isEmailValid ? 'none' : 'block';
        emailInput.style.borderColor = isEmailValid ? 'var(--primary)' : '#ff4d4d';
    } 
    
    else {
        // Se estiver vazio, esconde o erro e volta à cor original
        emailError.style.display = 'none';
        emailInput.style.borderColor = 'var(--border)';
    }


    // Feedback visual do Telemovel
    if (telValue.length > 0) {
        if (isTelValid) {
            telError.style.display = 'none';
            telInput.style.borderColor = 'var(--primary)';
        }
    
        else {
        // Se estiver vazio, esconde o erro e volta à cor original
        telError.style.display = 'block';
        telError.innerText = `Para ${selectedPais}: ${regra.erro}`;        
        telInput.style.borderColor = '#ff4d4d';
        }
    }

    else {
        telError.style.display = 'none';
        telInput.style.borderColor = 'var(--border)'
    }

    // Se tiver tudo ok
    if (isNomeValid && isEmailValid && isTelValid) {
        const contactoAtual = {
            nome: nomeValue,
            email: emailValue,
            pais: selectedPais,
            prefixo: selectedCode,
            numeroLocal: telValue,
            data: new Date().toLocaleString()
        };

        window.ultimoContactoValidado = contactoAtual;

        extraFields.style.display = 'block';
        setTimeout(() => { extraFields.style.opacity = '1'; }, 10);
    }

    else{
        extraFields.style.opacity = '0';
        setTimeout(() => { if (extraFields.style.opacity === '0') extraFields.style.display = 'none'; }, 400);
    }
} 


// Gráficos      
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


function initRevelarConteudo() {
    const btn = document.getElementById('btn-revelar');
    const content = document.getElementById('conteudo-escondido');

    if (!btn || !content) return;

    btn.addEventListener('click', () => {
        content.classList.toggle('active');

        if (content.classList.contains('active')) {
            btn.innerText = 'Mostrar Menos';
        } else {
            btn.innerText = 'Saber Mais sobre o Impacto do CACA';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initRevelarConteudo();
})