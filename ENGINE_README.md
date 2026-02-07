# Governed Adaptive Systems Engine (GASE)

A living, interactive 3D representation of professional practice - not a portfolio, but a governed system that reflects how you think, decide, adapt, and create impact across complex, regulated environments.

## 🎯 Philosophy

This engine is inspired by:
- **Ikigai** - alignment between values, contribution, capability, and meaning
- **Enterprise Architecture** - coherent change across business, data, application, and infrastructure
- **GRC** - protection, accountability, and trust
- **Quantitative Modelling** - signals, scenarios, optimization, sustainability
- **Human-Centered System Design** - systems that heal, not harm

### Core Principles

1. **Integration over silos**
2. **Evidence over assertion**
3. **Retrospection over prediction**
4. **Use cases over skills**
5. **Governance as enabler**
6. **Adaptation without identity loss**

## 🏗️ Architecture

### The 3D Engine Components

**1. Core (Invariant Center)**
- Glowing sphere representing your vision and values
- These never change - they're your north star

**2. Use Case Polyhedron**
- 12 faces representing stable, long-lived use cases
- Examples: Risk-based audit, Governed analytics, Executive synthesis
- Click a face to explore that use case

**3. Skill Modules**
- Floating cubes color-coded by CMMI maturity level:
  - Level 1 (Gray): Exposure
  - Level 2 (Dark Gray): Repeatable
  - Level 3 (Blue): Defined
  - Level 4 (Green): Measured & Optimized
  - Level 5 (Gold): Adaptive & Continuously Improving
- Opacity reflects practice currency (time-weighted decay)

**4. Signal Particles**
- Orbiting particles representing different signal types:
  - 🔵 Learning signals (courses, experiments)
  - 🟢 Project signals (delivery outcomes)
  - 🟡 Regulatory signals (compliance shifts)
  - 🔴 Life context signals (capacity, energy)

**5. EA Planes**
- Four semi-transparent intersecting planes:
  - Business (Blue)
  - Data (Green)
  - Application (Orange)
  - Infrastructure (Purple)
- Shows how changes ripple across all domains

**6. GRC Mesh**
- Lattice structure representing governance, risk, and control frameworks
- Visualizes the protective infrastructure

## 📁 File Structure

```
/
├── engine.html              # Main HTML file
├── engine-style.css          # Styling
├── engine-data.js            # Data loading and management
├── engine-3d.js              # Three.js 3D visualization
├── engine-ui.js              # UI panels and interactions
├── engine-main.js            # Initialization and coordination
└── data/
    ├── skills.csv            # Your skills with CMMI levels
    ├── use_cases.csv         # Real project stories
    ├── self_assessments.csv  # Monthly self-assessments
    ├── performance_reviews.csv # Performance reviews
    ├── testimonials.csv      # LinkedIn recommendations
    ├── github_activity.csv   # GitHub activity data
    └── public_ratings.csv    # Public skill ratings
```

## 🚀 Quick Start

### 1. Deploy to GitHub Pages

```bash
# Copy all files to your repository
# Enable GitHub Pages in Settings
# Point to main branch, root folder
```

### 2. Update Your Data

Edit the CSV files in the `/data` folder:

**skills.csv** - Add your skills:
```csv
skill_id,skill_name,domain,cmmi_level,interest_reason,last_practice_date,decay_rate,evidence_sources
sql_analytics,SQL & Data Modelling,Analytics Engineering,4,"Why this interests you",2024-02-01,0.15,"github,review,project"
```

**use_cases.csv** - Add your project stories:
```csv
case_id,case_name,domain,story,outcome,skills_used,date,evidence_links
uc001,Your Project,Domain,"What happened","What resulted","skill_id1,skill_id2",2024-01,"https://link"
```

**self_assessments.csv** - Monthly updates:
```csv
assessment_date,skill_id,cmmi_level,notes
2024-02-01,sql_analytics,4,"Your honest self-assessment"
```

### 3. Monthly Maintenance

Each month, update:
1. **self_assessments.csv** - Reassess your skill maturity
2. **skills.csv** - Update last_practice_date for skills you used
3. **use_cases.csv** - Add new projects/stories
4. **github_activity.csv** - Update from GitHub (or automate this)

## 📊 Data Schema

### Skills
- `skill_id`: Unique identifier
- `skill_name`: Display name
- `domain`: Category (Analytics Engineering, GRC, etc.)
- `cmmi_level`: 1-5 maturity level
- `interest_reason`: Why you find this interesting (philosophical)
- `last_practice_date`: When you last used this skill
- `decay_rate`: How fast proficiency decays without practice (0.1-0.4)
- `evidence_sources`: Pipe-separated list (github|review|project|testimonial)

### Use Cases
- `case_id`: Unique identifier
- `case_name`: Short title
- `domain`: Category
- `story`: What happened (retrospective narrative)
- `outcome`: What resulted (concrete impact)
- `skills_used`: Comma-separated skill_ids
- `date`: When this occurred
- `evidence_links`: URL to evidence (GitHub repo, etc.)

### Self Assessments
- `assessment_date`: Date of assessment
- `skill_id`: Which skill
- `cmmi_level`: Your current level (honest self-assessment)
- `notes`: Why you rated yourself this way

### Performance Reviews
- `review_date`: Review date
- `period_start`, `period_end`: Review period
- `key_strengths`: Pipe-separated list
- `areas_developed`: Pipe-separated list
- `skills_mentioned`: Comma-separated skill_ids
- `full_text`: Full review text

