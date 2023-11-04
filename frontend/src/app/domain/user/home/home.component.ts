import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MeService } from './me.service';
import { Me } from './me';
import { GetUserService } from './get-user.service';
import { User } from './user';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { GetLastWeekWorkoutsService } from './get-last-week-workouts.service';
import { FormatTimeService } from '../../../infrastructure/services/format-time.service';
import { LastWeekWorkout } from './last-week-workout';
import { GetTotalWeightOfWorkoutService } from './get-total-weight-of-workout.service';
import { GetTotalWeightMovedPerSessionService } from './get-total-weight-moved-per-session.service';
import { GetTotalRepsMovedPerSessionService } from './get-total-reps-moved-per-session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  private me = {} as Me;
  public user = {} as User;
  public title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData = {
    labels: [],
    datasets: [],
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Workouts',
        },
      },
    },
  };
  public lastWeekWorkouts = [] as LastWeekWorkout[];
  public selectedGraphFilter: number = 1;

  constructor(
    private meService: MeService,
    private getUserService: GetUserService,
    private getLastWeekWorkoutsService: GetLastWeekWorkoutsService,
    public formatTimeService: FormatTimeService,
    private getTotalWeightOfWorkoutService: GetTotalWeightOfWorkoutService,
    private getTotalWeightMovedPerSessionService: GetTotalWeightMovedPerSessionService,
    private getTotalRepsMovedPerSessionService: GetTotalRepsMovedPerSessionService
  ) {}

  public ngAfterViewInit(): void {
    this.meService.__invoke().subscribe({
      next: (me) => {
        this.me = me;
        this.getUser();
        this.getLastWeekWorkouts();
        this.getTotalWeightMovedPerSession();
      },
    });
  }

  public ngOnInit(): void {}

  private getUser(): void {
    this.getUserService.__invoke(this.me.id).subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  private getLastWeekWorkouts(): void {
    this.getLastWeekWorkoutsService.__invoke(this.me.id).subscribe({
      next: (workouts) => {
        this.lastWeekWorkouts = workouts;
        this.lastWeekWorkouts.forEach((workout) => {
          workout.showTotalExercises = false;
          this.getWorkoutVolume(workout);
        });
      },
    });
  }

  public getWorkoutDuration(workout: any): string {
    return this.formatTimeService.format(workout.duration);
  }

  public getHowManyDaysAgo(workout: LastWeekWorkout) {
    const today = new Date();
    const workoutDate = new Date(workout.startedAt);
    const differenceInDays =
      Math.abs(today.getTime() - workoutDate.getTime()) / (1000 * 3600 * 24);
    if (differenceInDays < 1) {
      return 'Today';
    } else if (differenceInDays < 2) {
      return 'Yesterday';
    }
    return Math.floor(differenceInDays) + ' days ago';
  }

  async getWorkoutVolume(workout: LastWeekWorkout) {
    await this.getTotalWeightOfWorkoutService
      .__invoke(workout.id)
      .then((volume) => {
        workout.volume = volume?.totalvolume as number;
      });
  }

  public toggleExercisesVisibility(workout: LastWeekWorkout): void {
    workout.showTotalExercises = !workout.showTotalExercises;
  }

  async getTotalWeightMovedPerSession() {
    const data = await this.getTotalWeightMovedPerSessionService.__invoke(
      this.me.id,
      7
    );
    if (data) {
      let datasets: number[] = [];
      data.forEach((item, index) => {
        datasets.push(item.totalweight);
      });

      this.barChartData = {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{ label: 'Total weight moved', data: datasets }],
      } as never;

      this.barChartOptions!.scales!['y'] = {
        beginAtZero: true,
        title: {
          display: true,
          text: '(kg)',
        },
      };
    }
  }

  async getTotalRepsMovedPerSession() {
    const data = await this.getTotalRepsMovedPerSessionService.__invoke(
      this.me.id,
      7
    );
    if (data) {
      let datasets: number[] = [];
      data.forEach((item, index) => {
        datasets.push(item.totalreps);
      });

      this.barChartData = {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{ label: 'Total reps moved', data: datasets }],
      } as never;

      this.barChartOptions!.scales!['y'] = {
        beginAtZero: true,
        title: {
          display: true,
          text: '(reps)',
        },
      };
    }
  }

  public setCurrentGraphFilter(filter: number) {
    this.selectedGraphFilter = filter;
    switch (filter) {
      case 1:
        this.getTotalWeightMovedPerSession();
        break;
      case 2:
        this.getTotalRepsMovedPerSession();
        break;
    }
  }

  public getLastWorkoutDate(): string {
    if (this.lastWeekWorkouts.length > 0) {
      const today = new Date();
      const workoutDate = new Date(this.lastWeekWorkouts[0].startedAt);
      const differenceInDays =
        Math.abs(today.getTime() - workoutDate.getTime()) / (1000 * 3600 * 24);
      if (differenceInDays < 1) {
        return 'today';
      } else if (differenceInDays < 2) {
        return 'yesterday';
      }
      return Math.floor(differenceInDays) + ' days ago';
    }
    return '';
  }
}
