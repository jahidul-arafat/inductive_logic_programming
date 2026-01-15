/**
 * ============================================
 * ILP Explorer - Interactive Educational Platform
 * JavaScript Application
 * ============================================
 */

// ============================================
// Global State Management
// ============================================
const AppState = {
    currentSection: 'foundations',
    complexityLevel: 1,
    levelNames: ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'PhD Level'],
    
    // Family tree state
    familyTree: {
        people: ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'],
        relations: [
            { parent: 'Alice', child: 'Bob' },
            { parent: 'Alice', child: 'Carol' },
            { parent: 'Bob', child: 'Dave' },
            { parent: 'Bob', child: 'Eve' }
        ],
        posExamples: [],
        negExamples: []
    },
    
    // Pattern learning state
    patternSequence: [
        { value: 2, positive: true },
        { value: 4, positive: true },
        { value: 6, positive: true },
        { value: 7, positive: false },
        { value: 8, positive: true },
        { value: 9, positive: false }
    ],
    
    // SAT solver state
    satClauses: ['(A ∨ B)', '(¬A ∨ C)', '(¬B ∨ ¬C)'],
    
    // Popper simulator state
    popperState: {
        hypothesesTested: 0,
        constraintsLearned: 0,
        spacePruned: 0,
        running: false,
        currentHypothesis: null,
        constraints: []
    },
    
    // DPLL state
    dpllState: {
        step: 0,
        nodes: [],
        currentNode: null
    }
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeComplexitySlider();
    initializeHeroAnimation();
    initializeArchitectureDiagram();
    initializeFamilyTree();
    initializeHypothesisSpaceViz();
    initializeDPLLVisualization();
    initializePopperAnimation();
    initializeSearchSpaceViz();
    updateSequenceDisplay();
    populateFamilySelectors();
    
    // Intersection Observer for animations
    initializeScrollAnimations();
});

// ============================================
// Navigation
// ============================================
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Scroll to section
            scrollToSection(section);
            AppState.currentSection = section;
        });
    });
    
    // Update nav on scroll
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = section.offsetTop - navHeight - 20;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Re-initialize Advanced Popper canvas when navigating to that section
        if (sectionId === 'advanced') {
            setTimeout(() => {
                const canvas = document.getElementById('hypothesisLatticeCanvas');
                if (canvas) {
                    const container = canvas.parentElement;
                    const containerWidth = container.clientWidth;
                    if (containerWidth > 100) {
                        canvas.width = containerWidth;
                        canvas.height = 500;
                        if (typeof calculateNodePositions === 'function') {
                            calculateNodePositions(canvas);
                            drawPopperLattice(canvas);
                        }
                    }
                }
            }, 400);
        }
    }
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navHeight = document.querySelector('.main-nav').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === currentSection) {
            link.classList.add('active');
        }
    });
}

// ============================================
// Complexity Level Control
// ============================================
function initializeComplexitySlider() {
    const slider = document.getElementById('complexitySlider');
    const indicator = document.getElementById('levelIndicator');
    
    if (slider && indicator) {
        slider.addEventListener('input', (e) => {
            const level = parseInt(e.target.value);
            AppState.complexityLevel = level;
            indicator.textContent = AppState.levelNames[level - 1];
            filterContentByLevel(level);
        });
    }
}

function filterContentByLevel(level) {
    const blocks = document.querySelectorAll('.content-block');
    
    blocks.forEach(block => {
        const blockLevel = parseInt(block.dataset.level) || 1;
        if (blockLevel <= level) {
            block.style.display = 'block';
            block.style.opacity = '1';
        } else {
            block.style.opacity = '0.3';
        }
    });
}

// ============================================
// Hero Animation - Logic Tree
// ============================================
function initializeHeroAnimation() {
    const container = document.getElementById('heroTree');
    if (!container) return;
    
    // Create animated logic tree
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.style.width = '100%';
    svg.style.height = '100%';
    
    // Define nodes
    const nodes = [
        { x: 200, y: 50, label: 'H', type: 'hypothesis' },
        { x: 100, y: 150, label: 'B', type: 'background' },
        { x: 300, y: 150, label: 'E', type: 'examples' },
        { x: 50, y: 250, label: 'p(X)', type: 'predicate' },
        { x: 150, y: 250, label: 'q(X,Y)', type: 'predicate' },
        { x: 250, y: 250, label: 'E⁺', type: 'positive' },
        { x: 350, y: 250, label: 'E⁻', type: 'negative' }
    ];
    
    // Draw edges
    const edges = [
        [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]
    ];
    
    edges.forEach(([from, to], i) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', nodes[from].x);
        line.setAttribute('y1', nodes[from].y + 20);
        line.setAttribute('x2', nodes[to].x);
        line.setAttribute('y2', nodes[to].y - 20);
        line.setAttribute('stroke', '#6366f1');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.5');
        line.style.animation = `lineGrow 0.5s ease forwards ${i * 0.1}s`;
        svg.appendChild(line);
    });
    
    // Draw nodes
    nodes.forEach((node, i) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.style.animation = `nodeAppear 0.5s ease forwards ${i * 0.1 + 0.3}s`;
        g.style.opacity = '0';
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', '25');
        
        // Color based on type
        const colors = {
            hypothesis: '#6366f1',
            background: '#8b5cf6',
            examples: '#06b6d4',
            predicate: '#10b981',
            positive: '#10b981',
            negative: '#ef4444'
        };
        circle.setAttribute('fill', colors[node.type] || '#6366f1');
        circle.setAttribute('opacity', '0.8');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-family', 'JetBrains Mono, monospace');
        text.textContent = node.label;
        
        g.appendChild(circle);
        g.appendChild(text);
        svg.appendChild(g);
    });
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes nodeAppear {
            from { opacity: 0; transform: scale(0); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes lineGrow {
            from { stroke-dasharray: 100; stroke-dashoffset: 100; }
            to { stroke-dasharray: 100; stroke-dashoffset: 0; }
        }
    `;
    document.head.appendChild(style);
    
    container.appendChild(svg);
    
    // Add floating animation
    animateHeroTree(svg);
}

function animateHeroTree(svg) {
    let time = 0;
    function animate() {
        time += 0.02;
        const circles = svg.querySelectorAll('circle');
        circles.forEach((circle, i) => {
            const offset = Math.sin(time + i * 0.5) * 3;
            const cy = parseFloat(circle.getAttribute('cy'));
            circle.style.transform = `translateY(${offset}px)`;
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ============================================
// Architecture Diagram Animation
// ============================================
function initializeArchitectureDiagram() {
    const diagram = document.getElementById('ilpArchitecture');
    if (!diagram) return;
    
    // Add hover effects
    const nodes = diagram.querySelectorAll('.node');
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            node.style.filter = 'brightness(1.2)';
            node.style.transition = 'filter 0.3s ease';
        });
        node.addEventListener('mouseleave', () => {
            node.style.filter = 'brightness(1)';
        });
    });
}

// ============================================
// Simple Rule Demo
// ============================================
function addPositiveExample() {
    const value = prompt('Enter a positive example (number):');
    if (value && !isNaN(value)) {
        const container = document.getElementById('positiveExamples');
        const item = document.createElement('div');
        item.className = 'example-item';
        item.dataset.value = value;
        item.textContent = value;
        container.appendChild(item);
        updateLearnedRule();
    }
}

function addNegativeExample() {
    const value = prompt('Enter a negative example (number):');
    if (value && !isNaN(value)) {
        const container = document.getElementById('negativeExamples');
        const item = document.createElement('div');
        item.className = 'example-item';
        item.dataset.value = value;
        item.textContent = value;
        container.appendChild(item);
        updateLearnedRule();
    }
}

function updateLearnedRule() {
    const positives = Array.from(document.querySelectorAll('#positiveExamples .example-item'))
        .map(el => parseInt(el.dataset.value));
    const negatives = Array.from(document.querySelectorAll('#negativeExamples .example-item'))
        .map(el => parseInt(el.dataset.value));
    
    // Simple rule induction
    let rule = 'positive(X) :- ';
    
    // Check if all positives are even
    const allEven = positives.every(n => n % 2 === 0) && negatives.every(n => n % 2 !== 0);
    // Check if all positives are divisible by 3
    const allDiv3 = positives.every(n => n % 3 === 0) && negatives.every(n => n % 3 !== 0);
    // Check if all positives are greater than some threshold
    const minPos = Math.min(...positives);
    const maxNeg = Math.max(...negatives);
    
    if (allEven) {
        rule += 'even(X)';
    } else if (allDiv3) {
        rule += 'divisible_by_3(X)';
    } else if (minPos > maxNeg) {
        rule += `greater_than(X, ${maxNeg})`;
    } else {
        rule += '???';
    }
    
    const ruleElement = document.getElementById('learnedRule');
    if (ruleElement) {
        ruleElement.querySelector('code').textContent = rule;
    }
}

// ============================================
// Interactive Reasoning Demo
// ============================================
function addObservation() {
    const input = document.getElementById('observationInput');
    const value = input.value.trim();
    
    if (value) {
        const container = document.getElementById('observationsList');
        const obs = document.createElement('div');
        obs.className = 'observation';
        obs.textContent = value;
        container.appendChild(obs);
        input.value = '';
    }
}

function induceRule() {
    const observations = Array.from(document.querySelectorAll('#observationsList .observation'))
        .map(el => el.textContent);
    
    // Simple pattern matching
    const patterns = {};
    observations.forEach(obs => {
        const parts = obs.toLowerCase().split(' is ');
        if (parts.length === 2) {
            const property = parts[1].trim();
            if (!patterns[property]) patterns[property] = [];
            patterns[property].push(parts[0].trim());
        }
    });
    
    // Find most common pattern
    let maxCount = 0;
    let commonProperty = '';
    Object.entries(patterns).forEach(([prop, items]) => {
        if (items.length > maxCount) {
            maxCount = items.length;
            commonProperty = prop;
        }
    });
    
    const resultElement = document.getElementById('inducedRule');
    if (resultElement && commonProperty) {
        resultElement.innerHTML = `
            <span class="rule-icon">💡</span>
            <span class="rule-text">Hypothesis: All observed entities are ${commonProperty}!</span>
        `;
    } else {
        resultElement.innerHTML = `
            <span class="rule-icon">🤔</span>
            <span class="rule-text">Need more consistent observations to induce a rule.</span>
        `;
    }
}

// ============================================
// Hypothesis Space Visualization
// ============================================
function initializeHypothesisSpaceViz() {
    const canvas = document.getElementById('spaceCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Controls
    const clauseLength = document.getElementById('maxClauseLength');
    const variables = document.getElementById('maxVariables');
    const recursion = document.getElementById('allowRecursion');
    
    function drawHypothesisSpace() {
        const maxClauses = parseInt(clauseLength?.value || 3);
        const maxVars = parseInt(variables?.value || 2);
        const allowRec = recursion?.checked || false;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate approximate space size
        const spaceSize = Math.pow(10, maxClauses + maxVars + (allowRec ? 2 : 0));
        
        // Update display
        const sizeElement = document.getElementById('spaceSize');
        if (sizeElement) {
            sizeElement.textContent = `~10^${Math.log10(spaceSize).toFixed(0)}`;
        }
        
        const clauseValue = document.getElementById('clauseLengthValue');
        const varsValue = document.getElementById('variablesValue');
        if (clauseValue) clauseValue.textContent = maxClauses;
        if (varsValue) varsValue.textContent = maxVars;
        
        // Draw visualization - scattered points representing hypotheses
        const numPoints = Math.min(500, spaceSize / 1000);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 30) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Draw hypothesis points
        for (let i = 0; i < numPoints; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 3 + 1;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${240 + Math.random() * 60}, 70%, 60%, ${0.3 + Math.random() * 0.4})`;
            ctx.fill();
        }
        
        // Draw "valid" region
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height / 2, 80, 60, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Label
        ctx.fillStyle = '#10b981';
        ctx.font = '12px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText('Valid Hypotheses', canvas.width / 2, canvas.height / 2 + 80);
    }
    
    // Add event listeners
    clauseLength?.addEventListener('input', drawHypothesisSpace);
    variables?.addEventListener('input', drawHypothesisSpace);
    recursion?.addEventListener('change', drawHypothesisSpace);
    
    drawHypothesisSpace();
}

// ============================================
// SAT Solver Playground
// ============================================
function addClause() {
    const input = document.getElementById('newClause');
    const value = input.value.trim();
    
    if (value) {
        AppState.satClauses.push(value);
        updateClausesList();
        input.value = '';
    }
}

function updateClausesList() {
    const container = document.getElementById('clausesList');
    if (!container) return;
    
    container.innerHTML = '';
    AppState.satClauses.forEach((clause, i) => {
        const div = document.createElement('div');
        div.className = 'clause';
        div.textContent = clause;
        div.onclick = () => {
            AppState.satClauses.splice(i, 1);
            updateClausesList();
        };
        container.appendChild(div);
    });
}

