# Development Portfolio Website

A modern, bold portfolio website designed for GRC systems architects, developers, and creative practitioners who balance technical precision with human-centered design.

## 🎨 Design Philosophy

This portfolio captures a minimalist yet bold aesthetic with:
- Strong typographic hierarchy using Bebas Neue (display) and Work Sans (body)
- Black, white, and gray color palette for professional clarity
- Geometric shapes and asymmetric layouts
- Smooth scroll animations and micro-interactions
- Code snippet integration for technical showcase
- Architecture diagram displays

## 🚀 Quick Start for GitHub Pages

### Option 1: Direct Repository Deployment

1. **Create a new repository** named `yourusername.github.io`
2. **Upload these files** to the repository:
   - `index.html`
   - `style.css`
   - `script.js`
3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: main (or master)
   - Folder: / (root)
4. **Visit**: `https://yourusername.github.io`

### Option 2: Project Repository

1. **Create any repository** (e.g., `portfolio`)
2. **Upload files** to the repository
3. **Enable GitHub Pages**:
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: main
4. **Visit**: `https://yourusername.github.io/portfolio`

### Option 3: Custom Domain

1. Follow Option 1 or 2
2. In repository settings → Pages:
   - Add your custom domain
   - Create CNAME file with your domain
3. Update DNS records with your domain provider

## 📝 Customization Guide

### Personal Information

Replace these placeholders throughout `index.html`:

```html
<!-- Navigation -->
<a href="#" class="nav-brand">Your Name</a>

<!-- Hero Section -->
<h1 class="hero-title">
    <span class="hero-title-main">creative</span>
    <span class="hero-title-sub">portfolio</span>
</h1>
<p class="hero-tagline">Your personal tagline here...</p>

<!-- Contact Info (appears twice - hero footer and thank you section) -->
<a href="mailto:hello@example.com">hello@example.com</a>
<a href="https://github.com/yourusername" target="_blank">@yourusername</a>
<a href="tel:+1234567890">+123-456-7890</a>
```

### Adding Your Images

Replace image placeholders with your actual images:

```html
<!-- Instead of: -->
<div class="image-placeholder"></div>

<!-- Use: -->
<img src="images/your-photo.jpg" alt="Description">
```

**Recommended image structure:**
```
repository/
├── index.html
├── style.css
├── script.js
├── images/
│   ├── hero-image.jpg
│   ├── about-photo.jpg
│   ├── project-1.jpg
│   ├── project-2.jpg
│   └── architecture-diagram.png
```

Then update the HTML:
```html
<div class="hero-image">
    <img src="images/hero-image.jpg" alt="Your Name">
</div>
```

### Adding Code Snippets

To showcase your GitHub projects with code:

```html
<div class="code-preview">
    <div class="code-header">
        <span>your-file-name.py</span>
    </div>
    <pre><code># Paste your actual code here
class YourClass:
    def __init__(self):
        pass
        
    def your_method(self):
        # Implementation
        return result</code></pre>
</div>
```

### Adding Architecture Diagrams

1. **Export your architecture diagram** as PNG or SVG
2. **Save to images folder**
3. **Update HTML**:

```html
<div class="architecture-diagram">
    <img src="images/your-architecture.png" alt="System Architecture">
</div>
```

### Embedding GitHub Repos

Add direct links to your repositories:

```html
<div class="project-links">
    <a href="https://github.com/yourusername/repo-name" 
       target="_blank" 
       class="project-link">View on GitHub →</a>
    <a href="https://your-live-demo.com" 
       target="_blank" 
       class="project-link">Live Demo →</a>
</div>
```

### Education & Experience

Update the timeline and work sections:

```html
<!-- Education -->
<div class="timeline-item">
    <div class="timeline-header">
        <h3>University Name</h3>
        <span class="timeline-date">[2016 - 2019]</span>
    </div>
    <p>Bachelor of Science in Computer Science, focus on Security and Systems Architecture</p>
</div>

<!-- Work Experience -->
<div class="work-item">
    <h3>Company Name</h3>
    <p>Role: Senior GRC Architect | Duration: 2020-Present
    
    Led design and implementation of enterprise compliance framework covering SOC 2, ISO 27001, and HIPAA requirements. Built automated control monitoring system reducing audit preparation time by 60%.</p>
</div>
```

