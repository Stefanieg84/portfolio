// engine-data.js - Data loading and management module

export class DataManager {
    constructor() {
        this.data = {
            skills: [],
            useCases: [],
            selfAssessments: [],
            performanceReviews: [],
            testimonials: [],
            githubActivity: [],
            publicRatings: []
        };
        this.loaded = false;
    }

    async loadAllData() {
        try {
            console.log('Loading data files...');
            
            // Load all CSV files
            const [skills, useCases, selfAssessments, reviews, testimonials, github, ratings] = await Promise.all([
                this.loadCSV('data/skills.csv'),
                this.loadCSV('data/use_cases.csv'),
                this.loadCSV('data/self_assessments.csv'),
                this.loadCSV('data/performance_reviews.csv'),
                this.loadCSV('data/testimonials.csv'),
                this.loadCSV('data/github_activity.csv'),
                this.loadCSV('data/public_ratings.csv')
            ]);

            this.data.skills = skills;
            this.data.useCases = useCases;
            this.data.selfAssessments = selfAssessments;
            this.data.performanceReviews = reviews;
            this.data.testimonials = testimonials;
            this.data.githubActivity = github;
            this.data.publicRatings = ratings;

            this.loaded = true;
            console.log('All data loaded successfully');
            console.log('Stats:', this.getStats());
            
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    async loadCSV(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${path}: ${response.statusText}`);
            }
            const text = await response.text();
            return this.parseCSV(text);
        } catch (error) {
            console.error(`Error loading ${path}:`, error);
            return [];
        }
    }

    parseCSV(text) {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((header, index) => {
                let value = values[index] || '';
                
                // Parse arrays (pipe-separated)
                if (value.includes('|')) {
                    value = value.split('|').map(v => v.trim());
                }
                // Parse numbers
                else if (!isNaN(value) && value !== '') {
                    value = parseFloat(value);
                }
                // Parse dates
                else if (header.includes('date') && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    value = new Date(value);
                }
                
                row[header] = value;
            });
            rows.push(row);
        }
        
        return rows;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        
        return result;
    }

    getStats() {
        return {
            totalSkills: this.data.skills.length,
            totalUseCases: this.data.useCases.length,
            totalEvidence: this.data.testimonials.length + this.data.githubActivity.length + this.data.performanceReviews.length,
            avgCMMI: this.calculateAvgCMMI()
        };
    }

    calculateAvgCMMI() {
        if (this.data.skills.length === 0) return 0;
        const sum = this.data.skills.reduce((acc, skill) => acc + skill.cmmi_level, 0);
        return (sum / this.data.skills.length).toFixed(1);
    }

    getSkillById(skillId) {
        return this.data.skills.find(s => s.skill_id === skillId);
    }

    getSkillsByDomain(domain) {
        return this.data.skills.filter(s => s.domain === domain);
    }

    getUseCasesByDomain(domain) {
        if (domain === 'all') return this.data.useCases;
        return this.data.useCases.filter(uc => uc.domain === domain);
    }

    getSkillDecay(skillId) {
        const skill = this.getSkillById(skillId);
        if (!skill) return 1.0;
        
        const lastPractice = new Date(skill.last_practice_date);
        const now = new Date();
        const daysSince = (now - lastPractice) / (1000 * 60 * 60 * 24);
        const monthsSince = daysSince / 30;
        
        // Exponential decay based on decay_rate
        const decay = Math.exp(-skill.decay_rate * monthsSince);
        return Math.max(0.3, decay); // Min 30% opacity
    }

    getSkillEvidence(skillId) {
        const evidence = [];
        
        // GitHub activity
        this.data.githubActivity.forEach(activity => {
            if (activity.skills_demonstrated.includes(skillId)) {
                evidence.push({
                    type: 'github',
                    source: activity.repo_name,
                    date: activity.last_commit_date,
                    details: `${activity.commit_count} commits in ${activity.language}`
                });
            }
        });
        
        // Testimonials
        this.data.testimonials.forEach(testimonial => {
            if (testimonial.skills_highlighted.includes(skillId)) {
                evidence.push({
                    type: 'testimonial',
                    source: testimonial.author_name,
                    role: testimonial.author_role,
                    date: testimonial.date,
                    details: testimonial.text
                });
            }
        });
        
        // Performance reviews
        this.data.performanceReviews.forEach(review => {
            if (review.skills_mentioned.includes(skillId)) {
                evidence.push({
                    type: 'review',
                    date: review.review_date,
                    period: `${review.period_start} to ${review.period_end}`,
                    details: review.full_text
                });
            }
        });
        
        // Public ratings
        this.data.publicRatings.forEach(rating => {
            if (rating.skill_id === skillId) {
                evidence.push({
                    type: 'rating',
                    rating: rating.rating,
                    context: rating.context,
                    role: rating.observer_role,
                    date: rating.date
                });
            }
        });
        
        // Sort by date (most recent first)
        evidence.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return evidence;
    }

    getTimelineData(rangeYears = 3) {
        const now = new Date();
        const startDate = new Date(now.getFullYear() - rangeYears, now.getMonth(), now.getDate());
        
        const timeline = [];
        
        // Add assessment events
        this.data.selfAssessments.forEach(assessment => {
            const date = new Date(assessment.assessment_date);
            if (date >= startDate) {
                const skill = this.getSkillById(assessment.skill_id);
                timeline.push({
                    date: date,
                    type: 'assessment',
                    skill: skill?.skill_name || assessment.skill_id,
                    cmmi: assessment.cmmi_level,
                    notes: assessment.notes
                });
            }
        });
        
        // Add project events from use cases
        this.data.useCases.forEach(useCase => {
            const date = new Date(useCase.date);
            if (date >= startDate) {
                timeline.push({
                    date: date,
                    type: 'project',
                    name: useCase.case_name,
                    skills: useCase.skills_used,
                    outcome: useCase.outcome
                });
            }
        });
        
        // Add GitHub activity as learning signals
        this.data.githubActivity.forEach(activity => {
            const date = new Date(activity.last_commit_date);
            if (date >= startDate) {
                timeline.push({
                    date: date,
                    type: 'learning',
                    name: activity.repo_name,
                    skills: activity.skills_demonstrated
                });
            }
        });
        
        // Sort by date
        timeline.sort((a, b) => a.date - b.date);
        
        return timeline;
    }

    async submitRating(ratingData) {
        // In a real implementation, this would POST to a backend
        // For now, we'll just add it to the in-memory data
        const newRating = {
            rating_id: `rating${Date.now()}`,
            skill_id: ratingData.skillId,
            rating: ratingData.rating,
            context: ratingData.context,
            observer_role: ratingData.role,
            date: new Date().toISOString().split('T')[0]
        };
        
        this.data.publicRatings.push(newRating);
        
        console.log('Rating submitted:', newRating);
        console.log('Note: In production, this would be saved to the backend');
        
        return newRating;
    }

    getDomains() {
        const domains = new Set();
        this.data.skills.forEach(skill => domains.add(skill.domain));
        this.data.useCases.forEach(useCase => domains.add(useCase.domain));
        return Array.from(domains).sort();
    }

    getCMMIColor(level) {
        const colors = {
            1: '#999999',
            2: '#777777',
            3: '#4A90E2',
            4: '#50C878',
            5: '#FFD700'
        };
        return colors[level] || '#666666';
    }

    getSignalColor(type) {
        const colors = {
            'learning': '#4A90E2',
            'project': '#50C878',
            'regulatory': '#FFD700',
            'life_context': '#E74C3C'
        };
        return colors[type] || '#999999';
    }
}

// Singleton instance
export const dataManager = new DataManager();
