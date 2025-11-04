// Global Statistics functionality

const Stats = {
    // Mock data for statistics
    data: {
        global: {
            totalEWaste: 62.5, // Million tons
            recyclingRate: 22.5, // Percentage
            lostValue: 64, // Billion USD
            countriesTracked: 195,
            yearOverYearGrowth: 8.3 // Percentage
        },
        
        regions: {
            2024: {
                asia: 26.2,
                europe: 13.8,
                americas: 12.1,
                africa: 6.2,
                oceania: 4.2
            },
            2023: {
                asia: 24.8,
                europe: 13.2,
                americas: 11.6,
                africa: 5.8,
                oceania: 4.0
            },
            2022: {
                asia: 23.1,
                europe: 12.8,
                americas: 11.2,
                africa: 5.4,
                oceania: 3.8
            }
        },
        
        deviceCategories: {
            smallIT: 35, // Smartphones, tablets, etc.
            largeEquipment: 28, // Washing machines, etc.
            temperatureExchange: 20, // Fridges, AC units
            screensMonitors: 12, // TVs, monitors
            smallEquipment: 5 // Toasters, etc.
        },
        
        countries: [
            { name: 'Norway', value: 28.5, change: 2.1, flag: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=40&h=30&fit=crop' },
            { name: 'Iceland', value: 26.8, change: 1.8, flag: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=40&h=30&fit=crop' },
            { name: 'Switzerland', value: 25.3, change: 0.0, flag: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=40&h=30&fit=crop' },
            { name: 'Denmark', value: 24.9, change: 1.2, flag: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=40&h=30&fit=crop' },
            { name: 'Luxembourg', value: 23.7, change: -0.8, flag: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=40&h=30&fit=crop' }
        ],
        
        trends: [
            {
                title: 'Mobile Device Waste',
                description: '5.3 billion mobile phones will become waste in 2024',
                change: '+12% increase from 2023',
                trend: 'up',
                icon: 'fas fa-mobile-alt'
            },
            {
                title: 'AI Hardware Impact',
                description: 'GPU and specialized AI chip disposal rising rapidly',
                change: '+28% in enterprise sector',
                trend: 'up',
                icon: 'fas fa-microchip'
            },
            {
                title: 'Device Lifespan',
                description: 'Average smartphone lifespan decreased to 2.3 years',
                change: '-0.4 years from 2020',
                trend: 'down',
                icon: 'fas fa-clock'
            },
            {
                title: 'Recycling Infrastructure',
                description: 'New certified facilities opened globally',
                change: '+156 facilities in 2024',
                trend: 'up',
                icon: 'fas fa-industry'
            }
        ],
        
        predictions: {
            2030: { value: 74.7, label: 'Projected E-Waste Generation', unit: 'M tons', trend: '19% increase from 2024' },
            2025: { value: 35, label: 'Target Recycling Rate', unit: '%', trend: 'UN SDG Target' },
            2027: { value: 150, label: 'Circular Economy Value', unit: 'B', trend: 'Market opportunity' }
        }
    },

    currentRankingType: 'generation',
    
    // Initialize stats page
    init: function() {
        this.setupEventListeners();
        this.animateKeyMetrics();
        this.renderCharts();
        this.renderTrends();
        this.renderRankings();
        this.renderPredictions();
        this.startRealTimeUpdates();
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Chart controls
        const regionChart = document.getElementById('regionChart');
        if (regionChart) {
            regionChart.addEventListener('change', (e) => {
                this.updateRegionChart(e.target.value);
            });
        }

        // Ranking tabs
        const rankingButtons = document.querySelectorAll('.rankings-tabs .tab-button');
        rankingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const rankingType = e.target.textContent.toLowerCase().replace(' ', '');
                this.switchRanking(rankingType);
            });
        });
    },

    // Animate key metrics on load
    animateKeyMetrics: function() {
        // Animate main metric
        const mainValue = document.querySelector('.metric-value .number');
        if (mainValue) {
            EcoTech.Animations.countUp(mainValue, this.data.global.totalEWaste, 2000);
        }

        // Animate other metrics
        const metricCards = document.querySelectorAll('.metric-card:not(.large)');
        metricCards.forEach((card, index) => {
            setTimeout(() => {
                const valueElement = card.querySelector('h3');
                if (valueElement) {
                    const text = valueElement.textContent;
                    const number = parseFloat(text.replace(/[^\d.]/g, ''));
                    if (!isNaN(number)) {
                        valueElement.textContent = '0';
                        EcoTech.Animations.countUp(valueElement, number, 1500);
                        setTimeout(() => {
                            valueElement.textContent = text;
                        }, 1600);
                    }
                }
            }, index * 200);
        });
    },

    // Render charts
    renderCharts: function() {
        this.renderRegionChart();
        this.renderDeviceCategoryChart();
    },

    // Render region chart
    renderRegionChart: function() {
        const year = document.getElementById('regionChart')?.value || '2024';
        const data = this.data.regions[year];
        
        if (!data) return;

        const chartBars = document.querySelectorAll('.chart-bar');
        const regions = ['asia', 'europe', 'americas', 'africa', 'oceania'];
        
        chartBars.forEach((bar, index) => {
            if (regions[index]) {
                const value = data[regions[index]];
                const maxValue = Math.max(...Object.values(data));
                const percentage = (value / maxValue) * 100;
                
                const barElement = bar.querySelector('.bar');
                const valueSpan = bar.querySelector('span');
                
                if (barElement && valueSpan) {
                    // Animate bar height
                    setTimeout(() => {
                        barElement.style.height = `${percentage}%`;
                    }, index * 100);
                    
                    // Update value
                    valueSpan.textContent = `${value}M tons`;
                }
            }
        });
    },

    // Update region chart for different year
    updateRegionChart: function(year) {
        this.renderRegionChart();
        
        // Add visual feedback
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.style.opacity = '0.7';
            setTimeout(() => {
                chartContainer.style.opacity = '1';
            }, 300);
        }
    },

    // Render device category chart (pie chart simulation)
    renderDeviceCategoryChart: function() {
        const legend = document.querySelector('.pie-legend');
        if (!legend) return;

        const categories = this.data.deviceCategories;
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        const categoryNames = {
            smallIT: 'Small IT Equipment',
            largeEquipment: 'Large Equipment',
            temperatureExchange: 'Temperature Exchange',
            screensMonitors: 'Screens & Monitors',
            smallEquipment: 'Small Equipment'
        };

        legend.innerHTML = '';
        Object.entries(categories).forEach(([key, value], index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background: ${colors[index]};"></div>
                <span>${categoryNames[key]} (${value}%)</span>
            `;
            legend.appendChild(legendItem);
        });
    },

    // Render trends
    renderTrends: function() {
        const trendsGrid = document.querySelector('.trends-grid');
        if (!trendsGrid) return;

        // Clear existing trends (keep demo ones)
        const existingTrends = trendsGrid.querySelectorAll('.trend-card');
        existingTrends.forEach((card, index) => {
            if (index >= 4) {
                card.remove();
            }
        });

        // Animate existing trends
        existingTrends.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 150);
        });
    },

    // Render rankings
    renderRankings: function() {
        this.renderCountryRanking();
    },

    // Render country ranking
    renderCountryRanking: function() {
        const rankingList = document.querySelector('.ranking-list');
        if (!rankingList) return;

        // Clear existing rankings (keep demo ones)
        const existingRankings = rankingList.querySelectorAll('.ranking-item');
        existingRankings.forEach((item, index) => {
            if (index >= 5) {
                item.remove();
            }
        });

        // Animate existing rankings
        existingRankings.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 50);
            }, index * 100);
        });
    },

    // Switch ranking type
    switchRanking: function(rankingType) {
        // Update active tab
        const tabButtons = document.querySelectorAll('.rankings-tabs .tab-button');
        tabButtons.forEach(button => {
            button.classList.remove('active');
            if (button.textContent.toLowerCase().includes(rankingType.replace('generation', 'generation per capita'))) {
                button.classList.add('active');
            }
        });

        // Update ranking content
        const rankingContents = document.querySelectorAll('.ranking-content');
        rankingContents.forEach(content => {
            content.classList.remove('active');
        });

        const activeContent = document.getElementById(rankingType);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        this.currentRankingType = rankingType;
        
        // In a real app, would load different data based on ranking type
        EcoTech.Utils.showNotification(`Showing ${rankingType} rankings`, 'info');
    },

    // Render predictions
    renderPredictions: function() {
        const predictionCards = document.querySelectorAll('.prediction-card');
        
        predictionCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 100);
            }, index * 200);
        });
    },

    // Start real-time updates
    startRealTimeUpdates: function() {
        // Update stats every 30 seconds
        setInterval(() => {
            this.updateRealTimeStats();
        }, 30000);
    },

    // Update real-time stats
    updateRealTimeStats: function() {
        // Simulate small changes in global stats
        const variations = {
            totalEWaste: (Math.random() - 0.5) * 0.1,
            recyclingRate: (Math.random() - 0.5) * 0.2,
            lostValue: (Math.random() - 0.5) * 2
        };

        // Update main metric
        const mainValue = document.querySelector('.metric-value .number');
        if (mainValue) {
            const currentValue = parseFloat(mainValue.textContent);
            const newValue = currentValue + variations.totalEWaste;
            mainValue.textContent = newValue.toFixed(1);
        }

        // Update recycling rate
        const recyclingCard = document.querySelector('.metric-card h3');
        if (recyclingCard && recyclingCard.textContent.includes('%')) {
            const currentRate = parseFloat(recyclingCard.textContent);
            const newRate = Math.max(0, Math.min(100, currentRate + variations.recyclingRate));
            recyclingCard.textContent = `${newRate.toFixed(1)}%`;
        }

        // Add subtle visual feedback
        const keyMetrics = document.querySelector('.key-metrics');
        if (keyMetrics) {
            keyMetrics.style.opacity = '0.9';
            setTimeout(() => {
                keyMetrics.style.opacity = '1';
            }, 200);
        }
    },

    // Generate insights based on data
    generateInsights: function() {
        const insights = [];
        
        // Growth rate insight
        if (this.data.global.yearOverYearGrowth > 5) {
            insights.push({
                type: 'warning',
                title: 'Rapid Growth Alert',
                message: `E-waste generation is growing at ${this.data.global.yearOverYearGrowth}% annually, faster than recycling capacity.`
            });
        }

        // Recycling rate insight
        if (this.data.global.recyclingRate < 25) {
            insights.push({
                type: 'info',
                title: 'Recycling Opportunity',
                message: `Only ${this.data.global.recyclingRate}% of e-waste is properly recycled. Significant improvement potential exists.`
            });
        }

        // Regional insight
        const asiaShare = (this.data.regions[2024].asia / this.data.global.totalEWaste) * 100;
        if (asiaShare > 40) {
            insights.push({
                type: 'info',
                title: 'Regional Concentration',
                message: `Asia generates ${asiaShare.toFixed(1)}% of global e-waste, highlighting the need for regional solutions.`
            });
        }

        return insights;
    },

    // Export data for download
    exportData: function(format = 'json') {
        const exportData = {
            timestamp: new Date().toISOString(),
            global: this.data.global,
            regions: this.data.regions,
            deviceCategories: this.data.deviceCategories,
            trends: this.data.trends
        };

        if (format === 'json') {
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `ewaste-stats-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            EcoTech.Utils.showNotification('Statistics exported successfully!', 'success');
        }
    }
};

// Initialize stats page
function initializeStats() {
    Stats.init();
}

// Global function for ranking switching
window.showRanking = function(rankingType) {
    Stats.switchRanking(rankingType);
};

// Export stats functionality
window.Stats = Stats;

console.log('Global Statistics initialized');