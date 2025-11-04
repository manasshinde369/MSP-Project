// Education Hub functionality

const Education = {
    // Learning content data
    content: {
        articles: [
            {
                id: 'article-1',
                title: 'The Hidden Cost of Our Digital Lives',
                excerpt: 'Exploring the environmental impact of our increasing reliance on electronic devices and digital services.',
                readTime: '5 min read',
                tags: ['Environmental Impact', 'Digital Footprint'],
                difficulty: 'Beginner',
                publishDate: '2024-01-15',
                author: 'Dr. Sarah Chen',
                content: `
                    <h3>The Digital Revolution's Environmental Shadow</h3>
                    <p>As we embrace the convenience of digital technology, we often overlook the environmental costs hidden behind our screens. Every smartphone, laptop, and smart device carries an invisible burden of resource extraction, manufacturing emissions, and eventual waste.</p>
                    
                    <h3>The Manufacturing Footprint</h3>
                    <p>The production of a single smartphone requires over 60 different elements from the periodic table, including rare earth metals that are extracted through environmentally destructive mining processes. The carbon footprint of manufacturing a smartphone is approximately 85 kg of CO₂ equivalent.</p>
                    
                    <h3>The Usage Phase</h3>
                    <p>While using our devices, we contribute to energy consumption through charging, data transmission, and cloud storage. The global ICT sector accounts for approximately 4% of global greenhouse gas emissions, and this figure is growing rapidly.</p>
                    
                    <h3>The End-of-Life Challenge</h3>
                    <p>When devices reach the end of their useful life, they become electronic waste. Only 20% of global e-waste is formally collected and recycled, leaving 80% to be improperly disposed of, often in developing countries where it poses serious health and environmental risks.</p>
                `
            },
            {
                id: 'article-2',
                title: 'Circular Design: Electronics for the Future',
                excerpt: 'How manufacturers are designing products for better recyclability and longer lifespans.',
                readTime: '8 min read',
                tags: ['Circular Economy', 'Design'],
                difficulty: 'Intermediate',
                publishDate: '2024-01-10',
                author: 'Prof. Michael Rodriguez',
                content: `
                    <h3>Rethinking Product Design</h3>
                    <p>The circular economy model challenges the traditional "take-make-dispose" approach to manufacturing. In electronics, this means designing products that can be easily repaired, upgraded, and ultimately recycled.</p>
                    
                    <h3>Design for Disassembly</h3>
                    <p>Modern circular design principles emphasize creating products that can be easily taken apart at the end of their life. This includes using fewer types of materials, avoiding permanent adhesives, and clearly marking different material types.</p>
                    
                    <h3>Modular Architecture</h3>
                    <p>Companies like Fairphone have pioneered modular smartphone designs where individual components can be replaced or upgraded without discarding the entire device. This approach can extend device lifespans from 2-3 years to 7-10 years.</p>
                    
                    <h3>Material Innovation</h3>
                    <p>Researchers are developing new materials that are both high-performing and environmentally friendly. Bio-based plastics, recycled metals, and conflict-free minerals are becoming more common in electronic devices.</p>
                `
            },
            {
                id: 'article-3',
                title: 'Right to Repair: A Global Movement',
                excerpt: 'Understanding the right to repair movement and its impact on reducing electronic waste.',
                readTime: '6 min read',
                tags: ['Policy', 'Repair'],
                difficulty: 'Beginner',
                publishDate: '2024-01-05',
                author: 'Lisa Thompson',
                content: `
                    <h3>What is Right to Repair?</h3>
                    <p>The Right to Repair movement advocates for legislation that would require manufacturers to make spare parts, tools, and repair manuals available to consumers and independent repair shops.</p>
                    
                    <h3>Current Challenges</h3>
                    <p>Many manufacturers use proprietary screws, serialize parts, or void warranties when devices are repaired by third parties. This creates artificial barriers to repair and forces consumers to replace rather than fix their devices.</p>
                    
                    <h3>Legislative Progress</h3>
                    <p>Several countries and states have introduced Right to Repair legislation. The European Union has implemented rules for certain appliances, and several U.S. states are considering similar measures for electronics.</p>
                    
                    <h3>Environmental Impact</h3>
                    <p>Enabling repair could significantly reduce e-waste. Studies suggest that extending device lifespans by just one year could reduce environmental impact by 25-30%.</p>
                `
            }
        ],
        
        videos: [
            {
                id: 'video-1',
                title: 'Inside an E-Waste Recycling Facility',
                excerpt: 'A documentary-style tour of a modern e-waste processing facility showing advanced recycling technologies.',
                duration: '12 minutes',
                tags: ['Recycling', 'Technology'],
                difficulty: 'Beginner',
                publishDate: '2024-01-12',
                thumbnail: 'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop'
            }
        ],
        
        infographics: [
            {
                id: 'infographic-1',
                title: 'E-Waste by the Numbers',
                excerpt: 'Visual representation of global e-waste statistics and trends over the past decade.',
                tags: ['Statistics', 'Global Trends'],
                difficulty: 'Beginner',
                publishDate: '2024-01-08',
                thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop'
            }
        ],
        
        guides: [
            {
                id: 'guide-1',
                title: 'How to Properly Dispose of Electronics',
                excerpt: 'Complete guide on preparing and disposing of various electronic devices safely and responsibly.',
                tags: ['Disposal', 'How-to'],
                difficulty: 'Beginner',
                publishDate: '2024-01-03',
                steps: 12
            }
        ]
    },

    currentTab: 'articles',
    
    // Initialize education hub
    init: function() {
        this.setupEventListeners();
        this.loadFeaturedContent();
        this.renderTabContent();
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.textContent.toLowerCase().trim();
                this.switchTab(tabName);
            });
        });

        // Category cards
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleCategoryClick(card);
            });
        });
    },

    // Load featured content
    loadFeaturedContent: function() {
        // Animate featured card on load
        const featuredCard = document.querySelector('.featured-card');
        if (featuredCard) {
            EcoTech.Animations.fadeIn(featuredCard, 500);
        }

        // Add click handler for featured course
        const startButton = document.querySelector('.featured-content .btn-primary');
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.startFeaturedCourse();
            });
        }
    },

    // Switch between tabs
    switchTab: function(tabName) {
        // Update active tab button
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.classList.remove('active');
            if (button.textContent.toLowerCase().includes(tabName)) {
                button.classList.add('active');
            }
        });

        // Update active tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        const activeTab = document.getElementById(tabName);
        if (activeTab) {
            activeTab.classList.add('active');
            this.currentTab = tabName;
            this.renderTabContent();
        }
    },

    // Render content for current tab
    renderTabContent: function() {
        const tabContent = document.getElementById(this.currentTab);
        if (!tabContent) return;

        const resourceList = tabContent.querySelector('.resource-list');
        if (!resourceList) return;

        const content = this.content[this.currentTab] || [];
        
        // Clear existing content
        resourceList.innerHTML = '';

        if (content.length === 0) {
            resourceList.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-xl); color: var(--gray-500);">
                    <i class="fas fa-book-open" style="font-size: var(--font-size-3xl); margin-bottom: var(--spacing-md);"></i>
                    <p>More ${this.currentTab} coming soon!</p>
                </div>
            `;
            return;
        }

        // Render content items
        content.forEach(item => {
            const itemElement = this.createContentItem(item);
            resourceList.appendChild(itemElement);
        });
    },

    // Create content item element
    createContentItem: function(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'resource-item';
        itemDiv.style.cursor = 'pointer';

        const resourceType = this.currentTab.slice(0, -1); // Remove 's' from plural
        const timeInfo = item.readTime || item.duration || (item.steps ? `${item.steps} steps` : 'Visual');

        itemDiv.innerHTML = `
            <div class="resource-meta">
                <span class="resource-type">${resourceType}</span>
                <span class="resource-time">${timeInfo}</span>
                ${item.difficulty ? `<span class="resource-difficulty" style="background: var(--info-color); color: white; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--radius-sm); font-size: var(--font-size-xs); font-weight: 600;">${item.difficulty}</span>` : ''}
            </div>
            <h3>${item.title}</h3>
            <p>${item.excerpt}</p>
            <div class="resource-tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            ${item.author ? `<div style="margin-top: var(--spacing-sm); color: var(--gray-500); font-size: var(--font-size-sm);">By ${item.author} • ${EcoTech.Utils.formatDate(item.publishDate)}</div>` : ''}
        `;

        // Add click handler
        itemDiv.addEventListener('click', () => {
            this.openContentItem(item);
        });

        // Add hover effect
        itemDiv.addEventListener('mouseenter', () => {
            itemDiv.style.transform = 'translateY(-2px)';
            itemDiv.style.boxShadow = 'var(--shadow-md)';
        });

        itemDiv.addEventListener('mouseleave', () => {
            itemDiv.style.transform = '';
            itemDiv.style.boxShadow = '';
        });

        return itemDiv;
    },

    // Open content item in modal or new page
    openContentItem: function(item) {
        if (item.content) {
            this.openArticleModal(item);
        } else {
            // For videos, infographics, and guides, show placeholder
            EcoTech.Utils.showNotification(`Opening ${item.title}...`, 'info');
            
            // Simulate content loading
            setTimeout(() => {
                EcoTech.Utils.showNotification(`${item.title} would open in a new window or embedded player`, 'success');
            }, 1000);
        }
    },

    // Open article in modal
    openArticleModal: function(article) {
        const existingModal = document.getElementById('articleModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'articleModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <div>
                        <h2>${article.title}</h2>
                        <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-xs); color: var(--gray-500); font-size: var(--font-size-sm);">
                            <span>By ${article.author}</span>
                            <span>•</span>
                            <span>${EcoTech.Utils.formatDate(article.publishDate)}</span>
                            <span>•</span>
                            <span>${article.readTime}</span>
                        </div>
                    </div>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div style="padding: var(--spacing-lg);">
                    <div class="article-tags" style="margin-bottom: var(--spacing-lg);">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="article-content" style="line-height: 1.8; color: var(--gray-700);">
                        ${article.content}
                    </div>
                    <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-lg); border-top: 1px solid var(--gray-200);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <button class="btn btn-outline" onclick="Education.shareArticle('${article.id}')">
                                    <i class="fas fa-share"></i> Share
                                </button>
                                <button class="btn btn-outline" onclick="Education.bookmarkArticle('${article.id}')" style="margin-left: var(--spacing-sm);">
                                    <i class="fas fa-bookmark"></i> Bookmark
                                </button>
                            </div>
                            <div style="color: var(--gray-500); font-size: var(--font-size-sm);">
                                <i class="fas fa-eye"></i> 1,247 views
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Track article view
        this.trackContentView(article.id);
    },

    // Handle category card click
    handleCategoryClick: function(card) {
        const categoryName = card.querySelector('h3').textContent;
        
        // Add visual feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Show category content (placeholder)
        EcoTech.Utils.showNotification(`Loading ${categoryName} content...`, 'info');
        
        setTimeout(() => {
            EcoTech.Utils.showNotification(`${categoryName} course would start here`, 'success');
        }, 1000);
    },

    // Start featured course
    startFeaturedCourse: function() {
        EcoTech.Utils.showNotification('Starting Complete E-Waste Management Course...', 'info');
        
        // Simulate course loading
        setTimeout(() => {
            EcoTech.Utils.showNotification('Course would begin with Module 1: Introduction to E-Waste', 'success');
        }, 1500);
    },

    // Share article
    shareArticle: function(articleId) {
        const article = this.content.articles.find(a => a.id === articleId);
        if (!article) return;

        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const shareText = `${article.title}\n${article.excerpt}\n${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                EcoTech.Utils.showNotification('Article link copied to clipboard!', 'success');
            });
        }
    },

    // Bookmark article
    bookmarkArticle: function(articleId) {
        const bookmarks = EcoTech.Storage.get('education_bookmarks') || [];
        
        if (bookmarks.includes(articleId)) {
            // Remove bookmark
            const index = bookmarks.indexOf(articleId);
            bookmarks.splice(index, 1);
            EcoTech.Utils.showNotification('Bookmark removed', 'info');
        } else {
            // Add bookmark
            bookmarks.push(articleId);
            EcoTech.Utils.showNotification('Article bookmarked!', 'success');
        }
        
        EcoTech.Storage.set('education_bookmarks', bookmarks);
    },

    // Track content view
    trackContentView: function(contentId) {
        const views = EcoTech.Storage.get('education_views') || {};
        views[contentId] = (views[contentId] || 0) + 1;
        EcoTech.Storage.set('education_views', views);
    }
};

// Initialize education hub
function initializeEducation() {
    Education.init();
}

// Global function for tab switching
window.showTab = function(tabName) {
    Education.switchTab(tabName);
};

// Export education functionality
window.Education = Education;

console.log('Education Hub initialized');