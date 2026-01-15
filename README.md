# ILP Explorer: A Comprehensive Research Platform for Inductive Logic Programming

[![Research Platform](https://img.shields.io/badge/Research-Platform-blue.svg)](https://github.com/ilp-explorer)
[![PhD Level](https://img.shields.io/badge/Level-PhD-purple.svg)](https://github.com/ilp-explorer)
[![Papers](https://img.shields.io/badge/Papers-4%20Integrated-green.svg)](https://github.com/ilp-explorer)

> **A complete educational and research platform covering the foundations, systems, and cutting-edge advances in Inductive Logic Programming (ILP)**

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Theoretical Foundations](#2-theoretical-foundations)
   - 2.1 [What is ILP?](#21-what-is-ilp)
   - 2.2 [The ILP Problem Formulation](#22-the-ilp-problem-formulation)
   - 2.3 [Background Knowledge](#23-background-knowledge)
   - 2.4 [Hypothesis Space & Language Bias](#24-hypothesis-space--language-bias)
   - 2.5 [Generality Ordering (θ-Subsumption)](#25-generality-ordering-θ-subsumption)
   - 2.6 [Refinement Operators](#26-refinement-operators)
   - 2.7 [Mode Declarations](#27-mode-declarations)
   - 2.8 [Metarules](#28-metarules)
   - 2.9 [Type Systems](#29-type-systems)
3. [Automated Reasoning Solvers](#3-automated-reasoning-solvers)
   - 3.1 [SAT Solvers](#31-sat-solvers)
   - 3.2 [Answer Set Programming (ASP)](#32-answer-set-programming-asp)
   - 3.3 [Constraint Satisfaction Problems (CSP)](#33-constraint-satisfaction-problems-csp)
   - 3.4 [MaxSAT & Optimization](#34-maxsat--optimization)
4. [ILP Systems & Algorithms](#4-ilp-systems--algorithms)
   - 4.1 [FOIL](#41-foil)
   - 4.2 [Progol](#42-progol)
   - 4.3 [ALEPH](#43-aleph)
   - 4.4 [Metagol](#44-metagol)
   - 4.5 [POPPER](#45-popper)
5. [Cutting-Edge Research (2024-2025)](#5-cutting-edge-research-2024-2025)
   - 5.1 [REDUCER: Pointless Rule Pruning](#51-reducer-pointless-rule-pruning)
   - 5.2 [Symmetry Breaking for ILP](#52-symmetry-breaking-for-ilp)
   - 5.3 [MAXREFACTOR: Knowledge Refactoring](#53-maxrefactor-knowledge-refactoring)
   - 5.4 [Human-Machine Teaching Study](#54-human-machine-teaching-study)
6. [Stories from the Frontier](#6-stories-from-the-frontier)
7. [Industrial Applications](#7-industrial-applications)
8. [Complexity-Theoretic Results](#8-complexity-theoretic-results)
9. [Interactive Platform Guide](#9-interactive-platform-guide)
10. [References & Citations](#10-references--citations)
11. [Glossary](#11-glossary)

---

## 1. Introduction

### What is This Platform?

The **ILP Explorer** is a comprehensive, interactive educational platform designed to teach Inductive Logic Programming from beginner concepts to PhD-level research. It integrates:

- **7 major sections** covering foundations to cutting-edge research
- **4 recent research papers** from Oxford's Logic and Learning Lab
- **Multiple interactive demos** with real-time visualizations
- **Industrial case studies** from Google, Microsoft, and Oracle
- **PhD-level mathematical foundations** with formal proofs

### Why ILP Matters

Inductive Logic Programming sits at the intersection of:

```
                    Machine Learning
                          │
                          │
    Logic Programming ────┼──── Knowledge Representation
                          │
                          │
                    Program Synthesis
```

Unlike neural networks, ILP produces **interpretable, symbolic rules** that can be:
- Verified by humans
- Combined with existing knowledge
- Used for logical reasoning
- Transferred across domains

### Platform Architecture

```
ILP Explorer/
├── index.html      # Main application (4,300+ lines)
├── styles.css      # Styling (8,600+ lines)
├── app.js          # Interactive logic (3,600+ lines)
└── README.md       # This documentation
```

---

## 2. Theoretical Foundations

### 2.1 What is ILP?

**Inductive Logic Programming (ILP)** is a subfield of machine learning that learns logical rules (typically Horn clauses) from examples and background knowledge.

#### The Classic Definition

> **Definition 1 (ILP - Muggleton, 1991)**: Given background knowledge B, positive examples E⁺, and negative examples E⁻, find a hypothesis H such that:
> - **Completeness**: B ∪ H ⊨ E⁺ (H explains all positive examples)
> - **Consistency**: B ∪ H ⊭ e, ∀e ∈ E⁻ (H doesn't explain any negative example)

#### Example: Learning Family Relations

**Background Knowledge (B):**
```prolog
parent(ann, bob).
parent(bob, carol).
parent(bob, dave).
parent(eve, carol).
```

**Positive Examples (E⁺):**
```prolog
grandparent(ann, carol).
grandparent(ann, dave).
```

**Negative Examples (E⁻):**
```prolog
grandparent(bob, carol).  % Bob is parent, not grandparent
grandparent(ann, bob).    % Ann is parent, not grandparent
```

**Learned Hypothesis (H):**
```prolog
grandparent(X, Y) :- parent(X, Z), parent(Z, Y).
```

### 2.2 The ILP Problem Formulation

#### Formal Problem Statement

```
┌─────────────────────────────────────────────────────────────┐
│                    ILP LEARNING TASK                        │
├─────────────────────────────────────────────────────────────┤
│  INPUT:                                                     │
│    • Background knowledge B (logic program)                 │
│    • Positive examples E⁺ (ground atoms)                    │
│    • Negative examples E⁻ (ground atoms)                    │
│    • Language bias ℒ (hypothesis space constraints)         │
│                                                             │
│  OUTPUT:                                                    │
│    • Hypothesis H ∈ ℋ(ℒ) such that:                        │
│      - B ∪ H ⊨ e for all e ∈ E⁺                            │
│      - B ∪ H ⊭ e for all e ∈ E⁻                            │
│      - H is optimal w.r.t. some criterion (e.g., size)     │
└─────────────────────────────────────────────────────────────┘
```

#### Optimality Criteria

Different ILP systems optimize for different criteria:

| Criterion | Description | Systems |
|-----------|-------------|---------|
| **Minimum Description Length (MDL)** | Minimize \|H\| + misclassifications | Progol, ALEPH |
| **Minimum Hypothesis Size** | Minimize number of literals | POPPER |
| **Maximum Coverage** | Maximize E⁺ covered | FOIL |
| **Bayesian Posterior** | Maximize P(H\|E,B) | Metagol |

### 2.3 Background Knowledge

Background knowledge (BK) provides the vocabulary and facts that hypotheses can use.

#### Types of Background Knowledge

```
Background Knowledge
├── Extensional (Facts)
│   ├── Ground facts: parent(ann, bob)
│   └── Type declarations: person(ann), person(bob)
│
├── Intensional (Rules)
│   ├── Definitions: ancestor(X,Y) :- parent(X,Y)
│   └── Constraints: :- parent(X,X)  % No self-parenting
│
└── Meta-level
    ├── Mode declarations
    ├── Type hierarchies
    └── Determinations
```

#### BK Design Principles

1. **Relevance**: Include predicates likely useful for target concept
2. **Completeness**: Include enough facts to cover examples
3. **Non-triviality**: Avoid predicates that directly solve the problem
4. **Groundedness**: Ensure all queries terminate

### 2.4 Hypothesis Space & Language Bias

#### The Hypothesis Space Problem

Without constraints, the hypothesis space is **infinite**:

```
|ℋ| = ∞  (unconstrained)
```

Even with constraints, it grows exponentially:

```
|ℋ(ℒ)| ≈ O((p × v^a)^k)

where:
  p = number of predicates
  v = maximum variables
  a = average arity
  k = maximum body literals
```

#### Language Bias Taxonomy

```
Language Bias
├── Syntactic Bias
│   ├── Mode declarations (ALEPH, Progol)
│   ├── Metarules (Metagol)
│   ├── ASP encoding (POPPER)
│   └── Type constraints
│
├── Search Bias
│   ├── Top-down (general → specific)
│   ├── Bottom-up (specific → general)
│   ├── Bidirectional
│   └── Best-first (heuristic-guided)
│
└── Validation Bias
    ├── Coverage requirements
    ├── Consistency constraints
    └── Complexity penalties
```

#### Space Size Calculator

Given parameters:
- p = 4 predicates
- a = 2 average arity
- v = 3 max variables
- k = 3 max body literals

```
|ℋ| ≈ (4 × 3²)³ = 36³ = 46,656 hypotheses
```

With variable permutations (symmetry):
```
|ℋ_sym| ≈ |ℋ| × v! = 46,656 × 6 = 279,936 hypotheses
```

### 2.5 Generality Ordering (θ-Subsumption)

#### Definition

> **Definition 2 (θ-Subsumption)**: Clause C₁ **θ-subsumes** clause C₂ (written C₁ ≤θ C₂) iff there exists a substitution θ such that C₁θ ⊆ C₂.

#### Intuition

- C₁ ≤θ C₂ means C₁ is **more general** than C₂
- More general clauses cover more examples
- More specific clauses are more precise

#### Generality Lattice

```
                    ⊤ (most general)
                    │
            gp(X,Y) ← true
                    │
        ┌───────────┼───────────┐
        │           │           │
  gp(X,Y)←      gp(X,Y)←    gp(X,Y)←
  parent(X,_)   parent(_,Y)  male(X)
        │           │           │
        └─────┬─────┴───────────┘
              │
      gp(X,Y) ← parent(X,Z), parent(Z,Y)
              │
      ┌───────┴───────┐
      │               │
  gp(X,Y)←        gp(X,Y)←
  parent(X,Z),    parent(X,Z),
  parent(Z,Y),    parent(Z,Y),
  male(Z)         female(Z)
      │               │
      └───────┬───────┘
              │
              ⊥ (most specific)
```

#### Properties of θ-Subsumption

| Property | Definition | Status |
|----------|------------|--------|
| **Reflexive** | C ≤θ C | ✓ Yes |
| **Transitive** | C₁ ≤θ C₂ ∧ C₂ ≤θ C₃ → C₁ ≤θ C₃ | ✓ Yes |
| **Anti-symmetric** | C₁ ≤θ C₂ ∧ C₂ ≤θ C₁ → C₁ ≈ C₂ | ✓ Up to renaming |
| **Lattice** | Unique LUB and GLB exist | ✗ No (quasi-order) |

#### Computational Complexity

> **Theorem (Kapur & Narendran, 1986)**: θ-subsumption checking is **NP-complete**.

This is why practical ILP systems use restricted forms of subsumption.

### 2.6 Refinement Operators

Refinement operators define how to traverse the hypothesis lattice.

#### Downward Refinement (Specialization)

> **Definition 3**: ρ↓(C) = {C' | C ≤θ C' and C' is a minimal specialization of C}

**Operations:**

1. **Add literal**: C' = C ∪ {L}
   ```
   gp(X,Y) ← parent(X,Z)
        ↓ add parent(Z,Y)
   gp(X,Y) ← parent(X,Z), parent(Z,Y)
   ```

2. **Apply substitution**: C' = Cθ
   ```
   gp(X,Y) ← parent(X,Z), parent(Z,W)
        ↓ θ = {W/Y}
   gp(X,Y) ← parent(X,Z), parent(Z,Y)
   ```

3. **Add constraint**: C' = C ∪ {X = t}
   ```
   gp(X,Y) ← parent(X,Z)
        ↓ X = ann
   gp(ann,Y) ← parent(ann,Z)
   ```

#### Upward Refinement (Generalization)

> **Definition 4**: ρ↑(C) = {C' | C' ≤θ C and C is a minimal specialization of C'}

**Operations:**

1. **Remove literal**: C' = C \ {L}
2. **Anti-unify**: Find least general generalization
3. **Turn constants to variables**

#### Ideal Refinement Operator Properties

| Property | Definition | Achievable? |
|----------|------------|-------------|
| **Locally finite** | \|ρ(C)\| < ∞ for all C | ✓ With restrictions |
| **Complete** | Target reachable from ⊤ or ⊥ | ✓ Yes |
| **Proper** | C' ∈ ρ(C) → C' ≠ C | ✓ Yes |
| **Non-redundant** | Each hypothesis generated once | ✗ Hard |

> **Impossibility Theorem (van der Laag & Nienhuys-Cheng, 1994)**: There is no ideal refinement operator for θ-subsumption that is simultaneously complete, locally finite, and non-redundant.

### 2.7 Mode Declarations

Mode declarations (ALEPH/Progol style) specify how predicates can appear in hypotheses.

#### Syntax

```prolog
modeh(Recall, Predicate(Args...)).  % Head declaration
modeb(Recall, Predicate(Args...)).  % Body declaration
```

#### Argument Types

| Symbol | Meaning | Example |
|--------|---------|---------|
| `+Type` | Input (must be bound) | `+person` |
| `-Type` | Output (will be bound) | `-person` |
| `#Type` | Constant | `#integer` |

#### Example

```prolog
% Type definitions
:- type(person, [ann, bob, carol, dave, eve]).
:- type(gender, [male, female]).

% Mode declarations
modeh(1, grandparent(+person, -person)).
modeb(*, parent(+person, -person)).
modeb(*, parent(-person, +person)).
modeb(1, male(+person)).
modeb(1, female(+person)).

% Determinations (which predicates can co-occur)
determination(grandparent/2, parent/2).
determination(grandparent/2, male/1).
determination(grandparent/2, female/1).
```

#### Recall Parameter

| Value | Meaning |
|-------|---------|
| `1` | Use at most once (determinate) |
| `*` | Use any number of times |
| `n` | Use at most n times |

### 2.8 Metarules

Metarules are higher-order templates used in Meta-Interpretive Learning (MIL).

#### Formal Definition

> **Definition 5 (Metarule)**: A metarule is a clause where predicate symbols are second-order variables:
> ```
> P(X̄) ← Q₁(Ȳ₁), Q₂(Ȳ₂), ..., Qₙ(Ȳₙ)
> ```
> where P, Q₁, ..., Qₙ are predicate variables.

#### Standard Metarule Catalog

| Name | Template | Example Instantiation |
|------|----------|----------------------|
| **Identity** | P(X,Y) ← Q(X,Y) | gp(X,Y) ← ancestor(X,Y) |
| **Inverse** | P(X,Y) ← Q(Y,X) | child(X,Y) ← parent(Y,X) |
| **Precon** | P(X,Y) ← Q(X), R(X,Y) | can_vote(X,Y) ← adult(X), citizen(X,Y) |
| **Postcon** | P(X,Y) ← Q(X,Y), R(Y) | hire(X,Y) ← interview(X,Y), qualified(Y) |
| **Chain** | P(X,Y) ← Q(X,Z), R(Z,Y) | gp(X,Y) ← parent(X,Z), parent(Z,Y) |
| **TailRec** | P(X,Y) ← Q(X,Z), P(Z,Y) | ancestor(X,Y) ← parent(X,Z), ancestor(Z,Y) |

#### Completeness Result

> **Theorem (Cropper & Muggleton, 2016)**: The set {Identity, Inverse, Precon, Postcon, Chain, TailRec} can express any definite hypothesis with at most two body literals.

#### Trade-off: Expressiveness vs. Efficiency

```
Fewer Metarules ◄─────────────────────────► More Metarules
     │                                              │
   Small search space                      Large search space
   Fast learning                           Slow/undecidable
   Limited expressiveness                  Full expressiveness
```

### 2.9 Type Systems

Types restrict variable domains, reducing the hypothesis space.

#### Type Hierarchy Example

```
                entity
                  │
        ┌─────────┼─────────┐
        │         │         │
     person    location   number
        │         │         │
     ┌──┴──┐   ┌──┴──┐   ┌──┴──┐
   adult child city country int real
```

#### Typed Mode Declarations

```prolog
% Hierarchy
type(person, [adult, child]).
type(adult, [ann, bob, eve]).
type(child, [carol, dave]).

% Typed modes
modeh(1, grandparent(+adult, -child)).
modeb(*, parent(+person, -person)).
```

#### Type Inference Rules

```
Γ ⊢ parent(X, Y)    X: person, Y: person
─────────────────────────────────────────
      Γ ⊢ grandparent(X, Z)    X: adult, Z: child
```

---

## 3. Automated Reasoning Solvers

Modern ILP systems leverage automated reasoning solvers for efficient hypothesis search.

### 3.1 SAT Solvers

#### Boolean Satisfiability Problem

> **Definition 6 (SAT)**: Given a Boolean formula φ in CNF, determine if there exists an assignment that makes φ true.

#### CNF (Conjunctive Normal Form)

```
φ = (x₁ ∨ ¬x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂) ∧ (¬x₃)
    └──── clause ────┘   └─clause─┘  └─clause─┘
```

#### DPLL Algorithm

```
DPLL(φ, assignment):
    // Unit propagation
    while unit clause {l} exists in φ:
        assignment ← assignment ∪ {l}
        φ ← simplify(φ, l)
    
    // Pure literal elimination
    for each pure literal l in φ:
        assignment ← assignment ∪ {l}
        φ ← simplify(φ, l)
    
    // Base cases
    if φ is empty: return SAT
    if φ contains empty clause: return UNSAT
    
    // Branching
    choose unassigned variable x
    return DPLL(φ ∧ {x}, assignment) or
           DPLL(φ ∧ {¬x}, assignment)
```

#### Complexity

> **Theorem (Cook, 1971)**: SAT is **NP-complete**.

Despite NP-completeness, modern SAT solvers (MiniSat, CryptoMiniSat, Glucose) solve instances with millions of variables using:
- Conflict-driven clause learning (CDCL)
- Non-chronological backtracking
- Efficient data structures (watched literals)

### 3.2 Answer Set Programming (ASP)

ASP is a declarative programming paradigm based on stable model semantics.

#### Syntax

```prolog
% Facts
parent(ann, bob).

% Rules
grandparent(X, Y) :- parent(X, Z), parent(Z, Y).

% Constraints (no stable model where this holds)
:- grandparent(X, X).

% Choice rules
{ selected(X) } :- candidate(X).

% Cardinality constraints
:- #count{ X : selected(X) } > 3.
```

#### Stable Model Semantics

> **Definition 7 (Stable Model)**: A set S of ground atoms is a stable model of program P if S is the minimal model of the **reduct** P^S.

#### Reduct Construction

Given program P and candidate model S:
```
P^S = { head(r) ← body⁺(r) | 
        r ∈ ground(P), 
        body⁻(r) ∩ S = ∅ }
```

#### ASP Solvers

| Solver | Features |
|--------|----------|
| **Clingo** | Grounding + solving, Python API |
| **DLV** | Disjunctive logic programs |
| **WASP** | Lazy grounding |

### 3.3 Constraint Satisfaction Problems (CSP)

#### Definition

> **Definition 8 (CSP)**: A CSP is a triple (X, D, C) where:
> - X = {x₁, ..., xₙ} is a set of variables
> - D = {D₁, ..., Dₙ} is a set of domains
> - C = {c₁, ..., cₘ} is a set of constraints

#### Arc Consistency (AC-3)

```
AC3(X, D, C):
    queue ← all arcs (xᵢ, xⱼ) where constraint exists
    while queue not empty:
        (xᵢ, xⱼ) ← dequeue(queue)
        if REVISE(xᵢ, xⱼ):
            if Dᵢ is empty: return failure
            for each xₖ ≠ xⱼ with constraint on (xₖ, xᵢ):
                enqueue(queue, (xₖ, xᵢ))
    return domains D

REVISE(xᵢ, xⱼ):
    revised ← false
    for each v ∈ Dᵢ:
        if no w ∈ Dⱼ satisfies constraint(xᵢ, xⱼ):
            Dᵢ ← Dᵢ \ {v}
            revised ← true
    return revised
```

### 3.4 MaxSAT & Optimization

#### Weighted MaxSAT

> **Definition 9 (Weighted MaxSAT)**: Given hard clauses H and soft clauses S with weights w, find an assignment maximizing:
> ```
> Σ w(c) for all satisfied c ∈ S
> ```
> subject to all clauses in H being satisfied.

#### Application to ILP

POPPER encodes the learning task as MaxSAT:
- **Hard clauses**: Language bias constraints
- **Soft clauses**: Coverage of examples
- **Weights**: Preference for simpler hypotheses

---

## 4. ILP Systems & Algorithms

### 4.1 FOIL

**First-Order Inductive Learner** (Quinlan, 1990)

#### Algorithm

```
FOIL(E⁺, E⁻, B):
    H ← ∅
    while E⁺ not empty:
        rule ← LEARN_ONE_RULE(E⁺, E⁻, B)
        H ← H ∪ {rule}
        E⁺ ← E⁺ \ covered(rule, B)
    return H

LEARN_ONE_RULE(E⁺, E⁻, B):
    rule ← target(X₁,...,Xₖ) ← true
    while rule covers some E⁻:
        best_literal ← argmax_L FOIL_GAIN(rule, L, E⁺, E⁻)
        rule ← rule ∧ best_literal
    return rule
```

#### FOIL Information Gain

```
FOIL_GAIN(rule, L) = t × (log₂(p₁/(p₁+n₁)) - log₂(p₀/(p₀+n₀)))

where:
  p₀, n₀ = positives/negatives covered by rule
  p₁, n₁ = positives/negatives covered by rule ∧ L
  t = number of positive bindings extended by L
```

### 4.2 Progol

**Progol** (Muggleton, 1995) introduced **Inverse Entailment**.

#### Key Idea

Instead of searching from general to specific, construct the **most specific clause** (⊥) that explains an example, then search from ⊥ upward.

#### Bottom Clause Construction

Given example e and background B:
```
⊥(e) = h ← L₁, L₂, ..., Lₙ

where each Lᵢ is derived by:
1. Start with h = e
2. Add literals that θ-subsume facts derivable from B ∪ {h}
3. Continue until depth limit reached
```

#### Example

```prolog
% Background
parent(ann, bob).
parent(bob, carol).
female(ann).

% Example
grandparent(ann, carol).

% Bottom clause
⊥ = grandparent(ann, carol) ← 
    parent(ann, bob), 
    parent(bob, carol),
    female(ann).
```

### 4.3 ALEPH

**A Learning Engine for Proposing Hypotheses** (Srinivasan, 2001)

ALEPH is the most widely-used ILP system, extending Progol with:
- Flexible mode declarations
- Multiple search strategies
- Lazy evaluation
- Theory revision

#### Configuration

```prolog
:- set(i, 3).           % Depth of variable chains
:- set(clauselength, 5). % Max body literals
:- set(nodes, 10000).   % Max search nodes
:- set(noise, 0).       % Allowed noise
```

### 4.4 Metagol

**Meta-Interpretive Learning** (Muggleton et al., 2014)

#### Core Idea

Learn by **proving** examples using metarules as inference rules.

#### Meta-Interpreter

```prolog
prove([], _).
prove([H|T], Prog) :-
    member(H, Prog),    % H is in learned program
    prove(T, Prog).
prove([H|T], Prog) :-
    metarule(H, Body),  % Use a metarule
    prove(Body, Prog),
    prove(T, Prog).
prove([H|T], Prog) :-
    background(H),      % Use background knowledge
    prove(T, Prog).
```

#### Predicate Invention

Metagol can **invent** new predicates:

```prolog
% Learning "grandparent" with invention
% Input: examples of great-grandparent
% Output:
inv1(X,Y) :- parent(X,Z), parent(Z,Y).  % invented: grandparent
ggp(X,Y) :- parent(X,Z), inv1(Z,Y).
```

### 4.5 POPPER

**Learning from Failures** (Cropper & Morel, 2021)

#### Generate-Test-Constrain Loop

```
┌─────────────────────────────────────────────────────┐
│                    POPPER LOOP                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│    ┌──────────┐     ┌──────────┐     ┌──────────┐  │
│    │ GENERATE │────►│   TEST   │────►│CONSTRAIN │  │
│    │ (ASP)    │     │ (Prolog) │     │  (ASP)   │  │
│    └────▲─────┘     └────┬─────┘     └────┬─────┘  │
│         │                │                │        │
│         └────────────────┴────────────────┘        │
│                    Constraints                     │
└─────────────────────────────────────────────────────┘
```

#### Three Constraint Types

1. **Generalization Constraint**: If H is too specific (misses positives), prune specializations
   ```
   If H ⊭ e⁺ then prune all H' where H ≤ H'
   ```

2. **Specialization Constraint**: If H is too general (covers negatives), prune generalizations
   ```
   If H ⊨ e⁻ then prune all H' where H' ≤ H
   ```

3. **Elimination Constraint**: If H is incomplete and inconsistent, prune H exactly
   ```
   If H ⊭ e⁺ and H ⊨ e⁻ then prune H
   ```

#### ASP Encoding (Simplified)

```prolog
% Hypothesis structure
{ head_literal(R, P, A) } :- rule(R), predicate(P), arity(P, A).
{ body_literal(R, I, P, A) } :- rule(R), index(I), predicate(P), arity(P, A).

% Language bias constraints
:- body_literal(R, I, _, _), not body_literal(R, I-1, _, _), I > 1.
:- #count{ R : rule(R) } > max_rules.
:- #count{ I : body_literal(R, I, _, _) } > max_body, rule(R).

% Learned constraints added dynamically
```

---

## 5. Cutting-Edge Research (2024-2025)

### 5.1 REDUCER: Pointless Rule Pruning

**Paper**: "Efficient Rule Induction by Ignoring Pointless Rules" (Cropper & Cerna, 2025)

#### Key Insight

Many rules in the hypothesis space are **pointless**—they can never appear in an optimal hypothesis. REDUCER identifies and prunes them.

#### Two Types of Pointless Rules

##### 1. Reducible Rules

> **Definition 10 (Reducible)**: Rule r = (h ← b) is **reducible** if ∃l ∈ b such that:
> - l is r-captured (all variables appear elsewhere)
> - BK ∪ (b \ {l}) ⊨ l (l is implied by other body literals)

**Example:**
```prolog
f(A) :- odd(A), int(A).   % REDUCIBLE!
% Because: odd(A) implies int(A)
% Equivalent to: f(A) :- odd(A).
```

##### 2. Indiscriminate Rules

> **Definition 11 (Indiscriminate)**: Rule r is **indiscriminate** if ∃l ∈ b such that:
> - l is r-captured
> - BK ∪ (b \ {l}) covers all negative examples

**Example:**
```prolog
E⁻ = {f(1), f(2), f(3)}
f(A) :- odd(A), lt(A, 10).   % INDISCRIMINATE!
% Because: lt(A, 10) is true for all negatives
```

#### Theoretical Foundations

> **Proposition 1 (Reducible Specialization)**: If r₁ is reducible and r₁ ⊆ r₂, then r₂ is reducible.

> **Proposition 3 (Indiscriminate Specialization)**: If r₁ is indiscriminate and r₁ ⊆ r₂, then r₂ is indiscriminate.

> **Corollary 1 (Soundness)**: A pointless hypothesis is never optimal.

**Implication**: We can prune entire **subtrees** rooted at pointless rules.

#### The Captured Literal Concept

> **Definition 12 (r-Captured)**: Literal l is **r-captured** in rule r = (h ← b) if:
> ```
> vars(l) ⊆ vars(h) ∪ vars(b \ {l})
> ```

**Example:**
```prolog
h :- succ(A,B), succ(B,C), gt(C,A), gt(C,D).
                          ^^^^^^^
                          captured (C,A appear elsewhere)
                                    ^^^^^^^
                                    NOT captured (D unique)
```

#### Algorithm

```python
def pointless(h, neg, bk):
    for rule in h:
        if not basic(rule, h):  # Skip recursive predicates
            continue
        for literal in body(rule):
            body_rest = body(rule) - {literal}
            if not captured(head(rule), body_rest, literal):
                continue
            if reducible(bk, body_rest, literal):
                return True
            if indiscriminate(bk, neg, rule, body_rest):
                return True
    return False
```

#### Experimental Results

| Metric | Value | Context |
|--------|-------|---------|
| **Learning Time Reduction** | **99%** | Eight-puzzle (60min → 12sec) |
| **Tasks Improved** | 21% | 96/449 tasks |
| **Mean Overhead** | 2% | Cost of pointless checking |

### 5.2 Symmetry Breaking for ILP

**Paper**: "Symmetry Breaking for Inductive Logic Programming" (Cropper, Cerna & Järvisalo, 2025)

#### The Problem

Many hypotheses are **logically equivalent** due to variable renaming:

```prolog
% These are EQUIVALENT (body-variants):
r₁ = gp(A) :- parent(A,B), parent(B,C), tall(C).
r₂ = gp(A) :- parent(A,C), parent(C,B), tall(B).
% Substitution: θ = {B↔C}
```

Without symmetry breaking, solvers explore **v!** equivalent hypotheses.

#### Complexity Result

> **Proposition 1 (GI-Hardness)**: The body-variant problem is **GI-hard** (Graph Isomorphism hard).

**Proof Sketch**: Encode graph G = (V, E) as rule r_G with |V| variables and edge predicates. Graph isomorphism reduces to body-variant checking.

#### Solution: Safe Variables

> **Definition 13 (Skipped Variable)**: Variable X is **skipped** in literal l if l contains variables both larger and smaller than X (in some ordering), but not X itself.

> **Definition 14 (Witnessed Variable)**: A skipped variable X is **witnessed** in l if X appears in a lexicographically smaller literal.

> **Definition 15 (Safe Variable)**: Variable X is **safe** if all its skipped occurrences are witnessed.

#### Example Analysis

```prolog
% Rule r₂: UNSAFE
h(A,B) :- p(A,E), p(B,C), p(C,D).
          ^^^^^^
          skips {B,C,D}
          D is not witnessed → UNSAFE → PRUNE

% Rule r₃: SAFE
h(A,B) :- p(A,C), p(B,D), p(C,E).
          ^^^^^^  ^^^^^^  ^^^^^^
          skips - skips D skips D
          D witnessed by p(B,D) (B,D) <_lex (C,E) → SAFE → KEEP
```

#### Soundness Theorem

> **Proposition 2 (Soundness)**: For every rule r, there exists a body-variant r' where all variables are safe.

**Implication**: Pruning unsafe rules doesn't lose solutions.

#### Experimental Results

| Metric | Value | Context |
|--------|-------|---------|
| **Solving Time Reduction** | **99.5%** | 9 variables: 1hr → 17sec |
| **Tasks with Solving Improvement** | 22% | 97/449 tasks |
| **Tasks with Learning Improvement** | 29% | 128/449 tasks |

### 5.3 MAXREFACTOR: Knowledge Refactoring

**Paper**: "Scalable Knowledge Refactoring using Constrained Optimisation" (Liu, Cerna, Gouveia & Cropper, 2024)

#### The Problem

Learned programs often contain redundant patterns that could be factored out:

```prolog
% Original (20 literals)
g(A) :- p(A), q(A,B), r(B), s(A,B).
g(A) :- p(A), q(A,B), r(B), t(A,B).
g(A) :- p(B), q(B,C), r(C), w(A,B).
g(A) :- p(A), q(B,A), r(A), z(A,B).

% Refactored (16 literals) - 20% compression
aux(A,B,C) :- p(A), q(B,C), r(C).
g(A) :- aux(A,A,B), s(A,B).
g(A) :- aux(A,A,B), t(A,B).
g(A) :- aux(B,B,C), w(A,B).
g(A) :- aux(A,B,A), z(A,B).
```

#### Complexity Result

> **Theorem 1 (NP-Hardness)**: The optimal knowledge refactoring (OKR) problem is **NP-hard**.

**Proof**: Reduction from Maximum Independent Set in 3-regular Hamiltonian graphs.

#### Key Innovation: Linear Invented Rules

> **Definition 16 (Linear Rule)**: A rule is **linear** if each variable appears at most once in each body literal position.

> **Theorem 2 (Linear Sufficiency)**: If OKR has a solution using invented rules C ⊆ S, then it has a solution using C' ⊆ S_lin where S_lin = {lin(s) | s ∈ S}.

**Implication**: We only need to search **linear** invented rules, reducing complexity from O(n·2^k) to **O(n·k)**.

#### Experimental Results

| Dataset | Improvement | Context |
|---------|-------------|---------|
| **Strings** | **60%** | Better compression than KNORF |
| **Lego** | **27%+** | Minimum improvement across all tasks |
| **WordNet** | Scales to **1000** | Program size scalability |

### 5.4 Human-Machine Teaching Study

**Paper**: "Can Humans Teach Machines to Code?" (Hocquette, Langer, Cropper & Schmid, 2025)

#### Research Questions

1. Do humans provide sufficient examples for program synthesis?
2. Does CS background help?
3. Are human examples better than random?

#### Study Design

| Group | Participants | Background |
|-------|--------------|------------|
| **NCS** | 14 | Non-computer scientists |
| **CS** | 25 | Computer science students |
| **Expert** | 1 | ILP researcher |

**Concepts**: last, length, append, maxlist, dropk, sorted

**Systems**: POPPER, METAGOL, ALEPH, HL, DeepSeek-Coder

#### Shocking Results

```
Predictive Accuracy:
┌─────────────────────────────────────────┐
│ Expert        ████████████████████ 100% │
│ Random        ████████████████░░░░  85% │
│ NCS Group     ███████████████░░░░░  76% │
│ CS Group      ██████████████░░░░░░  73% │
└─────────────────────────────────────────┘
```

#### Key Findings

| Question | Answer | Evidence |
|----------|--------|----------|
| **Q1**: Sufficient examples? | **NO** | Non-experts struggle to enable accurate generalization |
| **Q2**: Does CS help? | **NO** | Mann-Whitney U-test: no significant difference |
| **Q3**: Better than random? | **NO** | Random significantly outperforms humans (p < 0.05) |

#### Why Non-Experts Fail

1. **Simpler Examples**
   - Non-experts: avg list length 4-5
   - Expert: list lengths 12-14

2. **Low Element Variability**
   - Creates coincidental patterns
   - System learns wrong concept

3. **No Edge Cases**
   - Expert always includes empty list
   - Non-experts rarely do

#### What the Expert Did Differently

| Concept | Expert Strategy |
|---------|-----------------|
| **sorted** | Long varied lists + near-miss negative + empty case |
| **maxlist** | Max at different positions + empty case |
| **last** | Long list + empty case |

**Near-miss Negative Example:**
```
[1,2,4,9,13,26,39,42] → true   (sorted)
[1,2,4,9,26,25,39,42] → false  (one swap)
```

---

## 6. Stories from the Frontier

### 6.1 The Eight-Puzzle Breakthrough

**Context**: Learning transition rules for the 8-puzzle game.

```
┌───┬───┬───┐    ┌───┬───┬───┐
│ 1 │ 2 │ 3 │    │ 1 │ 2 │ 3 │
├───┼───┼───┤    ├───┼───┼───┤
│ 4 │   │ 5 │ ─► │ 4 │ 5 │   │
├───┼───┼───┤    ├───┼───┼───┤
│ 6 │ 7 │ 8 │    │ 6 │ 7 │ 8 │
└───┴───┴───┘    └───┴───┴───┘
```

**The Crisis**: POPPER couldn't find a solution in 60 minutes—drowning in pointless rules.

**The Breakthrough**: REDUCER identifies and prunes pointless rules, solving in **12 seconds** with 100% accuracy.

**Result**: 99.7% time reduction.

### 6.2 The Lego Builder's Dilemma

**Context**: A robot learning to build Lego structures accumulates hundreds of redundant rules.

**The Challenge**: Extract common patterns (predicate invention is NP-hard).

**The Solution**: MAXREFACTOR discovers that **linear invented rules** suffice, reducing search complexity from O(n·2^k) to O(n·k).

**Result**: 60% better compression than previous approaches.

### 6.3 The Teaching Paradox

**Context**: 39 volunteers try to teach machines to code.

**The Surprise**: Random examples outperform human examples by 9-12 percentage points.

**The Insight**: Quality matters more than quantity. The expert achieved 100% with fewer, carefully chosen examples.

**Implication**: Program synthesis systems need active learning or user guidance.

### 6.4 The Variable Explosion

**Context**: With 9 variables, the solver explores equivalent hypotheses millions of times.

**The Numbers**:
```
Variables:    5      7       8        9
Permutations: 120    5,040   40,320   362,880
Solving Time: 0.1s   12s     6min     >60min
```

**The Discovery**: Body-variant detection is **GI-hard**, but we can still break most symmetries.

**Result**: 99.5% solving time reduction (1 hour → 17 seconds).

---

## 7. Industrial Applications

### 7.1 Google DeepMind

#### AlphaCode & Program Synthesis

- **Semantic Constraints**: Filter invalid programs (like REDUCER)
- **Clustering**: Remove equivalent solutions (like Symmetry Breaking)
- **Chain-of-thought**: Parallels compositional rule learning

#### AlphaFold

- **Geometric Constraints**: Encode domain knowledge (like BK in ILP)
- **Structure Prediction**: Constraint satisfaction approach

### 7.2 Microsoft

#### PROSE SDK & FlashFill

```
Input:          Output:
"John Smith" → "J. Smith"

Learned Program:
Concat(SubStr(0,1), ". ", GetLastName())
```

**ILP Connections**:
- Version Space Algebra ≈ Hypothesis lattice
- Witness Functions ≈ Pruning constraints
- Ranking Heuristics ≈ Occam's razor

#### GitHub Copilot

The "Human Teaching" findings apply: users often provide insufficient context for accurate code generation.

### 7.3 Oracle

#### SQL Query Optimization

- **Cardinality Histograms** ≈ Background knowledge
- **Plan Enumeration** ≈ Hypothesis space search
- **Cost-based Pruning** ≈ Learning from failures

#### Autonomous Database

Learns indexing and partitioning rules automatically—a form of rule learning from execution traces.

---

## 8. Complexity-Theoretic Results

### Summary Table

| Problem | Complexity | Reference |
|---------|------------|-----------|
| **SAT** | NP-complete | Cook, 1971 |
| **θ-Subsumption** | NP-complete | Kapur & Narendran, 1986 |
| **Body-Variant** | GI-hard | Cropper et al., 2025 |
| **Optimal Refactoring** | NP-hard | Liu et al., 2024 |
| **Learning k-term DNF** | NP-hard | Pitt & Valiant, 1988 |
| **ILP (unrestricted)** | Undecidable | Džeroski et al., 1992 |
| **ILP (bounded)** | Polynomial | Muggleton, 1995 |

### PAC Learning Framework

> **Definition (PAC Learnable)**: Hypothesis class H is **PAC learnable** if there exists algorithm A such that:
> ```
> ∀ε,δ > 0, ∀D, ∀c ∈ H: P[error(h) ≤ ε] ≥ 1-δ
> ```
> where h = A(sample of size m = poly(1/ε, 1/δ, size(c)))

### Sample Complexity

> **Theorem (ILP Sample Complexity)**: Under appropriate language biases, ILP achieves **logarithmic sample complexity** O(log|H|).

**Proof Sketch**: Each example eliminates a constant fraction of hypotheses. After m examples: |H_remaining| ≤ |H| × (1-ε)^m.

---

## 9. Interactive Platform Guide

### Section Overview

| Section | Level | Content |
|---------|-------|---------|
| **01. Foundations** | Beginner→PhD | Core concepts, examples, theory |
| **02. Stories** | Intermediate | Real-world narratives |
| **03. Solvers** | Advanced | SAT, ASP, CSP, MaxSAT |
| **04. Systems** | Advanced | FOIL, Progol, ALEPH, Metagol, POPPER |
| **05. Playground** | All levels | Interactive demos |
| **06. Research** | Advanced | Current trends |
| **07. Advanced** | PhD | 2024-2025 papers |

### Interactive Demos

1. **Hypothesis Lattice Explorer**
   - Visualize lattice structure
   - Adjust language bias parameters
   - Animate search with multiple strategies
   - Real-time pruning visualization

2. **REDUCER Pointless Rule Detector**
   - Toggle literals to test rules
   - See captured literal analysis
   - Check reducibility and indiscriminateness

3. **Symmetry Breaking Safe Variable Analyzer**
   - Compare equivalent rules
   - Literal-by-literal analysis
   - Witness checking

4. **MAXREFACTOR Compression Demo**
   - Before/after comparison
   - Invented rule visualization
   - Compression statistics

5. **Human Teaching Quality Analyzer**
   - Example quality metrics
   - Expert vs. non-expert comparison

### Complexity Slider

The platform includes a **complexity slider** (1-5) that shows/hides content based on expertise level:

| Level | Label | Content Shown |
|-------|-------|---------------|
| 1 | Beginner | Basic concepts, simple examples |
| 2 | Intermediate | Working knowledge, algorithms |
| 3 | Advanced | Technical details, proofs |
| 4 | Expert | Full formalization |
| 5 | PhD | Research frontier |

---

## 10. References & Citations

### Foundational Papers

1. **Muggleton, S. (1991)**. Inductive Logic Programming. *New Generation Computing*, 8(4), 295-318.

2. **Quinlan, J.R. (1990)**. Learning Logical Definitions from Relations. *Machine Learning*, 5(3), 239-266.

3. **Muggleton, S. (1995)**. Inverse Entailment and Progol. *New Generation Computing*, 13(3-4), 245-286.

4. **Srinivasan, A. (2001)**. The ALEPH Manual. *Technical Report*, Oxford University.

### Modern Systems

5. **Muggleton, S., Lin, D., Pahlavi, N., & Tamaddoni-Nezhad, A. (2014)**. Meta-interpretive Learning: Application to Grammatical Inference. *Machine Learning*, 94(1), 25-49.

6. **Cropper, A., & Morel, R. (2021)**. Learning Programs by Learning from Failures. *Machine Learning*, 110(4), 801-856.

### 2024-2025 Research (Integrated in Platform)

7. **Liu, M., Cerna, D.M., Gouveia, F., & Cropper, A. (2024)**. Scalable Knowledge Refactoring using Constrained Optimisation. *arXiv:2408.11530*.

8. **Cropper, A., & Cerna, D.M. (2025)**. Efficient Rule Induction by Ignoring Pointless Rules. *arXiv:2502.01232*.

9. **Cropper, A., Cerna, D.M., & Järvisalo, M. (2025)**. Symmetry Breaking for Inductive Logic Programming. *arXiv:2508.06263*.

10. **Hocquette, C., Langer, J., Cropper, A., & Schmid, U. (2025)**. Can Humans Teach Machines to Code? *arXiv:2404.19397*.

### Complexity Theory

11. **Cook, S.A. (1971)**. The Complexity of Theorem-Proving Procedures. *STOC*, 151-158.

12. **Kapur, D., & Narendran, P. (1986)**. NP-completeness of the Set Unification and Matching Problems. *CADE*, 489-495.

13. **van der Laag, P.R.J., & Nienhuys-Cheng, S.-H. (1994)**. Existence and Nonexistence of Complete Refinement Operators. *ECML*, 307-322.

---

## 11. Glossary

### A-C

| Term | Definition |
|------|------------|
| **Answer Set Programming (ASP)** | Declarative programming paradigm based on stable model semantics |
| **Arity** | Number of arguments a predicate takes |
| **Background Knowledge (BK)** | Pre-existing facts and rules available during learning |
| **Body (of clause)** | The conditions/premises of a rule (after `:-`) |
| **Body-Variant** | Two rules that are equivalent up to variable renaming |
| **Captured Literal** | A literal whose variables all appear elsewhere in the rule |
| **Clause** | A disjunction of literals (in ILP, usually Horn clauses) |
| **CNF** | Conjunctive Normal Form—conjunction of disjunctions |
| **Completeness** | Property that all positive examples are covered |
| **Consistency** | Property that no negative examples are covered |
| **CSP** | Constraint Satisfaction Problem |

### D-H

| Term | Definition |
|------|------------|
| **Determination** | Declaration specifying which predicates can appear together |
| **DPLL** | Davis-Putnam-Logemann-Loveland algorithm for SAT |
| **Entailment (⊨)** | Logical consequence relation |
| **FOIL** | First-Order Inductive Learner (Quinlan, 1990) |
| **Generalization** | Making a hypothesis more general (covering more examples) |
| **GI-hard** | At least as hard as Graph Isomorphism |
| **Ground (atom/term)** | Contains no variables |
| **Head (of clause)** | The conclusion of a rule (before `:-`) |
| **Horn Clause** | Clause with at most one positive literal |
| **Hypothesis** | A proposed logic program to explain examples |
| **Hypothesis Space (ℋ)** | Set of all possible hypotheses |

### I-M

| Term | Definition |
|------|------------|
| **ILP** | Inductive Logic Programming |
| **Indiscriminate Rule** | Rule that cannot distinguish positive from negative examples |
| **Inverse Entailment** | Technique for constructing most specific clauses |
| **Language Bias** | Constraints on the hypothesis space |
| **Literal** | An atom or its negation |
| **MaxSAT** | Optimization variant of SAT |
| **Meta-Interpretive Learning (MIL)** | Learning via proving with metarules |
| **Metarule** | Higher-order template for rule structure |
| **Mode Declaration** | Specification of how predicates can be used |

### N-R

| Term | Definition |
|------|------------|
| **NP-complete** | Problems solvable in polynomial time by a non-deterministic Turing machine |
| **NP-hard** | At least as hard as NP-complete problems |
| **Occam's Razor** | Prefer simpler hypotheses |
| **PAC Learning** | Probably Approximately Correct learning framework |
| **Pointless Rule** | Rule that can never be in an optimal hypothesis |
| **Predicate Invention** | Automatic creation of new predicates |
| **Progol** | ILP system using inverse entailment (Muggleton, 1995) |
| **Recall (in modes)** | Maximum times a mode can be used |
| **Reducible Rule** | Rule containing an implied literal |
| **Refinement Operator** | Function mapping hypotheses to neighbors in the lattice |

### S-W

| Term | Definition |
|------|------------|
| **SAT** | Boolean Satisfiability Problem |
| **Skipped Variable** | Variable missing from a literal that "should" be there |
| **Specialization** | Making a hypothesis more specific (covering fewer examples) |
| **Stable Model** | Minimal model of an ASP program's reduct |
| **Substitution (θ)** | Mapping from variables to terms |
| **θ-Subsumption** | Generality ordering on clauses |
| **Type** | Domain restriction on variables |
| **Undecidable** | Problem with no algorithmic solution |
| **Witnessed Variable** | Skipped variable that appears in a smaller literal |

---

## Appendix A: Quick Reference Cards

### ILP Problem Setup

```
┌─────────────────────────────────────────┐
│         ILP LEARNING SETUP              │
├─────────────────────────────────────────┤
│ 1. Define target predicate              │
│ 2. Provide background knowledge         │
│ 3. Collect positive examples            │
│ 4. Collect negative examples            │
│ 5. Specify language bias                │
│ 6. Run ILP system                       │
│ 7. Evaluate learned hypothesis          │
└─────────────────────────────────────────┘
```

### Mode Declaration Cheat Sheet

```
modeh(Recall, Predicate(Args))    % Head mode
modeb(Recall, Predicate(Args))    % Body mode

+Type  → Input (must be bound)
-Type  → Output (will be bound)
#Type  → Constant

Recall: 1 = once, * = any, n = max n times
```

### θ-Subsumption Quick Test

```
C₁ ≤θ C₂ ?

1. Find substitution θ
2. Apply θ to C₁
3. Check if C₁θ ⊆ C₂
4. If yes → C₁ is more general
```

### POPPER Constraint Types

```
┌──────────────────┬──────────────────────────────────┐
│ Constraint Type  │ When Applied                     │
├──────────────────┼──────────────────────────────────┤
│ Generalization   │ H too specific (misses E⁺)       │
│ Specialization   │ H too general (covers E⁻)        │
│ Elimination      │ H both incomplete & inconsistent │
└──────────────────┴──────────────────────────────────┘
```

---

## Appendix B: Further Reading

### Textbooks

- **Nienhuys-Cheng, S.-H., & de Wolf, R. (1997)**. *Foundations of Inductive Logic Programming*. Springer.

- **De Raedt, L. (2008)**. *Logical and Relational Learning*. Springer.

- **Muggleton, S., & De Raedt, L. (1994)**. Inductive Logic Programming: Theory and Methods. *Journal of Logic Programming*, 19-20, 629-679.

### Online Resources

- **POPPER GitHub**: https://github.com/logic-and-learning-lab/Popper
- **ALEPH Manual**: https://www.cs.ox.ac.uk/activities/programinduction/Aleph/
- **Clingo (ASP)**: https://potassco.org/clingo/
- **Logic and Learning Lab**: https://www.cs.ox.ac.uk/people/andrew.cropper/

### Conferences & Journals

- **ILP** (International Conference on Inductive Logic Programming)
- **IJCAI** (International Joint Conference on Artificial Intelligence)
- **AAAI** (Association for Advancement of Artificial Intelligence)
- **Machine Learning** (Journal)
- **Artificial Intelligence** (Journal)

---

## License & Acknowledgments

This platform was developed as an educational resource for understanding Inductive Logic Programming research.

**Research Integration**: The platform integrates findings from the Logic and Learning Lab at Oxford, particularly the work of Andrew Cropper and collaborators.

**Papers Cited**:
- REDUCER (Cropper & Cerna, 2025)
- Symmetry Breaking (Cropper, Cerna & Järvisalo, 2025)
- MAXREFACTOR (Liu, Cerna, Gouveia & Cropper, 2024)
- Human Teaching (Hocquette, Langer, Cropper & Schmid, 2025)

---

*Last Updated: January 2026*

*Platform Version: 1.0*

*Total Lines: ~16,600 (HTML + CSS + JS)*
