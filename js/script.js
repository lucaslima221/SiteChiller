// Função para carregar dados do chiller
async function loadChillerData(chillerId) {
    try {
        const response = await fetch(`data/chillers/${chillerId}.json`);
        if (!response.ok) throw new Error('Chiller não encontrado');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar dados do chiller:', error);
        return null;
    }
}

// Função para carregar dados do cliente
async function loadClientData(clientId) {
    try {
        const response = await fetch(`data/clients/${clientId}.json`);
        if (!response.ok) throw new Error('Cliente não encontrado');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        return null;
    }
}

// Função para carregar histórico de manutenção
async function loadMaintenanceHistory(chillerId) {
    try {
        const response = await fetch(`data/maintenance/${chillerId}.json`);
        if (!response.ok) throw new Error('Histórico não encontrado');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar histórico de manutenção:', error);
        return [];
    }
}

// Função para exibir dados do chiller
function displayChillerData(chillerData) {
    if (!chillerData) return;
    
    // Atualiza título da página
    document.getElementById('chiller-title').textContent = 
        `Chiller ${chillerData.modelo} - Série ${chillerData.numeroSerie}`;
    
    // Cria os cards de informações
    const machineInfoContainer = document.querySelector('.machine-info');
    machineInfoContainer.innerHTML = `
        <div class="info-card">
            <h3>Dados Técnicos</h3>
            <p><strong>Modelo:</strong> ${chillerData.modelo}</p>
            <p><strong>Número de Série:</strong> ${chillerData.numeroSerie}</p>
            <p><strong>Capacidade:</strong> ${chillerData.capacidade}</p>
            <p><strong>Fluido Refrigerante:</strong> ${chillerData.fluidoRefrigerante}</p>
        </div>
        
        <div class="info-card">
            <h3>Especificações</h3>
            <p><strong>Fabricante:</strong> ${chillerData.fabricante}</p>
            <p><strong>Ano de Fabricação:</strong> ${chillerData.anoFabricacao}</p>
            <p><strong>Data de Instalação:</strong> ${chillerData.dataInstalacao}</p>
            <p><strong>Última Manutenção:</strong> ${chillerData.ultimaManutencao}</p>
        </div>
        
        <div class="info-card">
            <h3>Status Atual</h3>
            <p><strong>Condição:</strong> ${chillerData.status.condicao}</p>
            <p><strong>Horas de Operação:</strong> ${chillerData.status.horasOperacao}</p>
            <p><strong>Próxima Manutenção:</strong> ${chillerData.status.proximaManutencao}</p>
            <p><strong>Alertas:</strong> ${chillerData.status.alertas || 'Nenhum'}</p>
        </div>
        
        <div class="info-card">
            <h3>Componentes Principais</h3>
            <ul>
                <li>Compressor: ${chillerData.componentes.compressor}</li>
                <li>Condensador: ${chillerData.componentes.condensador}</li>
                <li>Evaporador: ${chillerData.componentes.evaporador}</li>
                <li>Válvulas: ${chillerData.componentes.valvulas}</li>
            </ul>
        </div>
    `;
}

// Função para exibir dados do cliente
function displayClientData(clientData) {
    if (!clientData) return;
    
    const clientInfoContainer = document.querySelector('.client-info');
    clientInfoContainer.innerHTML = `
        <div class="info-card">
            <h3>Dados do Cliente</h3>
            <p><strong>Nome/Razão Social:</strong> ${clientData.nome}</p>
            <p><strong>CNPJ:</strong> ${clientData.cnpj}</p>
            <p><strong>Contato Principal:</strong> ${clientData.contato.nome}</p>
            <p><strong>Telefone:</strong> ${clientData.contato.telefone}</p>
            <p><strong>Email:</strong> ${clientData.contato.email}</p>
        </div>
        
        <div class="info-card">
            <h3>Localização</h3>
            <p><strong>Endereço:</strong> ${clientData.endereco.rua}, ${clientData.endereco.numero}</p>
            <p><strong>Cidade/Estado:</strong> ${clientData.endereco.cidade}/${clientData.endereco.estado}</p>
            <p><strong>Local de Instalação:</strong> ${clientData.localInstalacao}</p>
            <p><strong>Acesso:</strong> ${clientData.acesso}</p>
        </div>
        
        <div class="info-card">
            <h3>Contrato</h3>
            <p><strong>Tipo:</strong> ${clientData.contrato.tipo}</p>
            <p><strong>Número:</strong> ${clientData.contrato.numero}</p>
            <p><strong>Validade:</strong> ${clientData.contrato.validade}</p>
            <p><strong>Responsável Técnico:</strong> ${clientData.contrato.responsavel}</p>
        </div>
        
        <div class="info-card">
            <h3>Documentos</h3>
            <ul>
                ${clientData.documentos.map(doc => 
                    `<li><a href="assets/documents/${doc.caminho}">${doc.nome}</a></li>`
                ).join('')}
            </ul>
        </div>
    `;
}

// Função para exibir histórico de manutenção
function displayMaintenanceHistory(history) {
    if (!history || history.length === 0) {
        document.querySelector('#maintenance-table tbody').innerHTML = `
            <tr>
                <td colspan="4">Nenhum registro de manutenção encontrado</td>
            </tr>
        `;
        return;
    }
    
    const tbody = document.querySelector('#maintenance-table tbody');
    tbody.innerHTML = history.map(item => `
        <tr>
            <td>${item.data}</td>
            <td>${item.tipo}</td>
            <td>${item.tecnico}</td>
            <td>${item.observacoes}</td>
        </tr>
    `).join('');
}

// Função para alternar entre abas
function openTab(tabName) {
    // Esconde todos os conteúdos de abas
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    
    // Remove a classe 'active' de todas as abas
    const tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    
    // Mostra o conteúdo da aba selecionada e marca a aba como ativa
    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");
}

// Função principal para inicializar a página
async function init() {
    // ID do chiller pode ser obtido da URL ou de outro parâmetro
    const urlParams = new URLSearchParams(window.location.search);
    const chillerId = urlParams.get('chiller') || 'chiller-001';
    const clientId = urlParams.get('client') || 'americas';
    
    // Carrega e exibe os dados
    const chillerData = await loadChillerData(chillerId);
    const clientData = await loadClientData(clientId);
    const maintenanceHistory = await loadMaintenanceHistory(chillerId);
    
    displayChillerData(chillerData);
    displayClientData(clientData);
    displayMaintenanceHistory(maintenanceHistory);
}

// Inicializa a página quando carregada
document.addEventListener('DOMContentLoaded', init);