## 🎨 Color Customization

To change the color scheme, edit the CSS variables in `style.css`:

```css
:root {
    --color-black: #1a1a1a;      /* Main text and accents */
    --color-white: #ffffff;       /* Backgrounds */
    --color-gray-light: #f5f5f5;  /* Light backgrounds */
    --color-gray-mid: #e0e0e0;    /* Borders and dividers */
    --color-gray-dark: #666666;   /* Secondary text */
    --color-accent: #2a2a2a;      /* Accent color */
}
```

## 🔧 Advanced Customizations

### Adding More Projects

Duplicate the project section structure:

```html
<section class="section project-detail">
    <div class="project-layout">
        <div class="project-content">
            <h3 class="project-title">third<br>project</h3>
            <p class="project-description">Description...</p>
            <div class="project-links">
                <a href="#" class="project-link">View on GitHub →</a>
            </div>
        </div>
        <div class="project-visual">
            <!-- Your visual content -->
        </div>
    </div>
</section>
```

### Adding Skills

Expand the skills section:

```html
<div class="skill-item">
    <h3>New Skill Category</h3>
    <p>Description of this skill and how you apply it.</p>
</div>
```

### Modifying Animations

Adjust animation timing in `style.css`:

```css
:root {
    --transition-fast: 0.2s ease;      /* Quick hover effects */
    --transition-smooth: 0.4s cubic-bezier(0.4, 0, 0.2, 1);  /* Smooth transitions */
}
```

### Font Changes

The site uses Google Fonts. To change fonts, update in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YOUR+FONT:wght@300;400;600&display=swap" rel="stylesheet">
```

Then update CSS variables:

```css
:root {
    --font-display: 'Your Display Font', sans-serif;
    --font-body: 'Your Body Font', sans-serif;
}
```

## 📱 Mobile Responsiveness

The site is fully responsive with breakpoints at:
- 1024px (tablets)
- 768px (mobile)

Test on various devices and adjust as needed in the media queries section of `style.css`.

## 🔍 SEO Optimization

Add meta tags to `index.html`:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Your portfolio description for search engines">
    <meta name="keywords" content="GRC, Systems Architecture, Compliance, Risk Management">
    <meta name="author" content="Your Name">
    <title>Your Name - Creative Portfolio</title>
    
    <!-- Open Graph for social media -->
    <meta property="og:title" content="Your Name - Creative Portfolio">
    <meta property="og:description" content="Your description">
    <meta property="og:image" content="https://yourdomain.com/images/og-image.jpg">
    <meta property="og:url" content="https://yourdomain.com">
</head>
```

## 🎯 Next Steps

1. **Gather your content**: photos, project descriptions, code samples
2. **Replace all placeholders** with your actual information
3. **Add your images** to an `images/` folder
4. **Test locally**: Open `index.html` in a browser
5. **Deploy to GitHub**: Push to your repository
6. **Enable GitHub Pages** in repository settings
7. **Share your portfolio**: Add the link to your resume, LinkedIn, etc.

## 🛠️ Troubleshooting

### Images not showing
- Check file paths are correct
- Ensure images folder is in the same directory as index.html
- Use relative paths: `images/photo.jpg` not `/images/photo.jpg`

### Fonts not loading
- Ensure Google Fonts link is in the `<head>` section
- Check your internet connection (fonts load from CDN)

### Animations not working
- Ensure `script.js` is linked at the bottom of `index.html`
- Check browser console (F12) for JavaScript errors

### GitHub Pages not updating
- Changes can take 5-10 minutes to deploy
- Try force refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Markdown Guide](https://www.markdownguide.org/) (for project README files)
- [Google Fonts](https://fonts.google.com/)
- [CSS Tricks](https://css-tricks.com/)

## 📄 License

This template is provided as-is for your personal portfolio use. Feel free to customize it completely to match your brand and style.

---

**Remember**: This portfolio represents you as both a technical expert and a creative practitioner. Make it authentically yours by infusing your personality, your projects, and your unique perspective on systems design that heals rather than harms.
