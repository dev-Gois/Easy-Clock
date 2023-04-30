document.getElementById('cronometro').style.backgroundColor = '#25adab';
let parar = document.getElementById('parar');
let iniciar = document.getElementById('iniciar');
let cronometro = document.getElementById('crono');
let voltas = document.querySelector('.voltas');
let temaButao = document.querySelector('#tema');
let temaAtual = 'claro';

temaButao.addEventListener('click', function () {
    const body = document.querySelector('body');
    body.classList.toggle('dark');

    if (temaAtual == 'claro') {
        document.getElementById('cronometro').style.backgroundColor = '#666';
        temaAtual = 'escuro';
    } else {
        document.getElementById('cronometro').style.backgroundColor = '#25adab';
        temaAtual = 'claro';
    }
})
parar.setAttribute('disabled', '');

let minutos = 0;
let segundos = 0;
let milisegundos = 0;
let statusCronometro = false;
let execucaoCronometro;
let horarioTotal = '';
let voltasContagem = 0;
let ultimosMinutos = 0;
let ultimosSegundos = 0;
let ultimosMilisegundos = 0;
let tempoVolta = 0;

function executarCronometro() {

    if (minutos == 0 && segundos == 0 && milisegundos == 0) {
        parar.removeAttribute('disabled');
    }

    if (statusCronometro == false) {
        execucaoCronometro = setInterval(atualizarHorario, 1);
        statusCronometro = true;
        alterarBotao(1);
        alterarBotao(2);
    } else {
        adicionarVolta();
    }
}

function pararCronometro() {

    if (parar.textContent == 'Limpar') {
        limparCronometro();
    } else {
        clearInterval(execucaoCronometro);
        statusCronometro = false;
        alterarBotao(1);
        alterarBotao(2);
    }

}

function limparCronometro() {
    minutos = 0;
    segundos = 0;
    milisegundos = 0;
    cronometro.innerHTML = "00:00.00";
    parar.setAttribute('disabled', '');
    voltas.innerHTML = '';
    ultimosMinutos = 0;
    ultimosSegundos = 0;
    ultimosMilisegundos = 0;
    voltasContagem = 0;
}

function atualizarHorario() {
    milisegundos += 1;
    if (milisegundos == 1000) {
        milisegundos = 0;
        segundos += 1;
    }
    if (segundos == 60) {
        segundos = 0;
        minutos += 1;
    }

    let novoHorario = minutos + ':' + segundos + '.' + milisegundos;
    cronometro.innerHTML = novoHorario;
}

function alterarBotao(botao) {

    if (botao == 1) {
        if (iniciar.textContent == 'Iniciar') {
            iniciar.textContent = 'Volta';
        } else {
            iniciar.textContent = 'Iniciar';
        }
    }

    if (botao == 2) {
        if (parar.textContent == 'Limpar') {
            parar.textContent = 'Parar';
        } else {
            parar.textContent = 'Limpar';
        }
    }
}

function adicionarVolta() {

    if (voltasContagem == 0) {
        let divTitles = document.createElement('div');
        divTitles.classList.add('titles');
        let pVolta = document.createElement('p');
        pVolta.textContent = 'volta';
        let pTempo = document.createElement('p');
        pTempo.textContent = 'tempo';
        let pHorarioTotal = document.createElement('p');
        pHorarioTotal.textContent = 'horário total';

        divTitles.appendChild(pVolta);
        divTitles.appendChild(pTempo);
        divTitles.appendChild(pHorarioTotal);

        voltas.appendChild(divTitles);
    }

    voltasContagem++;
    horarioTotal = minutos.toString() + ':' + segundos.toString() + '.' + milisegundos.toString();
    let minutosVolta = minutos - ultimosMinutos;
    let segundosVolta = segundos - ultimosSegundos;
    let milisegundosVolta = milisegundos - ultimosMilisegundos;

    if (milisegundosVolta < 0) {
        segundosVolta--;
        milisegundosVolta += 1000;
    }
    if (segundosVolta < 0) {
        minutosVolta--;
        segundosVolta += 60;
    }
    let tempoVolta = minutosVolta.toString() + ':' + segundosVolta.toString().padStart(2, '0') + '.' + milisegundosVolta.toString().padStart(3, '0');

    let novaDiv = document.createElement('div');
    novaDiv.classList.add('titles');
    let novaVolta = document.createElement('p');
    novaVolta.textContent = voltasContagem;
    let novoTempo = document.createElement('p');
    novoTempo.textContent = tempoVolta;
    let novoHorario = document.createElement('p');
    novoHorario.textContent = horarioTotal;

    novaDiv.appendChild(novaVolta);
    novaDiv.appendChild(novoTempo);
    novaDiv.appendChild(novoHorario);

    voltas.appendChild(novaDiv);

    ultimosMinutos = minutos;
    ultimosSegundos = segundos;
    ultimosMilisegundos = milisegundos;
}