function solveSAT() {
    const resultElement = document.getElementById('satResult');
    const traceElement = document.getElementById('satTrace');
    
    // Parse clauses
    const clauses = AppState.satClauses.map(parseClause);
    const variables = new Set();
    clauses.forEach(clause => {
        clause.forEach(lit => variables.add(lit.variable));
    });
    
    // Simple DPLL simulation
    const trace = [];
    const assignment = {};
    
    function dpll(clauses, assignment, depth = 0) {
        const indent = '  '.repeat(depth);
        
        // Unit propagation
        let changed = true;
        while (changed) {
            changed = false;
            for (const clause of clauses) {
                const unassigned = clause.filter(lit => assignment[lit.variable] === undefined);
                const satisfied = clause.some(lit => 
                    assignment[lit.variable] === !lit.negated
                );
                
                if (satisfied) continue;
                
                if (unassigned.length === 0) {
                    trace.push(`${indent}❌ Conflict detected!`);
                    return false;
                }
                
                if (unassigned.length === 1) {
                    const lit = unassigned[0];
                    assignment[lit.variable] = !lit.negated;
                    trace.push(`${indent}📌 Unit propagation: ${lit.variable} = ${!lit.negated}`);
                    changed = true;
                }
            }
        }
        
        // Check if all clauses satisfied
        const allSatisfied = clauses.every(clause =>
            clause.some(lit => assignment[lit.variable] === !lit.negated)
        );
        
        if (allSatisfied) {
            trace.push(`${indent}✅ All clauses satisfied!`);
            return true;
        }
        
        // Pick unassigned variable
        const unassignedVar = Array.from(variables).find(v => assignment[v] === undefined);
        if (!unassignedVar) return false;
        
        // Try true
        trace.push(`${indent}🔀 Branching: try ${unassignedVar} = true`);
        const tryTrue = dpll(clauses, { ...assignment, [unassignedVar]: true }, depth + 1);
        if (tryTrue) return true;
        
        // Try false
        trace.push(`${indent}🔀 Backtrack: try ${unassignedVar} = false`);
        const tryFalse = dpll(clauses, { ...assignment, [unassignedVar]: false }, depth + 1);
        return tryFalse;
    }
    
    const result = dpll(clauses, assignment);
    
    // Display results
    if (result) {
        resultElement.innerHTML = `
            <div class="result-status sat">✅ SATISFIABLE</div>
            <div class="assignment">
                ${Object.entries(assignment).map(([v, val]) => 
                    `<span class="var-assignment">${v} = ${val}</span>`
                ).join(' ')}
            </div>
        `;
    } else {
        resultElement.innerHTML = `
            <div class="result-status unsat">❌ UNSATISFIABLE</div>
        `;
    }
    
    traceElement.innerHTML = trace.map(t => `<div class="trace-line">${t}</div>`).join('');
}

function parseClause(clauseStr) {
    // Parse clause like "(A ∨ ¬B ∨ C)"
    const cleaned = clauseStr.replace(/[()]/g, '').trim();
    const literals = cleaned.split(/\s*[∨|]\s*/);
    
    return literals.map(lit => {
        const negated = lit.startsWith('¬') || lit.startsWith('!');
        const variable = lit.replace(/[¬!]/g, '').trim();
        return { variable, negated };
    });
}

// ============================================
// DPLL Visualization
// ============================================
function initializeDPLLVisualization() {
    const canvas = document.getElementById('dpllCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    drawDPLLTree(ctx);
}

function drawDPLLTree(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw a sample DPLL tree
    const nodes = [
        { x: 350, y: 40, label: '{}', status: 'active' },
        { x: 200, y: 120, label: 'A=T', status: 'explored' },
        { x: 500, y: 120, label: 'A=F', status: 'pruned' },
        { x: 120, y: 200, label: 'B=T', status: 'explored' },
        { x: 280, y: 200, label: 'B=F', status: 'conflict' },
        { x: 80, y: 280, label: 'C=T', status: 'solution' },
        { x: 160, y: 280, label: 'C=F', status: 'conflict' }
    ];
    
    const edges = [
        [0, 1], [0, 2], [1, 3], [1, 4], [3, 5], [3, 6]
    ];
    
    // Draw edges
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    edges.forEach(([from, to]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[from].x, nodes[from].y + 15);
        ctx.lineTo(nodes[to].x, nodes[to].y - 15);
        ctx.stroke();
    });
    
    // Draw nodes
    const colors = {
        active: '#6366f1',
        explored: '#8b5cf6',
        pruned: '#6b7280',
        conflict: '#ef4444',
        solution: '#10b981'
    };
    
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = colors[node.status];
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = '11px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
    });
    
    // Legend
    ctx.font = '12px Space Grotesk';
    ctx.textAlign = 'left';
    let legendY = 350;
    Object.entries(colors).forEach(([status, color]) => {
        ctx.fillStyle = color;
        ctx.fillRect(20, legendY, 12, 12);
        ctx.fillStyle = '#9ca3af';
        ctx.fillText(status, 40, legendY + 10);
        legendY += 20;
    });
}

function dpllStep() {
    // Animate one step of DPLL
    const canvas = document.getElementById('dpllCanvas');
    if (!canvas) return;
    
    AppState.dpllState.step++;
    const ctx = canvas.getContext('2d');
    drawDPLLTree(ctx);
}

function dpllRun() {
    // Auto-run DPLL visualization
    let step = 0;
    const interval = setInterval(() => {
        dpllStep();
        step++;
        if (step >= 6) clearInterval(interval);
    }, 500);
}

function dpllReset() {
    AppState.dpllState.step = 0;
    const canvas = document.getElementById('dpllCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        drawDPLLTree(ctx);
    }
}

// ============================================
// ASP Playground
// ============================================
const aspExamples = {
    coloring: `% Graph Coloring Problem
% Nodes
node(1). node(2). node(3). node(4).

% Edges  
edge(1,2). edge(2,3). edge(3,4). edge(4,1). edge(1,3).

% Colors
color(red). color(green). color(blue).

% Each node has exactly one color
1 { colored(N,C) : color(C) } 1 :- node(N).

% Adjacent nodes have different colors
:- edge(X,Y), colored(X,C), colored(Y,C).

#show colored/2.`,

    nqueens: `% N-Queens Problem (4x4)
#const n = 4.

% Place exactly one queen per row
1 { queen(R,C) : C = 1..n } 1 :- R = 1..n.

% No two queens in same column
:- queen(R1,C), queen(R2,C), R1 != R2.

% No two queens on same diagonal
:- queen(R1,C1), queen(R2,C2), R1 != R2, |R1-R2| = |C1-C2|.

#show queen/2.`,

    family: `% Family Relations
parent(ann, bob).
parent(ann, carol).
parent(bob, dave).
parent(bob, eve).
parent(carol, frank).

% Grandparent rule
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).

% Sibling rule  
sibling(X, Y) :- parent(P, X), parent(P, Y), X != Y.

#show grandparent/2.
#show sibling/2.`,

    path: `% Path Finding
edge(a, b). edge(b, c). edge(c, d).
edge(a, e). edge(e, d).

% Transitive closure
path(X, Y) :- edge(X, Y).
path(X, Z) :- edge(X, Y), path(Y, Z).

% Find all reachable nodes from 'a'
reachable(X) :- path(a, X).

#show reachable/1.
#show path/2.`
};

function loadASPExample() {
    const select = document.getElementById('aspExamples');
    const textarea = document.getElementById('aspCode');
    
    if (select && textarea) {
        textarea.value = aspExamples[select.value];
    }
}

function runASP() {
    const code = document.getElementById('aspCode')?.value || '';
    const resultsElement = document.getElementById('aspResults');
    
    // Parse and simulate ASP solving
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('%'));
    
    // Extract facts and rules
    const facts = [];
    const rules = [];
    const constraints = [];
    
    lines.forEach(line => {
        if (line.startsWith(':-')) {
            constraints.push(line);
        } else if (line.includes(':-')) {
            rules.push(line);
        } else if (!line.startsWith('#')) {
            facts.push(line);
        }
    });
    
    // Simulate answer set computation
    const simulatedResults = simulateASP(facts, rules, constraints);
    
    resultsElement.innerHTML = `
        <div class="asp-answer-sets">
            <div class="answer-set-header">Answer Sets Found: ${simulatedResults.length}</div>
            ${simulatedResults.map((set, i) => `
                <div class="answer-set">
                    <span class="set-number">Model ${i + 1}:</span>
                    <span class="set-atoms">${set.join(', ')}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Update visualization if graph coloring
    if (code.includes('colored')) {
        drawGraphColoring(simulatedResults[0]);
    }
}

function simulateASP(facts, rules, constraints) {
    // Simplified ASP simulation
    // In reality, this would use a proper ASP solver
    
    const results = [];
    
    // For graph coloring example
    if (facts.some(f => f.includes('color('))) {
        results.push([
            'colored(1,red)', 'colored(2,green)', 
            'colored(3,red)', 'colored(4,blue)'
        ]);
        results.push([
            'colored(1,green)', 'colored(2,red)', 
            'colored(3,green)', 'colored(4,blue)'
        ]);
    }
    // For family example
    else if (facts.some(f => f.includes('parent('))) {
        results.push([
            'grandparent(ann,dave)', 'grandparent(ann,eve)', 
            'grandparent(ann,frank)', 'sibling(bob,carol)',
            'sibling(carol,bob)', 'sibling(dave,eve)', 'sibling(eve,dave)'
        ]);
    }
    // For N-Queens
    else if (facts.some(f => f.includes('queen')) || rules.some(r => r.includes('queen'))) {
        results.push(['queen(1,2)', 'queen(2,4)', 'queen(3,1)', 'queen(4,3)']);
        results.push(['queen(1,3)', 'queen(2,1)', 'queen(3,4)', 'queen(4,2)']);
    }
    // For path finding
    else if (facts.some(f => f.includes('edge('))) {
        results.push([
            'path(a,b)', 'path(b,c)', 'path(c,d)', 'path(a,e)', 'path(e,d)',
            'path(a,c)', 'path(a,d)', 'path(b,d)',
            'reachable(b)', 'reachable(c)', 'reachable(d)', 'reachable(e)'
        ]);
    }
    
    return results.length > 0 ? results : [['(no atoms in answer set)']];
}

function drawGraphColoring(solution) {
    const vizContainer = document.getElementById('aspViz');
    if (!vizContainer || !solution) return;
    
    const colors = { red: '#ef4444', green: '#10b981', blue: '#6366f1' };
    
    // Parse coloring
    const nodeColors = {};
    solution.forEach(atom => {
        const match = atom.match(/colored\((\d+),(\w+)\)/);
        if (match) {
            nodeColors[match[1]] = colors[match[2]];
        }
    });
    
    // Create simple graph visualization
    vizContainer.innerHTML = `
        <svg viewBox="0 0 200 150" style="width: 100%; max-width: 300px;">
            <line x1="50" y1="30" x2="150" y2="30" stroke="#6b7280" stroke-width="2"/>
            <line x1="150" y1="30" x2="150" y2="120" stroke="#6b7280" stroke-width="2"/>
            <line x1="150" y1="120" x2="50" y2="120" stroke="#6b7280" stroke-width="2"/>
            <line x1="50" y1="120" x2="50" y2="30" stroke="#6b7280" stroke-width="2"/>
            <line x1="50" y1="30" x2="150" y2="120" stroke="#6b7280" stroke-width="2"/>
            
            <circle cx="50" cy="30" r="20" fill="${nodeColors['1'] || '#6b7280'}"/>
            <circle cx="150" cy="30" r="20" fill="${nodeColors['2'] || '#6b7280'}"/>
            <circle cx="150" cy="120" r="20" fill="${nodeColors['3'] || '#6b7280'}"/>
            <circle cx="50" cy="120" r="20" fill="${nodeColors['4'] || '#6b7280'}"/>
            
            <text x="50" y="35" text-anchor="middle" fill="white" font-size="14">1</text>
            <text x="150" y="35" text-anchor="middle" fill="white" font-size="14">2</text>
            <text x="150" y="125" text-anchor="middle" fill="white" font-size="14">3</text>
            <text x="50" y="125" text-anchor="middle" fill="white" font-size="14">4</text>
        </svg>
    `;
}

// ============================================
// Popper Animation
// ============================================
function initializePopperAnimation() {
    const canvas = document.getElementById('popperCanvas');
    if (!canvas) return;
    
    drawPopperState(canvas);
}

