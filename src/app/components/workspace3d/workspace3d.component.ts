import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DayData {
  date: string;
  level: number; // 0-4
  count: number;
}

@Component({
  selector: 'app-workspace3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="activity-section section-padding" id="activity">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">&lt;Activity /&gt;</span>
          <h2 class="section-title gradient-text">Coding Activity</h2>
          <p class="section-subtitle">My development consistency over the past year</p>
        </div>

        <div class="activity-card glass">
          <!-- Stats row -->
          <div class="activity-stats">
            <div class="stat-item">
              <span class="stat-value" style="color:#00d4ff">{{ totalContributions }}</span>
              <span class="stat-label">Total Contributions</span>
            </div>
            <div class="stat-item">
              <span class="stat-value" style="color:#28c840">{{ currentStreak }}</span>
              <span class="stat-label">Current Streak (days)</span>
            </div>
            <div class="stat-item">
              <span class="stat-value" style="color:#a855f7">{{ longestStreak }}</span>
              <span class="stat-label">Longest Streak (days)</span>
            </div>
            <div class="stat-item">
              <span class="stat-value" style="color:#ffd740">{{ avgPerDay }}</span>
              <span class="stat-label">Avg / Day</span>
            </div>
          </div>

          <!-- Heatmap grid -->
          <div class="heatmap-wrapper">
            <!-- Month labels -->
            <div class="month-labels">
              <span *ngFor="let month of monthLabels" class="month-label">{{ month }}</span>
            </div>

            <!-- Day labels + Grid -->
            <div class="heatmap-body">
              <div class="day-labels">
                <span></span>
                <span>Mon</span>
                <span></span>
                <span>Wed</span>
                <span></span>
                <span>Fri</span>
                <span></span>
              </div>
              <div class="heatmap-grid">
                <div *ngFor="let week of weeks" class="heatmap-week">
                  <div *ngFor="let day of week"
                       class="heatmap-cell"
                       [class]="'heatmap-cell level-' + day.level"
                       [title]="day.count + ' contributions on ' + day.date">
                  </div>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="heatmap-legend">
              <span class="legend-label">Less</span>
              <div class="legend-cell level-0"></div>
              <div class="legend-cell level-1"></div>
              <div class="legend-cell level-2"></div>
              <div class="legend-cell level-3"></div>
              <div class="legend-cell level-4"></div>
              <span class="legend-label">More</span>
            </div>
          </div>

          <!-- Recent activity feed -->
          <div class="recent-activity">
            <h4 class="activity-feed-title">Recent Activity</h4>
            <div class="feed-items">
              <div *ngFor="let item of recentActivity" class="feed-item">
                <span class="feed-icon">{{ item.icon }}</span>
                <div class="feed-content">
                  <span class="feed-text">{{ item.text }}</span>
                  <span class="feed-time">{{ item.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './workspace3d.component.scss',
})
export class Workspace3dComponent implements OnInit {
  weeks: DayData[][] = [];
  monthLabels: string[] = [];
  totalContributions = 0;
  currentStreak = 0;
  longestStreak = 0;
  avgPerDay = '';

  recentActivity = [
    { icon: '🔨', text: 'Pushed 4 commits to fintech-platform/frontend', time: '2 hours ago' },
    { icon: '🐛', text: 'Fixed critical rendering bug in document processor', time: '5 hours ago' },
    { icon: '✨', text: 'Added AI-powered form validation module', time: '1 day ago' },
    { icon: '📦', text: 'Released v2.4.0 of insurance underwriting app', time: '2 days ago' },
    { icon: '🔄', text: 'Migrated legacy module to Angular 19', time: '3 days ago' },
  ];

  ngOnInit(): void {
    this.generateHeatmapData();
  }

  private generateHeatmapData(): void {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);

    // Align to Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const allDays: DayData[] = [];
    let totalDays = 0;
    let total = 0;
    let streak = 0;
    let longest = 0;
    let currentStreakCount = 0;

    const current = new Date(startDate);
    while (current <= today) {
      const isWeekday = current.getDay() !== 0 && current.getDay() !== 6;
      const dayOfYear = Math.floor((current.getTime() - startDate.getTime()) / 86400000);

      // Simulate realistic coding pattern
      let count = 0;
      const rand = Math.random();
      if (isWeekday) {
        if (rand < 0.08) count = 0;
        else if (rand < 0.25) count = Math.floor(Math.random() * 3) + 1;
        else if (rand < 0.6) count = Math.floor(Math.random() * 5) + 3;
        else if (rand < 0.85) count = Math.floor(Math.random() * 6) + 6;
        else count = Math.floor(Math.random() * 8) + 10;
      } else {
        if (rand < 0.4) count = 0;
        else if (rand < 0.7) count = Math.floor(Math.random() * 3) + 1;
        else count = Math.floor(Math.random() * 4) + 3;
      }

      // Add bursts for project sprints (every ~6 weeks)
      if (dayOfYear % 42 < 7 && isWeekday) {
        count = Math.max(count, Math.floor(Math.random() * 6) + 8);
      }

      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 9) level = 3;
      else if (count > 9) level = 4;

      const dateStr = current.toISOString().split('T')[0];
      allDays.push({ date: dateStr, level, count });

      total += count;
      totalDays++;

      if (count > 0) {
        currentStreakCount++;
        longest = Math.max(longest, currentStreakCount);
      } else {
        currentStreakCount = 0;
      }

      current.setDate(current.getDate() + 1);
    }

    // Calculate current streak from end
    streak = 0;
    for (let i = allDays.length - 1; i >= 0; i--) {
      if (allDays[i].count > 0) streak++;
      else break;
    }

    this.totalContributions = total;
    this.currentStreak = streak;
    this.longestStreak = longest;
    this.avgPerDay = (total / totalDays).toFixed(1);

    // Group into weeks
    this.weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      this.weeks.push(allDays.slice(i, i + 7));
    }

    // Generate month labels
    this.monthLabels = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastMonth = -1;
    for (let w = 0; w < this.weeks.length; w++) {
      const firstDay = new Date(this.weeks[w][0].date);
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        this.monthLabels.push(months[month]);
        lastMonth = month;
      } else {
        this.monthLabels.push('');
      }
    }
  }
}
