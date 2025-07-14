<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel de Funcionários</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f1f1f1;
        }
        .container {
            max-width: 1000px;
            margin: 30px auto;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 0 20px #0002;
            padding: 32px;
        }
        .actions, .main-title {
            display: flex;
            gap: 10px;
            margin-bottom: 16px;
            align-items: center;
        }
        .main-title h1, .main-title p {
            margin: 0;
            cursor: pointer;
        }
        .employee-list, .departments {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .employee-pool, .department {
            background: #f9f9f9;
            border: 2px dashed #ddd;
            min-width: 210px;
            min-height: 120px;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 20px;
            box-sizing: border-box;
        }
        .employee-pool {
            flex: 1;
        }
        .department {
            flex: 1;
            position: relative;
        }
        .department-title {
            font-weight: bold;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }
        .remove-btn {
            background: #e74c3c;
            border: none;
            color: #fff;
            border-radius: 50%;
            width: 22px; height: 22px;
            font-size: 13px;
            cursor: pointer;
            margin-left: 4px;
        }
        .employee {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 6px;
            padding: 8px 12px;
            margin: 6px 0;
            cursor: grab;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            box-shadow: 0 2px 5px #0001;
        }
        .employee span {
            pointer-events: none;
        }
        .employee .remove-btn {
            margin-left: 8px;
            background: #c0392b;
        }
        .add-form input, .add-form select {
            padding: 5px 8px;
            margin-right: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .btn {
            background: #667eea;
            color: #fff;
            border: none;
            padding: 7px 14px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .btn:hover {
            background: #5a67d8;
        }
        .drop-hover {
            background: #e0e7ff !important;
            border-color: #667eea !important;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="actions">
        <form class="add-form" id="addEmployeeForm" style="display:flex;align-items:center;gap:8px;">
            <input type="text" id="employeeName" placeholder="Nome do Funcionário" required>
            <input type="text" id="employeeRole" placeholder="Cargo" required>
            <select id="employeeDept">
                <option value="">Pool</option>
            </select>
            <button class="btn" type="submit">Adicionar</button>
        </form>
        <button class="btn" onclick="addDepartment()">➕ Departamento</button>
        <button class="btn" onclick="resetAll()">🔄 Resetar</button>
    </div>
    <div class="main-title">
        <h1 id="mainTitle" onclick="editTitle('mainTitle')">🏢 Painel de Funcionários</h1>
        <p id="subtitle" onclick="editTitle('subtitle')" style="margin-left:18px; font-size:1.05em;">
            Arraste e solte os funcionários nos departamentos
        </p>
    </div>
    <div class="employee-list">
        <div class="employee-pool" id="employeePool" ondrop="onDrop(event, null)" ondragover="onDragOver(event)">
            <div style="margin-bottom:8px;font-weight:bold;">Funcionários sem departamento</div>
        </div>
        <div class="departments" id="departments"></div>
    </div>
</div>
<script>
const LS_KEY = 'painelFuncionariosData';

let data = {
    title: '🏢 Painel de Funcionários',
    subtitle: 'Arraste e solte os funcionários nos departamentos',
    employeeCounter: 0,
    employees: [],
    departments: []
};

function saveData() {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) data = JSON.parse(saved);
}

function refreshAll() {
    // Título e subtítulo
    document.getElementById('mainTitle').textContent = data.title;
    document.getElementById('subtitle').textContent = data.subtitle;
    // Lista de departamentos no select
    const deptSelect = document.getElementById('employeeDept');
    deptSelect.innerHTML = '<option value="">Pool</option>';
    data.departments.forEach(dep => {
        const opt = document.createElement('option');
        opt.value = dep.id;
        opt.textContent = dep.name;
        deptSelect.appendChild(opt);
    });
    // Funcionários sem departamento
    const poolDiv = document.getElementById('employeePool');
    poolDiv.querySelectorAll('.employee').forEach(e=>e.remove());
    data.employees.filter(e => !e.dept).forEach(emp => poolDiv.appendChild(renderEmployee(emp)));
    // Departamentos
    const deptsDiv = document.getElementById('departments');
    deptsDiv.innerHTML = '';
    data.departments.forEach(dep => {
        const deptDiv = document.createElement('div');
        deptDiv.className = 'department';
        deptDiv.ondrop = e => onDrop(e, dep.id);
        deptDiv.ondragover = onDragOver;
        // Título editável
        const titleDiv = document.createElement('div');
        titleDiv.className = 'department-title';
        titleDiv.innerHTML = `<span ondblclick="editDeptTitle('${dep.id}')">${dep.name}</span>
            <button class='remove-btn' onclick="removeDepartment('${dep.id}')" title="Remover departamento">✖</button>`;
        deptDiv.appendChild(titleDiv);
        // Funcionários
        data.employees.filter(e => e.dept === dep.id).forEach(emp => deptDiv.appendChild(renderEmployee(emp)));
        deptsDiv.appendChild(deptDiv);
    });
}

function renderEmployee(emp) {
    const div = document.createElement('div');
    div.className = 'employee';
    div.draggable = true;
    div.dataset.id = emp.id;
    div.innerHTML = `
        <span>${emp.name}</span>
        <span style="opacity:.75;font-size:0.95em;">${emp.role}</span>
        <button class="remove-btn" onclick="removeEmployee('${emp.id}')" title="Remover funcionário">✖</button>
    `;
    div.ondragstart = dragStart;
    return div;
}

// Edição de título/subtítulo
function editTitle(id) {
    const el = document.getElementById(id);
    const old = el.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = old;
    input.style.fontSize = el.style.fontSize || '1.3em';
    input.onblur = () => {
        data[id === 'mainTitle' ? 'title' : 'subtitle'] = input.value;
        saveData(); refreshAll();
    };
    input.onkeydown = e => {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') { input.value = old; input.blur(); }
    };
    el.replaceWith(input);
    input.focus();
}

// Edição de título de departamento
function editDeptTitle(id) {
    const dep = data.departments.find(d => d.id === id);
    if (!dep) return;
    const deptsDiv = document.getElementById('departments');
    const deptDiv = Array.from(deptsDiv.children).find(div =>
        div.querySelector('.department-title span')?.textContent === dep.name
    );
    if (!deptDiv) return;
    const span = deptDiv.querySelector('.department-title span');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = dep.name;
    input.style.fontSize = '1em';
    input.onblur = () => {
        dep.name = input.value || 'Departamento';
        saveData(); refreshAll();
    };
    input.onkeydown = e => {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') {`