function drawPopperState(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const state = AppState.popperState;
    
    // Draw hypothesis space as a grid
    const gridSize = 20;
    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * gridSize + gridSize / 2;
            const y = j * gridSize + gridSize / 2;
            
            // Determine if this cell is pruned
            const cellIndex = i * rows + j;
            const isPruned = cellIndex < (state.spacePruned / 100) * (cols * rows);
            const isTested = cellIndex < state.hypothesesTested;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            
            if (isPruned) {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
            } else if (isTested) {
                ctx.fillStyle = 'rgba(245, 158, 11, 0.5)';
            } else {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
            }
            ctx.fill();
        }
    }
    
    // Draw current hypothesis highlight
    if (state.currentHypothesis !== null) {
        const hx = (state.currentHypothesis % cols) * gridSize + gridSize / 2;
        const hy = Math.floor(state.currentHypothesis / cols) * gridSize + gridSize / 2;
        
        ctx.beginPath();
        ctx.arc(hx, hy, 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // Legend
    ctx.font = '11px Space Grotesk';
    ctx.textAlign = 'left';
    
    const legendItems = [
        { color: 'rgba(99, 102, 241, 0.5)', label: 'Unexplored' },
        { color: 'rgba(245, 158, 11, 0.7)', label: 'Tested' },
        { color: 'rgba(239, 68, 68, 0.5)', label: 'Pruned' }
    ];
    
    legendItems.forEach((item, i) => {
        ctx.fillStyle = item.color;
        ctx.fillRect(canvas.width - 100, 10 + i * 20, 12, 12);
        ctx.fillStyle = '#9ca3af';
        ctx.fillText(item.label, canvas.width - 82, 20 + i * 20);
    });
}

function popperStep() {
    const state = AppState.popperState;
    const canvas = document.getElementById('popperCanvas');
    const log = document.getElementById('popperLog');
    
    if (!canvas || !log) return;
    
    // Simulate one step of Popper
    state.hypothesesTested++;
    state.currentHypothesis = state.hypothesesTested - 1;
    
    // Random outcome
    const outcome = Math.random();
    let logEntry = '';
    
    if (outcome < 0.3) {
        // Too specific - add generalization constraint
        state.constraintsLearned++;
        state.spacePruned += 5 + Math.random() * 10;
        logEntry = `<div class="log-entry constraint">H${state.hypothesesTested}: Too specific → Generalization constraint added</div>`;
    } else if (outcome < 0.6) {
        // Too general - add specialization constraint
        state.constraintsLearned++;
        state.spacePruned += 3 + Math.random() * 7;
        logEntry = `<div class="log-entry failure">H${state.hypothesesTested}: Too general → Specialization constraint added</div>`;
    } else if (outcome < 0.9) {
        // Invalid - eliminate
        state.spacePruned += 1 + Math.random() * 3;
        logEntry = `<div class="log-entry failure">H${state.hypothesesTested}: Invalid hypothesis eliminated</div>`;
    } else {
        // Found solution!
        logEntry = `<div class="log-entry success">H${state.hypothesesTested}: ✅ Solution found!</div>`;
        state.running = false;
    }
    
    state.spacePruned = Math.min(state.spacePruned, 95);
    
    log.innerHTML += logEntry;
    log.scrollTop = log.scrollHeight;
    
    // Update stats
    document.getElementById('hypTested').textContent = state.hypothesesTested;
    document.getElementById('constraintsLearned').textContent = state.constraintsLearned;
    document.getElementById('spacePruned').textContent = state.spacePruned.toFixed(1) + '%';
    
    drawPopperState(canvas);
}

function popperRun() {
    const state = AppState.popperState;
    state.running = true;
    
    const interval = setInterval(() => {
        if (!state.running || state.hypothesesTested >= 50) {
            clearInterval(interval);
            return;
        }
        popperStep();
    }, 300);
}

function popperReset() {
    AppState.popperState = {
        hypothesesTested: 0,
        constraintsLearned: 0,
        spacePruned: 0,
        running: false,
        currentHypothesis: null,
        constraints: []
    };
    
    document.getElementById('hypTested').textContent = '0';
    document.getElementById('constraintsLearned').textContent = '0';
    document.getElementById('spacePruned').textContent = '0%';
    document.getElementById('popperLog').innerHTML = '<div class="log-entry init">Simulator reset. Ready to begin.</div>';
    
    const canvas = document.getElementById('popperCanvas');
    if (canvas) drawPopperState(canvas);
}

// ============================================
// Family Tree Playground
// ============================================
function initializeFamilyTree() {
    const canvas = document.getElementById('familyCanvas');
    if (!canvas) return;
    
    drawFamilyTree(canvas);
}

function drawFamilyTree(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const tree = AppState.familyTree;
    
    // Calculate positions using a simple tree layout
    const positions = {};
    const levels = {};
    
    // Find root nodes (people with no parents)
    const children = new Set(tree.relations.map(r => r.child));
    const roots = tree.people.filter(p => !children.has(p));
    
    // BFS to assign levels
    const queue = roots.map(r => ({ person: r, level: 0 }));
    const visited = new Set();
    
    while (queue.length > 0) {
        const { person, level } = queue.shift();
        if (visited.has(person)) continue;
        visited.add(person);
        
        if (!levels[level]) levels[level] = [];
        levels[level].push(person);
        
        // Find children
        tree.relations
            .filter(r => r.parent === person)
            .forEach(r => queue.push({ person: r.child, level: level + 1 }));
    }
    
    // Assign positions
    Object.entries(levels).forEach(([level, people]) => {
        const y = 50 + parseInt(level) * 80;
        const spacing = canvas.width / (people.length + 1);
        people.forEach((person, i) => {
            positions[person] = { x: spacing * (i + 1), y };
        });
    });
    
    // Draw edges
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    tree.relations.forEach(({ parent, child }) => {
        if (positions[parent] && positions[child]) {
            ctx.beginPath();
            ctx.moveTo(positions[parent].x, positions[parent].y + 20);
            ctx.lineTo(positions[child].x, positions[child].y - 20);
            ctx.stroke();
        }
    });
    
    // Draw nodes
    Object.entries(positions).forEach(([person, pos]) => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = '#1e2940';
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#e8edf5';
        ctx.font = '11px Space Grotesk';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(person, pos.x, pos.y);
    });
}

function populateFamilySelectors() {
    const selectors = ['person1', 'person2', 'posEx1', 'posEx2', 'negEx1', 'negEx2'];
    
    selectors.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.innerHTML = '<option value="">Select...</option>';
            AppState.familyTree.people.forEach(person => {
                const option = document.createElement('option');
                option.value = person;
                option.textContent = person;
                select.appendChild(option);
            });
        }
    });
}

function addPerson() {
    const input = document.getElementById('personName');
    const name = input?.value.trim();
    
    if (name && !AppState.familyTree.people.includes(name)) {
        AppState.familyTree.people.push(name);
        populateFamilySelectors();
        
        const canvas = document.getElementById('familyCanvas');
        if (canvas) drawFamilyTree(canvas);
        
        input.value = '';
    }
}

function addRelation() {
    const parent = document.getElementById('person1')?.value;
    const child = document.getElementById('person2')?.value;
    
    if (parent && child && parent !== child) {
        AppState.familyTree.relations.push({ parent, child });
        
        const canvas = document.getElementById('familyCanvas');
        if (canvas) drawFamilyTree(canvas);
    }
}

function updateLearningTask() {
    // Clear examples when target predicate changes
    AppState.familyTree.posExamples = [];
    AppState.familyTree.negExamples = [];
    updateFamilyExamplesDisplay();
}

function addFamilyPosExample() {
    const ex1 = document.getElementById('posEx1')?.value;
    const ex2 = document.getElementById('posEx2')?.value;
    
    if (ex1 && ex2) {
        AppState.familyTree.posExamples.push([ex1, ex2]);
        updateFamilyExamplesDisplay();
    }
}

function addFamilyNegExample() {
    const ex1 = document.getElementById('negEx1')?.value;
    const ex2 = document.getElementById('negEx2')?.value;
    
    if (ex1 && ex2) {
        AppState.familyTree.negExamples.push([ex1, ex2]);
        updateFamilyExamplesDisplay();
    }
}

function updateFamilyExamplesDisplay() {
    const target = document.getElementById('targetPredicate')?.value || 'grandparent';
    
    const posContainer = document.getElementById('familyPosExamples');
    const negContainer = document.getElementById('familyNegExamples');
    
    if (posContainer) {
        posContainer.innerHTML = AppState.familyTree.posExamples.map(([a, b]) =>
            `<div class="example-item">${target}(${a}, ${b})</div>`
        ).join('');
    }
    
    if (negContainer) {
        negContainer.innerHTML = AppState.familyTree.negExamples.map(([a, b]) =>
            `<div class="example-item">${target}(${a}, ${b})</div>`
        ).join('');
    }
}

