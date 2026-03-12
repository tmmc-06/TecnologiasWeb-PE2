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


