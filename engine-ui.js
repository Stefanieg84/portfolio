// engine-ui.js - UI management and interactions

import { dataManager } from './engine-data.js';

export class UIManager {
    constructor() {
        this.currentMode = 'explore';
        this.currentEvidenceTab = 'github';
        this.selectedRating = 0;
    }

    init() {
        this.setupModeButtons();
        this.setupEvidenceTabs();
        this.setupRatingForm();
        this.setupLifeModal();
        this.updateStats();
    }

    setupModeButtons() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchMode(btn.dataset.mode);
            });
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Update panel content
        document.querySelectorAll('.panel-content').forEach(panel => {
            panel.classList.toggle('hidden', panel.dataset.panel !== mode);
        });
        
        // Load content for mode
        switch (mode) {
            case 'stories':
                this.loadStories();
                break;
            case 'evidence':
                this.loadEvidence();
                break;
            case 'timeline':
                this.loadTimeline();
                break;
        }
    }

    updateStats() {
        const stats = dataManager.getStats();
        document.getElementById('totalUseCases').textContent = stats.totalUseCases;
        document.getElementById('totalSkills').textContent = stats.totalSkills;
        document.getElementById('totalEvidence').textContent = stats.totalEvidence;
        document.getElementById('avgCMMI').textContent = stats.avgCMMI;
    }

    updateSelectedInfo(data) {
        const infoDiv = document.getElementById('selectedInfo');
        
        if (data.type === 'core') {
            infoDiv.innerHTML = `
                <h3>Core Values</h3>
                <p>The invariant center - principles that guide all work.</p>
                <ul style="margin-top: 1rem; padding-left: 1.5rem; color: var(--color-text-muted);">
                    <li>Human-centred systems</li>
                    <li>Protection against adverse behaviour</li>
                    <li>Governance as enabler of innovation</li>
                    <li>Sustainable, long-term change</li>
                    <li>Decision integrity under uncertainty</li>
                </ul>
            `;
        } else if (data.type === 'skill') {
            const skill = data.data;
            const evidence = dataManager.getSkillEvidence(skill.skill_id);
            const decay = dataManager.getSkillDecay(skill.skill_id);
            
            infoDiv.innerHTML = `
                <h3>${skill.skill_name}</h3>
                <div style="margin: 0.5rem 0;">
                    <span style="display: inline-block; padding: 0.25rem 0.75rem; background: ${dataManager.getCMMIColor(skill.cmmi_level)}; border-radius: 4px; font-size: 0.75rem;">
                        CMMI Level ${skill.cmmi_level}
                    </span>
                    <span style="margin-left: 0.5rem; color: var(--color-text-muted); font-size: 0.85rem;">
                        Practice Currency: ${(decay * 100).toFixed(0)}%
                    </span>
                </div>
                <p style="margin-top: 1rem; font-style: italic; color: var(--color-text-muted);">${skill.interest_reason}</p>
                <div style="margin-top: 1rem;">
                    <strong style="font-size: 0.85rem;">Evidence Items:</strong> ${evidence.length}
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--color-text-muted);">
                    Last practice: ${new Date(skill.last_practice_date).toLocaleDateString()}
                </div>
            `;
        } else if (data.type === 'usecase') {
            const useCase = data.data;
            
            infoDiv.innerHTML = `
                <h3>${useCase.case_name}</h3>
                <div style="margin: 0.5rem 0; font-size: 0.75rem; color: var(--color-text-muted);">
                    ${useCase.domain} • ${new Date(useCase.date).toLocaleDateString()}
                </div>
                <p style="margin-top: 1rem; line-height: 1.6;">${useCase.story}</p>
                <div style="margin-top: 1rem; padding: 1rem; background: var(--color-bg); border-left: 3px solid var(--color-success);">
                    <strong style="font-size: 0.85rem; color: var(--color-success);">Outcome:</strong>
                    <p style="margin-top: 0.5rem; font-size: 0.85rem;">${useCase.outcome}</p>
                </div>
                ${useCase.evidence_links ? `
                    <div style="margin-top: 1rem;">
                        <a href="${useCase.evidence_links}" target="_blank" style="color: var(--color-accent); text-decoration: none;">View Evidence →</a>
                    </div>
                ` : ''}
            `;
        }
    }

    loadStories() {
        const filter = document.getElementById('storiesFilter').value;
        const useCases = dataManager.getUseCasesByDomain(filter);
        const storiesList = document.getElementById('storiesList');
        
        storiesList.innerHTML = useCases.map(useCase => `
            <div class="story-card" data-case-id="${useCase.case_id}">
                <h3>${useCase.case_name}</h3>
                <div class="story-meta">${useCase.domain} • ${new Date(useCase.date).toLocaleDateString()}</div>
                <p>${useCase.story}</p>
            </div>
        `).join('');
        
        // Add click handlers
        storiesList.querySelectorAll('.story-card').forEach(card => {
            card.addEventListener('click', () => {
                const caseId = card.dataset.caseId;
                const useCase = useCases.find(uc => uc.case_id === caseId);
                this.showStoryDetail(useCase);
            });
        });
    }

    showStoryDetail(useCase) {
        const infoDiv = document.getElementById('selectedInfo');
        if (this.currentMode === 'explore') {
            this.updateSelectedInfo({ type: 'usecase', data: useCase });
        }
    }

    setupEvidenceTabs() {
        const tabs = document.querySelectorAll('.evidence-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchEvidenceTab(tab.dataset.tab);
            });
        });
    }

    switchEvidenceTab(tab) {
        this.currentEvidenceTab = tab;
        
        // Update tab states
        document.querySelectorAll('.evidence-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        
        // Load content
        this.loadEvidence();
    }

    loadEvidence() {
        const content = document.getElementById('evidenceContent');
        
        switch (this.currentEvidenceTab) {
            case 'github':
                content.innerHTML = this.renderGitHubActivity();
                break;
            case 'reviews':
                content.innerHTML = this.renderPerformanceReviews();
                break;
            case 'testimonials':
                content.innerHTML = this.renderTestimonials();
                break;
            case 'ratings':
                content.innerHTML = this.renderPublicRatings();
                break;
        }
    }

    renderGitHubActivity() {
        return dataManager.data.githubActivity.map(activity => `
            <div class="evidence-item">
                <h4>${activity.repo_name}</h4>
                <div class="meta">${activity.language} • ${activity.commit_count} commits • Last: ${new Date(activity.last_commit_date).toLocaleDateString()}</div>
                <p>Skills: ${activity.skills_demonstrated.map(s => {
                    const skill = dataManager.getSkillById(s);
                    return skill ? skill.skill_name : s;
                }).join(', ')}</p>
            </div>
        `).join('');
    }

    renderPerformanceReviews() {
        return dataManager.data.performanceReviews.map(review => `
            <div class="evidence-item">
                <h4>Performance Review</h4>
                <div class="meta">${new Date(review.review_date).toLocaleDateString()} • ${new Date(review.period_start).toLocaleDateString()} to ${new Date(review.period_end).toLocaleDateString()}</div>
                <p><strong>Key Strengths:</strong></p>
                <ul style="margin: 0.5rem 0 0.5rem 1.5rem; color: var(--color-text-muted);">
                    ${review.key_strengths.map(s => `<li>${s}</li>`).join('')}
                </ul>
                <p><strong>Areas Developed:</strong></p>
                <ul style="margin: 0.5rem 0; color: var(--color-text-muted); margin-left: 1.5rem;">
                    ${review.areas_developed.map(a => `<li>${a}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    renderTestimonials() {
        return dataManager.data.testimonials.map(testimonial => `
            <div class="evidence-item">
                <h4>${testimonial.author_name}</h4>
                <div class="meta">${testimonial.author_role} • ${testimonial.source} • ${new Date(testimonial.date).toLocaleDateString()}</div>
                <p>${testimonial.text}</p>
            </div>
        `).join('');
    }

    renderPublicRatings() {
        const ratingsBySkill = {};
        dataManager.data.publicRatings.forEach(rating => {
            if (!ratingsBySkill[rating.skill_id]) {
                ratingsBySkill[rating.skill_id] = [];
            }
            ratingsBySkill[rating.skill_id].push(rating);
        });
        
        return Object.entries(ratingsBySkill).map(([skillId, ratings]) => {
            const skill = dataManager.getSkillById(skillId);
            const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
            
            return `
                <div class="evidence-item">
                    <h4>${skill ? skill.skill_name : skillId}</h4>
                    <div class="meta">Average Rating: ${avgRating.toFixed(1)}/5 (${ratings.length} ratings)</div>
                    ${ratings.map(r => `
                        <p style="font-size: 0.85rem; margin-top: 0.5rem;">
                            <strong>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</strong> - ${r.context}
                            <br><span style="color: var(--color-text-muted); font-size: 0.75rem;">${r.observer_role} • ${new Date(r.date).toLocaleDateString()}</span>
                        </p>
                    `).join('')}
                </div>
            `;
        }).join('');
    }

    setupRatingForm() {
        // Populate skill dropdown
        const skillSelect = document.getElementById('ratingSkill');
        dataManager.data.skills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill.skill_id;
            option.textContent = skill.skill_name;
            skillSelect.appendChild(option);
        });
        
        // Setup star rating
        const stars = document.querySelectorAll('#ratingStars span');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                this.selectedRating = parseInt(star.dataset.value);
                this.updateStars();
            });
        });
        
        // Setup form submission
        document.getElementById('ratingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitRating();
        });
    }

    updateStars() {
        const stars = document.querySelectorAll('#ratingStars span');
        stars.forEach((star, index) => {
            if (index < this.selectedRating) {
                star.textContent = '★';
                star.classList.add('active');
            } else {
                star.textContent = '☆';
                star.classList.remove('active');
            }
        });
    }

    async submitRating() {
        const skillId = document.getElementById('ratingSkill').value;
        const context = document.getElementById('ratingContext').value;
        const notes = document.getElementById('ratingNotes').value;
        
        if (!this.selectedRating || !context) {
            alert('Please provide a rating and context');
            return;
        }
        
        const ratingData = {
            skillId: skillId,
            rating: this.selectedRating,
            context: context,
            role: context, // Using context as role for simplicity
            notes: notes
        };
        
        await dataManager.submitRating(ratingData);
        
        alert('Thank you for your rating! In production, this would be saved to a database.');
        
        // Reset form
        document.getElementById('ratingForm').reset();
        this.selectedRating = 0;
        this.updateStars();
        
        // Reload ratings if on evidence tab
        if (this.currentMode === 'evidence') {
            this.loadEvidence();
        }
    }

    setupLifeModal() {
        const btn = document.getElementById('lifeContextBtn');
        const modal = document.getElementById('lifeModal');
        const close = modal.querySelector('.modal-close');
        
        btn.addEventListener('click', () => {
            modal.classList.add('active');
        });
        
        close.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    loadTimeline() {
        const range = document.getElementById('timelineRange').value;
        const years = range === '1y' ? 1 : range === '3y' ? 3 : 10;
        const timelineData = dataManager.getTimelineData(years);
        
        // This would integrate with D3.js for proper visualization
        // For now, showing a simple list
        const viz = document.getElementById('timelineViz');
        viz.innerHTML = `
            <div style="padding: 2rem; color: var(--color-text-muted);">
                <p>Timeline visualization would show ${timelineData.length} events over ${years} year(s).</p>
                <p style="margin-top: 1rem; font-size: 0.85rem;">Events include assessments, projects, and learning activities with skill maturity progression over time.</p>
                <div style="margin-top: 2rem;">
                    ${timelineData.slice(0, 5).map(event => `
                        <div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--color-surface); border-left: 3px solid ${dataManager.getSignalColor(event.type)};">
                            <strong>${new Date(event.date).toLocaleDateString()}</strong> - ${event.type}
                            <br><span style="font-size: 0.85rem;">${event.name || event.skill}</span>
                        </div>
                    `).join('')}
                    ${timelineData.length > 5 ? `<p style="font-size: 0.85rem; margin-top: 1rem;">... and ${timelineData.length - 5} more events</p>` : ''}
                </div>
            </div>
        `;
    }
}