### Testimonials
- `testimonial_id`: Unique identifier
- `source`: Where from (LinkedIn, Email, etc.)
- `author_name`, `author_role`: Who said it
- `date`: When
- `text`: What they said
- `skills_highlighted`: Comma-separated skill_ids

### GitHub Activity
- `repo_name`: Repository name
- `language`: Primary language
- `commit_count`: Number of commits
- `last_commit_date`: Most recent commit
- `skills_demonstrated`: Comma-separated skill_ids

### Public Ratings
- `rating_id`: Unique identifier
- `skill_id`: Which skill
- `rating`: 1-5 stars
- `context`: Required - in what context did they observe you
- `observer_role`: Their role
- `date`: When rated

## 🎨 Customization

### Change Colors

Edit `engine-style.css`:
```css
:root {
    --color-accent: #4A90E2;    /* Your brand color */
    --color-success: #50C878;   /* Success/green */
    --color-warning: #FFD700;   /* Warning/gold */
}
```

### Adjust Decay Rates

In `skills.csv`, set `decay_rate`:
- 0.1: Slow decay (fundamental skills)
- 0.15-0.2: Medium decay (most skills)
- 0.25-0.4: Fast decay (rapidly evolving tech)

### Add New Domains

Just use them in your data - the system will auto-detect:
```csv
skill_id,skill_name,domain,...
new_skill,New Skill,Your New Domain,...
```

## 🔧 Advanced Features

### Automating GitHub Activity

You can automate the GitHub activity updates:

```python
# Example Python script to generate github_activity.csv
import requests
import csv
from datetime import datetime

username = "yourusername"
repos = requests.get(f"https://api.github.com/users/{username}/repos").json()

with open('data/github_activity.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['repo_name', 'language', 'commit_count', 'last_commit_date', 'skills_demonstrated'])
    
    for repo in repos:
        # Get commit count
        commits = requests.get(f"https://api.github.com/repos/{username}/{repo['name']}/commits").json()
        
        writer.writerow([
            repo['name'],
            repo['language'] or 'Multiple',
            len(commits),
            repo['pushed_at'][:10],
            'skill_id1,skill_id2'  # Map repos to skills
        ])
```

### Custom Evidence Integrations

You can extend the data sources by modifying `engine-data.js`:

```javascript
// Add LinkedIn API integration
async loadLinkedInTestimonials() {
    // Fetch from LinkedIn API
    // Parse into testimonials format
}
```

## 🎭 Interaction Modes

### Explore Mode
- Click on 3D objects to see details
- Use controls to change view and rotation
- See stats and CMMI legend

### Stories Mode
- Read retrospective project narratives
- Filter by domain
- See skills used and outcomes

### Evidence Mode
- GitHub activity verification
- Performance reviews
- Testimonials
- Public ratings
- **Submit a rating** (public form)

### Timeline Mode
- See skill evolution over time
- View signals that influenced priorities
- Track CMMI maturity progression

## 💫 Human Regulation Layer

The floating regulation items (Muay Thai, Bass Guitar) represent deliberate practices for mastery, not competition. These:
- Reduce system volatility
- Support long-term adaptability
- Provide grounding outside professional practice

## 🌍 Life Context

The "About My Life" button shows a glimpse into your world:
- Music creation
- Travel and rest
- Family and lineage
- Self-regulation practices

This is context, not branding. It helps people understand the whole person.

## 📝 Monthly Workflow

**Week 1**: Review previous month
- What skills did I practice?
- What projects did I work on?
- Any new evidence (testimonials, GitHub activity)?

**Week 2**: Update data files
- Update `self_assessments.csv`
- Update `last_practice_date` in `skills.csv`
- Add new use cases to `use_cases.csv`

**Week 3**: Refresh GitHub activity
- Run automation script or manually update
- Check for new testimonials

**Week 4**: Review and reflect
- Does my CMMI self-assessment feel honest?
- Are there skills decaying that I want to revive?
- What signals are influencing my priorities?

## 🚫 What This Is NOT

- ❌ A traditional portfolio
- ❌ A resume
- ❌ A skills list
- ❌ Performance theater
- ❌ Fake confidence

## ✅ What This IS

- ✅ A governed system reflecting your practice
- ✅ Evidence-based capability representation
- ✅ Honest about learning vs mastery
- ✅ Time-weighted and decay-aware
- ✅ Retrospective and reflective
- ✅ Adaptive without losing identity

## 🎯 For Visitors

This engine lets you:
1. **Walk through scenarios** - see real project stories
2. **Explore retrospective evidence** - what actually happened
3. **Understand decision-making** - how choices were made
4. **See impact and trade-offs** - concrete outcomes
5. **Decide alignment** - does this way of thinking match your needs?

You're not browsing a resume. You're exploring how someone thinks and works.

## 🤝 Contributing Ratings

If you've worked with Stefanie, you can rate skills in the Evidence panel. Context is required - anonymous ratings without context won't be accepted.

When rating, please specify:
- Your role / relationship
- The context in which you observed the skill
- What made it effective (or not)
- The time period

## 📄 License

This engine is a personal representation. The code structure can be adapted for your own use, but the data represents an individual's practice.

---

**Built with:** Three.js, D3.js, vanilla JavaScript, CSV data files
**Inspired by:** Ikigai, CMMI, EA, GRC, Quantitative Modeling, Human-Centered Design

*"Integration over silos. Evidence over assertion. Retrospection over prediction."*