function learnFamilyRule() {
    const target = document.getElementById('targetPredicate')?.value || 'grandparent';
    const resultElement = document.getElementById('familyLearnedRule');
    
    // Simulate rule learning based on target
    let learnedRule = '';
    let explanation = '';
    
    switch (target) {
        case 'grandparent':
            learnedRule = 'grandparent(X, Z) :- parent(X, Y), parent(Y, Z).';
            explanation = 'X is grandparent of Z if X is parent of Y and Y is parent of Z';
            break;
        case 'sibling':
            learnedRule = 'sibling(X, Y) :- parent(P, X), parent(P, Y), X \\= Y.';
            explanation = 'X and Y are siblings if they share a parent and are different people';
            break;
        case 'uncle':
            learnedRule = 'uncle(X, Y) :- sibling(X, P), parent(P, Y), male(X).';
            explanation = 'X is uncle of Y if X is sibling of Y\'s parent and X is male';
            break;
        case 'ancestor':
            learnedRule = 'ancestor(X, Y) :- parent(X, Y).\nancestor(X, Z) :- parent(X, Y), ancestor(Y, Z).';
            explanation = 'Recursive definition: X is ancestor of Y directly or through intermediate ancestors';
            break;
    }
    
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="result-success">
                <div class="learned-rule-code">
                    <code>${learnedRule}</code>
                </div>
                <div class="rule-explanation">${explanation}</div>
            </div>
        `;
    }
}

// ============================================
// Pattern Learning Playground
// ============================================
function updateSequenceDisplay() {
    const container = document.getElementById('sequenceDisplay');
    if (!container) return;
    
    container.innerHTML = AppState.patternSequence.map(item =>
        `<span class="seq-item ${item.positive ? 'positive' : 'negative'}">${item.value}</span>`
    ).join('');
}

function addSequenceItem(positive) {
    const input = document.getElementById('newNumber');
    const value = parseInt(input?.value);
    
    if (!isNaN(value)) {
        AppState.patternSequence.push({ value, positive });
        updateSequenceDisplay();
        input.value = '';
    }
}

function clearSequence() {
    AppState.patternSequence = [];
    updateSequenceDisplay();
}

function learnPattern() {
    const positives = AppState.patternSequence.filter(i => i.positive).map(i => i.value);
    const negatives = AppState.patternSequence.filter(i => !i.positive).map(i => i.value);
    
    // Get enabled predicates
    const predicates = [];
    document.querySelectorAll('.predicate-toggles input:checked').forEach(cb => {
        predicates.push(cb.value);
    });
    
    // Test each predicate
    const candidateRules = [];
    
    const predicateTests = {
        even: n => n % 2 === 0,
        odd: n => n % 2 !== 0,
        prime: n => isPrime(n),
        square: n => Math.sqrt(n) % 1 === 0,
        divisible3: n => n % 3 === 0,
        greater10: n => n > 10
    };
    
    predicates.forEach(pred => {
        const test = predicateTests[pred];
        if (test) {
            const coversAllPos = positives.every(test);
            const coversNoNeg = negatives.every(n => !test(n));
            
            if (coversAllPos && coversNoNeg) {
                candidateRules.push({
                    predicate: pred,
                    score: 1.0
                });
            } else if (coversAllPos) {
                candidateRules.push({
                    predicate: pred,
                    score: 0.5,
                    note: 'covers some negatives'
                });
            }
        }
    });
    
    const resultElement = document.getElementById('patternResult');
    
    if (candidateRules.length > 0) {
        const best = candidateRules.sort((a, b) => b.score - a.score)[0];
        const predName = {
            even: 'even(X)',
            odd: 'odd(X)',
            prime: 'prime(X)',
            square: 'perfect_square(X)',
            divisible3: 'divisible_by_3(X)',
            greater10: 'greater_than_10(X)'
        };
        
        resultElement.innerHTML = `
            <div class="pattern-success">
                <div class="rule-found">
                    <span class="rule-icon">✅</span>
                    <code>positive(X) :- ${predName[best.predicate]}</code>
                </div>
                ${best.note ? `<div class="rule-note">Note: ${best.note}</div>` : ''}
            </div>
        `;
    } else {
        resultElement.innerHTML = `
            <div class="pattern-failure">
                <span class="rule-icon">❌</span>
                <span>No consistent rule found with selected predicates</span>
            </div>
        `;
    }
}

function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

function testPattern() {
    const input = document.getElementById('testNumber');
    const result = document.getElementById('testResult');
    const value = parseInt(input?.value);
    
    if (isNaN(value)) {
        result.textContent = 'Enter a valid number';
        result.className = '';
        return;
    }
    
    // Use the learned pattern (assuming even for now)
    const positives = AppState.patternSequence.filter(i => i.positive).map(i => i.value);
    const isEven = positives.every(n => n % 2 === 0);
    
    if (isEven) {
        const prediction = value % 2 === 0;
        result.textContent = prediction ? '✅ Positive (matches pattern)' : '❌ Negative';
        result.className = prediction ? 'positive' : 'negative';
    } else {
        result.textContent = '🤔 Pattern unclear';
        result.className = '';
    }
}

// ============================================
// List Manipulation Playground
// ============================================
function addIOExample() {
    const inputEl = document.getElementById('listInput');
    const outputEl = document.getElementById('listOutput');
    
    const input = inputEl?.value.trim();
    const output = outputEl?.value.trim();
    
    if (input && output) {
        const container = document.getElementById('ioExamples');
        const pair = document.createElement('div');
        pair.className = 'io-pair';
        pair.innerHTML = `
            <span class="input">${input}</span>
            <span class="arrow">→</span>
            <span class="output">${output}</span>
        `;
        container.appendChild(pair);
        
        inputEl.value = '';
        outputEl.value = '';
    }
}

function learnListProgram() {
    const examples = Array.from(document.querySelectorAll('#ioExamples .io-pair'));
    const resultElement = document.getElementById('listResult');
    
    // Analyze examples to determine the function
    let detectedFunction = 'unknown';
    
    examples.forEach(ex => {
        const input = ex.querySelector('.input')?.textContent || '';
        const output = ex.querySelector('.output')?.textContent || '';
        
        // Simple pattern detection
        if (input === '[1, 2, 3]' && output === '[3, 2, 1]') {
            detectedFunction = 'reverse';
        } else if (input === '[a, b]' && output === '[b, a]') {
            detectedFunction = 'reverse';
        }
    });
    
    let program = '';
    let explanation = '';
    
    switch (detectedFunction) {
        case 'reverse':
            program = `reverse([], []).
reverse([H|T], R) :- 
    reverse(T, RT), 
    append(RT, [H], R).`;
            explanation = 'Recursive reverse: empty list reverses to empty, otherwise reverse tail and append head';
            break;
        default:
            program = '% Unable to synthesize program\n% Need more examples';
            explanation = 'Add more consistent input/output examples';
    }
    
    resultElement.innerHTML = `
        <div class="synthesis-result">
            <h5>Synthesized Program:</h5>
            <pre><code>${program}</code></pre>
            <p class="synthesis-explanation">${explanation}</p>
        </div>
    `;
}

// ============================================
// Popper Simulator (Advanced)
// ============================================
function initializeSearchSpaceViz() {
    const canvas = document.getElementById('searchSpaceCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    drawSearchSpace(ctx);
}

function drawSearchSpace(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw grid representing hypothesis space
    const gridSize = 15;
    const cols = Math.floor(ctx.canvas.width / gridSize);
    const rows = Math.floor(ctx.canvas.height / gridSize);
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * gridSize + gridSize / 2;
            const y = j * gridSize + gridSize / 2;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
            ctx.fill();
        }
    }
}

function simStep() {
    popperStep();
}

function simRun() {
    popperRun();
}

function simReset() {
    popperReset();
    const canvas = document.getElementById('searchSpaceCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        drawSearchSpace(ctx);
    }
}

// ============================================
// Scroll Animations
// ============================================
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.content-block').forEach(block => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(20px)';
        block.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(block);
    });
    
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
        observer.observe(item);
    });
}

// ============================================
// Utility Functions
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// Export for global access
// ============================================
window.scrollToSection = scrollToSection;
window.addPositiveExample = addPositiveExample;
window.addNegativeExample = addNegativeExample;
window.addObservation = addObservation;
window.induceRule = induceRule;
window.addClause = addClause;
window.solveSAT = solveSAT;
window.dpllStep = dpllStep;
window.dpllRun = dpllRun;
window.dpllReset = dpllReset;
window.loadASPExample = loadASPExample;
window.runASP = runASP;
window.popperStep = popperStep;
window.popperRun = popperRun;
window.popperReset = popperReset;
window.addPerson = addPerson;
window.addRelation = addRelation;
window.updateLearningTask = updateLearningTask;
window.addFamilyPosExample = addFamilyPosExample;
window.addFamilyNegExample = addFamilyNegExample;
window.learnFamilyRule = learnFamilyRule;
window.addSequenceItem = addSequenceItem;
window.clearSequence = clearSequence;
window.learnPattern = learnPattern;
window.testPattern = testPattern;
window.addIOExample = addIOExample;
window.learnListProgram = learnListProgram;
window.simStep = simStep;
window.simRun = simRun;
window.simReset = simReset;

// ============================================
// Advanced Research Section - Interactive Features
// ============================================

// Toggle literal in pointless rule detector
function toggleLiteral(literal) {
    const literalSpan = document.querySelector(`.literal[data-lit="${literal}"]`);
    const resultIndicator = document.querySelector('.result-indicator');
    
    if (literalSpan) {
        literalSpan.classList.toggle('strikethrough');
        literalSpan.classList.toggle('removed');
        
        // Update result indicator
        const intLiteral = document.querySelector('.literal[data-lit="int"]');
        if (intLiteral && intLiteral.classList.contains('removed')) {
            resultIndicator.className = 'result-indicator valid-detected';
            resultIndicator.innerHTML = `
                <span class="icon">✅</span>
                <span class="text">VALID: Rule no longer contains redundant literals</span>
            `;
        } else {
            resultIndicator.className = 'result-indicator reducible-detected';
            resultIndicator.innerHTML = `
                <span class="icon">⚠️</span>
                <span class="text">REDUCIBLE: int(A) is implied by odd(A)</span>
            `;
        }
    }
}

// Initialize Symmetry Scalability Chart
function initializeSymmetryChart() {
    const canvas = document.getElementById('symmetry-scalability-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth - 40;
    const height = 300;
    
    canvas.width = width;
    canvas.height = height;
    
    // Data for the chart
    const variables = [5, 6, 7, 8, 9];
    const baselineTimes = [0.08, 1.5, 125, 1411, 3600]; // seconds
    const symmetryTimes = [0.05, 0.2, 4, 7, 17]; // seconds
    
    // Chart styling
    const padding = { top: 40, right: 40, bottom: 60, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Clear canvas
    ctx.fillStyle = '#0f0e17';
    ctx.fillRect(0, 0, width, height);
    
    // Scale functions (log scale for better visualization)
    const maxTime = Math.max(...baselineTimes);
    const xScale = (i) => padding.left + (i / (variables.length - 1)) * chartWidth;
    const yScale = (val) => {
        const logVal = Math.log10(val + 0.01);
        const logMax = Math.log10(maxTime);
        const logMin = Math.log10(0.01);
        return padding.top + chartHeight - ((logVal - logMin) / (logMax - logMin)) * chartHeight;
    };
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    [0.01, 0.1, 1, 10, 100, 1000].forEach(val => {
        const y = yScale(val);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        // Y-axis labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val >= 1 ? val + 's' : val * 1000 + 'ms', padding.left - 10, y + 4);
    });
    
    // Draw baseline line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    variables.forEach((v, i) => {
        const x = xScale(i);
        const y = yScale(baselineTimes[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw baseline points
    ctx.fillStyle = '#ef4444';
    variables.forEach((v, i) => {
        const x = xScale(i);
        const y = yScale(baselineTimes[i]);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw symmetry breaking line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    variables.forEach((v, i) => {
        const x = xScale(i);
        const y = yScale(symmetryTimes[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw symmetry breaking points
    ctx.fillStyle = '#10b981';
    variables.forEach((v, i) => {
        const x = xScale(i);
        const y = yScale(symmetryTimes[i]);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // X-axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    variables.forEach((v, i) => {
        const x = xScale(i);
        ctx.fillText(v + ' vars', x, height - padding.bottom + 25);
    });
    
    // Axis title
    ctx.fillText('Number of Variables in Rule', width / 2, height - 10);
    
    // Y-axis title
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Solving Time (log scale)', 0, 0);
    ctx.restore();
    
    // Legend
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(width - padding.right - 150, padding.top, 12, 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.textAlign = 'left';
    ctx.fillText('Baseline', width - padding.right - 132, padding.top + 10);
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(width - padding.right - 150, padding.top + 20, 12, 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Symmetry Breaking', width - padding.right - 132, padding.top + 30);
}

// Initialize pillar card interactions
function initializePillarCards() {
    const pillarCards = document.querySelectorAll('.pillar-card');
    
    pillarCards.forEach(card => {
        card.addEventListener('click', () => {
            const paper = card.dataset.paper;
            const section = document.getElementById(paper + '-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Animate accuracy bars on scroll
function animateAccuracyBars() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });
}

// Initialize Advanced Research section
function initializeAdvancedResearch() {
    initializeSymmetryChart();
    initializePillarCards();
    
    // Observe accuracy comparison for animation
    const accuracySection = document.querySelector('.accuracy-comparison');
    if (accuracySection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateAccuracyBars();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(accuracySection);
    }
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the main initialization to complete
    setTimeout(initializeAdvancedResearch, 500);
});

// Export new functions
window.toggleLiteral = toggleLiteral;
window.initializeSymmetryChart = initializeSymmetryChart;

// ============================================
// Advanced Popper Simulator - Graph Visualization
// ============================================

const PopperSimState = {
    nodes: [],
    edges: [],
    currentStep: 0,
    currentNodeIndex: -1,
    running: false,
    runInterval: null,
    solutionFound: false,
    
    // Statistics
    stats: {
        hypothesesTested: 0,
        constraintsLearned: 0,
        prunedTotal: 0,
        prunedGen: 0,
        prunedSpec: 0,
        prunedReducer: 0,
        prunedSymmetry: 0,
        remaining: 64
    },
    
    // Constraints learned
    constraints: [],
    
    // Hypothesis definitions (simplified for visualization)
    hypotheses: [
        // Level 0 (most general)
        { id: 0, rule: "gp(X,Y) ← true", level: 0, status: 'unexplored' },
        
        // Level 1
        { id: 1, rule: "gp(X,Y) ← parent(X,_)", level: 1, status: 'unexplored' },
        { id: 2, rule: "gp(X,Y) ← parent(_,Y)", level: 1, status: 'unexplored' },
        { id: 3, rule: "gp(X,Y) ← parent(X,Y)", level: 1, status: 'unexplored', symmetryPrune: true },
        
        // Level 2
        { id: 4, rule: "gp(X,Y) ← parent(X,Z), parent(Z,_)", level: 2, status: 'unexplored' },
        { id: 5, rule: "gp(X,Y) ← parent(X,Z), parent(_,Y)", level: 2, status: 'unexplored' },
        { id: 6, rule: "gp(X,Y) ← parent(X,Z), parent(Z,Y)", level: 2, status: 'unexplored', isSolution: true },
        { id: 7, rule: "gp(X,Y) ← parent(X,Z), parent(Y,Z)", level: 2, status: 'unexplored', reducerPrune: true },
        { id: 8, rule: "gp(X,Y) ← parent(Z,X), parent(Z,Y)", level: 2, status: 'unexplored', symmetryPrune: true },
        { id: 9, rule: "gp(X,Y) ← parent(X,Z), int(Z)", level: 2, status: 'unexplored', reducerPrune: true },
        
        // Level 3
        { id: 10, rule: "gp(X,Y) ← parent(X,Z), parent(Z,Y), parent(X,_)", level: 3, status: 'unexplored' },
        { id: 11, rule: "gp(X,Y) ← parent(X,Z), parent(Z,Y), parent(_,Y)", level: 3, status: 'unexplored' },
        { id: 12, rule: "gp(X,Y) ← parent(X,Z), parent(Z,W), parent(W,Y)", level: 3, status: 'unexplored' },
        { id: 13, rule: "gp(X,Y) ← parent(X,Z), parent(Z,Y), odd(Z)", level: 3, status: 'unexplored', reducerPrune: true },
        { id: 14, rule: "gp(X,Y) ← parent(Z,X), parent(W,Y), parent(Z,W)", level: 3, status: 'unexplored', symmetryPrune: true },
        { id: 15, rule: "gp(X,Y) ← parent(X,Z), parent(Y,W), gt(Z,W)", level: 3, status: 'unexplored' },
    ],
    
    // Edge definitions (parent -> child in lattice)
    edgeDefs: [
        [0, 1], [0, 2], [0, 3],
        [1, 4], [1, 5], [1, 6], [1, 7],
        [2, 5], [2, 6], [2, 8],
        [3, 6], [3, 7],
        [4, 10], [4, 12],
        [5, 10], [5, 11],
        [6, 10], [6, 11], [6, 12], [6, 13],
        [7, 13], [7, 15],
        [8, 14],
        [9, 13]
    ],
    
    // Search order (simulating ASP solver)
    searchOrder: [0, 1, 2, 4, 5, 6]
};

function initializeAdvancedPopper() {
    const canvas = document.getElementById('hypothesisLatticeCanvas');
    if (!canvas) return;
    
    // Skip if already initialized with valid dimensions
    if (canvas.dataset.initialized === 'true' && canvas.width > 100) return;
    
    // Set canvas size - use fixed width if container is hidden
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    canvas.width = containerWidth > 100 ? containerWidth : 800;
    canvas.height = 500;
    
    // Initialize node positions
    calculateNodePositions(canvas);
    
    // Draw initial state
    drawPopperLattice(canvas);
    
    // Mark as initialized
    canvas.dataset.initialized = 'true';
    
    // Setup speed slider (only once)
    const speedSlider = document.getElementById('simSpeedSlider');
    if (speedSlider && !speedSlider.dataset.initialized) {
        speedSlider.addEventListener('input', (e) => {
            document.getElementById('speedLabel').textContent = e.target.value + 'ms';
        });
        speedSlider.dataset.initialized = 'true';
    }
    
    // Setup optimization toggles (only once)
    document.querySelectorAll('.toggle-item input').forEach(input => {
        if (!input.dataset.initialized) {
            input.addEventListener('change', () => {
                input.closest('.toggle-item').classList.toggle('active', input.checked);
            });
            input.dataset.initialized = 'true';
        }
    });
    
    // Setup intersection observer to re-initialize when section becomes visible
    const section = document.getElementById('advanced');
    if (section && !section.dataset.observerSet) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Re-initialize when section becomes visible
                    const newWidth = container.clientWidth;
                    if (newWidth > 100 && (canvas.width < 100 || canvas.dataset.initialized !== 'true')) {
                        canvas.width = newWidth;
                        calculateNodePositions(canvas);
                        drawPopperLattice(canvas);
                        canvas.dataset.initialized = 'true';
                    }
                }
            });
        }, { threshold: 0.1 });
        observer.observe(section);
        section.dataset.observerSet = 'true';
    }
}

function calculateNodePositions(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 50, bottom: 50, left: 60, right: 60 };
    
    // Group nodes by level
    const levels = {};
    PopperSimState.hypotheses.forEach(h => {
        if (!levels[h.level]) levels[h.level] = [];
        levels[h.level].push(h);
    });
    
    const numLevels = Object.keys(levels).length;
    const levelHeight = (height - padding.top - padding.bottom) / (numLevels - 1);
    
    // Position nodes
    PopperSimState.nodes = PopperSimState.hypotheses.map(h => {
        const levelNodes = levels[h.level];
        const index = levelNodes.indexOf(h);
        const levelWidth = width - padding.left - padding.right;
        const nodeSpacing = levelWidth / (levelNodes.length + 1);
        
        return {
            ...h,
            x: padding.left + nodeSpacing * (index + 1),
            y: padding.top + h.level * levelHeight,
            radius: 18
        };
    });
    
    // Create edge objects
    PopperSimState.edges = PopperSimState.edgeDefs.map(([from, to]) => ({
        from: PopperSimState.nodes.find(n => n.id === from),
        to: PopperSimState.nodes.find(n => n.id === to)
    })).filter(e => e.from && e.to);
}

function drawPopperLattice(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges first
    PopperSimState.edges.forEach(edge => {
        drawPopperEdge(ctx, edge);
    });
    
    // Draw nodes
    PopperSimState.nodes.forEach(node => {
        drawPopperNode(ctx, node);
    });
    
    // Draw level labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'left';
    const levels = [0, 1, 2, 3];
    levels.forEach(level => {
        const node = PopperSimState.nodes.find(n => n.level === level);
        if (node) {
            ctx.fillText(`Level ${level}`, 10, node.y + 4);
        }
    });
}

function drawPopperEdge(ctx, edge) {
    const { from, to } = edge;
    
    ctx.beginPath();
    ctx.moveTo(from.x, from.y + from.radius);
    ctx.lineTo(to.x, to.y - to.radius);
    
    // Edge color based on node states
    if (to.status === 'pruned' || to.status === 'pruned-reducer' || to.status === 'pruned-symmetry') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.setLineDash([4, 4]);
    } else if (from.status === 'solution' || to.status === 'solution') {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
        ctx.setLineDash([]);
    } else {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.setLineDash([]);
    }
    
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawPopperNode(ctx, node) {
    const { x, y, radius, status } = node;
    
    // Node colors based on status
    const colors = {
        'unexplored': { fill: 'rgba(99, 102, 241, 0.3)', stroke: 'rgba(99, 102, 241, 0.6)' },
        'current': { fill: '#fbbf24', stroke: '#f59e0b' },
        'tested': { fill: 'rgba(156, 163, 175, 0.4)', stroke: 'rgba(156, 163, 175, 0.7)' },
        'too-general': { fill: 'rgba(249, 115, 22, 0.5)', stroke: 'rgba(249, 115, 22, 0.8)' },
        'too-specific': { fill: 'rgba(139, 92, 246, 0.5)', stroke: 'rgba(139, 92, 246, 0.8)' },
        'pruned': { fill: 'rgba(239, 68, 68, 0.3)', stroke: 'rgba(239, 68, 68, 0.5)' },
        'pruned-reducer': { fill: 'rgba(6, 182, 212, 0.3)', stroke: 'rgba(6, 182, 212, 0.6)' },
        'pruned-symmetry': { fill: 'rgba(236, 72, 153, 0.3)', stroke: 'rgba(236, 72, 153, 0.6)' },
        'solution': { fill: '#10b981', stroke: '#059669' }
    };
    
    const color = colors[status] || colors['unexplored'];
    
    // Draw glow for current and solution nodes
    if (status === 'current' || status === 'solution') {
        ctx.beginPath();
        ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
        const glowColor = status === 'solution' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(251, 191, 36, 0.4)';
        ctx.fillStyle = glowColor;
        ctx.fill();
    }
    
    // Draw node circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color.fill;
    ctx.fill();
    ctx.strokeStyle = color.stroke;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw node ID
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`H${node.id}`, x, y);
}

function advancedSimStep() {
    if (PopperSimState.solutionFound) return;
    
    const canvas = document.getElementById('hypothesisLatticeCanvas');
    if (!canvas) return;
    
    PopperSimState.currentStep++;
    
    // Get current search index
    const searchIdx = PopperSimState.stats.hypothesesTested;
    
    if (searchIdx >= PopperSimState.searchOrder.length) {
        // Search complete without solution (shouldn't happen in our demo)
        return;
    }
    
    const nodeId = PopperSimState.searchOrder[searchIdx];
    const node = PopperSimState.nodes.find(n => n.id === nodeId);
    const hyp = PopperSimState.hypotheses.find(h => h.id === nodeId);
    
    if (!node || !hyp) return;
    
    // Reset previous current node
    PopperSimState.nodes.forEach(n => {
        if (n.status === 'current') n.status = 'tested';
    });
    
    // Check for REDUCER optimization
    const reducerEnabled = document.getElementById('optReducer')?.checked;
    const symmetryEnabled = document.getElementById('optSymmetry')?.checked;
    
    if (reducerEnabled && hyp.reducerPrune) {
        node.status = 'pruned-reducer';
        PopperSimState.stats.prunedReducer++;
        PopperSimState.stats.prunedTotal++;
        PopperSimState.stats.remaining--;
        addConstraint('reducer', `Pointless: ${hyp.rule}`);
        addLogEntry('reducer', `REDUCER: Pruned H${nodeId} - rule contains implied literal`);
        document.getElementById('reducerStat').textContent = PopperSimState.stats.prunedReducer + ' pruned';
        updateStats();
        drawPopperLattice(canvas);
        // Move to next
        PopperSimState.stats.hypothesesTested++;
        return;
    }
    
    if (symmetryEnabled && hyp.symmetryPrune) {
        node.status = 'pruned-symmetry';
        PopperSimState.stats.prunedSymmetry++;
        PopperSimState.stats.prunedTotal++;
        PopperSimState.stats.remaining--;
        addConstraint('symmetry', `Body-variant of H${nodeId-1}`);
        addLogEntry('symmetry', `SYMMETRY: Pruned H${nodeId} - body-variant of earlier hypothesis`);
        document.getElementById('symmetryStat').textContent = PopperSimState.stats.prunedSymmetry + ' pruned';
        updateStats();
        drawPopperLattice(canvas);
        // Move to next
        PopperSimState.stats.hypothesesTested++;
        return;
    }
    
    // Set as current
    node.status = 'current';
    PopperSimState.currentNodeIndex = nodeId;
    PopperSimState.stats.hypothesesTested++;
    
    // Update hypothesis display
    updateHypothesisDisplay(hyp);
    
    // Evaluate hypothesis
    setTimeout(() => {
        evaluateHypothesis(canvas, node, hyp);
    }, 200);
    
    drawPopperLattice(canvas);
    updateStats();
}

function evaluateHypothesis(canvas, node, hyp) {
    // Determine outcome based on the hypothesis
    let outcome;
    let coversPos, coversNeg;
    
    if (hyp.isSolution) {
        outcome = 'solution';
        coversPos = 3;
        coversNeg = 0;
    } else if (hyp.level === 0) {
        outcome = 'too-general';
        coversPos = 3;
        coversNeg = 2;
    } else if (hyp.level === 1 && hyp.id === 1) {
        outcome = 'too-general';
        coversPos = 3;
        coversNeg = 1;
    } else if (hyp.level === 1 && hyp.id === 2) {
        outcome = 'too-general';
        coversPos = 3;
        coversNeg = 2;
    } else if (hyp.level === 2 && (hyp.id === 4 || hyp.id === 5)) {
        outcome = 'too-general';
        coversPos = 3;
        coversNeg = 1;
    } else {
        outcome = 'too-specific';
        coversPos = 1;
        coversNeg = 0;
    }
    
    // Update evaluation display
    document.getElementById('evalPosCount').textContent = `${coversPos}/3`;
    document.getElementById('evalNegCount').textContent = `${coversNeg}/2`;
    
    const evalStatus = document.getElementById('evalStatus');
    evalStatus.textContent = outcome === 'solution' ? 'SUCCESS!' : 
                             outcome === 'too-general' ? 'Too General' : 'Too Specific';
    evalStatus.className = 'eval-status ' + outcome.replace('-', '');
    
    if (outcome === 'solution') {
        node.status = 'solution';
        PopperSimState.solutionFound = true;
        addLogEntry('success', `✓ SOLUTION FOUND: ${hyp.rule}`);
        showSolution(hyp);
        
        if (PopperSimState.runInterval) {
            clearInterval(PopperSimState.runInterval);
            PopperSimState.runInterval = null;
            document.getElementById('btnSimRun').style.display = 'inline-flex';
            document.getElementById('btnSimPause').style.display = 'none';
        }
    } else if (outcome === 'too-general') {
        node.status = 'too-general';
        PopperSimState.stats.constraintsLearned++;
        PopperSimState.stats.prunedGen += 2;
        PopperSimState.stats.prunedTotal += 2;
        PopperSimState.stats.remaining -= 2;
        addConstraint('generalization', `¬specializations(H${node.id})`);
        addLogEntry('constraint', `H${node.id}: Too general → Specialization constraint`);
        
        // Prune children (mark them)
        pruneChildren(node.id);
    } else {
        node.status = 'too-specific';
        PopperSimState.stats.constraintsLearned++;
        PopperSimState.stats.prunedSpec += 1;
        PopperSimState.stats.prunedTotal += 1;
        PopperSimState.stats.remaining -= 1;
        addConstraint('specialization', `¬generalizations(H${node.id})`);
        addLogEntry('constraint', `H${node.id}: Too specific → Generalization constraint`);
    }
    
    drawPopperLattice(canvas);
    updateStats();
}

function pruneChildren(parentId) {
    PopperSimState.edges.forEach(edge => {
        if (edge.from.id === parentId && edge.to.status === 'unexplored') {
            edge.to.status = 'pruned';
        }
    });
}

function updateHypothesisDisplay(hyp) {
    const display = document.getElementById('currentHypDisplay');
    display.innerHTML = `
        <div class="hyp-id">H${hyp.id}</div>
        <div class="hyp-rule">${hyp.rule}</div>
    `;
    
    const evalStatus = document.getElementById('evalStatus');
    evalStatus.textContent = 'Testing...';
    evalStatus.className = 'eval-status testing';
}

function updateStats() {
    const stats = PopperSimState.stats;
    const total = 64;
    const prunedPercent = Math.round((stats.prunedTotal / total) * 100);
    
    document.getElementById('statHypTested').textContent = stats.hypothesesTested;
    document.getElementById('statConstraints').textContent = stats.constraintsLearned;
    document.getElementById('statPruned').textContent = prunedPercent + '%';
    document.getElementById('statRemaining').textContent = Math.max(0, stats.remaining);
    
    // Update breakdown bars (max 30 for visualization)
    const maxBar = 30;
    document.getElementById('barGen').style.width = Math.min(100, (stats.prunedGen / maxBar) * 100) + '%';
    document.getElementById('barSpec').style.width = Math.min(100, (stats.prunedSpec / maxBar) * 100) + '%';
    document.getElementById('barReducer').style.width = Math.min(100, (stats.prunedReducer / maxBar) * 100) + '%';
    document.getElementById('barSymmetry').style.width = Math.min(100, (stats.prunedSymmetry / maxBar) * 100) + '%';
    
    document.getElementById('valGen').textContent = stats.prunedGen;
    document.getElementById('valSpec').textContent = stats.prunedSpec;
    document.getElementById('valReducer').textContent = stats.prunedReducer;
    document.getElementById('valSymmetry').textContent = stats.prunedSymmetry;
}

function addConstraint(type, text) {
    const list = document.getElementById('constraintsList');
    const empty = list.querySelector('.constraint-empty');
    if (empty) empty.remove();
    
    const icons = {
        'generalization': '↓',
        'specialization': '↑',
        'reducer': '✂',
        'symmetry': '⚖'
    };
    
    const item = document.createElement('div');
    item.className = `constraint-item ${type}`;
    item.innerHTML = `
        <span class="constraint-icon">${icons[type] || '•'}</span>
        <span class="constraint-text">${text}</span>
    `;
    list.appendChild(item);
    list.scrollTop = list.scrollHeight;
}

function addLogEntry(type, message) {
    const log = document.getElementById('executionLog');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `
        <span class="log-step">${PopperSimState.currentStep}</span>
        <span class="log-msg">${message}</span>
    `;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function showSolution(hyp) {
    const panel = document.getElementById('solutionPanel');
    panel.style.display = 'block';
    
    document.getElementById('solutionCode').textContent = 
        'grandparent(X,Y) ← parent(X,Z), parent(Z,Y).';
    document.getElementById('solutionSteps').textContent = PopperSimState.stats.hypothesesTested;
    document.getElementById('solutionPruned').textContent = 
        Math.round((PopperSimState.stats.prunedTotal / 64) * 100) + '%';
    
    // Check for MAXREFACTOR
    if (document.getElementById('optRefactor')?.checked) {
        document.getElementById('refactorSection').style.display = 'block';
        document.getElementById('refactoredCode').textContent = 
            '% Already optimal (single rule, no redundancy)\ngrandparent(X,Y) ← parent(X,Z), parent(Z,Y).';
    }
}

function advancedSimRun() {
    if (PopperSimState.solutionFound) return;
    
    const speed = parseInt(document.getElementById('simSpeedSlider')?.value || 500);
    
    document.getElementById('btnSimRun').style.display = 'none';
    document.getElementById('btnSimPause').style.display = 'inline-flex';
    
    PopperSimState.running = true;
    PopperSimState.runInterval = setInterval(() => {
        if (PopperSimState.solutionFound || !PopperSimState.running) {
            clearInterval(PopperSimState.runInterval);
            PopperSimState.runInterval = null;
            document.getElementById('btnSimRun').style.display = 'inline-flex';
            document.getElementById('btnSimPause').style.display = 'none';
            return;
        }
        advancedSimStep();
    }, speed);
}

function advancedSimPause() {
    PopperSimState.running = false;
    if (PopperSimState.runInterval) {
        clearInterval(PopperSimState.runInterval);
        PopperSimState.runInterval = null;
    }
    document.getElementById('btnSimRun').style.display = 'inline-flex';
    document.getElementById('btnSimPause').style.display = 'none';
}

function advancedSimReset() {
    // Stop any running simulation
    advancedSimPause();
    
    // Reset state
    PopperSimState.currentStep = 0;
    PopperSimState.currentNodeIndex = -1;
    PopperSimState.solutionFound = false;
    PopperSimState.stats = {
        hypothesesTested: 0,
        constraintsLearned: 0,
        prunedTotal: 0,
        prunedGen: 0,
        prunedSpec: 0,
        prunedReducer: 0,
        prunedSymmetry: 0,
        remaining: 64
    };
    PopperSimState.constraints = [];
    
    // Reset all nodes
    PopperSimState.nodes.forEach(n => {
        n.status = 'unexplored';
    });
    PopperSimState.hypotheses.forEach(h => {
        h.status = 'unexplored';
    });
    
    // Reset UI
    document.getElementById('currentHypDisplay').innerHTML = 
        '<div class="hyp-empty">Click "Step" to begin exploration</div>';
    document.getElementById('evalPosCount').textContent = '—';
    document.getElementById('evalNegCount').textContent = '—';
    document.getElementById('evalStatus').textContent = 'Waiting';
    document.getElementById('evalStatus').className = 'eval-status';
    
    document.getElementById('constraintsList').innerHTML = 
        '<div class="constraint-empty">No constraints yet</div>';
    
    document.getElementById('executionLog').innerHTML = `
        <div class="log-entry info">
            <span class="log-step">—</span>
            <span class="log-msg">Popper simulator reset. Ready to explore hypothesis space.</span>
        </div>
    `;
    
    document.getElementById('solutionPanel').style.display = 'none';
    document.getElementById('refactorSection').style.display = 'none';
    
    document.getElementById('reducerStat').textContent = '0 pruned';
    document.getElementById('symmetryStat').textContent = '0 pruned';
    
    // Redraw
    const canvas = document.getElementById('hypothesisLatticeCanvas');
    if (canvas) {
        drawPopperLattice(canvas);
    }
    updateStats();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initial attempt after 600ms
    setTimeout(initializeAdvancedPopper, 600);
    // Retry after 1500ms in case first attempt failed due to layout
    setTimeout(initializeAdvancedPopper, 1500);
});

// Export functions
window.advancedSimStep = advancedSimStep;
window.advancedSimRun = advancedSimRun;
window.advancedSimPause = advancedSimPause;
window.advancedSimReset = advancedSimReset;

// ============================================
// PhD-Level Interactive Demos
// ============================================

// ==========================================
// 1. REDUCER: Pointless Rule Detection Demo
// ==========================================

const ReducerDemoState = {
    backgroundKnowledge: {
        'odd_implies_int': { active: true, description: 'odd(X) → int(X)' },
        'even_implies_int': { active: true, description: 'even(X) → int(X)' },
        'prime_implies_int': { active: true, description: 'prime(X) → int(X)' },
        'gt_transitive': { active: true, description: 'gt(A,B) ∧ gt(B,C) → gt(A,C)' },
        'succ_implies_int': { active: true, description: 'succ(X,Y) → int(X) ∧ int(Y)' }
    },
    currentRule: {
        head: 'f(A)',
        body: ['odd(A)', 'int(A)', 'gt(A,3)']
    },
    negativeExamples: ['f(1)', 'f(2)', 'f(3)']
};

function initReducerDemo() {
    const container = document.getElementById('reducerDemoContainer');
    if (!container) return;
    
    renderReducerDemo();
}

function analyzePointlessRule() {
    const { currentRule, backgroundKnowledge, negativeExamples } = ReducerDemoState;
    const results = {
        isReducible: false,
        reducibleLiteral: null,
        reducibleReason: null,
        isIndiscriminate: false,
        indiscriminateLiteral: null,
        indiscriminateReason: null,
        capturedLiterals: []
    };
    
    // Check which literals are captured
    const headVars = extractVars(currentRule.head);
    const allBodyVars = new Set();
    currentRule.body.forEach(lit => extractVars(lit).forEach(v => allBodyVars.add(v)));
    
    currentRule.body.forEach(literal => {
        const litVars = extractVars(literal);
        const otherVars = new Set();
        currentRule.body.filter(l => l !== literal).forEach(l => 
            extractVars(l).forEach(v => otherVars.add(v))
        );
        headVars.forEach(v => otherVars.add(v));
        
        const isCaptured = litVars.every(v => otherVars.has(v));
        if (isCaptured) {
            results.capturedLiterals.push(literal);
        }
    });
    
    // Check for reducibility
    if (currentRule.body.includes('odd(A)') && currentRule.body.includes('int(A)')) {
        if (backgroundKnowledge['odd_implies_int'].active) {
            results.isReducible = true;
            results.reducibleLiteral = 'int(A)';
            results.reducibleReason = 'odd(A) implies int(A) via background knowledge';
        }
    }
    
    if (currentRule.body.includes('even(A)') && currentRule.body.includes('int(A)')) {
        if (backgroundKnowledge['even_implies_int'].active) {
            results.isReducible = true;
            results.reducibleLiteral = 'int(A)';
            results.reducibleReason = 'even(A) implies int(A) via background knowledge';
        }
    }
    
    // Check for indiscriminate literals
    if (currentRule.body.includes('lt(A,10)') && negativeExamples.every(e => {
        const num = parseInt(e.match(/\d+/)?.[0] || '0');
        return num < 10;
    })) {
        results.isIndiscriminate = true;
        results.indiscriminateLiteral = 'lt(A,10)';
        results.indiscriminateReason = 'lt(A,10) is true for ALL negative examples, cannot discriminate';
    }
    
    return results;
}

function extractVars(literal) {
    const matches = literal.match(/[A-Z]/g) || [];
    return [...new Set(matches)];
}

function toggleReducerLiteral(literal) {
    const idx = ReducerDemoState.currentRule.body.indexOf(literal);
    if (idx >= 0) {
        ReducerDemoState.currentRule.body.splice(idx, 1);
    } else {
        ReducerDemoState.currentRule.body.push(literal);
    }
    updateReducerAnalysis();
}

function updateReducerAnalysis() {
    const analysis = analyzePointlessRule();
    const resultDiv = document.getElementById('reducerAnalysisResult');
    if (!resultDiv) return;
    
    let html = '<div class="analysis-details">';
    
    // Show captured literals
    html += '<div class="analysis-section captured-section">';
    html += '<h5>Captured Literals Analysis</h5>';
    html += '<p class="definition-reminder">A literal l is <em>r-captured</em> if vars(l) ⊆ vars(head) ∪ vars(body∖{l})</p>';
    html += '<div class="captured-list">';
    ReducerDemoState.currentRule.body.forEach(lit => {
        const isCaptured = analysis.capturedLiterals.includes(lit);
        html += `<div class="captured-item ${isCaptured ? 'is-captured' : 'not-captured'}">
            <code>${lit}</code>
            <span class="capture-status">${isCaptured ? '✓ Captured' : '✗ Not captured'}</span>
        </div>`;
    });
    html += '</div></div>';
    
    // Show reducibility check
    html += '<div class="analysis-section reducibility-section">';
    html += '<h5>Reducibility Check (Proposition 1)</h5>';
    if (analysis.isReducible) {
        html += `<div class="result-box reducible">
            <span class="result-icon">🔄</span>
            <div class="result-content">
                <strong>REDUCIBLE</strong>
                <p><code>${analysis.reducibleLiteral}</code> is implied by other body literals</p>
                <p class="reason">${analysis.reducibleReason}</p>
                <p class="pruning-note">⚡ All specializations of this rule are also reducible (Proposition 1)</p>
            </div>
        </div>`;
    } else {
        html += '<div class="result-box not-reducible">Not reducible - no literal implied by others</div>';
    }
    html += '</div>';
    
    // Show indiscriminate check
    html += '<div class="analysis-section indiscriminate-section">';
    html += '<h5>Indiscriminate Check (Proposition 3)</h5>';
    html += `<p class="neg-examples">E⁻ = {${ReducerDemoState.negativeExamples.join(', ')}}</p>`;
    if (analysis.isIndiscriminate) {
        html += `<div class="result-box indiscriminate">
            <span class="result-icon">⚖️</span>
            <div class="result-content">
                <strong>INDISCRIMINATE</strong>
                <p><code>${analysis.indiscriminateLiteral}</code> cannot discriminate against negatives</p>
                <p class="reason">${analysis.indiscriminateReason}</p>
                <p class="pruning-note">⚡ All specializations are also indiscriminate (Proposition 3)</p>
            </div>
        </div>`;
    } else {
        html += '<div class="result-box not-indiscriminate">Not indiscriminate - all literals can potentially discriminate</div>';
    }
    html += '</div>';
    
    // Final verdict
    html += '<div class="analysis-section verdict-section">';
    const isPointless = analysis.isReducible || analysis.isIndiscriminate;
    html += `<div class="verdict ${isPointless ? 'pointless' : 'valid'}">
        <h5>${isPointless ? '❌ POINTLESS RULE' : '✓ VALID RULE'}</h5>
        ${isPointless ? '<p>By Corollary 1: This rule cannot be in an optimal hypothesis. REDUCER prunes it and all specializations.</p>' : '<p>This rule may be part of an optimal hypothesis.</p>'}
    </div>`;
    html += '</div>';
    
    html += '</div>';
    resultDiv.innerHTML = html;
}

// ==========================================
// 2. Symmetry Breaking: Safe Variables Demo
// ==========================================

const SymmetryDemoState = {
    rules: [
        {
            id: 1,
            text: 'h(A,B) ← p(A,C), p(B,D), p(C,E)',
            variables: ['A', 'B', 'C', 'D', 'E'],
            literals: [
                { pred: 'p', args: ['A', 'C'], order: 1 },
                { pred: 'p', args: ['B', 'D'], order: 2 },
                { pred: 'p', args: ['C', 'E'], order: 3 }
            ]
        },
        {
            id: 2,
            text: 'h(A,B) ← p(A,E), p(B,C), p(C,D)',
            variables: ['A', 'B', 'C', 'D', 'E'],
            literals: [
                { pred: 'p', args: ['A', 'E'], order: 1 },
                { pred: 'p', args: ['B', 'C'], order: 2 },
                { pred: 'p', args: ['C', 'D'], order: 3 }
            ]
        }
    ],
    selectedRule: 0
};

function analyzeSymmetry(rule) {
    const varOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const analysis = {
        literals: [],
        unsafeVars: [],
        isSafe: true
    };
    
    rule.literals.forEach((lit, idx) => {
        const litAnalysis = {
            literal: `${lit.pred}(${lit.args.join(',')})`,
            args: lit.args,
            skipped: [],
            witnessed: [],
            unwitnessed: []
        };
        
        // Calculate skipped variables
        const sortedArgs = [...lit.args].sort((a, b) => varOrder.indexOf(a) - varOrder.indexOf(b));
        if (sortedArgs.length >= 2) {
            const minIdx = varOrder.indexOf(sortedArgs[0]);
            const maxIdx = varOrder.indexOf(sortedArgs[sortedArgs.length - 1]);
            for (let i = minIdx + 1; i < maxIdx; i++) {
                const skippedVar = varOrder[i];
                if (!lit.args.includes(skippedVar)) {
                    litAnalysis.skipped.push(skippedVar);
                }
            }
        }
        
        // Check if skipped variables are witnessed
        litAnalysis.skipped.forEach(skipVar => {
            let isWitnessed = false;
            let witnessingLit = null;
            
            // Check earlier literals
            for (let j = 0; j < idx; j++) {
                const earlierLit = rule.literals[j];
                if (earlierLit.args.includes(skipVar)) {
                    // Check lexicographic ordering
                    const earlierSorted = [...earlierLit.args].sort();
                    const currentSorted = [...lit.args].sort();
                    if (earlierSorted.join('') < currentSorted.join('')) {
                        isWitnessed = true;
                        witnessingLit = `${earlierLit.pred}(${earlierLit.args.join(',')})`;
                        break;
                    }
                }
            }
            
            if (isWitnessed) {
                litAnalysis.witnessed.push({ var: skipVar, by: witnessingLit });
            } else {
                litAnalysis.unwitnessed.push(skipVar);
                analysis.unsafeVars.push(skipVar);
                analysis.isSafe = false;
            }
        });
        
        analysis.literals.push(litAnalysis);
    });
    
    return analysis;
}

function renderSymmetryAnalysis() {
    const container = document.getElementById('symmetryAnalysisContainer');
    if (!container) return;
    
    let html = '<div class="symmetry-analysis-grid">';
    
    SymmetryDemoState.rules.forEach((rule, idx) => {
        const analysis = analyzeSymmetry(rule);
        
        html += `<div class="rule-analysis-card ${analysis.isSafe ? 'safe' : 'unsafe'}">
            <h5>Rule ${rule.id}</h5>
            <pre class="rule-code">${rule.text}</pre>
            
            <div class="literal-analysis">
                <h6>Literal-by-Literal Analysis</h6>
                ${analysis.literals.map(lit => `
                    <div class="literal-row">
                        <code>${lit.literal}</code>
                        <div class="analysis-details">
                            ${lit.skipped.length > 0 ? 
                                `<div class="skipped">Skipped: {${lit.skipped.join(', ')}}</div>` : 
                                '<div class="skipped none">No skipped variables</div>'}
                            ${lit.witnessed.map(w => 
                                `<div class="witnessed">✓ ${w.var} witnessed by ${w.by}</div>`
                            ).join('')}
                            ${lit.unwitnessed.map(v => 
                                `<div class="unwitnessed">✗ ${v} NOT witnessed</div>`
                            ).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="verdict ${analysis.isSafe ? 'safe' : 'unsafe'}">
                ${analysis.isSafe ? 
                    '✓ ALL VARIABLES SAFE - Keep this rule' : 
                    `✗ UNSAFE VARIABLES: {${analysis.unsafeVars.join(', ')}} - Prune this rule`}
            </div>
            
            ${!analysis.isSafe ? `
                <div class="soundness-note">
                    <strong>Proposition 2 (Soundness):</strong> A body-variant with safe variables exists, 
                    so pruning this rule doesn't lose solutions.
                </div>
            ` : ''}
        </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ==========================================
// 3. MAXREFACTOR: Knowledge Compression Demo
// ==========================================

const RefactorDemoState = {
    originalProgram: [
        { head: 'g(A)', body: ['p(A)', 'q(A,B)', 'r(B)', 's(A,B)'] },
        { head: 'g(A)', body: ['p(A)', 'q(A,B)', 'r(B)', 't(A,B)'] },
        { head: 'g(A)', body: ['p(B)', 'q(B,C)', 'r(C)', 'w(A,B)'] },
        { head: 'g(A)', body: ['p(A)', 'q(B,A)', 'r(A)', 'z(A,B)'] }
    ],
    inventedRules: [],
    refactoredProgram: [],
    originalSize: 20,
    refactoredSize: 20
};

function calculateProgramSize(rules) {
    return rules.reduce((sum, rule) => sum + rule.body.length + 1, 0);
}

function findCommonPattern() {
    // Simplified pattern detection
    const patterns = {};
    RefactorDemoState.originalProgram.forEach(rule => {
        for (let i = 0; i < rule.body.length - 2; i++) {
            for (let j = i + 1; j < rule.body.length - 1; j++) {
                for (let k = j + 1; k < rule.body.length; k++) {
                    const pattern = [rule.body[i], rule.body[j], rule.body[k]].join(';');
                    patterns[pattern] = (patterns[pattern] || 0) + 1;
                }
            }
        }
    });
    
    // Find most common pattern
    let bestPattern = null;
    let bestCount = 0;
    Object.entries(patterns).forEach(([pattern, count]) => {
        if (count > bestCount) {
            bestCount = count;
            bestPattern = pattern;
        }
    });
    
    return { pattern: bestPattern, count: bestCount };
}

function applyRefactoring() {
    // Apply the pre-computed optimal refactoring
    RefactorDemoState.inventedRules = [
        { head: 'aux(A,B,C)', body: ['p(A)', 'q(B,C)', 'r(C)'] }
    ];
    
    RefactorDemoState.refactoredProgram = [
        { head: 'g(A)', body: ['aux(A,A,B)', 's(A,B)'] },
        { head: 'g(A)', body: ['aux(A,A,B)', 't(A,B)'] },
        { head: 'g(A)', body: ['aux(B,B,C)', 'w(A,B)'] },
        { head: 'g(A)', body: ['aux(A,B,A)', 'z(A,B)'] }
    ];
    
    RefactorDemoState.refactoredSize = calculateProgramSize(
        [...RefactorDemoState.inventedRules, ...RefactorDemoState.refactoredProgram]
    );
    
    renderRefactorResult();
}

function renderRefactorResult() {
    const container = document.getElementById('refactorResultContainer');
    if (!container) return;
    
    const compression = ((RefactorDemoState.originalSize - RefactorDemoState.refactoredSize) / 
                         RefactorDemoState.originalSize * 100).toFixed(1);
    
    let html = `
        <div class="refactor-comparison">
            <div class="program-panel original">
                <h5>Original Program P₁</h5>
                <div class="program-stats">Size: ${RefactorDemoState.originalSize} literals</div>
                <div class="rules-list">
                    ${RefactorDemoState.originalProgram.map(r => 
                        `<div class="rule">${r.head} ← ${r.body.join(', ')}</div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="refactor-arrow">
                <span class="arrow">→</span>
                <span class="compression">-${compression}%</span>
            </div>
            
            <div class="program-panel refactored">
                <h5>Refactored Program P₃</h5>
                <div class="program-stats">Size: ${RefactorDemoState.refactoredSize} literals</div>
                <div class="invented-section">
                    <h6>Invented Rule:</h6>
                    ${RefactorDemoState.inventedRules.map(r => 
                        `<div class="rule invented">${r.head} ← ${r.body.join(', ')}</div>`
                    ).join('')}
                </div>
                <div class="refactored-section">
                    <h6>Refactored Rules:</h6>
                    ${RefactorDemoState.refactoredProgram.map(r => 
                        `<div class="rule">${r.head} ← ${r.body.join(', ')}</div>`
                    ).join('')}
                </div>
            </div>
        </div>
        
        <div class="refactor-insight">
            <h5>Key Insight (Theorem 2: Linear Sufficiency)</h5>
            <p>The invented rule <code>aux(A,B,C)</code> is <strong>linear</strong> — each variable appears at most once 
            in each body literal position. This is sufficient for optimal compression, reducing the 
            search space from O(n·2<sup>k</sup>) to O(n·k).</p>
        </div>
    `;
    
    container.innerHTML = html;
}

// ==========================================
// 4. Human Teaching: Example Quality Demo
// ==========================================

const TeachingDemoState = {
    concept: 'sorted',
    examples: {
        nonExpert: [
            { input: '[1,2,3]', output: 'true', quality: 'low' },
            { input: '[3,2,1]', output: 'false', quality: 'low' },
            { input: '[1,2,3,4]', output: 'true', quality: 'low' }
        ],
        expert: [
            { input: '[1,2,4,9,13,26,39,42]', output: 'true', quality: 'high' },
            { input: '[1,2,4,9,26,25,39,42]', output: 'false', quality: 'high' },
            { input: '[]', output: 'true', quality: 'edge' }
        ],
        random: [
            { input: '[47,12,89,3,56]', output: 'false', quality: 'random' },
            { input: '[8,23,45,67,89]', output: 'true', quality: 'random' },
            { input: '[99,98,97]', output: 'false', quality: 'random' }
        ]
    }
};

function analyzeExampleQuality(examples) {
    const metrics = {
        avgLength: 0,
        valueVariance: 0,
        hasEdgeCases: false,
        hasNearMiss: false,
        diversityScore: 0
    };
    
    // Calculate average length
    const lengths = examples.map(e => {
        const match = e.input.match(/\d+/g);
        return match ? match.length : 0;
    });
    metrics.avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    
    // Check for edge cases
    metrics.hasEdgeCases = examples.some(e => e.input === '[]' || e.input === '[0]');
    
    // Calculate value variance
    const allValues = [];
    examples.forEach(e => {
        const matches = e.input.match(/\d+/g);
        if (matches) allValues.push(...matches.map(Number));
    });
    if (allValues.length > 0) {
        const mean = allValues.reduce((a, b) => a + b, 0) / allValues.length;
        metrics.valueVariance = Math.sqrt(
            allValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / allValues.length
        );
    }
    
    // Check for near-miss negatives
    metrics.hasNearMiss = examples.some((e, i) => {
        if (e.output === 'false') {
            return examples.some(e2 => {
                if (e2.output === 'true') {
                    // Check if they're similar
                    const diff = levenshteinDistance(e.input, e2.input);
                    return diff <= 3;
                }
                return false;
            });
        }
        return false;
    });
    
    // Calculate diversity score
    metrics.diversityScore = (
        (metrics.avgLength > 5 ? 25 : metrics.avgLength * 5) +
        (metrics.valueVariance > 20 ? 25 : metrics.valueVariance * 1.25) +
        (metrics.hasEdgeCases ? 25 : 0) +
        (metrics.hasNearMiss ? 25 : 0)
    );
    
    return metrics;
}

function levenshteinDistance(s1, s2) {
    const m = s1.length, n = s2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = Math.min(
                dp[i-1][j] + 1,
                dp[i][j-1] + 1,
                dp[i-1][j-1] + (s1[i-1] === s2[j-1] ? 0 : 1)
            );
        }
    }
    
    return dp[m][n];
}

function renderTeachingComparison() {
    const container = document.getElementById('teachingComparisonContainer');
    if (!container) return;
    
    const nonExpertMetrics = analyzeExampleQuality(TeachingDemoState.examples.nonExpert);
    const expertMetrics = analyzeExampleQuality(TeachingDemoState.examples.expert);
    const randomMetrics = analyzeExampleQuality(TeachingDemoState.examples.random);
    
    let html = `
        <div class="teaching-comparison-grid">
            <div class="example-set non-expert">
                <h5>Non-Expert Examples</h5>
                <div class="examples-list">
                    ${TeachingDemoState.examples.nonExpert.map(e => 
                        `<div class="example-item">${e.input} → ${e.output}</div>`
                    ).join('')}
                </div>
                <div class="metrics">
                    <div class="metric">
                        <span class="label">Avg Length:</span>
                        <span class="value">${nonExpertMetrics.avgLength.toFixed(1)}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Value Variance:</span>
                        <span class="value">${nonExpertMetrics.valueVariance.toFixed(1)}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Edge Cases:</span>
                        <span class="value ${nonExpertMetrics.hasEdgeCases ? 'yes' : 'no'}">
                            ${nonExpertMetrics.hasEdgeCases ? '✓' : '✗'}
                        </span>
                    </div>
                    <div class="metric">
                        <span class="label">Near-miss:</span>
                        <span class="value ${nonExpertMetrics.hasNearMiss ? 'yes' : 'no'}">
                            ${nonExpertMetrics.hasNearMiss ? '✓' : '✗'}
                        </span>
                    </div>
                    <div class="quality-score">
                        Quality: ${nonExpertMetrics.diversityScore.toFixed(0)}%
                    </div>
                </div>
                <div class="predicted-accuracy">Predicted Accuracy: ~76%</div>
            </div>
            
            <div class="example-set expert">
                <h5>Expert Examples</h5>
                <div class="examples-list">
                    ${TeachingDemoState.examples.expert.map(e => 
                        `<div class="example-item ${e.quality}">${e.input} → ${e.output}</div>`
                    ).join('')}
                </div>
                <div class="metrics">
                    <div class="metric">
                        <span class="label">Avg Length:</span>
                        <span class="value">${expertMetrics.avgLength.toFixed(1)}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Value Variance:</span>
                        <span class="value">${expertMetrics.valueVariance.toFixed(1)}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Edge Cases:</span>
                        <span class="value ${expertMetrics.hasEdgeCases ? 'yes' : 'no'}">
                            ${expertMetrics.hasEdgeCases ? '✓' : '✗'}
                        </span>
                    </div>
                    <div class="metric">
                        <span class="label">Near-miss:</span>
                        <span class="value ${expertMetrics.hasNearMiss ? 'yes' : 'no'}">
                            ${expertMetrics.hasNearMiss ? '✓' : '✗'}
                        </span>
                    </div>
                    <div class="quality-score">
                        Quality: ${expertMetrics.diversityScore.toFixed(0)}%
                    </div>
                </div>
                <div class="predicted-accuracy success">Predicted Accuracy: 100%</div>
            </div>
        </div>
        
        <div class="teaching-insight">
            <h5>Key Finding from Hocquette et al. (2025)</h5>
            <p>The expert achieved 100% accuracy with <strong>fewer examples</strong> by understanding 
            how ILP systems generalize. The critical strategies were:</p>
            <ul>
                <li><strong>Long lists with varied values</strong> — prevents coincidental patterns</li>
                <li><strong>Near-miss negatives</strong> — one swap from a positive example forces precise generalization</li>
                <li><strong>Edge cases</strong> — empty list tests base case handling</li>
            </ul>
        </div>
    `;
    
    container.innerHTML = html;
}

// Initialize demos when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        updateReducerAnalysis();
        renderSymmetryAnalysis();
        applyRefactoring();
        renderTeachingComparison();
    }, 800);
});

