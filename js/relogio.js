
const configButton = document.querySelector('#config');
const popupConfig = document.querySelector('#popupConfig');
const closeButton = document.querySelector('#fecharPopup');
const loadingOption = document.createElement('option');
loadingOption.textContent = 'Carregando...';

let loadingTime = document.querySelector('#loading');
let infoLocal = '';
let dataNova = '';
let horarioDate = '';
let atualizarTempo;

document.getElementById('relogio').style.backgroundColor = '#25adab';

document.querySelector('#tema').addEventListener('click', function () {
    const body = document.querySelector('body');
    let temaAtual = localStorage.getItem("tema");
    body.classList.toggle('dark');

    if (temaAtual == 'claro') {
        document.getElementById('relogio').style.backgroundColor = '#25adab';
        temaAtual = 'escuro';
      } else {
        document.getElementById('relogio').style.backgroundColor = '#666';
        temaAtual = 'claro';
      }
})



function requisitarDatetime(cidade) {
    const url = `https://api.api-ninjas.com/v1/worldtime?city=${cidade}`;
    fetch(url, {
        headers: {
            'X-Api-Key': 'D/ffarfg1mQVl8Dd/YoWLg==Rs0GCzvUE2IVVJWh', // Substitua 'SUA_API_KEY_AQUI' pela sua API Key
        },
    })
        .then(response => response.json())
        .then(data => {
            infoLocal = data;
            numeroMeses = {
                01: 'Janeiro',
                02: 'Fevereiro',
                03: 'Março',
                04: 'Abril',
                05: 'Maio',
                06: 'Junho',
                07: 'Julho',
                08: 'Agosto',
                09: 'Setembro',
                10: 'Outubro',
                11: 'Novembro',
                12: 'Dezembro'
            };
            dataNova = infoLocal.day + ' de ' + numeroMeses[Number(infoLocal.month)] + ' de ' + infoLocal.year;

            const dataElement = document.getElementById('data');
            const tempoElement = document.getElementById('tempo');
            const localElement = document.getElementById('local');
            localElement.innerHTML = infoLocal.timezone;
            dataElement.innerHTML = dataNova;

            horarioDate = new Date(infoLocal.datetime)

            function atualizarHorario() {
                horarioDate.setSeconds(horarioDate.getSeconds() + 1);
                const horarioString = horarioDate.toLocaleTimeString();
                tempoElement.innerHTML = horarioString;
            }
            clearInterval(atualizarTempo);
            atualizarTempo = setInterval(atualizarHorario, 1000);
            setTimeout(() => {
                loadingTime.style.display = 'none';
              }, 1000);
        })
        .catch(error => console.error(error));
}

configButton.onclick = function () {
    popupConfig.showModal();
    popupConfig.classList.remove("animacaoSaida");
    popupConfig.classList.add("animacaoEntrada");
    preencherPaises();
}

function fecharPopup() {
    popupConfig.classList.add("animacaoSaida");
    popupConfig.addEventListener("animationend", function () {
        popupConfig.close();
        popupConfig.classList.remove("animacaoSaida");
    }, { once: true });
}

closeButton.onclick = function () {
    fecharPopup();
}

popupConfig.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        fecharPopup();
    }
});

function preencherPaises() {
    const selectPaises = document.getElementById('paises');
    selectPaises.appendChild(loadingOption);
    fetch('https://secure.geonames.org/countryInfoJSON?username=aaaa')
        .then(response => response.json())
        .then(data => {
            selectPaises.removeChild(loadingOption);
            data.geonames.forEach(pais => {
                const option = document.createElement('option');
                option.value = pais.countryCode;
                option.text = pais.countryName;
                selectPaises.appendChild(option);
            });

            selectPaises.addEventListener('change', preencherEstados);
        })

        .catch(error => console.error(error));
}

function preencherEstados() {
    const codigoPais = document.getElementById('paises').value;
    const selectEstados = document.getElementById('estados');
    selectEstados.appendChild(loadingOption);
    fetch(`https://secure.geonames.org/searchJSON?country=${codigoPais}&adminCode1&username=aaaa`)
        .then(response => response.json())
        .then(data => {
            selectEstados.innerHTML = '';
            const estadosUnicos = new Set();
            data.geonames.forEach(estado => {
                if (estado.adminName1 && !estadosUnicos.has(estado.adminName1)) {
                    estadosUnicos.add(estado.adminName1);
                    const option = document.createElement('option');
                    option.value = estado.adminName1;
                    option.text = estado.adminName1;
                    selectEstados.appendChild(option);
                }
            });

            selectEstados.addEventListener('change', preencherCidades);
        })
        .catch(error => console.error(error));
}


function preencherCidades() {
    const selectCidades = document.getElementById('cidades');
    selectCidades.appendChild(loadingOption);
    const estado = document.getElementById('estados').value;
    fetch(`https://secure.geonames.org/searchJSON?q=${estado}&adminCode1&username=aaaa`)
        .then(response => response.json())
        .then(data => {
            selectCidades.innerHTML = '';
            const cidadesAdicionadas = {};

            data.geonames.forEach(cidade => {
                if (cidade.name && !cidadesAdicionadas[cidade.name]) {
                    const option = document.createElement('option');
                    option.value = cidade.name;
                    option.text = cidade.name;
                    selectCidades.appendChild(option);

                    cidadesAdicionadas[cidade.name] = true;
                }
            });

            selectCidades.addEventListener('change', () => {
                const cidadeSelecionada = selectCidades.value

                requisitarDatetime(cidadeSelecionada);
            })
        })

}

requisitarDatetime('Fortaleza');