// Export demo functions
window.toggleReducerLiteral = toggleReducerLiteral;
window.updateReducerAnalysis = updateReducerAnalysis;
window.applyRefactoring = applyRefactoring;
window.renderTeachingComparison = renderTeachingComparison;
window.renderSymmetryAnalysis = renderSymmetryAnalysis;

// ============================================
// Interactive Hypothesis Lattice Explorer
// ============================================

const LatticeState = {
    nodes: [],
    edges: [],
    currentNode: null,
    searchQueue: [],
    searchStep: 0,
    running: false,
    runInterval: null,
    strategy: 'topdown',
    params: {
        maxBody: 3,
        maxVars: 3,
        maxClauses: 1,
        allowRecursion: false,
        allowInvention: false
    }
};

function generateLatticeNodes() {
    // Generate a realistic hypothesis lattice based on parameters
    const { maxBody, maxVars } = LatticeState.params;
    
    LatticeState.nodes = [
        // Level 0 - Most general
        { id: 0, rule: 'gp(X,Y) ← true', level: 0, status: 'unexplored', coversPos: 2, coversNeg: 2, x: 0, y: 0 },
        
        // Level 1 - Single body literal
        { id: 1, rule: 'gp(X,Y) ← parent(X,_)', level: 1, status: 'unexplored', coversPos: 2, coversNeg: 1, x: 0, y: 0 },
        { id: 2, rule: 'gp(X,Y) ← parent(_,Y)', level: 1, status: 'unexplored', coversPos: 2, coversNeg: 2, x: 0, y: 0 },
        { id: 3, rule: 'gp(X,Y) ← parent(X,Y)', level: 1, status: 'unexplored', coversPos: 0, coversNeg: 0, x: 0, y: 0 },
        { id: 4, rule: 'gp(X,Y) ← male(X)', level: 1, status: 'unexplored', coversPos: 1, coversNeg: 1, x: 0, y: 0 },
        { id: 5, rule: 'gp(X,Y) ← female(X)', level: 1, status: 'unexplored', coversPos: 1, coversNeg: 1, x: 0, y: 0 },
        
        // Level 2 - Two body literals
        { id: 6, rule: 'gp(X,Y) ← parent(X,Z), parent(Z,_)', level: 2, status: 'unexplored', coversPos: 2, coversNeg: 1, x: 0, y: 0 },
        { id: 7, rule: 'gp(X,Y) ← parent(X,Z), parent(_,Y)', level: 2, status: 'unexplored', coversPos: 2, coversNeg: 1, x: 0, y: 0 },
        { id: 8, rule: 'gp(X,Y) ← parent(X,Z), parent(Z,Y)', level: 2, status: 'unexplored', coversPos: 2, coversNeg: 0, isSolution: true, x: 0, y: 0 },
        { id: 9, rule: 'gp(X,Y) ← parent(X,Z), male(Z)', level: 2, status: 'unexplored', coversPos: 1, coversNeg: 1, x: 0, y: 0 },
        { id: 10, rule: 'gp(X,Y) ← parent(X,Z), female(Z)', level: 2, status: 'unexplored', coversPos: 1, coversNeg: 0, x: 0, y: 0 },
        { id: 11, rule: 'gp(X,Y) ← parent(X,_), male(X)', level: 2, status: 'unexplored', coversPos: 1, coversNeg: 1, x: 0, y: 0 },
        
        // Level 3 - Three body literals
        { id: 12, rule: 'gp(X,Y) ← parent(X,Z), parent(Z,Y), male(Z)', level: 3, status: 'unexplored', coversPos: 1, coversNeg: 0, x: 0, y: 0 },
        { id: 13, rule: 'gp(X,Y) ← parent(X,Z), parent(Z,Y), female(Z)', level: 3, status: 'unexplored', coversPos: 1, coversNeg: 0, x: 0, y: 0 },
        { id: 14, rule: 'gp(X,Y) ← parent(X,Z), parent(Z,Y), male(X)', level: 3, status: 'unexplored', coversPos: 1, coversNeg: 0, x: 0, y: 0 },
        { id: 15, rule: 'gp(X,Y) ← parent(X,Z), parent(Z,Y), female(X)', level: 3, status: 'unexplored', coversPos: 1, coversNeg: 0, x: 0, y: 0 },
    ];
    
    // Add more nodes based on parameters
    if (maxBody >= 4) {
        LatticeState.nodes.push(
            { id: 16, rule: 'gp(X,Y) ← parent(X,Z), parent(Z,Y), male(Z), male(X)', level: 4, status: 'unexplored', coversPos: 0, coversNeg: 0, x: 0, y: 0 }
        );
    }
    
    // Generate edges based on subsumption
    LatticeState.edges = [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 6], [1, 7], [1, 9], [1, 11],
        [2, 7], [2, 8],
        [3, 8],
        [4, 9], [4, 11],
        [5, 10],
        [6, 12], [7, 12], [7, 13],
        [8, 12], [8, 13], [8, 14], [8, 15],
        [9, 12], [10, 13],
        [11, 14]
    ];
    
    calculateLatticePositions();
    updateLatticeStats();
}

function calculateLatticePositions() {
    const canvas = document.getElementById('latticeCanvas');
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 50, bottom: 50, left: 60, right: 60 };
    
    // Group nodes by level
    const levels = {};
    LatticeState.nodes.forEach(n => {
        if (!levels[n.level]) levels[n.level] = [];
        levels[n.level].push(n);
    });
    
    const numLevels = Object.keys(levels).length;
    const levelHeight = (height - padding.top - padding.bottom) / Math.max(numLevels - 1, 1);
    
    // Position nodes
    Object.keys(levels).forEach(level => {
        const levelNodes = levels[level];
        const levelY = padding.top + parseInt(level) * levelHeight;
        const levelWidth = width - padding.left - padding.right;
        const spacing = levelWidth / (levelNodes.length + 1);
        
        levelNodes.forEach((node, idx) => {
            node.x = padding.left + spacing * (idx + 1);
            node.y = levelY;
            node.radius = 18;
        });
    });
}

function drawLattice() {
    const canvas = document.getElementById('latticeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges first
    LatticeState.edges.forEach(([fromId, toId]) => {
        const from = LatticeState.nodes.find(n => n.id === fromId);
        const to = LatticeState.nodes.find(n => n.id === toId);
        if (from && to) {
            drawLatticeEdge(ctx, from, to);
        }
    });
    
    // Draw nodes
    LatticeState.nodes.forEach(node => {
        drawLatticeNode(ctx, node);
    });
    
    // Draw level labels
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'left';
    
    const levels = [...new Set(LatticeState.nodes.map(n => n.level))];
    levels.forEach(level => {
        const levelNode = LatticeState.nodes.find(n => n.level === level);
        if (levelNode) {
            ctx.fillText(`Level ${level}`, 10, levelNode.y + 4);
        }
    });
}

function drawLatticeEdge(ctx, from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y + from.radius);
    ctx.lineTo(to.x, to.y - to.radius);
    
    // Style based on node status
    if (to.status === 'pruned' || from.status === 'pruned') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.setLineDash([4, 4]);
    } else if (to.status === 'solution' || from.status === 'solution') {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
    } else if (to.status === 'current' || from.status === 'current') {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.setLineDash([]);
    } else {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
        ctx.setLineDash([]);
    }
    
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawLatticeNode(ctx, node) {
    const { x, y, radius, status, id } = node;
    
    const colors = {
        'unexplored': { fill: 'rgba(99, 102, 241, 0.4)', stroke: 'rgba(99, 102, 241, 0.7)', text: '#fff' },
        'current': { fill: '#fbbf24', stroke: '#f59e0b', text: '#000' },
        'too-general': { fill: 'rgba(249, 115, 22, 0.6)', stroke: 'rgba(249, 115, 22, 0.9)', text: '#fff' },
        'too-specific': { fill: 'rgba(139, 92, 246, 0.6)', stroke: 'rgba(139, 92, 246, 0.9)', text: '#fff' },
        'pruned': { fill: 'rgba(239, 68, 68, 0.3)', stroke: 'rgba(239, 68, 68, 0.5)', text: 'rgba(255,255,255,0.5)' },
        'solution': { fill: '#10b981', stroke: '#059669', text: '#fff' }
    };
    
    const color = colors[status] || colors['unexplored'];
    
    // Glow for current/solution
    if (status === 'current' || status === 'solution') {
        ctx.beginPath();
        ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = status === 'solution' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 191, 36, 0.3)';
        ctx.fill();
    }
    
    // Node circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color.fill;
    ctx.fill();
    ctx.strokeStyle = color.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Node label
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = color.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`H${id}`, x, y);
    
    // Show rule on hover (simulated - show for current)
    if (status === 'current') {
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        
        // Truncate rule for display
        const ruleText = node.rule.length > 35 ? node.rule.substring(0, 35) + '...' : node.rule;
        ctx.fillText(ruleText, x, y + radius + 15);
    }
}

function animateLatticeSearch() {
    if (LatticeState.running) return;
    
    LatticeState.running = true;
    document.getElementById('animateSearchBtn').style.display = 'none';
    document.getElementById('pauseSearchBtn').style.display = 'inline-flex';
    
    // Initialize search based on strategy
    if (LatticeState.strategy === 'topdown') {
        LatticeState.searchQueue = [0]; // Start from most general
    } else if (LatticeState.strategy === 'bottomup') {
        // Start from most specific nodes
        const maxLevel = Math.max(...LatticeState.nodes.map(n => n.level));
        LatticeState.searchQueue = LatticeState.nodes.filter(n => n.level === maxLevel).map(n => n.id);
    } else {
        LatticeState.searchQueue = [0];
    }
    
    LatticeState.runInterval = setInterval(() => {
        if (!LatticeState.running || LatticeState.searchQueue.length === 0) {
            pauseLatticeSearch();
            return;
        }
        searchLatticeStep();
    }, 800);
}

function searchLatticeStep() {
    if (LatticeState.searchQueue.length === 0) return;
    
    // Reset previous current node
    LatticeState.nodes.forEach(n => {
        if (n.status === 'current') {
            // Determine final status
            if (n.isSolution) {
                n.status = 'solution';
            } else if (n.coversNeg > 0) {
                n.status = 'too-general';
            } else if (n.coversPos < 2) {
                n.status = 'too-specific';
            } else {
                n.status = 'too-general';
            }
        }
    });
    
    // Get next node to explore
    const nodeId = LatticeState.searchQueue.shift();
    const node = LatticeState.nodes.find(n => n.id === nodeId);
    
    if (!node || node.status !== 'unexplored') {
        drawLattice();
        return;
    }
    
    node.status = 'current';
    LatticeState.searchStep++;
    
    // Add trace entry
    addLatticeTraceEntry(node);
    
    // After short delay, evaluate and potentially prune
    setTimeout(() => {
        evaluateLatticeNode(node);
    }, 400);
    
    drawLattice();
}

function evaluateLatticeNode(node) {
    if (node.isSolution) {
        node.status = 'solution';
        addLatticeTraceEntry(node, 'success');
        pauseLatticeSearch();
        drawLattice();
        return;
    }
    
    // Determine outcome
    if (node.coversNeg > 0) {
        node.status = 'too-general';
        // Add children to queue (specializations)
        const children = LatticeState.edges
            .filter(([from, to]) => from === node.id)
            .map(([from, to]) => to);
        children.forEach(childId => {
            const child = LatticeState.nodes.find(n => n.id === childId);
            if (child && child.status === 'unexplored') {
                LatticeState.searchQueue.push(childId);
            }
        });
        addLatticeTraceEntry(node, 'general');
    } else if (node.coversPos < 2) {
        node.status = 'too-specific';
        // Prune all specializations
        pruneLatticeSubtree(node.id);
        addLatticeTraceEntry(node, 'specific');
    }
    
    drawLattice();
}

function pruneLatticeSubtree(nodeId) {
    const children = LatticeState.edges
        .filter(([from, to]) => from === nodeId)
        .map(([from, to]) => to);
    
    children.forEach(childId => {
        const child = LatticeState.nodes.find(n => n.id === childId);
        if (child && child.status === 'unexplored') {
            child.status = 'pruned';
            pruneLatticeSubtree(childId); // Recursively prune
        }
    });
}

function addLatticeTraceEntry(node, type = 'test') {
    const log = document.getElementById('traceLog');
    if (!log) return;
    
    const entry = document.createElement('div');
    entry.className = `trace-entry ${type}`;
    
    let message = '';
    switch (type) {
        case 'test':
            message = `Step ${LatticeState.searchStep}: Testing H${node.id}`;
            break;
        case 'general':
            message = `H${node.id} too general (covers E⁻) → specialize`;
            break;
        case 'specific':
            message = `H${node.id} too specific (misses E⁺) → prune subtree`;
            break;
        case 'success':
            message = `✓ H${node.id} is SOLUTION! Covers all E⁺, no E⁻`;
            break;
        default:
            message = `Testing H${node.id}`;
    }
    
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function pauseLatticeSearch() {
    LatticeState.running = false;
    if (LatticeState.runInterval) {
        clearInterval(LatticeState.runInterval);
    }
    document.getElementById('animateSearchBtn').style.display = 'inline-flex';
    document.getElementById('pauseSearchBtn').style.display = 'none';
}

function resetLattice() {
    pauseLatticeSearch();
    LatticeState.searchStep = 0;
    LatticeState.searchQueue = [];
    
    // Reset all nodes
    LatticeState.nodes.forEach(n => {
        n.status = 'unexplored';
    });
    
    // Clear trace
    const log = document.getElementById('traceLog');
    if (log) {
        log.innerHTML = `<div class="trace-entry init">Initialize: ℋ contains ${LatticeState.nodes.length} hypotheses</div>`;
    }
    
    drawLattice();
}

function updateSearchStrategy() {
    const select = document.getElementById('searchStrategySelect');
    if (select) {
        LatticeState.strategy = select.value;
    }
}

function updateLatticeStats() {
    const totalEl = document.getElementById('totalHypotheses');
    const depthEl = document.getElementById('latticeDepth');
    const branchEl = document.getElementById('branchingFactor');
    const complexEl = document.getElementById('searchComplexity');
    
    if (totalEl) totalEl.textContent = LatticeState.nodes.length;
    if (depthEl) depthEl.textContent = Math.max(...LatticeState.nodes.map(n => n.level)) + 1;
    
    // Calculate average branching factor
    let totalChildren = 0;
    let nodesWithChildren = 0;
    LatticeState.nodes.forEach(node => {
        const children = LatticeState.edges.filter(([from, to]) => from === node.id).length;
        if (children > 0) {
            totalChildren += children;
            nodesWithChildren++;
        }
    });
    const avgBranch = nodesWithChildren > 0 ? (totalChildren / nodesWithChildren).toFixed(1) : 0;
    if (branchEl) branchEl.textContent = avgBranch;
    
    // Update complexity formula based on params
    const { maxVars, maxBody } = LatticeState.params;
    if (complexEl) complexEl.textContent = `O(${maxVars}! × 4^${maxBody})`;
}

function calculateSpaceSize() {
    const p = parseInt(document.getElementById('calcPredicates')?.value || 4);
    const a = parseInt(document.getElementById('calcArity')?.value || 2);
    const v = parseInt(document.getElementById('calcVars')?.value || 3);
    const k = parseInt(document.getElementById('calcBody')?.value || 3);
    
    // |H| ≈ (p × v^a)^k
    const base = p * Math.pow(v, a);
    const size = Math.pow(base, k);
    
    const resultEl = document.getElementById('calcResult');
    if (resultEl) {
        if (size > 1e9) {
            resultEl.textContent = `~${(size / 1e9).toFixed(1)} × 10⁹`;
        } else if (size > 1e6) {
            resultEl.textContent = `~${(size / 1e6).toFixed(1)} × 10⁶`;
        } else if (size > 1e3) {
            resultEl.textContent = `~${(size / 1e3).toFixed(1)} × 10³`;
        } else {
            resultEl.textContent = `~${size.toFixed(0)}`;
        }
    }
}

// Initialize lattice on parameter change
function initLatticeControls() {
    const controls = ['maxBodyLiterals', 'maxVarsSlider', 'maxClausesSlider'];
    controls.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                const valueEl = document.getElementById(id.replace('Slider', 'Value').replace('Literals', 'Value'));
                if (valueEl) valueEl.textContent = e.target.value;
                
                // Update params
                if (id === 'maxBodyLiterals') LatticeState.params.maxBody = parseInt(e.target.value);
                if (id === 'maxVarsSlider') LatticeState.params.maxVars = parseInt(e.target.value);
                if (id === 'maxClausesSlider') LatticeState.params.maxClauses = parseInt(e.target.value);
                
                updateLatticeStats();
            });
        }
    });
    
    const recursionCheck = document.getElementById('allowRecursionCheck');
    if (recursionCheck) {
        recursionCheck.addEventListener('change', (e) => {
            LatticeState.params.allowRecursion = e.target.checked;
        });
    }
    
    const inventionCheck = document.getElementById('allowInventionCheck');
    if (inventionCheck) {
        inventionCheck.addEventListener('change', (e) => {
            LatticeState.params.allowInvention = e.target.checked;
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        generateLatticeNodes();
        drawLattice();
        initLatticeControls();
    }, 500);
});

// Export lattice functions
window.animateLatticeSearch = animateLatticeSearch;
window.pauseLatticeSearch = pauseLatticeSearch;
window.resetLattice = resetLattice;
window.updateSearchStrategy = updateSearchStrategy;
window.calculateSpaceSize = calculateSpaceSize;

console.log('🧠 ILP Explorer loaded successfully!');
